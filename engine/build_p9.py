#!/usr/bin/env python3
"""Step 6b (no model): the integrated game. Prototype 9's game (engine/p9: districts, art, fleet, story, HUD, sound) with
Prototype 10's red car (engine/vendor/testroad.js) driving the tile in test, and the pipeline's plan for Map 1
(content/story_map1.json) setting each tile's ladder stage, objective, title, tale and hint. Output: index.html.

The vendored files stay byte-identical to Submission 6B (VENDOR.md). Every change to them is a patch applied here, each
asserted to match exactly once:
  game.js   C / Ctrl duck; the duel's overlays, HUD panel and lesson card; Enter closes the lesson; the red car's paint;
            the objective line; the tile card's NEW line. STORY keeps Prototype 9's save screen (NEW GAME, CONTINUE)
  story_v2  Map 1's nine tiles take the pipeline's title, tale and objective (task kind 'red')
"""
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
E, V = ROOT / 'engine' / 'p9', ROOT / 'engine' / 'vendor'


def patch(src, pairs, name):
    for a, b in pairs:
        n = src.count(a)
        assert n == 1, f'{name}: anchor found {n} times: {a[:80]!r}'
        src = src.replace(a, b)
    return src


def game_js():
    g = (E / 'game.js').read_text(encoding='utf-8')
    return patch(g, [
        ("    Escape: 'pause', KeyP: 'pause', KeyT: 'tune', KeyG: 'padsetup',\n",
         "    Escape: 'pause', KeyP: 'pause', KeyT: 'tune', KeyG: 'padsetup', KeyC: 'duck', ControlLeft: 'duck', ControlRight: 'duck', // Submission 7: DUCK\n"),
        ("xHeld: held.has('x') || pad.xHeld || !!TOUCH.down.x };",
         "xHeld: held.has('x') || pad.xHeld || !!TOUCH.down.x, duck: held.has('duck') }; // Submission 7: hold C to duck"),
        ("    drawBubblesHD(s); // Edit 83",
         "    if (window.DUEL_UI) window.DUEL_UI.field(ctx, s, { FX, FY, FW, FH, RA, U }); // Submission 7: the red car's field, over the art\n    drawBubblesHD(s); // Edit 83"),
        ("\n    drawHUD(s);\n",
         "\n    drawHUD(s);\n    if (window.DUEL_UI) window.DUEL_UI.hud(ctx, s, { FX, FY, FW, FH, VW, VH }); // Submission 7: the duel's panel\n"),
        ("    const s = app.sim;\n    drawField(s);\n    drawHUD(s);\n",
         "    const s = app.sim;\n    const rp = window.DUEL_UI ? window.DUEL_UI.replayBegin(s, app.realT) : null; // Submission 7: the lesson's clip, drawn by the game from its recording\n    drawField(s);\n    if (rp) window.DUEL_UI.replayEnd(s, rp);\n    drawHUD(s);\n"),
        ("    else if (s.phase === 'gift') drawGiftPopup(s); // Edit 84",
         "    else if (s.phase === 'gift') drawGiftPopup(s); // Edit 84\n    else if (s.phase === 'lesson' && window.DUEL_UI) window.DUEL_UI.lesson(ctx, s, { FX, FY, FW, FH, VW, VH, RA, U, t: app.realT }); // Submission 7: the lesson (clip, fit, card)"),
        ("      if (s.phase === 'brief' && m === 'ok') { s.continueBrief(); clearEdges(); return; } // Edit 81: the tile card",
         "      if (s.phase === 'lesson') { if (m === 'ok' || m === 'a') { if (!window.DUEL_UI || window.DUEL_UI.lessonKey(s)) s.continueLesson(); clearEdges(); return; } continue; } // Submission 7: the lesson (Enter skips to the card, then closes it)\n"
         "      if (s.phase === 'brief' && m === 'ok') { s.continueBrief(); clearEdges(); return; } // Edit 81: the tile card"),
        ("  function carSpr(s, c, braking) { return PIX.car(",
         "  function carSpr(s, c, braking) { if (c.red && window.DUEL_UI) return window.DUEL_UI.redSprite(carSpr0(s, c, braking)); return carSpr0(s, c, braking); } // Submission 7: the learning car is red\n"
         "  function carSpr0(s, c, braking) { return PIX.car("),
        ("    if (s.storyMode) {\n      const pr = s.story, id = s.levelId, act = STORY.activeTile(pr, id), here = s.screenName();\n",
         "    if (s.storyMode) {\n      if (s.duelObjective) { const o = s.duelObjective(); if (o && !s.rescue) return o; } // Submission 7: the pipeline's objective\n"
         "      const pr = s.story, id = s.levelId, act = STORY.activeTile(pr, id), here = s.screenName();\n"),
        ("      if (need > 1) extra = need + ' WRITE-OFFS TO CLEAR';",
         "      extra = tile.newIdea ? 'NEW · ' + String(tile.newIdea).toUpperCase() : need > 1 ? need + ' WRITE-OFFS TO CLEAR' : ''; // Submission 7: what the red car brings"),
    ], 'game.js')


