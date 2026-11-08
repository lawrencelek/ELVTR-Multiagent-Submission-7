#!/usr/bin/env python3
"""Prototype 11's nine puzzles, pressure-tested by a puzzle level design specialist agent (pipeline/agents/puzzle_designer.md).

  1 build    engine/build_p9.py --p11 (the runtime the probes read)
  2 probes   engine/p11_probe.js: every puzzle × five bots (idle, stand, side, cutin, cover), headless; geometry and results
  3 agent    one headless Claude call (opus): the design (Edits 112, 113), the puzzles, the ladder, the fleet, the engine
             facts, the probes -> a verdict per puzzle, the map's order and build list, the vehicle question
  4 report   report.md, the agent's JSON, the probe table and the call's cost, in pipeline/runs/<stamp>-pressure/

  python3 pipeline/pressure_test.py [--seconds 120] [--model opus]
  REPLAY=pipeline/runs/<run> python3 pipeline/pressure_test.py   # the saved reply, no model call
"""
import argparse
import json
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'pipeline'))
import llm  # noqa: E402

BOTS = ('idle', 'stand', 'side', 'cutin', 'cover')


def section(md, first, last):
    """Edit 112/113 sections first..last (by their ## heading numbers)."""
    out, keep = [], False
    for line in md.splitlines():
        m = re.match(r'## (\d+)\.(\d+)', line)
        if m:
            keep = first <= int(m.group(2)) <= last
        if keep:
            out.append(line)
    return '\n'.join(out)


