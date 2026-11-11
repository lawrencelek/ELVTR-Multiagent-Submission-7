# DUMMIES — Assignment 7 Handover

**11 November 2026 · Lawrence Lek** · Live doc: https://claude.ai/artifact/VZgQe8deujkHFRVCbfHUaH

An agent pipeline writes Map 1's level plan; the browser game loads it unchanged. Shipped run v3g cost $0.9660. Play: https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/

## Student & game overview

| | |
|---|---|
| **Student** | Lawrence Lek |
| **Course** | ELVTR Multi-Agent Systems · Assignment #7, Complete AI Dev Pipeline |
| **Game** | DUMMIES |
| **Genre** | Top-down action puzzle, browser |
| **Pitch** | You are a crash-test dummy. Score by getting hit by a self-driving car. |
| **Core loop** | Get into the learning car's path, too late for it to stop. It learns from every crash and closes that trick. Find a new one. |
| **Fault rule** | Only a car that hits you scores. Run into a car: damage, no score (YOUR FAULT). |
| **Scope shipped** | Story Map 1, Monument: nine tiles, A1 to C3. Car ladder rungs 0–7, then the Incident. |
| **Pipeline's job** | Write Map 1's level plan: stage, objective, overrides, title, tale, hint, new idea per tile. |

- **Progression:** one new thing a tile. The car learns a sensor, or the dummy earns a part.
- **Car ladder:** forward camera, side sensors, roof lidar, street cameras, road items, crash memory, search.
- **Dummy parts:** Battery 1 (dash), Hands 1 (cone), Super Knees (duck), Legs 1 (jump).
- **Traffic:** the fleet never learns. It is cover, then a hazard.

## Deliverable 1: Playable link

**Submit:** https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/

- **Host:** GitHub Pages. One static `index.html`. No install, no login, no download.
- **Platform:** desktop browser (Chrome, Edge, Firefox, Safari). Keyboard.
- **Built from:** `content/story_map1.json`, the pipeline's shipped plan (run v3g).
- **Last deploy:** see the repo's Pages runs; every push to `main` is mirrored to `gh-pages`.

**From link to first hit (about 60 s):**

1. Open the link. Press **Enter** twice. The first press turns the sound on.
2. STORY is selected. Press **Enter**. Choose **NEW GAME**, type a chassis name, press **Enter**.
3. The map opens on Monument. Press **Enter**. The tile card shows the tale and goal. Press **Enter**.
4. A drone drops you in. Move with **arrows** or **WASD**.
5. Walk into the red car's path. Let it hit you. One hit clears tile 1.

- **Later keys:** Space dash (tile 2) · J cone · hold C duck · L jump. Each arrives with its tile.
- **Lunge guide:** shows where a dash lands. **HIT** scores; YOUR FAULT does not.

**Also playable: Prototype 11.5, the puzzle build.** https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/p11/

- Map 1 rebuilt as nine puzzles after the tutor's 1-on-1. Three stars, instant retry (R).
- Content set by hand. The hero cars on its upgrade screen are agent output (Audit 1).
- Gamepad, keyboard and touch. Pad: A dash, B crouch, X jump, Y interact.

## Deliverable 2: Pipeline repository and video

| Field | Answer |
|---|---|
| **Pipeline repository** | https://github.com/lawrencelek/ELVTR-Multiagent-Submission-7 |
| **One command** | `python3 pipeline/run.py` |
| **Pipeline-run video** | https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/docs/pipeline_run.mp4 (repo: [`docs/pipeline_run.mp4`](pipeline_run.mp4)) |
| **Target engine** | Custom HTML5 Canvas 2D engine, plain JavaScript in the browser: Prototype 9's game with Prototype 10's driver. No framework, no WebGL. Phaser 3 is the named next port |
| **Contract** | One file, `content/story_map1.json`. The engine reads it unchanged |

**The video (2 min 48 s; the game from 0:56), in order:**

