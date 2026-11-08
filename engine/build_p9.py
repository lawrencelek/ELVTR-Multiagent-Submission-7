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
    ], 'game.js (P11)')


def p11_plan(pz):
    """content/puzzles_map1.json as the duel's plan (window.STORY_MAP1): one tile a puzzle, its rungs and lane as params."""
    tiles = []
    for q in pz['puzzles']:
        params = {'duel.startRung': q['startRung'], 'duel.topRung': q['topRung']}
        if q.get('route') is not None:
            params['duel.route'] = q['route']
        params.update(q.get('params', {}))
        tiles.append({'n': q['n'], 'tile': q['tile'], 'title': q['name'], 'stage': q['stage'], 'earns': q.get('earns'), 'level': q['level'], 'newIdea': q['new'],
                      'objective': q['objective'], 'params': params, 'tale': q['tale'], 'hint': q['hints'][0], 'layout': q.get('layout')})
    return {'map': pz['map'], 'tiles': tiles, 'provenance': {'run': 'content/puzzles_map1.json (set by hand, Edit 113)'}}


def world6_js():
    w = (E / 'world6.js').read_text(encoding='utf-8')
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


def story_json(plan, gifts=True):
    d = json.loads((E / 'story_v2.json').read_text(encoding='utf-8'))
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
    rules = dict(RULES, levels=dict(RULES['levels'], **pz.get('levels', {}))) if p11 else RULES  # Prototype 11's own level profiles (the boss)
    stages = json.loads((V / 'sim_flags.json').read_text(encoding='utf-8'))['stages']
    reg = json.loads((ROOT / 'pipeline' / 'inputs' / 'tuning.parameters.json').read_text(encoding='utf-8'))
    byid = {e['id']: e for e in reg['entries']}
    cues = json.loads((E / 'cues.json').read_text(encoding='utf-8'))
    if p11:
        cues['base'] = '../audio/'  # p11/index.html: the shared audio folder
    cues['params']['audio.settings.master'] = 5  # Lawrence (7 Nov): the volume starts at 5 of 10 (a saved setting still wins)
    js = lambda p: f'<script>\n{p.read_text(encoding="utf-8")}\n</script>\n'
    scripts = js(E / 'jump.js') + ''.join(js(E / f) for f in ('sim.js', 'pixel.js', 'lab.js', 'circus_valley.js'))
    scripts += f'<script>\n{world6_js()}\n</script>\n' + js(E / 'content.js')
    scripts += f'<script>\nwindow.FLEET_DB = {(E / "fleet.json").read_text(encoding="utf-8")};\n</script>\n'
    scripts += f'<script>\nwindow.DUMMIES_STORY = {json.dumps(story_json(plan, not p11), ensure_ascii=False)}; // story_v2.json; Map 1 from content/story_map1.json\n</script>\n'
    scripts += js(E / 'lore.js')
    cr = cues['credits']
    credit = ['Music by ' + cr['music'].replace(' on itch.io', ''), 'Sound effects by ' + cr['sfx'].replace(' on itch.io', '')]
    scripts += (f"<script>\nwindow.DUMMIES_LORE.build = '{'P11 · PUZZLES' if p11 else 'P9 × P10'}';\n"
                f"window.DUMMIES_CREDITS.lines = window.DUMMIES_CREDITS.lines.concat({json.dumps(credit, ensure_ascii=False)});\n</script>\n")
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
    if p11:  # Prototype 11: the puzzle's fleet; 0 keeps the tile clear (engine/p11.js removes white ground cars)
        for q in pz['puzzles']:
            sim[f'story.traffic.monument.{q["tile"]}'] = q['fleet'] if q['fleet'] > 0 else 0.25
    assert all(k in byid for k in sim), [k for k in sim if k not in byid]
    scripts += f'<script>\nwindow.DUMMIES_SIM = {json.dumps(sim)}; // Prototype 9 (Edits 97-100) + Submission 7; registry {reg["registryVersion"]}\n</script>\n'
    scripts += js(E / 'story7.js') + js(E / 'pads.js')
    scripts += f'<script>\nwindow.DUMMIES_CUES = {json.dumps(cues, ensure_ascii=False)};\n</script>\n' + js(E / 'audio.js')
    scripts += js(V / 'testroad.js')
    scripts += '<script>\n' + f'window.DUMMIES_STAGES = {json.dumps({k: {"title": v["title"], "flags": v["flags"]} for k, v in stages.items()})};\n'
    scripts += f'window.STORY_MAP1 = {json.dumps(plan, ensure_ascii=False)}; // content/story_map1.json, written by pipeline/run.py\n</script>\n'
    scripts += f'<script>\nwindow.DUEL_RULES = {json.dumps(rules, ensure_ascii=False)}; // engine/progression.json\n</script>\n'
    scripts += js(ROOT / 'engine' / 'duel.js') + js(ROOT / 'engine' / 'duel_ui.js')
    if p11:
        scripts += f'<script>\nwindow.P11_PUZZLES = {json.dumps(pz, ensure_ascii=False)}; // content/puzzles_map1.json\n</script>\n'
        scripts += js(ROOT / 'engine' / 'p11.js') + js(ROOT / 'engine' / 'p11_ui.js')
    scripts += f'<script>\n{p11_game_js(game_js()) if p11 else game_js()}\n</script>\n'
    shell = (E / 'shell.html').read_text(encoding='utf-8')
    shell = patch(shell, [('<title>DUMMIES P9</title>', '<title>DUMMIES · Puzzles (Prototype 11)</title>' if p11 else '<title>DUMMIES · Story Mode</title>')], 'shell.html')
    cache = ROOT / 'engine' / '.cache'; cache.mkdir(exist_ok=True)  # for headless checks (node): the same values the page gets
    (cache / ('runtime_p11.json' if p11 else 'runtime.json')).write_text(json.dumps({'sim': sim, 'story': story_json(plan, not p11), 'stages': {k: {'title': v['title'], 'flags': v['flags']} for k, v in stages.items()}, 'plan': plan, 'rules': rules, 'puzzles': pz}), encoding='utf-8')
    out = ROOT / 'p11' / 'index.html' if p11 else ROOT / 'index.html'
    out.parent.mkdir(exist_ok=True)
    out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
    missing = [f for c in cues['sfx'].values() for f in c.get('files', []) + c.get('alternates', []) + ([c['tone']] if c.get('tone') else []) if not (ROOT / 'audio' / cues['files'].get(f, {}).get('dir', 'sfx') / f).exists()]
    assert not missing, missing[:5]
    print(f'engine: wrote {out.relative_to(ROOT)} {out.stat().st_size:,} bytes; {"P11 puzzles" if p11 else "P9 + P10 duel"}; Map 1 from {plan["provenance"]["run"]}; md5 {hashlib.md5(out.read_bytes()).hexdigest()[:8]}')


if __name__ == '__main__':
    import sys
    main('--p11' in sys.argv)
