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
    5: ['Road items: it stops for a cone and never swerves round it.', 'The cone bait.', 'DUCK (hold C) behind a low planter; spring into its path just ahead of it.'],
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
  function drawTag(c) {
    const ri = T.rungInfo(), st = T.sideStage(c), FW = T.P['world.width'];
    const tag = 'RED-01 · R' + T.rung + ' ' + (ri ? ri.name.toUpperCase() : '') + (c.lkp ? ' · ' + (c.lkp.found ? 'FOUND' : 'SEARCHING') : st >= 1 && c.v >= 1 ? ' · ' + AWARE[st] : c.spent ? ' · DRIVING OFF' : '');
    const x = Math.max(90, Math.min(FW - 90, c.x)), y = c.y - 30;
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
    const col = c.cause === 'search' ? C.search : T.expected() ? C.mem : C.text, half = c.W / 2 + 6, nx = -Math.sin(sp.h), ny = Math.cos(sp.h);
    ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.globalAlpha = sp.arrived ? 0.9 : 0.75; ctx.setLineDash(sp.arrived ? [] : [5, 4]);
    ctx.beginPath(); ctx.moveTo(sp.x + nx * half, sp.y + ny * half); ctx.lineTo(sp.x - nx * half, sp.y - ny * half); ctx.stroke(); ctx.restore();
    if (!sp.arrived) label('STOPS HERE', sp.x + nx * (half + 12), sp.y + ny * (half + 12) + 4, 8, col);
  }
  function drawGhost(c) { // rung 7: where it last saw the dummy, the ring it searches, its time left
    const g = c.lkp; if (!g) return;
    const R = T.P['duel.searchRadius'] || 0, Tk = T.P['duel.searchSeconds'] || 0, left = Math.max(0, 1 - (T.t - g.had) / (Tk || 1)), near = T.searched(), r = T.P['body.radius'];
    ctx.save(); ctx.strokeStyle = C.search; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.arc(g.x, g.y, r, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(g.x, g.y - r - 5, 4, 0, TAU); ctx.stroke();
    ctx.strokeStyle = near ? C.search : C.searchDim; ctx.lineWidth = near ? 2 : 1.5; ctx.setLineDash(near ? [] : [6, 5]); ctx.beginPath(); ctx.arc(g.x, g.y, R, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = C.search; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(g.x, g.y, R + 5, -Math.PI / 2, -Math.PI / 2 + TAU * left); ctx.stroke();
    ctx.strokeStyle = C.searchDim; ctx.lineWidth = 1; ctx.setLineDash([2, 4]); ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(g.x, g.y); ctx.stroke(); ctx.restore();
    label('LAST SEEN', g.x, g.y - R - 8, 9, C.search);
  }
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
      const tx = cr.x + 16, ty = cr.y - 18; ctx.fillStyle = C.tent; ctx.beginPath(); ctx.moveTo(tx - 7, ty + 6); ctx.lineTo(tx, ty - 7); ctx.lineTo(tx + 7, ty + 6); ctx.closePath(); ctx.fill(); text(String(n), tx, ty + 5, 8, C.joint, 'center');
      ctx.globalAlpha = 1;
      if (!kept) continue;
      const hot = checked.has(n); ctx.save(); ctx.strokeStyle = hot ? C.mem : C.memDim; ctx.lineWidth = hot ? 2.5 : 1.5; ctx.setLineDash(hot ? [] : [6, 5]);
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
        if (F < 360 && aim != null) { ctx.moveTo(x, y); ctx.arc(x, y, R, (aim - F / 2) * D, (aim + F / 2) * D); ctx.closePath(); ctx.fillStyle = C.camCone; ctx.fill(); } else ctx.arc(x, y, R, 0, TAU);
        ctx.stroke(); ctx.restore(); }
      if (!root.WORLD6 || !root.WORLD6.paintPost) { rect(x - 1.5, y - 14, 3, 14, C.joint); rect(x - 6, y - 20, 12, 7, C.joint); } ctx.fillStyle = C.cam; ctx.beginPath(); ctx.arc(x + (aim != null ? Math.cos(aim * D) * 4 : 3), y - 16.5, 2, 0, TAU); ctx.fill(); }
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
    const col = !g.ready ? 'rgba(255,255,255,0.3)' : hot ? C.dummy : mine ? C.dim : 'rgba(255,255,255,0.7)', ex = red ? g.hit.x : g.x1, ey = red ? g.hit.y : g.y1, r = T.P['body.radius'];
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
      else if (e.type === 'first-side') flashes.push({ car: e.car, t: 2.2, n: 'ITS SIDE CONES HAVE YOU', c: C.text });
      else if (e.type === 'lesson-due') flashes.push({ car: e.car, t: 2.6, n: 'LESSON DUE: ' + String((DUELR()[e.to] || {}).name || '').toUpperCase(), c: C.red });
      else if (e.type === 'block-lift') flashes.push({ x: e.x, y: e.y - 40, t: 2, n: 'FARSIGHT: MOVE ALONG', c: C.dummy });
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
    for (let i = flashes.length - 1; i >= 0; i--) { const f = flashes[i]; f.t -= 1 / 60; if (f.t <= 0) { flashes.splice(i, 1); continue; }
      let x = f.x, y = f.y; if (f.car) { const c = T.cars.find((q) => q.id === f.car); if (!c) { flashes.splice(i, 1); continue; } x = c.x; y = c.y + 46; }
      ctx.globalAlpha = Math.min(1, f.t * 3); label(f.n, x, y, 12, f.c); ctx.globalAlpha = 1; }
  }

  function field(cx, sim, G) {
    ctx = cx; s = sim; T = sim && sim.duelT;
    if (!T || !T.duelOn || !s.sc || s.sc !== T.duelSc || s.phase === 'brief' || s.phase === 'lesson') { if (T) (s.duelFeed || []).length = 0; return; }
    const k = G.RA / G.U;
    ctx.save(); ctx.beginPath(); ctx.rect(G.FX, G.FY, G.FW, G.FH); ctx.clip(); ctx.translate(G.FX, G.FY); ctx.scale(k, k);
    readEvents();
    drawCrashes(); drawPlanters(); drawCameras();
    for (const c of reds()) drawField(c);
    for (const c of reds()) { drawHalo(c); drawStopLine(c); drawGhost(c); }
    drawLungeGuide(); drawBody();
    for (const c of reds()) drawTag(c);
    drawWhites();
    drawFlashes();
    ctx.restore();
  }
  // ---------- the panel: the red car's rung, what it learns next, the objective
  function hud(cx, sim, G) {
    ctx = cx; s = sim; T = sim && sim.duelT; const d = sim && sim.duelDef;
    if (!T || !d || sim.phase === 'brief' || sim.phase === 'lesson' || sim.duelDone) return;
    const RU = root.DUEL_RULES || { parts: {} }, earnPt = d.earns && d.earns !== 'car' ? RU.parts[d.earns] : null, ri = T.rungInfo(), top = Math.round(T.DP['duel.topRung'] || 0), nxt = T.rung < top ? DUELR()[T.rung + 1] : null, o = d.objective, n = Math.min(sim.duelProgress(), o.count);
    const lines = [['RED-01 · RUNG ' + T.rung + ' · ' + (ri ? ri.name.toUpperCase() : '') + '   ◎ ' + n + ' / ' + o.count, C.red, 15], [earnPt ? 'CLEAR THE TILE: YOU EARN ' + earnPt.name.toUpperCase() + ' (' + earnPt.verb + ')' : nxt ? 'CLEAR THE TILE: IT LEARNS ' + nxt.name.toUpperCase() + ' FROM THE LAST HIT' : T.rung >= 1 ? 'ALL IT CAN LEARN: OUTWIT IT' : 'IT SENSES NOTHING YET', earnPt ? C.dummy : C.dim, 12]].concat(sim.duelDuck ? [['HOLD C · DUCK BEHIND LOW COVER', C.dim, 11]] : []);
    ctx.save(); ctx.font = '700 19px B612, system-ui, sans-serif';
    const w = Math.max(...lines.map(([t, , z]) => { ctx.font = `700 ${z}px B612, system-ui, sans-serif`; return ctx.measureText(t).width; })) + 24, h = 16 + lines.length * 19, x = G.FX + 10, y = G.FY + 10;
    rect(x, y, w, h, C.panel); ctx.strokeStyle = C.red; ctx.lineWidth = 1.5; ctx.strokeRect(x + 1, y + 1, w - 2, h - 2);
    lines.forEach(([t, col, z], i) => text(t, x + 12, y + 23 + i * 19, z, col)); ctx.restore();
  }
  // ---------- the lesson card: the car away being trained; what it now does, what that closes, what stays open
  // ---------- the lesson, as Prototype 10 played it (handover v2 §9.1). Beat 1: your hit, replayed as the car's training clip; its
  // frame of impact held, boxed. Beat 2: the sensor fitted by a drone, the new field drawing out. Then the card: what it now does,
  // what that closes, what is open. Enter skips to the card; Enter on the card sends it back to the road.
  const CAM = '#9ff2c8', CAM_DIM = 'rgba(159,242,200,0.55)', ZN = { front: 'FRONT', frontDiagonal: 'FRONT CORNER', side: 'SIDE', rearDiagonal: 'REAR CORNER', rear: 'REAR' };
  const beats = (L) => { const P = T.DP || T.P, c = L.clip && L.clip.frames.length ? 1 : 0; return { clip: c * (P['duel.lessonClipSeconds'] || 3), hold: c * (P['duel.lessonHoldSeconds'] || 0.8), fit: L.part ? 0 : P['duel.lessonFitSeconds'] || 2 }; };
  function lessonKey(sim) { const L = sim && sim.duelT && sim.duelT.lesson; if (!L || L.card) return true; L.skip = true; return false; }
  function lesson(cx, sim, G) {
    ctx = cx; s = sim; T = sim && sim.duelT; const L = T && T.lesson; if (!L) return;
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
    const T2 = sim && sim.duelT, L = T2 && T2.lesson; if (!L || sim.phase !== 'lesson' || !L.clip || !L.clip.frames.length || L.card || L.skip) return null;
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
      const dy = u < 0.45 ? -150 * (1 - u / 0.45) : u < 0.7 ? -150 * ((u - 0.45) / 0.25) : null; // the drone: down to the car, the sensor fitted, away
      if (dy != null) drawDrone(c.x, c.y - 24 + dy, u < 0.45);
      ctx.strokeStyle = C.red; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(c.x, c.y, c.L * 0.75, 0, TAU); ctx.stroke(); ctx.setLineDash([]);
    }
    ctx.restore();
    camMarks(G, String(ri.fit || 'SENSOR') + ' FITTED · ' + String(ri.sensor || ri.name || '').toUpperCase(), t, (L.model || 'RED-01') + ' · RUNG ' + L.from + ' → ' + to);
  }
  function drawPartCard(L, G) { // the player's upgrade: one thing a tile (Lawrence, 7 Nov)
    const pt = L.info || {}; ctx.save(); rect(G.FX, G.FY, G.FW, G.FH, 'rgba(5,7,15,0.82)');
    const w = Math.min(G.FW - 60, 980), x = G.FX + (G.FW - w) / 2, y = G.FY + 40, h = G.FH - 80;
    rect(x, y, w, h, 'rgba(12,14,20,0.96)'); ctx.strokeStyle = C.dummy; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
    text('DUMMY CORPORATION · PARTS', x + 34, y + 52, 18, C.dim);
    text('PART EARNED: ' + String(pt.name || L.part).toUpperCase(), x + 34, y + 104, 40, C.dummy, 'left', 900);
    text(String(pt.verb || '') + ' · ' + String(pt.key || '').toUpperCase(), x + 36, y + 150, 24, C.text, 'left', 900);
    text(String(pt.text || ''), x + 36, y + 196, 20, C.text);
    text(pt.p9 ? 'The drone fits it on the way to ' + (L.next || 'the next tile') + '. You will need it there.' : 'Fitted now. You will need it on ' + (L.next || 'the next tile') + '.', x + 36, y + 236, 18, '#9ff2c8');
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
    text('OPEN', x + 36, yy, 15, '#9ff2c8'); yy = wrap(info[2], x + 150, yy, w - 186, 28, 20, '#9ff2c8') + 10;
    if (Math.floor((G.t || 0) * 2) % 2 === 0) text('ENTER · CONTINUE', x + w - 34, y + h - 30, 20, C.dummy, 'right', 900);
    ctx.restore();
  }
  root.DUEL_UI = { field, hud, lesson, lessonKey, replayBegin, replayEnd, redSprite };
})(typeof window !== 'undefined' ? window : globalThis);
