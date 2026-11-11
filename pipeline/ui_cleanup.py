#!/usr/bin/env python3
"""FINAL V2 (GDD Edit 123): the screens under an adversarial UI cleanup agent (pipeline/agents/ui_cleaner.md).

  Round 1, spec:   every screen of a build, with the texts the canvas drew -> a cleanup spec (JSON): cuts, rewrites,
                   one language for "being seen", the camera's cone, the dash guide, stairs and parapet gaps
  Round 2, review: the same screens of the new build, and the spec -> verdicts against its own acceptance checks

  python3 pipeline/ui_cleanup.py spec   --brief "..." [--build p11] [--extra DIR] [--model opus]
  python3 pipeline/ui_cleanup.py review --spec pipeline/runs/<run>/a_cleanup_spec.json [--build final_v2] [--extra DIR] [--label r2]
Shots: engine/ui_cleanup_shots.js. --extra: more screenshots (lesson, gift, result, pause) copied in as they are.
Runs go to pipeline/runs/<stamp>-cleanup-<round>/.
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

EXTRA_WHAT = {'lesson_clip': 'the car upgrade screen, the replay', 'lesson_fit': 'the car upgrade screen, the part fitted', 'gift': "the dummy's part, gift screen",
              'result': 'the result (stars)', 'midlesson': "the boss's mid-puzzle lesson", 'pause': 'pause menu', 'controls': 'pause › controls', 'grid': 'the puzzle grid'}


def region(t):
    x, y = t['x'], t['y']
    return 'top bar' if y < 32 else 'left panel' if x < 240 else 'right panel' if x > 1040 else 'field'


def size(font):
    for w in font.split():
        if w.endswith('px'):
            return w
    return ''


def shots_into(run, build, extra):
    out = run.dir / 'shots'
    run.log(f'shots: engine/ui_cleanup_shots.js ({build})')
    subprocess.run(['node', str(ROOT / 'engine' / 'ui_cleanup_shots.js'), str(out), build], check=True, cwd=str(ROOT), timeout=1200)
    meta = json.loads((out / 'shots.json').read_text())
    lines, inv = [], {}
    for m in meta['shots']:
        lines.append(f"- `{out / (m['shot'] + '.png')}` · {m['what']}")
        for t in m['texts']:
            k = (t['t'], region(t))
            e = inv.setdefault(k, {'text': t['t'], 'region': region(t), 'size': size(t['font']), 'fill': t['fill'], 'shots': []})
            if m['shot'] not in e['shots']:
                e['shots'].append(m['shot'])
    if extra:
        for f in sorted(Path(extra).glob('*.png')):
            (out / f.name).write_bytes(f.read_bytes())
            what = next((v for k, v in EXTRA_WHAT.items() if k in f.stem), f.stem)
            lines.append(f"- `{out / f.name}` · {f.stem.replace('p_', '').split('_')[0]}: {what}")
    rows = ['| Text (as drawn) | Region | Size | Colour | Shots |', '|---|---|---|---|---|']
    for e in sorted(inv.values(), key=lambda e: (e['region'], e['text'])):
        sh = e['shots']
        rows.append(f"| {e['text'].replace('|', '/')} | {e['region']} | {e['size']} | {e['fill']} | {', '.join(sh[:4])}{' +' + str(len(sh) - 4) if len(sh) > 4 else ''} |")
    return lines, rows, meta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('round', choices=['spec', 'review'])
    ap.add_argument('--brief', default='')
    ap.add_argument('--spec', default='')
    ap.add_argument('--build', default='')
    ap.add_argument('--extra', default='')
    ap.add_argument('--label', default='')
    ap.add_argument('--model', default='opus')
    a = ap.parse_args()
    run = llm.Run(ROOT / 'pipeline' / 'runs' / (time.strftime('%Y%m%d-%H%M%S') + '-cleanup-' + a.round + (('-' + a.label) if a.label else '')))
    ctx = (ROOT / 'pipeline' / 'inputs' / 'ui_cleanup_context.md').read_text()
    build = a.build or ('p11' if a.round == 'spec' else 'final_v2')
    lines, rows, _ = shots_into(run, build, a.extra)
    run.save('inventory.md', '\n'.join(rows) + '\n')
    if a.round == 'spec':
        msg = '\n\n'.join(['# Round 1: the spec\n\nWrite the cleanup spec (round 1 output).',
                           '# The brief (the user, verbatim)\n\n' + (a.brief or '(none)'), ctx,
                           '# Every text the canvas drew, by screenshot\n\n' + '\n'.join(rows),
                           '# Screenshots (Read every one)\n\n' + '\n'.join(lines)])
        run.log(f'agent: ui_cleaner spec ({a.model}), {len(lines)} images, {len(rows) - 2} texts')
        out = llm.json_of(llm.call(run, 'ui_cleaner', a.model, msg, 'a_cleanup_spec', tools='Read'))
        run.save('a_cleanup_spec.json', out)
        sl = out.get('seen_language', {})
        rep = ['# FINAL V2: the UI cleanup spec', '', f"**Today:** {out.get('verdict', '')}", '', '## Principles', ''] + [f'- {x}' for x in out.get('principles', [])]
        rep += ['', '## Regions', '', '| Region | Now | Decision | After | Why |', '|---|---|---|---|---|'] + [f"| {r.get('region')} | {r.get('now', '')} | {r.get('decision')} | {r.get('after', '')} | {r.get('why', '')} |" for r in out.get('regions', [])]
        rep += ['', '## Texts', '', '| Now | Where | Decision | After | When | Why |', '|---|---|---|---|---|---|'] + [f"| {t.get('now')} | {t.get('where', '')} | {t.get('decision')} | {t.get('after', '')} | {t.get('when', '')} | {t.get('why', '')} |" for t in out.get('texts', [])]
        rep += ['', '## Being seen: one grammar', ''] + [f'- {x}' for x in sl.get('grammar', [])]
        rep += ['', '| State | Field | On the dummy | On the car | Words |', '|---|---|---|---|---|'] + [f"| {s.get('state')} | {s.get('field', '')} | {s.get('on_dummy', '')} | {s.get('on_car', '')} | {s.get('words', '')} |" for s in sl.get('states', [])]
        rep += ['', '| Sensor | Colour | Field | Idle | Seen | Params |', '|---|---|---|---|---|---|'] + [f"| {s.get('sensor')} | {s.get('colour', '')} | {s.get('field_shape', '')} | {s.get('idle', '')} | {s.get('seen', '')} | {', '.join(s.get('params', []))} |" for s in sl.get('sensors', [])]
        for k in ('cctv', 'dash_guide', 'stairs_and_gaps'):
            rep += ['', f'## {k}', ''] + [f'- **{kk}:** {vv}' for kk, vv in (out.get(k) or {}).items()]
        rep += ['', '## Acceptance', ''] + [f'{i + 1}. {c}' for i, c in enumerate(out.get('acceptance', []))] + ['', '## Risks', ''] + [f'- {x}' for x in out.get('risks', [])]
    else:
        spec = json.loads(Path(a.spec).read_text())
        msg = '\n\n'.join(['# Round 2: the review\n\nReview the new build against your spec (round 2 output). You wrote the spec; you did not build it.',
                           '# The brief (the user, verbatim)\n\n' + (a.brief or '(none)'),
                           '# Your spec\n\n```json\n' + json.dumps(spec, indent=1, ensure_ascii=False) + '\n```', ctx,
                           '# Every text the canvas drew in the new build, by screenshot\n\n' + '\n'.join(rows),
                           '# Screenshots of the new build (Read every one)\n\n' + '\n'.join(lines)])
        run.log(f'agent: ui_cleaner review ({a.model}), {len(lines)} images')
        out = llm.json_of(llm.call(run, 'ui_cleaner', a.model, msg, 'a_cleanup_review', tools='Read'))
        run.save('a_cleanup_review.json', out)
        rep = ['# FINAL V2: the adversarial review', '', f"**Verdict:** {out.get('verdict', '')}", '', '## Acceptance', '', '| Check | Pass | Shots | Note |', '|---|---|---|---|']
        rep += [f"| {m.get('check')} | {'yes' if m.get('pass') else 'no'} | {', '.join(m.get('shots', []))} | {m.get('note', '')} |" for m in out.get('meets', [])]
        rep += ['', '## Findings', '', '| Id | Severity | Shots | What | Fix |', '|---|---|---|---|---|']
        rep += [f"| {f.get('id')} | {f.get('severity')} | {', '.join(f.get('shots', []))} | {f.get('what', '')} | {f.get('fix', '')} |" for f in out.get('findings', [])]
        rep += ['', '**Priority:** ' + ', '.join(out.get('priority', []))]
    cost = sum((c.get('cost_usd') or 0) for c in run.calls)
    rep += ['', f'Cost: ${cost:.2f}']
    run.save('report.md', '\n'.join(rep) + '\n')
    print(run.dir)


if __name__ == '__main__':
    main()