1. v1 run log, replayed with its own timestamps: full registry, Opus × 3, $3.9092.
2. v2 run log: 65-value registry, Sonnet reviewer and refiner, $0.7343.
3. v3g run log, the shipped run: designer, validate, reviewer, refiner, `wrote content/story_map1.json`, `wrote index.html`, $0.9660.
4. The plan as written: nine tiles, stage, objective, title, overrides, provenance.
5. The game loading that plan: an autopilot dummy plays from tile 1.

- Model waits are shortened and labelled. Log timestamps are as recorded.
- Builder: `python3 pipeline/make_video.py <run folders>`.

**Engine integration: what the engine does with each field**

| Plan field | Engine use |
|---|---|
| `stage` | Loads that ladder stage: the car's start rung, top rung, sensors |
| `params` | Registry overrides on top; ids and min/max validated |
| `objective` | Hits, stealth points or Incidents to clear the tile |
| `title`, `tale`, `hint`, `newIdea` | Prototype 9's level card, objective line, NEW line |
| `provenance` | Run id, world, models, validator result, cost |

- **Build:** `engine/build_p9.py` bundles Prototype 9, Prototype 10, `engine/duel.js` and the plan into one `index.html`.
- **Join:** `engine/duel.js` gives the red car Prototype 10's brain inside Prototype 9's traffic (Audit 3).
- **Guards:** every patch to `game.js` is asserted at build time. A changed upstream fails loudly.
- **Clear:** Prototype 9's own write-off, report and ferry carry the player to the next tile.

## Automated flow

![One command turns the design inputs into the playable build](img/a7_pipeline_flow.png)

- **No human step between the command and the build.** Code checks every model output. A plan that still fails after one repair is not integrated.
- **Replay:** `REPLAY=pipeline/runs/<run> python3 pipeline/run.py` re-runs from saved replies, with no model calls.
- **Versions:** `--v1` full registry, Opus throughout. `--world junction` the test road (v2). Default v3: Prototype 9's tiles.

## Deliverable 3: One-page audit

### 1. What the pipeline produced, present in the build

**Map 1's plan, `content/story_map1.json`, from run v3g. The build plays all nine tiles from it.**

| Tile | Stage | Goal in the HUD | Card title | One new thing |
|---|---|---|---|---|
| A1 | 10.2 | LET IT HIT YOU × 1 | The welcome wall | Car learns the forward camera |
| B1 | 10.3 | STEP OUT AT THE KERB × 1 | The podium bridge | Dummy earns Battery 1 (dash) |
| C1 | 10.3 | DASH INTO ITS PATH × 2 | The LED drum | Car learns side sensors |
| C2 | 10.4 | DROP INTO ITS PATH × 1 | The portal tower | Dummy earns Hands 1 (cone) |
| B2 | 10.4 | CONE-BAITED HIT × 1 | The monument | Dummy earns Legs 1 (jump) |
| A2 | 10.4 | JUMP INTO ITS PATH × 1 | The neon shops | Car learns roof lidar |
| A3 | 10.5 | DASH FROM COVER × 1 | The stacked cubes | Dummy earns Super Knees (duck) |
| B3 | 10.5 | DUCK, THEN DASH × 1 | The LED canyon | Car learns street cameras |
| C3 | 10.6 | UNSEEN DASH × 1 | The LED gateway | Car learns road items |

- **Per tile:** stage, goal, registry overrides, title, tale, hint, new idea. Overrides: A1 `duel.redReturnSeconds` 3; C1 `ui.lungeGuide` 1.
- **On screen, A1:** card tale "Fresh off the factory floor. Your first colleague is red, keen and blind. Walk out and meet it." HUD: "LET IT HIT YOU (0 of 1). Open road: walk into its path; let it hit you."
- **Checks on the shipped plan:** validator 0 errors. Reviewer: revise (tiles 7–8 asked for tricks the stage cannot offer); refiner fixed it; validator 0 errors.
- **In the build, re-tested 11 Nov 2026:** `engine/p9_tiles_test.js`: 9 of 9 tiles start with the plan's stage, rung, goal and cover; 0 page errors.
- **Provenance in the file:** run `20261107-182619-v3`, models, validator pass, cost $0.966.

