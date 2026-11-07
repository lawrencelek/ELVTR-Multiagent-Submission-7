#!/usr/bin/env python3
"""The DUMMIES story-mode pipeline: Map 1, tiles 1-9, from the red car's learning ladder.

  1 ingest    (code)   game data -> agent inputs: ladder + measured open ways, Map 1 story, registry
  2 designer  (model)  -> a nine-tile plan (stage, objective, overrides, tale, hint per tile)
  3 validate  (code)   schema, registry ids and ranges, stage order, word counts
  4 reviewer  (model)  -> issues against the fun-escalation rules
  5 refiner   (model)  -> the final plan (+ one repair pass if the validator still fails)
  6 integrate (code)   -> content/story_map1.json (+ provenance) -> engine/build_p9.py -> index.html (playable: Prototype 9's
                       world with Prototype 10's red car); engine/build.py -> junction.html (the test-road version)

  python3 pipeline/run.py                 # v3: Prototype 9's tiles; filtered registry; designer opus, reviewer + refiner sonnet
  python3 pipeline/run.py --world junction  # v2: the same on the test road
  python3 pipeline/run.py --v1            # v1: full registry; opus throughout (the first, costlier version)
  REPLAY=pipeline/runs/<run> python3 pipeline/run.py   # re-run from saved outputs, no model calls
"""
import argparse
import json
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import llm  # noqa: E402
import validate  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
B = ROOT / 'pipeline' / 'inputs' / 'build'


def inputs_block():
    return '\n\n'.join(f'## {name.upper()}\n```json\n{(B / f"{name}.json").read_text(encoding="utf-8")}```' for name in ('ladder', 'map1', 'registry'))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--v1', action='store_true', help='full registry, opus for every agent')
    ap.add_argument('--no-integrate', action='store_true')
    ap.add_argument('--world', choices=('p9', 'junction'), default='p9')
    a = ap.parse_args()
    models = {'designer': 'opus', 'reviewer': 'opus', 'refiner': 'opus'} if a.v1 else {'designer': 'opus', 'reviewer': 'sonnet', 'refiner': 'sonnet'}
    world = 'junction' if a.v1 else a.world
    tag = time.strftime('%Y%m%d-%H%M%S') + ('-v1' if a.v1 else '-v3' if world == 'p9' else '-v2')
    run = llm.Run(ROOT / 'pipeline' / 'runs' / tag)
    run.world = world
    run.log(f'run {tag}: models {models}; world {world}')
    run.log('1 ingest: ' + subprocess.run([sys.executable, str(ROOT / 'pipeline' / 'ingest.py'), '--world', world] + (['--full'] if a.v1 else []), capture_output=True, text=True, check=True).stdout.strip())
    ctx = inputs_block()
    run.log(f'  inputs: {len(ctx):,} characters')

    run.log(f'2 designer ({models["designer"]}) ...')
    plan = llm.json_of(llm.call(run, 'designer', models['designer'], ctx + '\n\nDesign the nine tiles of Map 1 now.', 'a_designer'))
    run.save('a_plan.json', plan)
    run.log('  plan: ' + ' | '.join(f'{t["n"]} {t["tile"]} {t["stage"]} {t["objective"]["kind"]}x{t["objective"]["count"]}' for t in plan['tiles']))
    errs = validate.check(plan, world)
    run.log(f'3 validate: {len(errs)} errors' + ''.join(f'\n    - {e}' for e in errs))

    run.log(f'4 reviewer ({models["reviewer"]}) ...')
    review = llm.json_of(llm.call(run, 'reviewer', models['reviewer'], ctx + '\n\n## PLAN\n```json\n' + json.dumps(plan, indent=1, ensure_ascii=False) + '\n```\n\nReview it now.', 'b_reviewer'))
    run.save('b_review.json', review)
    run.log(f'  verdict {review.get("verdict")}: ' + '; '.join(f'[{i.get("severity")}] tile {i.get("tile")}: {i.get("problem")}' for i in review.get('issues', [])[:6]))

    run.log(f'5 refiner ({models["refiner"]}) ...')
    msg = ctx + '\n\n## PLAN\n```json\n' + json.dumps(plan, indent=1, ensure_ascii=False) + '\n```\n\n## REVIEW\n```json\n' + json.dumps(review, indent=1, ensure_ascii=False) + '\n```\n'
    if errs:
        msg += '\n## VALIDATOR ERRORS\n' + '\n'.join(f'- {e}' for e in errs) + '\n'
    final = llm.json_of(llm.call(run, 'refiner', models['refiner'], msg + '\nProduce the final plan now.', 'c_refiner'))
    errs = validate.check(final, world)
    if errs:
        run.log(f'  validate: {len(errs)} errors; one repair pass')
        final = llm.json_of(llm.call(run, 'refiner', models['refiner'], ctx + '\n\n## PLAN\n```json\n' + json.dumps(final, indent=1, ensure_ascii=False) + '\n```\n\n## VALIDATOR ERRORS\n' + '\n'.join(f'- {e}' for e in errs) + '\n\nFix every error; change nothing else. Produce the final plan now.', 'd_repair'))
        errs = validate.check(final, world)
    run.save('c_final.json', final)
    run.log(f'  validate: {len(errs)} errors' + ''.join(f'\n    - {e}' for e in errs))
    if errs:
        run.log('STOP: the plan does not validate; nothing integrated')
        sys.exit(1)

    cost = sum(c.get('cost_usd') or 0 for c in run.calls)
    summary = {'run': tag, 'models': models, 'registry': 'full' if a.v1 else 'filtered', 'world': world, 'calls': run.calls, 'cost_usd': round(cost, 4),
               'input_chars': len(ctx), 'tokens': {k: sum(c.get(k) or 0 for c in run.calls) for k in ('input_tokens', 'cache_write_tokens', 'cache_read_tokens', 'output_tokens')}}
    run.save('costs.json', summary)
    for c in run.calls:
        run.log(f'  cost {c["label"]:<12} {c["model"]:<7} ${c.get("cost_usd") or 0:.4f}  in {c.get("input_tokens") or 0}+{c.get("cache_write_tokens") or 0} write+{c.get("cache_read_tokens") or 0} read  out {c.get("output_tokens") or 0}  {c.get("seconds", 0)} s')
    run.log(f'  run cost ${cost:.4f}')

    if a.no_integrate:
        return
    final['provenance'] = {'pipeline': 'pipeline/run.py', 'run': tag, 'world': world, 'models': models, 'costUsd': round(cost, 4), 'validator': 'pass', 'review': review.get('verdict')}
    out = ROOT / 'content' / 'story_map1.json'
    out.write_text(json.dumps(final, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    run.log(f'6 integrate: wrote {out.relative_to(ROOT)}')
    for b in ('build_p9.py', 'build.py'):
        run.log('  ' + subprocess.run([sys.executable, str(ROOT / 'engine' / b)], capture_output=True, text=True, check=True).stdout.strip())
    run.log('done: open index.html to play Map 1')


if __name__ == '__main__':
    main()
