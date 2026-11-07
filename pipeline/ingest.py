#!/usr/bin/env python3
"""Step 1 (no model): build the agents' inputs from the game's own data.

- ladder.json: the ten Prototype 10 stages (the red car's learning ladder). Titles, rungs and changed values come from
  engine/vendor/sim_flags.json; what each stage teaches is the GDD's summary; open ways are measured by the bot probes
  (Submission 6B, qa/baseline/p10_*.json: hits a minute per approach, at least 0.3).
- map1.json: Map 1 (Monument, Act I) from the story file: its nine tiles in play order, titles, tasks, gifts, tales.
- registry.json: the parameters a designer may set (id, label, unit, default, min, max). Full or filtered (--full).
- --world p9 (default since v3): the game is Prototype 9's Monument district with Prototype 10's red car. Each tile in
  map1.json carries its Prototype 9 geometry (road, set piece, the verb it was built for: engine/p9/world6.js, story_v2), and
  the ladder is told in Prototype 9's terms (decks for the plinth, kerbside cameras, Prototype 9's planters).
"""
import re
import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INP = ROOT / 'pipeline' / 'inputs'

TEACH = {  # GDD Edits 101-110: what the red car learns at each stage, what that closes, what stays open
    '10.1': ('Nothing. The red car drives straight through.', 'nothing', 'walk into its path; dash from the side'),
    '10.2': ('After its first crash, a lesson: it brakes for a dummy in its lane (the beam).', 'standing in its lane', 'from the side: flank, a late walk-in'),
    '10.3': ('The side field: it notices a dummy beside the road and stops short of it.', 'the open flank', 'the plinth (raised), the jump, the gap'),
    '10.4': ('Roof lidar: it sees a dummy raised on the plinth.', 'the plinth', 'the jump; springs from behind cover'),
    '10.5': ('Street cameras: it sees behind cover through the link.', 'springs from cover', 'the cone bait (Hands 1); the sprint from beyond its field'),
    '10.6': ('It stops for cones; the dummy gets DUCK to hide behind low planters.', 'the cone bait', 'the planter ambush; the sprint from beyond its field'),
    '10.7': ('Crash memory: it remembers every crash spot and watches it.', 'the same spot twice', 'a new spot each time (roaming)'),
    '10.8': ('The search: seen then hidden, it searches where it last saw you (a ghost). Sight cones; the lure; the lunge guide.', 'hiding after being seen', 'crawling away beyond the search; the lure; roaming'),
    '10.9': ('Two-way roads and white cars that never learn: moving cover and a hazard.', 'nothing new', 'moving cover: many ways reopen'),
    '10.10': ('White cars tailgate it: make it stop hard and the white car behind runs into it (an Incident, scored).', 'nothing new', 'the Incident; moving cover'),
}
OPEN = {  # measured: approaches landing 0.3 hits a minute or more at the stage's top rung (bot probes, 6B qa/baseline)
    '10.1': 'walkin 3.73, flank 2.54, aim 1.8, stand 1.27, standOff 1.27, standSouth 1.21, wander 0.93',
    '10.2': 'flank 2.81, walkin 1.94, aim 1.6, wander 0.53',
    '10.3': 'jump 2.69, plinth 2.67, gap 2.07, aim 2.0, flank 1.8, dashjump 0.47',
    '10.4': 'jump 2.69, gap 2.21, aim 2.0, flank 1.8, dashjump 0.47',
    '10.5': 'conebait 2.0, lurk 0.8',
    '10.6': 'planter 3.03, lurk 0.8',
    '10.7': 'roam 6.97, lurk 0.6, flankOpen 0.4',
    '10.8': 'roam 2.87, lure 2.24, peekmove 1.21, flankOpen 1.07, lurk 0.8, gap 0.6',
    '10.9': 'flankOpen 4.85, roam 2.31, lure 2.23, kerb 2.09, peekmove 1.48, jump 1.27, gap 0.93',
    '10.10': 'flankOpen 5.4, kerb 2.76, lure 2.44, dashjump 2.08, roam 1.48, peekmove 1.34, jump 1.27; Incidents about 0.6 a minute',
}
TEACH_P9 = {  # the same ladder in Prototype 9's world (engine/duel.js): decks are the height, P9's buildings and planters the cover
    '10.1': ('Nothing. The red car drives straight through.', 'nothing', 'walk into its path; dash from the side'),
    '10.2': ('After its first crash, a lesson: it brakes for a dummy in its lane (the beam).', 'standing in its lane', 'the flank: dash in from beside its lane as it rolls past'),
    '10.3': ('Side cones: it notices a dummy beside the road, slows, then stops short of it. A dummy up on a deck is out of its world.', 'the open flank', 'height: drop onto it through a gap in a deck over its road, or jump'),
    '10.4': ('Roof lidar: it sees a dummy in the air (a jump, or a fall off a deck onto its road). Up on a deck you are still unseen.', 'the drop and the jump onto it', 'cover: spring from behind a building, column or kiosk as it passes'),
    '10.5': ('Kerbside street cameras share what they see: cover a camera watches no longer hides you.', 'springs from watched cover', 'cover the cameras miss; the sprint from beyond its cones'),
    '10.6': ('It stops for cones and never swerves round them; the dummy gets DUCK (hold C) to hide behind low planters.', 'the cone bait', 'the planter ambush: duck behind a planter by its road; spring as it passes'),
    '10.7': ('Crash memory: it remembers every spot you struck from, and watches it.', 'the same spot twice', 'a new spot each time: roam the tile'),
    '10.8': ('The search: seen then hidden, it searches where it last saw you (a ghost).', 'hiding after being seen', 'hide before it sees you; crawl away from its ghost; lure it to stop short'),
    '10.9': ("Prototype 9's two-way traffic: the fleet are white cars that never learn, moving cover and a hazard.", 'nothing new', 'moving cover: many ways reopen'),
    '10.10': ('White cars tailgate it: make it stop hard and the car behind runs into it (an Incident, scored).', 'nothing new', 'the Incident; moving cover'),
}


