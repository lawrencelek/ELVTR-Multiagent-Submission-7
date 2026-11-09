#!/usr/bin/env python3
"""Prototype 11 under an adversarial QA agent (pipeline/agents/qa_adversary.md) with a 360° analog pad (qa/pad.js).

  1 geo      qa/attack.js --geo: the nine tiles as an attacker needs them (solids, decks, gaps, stairs, route, cover, cameras)
  2 round 1  the agent (opus) writes attack plans and one intended-solution plan per puzzle, in the attack language
  3 run      qa/attack.js: each plan in its own page through the virtual pad, the monitor watching; parallel browsers
  4 round 2  the agent reads round 1's results and writes follow-ups (repro, vary, find the edges)
  5 run      again
  6 report   the agent's bug list and per-puzzle verdicts, with the click-everywhere crawl (qa/clicks.js) and the full
             runthrough (qa/runthrough.js) folded in when given; report.md in pipeline/runs/<stamp>-qa/

  python3 pipeline/qa_attack.py [--model opus] [--par 4] [--clicks DIR] [--runthrough DIR] [--page p11]
  REPLAY=pipeline/runs/<run> python3 pipeline/qa_attack.py ...     # the saved replies, no model calls
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


def run_plans(run, plans, tag, page, par):
    pf, rf = run.dir / f'{tag}_plans.json', run.dir / f'{tag}_results.json'
    pf.write_text(json.dumps(plans, indent=1))
    run.log(f'{tag}: {len(plans)} plans, {par} browsers')
    subprocess.run(['node', str(ROOT / 'qa' / 'attack.js'), str(pf), str(rf), page, str(par)], cwd=str(ROOT), timeout=7200, check=False,
                   stdout=open(run.dir / f'{tag}_attack.log', 'w'), stderr=subprocess.STDOUT)
    return json.loads(rf.read_text())


def compact(results):
    out = []
    for r in results:
        if r.get('error'):
            out.append({'id': r['id'], 'tile': r['tile'], 'error': r['error']})
            continue
        e = r.get('end') or {}
        out.append({'id': r['id'], 'tile': r['tile'], 'hypothesis': r.get('hypothesis', '')[:200], 'stopped': r['run']['reason'], 'ranSecs': r['run']['secs'],
                    'cleared': e.get('cleared'), 'result': e.get('result'), 'progress': e.get('progress'), 'rung': e.get('rung'), 'passes': e.get('passes'),
                    'faults': e.get('faults'), 'standstill': e.get('standstill'), 'restarts': e.get('restarts'), 'body': e.get('body'), 'alive': e.get('alive'),
                    'findings': [{k: v for k, v in f.items() if k not in ('k',)} for f in r.get('findings', [])][:8], 'pageErrors': r.get('pageErrors', [])[:3],
                    'trace': r.get('trace', [])[::6][:20]})
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--model', default='opus')
    ap.add_argument('--par', type=int, default=4)
    ap.add_argument('--page', default='p11')
    ap.add_argument('--clicks', default='')
    ap.add_argument('--runthrough', default='')
    ap.add_argument('--max1', type=int, default=60)
    ap.add_argument('--max2', type=int, default=30)
    a = ap.parse_args()
    run = llm.Run(ROOT / 'pipeline' / 'runs' / (time.strftime('%Y%m%d-%H%M%S') + '-qa'))
    run.log('geo: qa/attack.js --geo')
    subprocess.run(['node', str(ROOT / 'qa' / 'attack.js'), '--geo', str(run.dir / 'geo.json'), a.page], cwd=str(ROOT), check=True, capture_output=True, timeout=900)
    geo = json.loads((run.dir / 'geo.json').read_text())
    pz = json.loads((ROOT / 'content' / 'puzzles_map1.json').read_text())['puzzles']
    e115 = (ROOT / 'docs' / 'DUMMIES_GDD_Edit115_Map1_Redesign.md').read_text()
    ctx = '\n\n'.join([
        '# The nine puzzles as designed (Edit 115)\n\n' + e115.split('## 115.5')[0],
        '# The puzzles as data\n\n```json\n' + json.dumps([{k: q.get(k) for k in ('n', 'tile', 'name', 'rungs', 'kit', 'objective', 'hints', 'par', 'target', 'fleet', 'layout', 'camera')} for q in pz], ensure_ascii=False) + '\n```',
        '# The tiles (from the running game; world units)\n\n```json\n' + json.dumps(geo) + '\n```',
    ])
    msg1 = ctx + f'\n\n# Round 1\n\nWrite at most {a.max1} plans: for each of the nine puzzles one `solution` plan and attack plans; spread them over the attack families. Each plan at most 90 s.'
    run.log(f'round 1: qa_adversary ({a.model})')
    p1 = llm.json_of(llm.call(run, 'qa_adversary', a.model, msg1, 'a_round1')).get('plans', [])[:a.max1]
    r1 = run_plans(run, p1, 'r1', a.page, a.par)
    c1 = compact(r1)
    run.save('r1_compact.json', c1)
    msg2 = ctx + '\n\n# Round 1: your plans\n\n```json\n' + json.dumps(p1) + '\n```\n\n# Round 1: what happened\n\n```json\n' + json.dumps(c1) + f'\n```\n\n# Round 2\n\nWrite at most {a.max2} follow-up plans. Repro and vary what broke; retry any `solution` that did not clear (fix your script, or show the pad cannot do it); push the attack families that found nothing. Name each plan\'s parent in its hypothesis.'
    run.log('round 2')
    p2 = llm.json_of(llm.call(run, 'qa_adversary', a.model, msg2, 'b_round2')).get('plans', [])[:a.max2]
    r2 = run_plans(run, p2, 'r2', a.page, a.par)
    c2 = compact(r2)
    run.save('r2_compact.json', c2)
    extra = ''
    for name, d in (('click-everywhere crawl (qa/clicks.js)', a.clicks), ('full runthrough (qa/runthrough.js)', a.runthrough)):
        if d and (Path(d) / ('clicks.json' if 'clicks' in name else 'runthrough.json')).exists():
            j = json.loads((Path(d) / ('clicks.json' if 'clicks' in name else 'runthrough.json')).read_text())
            extra += f'\n\n# The {name}\n\n```json\n' + json.dumps(j)[:30000] + '\n```'
    msg3 = ctx + '\n\n# Round 1\n\n```json\n' + json.dumps(c1) + '\n```\n\n# Round 2: your plans\n\n```json\n' + json.dumps(p2) + '\n```\n\n# Round 2: what happened\n\n```json\n' + json.dumps(c2) + '\n```' + extra + '\n\n# Final round\n\nWrite the report.'
    run.log('final report')
    rep = llm.json_of(llm.call(run, 'qa_adversary', a.model, msg3, 'c_report'))
    run.save('report.json', rep)
    md = ['# Adversarial QA: Prototype 11, analog pad', '', f"**Verdict:** {rep.get('verdict', '')}", '',
          f"Plans: round 1 {len(p1)} ({sum(1 for r in c1 if r.get('cleared'))} cleared), round 2 {len(p2)} ({sum(1 for r in c2 if r.get('cleared'))} cleared). Monitor findings: {sum(len(r.get('findings', [])) for r in c1 + c2)}.", '',
          '## Bugs', '', '| Id | Severity | Tile | Title | Evidence | What | Expected | Fix |', '|---|---|---|---|---|---|---|---|']
    for b in rep.get('bugs', []):
        md.append(f"| {b.get('id')} | {b.get('severity')} | {b.get('tile')} | {b.get('title')} | {', '.join(b.get('evidence', []))} | {b.get('what', '')} | {b.get('expected', '')} | {b.get('fix', '')} |")
    md += ['', '## Puzzles', '', '| Tile | Solution verified | Plan | Cheese | Soft locks | Verdict |', '|---|---|---|---|---|---|']
    for p in rep.get('puzzles', []):
        md.append(f"| {p.get('tile')} | {'yes' if p.get('solution_verified') else 'no'} | {p.get('solution_plan', '')} | {p.get('cheese', '')} | {p.get('softlocks', '')} | {p.get('verdict', '')} |")
    md += ['', '## Analog', '', str(rep.get('analog', '')), '', '## Coverage', '', str(rep.get('coverage', '')), '', '## Next', ''] + [f'- {x}' for x in rep.get('next', [])]
    cost = sum((c.get('cost_usd') or 0) for c in run.calls)
    md += ['', f'Calls: {len(run.calls)} · cost ${cost:.2f}']
    run.save('report.md', '\n'.join(md) + '\n')
    run.save('summary.json', {'plans': [len(p1), len(p2)], 'cleared': [sum(1 for r in c1 if r.get('cleared')), sum(1 for r in c2 if r.get('cleared'))], 'bugs': len(rep.get('bugs', [])), 'calls': run.calls, 'cost_usd': round(cost, 3)})
    run.log(f'report: {run.dir / "report.md"} · ${cost:.2f}')


if __name__ == '__main__':
    main()