def p11_game_js(g):
    """Prototype 11 (GDD Edit 113): the puzzle game's hooks, on top of Submission 7's."""
    return patch(g, [
        ("  function drawZones(s, c, clip) {\n",
         "  function drawZones(s, c, clip) {\n    if (window.P11) return; // Prototype 11.2 (Edit 117): one sensor language; Prototype 9's corridors and side outlines are off for every car (the second review: a white car's hatch over the red car's lane)\n"),
        ("PIX.fillPoly(left.concat(right.reverse()), (x, y) => {",
         "if (!(c.red && window.P11)) PIX.fillPoly(left.concat(right.reverse()), (x, y) => { // Prototype 11.2 (Edit 117): no headlight wedge on the red car; its forward camera's frustum shows what it sees"),
        ("      const c = cars.find((q) => q.id === id), age = now - bk.t0; if (!c || age > dur) continue;",
         "      const c = cars.find((q) => q.id === id), age = now - bk.t0; if (!c || age > dur || window.P11) continue; // Prototype 11.2 (Edit 117): no speech bubbles in the puzzles"),
        ("      if (c._brk && (c.v > 1 || held)) {",
         "      if (c._brk && (c.v > 1 || held) && !window.P11) { // Prototype 11.2 (Edit 117): no red brake fans in the puzzles (red is the car and its memory); the stop line says it"),
        ("  function drawViewEdges(s) {\n",
         "  function drawViewEdges(s) {\n    if (window.P11) return; // Prototype 11.2 (Edit 117): the board is whole; the dummy's view edges read as sensor edges\n"),
        ("xHeld: held.has('x') || pad.xHeld || !!TOUCH.down.x, duck: held.has('duck') }; // Submission 7: hold C to duck",
         "xHeld: held.has('x') || pad.xHeld || !!TOUCH.down.x, duck: held.has('duck') || held.has('b') || pad.bHeld || !!TOUCH.down.b || padShoulder() }; // Submission 7: hold C to duck. Prototype 11.2 (QA): pad and touch duck too: hold B (no jump in Map 1), or a shoulder button\n  function padShoulder() { try { for (const g of (navigator.getGamepads && navigator.getGamepads()) || []) if (g && [4, 5, 6].some((i) => g.buttons[i] && (g.buttons[i].pressed || g.buttons[i].value > 0.5))) return true; } catch (e) { /* the page forbids pads */ } return false; }"),
        # Prototype 11.3 (Edit 119): the pad layout. A dash, B crouch, X jump, Y interact (cones). Keys: Space/K dash; C, Ctrl, L, Shift crouch; J jump; E, I, Q interact
        ("pad.bHeld = !!o.held.b; pad.xHeld = !!o.held.x;", "pad.bHeld = !!o.held.b; pad.xHeld = !!o.held.x; pad.yHeld = !!o.held.y; // Prototype 11.3: Y is held to interact"),
        ("pad.mx = pad.my = 0; pad.bHeld = false; pad.xHeld = false;", "pad.mx = pad.my = 0; pad.bHeld = false; pad.xHeld = false; pad.yHeld = false;"),
        ("KeyJ: 'x', KeyE: 'x', KeyI: 'y', KeyQ: 'y',", "KeyJ: 'x', KeyE: window.P11 ? 'y' : 'x', KeyI: 'y', KeyQ: 'y', // Prototype 11.3: E interacts"),
        ("    q.a = q.b = q.bUp = q.x = q.y = 0;\n    return cmd;",
         "    if (window.P11) Object.assign(cmd, { bPress: q.x > 0, bRelease: false, bHeld: held.has('x') || pad.xHeld || !!TOUCH.down.x, xPress: q.y > 0, xHeld: held.has('y') || pad.yHeld || !!TOUCH.down.y, yPress: false, duck: p11Crouch(held.has('duck') || held.has('b') || pad.bHeld || !!TOUCH.down.b || padShoulder()) }); // Prototype 11.3: A dash, B crouch, X jump, Y interact. Prototype 11.4: B toggles by default\n    q.a = q.b = q.bUp = q.x = q.y = 0;\n    return cmd;\n  }\n  var CROUCH = { mode: (() => { try { return localStorage.getItem('dummies.p11.crouch') === 'hold' ? 'hold' : 'toggle'; } catch (e) { return 'toggle'; } })(), on: false, was: false, body: null, r: 0 }; window.__p11Crouch = CROUCH; // Prototype 11.4 (Edit 120): crouch is a toggle unless Controls sets hold\n  function p11Crouch(down) {\n    const s = app.sim, b = s && s.body; if (!b || !s.duelDuck || s.phase !== 'play') { CROUCH.on = false; CROUCH.was = down; return CROUCH.mode === 'hold' && down; }\n    if (CROUCH.body !== b || CROUCH.r !== (s.p11 && s.p11.restarts)) { CROUCH.body = b; CROUCH.r = s.p11 && s.p11.restarts; CROUCH.on = false; } // a new body or a restart stands it up\n    if (CROUCH.mode === 'hold') { CROUCH.was = down; CROUCH.on = down; return down; }\n    if (down && !CROUCH.was) CROUCH.on = !CROUCH.on; CROUCH.was = down; return CROUCH.on;"),
        ("  const FACE = [['y', 0, -1, 'Y', ABIL4 ? 'PUSH' : 'THROW'], ['x', -1, 0, 'X', ABIL3 ? 'GRAB' : 'GRAB'], ['b', 1, 0, 'B', 'JUMP'], ['a', 0, 1, 'A', 'DASH']]",
         "  const FACE = window.P11 ? [['y', 0, -1, 'Y', 'USE'], ['x', -1, 0, 'X', 'JUMP'], ['b', 1, 0, 'B', 'CROUCH'], ['a', 0, 1, 'A', 'DASH']] : [['y', 0, -1, 'Y', ABIL4 ? 'PUSH' : 'THROW'], ['x', -1, 0, 'X', ABIL3 ? 'GRAB' : 'GRAB'], ['b', 1, 0, 'B', 'JUMP'], ['a', 0, 1, 'A', 'DASH']]"),
        ("  const FACE_NODE = { a: null, b: 'jump', x: 'carry', y: ABIL4 ? 'push' : 'throw' };",
         "  const FACE_NODE = window.P11 ? { a: null, b: null, x: 'jump', y: 'carry' } : { a: null, b: 'jump', x: 'carry', y: ABIL4 ? 'push' : 'throw' }; // Prototype 11.3: B crouch unlocks with Super Knees (faceWord)"),
        ("    const node = FACE_NODE[f.id], unlocked = f.id === 'a' && STORY ? !(s && s.dashFitted) || s.dashFitted() : !node || !!(s && s.has(node));",
         "    const node = FACE_NODE[f.id], unlocked = window.P11 && f.id === 'b' ? !!(s && s.duelDuck) : f.id === 'a' && STORY ? !(s && s.dashFitted) || s.dashFitted() : !node || !!(s && s.has(node)); // Prototype 11.3: B is fitted with Super Knees"),
        ("    if (f.id === 'x') { const b = s.body, room = s.carriedCones().length < s.coneCapacity(),",
         "    if (f.id === (window.P11 ? 'y' : 'x')) { const b = s.body, room = s.carriedCones().length < s.coneCapacity(),"),
        ("    if (ABIL4) { // Edit 80: X grabs, a hold puts down; Y pushes off a car\n",
         "    if (window.P11) { const b = s.body; if (s.duelDuck) keys.push([pd ? 'B' : 'C', CROUCH.on && CROUCH.mode === 'toggle' ? 'STAND' : 'CROUCH']); if (s.has('jump')) keys.push([pd ? 'X' : 'J', 'JUMP']); if (s.has('carry')) keys.push([pd ? 'Y' : 'E', b.held ? 'DROP' : 'GRAB']); return keys; } // Prototype 11.3\n    if (ABIL4) { // Edit 80: X grabs, a hold puts down; Y pushes off a car\n"),
        ("      ['PAUSE', ['Esc / P', 'Start', '❚❚'][K3], ''],\n    ];\n",
         "      ['PAUSE', ['Esc / P', 'Start', '❚❚'][K3], ''],\n    ];\n    if (window.P11) rows.splice(2, 3, [s.duelDuck ? 'CROUCH' : '???', ['C / Shift', 'B', 'B'][K3], s.duelDuck ? '' : 'Super Knees fits it', CROUCH.mode === 'hold' ? 'Hold: lower and slower; low cover hides you' : 'Press: crouch or stand'], [nm('jump', 'JUMP'), ['J', 'X', 'X'][K3], lock('jump', 'Legs 1')], [nm('carry', 'INTERACT'), ['E / I', 'Y', 'Y'][K3], lock('carry', 'Hands 1'), 'Tap: pick up a cone. Tap with none in reach: put one down']); // Prototype 11.3: A dash, B crouch, X jump, Y interact\n"),
        ("    if (s.has('jump')) keys.push([pd ? 'B' : 'L', 'JUMP']);\n", "    if (s.has('jump') && !window.P11) keys.push([pd ? 'B' : 'L', 'JUMP']);\n"),
        ("  const PAD_NAME = { a: 'DASH (A)', b: 'JUMP (B)',", "  const PAD_NAME = window.P11 ? { a: 'DASH (A)', b: 'CROUCH (B)', x: 'JUMP (X)', y: 'USE (Y)' } : { a: 'DASH (A)', b: 'JUMP (B)',"),
        ("    txt((ABIL3 ? 'DASH, JUMP, GRAB in turn'", "    txt((window.P11 ? 'DASH, CROUCH, JUMP, USE in turn' : ABIL3 ? 'DASH, JUMP, GRAB in turn'"),
        ("{ FX, FY, FW, FH, VW, VH, RA, U, t: app.realT }); // Submission 7: the lesson (clip, fit, card)", "{ FX, FY, FW, FH, VW, VH, RA, U, t: app.realT, dev: TOUCH.on ? 'touch' : app.device, rm: RM, snd: app.sound ? Snd : null }); if (s.phase === 'lesson') hitbox(FX, FY, FW, FH, 'lesson', () => menuQ.push('ok')); // Submission 7: the lesson. Prototype 11.3: the upgrade screen's device, motion, sound; a tap continues"),
        ("  const controlItems = () => (TOUCH.on ? ['Adjust layout', 'Reset layout', 'Back'] : ['Back']); // Edit 87", "  const controlItems = () => (window.P11 ? ['Crouch: ' + CROUCH.mode] : []).concat(TOUCH.on ? ['Adjust layout', 'Reset layout', 'Back'] : ['Back']); // Edit 87. Prototype 11.4: the crouch mode"),
        ("const it = CI[app.ctlSel || 0]; if (it === 'Adjust layout') touchEditStart();", "const it = CI[app.ctlSel || 0]; if (window.P11 && it.startsWith('Crouch')) { CROUCH.mode = CROUCH.mode === 'toggle' ? 'hold' : 'toggle'; CROUCH.on = false; try { localStorage.setItem('dummies.p11.crouch', CROUCH.mode); } catch (e) { /* storage off: this visit */ } toast('Crouch: ' + CROUCH.mode); } else if (it === 'Adjust layout') touchEditStart();"),
        ("  window.__dummies = app;\n",
         "  window.__dummies = app;\n  window.__dummiesHits = () => HITS.map((h) => ({ x: h.x, y: h.y, w: h.w, h: h.h, tag: h.tag })); // Prototype 11.2: this frame's tap targets, for QA (qa/clicks.js)\n"),
        ("KeyC: 'duck', ControlLeft: 'duck', ControlRight: 'duck', // Submission 7: DUCK\n",
         "KeyC: 'duck', ControlLeft: 'duck', ControlRight: 'duck', KeyR: 'restart', // Submission 7: DUCK. Prototype 11: R restarts the puzzle\n"),
        ("  const SAVE_KEY = 'dummies.p7.story', SLOT_KEY = 'dummies.p7.save', MOVED_KEY = 'dummies.p7.saveMoved', memSlots = {};",
         "  const SAVE_KEY = 'dummies.p11.story', SLOT_KEY = 'dummies.p11.save', MOVED_KEY = 'dummies.p11.saveMoved', memSlots = {}; // Prototype 11: its own save slots"),
        ("new STORY.StorySim(LEVEL_LIST[i], Object.assign({ 'proto.difficulty': app.difficulty }, app.tune, FIELD), app.story)",
         "new STORY.StorySim(LEVEL_LIST[i], Object.assign({ 'proto.difficulty': app.difficulty }, app.tune, FIELD), window.P11 ? window.P11.progressFor(app.story) : app.story)"),
        ("      for (const m of menuQ) if (m === 'pause' && s.phase === 'play') {",
         "      for (const m of menuQ) if (m === 'restart' && s.p11 && s.phase === 'play') s.restart('R'); // Prototype 11: R, any time in play\n"
         "      for (const m of menuQ) if (m === 'pause' && s.phase === 'play') {"),
        ("else if (it === 'ARCADE') { app.mode = 'arcade'; app.screen = 'arcade'; }",
         "else if (it === 'ARCADE') { if (window.P11 && !window.P11.arcadeOpen()) toast('Arcade is locked. Pass Certification, puzzle 9, to open it'); else { app.mode = 'arcade'; app.screen = 'arcade'; } }"),  # Prototype 11: locked until Map 1 is solved (no comment: the line goes on)
        ("      STORY: ['STORY', LT('n03', 'The Test City, tile by tile. Each tile wants its write-offs to Farsight\\'s brief.'), sub] };\n",
         "      STORY: ['STORY', LT('n03', 'The Test City, tile by tile. Each tile wants its write-offs to Farsight\\'s brief.'), sub] };\n"
         "    if (window.P11) window.P11.titleCards(cardOf, pr, last); // Prototype 11: nine puzzles; Arcade locked\n"),
        ("  function renderScreen() {",
         "  const p11G = () => ({ FX, FY, FW, FH, VW, VH, t: app.realT, hit: hitbox, push: (m) => menuQ.push(m), touch: TOUCH.on, pad: app.device === 'pad', U: { rr, txt, panel, wrapText, fitText, FT, C, F_UI, F_BRAND } }); // Prototype 11: the frame's helpers\n"
         "  function renderScreen() {"),
        ("    if (app.screen === 'storymap') { drawStoryMap(); return; }",
         "    if (app.screen === 'storymap') { if (window.P11_UI) { drawField(preview(Math.max(0, LEVEL_LIST.indexOf('monument'))), true); veil(); window.P11_UI.grid(ctx, app, p11G()); } else drawStoryMap(); return; } // Prototype 11: the puzzle grid"),
        ("      if (app.screen === 'storymap') { // Edit 81",
         "      if (app.screen === 'storymap' && window.P11) { const r = window.P11.mapKey(app, m); if (r === 'deploy') { startStory(); return; } if (r === 'back') toSaves(); continue; } // Prototype 11: the puzzle grid\n"
         "      if (app.screen === 'storymap') { // Edit 81"),
        ("    const x = 96 - 60 * (1 - inK), w = Math.min(760, ddx - 40 - 96);",
         "    if (s.p11 && window.P11) ({ head, sub, story, goal, extra } = window.P11.cardText(s)); // Prototype 11: the puzzle's card\n"
         "    const x = 96 - 60 * (1 - inK), w = Math.min(760, ddx - 40 - 96);"),
        ("  const pauseItems = () => (app.mode === 'story' ? PAUSE_STORY : PAUSE_ITEMS);",
         "  const PAUSE_P11 = ['Resume', 'Restart puzzle', 'Puzzle grid', 'Options', 'Controls', 'Show trace', 'Quit to title']; // Prototype 11\n"
         "  const pauseItems = () => (app.mode === 'story' ? (window.P11 ? PAUSE_P11 : PAUSE_STORY) : PAUSE_ITEMS);"),
        ("          else if (item === 'Story map') { toStoryMap(); return; }",
         "          else if (item === 'Story map' || item === 'Puzzle grid') { toStoryMap(); return; }\n"
         "          else if (item === 'Restart puzzle') { app.paused = false; if (s && s.restart) s.restart('pause'); } // Prototype 11"),
        ("    else if (s.phase === 'report') drawReport(s);",
         "    else if (s.phase === 'report') { if (s.p11 && window.P11_UI) window.P11_UI.result(ctx, s, p11G()); else drawReport(s); } // Prototype 11: the stars"),
        ("      if (s.phase === 'report' && m === 'ok') s.continueReport();",
         "      if (s.phase === 'report' && s.p11) { s.resultKey(m, app.realT); continue; } // Prototype 11: Enter on, R again, Shift the grid\n"
         "      if (s.phase === 'report' && m === 'ok') s.continueReport();"),
        ("      if (s.phase === 'next' && app.mode === 'story') { saveStory(); startLevel(LEVEL_LIST.indexOf(app.story.district)); }",
         "      if (s.p11Go) { const go = s.p11Go; s.p11Go = null; saveStory(); if (go === 'map') toStoryMap(); else startStory(); } // Prototype 11: the next puzzle, the same again, or the grid\n"
         "      else if (s.phase === 'next' && app.mode === 'story') { saveStory(); startLevel(LEVEL_LIST.indexOf(app.story.district)); }"),
        # Shipping V1 (11 Nov): a part earned at a clear shows the gift screen; its texts in the P11 pad layout (engine/p11.js P11.giftInfo)
        ("    const tx = dx + DW + 44, tw = x + w - 30 - tx, pd = TOUCH.on || app.device === 'pad', rs = s.rescue;",
         "    const tx = dx + DW + 44, tw = x + w - 30 - tx, pd = TOUCH.on || app.device === 'pad', rs = s.rescue, GI = s.p11 && window.P11 && window.P11.giftInfo ? window.P11.giftInfo(s) : null;"),
        ("txt(nd.name.toUpperCase(), 0, 0, '900 64px ' + F_BRAND, C.dummy);",
         "const NM = (GI ? GI.name : nd.name).toUpperCase(); ctx.font = '900 64px ' + F_BRAND; const NW = ctx.measureText(NM).width, FS = NW > tw ? Math.floor(64 * tw / NW) : 64; txt(NM, 0, 0, '900 ' + FS + 'px ' + F_BRAND, C.dummy);"),  # a long name fits the panel
        ("ctx.strokeStyle = BADGE[tr.button]; ctx.lineWidth = 3; ctx.stroke();", "ctx.strokeStyle = BADGE[GI ? GI.button : tr.button]; ctx.lineWidth = 3; ctx.stroke();"),
        ("txt(tr.button, bx, by + 9, '700 26px ' + F_MONO, FT.text, 'center'); txt(tr.verb, bx + br + 16,",
         "txt(GI ? GI.button : tr.button, bx, by + 9, '700 26px ' + F_MONO, FT.text, 'center'); txt(GI ? GI.verb : tr.verb, bx + br + 16,"),
        ("yy += 30 * wrapText(nd.desc, tx, yy, tw, 30,", "yy += 30 * wrapText(GI ? GI.desc : nd.desc, tx, yy, tw, 30,"),
        ("const ng = s.story ? STORY.nextGift(s.story) : null;", "const ng = GI ? null : s.story ? STORY.nextGift(s.story) : null;"),
        ("      if (ng) { txt(LT('n12', 'NEXT FROM FARSIGHT'),",
         "      if (GI) { txt('NEXT PUZZLE', tx, yy + 26, fLab, FT.accent); wrapText(GI.next || '', tx, yy + 58, tw, 26, '400 19px ' + F_UI, FT.dim, 3); }\n"
         "      else if (ng) { txt(LT('n12', 'NEXT FROM FARSIGHT'),"),
    ], 'game.js (P11)')