**Later agent output, shipped in the Prototype 11.5 build (`/p11/`):**

- **Hero cars:** `engine/hero_cars.js`, written by the car design agent (4 rounds, self-reviewed from its own renders). Bundled as written; the host edited one sentence. Three classes, 21 parts.
- **Upgrade screen:** layout from the adversarial UI redesign agent's spec and three review rounds.
- **QA:** an adversarial QA agent played the nine puzzles through a virtual pad: 87 attack plans, 15 bug reports. Triaged into real bugs, design calls and harness faults (GDD Edit 118).

### 2. Manual steps left, and what removes each

| Manual step | Why it is still manual | What removes it |
|---|---|---|
| Copy Prototypes 9 and 10 in from Submission 6B | Copied by hand; md5s recorded in `VENDOR.md` | `pipeline/vendor.py`: fetch a pinned 6B commit, check the md5s |
| Measure difficulty after a plan | Headless bots (`engine/p9_probe.js`) run by hand; results fed back by hand | Run the probes per tile inside ingest. Feed hits a minute to the designer, as `affordances.js` feeds geometry |
| Deploy and video | One command each, run by hand | One GitHub Action: build, test, deploy Pages, render the video |
| Prototype 11's puzzle data | `content/puzzles_map1.json` written by hand after the puzzle pivot | Point the designer at the puzzle schema. Gate on the headless solutions (`qa/solutions/`) and the pressure-test agent |
| Judge fun | A person must play | Cannot be removed. Reduce it: a recorded bot session per tile in CI, for review |

- **Kept on purpose:** a person accepts agent art and text before it ships. One host edit in `hero_cars.js` (a sentence).

### 3. One architectural change, and the alternative

**Change: the learning car's brain joins Prototype 9's traffic at runtime.**

- The tile's traffic sim swaps its prototype for `DuelTileSim`, a subclass of Prototype 10's `TestRoadSim`.
- Only the red car runs Prototype 10's code: perception, lessons, memory, search. The fleet keeps Prototype 9's driver.
- `DuelStorySim` routes the red car's hits to the duel. The swap is undone when the tile clears.
- Both prototypes stay byte-identical. The join is one file, `engine/duel.js`.

**Alternative considered: rebuild Prototype 9's tiles inside `TestRoadSim`, as levels of the test road.**

- Loses the decks, the fleet, the story, the HUD.
- Splits Prototype 9 into two versions to maintain.

**Cost of the choice:** the join depends on internal names. Prototype 9: `admit`, `meets`, `level.statics`. Prototype 10: `manSpeed`, `watchField`, `spawnSpeed`, `searchStep`. The build asserts every patch, so an upstream rename fails the build, not the player.

### 4. Cost analysis (actual runs)

**The shipped content run, v3g, cost $0.9660: 3 model calls in 4 min 15 s.** 122,091 input tokens, 33,034 output. The Opus designer took 56% of it.

![The Opus designer costs most in every run; every run after v1 is under $1](img/a7_run_costs.png)

*Source: `pipeline/runs/*/costs.json` · 9 content runs, 30 model calls, 7 Nov 2026.*

- **Most expensive step: the Opus designer.** 33% to 60% of a run. Opus rates, and the longest reply: 15,488 output tokens in v3g.
- **Cache:** run back to back, its prompt stays cached. v3d's designer read 32,143 tokens from cache: $0.17, against $0.44 in v3c.
- **Content pipeline total:** $10.0053 over 9 recorded runs, 30 calls. Two runs stopped at the gate left no record (about $1 each).

**Map 1's whole agent toolchain, recorded:**

| Agent (script) | Runs | Recorded cost |
|---|---|---|
| Content pipeline (`run.py`) | 9 | $10.01 |
| Adversarial QA (`qa_attack.py`) | 1 (3 calls) | $4.55 |
| Car design (`car_design.py`) | 2 (8 rounds) | $4.88; 4 rounds unrecorded, about $5 |
| Upgrade-screen redesign (`ui_upgrade.py`) | 4 | $4.46 |
| UI review (`ui_review.py`) | 2 | $3.85 |
| Puzzle pressure test (`pressure_test.py`) | 1 | $0.94 |
| **Total** | **19** | **$28.68 recorded; about $36 with unrecorded calls** |

