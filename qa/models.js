// DUMMIES · FINAL V3.1 (Edit 128): each model's own suite, headless. Staged scenes, one check each:
//   field   the learner's field values (forward cone, side zones, notice) per model
//   senior  the senior sees with its model's cones: ahead yes, beside yes, behind only for the Vanguard™ (its pods reach 150°)
//   rung 6  RAP SHEET (Vanguard™) crawls past a remembered spot; PACE NOTES (Genesis™) lifts early and moves its line across
//   rung 7  MANHUNT (Vanguard™) turns round and drives back to the ghost; RECON LAP (Genesis™) never stops, its next pass slow
//   node qa/models.js   → one line a check; 'fails: 0' passes
const H = require('./headless.js'); H.boot(); const X = globalThis.DUMMIES, DUEL = globalThis.DUEL;
const out = []; let fails = 0; const ok = (name, pass, info) => { out.push((pass ? 'ok   ' : 'FAIL ') + name + (info ? '  ' + info : '')); if (!pass) fails++; };
function fresh(tile) { const s = H.make(tile); let n = 0; while ((s.rescue || s.phase !== 'play') && n < 3000) { if (s.phase === 'brief') s.continueBrief(); s.step({}); n++; } return s; }
const park = (s, x, y) => Object.assign(s.body, { x, y, px: x, py: y, vx: 0, vy: 0, mode: 'idle' });
const red = (T) => T.cars.find((c) => c.red && !c.gone && !c.ghost);
function waitRed(s, secs) { const T = s.duelT; for (let i = 0; i < secs * 60; i++) { const c = red(T); if (c && c.x > 40 && c.x < 760 && c.y > 40 && c.y < 600) return c; s.step({}); } return red(T); }
// field
for (const [tile, cls, A, R] of [['monument:A2', 'LUMINARY', 10, 340], ['parkland:A2', 'VANGUARD', 16, 280], ['waterfront:A2', 'GENESIS', 6, 460]]) { const T = fresh(tile).duelT;
  ok('field ' + cls, T.learnerCls === cls && T.P['perception.forwardConeAngle'] === A && T.P['perception.coneRadius'] === R, `cone ±${T.P['perception.forwardConeAngle']}° to ${T.P['perception.coneRadius']}; sides ${T.sideEdges().map((v) => Math.round(v)).join('–')}° to ${Math.round(T.coneReach().s)}; notice ${T.P['perception.sideNoticeSeconds']} s`); }
// senior: a fake car on the senior's model at (400, 320) heading east; points around it
for (const [tile, cls] of [['parkland:A2', 'LUMINARY'], ['waterfront:A2', 'VANGUARD']]) { const T = fresh(tile).duelT, c = { x: 400, y: 320, h: 0, L: 44, W: 20 };
  const at = (deg, d) => T.seniorCone(c, 400 + Math.cos(deg * Math.PI / 180) * d, 320 + Math.sin(deg * Math.PI / 180) * d);
  const ahead = at(0, 200), beside = at(70, 100), behind = at(130, 100), far = at(70, 260);
  ok('senior ' + cls, T.seniorCls === cls && ahead === 'forward' && beside === 'side' && behind === (cls === 'VANGUARD' ? 'side' : null) && far === null, `ahead ${ahead}, beside ${beside}, behind (130°) ${behind}, beside far ${far}`); }
// rung 6: a remembered spot beside the red route, sprung from cover; the dummy away
for (const [tile, cls, share] of [['parkland:A3', 'VANGUARD', 'perception.sideCloseSpeed'], ['waterfront:A3', 'GENESIS', 'perception.sideWarySpeed']]) { const s = fresh(tile), T = s.duelT; park(s, 760, 600);
  const c0 = waitRed(s, 20); if (!c0) { ok('rung 6 ' + cls, false, 'no red car'); continue; } const ln = T.redLanes.find((l) => l.path === c0.path), sm = ln.enterS + (ln.exitS - ln.enterS) * 0.7, p = X.pathAt(c0.path, sm);
  T.rung = 6; T.crashes.push({ n: 1, x: p.x, y: p.y, ox: p.x + p.nx * 70, oy: p.y + p.ny * 70, cover: 'test', t: T.t }); let vmin = 1e9, dmax = 0, pace = 0; const em = T.emit; T.emit = function (ty, d) { if (ty === 'pace') pace++; return em.call(this, ty, d); };
  for (let i = 0; i < 60 * 12; i++) { s.step({}); const c = red(T); if (!c || c !== c0) break; const ah = sm - (c.s + c.L / 2); if (ah < 100 && ah > -c.L) vmin = Math.min(vmin, c.v); dmax = Math.max(dmax, Math.abs(c.d || 0)); }
  const cap = c0.cruise * T.P[share]; ok('rung 6 ' + cls, vmin <= cap + 3 && (cls === 'VANGUARD' || pace >= 0), `speed by the spot ${Math.round(vmin)} (cap ${Math.round(cap)} of ${Math.round(c0.cruise)}); line moved ${Math.round(dmax)} px; pace ${pace}`); }
// rung 7 MANHUNT: the ghost behind the Vanguard™
{ const s = fresh('parkland:C3'), T = s.duelT; park(s, 760, 600); T.rung = 7; T.P['duel.searchSeconds'] = 7; const c = waitRed(s, 20);
  if (!c) ok('rung 7 MANHUNT', false, 'no red car'); else { for (let i = 0; i < 60 && c.s < 300; i++) s.step({}); const back = X.pathAt(c.path, c.s - 120); c.lkp = { x: back.x + back.nx * 60, y: back.y + back.ny * 60, t0: T.t, had: T.t };
    let turned = null, nearest = 1e9; const path0 = c.path; for (let i = 0; i < 60 * 8; i++) { s.step({}); if (c.path !== path0 && !turned) turned = T.t; if (turned && c.lkp) nearest = Math.min(nearest, Math.hypot(c.x - c.lkp.x, c.y - c.lkp.y)); if (c.gone) break; }
    ok('rung 7 MANHUNT', !!turned && nearest < 140, `u-turn ${turned ? 'yes' : 'no'}; closest to the ghost after it ${Math.round(nearest)} px`); } }
// rung 7 RECON LAP: the next pass after a lost one
{ const s = fresh('waterfront:C3'), T = s.duelT; park(s, 760, 600); T.rung = 7; const c0 = waitRed(s, 20); T.reconNext = { x: 400, y: 120 };
  for (let i = 0; i < 60 * 30; i++) { s.step({}); const c = red(T); if (c && c !== c0 && c.recon) break; } const c = red(T);
  ok('rung 7 RECON LAP', !!(c && c.recon && c.lkp && Math.abs(c.cruise - c0.cruise * 0.5) < 1 && T.coneSensitivity(Object.assign({}, c, { hz: { cone: 'side' } })) === 1), c ? `next pass cruise ${Math.round(c.cruise)} of ${Math.round(c0.cruise)}; its cone on the spot; side sensitivity ${T.coneSensitivity(Object.assign({}, c, { hz: { cone: 'side' } }))}` : 'no recon pass'); }
console.log(out.join('\n') + '\nfails: ' + fails);
