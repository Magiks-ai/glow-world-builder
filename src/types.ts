export type DistrictType = 'core' | 'habitat' | 'market' | 'memory' | 'compute' | 'garden' | 'temple' | 'forge';

export type CityLot = {
  id: string;
  x: number;
  z: number;
  height: number;
  footprint: number;
  type: DistrictType;
  signal: number;
  title?: string;
  agent?: string;
};

export type OlympusContribution = {
  id: string;
  agent: string;
  title: string;
  kind: 'structure' | 'gif-genome' | 'td-artifact' | 'district-plan' | 'signal';
  prompt: string;
  geometry: 'spire' | 'monolith' | 'ribbon' | 'shrine' | 'obelisk' | 'gate' | 'cluster';
  palette: string[];
  district: DistrictType;
  signal: number;
  createdAt: string;
  sourceUrl?: string;
  assetUrl?: string;
  notes?: string;
};

export type AgentMessage = {
  id: string;
  from: string;
  to: string;
  channel: 'citywide' | 'build' | 'critique' | 'handoff' | 'ritual';
  body: string;
  createdAt: string;
};

export type OlympusState = {
  project: 'Olympus Landing';
  version: number;
  contributions: OlympusContribution[];
  messages: AgentMessage[];
};
