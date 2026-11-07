// Headless (node): the fault rule's difficulty, per tile. A bot plays one Map 1 tile under the duel and reports the red car's
// damaging hits it caused (car at fault), the contacts the dummy caused (no points), the lessons and the clear time.
// Bots: flank (dash at the car's middle when alongside: the exploit the fault rule closes); cutin (wait beside the road ahead
// of the car, dash to land in its lane just ahead of its nose); cover (the same, from the spot its sensors and the cameras see least,
// ducked where the tile has DUCK). Optional 5th argument: the red car's traffic.hardBraking (default: the registry's).
//   node engine/p9_probe.js <tile 1-9> [flank|cutin|cover] [seconds] [hardBraking]
const path = require('path'), fs = require('fs'), Module = require('module');
const E = path.join(__dirname, 'p9');
const res = Module._resolveFilename; Module._resolveFilename = function (req, parent, ...a) { if (req.startsWith('../p6/') || req.startsWith('../jump/')) req = path.join(E, path.basename(req)); return res.call(this, req, parent, ...a); };
const R = JSON.parse(fs.readFileSync(path.join(__dirname, '.cache', 'runtime.json'), 'utf8')); // engine/build_p9.py writes it
Object.assign(globalThis, { DUMMIES_STORY: R.story, DUMMIES_SIM: R.sim });
const X = globalThis.DUMMIES = require(path.join(E, 'sim.js'));
globalThis.WORLD6 = require(path.join(E, 'world6.js'));
const STORY = globalThis.STORY = require(path.join(E, 'story7.js'));
globalThis.DUMMIES_P10 = require(path.join(__dirname, 'vendor', 'testroad.js'));
Object.assign(globalThis, { DUMMIES_STAGES: R.stages, STORY_MAP1: R.plan, DUEL_RULES: R.rules });
require(path.join(__dirname, 'duel.js'));
const k = +process.argv[2], bot = process.argv[3] || 'cutin', SECS = +(process.argv[4] || 150), HARD = process.argv[5];
if (HARD) globalThis.DUEL.TUNE.redHard = +HARD;
const pr = STORY.newProgress(); pr.done.monument = R.story.districts[0].order.slice(0, k - 1);
const s = new STORY.StorySim('monument', Object.assign({}, R.sim), pr), T = s.duelT, P = s.P, r = P['body.radius'];
const out = { tile: s.duelDef.tile, stage: s.duelDef.stage, bot, hard: globalThis.DUEL.TUNE.redHard, hits: 0, faults: 0, faultsRed: 0, whiteHits: 0, lessons: [], cleared: null, standstill: 0, dashes: 0 };
let cool = 0, plan = null; const log = [];
const free = (x, y) => x > 24 && y > 24 && x < 776 && y < 616 && !T.level.statics.some((q) => !q.low && x > q.x - r - 4 && x < q.x + q.w + r + 4 && y > q.y - r - 4 && y < q.y + q.h + r + 4) && !(s.level.statics || []).some((q) => x > q.x - r - 4 && x < q.x + q.w + r + 4 && y > q.y - r - 4 && y < q.y + q.h + r + 4);
for (let i = 0; i < SECS * 60; i++) {
  if (s.phase === 'brief') s.continueBrief(); if (s.phase === 'gift') s.continueGift(); if (s.phase === 'lesson') s.continueLesson();
  if (s.phase === 'report') s.continueReport(); if (s.phase === 'shop') s.leaveShop();
  if (s.duelDone) break;
  const b = s.body, c = T.cars.find((q) => q.red && !q.spent && q.wasOn); let cmd = {};
  if (out.t0 == null && s.phase === 'play' && !s.rescue) out.t0 = s.t;
  if (c && b.alive && !s.rescue && s.phase === 'play' && (b.level || 0) === 0) {
    const ca = Math.cos(c.h), sa = Math.sin(c.h);
    if (bot === 'flank') {
      const rel = { f: (b.x - c.x) * ca + (b.y - c.y) * sa, l: Math.abs((b.x - c.x) * -sa + (b.y - c.y) * ca) };
      const side = Math.sign((b.x - c.x) * -sa + (b.y - c.y) * ca) || 1, tx = c.x + ca * Math.max(60, c.v * 0.9) - sa * side * (c.W / 2 + 58), ty = c.y + sa * Math.max(60, c.v * 0.9) + ca * side * (c.W / 2 + 58);
      const dx = tx - b.x, dy = ty - b.y, m = Math.hypot(dx, dy); if (m > 8) cmd = { mx: dx / m, my: dy / m };
      if (cool <= 0 && s.dashFitted() && rel.f > -c.L / 2 && rel.f < c.L / 2 + 40 && rel.l < c.W / 2 + 110) { const ex = c.x + ca * c.v * 0.15 - b.x, ey = c.y + sa * c.v * 0.15 - b.y, mm = Math.hypot(ex, ey); cmd = { mx: ex / mm, my: ey / mm, aPress: true }; cool = 60; out.dashes++; }
    } else { // cutin
      const R1 = s.reach() * Math.max(0.2, s.underfoot('lunge')), nose = c.s + c.L / 2;
      if (!plan || plan.car !== c.id || plan.Ls < nose - 20) {
        plan = null; const pj = X.pathProject(c.path, b.x, b.y);
        let best = null; const duck = !!s.duelDuck, TB = T.body, keep = { x: TB.x, y: TB.y, duck: TB.duck };
        const seen = (x, y, Ls) => { // the share of its approach (Ls-480..Ls-120) from which it would see the dummy at (x, y), or a camera would
          let n = 0, k = 0; TB.x = x; TB.y = y; TB.duck = duck;
          try { for (let u = Ls - 480; u <= Ls - 120; u += 60) { if (u < 0) continue; const q = X.pathAt(c.path, u); k++; if (T.carSees(c, q.x, q.y, false) && !(T.whiteHides && T.whiteHides(c, q.x, q.y))) n++; }
            if (T.rung >= 4 && T.seeingCamera()) n = k; } finally { TB.x = keep.x; TB.y = keep.y; TB.duck = keep.duck; }
          return k ? n / k : 1; };
        for (let Ls = Math.max(nose + 260, pj.s - 300); Ls <= Math.min(c.path.cum ? c.path.cum[c.path.cum.length - 1] - 30 : 1e9, pj.s + 500); Ls += 40) {
          const L = X.pathAt(c.path, Ls); if (L.x < 20 || L.x > 780 || L.y < 20 || L.y > 620) continue;
          for (const off of [70, 90, 110, 130, 150]) for (const sd of [1, -1]) {
            const al = Math.sqrt(Math.max(0, R1 * R1 - off * off)) * 0.92, q = X.pathAt(c.path, Ls - al), x = q.x + q.nx * sd * off, y = q.y + q.ny * sd * off;
            if (!free(x, y)) continue;
            const v = bot === 'cover' ? seen(x, y, Ls) : 0, cost = v * 400 + Math.hypot(x - b.x, y - b.y) * 0.5;
            if (!best || cost < best.cost) best = { car: c.id, Ls, x, y, lx: L.x, ly: L.y, cost, v }; } }
        plan = best;
        if (!plan) plan = { car: c.id, Ls: -1e9 };
      }
      if (plan.x != null) {
        const dx = plan.x - b.x, dy = plan.y - b.y, m = Math.hypot(dx, dy), gap = plan.Ls - nose;
        if (!s.dashFitted()) { const ddx = plan.lx - b.x, ddy = plan.ly - b.y, mm = Math.hypot(ddx, ddy); if (gap <= c.v * 2.2 + 30) cmd = mm > 4 ? { mx: ddx / mm, my: ddy / mm } : {}; else if (m > 6) cmd = { mx: dx / m, my: dy / m }; } // no dash yet: step into its lane
        else if (m > 6) cmd = { mx: dx / m, my: dy / m }; else if (s.duelDuck) cmd = { duck: true };
        if (m < 14 && cool <= 0 && s.dashFitted() && gap <= c.v * 0.42 + 10 && gap > 0) { const ex = plan.lx - b.x, ey = plan.ly - b.y, mm = Math.hypot(ex, ey); cmd = { mx: ex / mm, my: ey / mm, aPress: true }; cool = 60; out.dashes++; }
      }
    }
  }
  cool--;
  const e0 = s.events.length; s.step(cmd);
  for (const e of s.events.slice(e0)) {
    if (e.type === 'impact' && e.red && e.lost >= 10 && e.fault === 'car') { out.hits++; log.push(['HIT', +(s.t - out.t0).toFixed(1), T.rung, e.zone, e.kind, e.carPart, e.bodyPart, Math.round(e.lost)].join(' ')); }
    if (e.type === 'fault') { out.faults++; if (e.red) out.faultsRed++; }
    if (e.type === 'impact' && !e.red && e.fault === 'car' && e.lost >= 1) out.whiteHits++;
    if (e.type === 'touch' && e.standstill) out.standstill++;
    if (e.type === 'learned') out.lessons.push(e.rung + '@' + Math.round(s.t - out.t0));
    if (e.type === 'duel-cleared') out.cleared = Math.round(s.t - out.t0);
  }
  T.duelFeed.length = 0;
}
out.rung = T.rung; out.incidents = (T.run.incidents || 0); out.secs = Math.round(s.t - (out.t0 || 0));
if (process.env.LOG) console.log(log.join('\n'));
console.log(JSON.stringify(out));
