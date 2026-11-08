// Headless (node): Prototype 11's puzzles under simple strategies. One puzzle, one bot, N seconds of sim; then the facts a
// level designer needs: the tile's geometry (lanes, the red car's route, cover, cameras, cones, the drop point, the kit) and
// what each bot achieved (counted hits, hits at your fault, white hits, passes, time to the first counted hit, the clear).
// Bots: idle (stand at the drop point) · stand (walk to the route's lane nearest the drop and stand in it) · side (run or dash
// at the red car's flank: the move the fault rule refuses) · cutin (wait beside the road ahead of it; step or dash into its lane
// just ahead of its nose) · cover (the same from the spot its sensors and the cameras see least; ducked where Super Knees is in
// the kit). Any puzzle, built or not: it plays on its tile with its level, kit, rung and fleet.
//   node engine/p11_probe.js <tile A1..C3> <bot> [seconds]        (python3 engine/build_p9.py --p11 writes the runtime)
const path = require('path'), fs = require('fs'), Module = require('module');
const E = path.join(__dirname, 'p9');
const res = Module._resolveFilename; Module._resolveFilename = function (req, parent, ...a) { if (req.startsWith('../p6/') || req.startsWith('../jump/')) req = path.join(E, path.basename(req)); return res.call(this, req, parent, ...a); };
const R = JSON.parse(fs.readFileSync(path.join(__dirname, '.cache', 'runtime_p11.json'), 'utf8'));
Object.assign(globalThis, { DUMMIES_STORY: R.story, DUMMIES_SIM: R.sim });
const X = globalThis.DUMMIES = require(path.join(E, 'sim.js'));
globalThis.WORLD6 = require(path.join(E, 'world6.js'));
const STORY = globalThis.STORY = require(path.join(E, 'story7.js'));
globalThis.DUMMIES_P10 = require(path.join(__dirname, 'vendor', 'testroad.js'));
Object.assign(globalThis, { DUMMIES_STAGES: R.stages, STORY_MAP1: R.plan, DUEL_RULES: R.rules, P11_PUZZLES: R.puzzles });
require(path.join(__dirname, 'duel.js')); require(path.join(__dirname, 'p11.js'));
const P11 = globalThis.P11, tile = process.argv[2] || 'A1', bot = process.argv[3] || 'cutin', SECS = +(process.argv[4] || 90);
const q = P11.BY[tile], pr = STORY.newProgress(); pr.done.monument = P11.ORDER.filter((t) => t !== tile);
for (const k of q.kit || []) { const n = (R.rules.parts[k] || {}).p9; if (n) pr.owned[n] = true; }
const s = new STORY.StorySim('monument', Object.assign({}, R.sim), pr), T = s.duelT, P = s.P, r = P['body.radius'], rnd = (v) => Math.round(v);
if (process.env.RUNG) T.rung = +process.env.RUNG; // a check at another rung
const route = T.redLanes.find((l) => l.i === T.DP['duel.route']) || T.redLanes[0];
const geo = { tile, n: q.n, name: q.name, built: !!q.built, level: q.level, stage: q.stage, rung: T.rung, top: Math.round(T.DP['duel.topRung'] || 0), kit: q.kit, dash: s.dashFitted(), reach: rnd(s.reach()), duck: !!s.duelDuck,
  fleet: q.fleet, drop: [rnd(s.body.x), rnd(s.body.y)], route: route ? { from: [rnd(X.pathAt(route.path, route.enterS).x), rnd(X.pathAt(route.path, route.enterS).y)], to: [rnd(X.pathAt(route.path, route.exitS).x), rnd(X.pathAt(route.path, route.exitS).y)] } : null,
  lanes: T.redLanes.length, cover: T.level.statics.filter((c) => c.duel).map((c) => c.kind + (c.low ? '(low)' : '') + '@' + rnd(c.x + c.w / 2) + ',' + rnd(c.y + c.h / 2)),
  cameras: (T.level.cameras || []).map((c) => rnd(c[0]) + ',' + rnd(c[1])), cones: (s.cones || []).map((c) => rnd(c.x) + ',' + rnd(c.y)), decks: (T.duelSc.layers || []).filter((l) => l.inBand).length };
