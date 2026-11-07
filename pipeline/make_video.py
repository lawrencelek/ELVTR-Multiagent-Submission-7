#!/usr/bin/env python3
"""Evidence video: the pipeline's own run log, replayed line by line as a terminal (timestamps as logged, long model
waits shortened and labelled), the plan it wrote (content/story_map1.json), then the game loading that plan
(engine/p9_play_test.js --video: Prototype 9's Monument with Prototype 10's red car). Output: docs/pipeline_run.mp4.

  python3 pipeline/make_video.py pipeline/runs/<v1 run> pipeline/runs/<v2 run>
"""
import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
W, H, FPS = 1280, 720, 10
FONT = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 15)
BIG = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf', 26)
BG, FG, DIM, YEL, GRN, RED = (12, 14, 20), (220, 226, 232), (127, 168, 188), (255, 212, 0), (159, 242, 200), (255, 90, 90)


def wrap(line, n=150):
    out = []
    while len(line) > n:
        out.append(line[:n]); line = '    ' + line[n:]
    return out + [line]


def frame(lines, title):
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    d.rectangle([0, 0, W, 34], fill=(26, 30, 40)); d.text((14, 8), title, font=FONT, fill=DIM)
    y = 46
    for ln in lines[-37:]:
        col = YEL if ' designer' in ln or ' reviewer' in ln or ' refiner' in ln else GRN if 'validate: 0' in ln or 'done' in ln or 'wrote' in ln else RED if 'error' in ln and 'validate: 0' not in ln else DIM if ln.startswith('    ') else FG
        d.text((14, y), ln, font=FONT, fill=col); y += 18
    return im


def card(text_lines, sub=''):
    im = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(im)
    y = 220
    for i, t in enumerate(text_lines):
        d.text((80, y), t, font=BIG if i == 0 else FONT, fill=YEL if i == 0 else FG); y += 44 if i == 0 else 24
    if sub:
        d.text((80, H - 80), sub, font=FONT, fill=DIM)
    return im


def main():
    runs = [Path(a) for a in sys.argv[1:]]
    tmp = ROOT / 'pipeline' / '.video'
    shutil.rmtree(tmp, ignore_errors=True); tmp.mkdir()
    n = 0

    def put(im, secs):
        nonlocal n
        for _ in range(max(1, int(secs * FPS))):
            im.save(tmp / f'f{n:05d}.png'); n += 1

    put(card(['DUMMIES · story-mode pipeline', 'Assignment 7: the complete AI dev pipeline.', 'Map 1 (Monument), tiles 1-9, designed by agents from the red car\'s learning ladder,',
              "validated by code, written to content/story_map1.json, loaded by Prototype 9's game with Prototype 10's red car."], 'github.com/lawrencelek/ELVTR-Multiagent-Submission-7'), 4)
    for r in runs:
        lines, shown = (r / 'run.log').read_text(encoding='utf-8').splitlines(), []
        for ln in lines:
            for w in wrap(ln):
                shown.append(w)
                wait = 1.6 if ('...' in ln) else 0.35
                put(frame(shown + (['    (model call; shortened in this video: see the timestamps)'] if '...' in ln else []), f'$ python3 pipeline/run.py {"--v1" if r.name.endswith("v1") else "--world junction" if r.name.endswith("v2") else ""}   # {r.name}'), wait)
        put(frame(shown, f'{r.name}: costs.json'), 2.5)
    plan = json.loads((ROOT / 'content' / 'story_map1.json').read_text(encoding='utf-8'))
    rows = ['content/story_map1.json  (pipeline output, loaded by the engine as written)', '']
    for t in plan['tiles']:
        rows.append(f'{t["n"]}  {t["tile"]}  {t["stage"]:<6} {t["objective"]["kind"]} x{t["objective"]["count"]:<5} {t["title"][:30]:<30}  {", ".join(f"{k}={v}" for k, v in (t.get("params") or {}).items())[:60]}')
    rows += ['', 'provenance: ' + json.dumps(plan.get('provenance'))[:140]]
    put(frame(rows, 'the plan'), 7)
    put(card(['Engine: the plan, playing', "index.html: Prototype 9's Monument district (art, fleet, decks, HUD, sound) with Prototype 10's red car.", "Each tile plays the plan's stage, objective, title, tale and hint. An autopilot dummy plays tile 1 and on."], 'Target engine: Phaser (next step).'), 3)
    for i, f in enumerate(sorted(tmp.glob('f*.png'))):
        pass
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-framerate', str(FPS), '-i', str(tmp / 'f%05d.png'), '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', '-vf', f'fps=30,scale={W}:{H}', str(tmp / 'a.mp4')], check=True)
    vids = sorted((ROOT / 'docs' / 'video').glob('*.webm'), key=lambda p: p.stat().st_mtime)
    parts = [tmp / 'a.mp4']
    if vids:
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(vids[-1]), '-vf', f'fps=30,scale={W}:{H}:force_original_aspect_ratio=decrease,pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:color=0x0c0e14', '-c:v', 'libx264', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', str(tmp / 'b.mp4')], check=True)
        parts.append(tmp / 'b.mp4')
    (tmp / 'list.txt').write_text(''.join(f"file '{p}'\n" for p in parts))
    out = ROOT / 'docs' / 'pipeline_run.mp4'
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', str(tmp / 'list.txt'), '-c', 'copy', str(out)], check=True)
    shutil.rmtree(tmp, ignore_errors=True)
    print(f'video: {out.relative_to(ROOT)} {out.stat().st_size:,} bytes')


if __name__ == '__main__':
    main()
