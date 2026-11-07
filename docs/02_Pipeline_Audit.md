# DUMMIES — Pipeline audit (one page)

**7 November 2026 · Lawrence Lek** · Assignment 7. Runs are in `pipeline/runs/`. Every figure below comes from a run's `costs.json`.

## 1. What the pipeline produced

- **The plan:** `content/story_map1.json`. Map 1 (Monument), tiles 1–9.
  - Per tile: ladder stage, objective, overrides, title, tale, hint, new idea.
  - Shipped run: `20261107-172210-v3` (v3f), $0.8443.
- **Escalation:**
  - Stages, one a tile: 10.2 → 10.3 → 10.4 → 10.5 → 10.6 → 10.7 → 10.8 → 10.9 → 10.10. The car learns once a tile, at the clear.
  - Tricks, tile by tile: walk into its path, dash into its path, drop into its path, spring from tall cover, cover the cameras miss, duck then step out, a new spot each hit, step out from behind traffic.
  - Then the Incident: make it stop hard, and a tailgater runs into it.
  - Every line puts the dummy in the car's path: only a car that hits the dummy scores (the fault rule).
- **Hints name what the tile has:** they come from Prototype 9's plan and the measured affordances.
  - C1: "Ride the Z2 escalator; walk off the parapet gap into its path."
  - The hints name the tile's measured roadside cover: B1 "Wait by the kiosk", A2 "Hold C behind the planter", A3 "Billboard first, then the hedge".
- **The game:** `index.html`.
  - Prototype 9's Monument (art, fleet, decks, HUD, sound) with Prototype 10's red car.
  - It loads the plan unchanged, and Prototype 9's own clear carries the player to the next tile.
- **Checks:**
  - Validator: 0 errors.
  - `engine/p9_tiles_test.js`: 9 of 9 tiles.
  - The play test clears tiles 1–2 with the first lesson, cutting in ahead of the car.
  - Headless bots (`engine/p9_probe.js`) score on every tile; see §2.
- **Evidence:** every prompt, reply, review and log line is in the run folders. The video shows the runs and the game: `docs/pipeline_run.mp4`.

## 2. Manual steps left, and how to remove them

| Step | Why it's still manual | How to remove it |
|---|---|---|
| Copy Prototypes 9 and 10 from Submission 6B (`VENDOR.md`) | Copied by hand; md5s are recorded | `pipeline/vendor.py`: fetch a pinned 6B commit, check the md5s |
| Difficulty on Prototype 9's tiles | Fixed in the engine, measured by hand. Before: a bot dashing into a slowed car's corner cleared five tiles in under 25 s. Now that bot scores nothing (B1: 10 dashes, 10 at its own fault). On plan v3f a cover bot clears A1 in 19 s, B1 36, C1 57, C2 19, A2 20, A3 231, B3 7, C3 50 (Incident); B2 not in 8 min (it cannot path round the ring road) | Run `engine/p9_probe.js` per tile inside ingest. Feed hits a minute to the designer, as `affordances.js` already feeds geometry |
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
- **Cost of the change:** the duel relies on a few internal names: Prototype 9's `admit`, `meets` and `level.statics`; Prototype 10's `manSpeed`, `watchField`, `spawnSpeed` and `searchStep` (the red car's brakes). The build asserts every patch, so a change upstream fails loudly.

## 4. Cost analysis (actual runs)

| Run | World | Designer | Reviewer | Refiner | Repair | Total |
|---|---|---|---|---|---|---|
| v1 | test road, full registry | Opus $1.3757 | Opus $1.2849 | Opus $1.2486 | — | $3.9092 |
| v2 | test road, 65 values | Opus $0.3205 | Sonnet $0.1914 | Sonnet $0.1290 | Sonnet $0.0933 | $0.7343 |
| v3a | Prototype 9 tiles | Opus $0.4136 | Sonnet $0.1913 | Sonnet $0.1443 | Sonnet $0.0991 | $0.8483 |
| v3b | + measured affordances | Opus $0.3599 | Sonnet $0.1567 | Sonnet $0.1470 | — | $0.6637 |
| v3c | + playtest fixes | Opus $0.4381 | Sonnet $0.1573 | Sonnet $0.1440 | — | $0.7394 |
| v3d | + label rule; cached prompt | Opus $0.1726 | Sonnet $0.1378 | Sonnet $0.1085 | Sonnet $0.1044 | $0.5233 |
| v3e | + fault rule, red brakes | Opus $0.4699 | Sonnet $0.1602 | Sonnet $0.1467 | — | $0.7768 |
| v3f (shipped) | + one lesson a tile, roadside cover | Opus $0.4648 | Sonnet $0.2374 | Sonnet $0.1422 | — | $0.8443 |

- **Total spent:** $9.0393 on 8 runs and 27 model calls. Building the pipeline and the integration in Claude Code isn't metered here.
- **Most expensive step:** the Opus designer, at 35% of v1, 54% of v3b, 60% of v3e and 55% of v3f. In v3d its prompt was still cached from v3c (71,280 tokens read from cache), and it cost $0.17. v3e changed its prompt (the fault rule), so nothing was cached: $0.47.
- **Solo sustainability:**
  - At $0.52–0.84 a run, 3 maps × 10 iterations cost $16–25.
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
- **The cheaper check is code:** the validator caught an impossible tile (a planter where none fits) before any play-test, count-only labels after the playtest fixes, and text that has the dummy hit the car after the fault rule. On the v3d plan that last rule finds 7 errors; v3e passes with none.
- **Second saving: run back to back.** The designer's prompt stays cached for a few minutes. v3d's designer read 32,143 tokens from cache and cost $0.17, against $0.44 in v3c.
