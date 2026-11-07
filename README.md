# DUMMIES — Story Mode, Map 1 · Assignment 7: the complete AI dev pipeline

| | |
|---|---|
| **Student** | Lawrence Lek |
| **Game** | DUMMIES |
| **Playable link** | **https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/** |
| **Repository** | https://github.com/lawrencelek/ELVTR-Multiagent-Submission-7 |
| **Pipeline-run video** | [`docs/pipeline_run.mp4`](docs/pipeline_run.mp4) (1 min 36 s) · [play in the browser](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/docs/pipeline_run.mp4) |
| **One-page audit** | [`docs/02_Pipeline_Audit.md`](docs/02_Pipeline_Audit.md) |
| **P9 × P10 integration analysis** | [`docs/01_P9_P10_Integration_Analysis.md`](docs/01_P9_P10_Integration_Analysis.md) |
| **Target engine** | Phaser 3 (next). Today: the Prototype 10 web build, HTML5 Canvas 2D |

## Concept

- You are a crash-test dummy at a city junction. You score by getting hit by a red self-driving car.
- The car learns from every crash and closes the trick you used, so you need a new one each tile.
- Dummy Corporation narrates. Certification is the goal.
- Map 1 (Monument) has nine tiles. Each tile adds one rung of the car's learning ladder: the beam, side sensors, roof lidar, street cameras, cones, crash memory, the search, then two-way traffic.

## Play (2 minutes)

1. Open the link. Tile 1's card shows the story, the objective and the keys.
2. Press **Enter** (or click START TILE).
3. Move with **arrows or WASD** and walk into the red car's lane. Two hits pass tile 1, which takes about a minute.
4. Tile 2 opens. **Space** dashes. **R** restarts a tile. Progress saves in the browser.

## Pipeline

```
python3 pipeline/run.py            # one command: ingest → designer → validate → reviewer → refiner (→ repair) → integrate → build
```

| # | Step | Kind | In → out |
|---|---|---|---|
| 1 | `ingest.py` | code | 6B's registry (703 values), story file and ladder → `pipeline/inputs/build/{ladder,map1,registry}.json` (registry filtered to 65) |
| 2 | designer (`agents/designer.md`) | Claude Opus | inputs → a nine-tile plan (JSON) |
| 3 | `validate.py` | code | schema, registry ids and ranges, stage order, word counts → errors |
| 4 | reviewer (`agents/reviewer.md`) | Claude Sonnet | plan → issues against the fun-escalation rules |
| 5 | refiner (`agents/refiner.md`) | Claude Sonnet | plan + review (+ validator errors) → final plan; one repair pass if it still fails |
| 6 | integrate | code | final plan + provenance → `content/story_map1.json` → `engine/build.py` → `index.html` |

- **Model calls:** headless `claude -p` with a fixed system prompt and no tools. Every prompt, raw reply, cost and token count is saved under `pipeline/runs/<run>/`.
- **Gate:** if the plan still fails validation after the repair pass, the run stops and integrates nothing.
- **Replay:** `REPLAY=pipeline/runs/<run> python3 pipeline/run.py` re-runs from the saved replies, with no model calls.
- **Tests:**
  - `node engine/tiles_test.js`: all nine tiles load with their stage values.
  - `node engine/play_test.js [--video docs/video]`: an autopilot plays tile 1 to PASSED.
- **Video:** `python3 pipeline/make_video.py <run dirs>` builds `docs/pipeline_run.mp4` from the run logs, the plan and the recorded play test.

## Engine integration

- **Contract:** the engine and the pipeline share one file, `content/story_map1.json`. The engine reads it unchanged.

  | Field | Engine use |
  |---|---|
  | `stage` | That stage's registry values (`window.DUMMIES_STAGES[stage].flags`): what the red car knows |
  | `params` | Registry overrides on top (validated ids, min/max) |
  | `objective` | `engine/story.js`: HUD counter and win test (hits by red, stealth points, incidents) |
  | `title`, `tale`, `hint`, `newIdea` | The tile card |
  | `provenance` | Shown on every card: run, models, validator, cost |

- **Today:** `engine/build.py` bundles the vendored Prototype 10 engine (`engine/vendor`, byte-identical to Submission 6B at `18860f1`; see `VENDOR.md`) with the plan into one self-contained `index.html`. GitHub Pages serves it.
- **Phaser (next):**
  - A boot scene loads the same JSON (`this.load.json`).
  - A `TileScene` per tile builds the sim from the tile's stage values plus overrides, steps it in `update()`, and draws with Phaser.
  - The pipeline doesn't change.
  - Prerequisite: lift the red-car systems out of `TestRoadSim` into an engine-agnostic module (analysis §3).

## Cost (actual)

| Run | Models | Registry sent | Input tokens | Output tokens | Cost |
|---|---|---|---|---|---|
| v1 (before) | Opus × 3 | 703 entries | 461,915 | 18,864 | $3.9092 |
| v2 (after, shipped) | Opus designer; Sonnet reviewer, refiner, repair | 65 entries | 126,199 | 20,959 | **$0.7343 (−81%)** |

## Layout

```
pipeline/   run.py ingest.py validate.py llm.py make_video.py · agents/*.md · inputs/ · runs/<run>/
engine/     build.py story.js tiles_test.js play_test.js · vendor/ (Prototype 10, from Submission 6B)
content/    story_map1.json   (pipeline output)
docs/       01 analysis · 02 audit · pipeline_run.mp4
index.html  the playable build
```
