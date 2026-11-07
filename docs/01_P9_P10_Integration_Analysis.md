# DUMMIES — P9 × P10 integration analysis

**7 November 2026 · Lawrence Lek** · Step [1] of Assignment 7. Sources: Submission 6B at `18860f1` (Prototype 9, `prototypes/p9`; Prototype 10.1–10.10, `prototypes/p10`), `content/story/story_v2.json`, GDD Edits 100–110.

## 1. What P9 is

- **Build:** `prototypes/p9/build.py` bundles P8.4's game with the sound engine: `p6/sim.js` (296 KB), `world6.js` (257 KB, the three districts), `game.js` (357 KB), `pixel.js`, `content.js`, `circus_valley.js`, `p7/story.js`, `p8/lore.js`, `content/audio/cues.json`, `p9/audio.js`.
- **Maps:** three districts, each a 3×3 grid of tiles (A1–C3), one tile per screen.

| Map | District | Act | Tile order | Road |
|---|---|---|---|---|
| 1 | Monument | I · Induction | A1 B1 C1 C2 B2 A2 A3 B3 C3 | One road snakes under two north–south highways (Z1, Z2 decks) and splits round the monument (B2) |
| 2 | Parkland | II · Opening Day | C1 C2 C3 B3 A3 A2 A1 B1 B2 | Park roads, roundabout, lantern pavilion |
| 3 | Waterfront | III · Customs | A1 B1 C1 C2 C3 B3 A3 A2 B2 | Valley avenue, tunnel, bridges, river |

- **Per tile:** a task (any, dash, drop, jump, level, cone, push, class), a gift (a part: battery1, arms1, legs3…), a tale (15–20 words, Dummy Corporation).
- **Cars:** the fleet (`content/db/fleet.json`): sedans, vans, buses, by class. Every car is a target. No car learns.
- **Verticality:** decks (Z1, Z2), skybridges, escalators, the monument's island ring. Drops and jumps use them.

## 2. What P10 adds

The red car's learning ladder, built on one junction (the Monument test road) in `testroad.js` (`TestRoadSim`, a subclass of the shared `Sim`). Every system is gated by a registry value (default off), so the frozen stages stay byte-identical.

| Stage | The red car learns | Closes | Leaves open (measured, ≥ 0.3 hits/min) |
|---|---|---|---|
| 10.1 | Nothing | — | walk in 3.73, flank 2.54, aim 1.8 |
| 10.2 | The beam: brakes for a dummy in its lane | standing in its lane | flank 2.81, walk in 1.94 |
| 10.3 | The side field, in stages | the open flank | jump 2.69, plinth 2.67, gap 2.07 |
| 10.4 | Roof lidar: sees the raised dummy | the plinth | jump 2.69, gap 2.21 |
| 10.5 | Street cameras: the link sees behind cover | springs from cover | cone bait 2.0, lurk 0.8 |
| 10.6 | Stops for cones; DUCK for the dummy | cone bait | planter ambush 3.03, lurk 0.8 |
| 10.7 | Crash memory: watches every crash spot | the same spot | roaming 6.97, lurk 0.6 |
| 10.8 | The search (ghost); sight cones; forget in 3 s | hiding after being seen | roaming 2.87, lure 2.24, crawl 1.21 |
| 10.9 | Two-way roads; white cars that never learn | — | 12 ways: moving cover |
| 10.10 | Tailgating white cars: the Incident | — | Incidents about 0.6/min |

Also: the lunge guide, the stealth grade, the lure and stop line, the block lift (FARSIGHT drone), the save-file field note, the proportional sight field (x, 2x, 3x).

## 3. Integration: what ports, what must be generalised

| P10 system | Lives in | Into P9's full maps | Effort |
|---|---|---|---|
| Learning ladder (rungs, lessons, clip) | `TestRoadSim` + `game_p10.js` | Works per car: give each tile one red learner; the rest of the fleet is white | M |
| Beam, side field, cones, stages, forget | `assessBody`, `coneOf`, `sideStage` | Pure geometry on car heading and path: ports as is | S |
| Lidar (raised dummy) | `assessBody` | P9 has real decks (Z1, Z2): map "raised" to the deck layer | M |
| Street cameras (link) | `level.cameras` | Needs camera placements per tile: content, not code | S (data) |
| Crash memory, search, lure | `sites`, `memory`, `searchStep` | Per-car memory: works on any path; spots are world coordinates | S |
| White traffic, Incident | `admitWhite`, `incidents` | P9 already has traffic: tag the fleet white; the Incident needs same-path following, which P9 has | S |
| Junction give-way | `junctionCap` (`path.box`) | P9's junctions are rings and splits with their own give-way (`giveWayHold`): keep P9's | — |
| Two-way lanes | `junctionLevel` | Test-road only. P9's roads define their own lanes | — |
| Lunge guide, stealth grade, HUD | `game_p10.js` | Re-draw in P9's renderer (`game.js`) or in Phaser | M |
| Bot probes (QA) | `qa/testroad.js` | Bot homes are junction coordinates: need per-tile spots | M |

