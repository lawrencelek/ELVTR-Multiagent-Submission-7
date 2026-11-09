/* DUMMIES · Submission 7: Prototype 10's overlays in Prototype 9's renderer (game.js's HD layer, over the pixel art).
   The red car's sight field (the beam; from rung 2 the forward and side cones, rings at x, 2x, 3x), its awareness (? and !),
   its tag and notice meter, the stop line, the ghost it searches, the crash outlines and remembered spots, the street
   cameras, the planters, the lunge guide, the block lift; a panel naming the car's rung and what it learns next; the
   lesson card. Drawing code after prototypes/p10/game_p10.js, in world units under the field's transform. */
(function (root) {
  'use strict';
  const TAU = Math.PI * 2, D = Math.PI / 180;
  const C = { red: '#ff3d3d', dummy: '#ffd400', joint: '#2a2a2a', text: '#f4f8fa', dim: '#9fb8c8', beam: 'rgba(244,248,250,0.07)', beamHot: 'rgba(255,61,61,0.15)',
    cam: '#9ff2c8', camDim: 'rgba(159,242,200,0.6)', camCone: 'rgba(159,242,200,0.10)', search: '#ffb347', searchDim: 'rgba(255,179,71,0.55)',
    chalk: 'rgba(238,240,232,0.9)', chalkDim: 'rgba(238,240,232,0.4)', mem: '#ff5a5a', memDim: 'rgba(255,90,90,0.6)', tent: '#ffd400', planter: '#3f7d4e', planterTop: '#5fae6c', panel: 'rgba(10,12,18,0.86)' };
  const AWARE = ['', 'AWARE', 'SLOWING', 'CRAWLING', 'STOPPING'], AWARE_C = ['', '#cfd8dc', '#ffc14d', '#ff7a3d', '#ff3b3b'];
  const GRADE = { unseen: 'UNSEEN', lost: 'LOST', seen: 'SEEN' }, GRADE_C = { unseen: C.dummy, lost: C.search, seen: C.dim };
  // the lesson card: what each rung does, what it closes, what it leaves (GDD Edits 101-108, in Prototype 9's world)
  const LESSON = {
    1: ['It brakes for a dummy in its lane and stops short of you.', 'Standing in its lane.', 'Cut in: wait beside the road; dash into its lane just ahead of its nose, too late to stop.'],
    2: ['Side cones: it notices a dummy beside the road. It slows, then stops short. ? means it suspects you; ! means it has you.', 'Cutting in from beside the road, unseen.', 'Height: it watches the ground. Drop or jump onto it from a deck.'],
    3: ['Roof lidar: it sees a dummy in the air, jumping or falling off a deck onto its road. Up on a deck you are still out of its world.', 'The drop and the jump onto it.', 'Cover: wait behind a building; spring into its path just ahead of it.'],
    4: ['Street cameras share what they see. Behind cover, a camera can still give you away.', 'Springs from cover a camera watches.', 'Cover the cameras miss; a cone in its lane makes it swerve into you.'],
    5: ['Road items: it stops for a cone and never swerves round it.', 'The cone bait.', 'CROUCH (hold B) behind a low planter; spring into its path just ahead of it.'],
    6: ['Crash memory: it remembers every spot you struck from, and watches them.', 'The same spot twice.', 'A new spot every time.'],
    7: ['The search: seen, then hidden, it searches where it last saw you (the ghost).', 'Hiding after it has seen you.', 'Hide before it sees you, or crawl away from its ghost.'],
  };
  const NEXT = { 1: 'a hit on its nose', 2: 'a hit you cut in for', 3: 'a hit from above, in its sight', 4: 'a hit sprung from cover', 5: 'a hit while it swerves round a cone', 6: 'a hit from a spot you struck from before', 7: 'a hit from cover just after it saw you' };
  let ctx = null, s = null, T = null;
  const flashes = [], seen = new WeakMap();
  const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const text = (t, x, y, size, c, al, wt) => { ctx.fillStyle = c; ctx.font = `${wt || 700} ${size}px B612, system-ui, sans-serif`; ctx.textAlign = al || 'left'; ctx.fillText(t, x, y); };
  const label = (t, x, y, size, c) => { ctx.font = `700 ${size}px B612, system-ui, sans-serif`; const w = ctx.measureText(t).width + 8; rect(x - w / 2, y - size, w, size + 4, 'rgba(12,14,20,0.8)'); text(t, x, y, size, c, 'center'); };
  const reds = () => T ? T.cars.filter((c) => c.red && !c.ghost && !c.gone) : [];

  // ---------- the red car's paint: Prototype 9's sedan, recoloured
  const redArt = new Map();
  function redSprite(S) {
    if (redArt.has(S)) return redArt.get(S);
    const d = new Uint32Array(S.d.length);
    for (let i = 0; i < d.length; i++) {
      const c = S.d[i]; if (!c) { d[i] = 0; continue; }
      const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255, a = c >>> 24, l = 0.3 * r + 0.59 * g + 0.11 * b;
      if (l < 70 || (b > r + 25 && b > g)) { d[i] = c; continue; } // glass, tyres, rims: as they are
      const k = l / 255, nr = Math.min(255, Math.round(120 + 135 * k)), ng = Math.round(28 + 70 * k * k), nb = Math.round(28 + 60 * k * k);
      d[i] = ((a << 24) | (nb << 16) | (ng << 8) | nr) >>> 0;
    }
    const R = Object.assign(Object.create(Object.getPrototypeOf(S)), S, { d });
    redArt.set(S, R); return R;
  }

  // ---------- the field: rung 1's beam; from rung 2 the proportional cones (row 738)
  function drawPropCones(c, near) {
    const P = T.P, br = P['body.radius'], A = P['perception.forwardConeAngle'] * D, e = T.sideEdges(), e0 = e[0] * D, e1 = e[1] * D, Rp = T.coneReach(), O = -c.L / 2, Fa = T.cornerApex(c) - c.L / 2, BIG = 4000;
    const Gf = Math.round(P['perception.forwardGrades'] || 3), Gs = Math.round(P['perception.sideGrades'] || 2), x = Rp.f / Gf, Fs = P['perception.forwardConeSensitivity'], Ss = P['perception.sideConeSensitivity'], lk = T.coneLook(c) * D;
    const cones = [{ k: 'forward', a: Fa, a0: lk - A, a1: lk + A, R: Gf * x, G: Gf, sens: Fs }, { k: 'side', a: O, a0: e0, a1: e1, R: Gs * x, G: Gs, sens: Ss }, { k: 'side', a: O, a0: -e1, a1: -e0, R: Gs * x, G: Gs, sens: Ss }];
    const ray = (q) => { ctx.beginPath(); ctx.moveTo(q.a, 0); ctx.arc(q.a, 0, BIG, q.a0, q.a1); ctx.closePath(); }, circ = (r) => { ctx.beginPath(); ctx.arc(O, 0, r, 0, TAU); };
    const notForward = () => { ctx.beginPath(); ctx.rect(-BIG, -BIG, 2 * BIG, 2 * BIG); ctx.moveTo(Fa, 0); ctx.arc(Fa, 0, BIG, cones[0].a0, cones[0].a1); ctx.closePath(); ctx.clip('evenodd'); };
    const nose = () => { ctx.beginPath(); ctx.rect(c.L / 2, -BIG, 2 * BIG, 2 * BIG); ctx.clip(); }; // the forward cone shows from the nose on (its edges still run through the front corners)
    const clipTo = (q) => { ray(q); ctx.clip(); circ(q.R + 1); ctx.clip(); if (q.k === 'side') notForward(); else nose(); };
    for (const q of cones) { const k = q.sens == null ? 1 : q.sens, line = `rgba(255,255,255,${(0.18 + 0.4 * k).toFixed(3)})`;
      ctx.save(); clipTo(q); ctx.fillStyle = near ? `rgba(255,212,0,${(0.07 + 0.15 * k).toFixed(3)})` : `rgba(127,168,188,${(0.05 + 0.2 * k).toFixed(3)})`; ctx.fillRect(-BIG, -BIG, 2 * BIG, 2 * BIG);
      ctx.strokeStyle = line; ctx.lineWidth = 1.2; ctx.setLineDash([4, 6]); for (let i = 1; i <= q.G; i++) { circ(x * i); ctx.stroke(); } ctx.restore();
      ctx.save(); circ(q.R); ctx.clip(); if (q.k === 'side') notForward(); else nose(); ctx.strokeStyle = line; ctx.lineWidth = 1.2; ctx.setLineDash([4, 6]); ctx.beginPath(); for (const an of [q.a0, q.a1]) { ctx.moveTo(q.a, 0); ctx.lineTo(q.a + Math.cos(an) * BIG, Math.sin(an) * BIG); } ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    beam(c, near);
    const st = T.sideStage(c), hz = c.hz;
    if (st >= 1 && hz && (hz.cone === 'forward' || hz.cone === 'side')) { const b = T.body, ly = -Math.sin(c.h) * (b.x - c.x) + Math.cos(c.h) * (b.y - c.y), q = hz.cone === 'forward' ? cones[0] : ly >= 0 ? cones[1] : cones[2], i = Math.min(q.G, Math.max(1, Math.ceil(hz.dist / x - 1e-9)));
      ctx.save(); clipTo(q); ctx.globalAlpha = 0.24; ctx.fillStyle = AWARE_C[st]; ctx.beginPath(); ctx.arc(O, 0, i === q.G ? q.R : x * i, 0, TAU); if (i > 1) { ctx.moveTo(O + x * (i - 1), 0); ctx.arc(O, 0, x * (i - 1), 0, TAU, true); } ctx.fill('evenodd'); ctx.restore(); }
  }
  function beam(c) { const br = T.P['body.radius'], hot = (c.hz && c.hz.inPath) || (c.det && c.det.fwd); ctx.save(); ctx.translate(c.L / 2, 0); rect(0, -(c.W / 2 + br), c.fwdLen, c.W + 2 * br, hot ? C.beamHot : C.beam); ctx.restore(); }
  function drawField(c) {
    if ((c.rung || 0) < 1 && T.rung < 1) return;
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h);
    if (T.propField()) drawPropCones(c, !!c.noticed); else beam(c);
    ctx.restore();
  }
  function drawHalo(c) { // the learning car's sensors on its roof: the lidar's sweep from rung 3, the search beacon from rung 7
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h);
    if (T.rung >= 3) { const a = T.t * 6; ctx.strokeStyle = C.cam; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-2 + Math.cos(a) * 3, Math.sin(a) * 3); ctx.lineTo(-2 + Math.cos(a) * 9, Math.sin(a) * 9); ctx.stroke(); }
    if (T.rung >= 7) { const on = c.lkp ? Math.floor(T.t * 6) % 2 === 0 : false; ctx.fillStyle = on ? C.search : C.searchDim; ctx.beginPath(); ctx.arc(9, 0, 2.6, 0, TAU); ctx.fill(); }
    ctx.restore();
  }
  // ---------- Prototype 11.1: the kit (GDD Edit 116). One sedan, one livery; each rung bolts one piece into a fixed slot, in its field's
  // colour. Drawn over the sprite in a unit car's frame: 64 long, 30 wide, nose +x. The newest piece glints on the first pass after its fitting.
  const KIT = { side: '#7fa8bc', cone: '#ff8a1f', ink: 'rgba(8,10,14,0.9)',
    name: ['', 'Lens bar', 'Mirror pods', 'Roof puck', 'Link fin', 'Bumper strip', 'Tally marks', 'Searchlight'],
    slot: ['', 'Windscreen', 'Both mirrors', 'Roof', 'Rear roof', 'Front bumper', 'Bonnet', 'Roof, front'],
    at: [null, [13.5, 0], [6.5, 18.5], [-7, 0], [-21, 0], [31.5, 0], [22, 0], [1, -7]] };
  const kitSeen = new WeakMap(), kitTop = () => Math.max(1, DUELR().length - 1 || 7), kitGlintS = () => (T.DP || T.P)['duel.kitGlintSeconds'] || 3;
  function kitPieces(rung, o) { // o: { t, link, mem, search, drop: [rung, dy] }; the slots in Edit 116 §116.2
    const ink = KIT.ink, dy = (n) => (o.drop && o.drop[0] === n ? o.drop[1] : 0), on = (n) => rung >= n && (!o.only || o.only === n);
    const box = (n, x, y, w, h, col) => { y += dy(n); rect(x - 0.9, y - 0.9, w + 1.8, h + 1.8, ink); rect(x, y, w, h, col); };
    const dot = (n, x, y, r, col) => { y += dy(n); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x, y, r + 0.9, 0, TAU); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
    if (on(1)) box(1, 12, -5, 3, 10, C.text); // R1 forward camera: a lens bar at the windscreen's top
    if (on(2)) { dot(2, 6.5, -18.5, 2.6, KIT.side); dot(2, 6.5, 18.5, 2.6, KIT.side); } // R2 side sensors: a pod on each mirror
    if (on(3)) { dot(3, -7, 0, 5, '#0d0f13'); const a = o.t * 6, y = dy(3); ctx.strokeStyle = '#c3a6ff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-7, y, 4, 0, TAU); ctx.moveTo(-7, y); ctx.lineTo(-7 + Math.cos(a) * 4, y + Math.sin(a) * 4); ctx.stroke(); } // R3 roof lidar: a spinning puck
    if (on(4)) { box(4, -22, -0.8, 1.6, 1.6, C.cam); box(4, -27, -0.6, 6, 1.2, C.cam); dot(4, -27, 0, 1.6, C.cam); if (o.link) { ctx.save(); ctx.strokeStyle = C.cam; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.55 + 0.45 * Math.sin(o.t * 12); for (const r of [5, 9]) { ctx.beginPath(); ctx.arc(-24, dy(4), r, Math.PI * 0.62, Math.PI * 1.38); ctx.stroke(); } ctx.restore(); } } // R4 street cameras: a link fin; it pulses while a camera reports you
    if (on(5)) box(5, o.seat ? 27.5 : 30, -12, 3, 24, KIT.cone); // R5 road items: a bumper strip
    if (on(6)) for (let i = 0; i < 3; i++) box(6, 17 + i * 4, -6, 2, 12, i < o.mem ? '#ff5a5a' : 'rgba(255,90,90,0.3)'); // R6 crash memory: a tally a remembered spot
    if (on(7)) { if (o.search) { const a = -Math.PI / 2 + Math.sin(o.t * 3) * 0.9; ctx.save(); ctx.fillStyle = 'rgba(255,90,90,0.25)'; ctx.beginPath(); ctx.moveTo(1, -7); ctx.arc(1, -7, 46, a - 0.3, a + 0.3); ctx.closePath(); ctx.fill(); ctx.restore(); }
      dot(7, 1, -7, 2.6, o.search && Math.floor(o.t * 6) % 2 === 0 ? '#ff5a5a' : 'rgba(255,90,90,0.6)'); } // R7 search: a roof searchlight; it sweeps while it searches
  }
  function kitGlint(n, e) { // rings out of the newest piece's slot, one a second
    const at = KIT.at[n]; if (!at) return; const ph = e % 1;
    ctx.save(); ctx.strokeStyle = C.text; ctx.lineWidth = 1.4; ctx.globalAlpha = 1 - ph;
    for (const sy of n === 2 ? [-1, 1] : [1]) { ctx.beginPath(); ctx.arc(at[0], at[1] * sy, 4 + 10 * ph, 0, TAU); ctx.stroke(); }
    ctx.restore();
  }
  function kitCar(c, rung, o, e) { ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h); ctx.scale(c.L / 64, c.W / 30); kitPieces(rung, o); if (e != null && rung >= 1) kitGlint(rung, e); ctx.restore(); }
  function kitMem() { return Math.min(T.crashes ? T.crashes.length : 0, Math.round(T.P['duel.memorySites'] || 3)); }
  function drawKit(c) { // the field: the kit on the red car, live
    let k = kitSeen.get(T); if (!k || k.rung !== T.rung || T.t < k.t0) { k = { rung: T.rung, t0: T.t }; kitSeen.set(T, k); } // a new rung (a fitting, a new puzzle): glint again
    const e = T.t - k.t0, cam = T.rung >= 4 && T.seeingCamera ? T.seeingCamera() : null;
    kitCar(c, T.rung, { t: T.t, link: !!(cam && c.hidden && (c.noticed || (c.hz && c.hz.inPath))), mem: kitMem(), search: !!(c.lkp && !c.lkp.found) }, e < kitGlintS() ? e : null);
  }
  function plateMarks(c, st) { // under Prototype 9's roof plate (game.js tagRect): seven squares filled to the rung; ? or ! beside the plate, white
    const U = (Gk && Gk.U) || 2, top = Math.round(c.y / U) - 12 - (c._lift || 0), y0 = (top - 2) * U, n = kitTop(), sq = 6, w = n * sq - 2, x0 = c.x - w / 2;
    rect(x0 - 2, y0 - 1, w + 4, 7, 'rgba(12,14,20,0.75)'); for (let i = 0; i < n; i++) rect(x0 + i * sq, y0, 4, 5, i < T.rung ? C.red : 'rgba(255,255,255,0.28)');
    if (st) { const g = st >= 3 ? '!' : '?'; label(g, c.x + 24, y0 - 6, st >= 3 ? 14 : 12, C.text); }
    if (c.lkp && !c.lkp.found) label('?', c.x + 24, y0 - 6, 12, SCAN.mem);
  }
  function kitTag(tag, x, y) { // the tag carries the rung: a square a rung, filled to the car's
    const top = kitTop(), sq = 6; ctx.font = '700 10px B612, system-ui, sans-serif'; const tw = ctx.measureText(tag).width, w = tw + 14 + top * sq, x0 = x - w / 2;
    rect(x0, y - 10, w, 14, 'rgba(12,14,20,0.8)'); text(tag, x0 + 4, y, 10, C.text, 'left');
    for (let i = 0; i < top; i++) rect(x0 + tw + 10 + i * sq, y - 7, 4, 7, i < T.rung ? C.red : 'rgba(255,255,255,0.22)');
  }
  function kitBody() { // the close-up's sedan, in the unit frame
    const rr = (x, y, w, h, r, col) => { ctx.fillStyle = col; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); ctx.fill(); };
    rr(-24, -17, 10, 34, 2, '#0d0f13'); rr(14, -17, 10, 34, 2, '#0d0f13'); rr(4, -19, 5, 38, 1, '#b52a31'); rr(-32, -15, 64, 30, 7, '#d8323a');
    rr(4, -11, 10, 22, 2, '#26323f'); rr(-18, -12, 22, 24, 3, '#b52a31'); rr(-25, -10, 7, 20, 2, '#26323f');
  }
  function kitInset(L, u, G, c, k) { // the fitting, close up: the piece lowered into its slot, then its glint
    const to = L.to, top = kitTop(), w = 320, h = 178, sx = G.FX + c.x * k, x = sx > G.FX + G.FW / 2 ? G.FX + 24 : G.FX + G.FW - w - 24, y = G.FY + 62;
    ctx.save(); rect(x, y, w, h, 'rgba(6,10,18,0.9)'); ctx.strokeStyle = CAM; ctx.lineWidth = 1.5; ctx.strokeRect(x + 0.75, y + 0.75, w - 1.5, h - 1.5);
    text('KIT · RUNG ' + to + ' OF ' + top, x + 14, y + 24, 13, CAM);
    for (let i = 0; i < top; i++) rect(x + w - 14 - (top - i) * 9, y + 13, 6, 10, i < to - (u < 0.45 ? 1 : 0) ? C.red : 'rgba(255,255,255,0.22)');
    ctx.save(); ctx.translate(x + w / 2, y + 92); ctx.scale(2.9, 2.9); kitBody();
    const land = Math.min(1, u / 0.45); ctx.globalAlpha = 1; kitPieces(to - 1, { t: G.t, mem: kitMem() });
    ctx.globalAlpha = Math.min(1, land * 2); kitPieces(to, { t: G.t, mem: kitMem(), drop: [to, -28 * (1 - land)], only: to }); ctx.globalAlpha = 1;
    if (u >= 0.45) kitGlint(to, (u - 0.45) / 0.55 * 2);
    ctx.restore();
    text(String(KIT.name[to] || '').toUpperCase(), x + 14, y + h - 14, 17, C.text); text(String(KIT.slot[to] || '').toUpperCase(), x + w - 14, y + h - 14, 12, C.dim, 'right');
    ctx.restore();
  }
  // ---------- Prototype 11.2: sensor feedback (GDD Edit 117; the adversarial UI review, pipeline/runs/*-ui-p11_1). One language for
  // RED-01: each sensor drawn by what it does, out of its piece on the car. Idle: a faint field and a pulse. Sensing: brighter, and a
  // corner box on the dummy in the sensor's colour. Never a yellow or red fill (yellow is you, red is the car). Ground fields stop at
  // tall cover, at low cover while you duck, and at deck tops (out of its world). Prototype 9's white-car marks are off for it.
  const SCAN = { fwd: '#f4f8fa', side: '#7fa8bc', lidar: '#c3a6ff', item: '#ff8a1f', mem: '#ff5a5a', fwdPulse: 1.1, sidePing: 1.4, lidarTurn: 1.2, lidarFade: 0.7 }; // seconds: proposed ui.scan.* (Edit 117 §117.7)
  const sideRGB = '127,168,188', fwdRGB = '244,248,250';
  let off = null, offG = null, Gk = null;
  function local(c, x, y) { const dx = x - c.x, dy = y - c.y, ca = Math.cos(c.h), sa = Math.sin(c.h); return { x: dx * ca + dy * sa, y: -dx * sa + dy * ca }; }
  function bracket(x, y, r, col, w, g) { const G2 = g || ctx; G2.save(); G2.strokeStyle = col; G2.lineWidth = w || 2; const k = r * 0.45; for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { G2.beginPath(); G2.moveTo(x + sx * r, y + sy * (r - k)); G2.lineTo(x + sx * r, y + sy * r); G2.lineTo(x + sx * (r - k), y + sy * r); G2.stroke(); } G2.restore(); }
  function scanGeo(c) { // the field's geometry as the sim has it (drawPropCones' frame: forward apex Fa, side apex O; reaches; angles)
    const P = T.P, e = T.sideEdges(), Rp = T.coneReach(), br = P['body.radius'], v = Math.abs(c.v || 0), h = (root.DUEL && root.DUEL.TUNE && root.DUEL.TUNE.redHard) || 600;
    return { prop: T.propField(), A: P['perception.forwardConeAngle'] * D, lk: T.coneLook(c) * D, e0: e[0] * D, e1: e[1] * D, Rf: Rp.f, Rs: Rp.s, Gf: Math.round(P['perception.forwardGrades'] || 3), Gs: Math.round(P['perception.sideGrades'] || 2),
      Fa: T.cornerApex(c) - c.L / 2, O: -c.L / 2, br, late: (P['perception.reactionDelay'] || 0.3) * v + v * v / (2 * h) + br, reach: T.propField() ? Rp.f : (c.fwdLen || P['perception.forwardLength'] || 300) };
  }
  function blockers(c, b) { // what stops a ground field: tall cover, low cover while you duck, deck tops (gaps open)
    const out = [], P = T.P, W = P['world.width'] || 800, H = P['world.height'] || 640, HALF = (P['world.deckWidth'] || 160) / 2;
    for (const q of T.level.statics || []) if (!q.walk && (!q.low || (b && b.duck))) out.push({ rect: [q.x, q.y, q.w, q.h] });
    for (const l of (T.duelSc && T.duelSc.layers) || []) { const dk = l.dk; if (!dk || c.layer > 0) continue; const r = dk.hz ? [0, dk.off - HALF, W, 2 * HALF] : [dk.off - HALF, 0, 2 * HALF, H];
      out.push({ deck: r, gaps: (dk.gaps || []).map((g) => (dk.hz ? [g[0], r[1], g[1] - g[0], r[3]] : [r[0], g[0], r[2], g[1] - g[0]])) }); }
    return out;
  }
  function shade(g, ox, oy, list) { // erase each blocker's shadow from the origin (and the deck tops) on the field layer
    g.save(); g.globalCompositeOperation = 'destination-out'; g.fillStyle = '#000';
    for (const q of list) {
      if (q.deck) { g.beginPath(); g.rect(...q.deck); for (const r of q.gaps) { g.rect(r[0] + r[2], r[1], -r[2], r[3]); } g.fill('evenodd'); continue; }
      const [x, y, w, h] = q.rect, P4 = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], far = 3000;
      if (ox > x && ox < x + w && oy > y && oy < y + h) continue;
      for (let i = 0; i < 4; i++) { const p1 = P4[i], p2 = P4[(i + 1) % 4], f = (p) => { const dx = p[0] - ox, dy = p[1] - oy, m = Math.hypot(dx, dy) || 1; return [p[0] + dx / m * far, p[1] + dy / m * far]; };
        g.beginPath(); g.moveTo(...p1); g.lineTo(...p2); const q2 = f(p2), q1 = f(p1); g.lineTo(...q2); g.lineTo(...q1); g.closePath(); g.fill(); }
      g.fillRect(x, y, w, h);
    }
    g.restore();
  }
  function ribbon(g, c, gm, from, to) { // the lane band ahead of the nose, along its path: [from, to] past the front
    const X = root.DUMMIES, hw = c.W / 2 + gm.br, d = c.d || 0, s0 = c.s + c.L / 2 + from, s1 = Math.min(c.path.length, c.s + c.L / 2 + to), L = [], R = [];
    if (!X || !c.path || s1 <= s0) return false;
    for (let sv = s0; ; sv += 8) { const sx = Math.min(sv, s1), p = X.pathAt(c.path, sx); L.push([p.x + p.nx * (d - hw), p.y + p.ny * (d - hw)]); R.push([p.x + p.nx * (d + hw), p.y + p.ny * (d + hw)]); if (sx >= s1) break; }
    g.beginPath(); g.moveTo(...L[0]); for (const q of L.slice(1)) g.lineTo(...q); for (const q of R.reverse()) g.lineTo(...q); g.closePath(); return { L, R: R.reverse() };
  }
  function crossAt(c, gm, ds) { const X = root.DUMMIES, p = X.pathAt(c.path, Math.min(c.path.length, c.s + c.L / 2 + ds)), hw = c.W / 2 + gm.br + 4, d = c.d || 0; return [[p.x + p.nx * (d - hw), p.y + p.ny * (d - hw)], [p.x + p.nx * (d + hw), p.y + p.ny * (d + hw)]]; }
  function scanField(g, c, gm, st, b) { // the ground fields, drawn on the offscreen layer, then shaded
    const hot = !!((c.hz && c.hz.inPath) || (c.det && c.det.fwd)), seenF = c.hz && c.hz.cone === 'forward', seenS = c.hz && c.hz.cone === 'side';
    // forward camera: a ribbon along its lane, the too-late zone brighter; pulses run out along it
    if (ribbon(g, c, gm, 0, gm.reach)) { g.fillStyle = `rgba(${fwdRGB},${hot ? 0.18 : 0.08})`; g.fill(); g.strokeStyle = `rgba(${fwdRGB},${hot ? 0.8 : 0.45})`; g.lineWidth = 1.2; g.stroke(); }
    if (ribbon(g, c, gm, 0, gm.late)) { g.fillStyle = `rgba(${fwdRGB},0.17)`; g.fill(); } // too late to stop: step in here and it hits you
    for (let k = 0; k < 2; k++) { const ph = (T.t / SCAN.fwdPulse + k / 2) % 1, [p, q] = crossAt(c, gm, gm.reach * ph); g.strokeStyle = `rgba(${fwdRGB},${((1 - ph) * (hot ? 0.85 : 0.5)).toFixed(3)})`; g.lineWidth = 2; g.beginPath(); g.moveTo(...p); g.lineTo(...q); g.stroke(); }
    if (!gm.prop) return;
    g.save(); g.translate(c.x, c.y); g.rotate(c.h);
    { const a0 = gm.lk - gm.A, a1 = gm.lk + gm.A, R = gm.Rf, x = R / gm.Gf; // the forward cone: an outline and its grade ticks
      g.save(); g.beginPath(); g.rect(c.L / 2, -4000, 4000, 8000); g.clip();
      g.strokeStyle = `rgba(${fwdRGB},${seenF ? 0.6 : 0.16})`; g.lineWidth = 1; g.beginPath(); for (const an of [a0, a1]) { g.moveTo(gm.Fa, 0); g.lineTo(gm.Fa + Math.cos(an) * R, Math.sin(an) * R); } g.stroke();
      if (seenF) { g.beginPath(); g.moveTo(gm.Fa, 0); g.arc(gm.Fa, 0, R, a0, a1); g.closePath(); g.fillStyle = `rgba(${fwdRGB},0.08)`; g.fill(); }
      g.restore(); }
    const yb = b ? local(c, b.x, b.y).y : 0, mine = seenS ? (yb < 0 ? -1 : 1) : 0, x = gm.Rs / gm.Gs;
    for (const sg of [-1, 1]) { // side sensors: steel-blue fans from the pods, rings at the grades it acts on, pings out
      const a0 = sg > 0 ? gm.e0 : -gm.e1, a1 = sg > 0 ? gm.e1 : -gm.e0, has = mine === sg, k = has ? 1 : 0;
      g.save(); g.beginPath(); g.rect(-4000, -4000, 8000, 8000); g.moveTo(gm.Fa, 0); g.arc(gm.Fa, 0, 4000, gm.lk - gm.A, gm.lk + gm.A); g.closePath(); g.clip('evenodd');
      g.beginPath(); g.moveTo(gm.O, 0); g.arc(gm.O, 0, gm.Rs, a0, a1); g.closePath(); g.fillStyle = `rgba(${sideRGB},${has ? 0.3 : 0.12})`; g.fill();
      g.strokeStyle = `rgba(${sideRGB},${has ? 0.9 : 0.45})`; g.lineWidth = 1.2; g.setLineDash([3, 5]); g.stroke(); for (let i = 1; i < gm.Gs; i++) { g.beginPath(); g.arc(gm.O, 0, x * i, a0, a1); g.stroke(); } g.setLineDash([]);
      const per = has ? SCAN.sidePing / 2 : SCAN.sidePing; for (let j = 0; j < 2; j++) { const ph = (T.t / per + j / 2) % 1; g.strokeStyle = `rgba(${sideRGB},${((1 - ph) * (has ? 1 : 0.6)).toFixed(3)})`; g.lineWidth = 2; g.beginPath(); g.arc(gm.O, 0, Math.max(c.W / 2 + 4, gm.Rs * ph), a0, a1); g.stroke(); }
      g.restore(); void k;
    }
    g.restore();
  }
  function scanLidar(c, gm, b) { // R3 up: the roof puck's sweep; returns on cover, deck edges and parapet gaps fade behind it; you, in its world, return too
    const px = -7 * c.L / 64, R = gm.Rs, a = (T.t / SCAN.lidarTurn) % 1 * TAU, ca = Math.cos(c.h), sa = Math.sin(c.h), wx = c.x + ca * px, wy = c.y + sa * px, fade = TAU * SCAN.lidarFade;
    let pts = lidarPts.get(T.level); if (!pts) { pts = [];
      const edge = (x, y, w, h, step) => { const n = Math.max(2, Math.round((w + h) * 2 / step)); for (let i = 0; i < n; i++) { const u = i / n * 2 * (w + h); pts.push(u < w ? [x + u, y] : u < w + h ? [x + w, y + u - w] : u < 2 * w + h ? [x + 2 * w + h - u, y + h] : [x, y + 2 * (w + h) - u]); } };
      for (const q of T.level.statics || []) if (!q.walk) edge(q.x, q.y, q.w, q.h, 9);
      for (const q of blockers(c, null)) if (q.deck) { const [x, y, w, h] = q.deck; edge(x, y, w, h, 12); for (const r of q.gaps) edge(...r, 7); }
      lidarPts.set(T.level, pts); }
    ctx.save(); ctx.fillStyle = SCAN.lidar; let nDraw = 0, nIn = 0; // its own colour (the second review, F2)
    for (const [x, y] of pts) { const dx = x - wx, dy = y - wy; if (dx * dx + dy * dy > R * R) continue; const d = ((a - (Math.atan2(dy, dx) - c.h)) % TAU + TAU) % TAU; nIn++; if (d > fade) continue; nDraw++; ctx.globalAlpha = 0.95 * (1 - d / fade); ctx.fillRect(x - 1.7, y - 1.7, 3.4, 3.4); }
    if (b && T.meets(c)) { const dx = b.x - wx, dy = b.y - wy; if (dx * dx + dy * dy < R * R) { const d = ((a - (Math.atan2(dy, dx) - c.h)) % TAU + TAU) % TAU; if (d < fade) { ctx.globalAlpha = 1 - d / fade; for (const [ox, oy] of [[-6, -4], [5, -7], [7, 3], [-3, 6], [0, -1]]) ctx.fillRect(b.x + ox - 1.7, b.y + oy - 1.7, 3.4, 3.4); } } }
    ctx.translate(wx, wy); ctx.globalAlpha = 0.35; ctx.strokeStyle = SCAN.lidar; ctx.lineWidth = 1; ctx.setLineDash([1.5, 6]); ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.stroke(); ctx.setLineDash([]); // its reach
    ctx.rotate(c.h + a); ctx.globalAlpha = 0.5; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, 0); ctx.stroke();
    ctx.restore();
  }
  const lidarPts = new WeakMap();
  function scanItems(c, gm) { // R5 up: the cones in its lane ahead, bracketed orange: it will stop for them
    for (const cn of s.cones || []) { if (cn.state === 'held') continue; const p = local(c, cn.x, cn.y); if (p.x < c.L / 2 || p.x > c.L / 2 + gm.reach || Math.abs(p.y) > c.W / 2 + gm.br + 12) continue; ctx.globalAlpha = 0.65 + 0.35 * Math.sin(T.t * 8); bracket(cn.x, cn.y, 11, SCAN.item, 2); ctx.globalAlpha = 1; }
  }
  function scanCaught(c, gm, st, b) { // the dummy, boxed in the colour of the sensor that has it
    if (!b) return; const hz = c.hz; if (!hz) return;
    const col = hz.inPath ? SCAN.fwd : st > 0 || hz.cone === 'side' || hz.cone === 'track' ? SCAN.side : hz.cone === 'forward' ? SCAN.fwd : null; if (!col) return;
    ctx.globalAlpha = st >= 3 || hz.inPath ? 1 : 0.6; bracket(b.x, b.y, gm.br + 7, col, 2.2); ctx.globalAlpha = 1;
  }
  function scanNotice(c, b) { // the one timer to watch: the notice filling, round the dummy, steel blue
    const nT = T.P['perception.sideNoticeSeconds']; if (!b || !(c.fieldT > 0) || !(nT > 0)) return; const u = Math.min(1, c.fieldT / (nT * (b.duck ? (T.P['perception.duckNoticeFactor'] || 1) : 1)));
    ctx.save(); ctx.strokeStyle = SCAN.side; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(b.x, b.y, T.P['body.radius'] + 11, -Math.PI / 2, -Math.PI / 2 + TAU * u); ctx.stroke(); ctx.restore();
  }
  function stopLineIdle(g, c, gm) { // from rung 1: where it would stop if it braked now (the too-late zone's end); a bar with end ticks toward the car
    if (c.spent || (c.man && c.man.type === 'brake')) return; const [p, q] = crossAt(c, gm, gm.late), [p0, q0] = crossAt(c, gm, gm.late - 7);
    g.save(); g.strokeStyle = 'rgba(244,248,250,0.6)'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(...p0); g.lineTo(...p); g.lineTo(...q); g.lineTo(...q0); g.stroke(); g.restore();
  }
  function drawScan(c, G) {
    if (T.rung < 1) return; // blind: no field at all
    const gm = scanGeo(c), st = T.sideStage(c), b = T.body && T.body.alive ? T.body : null, k = G.RA / G.U;
    if (!off) { off = document.createElement('canvas'); offG = off.getContext('2d'); }
    if (off.width !== Math.ceil(G.FW) || off.height !== Math.ceil(G.FH)) { off.width = Math.ceil(G.FW); off.height = Math.ceil(G.FH); }
    offG.setTransform(1, 0, 0, 1, 0, 0); offG.clearRect(0, 0, off.width, off.height); offG.setTransform(k, 0, 0, k, 0, 0);
    scanField(offG, c, gm, st, b); stopLineIdle(offG, c, gm); shade(offG, c.x, c.y, blockers(c, b));
    ctx.save(); ctx.scale(1 / k, 1 / k); ctx.drawImage(off, 0, 0); ctx.restore(); // the layer, at the field's origin
    if (T.rung >= 3) scanLidar(c, gm, b);
    if (T.rung >= 5) scanItems(c, gm);
    scanCaught(c, gm, st, b); scanNotice(c, b);
  }
  function drawTag(c) {
    const ri = T.rungInfo(), st = T.sideStage(c), FW = T.P['world.width'];
    const tag = 'RED-01 · R' + T.rung + ' ' + (ri ? ri.name.toUpperCase() : '') + (c.lkp ? ' · ' + (c.lkp.found ? 'FOUND' : 'SEARCHING') : st >= 1 && c.v >= 1 ? ' · ' + AWARE[st] : c.spent ? ' · DRIVING OFF' : '');
    const x = Math.max(90, Math.min(FW - 90, c.x)), y = c.y - 30;
    if (s && s.p11) return plateMarks(c, st); // Prototype 11.2: the plate carries it all (?/!, seven squares); no tag text, pips or bars
    label(tag, x, y, 10, C.text);
    if (c.checks && c.checks.length) label('CHECKING ' + c.checks.map((m) => '#' + m.n).join(' '), x, y - 14, 10, C.mem);
    if (st) { const col = AWARE_C[st], yy = y - (c.checks && c.checks.length ? 30 : 16); for (let i = 0; i < 3; i++) rect(x - 13 + i * 9, yy, 7, 4, i < Math.min(st, 3) ? col : 'rgba(255,255,255,0.25)'); text(st === 4 ? '!' : '?', x, yy - 4, st >= 3 ? 18 : 14 + st, col, 'center');
      const Tk = T.P['perception.trackSeconds'] || 0, hz = c.hz; if (st === 4 && Tk > 0 && hz && hz.cone === 'track' && hz.trackLeft != null) { rect(x - 13, yy + 7, 25, 3, 'rgba(255,255,255,0.2)'); rect(x - 13, yy + 7, 25 * hz.trackLeft / Tk, 3, col); } }
    const nT = T.P['perception.sideNoticeSeconds']; if (c.fieldT > 0 && nT > 0) { const u = Math.min(1, c.fieldT / nT); ctx.strokeStyle = u >= 1 ? C.dummy : C.text; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + 100, y - 4, 6, -Math.PI / 2, -Math.PI / 2 + TAU * u); ctx.stroke(); }
    if (c.honking || c.sideHonk) label('HONK', c.x, c.y + 34, 11, C.dummy);
  }
  function drawWhites() { for (const c of T.cars) if (c.white && !c.ghost && c.incidentAt != null && T.t - c.incidentAt < 2.5) label('HONK', c.x, c.y + 30, 11, C.text); } // row 740: after an Incident it honks
  function drawStopLine(c) { // row 726: where a braking red car will stop, across its lane
    if (T.rung < 1 || c.spent || !['body', 'side', 'search'].includes(c.cause)) return;
    const sp = T.stopPoint(c); if (!sp) return;
    const col = s && s.p11 ? C.text : c.cause === 'search' ? C.search : T.expected() ? C.mem : C.text, half = c.W / 2 + 6, nx = -Math.sin(sp.h), ny = Math.cos(sp.h); // Prototype 11.2: the stop line is the forward camera's, white
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.globalAlpha = sp.arrived ? 0.9 : 0.75; ctx.setLineDash(sp.arrived ? [] : [5, 4]);
    ctx.beginPath(); ctx.moveTo(sp.x + nx * half, sp.y + ny * half); ctx.lineTo(sp.x - nx * half, sp.y - ny * half); ctx.stroke(); ctx.restore();
    if (!sp.arrived) label('STOPS HERE', sp.x + nx * (half + 12), sp.y + ny * (half + 12) + 4, 8, col);
  }
  function drawGhost(c) { // rung 7: where it last saw the dummy, the ring it searches, its time left
    const g = c.lkp; if (!g) return;
    if (s.p11 && !drawGhost.red) { const k0 = C.search, k1 = C.searchDim; C.search = SCAN.mem; C.searchDim = 'rgba(255,90,90,0.55)'; drawGhost.red = true; try { if (!g.found) searchlight(c, g); drawGhost(c); } finally { C.search = k0; C.searchDim = k1; drawGhost.red = false; } return; } // Prototype 11.2: red, the car's belief
    const R = T.P['duel.searchRadius'] || 0, Tk = T.P['duel.searchSeconds'] || 0, left = Math.max(0, 1 - (T.t - g.had) / (Tk || 1)), near = T.searched(), r = T.P['body.radius'];
    ctx.save(); ctx.strokeStyle = C.search; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(g.x, g.y, r, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(g.x, g.y - r - 5, 4, 0, TAU); ctx.stroke();
    ctx.strokeStyle = near ? C.search : C.searchDim; ctx.lineWidth = near ? 2 : 1.5; ctx.setLineDash(near ? [] : [6, 5]); ctx.beginPath(); ctx.arc(g.x, g.y, R, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.search; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(g.x, g.y, R + 5, -Math.PI / 2, -Math.PI / 2 + TAU * left); ctx.stroke();
    ctx.strokeStyle = C.searchDim; ctx.lineWidth = 1; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(g.x, g.y); ctx.stroke(); ctx.restore();
    label('LAST SEEN', g.x, g.y - R - 8, 9, C.search);
  }
  function searchlight(c, g) { const p = local(c, g.x, g.y), an = Math.atan2(p.y, p.x) + Math.sin(T.t * 3) * 0.25, d = Math.hypot(p.x, p.y) + 30;
    ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h); ctx.fillStyle = 'rgba(255,90,90,0.16)'; ctx.beginPath(); ctx.moveTo(0, -7 * c.W / 30); ctx.arc(0, -7 * c.W / 30, d, an - 0.2, an + 0.2); ctx.closePath(); ctx.fill(); ctx.restore(); }
  const hash = (n, k) => { const v = Math.sin(n * 12.9898 + k * 78.233) * 43758.5453; return v - Math.floor(v); };
  function chalk(x, y, ang, pose, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(0.9, 0.9); ctx.strokeStyle = col; ctx.lineWidth = 1.8; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const sp = [[[-15, -16], [15, -4], [-9, 22], [11, 21]], [[-16, -2], [13, -18], [-12, 20], [8, 23]], [[-14, -14], [16, -12], [-4, 24], [13, 17]]][pose % 3];
    ctx.beginPath(); ctx.arc(0, -20, 6, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-5, -13); ctx.lineTo(sp[0][0], sp[0][1]); ctx.moveTo(5, -13); ctx.lineTo(sp[1][0], sp[1][1]); ctx.moveTo(-5, -13); ctx.lineTo(-6, 6); ctx.lineTo(sp[2][0], sp[2][1]); ctx.moveTo(5, -13); ctx.lineTo(6, 6); ctx.lineTo(sp[3][0], sp[3][1]); ctx.moveTo(-6, 6); ctx.lineTo(6, 6); ctx.stroke(); ctx.restore();
  }
  function drawCrashes() { // every crash: a chalk outline and a numbered marker; from rung 6 the spots it remembers, ringed
    const mem = T.memory(), R = T.P['duel.memoryRadius'] || 0, checked = new Set();
    for (const c of reds()) for (const m of c.checks || []) checked.add(m.n);
    for (const cr of T.crashes) {
      const kept = mem.includes(cr), n = cr.n;
      ctx.globalAlpha = T.rung >= 6 && !kept ? 0.5 : 1;
      chalk(cr.x, cr.y, cr.h + Math.PI / 2 + (hash(n, 7) - 0.5) * 1.2, n, C.chalk);
      const tx = cr.x + 16, ty = cr.y - 18; ctx.fillStyle = s.p11 ? SCAN.mem : C.tent; ctx.beginPath(); ctx.moveTo(tx - 7, ty + 6); ctx.lineTo(tx, ty - 7); ctx.lineTo(tx + 7, ty + 6); ctx.closePath(); ctx.fill(); text(String(n), tx, ty + 5, 8, C.joint, 'center');
      ctx.globalAlpha = 1;
      if (!kept) continue;
      const near = s.p11 && reds().some((c) => Math.hypot(c.x - cr.ox, c.y - cr.oy) < 220), hot = checked.has(n) || near; ctx.save(); ctx.strokeStyle = hot ? C.mem : C.memDim; ctx.lineWidth = hot ? 2.5 : 1.8; ctx.setLineDash(hot ? [] : [6, 5]); // Prototype 11.2: it brightens as the car nears
      ctx.beginPath(); ctx.arc(cr.ox, cr.oy, R, 0, TAU); ctx.stroke(); ctx.setLineDash([2, 4]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cr.ox, cr.oy); ctx.lineTo(cr.x, cr.y); ctx.stroke(); ctx.restore();
      label('#' + n, cr.ox, cr.oy - R - 4, 9, C.mem);
    }
    for (const c of reds()) for (const m of c.checks || []) { ctx.save(); ctx.strokeStyle = C.mem; ctx.lineWidth = 1.5; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(m.ox, m.oy); ctx.stroke(); ctx.restore(); }
  }
  function drawCameras() { // rung 4: the street cameras, their cones as they pan, and the link when one gives the dummy away
    const cams = T.level.cameras || []; if (T.rung < 4 || !cams.length) return;
    const P = T.P, R = P['perception.streetCameraRange'] || 0, F = P['perception.streetCameraFov'] || 360, b = T.body;
    for (const cam of cams) { const [x, y] = cam, aim = T.cameraAim(cam);
      if (R > 0) { ctx.save(); ctx.strokeStyle = C.camDim; ctx.lineWidth = 1; ctx.setLineDash([2, 6]); ctx.beginPath();
        if (F < 360 && aim != null) { ctx.moveTo(x, y); ctx.arc(x, y, R, (aim - F / 2) * D, (aim + F / 2) * D); ctx.closePath(); ctx.fillStyle = s.p11 ? 'rgba(159,242,200,0.2)' : C.camCone; ctx.fill(); if (s.p11) { ctx.setLineDash([]); ctx.strokeStyle = 'rgba(159,242,200,0.5)'; ctx.lineWidth = 1.3; } } else ctx.arc(x, y, R, 0, TAU); // Prototype 11.2: the pan cone shows while idle
        ctx.stroke(); ctx.restore(); }
      if (!root.WORLD6 || !root.WORLD6.paintPost) { rect(x - 1.5, y - 14, 3, 14, C.joint); rect(x - 6, y - 20, 12, 7, C.joint); } ctx.fillStyle = C.cam; ctx.beginPath(); ctx.arc(x + (aim != null ? Math.cos(aim * D) * 4 : 3), y - 16.5, s.p11 ? 4 : 2, 0, TAU); ctx.fill(); if (s.p11) { ctx.strokeStyle = 'rgba(8,10,14,0.9)'; ctx.lineWidth = 1; ctx.stroke(); } }
    const cam = T.seeingCamera(), hid = reds().filter((c) => c.hidden && (c.noticed || (c.hz && c.hz.inPath)));
    if (!cam || !hid.length || !b || !b.alive) return;
    ctx.save(); ctx.strokeStyle = C.cam; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]);
    for (const c of hid) { ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(cam[0], cam[1] - 16); ctx.lineTo(c.x, c.y); ctx.stroke(); }
    ctx.setLineDash([]); ctx.strokeRect(b.x - 16, b.y - 16, 32, 32); ctx.restore(); label('LINKED', b.x, b.y - 22, 9, C.cam);
  }
  // the duel's planters are painted in the tile's art when world6 offers it (build_p9.py); drawn here only without it
  function drawPlanters() { if (root.WORLD6 && root.WORLD6.paintPlanter) return; for (const q of T.level.statics) if (q.kind === 'planter' && q.duel) { rect(q.x - 1, q.y + 2, q.w + 2, q.h, 'rgba(0,0,0,0.35)'); rect(q.x, q.y, q.w, q.h, '#5b6270'); rect(q.x + 2, q.y + 2, q.w - 4, q.h - 4, C.planter); for (let i = 0; i < 5; i++) { const cx = q.x + (q.w > q.h ? q.w * (i + 0.5) / 5 : q.w / 2), cy = q.y + (q.w > q.h ? q.h / 2 : q.h * (i + 0.5) / 5); ctx.fillStyle = C.planterTop; ctx.beginPath(); ctx.arc(cx, cy, Math.min(q.w, q.h) * 0.42, 0, TAU); ctx.fill(); } } }
  function drawLungeGuide() { // row 732: where a dash pressed now would land; yellow when the red car will be there
    const b = s.body; if (!s.lungePreview || !b || !b.alive || b.mode === 'lunge' || b.mode === 'recover' || b.lifted || !s.dashFitted() || (b.level || 0) > 0) return;
    if (!reds().some((c) => Math.hypot(c.x - b.x, c.y - b.y) < 2.6 * s.reach())) return;
    const cm = s.lastCmd || {}, g = s.lungePreview(cm.mx, cm.my); if (!g) return;
    const red = !!(g.hit && g.hit.red), hot = red && g.hit.fault === 'car', mine = red && !hot; // HIT: it will drive into you. YOUR FAULT: you would run into it
    const y11 = s.p11, col = !g.ready ? (y11 ? 'rgba(255,212,0,0.3)' : 'rgba(255,255,255,0.3)') : hot ? C.dummy : mine ? C.dim : y11 ? 'rgba(255,212,0,0.6)' : 'rgba(255,255,255,0.7)', ex = red ? g.hit.x : g.x1, ey = red ? g.hit.y : g.y1, r = T.P['body.radius']; // Prototype 11.2: the guide is yours, yellow
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.moveTo(g.x0, g.y0); ctx.lineTo(ex, ey); ctx.stroke(); ctx.setLineDash([]);
    ctx.lineWidth = hot ? 3 : 2; ctx.beginPath(); ctx.arc(ex, ey, r, 0, TAU); ctx.stroke();
    if (hot && g.ready) { ctx.globalAlpha = 0.25; ctx.fillStyle = C.dummy; ctx.beginPath(); ctx.arc(ex, ey, r, 0, TAU); ctx.fill(); ctx.globalAlpha = 1; text('HIT', ex + r + 8, ey + 4, 11, C.dummy); }
    else if (mine && g.ready) text('YOUR FAULT', ex + r + 8, ey + 4, 10, C.dim);
    ctx.restore();
  }
  function drawDrone(x, y, load) { for (const [dx, dy] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) { ctx.fillStyle = 'rgba(200,214,230,0.6)'; ctx.beginPath(); ctx.arc(x + dx, y + dy, 6, 0, TAU); ctx.fill(); } rect(x - 7, y - 5, 14, 10, '#20242e'); if (load) rect(x - 5, y + 7, 10, 8, C.dummy); }
  function drawBody() { // the dummy's state for the red car: ducked and hidden, expected, the block lift's countdown
    const b = T.body; if (!b || !b.alive) return;
    const L = T.lift; if (L) drawDrone(L.x, L.y - (b.lifted ? 26 : 0), false);
    const Xs = T.P['duel.blockSeconds'] || 0, hs = T.P['proto.honkSeconds'] || 0;
    if (Xs > 0 && !L && T.blockT >= Math.min(hs, Xs - 3)) label('MOVE ALONG · DRONE IN ' + Math.ceil(Xs - T.blockT - 1e-9), b.x, b.y - 34, 10, C.dummy);
    if (s.p11) return; // Prototype 11.2: no DUCKED or EXPECTED text; the fields' shadows and the boxes show it
    const unseen = b.duck && !reds().some((c) => c.hz);
    if (b.duck) { ctx.save(); ctx.strokeStyle = unseen ? C.dim : C.dummy; ctx.lineWidth = 1.5; ctx.setLineDash(unseen ? [3, 4] : []); ctx.beginPath(); ctx.arc(b.x, b.y, 19, 0, TAU); ctx.stroke(); ctx.restore(); label(unseen ? 'DUCKED · HIDDEN' : 'DUCKED · SEEN', b.x, b.y - 24, 9, unseen ? C.dim : C.dummy); }
    else if (T.expected()) label(T.searched() && !T.nearSite(b.x, b.y, T.memory()) ? 'FOUND' : 'EXPECTED', b.x, b.y - 24, 9, C.mem);
  }
  function readEvents() { // flashes from the duel's events and the story's
    const feed = s.duelFeed || [];
    for (const e of feed) {
      if (e.type === 'crash' && e.grade && (T.P['scoring.stealthUnseen'] || 0) > 0) flashes.push({ x: T.body.x, y: T.body.y + 46, t: 1.2, n: GRADE[e.grade] + ' ×' + (e.mult || 0) + ' +' + (e.points || 0), c: GRADE_C[e.grade] });
      else if (e.type === 'search-found') flashes.push({ x: e.x, y: e.y - 30, t: 1, n: 'FOUND', c: C.search });
      else if (e.type === 'first-brake') flashes.push({ car: e.car, t: 2.2, n: 'IT BRAKES FOR YOU', c: C.text });
      else if (e.type === 'first-side') flashes.push({ car: e.car, t: 2.2, n: s.p11 ? 'ITS SIDE SENSORS HAVE YOU' : 'ITS SIDE CONES HAVE YOU', c: C.text });
      else if (e.type === 'lesson-due') flashes.push({ car: e.car, t: 2.6, n: 'LESSON DUE: ' + String((DUELR()[e.to] || {}).name || '').toUpperCase(), c: C.red });
      else if (e.type === 'block-lift') flashes.push({ x: e.x, y: e.y - 40, t: 2, n: s.p11 ? 'MOVE ALONG' : 'FARSIGHT: MOVE ALONG', c: C.dummy });
      else if (e.type === 'incident') flashes.push({ x: e.x, y: e.y - 60, t: 2.4, n: 'INCIDENT · DUMMY CORP. REPORT +' + (e.points || 0), c: '#ff3b3b' });
    }
    feed.length = 0;
    let i = seen.get(s) || 0;
    for (; i < s.events.length; i++) { const e = s.events[i]; if (e.type === 'touch' && e.standstill) flashes.push({ x: s.body.x, y: s.body.y - 34, t: 1.2, n: 'STANDSTILL · NO DAMAGE', c: C.dim });
      else if (e.type === 'fault') flashes.push({ x: s.body.x, y: s.body.y - 34, t: 1.6, n: 'YOU HIT IT · YOUR FAULT · NO POINTS', c: C.dim }); }
    seen.set(s, s.events.length > 4000 ? 0 : i);
  }
  const DUELR = () => (root.DUEL && root.DUEL.RUNGS) || [];
  function drawFlashes() {
    if (s.p11 && Gk) { const k = Gk.RA / Gk.U, W = Gk.FW / k, y = (Gk.FH - 108) / k; for (let i = flashes.length - 1; i >= 0; i--) { flashes[i].t -= 1 / 60; if (flashes[i].t <= 0) flashes.splice(i, 1); }
      const f = flashes[flashes.length - 1]; if (f) { ctx.globalAlpha = Math.min(1, f.t * 3); label(f.n, W / 2, y, 14, f.n.startsWith('ITS SIDE') ? SCAN.side : f.c === C.red ? SCAN.mem : f.c); ctx.globalAlpha = 1; } return; } // Prototype 11.2: a caption band, one at a time
    for (let i = flashes.length - 1; i >= 0; i--) { const f = flashes[i]; f.t -= 1 / 60; if (f.t <= 0) { flashes.splice(i, 1); continue; }
      let x = f.x, y = f.y; if (f.car) { const c = T.cars.find((q) => q.id === f.car); if (!c) { flashes.splice(i, 1); continue; } x = c.x; y = c.y + 46; }
      ctx.globalAlpha = Math.min(1, f.t * 3); label(f.n, x, y, 12, f.c); ctx.globalAlpha = 1; }
  }

  function field(cx, sim, G) {
    ctx = cx; s = sim; T = sim && sim.duelT; Gk = G;
    if (!T || !T.duelOn || !s.sc || s.sc !== T.duelSc || s.phase === 'brief' || s.phase === 'lesson') { if (T) (s.duelFeed || []).length = 0; return; }
    const k = G.RA / G.U;
    ctx.save(); ctx.beginPath(); ctx.rect(G.FX, G.FY, G.FW, G.FH); ctx.clip(); ctx.translate(G.FX, G.FY); ctx.scale(k, k);
    readEvents();
    drawCrashes(); drawPlanters(); drawCameras();
    for (const c of reds()) if (s.p11) drawScan(c, G); else drawField(c); // Prototype 11.2: sensor feedback replaces the static cones
    for (const c of reds()) { if (s.p11) drawKit(c); else drawHalo(c); drawStopLine(c); drawGhost(c); } // Prototype 11.1: the kit replaces the halo
    drawLungeGuide(); drawBody();
    for (const c of reds()) drawTag(c);
    drawWhites();
    drawFlashes();
    ctx.restore();
  }
  // ---------- the panel: the red car's rung, what it learns next, the objective
  function underHud(sim, G, x, y, w, h) { const T2 = sim && sim.duelT, k = G.RA / G.U, m = 24, pts = []; if (T2) for (const c of T2.cars) if (c.red && !c.gone && !c.ghost) pts.push([c.x, c.y]); if (sim.body && sim.body.alive) pts.push([sim.body.x, sim.body.y]);
    return pts.some(([px, py]) => { const sx = G.FX + px * k, sy = G.FY + py * k; return sx > x - m && sx < x + w + m && sy > y - m && sy < y + h + m; }); }
  function hud(cx, sim, G) {
    ctx = cx; s = sim; T = sim && sim.duelT; const d = sim && sim.duelDef;
    if (!T || !d || sim.phase === 'brief' || sim.phase === 'lesson' || sim.duelDone) return;
    const RU = root.DUEL_RULES || { parts: {} }, earnPt = d.earns && d.earns !== 'car' ? RU.parts[d.earns] : null, ri = T.rungInfo(), top = Math.round(T.DP['duel.topRung'] || 0), nxt = T.rung < top ? DUELR()[T.rung + 1] : null, o = d.objective, n = Math.min(sim.duelProgress(), o.count);
    const lines = [['RED-01 · RUNG ' + T.rung + ' · ' + (ri ? ri.name.toUpperCase() : '') + '   ◎ ' + n + ' / ' + o.count, C.red, 15], [earnPt ? 'CLEAR THE TILE: YOU EARN ' + earnPt.name.toUpperCase() + ' (' + earnPt.verb + ')' : nxt && sim.p11 ? (o.count > 1 ? 'YOUR NEXT HIT TEACHES IT ' : 'YOUR HIT TEACHES IT ') + nxt.name.toUpperCase() : nxt ? 'CLEAR THE TILE: IT LEARNS ' + nxt.name.toUpperCase() + ' FROM THE LAST HIT' : T.rung >= 1 ? 'ALL IT CAN LEARN: OUTWIT IT' : 'IT SENSES NOTHING YET', earnPt ? C.dummy : C.dim, 12]].concat(sim.duelDuck ? [[(sim.p11 ? 'HOLD B (KEYS: C) · CROUCH BEHIND LOW COVER' : 'HOLD C · DUCK BEHIND LOW COVER'), C.dim, 11]] : []);
    ctx.save(); ctx.font = '700 19px B612, system-ui, sans-serif';
    const w = Math.max(...lines.map(([t, , z]) => { ctx.font = `700 ${z}px B612, system-ui, sans-serif`; return ctx.measureText(t).width; })) + 24, h = 16 + lines.length * 19, x = G.FX + 10, y = G.FY + 10;
    if (sim.p11 && underHud(sim, G, x, y, w, h)) ctx.globalAlpha = 0.3; // Prototype 11.2: the car or you under it: the panel steps back
    rect(x, y, w, h, C.panel); ctx.strokeStyle = C.red; ctx.lineWidth = 1.5; ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    lines.forEach(([t, col, z], i) => text(t, x + 12, y + 23 + i * 19, z, col)); ctx.restore();
  }
  // ---------- the lesson card: the car away being trained; what it now does, what that closes, what stays open
  // ---------- the lesson, as Prototype 10 played it (handover v2 §9.1). Beat 1: your hit, replayed as the car's training clip; its
  // frame of impact held, boxed. Beat 2: the sensor fitted by a drone, the new field drawing out. Then the card: what it now does,
  // what that closes, what is open. Enter skips to the card; Enter on the card sends it back to the road.
  const CAM = '#9ff2c8', CAM_DIM = 'rgba(159,242,200,0.55)', ZN = { front: 'FRONT', frontDiagonal: 'FRONT CORNER', side: 'SIDE', rearDiagonal: 'REAR CORNER', rear: 'REAR' };
  const beats = (L) => { const P = T.DP || T.P, c = L.clip && L.clip.frames.length ? 1 : 0; return { clip: c * (P['duel.lessonClipSeconds'] || 3), hold: c * (P['duel.lessonHoldSeconds'] || 0.8), fit: L.part ? 0 : P['duel.lessonFitSeconds'] || 2 }; };
  function lessonKey(sim) {
    const L = sim && sim.duelT && sim.duelT.lesson; if (!L) return true;
    if (L.up) { const u = L.up.u || 0; if (u < 0.25) return false; if (u < L.up.Pt) { L.settle = true; return false; } return true; } // Prototype 11.3: a fresh press settles the screen; the next continues
    if (L.card) return true; L.skip = true; return false;
  }
  function lesson(cx, sim, G) {
    ctx = cx; s = sim; T = sim && sim.duelT; const L = T && T.lesson; if (!L) return;
    if (s && s.p11 && !L.part) return upgrade(L, G); // Prototype 11.3 (Edit 119): the car's upgrade screen
    if (L.ui0 == null) L.ui0 = G.t;
    const B = beats(L), t = G.t - L.ui0;
    if (!L.skip && t < B.clip + B.hold) return drawClip(L, t, B, G);
    if (!L.skip && t < B.clip + B.hold + B.fit) return drawFit(L, t - B.clip - B.hold, B, G);
    L.card = true; drawCard(L, G);
  }
  // The clip in the game's own graphics: game.js draws the field from the recorded frame (replayBegin/replayEnd around drawField):
  // the tile's art, Prototype 9's sprites for the cars and the dummy. Here: the camera's marks over it.
  function frameAt(L, t, B) { const fr = L.clip.frames, tt = L.clip.hitT - B.clip + Math.min(t, B.clip); let f = fr[0]; for (const q of fr) { if (q.t <= tt + 1e-6) f = q; else break; } return { f, tt }; }
  function replayBegin(sim, now) {
    const T2 = sim && sim.duelT, L = T2 && T2.lesson;
    if (L && sim.p11 && !L.part && sim.phase === 'lesson' && L.clip && L.clip.frames.length) { // Prototype 11.3: the replay plays in the upgrade screen's box
      T = T2; const f = clipFrame(L, upClipT(L, upU(L, now))), keep = { view: sim.view, cars: sim.cars, body: sim.body, effects: sim.effects };
      sim.view = f.view; sim.cars = f.view; if (f.b) sim.body = f.b; sim.effects = []; L.frame = f; return keep;
    }
    if (!L || sim.phase !== 'lesson' || !L.clip || !L.clip.frames.length || L.card || L.skip) return null;
    T = T2; if (L.ui0 == null) L.ui0 = now; const B = beats(L), t = now - L.ui0; if (t >= B.clip + B.hold + B.fit) return null;
    const { f } = frameAt(L, t, B), keep = { view: sim.view, cars: sim.cars, body: sim.body, effects: sim.effects };
    sim.view = f.view; sim.cars = f.view; if (f.b) sim.body = f.b; sim.effects = []; L.frame = f;
    return keep;
  }
  function replayEnd(sim, keep) { if (keep) Object.assign(sim, keep); }
  function camMarks(G, label, t, sub) { // REC, scan lines, the clip's name and clock
    ctx.save(); for (let y = G.FY; y < G.FY + G.FH; y += 4) rect(G.FX, y, G.FW, 1, 'rgba(0,0,0,0.14)');
    rect(G.FX, G.FY, G.FW, 46, 'rgba(6,10,18,0.72)'); text(label, G.FX + 20, G.FY + 31, 18, CAM);
    if (Math.floor(t * 2) % 2 === 0) { ctx.fillStyle = C.red; ctx.beginPath(); ctx.arc(G.FX + G.FW - 70, G.FY + 25, 7, 0, TAU); ctx.fill(); }
    text('REC', G.FX + G.FW - 20, G.FY + 31, 16, CAM, 'right');
    if (sub) { rect(G.FX, G.FY + G.FH - 40, G.FW, 40, 'rgba(6,10,18,0.72)'); text(sub, G.FX + 20, G.FY + G.FH - 14, 16, CAM_DIM); }
    text('ENTER · SKIP', G.FX + G.FW - 20, G.FY + G.FH - 14, 13, C.dim, 'right'); ctx.restore();
  }
  function drawClip(L, t, B, G) { // beat 1: your hit, as the car's training clip
    const k = G.RA / G.U, { f, tt } = frameAt(L, t, B), o = f && f.b;
    ctx.save(); ctx.beginPath(); ctx.rect(G.FX, G.FY, G.FW, G.FH); ctx.clip();
    rect(G.FX, G.FY, G.FW, G.FH, 'rgba(10,40,28,0.22)'); // the camera's tint
    ctx.translate(G.FX, G.FY); ctx.scale(k, k);
    if (s && s.p11) { const rc = f && f.view.find((q) => q.red && !q.ghost); if (rc && rc.L) kitCar(rc, L.from, { t: tt, mem: kitMem() }); } // Prototype 11.1: its kit as it was
    if (o && t >= B.clip) {
      ctx.strokeStyle = CAM; ctx.lineWidth = 2.5; ctx.strokeRect(o.x - 26, o.y - 40, 52, 58);
      label('IMPACT · ' + (ZN[L.clip.zone] || String(L.clip.zone || '').toUpperCase()), Math.max(90, Math.min(710, o.x)), o.y - 48, 12, CAM);
      if (L.to === 6 && L.origin) { const R = T.P['duel.memoryRadius'] || 30; ctx.strokeStyle = C.mem; ctx.beginPath(); ctx.arc(L.origin.x, L.origin.y, R, 0, TAU); ctx.stroke(); label('SAME SPOT AS BEFORE', L.origin.x, L.origin.y - R - 6, 12, C.mem); }
      if (L.to === 7 && L.seenAt) { const g = L.seenAt; ctx.strokeStyle = C.search; ctx.setLineDash([3, 4]); ctx.beginPath(); ctx.arc(g.x, g.y, 14, 0, TAU); ctx.moveTo(g.x, g.y); ctx.lineTo(o.x, o.y); ctx.stroke(); ctx.setLineDash([]); label('LAST SEEN · ' + (+g.ago || 0).toFixed(1) + ' s BEFORE', g.x, g.y - 22, 12, C.search); }
    }
    ctx.restore();
    const d = tt - L.clip.hitT; camMarks(G, 'TRAINING CLIP · ' + (L.model || 'RED-01'), t, (d < 0 ? '−' : '+') + Math.abs(d).toFixed(1) + ' s · YOUR HIT, AS THE CAR SAW IT');
  }
  function drawFit(L, t, B, G) { // beat 2: on the frame of impact, a drone lowers the new sensor onto the red car; its field draws out
    const k = G.RA / G.U, u = Math.min(1, t / B.fit), to = L.to, reach = Math.max(0, (u - 0.45) / 0.55), ri = DUELR()[to] || {}, f = L.frame, c = f && f.view.find((q) => q.red && !q.ghost);
    ctx.save(); ctx.beginPath(); ctx.rect(G.FX, G.FY, G.FW, G.FH); ctx.clip();
    rect(G.FX, G.FY, G.FW, G.FH, 'rgba(6,10,18,0.38)');
    ctx.translate(G.FX, G.FY); ctx.scale(k, k);
    if (c) {
      if (reach > 0) {
        ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h);
        if (to === 1) rect(c.L / 2, -(c.W / 2 + 13), reach * 520, c.W + 26, 'rgba(244,248,250,0.18)'); // the forward camera's beam
        if (to === 2) for (const sg of [-1, 1]) rect(-c.L / 2 - 20, sg > 0 ? c.W / 2 : -c.W / 2 - reach * 130, c.L + 160, reach * 130, 'rgba(127,168,188,0.22)'); // side cones
        if (to === 3) { ctx.strokeStyle = CAM; ctx.lineWidth = 2; for (let i = 1; i <= 3; i++) { ctx.globalAlpha = Math.max(0, 1 - i / 3.5); ctx.beginPath(); ctx.arc(0, 0, reach * 60 * i, 0, TAU); ctx.stroke(); } ctx.globalAlpha = 1; } // the roof lidar's sweep
        if (to === 5) { rect(c.L / 2 + 60, -(c.W / 2 + 8), 5, c.W + 16, C.red); ctx.fillStyle = '#ff8a1f'; ctx.beginPath(); ctx.moveTo(c.L / 2 + 92, -9); ctx.lineTo(c.L / 2 + 84, 8); ctx.lineTo(c.L / 2 + 100, 8); ctx.closePath(); ctx.fill(); } // stops short of a cone
        ctx.restore();
        if (to === 4) { ctx.strokeStyle = CAM; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.globalAlpha = reach; for (const cam of T.level.cameras || []) { ctx.beginPath(); ctx.moveTo(cam[0], cam[1] - 16); ctx.lineTo(c.x, c.y); ctx.stroke(); } ctx.setLineDash([]); ctx.globalAlpha = 1; } // the cameras link to it
        if (to === 6) { ctx.strokeStyle = C.mem; ctx.lineWidth = 2; T.crashes.forEach((cr, i) => { if (reach > (i + 1) / (T.crashes.length + 1)) { ctx.beginPath(); ctx.arc(cr.ox, cr.oy, T.P['duel.memoryRadius'] || 30, 0, TAU); ctx.stroke(); } }); } // the spots it remembers
        if (to === 7 && f.b) { ctx.strokeStyle = C.search; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.globalAlpha = reach; ctx.beginPath(); ctx.arc(f.b.x, f.b.y, 60, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1; label('LAST SEEN', f.b.x, f.b.y - 66, 12, C.search); }
      }
      if (s && s.p11) kitCar(c, u < 0.45 ? L.from : to, { t: G.t, mem: kitMem() }, u >= 0.45 ? (u - 0.45) * B.fit : null); // Prototype 11.1: the piece on the car as the drone lands
      const dy = u < 0.45 ? -150 * (1 - u / 0.45) : u < 0.7 ? -150 * ((u - 0.45) / 0.25) : null; // the drone: down to the car, the sensor fitted, away
      if (dy != null) drawDrone(c.x, c.y - 24 + dy, u < 0.45);
      ctx.strokeStyle = C.red; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(c.x, c.y, c.L * 0.75, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
    if (s && s.p11 && c && c.L) kitInset(L, u, G, c, k); // Prototype 11.1: the fitting, close up
    camMarks(G, String(ri.fit || 'SENSOR') + ' FITTED · ' + String(ri.sensor || ri.name || '').toUpperCase(), t, (L.model || 'RED-01') + ' · RUNG ' + L.from + ' → ' + to);
  }
  // ---------- Prototype 11.3 (GDD Edit 119): the car's upgrade screen, after the adversarial redesign spec (pipeline/runs/*-upgrade-spec).
  // The Dummy Chassis gift screen's family: one panel; the car large on the left, nose up; the drone brings the new piece; the landing
  // falls on the replay's frame of impact; the name pops; one sentence; the replay loops in a box. Times in seconds (proposed ui.upgrade.*).
  const UP = { land: 1.1, land2: 1.6, fall: 0.85, slide: 1.45, prompt: 1.6, prompt2: 2.1, crop: [456, 274], px: 5 };
  const KITC = [null, '#f4f8fa', '#7fa8bc', '#c3a6ff', '#9ff2c8', '#ff8a1f', '#ff5a5a', '#ff5a5a'];
  const SAY = { 1: 'It brakes for you when you stand in its lane.', 2: 'It spots you beside the road and stops short.', 3: 'It sees you jump or drop onto its road.',
    4: 'Street cameras tell it where you hide.', 5: 'It stops for a cone instead of swerving into you.', 6: 'It remembers every spot you hit it from.', 7: 'If it saw you, it searches where you were last.' };
  const SLOT = { 1: [[12, -5, 3, 10]], 2: [[3.9, 15.9, 5.2, 5.2], [3.9, -21.1, 5.2, 5.2]], 3: [[-12, -5, 10, 10]], 4: [[-28.6, -1.6, 8.2, 3.2]], 5: [[30, -12, 3, 24]], 6: [[17, -6, 10, 12]], 7: [[-1.6, -9.6, 5.2, 5.2]] }; // unit frame
  const clamp01 = (v) => Math.max(0, Math.min(1, v)), easeBack = (u) => 1 + 2.70158 * Math.pow(u - 1, 3) + 1.70158 * Math.pow(u - 1, 2);
  let rpCv = null, heroCv = null, pcCv = null, wCv = null, droneCv = null;
  const canvas = (cv, w, h) => { if (!cv) cv = document.createElement('canvas'); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } return cv; };
  function upU(L, now) { if (L.pin != null) { L.pinOk = true; return L.pin; } if (L.ui0 == null) L.ui0 = now; return now - L.ui0; }
  function upClipT(L, u) { // the clip's clock: the last 0.9 s to the hit, held 0.5 s; then a loop from where the car is wholly in view, and a 0.5 s hold
    const h = L.clip.hitT, hold = h - 0.05, P0 = L.Pt || UP.prompt; if (u < 0.2) return h - 0.9; if (u < UP.land) return Math.min(hold, h - 0.9 + (u - 0.2)); if (u < P0) return hold; // the hold: three ticks before the game's struck look
    const lp = upLoop(L), c = (u - P0) % (lp + 0.5); return c < lp ? Math.min(hold, h - lp + c) : hold;
  }
  function upLoop(L) { // seconds before the hit the loop starts: the first frame from -2 s with the car wholly inside the crop, -1.6 s at the latest
    if (L.loopS != null) return L.loopS; const cr = upCrop(L), h = L.clip.hitT; let lp = 1.6;
    for (let d = 2; d >= 1.6; d -= 0.05) { const f = clipFrame(L, h - d), c = f.view.find((q) => q.red && !q.ghost), r = c ? Math.max(c.L || 60, c.W || 30) / 2 : 0; if (c && c.x - r >= cr.x && c.x + r <= cr.x + cr.w && c.y - r >= cr.y && c.y + r <= cr.y + cr.h) { lp = d; break; } }
    return (L.loopS = +lp.toFixed(2));
  }
  const upHold = (L, u) => { const P0 = L.Pt || UP.prompt; return u >= UP.land && (u < P0 || (u - P0) % (upLoop(L) + 0.5) >= upLoop(L)); };
  const upBlack = (L, u) => { const P0 = L.Pt || UP.prompt; if (u < P0) return 0; const cy = upLoop(L) + 0.5, c = (u - P0) % cy; return u - P0 < 0.1 ? 0 : c < 0.1 ? 1 - c / 0.1 : c > cy - 0.1 ? (c - (cy - 0.1)) / 0.1 : 0; }; // a 0.1 s dip between loops
  function underDeck(c) { if (!c || (c.elev || 0) > 0 || !T || !T.duelSc) return false; const HALF = ((T.P && T.P['world.deckWidth']) || 160) / 2; return (T.duelSc.layers || []).some((l) => l.dk && (l.dk.hz ? Math.abs(c.y - l.dk.off) < HALF : Math.abs(c.x - l.dk.off) < HALF)); }
  function clipFrame(L, tt) { let f = L.clip.frames[0]; for (const q of L.clip.frames) { if (q.t <= tt + 1e-6) f = q; else break; } return f; }
  function upCrop(L) { // a 456 x 274 window between the car a second before the hit and the point of impact
    if (L.crop) return L.crop; const h = L.clip.hitT, f0 = clipFrame(L, h - 1), f1 = clipFrame(L, h), c0 = f0.view.find((q) => q.red && !q.ghost), b = f1.b || f0.b;
    const ax = c0 ? c0.x : b ? b.x : 400, ay = c0 ? c0.y : b ? b.y : 320, bx = b ? b.x : ax, by = b ? b.y : ay, [w, hh] = UP.crop;
    return (L.crop = { x: Math.max(0, Math.min(800 - w, (ax + bx) / 2 - w / 2)), y: Math.max(0, Math.min(640 - hh, (ay + by) / 2 - hh / 2)), w, h: hh });
  }
  function offDraw(cv, fn) { const keep = ctx; ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(2, 0, 0, 2, 80, 48); try { fn(); } finally { ctx = keep; } return cv; } // 2 px a unit; the car's frame centred
  function whiteOf(src) { wCv = canvas(wCv, src.width, src.height); const g = wCv.getContext('2d'); g.clearRect(0, 0, wCv.width, wCv.height); g.globalCompositeOperation = 'source-over'; g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#ffffff'; g.fillRect(0, 0, wCv.width, wCv.height); g.globalCompositeOperation = 'source-over'; return wCv; }
  function droneSprite() { const D = root.PIX && root.PIX.DRONE; if (!D) return null; if (droneCv) return droneCv; droneCv = canvas(null, D.w, D.h); const g = droneCv.getContext('2d'), id = g.createImageData(D.w, D.h); new Uint32Array(id.data.buffer).set(D.d); g.putImageData(id, 0, 0); return droneCv; }
  function upgrade(L, G) {
    const pair = root.P11 && root.P11.lessonPair ? root.P11.lessonPair(s) : [L.to], two = pair.length > 1, Pt = G.rm ? 1.0 : two ? UP.prompt2 : UP.prompt, RM = !!G.rm;
    if (L.settle) { L.settle = false; L.pin = null; L.ui0 = G.t - Pt; L.sfx = { all: true }; }
    const u = upU(L, G.t); L.up = { u, Pt }; L.Pt = two ? UP.prompt2 : UP.prompt; // the replay's clock is the same in reduced motion; only the prompt comes early L.pair = two; L.card = u >= Pt; // card: settled, the prompt up (the bots and tests wait for it)
    const k = G.FW / 800, X = (x) => G.FX + (x - 240) * k, Y = (y) => G.FY + (y - 40) * k, Z = (v) => v * k;
    const lands = RM ? [0.7, 0.7] : [UP.land, UP.land2], landed = (i) => u >= lands[i], col = (i) => KITC[pair[i]] || C.text;
    // the replay: game.js drew the recorded frame into the field; keep that crop before the panel covers it
    let rp = null;
    if (L.clip && L.clip.frames.length) {
      const cr = upCrop(L), m = ctx.getTransform(), sx = m.a * (G.FX + cr.x * k) + m.e, sy = m.d * (G.FY + cr.y * k) + m.f, W = Math.max(1, Math.round(m.a * cr.w * k)), H = Math.max(1, Math.round(m.d * cr.h * k));
      rpCv = canvas(rpCv, W, H); const g = rpCv.getContext('2d'); g.clearRect(0, 0, W, H); g.drawImage(ctx.canvas, Math.round(sx), Math.round(sy), W, H, 0, 0, W, H); rp = { cr, W, H };
    }
    upSound(L, u, two, G);
    ctx.save();
    rect(G.FX, G.FY, G.FW, G.FH, 'rgba(10,12,18,' + (0.86 * clamp01(u / (RM ? 0.2 : 0.18))) + ')');
    const px = X(276), py = Y(66), pw = Z(728), ph = Z(588), cxp = px + pw / 2, cyp = py + ph / 2;
    const sc = RM ? 1 : 0.86 + 0.14 * easeBack(clamp01(u / 0.3)), sh = !RM && u >= lands[0] && u < lands[0] + 0.3 ? 6 * Math.pow(1 - (u - lands[0]) / 0.3, 2) : 0;
    ctx.globalAlpha = RM ? clamp01(u / 0.2) : 1;
    ctx.translate(cxp + Z(sh * Math.sin(u * 93)), cyp + Z(sh * Math.cos(u * 71))); ctx.scale(sc, sc); ctx.translate(-cxp, -cyp);
    const rr = (x, y, w, h, r) => { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); };
    rr(px, py, pw, ph, Z(12)); ctx.fillStyle = '#0b0f1a'; ctx.fill(); ctx.strokeStyle = '#3fd0ff'; ctx.lineWidth = 2; ctx.stroke();
    // the hero column: glow, rays, the car nose up, the drone, the landing
    const hx = X(300), hy = Y(90), hw = Z(290), hh = Z(454), cx = X(450), cy = Y(360), P = UP.px * k, white1 = !RM && pair[two && u >= lands[1] ? 1 : 0] === 1; // the hero layer stops at y 544, above the pips
    const toS = (ux, uy) => ({ x: cx + uy * P, y: cy - ux * P }), slotC = (n) => { const a = KIT.at[n] || [0, 0]; return toS(a[0], n === 2 ? 0 : a[1]); };
    ctx.save(); ctx.beginPath(); ctx.rect(hx, hy, hw, hh); ctx.clip();
    const edge = (m0) => Math.max(Z(40), Math.min(Z(145), m0.x - hx - Z(8), hx + hw - m0.x - Z(8), m0.y - hy - Z(8), hy + hh - m0.y - Z(8))); // rays and rings fade out before any edge of the column
    { const gl = ctx.createRadialGradient(cx, cy, Z(20), cx, cy, Z(145)); gl.addColorStop(0, white1 ? 'rgba(255,61,61,0.30)' : 'rgba(255,61,61,0.22)'); gl.addColorStop(1, 'rgba(255,61,61,0)'); ctx.fillStyle = gl; ctx.fillRect(hx, hy, hw, hh); }
    const last = landed(1) && two ? 1 : 0;
    if (landed(0)) { // rays in the newest piece's colour, turning
      const m0 = { x: cx, y: cy }, a = RM ? 0.14 : (white1 ? 0.45 : 0.3) * clamp01((u - lands[0]) / 0.3), rot = RM ? 0.3 : u * 20 * D, N = 12, R = edge(m0), gr = ctx.createRadialGradient(m0.x, m0.y, 0, m0.x, m0.y, R), c0 = col(last);
      gr.addColorStop(0, hexA(c0, a)); gr.addColorStop(0.69, hexA(c0, a)); gr.addColorStop(1, hexA(c0, 0)); ctx.fillStyle = gr; ctx.beginPath();
      for (let i = 0; i < N; i++) { const a0 = rot + i * TAU / N; ctx.moveTo(m0.x, m0.y); ctx.arc(m0.x, m0.y, R, a0, a0 + TAU / N * 0.42); ctx.closePath(); } ctx.fill();
    }
    const base = (pair[0] || 1) - 1, has = base + (landed(0) ? 1 : 0) + (two && landed(1) ? 1 : 0), mem = kitMem();
    heroCv = offDraw(canvas(heroCv, 160, 96), () => { kitBody(); kitPieces(has, { t: G.t, mem, seat: true }); });
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Math.PI / 2); ctx.imageSmoothingEnabled = false; ctx.globalAlpha = RM || landed(0) ? 1 : 0.6; ctx.drawImage(heroCv, -40 * P, -24 * P, 80 * P, 48 * P); ctx.globalAlpha = 1; ctx.restore();
    const piece = (n, dx, dy, alpha, white, air) => { // air: in flight, 1.15x over a 6 px shadow, so it reads above the car
      pcCv = offDraw(canvas(pcCv, 160, 96), () => kitPieces(n, { t: G.t, mem, only: n, seat: true })); const sl = slotC(n), px2 = sl.x + dx, py2 = sl.y + dy;
      const put = (src, ox, oy, a, sc2) => { ctx.save(); ctx.globalAlpha = a; ctx.translate(px2 + ox, py2 + oy); ctx.scale(sc2, sc2); ctx.translate(-px2, -py2); ctx.translate(cx + dx, cy + dy); ctx.rotate(-Math.PI / 2); ctx.imageSmoothingEnabled = false; ctx.drawImage(src, -40 * P, -24 * P, 80 * P, 48 * P); ctx.restore(); };
      if (air) { const sh2 = whiteOf(pcCv), g2 = sh2.getContext('2d'); g2.globalCompositeOperation = 'source-in'; g2.fillStyle = '#000000'; g2.fillRect(0, 0, sh2.width, sh2.height); g2.globalCompositeOperation = 'source-over'; put(sh2, Z(6), Z(6), 0.35 * alpha, 1.15); }
      put(white ? whiteOf(pcCv) : pcCv, 0, 0, alpha, air ? 1.15 : 1);
    };
    const brackets = (n, a) => { for (const [x0, y0, w, h] of SLOT[n] || []) { const p0 = toS(x0 + w, y0), p1 = toS(x0, y0 + h), X0 = Math.min(p0.x, p1.x) - Z(8), Y0 = Math.min(p0.y, p1.y) - Z(8), X1 = Math.max(p0.x, p1.x) + Z(8), Y1 = Math.max(p0.y, p1.y) + Z(8), l = Z(10); ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = KITC[n]; ctx.lineWidth = 3; ctx.beginPath(); for (const [qx, qy, sx2, sy2] of [[X0, Y0, 1, 1], [X1, Y0, -1, 1], [X0, Y1, 1, -1], [X1, Y1, -1, -1]]) { ctx.moveTo(qx + sx2 * l, qy); ctx.lineTo(qx, qy); ctx.lineTo(qx, qy + sy2 * l); } ctx.stroke(); ctx.restore(); } };
    if (RM) { pair.forEach((n, i) => { const a = clamp01((u - 0.4) / 0.3); if (!landed(i) && a > 0) piece(n, 0, 0, a); if (landed(i)) { const m0 = slotC(n); ctx.strokeStyle = hexA(KITC[n], 0.5); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(m0.x, m0.y, Z(60), 0, TAU); ctx.stroke(); } }); }
    else {
      pair.forEach((n, i) => { if (!landed(i) && u >= 0.3) brackets(n, 0.7 + 0.3 * Math.sin(u * TAU * 3)); });
      // the drone: down to y 150, above the car, never on it; the piece lowered on its tether to 40 above its slot (0.3-0.85); let go, it falls (to 1.1).
      // Two pieces: the second rides under the drone, is lowered once the first lands (1.1-1.45), let go, falls (to 1.6). Then the drone climbs out of the panel.
      const dr = droneSprite(), DS = 3 * k, s0 = slotC(pair[0]), s1 = two ? slotC(pair[1]) : s0, hov = Y(150), topY = Y(40), outT = two ? UP.land2 : UP.fall;
      const over = s1.y - Z(44), fly = (q) => hov + (over - hov) * (1 - Math.pow(1 - q, 2)); // two pieces: the drone flies over the car to the second slot
      const dY = u < 0.3 ? null : u < UP.fall ? topY + (hov - topY) * (1 - Math.pow(1 - clamp01((u - 0.3) / (UP.fall - 0.3)), 2)) : !two ? (u < outT ? hov : hov - (hov - Y(-40)) * Math.pow(clamp01((u - outT) / 0.25), 2))
        : u < UP.land ? hov : u < UP.slide ? fly(clamp01((u - UP.land) / (UP.slide - UP.land))) : u < outT ? over : over - (over - Y(-40)) * Math.pow(clamp01((u - outT) / 0.35), 2), dX = cx;
      const hang = []; // [piece index, the piece's centre y]
      const low = Y(180); // a carried piece never comes lower than the nose's line until it is let go
      if (dY != null && u < UP.fall) { hang.push([0, Math.min(low, dY + Z(30))]); if (two) hang.push([1, Math.min(low - Z(4), dY + Z(22))]); }
      else if (two && u < UP.slide) hang.push([1, u < UP.land ? Math.min(low, dY + Z(30)) : dY + Z(30)]);
      for (const [i, py2] of hang) { // the tether: one line a sub-slot (the pods hang on a split tether)
        const n = pair[i], sl = i === 0 ? s0 : s1, dy2 = py2 - sl.y; ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.beginPath();
        for (const [x0, y0, w, h] of SLOT[n] || [[0, 0, 0, 0]]) { const p = toS(x0 + w / 2, y0 + h / 2); ctx.moveTo(dX, dY + Z(8)); ctx.lineTo(p.x, p.y + dy2); } ctx.stroke();
        piece(n, 0, dy2, 1, false, true);
      }
      for (let i = 0; i < pair.length; i++) { // a falling piece, with three ghost trails
        const t0 = i === 0 ? UP.fall : UP.slide; if (u < t0 || landed(i)) continue;
        const sl = i === 0 ? s0 : s1, from = (i === 0 ? Math.min(Y(180), hov + Z(30)) : over + Z(30)) - sl.y, q = clamp01((u - t0) / (lands[i] - t0)), off = from * (1 - q * q); // the drop: the full way from above the nose; the second piece settles in place
        for (const [j, a] of [[3, 0.15], [2, 0.3], [1, 0.5]]) piece(pair[i], 0, off - j * Z(i === 0 ? 18 : 6) * q, a);
        piece(pair[i], 0, off, 1, false, q < 0.9);
      }
      if (dY != null && dY > Y(-40)) {
        if (dr) { ctx.imageSmoothingEnabled = false; ctx.drawImage(dr, Math.round(dX - root.PIX.DRONE.ox * DS), Math.round(dY - root.PIX.DRONE.oy * DS), root.PIX.DRONE.w * DS, root.PIX.DRONE.h * DS); }
        else { ctx.save(); ctx.translate(dX, dY); ctx.scale(DS, DS); drawDrone(0, 0, false); ctx.restore(); }
      }
      for (let i = 0; i < pair.length; i++) { // the landing: the piece flashes; rings in red and its colour; sparks and the panel flash on the first only
        const lt = u - lands[i], n = pair[i]; if (lt < 0 || lt > 0.7) continue;
        if (lt < 0.4 && Math.floor(lt * 14) % 2 === 0) piece(n, 0, 0, 1, true);
        for (const m0 of n === 2 ? [toS(6.5, 18.5), toS(6.5, -18.5)] : [slotC(n)]) { // the pods: a ring pair and a burst on each
        for (const [d0, c0, wd] of [[0, C.red, 5], [0.05, KITC[n], 3]]) { const q = clamp01((lt - d0 + 0.02) / 0.5); if (q <= 0 || q >= 1) continue; const e = 1 - Math.pow(1 - q, 3); ctx.globalAlpha = 1 - q; ctx.strokeStyle = c0; ctx.lineWidth = wd; ctx.beginPath(); ctx.arc(m0.x, m0.y, Z(20) + (edge(m0) - Z(20)) * e, 0, TAU); ctx.stroke(); }
        if (i === 0) { const q = clamp01(lt / 0.45), NS = n === 2 ? 6 : 12; if (q < 1) { const e = 1 - Math.pow(1 - q, 2); ctx.globalAlpha = 1 - q; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.beginPath(); for (let j = 0; j < NS; j++) { const a = j * TAU / NS + 0.2, r0 = Z(40 + 50 * e), r1 = r0 + Z(18 * (1 - e) + 4); ctx.moveTo(m0.x + Math.cos(a) * r0, m0.y + Math.sin(a) * r0); ctx.lineTo(m0.x + Math.cos(a) * r1, m0.y + Math.sin(a) * r1); } ctx.stroke(); } }
        const gq = clamp01((lt - 0.1) / 0.6); if (gq > 0 && gq < 1) { ctx.globalAlpha = 1 - gq; ctx.strokeStyle = C.text; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(m0.x, m0.y, Z(10 + 40 * gq), 0, TAU); ctx.stroke(); } // the glint: the piece switching on
        }
        ctx.globalAlpha = 1;
      }
      if (u >= lands[0] && u < lands[0] + 0.2) { const m0 = slotC(pair[0]), fl = ctx.createRadialGradient(m0.x, m0.y, 0, m0.x, m0.y, edge(m0)), a = 0.45 * (1 - (u - lands[0]) / 0.2); fl.addColorStop(0, 'rgba(255,255,255,' + a + ')'); fl.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = fl; ctx.fillRect(hx, hy, hw, hh); } // the flash: a burst from the slot, on the car's column only
    }
    ctx.restore(); // the hero column's clip
    // the ladder: seven pips in the kit colours, no numbers, on a plate above the hero layer
    rect(X(322), Y(548), Z(256), Z(32), '#0b0f1a');
    for (let i = 0; i < 7; i++) {
      const n = i + 1, x0 = X(330 + i * 36), y0 = Y(556), w = Z(24), h = Z(12), on = n <= has, j = pair.indexOf(n), fresh = j >= 0 && u - lands[j] < 0.15 && u >= lands[j];
      if (on) { rect(x0, y0, w, h, fresh ? '#ffffff' : KITC[n]); if (n === 1) { ctx.strokeStyle = C.red; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y0 + 0.5, w - 1, h - 1); } } else { rect(x0, y0, w, h, '#1a2230'); ctx.strokeStyle = C.dim; ctx.lineWidth = 1; ctx.strokeRect(x0 + 0.5, y0 + 0.5, w - 1, h - 1); }
    }
    // the text column
    const tx = X(600), tw = Z(380), ri = (n) => DUELR()[n] || {};
    const txt = (t, x, y, size, c, al, font) => { ctx.fillStyle = c; ctx.font = font || `700 ${size}px B612, system-ui, sans-serif`; ctx.textAlign = al || 'left'; ctx.fillText(t, x, y); };
    const wrapAt = (t, x, y, mw, lh, font, c) => { ctx.font = font; const ws = String(t).split(' '); let line = '', yy = y; for (const wd of ws) { const tt = line ? line + ' ' + wd : wd; if (ctx.measureText(tt).width > mw && line) { txt(line, x, yy, 0, c, 'left', font); line = wd; yy += lh; } else line = tt; } if (line) txt(line, x, yy, 0, c, 'left', font); return yy; };
    const nameAt = (n, y, size, t0) => { if (u < t0) return; const nm = String(KIT.name[n] || ri(n).sensor || '').toUpperCase(); let sz = Z(size); ctx.font = `900 ${sz}px Nunito, system-ui, sans-serif`; while (ctx.measureText(nm).width > tw && sz > Z(size === 48 ? 40 : 30)) { sz -= 1; ctx.font = `900 ${sz}px Nunito, system-ui, sans-serif`; } const cap = Math.max(1, Math.min(1.4, Z(392) / Math.max(1, ctx.measureText(nm).width))), pop = RM ? 1 : 1 + (cap - 1) * Math.pow(clamp01(1 - (u - t0) / 0.28), 2); ctx.save(); ctx.beginPath(); ctx.rect(X(596), Y(96), Z(404), Z(200)); ctx.clip(); ctx.globalAlpha = clamp01((u - t0) / 0.12); ctx.translate(tx, y); ctx.scale(pop, pop); txt(nm, 0, 0, 0, C.red, 'left', ctx.font); ctx.restore(); };
    const sayAt = (n, y, size, lh, t0) => { if (u < t0) return; const q = RM ? 1 : clamp01((u - t0) / 0.2); ctx.save(); ctx.globalAlpha = RM ? clamp01((u - t0) / 0.2) : q; wrapAt(SAY[n] || '', tx, y + Z(8 * (1 - q)), tw, Z(lh), `400 ${Z(size)}px B612, system-ui, sans-serif`, C.text); ctx.restore(); };
    if (u < lands[0]) { if (u >= (RM ? 0 : 0.3) && (RM || Math.floor(u * 8) % 4 !== 3)) txt('RED-01 · NEW PART INCOMING', tx, Y(112), Z(20), '#3fd0ff'); }
    else txt(two ? 'RED-01 LEARNED 2 THINGS' : 'RED-01 LEARNED', tx, Y(112), Z(20), '#3fd0ff');
    const tN = RM ? 0.6 : lands[0], tS = RM ? 0.75 : UP.land + 0.2;
    if (!two) {
      nameAt(pair[0], Y(166), 48, tN);
      if (u >= tN) { ctx.save(); ctx.globalAlpha = clamp01((u - tN) / 0.2); ctx.fillStyle = col(0); ctx.beginPath(); ctx.arc(tx + Z(10), Y(196), Z(10), 0, TAU); ctx.fill(); txt(String(ri(pair[0]).sensor || ri(pair[0]).name || '').toUpperCase(), tx + Z(30), Y(204), Z(22), C.text); ctx.restore(); }
      sayAt(pair[0], Y(250), 26, 34, tS);
    } else {
      nameAt(pair[0], Y(154), 34, tN); sayAt(pair[0], Y(184), 21, 26, tS);
      nameAt(pair[1], Y(252), 34, RM ? 0.6 : lands[1]); sayAt(pair[1], Y(282), 21, 26, RM ? 0.75 : lands[1] + 0.2);
    }
    // the replay: YOUR HIT, the car's training clip, in a box
    if (u >= 0.2 || RM) { txt('YOUR HIT', tx, Y(352), Z(16), C.dummy); ctx.font = `700 ${Z(16)}px B612, system-ui, sans-serif`; txt(' · ITS TRAINING CLIP', tx + ctx.measureText('YOUR HIT').width, Y(352), Z(16), CAM); }
    const bx = X(600), by = Y(360), bw = Z(380), bh = Z(228);
    rect(bx, by, bw, bh, '#05070c');
    if (rp) {
      ctx.imageSmoothingEnabled = false; ctx.drawImage(rpCv, 0, 0, rp.W, rp.H, bx, by, bw, bh);
      { const f = L.frame, c = f && f.view.find((q) => q.red && !q.ghost); if (c && underDeck(c)) { const q = bw / rp.cr.w; heroCv = offDraw(canvas(heroCv, 160, 96), () => { kitBody(); kitPieces(L.from, { t: G.t, mem: kitMem() }); }); ctx.save(); ctx.beginPath(); ctx.rect(bx, by, bw, bh); ctx.clip(); ctx.translate(bx + (c.x - rp.cr.x) * q, by + (c.y - rp.cr.y) * q); ctx.rotate(c.h); ctx.scale((c.L || 64) / 64 * q, (c.W || 30) / 30 * q); ctx.drawImage(heroCv, -40, -24, 80, 48); ctx.restore(); } } // under a deck the game dithers the car; the replay shows it solid
      { const a = upBlack(L, u); if (a > 0) rect(bx, by, bw, bh, 'rgba(5,7,12,' + a.toFixed(2) + ')'); }
      rect(bx, by, bw, bh, 'rgba(159,242,200,0.10)'); if (!RM) for (let y = by; y < by + bh; y += Z(4)) rect(bx, y, bw, Z(1), 'rgba(0,0,0,0.08)');
      const f = L.frame, o = f && f.b; if (o && upHold(L, u)) { const q = bw / rp.cr.w; ctx.strokeStyle = C.dummy; ctx.lineWidth = 2; ctx.strokeRect(bx + (o.x - rp.cr.x - 16) * q, by + (o.y - rp.cr.y - 26) * q, 32 * q, 40 * q); }
    }
    ctx.strokeStyle = CAM; ctx.lineWidth = 2; ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);
    if (u >= Pt && (RM || Math.floor((u - Pt) * 4) % 2 === 0)) txt((G.dev === 'touch' ? 'TAP' : G.dev === 'pad' ? 'A' : 'SPACE') + ' · CONTINUE', X(980), Y(624), Z(22), '#3fd0ff', 'right');
    ctx.restore();
  }
  function hexA(h, a) { const n = parseInt(String(h).slice(1), 16); return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function upSound(L, u, two, G) { // the gift fanfare's shape, a fourth lower and square: whoosh, thud, arpeggio, chord, a ping a piece
    const Snd = G.snd; if (!Snd) return; const f = L.sfx || (L.sfx = {}); if (f.all || L.pin != null) return;
    const at = (key, t, fn) => { if (!f[key] && u >= t) { f[key] = true; if (u - t < 0.25) try { fn(); } catch (e) { /* no audio */ } } };
    at('in', 0, () => Snd.noise(800, 3000, 0.25, 0.02));
    if (!G.rm) at('whoosh', 0.3, () => { Snd.tone(280, 1300, 0.8, 'sine', 0.035); Snd.noise(500, 4200, 0.8, 0.03); });
    at('land', G.rm ? 0.7 : UP.land, () => { Snd.tone(150, 45, 0.32, 'square', 0.09); Snd.noise(4200, 900, 0.3, 0.06); [440, 554.37, 659.25, 880].forEach((q, j) => Snd.tone(q, q, 0.16, 'square', 0.035, 0.05 + j * 0.09)); Snd.tone(2637, 2637, 0.07, 'sine', 0.02, 0.1); });
    if (two) at('land2', G.rm ? 0.7 : UP.land2, () => { Snd.tone(220, 80, 0.2, 'square', 0.06); Snd.tone(3136, 3136, 0.07, 'sine', 0.02, 0.1); });
    at('chord', two ? 1.9 : 1.5, () => { [659.25, 880, 1108.73].forEach((q) => Snd.tone(q, q * 1.004, 0.6, 'triangle', 0.04)); Snd.tone(220, 220, 0.6, 'sine', 0.05); });
  }
  function drawPartCard(L, G) { // the player's upgrade: one thing a tile (Lawrence, 7 Nov)
    const pt = L.info || {}; ctx.save(); rect(G.FX, G.FY, G.FW, G.FH, 'rgba(5,7,15,0.82)');
    const w = Math.min(G.FW - 60, 980), x = G.FX + (G.FW - w) / 2, y = G.FY + 40, h = G.FH - 80;
    rect(x, y, w, h, 'rgba(12,14,20,0.96)'); ctx.strokeStyle = C.dummy; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
    text('DUMMY CORPORATION · PARTS', x + 34, y + 52, 18, C.dim);
    text('PART EARNED: ' + String(pt.name || L.part).toUpperCase(), x + 34, y + 104, 40, C.dummy, 'left', 900);
    text(String(pt.verb || '') + ' · ' + String(pt.key || '').toUpperCase(), x + 36, y + 150, 24, C.text, 'left', 900);
    text(String(pt.text || ''), x + 36, y + 196, 20, C.text);
    const nx = root.P11 && root.P11.lessonNext ? root.P11.lessonNext(s) : null; // Prototype 11: the next puzzle
    text(nx ? 'Fitted for the next puzzle. ' + nx : pt.p9 ? 'The drone fits it on the way to ' + (L.next || 'the next tile') + '. You will need it there.' : 'Fitted now. You will need it on ' + (L.next || 'the next tile') + '.', x + 36, y + 236, 18, '#9ff2c8');
    if (Math.floor((G.t || 0) * 2) % 2 === 0) text('ENTER · CONTINUE', x + w - 34, y + h - 30, 20, C.dummy, 'right', 900);
    ctx.restore();
  }
  function drawCard(L, G) {
    if (L.part) return drawPartCard(L, G);
    const info = LESSON[L.to] || ['', '', ''], ri = DUELR()[L.to] || {};
    ctx.save(); rect(G.FX, G.FY, G.FW, G.FH, 'rgba(5,7,15,0.82)');
    const w = Math.min(G.FW - 60, 980), x = G.FX + (G.FW - w) / 2, y = G.FY + 40, h = G.FH - 80;
    rect(x, y, w, h, 'rgba(12,14,20,0.96)'); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
    text('FARSIGHT · TRAINING LOG · RED-01', x + 34, y + 52, 18, C.dim);
    text('LESSON: ' + String(ri.sensor || ri.name || '').toUpperCase(), x + 34, y + 104, 40, C.red, 'left', 900);
    text('Rung ' + L.from + ' → ' + L.to + '. Your hit: ' + String(L.zone || '').replace('Diagonal', ' corner').toUpperCase() + ' · ' + String(L.kind || '').toUpperCase(), x + 36, y + 142, 18, C.text);
    const wrap = (t, x0, y0, mw, lh, size, col) => { ctx.font = `700 ${size}px B612, system-ui, sans-serif`; const ws = String(t).split(' '); let line = '', yy = y0; for (const wd of ws) { const tt = line ? line + ' ' + wd : wd; if (ctx.measureText(tt).width > mw && line) { text(line, x0, yy, size, col); line = wd; yy += lh; } else line = tt; } if (line) text(line, x0, yy, size, col); return yy + lh; };
    let yy = y + 196;
    yy = wrap(info[0], x + 36, yy, w - 72, 30, 22, C.text) + 14;
    text('CLOSED', x + 36, yy, 15, C.red); yy = wrap(info[1], x + 150, yy, w - 186, 28, 20, C.text) + 10;
    const nx = root.P11 && root.P11.lessonNext ? root.P11.lessonNext(s) : null; // Prototype 11: the next puzzle, not how to beat it
    if (nx) { text('NEXT', x + 36, yy, 15, C.dummy); yy = wrap(nx, x + 150, yy, w - 186, 28, 20, C.dummy) + 10; }
    else { text('OPEN', x + 36, yy, 15, '#9ff2c8'); yy = wrap(info[2], x + 150, yy, w - 186, 28, 20, '#9ff2c8') + 10; }
    if (Math.floor((G.t || 0) * 2) % 2 === 0) text('ENTER · CONTINUE', x + w - 34, y + h - 30, 20, C.dummy, 'right', 900);
    ctx.restore();
  }
  root.DUEL_UI = { field, hud, lesson, lessonKey, replayBegin, replayEnd, redSprite, underHud };
})(typeof window !== 'undefined' ? window : globalThis);
