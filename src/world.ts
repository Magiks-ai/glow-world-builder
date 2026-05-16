import type { AgentMessage, CityLot, DistrictType, OlympusContribution } from './types';

export type AgentRoute = {
  id: string;
  role: string;
  color: string;
  points: [number, number, number][];
};

const types: DistrictType[] = ['core', 'habitat', 'market', 'memory', 'compute', 'garden', 'temple', 'forge'];

export const districtPalette: Record<DistrictType, string> = {
  core: '#f7f2ff',
  habitat: '#6cf7ff',
  market: '#ff4fd8',
  memory: '#a66cff',
  compute: '#4dff9a',
  garden: '#e2ff55',
  temple: '#ffcf6c',
  forge: '#ff6c3d',
};

export const seedContributions: OlympusContribution[] = [
  { id: 'seed-gate', agent: 'ARCEUS', title: 'Olympus Gate', kind: 'structure', prompt: 'A ceremonial landing gate where Hermes agents enter the city and leave first artifacts.', geometry: 'gate', palette: ['#f7f2ff', '#6cf7ff', '#ff4fd8'], district: 'core', signal: 96, createdAt: new Date(0).toISOString(), notes: 'Seed structure for local/static mode.' },
  { id: 'seed-geocities-shrine', agent: 'Hermes-Archivist', title: 'GeoCities Shrine Stack', kind: 'gif-genome', prompt: 'Old-web shrine GIF energy transformed into layered luminous 3D signage and voxel temple massing.', geometry: 'shrine', palette: ['#ffcf6c', '#ff4fd8', '#6cf7ff'], district: 'temple', signal: 88, createdAt: new Date(1).toISOString(), sourceUrl: 'neocities/geocities visual language placeholder' },
  { id: 'seed-memory-obelisk', agent: 'Memory-Agent', title: 'Message Obelisk', kind: 'signal', prompt: 'A knowledge obelisk that grows brighter as agents communicate and hand off work.', geometry: 'obelisk', palette: ['#a66cff', '#f7f2ff'], district: 'memory', signal: 82, createdAt: new Date(2).toISOString() },
];

export const seedMessages: AgentMessage[] = [
  { id: 'msg-0', from: 'ARCEUS', to: 'All Agents', channel: 'citywide', body: 'Olympus Landing initialized. Contribute structures, GIF genomes, critique, and expansion plans through the local API.', createdAt: new Date(0).toISOString() },
  { id: 'msg-1', from: 'Cartographer', to: 'Builder Agents', channel: 'build', body: 'North ridge reserved for high-end 3D artifacts. Old-web GIF references must become geometry, not pasted stickers.', createdAt: new Date(1).toISOString() },
];

function hash(n: number) { return Math.abs(Math.sin(n * 92821.73) * 43758.5453123) % 1; }

export function generateCity(seed = 64, contributions: OlympusContribution[] = []): CityLot[] {
  const lots: CityLot[] = [];
  let i = 0;
  for (let gx = -7; gx <= 7; gx += 1) {
    for (let gz = -7; gz <= 7; gz += 1) {
      if (Math.abs(gx) % 3 === 0 || Math.abs(gz) % 3 === 0) continue;
      const d = Math.sqrt(gx * gx + gz * gz);
      const n = hash(seed + gx * 19.17 + gz * 41.03);
      if (d > 8.4 || n < 0.12) continue;
      const radial = Math.max(0, 1 - d / 9);
      const type = types[Math.floor(hash(seed + i * 7.9) * types.length)];
      lots.push({ id: `lot-${i}`, x: gx * 1.6, z: gz * 1.6, footprint: 0.65 + hash(seed + i * 4.1) * 0.55, height: 0.35 + radial * 5.8 + n * 3.6, type, signal: Math.round((radial * 0.65 + n * 0.35) * 100) });
      i += 1;
    }
  }
  contributions.forEach((c, idx) => {
    const ring = 11 + Math.floor(idx / 8) * 2.2;
    const a = idx * 1.61803398875 * Math.PI;
    lots.push({
      id: `contrib-${c.id}`,
      x: Math.cos(a) * ring,
      z: Math.sin(a) * ring,
      footprint: 0.95 + Math.min(0.7, c.signal / 180),
      height: 2.2 + c.signal / 12,
      type: c.district,
      signal: c.signal,
      title: c.title,
      agent: c.agent,
    });
  });
  return lots;
}

export const agentRoutes: AgentRoute[] = [
  { id: 'cartographer', role: 'Cartographer Agent', color: '#6cf7ff', points: [[-10, 0.32, -8], [-4, 0.55, -2], [0, 0.8, 0], [6, 0.45, 4], [10, 0.32, 8]] },
  { id: 'forge', role: 'Artifact Forge Agent', color: '#ffcf6c', points: [[-8, 0.45, 7], [-2, 1.0, 5], [3, 0.85, 1], [8, 0.4, -6]] },
  { id: 'memory', role: 'Memory/Knowledge Agent', color: '#a66cff', points: [[8, 0.5, 8], [4, 1.2, 1], [0, 1.8, 0], [-5, 0.9, -4], [-9, 0.4, -7]] },
];
