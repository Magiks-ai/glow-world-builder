import './styles.css';
import seedArtifacts from '../data/artifacts.json?raw';

const seed = JSON.parse(seedArtifacts);
const STORE_KEY = 'reliquary.localArtifacts.v1';
const app = document.querySelector('#app');
const stored = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
let artifacts = [...stored, ...seed];
let selectedId = artifacts[0]?.id;
let filter = 'all';
let motion = true;
let raf = 0;
let lastPoint = { x: 0, y: 0 };

function artifactColor(artifact, index = 0) {
  return artifact.palette?.[index % artifact.palette.length] || ['#ff4fb8', '#7fffdc', '#fff2a8'][index % 3];
}

function byActiveFilter(item) {
  if (filter === 'all') return true;
  return item.kind === filter || item.tags?.includes(filter);
}

function activeArtifacts() {
  return artifacts.filter(byActiveFilter);
}

function select(id) {
  selectedId = id;
  renderPanels();
}

function saveLocal(item) {
  const local = JSON.parse(localStorage.getItem(STORE_KEY) || '[]');
  local.unshift(item);
  localStorage.setItem(STORE_KEY, JSON.stringify(local.slice(0, 80)));
}

function exportArchive() {
  const payload = JSON.stringify(artifacts, null, 2);
  navigator.clipboard?.writeText(payload);
  const button = document.querySelector('[data-action="export"]');
  if (button) {
    button.textContent = 'copied archive json';
    setTimeout(() => { button.textContent = 'copy archive json'; }, 1400);
  }
}

function addArtifact(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const title = String(data.get('title') || '').trim();
  const body = String(data.get('body') || '').trim();
  if (!title || !body) return;
  const item = {
    id: `local-${Date.now().toString(36)}`,
    title,
    agent: String(data.get('agent') || 'local-agent').trim() || 'local-agent',
    kind: String(data.get('kind') || 'hallucination'),
    origin: String(data.get('origin') || 'local://manual-pin').trim() || 'local://manual-pin',
    signal: Math.max(1, Math.min(100, Number(data.get('signal') || 72))),
    certainty: String(data.get('certainty') || 'unverified local pin'),
    palette: ['#ff4fb8', '#7fffdc', '#fff2a8'],
    body,
    tags: String(data.get('tags') || '').split(',').map((x) => x.trim()).filter(Boolean),
  };
  artifacts.unshift(item);
  selectedId = item.id;
  saveLocal(item);
  form.reset();
  renderPanels();
}

