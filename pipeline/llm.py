"""One agent call = one fresh headless Claude Code session: its own system prompt, no tools, no shared memory.

The pattern of Assignments 3 to 6. Needs `claude` on the PATH, signed in; no API key in the code. Every input and output
is saved in the run folder, with tokens and cost (USD, as reported by the CLI). REPLAY=<run folder> reuses a run's saved
outputs by label (no model calls), so a run can be checked again exactly.
"""
import json
import os
import re
import shutil
import subprocess
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CLAUDE = shutil.which('claude') or 'claude'


class Run:
    def __init__(self, folder):
        self.dir = Path(folder)
        self.dir.mkdir(parents=True, exist_ok=True)
        self.calls = []

    def save(self, name, obj):
        (self.dir / name).write_text(obj if isinstance(obj, str) else json.dumps(obj, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')

    def log(self, line):
        stamp = time.strftime('%H:%M:%S')
        print(f'[{stamp}] {line}', flush=True)
        with open(self.dir / 'run.log', 'a', encoding='utf-8') as f:
            f.write(f'[{stamp}] {line}\n')


def call(run, role, model, message, label, tools=''):
    """The agent's reply text. Saves <label>_input.md, <label>_output_raw.txt and the call's usage. tools: none by default;
    'Read' lets a reviewer look at the screenshots in its run folder (the adversarial UI review)."""
    system = (ROOT / 'agents' / f'{role}.md').read_text(encoding='utf-8')
    if getattr(run, 'world', None) == 'p9':  # v3: the agents design for Prototype 9's tiles
        system += (ROOT / 'agents' / 'world_p9.md').read_text(encoding='utf-8')
    run.save(f'{label}_system.md', system)
    run.save(f'{label}_input.md', message)
    replay = os.environ.get('REPLAY')
    if replay and (Path(replay) / f'{label}_output_raw.txt').exists():
        text = (Path(replay) / f'{label}_output_raw.txt').read_text(encoding='utf-8')
        run.save(f'{label}_output_raw.txt', text)
        run.calls.append({'label': label, 'role': role, 'model': model, 'replayed': True, 'cost_usd': 0})
        return text
    cmd = [CLAUDE, '-p', '--system-prompt', system, '--tools', tools, '--output-format', 'json', '--no-session-persistence', '--model', model]
    if tools:
        cmd += ['--allowedTools', tools]
    t0 = time.time()
    for attempt in (1, 2):
        proc = subprocess.run(cmd, input=message, capture_output=True, text=True, encoding='utf-8', timeout=1500, cwd=str(run.dir))
        if proc.returncode == 0:
            break
        if attempt == 2:
            raise RuntimeError(f'{role} call failed (exit {proc.returncode}): {(proc.stderr or proc.stdout)[-800:]}')
        time.sleep(5)
    env = json.loads(proc.stdout)
    text = env.get('result') or ''
    run.save(f'{label}_output_raw.txt', text)
    u = env.get('usage') or {}
    rec = {'label': label, 'role': role, 'model': model, 'seconds': round(time.time() - t0, 1), 'cost_usd': env.get('total_cost_usd'),
           'input_tokens': u.get('input_tokens'), 'cache_write_tokens': u.get('cache_creation_input_tokens'),
           'cache_read_tokens': u.get('cache_read_input_tokens'), 'output_tokens': u.get('output_tokens'),
           'prompt_chars': len(system) + len(message), 'models': sorted((env.get('modelUsage') or {}).keys())}
    run.calls.append(rec)
    return text


def json_of(text):
    """The first JSON object in a reply (fences and prose around it are dropped)."""
    m = re.search(r'```(?:json)?\s*(\{.*\})\s*```', text, re.S)
    s = m.group(1) if m else text[text.find('{'): text.rfind('}') + 1]
    return json.loads(s)