- **Lost records, fixed 11 Nov:** resumed runs kept call costs only in memory. `pipeline/llm.py` now appends every call to `calls.jsonl` in its run folder. Testing that fix spent $0.16.
- **Not metered here:** the Claude Code sessions that built the pipeline and engine (subscription).

**Solo and small-team sustainability:**

- **Content:** $0.52–$0.97 a run. Three maps × 10 iterations: $16–$29. At v1's rate: about $117.
- **Whole toolchain:** about $36 for Map 1. Three maps at that rate: about $110.
- **Runtime cost: zero.** The shipped game is static HTML. It makes no model calls, so cost scales with iterations, not players.
- **Verdict:** sustainable for one developer. The lever is the designer's model and its input size (section 5).

### 5. Mid-project cost reduction

**v1 to v2 cut a run by 81%: $3.9092 to $0.7343.** Same world (the test road), same agents' rules, same validator.

| | Before: v1 | After: v2 | Change |
|---|---|---|---|
| Strategy | Full registry; Opus for all three agents | Registry filtered to the values the ladder uses; Sonnet reviewer, refiner and repair | — |
| Registry sent | 703 entries | 65 entries | −91% |
| Agent input | 296,724 characters | 27,432 characters | −91% |
| Input tokens | 461,915 | 126,199 | −73% |
| Output tokens | 18,864 | 20,959 | +11% |
| **API cost a run** | **$3.9092** | **$0.7343** | **−81%** |

- **Where it came from:** the filter alone cut the Opus designer by 77% ($1.3757 to $0.3205). The Sonnet swap cut reviewer and refiner by 84%.
- **Quality held:** v2 passed the same validator, after one repair. v3b, with Prototype 9's tiles and measured facts, cost $0.66: less than v2. Its measured inputs left nothing to repair.
- **Second saving, no code change:** run back to back. The designer's prompt cache cut it from $0.44 (v3c) to $0.17 (v3d).
- **Cheapest check is code:** the validator stops a bad plan before any engine time. It caught an impossible tile, count-only labels, text where the dummy hits the car (7 errors on v3d's plan), and parts no tile used.

## Rubric map

| Criterion | Points | Evidence |
|---|---|---|
| Playable link | 2 | Deliverable 1: one URL, no setup, first hit in about 60 s |
| Pipeline-to-game connection | 3 | Automated flow; Audit 1. `story_map1.json` from run v3g is what the build loads; provenance in the file; 9 of 9 tiles tested |
| Engine integration | 2 | Deliverable 2: field-to-engine table; Audit 3: the runtime join, asserted at build |
| Cost analysis | 2 | Audit 4: $0.9660 shipped run, designer the costliest step, $28.68 toolchain, sustainability |
| Audit | 1 | Audit 1–5: produced, manual steps, architecture, cost, reduction |

## Sources

- [Playable build](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/) · [Prototype 11.5, puzzles](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/p11/)
- [Repository](https://github.com/lawrencelek/ELVTR-Multiagent-Submission-7) · [README](../README.md)
- [Pipeline-run video](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/docs/pipeline_run.mp4) · [Prototype 11.5 runthrough video](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/docs/p11_runthrough.mp4)
- [The plan, `content/story_map1.json`](../content/story_map1.json) · [run folders, `pipeline/runs/`](../pipeline/runs/)
- [Pipeline audit, `docs/02_Pipeline_Audit.md`](02_Pipeline_Audit.md) · [Prototype 9 × 10 integration analysis](01_P9_P10_Integration_Analysis.md)
- GDD: [Edit 111, Submission 7 integration](DUMMIES_GDD_Edit111_Submission7_Integration.md) · [Edit 118, QA agent](DUMMIES_GDD_Edit118_Prototype_11_2_QA_Runthrough.md) · [Edit 121, car design agent](DUMMIES_GDD_Edit121_Prototype_11_5_Liveries_Genesis_Part_Names.md)