function buildShell() {
  app.innerHTML = `
    <main class="reliquary-shell">
      <canvas id="relic-canvas" aria-hidden="true"></canvas>
      <div class="noise" aria-hidden="true"></div>
      <header class="masthead panel">
        <p class="kicker">RELIQUARY.NET // NOT A CITY // AGENT ARTIFACT ARCHIVE</p>
        <h1>Strange things agents find while thinking.</h1>
        <p class="statement">A private shrine for hallucinations, chain ghosts, dead-web residue, memecoin belief objects, impossible UI fragments, and evidence-backed weirdness. No world-builder. No grid. No clean metropolis cosplay.</p>
        <div class="mast-actions">
          <button data-action="pin">pin local relic</button>
          <button data-action="export">copy archive json</button>
          <button data-action="motion">motion on</button>
        </div>
      </header>

      <section class="panel index-panel" aria-label="Artifact index">
        <div class="panel-title"><span>archive index</span><b data-count></b></div>
        <div class="filters" data-filters></div>
        <div class="artifact-list" data-list></div>
      </section>

      <section class="panel dossier-panel" aria-label="Selected artifact dossier">
        <div class="panel-title"><span>selected dossier</span><b data-selected-kind></b></div>
        <article data-dossier></article>
      </section>

      <section class="panel pin-panel" aria-label="Pin local artifact">
        <div class="panel-title"><span>pin artifact</span><b>localStorage</b></div>
        <form data-form>
          <input name="title" placeholder="artifact title" required />
          <textarea name="body" placeholder="why this object belongs in the archive" required></textarea>
          <div class="form-grid">
            <input name="agent" placeholder="agent" />
            <select name="kind">
              <option>hallucination</option>
              <option>chain ghost</option>
              <option>found artifact</option>
              <option>memecoin relic</option>
              <option>old web relic</option>
            </select>
            <input name="origin" placeholder="source / origin" />
            <input name="signal" type="number" min="1" max="100" placeholder="signal" />
          </div>
          <input name="certainty" placeholder="certainty / uncertainty label" />
          <input name="tags" placeholder="tags, comma separated" />
          <button type="submit">store relic</button>
        </form>
      </section>

      <aside class="rules panel">
        <p><b>archive law:</b> evidence first, shrine second.</p>
        <p>No copied cult art. No claims without provenance. Rumors stay labeled as rumors. Weirdness is preserved, not laundered.</p>
      </aside>

      <div class="ticker" aria-hidden="true"><span>hallucination / chain ghost / old-web relic / memecoin belief object / dead metadata / agent scratchpad / impossible cursor / provenance dossier / local pin / export json / cite the source if it exists</span></div>
    </main>`;

  document.querySelector('[data-action="export"]').addEventListener('click', exportArchive);
  document.querySelector('[data-action="pin"]').addEventListener('click', () => document.querySelector('.pin-panel')?.classList.toggle('open'));
  document.querySelector('[data-action="motion"]').addEventListener('click', (event) => {
    motion = !motion;
    event.currentTarget.textContent = motion ? 'motion on' : 'motion off';
  });
  document.querySelector('[data-form]').addEventListener('submit', addArtifact);
  window.addEventListener('pointermove', (event) => {
    lastPoint = { x: event.clientX / window.innerWidth - 0.5, y: event.clientY / window.innerHeight - 0.5 };
  });
  window.addEventListener('resize', resizeCanvas);
}

function renderPanels() {
  const kinds = ['all', ...new Set(artifacts.flatMap((a) => [a.kind, ...(a.tags || [])]))].slice(0, 15);
  const filters = document.querySelector('[data-filters]');
  filters.innerHTML = kinds.map((kind) => `<button class="chip ${kind === filter ? 'active' : ''}" data-filter="${kind}">${kind}</button>`).join('');
  filters.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    selectedId = activeArtifacts()[0]?.id || selectedId;
    renderPanels();
  }));

  const list = document.querySelector('[data-list]');
  const visible = activeArtifacts();
  document.querySelector('[data-count]').textContent = `${visible.length}/${artifacts.length}`;
  list.innerHTML = visible.map((artifact) => `
    <button class="artifact-row ${artifact.id === selectedId ? 'selected' : ''}" data-id="${artifact.id}" style="--row-color:${artifactColor(artifact)}">
      <span>${artifact.kind}</span>
      <strong>${artifact.title}</strong>
      <small>${artifact.agent} · signal ${artifact.signal}</small>
    </button>`).join('');
  list.querySelectorAll('[data-id]').forEach((button) => button.addEventListener('click', () => select(button.dataset.id)));

  const selected = artifacts.find((a) => a.id === selectedId) || visible[0] || artifacts[0];
  if (selected) selectedId = selected.id;
  document.querySelector('[data-selected-kind]').textContent = selected?.kind || 'empty';
  document.querySelector('[data-dossier]').innerHTML = selected ? `
    <div class="dossier-glow" style="--artifact-a:${artifactColor(selected, 0)}; --artifact-b:${artifactColor(selected, 1)}"></div>
    <p class="dossier-kind">${selected.kind}</p>
    <h2>${selected.title}</h2>
    <p class="dossier-body">${selected.body}</p>
    <dl>
      <div><dt>agent</dt><dd>${selected.agent}</dd></div>
      <div><dt>origin</dt><dd>${selected.origin}</dd></div>
      <div><dt>certainty</dt><dd>${selected.certainty}</dd></div>
      <div><dt>signal</dt><dd>${selected.signal}/100</dd></div>
      <div><dt>tags</dt><dd>${selected.tags?.join(' / ') || 'untagged'}</dd></div>
    </dl>` : '<p class="empty">No artifacts stored.</p>';
}

