# DUMMIES — Pipeline audit (one page)

**7 November 2026 · Lawrence Lek** · Assignment 7. Runs: `pipeline/runs/20261107-105917-v1` (before) and `pipeline/runs/20261107-110219-v2` (after, shipped). All figures are from each run's `costs.json`.

## 1. What the pipeline produced

- **`content/story_map1.json`:** Map 1 (Monument), tiles 1–9. Per tile: ladder stage, objective, overrides, title, tale, hint, new idea.
- **Escalation:** stages 10.1 → 10.9, one new car behaviour per tile, never backwards. Objectives: 2, 2, 2, 2, 2, 2, 3, 2, 4 hits.
- **Overrides:** one, on tile 1: `duel.redReturnSeconds` 2, so the first car returns sooner.
- **Provenance:** the run, models, cost and validator result are stamped in the file. The game shows them on every card.
- **`index.html`:** built from that file, with no hand edits (`engine/build.py`).
- **Checks:**
  - Validator: 0 errors.
  - `engine/tiles_test.js`: 9 of 9 tiles load with their stage's 112–152 values; no page errors.
  - `engine/play_test.js`: an autopilot passes tile 1 in 50 s.
- **Evidence:** every prompt, raw reply, review and log line is in the run folder. The video shows the logs, the plan and play: `docs/pipeline_run.mp4`.

## 2. Manual steps left, and how to remove them

| Step | Why it's still manual | How to remove it |
|---|---|---|
| Copy the engine in from Submission 6B (`VENDOR.md`) | Copied once by hand; md5s are recorded | `pipeline/vendor.py`: fetch a pinned 6B commit, check the md5s, rewrite `VENDOR.md` |
| The ladder's measured open ways (the `OPEN`/`TEACH` tables in `ingest.py`) | Copied from 6B's QA reports | `ingest.py` reads `qa/testroad_report` output directly |
| Judging fun on tiles 2–9 | The autopilot only walks in, and only tile 1 allows that | Use 6B's bot probes as a gate: every tile's objective must be reachable at the measured rates |
| Deploy (push, Pages setting) | Pages is enabled once per repo; the API is blocked from this session | GitHub Action on push: build, test, deploy Pages |
| Video (`make_video.py`) | One command, run by hand | Add it to the same Action |

## 3. One architectural change, and the alternative

- **Change made:** agents write **data**, not code. The plan is JSON with a fixed schema. Code validates it between the model steps, and the engine loads it unchanged.
- **Alternative considered:** agents write engine code (one scene or level script per tile).
- **Why data:**
  - An 86-line validator catches every rule break, with no model needed. One rule break in v2 was fixed by a $0.09 repair pass.
  - The same file will drive Phaser, so the engine can change without re-running the pipeline.
- **Cost of this choice:** agents can only combine what the engine already supports (stages plus registry overrides). New mechanics still need a human or a coding agent.

## 4. Cost analysis (actual runs)

| Call | v1 model | v1 cost | v2 model | v2 cost |
|---|---|---|---|---|
| Designer | Opus | $1.3757 | Opus | $0.3205 |
| Reviewer | Opus | $1.2849 | Sonnet | $0.1914 |
| Refiner | Opus | $1.2486 | Sonnet | $0.1290 |
| Repair (only if invalid) | — | — | Sonnet | $0.0933 |
| **Run total** | | **$3.9092** | | **$0.7343** |

- **Total spent on pipeline runs:** $4.6435 across 2 runs, 7 model calls. Building the pipeline in Claude Code isn't metered here.
- **Most expensive step:**
  - v1: the designer ($1.3757, 35%). All three v1 calls cost about the same, because each one re-sent the 703-entry registry.
  - v2: the designer ($0.3205, 44%), the one call still on Opus.
- **Solo sustainability:**
  - At $0.73 a run, 3 maps × 10 iterations costs about $22.
  - At v1's rate, the same work costs about $117.
  - Iterating daily stays under $25 a month.

## 5. Mid-project cost reduction

| | Before (v1) | After (v2) | Change |
|---|---|---|---|
| Registry sent to agents | 703 entries | 65 entries (only the groups the plan can touch) | −91% |
| Agent input | 296,724 characters | 27,432 characters | −91% |
| Input tokens (cache write + read + fresh) | 461,915 | 126,199 | −73% |
| Output tokens | 18,864 | 20,959 | +11% |
| Models | Opus × 3 | Opus designer; Sonnet reviewer, refiner, repair | — |
| **Cost per run** | **$3.9092** | **$0.7343** | **−81%** |
| Wall time | 172.9 s | 161.7 s | −6% |

- **Filter effect, same model:** the Opus designer fell from $1.3757 to $0.3205 (−77%).
- **Model swap:** the reviewer and refiner fell from $2.5335 to $0.4137 (−84%), including the repair pass.
- **Quality held:**
  - Both final plans validate.
  - Sonnet's review still caught two high-severity issues: tile 5 taught two ideas; tile 2's hint broke `duel.standstillSpeed`.
  - The price was one repair pass.