def probe(tile, bot, secs):
    p = subprocess.run(['node', str(ROOT / 'engine' / 'p11_probe.js'), tile, bot, str(secs), '--geo'], capture_output=True, text=True, timeout=900, cwd=str(ROOT))
    if p.returncode:
        raise RuntimeError(f'probe {tile} {bot}: {p.stderr[-400:]}')
    return json.loads(p.stdout.strip().splitlines()[-1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--seconds', type=int, default=120)
    ap.add_argument('--model', default='opus')
    a = ap.parse_args()
    run = llm.Run(ROOT / 'pipeline' / 'runs' / (time.strftime('%Y%m%d-%H%M%S') + '-pressure'))
    run.log('1 build: ' + subprocess.run([sys.executable, str(ROOT / 'engine' / 'build_p9.py'), '--p11'], capture_output=True, text=True, check=True).stdout.strip())
    pz = json.loads((ROOT / 'content' / 'puzzles_map1.json').read_text(encoding='utf-8'))
    tiles = [q['tile'] for q in pz['puzzles']]
    jobs = [(t, b, a.seconds * (2 if t == tiles[-1] and b != 'idle' else 1) if b != 'idle' else 60) for t in tiles for b in BOTS]
    run.log(f'2 probes: {len(jobs)} runs ({len(tiles)} puzzles × {len(BOTS)} bots, {a.seconds} s each; the boss twice as long)')
    with ThreadPoolExecutor(max_workers=9) as ex:
        res = list(ex.map(lambda j: probe(*j), jobs))
    probes = {}
    for (t, b, _), r in zip(jobs, res):
        probes.setdefault(t, {'geometry': r['geo'], 'bots': {}})['bots'][b] = {k: v for k, v in r['out'].items() if k not in ('bot',)}
    run.save('probes.json', probes)
    for t in tiles:
        run.log(f'  {t} ' + ' · '.join(f'{b} {probes[t]["bots"][b]["hits"]}h/{probes[t]["bots"][b]["faults"]}f' + (f' @{probes[t]["bots"][b]["firstHit"]}s' if probes[t]['bots'][b]["firstHit"] is not None else '') for b in BOTS))

    e112 = (ROOT / 'docs' / 'DUMMIES_GDD_Edit112_Puzzle_Pivot.md').read_text(encoding='utf-8')
    e113 = (ROOT / 'docs' / 'DUMMIES_GDD_Edit113_Prototype_11_Architecture.md').read_text(encoding='utf-8')
    fleet = json.loads((ROOT / 'engine' / 'p9' / 'fleet.json').read_text(encoding='utf-8'))
    reg = {e['id']: e for e in json.loads((ROOT / 'pipeline' / 'inputs' / 'tuning.parameters.json').read_text(encoding='utf-8'))['entries']}
    classes = [dict(c, **{k: reg[f'vehicles.{c["class"]}.{k}']['default'] for k in ('cruiseSpeed', 'length', 'width', 'height', 'mass') if f'vehicles.{c["class"]}.{k}' in reg}) for c in fleet['classes']]
    blocks = [('DESIGN · EDIT 112 (§112.2–112.8)', section(e112, 2, 8)), ('DESIGN · EDIT 113 (§113.2–113.6, §113.9)', section(e113, 2, 6) + '\n\n' + section(e113, 9, 9)),
              ('PUZZLES · content/puzzles_map1.json', '```json\n' + json.dumps(pz, indent=1, ensure_ascii=False) + '\n```'),
              ('LADDER · the red car\'s stages, measured on Prototype 10\'s test road', '```json\n' + (ROOT / 'pipeline' / 'inputs' / 'build' / 'ladder.json').read_text(encoding='utf-8') + '\n```'),
              ('FLEET · vehicle classes (fleet.json, registry vehicles.<class>.*), seniority', '```json\n' + json.dumps({'classes': classes, 'seniority': fleet['seniority']}, ensure_ascii=False) + '\n```'),
              ('ENGINE', (ROOT / 'pipeline' / 'inputs' / 'p11_engine.md').read_text(encoding='utf-8')),
              ('PROBES · per puzzle: geometry, then each bot', '```json\n' + json.dumps(probes, ensure_ascii=False) + '\n```')]
    msg = '\n\n'.join(f'## {h}\n\n{b}' for h, b in blocks) + '\n\nPressure-test the nine puzzles now, and answer the vehicle question.'
    run.log(f'3 agent puzzle_designer ({a.model}): {len(msg):,} characters in')
    reply = llm.json_of(llm.call(run, 'puzzle_designer', a.model, msg, 'a_puzzle_designer'))
    run.save('a_pressure_test.json', reply)
    cost = sum(c.get('cost_usd') or 0 for c in run.calls)
    for c in run.calls:
        run.log(f'  cost {c["label"]} {c["model"]} ${c.get("cost_usd") or 0:.4f} · {c.get("seconds", 0)} s · out {c.get("output_tokens")} tokens')

    md = [f'# Prototype 11: pressure test · {run.dir.name}', '', f'Agent: `pipeline/agents/puzzle_designer.md` ({a.model}), ${cost:.4f}. Probes: `engine/p11_probe.js`, {a.seconds} s a bot (the boss {2 * a.seconds} s).', '',
          '## Probes (counted hits / your-fault contacts, first hit in s)', '', '| # | Tile | Built | ' + ' | '.join(BOTS) + ' |', '|---|---|---|' + '---|' * len(BOTS)]
    for q in pz['puzzles']:
        b = probes[q['tile']]['bots']
        md.append(f'| {q["n"]} | {q["tile"]} {q["name"]} | {"yes" if q["built"] else "no"} | ' + ' | '.join(f'{b[k]["hits"]}/{b[k]["faults"]}' + (f' @{b[k]["firstHit"]}' if b[k]["firstHit"] is not None else '') for k in BOTS) + ' |')
    md += ['', '## Verdicts', '', '| # | Tile | Verdict | Obvious move fails | Intended solvable | Top fix |', '|---|---|---|---|---|---|']
    for L in reply.get('levels', []):
        fx = (L.get('fixes') or [{}])[0]
        md.append(f'| {L.get("n")} | {L.get("tile")} {L.get("name")} | **{L.get("verdict")}** | {L.get("obviousMove", {}).get("fails")} | {L.get("intended", {}).get("solvable")} | {fx.get("change", "")} |')
    md += ['', '## Top changes', ''] + [f'{i + 1}. {t}' for i, t in enumerate(reply.get('top', []))]
    v = reply.get('vehicles', {})
    md += ['', '## Vehicles', '', f'**{v.get("recommendation", "")}**', ''] + [f'- {w}' for w in v.get('why', [])] + ['', '| Map | District | Learner | Class | New puzzle space |', '|---|---|---|---|---|']
    md += [f'| {m.get("map")} | {m.get("district")} | {m.get("learner")} | {m.get("class")} | {"; ".join(m.get("newPuzzleSpace", []))} |' for m in v.get('maps', [])]
    md += ['', '## Map', '', f'- Curve: {reply.get("map", {}).get("curve", "")}', f'- Order: {" → ".join(reply.get("map", {}).get("order", []))}. {reply.get("map", {}).get("orderWhy", "")}', f'- Pacing: {reply.get("map", {}).get("pacing", "")}', '- Build: ' + '; '.join(reply.get('map', {}).get('build', [])), '- Cut: ' + '; '.join(reply.get('map', {}).get('cut', []))]
    md += ['', '## Per puzzle', '']
    for L in reply.get('levels', []):
        md += [f'### {L.get("n")} · {L.get("tile")} {L.get("name")} · {L.get("verdict")}', '',
               f'- New element: {L.get("newElement", {}).get("note", "")}', f'- Obvious move: {L.get("obviousMove", {}).get("evidence", "")}', f'- Intended: {L.get("intended", {}).get("evidence", "")}']
        md += [f'- Cheese: {c}' for c in L.get('cheese', [])] + [f'- Readability: {L.get("readability", "")}'] + [f'- Risk: {r}' for r in L.get('risks', [])]
        md += [f'- Fix ({f.get("priority")}, {f.get("kind")}): {f.get("change")}' + (f' `{", ".join(f.get("params", []))}`' if f.get('params') else '') for f in L.get('fixes', [])] + ['']
    run.save('report.md', '\n'.join(md) + '\n')
    run.save('summary.json', {'run': run.dir.name, 'model': a.model, 'cost_usd': round(cost, 4), 'calls': run.calls, 'probeSeconds': a.seconds})
    run.log(f'4 report: {run.dir / "report.md"} · ${cost:.4f}')


if __name__ == '__main__':
    main()
