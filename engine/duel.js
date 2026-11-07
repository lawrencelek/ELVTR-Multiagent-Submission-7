/* DUMMIES · Submission 7: Prototype 10's red car in Prototype 9's world. Story mode, Map 1 (Monument), tiles 1-9.
   Prototype 9 is the game: its districts, tiles, decks, art, fleet, tile cards, gifts, HUD and sound, unchanged.
   Prototype 10 is the driver: the learning red car (rungs 0-7: beam, side cones, roof lidar, street cameras, road items,
   crash memory, the search), its lessons, its sight field and the block lift. Its code is testroad.js, unchanged.
   - The tile in test's ground traffic sim joins the duel: its prototype becomes DuelTileSim (TestRoadSim's brain, with the
     junction-only parts replaced). One red sedan drives its road; Prototype 9's fleet are the white cars: they never learn.
   - The player sim (StorySim) becomes DuelStorySim: it routes the red car's hits to the duel (crash record, stealth grade,
     lessons), counts the tile's objective (content/story_map1.json, the pipeline's plan) and clears the tile through
     Prototype 9's own clear: write-off, report, the FARSIGHT ferry, the next tile's card.
   - Each tile plays one ladder stage: its values (window.DUMMIES_STAGES[stage].flags) plus the tile's overrides.
   Loads after story7.js and testroad.js, before game.js. */
