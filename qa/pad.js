/* DUMMIES · Prototype 11 adversarial QA: injected before the game's scripts (Playwright addInitScript).
   1 A virtual standard gamepad. navigator.getGamepads() returns it; the game reads it through pads.js like a real pad. The left
     stick is analog: any angle, any magnitude (360°, not the keyboard's eight directions).
   2 A monitor at 10 Hz on the game's state. It changes nothing. It records page errors, NaN, the dummy outside its tile or inside a
     solid, stuck phases, a red car that never comes back, scoring at the dummy's fault, and each screen visited.
   3 A script runner: a small attack language (window.__qaRun(script)) that steers the virtual stick and buttons from the game's
     state, as a player with perfect timing would. It reads the sim; it acts only through the pad and the keyboard. */
(function () {
  'use strict';
  const BTN = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, SELECT: 8, START: 9, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 };
  const pad = { x: 0, y: 0, btn: new Array(17).fill(0), ts: 0, on: true };
  const snap = () => ({ id: 'QA virtual pad (STANDARD GAMEPAD Vendor: 045e Product: 02ea)', index: 0, connected: pad.on, mapping: 'standard', timestamp: ++pad.ts,
    axes: [pad.x, pad.y, 0, 0], buttons: pad.btn.map((v) => ({ pressed: v > 0.5, touched: v > 0, value: v })), vibrationActuator: null });
  try { Object.defineProperty(Navigator.prototype, 'getGamepads', { value: function () { return pad.on ? [snap(), null, null, null] : [null, null, null, null]; }, configurable: true }); } catch (e) { /* none */ }
  const key = (code, down) => window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', { code, key: code, bubbles: true }));
  const QA = window.__qa = { pad, BTN, findings: [], screens: {}, log: [], trace: [], t0: Date.now(), errors: [] };
  window.addEventListener('error', (e) => QA.errors.push({ t: (Date.now() - QA.t0) / 1000, msg: String(e.message || e) }));
  window.addEventListener('unhandledrejection', (e) => QA.errors.push({ t: (Date.now() - QA.t0) / 1000, msg: 'rejection: ' + String(e.reason) }));
  const seen = new Set();
  function find(kind, data, sev) { const k = kind + ':' + (data.key || ''); if (seen.has(k)) { const f = QA.findings.find((q) => q.k === k); if (f) f.n++; return; } seen.add(k); QA.findings.push(Object.assign({ k, kind, sev: sev || 'major', n: 1, t: +((Date.now() - QA.t0) / 1000).toFixed(1) }, data)); }
  QA.find = find;

  // ---------- the monitor
  let last = { screen: null, phase: null, since: 0, pos: null, still: 0, noRed: 0, rescue: 0, events: 0 };
  function geo(s) { const T = s.duelT; return T && T.level ? T.level.statics || [] : []; }
  function inSolid(s, b) { const r = s.P['body.radius'] - 4; for (const q of geo(s)) { if (q.low || q.walk) continue; if (b.x > q.x - r && b.x < q.x + q.w + r && b.y > q.y - r && b.y < q.y + q.h + r) { const dx = Math.max(q.x - b.x, 0, b.x - q.x - q.w), dy = Math.max(q.y - b.y, 0, b.y - q.y - q.h); if (Math.hypot(dx, dy) < r) return q; } } return null; }
  setInterval(() => {
    const app = window.__dummies; if (!app) return;
    const now = (Date.now() - QA.t0) / 1000, s = app.sim, scr = app.screen + (s && app.screen === 'game' ? ':' + s.phase : '');
    QA.screens[scr] = (QA.screens[scr] || 0) + 1;
    if (scr !== last.screen) { QA.log.push({ t: +now.toFixed(1), screen: scr, puzzle: s && s.p11 ? s.p11.q.tile : null }); last.screen = scr; last.since = now; }
    if (!s || app.screen !== 'game' || !s.body) return;
    const b = s.body, T = s.duelT, tile = s.p11 ? s.p11.q.tile : null, ph = s.phase;
    if ([b.x, b.y].some((v) => !Number.isFinite(v))) find('nan-body', { key: tile, tile }, 'blocker');
    if (T) for (const c of T.cars) if ([c.x, c.y].some((v) => !Number.isFinite(v))) find('nan-car', { key: tile + c.id, tile }, 'blocker');
    if (ph === 'play' && !s.rescue && b.alive) {
      const W = s.P['world.width'] || 800, H = s.P['world.height'] || 640;
      if (b.x < -2 || b.y < -2 || b.x > W + 2 || b.y > H + 2) find('off-tile', { key: tile + Math.round(b.x / 40) + ',' + Math.round(b.y / 40), tile, x: Math.round(b.x), y: Math.round(b.y) }, 'blocker');
      if (s.screenName && s.p11 && s.screenName() !== tile) find('crossed-fence', { key: tile + s.screenName(), tile, to: s.screenName(), x: Math.round(b.x), y: Math.round(b.y) }, 'blocker');
      const q = !b.z && !b.air && !b.lunge && !(b.level > 0) && !b.stair && b.mode !== 'drop' ? inSolid(s, b) : null; // ground only: on a deck or a stair the columns are below you if (q) find('inside-solid', { key: tile + q.kind + Math.round(q.x), tile, solid: q.kind, x: Math.round(b.x), y: Math.round(b.y), layer: b.layer || 0 }, 'major');
      const mv = Math.hypot(pad.x, pad.y) > 0.5, p = last.pos; if (mv && p && Math.hypot(b.x - p.x, b.y - p.y) < 0.5) last.still += 0.1; else last.still = 0; last.pos = { x: b.x, y: b.y };
      if (last.still > 4) { find('pinned', { key: tile + Math.round(b.x / 20) + ',' + Math.round(b.y / 20), tile, x: Math.round(b.x), y: Math.round(b.y), stick: [+pad.x.toFixed(2), +pad.y.toFixed(2)] }, 'minor'); last.still = 0; }
      const red = T && T.cars.some((c) => c.red && !c.gone && !c.ghost); last.noRed = red ? 0 : last.noRed + 0.1;
      if (last.noRed > 25) { find('no-red-car', { key: tile, tile, secs: 25 }, 'major'); last.noRed = 0; }
      if (QA.trace.length < 20000 && Math.round(now * 10) % 5 === 0) QA.trace.push([+now.toFixed(1), Math.round(b.x), Math.round(b.y)]);
    }
    last.rescue = s.rescue ? last.rescue + 0.1 : 0; if (last.rescue > 15) { find('rescue-stuck', { key: tile, tile }, 'blocker'); last.rescue = 0; }
    if (ph === 'writeoff' || ph === 'report' || ph === 'lesson' || ph === 'brief') { if (now - last.since > 90 && ph === 'writeoff') find('phase-stuck', { key: tile + ph, tile, phase: ph }, 'blocker'); }
    const ev = s.events || [], fresh = ev.slice(Math.min(last.events, ev.length)), prog = s.duelProgress ? s.duelProgress() : 0; // progress up in a tick that only saw a fault: scored at the dummy's fault
    if (last.prog != null && prog > last.prog && fresh.some((e) => e.type === 'fault') && last.tile === tile) find('fault-scored', { key: tile + prog, tile, progress: prog }, 'blocker');
    last.events = ev.length; last.prog = prog; last.tile = tile;
  }, 100);

  // ---------- the attack language
  const ang = (dx, dy) => Math.atan2(dy, dx), D = Math.PI / 180;
  function state() {
    const app = window.__dummies, s = app && app.sim; if (!s || !s.duelT) return null;
    const T = s.duelT, ln = T.redLanes.find((l) => l.i === T.DP['duel.route']) || T.redLanes[0], c = T.cars.find((q) => q.red && !q.ghost && !q.gone && !q.spent);
    return { app, s, T, b: s.body, ln, c, u: c && ln ? (c.s - ln.enterS) / (ln.exitS - ln.enterS) : null, X: window.DUMMIES };
  }
  function routePt(st, u, side) { const X = st.X, ln = st.ln, p = X.pathAt(ln.path, ln.enterS + (ln.exitS - ln.enterS) * Math.max(0, Math.min(1, u))); return { x: p.x + p.nx * (side || 0), y: p.y + p.ny * (side || 0) }; }
  function aheadPt(st, ahead, side) { const X = st.X, c = st.c; if (!c) return null; const p = X.pathAt(c.path, Math.min(c.path.length - 1, c.s + ahead)); return { x: p.x + p.nx * (side || 0), y: p.y + p.ny * (side || 0) }; }
  function target(st, t) { if (!t) return null; if (Array.isArray(t)) return { x: t[0], y: t[1] }; if (t === 'car') return st.c ? { x: st.c.x, y: st.c.y } : null; if (t === 'drop') return st.s.p11 && st.s.p11.q.layout && st.s.p11.q.layout.drop ? { x: st.s.p11.q.layout.drop[0], y: st.s.p11.q.layout.drop[1] } : null;
    if (t.route != null) return routePt(st, t.route, t.side); if (t.ahead != null) return aheadPt(st, t.ahead, t.side); if (t.cover != null) { const q = (st.T.level.statics || []).filter((o) => o.duel)[t.cover]; return q ? { x: q.x + q.w / 2 + (t.dx || 0), y: q.y + q.h / 2 + (t.dy || 0) } : null; } if (t.camera != null) { const k = (st.T.level.cameras || [])[t.camera]; return k ? { x: k[0] + (t.dx || 0), y: k[1] + (t.dy || 0) } : null; } if (t.cone != null) { const k = (st.s.cones || [])[t.cone]; return k ? { x: k.x, y: k.y } : null; } return null; }
  const setStick = (a, m) => { pad.x = Math.cos(a) * m; pad.y = Math.sin(a) * m; };
  QA.press = (name, secs) => { const i = BTN[name]; if (i == null) return; pad.btn[i] = 1; setTimeout(() => { pad.btn[i] = 0; }, (secs || 0.12) * 1000); };
  QA.key = (code, secs) => { key(code, true); setTimeout(() => key(code, false), (secs || 0.12) * 1000); };
  QA.hold = (code, on) => key(code, on);
  // a script: [{op, ...}]. Runs at 20 Hz. Returns a promise of { done, steps, reason }.
  QA.run = window.__qaRun = function (script, maxSecs) {
    const steps = []; const flat = (l) => { for (const x of l) { if (x.op === 'repeat') for (let i = 0; i < (x.n || 1); i++) flat(x.steps || []); else steps.push(x); } }; flat(script || []);
    return new Promise((res) => {
      let i = 0, t = 0, dt = 0.05, stepT = 0, held = new Set(), r = Math.random, seed = 1; const t0 = Date.now(), done = (reason) => { clearInterval(iv); pad.x = pad.y = 0; for (const k of held) key(k, false); res({ reason, step: i, of: steps.length, secs: (Date.now() - t0) / 1000 }); };
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const iv = setInterval(() => {
        if ((Date.now() - t0) / 1000 > (maxSecs || 240)) return done('timeout');
        const st = state(); if (!st) return; const app = st.app, s = st.s;
        if (app.screen !== 'game') return done('left play: ' + app.screen);
        if (s.phase === 'report' || s.phase === 'writeoff') { if (!steps.slice(i).some((q) => q.through)) return done('cleared'); }
        if (s.phase === 'lesson') { pad.x = pad.y = 0; if (Math.round((Date.now() - t0) / 50) % 16 === 0) QA.press('A'); return; } // a mid-puzzle lesson (the boss): A through it, as a player does (QA-01 was this)
        if (s.phase !== 'play' || s.rescue || app.paused) { pad.x = pad.y = 0; return; }
        if (i >= steps.length) return done('end');
        const q = steps[i], b = st.b; stepT += dt; let next = false;
        switch (q.op) {
          case 'goto': { const p = target(st, q.to || [q.x, q.y]); if (!p) { next = stepT > 1; break; } const d = Math.hypot(p.x - b.x, p.y - b.y); if (d < (q.tol || 6) || stepT > (q.max || 10)) { pad.x = pad.y = 0; next = true; } else setStick(ang(p.x - b.x, p.y - b.y), Math.min(1, q.mag || (d < 30 ? Math.max(0.35, d / 30) : 1))); break; }
          case 'stick': setStick((q.deg || 0) * D, q.mag == null ? 1 : q.mag); next = stepT >= (q.secs || 1); break;
          case 'spin': setStick(((q.deg0 || 0) + (q.rate || 360) * stepT) * D, q.mag == null ? 1 : q.mag); next = stepT >= (q.secs || 2); break;
          case 'circle': { const c = target(st, q.at || [q.x, q.y]) || b, a = ang(b.x - c.x, b.y - c.y) + (q.dir || 1) * Math.PI / 2, rr = Math.hypot(b.x - c.x, b.y - c.y), corr = ((q.r || 40) - rr) * 0.03; setStick(a - (q.dir || 1) * corr, q.mag || 1); next = stepT >= (q.secs || 4); break; }
          case 'jitter': if (Math.round(stepT / dt) % Math.max(1, Math.round((q.every || 0.15) / dt)) === 0) { seed = q.seed || seed; setStick(rnd() * Math.PI * 2, 0.3 + rnd() * 0.7); if (q.buttons && rnd() < 0.2) QA.press(q.buttons[Math.floor(rnd() * q.buttons.length)]); } next = stepT >= (q.secs || 3); break;
          case 'wait': pad.x = pad.y = 0; next = stepT >= (q.secs || 1); break;
          case 'waitCar': { pad.x = pad.y = 0; const c = st.c; if (c && ((q.u != null && st.u >= q.u) || (q.near != null && Math.hypot(c.x - b.x, c.y - b.y) <= q.near) || (q.nose != null && q.at && (() => { const p = target(st, q.at); if (!p) return false; const pj = st.X.pathProject(c.path, p.x, p.y); const d = pj.s - (c.s + c.L / 2); return d <= q.nose && d > -(q.past || 10); })()))) next = true; if (stepT > (q.max || 30)) next = true; break; } // nose: the car's nose within this many units (along its lane) of the point `at`
          case 'waitNew': { pad.x = pad.y = 0; if (q._seq == null) q._seq = st.T.redSeq; if (st.T.redSeq !== q._seq && st.c && st.u != null && st.u < 0.3) { q._seq = null; next = true; } if (stepT > (q.max || 30)) { q._seq = null; next = true; } break; }
          case 'press': QA.press(q.btn, q.secs); next = true; break;
          case 'key': QA.key(q.code, q.secs); next = true; break;
          case 'hold': key(q.code, q.on !== false); if (q.on !== false) held.add(q.code); else held.delete(q.code); next = true; break;
          case 'aim': { const p = target(st, q.at); if (p) setStick(ang(p.x - b.x, p.y - b.y), q.mag || 1); else if (q.deg != null) setStick(q.deg * D, q.mag || 1); next = stepT >= (q.secs || 0.1); break; }
          case 'dash': { const p = target(st, q.at); if (p) setStick(ang(p.x - b.x, p.y - b.y), 1); else if (q.deg != null) setStick(q.deg * D, 1); if (stepT >= 0.1) { QA.press('A'); next = true; } break; }
          case 'restart': QA.key('KeyR'); next = true; break;
          case 'pause': QA.press('START'); next = stepT >= (q.secs || 0.3); break;
          default: next = true;
        }
        if (next) { i++; stepT = 0; }
      }, 50);
    });
  };
  // the tile as the attacker sees it: solids, decks and their gaps, the route, cover, cameras, cones, the drop
  QA.geo = function () {
    const st = state(); if (!st) return null; const T = st.T, s = st.s, R = (v) => Math.round(v);
    const route = []; for (let u = 0; u <= 1.0001; u += 0.1) { const p = routePt(st, u, 0); route.push([R(p.x), R(p.y)]); }
    return { tile: s.p11 && s.p11.q.tile, name: s.p11 && s.p11.q.name, rung: T.rung, kit: s.p11 && s.p11.q.kit, body: [R(st.b.x), R(st.b.y)], route, laneWidth: s.P['world.laneWidth'],
      solids: (T.level.statics || []).map((q) => ({ kind: q.kind, x: R(q.x), y: R(q.y), w: R(q.w), h: R(q.h), low: !!q.low, cover: !!q.duel })).slice(0, 80),
      decks: (T.duelSc.layers || []).filter((l) => l.dk).map((l) => { const dk = l.dk, P = s.P, W = P['world.width'] || 800, H = P['world.height'] || 640, HALF = (P['world.deckWidth'] || 160) / 2; return { z: dk.z, runs: dk.hz ? 'east-west' : 'north-south', rect: dk.hz ? [0, R(dk.off - HALF), W, R(2 * HALF)] : [R(dk.off - HALF), 0, R(2 * HALF), H], dropGaps: (dk.gaps || []).map((g) => [R(g[0]), R(g[1])]), stairOpenings: (dk.openings || []).map((g) => [R(g[0]), R(g[1])]), note: 'gaps and openings are spans along the deck (y for north-south, x for east-west)' }; }),
      stairs: ((T.duelSc.game && T.duelSc.game.stairs) || []).map((q) => ({ x: R(q.x), y: R(q.y), w: R(q.w), h: R(q.h), axis: q.axis, groundEnd: R(q.low), deckEnd: R(q.high), from: q.from, to: q.to, note: 'walk along the axis from the ground end to the deck end to climb' })),
      cameras: (T.level.cameras || []).map((c) => [R(c[0]), R(c[1])]), cones: (s.cones || []).map((c) => [R(c.x), R(c.y)]), objective: s.p11 && s.p11.q.objective };
  };
})();
