#!/usr/bin/env python3
"""Step 6b (no model): the integrated game. Prototype 9's game (engine/p9: districts, art, fleet, story, HUD, sound) with
Prototype 10's red car (engine/vendor/testroad.js) driving the tile in test, and the pipeline's plan for Map 1
(content/story_map1.json) setting each tile's ladder stage, objective, title, tale and hint. Output: index.html.

The vendored files stay byte-identical to Submission 6B (VENDOR.md). Every change to them is a patch applied here, each
asserted to match exactly once:
  game.js   C / Ctrl duck; the duel's overlays, HUD panel and lesson card; Enter closes the lesson; the red car's paint;
            the objective line; the tile card's NEW line; STORY on the title goes straight into the story (no save screen)
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
        ("else toSaves()",
         "else quickStory()"),
        ("  function startStory() {",
         "  function quickStory() { // Submission 7: STORY plays at once. The latest save continues; with none, slot 1 starts\n"
         "    const S = allSlots(); let best = 0, t = -1; S.forEach((v, i) => { if (v && v.saved > t) { t = v.saved; best = i + 1; } });\n"
         "    if (best && loadSlot(best)) { startStory(); return; }\n"
         "    app.slot = 1; app.story = STORY.newProgress(); app.mode = 'story'; writeSlot(1, { v: 1, name: defaultName(1), saved: Date.now(), progress: app.story }); startStory();\n"
         "  }\n"
         "  function startStory() {"),
    ], 'game.js')


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
         "  const api = { paintPlanter, paintPost, artUnit: U, P6SIM, DISTRICTS,"),
    ], 'world6.js')


def story_json(plan):
    d = json.loads((E / 'story_v2.json').read_text(encoding='utf-8'))
    mon = next(x for x in d['districts'] if x['id'] == 'monument')
    assert mon['order'] == [t['tile'] for t in plan['tiles']], 'Map 1 tile order differs from the plan'
    for t in plan['tiles']:
        tile, o = mon['tiles'][t['tile']], t['objective']
        what = {'hits': f'{o["count"]} damaging hit{"s" if o["count"] != 1 else ""} by the red car', 'stealth': f'{o["count"]} stealth points from the red car', 'incidents': f'{o["count"]} Incidents'}[o['kind']]
        tile.update({'title': t['title'], 'tale': t['tale'], 'stage': t['stage'], 'newIdea': t.get('newIdea', ''), 'hint': t.get('hint', ''),
                     'task': {'kind': 'red', 'label': o['label'], 'brief': f'{what}. {t.get("hint", "")}'.strip(), 'count': o['count'], 'objective': o['kind']}})
    if plan.get('map', {}).get('intro'):
        mon['intro'] = plan['map']['intro']
    return d


def main():
    plan = json.loads((ROOT / 'content' / 'story_map1.json').read_text(encoding='utf-8'))
    stages = json.loads((V / 'sim_flags.json').read_text(encoding='utf-8'))['stages']
    reg = json.loads((ROOT / 'pipeline' / 'inputs' / 'tuning.parameters.json').read_text(encoding='utf-8'))
    byid = {e['id']: e for e in reg['entries']}
    cues = json.loads((E / 'cues.json').read_text(encoding='utf-8'))
    js = lambda p: f'<script>\n{p.read_text(encoding="utf-8")}\n</script>\n'
    scripts = js(E / 'jump.js') + ''.join(js(E / f) for f in ('sim.js', 'pixel.js', 'lab.js', 'circus_valley.js'))
    scripts += f'<script>\n{world6_js()}\n</script>\n' + js(E / 'content.js')
    scripts += f'<script>\nwindow.FLEET_DB = {(E / "fleet.json").read_text(encoding="utf-8")};\n</script>\n'
    scripts += f'<script>\nwindow.DUMMIES_STORY = {json.dumps(story_json(plan), ensure_ascii=False)}; // story_v2.json; Map 1 from content/story_map1.json\n</script>\n'
    scripts += js(E / 'lore.js')
    cr = cues['credits']
    credit = ['Music by ' + cr['music'].replace(' on itch.io', ''), 'Sound effects by ' + cr['sfx'].replace(' on itch.io', '')]
    scripts += ("<script>\nwindow.DUMMIES_LORE.build = 'P9 × P10';\n"
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
    assert all(k in byid for k in sim), [k for k in sim if k not in byid]
    scripts += f'<script>\nwindow.DUMMIES_SIM = {json.dumps(sim)}; // Prototype 9 (Edits 97-100) + Submission 7; registry {reg["registryVersion"]}\n</script>\n'
    scripts += js(E / 'story7.js') + js(E / 'pads.js')
    scripts += f'<script>\nwindow.DUMMIES_CUES = {json.dumps(cues, ensure_ascii=False)};\n</script>\n' + js(E / 'audio.js')
    scripts += js(V / 'testroad.js')
    scripts += '<script>\n' + f'window.DUMMIES_STAGES = {json.dumps({k: {"title": v["title"], "flags": v["flags"]} for k, v in stages.items()})};\n'
    scripts += f'window.STORY_MAP1 = {json.dumps(plan, ensure_ascii=False)}; // content/story_map1.json, written by pipeline/run.py\n</script>\n'
    scripts += js(ROOT / 'engine' / 'duel.js') + js(ROOT / 'engine' / 'duel_ui.js')
    scripts += f'<script>\n{game_js()}\n</script>\n'
    shell = (E / 'shell.html').read_text(encoding='utf-8')
    shell = patch(shell, [('<title>DUMMIES P9</title>', '<title>DUMMIES · Story Mode</title>')], 'shell.html')
    cache = ROOT / 'engine' / '.cache'; cache.mkdir(exist_ok=True)  # for headless checks (node): the same values the page gets
    (cache / 'runtime.json').write_text(json.dumps({'sim': sim, 'story': story_json(plan), 'stages': {k: {'title': v['title'], 'flags': v['flags']} for k, v in stages.items()}, 'plan': plan}), encoding='utf-8')
    out = ROOT / 'index.html'
    out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
    missing = [f for c in cues['sfx'].values() for f in c.get('files', []) + c.get('alternates', []) + ([c['tone']] if c.get('tone') else []) if not (ROOT / 'audio' / cues['files'].get(f, {}).get('dir', 'sfx') / f).exists()]
    assert not missing, missing[:5]
    print(f'engine: wrote index.html {out.stat().st_size:,} bytes; P9 + P10 duel; Map 1 from {plan["provenance"]["run"]}; md5 {hashlib.md5(out.read_bytes()).hexdigest()[:8]}')


if __name__ == '__main__':
    main()
