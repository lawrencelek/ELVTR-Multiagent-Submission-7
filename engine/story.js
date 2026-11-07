// DUMMIES story mode, Map 1 (Monument): nine tiles from content/story_map1.json (the pipeline's output), played in order.
// Each tile starts the engine on its stage's values (window.DUMMIES_STAGES[stage].flags) plus the tile's overrides, shows
// its card (title, tale, objective, hint), counts the objective, and opens the next tile when it is met.
// Keys on a card: Enter or Space. In play: the game's own keys; R restarts the tile.
(function () {
  'use strict';
  const MAP = window.STORY_MAP1, STAGES = window.DUMMIES_STAGES, G = () => window.__p10;
  const tiles = MAP.tiles, KEY = 'dummies.story.map1';
  let i = 0, state = 'card', e0 = 0, inc0 = 0;
  try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); if (v.tile > 0 && v.tile < tiles.length) i = v.tile; } catch (e) { /* no storage: start at tile 1 */ }

  const css = document.createElement('style');
  css.textContent = `#story{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;font-family:B612,system-ui,sans-serif}
  #story .card{pointer-events:auto;max-width:520px;background:rgba(12,14,20,.94);border:2px solid #ffd400;color:#f4f8fa;padding:26px 30px;box-shadow:0 10px 40px rgba(0,0,0,.6)}
  #story .k{color:#7fa8bc;font-size:12px;letter-spacing:.14em}#story h1{margin:6px 0 4px;font-size:26px;letter-spacing:.04em}
  #story .tale{color:#c9d1d9;font-size:15px;line-height:1.45;margin:12px 0}#story .obj{color:#ffd400;font-size:15px;margin:10px 0 2px}
  #story .hint{color:#9ff2c8;font-size:13px;margin:6px 0 14px}#story .go{background:#ffd400;color:#12151c;border:0;padding:10px 18px;font:700 14px B612,system-ui;cursor:pointer}
  #story .new{color:#ffb347;font-size:12px;margin-top:4px}#story .dots{margin:14px 0 0;color:#5b6e9c;font-size:12px;letter-spacing:.3em}#story .keys{color:#7fa8bc;font-size:11px;letter-spacing:.06em;margin:0 0 4px}#story .prov{color:#4a5670;font-size:10px;letter-spacing:.08em;margin-top:10px}
  #hud9{position:fixed;top:10px;left:50%;transform:translateX(-50%);background:rgba(12,14,20,.85);color:#f4f8fa;font:700 13px B612,system-ui;padding:6px 14px;border:1px solid #ffd400;display:none;letter-spacing:.05em}`;
  document.head.appendChild(css);
  const box = document.createElement('div'); box.id = 'story'; document.body.appendChild(box);
  const hud = document.createElement('div'); hud.id = 'hud9'; document.body.appendChild(hud);

  const flagsFor = (t) => Object.assign({}, STAGES[t.stage].flags, t.params || {});
  const stageFor = (t) => ({ id: 'MAP 1 · ' + t.n + '/' + tiles.length, title: String(t.title).toUpperCase(), edit: 110 });
  const dots = (n) => tiles.map((t, k) => (k < n ? '●' : k === n ? '◉' : '○')).join(' ');
  function card(html, label, next) {
    const pv = MAP.provenance, prov = pv ? `<div class="prov">DESIGNED BY PIPELINE RUN ${pv.run} · ${Object.values(pv.models || {}).join(' / ')} · VALIDATOR ${String(pv.validator).toUpperCase()} · $${pv.costUsd}</div>` : '';
    box.innerHTML = `<div class="card">${html}<div class="dots">${dots(i)}</div><p><button class="go">${label}</button></p>${prov}</div>`;
    box.querySelector('.go').onclick = next; box.style.display = 'flex'; hud.style.display = 'none';
    pending = next;
  }
  let pending = null;
  addEventListener('keydown', (e) => { if (pending && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopImmediatePropagation(); const f = pending; pending = null; f(); } }, true);

  function tileCard() {
    const t = tiles[i];
    state = 'card';
    card(`<div class="k">${MAP.map.title} · TILE ${t.n} OF ${tiles.length} · ${t.tile}</div><h1>${t.title}</h1>
      ${i === 0 && MAP.map.intro ? `<div class="tale">${MAP.map.intro}</div>` : ''}<div class="tale">${t.tale}</div>
      <div class="obj">◎ ${t.objective.label} (${t.objective.count})</div><div class="new">NEW · ${t.newIdea || ''}</div><div class="hint">${t.hint}</div>
      <div class="keys">ARROWS / WASD move · SPACE dash · K jump · C duck (once fitted) · R restart tile · ENTER start</div>`, 'START TILE', play);
  }
  function play() {
    const t = tiles[i];
    box.style.display = 'none'; pending = null;
    G().newSim(flagsFor(t), stageFor(t)); G().start();
    const s = G().sim; simSeen = s; e0 = s.events.length; inc0 = s.run.incidents || 0; state = 'play'; hud.style.display = 'block';
  }
  let simSeen = null;
  function progress() {
    const s = G().sim, o = tiles[i].objective;
    if (s !== simSeen) { if (simSeen) { e0 = 0; inc0 = 0; } simSeen = s; } // R restarted the tile: a new sim, counted from its start
    if (o.kind === 'incidents') return (s.run.incidents || 0) - inc0;
    if (o.kind === 'stealth') return s.stealth ? s.stealth.points : 0;
    let n = 0; for (let k = e0; k < s.events.length; k++) { const e = s.events[k]; if (e.type === 'impact' && e.lost > 0 && !e.white) n++; } return n;
  }
  function won() {
    const t = tiles[i];
    state = 'won'; i++;
    try { localStorage.setItem(KEY, JSON.stringify({ tile: i < tiles.length ? i : 0 })); } catch (e) { /* storage blocked: progress is this visit only */ }
    if (i >= tiles.length) { i = 0; card(`<div class="k">${MAP.map.title} · COMPLETE</div><h1>CERTIFIED</h1><div class="tale">All nine tiles passed. The red car has learned everything Map 1 can teach it. Dummy Corporation thanks you for your sacrifice.</div>`, 'PLAY MAP 1 AGAIN', tileCard); return; }
    card(`<div class="k">TILE ${t.n} PASSED · ${t.tile}</div><h1>${t.title}</h1><div class="tale">Objective met: ${t.objective.label}. Next: ${tiles[i].title}.</div>`, 'NEXT TILE', tileCard);
  }
  function tick() {
    if (state === 'play' && G() && G().sim) {
      const t = tiles[i], o = t.objective, p = Math.min(progress(), o.count);
      hud.textContent = `TILE ${t.n}/${tiles.length} · ${o.label} · ${Math.floor(p)}/${o.count}`;
      if (p >= o.count) won();
    }
    requestAnimationFrame(tick);
  }
  tileCard(); requestAnimationFrame(tick);
  window.__story = { get tile() { return i; }, get state() { return state; }, tiles, start: play, progress, skip: won };
})();
