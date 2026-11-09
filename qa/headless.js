// DUMMIES · Prototype 11 QA: the attack language (qa/pad.js) run headless on the story sim, at sim speed, for designing and
// tuning scripts before the browser runs them through the virtual pad. Same steps, same targets; the stick becomes the sim's
// analog command { mx, my }, A a dash press, X a cone press, KeyC a held duck, KeyR a restart.
//   node qa/headless.js TILE SCRIPT.json [secs]          → { cleared, t, result, faults, passes, findings }
//   require('./headless.js').run(tile, script, secs)
const path = require('path'), fs = require('fs'), Module = require('module');
const ROOT = path.resolve(__dirname, '..'), E = path.join(ROOT, 'engine', 'p9');
const res = Module._resolveFilename; Module._resolveFilename = function (req, parent, ...a) { if (req.startsWith('../p6/') || req.startsWith('../jump/')) req = path.join(E, path.basename(req)); return res.call(this, req, parent, ...a); };
let R = null, STORY = null, X = null, P11 = null;
function boot() {
  if (R) return; R = JSON.parse(fs.readFileSync(path.join(ROOT, 'engine', '.cache', 'runtime_p11.json'), 'utf8'));
  Object.assign(globalThis, { DUMMIES_STORY: R.story, DUMMIES_SIM: R.sim });
  X = globalThis.DUMMIES = require(path.join(E, 'sim.js')); globalThis.WORLD6 = require(path.join(E, 'world6.js'));
  STORY = globalThis.STORY = require(path.join(E, 'story7.js')); globalThis.DUMMIES_P10 = require(path.join(ROOT, 'engine', 'vendor', 'testroad.js'));
  Object.assign(globalThis, { DUMMIES_STAGES: R.stages, STORY_MAP1: R.plan, DUEL_RULES: R.rules, P11_PUZZLES: R.puzzles });
  require(path.join(ROOT, 'engine', 'duel.js')); require(path.join(ROOT, 'engine', 'p11.js')); P11 = globalThis.P11;
}
function make(tile) {
  boot(); const q = P11.BY[tile], pr = STORY.newProgress(); pr.done.monument = P11.ORDER.filter((t) => t !== tile);
  for (const k of q.kit || []) { const n = (R.rules.parts[k] || {}).p9; if (n) pr.owned[n] = true; }
  return new STORY.StorySim('monument', Object.assign({}, R.sim), pr);
}
function run(tile, script, secs, opts) {
  const s = make(tile), T = s.duelT, dt = 1 / 60, o = opts || {};
  const steps = []; const flat = (l) => { for (const x of l) { if (x.op === 'repeat') for (let i = 0; i < (x.n || 1); i++) flat(x.steps || []); else steps.push(x); } }; flat(script);
  const st = () => { const ln = T.redLanes.find((l) => l.i === T.DP['duel.route']) || T.redLanes[0], c = T.cars.find((q) => q.red && !q.ghost && !q.gone && !q.spent); return { ln, c, u: c && ln ? (c.s - ln.enterS) / (ln.exitS - ln.enterS) : null }; };
  const routePt = (z, u, side) => { const p = X.pathAt(z.ln.path, z.ln.enterS + (z.ln.exitS - z.ln.enterS) * Math.max(0, Math.min(1, u))); return { x: p.x + p.nx * (side || 0), y: p.y + p.ny * (side || 0) }; };
  const target = (z, t) => { if (!t) return null; if (Array.isArray(t)) return { x: t[0], y: t[1] }; if (t === 'car') return z.c ? { x: z.c.x, y: z.c.y } : null; if (t === 'drop') { const d = s.p11.q.layout && s.p11.q.layout.drop; return d ? { x: d[0], y: d[1] } : null; }
    if (t.route != null) return routePt(z, t.route, t.side); if (t.ahead != null) { if (!z.c) return null; const p = X.pathAt(z.c.path, Math.min(z.c.path.length - 1, z.c.s + t.ahead)); return { x: p.x + p.nx * (t.side || 0), y: p.y + p.ny * (t.side || 0) }; }
    if (t.cover != null) { const q = (T.level.statics || []).filter((w) => w.duel)[t.cover]; return q ? { x: q.x + q.w / 2 + (t.dx || 0), y: q.y + q.h / 2 + (t.dy || 0) } : null; } if (t.camera != null) { const k = (T.level.cameras || [])[t.camera]; return k ? { x: k[0] + (t.dx || 0), y: k[1] + (t.dy || 0) } : null; } if (t.cone != null) { const k = (s.cones || [])[t.cone]; return k ? { x: k.x, y: k.y } : null; } return null; };
  let i = 0, stepT = 0, duck = false, xUntil = -1, seed = 1, t = 0, cleared = null, faults = 0, k = 0, cmd = {}, held = { mx: 0, my: 0 }; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const stick = (a, m) => { held = { mx: Math.cos(a) * m, my: Math.sin(a) * m }; };
  for (; t < (secs || 90); t += dt, k++) {
    if (s.phase === 'brief') s.continueBrief(); if (s.phase === 'lesson') s.continueLesson();
    if ((s.p11 && s.p11.result) || s.phase === 'report' || s.phase === 'writeoff') { cleared = +t.toFixed(2); break; }
    let press = {};
    if (k % 3 === 0 && s.phase === 'play' && !s.rescue && i < steps.length) { // 20 Hz, as the browser runner
      const z = st(), q = steps[i], b = s.body, d3 = 3 * dt; stepT += d3; let next = false;
      switch (q.op) {
        case 'goto': { const p = target(z, q.to || [q.x, q.y]); if (!p) { next = stepT > 1; break; } const d = Math.hypot(p.x - b.x, p.y - b.y); if (d < (q.tol || 6) || stepT > (q.max || 10)) { held = { mx: 0, my: 0 }; next = true; } else stick(Math.atan2(p.y - b.y, p.x - b.x), Math.min(1, q.mag || (d < 30 ? Math.max(0.35, d / 30) : 1))); break; }
        case 'stick': stick((q.deg || 0) * Math.PI / 180, q.mag == null ? 1 : q.mag); next = stepT >= (q.secs || 1); break;
        case 'spin': stick(((q.deg0 || 0) + (q.rate || 360) * stepT) * Math.PI / 180, q.mag == null ? 1 : q.mag); next = stepT >= (q.secs || 2); break;
        case 'jitter': seed = q.seed || seed; stick(rnd() * Math.PI * 2, 0.3 + rnd() * 0.7); next = stepT >= (q.secs || 3); break;
        case 'wait': held = { mx: 0, my: 0 }; next = stepT >= (q.secs || 1); break;
        case 'waitCar': { held = { mx: 0, my: 0 }; const c = z.c; if (c && ((q.u != null && z.u >= q.u) || (q.near != null && Math.hypot(c.x - b.x, c.y - b.y) <= q.near) || (q.nose != null && q.at && (() => { const p = target(z, q.at); if (!p) return false; const pj = X.pathProject(c.path, p.x, p.y); const d = pj.s - (c.s + c.L / 2); return d <= q.nose && d > -(q.past || 10); })()))) next = true; if (stepT > (q.max || 30)) next = true; break; }
        case 'waitNew': { held = { mx: 0, my: 0 }; if (q._seq == null) q._seq = T.redSeq; if (T.redSeq !== q._seq && z.c && z.u != null && z.u < 0.3) { q._seq = null; next = true; } if (stepT > (q.max || 30)) { q._seq = null; next = true; } break; }
        case 'aim': { const p = target(z, q.at); if (p) stick(Math.atan2(p.y - b.y, p.x - b.x), q.mag || 1); else if (q.deg != null) stick(q.deg * Math.PI / 180, q.mag || 1); next = stepT >= (q.secs || 0.1); break; }
        case 'dash': { const p = target(z, q.at); if (p) stick(Math.atan2(p.y - b.y, p.x - b.x), 1); else if (q.deg != null) stick(q.deg * Math.PI / 180, 1); if (stepT >= 0.1) { press.aPress = true; next = true; } break; }
        case 'press': if (q.btn === 'A' || q.btn === 'RT') press.aPress = true; else if (q.btn === 'X') { press.xPress = true; xUntil = t + (q.secs || 0.12); } else if (q.btn === 'Y') press.yPress = true; else if (q.btn === 'B') press.bPress = true; next = true; break;
        case 'key': if (q.code === 'KeyR') s.restart && s.restart('R'); next = true; break;
        case 'hold': if (q.code === 'KeyC' || q.code === 'ControlLeft') duck = q.on !== false; next = true; break;
        case 'restart': s.restart && s.restart('R'); next = true; break;
        default: next = true;
      }
      if (next) { i++; stepT = 0; }
    }
    cmd = Object.assign({ mx: held.mx, my: held.my, duck, xHeld: t < xUntil }, press); // X held as the pad holds it
    const ev0 = s.events.length; s.step(cmd); for (let j = ev0; j < s.events.length; j++) if (s.events[j].type === 'fault') faults++;
    if (o.until && o.until(s)) break;
  }
  const p = s.p11;
  return { tile, cleared, t: +t.toFixed(1), step: i, of: steps.length, result: (s.p11 && s.p11.result) || null, progress: s.duelProgress ? s.duelProgress() : null, rung: T.rung, passes: p && p.passes, faults, body: [Math.round(s.body.x), Math.round(s.body.y)] };
}
module.exports = { run, make, boot };
if (require.main === module) { const sc = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')); console.log(JSON.stringify(run(process.argv[2], sc.script || sc, +(process.argv[4] || 90)))); }
