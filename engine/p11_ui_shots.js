// Prototype 11: the red car's markings as a player sees them, for the adversarial UI review (pipeline/ui_review.py).
// Per puzzle: (a) the red car mid-tile, the dummy at the drop; (b) the dummy beside the road ahead of it, the car reacting.
// Each moment: the field (800 × 640) and a 2× crop round the car. Then the boss at rungs 6 and 7, and a fitting.
//   node engine/p11_ui_shots.js OUTDIR [tiles...]      → OUTDIR/<n>_<tile>_{a,b}_{field,car}.png, shots.json
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright'); const go = require('./p11_goto.js');
const OUT = path.resolve(process.argv[2] || 'ui_shots'), only = process.argv.slice(3);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const P = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'puzzles_map1.json'), 'utf8')).puzzles;
  const br = await chromium.launch(), errs = [], meta = [];
  const open = async (tile) => {
    const pg = await br.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 }); pg.on('pageerror', (e) => errs.push(tile + ': ' + e.message));
    if (!(await go(pg, tile))) { errs.push(tile + ': no card'); await pg.close(); return null; }
    await pg.keyboard.press('Enter'); return pg;
  };
  const state = (pg) => pg.evaluate(() => {
    const s = window.__dummies.sim, T = s.duelT, c = T.cars.find((q) => q.red && !q.ghost && !q.gone && !q.spent), ln = T.redLanes.find((l) => l.i === T.DP['duel.route']) || T.redLanes[0];
    return { phase: s.phase, rescue: s.rescue, rung: T.rung, seq: T.redSeq, c: c && { x: c.x, y: c.y, u: (c.s - ln.enterS) / (ln.exitS - ln.enterS) }, b: { x: s.body.x, y: s.body.y } };
  });
  const until = async (pg, f, ms) => { const t0 = Date.now(); let q; while (Date.now() - t0 < ms) { q = await state(pg); if (f(q)) return q; await pg.waitForTimeout(40); } return null; };
  const freeze = (pg, on) => pg.evaluate((on) => { const s = window.__dummies.sim; if (on) { s.__st = s.step; s.step = () => {}; } else if (s.__st) { s.step = s.__st; s.__st = null; } }, on);
  const snap = async (pg, name, q) => {
    await pg.screenshot({ path: path.join(OUT, name + '_field.png'), clip: { x: 240, y: 40, width: 800, height: 640 } });
    const x = Math.max(0, Math.min(800 - 300, q.c.x - 150)), y = Math.max(0, Math.min(640 - 180, q.c.y - 90));
    await pg.screenshot({ path: path.join(OUT, name + '_car.png'), clip: { x: 240 + x, y: 40 + y, width: 300, height: 180 } });
  };
  const beside = (pg) => pg.evaluate(() => { // the dummy on the kerb ahead of the car: 170 along its lane, 48 off its side
    const s = window.__dummies.sim, T = s.duelT, X = window.DUMMIES, c = T.cars.find((q) => q.red && !q.ghost && !q.gone && !q.spent); if (!c) return false;
    const p = X.pathAt(c.path, Math.min(c.path.length - 20, c.s + 170)), side = (p.nx * (400 - p.x) + p.ny * (320 - p.y)) > 0 ? 1 : -1;
    for (const off of [48, 60, 72, -48, -60]) { const x = p.x + p.nx * off * side, y = p.y + p.ny * off * side;
      if (!T.level.statics.some((o) => !o.low && x > o.x - 12 && x < o.x + o.w + 12 && y > o.y - 12 && y < o.y + o.h + 12)) { s.body.x = x; s.body.y = y; s.body.vx = 0; s.body.vy = 0; return true; } }
    return false;
  });
  for (const q of P) {
    if (only.length && !only.includes(q.tile)) continue;
    const pg = await open(q.tile); if (!pg) continue;
    const tag = `${q.n}_${q.tile}`;
    let st = await until(pg, (z) => z.phase === 'play' && !z.rescue && z.c && z.c.u > 0.38 && z.c.u < 0.62, 30000);
    if (st) { await freeze(pg, true); await pg.waitForTimeout(120); st = await state(pg); await snap(pg, tag + '_a', st); await freeze(pg, false); meta.push({ shot: tag + '_a', tile: q.tile, n: q.n, name: q.name, rung: st.rung, moment: 'mid-tile, dummy at the drop' }); }
    else errs.push(tag + ': no mid-tile car');
    const seq = st ? st.seq : -1;
    st = await until(pg, (z) => z.phase === 'play' && !z.rescue && z.c && z.seq !== seq && z.c.u > 0.02 && z.c.u < 0.2, 30000);
    if (st && (await beside(pg))) {
      const b0 = (await state(pg)).b, t0 = Date.now(); let z = null;
      while (Date.now() - t0 < 3000) { await pg.evaluate((b) => { const s = window.__dummies.sim; s.body.x = b.x; s.body.y = b.y; }, b0); z = await state(pg); if (!z.c || Math.hypot(z.c.x - z.b.x, z.c.y - z.b.y) < 105) break; await pg.waitForTimeout(40); }
      await freeze(pg, true); await pg.waitForTimeout(120); z = await state(pg);
      if (z.c) { await snap(pg, tag + '_b', z); meta.push({ shot: tag + '_b', tile: q.tile, n: q.n, name: q.name, rung: z.rung, moment: 'dummy on the kerb ahead, car approaching' }); }
      await freeze(pg, false);
    } else errs.push(tag + ': no beside shot');
    await pg.close();
  }
  if (!only.length || only.includes('C3')) for (const r of [6, 7]) { // the boss, later rungs: a remembered spot, the search
    const pg = await open('C3'); if (!pg) continue;
    let st = await until(pg, (z) => z.phase === 'play' && !z.rescue, 15000);
    await pg.evaluate((r) => { const s = window.__dummies.sim, T = s.duelT; T.rung = r; if (!T.crashes.length) T.crashes.push({ n: 1, x: 330, y: 300, ox: 330, oy: 300, cover: null }); }, r);
    st = await until(pg, (z) => z.c && z.c.u > 0.3 && z.c.u < 0.6, 30000);
    if (r === 7) await pg.evaluate(() => { const T = window.__dummies.sim.duelT, c = T.cars.find((q) => q.red && !q.ghost && !q.gone); if (c && !c.lkp) c.lkp = { x: c.x + 120, y: c.y + 40, found: false, t: T.t }; });
    if (st) { await pg.waitForTimeout(200); await freeze(pg, true); await pg.waitForTimeout(120); st = await state(pg); if (st.c) { await snap(pg, `9_C3_r${r}`, st); meta.push({ shot: `9_C3_r${r}`, tile: 'C3', n: 9, name: 'Certification', rung: r, moment: r === 6 ? 'rung 6 forced, one remembered spot' : 'rung 7 forced, searching' }); } }
    await pg.close();
  }
  if (!only.length || only.includes('A1')) { // a lesson: a bot stands in A1's lane; the clip, then the fitting
    const pg = await open('A1');
    if (pg) {
      await until(pg, (z) => z.phase === 'play' && !z.rescue, 15000);
      await pg.evaluate(() => {
        const down = new Set(), key = (k, on) => { if (on === down.has(k)) return; on ? down.add(k) : down.delete(k); dispatchEvent(new KeyboardEvent(on ? 'keydown' : 'keyup', { code: k, key: k })); };
        const steer = (dx, dy, dead) => { key('ArrowRight', dx > dead); key('ArrowLeft', dx < -dead); key('ArrowDown', dy > dead); key('ArrowUp', dy < -dead); };
        let spot = null;
        window.__auto = setInterval(() => {
          const s = window.__dummies.sim; if (!s || s.phase !== 'play' || s.rescue) { steer(0, 0, 1); return; }
          const T = s.duelT, b = s.body, X = window.DUMMIES, ln = T.redLanes.find((l) => l.i === T.DP['duel.route']) || T.redLanes[0];
          if (!spot) { let best = null; for (let u = ln.enterS + 120; u <= ln.exitS - 120; u += 10) { const q = X.pathAt(ln.path, u), d = Math.hypot(q.x - b.x, q.y - b.y); if (!best || d < best.d) best = { x: q.x, y: q.y, d }; } spot = best; }
          const c = T.cars.find((q) => q.red && !q.spent && !q.ghost);
          if (c && Math.hypot(c.x - b.x, c.y - b.y) < 70) { steer(0, 0, 1); return; }
          steer(spot.x - b.x, spot.y - b.y, 3);
        }, 50);
      });
      const r = await until(pg, (z) => z.phase === 'report', 60000); await pg.evaluate(() => clearInterval(window.__auto));
      if (r) {
        await pg.waitForTimeout(1500); await pg.keyboard.press('Enter'); await until(pg, (z) => z.phase === 'lesson', 5000);
        await pg.waitForTimeout(1600); await pg.screenshot({ path: path.join(OUT, '1_A1_lesson_clip_field.png'), clip: { x: 240, y: 40, width: 800, height: 640 } });
        await pg.waitForTimeout(2900); await pg.screenshot({ path: path.join(OUT, '1_A1_lesson_fit_field.png'), clip: { x: 240, y: 40, width: 800, height: 640 } });
        meta.push({ shot: '1_A1_lesson_clip', tile: 'A1', n: 1, rung: 0, moment: 'lesson beat 1: the training clip' }, { shot: '1_A1_lesson_fit', tile: 'A1', n: 1, rung: 1, moment: 'lesson beat 2: the fitting and its close-up' });
      } else errs.push('A1: no clear for the lesson');
      await pg.close();
    }
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify({ shots: meta, errors: errs }, null, 1));
  console.log(JSON.stringify({ ok: !errs.length, shots: meta.length, errors: errs.slice(0, 6) }));
  await br.close();
})();
