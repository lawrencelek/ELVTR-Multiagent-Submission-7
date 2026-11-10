# DUMMIES — Story Mode, Map 1 · Assignment 7: the complete AI dev pipeline

| | |
|---|---|
| **Student** | Lawrence Lek |
| **Game** | DUMMIES |
| **Playable link** | **https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/** |
| **Repository** | https://github.com/lawrencelek/ELVTR-Multiagent-Submission-7 |
| **Pipeline-run video** | [`docs/pipeline_run.mp4`](docs/pipeline_run.mp4) (2 min 48 s) · [play in the browser](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/docs/pipeline_run.mp4) |
| **One-page audit** | [`docs/02_Pipeline_Audit.md`](docs/02_Pipeline_Audit.md) |
| **P9 × P10 integration** | [`docs/01_P9_P10_Integration_Analysis.md`](docs/01_P9_P10_Integration_Analysis.md) · GDD [Edit 111](docs/DUMMIES_GDD_Edit111_Submission7_Integration.md) |
| **Prototype 11.5 (puzzles)** | **https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/p11/** · GDD [Edit 113](docs/DUMMIES_GDD_Edit113_Prototype_11_Architecture.md), [Edit 116](docs/DUMMIES_GDD_Edit116_Prototype_11_1_Kit.md), [Edit 117](docs/DUMMIES_GDD_Edit117_Prototype_11_2_Sensor_Feedback.md), [Edit 119](docs/DUMMIES_GDD_Edit119_Prototype_11_3_Snake_Pad_Upgrade.md), [Edit 120](docs/DUMMIES_GDD_Edit120_Prototype_11_4_Crouch_Luminary_Hero_Car.md), [Edit 121](docs/DUMMIES_GDD_Edit121_Prototype_11_5_Liveries_Genesis_Part_Names.md) · frozen: [P11.0](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/p11_0/), [P11.1](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/p11_1/), [P11.2](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/p11_2/), [P11.3](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/p11_3/), [P11.4](https://lawrencelek.github.io/ELVTR-Multiagent-Submission-7/p11_4/) |
| **Target engine** | Phaser 3 (next). Today: Prototype 9's HTML5 Canvas engine, with Prototype 10's driver |

## Concept

- You are a crash-test dummy in Dummy Corporation's smart city. You score by getting hit by a red self-driving car.
- The red car learns from every crash and closes the trick you used, so you need a new one on each tile.
- The rest of the traffic never learns. It is cover, and later a hazard.
- Map 1 (Monument) has nine tiles. Each tile adds one rung of the car's learning ladder:
  - the beam;
  - side cones;
  - roof lidar (it sees you up on a deck);
  - street cameras;
  - road items;
  - crash memory;
  - the search;
  - then the Incident, where tailgating traffic runs into the red car.

## Play (2 minutes)

1. Open the link. Press **Enter** twice (the first press turns the sound on). STORY is selected; press **Enter**.
   - The save screen: **NEW GAME** (name your chassis, Enter), or **CONTINUE** a save. Saves stay in this browser.
   - The story map opens on Monument; press **Enter**.
2. The tile card shows the tale and the objective. Press **Enter** or **Space**. A drone drops you in.
3. Move with **arrows or WASD**. Walk into the red car's path and let it hit you: two hits clear tile 1, in about a minute.
4. Only a car that hits you scores. Get into its path, too late for it to stop. Run or dash into a car and you take damage for nothing (YOUR FAULT).
5. The dummy walks and runs at 70% of Prototype 9's speed: ambush the car, don't chase it. Later tiles bring more keys:
   - **Space** dashes (Battery 1, tile 2).
   - **J** puts down a cone (Hands 1, tile 6).
   - Hold **C** to duck (tile 6).
   - **L** jumps (Legs 1, tile 8).
   - Escalators lead up to the decks; drop onto a car through a gap in a deck's parapet.
6. The lunge guide shows where a dash lands: **HIT** if the car would hit you there, YOUR FAULT if you would hit it.
7. Each tile progresses one thing: the red car learns, or you earn a part. A car lesson replays your hit as its training clip and fits the new sensor; a part arrives with the drone on the way to the next tile, where you will need it. A1 teaches the car its forward camera; B1 earns you the dash; C1 teaches it side sensors.
8. A car that hits you stops, stands a moment, then drives round you.
9. Each tile's level sets its cover: signal cabinets, kiosks and billboards hide you standing; K-rails need a jump; once you earn Super Knees, hold **C** to duck behind planters and hedges.

`junction.html` is the earlier version: the same plan on Prototype 10's one-junction test road.

## Prototype 11: the puzzle game (8 Nov, GDD Edits 112–113)

- Story Map 1 as nine puzzles, A1 to C3, after Joshua Burdick's 1-on-1: one new thing a puzzle, three stars, instant retry, a level grid (Hitman GO's structure).
- **Built:** all nine (GDD [Edit 115](docs/DUMMIES_GDD_Edit115_Map1_Redesign.md)), in a snake across the grid (GDD [Edit 119](docs/DUMMIES_GDD_Edit119_Prototype_11_3_Snake_Pad_Upgrade.md)): A1 First Contact, B1 Stop Line, C1 High Road, C2 Portal, B2 CCTV, A2 Swerve, A3 The Stacks, B3 LED Canyon, C3 Certification. One car, the LUMINARY™ SED-01-001 (the CEO car, grey metallic; Edits 120–121), learns rungs 0 to 7 across them; certified, it returns on Map 2 as a drone car. Map 2's learner: VANGUARD™ POL-01-001, the police car, white and black; Map 3's: GENESIS™ SPT-01-001, the racing car, red.
- **Pad (P11.3, Edit 119):** A dash, B crouch (gained with Super Knees; a toggle by default, hold in Controls, P11.4), X jump (no Legs in Map 1), Y interact (cones). Keys: Space dash, C crouch, J jump, E interact.
- **The hero car (P11.4–11.5, Edits 120–121):** a car design agent (`python3 pipeline/car_design.py`) drew the upgrade screen's cars in the level's pixel style, each in its livery, with parts named in its own trade (OUTLOOK … LIMELIGHT; EYEWITNESS … MANHUNT; RACING LINE … RECON LAP): `engine/hero_cars.js`.
- **The car's upgrade screen (P11.3, Edit 119):** after an adversarial UI redesign agent (`python3 pipeline/ui_upgrade.py spec|review`): the Dummy Chassis gift screen's family. RED-01 nose up; a drone lowers the new piece; it lands on the replay's frame of impact; the name pops; one sentence on what it learned; your hit loops in a box.
- **Inventory:** every tile of the three districts and the level design assets: [docs/DUMMIES_Level_Inventory.md](docs/DUMMIES_Level_Inventory.md) (`node engine/inventory.js`; pictures: `node engine/inventory_shots.js`).
- **QA (P11.2, GDD [Edit 118](docs/DUMMIES_GDD_Edit118_Prototype_11_2_QA_Runthrough.md)):** an adversarial QA agent plays the nine puzzles through a virtual 360° analog gamepad (`python3 pipeline/qa_attack.py`); a click-everywhere crawler; a full runthrough of the game with real inputs, every menu, a save and a reload, recorded (`node qa/runthrough.js`). One pad script per puzzle clears it (`qa/solutions/`). Tools: [`qa/README.md`](qa/README.md).
- **Sensor feedback (P11.2, GDD [Edit 117](docs/DUMMIES_GDD_Edit117_Prototype_11_2_Sensor_Feedback.md)):** one sensor language. Prototype 9's hatch, side outlines, headlight wedge, bubbles and brake fans are off in the puzzles. Each sensor draws what it does: the forward camera a ribbon along its lane with a too-late zone and stop bar; the side sensors steel-blue fans with pings; the roof lidar a lilac sweep with returns; cameras an always-on pan cone. Ground fields are cut by cover and decks, as the sim sees. Two adversarial UI reviews: `python3 pipeline/ui_review.py --label <name> --brief "..."`.
- **RED-01's kit (P11.1, GDD [Edit 116](docs/DUMMIES_GDD_Edit116_Prototype_11_1_Kit.md)):** one sedan, one livery; each rung bolts one piece into a fixed slot, in its field's colour. Lens bar, mirror pods, roof puck, link fin, bumper strip, tally marks, searchlight. The tag counts rungs in squares; the lesson's fitting shows the new piece close up.
- **Keys:** as above, plus **R** to restart the puzzle in place. Pause has Restart puzzle and the puzzle grid.
- **Stars:** ★ Clear (the red car hits you, its fault) · ★ Untouched (no white car, no fault of yours) · ★ Par (the attempt's time).
- **The boss:** three hits; it learns crash memory after the first and the search after the second. A dash into a street camera's post breaks it.
- **Arcade:** locked until Certification is passed. Saves are Prototype 11's own (three slots).
- **Pressure test** (GDD [Edit 114](docs/DUMMIES_GDD_Edit114_Pressure_Test_Vehicles.md)): a puzzle level design specialist agent (`pipeline/agents/puzzle_designer.md`) reads the design and headless probes of all nine puzzles (`engine/p11_probe.js`), and returns a verdict per puzzle. `python3 pipeline/pressure_test.py` ($0.94 a run).
- Content: `content/puzzles_map1.json` (set by hand). Engine: `engine/p11.js`, `engine/p11_ui.js`. Build: `python3 engine/build_p9.py --p11`. Test: `node engine/p11_test.js --boss 200`.

## Pipeline

```
python3 pipeline/run.py            # one command: ingest → designer → validate → reviewer → refiner (→ repair) → integrate → build
```

| # | Step | Kind | In → out |
|---|---|---|---|
| 1 | `ingest.py` | code | The ladder (10 stages), Map 1's tiles with their Prototype 9 geometry, and the registry (65 of 703 values). `engine/affordances.js` measures each tile on the built world: lanes, a deck over the road, roadside planters, tall cover |
| 2 | designer (`agents/designer.md` + `world_p9.md`) | Claude Opus | inputs → a nine-tile plan (JSON) |
| 3 | `validate.py` | code | Schema, registry ids and ranges, stage order, word counts. It also refuses test-road features and anything a tile does not have, as measured |
| 4 | reviewer | Claude Sonnet | plan → issues against the fun-escalation rules |
| 5 | refiner | Claude Sonnet | plan + review (+ validator errors) → final plan; one repair pass if it still fails |
| 6 | integrate | code | final plan + provenance → `content/story_map1.json` → `engine/build_p9.py` → `index.html` (and `engine/build.py` → `junction.html`) |

- **Model calls:** headless `claude -p` with a fixed system prompt and no tools. Every prompt, raw reply, cost and token count is saved under `pipeline/runs/<run>/`.
- **Gate:** a plan that still fails validation is not integrated.
- **Versions:**
  - `--v1`: the full registry, Opus throughout.
  - `--world junction`: v2, the test road.
  - The default is v3: Prototype 9's tiles.
- **Replay:** `REPLAY=pipeline/runs/<run> python3 pipeline/run.py` re-runs from the saved replies, with no model calls.
- **Tests:**
  - `node engine/p9_tiles_test.js`: all nine tiles start with their stage, rung and red car, with no page errors.
  - `node engine/p9_play_test.js --tile N [--through M] [--video DIR]`: an autopilot plays from tile N. It cuts in ahead of the red car.
  - `node engine/p9_probe.js <tile> [flank|cutin|cover] [seconds]`: a headless bot per tile. It counts hits the car caused, contacts the dummy caused and the clear time.
  - `junction.html` keeps `engine/tiles_test.js` and `engine/play_test.js`.
- **Video:** `python3 pipeline/make_video.py <run dirs>` builds `docs/pipeline_run.mp4` from the run logs, the plan and a recorded play test.

## Engine integration

- **The game is Prototype 9:** districts, tiles, decks, escalators, art, fleet, tile cards, gifts, HUD and sound. It is vendored unchanged in `engine/p9`.
- **The driver is Prototype 10:** `engine/vendor/testroad.js`, also unchanged.
- **`engine/duel.js` joins them at runtime.**
  - The tile in test's ground traffic sim swaps its prototype for `DuelTileSim`, a subclass of `TestRoadSim`. The red car gets Prototype 10's perception, lessons, memory and search; the fleet keeps Prototype 9's driver.
  - `DuelStorySim` (Prototype 9's story sim) routes the red car's hits to the duel. It clears the tile through Prototype 9's own write-off, report and ferry.
  - **Fault rule:** a contact scores only when the vehicle hit the dummy (its share of the closing speed, at contact). Every vehicle.
  - **Brakes:** the red car brakes at the registry's `traffic.hardBraking` (600, Prototype 10's). The fleet keeps Prototype 9's 79.
- **`engine/duel_ui.js`** draws the red car's field and lessons on Prototype 9's HD layer.
- **`engine/build_p9.py`** bundles everything into one `index.html`. Its patches to `game.js` (keys, hooks) are asserted at build time.
- **The contract** is one file, `content/story_map1.json`, which the engine reads unchanged.

  | Field | Engine use |
  |---|---|
  | `stage` | That stage's values: the red car's start rung, top rung, sensors |
  | `params` | Registry overrides on top (validated ids, min/max) |
  | `objective` | The tile's count of red hits, stealth points or Incidents; met, the tile clears |
  | `title`, `tale`, `hint`, `newIdea` | Prototype 9's level card, objective line and the NEW line |
  | `provenance` | The run, world, models, validator result and cost |

- **GDD:** Edit 111 states the rules as built; `docs/DUMMIES_GDD_Current_State.md` indexes the whole GDD with them merged (§13).
- **Phaser (next):** the same split. Phaser draws Prototype 9's tiles; `sim.js`, `testroad.js` and `duel.js` run under it unchanged. The pipeline doesn't change.

## Cost (actual)

| Run | World | Models | Input tokens | Output tokens | Cost |
|---|---|---|---|---|---|
| v1 | test road | Opus × 3, full registry | 461,915 | 18,864 | $3.9092 |
| v2 | test road | Opus designer; Sonnet reviewer, refiner, repair; 65 values | 126,199 | 20,959 | $0.7343 |
| v3a | Prototype 9 | as v2, with tile geometry | 132,388 | 20,241 | $0.8483 |
| v3b | Prototype 9 | as v3a, with measured affordances | 103,018 | 19,416 | $0.6637 |
| v3c | Prototype 9 | after the playtest fixes (decks out of sight, 70% speed); count-only labels | 103,969 | 14,533 | $0.7394 |
| v3d | Prototype 9 | as v3c; the validator refuses count-only labels; the designer's prompt cached from v3c | 137,313 | 16,575 | $0.5233 |
| v3e | Prototype 9 | the fault rule and the red car's brakes; the validator refuses text that has the dummy hit the car | 105,337 | 16,134 | $0.7768 |
| v3f | Prototype 9 | one lesson a tile, at the clear; roadside cover measured per tile | 107,026 | 22,468 | $0.8443 |
| v3g (shipped) | Prototype 9 | one thing a tile: car, player, level (`engine/progression.json`); two earlier tries stopped at the gate, unrecorded | 122,091 | 33,034 | **$0.9660** |

## Layout

```
pipeline/   run.py ingest.py validate.py llm.py make_video.py · agents/*.md · inputs/ · runs/<run>/
engine/     build_p9.py duel.js duel_ui.js affordances.js p9_tiles_test.js p9_play_test.js p9_probe.js · p9/ (Prototype 9) · vendor/ (Prototype 10)
            p11.js p11_ui.js p11_test.js p11_goto.js p11_probe.js p11_shots.js inventory.js inventory_shots.js (Prototype 11: build_p9.py --p11)
            build.py tiles_test.js play_test.js story.js (junction.html)
content/    story_map1.json   (pipeline output) · puzzles_map1.json (Prototype 11, by hand)
audio/      Prototype 9's music and effects
docs/       01 analysis · 02 audit · GDD Edit 111 · pipeline_run.mp4
index.html  the playable build · junction.html  the test-road build · p11/index.html  Prototype 11.5, the puzzles · p11_0/ to p11_4/  Prototypes 11.0 to 11.4, frozen
```