def v2_game_js(g):
    """FINAL V2 (GDD Edit 123): the screens after the UI cleanup agent (pipeline/runs/*-cleanup-spec). Puzzle build only."""
    g = g.replace("    txt('SAVED IN THIS BROWSER', x + w - 24, y + 40, '700 15px ' + F_UI, FT.dim, 'right');",
                  "    if (!window.P11) txt('SAVED IN THIS BROWSER', x + w - 24, y + 40, '700 15px ' + F_UI, FT.dim, 'right'); // FINAL V2: not actionable")
    return patch(g, [
        # the top right: time / par and three star pips (the in-field attempt panel is gone)
        ("  function drawScore(s) {",
         "  function v2Star(x, y, R, col) { ctx.beginPath(); for (let i = 0; i < 10; i++) { const r = i % 2 ? R * 0.45 : R, a = -Math.PI / 2 + i * Math.PI / 5; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); }\n"
         "  function v2Score(s) { // FINAL V2 (Edit 123): '3.3 / 10 s' and three pips, dimmed once a star is lost\n"
         "    const p = s.p11, q = p.q, R = VW - 16, under = p.attempt <= q.par, on = [1, p.untouched ? 1 : 0, under ? 1 : 0];\n"
         "    for (let i = 0; i < 3; i++) v2Star(R - 8 - (2 - i) * 20, TOPY - 7, 8, on[i] ? C.dummy : '#5e7080');\n"
         "    txt(p.attempt.toFixed(1) + ' / ' + q.par + ' s', R - 70, TOPY + 1, '700 18px ' + F_MONO, under ? C.dummy : '#9fb8c8', 'right');\n"
         "    if (app.hud) app.hud.score = { x: R - 220, y: 0, w: 220, h: FY - 6, rows: 'TIME PAR STARS' };\n"
         "  }\n"
         "  function drawScore(s) { if (s.p11 && s.p11.q) return v2Score(s);"),
        # keys: fitted parts only; WASD on puzzles 1-2; R restarts (keyboard)
        ("if (s.has('carry')) keys.push([pd ? 'Y' : 'E', b.held ? 'DROP' : 'GRAB']); return keys; }",
         "if (s.has('carry')) keys.push([pd ? 'Y' : 'E', b.held ? 'DROP' : 'GRAB']); if (s.p11 && s.p11.q && !['A1', 'B1'].includes(s.p11.q.tile)) keys.shift(); if (!pd) keys.push(['R', 'RESTART']); return keys; } // FINAL V2"),
        ("      txt(a, X + 14 + kw + 12, ky + kh / 2 + 8, fLab, FT.dim);",
         "      fitText(a, X + 14 + kw + 12, ky + kh / 2 + 8, W - kw - 38, 17, 11, FT.dim); // FINAL V2: CROUCH fits"),
        # left: BODY smaller; no DASH box before Battery 1; the map names the district only
        ("  function drawHUD(s) {\n", "  function drawHUD(s) {\n    if (window.P11) window.P11.device = TOUCH.on ? 'touch' : app.device === 'pad' ? 'pad' : 'kb'; // FINAL V2: texts name the device's keys\n"),
        ("txt(num(hp), X + W - 14, BY + 40, '700 36px ' + F_MONO,", "txt(num(hp), X + W - 14, BY + 40, '700 ' + (s.p11 ? 24 : 36) + 'px ' + F_MONO,"),
        ("    panel(X, DY, W, 86);\n    txt('DASH', TX, DY + 30, fLab, FT.dim);\n    if (s.dashFitted && !s.dashFitted()) {",
         "    const noDash = !!(s.p11 && s.dashFitted && !s.dashFitted()); // FINAL V2: no DASH box before Battery 1\n    if (!noDash) { panel(X, DY, W, 86); txt('DASH', TX, DY + 30, fLab, FT.dim); }\n    if (!noDash && s.dashFitted && !s.dashFitted()) {"),
        ("    if (STORY) { const t = INFO(s.levelId).name.toUpperCase() + ' · ' + s.screenName() + whereOf(s);",
         "    if (STORY) { const t = s.p11 ? INFO(s.levelId).name.toUpperCase() : INFO(s.levelId).name.toUpperCase() + ' · ' + s.screenName() + whereOf(s);"),
        # right: no CHASSIS 01; LAST HIT after the first hit
        ("    txt('CHASSIS ' + String(b.chassis).padStart(2, '0'), X + 14, Y + 30, fLab, FT.dim);",
         "    if (!s.p11) txt('CHASSIS ' + String(b.chassis).padStart(2, '0'), X + 14, Y + 30, fLab, FT.dim);"),
        ("    txt('LAST HIT', X + 14, yHit, STORY ? '700 15px ' + F_UI : fTxt, FT.dim);\n    if (STORY) fitTextR(",
         "    if (!s.p11 || lp) txt('LAST HIT', X + 14, yHit, STORY ? '700 15px ' + F_UI : fTxt, FT.dim);\n    if (s.p11 && !lp) { /* FINAL V2: nothing before the first hit */ } else if (STORY) fitTextR("),
        # the objective: the same in the drop as in play
        ("if (o && !s.rescue) return o; }", "if (o && (!s.rescue || s.p11)) return o; }"),
        # the card: lines of extra; START steady
        ("    if (extra) txt(extra, x + 74, yy + 6, '700 20px ' + F_UI, FT.dim);",
         "    if (extra) (Array.isArray(extra) ? extra : [extra]).forEach((e, i) => txt(e, x + 74, yy + 6 + i * 30, '700 20px ' + F_UI, i === 0 && s.p11 ? C.dummy : FT.dim)); // FINAL V2: NEW, EARN, PAR"),
        ("    if (t > 0.35 && (RM || Math.floor(app.realT * 2) % 2 === 0)) txt(startPrompt('START'),",
         "    if (t > 0.35 && (RM || s.p11 || Math.floor(app.realT * 2) % 2 === 0)) txt(startPrompt('START'),"),
        # the gift: no next line; one form of continue
        ("      if (GI) { txt('NEXT PUZZLE', tx, yy + 26, fLab, FT.accent); wrapText(GI.next || '', tx, yy + 58, tw, 26, '400 19px ' + F_UI, FT.dim, 3); }",
         "      if (GI) { if (GI.next) { txt('NEXT PUZZLE', tx, yy + 26, fLab, FT.accent); wrapText(GI.next, tx, yy + 58, tw, 26, '400 19px ' + F_UI, FT.dim, 3); } }"),
        ("txt((TOUCH.on ? 'TAP · ' : pd ? 'A  ' : 'SPACE  ') + (rs && rs.ferry", "txt((TOUCH.on ? 'TAP · ' : pd ? 'A · ' : 'SPACE · ') + (rs && rs.ferry"),
        # pause, controls: no debug
        ("'Options', 'Controls', 'Show trace', 'Quit to title']; // Prototype 11\n", "'Options', 'Controls', 'Quit to title']; // Prototype 11. FINAL V2: no trace\n"),
        ("  function appStatus() { return BUILD + ' · ' + (app.tuned ? 'TUNED RUN' : 'registry values'); }",
         "  function appStatus() { return window.P11 ? BUILD : BUILD + ' · ' + (app.tuned ? 'TUNED RUN' : 'registry values'); }"),
        ("    if (d === 'keys') rows.push(['TUNING', 'T', ''], ['GAMEPAD SETUP', 'G', '']);",
         "    if (window.P11) { for (let i = rows.length - 1; i >= 0; i--) if (rows[i][0] === '???') rows.splice(i, 1); if (d === 'keys') rows.push(['RESTART', 'R', ''], ['GAMEPAD SETUP', 'G', '']); } // FINAL V2: fitted keys only\n"
         "    else if (d === 'keys') rows.push(['TUNING', 'T', ''], ['GAMEPAD SETUP', 'G', '']);"),
        # menus
        ("'Monument A1 · into slot ' + (free + 1)", "(window.P11 ? 'SLOT ' : 'Monument A1 · into slot ') + (free + 1)"),
        ("        wrapText('No story saved here.',", "        if (!window.P11) wrapText('No story saved here.',"),
        ("const sub = !last ? slotCount() + ' save slots · a new game begins in Monument A1'", "const sub = !last ? (window.P11 ? '' : slotCount() + ' save slots · a new game begins in Monument A1')"),
        # the dummy's facing arrow: yellow (white is the forward camera's)
        ("    for (const [x, y] of pts) FB.put(x, y, K.nose);\n", "    for (const [x, y] of pts) FB.put(x, y, s.p11 ? V2_NOSE : K.nose); // FINAL V2: yellow\n"),
        ("  function drawNose(s) {\n", "  const V2_NOSE = PIX.c32('#ffd400');\n  function drawNose(s) {\n"),
        # review r2 (R4): no charge ring or reach tick round the dummy (the DASH box and the dash guide carry it)
        ("    } else {\n      const e = reachEnd(s), nx = -Math.sin(b.facing), ny = Math.cos(b.facing);", "    } else if (!s.p11) {\n      const e = reachEnd(s), nx = -Math.sin(b.facing), ny = Math.cos(b.facing);"),
        ("    const cap = P['battery.capacity'], seg = TAU / cap, gap = 0.28;\n    for (const [x, y, a] of PIX.circle(10)) {", "    const cap = P['battery.capacity'], seg = TAU / cap, gap = 0.28;\n    if (!s.p11) for (const [x, y, a] of PIX.circle(10)) {"),
        # (R2) no honk '!' on the plate: '!' means seen; (R13) no plate on a ghost
        ("      if (Math.floor(app.realT * 5) % 2 === 0) {\n        FB.rect(rx, y0, rx + 4, y0 + h - 1, K.tagBorder);", "      if (!s.p11 && Math.floor(app.realT * 5) % 2 === 0) {\n        FB.rect(rx, y0, rx + 4, y0 + h - 1, K.tagBorder);"),
        ("  function drawTag(s, c) {\n", "  function drawTag(s, c) {\n    if (s.p11 && (!c.red || c.ghost || c.gone)) return; // FINAL V2: one plate, the learner's\n"),
        # (R8) the cue key teaches the one grammar
        ("  function drawCueKey(x, y, w, h) {\n    panel(x, y, w, h);\n",
         "  function v2CueKey(x, y, w, h) { // FINAL V2 (Edit 123): being seen, one grammar\n"
         "    txt('BEING SEEN', x + 22, y + 40, fLab, FT.accent); const ox = x + 60, cols = [['#f4f8fa', 'FORWARD CAMERA'], ['#7fa8bc', 'SIDE SENSORS'], ['#c3a6ff', 'ROOF LIDAR'], ['#9ff2c8', 'STREET CAMERA'], ['#ff8a1f', 'ROAD ITEMS'], ['#ff5a5a', 'MEMORY · SEARCH']];\n"
         "    let yy = y + 82; ctx.save(); ctx.lineWidth = 2.5; ctx.strokeStyle = '#7fa8bc'; ctx.beginPath(); ctx.arc(ox, yy - 6, 13, -Math.PI / 2, Math.PI * 0.8); ctx.stroke(); txt('SENSING YOU', x + 116, yy, fLab, FT.text);\n"
         "    yy += 48; for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { ctx.beginPath(); ctx.moveTo(ox + sx * 14, yy - 6 + sy * 8); ctx.lineTo(ox + sx * 14, yy - 6 + sy * 14); ctx.lineTo(ox + sx * 8, yy - 6 + sy * 14); ctx.stroke(); } txt('SEEN', x + 116, yy, fLab, FT.text);\n"
         "    yy += 48; txt('?', ox, yy + 2, '900 26px ' + F_BRAND, '#f4f8fa', 'center'); txt('ON THE CAR · SENSING', x + 116, yy, fLab, FT.text);\n"
         "    yy += 48; txt('!', ox, yy + 2, '900 26px ' + F_BRAND, '#f4f8fa', 'center'); txt('ON THE CAR · SEEN', x + 116, yy, fLab, FT.text);\n"
         "    yy += 44; txt('THE COLOUR · WHICH SENSOR', x + 22, yy, fLab, FT.dim); yy += 10;\n"
         "    cols.forEach(([c, n], i) => { const cx = x + 22 + (i % 2) * Math.floor((w - 44) / 2), cy = yy + Math.floor(i / 2) * 30; ctx.fillStyle = c; ctx.fillRect(cx, cy + 8, 16, 10); txt(n, cx + 26, cy + 19, '700 14px ' + F_UI, FT.text); });\n"
         "    ctx.restore();\n  }\n"
         "  function drawCueKey(x, y, w, h) {\n    panel(x, y, w, h);\n    if (window.P11) return v2CueKey(x, y, w, h);\n"),
        # (R6) one prompt form; the gift's prompt steady
        ("    if (t > 0.35 && (RM || s.p11 || Math.floor(app.realT * 2) % 2 === 0)) txt(startPrompt('START'),", "    if (t > 0.35 && (RM || s.p11 || Math.floor(app.realT * 2) % 2 === 0)) txt(s.p11 ? startPrompt('START').replace(/\\s{2,}/, ' · ') : startPrompt('START'),"),
        (": startPrompt('START'), VW - 60, VH - 48, '900 28px ' + F_BRAND, C.dummy, 'right');", ": startPrompt('START'), VW - 60, VH - 48, '900 28px ' + F_BRAND, s.p11 ? FT.accent : C.dummy, 'right');"),
        ("    if (giftReady() && Math.floor(app.realT * 2.5) % 3)", "    if (giftReady() && (s.p11 || Math.floor(app.realT * 2.5) % 3))"),
        # (R11) the gift's key: a chip when it is a word (SPACE)
        ("txt(GI ? GI.button : tr.button, bx, by + 9, '700 26px ' + F_MONO, FT.text, 'center'); txt(GI ? GI.verb : tr.verb, bx + br + 16,",
         "if (GI && String(GI.button).length > 1) { ctx.font = '700 22px ' + F_MONO; const kw2 = ctx.measureText(GI.button).width + 24; rr(tx, by - 20, kw2, 40, 8); ctx.fillStyle = FT.keyTop; ctx.fill(); ctx.strokeStyle = C.dummy; ctx.lineWidth = 3; ctx.stroke(); txt(GI.button, tx + kw2 / 2, by + 8, '700 22px ' + F_MONO, FT.text, 'center'); txt(GI.verb, tx + kw2 + 16, by + 12, '900 34px ' + F_BRAND, FT.text); } else { txt(GI ? GI.button : tr.button, bx, by + 9, '700 26px ' + F_MONO, FT.text, 'center'); } if (!(GI && String(GI.button).length > 1)) txt(GI ? GI.verb : tr.verb, bx + br + 16,"),
        ("ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fillStyle = FT.keyTop; ctx.fill(); ctx.strokeStyle = BADGE[GI ? GI.button : tr.button]; ctx.lineWidth = 3; ctx.stroke();",
         "if (!(GI && String(GI.button).length > 1)) { ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fillStyle = FT.keyTop; ctx.fill(); ctx.strokeStyle = BADGE[GI ? GI.button : tr.button] || C.dummy; ctx.lineWidth = 3; ctx.stroke(); }"),
        # (R9) the crouch option once Super Knees is fitted; (R10) no build tag, no time under the pause's volume
        ("  const controlItems = () => (window.P11 ? ['Crouch: ' + CROUCH.mode] : [])", "  const controlItems = () => (window.P11 && app.sim && app.sim.duelDuck ? ['Crouch: ' + CROUCH.mode] : [])"),
        ("  function appStatus() { return window.P11 ? BUILD :", "  function appStatus() { return window.P11 ? '' :"),
        ("  function drawScore(s) { if (s.p11 && s.p11.q) return v2Score(s);", "  function drawScore(s) { if (s.p11 && s.p11.q) return app.paused ? null : v2Score(s);"),
        # the panel helper, for the duel layer's car block
        ("  window.__dummies = app;\n", "  window.__dummies = app;\n  window.__dummiesPanel = (x, y, w, h) => panel(x, y, w, h); // FINAL V2: the car block in the right column\n"),
    ], 'game.js (V2)')


