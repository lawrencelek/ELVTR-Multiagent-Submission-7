/* DUMMIES · Prototype 11 (GDD Edits 112-113): Story Map 1 as nine puzzles.
   One puzzle a tile (content/puzzles_map1.json). The tile is fenced on all four sides; the kit, the red car's rung, its lane and
   the white traffic are the puzzle's. R restarts in place. Two clocks: the attempt clock judges ★ Par; the puzzle clock runs
   through restarts (pacing). Stars: ★ Clear, ★ Untouched, ★ Par. A boss takes several hits; each hit short of the last plays a
   lesson once the car has left, and it comes back a rung up. Breakable cameras: a dash into a camera post breaks it.
   PuzzleSim extends Submission 7's DuelStorySim (duel.js). Loads after duel.js and duel_ui.js, before game.js. */
(function (root) {
  'use strict';
  const STORY = root.STORY, DUEL = root.DUEL, PZ = root.P11_PUZZLES;
  if (!STORY || !DUEL || !PZ) { console.warn('p11: a module is missing; Submission 7 runs alone'); return; }
  const LIST = PZ.puzzles, BY = {}; for (const q of LIST) BY[q.tile] = q;
  const ORDER = LIST.map((q) => q.tile), PARTS = (root.DUEL_RULES || {}).parts || {}, RUNGS = DUEL.RUNGS;
  const LEARNER = Object.assign({ cls: 'LUMINARY', name: 'LUMINARY™', prose: 'the Luminary™', model: 'SED-01-001', tag: 'S01' }, (PZ.map && PZ.map.learner) || {}); // Prototype 11.4 (Edit 120): the learner is a model
  const HINT_PASSES = PZ.hintPasses || 2; // story.puzzle.hintPasses (proposed)
  const ARC_KEY = 'dummies.p11.arcade', mem = {};
  const store = { get: (k) => { try { const v = localStorage.getItem(k); return v == null ? mem[k] || null : v; } catch (e) { return mem[k] || null; } }, set: (k, v) => { mem[k] = v; try { localStorage.setItem(k, v); } catch (e) { /* storage off: this visit */ } } };
  const hyp = Math.hypot, clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const nameOf = (c, r) => 'ABC'[c] + (r + 1);

  // ---------- the save: progress.p11 in Prototype 9's slot
  function saveOf(pr) {
    if (!pr) return null;
    if (!pr.p11 || pr.p11.v !== 1) pr.p11 = { v: 1, cur: null, best: {}, certified: false };
    pr.district = 'monument'; pr.complete = false;
    pr.done = pr.done || {}; pr.done.monument = ORDER.filter((t) => pr.p11.best[t]);
    return pr.p11;
  }
  const built = (t) => !!(BY[t] && BY[t].built);
  function stateOf(pr, t) { // 'solved' · 'open' · 'locked' · 'build'
    const sv = saveOf(pr); if (!BY[t]) return 'locked';
    if (sv.best[t]) return 'solved';
    if (!built(t)) return 'build';
    return ORDER.slice(0, ORDER.indexOf(t)).filter(built).every((u) => sv.best[u]) ? 'open' : 'locked';
  }
  const playable = (pr, t) => { const s = stateOf(pr, t); return s === 'open' || s === 'solved'; };
  function firstOpen(pr) { return ORDER.find((t) => stateOf(pr, t) === 'open') || ORDER.find((t) => playable(pr, t)) || ORDER[0]; }
  function nextOf(t) { const i = ORDER.indexOf(t); return ORDER.slice(i + 1).find(built) || null; }
  const starsOf = (pr, t) => { const b = saveOf(pr).best[t]; return b ? b.stars : [0, 0, 0]; };
  const starCount = (pr) => ORDER.reduce((a, t) => a + starsOf(pr, t).reduce((x, y) => x + y, 0), 0);

  // the sim's progress: the other eight tiles marked done, so this puzzle's tile is the one in test; the kit as the parts owned
  const P11 = { real: null, LIST, BY, ORDER, HINT_PASSES, LEARNER };
  P11.progressFor = function (real) {
    const sv = saveOf(real); P11.real = real;
    const cur = sv.cur && playable(real, sv.cur) ? sv.cur : firstOpen(real); sv.cur = cur;
    const q = BY[cur], pr = STORY.newProgress();
    pr.done.monument = ORDER.filter((t) => t !== cur);
    for (const k of q.kit || []) { const n = PARTS[k] && PARTS[k].p9; if (n) pr.owned[n] = true; }
    return pr;
  };
  P11.record = function (t, res) { // the clear: best stars (each kept), best attempt time; the next puzzle opens
    const pr = P11.real, sv = saveOf(pr); if (!sv) return null;
    const old = sv.best[t] || null, stars = old ? old.stars.map((v, i) => Math.max(v, res.stars[i])) : res.stars.slice();
    const time = old ? Math.min(old.time, res.attempt) : res.attempt;
    sv.best[t] = { stars, time, first: old ? old.first : res.clock, plays: (old ? old.plays : 0) + 1 };
    saveOf(pr);
    if (t === ORDER[ORDER.length - 1]) { sv.certified = true; store.set(ARC_KEY, '1'); }
    const next = nextOf(t); if (next) sv.cur = next;
    return { best: sv.best[t], newStars: stars.reduce((a, b) => a + b, 0) - (old ? old.stars.reduce((a, b) => a + b, 0) : 0), newTime: !old || res.attempt < old.time, next, certified: sv.certified };
  };
  P11.arcadeOpen = () => store.get(ARC_KEY) === '1';
  P11.stateOf = stateOf; P11.starsOf = starsOf; P11.starCount = starCount; P11.saveOf = saveOf; P11.nextOf = nextOf; P11.playable = playable;

  // ---------- the grid's keys (the story map's screen)
  P11.mapKey = function (app, m) {
    const pr = app.story, sv = saveOf(pr); if (!sv) return 'back';
    let t = app.p11Sel || sv.cur || firstOpen(pr), c = 'ABC'.indexOf(t[0]), r = +t[1] - 1;
    if (m === 'left') c = (c + 2) % 3; else if (m === 'right') c = (c + 1) % 3; else if (m === 'up') r = (r + 2) % 3; else if (m === 'down') r = (r + 1) % 3;
    else if (m === 'back') return 'back';
    else if (m === 'ok') { if (playable(pr, t)) { sv.cur = t; return 'deploy'; } app.p11Deny = { t, at: app.realT, why: stateOf(pr, t) }; return null; }
    app.p11Sel = nameOf(c, r); return null;
  };
  // ---------- the level card: the puzzle in its words
  const WORD = ['', 'One', 'Two', 'Three', 'Four', 'Five'], goalOf = (q) => (q.objective.count > 1 ? (WORD[q.objective.count] || q.objective.count) + ' hits by ' + LEARNER.prose + ', each its fault. A new way each time.' : 'Get ' + LEARNER.prose + ' to hit you. Its fault, not yours.'); // Prototype 11.5: the learner by name
  P11.goalOf = goalOf;
  P11.cardText = function (s) {
    const q = s.p11 && s.p11.q; if (!q) return null;
    const b = P11.real ? saveOf(P11.real).best[q.tile] : null;
    return { head: 'PUZZLE ' + q.n + ' · ' + q.name.toUpperCase(), sub: 'Tile ' + q.tile + '. Puzzle ' + q.n + ' of ' + LIST.length + '.', story: q.tale, goal: goalOf(q),
      extra: 'NEW · ' + q.new.toUpperCase() + '   ·   PAR ' + q.par + ' s' + (b ? '   ·   BEST ' + b.time.toFixed(1) + ' s ' + b.stars.map((v) => (v ? '★' : '☆')).join('') : '') };
  };
  P11.titleCards = function (cardOf, pr, last) {
    if (cardOf.STORY) { cardOf.STORY[1] = 'Nine puzzles. Get ' + LEARNER.prose + ' to hit you. It learns from every one.'; if (last && pr) { const sv = saveOf(pr); cardOf.STORY[2] = last.name + ' · ' + ORDER.filter((t) => sv.best[t]).length + ' of ' + ORDER.length + ' solved · ★ ' + starCount(pr) + (sv.certified ? ' · certified' : ''); } }
    if (cardOf.ARCADE && !P11.arcadeOpen()) cardOf.ARCADE = ['ARCADE', 'Locked. Pass Certification, Map 1\'s puzzle 9, to open it.', 'LOCKED · SOLVE MAP 1'];
  };
  // Prototype 11.3 (Edit 119): a clear that teaches two rungs shows one upgrade screen with both parts; the second rung is fitted on continue
  P11.lessonPair = function (s) {
    const T = s && s.duelT, L = T && T.lesson; if (!L) return [];
    const top = Math.round((T.DP && T.DP['duel.topRung']) || 0);
    return L.atClear && !L.part && !L.mid && L.to < top && RUNGS[L.to + 1] ? [L.to, L.to + 1] : [L.to];
  };
  P11.lessonNext = function (s) { // the lesson card's last line: what comes next, not how to beat it
    const p = s && s.p11; if (!p) return null;
    const T = s.duelT, L = T && T.lesson; if (L && L.mid) return 'Hit ' + (s.duelHits + 1) + ' of ' + p.q.objective.count + '. It comes back a rung up.';
    const nx = nextOf(p.q.tile), q = nx && BY[nx]; return q ? 'Puzzle ' + q.n + ': ' + q.name + '. New: ' + q.new : 'Certification. Arcade is open.';
  };

  // ---------- the puzzle's sim
  const Base = STORY.StorySim;
  class PuzzleSim extends Base {
    reset() { super.reset(); this.p11Setup(); }
    p11Setup() {
      this.p11 = null;
      if (!this.W6 || !this.storyMode || !this.story || !this.duelT) return;
      const act = STORY.activeTile(this.story, this.levelId), q = BY[act]; if (!q) return;
      const T = this.duelT, b = this.body, lay = q.layout || {}; T.learner = LEARNER.model; // Prototype 11.4: the learner's model ID on its car
      if (q.camera && q.camera.watch) this.p11Camera(q.camera.watch);
      if (lay.drop) Object.assign(b, { x: lay.drop[0], y: lay.drop[1], px: lay.drop[0], py: lay.drop[1], level: 0, floor: null }); // the puzzle's drop point (Edit 115)
      if (lay.cones) this.p11Cones(lay.cones);
      this.p11 = { q, phase: 0, clock: 0, attempt: 0, restarts: 0, passes: 0, failed: 0, failedPhase: 0, untouched: true, seq: 0, inPass: false, passHits: 0,
        ev: this.events.length, drop: { x: b.x, y: b.y, level: b.level || 0, floor: b.floor != null ? b.floor : null }, cams: (T.level.cameras || []).map((c) => c.slice()), broken: [],
        resultSeen: false, result: null, after: null, went: false, healAt: null, voidAt: null };
      this.duelDuck = (q.kit || []).includes('knees1'); // Super Knees: in the kit or not
      this.emit('p11-puzzle', { tile: q.tile, n: q.n, rung: T.rung, kit: q.kit, cams: this.p11.cams.length });
    }
    // the puzzle's street camera: on the kerb beside the cover it watches, aimed back up the road; every other piece out of its range
    p11Camera(kind) {
      const T = this.duelT, X = root.DUMMIES, W6 = root.WORLD6, P = T.P, sc = T.duelSc, R = P['perception.streetCameraRange'] || 180, W = P['world.width'], H = P['world.height'];
      const cover = T.level.statics.filter((q) => q.duel && q.kind !== 'bollard'), w = cover.find((q) => q.kind === kind); if (!w) return;
      const ln = T.redLanes.find((l) => l.i === T.DP['duel.route']) || T.redLanes[0]; if (!ln) return;
      const near = (q, x, y) => hyp(clamp(x, q.x, q.x + q.w) - x, clamp(y, q.y, q.y + q.h) - y), cx = w.x + w.w / 2, cy = w.y + w.h / 2, pr = X.pathProject(ln.path, cx, cy);
      const solid = (x, y) => x < 16 || y < 24 || x > W - 16 || y > H - 16 || (sc.game.statics || []).some((q) => q.kind !== 'bound' && x > q.x - 6 && x < q.x + q.w + 6 && y > q.y - 6 && y < q.y + q.h + 6);
      for (let d = 30; d <= 260; d += 10) for (const sg of [1, -1]) {
        const at = X.pathAt(ln.path, pr.s + sg * d), x = at.x + at.nx * pr.lat, y = at.y + at.ny * pr.lat;
        if (solid(x, y) || near(w, x, y) > R - 40 || cover.some((q) => q !== w && !q.low && near(q, x, y) < R + 12)) continue; // low cover still hides a dummy that ducks
        T.level.cameras = [[x, y, Math.atan2(-at.ty, -at.tx) * 180 / Math.PI, 0]];
        sc.duelPosts = sc.duelPosts || []; sc.duelPosts.push(T.level.cameras[0]); if (W6 && W6.paintPost) W6.paintPost(sc, x, y);
        return;
      }
    }
    // the puzzle's cones: [] takes the tile's away (no Hands 1 in the kit); [[x, y], ...] sets their homes
    p11Cones(list) {
      const sc = this.duelT.duelSc, cs = sc.cones; if (!cs) return;
      const proto = cs[0] ? Object.assign({}, cs[0]) : null, n = proto ? list.length : 0;
      cs.length = Math.min(cs.length, n);
      for (let i = 0; i < n; i++) { const c = cs[i] || (cs[i] = Object.assign({}, proto, { id: (proto.id || 0) + 100 + i })); Object.assign(c, { x: list[i][0], y: list[i][1], hx: list[i][0], hy: list[i][1], vx: 0, vy: 0, state: 'free', flightT: 0 }); }
      if (sc.game) sc.game.coneHomes = list.map((q) => q.slice());
    }
    canCross(to) { // one puzzle, one tile: fenced on all four sides
      if (!this.storyMode || !this.p11) return super.canCross(to);
      const act = STORY.activeTile(this.story, this.levelId); return this.screenName() === act && nameOf(to[0], to[1]) === act;
    }
    duelObjective() {
      const p = this.p11; if (!p) return super.duelObjective();
      const q = p.q, n = Math.min(this.duelHits || 0, q.objective.count), hint = this.p11Hint();
      return ['PUZZLE ' + q.n + ' · ' + q.tile + ' · ' + q.name.toUpperCase(), q.objective.label + ' (' + n + ' of ' + q.objective.count + ').' + (hint ? ' HINT: ' + hint : ' R restarts.')];
    }
    p11Hint() { const p = this.p11; if (!p || p.failedPhase < HINT_PASSES) return null; const h = p.q.hints || []; return h[Math.min(p.phase, h.length - 1)] || null; }
    step(cmd) {
      const p = this.p11; if (!p) return super.step(cmd);
      if (this.phase === 'report' && !p.result) { if (!p.went) { p.went = true; this.p11Go = 'replay'; } return; } // a write-off that cleared nothing: the puzzle again
      if (this.phase === 'report' && this.clearLesson && !p.resultSeen) return; // the stars first; then the lesson
      if (this.phase === 'report' && p.resultSeen && !this.clearLesson) { if (!p.went) { p.went = true; this.p11Go = p.after || 'map'; } return; }
      super.step(cmd);
      if (this.phase === 'play' && !this.rescue && !this.duelDone && !this.duelPending) { const dt = 1 / this.P['simulation.tickRate']; p.clock += dt; p.attempt += dt; }
      this.p11Watch();
    }
    p11Watch() {
      const p = this.p11, T = this.duelT, b = this.body; if (!T) return;
      if (!(p.q.fleet > 0)) this.p11Fleet(); // fleet 0: no white cars on the tile in test or the four beside it
      const ev = this.events; if (p.ev > ev.length) p.ev = 0;
      for (let i = p.ev; i < ev.length; i++) { const e = ev[i];
        if (e.type === 'fault') { p.untouched = false; p.healAt = this.t + 1; }
        else if (e.type === 'impact') { if (!e.red) { if ((e.lost || 0) > 0) p.untouched = false; } p.healAt = this.t + 1; }
      }
      p.ev = ev.length;
      // passes: one red car's run through the tile. None counted on it: a failed pass
      const endPass = () => { p.inPass = false; if (this.duelHits === p.passHits && !this.duelDone && !this.duelPending) { p.failed++; p.failedPhase++; if (p.failedPhase === HINT_PASSES) this.emit('p11-hint', { tile: p.q.tile, phase: p.phase, hint: this.p11Hint() }); } };
      if ((T.redSeq || 0) > p.seq) { if (p.inPass) endPass(); p.seq = T.redSeq; p.passes++; p.passHits = this.duelHits; p.inPass = true; } // the next car can enter as the last one crosses into the next tile
      if (p.inPass && !this.redOnScreen()) endPass();
      // the chassis is patched a second after any contact: a puzzle never runs on a worn body (its dash reach stays the same)
      if (p.healAt != null && this.t >= p.healAt && b && b.alive && !this.duelPending && !this.duelDone && this.phase === 'play') { p.healAt = null; this.patch(); }
      if (p.q.breakableCameras && this.phase === 'play') this.p11Cameras();
    }
    patch() { const b = this.body; b.health = this.maxHealth(); if (b.parts) for (const k of Object.keys(b.parts)) b.parts[k] = 0; this.emit('p11-patched', {}); }
    p11Fleet() {
      const T = this.duelT, sc = T.duelSc;
      for (const s of this.W6.sims) {
        const q = s.sc; if (!q || Math.abs(q.col - sc.col) + Math.abs(q.row - sc.row) > 1) continue;
        if (s.cars.some((c) => !c.red)) s.cars = s.cars.filter((c) => c.red); // the decks too: a quiet test day (Edit 115)
      }
    }
    // Breakable CCTV (props.camera.breakable, proposed): a dash into the post breaks it; it reports to the car no more
    p11Cameras() {
      const p = this.p11, T = this.duelT, b = this.body; if (!b || !b.alive || b.mode !== 'lunge' || (b.level || 0) !== 0) return;
      const r = this.P['body.radius'] + 10, cams = T.level.cameras || [];
      const hit = cams.find((c) => hyp(b.x - c[0], b.y - c[1]) < r); if (!hit) return;
      T.level.cameras = cams.filter((c) => c !== hit); p.broken.push(hit.slice());
      this.emit('camera-broken', { x: +hit[0].toFixed(1), y: +hit[1].toFixed(1), left: T.level.cameras.length });
    }
    // R: the same puzzle again, in place. The clock runs on; the attempt clock starts again
    restart(why) {
      const p = this.p11, T = this.duelT; if (!p || !T || this.duelDone || this.duelPending) return false;
      if (this.phase !== 'play' && this.phase !== 'lesson') return false;
      for (const s of this.W6.sims) if (s.cars.some((c) => c.red)) s.cars = s.cars.filter((c) => !c.red);
      const DP = T.DP, back = DP['duel.redReturnSeconds'] || 2;
      Object.assign(T, { rung: clamp(Math.round(DP['duel.startRung'] || 0), 0, RUNGS.length - 1), lesson: null, lessons: [], crashes: [], spring: null, lift: null, blockT: 0, leftAt: T.t - back + 1, redSeq: 0, delivery: null,
        stealth: { points: 0, unseen: 0, lost: 0, seen: 0, last: null }, firstBrakeT: null, firstSideT: null, firstCoverT: null, firstItemT: null, stageCaution: null, carKeepTG: null });
      T.level.cameras = p.cams.map((c) => c.slice());
      for (const cn of this.cones || []) Object.assign(cn, { x: cn.hx, y: cn.hy, vx: 0, vy: 0, state: 'free', flightT: 0 });
      this.spawnBody(); const b = this.body, d = p.drop;
      Object.assign(b, { x: d.x, y: d.y, px: d.x, py: d.y, level: d.level, floor: d.floor });
      Object.assign(this, { duelHits: 0, duelPending: false, duelDone: false, clipRing: [], clearLesson: null, duelMovedAt: null, rescue: null, knockFault: null, stuckT: 0, stuckAt: null });
      Object.assign(p, { attempt: 0, restarts: p.restarts + 1, untouched: true, phase: 0, failedPhase: 0, seq: 0, inPass: false, broken: [], ev: this.events.length, healAt: null });
      this.phase = 'brief'; this.dropPending = true; this.continueBrief();
      this.emit('p11-restart', { tile: p.q.tile, restarts: p.restarts, why: why || 'R', clock: +p.clock.toFixed(2) });
      return true;
    }
    // a boss: a counted hit short of the objective plays a lesson once the car has left; it returns one rung up
    duelImpact(e, c) {
      const h0 = this.duelHits; super.duelImpact(e, c);
      const p = this.p11; if (!p || this.duelHits === h0 || this.duelPending || this.duelDone) return;
      const T = this.duelT, top = Math.round(T.DP['duel.topRung'] || 0), next = RUNGS[T.rung + 1];
      p.phase++; p.failedPhase = 0;
      if (T.rung >= top || T.lesson || !next) return;
      this.recordClip(true);
      T.lesson = { state: 'due', mid: true, from: T.rung, to: T.rung + 1, name: next.name, sensor: next.sensor, model: c.model, car: c.id, zone: e.zone, kind: e.kind, hitT: e.t, lost: e.lost, origin: e.origin || null, seenAt: e.seenAt || null,
        clip: { frames: (this.clipRing || []).slice(), hitT: this.t, zone: e.zone } };
      T.emit('lesson-due', { model: c.model, from: T.rung, to: T.rung + 1, zone: e.zone, car: c.id, mid: true });
    }
    continueLesson() {
      const T = this.duelT, L = T && T.lesson, mid = L && L.mid, atClear = L && L.atClear && !L.part;
      super.continueLesson();
      if (mid && this.p11 && this.body && this.body.alive) this.patch();
      // a clear that teaches two rungs (Edit 115: roof lidar, then street cameras): the second lesson follows, on the same clip
      if (atClear && this.p11 && T.rung < Math.round(T.DP['duel.topRung'] || 0) && DUEL.RUNGS[T.rung + 1]) {
        const nx = DUEL.RUNGS[T.rung + 1];
        if (L.pair !== false) { T.lessons.push({ from: T.rung, to: T.rung + 1, zone: L.zone, kind: L.kind, hitT: L.hitT, shownT: L.shownT, pair: true }); T.rung++; this.emit('learned', { rung: T.rung, name: nx.name }); return; } // Prototype 11.3: fitted on the same screen
        this.clearLesson = Object.assign({}, L, { state: 'due', from: T.rung, to: T.rung + 1, name: nx.name, sensor: nx.sensor, card: false, shownT: null, beat: null }); this.phase = 'report';
        T.emit('lesson-due', { from: T.rung, to: T.rung + 1, atClear: true, second: true });
      }
    }
    writeOff() {
      const clearing = !!(this.p11 && this.duelPending && this.duelT);
      super.writeOff();
      if (!clearing) return;
      const p = this.p11, q = p.q, stars = [1, p.untouched ? 1 : 0, p.attempt <= q.par + 1e-6 ? 1 : 0];
      p.result = { stars, attempt: +p.attempt.toFixed(2), clock: +p.clock.toFixed(2), restarts: p.restarts, passes: p.passes, failed: p.failed };
      p.record = P11.record(q.tile, p.result); p.shownAt = null;
      this.emit('story-p11', Object.assign({ tile: q.tile }, p.result, { next: p.record && p.record.next, certified: !!(p.record && p.record.certified) })); // a story-* event: the page saves the slot
    }
    // the result card's keys: Enter on (the lesson, then the next puzzle); R the same puzzle again; Shift the grid
    resultKey(m, now) {
      const p = this.p11; if (!p || !p.result || p.resultSeen) return;
      if (p.shownAt == null) p.shownAt = now; if (now - p.shownAt < 0.6) return;
      const nx = p.record && p.record.next;
      if (m === 'ok') { p.resultSeen = true; p.after = nx ? 'next' : 'map'; }
      else if (m === 'restart') { if (P11.real) saveOf(P11.real).cur = p.q.tile; this.p11Go = 'replay'; p.went = true; p.resultSeen = true; }
      else if (m === 'back') { this.p11Go = 'map'; p.went = true; p.resultSeen = true; }
    }
    trace() { const tr = super.trace(); if (this.p11) tr.p11 = { tile: this.p11.q.tile, clock: +this.p11.clock.toFixed(2), attempt: +this.p11.attempt.toFixed(2), restarts: this.p11.restarts, passes: this.p11.passes, failed: this.p11.failed, untouched: this.p11.untouched, result: this.p11.result, broken: this.p11.broken.length }; return tr; }
  }
  STORY.StorySim = PuzzleSim;
  P11.PuzzleSim = PuzzleSim;
  root.P11 = P11;
})(typeof window !== 'undefined' ? window : globalThis);
