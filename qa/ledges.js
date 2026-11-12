// DUMMIES · FINAL V3 (Edit 127): every ledge opening on the 27 tiles, headless. A deck's parapet gap: straight out and 45° out drop;
// 30° and a 15° brush slide past; hugging the parapet at 45° into the gap drops. A walkway's opening: square to its run; straight
// and 45° out drop.   node qa/ledges.js   → one line an opening; 'problems: 0' passes
const H = require('./headless.js'); H.boot(); const X = globalThis.DUMMIES;
function fresh(tile) { const s = H.make(tile); let n = 0; while ((s.rescue || s.phase !== 'play') && n < 3000) { if (s.phase === 'brief') s.continueBrief(); s.step({}); n++; } return s; }
function walk(tile, fi, x, y, dx, dy, secs) { const s = fresh(tile), b = s.body, f = s.level.floors[fi]; if (!f.has(x, y)) return 'OFF'; Object.assign(b, { x, y, px: x, py: y, level: f.z, floor: fi, vx: 0, vy: 0, mode: 'idle' });
  const l = Math.hypot(dx, dy); for (let i = 0; i < (secs || 1.5) * 60; i++) { s.step({ mx: dx / l, my: dy / l }); if ((b.level || 0) < f.z || b.mode === 'drop') return (i / 60).toFixed(2); } return 'HELD'; }
const tiles = []; for (const m of ['monument', 'parkland', 'waterfront']) for (const t of ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3']) tiles.push(m + ':' + t);
const bad = []; let n = 0;
for (const tile of tiles) { let s; try { s = fresh(tile); } catch (e) { console.log(tile, 'ERR', e.message); continue; }
  s.level.floors.forEach((f, fi) => {
    if (f.kind === 'deck') { const l = f.layer, dk = l.dk, hz = dk.hz, HALF = s.P['world.deckWidth'] ? s.P['world.deckWidth'] / 2 : null;
      for (const g of l.gapSpans || []) { const a = (g.a0 + g.a1) / 2, sd = g.side; // inside: on the center line; out: across the gap
        const P = (al, d) => hz ? [al, dk.off + d] : [dk.off + d, al], [x0, y0] = P(a, 0), o = hz ? [0, sd] : [sd, 0], t = hz ? [1, 0] : [0, 1];
        let hold = 0; while (hold < 200 && f.has(...P(g.a0 - 40, sd * (hold + 1)))) hold++; // the parapet line, away from the gap
        const st = walk(tile, fi, x0, y0, o[0], o[1]), dg = walk(tile, fi, ...P(a - hold - 4, 0), o[0] + t[0], o[1] + t[1]),
              d30 = walk(tile, fi, ...P(a - hold * 1.73 - 6, 0), o[0] * 0.5 + t[0] * 0.87, o[1] * 0.5 + t[1] * 0.87), br = walk(tile, fi, ...P(g.a0 - 40, sd * (hold - 1)), t[0] + o[0] * 0.27, t[1] + o[1] * 0.27, 1.5);
        const cn = walk(tile, fi, ...P(g.a0 - 40, sd * (hold - 1)), t[0] + o[0], t[1] + o[1], 1.5); // hugging the parapet at 45° into the gap // pressed into the gap's far corner
        if (dg === 'HELD') bad.push('45 ' + tile); if (cn === 'HELD') bad.push('hug45 held ' + tile); if (br !== 'HELD') bad.push('brush dropped ' + tile);
        n++; const line = `${tile} deck f${fi} gap ${Math.round(g.a0)}-${Math.round(g.a1)} side ${sd}: edge ${hold} · straight ${st} · 45° ${dg} · 30° ${d30} · brush 15° ${br} · hug 45° ${cn}`; console.log(line); if (st === 'HELD' || st === 'OFF') bad.push(line); } }
    if (f.kind === 'walk') { const L = f.layer, HW = s.P['world.walkwayWidth'] / 2;
      for (const sp of L.spines) for (const g of sp.gaps) { const c = (g[0] + g[1]) / 2, q = X.pathAt(sp.path, c), nx = -q.ty, ny = q.tx, op = f.dropAt(q.x + nx * (HW + 2), q.y + ny * (HW + 2)) ? 1 : -1;
        const sq = Math.min(Math.abs(q.tx), Math.abs(q.ty)) < 0.05;
        const st = walk(tile, fi, q.x, q.y, nx * op, ny * op), dg = walk(tile, fi, q.x - q.tx * 12, q.y - q.ty * 12, nx * op + q.tx, ny * op + q.ty);
        n++; const line = `${tile} walk f${fi} opening (${Math.round(q.x)},${Math.round(q.y)}) ${sq ? 'square' : 'DIAGONAL'}: straight ${st} · 45° ${dg}`; console.log(line); if (st === 'HELD' || dg === 'HELD' || !sq) bad.push(line); } } });
}
console.log('\n' + n + ' openings; problems: ' + bad.length); bad.forEach((l) => console.log('  ' + l));
