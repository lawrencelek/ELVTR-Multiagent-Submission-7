"""Step 3 (no model): hard checks on a story-mode plan. Returns a list of errors; empty means the engine can load it."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KINDS = {'hits': (1, 5), 'stealth': (50, 1500), 'incidents': (1, 3)}
FORBIDDEN = {'duel.startRung', 'duel.topRung'}


def ver(k):
    return tuple(int(x) for x in str(k).split('.'))


def words(s):
    return len(str(s or '').split())


def check(plan):
    errs = []
    reg = {e['id']: e for e in json.loads((ROOT / 'pipeline' / 'inputs' / 'tuning.parameters.json').read_text(encoding='utf-8'))['entries']}
    stages = json.loads((ROOT / 'engine' / 'vendor' / 'sim_flags.json').read_text(encoding='utf-8'))['stages']
    map1 = json.loads((ROOT / 'pipeline' / 'inputs' / 'build' / 'map1.json').read_text(encoding='utf-8'))
    order = [t['id'] for t in map1['tiles']]
    tiles = plan.get('tiles') or []
    if len(tiles) != 9:
        errs.append(f'expected 9 tiles, got {len(tiles)}')
    prev = None
    for i, t in enumerate(tiles):
        n = i + 1
        if t.get('n') != n:
            errs.append(f'tile {n}: n is {t.get("n")}')
        if i < len(order) and t.get('tile') != order[i]:
            errs.append(f'tile {n}: tile id {t.get("tile")}, expected {order[i]} (Map 1 order)')
        st = str(t.get('stage'))
        if st not in stages:
            errs.append(f'tile {n}: unknown stage {st}')
        else:
            if prev and ver(st) < ver(prev):
                errs.append(f'tile {n}: stage {st} goes back from {prev}')
            prev = st
        o = t.get('objective') or {}
        k = o.get('kind')
        if k not in KINDS:
            errs.append(f'tile {n}: objective kind {k} not one of {sorted(KINDS)}')
        else:
            lo, hi = KINDS[k]
            if not isinstance(o.get('count'), (int, float)) or not lo <= o['count'] <= hi:
                errs.append(f'tile {n}: {k} count {o.get("count")} outside {lo}-{hi}')
            if k == 'stealth' and st in stages and ver(st) < ver('10.8'):
                errs.append(f'tile {n}: stealth needs stage 10.8 or later')
            if k == 'incidents' and st != '10.10':
                errs.append(f'tile {n}: incidents need stage 10.10')
        if not o.get('label') or words(o.get('label')) > 5:
            errs.append(f'tile {n}: objective label missing or over 5 words')
        p = t.get('params') or {}
        if len(p) > 4:
            errs.append(f'tile {n}: {len(p)} overrides (at most 4)')
        for pid, v in p.items():
            if pid in FORBIDDEN:
                errs.append(f'tile {n}: {pid} is set by the stage')
            elif pid not in reg:
                errs.append(f'tile {n}: {pid} is not in the registry')
            else:
                val = reg[pid].get('validation') or {}
                if not isinstance(v, (int, float)) or (val.get('min') is not None and v < val['min']) or (val.get('max') is not None and v > val['max']):
                    errs.append(f'tile {n}: {pid} = {v} outside {val.get("min")}..{val.get("max")}')
        if not 15 <= words(t.get('tale')) <= 20:
            errs.append(f'tile {n}: tale has {words(t.get("tale"))} words (15-20)')
        if not 1 <= words(t.get('hint')) <= 12:
            errs.append(f'tile {n}: hint has {words(t.get("hint"))} words (1-12)')
        if not t.get('title'):
            errs.append(f'tile {n}: no title')
    used = {str(t.get('stage')) for t in tiles}
    if tiles and str(tiles[0].get('stage')) != '10.1':
        errs.append('tile 1 must be stage 10.1')
    if tiles and str(tiles[-1].get('stage')) not in ('10.9', '10.10'):
        errs.append('tile 9 must be stage 10.9 or 10.10')
    if len(used) < 7:
        errs.append(f'only {len(used)} different stages (at least 7)')
    return errs


if __name__ == '__main__':
    import sys
    e = check(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')))
    print('\n'.join(e) or 'valid')