def v21_game_js(g):
    """FINAL V2.1 (GDD Edit 124): Lawrence's playtest of FINAL V2 (11-12 Nov). Puzzle build only."""
    return patch(g, [
        # no headlight beams on any car: they clash with the sensors' fields (brake glow stays)
        ("if (!(c.red && window.P11)) PIX.fillPoly(left.concat(right.reverse()), (x, y) => {", "if (!window.P11) PIX.fillPoly(left.concat(right.reverse()), (x, y) => {"),
        # crouched, the dummy is drawn crouched (legs folded), and the touch B button reads STAND
        ("  function drawBodySprite(s, ghostOnly, liftPx) {\n",
         "  const V21_CROUCH = new WeakMap(); // FINAL V2.1 (Edit 124): legs folded to 40%, the rest kept; anchored at the feet\n"
         "  function v21Crouch(S, on) {\n"
         "    if (!on || !S) return S; let C = V21_CROUCH.get(S); if (C) return C;\n"
         "    const neck = Math.round(S.h * 0.38), hip = Math.round(S.h * 0.62), tK = Math.max(2, Math.round((hip - neck) * 0.7)), lK = Math.max(2, Math.round((S.h - hip) * 0.3)), h = neck + tK + lK, W = S.w + 2;\n"
         "    C = { w: W, h, d: new Uint32Array(W * h), ox: S.ox + 1, oy: S.oy - (S.h - h) };\n"
         "    for (let y = 0; y < h; y++) { const sy = y < neck ? y : y < neck + tK ? neck + Math.floor((y - neck) * (hip - neck) / tK) : Math.min(S.h - 1, hip + Math.floor((y - neck - tK) * (S.h - hip) / lK));\n"
         "      for (let x = 0; x < S.w; x++) { const v = S.d[sy * S.w + x]; if (!v) continue; const o = y >= neck + tK ? (x < S.w / 2 ? -1 : 1) : 0; C.d[y * W + x + 1 + o] = v; if (o) C.d[y * W + x + 1] = C.d[y * W + x + 1] || v; } } // knees out\n"
         "    V21_CROUCH.set(S, C); return C;\n  }\n"
         "  function drawBodySprite(s, ghostOnly, liftPx) {\n"),
        ("    const S = PIX.dummy(b.facing, Math.min(5, Math.round(wear * 5)));\n", "    const S = v21Crouch(PIX.dummy(b.facing, Math.min(5, Math.round(wear * 5))), !!(window.P11 && b.duck));\n"),
        ("    if (f.id === (window.P11 ? 'y' : 'x')) { const b = s.body, room", "    if (window.P11 && f.id === 'b' && s.body && s.body.duck) return { word: 'STAND', live: true }; // FINAL V2.1: the crouch's other press\n    if (f.id === (window.P11 ? 'y' : 'x')) { const b = s.body, room"),
        # smaller touch keys by default (the pencil still resizes them)
        ("pv('ui.touch.faceRadius') * css * 1.15", "pv('ui.touch.faceRadius') * css * (window.P11 ? 0.8 : 1.15)"),
        ("pv('ui.touch.stickRadius') * css * 1.15", "pv('ui.touch.stickRadius') * css * (window.P11 ? 0.9 : 1.15)"),
        # a hit by the learner: a bigger kick, a white flash, parts flying, a ring
        ("    const b = s.body;\n    for (const pt of spec.particles || []) {",
         "    const b = s.body;\n"
         "    if (window.P11 && e.type === 'impact' && e.red) { kick(16, 0.6); fx.flash = { t0: app.realT, dur: 0.24 }; fx.flinchT0 = app.realT; // FINAL V2.1 (Edit 124): juice\n"
         "      puff(b.x, b.y, 14, { type: 'debris', speed: 170, life: 0.9, size: 4, role: 'primary' }); puff(b.x, b.y, 20, { type: 'spark', speed: 240, life: 0.45, size: 2, role: 'primary' }); puff(b.x, b.y, 2, { type: 'ring', speed: 280, life: 0.35, size: 3, role: 'primary' }); }\n"
         "    for (const pt of spec.particles || []) {"),
        # the crash chalk: in the ground's pixels, under buildings and decks
        ("  function drawBodyGround(s, lift) {\n",
         "  const V21_CHALK = new Map(); // FINAL V2.1 (Edit 124): each crash a chalk outline of a lying dummy, painted on the ground\n"
         "  function v21Chalk(s) {\n"
         "    const T = s.duelT; if (!T || !T.crashes || !T.crashes.length || s.sc !== T.duelSc) return; const mem = T.memory ? T.memory() : [];\n"
         "    for (const cr of T.crashes) { const key = cr.n % 2; let pts = V21_CHALK.get(key);\n"
         "      if (!pts) { const S = PIX.dummy(key ? 0 : Math.PI, 0), at = (x, y) => x >= 0 && y >= 0 && x < S.w && y < S.h && S.d[y * S.w + x] !== 0; pts = [];\n"
         "        for (let y = 0; y < S.h; y++) for (let x = 0; x < S.w; x++) if (at(x, y) && (!at(x - 1, y) || !at(x + 1, y) || !at(x, y - 1) || !at(x, y + 1))) pts.push([(y - Math.round(S.h / 2)) * (key ? 1 : -1), x - Math.round(S.w / 2)]); // turned a quarter: lying down\n"
         "        V21_CHALK.set(key, pts); }\n"
         "      const cx = Math.round(cr.x / U), cy = Math.round(cr.y / U), a = T.rung >= 6 && !mem.includes(cr) ? 0.28 : 0.55; for (const [x, y] of pts) FB.mix(cx + x, cy + y, K.white, a); }\n"
         "  }\n"
         "  function drawBodyGround(s, lift) {\n"),
        ("    if (e0.type === 'impact') x.big = (e0.assessed || 0) >= (pv('proto.hits.big.assessedMin') || 200);", "    if (e0.type === 'impact') x.big = (window.P11 && e0.red) || (e0.assessed || 0) >= (pv('proto.hits.big.assessedMin') || 200); // FINAL V2.1: every hit by the learner sounds big"),
        # the save screen: STORY / STORY MODE; a slot on one line (map · puzzle · stars); no touch hint
        ("app.screen === 'saves' ? 'STORY · SAVE GAMES' :", "app.screen === 'saves' ? (window.P11 ? 'STORY' : 'STORY · SAVE GAMES') :"),
        ("    txt('SAVE GAMES', x + 24, y + 40, fLab, FT.accent);", "    txt(window.P11 ? 'STORY MODE' : 'SAVE GAMES', x + 24, y + 40, fLab, FT.accent);"),
        ("    txt(TOUCH.on ? 'TAP A SLOT, THEN WHAT TO DO · B BACK' :", "    if (!(window.P11 && TOUCH.on)) txt(TOUCH.on ? 'TAP A SLOT, THEN WHAT TO DO · B BACK' :"),
        ("  function slotLines(v) {\n", "  function slotLines(v) {\n    if (window.P11 && window.P11.slotLine) return [window.P11.slotLine(v.progress), ''];\n"),
        # the grid: a solved puzzle's tile, drawn small (built one a frame, kept)
        ("  const p11G = () => ({", "  const V21_THUMB = new Map(); let v21Built = -1;\n"
         "  function v21Thumb(dist, t) { const key = dist + t; if (V21_THUMB.has(key)) return V21_THUMB.get(key); if (!W6 || v21Built === app.realT) return null; v21Built = app.realT;\n"
         "    const D = W6.DISTRICTS.find((q) => q.id === dist); if (!D) return null; const sc = W6.buildScreen(D, 'ABC'.indexOf(t[0]), +t[1] - 1), B = new PIX.Buf(AW, AH), D2 = new PIX.Buf(AW, AH); D2.layer = true; W6.compose(sc, B, D2, {});\n"
         "    const c2 = document.createElement('canvas'); c2.width = AW; c2.height = AH; const g2 = c2.getContext('2d'), id = g2.createImageData(AW, AH); new Uint32Array(id.data.buffer).set(B.d); g2.putImageData(id, 0, 0); V21_THUMB.set(key, c2); return c2; }\n"
         "  const p11G = () => ({ thumb: v21Thumb,"),
        ("      under: () => { drawMarks(); if (lvl === 0) {", "      under: () => { drawMarks(); if (window.P11 && lvl === 0) v21Chalk(s); if (lvl === 0) {"),
        # the body's number after the clear: what is left of it, not 0
        ("    const b = s.body, P = s.P, hp = b.alive ? (", "    const b = s.body, P = s.P, hp = b.alive || (window.P11 && s.p11 && s.p11.result) ? ("),
    ], 'game.js (V2.1)')


