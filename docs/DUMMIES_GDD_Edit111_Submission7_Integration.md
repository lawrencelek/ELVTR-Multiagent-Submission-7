# DUMMIES GDD — Edit 111: Prototype 9 × Prototype 10 (Submission 7)

**7 November 2026, rewritten 18:40.** Story mode, Map 1 (Monument), tiles 1–9. Build: `index.html`. Sources: `engine/duel.js`, `engine/duel_ui.js`, `engine/progression.json`, `engine/build_p9.py`, `content/story_map1.json` (run `20261107-182619-v3`, v3g). This edit states the rules as built; §111.12 lists the playtest rounds that set them.

## 111.1 Scope

- **World:** Prototype 9's game, unchanged on disk. Districts, tiles, decks, fleet, save screen, tile cards, gifts, HUD, sound.
- **Driver:** Prototype 10's red car (`testroad.js`, unchanged) drives the tile in test.
- **Plan:** the pipeline sets each tile's stage, objective, title, tale, hint and new idea.
- **Registry:** every value is a registry ID. Proposed, not yet registered:

  | ID | Value | Section |
  |---|---|---|
  | `scoring.whiteShare` | 0.2 | 111.6 |
  | `scoring.redDamageBonus` | 1 | 111.6 |
  | `scoring.faultShare` | 0.5 | 111.5 |
  | `scoring.faultMinSpeed` | 20 | 111.5 |
  | `traffic.hitStandSeconds` | 2 | 111.5 |

- **Parts, levels, tricks:** `engine/progression.json` (not registry values).

## 111.2 Progression: one thing a tile (Lawrence, 18:06)

- **Rule:** each tile progresses one thing. The CAR learns a rung, or the PLAYER earns a part. The LEVEL changes to make it matter.
- **Every upgrade is necessary:**
  - a part earned on a tile is used by the next tile's trick;
  - a car lesson closes a trick already played.
