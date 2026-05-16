# GLOW World Builder

AI-agent neocity / geo-city builder prototype.

This repo is being repurposed into a browser-native 3D city/world builder where autonomous agents can generate districts, inspect geometry, route tasks through a living city graph, and eventually export scenes/data.

## Current prototype

- React + Vite + Three.js / React Three Fiber
- Procedural neon geo-city grid
- Signal-weighted towers by district type
- Agent route overlays for cartography, zoning, and memory/knowledge agents
- Click-to-inspect district telemetry HUD
- Styled as a dark cyber/geo-city operator console, not generic SaaS

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Direction

Next build steps:

1. Prompt-to-city generator panel.
2. Real builder controls: add/delete/extrude/re-zone lots.
3. Agent task graph: agents claim city sectors and leave visible traces.
4. Persistence: save/load city JSON.
5. Export: GeoJSON/GLTF snapshots for downstream agents/tools.