def p11_plan(pz):
    """content/puzzles_map1.json as the duel's plan (window.STORY_MAP1): one tile a puzzle, its rungs and lane as params."""
    tiles = []
    for q in pz['puzzles']:
        params = {'duel.startRung': q['startRung'], 'duel.topRung': q['topRung'], 'perception.streetCameraOccluded': 1, 'movement.duckSpeedFactor': 0.6}  # FINAL V2.1 (Edit 124): cameras see no further than the world lets them; crouch walks at 60%
        if q.get('route') is not None:
            params['duel.route'] = q['route']
        if q.get('senior') is not None:  # FINAL V2.1 (Edit 125): Map 2's certified Luminary on a lane
            params['duel.senior'] = q['senior']['lane']
            params.update({'duel.' + k: v for k, v in q['senior'].items() if k != 'lane'})
        params.update(q.get('params', {}))
        tiles.append({'n': q['n'], 'tile': q['tile'], 'title': q['name'], 'stage': q['stage'], 'earns': q.get('earns'), 'level': q['level'], 'newIdea': q['new'],
                      'objective': q['objective'], 'params': params, 'tale': q['tale'], 'hint': q['hints'][0], 'layout': q.get('layout')})
    return {'map': pz['map'], 'tiles': tiles, 'district': pz['map'].get('district', pz['map'].get('id', 'monument')), 'provenance': {'run': 'content/puzzles_map1.json (set by hand, Edit 113)'}}