(function (root) {
  'use strict';
  const X = root.DUMMIES, W6 = root.WORLD6, STORY = root.STORY, P10 = root.DUMMIES_P10, STAGES = root.DUMMIES_STAGES, MAP = root.STORY_MAP1;
  if (!X || !W6 || !STORY || !P10 || !STAGES || !MAP) { console.warn('duel: a module is missing; Prototype 9 runs alone'); return; }
  const TR = P10.TestRoadSim, BP = X.Sim.prototype, TP = TR.prototype, RUNGS = P10.RUNGS;
  const hyp = Math.hypot, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const stageN = (id) => +String(id).split('.')[1] || 0; // '10.6' -> 6
  // the sight field the user designed (10.9: proportional rings at x, 2x, 3x) for every stage that has the side field
  const FIELD_KEYS = ['perception.sideCloseRange', 'perception.sideWaryRange', 'perception.sideAwareSpeed', 'perception.sideWarySpeed', 'perception.sideCloseSpeed',
    'perception.sideAwareNoticeRate', 'perception.sideWaryNoticeRate', 'perception.forwardConeAngle', 'perception.sideConeAxis', 'perception.sideConeAngle',
    'perception.sideConeRange', 'perception.trackSeconds', 'perception.forwardConeSensitivity', 'perception.sideConeSensitivity', 'perception.coneRadius',
    'perception.sideConeRatio', 'perception.forwardGrades', 'perception.sideGrades', 'perception.coneGrowthPerMemory', 'perception.coneGrowthMax'];
  // values the duel keeps out of the tile sim's own P (Prototype 9's fleet reads them): the red car gets them another way
  const duelKey = (k) => (k.startsWith('duel.') || (k.startsWith('perception.') && k !== 'perception.forwardLength' && k !== 'perception.reactionDelay') ||
    k.startsWith('scoring.stealth') || k.startsWith('scoring.incident') || k.startsWith('traffic.white') || k.startsWith('traffic.incident') || k === 'props.planter.height' || k === 'body.duckHeight' || k === 'movement.duckSpeedFactor' || k === 'ui.lungeGuide' || k === 'ui.tip.holdSeconds');
  // Lawrence (7 Nov): a white car's hit scores a fifth of Prototype 9's points; the red car's, all of them plus its damage.
  // Proposed registry ids (not yet registered): scoring.whiteShare 0.2, scoring.redDamageBonus 1.
  const WHITE_SHARE = 0.2, RED_DAMAGE_BONUS = 1;
  const ORIG = new WeakMap(); // a tile sim → its own prototype, statics and values, restored when the duel moves on

  function duelParams(def) {
    const st = STAGES[def.stage]; if (!st) return null;
    const DP = Object.assign({}, st.flags);
    for (const k of FIELD_KEYS) DP[k] = STAGES['10.9'].flags[k];
    Object.assign(DP, def.params || {});
    // Prototype 9's story delivers the parts (Battery 1 at B1, Hands 1 at A2, Legs 1 at B3): the duel's own drone stays home
    DP['duel.dashArrives'] = 0; DP['duel.jumpArrives'] = 0; DP['duel.conesArrives'] = 0; DP['duel.duckArrives'] = 0;
    DP['ui.lungeGuide'] = 1; // the lunge guide on every tile (row 732)
    if (!(DP['duel.standstillSpeed'] > 0)) DP['duel.standstillSpeed'] = 5;
    if (!(DP['duel.redReturnSeconds'] > 0)) DP['duel.redReturnSeconds'] = 2;
    if (stageN(def.stage) >= 2 && !(DP['duel.blockSeconds'] > 0)) DP['duel.blockSeconds'] = 10; // the block lift (row 715) from the first lesson on: a car never waits for ever
    return DP;
  }

  // ---------- the tile sim's brain: TestRoadSim's, with the junction's parts made general
  class DuelTileSim extends TR {
    checkFlip() {}
    p9(fn) { const o = ORIG.get(this), keep = this.level.statics; this.level.statics = o ? o.statics : []; try { return fn(); } finally { this.level.statics = keep; } }
    p9call(name, ...a) { const o = ORIG.get(this), f = o && o.own[name]; return f ? f.apply(this, a) : BP[name].apply(this, a); } // world6 sets some methods on each traffic sim (quiet, linkWorld): they stay the base
    // rung 3, the roof lidar, sees height: a dummy up on a deck over its road is in its world (Prototype 10's plinth)
    meets(c) { // a dummy on another level (a deck, a walkway) is out of its world at every rung; rung 3's lidar sees one falling off a deck onto its road
      if (c && c.red && this.duelOn && this.rung >= 3) { const b = this.body; if (b && b.alive && b.mode === 'drop' && !(c.layer > 0)) return true; }
      return this.p9call('meets', c);
    }
    duelCar(c) { return !!c && this.duelOn && (c.red || (this.whiteFleet && c.white)); } // the red car; from 10.10 the fleet too, as Prototype 10's white cars
    assessBody(c) { return this.duelCar(c) ? TP.assessBody.call(this, c) : BP.assessBody.call(this, c); }
    occluded(self, x0, y0, x1, y1) { return this.duelCar(self) ? TP.occluded.call(this, self, x0, y0, x1, y1) : this.p9(() => BP.occluded.call(this, self, x0, y0, x1, y1)); }
    choose(c, tg, opts) { return this.duelCar(c) ? TP.choose.call(this, c, tg, opts) : this.p9(() => BP.choose.call(this, c, tg, opts)); }
    carAI(dt) { if (this.whiteFleet) for (const c of this.cars) if (!c.red && !c.ghost && !(c.layer > 0)) c.white = true; return TP.carAI.call(this, dt); } // 10.10: the fleet tailgates (traffic.whiteTimeGap)
    whiteHides(self, x0, y0) { // 10.9 on: any car of the fleet between the red car's sensors and the dummy hides it (moving cover)
      if (!this.DP || !this.DP['duel.twoWay']) return false;
      const b = this.body, ws = this.cars.filter((o) => o !== self && !o.red && !o.gone && !o.ghost && !(o.layer > 0)); if (!ws.length || (b.level || 0) > 0) return false;
      const d = hyp(b.x - x0, b.y - y0), n = Math.max(2, Math.ceil(d / 8));
      for (let i = 1; i < n; i++) { const u = i / n, px = x0 + (b.x - x0) * u, py = y0 + (b.y - y0) * u; if (ws.some((o) => X.circleCar(px, py, 1, o))) return true; }
      return false;
    }
    beamFor() { return this.rung >= 1 ? (this.DP['perception.forwardLength'] || 720) : 0; }
    fieldFor() { const P = this.P, keep = P['proto.driver.cautionZone']; P['proto.driver.cautionZone'] = this.DP['proto.driver.cautionZone'] || keep; try { return TP.fieldFor.call(this); } finally { P['proto.driver.cautionZone'] = keep; } }
    fromAbove(e) { return e.kind === 'drop' || TP.fromAbove.call(this, e); } // Prototype 9's drop off a deck is the hit from above
    emit(type, data) { BP.emit.call(this, type, data); if (this.duelOn && this.duelFeed) this.duelFeed.push(this.events[this.events.length - 1]); }
    admit() { this.p9call('admit'); if (this.duelOn) this.admitRed(); }
    // the red car: one at a time, on a lane of the tile's road; back duel.redReturnSeconds after it leaves the screen
    admitRed() {
      const P = this.P, DP = this.DP;
      if (this.lesson || !this.redLanes || !this.redLanes.length) return;
      if (this.cars.some((c) => c.red && !c.ghost && !c.gone)) return;
      if (this.t + 1e-9 < this.leftAt + DP['duel.redReturnSeconds']) return;
      const k = this.redSeq || 0, ln = this.redLanes[Math.floor(((k * 0.6180339887 + 0.31) % 1) * this.redLanes.length)], gap = 2 * P['vehicles.sedan.length'] + 30;
      let s0 = null; for (let s = ln.s0; s <= ln.enterS - P['vehicles.sedan.length']; s += 15) if (!this.cars.some((o) => o.path === ln.path && !o.gone && Math.abs(o.s - s) < gap + (o.L || 0) / 2)) { s0 = s; break; }
      if (s0 == null) return; // its lane's run-in is full: next tick
      const keep = P['perception.forwardLength']; P['perception.forwardLength'] = this.beamFor();
      let c; try { c = this.newCar('red' + (k + 1), 'sedan', ln.i, ln.path, s0, 0); } finally { P['perception.forwardLength'] = keep; }
      c.red = true; c.rung = this.rung; c.model = 'RED-01'; c.cruise = P['vehicles.sedan.cruiseSpeed']; c.v = c.cruise;
      if (this.rung >= 1) c.standoff = this.envelope(0);
      this.pose(c); this.cars.push(c); this.redSeq = k + 1;
      if (this.rung >= 1) { const v = this.spawnSpeed(c); if (v < c.v) c.v = v; }
      this.emit('admit', { car: c.id, cls: c.cls, model: c.model, lane: ln.i, red: true, rung: this.rung });
    }
    // the block lift (row 715): FARSIGHT sets the dummy down on free ground beside the road, clear of every lane and static
    sidePoint(c) {
      const P = this.P, b = this.body, r = P['body.radius'], LW = P['world.laneWidth'], W = P['world.width'], H = P['world.height'], lanes = this.level.lanes || [];
      const clear = (x, y) => x > 2 * r && x < W - 2 * r && y > 2 * r && y < H - 2 * r && lanes.every((p) => Math.abs(X.pathProject(p, x, y).lat) > LW / 2 + 2 * r + 6) &&
        !this.level.statics.some((st) => x > st.x - r && x < st.x + st.w + r && y > st.y - r && y < st.y + st.h + r) && !(this.duelSc && this.duelSc.stairs || []).some((st) => x > st.x - r && x < st.x + st.w + r && y > st.y - r && y < st.y + st.h + r);
      if ((b.level || 0) === 0 && clear(b.x, b.y)) return { x: b.x, y: b.y };
      for (let d = 40; d <= 420; d += 20) for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, x = b.x + Math.cos(a) * d, y = b.y + Math.sin(a) * d; if (clear(x, y)) return { x, y }; }
      return { x: b.x, y: b.y };
    }
  }

  // ---------- joining and leaving: a tile sim takes the duel's brain, values, statics, cameras and planters
  function laneInfo(T, P) {
    const W = P['world.width'], H = P['world.height'], LW = P['world.laneWidth'], lanes = T.level.lanes || [], out = [];
    lanes.forEach((path, i) => {
      if (!path || !(path.length > 0)) return;
      let s0 = null, s1 = null;
      for (let s = 0; s <= path.length; s += 8) { const q = X.pathAt(path, s); if (q.x >= 0 && q.x <= W && q.y >= 0 && q.y <= H) { if (s0 == null) s0 = s; s1 = s; } }
      if (s0 == null || s1 - s0 < 360) return;
      const m = X.pathAt(path, (s0 + s1) / 2), other = (sg) => lanes.some((p) => p !== path && Math.abs(X.pathProject(p, m.x + m.nx * sg * LW, m.y + m.ny * sg * LW).lat) < 8);
      path.edges = other(1) ? [-LW / 2, 1.5 * LW] : other(-1) ? [-1.5 * LW, LW / 2] : [-LW / 2, LW / 2]; // kerb to kerb: across the oncoming lane where there is one
      out.push({ i, path, enterS: s0, exitS: s1, s0: Math.max(0, s0 - 200) });
    });
    return out;
  }
  function rectHits(a, list, m) { return list.some((q) => a.x < q.x + q.w + m && a.x + a.w > q.x - m && a.y < q.y + q.h + m && a.y + a.h > q.y - m); }
  function placePlanters(T, sc, P, DP, lanes) { // 10.6 (row 696): low planter rows along the red car's road, on the kerb, never under a deck
    const pw = P['world.gardenPlanter'] || 30, ph = DP['props.planter.height'] || 14, LW = P['world.laneWidth'], W = P['world.width'], H = P['world.height'], out = [], len = 4 * pw;
    const solid = (sc.game.statics || []).filter((q) => q.kind !== 'mass').concat(sc.stairs || []), cands = [];
    for (const ln of lanes) for (let s = ln.enterS + 80; s <= ln.exitS - 80; s += 30) {
      const q = X.pathAt(ln.path, s), ax = Math.abs(q.tx) > 0.95, ay = Math.abs(q.ty) > 0.95; if (!ax && !ay) continue;
      for (const sg of [1, -1]) for (const gap of [2, 42]) { // on the kerb line, or a clear body-width off it: never a slot a dummy can be wedged in
        const off = sg > 0 ? ln.path.edges[1] + gap : ln.path.edges[0] - gap, cx = q.x + q.nx * off, cy = q.y + q.ny * off;
        const r = ax ? { x: cx - len / 2, y: cy - 8, w: len, h: 16 } : { x: cx - 8, y: cy - len / 2, w: 16, h: len };
        const ux = Math.round(q.nx * sg), uy = Math.round(q.ny * sg), behind = { x: r.x + (ux > 0 ? r.w : ux < 0 ? -34 : 0), y: r.y + (uy > 0 ? r.h : uy < 0 ? -34 : 0), w: ux ? 34 : r.w, h: uy ? 34 : r.h }; // the strip a dummy crouches in
        if (r.x < 24 || r.y < 24 || r.x + r.w > W - 24 || r.y + r.h > H - 24 || rectHits(r, solid, 30) || rectHits(behind, solid, 2) || behind.x < 8 || behind.y < 8 || behind.x + behind.w > W - 8 || behind.y + behind.h > H - 8) continue;
        const pts = [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h], [r.x + r.w / 2, r.y + r.h / 2]];
        if ((T.level.lanes || []).some((p) => pts.some(([x, y]) => Math.abs(X.pathProject(p, x, y).lat) < LW / 2 + 1))) continue;
        if ((sc.layers || []).some((l) => l.inBand && pts.some(([x, y]) => l.inBand(x, y)))) continue;
        cands.push(Object.assign(r, { score: Math.hypot(cx - W / 2, cy - H / 2) + gap }));
      }
    }
    cands.sort((a, b) => a.score - b.score);
    for (const r of cands) { if (out.length >= 3) break; if (rectHits(r, out, 90)) continue; delete r.score; out.push(Object.assign(r, { kind: 'planter', low: true, height: ph, id: 'planter' + out.length, duel: true })); }
    return out;
  }
  function placeCameras(sc, P, lanes, low) { // rung 4's street cameras: on the kerb, by the tall cover they watch, clear of the low cover (planters stay a hiding place)
    const LW = P['world.laneWidth'], W = P['world.width'], H = P['world.height'], out = [], tall = (sc.game.statics || []).filter((q) => q.kind === 'block' || q.kind === 'booth' || q.kind === 'sculpture' || q.kind === 'column' || q.kind === 'monument'), cands = [];
    for (const ln of lanes) for (let s = ln.enterS + 60; s <= ln.exitS - 60; s += 40) {
      const q = X.pathAt(ln.path, s), sg = ln.path.edges[1] > LW ? -1 : 1, off = sg * (LW / 2 + 26), x = q.x + q.nx * off, y = q.y + q.ny * off;
      if (x < 12 || y < 24 || x > W - 12 || y > H - 12 || tall.some((st) => x > st.x - 4 && x < st.x + st.w + 4 && y > st.y - 4 && y < st.y + st.h + 4)) continue;
      const R = P['perception.streetCameraRange'] || 180; if (low.some((q2) => hyp(clamp(x, q2.x, q2.x + q2.w) - x, clamp(y, q2.y, q2.y + q2.h) - y) < R + 30)) continue; // no roadside planter in its reach
      const cover = tall.filter((st) => hyp(st.x + st.w / 2 - x, st.y + st.h / 2 - y) < 150).length;
      cands.push({ x, y, aim: Math.atan2(-q.ty, -q.tx) * 180 / Math.PI, cover }); // it looks back up the road, toward the car's approach
    }
    cands.sort((a, b) => b.cover - a.cover);
    for (const c of cands) { if (out.length >= 3) break; if (out.some((o) => hyp(o[0] - c.x, o[1] - c.y) < 200)) continue; out.push([c.x, c.y, c.aim, out.length * 0.25]); }
    return out;
  }
  function join(T, sc, DP, feed, PP) {
    if (!ORIG.has(T)) ORIG.set(T, { proto: Object.getPrototypeOf(T), statics: T.level.statics, P: T.P, cameras: T.level.cameras, own: {} });
    const o = ORIG.get(T), P = Object.assign({}, o.P);
    for (const k of ['admit', 'meets']) if (Object.prototype.hasOwnProperty.call(T, k)) { o.own[k] = T[k]; delete T[k]; }
    for (const k of Object.keys(DP)) if (duelKey(k)) P[k] = DP[k];
    if (PP) for (const k of ['movement.walkSpeed', 'movement.runSpeed', 'movement.lungeDistance']) P[k] = PP[k]; // the envelope reads the dummy's own speed
    Object.setPrototypeOf(T, DuelTileSim.prototype);
    Object.assign(T, { P, DP, duelOn: true, testRoad: true, duelSc: sc, duelFeed: feed, rung: clamp(Math.round(DP['duel.startRung'] || 0), 0, RUNGS.length - 1),
      lesson: null, lessons: [], delivery: null, firstBrakeT: null, firstSideT: null, firstCoverT: null, firstItemT: null, crashes: [], spring: null,
      whiteFleet: (DP['scoring.incidentPoints'] || 0) > 0, stealth: { points: 0, unseen: 0, lost: 0, seen: 0, last: null }, lift: null, blockT: 0, leftAt: -1e9, redSeq: 0, stageCaution: null, carKeepTG: null });
    T.run.incidents = 0; T.redLanes = laneInfo(T, P);
    const planters = DP['duel.planters'] > 0 ? placePlanters(T, sc, P, DP, T.redLanes) : [];
    for (const q of planters) if (!sc.game.statics.some((s) => s.duel && s.x === q.x && s.y === q.y)) { sc.game.statics.push(q); if (W6.paintPlanter) W6.paintPlanter(sc, q); } // part of the tile: walked round, painted as Prototype 9 paints its own
    // Prototype 9's statics hide the dummy from the red car's own sensors; its planters are low cover (rows 696-697), as the duel's
    const ph = DP['props.planter.height'] || 14;
    // the level's own shapes block its sightline: buildings, walls, columns, sculptures; masses (terraces, cubes, pools' rims) by their drawn height; planters are low cover
    const massH = (q) => (q.ht || 0) * ((W6.artUnit || 2.5) / (P['proto.art.extrusion'] || 0.3));
    T.level.statics = (sc.game.statics || []).filter((s) => !s.duel && s.kind !== 'bound').map((s) => (s.kind === 'planter' ? Object.assign({}, s, { low: true, height: ph }) : s.kind === 'mass' ? Object.assign({}, s, { low: true, height: massH(s) }) : s)).concat(planters);
    const roadside = T.level.statics.filter((q) => q.low && T.redLanes.some((ln) => Math.abs(X.pathProject(ln.path, q.x + q.w / 2, q.y + q.h / 2).lat) < 160)); // the planters an ambush uses
    T.level.cameras = Math.round(DP['duel.topRung'] || 0) >= 4 ? placeCameras(sc, P, T.redLanes, roadside) : [];
    sc.duelPosts = sc.duelPosts || []; for (const c of T.level.cameras) if (!sc.duelPosts.some((q) => q[0] === c[0] && q[1] === c[1])) { sc.duelPosts.push(c); if (W6.paintPost) W6.paintPost(sc, c[0], c[1]); } // its post, in the tile's art
    return T;
  }
  function leave(T, sims) {
    const o = ORIG.get(T); if (!o) return;
    Object.setPrototypeOf(T, o.proto); for (const k of Object.keys(o.own)) T[k] = o.own[k]; o.own = {}; T.P = o.P; T.level.statics = o.statics; T.level.cameras = o.cameras; T.duelOn = false; T.testRoad = false;
    for (const s of sims) { s.cars = s.cars.filter((c) => !c.red); for (const c of s.cars) if (c.white) { c.white = false; c.shakenUntil = null; } }
  }

  // ---------- the player's sim: Prototype 9's story, with the duel in the tile in test
  const SS = STORY.StorySim;
  class DuelStorySim extends SS {
    reset() { super.reset(); this.duelSetup(); }
    arrive(t) { super.arrive(t); this.duelSetup(); }
    duelSetup() {
      if (!this.W6 || !this.storyMode || !this.story) return;
      const act = STORY.activeTile(this.story, this.levelId), def = this.levelId === 'monument' && act ? MAP.tiles.find((q) => q.tile === act) || null : null;
      if (def && this.duelDef === def && this.duelT) return;
      this.duelStop();
      if (!def) return;
      const sc = this.W6.at('ABC'.indexOf(act[0]), +act[1] - 1), T = sc && (sc.main || sc.lab), DP = duelParams(def);
      if (!T || !DP) return;
      this.duelFeed = []; join(T, sc, DP, this.duelFeed, this.P);
      Object.assign(this, { duelT: T, duelSc: sc, duelDef: def, duelDP: DP, duelHits: 0, duelIncidents: 0, duelMovedAt: null, duelInc0: 0, duelPending: false, duelDone: false, duelDuck: stageN(def.stage) >= 6, duelT0: this.t });
      this.emit('duel-start', { tile: def.tile, stage: def.stage, rung: T.rung, top: Math.round(DP['duel.topRung'] || 0), lanes: T.redLanes.length });
    }
    duelStop() { if (this.duelT) leave(this.duelT, this.W6.sims); this.duelT = null; this.duelDef = null; this.duelSc = null; if (this.body) { this.body.duck = false; this.body.lifted = false; } }
    duelProgress() { const d = this.duelDef, T = this.duelT; if (!d) return 0; return d.objective.kind === 'stealth' ? (T ? T.stealth.points : 0) : d.objective.kind === 'incidents' ? (T && this.duelMovedAt != null ? (T.run.incidents || 0) - this.duelInc0 : 0) : this.duelHits; } // an Incident counts once the dummy has moved: it made the car brake
    duelObjective() {
      const d = this.duelDef; if (!d || !this.duelT || this.duelDone) return null;
      const o = d.objective, n = Math.min(this.duelProgress(), o.count), here = this.screenName() === d.tile;
      return ['OBJECTIVE · ' + d.tile + ' · ' + String(d.title).toUpperCase(), (here ? '' : 'Back to ' + d.tile + ': ') + o.label + ' (' + n + ' of ' + o.count + '). ' + (d.hint || '')];
    }
    redCars() { const out = []; for (const s of this.W6.sims) for (const c of s.cars) if (c.red && !c.ghost) out.push(c); return out; }
    redOnScreen() { return this.redCars().length > 0; }
    redSweep() { // a red car that has left its tile goes (Prototype 10's exit); its lesson can then show
      const T = this.duelT, P = this.P, W = P['world.width'], H = P['world.height'], act = (T && T.duelSc) || this.sc;
      for (const s of this.W6.sims) {
        const keep = [];
        for (const c of s.cars) {
          if (!c.red || c.ghost) { keep.push(c); continue; }
          const dx = s.sc ? (s.sc.col - act.col) * W : 0, dy = s.sc ? (s.sc.row - act.row) * H : 0, x = c.x + dx, y = c.y + dy, m = c.L / 2 + c.W;
          const off = x < -m || x > W + m || y < -m || y > H + m;
          if (!off) c.wasOn = true;
          if ((off && c.wasOn) || (s !== T && !c.wasOn) || !T) { if (T) { T.leftAt = T.t; T.emit('left', { car: c.id, model: c.model }); } continue; }
          keep.push(c);
        }
        if (keep.length !== s.cars.length) s.cars = keep;
      }
    }
    step(cmd) {
      const T = this.duelT, b = this.body;
      if (T && T.lesson && this.duelDone) T.lesson = null; // the tile is cleared: no lesson now
      if (T && this.phase === 'play' && T.lesson && T.lesson.state === 'due' && b && b.alive && !this.redOnScreen()) { // the lesson: the car is away being trained
        T.lesson.state = 'showing'; T.lesson.shownT = this.t; this.phase = 'lesson';
        this.emit('duel-lesson', { from: T.lesson.from, to: T.lesson.to, name: T.lesson.name });
        return;
      }
      if (T && T.lift && T.lift.state !== 'inbound' && T.lift.state !== 'outbound') cmd = {}; // in FARSIGHT's grip: no control
      if (T && b && this.phase === 'play') this.duckFor(cmd || {});
      this.lastCmd = cmd || {};
      if (T && this.duelMovedAt == null && this.phase === 'play' && !this.rescue && (Math.abs(this.lastCmd.mx || 0) + Math.abs(this.lastCmd.my || 0) > 0.1 || this.lastCmd.aPress)) { this.duelMovedAt = this.t; this.duelInc0 = T.run.incidents || 0; }
      super.step(cmd);
      if (T) { this.redSweep(); if (b && b.duck && !this.canDuck()) this.stand(); this.incidentCheck(); this.unstick(cmd || {}); }
    }
    incidentCheck() { // row 740: an Incident scores scoring.incidentPoints for the player; the plan's count of them clears the tile
      const T = this.duelT, n = T.run.incidents || 0;
      if (n > (this.duelIncidents || 0)) { this.run.points += (n - (this.duelIncidents || 0)) * (T.P['scoring.incidentPoints'] || 0); this.duelIncidents = n; this.emit('incident-scored', { n }); }
      const d = this.duelDef; if (d && d.objective.kind === 'incidents' && !this.duelDone && this.phase === 'play' && this.body && this.body.alive && this.duelProgress() >= d.objective.count) { this.duelPending = true; this.body.health = 0; this.writeOff(); }
    }
    // Pressed against a car and something solid, trying to move and not moving for 0.6 s: the dummy steps to the nearest free ground
    unstick(cmd) {
      const b = this.body, P = this.P, r = P['body.radius'], dt = 1 / P['simulation.tickRate'];
      if (!b || !b.alive || b.lifted || this.phase !== 'play' || (b.level || 0) !== 0 || b.mode === 'lunge' || b.mode === 'jump' || b.mode === 'rescue') { this.stuckT = 0; this.stuckAt = null; return; }
      const want = Math.hypot(cmd.mx || 0, cmd.my || 0) > 0.5, at = this.stuckAt, moved = at ? Math.hypot(b.x - at.x, b.y - at.y) : 99; this.stuckAt = { x: b.x, y: b.y };
      const touching = this.cars.some((c) => !(c.layer > 0) && Math.hypot(c.x - b.x, c.y - b.y) < c.L / 2 + r + 6);
      this.stuckT = want && moved < 0.4 && touching ? (this.stuckT || 0) + dt : 0;
      if (this.stuckT < 0.6) return;
      const solid = (x, y) => this.level.statics.some((q) => x > q.x - r && x < q.x + q.w + r && y > q.y - r && y < q.y + q.h + r) || this.cars.some((c) => !(c.layer > 0) && X.circleCar(x, y, r + 2, c)) || x < r || y < r || x > P['world.width'] - r || y > P['world.height'] - r;
      for (let d = 12; d <= 96; d += 6) for (let i = 0; i < 16; i++) { const a = Math.atan2(cmd.my || 0, cmd.mx || 0) + i * Math.PI / 8 * (i % 2 ? 1 : -1) * 0.5, x = b.x + Math.cos(a) * d, y = b.y + Math.sin(a) * d;
        if (!solid(x, y)) { Object.assign(b, { x, y, px: x, py: y, vx: 0, vy: 0 }); this.stuckT = 0; this.emit('unstuck', { x: +x.toFixed(1), y: +y.toFixed(1) }); return; } }
    }
    continueLesson() {
      const T = this.duelT; this.phase = 'play';
      if (!T || !T.lesson) return;
      const L = T.lesson; T.rung = L.to; T.lessons.push({ from: L.from, to: L.to, zone: L.zone, kind: L.kind, hitT: L.hitT, shownT: L.shownT }); T.lesson = null;
      T.leftAt = Math.min(T.leftAt, T.t - (T.DP['duel.redReturnSeconds'] || 2) + 0.6); // it is back as soon as the card closes
      this.emit('learned', { rung: L.to, name: L.name });
    }
    // ----- the red car's hits (Prototype 10's account): a standstill touch does nothing; a hit is graded, recorded and learned from
    account(contacts) {
      const T = this.duelT, b = this.body;
      if (!T) return super.account(contacts);
      if (b && b.lifted) return false;
      const still = T.DP['duel.standstillSpeed'] || 0; let positive = false;
      contacts.sort((a, q) => a.k - q.k || (a.car.id < q.car.id ? -1 : a.car.id > q.car.id ? 1 : 0));
      for (const ct of contacts) {
        const c = ct.car && ct.car.ghost ? ct.car.real : ct.car, red = !!(c && c.red);
        if (red && still > 0 && !ct.drop && Math.abs(c.v) < still && b.alive && !c.spent) { this.emit('touch', { car: c.id, standstill: true }); continue; } // it has passed its test (row 668)
        const e0 = this.events.length, p0 = this.run.points, f0 = this.effects.length;
        if (super.account([ct])) positive = true;
        const dp = this.run.points - p0, bursts = this.effects.slice(f0).filter((q) => q.type === 'burst'), hits = this.events.slice(e0).filter((e) => e.type === 'impact');
        if (!red && dp > 0) { this.run.points = p0 + dp * WHITE_SHARE; for (const q of bursts) q.v *= WHITE_SHARE; for (const e of hits) e.points = Math.round(dp * WHITE_SHARE); } // white cars: a fifth
        if (red) for (const e of hits) { const bonus = Math.max(0, e.lost || 0) * RED_DAMAGE_BONUS; this.run.points += bonus; for (const q of bursts) q.v += bonus; e.points = Math.round(dp + bonus); } // the red car: its points plus its damage
        if (red) for (const e of hits) this.duelImpact(e, c);
        if (this.duelPending && b.alive) { b.health = 0; this.writeOff(); }
      }
      return positive;
    }
    duelImpact(e, c) {
      const T = this.duelT, b = this.body, DP = T.DP, clip = DP['duel.lessonClipSeconds'] || 3;
      e.red = true; e.sight = +(c.sightT || 0).toFixed(2); e.above = T.fromAbove(e); e.cover = T.coverHid(c); e.coned = e.coned || T.itemHit(c); e.ducked = !!b.duck;
      if (!(e.lost >= 10)) return; // a graze is not a hit: the objective counts real damage
      const o = T.springOrigin(e), fx = this.effects.filter((q) => q.type === 'burst').pop(), prev = o.cover ? T.nearSite(o.x, o.y) : null;
      const sn = (e.kind === 'dash' || e.kind === 'jump') && T.spring ? T.spring.seen : null;
      e.lostSight = !!(o.cover && sn && sn.ago <= clip + 1e-9); e.seenAt = e.lostSight ? { x: +sn.x.toFixed(1), y: +sn.y.toFixed(1), ago: +sn.ago.toFixed(2) } : null;
      e.origin = { x: +o.x.toFixed(1), y: +o.y.toFixed(1) }; e.covered = o.cover; e.habit = !!prev; e.remembered = !!T.nearSite(o.x, o.y, T.memory());
      e.grade = T.strikeGrade(e, c); const mult = T.gradeMultiplier(e.grade), pts = Math.round(e.lost * mult);
      T.stealth.points += pts; T.stealth[e.grade]++; T.stealth.last = { grade: e.grade, mult, points: pts, t: +T.t.toFixed(2) };
      T.crashes.push({ n: T.crashes.length + 1, x: +b.x.toFixed(1), y: +b.y.toFixed(1), ox: e.origin.x, oy: e.origin.y, cover: o.cover, px: fx ? +fx.x.toFixed(1) : null, py: fx ? +fx.y.toFixed(1) : null, h: +c.h.toFixed(3), t: +T.t.toFixed(2), model: c.model, zone: e.zone, prev: prev ? prev.n : null, grade: e.grade, points: pts });
      T.emit('crash', { n: T.crashes.length, x: e.origin.x, y: e.origin.y, cover: o.cover, habit: e.habit, prev: prev ? prev.n : null, grade: e.grade, mult, points: pts, kind: e.kind, zone: e.zone });
      this.duelHits++;
      if (this.duelProgress() >= this.duelDef.objective.count && !this.duelDone) this.duelPending = true;
      else T.learnFrom(e); // the hit that clears the tile teaches nothing: the next tile is the next lesson
    }
    // the objective met: Prototype 9's clear (the chassis written off to the brief, the report, the ferry, the next tile's card)
    writeOff() {
      if (!this.duelPending || !this.duelT) return super.writeOff();
      this.duelPending = false; this.duelDone = true;
      const act = STORY.activeTile(this.story, this.levelId), tile = STORY.tileOf(this.levelId, act), keep = tile.task, need = STORY.needOf(this.levelId, act, this.P) || 1;
      tile.task = { kind: 'any' }; this.story.tileWO = Math.max(0, need - 1);
      try { super.writeOff(); } finally { tile.task = keep; }
      this.emit('duel-cleared', { tile: act, hits: this.duelHits, rung: this.duelT.rung, stealth: this.duelT.stealth.points });
    }
    // the spring: where a dash or a jump left from, what hid it, and whether the car had it just before (rows 703, 717)
    startLunge(f0, k) {
      const T = this.duelT, b = this.body, x = b.x, y = b.y, up = (b.level || 0) >= 1, cover = T ? T.springCover() : null, seen = T ? T.springSeen() : null;
      super.startLunge(f0, k);
      if (T && b.lunge) { b.lunge.fromRaised = up; T.spring = { x, y, t: T.t, cover, seen }; }
    }
    tryJump() {
      const T = this.duelT, b = this.body, x = b.x, y = b.y, up = (b.level || 0) >= 1, dashing = b.mode === 'lunge', cover = T && !dashing ? T.springCover() : null, seen = T && !dashing ? T.springSeen() : null;
      super.tryJump();
      if (T && b.mode === 'jump' && b.jump) { b.jump.fromRaised = up; if (!dashing) T.spring = { x, y, t: T.t, cover, seen }; }
    }
    collideBody(contacts, k) { // carried by FARSIGHT it touches nothing (row 715); a dash vaults a planter, a walk does not (row 696)
      const b = this.body; if (b && b.lifted) return;
      if (!this.duelT || !b || b.mode !== 'lunge' || !this.level || !this.level.statics.some((q) => q.kind === 'planter')) return super.collideBody(contacts, k);
      const keep = this.level.statics; this.level.statics = keep.filter((q) => q.kind !== 'planter');
      try { return super.collideBody(contacts, k); } finally { this.level.statics = keep; }
    }
    // DUCK (rows 694, 696): from tile 6, hold C to duck: lower, slower, harder to notice
    canDuck() { const b = this.body; return !!this.duelDuck && !!this.duelT && b.alive && !b.lifted && (b.mode === 'idle' || b.mode === 'move' || b.mode === 'coast') && !b.stair && (b.level || 0) === 0; }
    duckFor(cmd) { const b = this.body, want = !!(cmd && cmd.duck) && this.canDuck(); if (want && !b.duck) { b.duck = true; this.emit('duck', {}); } else if (!want && b.duck) this.stand(); }
    stand() { const b = this.body; b.duck = false; b.duckAt = this.t; }
    underfoot(field) { const v = super.underfoot(field), b = this.body; return field === 'dummySpeed' && b && b.duck && this.duelDP ? v * (this.duelDP['movement.duckSpeedFactor'] || 0.35) : v; }
    // the lunge guide (row 732): where a dash pressed now would land, and the first car on the way
    lungePreview(mx, my) {
      const P = this.P, b = this.body; if (!b || !b.alive) return null;
      const direct = P['proto.turnModel'] === 2, m = hyp(mx || 0, my || 0), dir = direct && m > 0.05 ? Math.atan2(my, mx) : b.facing;
      const lk = this.underfoot('lunge'), R = this.reach() * Math.max(0, lk), T = P['movement.lungeDuration'], tf = T * P['movement.lungeFastTimeFraction'], df = P['movement.lungeFastDistanceFraction'], r = P['body.radius'];
      const ready = this.dashFitted() && b.mode !== 'lunge' && b.mode !== 'recover' && !b.stair && !(b.landT > 0) && b.charge >= P['battery.lungeCost'] - 1e-9 && lk > 0;
      const lvl = b.level || 0, solids = lvl === 0 ? (this.level.statics || []).filter((q) => !q.low) : [], ca = Math.cos(dir), sa = Math.sin(dir);
      const cars = (this.cars || []).filter((c) => !(c.layer > 0) && lvl === 0);
      const hitRect = (x, y, q) => x > q.x - r && x < q.x + q.w + r && y > q.y - r && y < q.y + q.h + r;
      const tAt = (d) => d <= R * df ? tf * d / (R * df) : tf + (T - tf) * (d - R * df) / (R * (1 - df)), free = (d) => !solids.some((q) => hitRect(b.x + ca * d, b.y + sa * d, q));
      let x1 = b.x, y1 = b.y, hit = null; const N = Math.max(24, Math.ceil(R / 4));
      for (let i = 1; i <= N; i++) { const d = R * i / N;
        if (!free(d)) { let lo = R * (i - 1) / N, hi = d; for (let j = 0; j < 12; j++) { const mm = (lo + hi) / 2; if (free(mm)) lo = mm; else hi = mm; } x1 = b.x + ca * lo; y1 = b.y + sa * lo; break; }
        const t = tAt(d), x = b.x + ca * d, y = b.y + sa * d; x1 = x; y1 = y;
        for (const c of cars) if (X.circleCar(x, y, r, { x: c.x + Math.cos(c.h) * c.v * t, y: c.y + Math.sin(c.h) * c.v * t, h: c.h, L: c.L, W: c.W })) { hit = { x, y, t, car: c.id, red: !!c.red }; break; }
        if (hit) break; }
      return { x0: b.x, y0: b.y, x1, y1, dir, R, hit, ready };
    }
    trace() { const tr = super.trace(); if (this.duelT) tr.duel = { tile: this.duelDef.tile, stage: this.duelDef.stage, rung: this.duelT.rung, hits: this.duelHits, lessons: this.duelT.lessons, crashes: this.duelT.crashes.length }; return tr; }
  }
  STORY.StorySim = DuelStorySim;
  const taskText = STORY.taskText; // the tile card and HUD read the pipeline's objective
  STORY.taskText = (task, P) => (task && task.kind === 'red' ? { label: task.label, brief: task.brief } : taskText(task, P));
  root.DUEL = { DuelTileSim, DuelStorySim, duelParams, laneInfo, placePlanters, placeCameras, RUNGS, MAP, version: 1 };
})(typeof window !== 'undefined' ? window : globalThis);
