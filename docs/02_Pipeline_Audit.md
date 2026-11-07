# DUMMIES — Pipeline audit (one page)

**7 November 2026 · Lawrence Lek** · Assignment 7. Runs are in `pipeline/runs/`. Every figure below comes from a run's `costs.json`.

## 1. What the pipeline produced

- **The plan:** `content/story_map1.json`. Map 1 (Monument), tiles 1–9.
  - Per tile: ladder stage, objective, overrides, title, tale, hint, new idea.
  - Shipped run: `20261107-123424-v3`, $0.6637.
- **Escalation:**
  - Stages: 10.1 → 10.2 → 10.3 → 10.4 → 10.5 → 10.5 → 10.6 → 10.7 → 10.10.
  - Tricks, tile by tile: walk-in, dash, deck drop, cover, the camera-blind column, cone bait, planter ambush, jump.
  - Then the Incident.
- **Hints name what the tile has:** they come from Prototype 9's plan and the measured affordances.
  - C1: "Ride the Z2 escalator; walk through the parapet gap as it nears."
  - A2 had no room for a planter, so the agents gave it the cone bait; A3 has room, so it got the planter ambush.
- **The game:** `index.html`.
  - Prototype 9's Monument (art, fleet, decks, HUD, sound) with Prototype 10's red car.
  - It loads the plan unchanged, and Prototype 9's own clear carries the player to the next tile.
- **Checks:**
  - Validator: 0 errors.
  - `engine/p9_tiles_test.js`: 9 of 9 tiles.
  - The play test clears tiles 1–2 (80 s), with the first lesson.
  - Headless bots clear every tile, in 4–42 s.
- **Evidence:** every prompt, reply, review and log line is in the run folders. The video shows the runs and the game: `docs/pipeline_run.mp4`.

## 2. Manual steps left, and how to remove them

| Step | Why it's still manual | How to remove it |
|---|---|---|
| Copy Prototypes 9 and 10 from Submission 6B (`VENDOR.md`) | Copied by hand; md5s are recorded | `pipeline/vendor.py`: fetch a pinned 6B commit, check the md5s |
| Difficulty on Prototype 9's tiles | A chasing-dash bot clears most of tiles 2–8 in under 20 s. The rate measures are from the test road | Run the probe bots per tile inside ingest. Feed hits a minute to the designer, as `affordances.js` already feeds geometry |
| Judging fun | A human must play | A short recorded play session per tile in CI, for review |
| Deploy, video | One command each, run by hand | One GitHub Action: build, test, deploy Pages, render the video |

## 3. One architectural change, and the alternative

- **Change made:** the red car's brain joins Prototype 9's traffic at runtime.
  - The tile in test's traffic sim swaps its prototype for `DuelTileSim` (a subclass of `TestRoadSim`).
  - Only the red car uses Prototype 10's code; the fleet keeps Prototype 9's driver.
  - The swap is undone when the tile clears.
  - Both prototypes stay byte-identical (`engine/duel.js`).
- **Alternative considered:** rebuild Prototype 9's tiles inside `TestRoadSim`, as levels of the test road.
  - That would lose the decks, the fleet, the story and the HUD.
  - It would also split Prototype 9 into two versions.
- **Cost of the change:** the duel relies on a few internal names in Prototype 9's sims (`admit`, `meets`, `level.statics`). The build asserts every patch, so a change upstream fails loudly.

## 4. Cost analysis (actual runs)

| Run | World | Designer | Reviewer | Refiner | Repair | Total |
|---|---|---|---|---|---|---|
| v1 | test road, full registry | Opus $1.3757 | Opus $1.2849 | Opus $1.2486 | — | $3.9092 |
| v2 | test road, 65 values | Opus $0.3205 | Sonnet $0.1914 | Sonnet $0.1290 | Sonnet $0.0933 | $0.7343 |
| v3a | Prototype 9 tiles | Opus $0.4136 | Sonnet $0.1913 | Sonnet $0.1443 | Sonnet $0.0991 | $0.8483 |
| v3b (shipped) | + measured affordances | Opus $0.3599 | Sonnet $0.1567 | Sonnet $0.1470 | — | $0.6637 |

- **Total spent:** $6.1555 on 4 runs and 14 model calls. Building the pipeline and the integration in Claude Code isn't metered here.
- **Most expensive step:** the Opus designer, at 35% of v1 and 54% of v3b.
- **Solo sustainability:**
  - At $0.66 a run, 3 maps × 10 iterations cost about $20.
  - At v1's rate, the same work costs about $117.

## 5. Mid-project cost reduction

| | Before (v1) | After (v2) | Change |
|---|---|---|---|
| Registry sent | 703 entries | 65 entries | −91% |
| Agent input | 296,724 chars | 27,432 chars | −91% |
| Input tokens | 461,915 | 126,199 | −73% |
| Output tokens | 18,864 | 20,959 | +11% |
| **Cost per run** | **$3.9092** | **$0.7343** | **−81%** |

- **Where the saving came from:**
  - The filter alone cut the Opus designer by 77%.
  - The Sonnet swap cut the reviewer and refiner by 84%.
- **v3b cost less than v2,** although it carries Prototype 9's tiles and measured facts. The facts left nothing to repair, so v3b needed no repair pass (v2 and v3a each needed one).
- **The cheaper check is code:** the validator caught an impossible tile (a planter where none fits) before any play-test.