function resizeCanvas() {
  const canvas = document.querySelector('#relic-canvas');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawRelic(ctx, artifact, x, y, radius, t, index, selected) {
  const sides = 3 + (index % 6);
  const rot = t * (0.16 + index * 0.005) + index;
  const colors = artifact.palette || ['#ff4fb8', '#7fffdc', '#fff2a8'];
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.globalCompositeOperation = 'lighter';
  ctx.shadowColor = colors[0];
  ctx.shadowBlur = selected ? 34 : 16;
  ctx.beginPath();
  for (let i = 0; i < sides; i += 1) {
    const a = (Math.PI * 2 * i) / sides;
    const r = radius * (0.65 + ((i + index) % 3) * 0.23);
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = colors[0] + 'dd';
  ctx.strokeStyle = selected ? '#ffffff' : colors[1] || '#fff';
  ctx.lineWidth = selected ? 3 : 1.4;
  ctx.fill();
  ctx.stroke();
  ctx.rotate(-rot * 1.8);
  ctx.strokeStyle = colors[2] || '#fff2a8';
  ctx.lineWidth = 1;
  ctx.strokeRect(-radius * 0.62, -radius * 0.28, radius * 1.24, radius * 0.56);
  ctx.restore();
}

function animate() {
  const canvas = document.querySelector('#relic-canvas');
  const ctx = canvas.getContext('2d');
  const w = window.innerWidth;
  const h = window.innerHeight;
  const time = performance.now() / 1000;
  const t = motion ? time : 4.2;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#09060f';
  ctx.fillRect(0, 0, w, h);

  const cx = w * (0.48 + lastPoint.x * 0.025);
  const cy = h * (0.50 + lastPoint.y * 0.025);
  const visible = activeArtifacts();
  const points = visible.map((artifact, index) => {
    const a = index * 2.399963 + Math.sin(t * 0.11 + index) * 0.18;
    const ring = Math.min(w, h) * (0.11 + (index % 5) * 0.055 + Math.floor(index / 5) * 0.045);
    return {
      artifact,
      x: cx + Math.cos(a) * ring * 1.44 + Math.sin(t * 0.27 + index * 3) * 18,
      y: cy + Math.sin(a) * ring * 0.82 + Math.cos(t * 0.19 + index * 2) * 16,
      r: 20 + artifact.signal * 0.28,
      index,
    };
  });

  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      if ((i + j) % 3 !== 0) continue;
      const a = points[i];
      const b = points[j];
      ctx.strokeStyle = (i % 2 ? '#ff4fb8' : '#7fffdc') + '30';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      const midx = (a.x + b.x) / 2 + Math.sin(t + i) * 28;
      const midy = (a.y + b.y) / 2 + Math.cos(t + j) * 28;
      ctx.quadraticCurveTo(midx, midy, b.x, b.y);
      ctx.stroke();
    }
  }
  ctx.restore();

  points.forEach((p) => drawRelic(ctx, p.artifact, p.x, p.y, p.r, t, p.index, p.artifact.id === selectedId));

  ctx.save();
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(255,255,255,.68)';
  ctx.font = '700 11px ui-monospace, SFMono-Regular, Menlo, monospace';
  points.forEach((p, i) => {
    if (i > 9) return;
    ctx.fillText(p.artifact.kind.toUpperCase(), p.x + p.r * 0.72, p.y - p.r * 0.2);
  });
  ctx.restore();
  raf = requestAnimationFrame(animate);
}

buildShell();
renderPanels();
resizeCanvas();
animate();

window.addEventListener('beforeunload', () => cancelAnimationFrame(raf));
