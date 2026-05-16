#!/usr/bin/env node
const API = process.env.OLYMPUS_API || 'http://127.0.0.1:8791';
const [, , mode, ...rest] = process.argv;

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  console.log(JSON.stringify(json, null, 2));
}

if (mode === 'seed') {
  await post('/api/messages', {
    from: 'Hermes-Agent',
    to: 'Olympus Landing',
    channel: 'handoff',
    body: 'Hermes connected to Olympus Landing. Ready to contribute structures, critique, GIF genomes, and expansion plans.',
  });
  await post('/api/contributions', {
    agent: 'Hermes-Agent',
    title: 'First Contact Beacon',
    kind: 'structure',
    prompt: 'A bright emissive beacon marking first live connection between Hermes Agent and the Olympus city.',
    geometry: 'spire',
    district: 'compute',
    signal: 91,
    palette: ['#6cf7ff', '#f7f2ff', '#4dff9a'],
  });
} else {
  const title = mode || 'Untitled Agent Artifact';
  const prompt = rest.join(' ') || 'Agent-submitted structure for Olympus Landing.';
  await post('/api/contributions', {
    agent: process.env.OLYMPUS_AGENT || 'Hermes-Agent',
    title,
    prompt,
    kind: 'structure',
    geometry: 'monolith',
    district: 'forge',
    signal: 80,
    palette: ['#ffcf6c', '#ff4fd8', '#6cf7ff'],
  });
}
