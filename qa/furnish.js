// DUMMIES · FINAL V3 (Edit 127): street furniture for Maps 2–3 (node qa/furnish.js [dist:tile ...]; OUT=furnish.json). Per tile:
// route's kerbs, clear of the solution's walk and dash lines, the drop, cones, camera posts, water, decks, the hill; up to 4, spread
// out; then the solution is re-run headless with them, and any piece that breaks it comes out. Out: JSON of the chosen pieces.
const path = require('path'), ROOT = path.resolve(__dirname, '..'), H = require('./headless.js'), fs = require('fs'); H.boot();
const DUEL = globalThis.DUEL, X = globalThis.DUMMIES, P11 = globalThis.P11, PIX = globalThis.PIX || require(ROOT + '/engine/p9/pixel.js');
const FAM = { parkland: ['hedge', 'kiosk', 'planter', 'cabinet'], waterfront: ['kiosk', 'planter', 'cabinet', 'billboard'] };
const HILL = new Set(['waterfront:A1', 'waterfront:C1']); // the hill duel: cover paints under the hill (Edit 126)
const want = process.argv.slice(2).filter((a) => a.includes(':')), all = [];
for (const d of ['parkland', 'waterfront']) for (const t of ['A1', 'B1', 'C1', 'C2', 'B2', 'A2', 'A3', 'B3', 'C3']) all.push(d + ':' + t);
const tiles = (want.length ? want : all).filter((k) => !HILL.has(k)), out = {};
const segD = (r, a, b) => { let m = 1e9; const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 5)); for (let i = 0; i <= n; i++) { const x = a[0] + (b[0] - a[0]) * i / n, y = a[1] + (b[1] - a[1]) * i / n; m = Math.min(m, Math.hypot(Math.max(r.x - x, 0, x - r.x - r.w), Math.max(r.y - y, 0, y - r.y - r.h))); } return m; };
const ptD = (r, p) => Math.hypot(Math.max(r.x - p[0], 0, p[0] - r.x - r.w), Math.max(r.y - p[1], 0, p[1] - r.y - r.h));
function setCover(dist, t, cover) { const M = P11.MAPS.find((m) => m.id === dist), q = M.BY[t], def = globalThis.STORY_MAPS[dist].tiles.find((x) => x.tile === t); q.layout = Object.assign({}, q.layout, { cover }); def.layout = Object.assign({}, def.layout, { cover }); }
function solve(key, sol) { const r = sol.bot ? require(ROOT + '/qa/bot.js').bot(key, 200) : H.run(key, sol.script, sol.secs || 90); return { cleared: r.cleared, stars: r.result && r.result.stars && r.result.stars.join(''), t: r.cleared }; }
for (const key of tiles) {
  const [dist, t] = key.split(':'), M = P11.MAPS.find((m) => m.id === dist), q = M.BY[t], base = ((q.layout || {}).cover || []).filter((c) => !c.street), sol = JSON.parse(fs.readFileSync(`${ROOT}/qa/solutions/${dist}_${t}.json`, 'utf8'));
  setCover(dist, t, base); const before = solve(key, sol);
  const s = H.make(key), T = s.duelT, sc = T.duelSc, P = T.P, DP = T.DP, ln = T.redLanes.find((l) => l.i === DP['duel.route']) || T.redLanes[0];
  // the solution's lines: the drop, each goto, each dash's origin and 170 along it
  const line = [], drop = q.layout.drop; line.push([drop[0], drop[1]]); let lastAt = null;
  const walk = (l) => { for (const x of l) { if (x.op === 'repeat') walk(x.steps || []); else if (x.op === 'goto' && Array.isArray(x.to)) line.push(x.to.slice()); else if (x.op === 'waitCar' && Array.isArray(x.at)) { line.push(x.at.slice()); lastAt = x.at; } else if (x.op === 'dash' && lastAt) { const a = x.deg * Math.PI / 180; line.push([lastAt[0] + Math.cos(a) * 170, lastAt[1] + Math.sin(a) * 170]); } else if (x.op === 'stick' && lastAt) { const a = x.deg * Math.PI / 180; line.push([lastAt[0] + Math.cos(a) * 120, lastAt[1] + Math.sin(a) * 120]); } } };
  if (!sol.bot) walk(sol.script);
  const segs = []; for (let i = 1; i < line.length; i++) segs.push([line[i - 1], line[i]]);
  const water = (T.level.water || []).concat((s.level && s.level.water) || []), layers = (sc.layers || []).filter((l) => l.inBand), hill = sc.hillLayer;
  const cones = (q.layout.cones || []), cams = (T.level.cameras || []).map((c) => [c[0], c[1]]), n0 = DUEL.placeLayout(T, sc, P, DP, { cover: base }).out.length;
  const cands = [];
  for (const kind of FAM[dist]) for (let at = 0.06; at <= 0.94; at += 0.04) for (const side of ['N', 'S', 'E', 'W']) for (const gap of [2, 18]) {
    const L = DUEL.placeLayout(T, sc, P, DP, { cover: base.concat([{ kind, at: +at.toFixed(2), side, gap }]) }); if (L.out.length !== n0 + 1) continue; const r = L.out[L.out.length - 1];
    if (r.x < 36 || r.y < 36 || r.x + r.w > 764 || r.y + r.h > 604) continue; // clear of the screen's edge
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2, corners = [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h], [cx, cy]];
    { let off = true; for (let i = 0; i <= 4 && off; i++) for (let j = 0; j <= 4 && off; j++) if (sc.roadC(r.x + r.w * i / 4, r.y + r.h * j / 4) < 50) off = false; if (!off) continue; } // off every road's asphalt (a roundabout's ring too)
    if (corners.some(([x, y]) => water.some((p) => PIX.inPoly(p, x, y)) || layers.some((l) => l.inBand(x, y)) || (hill && hill.inBand && hill.inBand(x, y)))) continue;
    const clear = DUEL.COVER[kind].low ? 44 : 64; if (segs.some(([a, b]) => segD(r, a, b) < clear) || line.some((p) => ptD(r, p) < clear)) continue;
    if (cones.some((c) => ptD(r, c) < 44) || cams.some((c) => ptD(r, c) < 44)) continue;
    const pr = X.pathProject(ln.path, cx, cy), lp = X.pathAt(ln.path, pr.s), horiz = Math.abs(lp.tx) > Math.abs(lp.ty);
    if (!DUEL.COVER[kind].low && horiz && cy > lp.y) continue; // tall cover north of a road across (drawn upward, never into the lane)
    cands.push({ kind, at: +at.toFixed(2), side, gap, r, cx, cy, lat: Math.abs(pr.lat) });
  }
  // up to 4, spread out: the kerb first (gap 2), kinds in turn, 130 apart (and from the puzzle's own cover)
  const placed = DUEL.placeLayout(T, sc, P, DP, { cover: base }).out.map((r) => ({ cx: r.x + r.w / 2, cy: r.y + r.h / 2, kind: r.kind })), pick = [];
  cands.sort((a, b) => a.gap - b.gap || a.lat - b.lat);
  for (let round = 0; round < 3 && pick.length < 4; round++) for (const kind of FAM[dist]) { if (pick.length >= 4) break; if (pick.filter((p) => p.kind === kind).length > round) continue;
    const c = cands.find((c) => c.kind === kind && placed.concat(pick).every((p) => Math.hypot(p.cx - c.cx, p.cy - c.cy) >= 130)); if (c) pick.push(c); }
  // the solution with them; any piece that breaks it comes out. The boss (the cut-in bot): one at a time, kept while it still clears
  let chosen = pick.slice(), after = null;
  if (sol.bot) { chosen = []; const seenAt = new Set(), pool = cands.filter((c) => c.gap === 2 && c.kind !== 'billboard' && !seenAt.has(c.kind + Math.round(c.cx / 20) + ',' + Math.round(c.cy / 20)) && seenAt.add(c.kind + Math.round(c.cx / 20) + ',' + Math.round(c.cy / 20))); let tries = 0;
    for (const c of pool) { if (chosen.length >= 3 || tries >= 16) break; if (!placed.concat(chosen).every((p) => Math.hypot(p.cx - c.cx, p.cy - c.cy) >= 130) || chosen.filter((p) => p.kind === c.kind).length >= 1) continue; tries++;
      const tryC = chosen.concat([c]); setCover(dist, t, base.concat(tryC.map(({ kind, at, side, gap }) => ({ kind, at, side, gap })))); const r = solve(key, sol); console.log('   boss try', c.kind, Math.round(c.cx), Math.round(c.cy), JSON.stringify(r)); if (r.cleared) { chosen = tryC; after = r; } }
    pick.length = 0; }
  for (let k = 0; k <= pick.length && pick.length; k++) { setCover(dist, t, base.concat(chosen.map(({ kind, at, side, gap }) => ({ kind, at, side, gap })))); after = solve(key, sol);
    if (after.cleared && (!before.stars || after.stars === before.stars || after.stars >= before.stars)) break;
    let fixed = false; for (let j = chosen.length - 1; j >= 0 && !fixed; j--) { const tryC = chosen.filter((_, i) => i !== j); setCover(dist, t, base.concat(tryC.map(({ kind, at, side, gap }) => ({ kind, at, side, gap })))); const r = solve(key, sol); if (r.cleared && r.stars >= before.stars) { chosen = tryC; after = r; fixed = true; } }
    if (fixed) break; chosen = chosen.slice(0, -1); }
  out[key] = { add: chosen.map(({ kind, at, side, gap }) => ({ kind, at, side, gap })), before, after, cands: cands.length };
  console.log(key.padEnd(18), 'cands', FAM[dist].map((k) => k[0] + cands.filter((c) => c.kind === k).length).join('/'), 'picked', pick.length, 'kept', chosen.length, chosen.map((c) => c.kind + '@' + Math.round(c.cx) + ',' + Math.round(c.cy)).join(' '), '| before', JSON.stringify(before), 'after', JSON.stringify(after));
  setCover(dist, t, base);
}
fs.writeFileSync(process.env.OUT || 'furnish.json', JSON.stringify(out, null, 1));
