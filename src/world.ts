export type DistrictType = 'core' | 'habitat' | 'market' | 'memory' | 'compute' | 'garden';

export type CityLot = {
  id: string;
  x: number;
  z: number;
  height: number;
  footprint: number;
  type: DistrictType;
  signal: number;
};

export type AgentRoute = {
  id: string;
  role: string;
  color: string;
  points: [number, number, number][];
};

const types: DistrictType[] = ['core', 'habitat', 'market', 'memory', 'compute', 'garden'];

export const districtPalette: Record<DistrictType, string> = {
  core: '#f7f2ff',
  habitat: '#6cf7ff',
  market: '#ff4fd8',
  memory: '#a66cff',
  compute: '#4dff9a',
  garden: '#e2ff55',
};

function hash(n: number) {
  return Math.abs(Math.sin(n * 92821.73) * 43758.5453123) % 1;
}

export function generateCity(seed = 64): CityLot[] {
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
      lots.push({
        id: `lot-${i}`,
        x: gx * 1.6,
        z: gz * 1.6,
        footprint: 0.65 + hash(seed + i * 4.1) * 0.55,
        height: 0.35 + radial * 5.8 + n * 3.6,
        type,
        signal: Math.round((radial * 0.65 + n * 0.35) * 100),
      });
      i += 1;
    }
  }
  return lots;
}

export const agentRoutes: AgentRoute[] = [
  {
    id: 'cartographer',
    role: 'Cartographer Agent',
    color: '#6cf7ff',
    points: [[-10, 0.32, -8], [-4, 0.55, -2], [0, 0.8, 0], [6, 0.45, 4], [10, 0.32, 8]],
  },
  {
    id: 'zoning',
    role: 'Zoning Agent',
    color: '#ff4fd8',
    points: [[-8, 0.45, 7], [-2, 1.0, 5], [3, 0.85, 1], [8, 0.4, -6]],
  },
  {
    id: 'memory',
    role: 'Memory/Knowledge Agent',
    color: '#a66cff',
    points: [[8, 0.5, 8], [4, 1.2, 1], [0, 1.8, 0], [-5, 0.9, -4], [-9, 0.4, -7]],
  },
];
