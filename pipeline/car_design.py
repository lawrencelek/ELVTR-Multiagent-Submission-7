#!/usr/bin/env python3
"""Prototype 11.4: the car design agent (pipeline/agents/car_designer.md) draws the learner's hero car for the upgrade screen.

  Round 1, design: the level's own sprites, play, the gift screen, today's upgrade screen -> a spec and engine/hero_cars.js
  Round 2+, review: renders of its module (sheets per class, the upgrade screen) -> findings and a corrected module

  python3 pipeline/car_design.py --brief "..." [--rounds 3] [--model opus]
Each round: the agent's module is written to engine/hero_cars.js, the P11 page is rebuilt, engine/car_design_shots.js renders it.
Runs go to pipeline/runs/<stamp>-car-design/ (round_<n>/: input, output, module, shots).
"""
import argparse
import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'pipeline'))
import llm  # noqa: E402

MOD = ROOT / 'engine' / 'hero_cars.js'


def blocks(text):
    js = re.findall(r'```(?:js|javascript)\s*\n(.*?)```', text, re.S)
    jn = re.findall(r'```json\s*\n(.*?)```', text, re.S)
    if not js or not jn:
        raise ValueError('expected a ```json block and a ```js block')
    return json.loads(jn[0]), max(js, key=len)


def section(src, start, end):
    i = src.index(start)
    j = src.index(end, i)
    return src[i:j].rstrip()