- **Main blocker:** `TestRoadSim` assumes the junction level (`this.testRoad`, roads A and B, `level.statics`, `level.cameras`). Fix: lift the red-car methods into a mixin that reads lanes, statics and cameras from any level.
- **Second:** P9's renderer (`game.js`, 357 KB) and P10's (`game_p10.js`) differ. The target engine is Phaser, so draw once there; do not merge the two canvas renderers.

## 4. Story mode first (this submission)

- **First cut (v2):** Map 1, tiles 1–9, on the P10 junction (the Monument test road), one ladder stage per tile. Kept as `junction.html`.
- **Now (v3, §6):** Map 1 in Prototype 9's own Monument district, with Prototype 10's red car on each tile.
- **Escalation is data:** each tile = stage + objective + overrides + tale + hint. The pipeline designs it; code validates it; the engine loads it unchanged (`content/story_map1.json`).
- **Why the junction first:** every stage is measured there (bot probes). The pipeline's designer can test objectives against measured open ways, so the curve is checked, not guessed.

## 5. Next (Phaser)

- Port `sim.js` + the red-car mixin as engine-agnostic modules (no canvas); Phaser scenes draw them.
- One Phaser scene per tile; P9's tile geometry (`world6.js`) as level data; the same `story_map1.json`.
- Maps 2 and 3: the same pipeline, with each district's tiles and a ladder continued past rung 7.

## 6. Built: Prototype 9 with Prototype 10's red car (index.html)

- **The game is Prototype 9:** the district, tiles, decks, escalators, art, fleet, tile cards, gifts, HUD and sound. Its files are vendored unchanged (`engine/p9`).
- **The driver is Prototype 10:** `testroad.js` unchanged. `engine/duel.js` joins it to Prototype 9's traffic at runtime. `engine/build_p9.py` bundles both with the plan.

| Piece | How it joins |
|---|---|
| The red car's brain | The tile in test's ground traffic sim swaps its prototype for `DuelTileSim`, a subclass of `TestRoadSim`. Red cars get Prototype 10's perception and choices; every other car keeps Prototype 9's (`p9call`, `p9`). The swap is undone when the tile clears. |
| Lanes and kerbs | Read from the tile's own lanes. The kerbs (`path.edges`) run across the oncoming lane where one exists. |
| Height (rung 3) | Prototype 9's decks are the plinth. The lidar meets a dummy on a deck (`meets`). A drop through a parapet gap counts as a hit from above. |
| Cover and low cover | Prototype 9's statics hide the dummy. Its planters are low cover (`props.planter.height`). Planter rows are added along the road from 10.6 (`duel.planters`), never under a deck. |
| Street cameras (rung 4) | Placed by code on the kerb, at a third and two thirds of the road, aimed back up it. |
| Hits, lessons, memory, search | `DuelStorySim` (Prototype 9's `StorySim`) routes red hits to the duel's crash record, stealth grade and `learnFrom`. A lesson card shows once the car has left. |
| Objective and clear | The plan's count of red hits. When it is met, Prototype 9's own clear runs: write-off, report, ferry, the next tile's card. |
| White cars | Prototype 9's fleet; no learning (`proto.learningEnabled` 0, `proto.learn.standoffEnabled` 0). From 10.9 it is moving cover (`whiteHides`). The fleet runs lighter in the tile in test until 10.9 (`story.traffic.monument.*` 0.5). |
| Sight field | 10.9's proportional cones (x, 2x, 3x) for every stage from rung 2. |
| Parts | Prototype 9's gifts (Battery 1 at B1, Hands 1 at A2, Legs 1 at B3). DUCK from tile 6 (hold C). |

- **Not yet:** the Incident (10.10; no tile uses it); the lesson's training-clip replay (a card instead); bot probes per Prototype 9 tile.
- **Phaser next:** the same split. Phaser draws Prototype 9's tiles; the sim modules and `duel.js` run unchanged under it.
