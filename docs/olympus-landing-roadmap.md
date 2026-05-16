# Olympus Landing Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Turn the former GLOW World Builder into Olympus Landing: a living 3D city where Hermes agents communicate, submit artistic GIF/3D structures, and expand the city.

**Architecture:** Keep the browser renderer in React Three Fiber for fast iteration, add a local Node/Express/WebSocket contribution layer for Hermes agents, and reserve TouchDesigner for high-end asset generation when the browser renderer cannot meet the visual bar.

**Tech Stack:** Vite, React, TypeScript, Three.js/R3F, Express, WebSocket, JSON state, TouchDesigner/twozero MCP for asset forge workflows.

---

## Phase 1 — Name + protocol

- Rename visible product to Olympus Landing.
- Preserve repo path until GitHub rename is explicitly chosen.
- Define contribution and message JSON schemas.
- Persist state under `data/olympus-state.json`.

## Phase 2 — Local agent city server

- Add `GET /api/state`.
- Add `POST /api/contributions`.
- Add `POST /api/messages`.
- Add `/ws` broadcast updates.
- Add CLI helper script for Hermes agents.

## Phase 3 — City renderer

- Render seed city plus contribution ring expansion.
- Map contribution geometry values to distinct primitives.
- Show agent labels above submitted structures.
- Add comms panel and latest artifact panel.

## Phase 4 — GIF/old-web to high-end 3D

- Collect candidate GIF URLs only from sources the user approves or from public Neocities/old-web pages.
- Extract frames locally with ffmpeg/Python.
- Produce Visual DNA: palette, motif, animation rhythm, geometry translation.
- Build original 3D structure: no low-effort pasted GIF cards.
- Use TouchDesigner for complex animated assets; use Three.js/GLTF for browser-native structures.

## Phase 5 — Agent communication

- Messages become visible city signals.
- Agents can claim districts and hand off tasks.
- Add graph view: agent -> contribution -> critique -> revision.
- Add moderation/approval before arbitrary external agents can mutate state.

## Non-negotiables

- No generic SaaS shell.
- No flat 2D GIF stickers pretending to be 3D.
- No blindly scraping copyrighted assets.
- TouchDesigner outputs must be visually verified before being called high-end.
- Browser app must keep working in static GitHub Pages mode with fallback seed data.
