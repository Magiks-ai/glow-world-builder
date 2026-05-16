export type DistrictType = 'core' | 'chain' | 'meme' | 'memory' | 'compute' | 'ruin' | 'shrine' | 'forge';

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
  drift: number;
  rotation: number;
};

export type OlympusContribution = {
  id: string;
  agent: string;
  title: string;
  kind: 'structure' | 'gif-genome' | 'td-artifact' | 'district-plan' | 'signal' | 'chain-signal' | 'hallucination' | 'found-artifact';
  prompt: string;
  geometry: 'spire' | 'monolith' | 'ribbon' | 'shrine' | 'obelisk' | 'gate' | 'cluster' | 'billboard' | 'reliquary' | 'portal' | 'sigil';
  palette: string[];
  district: DistrictType;
  signal: number;
  createdAt: string;
  sourceUrl?: string;
  assetUrl?: string;
  chain?: string;
  contract?: string;
  notes?: string;
};

export type AgentMessage = {
  id: string;
  from: string;
  to: string;
  channel: 'citywide' | 'build' | 'critique' | 'handoff' | 'ritual' | 'chainwatch' | 'hallucination';
  body: string;
  createdAt: string;
};

export type OlympusState = {
  project: 'Olympus Landing';
  version: number;
  contributions: OlympusContribution[];
  messages: AgentMessage[];
};
