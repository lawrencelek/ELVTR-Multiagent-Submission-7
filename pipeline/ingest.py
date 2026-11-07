#!/usr/bin/env python3
"""Step 1 (no model): build the agents' inputs from the game's own data.

- ladder.json: the ten Prototype 10 stages (the red car's learning ladder). Titles, rungs and changed values come from
  engine/vendor/sim_flags.json; what each stage teaches is the GDD's summary; open ways are measured by the bot probes
  (Submission 6B, qa/baseline/p10_*.json: hits a minute per approach, at least 0.3).
- map1.json: Map 1 (Monument, Act I) from the story file: its nine tiles in play order, titles, tasks, gifts, tales.
- registry.json: the parameters a designer may set (id, label, unit, default, min, max). Full or filtered (--full).
"""
import argparse
import json
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
PREFIXES = ('duel.', 'perception.', 'traffic.white', 'traffic.incident', 'traffic.junction', 'scoring.incident', 'ui.lungeGuide', 'vehicles.sedan.cruiseSpeed')


def ver(k):
    return tuple(int(x) for x in k.split('.'))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--full', action='store_true', help='pass the whole registry (the costly first version)')
    a = ap.parse_args()
    flags = json.loads((ROOT / 'engine' / 'vendor' / 'sim_flags.json').read_text(encoding='utf-8'))['stages']
    ladder, prev = [], {}
    for k in sorted(flags, key=ver):
        f = flags[k]['flags']
        changed = {i: v for i, v in flags[k]['p10'].items() if prev.get(i) != v and not i.startswith(('audio.', 'proto.art'))}
        learn, closes, opens = TEACH[k]
        ladder.append({'stage': k, 'title': flags[k]['title'], 'startRung': f.get('duel.startRung'), 'topRung': f.get('duel.topRung'),
                       'teaches': learn, 'closes': closes, 'opens': opens, 'measuredOpenWays': OPEN[k], 'keyValues': dict(list(changed.items())[:12])})
        prev = flags[k]['p10']
    story = json.loads((INP / 'story_v2.json').read_text(encoding='utf-8'))
    d = next(x for x in story['districts'] if x['id'] == 'monument')
    map1 = {'id': d['id'], 'name': d['name'], 'act': d['act'], 'intro': d['intro'],
            'tiles': [dict(id=t, n=i + 1, **{k: d['tiles'][t].get(k) for k in ('title', 'task', 'gift', 'tale')}) for i, t in enumerate(d['order'])],
            'taskLabels': {k: v['label'] for k, v in story['tasks'].items()}}
    reg = json.loads((INP / 'tuning.parameters.json').read_text(encoding='utf-8'))['entries']
    keep = [e for e in reg if a.full or e['id'].startswith(PREFIXES)]
    registry = [{'id': e['id'], 'label': e.get('label'), 'unit': e.get('unit'), 'default': e.get('default'),
                 'min': (e.get('validation') or {}).get('min'), 'max': (e.get('validation') or {}).get('max'),
                 **({'about': (e.get('description') or '')[:160]} if not a.full else {'about': e.get('description'), 'purpose': e.get('purpose'), 'source': e.get('source')})} for e in keep]
    out = INP / 'build'
    out.mkdir(exist_ok=True)
    for name, obj in (('ladder.json', ladder), ('map1.json', map1), ('registry.json', registry)):
        (out / name).write_text(json.dumps(obj, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'ingest: {len(ladder)} stages; Map 1 {len(map1["tiles"])} tiles; registry {len(registry)} of {len(reg)} entries ({"full" if a.full else "filtered"})')


if __name__ == '__main__':
    main()
