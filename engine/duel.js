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
  // Lawrence (7 Nov, 18:06): each tile progresses one thing (engine/progression.json): the car learns (earns 'car') or the player
  // earns a part; the tile's level sets its roadside cover. A plan without these fields plays as before.
  const RULES = root.DUEL_RULES || { parts: {}, levels: {}, tricks: {} };
  const rulesPlan = () => MAP.tiles.some((q) => q.earns);
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
  // Lawrence (7 Nov): only a vehicle that hits the dummy scores. At contact, the vehicle is at fault when its own motion gives at
  // least half the closing speed along the contact normal and it moves at FAULT_MIN or more. Otherwise the dummy ran into it:
  // damage, no points, no objective, no lesson. Every vehicle. Proposed registry ids: scoring.faultShare 0.5, scoring.faultMinSpeed 20.
  // The red car brakes as Prototype 10 built it: the registry's traffic.hardBraking (600), not Prototype 9's Highway Code 79.
  // Lawrence (7 Nov): a car that hits the dummy brakes to a stop (traffic.hardBraking, the registry's) and stands, then drives on.
  // Proposed registry id: traffic.hitStandSeconds 2 (as traffic.incidentSeconds holds two cars after an Incident).
  const TUNE = { faultShare: 0.5, faultMin: 20, redHard: X.REG['traffic.hardBraking'], hitStand: 2 };
  const faultOf = (carPart, bodyPart) => (carPart >= TUNE.faultMin && carPart >= (carPart + Math.max(0, bodyPart)) * TUNE.faultShare ? 'car' : 'dummy');
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
    if (def.earns && def.earns !== 'car') DP['duel.topRung'] = DP['duel.startRung']; // a tile where the player earns a part: the car learns nothing
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
    assessBody(c) {
      if (c && c.red && this.duelOn && c.spent) return this.body && this.body.lifted ? null : BP.assessBody.call(this, c); // having hit you, it drives off as any driver would: round you, never through you (Lawrence, 7 Nov)
      if (c && c.red && this.duelOn && this.rung < 1) return null; // rung 0 senses no dummy
      return this.duelCar(c) ? TP.assessBody.call(this, c) : BP.assessBody.call(this, c);
    }
    occluded(self, x0, y0, x1, y1) { return this.duelCar(self) ? TP.occluded.call(this, self, x0, y0, x1, y1) : this.p9(() => BP.occluded.call(this, self, x0, y0, x1, y1)); }
    choose(c, tg, opts) { return this.duelCar(c) ? this.redBrakes(c, () => TP.choose.call(this, c, tg, opts)) : this.p9(() => BP.choose.call(this, c, tg, opts)); }
    // the red car's brakes: Prototype 10's traffic.hardBraking (the registry's) wherever it plans or keeps a stop; the fleet keeps Prototype 9's
    redBrakes(c, fn) {
      const h = this.duelOn && c && c.red ? TUNE.redHard : 0, P = this.P; if (!(h > 0)) return fn();
      const keep = P['traffic.hardBraking']; P['traffic.hardBraking'] = h; try { return fn(); } finally { P['traffic.hardBraking'] = keep; }
    }
    manSpeed(c, man, tau, sAt) { return this.redBrakes(c, () => TP.manSpeed.call(this, c, man, tau, sAt)); }
    watchField(c, dt) { if (c && c.red && c.spent) return false; return this.redBrakes(c, () => TP.watchField.call(this, c, dt)); } // having hit you, it no longer watches its field: it drives on, round you
    spawnSpeed(c) { return this.redBrakes(c, () => TP.spawnSpeed.call(this, c)); }
    searchStep(c) { return this.redBrakes(c, () => TP.searchStep.call(this, c)); }
    carAI(dt) { if (this.whiteFleet) for (const c of this.cars) if (!c.red && !c.ghost && !(c.layer > 0)) c.white = true; return TP.carAI.call(this, dt); } // 10.10: the fleet tailgates (traffic.whiteTimeGap)
    whiteHides(self, x0, y0) { // 10.9 on: any car of the fleet between the red car's sensors and the dummy hides it (moving cover)
      if (!this.DP || !this.DP['duel.twoWay']) return false;
      const b = this.body, ws = this.cars.filter((o) => o !== self && !o.red && !o.gone && !o.ghost && !(o.layer > 0)); if (!ws.length || (b.level || 0) > 0) return false;
      const d = hyp(b.x - x0, b.y - y0), n = Math.max(2, Math.ceil(d / 8));
      for (let i = 1; i < n; i++) { const u = i / n, px = x0 + (b.x - x0) * u, py = y0 + (b.y - y0) * u; if (ws.some((o) => X.circleCar(px, py, 1, o))) return true; }
      return false;
    }
    // Lawrence (7 Nov): the red car sees road items (cones) at every rung, as Prototype 9's cars do; rung 0 is blind to the dummy only
    beamFor() { return this.DP['perception.forwardLength'] || 720; }
    perceive(c) { const r = BP.perceive.call(this, c); if (c && c.red && this.duelOn && this.rung < 1) r.side = false; return r; }
    fieldFor() { const P = this.P, keep = P['proto.driver.cautionZone']; P['proto.driver.cautionZone'] = this.DP['proto.driver.cautionZone'] || keep; try { return TP.fieldFor.call(this); } finally { P['proto.driver.cautionZone'] = keep; } }
    fromAbove(e) { return e.kind === 'drop' || TP.fromAbove.call(this, e); } // Prototype 9's drop off a deck is the hit from above
    emit(type, data) { BP.emit.call(this, type, data); if (this.duelOn && this.duelFeed) this.duelFeed.push(this.events[this.events.length - 1]); }
    admit() { this.p9call('admit'); if (this.duelOn) this.admitRed(); }
    // the block lift (row 715) for any car the dummy keeps waiting: the red car, the red car that has hit it and stood, the fleet
    blocked() { const r = TP.blocked.call(this); if (r) return r; const b = this.body; if (!b || !b.alive || b.lifted) return null; return this.onRoad().find((q) => !q.ghost && !q.hitStand && q.v < 1 && q.hz && q.hz.inPath && (q.spent || !q.red)) || null; }
    carPassed(c) { return !c || c.gone || (c.spent && c.v >= 1); }
    stepLift(dt) { const P = this.P, k = P['duel.twoWay']; P['duel.twoWay'] = 1; try { return TP.stepLift.call(this, dt); } finally { P['duel.twoWay'] = k; } } // every stage counts a car the dummy keeps waiting
    // the red car: one at a time, on a lane of the tile's road; back duel.redReturnSeconds after it leaves the screen
    admitRed() {
      const P = this.P, DP = this.DP;
      if (this.lesson || !this.redLanes || !this.redLanes.length) return;
      if (this.cars.some((c) => c.red && !c.ghost && !c.gone)) return;
      if (this.t + 1e-9 < this.leftAt + DP['duel.redReturnSeconds']) return;
      const k = this.redSeq || 0, rt = DP['duel.route'], ln = (rt != null && this.redLanes.find((q) => q.i === rt)) || this.redLanes[Math.floor(((k * 0.6180339887 + 0.31) % 1) * this.redLanes.length)], gap = 2 * P['vehicles.sedan.length'] + 30;
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
  // Lawrence (7 Nov): roadside cover on every tile, one family of objects per map. Monument: urban infrastructure and street
  // furniture. Tall cover (signal cabinets, digital kiosks, billboards) hides a standing dummy; low cover (planters, hedges) hides
  // one that ducks (hold C); bollard rows block the dummy, never the car. All solid: walked round, painted into the tile's art.
  // Sizes in world units (w along the road, d across it); h: the height a sightline must clear (low cover only).
  const COVER = {
    planter: { w: 120, d: 16, low: true, h: 14 }, hedge: { w: 96, d: 16, low: true, h: 18 },
    cabinet: { w: 44, d: 22 }, kiosk: { w: 30, d: 20 }, billboard: { w: 64, d: 12 }, krail: { w: 160, d: 12, low: true, h: 16 },
  };
  const FAMILY = { monument: ['cabinet', 'planter', 'kiosk', 'hedge', 'billboard'] }; // proposed: one family a map (urban, industrial, garden...)
  function placeCover(T, sc, P, DP, lanes, family, prof) {
    prof = prof || {}; const gaps = prof.gap || [2, 42];
    const LW = P['world.laneWidth'], W = P['world.width'], H = P['world.height'], kinds = prof.cover || family || FAMILY.monument, out = [];
    const solid = (sc.game.statics || []).filter((q) => q.kind !== 'mass' && !q.duel).concat(sc.stairs || []), cands = [];
    const slot = (ln, s, sg, gap, w, d, tall) => { // a rect on the kerb (or a clear body-width off it), with room behind it to hide
      const q = X.pathAt(ln.path, s), ax = Math.abs(q.tx) > 0.95, ay = Math.abs(q.ty) > 0.95; if (!ax && !ay) return null;
      const off = sg > 0 ? ln.path.edges[1] + gap + d / 2 : ln.path.edges[0] - gap - d / 2, cx = q.x + q.nx * off, cy = q.y + q.ny * off;
      if (tall && ax && off * q.ny > 0) return null; // tall cover stands north of a road running across: drawn upward, it never stands in the lane
      const r = ax ? { x: cx - w / 2, y: cy - d / 2, w, h: d } : { x: cx - d / 2, y: cy - w / 2, w: d, h: w };
      const ux = Math.round(q.nx * sg), uy = Math.round(q.ny * sg), behind = { x: r.x + (ux > 0 ? r.w : ux < 0 ? -34 : 0), y: r.y + (uy > 0 ? r.h : uy < 0 ? -34 : 0), w: ux ? 34 : r.w, h: uy ? 34 : r.h }; // where a dummy hides
      if (r.x < 24 || r.y < 24 || r.x + r.w > W - 24 || r.y + r.h > H - 24 || rectHits(r, solid, 30) || rectHits(behind, solid, 2) || behind.x < 8 || behind.y < 8 || behind.x + behind.w > W - 8 || behind.y + behind.h > H - 8) return null;
      const pts = [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h], [r.x + r.w / 2, r.y + r.h / 2]];
      if ((T.level.lanes || []).some((p) => pts.some(([x, y]) => Math.abs(X.pathProject(p, x, y).lat) < LW / 2 + 1))) return null;
      if ((sc.layers || []).some((l) => l.inBand && pts.some(([x, y]) => l.inBand(x, y)))) return null; // never under a deck
      return Object.assign(r, { score: Math.hypot(cx - W / 2, cy - H / 2) + gap, ax });
    };
    for (const kind of kinds) { const k = COVER[kind];
      for (const ln of lanes) for (let s = ln.enterS + 80; s <= ln.exitS - 80; s += 30) for (const sg of [1, -1]) for (const gap of gaps) { const r = slot(ln, s, sg, gap, k.w, k.d, !k.low); if (r) cands.push(Object.assign(r, { kind, sg, s, ln, gap })); } }
    cands.sort((a, b) => a.score - b.score);
    const want = Math.min(5, kinds.length); // one of each kind of the family, as room allows, each 90 clear of the last
    const railFor = (q) => { // a K-rail on the kerb between the piece and the road: a dash stops at it, a jump clears it
      const L = (q.ax ? q.w : q.h) + 90, p = X.pathAt(q.ln.path, q.s), off = q.sg > 0 ? q.ln.path.edges[1] + 8 : q.ln.path.edges[0] - 8, cx = p.x + p.nx * off, cy = p.y + p.ny * off;
      const r = q.ax ? { x: cx - L / 2, y: cy - 6, w: L, h: 12 } : { x: cx - 6, y: cy - L / 2, w: 12, h: L };
      if (r.x < 8 || r.y < 8 || r.x + r.w > W - 8 || r.y + r.h > H - 8 || rectHits(r, solid, 4) || rectHits(r, out, 2) || (T.level.lanes || []).some((pp) => [[r.x, r.y], [r.x + r.w, r.y + r.h], [r.x + r.w / 2, r.y + r.h / 2]].some(([x, y]) => Math.abs(X.pathProject(pp, x, y).lat) < LW / 2 + 1))) return null;
      return Object.assign(r, { kind: 'krail', low: true, height: 16, jumpable: true, zTop: P['world.jumpableHeight'] || 20, duel: true });
    };
    for (const kind of kinds) { if (out.length >= want) break; let rail = null; const r = cands.find((q) => q.kind === kind && !rectHits(q, out, 90) && (!prof.rail || (rail = railFor(q)))); if (!r) continue; const k = COVER[kind];
      if (rail) out.push(Object.assign(rail, { id: 'krail' + out.length }));
      delete r.score; out.push(Object.assign(r, { low: !!k.low, height: k.low ? (kind === 'planter' ? DP['props.planter.height'] || k.h : k.h) : undefined, id: kind + out.length, duel: true })); }
    // a bollard row on the kerb by the first tall piece: 38 between posts, wider than a dummy (body.radius 13)
    for (const q of out) { delete q.ln; delete q.sg; delete q.s; delete q.gap; }
    const tall = prof.bollards === false || !(prof.bollards || !prof.cover) ? null : out.find((q) => !q.low); if (tall) for (const dir of [1, -1]) { const row = [];
      for (let n = 0; n < 3; n++) { const along = (tall.ax ? tall.w : tall.h) / 2 + 40 + n * 48, cx = tall.x + tall.w / 2 + (tall.ax ? dir * along : 0), cy = tall.y + tall.h / 2 + (tall.ax ? 0 : dir * along), b = { x: cx - 5, y: cy - 5, w: 10, h: 10 };
        if (b.x < 24 || b.y < 24 || b.x + b.w > W - 24 || b.y + b.h > H - 24 || rectHits(b, solid, 30) || rectHits(b, out, 30) || (T.level.lanes || []).some((p) => Math.abs(X.pathProject(p, cx, cy).lat) < LW / 2 + 6)) break;
        row.push(Object.assign(b, { kind: 'bollard', low: true, height: 10, id: 'bollard' + out.length + '-' + n, duel: true })); }
      if (row.length >= 2) { out.push(...row); break; } }
    return out;
  }
  // Prototype 11 (Edit 115): a puzzle's own pieces, by the route's coordinates. at: 0..1 along the route on screen; side: 'left' or
  // 'right' of travel, or a compass side (N, S, E, W); gap from the kerb. A row repeats a kind along the kerb, 'space' apart
  // (under body.radius × 2, so a walk cannot pass; a dash vaults planters and hedges).
  function placeLayout(T, sc, P, DP, lay) {
    const LW = P['world.laneWidth'], W = P['world.width'], H = P['world.height'], out = [], skipped = [];
    const ln = T.redLanes.find((l) => l.i === DP['duel.route']) || T.redLanes[0]; if (!ln) return { out, skipped };
    const solid = (sc.game.statics || []).filter((q) => q.kind !== 'mass' && q.kind !== 'bound' && !q.duel).concat(sc.stairs || []);
    const sOf = (at) => ln.enterS + clamp(at, 0, 1) * (ln.exitS - ln.enterS);
    const sideOf = (q, side) => { const c = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] }[side]; if (c) return q.nx * c[0] + q.ny * c[1] >= 0 ? 1 : -1; const l = q.nx * -q.ty + q.ny * q.tx; return (side === 'right') === (l > 0) ? 1 : -1; }; // right of travel: (-ty, tx) in screen axes (y down)
    const piece = (kind, s, side, gap, id) => {
      const k = COVER[kind], q = X.pathAt(ln.path, s), sg = sideOf(q, side), ax = Math.abs(q.tx) >= Math.abs(q.ty);
      const off = (sg > 0 ? ln.path.edges[1] : ln.path.edges[0]) + sg * ((gap != null ? gap : 2) + k.d / 2), cx = q.x + q.nx * off, cy = q.y + q.ny * off;
      const r = ax ? { x: cx - k.w / 2, y: cy - k.d / 2, w: k.w, h: k.d } : { x: cx - k.d / 2, y: cy - k.w / 2, w: k.d, h: k.w };
      const pts = [[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h], [r.x + r.w / 2, r.y + r.h / 2]];
      const why = r.x < 8 || r.y < 8 || r.x + r.w > W - 8 || r.y + r.h > H - 8 ? 'edge' : rectHits(r, solid, 2) ? 'solid' : rectHits(r, out, 1) ? 'overlap'
        : (T.level.lanes || []).some((p) => pts.some(([x, y]) => Math.abs(X.pathProject(p, x, y).lat) < LW / 2 + 1)) ? 'lane' : null;
      if (why) { skipped.push(kind + '@' + Math.round(cx) + ',' + Math.round(cy) + ' ' + why); return null; }
      return Object.assign(r, { kind, low: !!k.low, height: k.low ? (kind === 'planter' ? DP['props.planter.height'] || k.h : k.h) : undefined, id: id || kind + out.length, duel: true });
    };
    for (const c of lay.cover || []) { const r = piece(c.kind, sOf(c.at), c.side, c.gap); if (r) out.push(r); }
    for (const w of lay.rows || []) { const k = COVER[w.kind], step = k.w + (w.space != null ? w.space : 8); for (let s = sOf(w.from); s <= sOf(w.to) + 1e-6; s += step) { const r = piece(w.kind, s, w.side, w.gap, w.kind + 'row' + out.length); if (r) out.push(r); } }
    return { out, skipped };
  }
  const placePlanters = (T, sc, P, DP, lanes) => placeCover(T, sc, P, DP, lanes, ['planter', 'hedge']).filter((q) => q.low && q.kind !== 'bollard'); // the low cover alone (affordances)
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
  function join(T, sc, DP, feed, PP, def) {
    const prof = def && def.level && RULES.levels[def.level] ? RULES.levels[def.level] : null;
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
    const lay = def && def.layout; // Prototype 11: a puzzle's own pieces (Edit 115)
    if (!sc.duelCover) { if (lay) { const L = placeLayout(T, sc, P, DP, lay); sc.duelCover = L.out; sc.duelSkipped = L.skipped; } else sc.duelCover = placeCover(T, sc, P, DP, T.redLanes, FAMILY[sc.D && sc.D.id] || FAMILY.monument, prof); for (const q of sc.duelCover) { sc.game.statics.push(q); if (W6.paintCover) W6.paintCover(sc, q); } } // part of the tile for good: walked round, painted as Prototype 9 paints its own
    const planters = sc.duelCover;
    // Prototype 9's statics hide the dummy from the red car's own sensors; its planters are low cover (rows 696-697), as the duel's
    const ph = DP['props.planter.height'] || 14;
    // the level's own shapes block its sightline: buildings, walls, columns, sculptures; masses (terraces, cubes, pools' rims) by their drawn height; planters are low cover
    const massH = (q) => (q.ht || 0) * ((W6.artUnit || 2.5) / (P['proto.art.extrusion'] || 0.3));
    T.level.statics = (sc.game.statics || []).filter((s) => !s.duel && s.kind !== 'bound').map((s) => (s.kind === 'planter' ? Object.assign({}, s, { low: true, height: ph }) : s.kind === 'mass' ? Object.assign({}, s, { low: true, height: massH(s) }) : s)).concat(planters);
    const roadside = T.level.statics.filter((q) => q.low && T.redLanes.some((ln) => Math.abs(X.pathProject(ln.path, q.x + q.w / 2, q.y + q.h / 2).lat) < 160)); // the planters an ambush uses
    const blind = (sc.duelCover || []).filter((q) => !q.low).slice(0, 1); // one tall piece no camera watches: rung 4's open way, cover the cameras miss
    T.level.cameras = lay ? [] : (prof ? prof.cameras || Math.round(DP['duel.startRung'] || 0) >= 4 : Math.round(DP['duel.topRung'] || 0) >= 4) ? placeCameras(sc, P, T.redLanes, roadside.concat(blind)) : [];
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
      this.duelFeed = []; join(T, sc, DP, this.duelFeed, this.P, def);
      Object.assign(this, { duelT: T, duelSc: sc, duelDef: def, duelDP: DP, duelHits: 0, duelIncidents: 0, duelMovedAt: null, duelInc0: 0, duelPending: false, duelDone: false, duelDuck: !rulesPlan() || MAP.tiles.slice(0, MAP.tiles.indexOf(def)).some((q) => q.earns === 'knees1'), duelT0: this.t }); // DUCK: Super Knees, once earned
      this.emit('duel-start', { tile: def.tile, stage: def.stage, rung: T.rung, top: Math.round(DP['duel.topRung'] || 0), lanes: T.redLanes.length });
    }
    duelStop() { this.clipRing = []; this.clearLesson = null; if (this.duelT) leave(this.duelT, this.W6.sims); this.duelT = null; this.duelDef = null; this.duelSc = null; if (this.body) { this.body.duck = false; this.body.lifted = false; } }
    duelProgress() { const d = this.duelDef, T = this.duelT; if (!d) return 0; return d.objective.kind === 'stealth' ? (T ? T.stealth.points : 0) : d.objective.kind === 'incidents' ? (T && this.duelMovedAt != null ? (T.run.incidents || 0) - this.duelInc0 : 0) : this.duelHits; } // an Incident counts once the dummy has moved: it made the car brake
    duelObjective() {
      const d = this.duelDef;
      if (!d || !this.duelT || this.duelDone) { // between tiles: the next tile's objective in the plan's words, never Prototype 9's write-offs
        const act = this.story && this.levelId === 'monument' ? STORY.activeTile(this.story, this.levelId) : null, nx = act ? MAP.tiles.find((q) => q.tile === act) : null;
        return nx ? ['OBJECTIVE · ' + nx.tile + ' · ' + String(nx.title).toUpperCase(), 'Next: ' + nx.objective.label + ' (0 of ' + nx.objective.count + '). ' + (nx.hint || '')] : null;
      }
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
      if (T && this.clearLesson && this.phase === 'report') { // Lawrence (7 Nov): one lesson per tile, after the hit that clears it and its write-off, before the report
        T.lesson = this.clearLesson; this.clearLesson = null; T.lesson.state = 'showing'; T.lesson.shownT = this.t; this.phase = 'lesson';
        this.emit('duel-lesson', { from: T.lesson.from, to: T.lesson.to, name: T.lesson.name, atClear: true });
        return;
      }
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
      this.holdHits();
      if (T) { this.redSweep(); if (b && b.duck && !this.canDuck()) this.stand(); this.incidentCheck(); this.unstick(cmd || {}); this.recordClip(); }
    }
    // A car that has hit the dummy brakes to a stop at traffic.hardBraking and stands TUNE.hitStand seconds; then it drives on
    hitStand(c) { if (c && !c.ghost) { c.hitStand = { left: TUNE.hitStand, v: c.v }; this.emit('hit-stand', { car: c.id }); } }
    holdHits() {
      const sims = (this.W6 && this.W6.sims) || []; if (!sims.some((q) => q.cars.some((c) => c.hitStand || (c.real && c.real.hitStand)))) return;
      const dt = 1 / this.P['simulation.tickRate'], a = TUNE.redHard;
      for (const q of sims) for (const c of q.cars) { const h = !c.ghost && c.hitStand; if (!h) continue;
        const cap = Math.max(0, h.v - a * dt); if (c.v > cap) { c.s -= (c.v - cap) * dt; c.v = cap; q.pose(c); }
        h.v = c.v; if (c.v < 1) h.left -= dt; if (h.left <= 0) c.hitStand = null; }
      for (const q of sims) for (const c of q.cars) if (c.ghost && c.real && c.real.hitStand && c.v > c.real.v) { c.s -= (c.v - c.real.v) * dt; c.v = c.real.v; q.pose(c); } // its ghost next door keeps pace
    }
    // Beat 1 of a lesson (Prototype 10): the last duel.lessonClipSeconds of the tile in test, replayed as the car's training clip
    recordClip(force) {
      const T = this.duelT, b = this.body; if (!T || (!force && this.phase !== 'play') || this.sc !== T.duelSc) return;
      const ring = this.clipRing || (this.clipRing = []), CL = (T.DP['duel.lessonClipSeconds'] || 3) + 0.1;
      const flat = (o) => { const q = {}; for (const k in o) q[k] = o[k]; return q; }; // what the game draws: its cars and the dummy, as they were
      ring.push({ t: this.t, view: (this.view || this.cars || []).map(flat), b: b ? flat(b) : null });
      while (ring.length && this.t - ring[0].t > CL) ring.shift();
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
      const T = this.duelT;
      if (T && T.lesson && T.lesson.atClear) { const L = T.lesson; if (L.part) { T.lesson = null; this.phase = 'report'; this.emit('earned', { part: L.part }); return; } T.rung = L.to; T.lessons.push({ from: L.from, to: L.to, zone: L.zone, kind: L.kind, hitT: L.hitT, shownT: L.shownT }); T.lesson = null; this.phase = 'report'; this.emit('learned', { rung: L.to, name: L.name, atClear: true }); return; } // on to the report
      this.phase = 'play';
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
        if (ct.drop && !ct.fault) { ct.carPart = Math.abs(c.v); ct.bodyPart = 0; ct.fault = faultOf(ct.carPart, 0); this.knockFault = ct.fault; } // a drop: the car drives into the falling dummy, or it sits still
        const e0 = this.events.length, p0 = this.run.points, f0 = this.effects.length, cb0 = b.combo;
        const ok = super.account([ct]);
        const dp = this.run.points - p0, bursts = this.effects.slice(f0).filter((q) => q.type === 'burst'), hits = this.events.slice(e0).filter((e) => e.type === 'impact');
        if (hits.some((e) => e.lost > 0)) this.hitStand(c); // it stops (Lawrence, 7 Nov): no more shoving the dummy along
        if (ct.fault === 'dummy') { // the dummy ran into it: the damage stands, nothing else (Lawrence, 7 Nov)
          this.run.points = p0; b.combo = cb0; for (const q of bursts) q.type = 'touch';
          for (const e of hits) { e.fault = 'dummy'; e.points = 0; this.emit('fault', { car: c.id, red, lost: e.lost, zone: e.zone, kind: e.kind, carPart: +(ct.carPart || 0).toFixed(1), bodyPart: +(ct.bodyPart || 0).toFixed(1) }); }
          continue;
        }
        if (ok) positive = true;
        for (const e of hits) { e.fault = 'car'; e.carPart = +(ct.carPart || 0).toFixed(1); e.bodyPart = +(ct.bodyPart || 0).toFixed(1); }
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
      if (this.duelProgress() >= this.duelDef.objective.count && !this.duelDone) { this.duelPending = true; this.tileLesson(e, c); } // the tile's one lesson: from the hit that clears it
    }
    // Lawrence (7 Nov): the car learns once a tile, from the hit that clears it. The tile plays at its stage's start rung; the lesson
    // (start → top) shows after the write-off; the next tile starts there. Only the red car's hits count toward the objective.
    tileLesson(e, c) {
      const T = this.duelT, from = T.rung, top = Math.round(T.DP['duel.topRung'] || 0), next = RUNGS[from + 1], earn = this.duelDef && this.duelDef.earns;
      if (earn && earn !== 'car') { // the player earns a part: its card at the clear; Prototype 9's drone fits it on the way to the next tile (Super Knees: now)
        const pt = RULES.parts[earn]; if (!pt) return; const i = MAP.tiles.indexOf(this.duelDef), nx = MAP.tiles[i + 1];
        this.clearLesson = { state: 'due', atClear: true, part: earn, info: pt, next: nx ? nx.tile : null, from, to: from, model: c.model, car: c.id, zone: e.zone, kind: e.kind, hitT: e.t };
        return;
      }
      if (!next || top <= from) return;
      this.recordClip(true);
      this.clearLesson = { state: 'due', atClear: true, from, to: from + 1, name: next.name, sensor: next.sensor, model: c.model, car: c.id, zone: e.zone, kind: e.kind, hitT: e.t, lost: e.lost, origin: e.origin || null, seenAt: e.seenAt || null,
        clip: { frames: (this.clipRing || []).slice(), hitT: this.t, zone: e.zone } };
      T.emit('lesson-due', { model: c.model, from, to: from + 1, zone: e.zone, car: c.id, atClear: true });
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
      const n0 = contacts.length, pre = b ? { x: b.x, y: b.y, vx: b.vx, vy: b.vy, mode: b.mode, pushed: b.pushed, sling: b.sling } : null;
      const vault = !!(this.duelT && b && b.mode === 'lunge' && this.level && this.level.statics.some((q) => q.kind === 'planter' || q.kind === 'hedge')), keep = this.level && this.level.statics;
      if (vault) this.level.statics = keep.filter((q) => q.kind !== 'planter' && q.kind !== 'hedge');
      try { super.collideBody(contacts, k); } finally { if (vault) this.level.statics = keep; }
      if (this.duelT && pre) for (let i = n0; i < contacts.length; i++) this.atFault(contacts[i], pre);
    }
    // who hit whom: the vehicle's and the dummy's speeds along the contact normal, just before it. A bounce off one car into
    // another keeps the fault of the hit that threw it.
    atFault(ct, pre) {
      const g = ct.car, r = this.P['body.radius'], res = X.circleCar(pre.x, pre.y, r + 4, g);
      let nx, ny; if (res) { nx = res.nx; ny = res.ny; } else { const dx = pre.x - g.x, dy = pre.y - g.y, l = hyp(dx, dy) || 1; nx = dx / l; ny = dy / l; }
      ct.carPart = (g.vx || 0) * nx + (g.vy || 0) * ny; ct.bodyPart = -(pre.vx * nx + pre.vy * ny);
      if (pre.mode === 'knock' && !pre.pushed && !pre.sling && this.knockFault) ct.fault = this.knockFault;
      else ct.fault = faultOf(ct.carPart, ct.bodyPart);
      this.knockFault = ct.fault;
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
      const at = (c, t) => ({ x: c.x + Math.cos(c.h) * c.v * t, y: c.y + Math.sin(c.h) * c.v * t, h: c.h, L: c.L, W: c.W });
      const judge = (c, q, res, x, y, t, bvx, bvy) => { const cp = Math.cos(c.h) * c.v * res.nx + Math.sin(c.h) * c.v * res.ny, bp = -(bvx * res.nx + bvy * res.ny); return { x, y, t, car: c.id, red: !!c.red, fault: faultOf(cp, bp) }; };
      let x1 = b.x, y1 = b.y, hit = null; const N = Math.max(24, Math.ceil(R / 4));
      for (let i = 1; i <= N; i++) { const d = R * i / N;
        if (!free(d)) { let lo = R * (i - 1) / N, hi = d; for (let j = 0; j < 12; j++) { const mm = (lo + hi) / 2; if (free(mm)) lo = mm; else hi = mm; } x1 = b.x + ca * lo; y1 = b.y + sa * lo; break; }
        const t = tAt(d), x = b.x + ca * d, y = b.y + sa * d; x1 = x; y1 = y;
        const sp = d <= R * df ? R * df / tf : R * (1 - df) / (T - tf); // the dash's speed there: fast, then slow
        for (const c of cars) { const q = at(c, t), res = X.circleCar(x, y, r, q); if (res) { hit = judge(c, q, res, x, y, t, ca * sp, sa * sp); break; } }
        if (hit) break; }
      // landed in its way: the car arrives within duel's guide horizon and drives into a dummy that stands (its fault)
      if (!hit) for (let t = T; t <= T + 0.8 && !hit; t += 0.05) for (const c of cars) { const q = at(c, t), res = X.circleCar(x1, y1, r, q); if (res) { hit = judge(c, q, res, x1, y1, t, 0, 0); hit.after = true; break; } }
      return { x0: b.x, y0: b.y, x1, y1, dir, R, hit, ready };
    }
    trace() { const tr = super.trace(); if (this.duelT) tr.duel = { tile: this.duelDef.tile, stage: this.duelDef.stage, rung: this.duelT.rung, hits: this.duelHits, lessons: this.duelT.lessons, crashes: this.duelT.crashes.length }; return tr; }
  }
  STORY.StorySim = DuelStorySim;
  const taskText = STORY.taskText; // the tile card and HUD read the pipeline's objective
  STORY.taskText = (task, P) => (task && task.kind === 'red' ? { label: task.label, brief: task.brief } : taskText(task, P));
  root.DUEL = { DuelTileSim, DuelStorySim, duelParams, laneInfo, placePlanters, placeCover, placeLayout, COVER, FAMILY, RULES, placeCameras, RUNGS, MAP, TUNE, faultOf, version: 1 };
})(typeof window !== 'undefined' ? window : globalThis);