- **The three (`engine/progression.json`):**
  - **Car:** rungs 0–7 (Prototype 10's ladder).
  - **Player:** parts Battery 1 (dash), Legs 1 (jump), Super Knees (duck), Hands 1 (cones).
  - **Level:** layouts open, kerb, setback, deck, rail, tall, low, watched, cones. Tricks name their needs, their levels and the rung that closes them.
- **Plan v3g:**

  | Tile | Level | Car plays at | Trick | Earned at the clear |
  |---|---|---|---|---|
  | A1 | open road | rung 0, blind | walk into its path | CAR: forward camera |
  | B1 | tall cover at the kerb | rung 1 | hide at the kerb; step into its path late | PLAYER: Battery 1 (dash) |
  | C1 | tall cover set back | rung 1 | dash from the cover into its path | CAR: side sensors |
  | C2 | the Z2 deck, no cover | rung 2 | drop through the parapet gap into its path | PLAYER: Hands 1 (cones) |
  | B2 | no cover; cones | rung 2 | cone in its lane; stand where it swerves | PLAYER: Legs 1 (jump) |
  | A2 | K-rails, tall cover behind | rung 2 | run and jump the K-rail into its path | CAR: roof lidar |
  | A3 | watched cover (no cameras act below rung 4) | rung 3 | dash from the unwatched cover | PLAYER: Super Knees (duck) |
  | B3 | low cover only | rung 3 | duck behind a planter; dash into its path | CAR: street cameras |
  | C3 | watched cover | rung 4 | dash from the cover no camera sees | CAR: road items (to Map 2) |

- **Objective:** only the red car's hits count, at its fault, with 10 or more lost.
- **The car:** plays the whole tile at its rung (the stage whose `duel.startRung` is that rung). A part tile sets `duel.topRung` to `duel.startRung`.
- **At the clear,** after the write-off and before the report:
  - a car tile shows the lesson (§111.3);
  - a part tile shows the part card. Prototype 9's drone fits the part on the way to the next tile (its gift screen); Super Knees is fitted at once.
- **Panel:** "CLEAR THE TILE: IT LEARNS ⟨sensor⟩" or "CLEAR THE TILE: YOU EARN ⟨part⟩".
- **Between tiles:** the objective line shows the next tile's plan objective.

## 111.3 The lesson (Prototype 10's beats, in the game's graphics)

- **Beat 1, the training clip** (`duel.lessonClipSeconds` 3):
  - The game redraws the last 3 s of the tile from its recording: the tile's art, Prototype 9's sprites for cars and dummy.
  - Camera marks over it: a light green tint, scan lines, REC, the clock.
  - The frame of impact holds (`duel.lessonHoldSeconds` 0.8), boxed: IMPACT · ⟨zone⟩. Rung 6 marks the same spot; rung 7 the last-seen point.
- **Beat 2, the fitting** (`duel.lessonFitSeconds` 2): on that frame, a drone lowers the sensor onto the red car. Its new field draws out from the car.
- **Card:** what it now does, what is closed, what is open.
- **Keys:** Enter skips to the card; Enter on the card continues to the report.

## 111.4 The red car

- **One at a time** (`duel.carsOnRoad`); back `duel.redReturnSeconds` after it leaves the screen.
- **Brakes:** `traffic.hardBraking` 600, the registry's and Prototype 10's. The fleet keeps Prototype 9's 79 (Highway Code, P1.7).
  - Prototype 10's safe envelope assumes 600. At 79 it crawls by a suspected dummy.
  - Stop from cruise (`vehicles.sedan.cruiseSpeed` 138): 57 px with `perception.reactionDelay` 0.3.
- **Cones:** it sees road items at every rung (`perception.forwardLength`). Rung 0 is blind to the dummy only.
- **Standstill:** below `duel.standstillSpeed` a walk or a dash into it does nothing.
- **Height:** a dummy on a deck or walkway is out of its world at every rung. Rung 3's lidar sees a jump or a fall onto its road.
- **Line of sight:** Prototype 9's buildings, walls, booths, columns, sculptures and the monument block it. Masses by drawn height (`proto.art.extrusion`); low cover by `props.planter.height`.
- **Sight field:** 10.9's proportional cones (`perception.coneRadius`, `perception.forwardGrades`, `perception.sideGrades`) from rung 2.
- **Street cameras (rung 4):** up to 3, on the kerb by tall cover, aimed back up the road. None reaches a roadside planter or the tile's first tall cover piece: one hiding place is always unwatched.
- **Block lift:** after `duel.blockSeconds` (10 from 10.2), a drone lifts the dummy clear of any car it keeps waiting: the red car, the red car that hit it, or the fleet.

## 111.5 Contact: fault and the stop

- **Fault:** at contact, compare speeds along the contact normal, just before it.
  - The vehicle is at fault when it gives at least half the closing speed (`scoring.faultShare`) and moves at `scoring.faultMinSpeed` or more.
  - Its fault: points, objective, lesson.
  - Yours (you ran, dashed or stepped into it): damage only. Flash: YOU HIT IT · YOUR FAULT · NO POINTS.
  - Every vehicle. A drop counts while the car moves. A bounce keeps the first hit's fault.
- **The stop:** a car that hits the dummy, at either fault, brakes at `traffic.hardBraking` and stands `traffic.hitStandSeconds`. Then it drives on.
  - Having hit you, the red car drives as Prototype 9's cars do: it stops for you and passes round you. It no longer watches its field.
- **Lunge guide** (`ui.lungeGuide`): where a dash lands. HIT where the car would hit you; YOUR FAULT where you would hit it.

## 111.6 Scoring

- **Red car:** Prototype 9's points for the hit, plus its damage (`scoring.redDamageBonus`).
- **White car:** a fifth of Prototype 9's points (`scoring.whiteShare`).
- **Floor:** other hits in the tile in test hold at `story.missFloor` (`story.floorHold`).
- **Incident (10.10):** `scoring.incidentPoints`; counts toward the objective once the dummy has moved.

## 111.7 Cover

- **Roadside cover on every tile**, one family a map. Placed by code beside the red car's road; painted into the tile's art; solid.
- **Monument (urban):**

  | Kind | Size (w × d) | Hides |
  |---|---|---|
  | Signal cabinet | 44 × 22 | a standing dummy |
  | Digital kiosk | 30 × 20 | a standing dummy |
  | Billboard | 64 × 12 | a standing dummy |
  | Planter | 120 × 16 | a ducking dummy (`props.planter.height`) |
  | Hedge | 96 × 16 | a ducking dummy (18) |
  | Bollard row | 10 × 10, 38 apart | nothing: it blocks the dummy, never a car |

- **Placement rules:**
  - On the kerb or a clear body-width off it, with a 34-wide strip behind to hide in.
  - 30 clear of every static; never under a deck.
  - Tall pieces stand north of a road that runs across the screen, so they never draw over the lane.
- **Dash:** vaults a planter or a hedge; stops at tall cover and bollards.
- **DUCK:** a part, Super Knees: hold C once earned. Speed × `movement.duckSpeedFactor`.
- **K-rail** (level rail): 120–150 × 12 on the kerb in front of set-back tall cover. Low cover (16); a dash stops at it; a running jump clears it (`world.jumpableHeight`).
- **Level layouts** set what a tile places (`engine/progression.json`): kerb (tall at the kerb), setback (tall 84–96 off it), rail, tall, low, watched (tall and low; cameras), open, deck, cones (none).
- **Proposed families:** industrial (crates, dumpsters) and garden (hedges, statues, columns) for Maps 2–3. Breakable and interactive pieces (shelters, hydrants, chargers, vendor carts) come later.

## 111.8 White cars

- **Fleet:** Prototype 9's driver; it never learns (`proto.learningEnabled` 0, `proto.learn.standoffEnabled` 0).
- **Density:** 0.5 in the tile in test until 10.9; 1.0 from 10.9 (`story.traffic.monument.<tile>`), where the fleet is moving cover (`duel.twoWay`).
- **10.10:** the fleet tailgates (`traffic.whiteTimeGap`) and brakes no harder than `traffic.whiteBraking`. Open: Prototype 9's driver at a short gap instead (Lawrence).
- **Fleet update (proposed, open):** the fleet takes the red car's certified lessons between maps, never between tiles.

## 111.9 The dummy

- **Speed:** 70% of Prototype 9's. `movement.walkSpeed` 56.7; `movement.runSpeed` 113.4.
- **Parts:** earned at a tile's clear (§111.2). Prototype 9's gift drone fits Battery 1, Legs 1 and Hands 1 on the way to the next tile; the plan moves Prototype 9's gift tiles to match. Super Knees is the duel's own. The duel's own drone stays home (`duel.*Arrives` 0).
- **Unstick:** pressed against a car and not moving for 0.6 s, the dummy steps to the nearest free ground.

## 111.10 Flow and interface

- **Story:** Prototype 9's save screen (NEW GAME, CONTINUE, RENAME, ERASE), the name, the parts splash, the story map, the tile card.
- **Tile card:** the plan's tale and objective; a NEW line for the stage's idea.
- **Panel:** the car's rung; what the clear brings (its lesson or your part); HOLD C · DUCK once earned.
- **Field overlays:** beam; cones and rings; ? and ! stages; notice meter; stop line; ghost; crash outlines and remembered spots; cameras; lunge guide; block-lift countdown.
- **Red car:** Prototype 9's sedan, repainted red; roof sensors.
- **Sound:** volume starts at 5 of 10 (`audio.settings.master`); a saved setting wins.

## 111.11 The pipeline (v3)

- **Each tile's facts:** road and set piece from Prototype 9's plan, and measured affordances (`engine/affordances.js`): lanes, a deck over the road, roadside cover by kind.
- **Validator refuses:**
  - test-road words (plinth, barrier, junction);
  - a level the tile cannot take (`levelsThatFit`) or a cover kind its level does not place;
  - count-only labels;
  - text that has the dummy hit the car;
  - a chain that breaks §111.2: tile 1 not a car lesson, a part no next tile needs, a lesson that closes nothing played, a trick already closed or needing a part not yet earned, a stage that does not start at the car's rung.
- **Runs stopped by the gate** still record their cost (`costs.json`), from 18:30.
- **Probes:** `engine/p9_probe.js` (flank, cut-in, cover bots). Plan v3g, cover bot, 4 min:

  | Tile | Clear time |
  |---|---|
  | A1 | 7 s |
  | B1 | 116 s |
  | C1 | 138 s |
  | C2 | not cleared (the bot does not drop) |
  | B2 | not cleared (the bot does not use cones) |
  | A2 | 119 s |
  | A3 | 5 s |
  | B3 | 175 s |
  | C3 | 6 s |

- **Drop check:** every tile has deck parapet gaps over its red road (C2: 233 points).

## 111.12 Playtest rounds (Lawrence, 7 November)

1. **Seven errors:** stuck against a white car; deck sight; level sight; cone behind the car; the box; 70% speed; scoring.
2. **Difficulty:** the fault rule; the red car's brakes.
3. **16:16–16:19:** cars stop after a hit; cones at rung 0; the lesson's clip and fitting restored.
4. **16:47:** the save screen restored.
5. **17:06:**
   - one lesson a tile, at the clear, with A1 teaching the forward camera;
   - the clip in the game's graphics;
   - volume 5;
   - DUCK on every tile;
   - roadside cover.
6. **18:06:** one thing a tile across car, player and level; every upgrade necessary; DUCK as Super Knees.