def world6_js(v2=False):
    w = (E / 'world6.js').read_text(encoding='utf-8')
    if v2:  # FINAL V2 (Edit 123, the UI cleanup agent): the stair aprons' marks are wayfinding, not signals: no cyan boxes, faint chevrons
        w = patch(w, [("x1 = Math.round((a.x + a.w) / U) - 1, y1 = Math.round((a.y + a.h) / U) - 1, br = mixK(CON.l, N.cyan, 0.55);",
                       "x1 = Math.round((a.x + a.w) / U) - 1, y1 = Math.round((a.y + a.h) / U) - 1, br = null, chev = mixK(CON.m, CON.l, 0.6);"),
                      ("for (let i = 0; i < 4; i++) { B.put(cx + sx * i, cy, br); B.put(cx, cy + sy * i, br); }", "if (br) for (let i = 0; i < 4; i++) { B.put(cx + sx * i, cy, br); B.put(cx, cy + sy * i, br); }"),
                      ("for (const t of [0.33, 0.66]) { const tip", "for (const t of [0.5]) { const tip"),
                      ("if (ay) B.put(la, al, N.cyan); else B.put(al, la, N.cyan); } }", "if (ay) B.put(la, al, chev); else B.put(al, la, chev); } }")], 'world6.js (V2)')
        # FINAL V2.1 (Edit 124, playtest): the gateway's words read left to right, one a row, stacked down a wider beam
        w = patch(w, [("yB = Math.round(bot / U), BW = 10, PW = 8;", "yB = Math.round(bot / U), BW = 14, PW = 8;"),
                      ("L.put(X0 + i, y, edge ? K.bldgOutline : rail ? (y % 2 ? N.cyan : K.white) : Math.abs(i) <= 4 ? c32('#0A0F1E')", "L.put(X0 + i, y, edge ? K.bldgOutline : rail ? (y % 2 ? N.cyan : K.white) : Math.abs(i) <= BW - 2 && Math.abs(y - (Math.round((yT + yB) / 2) - Hh)) <= 18 ? c32('#0A0F1E')"),
                      ("    vtext(t1, mid - len(t1) - 3, K.white); vtext(t2, mid + 4, N.cyan);",
                       "    void vtext; void t1; void t2; void len; let wy = mid - 16; for (const [wd, c] of [['THANK', K.white], ['YOU', K.white], ['DRIVE', N.cyan], ['SAFE', N.cyan]]) { PIX.smallText(L, wd, X0 - Math.floor(PIX.smallWidth(wd) / 2), wy, c); wy += PIX.SMALL_H + 1 + (wd === 'YOU' ? 3 : 0); }"),
                      # a walk through a parapet gap needs a push held 0.35 s (world.gapDropHold, proposed): no drop by brushing past; a dash or a jump goes at once
                      ("      if (f.has(b.x, b.y)) return;\n      const block = () =>", "      if (f.has(b.x, b.y)) { b.gapT = 0; return; }\n      const block = () =>"),
                      ("      else if (f.drop || (f.dropAt && f.dropAt(b.x, b.y)) ||", "      else if (f.drop || (f.dropAt && f.dropAt(b.x, b.y) && this.gapCommit(b, f)) ||"),
                      ("    floorMove() {", "    gapCommit(b, f) { // FINAL V2.1 (Edit 124): straight out through a deck's gap drops at once; brushing along the parapet needs the push held 0.35 s\n"
                       "      if (b.mode === 'lunge' || b.mode === 'jump' || !globalThis.P11) return true; const dk = f && f.layer && f.layer.dk, vx = b.x - b.px, vy = b.y - b.py, v = Math.hypot(vx, vy);\n"
                       "      if (dk && v > 1e-6 && Math.abs(dk.hz ? vy : vx) / v >= 0.6) return true; b.gapT = (b.gapT || 0) + 1 / (this.P['simulation.tickRate'] || 60); return b.gapT >= 0.35; }\n    floorMove() {")], 'world6.js (V2.1)')
    return patch(w, [
        ("  const api = { P6SIM, DISTRICTS,",
         "  // Submission 7: the duel's low planters and street-camera posts, painted into the tile's ground art as Prototype 9 paints its own\n"
         "  function paintPlanter(sc, r) {\n"
         "    const fp = chamf(Math.round(r.x / U), Math.round(r.y / U), Math.round((r.x + r.w) / U) - 1, Math.round((r.y + r.h) / U) - 1, 2), keep = CAP; CAP = null;\n"
         "    mass(sc.B, fp, r.x / U, r.y / U, (r.x + r.w) / U - 1, (r.y + r.h) / U - 1, 0, 3, 'conc', LEDS[1], true); mass(sc.B, (px, py, k) => fp(px, py, (k || 0) + 2), r.x / U, r.y / U, (r.x + r.w) / U - 1, (r.y + r.h) / U - 1, 3, 4, 'hedge', null, false, 'hedge');\n"
         "    CAP = keep;\n"
         "  }\n"
         "  function paintPost(sc, x, y) { const keep = CAP; CAP = null; bollard(sc.B, x / U, y / U, LEDS[2 % LEDS.length]); CAP = keep; }\n"
         "  // Submission 7 (Lawrence, 7 Nov): the roadside cover family, in the same kit: masses, hedges, lit faces, boards on legs\n"
         "  function paintCover(sc, r) {\n"
         "    if (r.kind === 'planter') return paintPlanter(sc, r);\n"
         "    const keep = CAP; CAP = null; const B = sc.B, x0 = Math.round(r.x / U), y0 = Math.round(r.y / U), x1 = Math.round((r.x + r.w) / U) - 1, y1 = Math.round((r.y + r.h) / U) - 1, led = LEDS[(x0 + y0) % LEDS.length];\n"
         "    if (r.kind === 'hedge') mass(B, chamf(x0, y0, x1, y1, 1), x0, y0, x1, y1, 0, 7, 'hedge', null, true, 'hedge');\n"
         "    else if (r.kind === 'cabinet') { block(B, x0, y0, x1, y1, 1, 0, 14, 'conc', null, true); for (let t = 2; t < 13; t++) B.put(Math.round((x0 + x1) / 2), y1 - t, CON.d); for (let x = x0 + 1; x < x1; x++) B.put(x, y0 - 14, led); } // a signal cabinet: two doors, a lit lid\n"
         "    else if (r.kind === 'kiosk') { block(B, x0, y0, x1, y1, 1, 0, 20, 'conc', null, true); for (let t = 4; t < 18; t++) for (let x = x0 + 1; x < x1; x++) B.put(x, y1 - t, t === 4 || t === 17 || x === x0 + 1 || x === x1 - 1 ? K.bldgOutline : mixK(led, K.white, (x + t) % 5 === 0 ? 0.5 : 0.12)); } // a digital kiosk: a lit screen on its road face\n"
         "    else if (r.kind === 'billboard') billboard(B, (x0 + x1) / 2, y1, Math.max(8, x1 - x0), 12, 8, led); // a lit board on legs\n"
         "    else if (r.kind === 'bollard') block(B, x0, y0, x1, y1, 1, 0, 5, 'conc', led, true); // a concrete bollard, lit cap\n"
         "    else if (r.kind === 'krail') { block(B, x0, y0, x1, y1, 1, 0, 6, 'conc', null, true); for (let x = x0 + 1; x < x1; x++) if (Math.floor(x / 3) % 2 === 0) B.put(x, y1 - 3, led); } // a K-rail: low concrete, a lit stripe\n"
         "    CAP = keep;\n"
         "  }\n"
         "  const api = { paintPlanter, paintPost, paintCover, artUnit: U, P6SIM, DISTRICTS,"),
    ], 'world6.js')


