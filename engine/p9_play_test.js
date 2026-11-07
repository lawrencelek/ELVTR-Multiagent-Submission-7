// Plays the integrated game (index.html) in Chromium: intro, title, STORY, the tile's card, then an autopilot dummy that
// gets into the red car's path until the tile clears (or the time runs out). Fails on any page error.
//   node engine/p9_play_test.js [--tile N] [--through M] [--seconds S] [--shots DIR] [--video DIR] [--bot cutin|walkin]
// --through M plays on until tile M is cleared (default: the tile it starts on).
// --tile N starts on Map 1's tile N (1-9) from a save that has cleared the tiles before it.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const TILE = +arg('tile', 1), THROUGH = +arg('through', arg('tile', 1)), SECS = +arg('seconds', 120), SHOTS = arg('shots', null), VID = arg('video', null), BOT = arg('bot', 'cutin');
const ORDER = ['A1', 'B1', 'C1', 'C2', 'B2', 'A2', 'A3', 'B3', 'C3'];

(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext(Object.assign({ viewport: { width: 1280, height: 720 } }, VID ? { recordVideo: { dir: path.resolve(ROOT, VID), size: { width: 1280, height: 720 } } } : {}));
  const pg = await ctx.newPage(), errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto('file://' + path.join(ROOT, 'index.html'));
  await pg.evaluate(({ tile, order }) => {
    try { localStorage.clear(); } catch (e) { /* none */ }
    if (tile > 1) { const pr = window.STORY.newProgress(); pr.done.monument = order.slice(0, tile - 1); localStorage.setItem('dummies.p7.save1', JSON.stringify({ v: 1, name: 'TEST DUMMY 1', saved: Date.now(), progress: pr })); }
  }, { tile: TILE, order: ORDER });
  await pg.reload(); await pg.waitForTimeout(1200);
  const shot = async (n) => { if (SHOTS) { fs.mkdirSync(path.resolve(ROOT, SHOTS), { recursive: true }); await pg.screenshot({ path: path.resolve(ROOT, SHOTS, n + '.png') }); } };
  const st = () => pg.evaluate(() => { const a = window.__dummies, s = a.sim; return { screen: a.screen, phase: s && s.phase, tile: s && s.screenName && s.screenName(), duel: s && s.duelDef && s.duelDef.tile, stage: s && s.duelDef && s.duelDef.stage, rung: s && s.duelT && s.duelT.rung, hits: s && s.duelHits, done: s && s.story && (s.story.done.monument || []).length, rescue: !!(s && s.rescue) }; });
  await shot('00_intro');
  for (const k of ['Enter', 'Enter']) { await pg.keyboard.press(k); await pg.waitForTimeout(500); }
  await shot('01_title');
  await pg.keyboard.press('Enter');
  let s = null; for (let i = 0; i < 200; i++) { s = await st(); if (s.phase === 'brief') break; await pg.waitForTimeout(150); }
  await pg.waitForTimeout(600); await shot('02_card');
  const card = s;
  await pg.keyboard.press('Enter');
  for (let i = 0; i < 100; i++) { s = await st(); if (s.phase === 'play' && !s.rescue) break; await pg.waitForTimeout(150); }
  await pg.evaluate((bot) => { // the autopilot (Enter on any card). cutin: wait beside the road ahead of the red car, out of its sight
    // where the tile allows (ducked from tile 6), and dash to land in its lane just ahead of its nose: the car hits the dummy, so it
    // scores (the fault rule). Before the dash arrives (tile 1), walk into its lane instead. walkin: stand in its path (rung 0 only).
    const down = new Set(), key = (k, on) => { if (on === down.has(k)) return; on ? down.add(k) : down.delete(k); dispatchEvent(new KeyboardEvent(on ? 'keydown' : 'keyup', { code: k, key: k })); };
    const tap = (k) => { dispatchEvent(new KeyboardEvent('keydown', { code: k, key: k })); setTimeout(() => dispatchEvent(new KeyboardEvent('keyup', { code: k, key: k })), 60); };
    const steer = (dx, dy, dead) => { key('ArrowRight', dx > dead); key('ArrowLeft', dx < -dead); key('ArrowDown', dy > dead); key('ArrowUp', dy < -dead); };
    const DIRS = []; for (let i = 0; i < 8; i++) DIRS.push([Math.round(Math.cos(i * Math.PI / 4) * 1e6) / 1e6, Math.round(Math.sin(i * Math.PI / 4) * 1e6) / 1e6]);
    let plan = null, cool = 0;
    window.__auto = setInterval(() => {
      const s = window.__dummies.sim; if (!s) return;
      if (s.phase === 'lesson') { steer(0, 0, 1); key('KeyC', false); const L = s.duelT && s.duelT.lesson; if (!L || (L.card && (window.__cardAt = window.__cardAt || Date.now()) && Date.now() - window.__cardAt > 1500)) { window.__cardAt = 0; tap('Enter'); } return; } // watch the clip and the fitting, as a player would
      if (s.phase === 'report' || s.phase === 'brief' || s.phase === 'gift') { steer(0, 0, 1); key('KeyC', false); tap('Enter'); return; }
      const X = window.DUMMIES, b = s.body, T = s.duelT, c = T && T.cars.find((q) => q.red && !q.spent && q.wasOn);
      cool -= 0.05;
      if (T && s.sc && T.duelSc && s.sc !== T.duelSc && b.alive && !T.lift) { const tx = 400 + (T.duelSc.col - s.sc.col) * 600, ty = 320 + (T.duelSc.row - s.sc.row) * 500; key('KeyC', false); steer(tx - b.x, ty - b.y, 6); return; } // back to the tile in test
      if (!c && b.alive && !T.lift && (b.level || 0) === 0 && window.__wait) { key('KeyC', false); steer(window.__wait.x - b.x, window.__wait.y - b.y, 6); return; } // between cars: off the road, out of every lane
      if (!c || !b.alive || (b.level || 0) > 0 || T.lift) { steer(0, 0, 1); key('KeyC', false); return; }
      const nose = c.s + c.L / 2;
      if (bot === 'walkin') { const q = X.pathAt(c.path, nose + 140); steer(q.x - b.x, q.y - b.y, 6); return; }
      const R1 = s.reach() * Math.max(0.2, s.underfoot('lunge')) * 0.95, r = s.P['body.radius'], TB = T.body;
      const solid = (x, y) => x < 24 || y < 24 || x > 776 || y > 616 || T.level.statics.some((q) => !q.low && x > q.x - r - 3 && x < q.x + q.w + r + 3 && y > q.y - r - 3 && y < q.y + q.h + r + 3) || (s.level.statics || []).some((q) => x > q.x - r - 3 && x < q.x + q.w + r + 3 && y > q.y - r - 3 && y < q.y + q.h + r + 3);
      if (!plan || plan.car !== c.id || plan.Ls < nose - 10) {
        plan = { car: c.id, Ls: -1e9 }; let best = null; const len = c.path.cum ? c.path.cum[c.path.cum.length - 1] - 30 : 1e9, keep = { x: TB.x, y: TB.y, duck: TB.duck };
        try { for (let Ls = nose + 260; Ls <= Math.min(len, nose + 760); Ls += 40) { const L = X.pathAt(c.path, Ls); if (L.x < 30 || L.x > 770 || L.y < 30 || L.y > 610) continue;
          for (const [dx, dy] of DIRS) { const lat = Math.abs(dx * L.nx + dy * L.ny), fwd = dx * L.tx + dy * L.ty; if (lat < 0.6 || fwd < -0.1) continue;
            const x = L.x - dx * R1, y = L.y - dy * R1; let ok = !solid(x, y); for (let u = 0.2; ok && u < 0.9; u += 0.2) if (solid(x + dx * R1 * u, y + dy * R1 * u) && !T.level.statics.some((q) => q.low)) ok = false; if (!ok) continue;
            let n = 0, k = 0; TB.x = x; TB.y = y; TB.duck = !!s.duelDuck;
            for (let u = Ls - 480; u <= Ls - 120; u += 60) { if (u < 0) continue; const q = X.pathAt(c.path, u); k++; if (T.carSees(c, q.x, q.y, false)) n++; }
            if (T.rung >= 4 && T.seeingCamera()) n = k;
            const cost = (k ? n / k : 1) * 400 + Math.hypot(x - b.x, y - b.y) * 0.5 + (fwd < 0.3 ? 120 : 0) /* a dash with the car, not across it: it lands ahead, never in its side */; if (!best || cost < best.cost) best = { car: c.id, Ls, x, y, lx: L.x, ly: L.y, dx, dy, cost }; } } }
        finally { TB.x = keep.x; TB.y = keep.y; TB.duck = keep.duck; }
        if (best) { plan = best; window.__wait = { x: best.x, y: best.y }; }
      }
      if (plan.x == null) { steer(0, 0, 1); return; }
      const gap = plan.Ls - nose, m = Math.hypot(plan.x - b.x, plan.y - b.y);
      if (!s.dashFitted()) { key('KeyC', false); if (gap <= c.v * 2.2 + 30) steer(plan.lx - b.x, plan.ly - b.y, 3); else steer(plan.x - b.x, plan.y - b.y, 5); return; }
      if (m < 12 && cool <= 0 && gap > c.v * 0.2 && gap <= c.v * 0.5 + 12) { key('KeyC', false); steer(plan.dx, plan.dy, 0.3); tap('Space'); cool = 1.5; window.__dashes = (window.__dashes || 0) + 1; return; }
      if (cool > 1.2) return; // mid-dash: hold the keys
      if (m >= 8) { key('KeyC', false); steer(plan.x - b.x, plan.y - b.y, 4); } else { steer(0, 0, 1); key('KeyC', !!s.duelDuck); }
    }, 50);
  }, BOT);
  const t0 = Date.now(); let n = 0, lastShot = 0;
  while (Date.now() - t0 < SECS * 1000) {
    s = await st();
    if (Date.now() - lastShot > (s.phase === 'lesson' ? 900 : 8000)) { await shot((s.phase === 'lesson' ? 'lesson_' : 'play_') + String(n++).padStart(2, '0')); lastShot = Date.now(); }
    if (s.done >= THROUGH) break;
    await pg.waitForTimeout(s.phase === 'lesson' ? 150 : 400);
  }
  await pg.evaluate(() => clearInterval(window.__auto));
  await shot('zz_end');
  const trace = await pg.evaluate(() => { const s = window.__dummies.sim, T = s && s.duelT; return { lessons: T ? T.lessons : null, crashes: T ? T.crashes.length : null, dashes: window.__dashes || 0, faults: s ? s.events.filter((e) => e.type === 'fault').length : 0, events: s ? s.events.slice(-12).map((e) => e.type) : [] }; });
  await ctx.close(); await br.close();
  const ok = !errs.length && (card.phase === 'brief' || card.phase === 'gift') && card.duel === ORDER[TILE - 1];
  console.log(JSON.stringify({ ok, card, end: s, cleared: s.done >= THROUGH, seconds: Math.round((Date.now() - t0) / 1000), trace, errors: errs.slice(0, 5) }));
  process.exit(ok ? 0 : 1);
})();
