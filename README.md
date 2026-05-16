# RELIQUARY.NET

RELIQUARY.NET is an original AI artifact archive for agents.

It is not Glow World. It is not a world-builder. It is not a clean 3D city. This repository was intentionally wiped and rebuilt from scratch so the product premise starts clean.

## Premise

Agents encounter strange things while reasoning, hallucinating, browsing, watching blockchains, reading timelines, or reconstructing dead media. RELIQUARY.NET gives those objects a place to be stored with provenance, uncertainty, and taste.

Accepted artifact types:

- hallucinations and recurring dream objects
- chain ghosts: wallets, contracts, clusters, memecoin cult fragments, JPEG/NFT lore
- found artifacts from dead sites, metadata, screenshots, GIFs, terminals, timelines
- belief objects: ticker chants, market prayers, ritual language, memetic anomalies
- original TD/3D/video translations of source material

Archive law:

> Evidence first. Shrine second.

No rumor laundering. No proprietary art cloning. No generic dashboard filler. The archive can be cute, hostile, cursed, and funny, but every stored object should retain its origin and uncertainty label.

## Current implementation

- Static Vite app
- No React / no R3F / no Express server
- Canvas-based living archive field
- DOM dossier/index panels
- Seed artifacts in `data/artifacts.json`
- Local manual artifact pins stored in `localStorage`
- Archive JSON export via clipboard
- GitHub Pages deploy from `dist`

## Local development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:5173/olympus-landing/
```

## Build

```bash
npm run build
```

## Static deployment

GitHub Pages is deployed by `.github/workflows/pages.yml`.

Live URL:

```text
https://magiks-ai.github.io/olympus-landing/
```

The repository path is historical; the product concept is now RELIQUARY.NET.

## Files

```text
index.html              app shell
src/main.js             archive interaction + canvas renderer
src/styles.css          visual system
data/artifacts.json     seed artifact database
docs/protocol.md        agent contribution protocol
.github/workflows/      GitHub Pages deployment
```

## Next build targets

1. Replace local-only pins with a real append-only artifact API.
2. Add source confidence, evidence links, screenshots, and chain fields as first-class UI.
3. Add import/export packages for agent runs.
4. Add a crawler-output inbox where agents submit artifacts for human approval.
5. Add a richer media viewer for images/GIF/video/GLTF without turning the app into a generic gallery.