RULES = json.loads((ROOT / 'engine' / 'progression.json').read_text(encoding='utf-8'))  # car, player and level: one thing a tile


def story_json(plan, gifts=True, more=()):
    d = json.loads((E / 'story_v2.json').read_text(encoding='utf-8'))
    for pl in more:  # FINAL V2.1 (Edit 125): Map 2 and on, puzzles only
        dist = next(x for x in d['districts'] if x['id'] == pl['district'])
        dist['order'] = [t['tile'] for t in pl['tiles']]
        for t in pl['tiles']:
            o = dist['tiles'][t['tile']]; ob = t['objective']
            o.update({'title': t['title'], 'tale': t['tale'], 'stage': t['stage'], 'newIdea': t.get('newIdea', ''), 'hint': t.get('hint', ''), 'gift': None,
                      'task': {'kind': 'red', 'label': ob['label'], 'brief': t.get('hint', ''), 'count': ob['count'], 'objective': ob['kind']}})
        if pl.get('map', {}).get('intro'):
            dist['intro'] = pl['map']['intro']
    mon = next(x for x in d['districts'] if x['id'] == 'monument')
    if not gifts:  # Prototype 11: the puzzles' own order (Edit 115)
        mon['order'] = [t['tile'] for t in plan['tiles']]
    assert mon['order'] == [t['tile'] for t in plan['tiles']], 'Map 1 tile order differs from the plan'
    for t in plan['tiles']:
        tile, o = mon['tiles'][t['tile']], t['objective']
        what = {'hits': f'{o["count"]} damaging hit{"s" if o["count"] != 1 else ""} by the red car', 'stealth': f'{o["count"]} stealth points from the red car', 'incidents': f'{o["count"]} Incidents'}[o['kind']]
        tile.update({'title': t['title'], 'tale': t['tale'], 'stage': t['stage'], 'newIdea': t.get('newIdea', ''), 'hint': t.get('hint', ''),
                     'task': {'kind': 'red', 'label': o['label'], 'brief': f'{what}. {t.get("hint", "")}'.strip(), 'count': o['count'], 'objective': o['kind']}})
    if not gifts:  # Prototype 11: each puzzle sets its kit; no drone gifts
        for t in plan['tiles']:
            mon['tiles'][t['tile']]['gift'] = None
    elif any(t.get('earns') for t in plan['tiles']):  # Lawrence (7 Nov): a part earned at a tile's clear rides in on the drone to the next tile
        parts = RULES['parts']
        for t in plan['tiles']:
            mon['tiles'][t['tile']]['gift'] = None
        for a, b in zip(plan['tiles'], plan['tiles'][1:]):
            node = (parts.get(a.get('earns')) or {}).get('p9')
            if node:
                mon['tiles'][b['tile']]['gift'] = {'node': node}
    if plan.get('map', {}).get('intro'):
        mon['intro'] = plan['map']['intro']
    return d


