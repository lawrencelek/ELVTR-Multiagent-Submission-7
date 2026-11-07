"""Step 3 (no model): hard checks on a story-mode plan. Returns a list of errors; empty means the engine can load it."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
KINDS = {'hits': (1, 5), 'stealth': (50, 1500), 'incidents': (1, 3)}
FORBIDDEN = {'duel.startRung', 'duel.topRung'}


def ver(k):
    return tuple(int(x) for x in str(k).split('.'))


def words(s):
    return len(str(s or '').split())


TEST_ROAD_ONLY = ('plinth', 'barrier', 'junction')  # v3: features of the test road that Prototype 9's tiles do not have
# the fault rule (Lawrence, 7 Nov): a dummy that runs into a car scores nothing, so no text may tell the player to
YOUR_FAULT = re.compile(r"\binto (a|the|that) (red |white )?(car|sedan)\b(?!'s)|\bas it (passes|rolls past|goes by)\b|\bstrike (it|the car|as)\b")


def progression(tiles, stages):
    """Lawrence (7 Nov, 18:06): each tile progresses one thing: the car learns (earns 'car') or the player earns a part. Every
    upgrade is necessary: a part is used by the next tile's trick; a car lesson closes a trick already played. The tile's level must
    offer its trick, its trick must need only parts already earned, and the car must not have closed it yet."""
    R = json.loads((ROOT / 'engine' / 'progression.json').read_text(encoding='utf-8'))
    aff = {t['id']: (t.get('prototype9') or {}).get('measured') or {} for t in json.loads((ROOT / 'pipeline' / 'inputs' / 'build' / 'map1.json').read_text(encoding='utf-8'))['tiles']}
    errs, rung, owned, played = [], 0, set(), []
    start = lambda st: ((stages.get(st) or {}).get('flags') or stages.get(st) or {}).get('duel.startRung')
    for i, t in enumerate(tiles):
        n, earn, lvl, tr, st = t.get('n'), t.get('earns'), t.get('level'), t.get('trick'), str(t.get('stage'))
        if earn != 'car' and earn not in R['parts']:
            errs.append(f'tile {n}: earns {earn!r}: one of car, {", ".join(R["parts"])}')
        if lvl not in R['levels']:
            errs.append(f'tile {n}: level {lvl!r}: one of {", ".join(R["levels"])}')
        elif lvl not in (aff.get(t.get('tile')) or {}).get('levelsThatFit', R['levels']):
            errs.append(f'tile {n}: level {lvl} does not fit {t.get("tile")} (measured: {", ".join(aff[t["tile"]]["levelsThatFit"])})')
        if tr not in R['tricks']:
            errs.append(f'tile {n}: trick {tr!r}: one of {", ".join(R["tricks"])}'); continue
        T = R['tricks'][tr]
        if start(st) != rung:
            errs.append(f'tile {n}: stage {st} starts the car at rung {start(st)}; after the lessons before it, it is at rung {rung}')
        if lvl in R['levels'] and lvl not in T['levels']:
            errs.append(f'tile {n}: trick {tr} needs a level of {", ".join(T["levels"])}, not {lvl}')
        miss = [p for p in T['needs'] if p not in owned]
        if miss:
            errs.append(f'tile {n}: trick {tr} needs {", ".join(miss)}, not yet earned')
        if T['closedBy'] <= rung:
            errs.append(f'tile {n}: trick {tr} is closed at rung {T["closedBy"]} ({R["rungs"][T["closedBy"]]}); the car is at rung {rung}')
        if i > 0:
            pe = tiles[i - 1].get('earns')
            if pe in R['parts'] and pe not in T['needs']:
                errs.append(f'tile {n}: tile {n - 1} earned {pe}, but this tile\'s trick ({tr}) does not need it: every part must be needed on the next tile')
        played.append(tr)
        if earn == 'car':
            rung += 1
            if rung >= len(R['rungs']):
                errs.append(f'tile {n}: the car has no rung {rung} to learn')
            elif not any(R['tricks'][p]['closedBy'] == rung for p in played):
                errs.append(f'tile {n}: the car learns {R["rungs"][rung]}, which closes no trick played so far: every lesson must be necessary')
        elif earn in R['parts']:
            if earn in owned:
                errs.append(f'tile {n}: {earn} earned twice')
            owned.add(earn)
            if i == len(tiles) - 1:
                errs.append(f'tile {n}: the last tile earns a part no tile uses')
    if tiles and tiles[0].get('earns') != 'car':
        errs.append('tile 1 must earn car: the first lesson')
    return errs


def check(plan, world='junction'):
    errs = []
    if world == 'p9':
        aff = {t['id']: (t.get('prototype9') or {}).get('measured') or {} for t in json.loads((ROOT / 'pipeline' / 'inputs' / 'build' / 'map1.json').read_text(encoding='utf-8'))['tiles']}
        for t in plan.get('tiles', []):
            m = aff.get(t.get('tile'), {})
            lab = str((t.get('objective') or {}).get('label') or '').upper()
            if 'WRITE-OFF' in lab or re.fullmatch(r'(HITS?|INCIDENTS?|POINTS?)\s*:?\s*\d*', lab.strip()):
                errs.append(f'tile {t.get("n")}: label {lab!r} must name the move (the HUD counts the number; the objective is hits by the red car, not write-offs)')
            if m and not t.get('level') and not m.get('plantersForAnAmbush') and 'planter' in (str(t.get('hint')) + str(t.get('newIdea'))).lower():
                errs.append(f'tile {t.get("n")}: the plan uses a planter, but {t.get("tile")} has no roadside planter (measured)')
            cov = (m.get('coverByLevel') or {}).get(t.get('level')) if t.get('level') else [k for k, v in (m.get('roadsideCover') or {}).items() if v]
            for w in ('cabinet', 'kiosk', 'billboard', 'hedge', 'planter', 'bollard', 'k-rail'):
                if m and cov is not None and w.replace('-', '') not in cov and w in (str(t.get('hint')) + str(t.get('newIdea'))).lower():
                    errs.append(f'tile {t.get("n")}: the plan names a {w}, but {t.get("tile")}\'s level {t.get("level")} places none (measured: {", ".join(cov) or "no cover"})')
            if m and not m.get('deckOverRoad') and any(w in str(t.get('hint')).lower() for w in ('drop', 'parapet')):
                errs.append(f'tile {t.get("n")}: the plan drops from a deck, but no deck crosses {t.get("tile")}\'s road (measured)')
            for f in ('hint', 'tale', 'newIdea', 'label'):
                txt = str(((t.get('objective') or {}).get('label') if f == 'label' else t.get(f)) or '').lower()
                if YOUR_FAULT.search(txt):
                    errs.append(f'tile {t.get("n")}: {f} {txt!r} has the dummy hit the car; only a car that hits the dummy scores (the fault rule): put the dummy in its path')
            for f in ('hint', 'tale', 'newIdea'):
                bad = [w for w in TEST_ROAD_ONLY if w in str(t.get(f) or '').lower()]
                if bad:
                    errs.append(f'tile {t.get("n")}: {f} names {", ".join(bad)}, which Prototype 9\'s tiles do not have')
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
    if world == 'p9':  # the one-thing-a-tile rule replaces the stage rules
        return errs + progression(tiles, stages)
    first = '10.2' if world == 'p9' else '10.1'  # p9 (Lawrence, 7 Nov): the car learns at A1's clear, so tile 1 is the first lesson
    if tiles and str(tiles[0].get('stage')) != first:
        errs.append(f'tile 1 must be stage {first}')
    if world == 'p9':  # one lesson a tile, at its clear: each tile starts where the last one's lesson left the car
        rung = lambda st, k: (stages.get(st) or {}).get('flags', stages.get(st) or {}).get(k)
        for a, b in zip(tiles, tiles[1:]):
            sa, sb = str(a.get('stage')), str(b.get('stage'))
            if sa in stages and sb in stages and rung(sb, 'duel.startRung') != rung(sa, 'duel.topRung'):
                errs.append(f'tile {b.get("n")}: stage {sb} starts at rung {rung(sb, "duel.startRung")}, but tile {a.get("n")} ({sa}) ends at rung {rung(sa, "duel.topRung")}')
    if tiles and str(tiles[-1].get('stage')) not in ('10.9', '10.10'):
        errs.append('tile 9 must be stage 10.9 or 10.10')
    if len(used) < 7:
        errs.append(f'only {len(used)} different stages (at least 7)')
    return errs


if __name__ == '__main__':
    import sys
    e = check(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')))
    print('\n'.join(e) or 'valid')