def context():
    px = (ROOT / 'engine' / 'p9' / 'pixel.js').read_text()
    ui = (ROOT / 'engine' / 'duel_ui.js').read_text()
    fleet = json.loads((ROOT / 'engine' / 'p9' / 'fleet.json').read_text())
    models = {m['id']: m for m in fleet.get('models', [])} if isinstance(fleet, dict) else {}
    if not models:
        def walk(o):
            if isinstance(o, dict):
                if 'id' in o and 'typeTier' in o:
                    models[o['id']] = o
                for v in o.values():
                    walk(v)
            elif isinstance(o, list):
                for v in o:
                    walk(v)
        walk(fleet)
    roster = []
    for cls, mid, role in [('LUMINARY™', 'SED-01-001', 'the CEO car, grey metallic. Map 1 (Monument): built now'), ('VANGUARD™', 'POL-01-001', 'the police and security car, white and black. Map 2 (Parkland): designed now, built later'),
                           ('GENESIS™', 'SPT-01-001', 'the racing car, red. Map 3 (Waterfront): designed now, built later'), ('ENIGMA™', 'VAN-01-001', 'the delivery van: dropped (Lawrence, 10 Nov); do not design')]:
        m = models.get(mid, {})
        roster.append(f"| {cls} | {mid} | {m.get('class', '')} | {m.get('tag', '')} | {m.get('line', '')} | {m.get('callsign', '')} | {m.get('job', '')} | {role} |")
    pal = (ROOT / 'engine' / 'p9' / 'pixel.js').read_text()
    night = section(pal, '  const NIGHT = {', '  const CYBER')
    return '\n\n'.join([
        '# Context: the level\'s cars, the learner, the kit',
        '## The NOX classes and the model IDs (the user names the classes; the IDs, lines, callsigns and jobs are the fleet database, `engine/p9/fleet.json`)\n\n'
        '| Class | Model ID | Fleet class | Tag | Line | Callsign | Job | Status |\n|---|---|---|---|---|---|---|---|\n' + '\n'.join(roster) +
        '\n\n- The fleet job still says FARSIGHT in places; in-game text never names Farsight (the company is Dummy Corporation). Read "FARSIGHT board members" as "the board".'
        '\n- The class physics stay the fleet class\'s. In play (`vehicles.scale` applied): a sedan 50.4 x 25.2 world units, 25 x 13 art px, extrusion 3 px; police 52.2 x 25.2, 26 x 13, 3 px; a van 61.2 x 28.8, 31 x 14, 5 px. One art px = 2 world units.',
        '## The in-level car sprite generator (engine/p9/pixel.js)\n\nAn extruded footprint at 32 headings. Top face = the footprint lifted by the extrusion; the side faces show below it. The rim is the outside 1-px ring: `carRim` where it faces up or right, `carRimD` elsewhere.\n\n```js\n' + section(px, '  const HEADINGS = 32;', '  const carCache') + '\n```',
        '## The level palette (the game runs the night palette with the cyber scheme on top; `g.P` holds the merged hex values)\n\n```js\n' + night + '\n```',
        '## The learner\'s red recolour (`redSprite`; `g.red(hex)` applies it)\n\n```js\n' + section(ui, '  function redSprite(S) {', '  // ') + '\n```',
        '## Today\'s kit (Edit 116): one part a rung, in its rung colour, on a 64 x 30 unit sedan frame, nose +x\n\n```js\n' + section(ui, '  const KIT = {', '  function kitTag') + '\n```',
        '## The upgrade screen (Edit 119)\n\n- 1280 x 720. Panel 276, 66, 728 x 588 (#0b0f1a, cyan frame). Hero column 300, 90, 290 x 454: the car, nose up, centred on 450, 360. Pips (the seven rungs) at 330, 556.\n'
        '- The drone lowers each part on a tether to above the nose, lets go; it falls into its slot. Brackets (kit colour) mark the slot first. On landing: rings and a burst from the slot; rays from the car\'s centre.\n'
        '- Text column at x 600: "LUMINARY™ LEARNED", the part name (Nunito 900, red), the sensor, one sentence, the replay box.',
    ])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--brief', default='')
    ap.add_argument('--rounds', type=int, default=3)
    ap.add_argument('--model', default='opus')
    ap.add_argument('--ref', default='', help='reuse reference shots from this folder')
    ap.add_argument('--resume', default='', help='continue a run folder: the next round reviews engine/hero_cars.js, rendered afresh')
    ap.add_argument('--start-from', default='', help='a redesign: round 1 gets this run folder\'s spec and the current engine/hero_cars.js to rework')
    a = ap.parse_args()
    run = llm.Run(Path(a.resume) if a.resume else ROOT / 'pipeline' / 'runs' / (time.strftime('%Y%m%d-%H%M%S') + '-car-design'))
    ref = run.dir / 'ref'
    if a.resume:
        pass
    elif a.ref:
        ref.mkdir(exist_ok=True)
        for f in Path(a.ref).iterdir():
            (ref / f.name).write_bytes(f.read_bytes())
    else:
        subprocess.run(['node', str(ROOT / 'engine' / 'car_design_shots.js'), str(ref), '--ref'], check=True, cwd=str(ROOT), timeout=900)
    refm = json.loads((ref / 'shots.json').read_text())['shots']
    ref_lines = [f"- `{ref / (m['shot'] + '.png')}` · {m['note']}" for m in refm]
    ctx = context()
    run.save('context.md', ctx)
    spec, prev_js, prev_review, history = None, None, None, []
    first = 1
    if a.resume:  # rounds already run: their replies; the module as it now stands, rendered afresh for the next round
        done = sorted(int(p.name.split('_')[1]) for p in run.dir.glob('round_*') if p.is_dir() and p.name.split('_')[1].isdigit())
        for r0 in done:
            d0 = json.loads((run.dir / f'round_{r0}' / 'reply.json').read_text()); history.append({'round': r0, 'data': d0})
            if r0 == 1: spec = d0
            else: prev_review = d0
        first = done[-1] + 1; prev_js = MOD.read_text()
        subprocess.run([sys.executable, str(ROOT / 'engine' / 'build_p9.py'), '--p11'], check=True, cwd=str(ROOT), capture_output=True)
        subprocess.run(['node', str(ROOT / 'engine' / 'car_design_shots.js'), str(run.dir / f'round_{done[-1]}' / 'shots'), '--preview'], check=True, cwd=str(ROOT), timeout=900)
        run.log(f'resume: rounds {done}; round {done[-1]} re-rendered with the module and host as they stand')
    for r in range(first, first + a.rounds):
        rd = run.dir / f'round_{r}'
        rd.mkdir(exist_ok=True)
        if r == 1:
            prior = []
            if a.start_from:  # a redesign: the design as it stands, to rework
                sf = Path(a.start_from)
                prior = ['# The current design (to rework: keep what works, change what the brief changes)\n\nIts spec (round 1 of `' + sf.name + '`):\n\n```json\n' + (sf / 'round_1' / 'reply.json').read_text() + '\n```',
                         '# The current module (`engine/hero_cars.js`, after its last review)\n\n```js\n' + MOD.read_text() + '\n```']
                pv = sorted((p for p in (sf / 'round_4' / 'shots').glob('prev_sheet_*.png')), key=str) if (sf / 'round_4' / 'shots').exists() else []
                if pv: prior.append('# Renders of the current module (Read them)\n\n' + '\n'.join(f'- `{p}` · the current {p.stem[11:]}' for p in pv))
            msg = '\n\n'.join(['# Round 1: design\n\nDesign the hero cars and write the module (round 1 output).', '# The brief (the user, verbatim)\n\n' + (a.brief or '(none)')] + prior + [ctx,
                               '# Screenshots of the level (Read every one)\n\n' + '\n'.join(ref_lines)])
        else:
            pm = json.loads((rd.parent / f'round_{r - 1}' / 'shots' / 'shots.json').read_text())
            lines = [f"- `{rd.parent / f'round_{r - 1}' / 'shots' / (m['shot'] + '.png')}` · {m['note']}" for m in pm['shots']]
            errs = pm.get('errors') or []
            msg = '\n\n'.join([f'# Round {r}: review and fix\n\nReview the renders of your module from round {r - 1} as if someone else drew them, then return the corrected module (round 2+ output).',
                               '# The brief (the user, verbatim)\n\n' + (a.brief or '(none)'),
                               '# Your round 1 spec\n\n```json\n' + json.dumps(spec, indent=1, ensure_ascii=False) + '\n```',
                               ('# Your last review\n\n```json\n' + json.dumps(prev_review, indent=1, ensure_ascii=False) + '\n```') if prev_review else '',
                               '# Your module as it stands\n\n```js\n' + prev_js + '\n```',
                               ('# Errors from the page\n\n' + '\n'.join('- ' + e for e in errs)) if errs else '# Errors from the page\n\nNone.',
                               ctx,
                               '# Renders of your module (Read every one)\n\n' + '\n'.join(lines),
                               '# The level, for comparison (Read again as needed)\n\n' + '\n'.join(ref_lines)])
        run.log(f'round {r}: agent ({a.model})')
        out = llm.call(run, 'car_designer', a.model, msg, f'round_{r}', tools='Read')
        try:
            data, js = blocks(out)
        except Exception as e:  # one retry, with the problem stated
            run.log(f'round {r}: {e}; asking again')
            out = llm.call(run, 'car_designer', a.model, msg + f'\n\n# Your last reply could not be used\n\n{e}. Reply with exactly one ```json block and one ```js block.', f'round_{r}_retry', tools='Read')
            data, js = blocks(out)
        (rd / 'reply.json').write_text(json.dumps(data, indent=1, ensure_ascii=False))
        (rd / 'hero_cars.js').write_text(js)
        if r == 1:
            spec = data
        else:
            prev_review = data
        history.append({'round': r, 'data': data})
        MOD.write_text(js)
        chk = subprocess.run(['node', '--check', str(MOD)], capture_output=True, text=True)
        if chk.returncode:
            run.log(f'round {r}: syntax error: {chk.stderr[-400:]}')
        subprocess.run([sys.executable, str(ROOT / 'engine' / 'build_p9.py'), '--p11'], check=True, cwd=str(ROOT), capture_output=True)
        subprocess.run(['node', str(ROOT / 'engine' / 'car_design_shots.js'), str(rd / 'shots'), '--preview'], check=True, cwd=str(ROOT), timeout=900)
        prev_js = js
        run.log(f'round {r}: module {len(js)} chars; shots ' + json.dumps(json.loads((rd / 'shots' / 'shots.json').read_text()).get('errors')))
    rep = ['# Car design agent: the hero cars', '', f"**Today's hero:** {spec.get('verdict_current', '')}", '', '## Style rules', ''] + [f'- {x}' for x in spec.get('style_rules', [])]
    rep += ['', '## Classes', '', '| Class | Model | Silhouette | Details | Buffer |', '|---|---|---|---|---|'] + [f"| {c.get('class')} | {c.get('model')} | {c.get('silhouette', '')} | {'; '.join(c.get('details', []))} | {c.get('buffer')} |" for c in spec.get('classes', [])]
    rep += ['', '## Kit by class', '', '| Class | Rung | Part | Look | Why |', '|---|---|---|---|---|'] + [f"| {k.get('class')} | {k.get('rung')} | {k.get('name')} | {k.get('look', '')} | {k.get('why', '')} |" for k in spec.get('kit', [])]
    rep += ['', f"**Model line:** {spec.get('model_line', '')}", '', '## Risks', ''] + [f'- {x}' for x in spec.get('risks', [])]
    for h in history[1:]:
        d = h['data']
        rep += ['', f"## Round {h['round']} review", '', f"**Verdict:** {d.get('verdict', '')}", '', '| Id | Severity | Shots | What | Fix |', '|---|---|---|---|---|']
        rep += [f"| {f.get('id')} | {f.get('severity')} | {', '.join(f.get('shots', []))} | {f.get('what', '')} | {f.get('fix', '')} |" for f in d.get('findings', [])]
    cost = sum((c.get('cost_usd') or 0) for c in run.calls)
    rep += ['', f'Cost: ${cost:.2f}']
    run.save('report.md', '\n'.join(rep) + '\n')
    print(run.dir)


if __name__ == '__main__':
    main()
