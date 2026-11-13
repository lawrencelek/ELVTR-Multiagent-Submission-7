// DUMMIES · FINAL V2.1 (Edit 126): the cut-in bot (engine/p9_play_test.js) headless, at sim speed: the bosses' check.
// It waits beside the road ahead of the learner, out of its sight where the tile allows (crouched with Super Knees), and dashes
// to land in its lane just ahead of its nose: the car hits the dummy, so it scores (the fault rule). No fixed script: it plans
// each pass from the car's path, as the browser bot does. Lessons and cards are passed as a player would.
//   node qa/bot.js parkland:C3 [secs] [--trace]   → { cleared, t, result, hits, rung, lessons, dashes, faults }
const H = require('./headless.js');
function bot(tile, secs, opts) {
  const o = opts || {}, s = H.make(tile), X = globalThis.DUMMIES, T = s.duelT, dt = 1 / 60;
  const DIRS = []; for (let i = 0; i < 8; i++) DIRS.push([Math.cos(i * Math.PI / 4), Math.sin(i * Math.PI / 4)]);
  let plan = null, cool = 0, wait = null, held = { mx: 0, my: 0 }, duck = false, dashes = 0, faults = 0, lessons = 0, cleared = null, t = 0, k = 0, lastRung = T.rung;
  const steer = (dx, dy, dead) => { const mx = dx > dead ? 1 : dx < -dead ? -1 : 0, my = dy > dead ? 1 : dy < -dead ? -1 : 0, l = Math.hypot(mx, my) || 1; held = { mx: mx / l, my: my / l }; };
  for (; t < (secs || 120); t += dt, k++) {
    if (s.phase === 'brief') s.continueBrief();
    if (s.phase === 'lesson') { s.continueLesson(); }
    if ((s.p11 && s.p11.result) || s.phase === 'report' || s.phase === 'writeoff') { cleared = +t.toFixed(2); break; }
    if (T.rung !== lastRung) { lessons++; lastRung = T.rung; }
    let press = {};
    if (k % 3 === 0 && s.phase === 'play' && !s.rescue) { // 20 Hz, as the browser bot's interval
      const b = s.body, c = T.cars.find((q) => q.red && !q.spent && q.wasOn), z0 = T.elev0 || 0; cool -= 0.05;
      if (!c && b.alive && !T.lift && (b.level || 0) === z0 && wait) { duck = false; steer(wait.x - b.x, wait.y - b.y, 6); }
      else if (!c || !b.alive || (b.level || 0) > z0 || T.lift) { steer(0, 0, 1); duck = false; }
      else {
        const nose = c.s + c.L / 2, R1 = s.reach() * Math.max(0.2, s.underfoot('lunge')) * 0.95, r = s.P['body.radius'], TB = T.body;
        const wet = (x, y) => (s.level.water || []).some((pg) => globalThis.PIX && globalThis.PIX.inPoly && globalThis.PIX.inPoly(pg, x, y)); // FINAL V3.1 (Edit 128): never a wait spot in the water
        const stairs = (T.duelSc && T.duelSc.stairs) || [], onStair = (x, y) => stairs.some((q) => x > q.x - r - 3 && x < q.x + q.w + r + 3 && y > q.y - r - 3 && y < q.y + q.h + r + 3);
        const solid = (x, y) => x < 24 || y < 24 || x > 776 || y > 616 || wet(x, y) || onStair(x, y) || T.level.statics.some((q) => !q.low && x > q.x - r - 3 && x < q.x + q.w + r + 3 && y > q.y - r - 3 && y < q.y + q.h + r + 3) || (s.level.statics || []).some((q) => x > q.x - r - 3 && x < q.x + q.w + r + 3 && y > q.y - r - 3 && y < q.y + q.h + r + 3);
        if (!plan || plan.car !== c.id || plan.Ls < nose - 10) {
          plan = { car: c.id, Ls: -1e9 }; let best = null; const len = c.path.cum ? c.path.cum[c.path.cum.length - 1] - 30 : 1e9, keep = { x: TB.x, y: TB.y, duck: TB.duck };
          try { for (let Ls = nose + 260; Ls <= Math.min(len, nose + 760); Ls += 40) { const L = X.pathAt(c.path, Ls); if (L.x < 30 || L.x > 770 || L.y < 30 || L.y > 610) continue;
            for (const [dx, dy] of DIRS) { const lat = Math.abs(dx * L.nx + dy * L.ny), fwd = dx * L.tx + dy * L.ty; if (lat < 0.6 || fwd < -0.1) continue;
              const x = L.x - dx * R1, y = L.y - dy * R1; let ok = !solid(x, y);
              let walkBlocked = false; if (ok) { const ex = x - b.x, ey = y - b.y, m0 = Math.min(Math.abs(ex), Math.abs(ey)), cx0 = b.x + Math.sign(ex) * m0, cy0 = b.y + Math.sign(ey) * m0; // FINAL V3.1: the way it walks there (8 directions: diagonal, then straight); a blocked way costs, it does not forbid
                for (const [ax, ay, bx2, by2, a0] of [[b.x, b.y, cx0, cy0, 28], [cx0, cy0, x, y, 0]]) { const n = Math.ceil(Math.hypot(bx2 - ax, by2 - ay) / 8); for (let j = 1; !walkBlocked && j <= n; j++) if (j * 8 > a0 && solid(ax + (bx2 - ax) * j / n, ay + (by2 - ay) * j / n)) walkBlocked = true; } } for (let u = 0.2; ok && u < 0.9; u += 0.2) if (solid(x + dx * R1 * u, y + dy * R1 * u) && !T.level.statics.some((q) => q.low)) ok = false; if (!ok) continue;
              let n = 0, m = 0; TB.x = x; TB.y = y; TB.duck = !!s.duelDuck;
              for (let u = Ls - 480; u <= Ls - 120; u += 60) { if (u < 0) continue; const q = X.pathAt(c.path, u); m++; if (T.carSees(c, q.x, q.y, false)) n++; }
              if (T.rung >= 4 && T.seeingCamera()) n = m;
              const cost = (m ? n / m : 1) * 400 + Math.hypot(x - b.x, y - b.y) * 0.5 + (fwd < 0.3 ? 120 : 0) + (walkBlocked ? 2000 : 0); if (!best || cost < best.cost) best = { car: c.id, Ls, x, y, lx: L.x, ly: L.y, dx, dy, cost }; } } }
          finally { TB.x = keep.x; TB.y = keep.y; TB.duck = keep.duck; }
          if (best) { plan = best; wait = { x: best.x, y: best.y }; if (best.cost >= 2000) plan.Ls = -1e9; } // FINAL V3.1: a spot it cannot walk straight to: head that way, and look again next tick
        }
        if (plan.x == null) steer(0, 0, 1);
        else { const gap = plan.Ls - nose, m = Math.hypot(plan.x - b.x, plan.y - b.y);
          if (m < 12 && cool <= 0 && gap > c.v * 0.2 && gap <= c.v * 0.5 + 12) { duck = false; held = { mx: plan.dx, my: plan.dy }; press.aPress = true; cool = 1.5; dashes++; if (o.trace) console.log(t.toFixed(1), 'dash from', Math.round(b.x), Math.round(b.y), 'dir', plan.dx.toFixed(2), plan.dy.toFixed(2), 'to', Math.round(plan.lx), Math.round(plan.ly), 'gap', Math.round(gap)); }
          else if (cool > 1.2) { /* mid-dash: hold */ }
          else if (m >= 8) { duck = false; steer(plan.x - b.x, plan.y - b.y, 4); } else { steer(0, 0, 1); duck = !!s.duelDuck; } }
      }
    }
    const ev0 = s.events.length; s.step(Object.assign({ mx: held.mx, my: held.my, duck }, press));
    for (let j = ev0; j < s.events.length; j++) { const e = s.events[j]; if (e.type === 'fault') faults++; if (o.trace && ['impact', 'fault', 'p11-pass', 'p11-fail', 'learned', 'lesson-due'].includes(e.type)) console.log(t.toFixed(1), e.type, e.red ? 'red' : '', s.duelHits); }
  }
  return { tile, cleared, t: +t.toFixed(1), result: (s.p11 && s.p11.result) || null, hits: s.duelHits, rung: T.rung, lessons, dashes, faults, passes: s.p11 && s.p11.passes };
}
module.exports = { bot };
if (require.main === module) { const a = process.argv.slice(2); console.log(JSON.stringify(bot(a[0], +(a[1] || 120), { trace: a.includes('--trace') }))); }