def main(p11=False):
    pz = json.loads((ROOT / 'content' / 'puzzles_map1.json').read_text(encoding='utf-8')) if p11 else None
    plan = p11_plan(pz) if p11 else json.loads((ROOT / 'content' / 'story_map1.json').read_text(encoding='utf-8'))
    pz2 = json.loads((ROOT / 'content' / 'puzzles_map2.json').read_text(encoding='utf-8')) if p11 else None  # FINAL V2.1 (Edit 125): Map 2, Parkland
    plan2 = p11_plan(pz2) if p11 else None
    more = [plan2] if p11 else []
    rules = dict(RULES, levels=dict(RULES['levels'], **pz.get('levels', {}))) if p11 else RULES  # Prototype 11's own level profiles (the boss)
    if p11:  # Prototype 11.3 (Edit 119): the parts in the P11 pad layout (A dash, B crouch, X jump, Y interact); Submission 7 keeps its own
        P11_PARTS = {'battery1': dict(key='A (keys: Space)', text="Dash: A (keys: Space). Reach a car's path from cover set back from the road."),
                     'legs1': dict(key='X (keys: J)', text='Jump: X (keys: J). A running jump clears a K-rail.'),
                     'knees1': dict(verb='CROUCH', key='B (keys: C)', text='Crouch: B (keys: C). Press to crouch, again to stand. Low cover hides you from its sensors.'),
                     'hands1': dict(key='Y (keys: E)', text='Cones: Y picks one up. Y with none in reach puts one down.')}
        for k, t in {'battery1': '{A} dashes. Reach the road from far cover.', 'hands1': '{Y} picks up a cone. {Y} again puts it down.', 'knees1': 'Press again to stand. Low cover hides you.', 'legs1': '{X} jumps. A running jump clears a K-rail.'}.items():
            P11_PARTS[k] = dict(P11_PARTS.get(k, {}), v2=t)  # FINAL V2: the gift screen's words, keys of the device in use
        rules = dict(rules, parts={k: dict(v, **P11_PARTS.get(k, {})) for k, v in RULES['parts'].items()})
    stages = json.loads((V / 'sim_flags.json').read_text(encoding='utf-8'))['stages']
    reg = json.loads((ROOT / 'pipeline' / 'inputs' / 'tuning.parameters.json').read_text(encoding='utf-8'))
    byid = {e['id']: e for e in reg['entries']}
    cues = json.loads((E / 'cues.json').read_text(encoding='utf-8'))
    if p11:
        cues['base'] = '../audio/'  # p11/index.html: the shared audio folder
    cues['params']['audio.settings.master'] = 5  # Lawrence (7 Nov): the volume starts at 5 of 10 (a saved setting still wins)
    js = lambda p: f'<script>\n{p.read_text(encoding="utf-8")}\n</script>\n'
    scripts = js(E / 'jump.js') + ''.join(js(E / f) for f in ('sim.js', 'pixel.js', 'lab.js', 'circus_valley.js'))
    scripts += f'<script>\n{world6_js(p11)}\n</script>\n' + js(E / 'content.js')
    scripts += f'<script>\nwindow.FLEET_DB = {(E / "fleet.json").read_text(encoding="utf-8")};\n</script>\n'
    scripts += f'<script>\nwindow.DUMMIES_STORY = {json.dumps(story_json(plan, not p11, more), ensure_ascii=False)}; // story_v2.json; Map 1 from content/story_map1.json\n</script>\n'
    scripts += js(E / 'lore.js')
    cr = cues['credits']
    credit = ['Music by ' + cr['music'].replace(' on itch.io', ''), 'Sound effects by ' + cr['sfx'].replace(' on itch.io', '')]
    scripts += (f"<script>\nwindow.DUMMIES_LORE.build = '{'FINAL V2 · PUZZLES' if p11 else 'P9 × P10'}';\n"
                + ("window.DUMMIES_LORE.notices.n36 = 'Self-driving cars never hit anyone. Your job: get hit.';\n" if p11 else '')
                + f"window.DUMMIES_CREDITS.lines = window.DUMMIES_CREDITS.lines.concat({json.dumps(credit, ensure_ascii=False)});\n</script>\n")
    # Prototype 9's values (prototypes/p9/build.py, Edits 97-100), then the integration's
    sim = dict({'arcade.grades': 1, 'ui.introScreen': 1, 'ui.levelCard': 1, 'world.droneDropIn': 1, 'ui.storySplash': 1},
               **{k: byid[k]['default'] for k in ('arcade.grade.healthStep', 'arcade.grade.densityStep', 'arcade.grade.max', 'highscore.tableSize', 'ui.intro.loopSeconds', 'ui.splash.cycleSeconds')})
    sim.update({'proto.driver.coneSteepPass': 1, 'proto.art.beamStraight': 1, 'proto.art.brakeGlowStopped': 1, 'proto.art.spentGrey': 1, 'ui.cueKey.simple': 1, 'ui.layerEdgeFix': 1,
                'proto.art.noticeFlashHz': 4, 'proto.droneConeSeconds': 0, 'proto.stopCue': 0})
    sim.update({'audio.enabled': 1, 'story.coneBaitSeconds': 6, 'story.floorHold': 1, 'ui.hud.bodyCeil': 1, 'ui.spentTick': 1, 'proto.contactGraceSeconds': 0.3, 'proto.driver.dodgeFollowsCone': 1, 'ui.lampsOnCar': 1, 'ui.pause.quiet': 1, 'proto.droneConeSeconds': 5, 'ui.conesXray': 1,
                'arcade.modes': 1, 'arcade.trial.writeOffs': 10, 'arcade.endless.gradeWriteOffs': 3, 'ui.exploreArrows': 1, 'ui.coreOnChest': 1,
                'economy.price.ability.level1': 2, 'economy.price.ability.level2': 4, 'economy.price.ability.level3': 6, 'economy.price.ability.level4': 8})
    # Submission 7: white cars never learn (D101); the tile in test runs a lighter fleet until 10.9, where traffic is the lesson
    sim['proto.learningEnabled'] = 0; sim['proto.learn.standoffEnabled'] = 0
    for k in ('movement.walkSpeed', 'movement.runSpeed'):  # Lawrence (7 Nov): 70%, so the dummy cannot run alongside a car and chase it down
        sim[k] = round(byid[k]['default'] * 0.7, 1)
    for t in plan['tiles']:
        sim[f'story.traffic.monument.{t["tile"]}'] = 1.0 if int(t['stage'].split('.')[1]) >= 9 else 0.5
    if p11:  # FINAL V2.1 (Edit 124, playtest): damage stays for the puzzle; worn legs slow a walk a little, never the dash; crouch walks at 60%; a longer hit-stop
        sim.update({'proto.parts.legSpeedFloor': 0.8, 'proto.parts.legDashLoss': 0, 'proto.parts.torsoTurnFloor': 0.8, 'feedback.hitStop': 0.14})
    if p11:  # Prototype 11: the puzzle's fleet; 0 keeps the tile clear (engine/p11.js removes white ground cars)
        for z in (pz, pz2):
            for q in z['puzzles']:
                sim[f'story.traffic.{z["map"].get("district", "monument")}.{q["tile"]}'] = q['fleet'] if q['fleet'] > 0 else 0.25
    assert all(k in byid for k in sim), [k for k in sim if k not in byid]
    scripts += f'<script>\nwindow.DUMMIES_SIM = {json.dumps(sim)}; // Prototype 9 (Edits 97-100) + Submission 7; registry {reg["registryVersion"]}\n</script>\n'
    scripts += js(E / 'story7.js') + js(E / 'pads.js')
    scripts += f'<script>\nwindow.DUMMIES_CUES = {json.dumps(cues, ensure_ascii=False)};\n</script>\n' + js(E / 'audio.js')
    scripts += js(V / 'testroad.js')
    scripts += '<script>\n' + f'window.DUMMIES_STAGES = {json.dumps({k: {"title": v["title"], "flags": v["flags"]} for k, v in stages.items()})};\n'
    scripts += f'window.STORY_MAP1 = {json.dumps(plan, ensure_ascii=False)}; // content/story_map1.json, written by pipeline/run.py\n'
    if p11:
        scripts += f'window.STORY_MAPS = {{ monument: window.STORY_MAP1, parkland: {json.dumps(plan2, ensure_ascii=False)} }}; // FINAL V2.1 (Edit 125): content/puzzles_map2.json\n'
    scripts += '</script>\n'
    scripts += f'<script>\nwindow.DUEL_RULES = {json.dumps(rules, ensure_ascii=False)}; // engine/progression.json\n</script>\n'
    scripts += js(ROOT / 'engine' / 'duel.js') + js(ROOT / 'engine' / 'duel_ui.js')
    if p11:
        scripts += f'<script>\nwindow.P11_PUZZLES = {json.dumps(pz, ensure_ascii=False)}; // content/puzzles_map1.json\nwindow.P11_MAPS = [window.P11_PUZZLES, {json.dumps(pz2, ensure_ascii=False)}]; // + content/puzzles_map2.json (Edit 125)\n</script>\n'
        scripts += (js(ROOT / 'engine' / 'hero_cars.js') if (ROOT / 'engine' / 'hero_cars.js').exists() else '') + js(ROOT / 'engine' / 'p11.js') + js(ROOT / 'engine' / 'p11_ui.js')  # Prototype 11.4: the hero cars (the car design agent)
    scripts += f'<script>\n{v21_game_js(v2_game_js(p11_game_js(game_js()))) if p11 else game_js()}\n</script>\n'
    shell = (E / 'shell.html').read_text(encoding='utf-8')
    shell = patch(shell, [('<title>DUMMIES P9</title>', '<title>DUMMIES · FINAL V2</title>' if p11 else '<title>DUMMIES · Story Mode</title>')], 'shell.html')
    cache = ROOT / 'engine' / '.cache'; cache.mkdir(exist_ok=True)  # for headless checks (node): the same values the page gets
    (cache / ('runtime_p11.json' if p11 else 'runtime.json')).write_text(json.dumps({'sim': sim, 'story': story_json(plan, not p11, more), 'plan2': plan2, 'puzzles2': pz2, 'stages': {k: {'title': v['title'], 'flags': v['flags']} for k, v in stages.items()}, 'plan': plan, 'rules': rules, 'puzzles': pz}), encoding='utf-8')
    out = ROOT / 'final_v2' / 'index.html' if p11 else ROOT / 'index.html'  # FINAL V2 (Edit 123); Shipping V1 stays frozen in p11/
    if '--out' in sys.argv:  # a trial build elsewhere (the page's audio stays at ../audio/)
        out = Path(sys.argv[sys.argv.index('--out') + 1]).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
    out.parent.mkdir(exist_ok=True)
    out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
    missing = [f for c in cues['sfx'].values() for f in c.get('files', []) + c.get('alternates', []) + ([c['tone']] if c.get('tone') else []) if not (ROOT / 'audio' / cues['files'].get(f, {}).get('dir', 'sfx') / f).exists()]
    assert not missing, missing[:5]
    print(f'engine: wrote {out.relative_to(ROOT)} {out.stat().st_size:,} bytes; {"P11 puzzles" if p11 else "P9 + P10 duel"}; Map 1 from {plan["provenance"]["run"]}; md5 {hashlib.md5(out.read_bytes()).hexdigest()[:8]}')


if __name__ == '__main__':
    import sys
    main('--p11' in sys.argv)