const out = { bot, secs: SECS, hits: 0, faults: 0, whiteHits: 0, standstill: 0, dashes: 0, passes: 0, firstHit: null, cleared: null, lessons: [], seenHits: 0 };
let cool = 0, plan = null, spot = null, t0 = null; const log = [];
// scripted checks (Edit 115): the intended move, set up by teleport, so the check is the move and not the walk to it
const HALF = P['world.deckWidth'] / 2, LW = P['world.laneWidth'], sc = T.duelSc;
const deck = (sc.layers || []).find((l) => l.dk && (l.gapSpans || []).length), gap = deck && deck.gapSpans[0], fi = deck ? sc.game.floors.findIndex((f) => f.layer === deck) : -1;
let seq = -1, k = 0, armed = false, broke = false; const TRIG = process.env.TRIG ? process.env.TRIG.split(',').map(Number) : [30, 60, 90, 120, 150, 180], ALONG = [20, 45, 70, 95, 120];
out.script = {};
const free = (x, y) => x > 24 && y > 24 && x < 776 && y < 616 && !T.level.statics.some((c) => !c.low && x > c.x - r - 4 && x < c.x + c.w + r + 4 && y > c.y - r - 4 && y < c.y + c.h + r + 4) && !(s.level.statics || []).some((c) => x > c.x - r - 4 && x < c.x + c.w + r + 4 && y > c.y - r - 4 && y < c.y + c.h + r + 4);
const toward = (x, y, b, dead) => { const dx = x - b.x, dy = y - b.y, m = Math.hypot(dx, dy); return m > (dead || 6) ? { mx: dx / m, my: dy / m } : {}; };
for (let i = 0; i < SECS * 60; i++) {
  if (s.phase === 'brief') s.continueBrief(); if (s.phase === 'lesson') s.continueLesson();
  if (s.duelDone) break;
  const b = s.body, c = T.cars.find((o) => o.red && !o.spent && o.wasOn); let cmd = {};
  if (t0 == null && s.phase === 'play' && !s.rescue) t0 = s.t;
  const newPass = (T.redSeq || 0) !== seq; if (newPass) { seq = T.redSeq || 0; k++; armed = false; }
  if (bot === 'drop' && b.alive && !s.rescue && s.phase === 'play') { // stand on the deck at its parapet gap; step off as the car's nose nears
    if (!deck || fi < 0) { out.script.drop = 'no gap on this tile'; break; }
    const vert = !deck.dk.hz, sd = gap.side, gx = vert ? deck.dk.off + sd * (HALF + 18) : (gap.a0 + gap.a1) / 2, gy0 = vert ? (gap.a0 + gap.a1) / 2 : deck.dk.off + sd * (HALF + 18);
    const pj = X.pathProject(route.path, gx, gy0), lane = X.pathAt(route.path, pj.s), ga = vert ? Math.max(gap.a0 + 3, Math.min(gap.a1 - 3, lane.y)) : Math.max(gap.a0 + 3, Math.min(gap.a1 - 3, lane.x));
    if (newPass || (b.level || 0) === 0 && b.mode !== 'drop' && !c) { const x = vert ? deck.dk.off + sd * (HALF - 26) : ga, y = vert ? ga : deck.dk.off + sd * (HALF - 26); Object.assign(b, { x, y, px: x, py: y, level: deck.z, floor: fi, mode: 'idle', vx: 0, vy: 0, lunge: null, drop: null }); armed = true; }
    const cc = T.cars.find((o) => o.red && !o.spent);
    if (armed && cc && (b.level || 0) > 0) { const D = TRIG[k % TRIG.length], land = X.pathProject(cc.path, gx, vert ? ga : gy0).s, nose = cc.s + cc.L / 2;
      if (land - nose <= D && land - nose > -20) cmd = vert ? { mx: sd, my: 0 } : { mx: 0, my: sd }; }
    out.script.drop = { gap: [Math.round(gx), Math.round(ga)], z: deck.z, trig: TRIG };
  } else if (bot === 'cone' && b.alive && !s.rescue && s.phase === 'play') { // a cone in its lane before it comes; stand in the other lane, past the cone
    if (newPass) { const sc0 = route.enterS + 0.5 * (route.exitS - route.enterS), cp = X.pathAt(route.path, sc0), cn = (s.cones || [])[0];
      if (cn) Object.assign(cn, { x: cp.x, y: cp.y, vx: 0, vy: 0, state: 'free', flightT: 0 });
      const al = ALONG[k % ALONG.length], q = X.pathAt(route.path, sc0 + al), other = route.path.edges[1] > LW ? 1 : -1, x = q.x + q.nx * other * LW, y = q.y + q.ny * other * LW;
      const wx = q.x + q.nx * other * (LW * 1.5 + 30), wy = q.y + q.ny * other * (LW * 1.5 + 30); spot = { x, y, sc0, al };
      Object.assign(b, { x: wx, y: wy, px: wx, py: wy, vx: 0, vy: 0, level: 0, floor: null, mode: 'idle' }); out.script.cone = { cone: [Math.round(cp.x), Math.round(cp.y)], along: ALONG, trig: TRIG, other };
      if (!cn) out.script.cone = 'no cone on this tile'; }
    const cc = T.cars.find((o) => o.red && !o.spent);
    if (spot && cc && spot.sc0 - (cc.s + cc.L / 2) <= TRIG[k % TRIG.length]) cmd = toward(spot.x, spot.y, b, 3);
  } else if ((bot === 'spring' || bot === 'conewalk') && b.alive && !s.rescue && s.phase === 'play' && (b.level || 0) === 0) { // hide behind the tall piece; spring (dash) or walk in as its nose nears
    const cam = (T.level.cameras || [])[0], tall = (sc.duelCover || []).find((q) => !q.low);
    if (!tall) { out.script[bot] = 'no tall cover'; break; }
    if (bot === 'spring' && cam && s.p11 && s.p11.q.breakableCameras && !s.p11.broken.length) { // the camera first, as the camera bot
      if (b.mode !== 'lunge') { const pj = X.pathProject(route.path, cam[0], cam[1]), sg = pj.lat >= 0 ? 1 : -1, q = X.pathAt(route.path, pj.s), x = cam[0] + q.nx * sg * 40, y = cam[1] + q.ny * sg * 40;
        Object.assign(b, { x, y, px: x, py: y, vx: 0, vy: 0 }); const dx = cam[0] - x, dy = cam[1] - y, m = Math.hypot(dx, dy); cmd = { mx: dx / m, my: dy / m, aPress: cool <= 0 }; if (cool <= 0) cool = 40; }
    } else {
      const cx = tall.x + tall.w / 2, cy = tall.y + tall.h / 2, pj = X.pathProject(route.path, cx, cy), sg = pj.lat >= 0 ? 1 : -1, q = X.pathAt(route.path, pj.s), back = Math.abs(pj.lat) + (q.nx * q.nx > q.ny * q.ny ? tall.w : tall.h) / 2 + 16;
      if (newPass || !armed) { const x = q.x + q.nx * sg * back, y = q.y + q.ny * sg * back; Object.assign(b, { x, y, px: x, py: y, vx: 0, vy: 0, mode: 'idle', duck: !!s.duelDuck }); armed = true;
        if (bot === 'conewalk' && (s.cones || [])[0]) { const cp = X.pathAt(route.path, pj.s - 50); Object.assign(s.cones[0], { x: cp.x, y: cp.y, vx: 0, vy: 0, state: 'free', flightT: 0 }); } }
      const cc = T.cars.find((o) => o.red && !o.spent), D = TRIG[k % TRIG.length];
      if (cc && armed && pj.s - (cc.s + cc.L / 2) <= D && pj.s - (cc.s + cc.L / 2) > -30) {
        if (bot === 'spring') { const t = X.pathAt(route.path, pj.s + 10), dx = t.x - b.x, dy = t.y - b.y, m = Math.hypot(dx, dy); cmd = { mx: dx / m, my: dy / m, aPress: cool <= 0 && b.mode !== 'lunge' }; if (cmd.aPress) { cool = 60; out.dashes++; } }
        else { const other = route.path.edges[1] > LW ? 1 : -1, t = X.pathAt(route.path, pj.s), x = t.x + t.nx * other * LW, y = t.y + t.ny * other * LW; cmd = toward(x, y, b, 3); }
      } else if (s.duelDuck && !(cc && pj.s - (cc.s + cc.L / 2) <= D)) cmd = { duck: true };
      out.script[bot] = { piece: tall.kind + '@' + Math.round(cx) + ',' + Math.round(cy), trig: TRIG, broken: s.p11 ? s.p11.broken.length : 0 };
    }
  } else if (b.alive && !s.rescue && s.phase === 'play' && (b.level || 0) === 0 && bot === 'camera' && !broke) { // break the camera post while the car is away
    const cam = (T.level.cameras || [])[0], away = !T.cars.some((o) => o.red && !o.spent && o.wasOn);
    if (!cam) { broke = true; out.script.camera = 'no camera'; }
    else if (b.mode !== 'lunge') { const pj = X.pathProject(route.path, cam[0], cam[1]), sg = pj.lat >= 0 ? 1 : -1, q = X.pathAt(route.path, pj.s), x = cam[0] + q.nx * sg * 40, y = cam[1] + q.ny * sg * 40;
      Object.assign(b, { x, y, px: x, py: y, vx: 0, vy: 0 }); const dx = cam[0] - x, dy = cam[1] - y, m = Math.hypot(dx, dy); cmd = { mx: dx / m, my: dy / m, aPress: cool <= 0 }; if (cool <= 0) cool = 40; }
    if (s.p11 && s.p11.broken.length) { broke = true; out.script.camera = 'broken at ' + (s.t - (t0 || s.t)).toFixed(1) + ' s'; }
  } else
  if (b.alive && !s.rescue && s.phase === 'play' && (b.level || 0) === 0 && bot !== 'idle') {
    if (bot === 'stand') { // the obvious move: stand in its lane
      if (!spot && route) { let best = null; for (let u = route.enterS + 120; u <= route.exitS - 120; u += 10) { const p = X.pathAt(route.path, u), d = Math.hypot(p.x - geo.drop[0], p.y - geo.drop[1]); if (!best || d < best.d) best = { x: p.x, y: p.y, d }; } spot = best; }
      if (spot && !(c && Math.hypot(c.x - b.x, c.y - b.y) < 70)) cmd = toward(spot.x, spot.y, b, 3);
    } else if (c && bot === 'side') { // into its flank
      const ca = Math.cos(c.h), sa = Math.sin(c.h), rel = { f: (b.x - c.x) * ca + (b.y - c.y) * sa, l: Math.abs((b.x - c.x) * -sa + (b.y - c.y) * ca) };
      cmd = toward(c.x, c.y, b, 2);
      if (cool <= 0 && s.dashFitted() && rel.f > -c.L / 2 && rel.f < c.L / 2 && rel.l < c.W / 2 + 110) { cmd.aPress = true; cool = 60; out.dashes++; }
    } else if (c) { // cutin, cover
      const R1 = s.reach() * Math.max(0.2, s.underfoot('lunge')), nose = c.s + c.L / 2;
      if (!plan || plan.car !== c.id || plan.Ls < nose - 20) {
        plan = null; const pj = X.pathProject(c.path, b.x, b.y);
        let best = null; const duck = !!s.duelDuck, TB = T.body, keep = { x: TB.x, y: TB.y, duck: TB.duck };
        const seen = (x, y, Ls) => { let n = 0, k = 0; TB.x = x; TB.y = y; TB.duck = duck;
          try { for (let u = Ls - 480; u <= Ls - 120; u += 60) { if (u < 0) continue; const p = X.pathAt(c.path, u); k++; if (T.carSees(c, p.x, p.y, false)) n++; } if (T.rung >= 4 && T.seeingCamera()) n = k; } finally { TB.x = keep.x; TB.y = keep.y; TB.duck = keep.duck; }
          return k ? n / k : 1; };
        for (let Ls = Math.max(nose + 260, pj.s - 300); Ls <= Math.min(c.path.cum ? c.path.cum[c.path.cum.length - 1] - 30 : 1e9, pj.s + 500); Ls += 40) {
          const L = X.pathAt(c.path, Ls); if (L.x < 20 || L.x > 780 || L.y < 20 || L.y > 620) continue;
          for (const off of [70, 90, 110, 130, 150]) for (const sd of [1, -1]) {
            const al = Math.sqrt(Math.max(0, R1 * R1 - off * off)) * 0.92, p = X.pathAt(c.path, Ls - al), x = p.x + p.nx * sd * off, y = p.y + p.ny * sd * off;
            if (!free(x, y)) continue;
            const v = bot === 'cover' || bot === 'camera' ? seen(x, y, Ls) : 0, cost = v * 400 + Math.hypot(x - b.x, y - b.y) * 0.5;
            if (!best || cost < best.cost) best = { car: c.id, Ls, x, y, lx: L.x, ly: L.y, cost, v }; } }
        plan = best || { car: c.id, Ls: -1e9 };
      }
      if (plan.x != null) {
        const dx = plan.x - b.x, dy = plan.y - b.y, m = Math.hypot(dx, dy), gap = plan.Ls - nose;
        if (!s.dashFitted()) { if (gap <= c.v * 2.2 + 30) cmd = toward(plan.lx, plan.ly, b, 4); else if (m > 6) cmd = { mx: dx / m, my: dy / m }; }
        else if (m > 6) cmd = { mx: dx / m, my: dy / m }; else if (s.duelDuck) cmd = { duck: true };
        if (m < 14 && cool <= 0 && s.dashFitted() && gap <= c.v * 0.42 + 10 && gap > 0) { const ex = plan.lx - b.x, ey = plan.ly - b.y, mm = Math.hypot(ex, ey); cmd = { mx: ex / mm, my: ey / mm, aPress: true }; cool = 60; out.dashes++; }
      }
    }
  }
  cool--;
  const e0 = s.events.length; s.step(cmd);
  for (const e of s.events.slice(e0)) {
    const at = t0 == null ? 0 : +(s.t - t0).toFixed(1);
    if (e.type === 'impact' && e.red && e.lost >= 10 && e.fault === 'car') { out.hits++; if (out.firstHit == null) out.firstHit = at; if (e.grade === 'seen') out.seenHits++; log.push(['HIT', at, 'rung', T.rung, e.zone, e.kind, e.grade || ''].join(' ')); }
    if (e.type === 'fault') out.faults++;
    if (e.type === 'impact' && !e.red && e.fault === 'car' && e.lost >= 1) out.whiteHits++;
    if (e.type === 'touch' && e.standstill) out.standstill++;
    if (e.type === 'learned') out.lessons.push(e.rung + '@' + at);
    if (e.type === 'duel-cleared') out.cleared = at;
  }
  T.duelFeed.length = 0;
  if (process.env.TRACE && i % 15 === 0 && i < 60 * 12) { const cam = (T.level.cameras || [])[0], rc = T.cars.find((o) => o.red); console.log(i, (s.t - (t0 || s.t)).toFixed(1), s.phase, s.rescue ? "rescue" : "", "body", Math.round(b.x), Math.round(b.y), b.level, b.mode, "cam", cam ? Math.round(Math.hypot(b.x - cam[0], b.y - cam[1])) : "-", "red", rc ? Math.round(rc.x) + "," + Math.round(rc.y) + " v" + Math.round(rc.v) + " " + (rc.cause || "") + (rc.wasOn ? " on" : "") : "-", "cmd", JSON.stringify(cmd), "broken", s.p11 ? s.p11.broken.length : "-"); }
}
out.passes = s.p11 ? s.p11.passes : null; out.endRung = T.rung;
if (process.env.LOG) console.log(log.join('\n'));
console.log(JSON.stringify(process.argv.includes('--geo') ? { geo, out } : { tile, out }));
