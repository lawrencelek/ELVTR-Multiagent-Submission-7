# Prototype 11 QA: an analog pad, an adversarial agent, a full runthrough

The tools behind GDD Edits 118 and 119. Everything drives the game as a player does: taps on the game's own tap targets, keys, and a virtual gamepad whose left stick takes any angle and strength (360°). Keyboard players get eight directions; phone thumbsticks and console pads do not.

| File | Does |
|---|---|
| `pad.js` | Injected before the game (Playwright `addInitScript`). Three parts: a virtual standard gamepad behind `navigator.getGamepads()`; a 10 Hz monitor (NaN, off the tile, across a fence, inside a solid, pinned, no red car, stuck rescue or write-off, progress on a fault, page errors, screens); and the attack language, `window.__qaRun(script)`. The script reads the game's state and acts only through the pad and the keyboard |
| `headless.js` | The same attack language on the headless story sim, at sim speed. Use it to design and tune scripts before the browser runs them |
| `attack.js` | Runs attack plans, each in its own page from a save at that puzzle, two or more browsers in parallel. `--geo` exports the nine tiles as an attacker needs them: solids, decks, gaps, stairs, route, cover, cameras and cones |
| `clicks.js` | Click everywhere. Taps a grid over every screen it reaches, then the game's tap targets, keys and pad buttons. Flicks the stick, resizes, blurs, unplugs the pad. Reports screens, transitions, errors, stuck screens and blank canvases |
| `runthrough.js` | The full game, recorded: every menu, a new save, nine puzzles, quit and reload, continue, Certification, Arcade |
| `bot.js` | The cut-in bot, headless at sim speed: the bosses' check (Edit 126) |
| `solutions/<tile>.json` | One pad script per puzzle that clears it, tuned headless and run in the browser. Pad layout (P11.3, Edit 119): A dash, B crouch (hold), X jump, Y interact (cones) |

The agent: `python3 pipeline/qa_attack.py` (prompt `pipeline/agents/qa_adversary.md`).
1. Round 1: it writes attack plans and one intended-solution plan per puzzle.
2. Run: `attack.js` runs them.
3. Round 2: it digs into what it found.
4. Report: it writes the bug list.

Runs go to `pipeline/runs/<stamp>-qa/`.

**Last results (12 Nov):**
- FINAL V2.1 (Edit 126): <!--RT126-->. Every Map 2 and Map 3 script clears headless and through the pad in the browser. Bosses: Map 2 scripted (`parkland_C3.json`), Map 3 by the cut-in bot (`node qa/bot.js waterfront:C3 200`).
- FINAL V2.1 (Edits 124-125): runthrough pass, nine Map 1 puzzles first try, 6 min 24 s ([video](../docs/final_v21_runthrough.mp4)). Map 2's six built puzzles: `qa/solutions/parkland_*.json`, all ★★★ headless, all clear in the browser (`node qa/headless.js parkland:A1 qa/solutions/parkland_A1.json`).

**Earlier (9 Nov):**
- Runthrough (FINAL V2, Edit 123: cleaned screens, two hits on A1 and B1): pass, nine puzzles on the first try, 5 min 27 s ([video](../docs/final_v2_runthrough.mp4)). Default build: `final_v2`.
- Click everywhere: 1,653 actions, clean.
- The agent: 87 plans and 15 reported bugs, checked in GDD Edit 118 §118.3.

```
node qa/runthrough.js qa/runs/runthrough p11
node qa/runthrough.js qa/runs/runthrough final_v2 --all   # 27 puzzles and the send-off
node qa/bot.js parkland:C3 200                             # the cut-in bot, headless
node qa/clicks.js qa/runs/clicks 10 7 p11
node qa/headless.js B2 qa/solutions/B2.json 80
python3 pipeline/qa_attack.py --model opus --par 2 --page p11
```
