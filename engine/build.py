#!/usr/bin/env python3
"""Step 6b (no model): bundle the engine and the pipeline's content into one playable page, junction.html (the
Prototype 10 junction version of Map 1; the integrated game is engine/build_p9.py → index.html).

Loads content/story_map1.json exactly as the pipeline wrote it (window.STORY_MAP1); no hand edits. The engine is the
Prototype 10 web build, vendored from Submission 6B (engine/vendor, commit in VENDOR.md): sim.js, jump.js, testroad.js,
game_p10.js and the ten stages' values (sim_flags.json). Three small patches let story mode switch stage per tile; they
are applied here so the vendored files stay byte-identical to their source. Target engine later: Phaser.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
V = ROOT / 'engine' / 'vendor'


def patched_game():
    g = (V / 'game_p10.js').read_text(encoding='utf-8')
    for a, b in (("const X = window.DUMMIES, T = window.DUMMIES_P10, F = window.DUMMIES_SIM;", "const X = window.DUMMIES, T = window.DUMMIES_P10; let F = window.DUMMIES_SIM; // story mode: each tile sets F"),
                 ("const ST = window.DUMMIES_P10_STAGE || { id: '10.1', title: 'THE TEST ROAD' };", "let ST = window.DUMMIES_P10_STAGE || { id: '10.1', title: 'THE TEST ROAD' }; // story mode: each tile sets ST"),
                 ("  function newSim() {\n", "  function newSim(flags, stage) {\n    if (flags) F = flags; if (stage) ST = stage; // story mode: the tile's stage values and name\n")):
        assert g.count(a) == 1, a[:60]
        g = g.replace(a, b)
    return g


def main():
    story = json.loads((ROOT / 'content' / 'story_map1.json').read_text(encoding='utf-8'))
    stages = json.loads((V / 'sim_flags.json').read_text(encoding='utf-8'))['stages']
    first = stages[story['tiles'][0]['stage']]['flags']
    js = lambda p: f'<script>\n{p.read_text(encoding="utf-8")}\n</script>\n'
    scripts = js(V / 'jump.js') + js(V / 'sim.js') + js(V / 'testroad.js')
    scripts += '<script>\n' + f'window.DUMMIES_STAGES = {json.dumps({k: {"title": v["title"], "flags": v["flags"]} for k, v in stages.items()})};\n'
    scripts += f'window.STORY_MAP1 = {json.dumps(story, ensure_ascii=False)}; // content/story_map1.json, written by pipeline/run.py\n'
    scripts += f'window.DUMMIES_SIM = window.DUMMIES_STAGES[{json.dumps(story["tiles"][0]["stage"])}].flags;\n'
    scripts += "window.DUMMIES_P10_STAGE = { id: 'MAP 1', title: 'MONUMENT', edit: 110 };\n</script>\n"
    scripts += f'<script>\n{patched_game()}\n</script>\n' + js(ROOT / 'engine' / 'story.js')
    shell = (V / 'shell.html').read_text(encoding='utf-8').replace('{{TITLE}}', 'Story Mode · Map 1 · Monument')
    out = ROOT / 'junction.html'
    out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
    print(f'engine: wrote junction.html {out.stat().st_size:,} bytes; {len(story["tiles"])} tiles; first stage {story["tiles"][0]["stage"]} ({len(first)} values)')


if __name__ == '__main__':
    main()