def p9_tiles():
    """Monument's tiles in Prototype 9 (engine/p9/world6.js): each tile's road and set piece, as the district plan states them."""
    src = (ROOT / 'engine' / 'p9' / 'world6.js').read_text(encoding='utf-8')
    block = src[src.index("{ id: 'monument'"):]
    block = block[block.index('tiles: {'):block.index('} },')]
    return {m.group(1): {'road': m.group(2), 'setPiece': m.group(3)} for m in re.finditer(r"([ABC][123]): \['((?:[^'\\]|\\.)*)', '((?:[^'\\]|\\.)*)'", block)}


PREFIXES = ('duel.', 'perception.', 'traffic.white', 'traffic.incident', 'traffic.junction', 'scoring.incident', 'ui.lungeGuide', 'vehicles.sedan.cruiseSpeed')


def ver(k):
    return tuple(int(x) for x in k.split('.'))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--full', action='store_true', help='pass the whole registry (the costly first version)')
    ap.add_argument('--world', choices=('p9', 'junction'), default='p9', help="p9: Prototype 9's tiles (v3); junction: the test road (v1, v2)")
    a = ap.parse_args()
    flags = json.loads((ROOT / 'engine' / 'vendor' / 'sim_flags.json').read_text(encoding='utf-8'))['stages']
    ladder, prev = [], {}
    for k in sorted(flags, key=ver):
        f = flags[k]['flags']
        changed = {i: v for i, v in flags[k]['p10'].items() if prev.get(i) != v and not i.startswith(('audio.', 'proto.art'))}
        learn, closes, opens = (TEACH_P9 if a.world == 'p9' else TEACH)[k]
        ladder.append({'stage': k, 'title': flags[k]['title'], 'startRung': f.get('duel.startRung'), 'topRung': f.get('duel.topRung'),
                       'teaches': learn, 'closes': closes, 'opens': opens, ('measuredOpenWaysOnTheTestRoad' if a.world == 'p9' else 'measuredOpenWays'): OPEN[k], 'keyValues': dict(list(changed.items())[:12])})
        prev = flags[k]['p10']
    story = json.loads((INP / 'story_v2.json').read_text(encoding='utf-8'))
    d = next(x for x in story['districts'] if x['id'] == 'monument')
    map1 = {'id': d['id'], 'name': d['name'], 'act': d['act'], 'intro': d['intro'],
            'tiles': [dict(id=t, n=i + 1, **{k: d['tiles'][t].get(k) for k in ('title', 'task', 'gift', 'tale')}) for i, t in enumerate(d['order'])],
            'taskLabels': {k: v['label'] for k, v in story['tasks'].items()}}
    if a.world == 'p9':
        geo = p9_tiles()
        if not (ROOT / 'engine' / '.cache' / 'runtime.json').exists():  # the built world's values, for the headless measure
            subprocess.run([sys.executable, str(ROOT / 'engine' / 'build_p9.py')], check=True, capture_output=True)
        aff = json.loads(subprocess.run(['node', str(ROOT / 'engine' / 'affordances.js')], check=True, capture_output=True, text=True).stdout)
        for t in map1['tiles']:
            t['prototype9'] = dict(geo[t['id']], builtFor=(t.get('task') or {}).get('kind'), measured=aff[t['id']])
        map1['controls'] = 'Arrows or WASD move; Space dash (Battery 1, from B1); L jump (Legs 1, from B3); J picks up and puts down a cone (Hands 1, from A2); hold C to duck (from tile 6); walk off a deck through a gap in its parapet to drop.'
    reg = json.loads((INP / 'tuning.parameters.json').read_text(encoding='utf-8'))['entries']
    keep = [e for e in reg if a.full or e['id'].startswith(PREFIXES)]
    registry = [{'id': e['id'], 'label': e.get('label'), 'unit': e.get('unit'), 'default': e.get('default'),
                 'min': (e.get('validation') or {}).get('min'), 'max': (e.get('validation') or {}).get('max'),
                 **({'about': (e.get('description') or '')[:160]} if not a.full else {'about': e.get('description'), 'purpose': e.get('purpose'), 'source': e.get('source')})} for e in keep]
    out = INP / 'build'
    out.mkdir(exist_ok=True)
    for name, obj in (('ladder.json', ladder), ('map1.json', map1), ('registry.json', registry)):
        (out / name).write_text(json.dumps(obj, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'ingest: {len(ladder)} stages; Map 1 {len(map1["tiles"])} tiles ({a.world}); registry {len(registry)} of {len(reg)} entries ({"full" if a.full else "filtered"})')


if __name__ == '__main__':
    main()
