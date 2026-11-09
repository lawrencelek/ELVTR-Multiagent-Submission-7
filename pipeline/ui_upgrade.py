#!/usr/bin/env python3
"""Prototype 11.3: the car's upgrade screen under an adversarial UI redesign agent (pipeline/agents/ui_upgrade.md).

  Round 1, spec:   shots of the reference (the Dummy Chassis gift screen) and the current car lesson -> a redesign spec (JSON)
  Round 2, review: shots of the build, pinned at set times, and the round 1 spec -> verdicts against its own acceptance checks

  python3 pipeline/ui_upgrade.py spec   --brief "..." [--shots DIR] [--model opus]
  python3 pipeline/ui_upgrade.py review --spec pipeline/runs/<run>/a_upgrade_spec.json [--shots DIR] [--label r2]
Shots: engine/p11_upgrade_shots.js (run here unless --shots). Runs go to pipeline/runs/<stamp>-upgrade-<round>/.
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


def shots_into(run, src, args):
    out = run.dir / 'shots'
    if src:
        out.mkdir(exist_ok=True)
        for f in Path(src).iterdir():
            (out / f.name).write_bytes(f.read_bytes())
    else:
        run.log('shots: engine/p11_upgrade_shots.js ' + ' '.join(args))
        subprocess.run(['node', str(ROOT / 'engine' / 'p11_upgrade_shots.js'), str(out)] + args, check=True, cwd=str(ROOT), timeout=900)
    meta = json.loads((out / 'shots.json').read_text())
    lines = []
    for m in meta['shots']:
        f = out / (m['shot'] + '.png')
        if not f.exists():
            continue
        if m['kind'] == 'reference':
            lines.append(f"- `{f}` · REFERENCE, the Dummy Chassis gift screen at {m['t']} s")
        elif m['kind'] == 'part card':
            lines.append(f"- `{f}` · the dummy's part card after puzzle {m['tile']}")
        else:
            lines.append(f"- `{f}` · the car's upgrade after puzzle {m['tile']}, rung {m['from']} → {m['to']}, at {m['t']} s" + (' (pinned)' if m.get('pinned') else ' (clock)'))
    return lines, meta


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('round', choices=['spec', 'review'])
    ap.add_argument('--brief', default='')
    ap.add_argument('--spec', default='')
    ap.add_argument('--shots', default='')
    ap.add_argument('--label', default='')
    ap.add_argument('--model', default='opus')
    a = ap.parse_args()
    run = llm.Run(ROOT / 'pipeline' / 'runs' / (time.strftime('%Y%m%d-%H%M%S') + '-upgrade-' + a.round + (('-' + a.label) if a.label else '')))
    ctx = (ROOT / 'pipeline' / 'inputs' / 'p11_upgrade_context.md').read_text()
    src = (ROOT / 'engine' / 'duel_ui.js').read_text()
    lessons = src[src.index('const LESSON = {'):src.index('const NEXT = {')].strip()
    if a.round == 'spec':
        lines, _ = shots_into(run, a.shots, ['--ref', '--car'])
        msg = '\n\n'.join([
            '# Round 1: the spec\n\nWrite the redesign spec (round 1 output).',
            '# The brief (the user, verbatim)\n\n' + (a.brief or '(none)'),
            ctx,
            '# The current lesson text per rung\n\n```js\n' + lessons + '\n```',
            '# Screenshots (Read every one)\n\n' + '\n'.join(lines),
        ])
        run.log(f'agent: ui_upgrade spec ({a.model}), {len(lines)} images')
        out = llm.json_of(llm.call(run, 'ui_upgrade', a.model, msg, 'a_upgrade_spec', tools='Read'))
        run.save('a_upgrade_spec.json', out)
        rep = ['# Car upgrade screen: the adversarial redesign spec', '', f"**Current:** {out.get('verdict_current', '')}", '',
               '## Keep from the reference', ''] + [f'- {x}' for x in out.get('keep_from_reference', [])] + ['', '## Change for the car', ''] + [f'- {x}' for x in out.get('change_for_the_car', [])]
        rep += ['', '## Layout', '', '| Region | Box | Holds | Why |', '|---|---|---|---|'] + [f"| {r.get('region')} | {r.get('box')} | {r.get('holds', '')} | {r.get('why', '')} |" for r in out.get('layout', [])]
        rep += ['', '## Timeline', '', '| t0 | t1 | Beat | Draws | Sound |', '|---|---|---|---|---|'] + [f"| {b.get('t0')} | {b.get('t1')} | {b.get('beat', '')} | {b.get('draws', '')} | {b.get('sound', '')} |" for b in out.get('timeline', [])]
        rep += ['', '## Juice', '', '| Effect | When | Secs | Why |', '|---|---|---|---|'] + [f"| {j.get('effect')} | {j.get('when', '')} | {j.get('secs', '')} | {j.get('why', '')} |" for j in out.get('juice', [])]
        rep += ['', '## Sentences', ''] + [f'- Rung {k}: {v}' for k, v in out.get('sentences', {}).items()]
        rep += ['', '## Text', '', '| Line | Size | Colour | When |', '|---|---|---|---|'] + [f"| {t.get('line')} | {t.get('size_px')} | {t.get('colour')} | {t.get('when', '')} |" for t in out.get('text', [])]
        rep += ['', f"**Input:** {out.get('input', '')}", '', f"**Two rungs:** {out.get('two_rungs', '')}", '', f"**Reduced motion:** {out.get('reduced_motion', '')}", '',
                '## Cut', ''] + [f'- {c}' for c in out.get('cut', [])] + ['', '## Acceptance', ''] + [f'{i + 1}. {c}' for i, c in enumerate(out.get('acceptance', []))]
    else:
        spec = json.loads(Path(a.spec).read_text())
        lines, _ = shots_into(run, a.shots, ['--car', '--with-rm'])
        msg = '\n\n'.join([
            '# Round 2: the review\n\nReview the build against your spec (round 2 output). You wrote the spec; you did not build it.',
            '# The brief (the user, verbatim)\n\n' + (a.brief or '(none)'),
            '# Your spec\n\n```json\n' + json.dumps(spec, indent=1, ensure_ascii=False) + '\n```',
            ctx,
            '# Screenshots of the build (Read every one)\n\n' + '\n'.join(lines),
        ])
        run.log(f'agent: ui_upgrade review ({a.model}), {len(lines)} images')
        out = llm.json_of(llm.call(run, 'ui_upgrade', a.model, msg, 'a_upgrade_review', tools='Read'))
        run.save('a_upgrade_review.json', out)
        rep = ['# Car upgrade screen: the adversarial review', '', f"**Verdict:** {out.get('verdict', '')}", '', '## Acceptance', '', '| Check | Pass | Shots | Note |', '|---|---|---|---|']
        rep += [f"| {m.get('check')} | {'yes' if m.get('pass') else 'no'} | {', '.join(m.get('shots', []))} | {m.get('note', '')} |" for m in out.get('meets', [])]
        rep += ['', '## Findings', '', '| Id | Severity | Shots | What | Fix |', '|---|---|---|---|---|']
        rep += [f"| {f.get('id')} | {f.get('severity')} | {', '.join(f.get('shots', []))} | {f.get('what', '')} | {f.get('fix', '')} |" for f in out.get('findings', [])]
        rep += ['', '**Priority:** ' + ', '.join(out.get('priority', []))]
    cost = sum((c.get('cost_usd') or 0) for c in run.calls)
    rep += ['', f"Call: {json.dumps(run.calls[-1])}", f'Cost: ${cost:.2f}']
    run.save('report.md', '\n'.join(rep) + '\n')
    print(run.dir)


if __name__ == '__main__':
    main()
