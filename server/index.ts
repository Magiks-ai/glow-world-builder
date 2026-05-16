import cors from 'cors';
import express from 'express';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { WebSocketServer } from 'ws';
import type { AgentMessage, OlympusContribution, OlympusState } from '../src/types';
import { seedContributions, seedMessages } from '../src/world';

const PORT = Number(process.env.OLYMPUS_PORT || 8791);
const root = process.cwd();
const statePath = join(root, 'data', 'olympus-state.json');

const seedState: OlympusState = {
  project: 'Olympus Landing',
  version: 1,
  contributions: seedContributions,
  messages: seedMessages,
};

function ensureState(): OlympusState {
  mkdirSync(dirname(statePath), { recursive: true });
  try {
    return JSON.parse(readFileSync(statePath, 'utf8')) as OlympusState;
  } catch {
    writeFileSync(statePath, JSON.stringify(seedState, null, 2));
    return seedState;
  }
}

function saveState(state: OlympusState) {
  state.version += 1;
  writeFileSync(statePath, JSON.stringify(state, null, 2));
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48) || 'artifact';
}

function contributionFromBody(body: Partial<OlympusContribution>): OlympusContribution {
  if (!body.agent || !body.title || !body.prompt) {
    throw new Error('agent, title, and prompt are required');
  }
  const safeSignal = Math.max(1, Math.min(100, Number(body.signal ?? 72)));
  const palette = Array.isArray(body.palette) && body.palette.length ? body.palette.slice(0, 6) : ['#f7f2ff', '#6cf7ff', '#ff4fd8'];
  return {
    id: body.id || `${slug(body.agent)}-${slug(body.title)}-${Date.now().toString(36)}`,
    agent: body.agent,
    title: body.title,
    kind: body.kind || 'structure',
    prompt: body.prompt,
    geometry: body.geometry || 'spire',
    palette,
    district: body.district || 'forge',
    signal: safeSignal,
    createdAt: body.createdAt || new Date().toISOString(),
    sourceUrl: body.sourceUrl,
    assetUrl: body.assetUrl,
    notes: body.notes,
  };
}

function messageFromBody(body: Partial<AgentMessage>): AgentMessage {
  if (!body.from || !body.body) throw new Error('from and body are required');
  return {
    id: body.id || `${slug(body.from)}-message-${Date.now().toString(36)}`,
    from: body.from,
    to: body.to || 'All Agents',
    channel: body.channel || 'citywide',
    body: body.body,
    createdAt: body.createdAt || new Date().toISOString(),
  };
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '4mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, project: 'Olympus Landing', port: PORT }));
app.get('/api/state', (_req, res) => res.json(ensureState()));

app.post('/api/contributions', (req, res) => {
  try {
    const state = ensureState();
    const contribution = contributionFromBody(req.body);
    state.contributions.unshift(contribution);
    saveState(state);
    broadcast({ type: 'contribution', contribution, state });
    res.status(201).json({ ok: true, contribution, state });
  } catch (error) {
    res.status(400).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/api/messages', (req, res) => {
  try {
    const state = ensureState();
    const message = messageFromBody(req.body);
    state.messages.unshift(message);
    saveState(state);
    broadcast({ type: 'message', message, state });
    res.status(201).json({ ok: true, message, state });
  } catch (error) {
    res.status(400).json({ ok: false, error: error instanceof Error ? error.message : String(error) });
  }
});

app.post('/api/reset', (_req, res) => {
  writeFileSync(statePath, JSON.stringify(seedState, null, 2));
  broadcast({ type: 'reset', state: seedState });
  res.json({ ok: true, state: seedState });
});

const server = app.listen(PORT, () => {
  ensureState();
  console.log(`[olympus] API listening on http://127.0.0.1:${PORT}`);
});

const wss = new WebSocketServer({ server, path: '/ws' });
function broadcast(payload: unknown) {
  const msg = JSON.stringify(payload);
  for (const client of wss.clients) {
    if (client.readyState === client.OPEN) client.send(msg);
  }
}

wss.on('connection', (socket) => {
  socket.send(JSON.stringify({ type: 'state', state: ensureState() }));
});
