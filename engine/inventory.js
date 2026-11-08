// Headless (node): an inventory of every tile in Prototype 9's three districts, for level design.
// Per tile: the plan's note and landmark; the ground roads (lanes, where they enter and leave, how they turn); decks, rings,
// walkways and their drop gaps; escalators and stairs; floors above the street; solids by kind (tall masses, low masses,
// planters, booths, walls, columns, sculptures, the monument); cone homes; spawns; water; Prototype 9's story task, gift and tale.
//   node engine/inventory.js > content/inventory_tiles.json      (python3 engine/build_p9.py --p11 writes the runtime)
const path = require('path'), fs = require('fs'), Module = require('module');
const E = path.join(__dirname, 'p9');
const res = Module._resolveFilename; Module._resolveFilename = function (req, parent, ...a) { if (req.startsWith('../p6/') || req.startsWith('../jump/')) req = path.join(E, path.basename(req)); return res.call(this, req, parent, ...a); };
const R = JSON.parse(fs.readFileSync(path.join(__dirname, '.cache', 'runtime_p11.json'), 'utf8'));
Object.assign(globalThis, { DUMMIES_STORY: R.story, DUMMIES_SIM: R.sim });
const X = globalThis.DUMMIES = require(path.join(E, 'sim.js'));
const W6 = globalThis.WORLD6 = require(path.join(E, 'world6.js'));
const STORY = require(path.join(E, 'story7.js')), P7 = STORY.P7SIM || {}; // the story's level rules: every highway a flight and a drop gap
const P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES, R.sim), W = P['world.width'], H = P['world.height'], JT = P['proto.art.jumpableTop'];
const rnd = (v) => Math.round(v), edgeOf = (q) => (q.x <= 8 ? 'W' : q.x >= W - 8 ? 'E' : q.y <= 8 ? 'N' : q.y >= H - 8 ? 'S' : 'in');
const count = (arr, f) => arr.reduce((a, q) => { const k = f(q); if (k) a[k] = (a[k] || 0) + 1; return a; }, {});
const story = {}; for (const d of JSON.parse(fs.readFileSync(path.join(E, 'story_v2.json'), 'utf8')).districts) story[d.id] = d; // Prototype 9's own tasks, gifts, tales
function lanesOf(sc) {
  const out = [];
  for (const p of (sc.main && sc.main.level && sc.main.level.lanes) || []) {
    if (!p || !(p.length > 0)) continue;
    let s0 = null, s1 = null; for (let s = 0; s <= p.length; s += 8) { const q = X.pathAt(p, s); if (q.x >= -1 && q.x <= W + 1 && q.y >= -1 && q.y <= H + 1) { if (s0 == null) s0 = s; s1 = s; } }
    if (s0 == null || s1 - s0 < 40) continue;
    const a = X.pathAt(p, s0), b = X.pathAt(p, s1); let turn = 0, h0 = Math.atan2(a.ty, a.tx);
    for (let s = s0 + 16; s <= s1; s += 16) { const q = X.pathAt(p, s), h = Math.atan2(q.ty, q.tx); let d = h - h0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; turn += d; h0 = h; }
    out.push({ from: edgeOf(a) + ' ' + rnd(a.x) + ',' + rnd(a.y), to: edgeOf(b) + ' ' + rnd(b.x) + ',' + rnd(b.y), len: rnd(s1 - s0), turn: rnd(turn * 180 / Math.PI) });
  }
  return out;
}
const out = { about: 'Prototype 9 tiles (engine/p9/world6.js), measured by engine/inventory.js. World units: a tile is ' + W + ' × ' + H + '. Tall masses block sight and walking; low masses (top ≤ proto.art.jumpableTop ' + JT + ') can be jumped.', districts: [] };
for (const id of W6.LEVEL_LIST) {
  const s = new W6.Sim6(id, Object.assign({}, P7, R.sim)), D = s.W6.D, st = story[id] || {}, d = { id, name: D.name, mood: D.mood, start: D.start, order: st.order || null, act: st.act || st.title || null, tiles: [] };
  for (const sc of s.W6.scs) {
    const g = sc.game, plan = D.tiles && D.tiles[sc.name] || [], tl = (st.tiles || {})[sc.name] || {};
    const masses = g.statics.filter((q) => q.kind === 'mass' || q.kind === 'block');
    const t = { tile: sc.name, note: plan[0] || sc.note, landmark: plan[1] || null, mode: plan[2] || null,
      roads: lanesOf(sc), ring: !!g.ring, split: !!(D.split && D.split.tile === sc.name), monument: g.statics.some((q) => q.kind === 'monument'),
      layers: sc.layers.map((l) => ({ kind: l.dk ? 'deck' : l.ring ? 'ring' : l.walk ? 'walkway' : 'layer', z: l.z, vertical: l.vert != null ? !!l.vert : null, dropGaps: (l.gapSpans || []).length, escalatorHeads: (l.openings || []).length, inBand: !!l.inBand })),
      floors: count(g.floors, (f) => f.kind + '@Z' + f.z + (f.drop ? '+drop' : '')),
      stairs: (g.stairs || []).map((q) => 'Z' + q.from + '→Z' + q.to + ' ' + q.axis + ' @' + rnd(q.x + q.w / 2) + ',' + rnd(q.y + q.h / 2)),
      solids: count(g.statics, (q) => (q.kind === 'mass' || q.kind === 'block') ? (q.ht != null && q.ht <= JT ? 'low mass' : 'tall mass') : q.kind === 'bound' ? null : q.kind),
      tallFootprint: rnd(masses.filter((q) => !(q.ht != null && q.ht <= JT)).reduce((a, q) => a + q.w * q.h, 0) / (W * H) * 100) + '%',
      coneHomes: (g.coneHomes || []).map((c) => rnd(c[0] != null ? c[0] : c.x) + ',' + rnd(c[1] != null ? c[1] : c.y)),
      spawns: (g.spawns || []).length, water: (g.water || []).length, checkpoints: (g.checkpoints || []).length,
      story: { task: tl.task ? tl.task.kind + (tl.task.count ? ' ×' + tl.task.count : '') : null, gift: tl.gift || null, title: tl.title || null, tale: tl.tale || null } };
    d.tiles.push(t);
  }
  out.districts.push(d);
}
console.log(JSON.stringify(out, null, 1));
