#!/usr/bin/env python3
"""Prototype 11's red car under an adversarial UI agent (pipeline/agents/ui_adversary.md): its markings, its sensor
fields, and the escalation across Map 1's nine puzzles, judged from screenshots.

  1 build    engine/build_p9.py --p11 (unless --no-build)
  2 shots    engine/p11_ui_shots.js: per puzzle the car mid-tile and the dummy on the kerb ahead (field and a 2x crop),
             the boss at rungs 6 and 7, a lesson's clip and fitting; into the run folder
  3 agent    one headless Claude call (opus) with the Read tool only: the brief, the mark inventory, the sensor
             parameters, the puzzles (Edit 115), the kit (Edit 116, or its successor), the shots -> JSON verdicts
  4 report   report.md and the agent's JSON, in pipeline/runs/<stamp>-ui-<label>/

  python3 pipeline/ui_review.py --label p11_1 --brief "..." [--model opus] [--kit docs/DUMMIES_GDD_Edit116_...md]
  REPLAY=pipeline/runs/<run> python3 pipeline/ui_review.py --label ...   # the saved reply, no model call
"""
import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'pipeline'))
import llm  # noqa: E402

INVENTORY = (ROOT / 'pipeline' / 'inputs' / 'p11_marks.md')


def sensor_params():
    """The duel's perception values at the boss (all rungs live), from a headless sim."""
    js = r"""
const path = require('path'), fs = require('fs'), Module = require('module');
const D = process.argv[1], E = path.join(D, 'p9');
const res = Module._resolveFilename; Module._resolveFilename = function (req, parent, ...a) { if (req.startsWith('../p6/') || req.startsWith('../jump/')) req = path.join(E, path.basename(req)); return res.call(this, req, parent, ...a); };
const R = JSON.parse(fs.readFileSync(path.join(D, '.cache', 'runtime_p11.json'), 'utf8'));
Object.assign(globalThis, { DUMMIES_STORY: R.story, DUMMIES_SIM: R.sim });
globalThis.DUMMIES = require(path.join(E, 'sim.js')); globalThis.WORLD6 = require(path.join(E, 'world6.js'));
const STORY = globalThis.STORY = require(path.join(E, 'story7.js')); globalThis.DUMMIES_P10 = require(path.join(D, 'vendor', 'testroad.js'));
Object.assign(globalThis, { DUMMIES_STAGES: R.stages, STORY_MAP1: R.plan, DUEL_RULES: R.rules, P11_PUZZLES: R.puzzles });
require(path.join(D, 'duel.js')); require(path.join(D, 'p11.js'));
const pr = STORY.newProgress(); pr.done.monument = globalThis.P11.ORDER.filter((t) => t !== 'C3');
const s = new STORY.StorySim('monument', Object.assign({}, R.sim), pr), T = s.duelT, out = {};
for (const [k, v] of Object.entries(T.DP || {})) if (/^(perception|duel\.(memory|search|topRung|lesson))/.test(k)) out[k] = v;
for (const k of ['body.radius', 'sensing.coneReach', 'perception.sideRadius', 'perception.sideHalfAngle', 'proto.art.noticeFlashHz']) out[k] = s.P[k];
out['(derived) forward cone reach'] = T.coneReach().f; out['(derived) side cone reach'] = Math.round(T.coneReach().s); out['(derived) side cone edges deg'] = T.sideEdges();
console.log(JSON.stringify(out));
"""
    r = subprocess.run(['node', '-e', js, str(ROOT / 'engine')], capture_output=True, text=True, cwd=str(ROOT))
    return json.loads(r.stdout.strip().splitlines()[-1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--label', default='review')
    ap.add_argument('--brief', default='')
    ap.add_argument('--model', default='opus')
    ap.add_argument('--kit', default='docs/DUMMIES_GDD_Edit116_Prototype_11_1_Kit.md')
    ap.add_argument('--marks', default='pipeline/inputs/p11_marks.md')
    ap.add_argument('--no-build', action='store_true')
    ap.add_argument('--shots', default='', help='reuse a shots folder')
    a = ap.parse_args()
    run = llm.Run(ROOT / 'pipeline' / 'runs' / (time.strftime('%Y%m%d-%H%M%S') + '-ui-' + a.label))
    if not a.no_build:
        run.log('build: engine/build_p9.py --p11')
        subprocess.run([sys.executable, str(ROOT / 'engine' / 'build_p9.py'), '--p11'], check=True, cwd=str(ROOT), capture_output=True)
    shots = run.dir / 'shots'
    if a.shots:
        shots.mkdir(exist_ok=True)
        for f in Path(a.shots).iterdir():
            (shots / f.name).write_bytes(f.read_bytes())
    else:
        run.log('shots: engine/p11_ui_shots.js')
        subprocess.run(['node', str(ROOT / 'engine' / 'p11_ui_shots.js'), str(shots)], check=True, cwd=str(ROOT), timeout=1500)
    meta = json.loads((shots / 'shots.json').read_text())
    params = sensor_params()
    run.save('params.json', params)
    pz = json.loads((ROOT / 'content' / 'puzzles_map1.json').read_text())['puzzles']
    e115 = (ROOT / 'docs' / 'DUMMIES_GDD_Edit115_Map1_Redesign.md').read_text()
    kit = (ROOT / a.kit).read_text()
    src = (ROOT / 'engine' / 'duel_ui.js').read_text()
    lessons = src[src.index('const LESSON = {'):src.index('const NEXT = {')].strip()  # the lesson card's lines per rung
    lines = []
    for m in meta['shots']:
        for kind in ('car', 'field'):
            f = shots / f"{m['shot']}_{kind}.png"
            if f.exists():
                lines.append(f"- `{f}` · puzzle {m['n']} {m['tile']} {m.get('name', '')} · rung {m['rung']} · {m['moment']} · {'2x crop round the car' if kind == 'car' else 'the field, 800 x 640'}")
    msg = '\n\n'.join([
        '# The brief (the user, verbatim)\n\n' + (a.brief or '(none)'),
        '# The marks the renderer draws around the red car\n\n' + (ROOT / a.marks).read_text(),
        '# Sensor parameters (registry ids, values at the boss)\n\n```json\n' + json.dumps(params, indent=1) + '\n```',
        '# Lesson card text per rung (what it now does, what that closes, what stays open)\n\n```js\n' + lessons + '\n```',
        '# The nine puzzles (Edit 115)\n\n' + e115.split('## 115.5')[0],
        '# The puzzles as data\n\n```json\n' + json.dumps([{k: q.get(k) for k in ('n', 'tile', 'name', 'stage', 'rungs', 'kit', 'earns', 'objective', 'hints', 'par', 'target', 'fleet', 'layout', 'camera')} for q in pz], ensure_ascii=False) + '\n```',
        '# The kit as built (the design under review)\n\n' + kit,
        '# Screenshots (Read every one)\n\n' + '\n'.join(lines),
    ])
    run.log(f'agent: ui_adversary ({a.model}), {len(lines)} images')
    text = llm.call(run, 'ui_adversary', a.model, msg, 'a_ui_review', tools='Read')
    out = llm.json_of(text)
    run.save('a_ui_review.json', out)
    rep = [f"# Adversarial UI review: {a.label}", '', f"**Verdict:** {out.get('verdict', '')}", '']
    rep += ['## Findings', '', '| Id | Severity | Shots | What | Player reads | Fix |', '|---|---|---|---|---|---|']
    for f in out.get('findings', []):
        rep.append(f"| {f.get('id')} | {f.get('severity')} | {', '.join(f.get('shots', []))} | {f.get('what', '')} | {f.get('player_reads', '')} | {f.get('fix', '')} |")
    rep += ['', '## Marks', '', '| Mark | Layer | Decision | Conflicts | Why |', '|---|---|---|---|---|']
    for g in out.get('signals', []):
        rep.append(f"| {g.get('mark')} | {g.get('layer')} | {g.get('decision')} | {'; '.join(g.get('conflicts', []))} | {g.get('why', '')} |")
    rep += ['', '## Sensor feedback', '', '| Rung | Sensor | On the car | Feedback | Idle / sensing / caught | Params |', '|---|---|---|---|---|---|']
    for g in out.get('sensor_feedback', []):
        st = g.get('states', {})
        rep.append(f"| {g.get('rung')} | {g.get('sensor')} | {g.get('on_car', '')} | {g.get('feedback', '')} | {st.get('idle', '')} / {st.get('sensing', '')} / {st.get('caught', '')} | {', '.join(g.get('params', []))} |")
    rep += ['', '## Puzzles', '', '| # | Tile | New | Screen tells it | Misread | Fix |', '|---|---|---|---|---|---|']
    for g in out.get('puzzles', []):
        rep.append(f"| {g.get('n')} | {g.get('tile')} | {g.get('new', '')} | {'yes' if g.get('screen_tells_it') else 'no'} | {g.get('misread', '')} | {g.get('fix', '')} |")
    rep += ['', '## Colours', ''] + [f"- {c.get('colour')}: {c.get('means')}" for c in out.get('colour_map', [])]
    rep += ['', '## Cut', ''] + [f'- {c}' for c in out.get('cut', [])] + ['', '**Priority:** ' + ', '.join(out.get('priority', [])), '']
    cost = sum((c.get('cost_usd') or 0) for c in run.calls)
    rep += [f"Call: {json.dumps(run.calls[-1])}", f'Cost: ${cost:.2f}']
    run.save('report.md', '\n'.join(rep) + '\n')
    run.save('summary.json', {'label': a.label, 'images': len(lines), 'calls': run.calls, 'cost_usd': round(cost, 3), 'findings': len(out.get('findings', []))})
    run.log(f'report: {run.dir / "report.md"} · ${cost:.2f}')


if __name__ == '__main__':
    main()
