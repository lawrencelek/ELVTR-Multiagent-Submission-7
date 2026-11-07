# DUMMIES GDD — Edit 111: Prototype 9 × Prototype 10 (Submission 7)

**7 November 2026, rewritten 17:50.** Story mode, Map 1 (Monument), tiles 1–9. Build: `index.html`. Sources: `engine/duel.js`, `engine/duel_ui.js`, `engine/build_p9.py`, `content/story_map1.json` (run `20261107-172210-v3`, v3f). This edit states the rules as built; §111.12 lists the playtest rounds that set them.

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

## 111.2 Progression: one lesson a tile

- **Stages:** one a tile, in order. Tile *k* starts where tile *k*−1's lesson left the car.

  | Tile | Stage | Car plays at | Your trick (plan v3f) | Lesson at the clear |
  |---|---|---|---|---|
  | A1 | 10.2 | rung 0: senses nothing | walk into its path | forward camera |
  | B1 | 10.3 | rung 1: brakes for you in its lane | cut in with the dash (Battery 1 arrives) | side sensors |
  | C1 | 10.4 | rung 2: notices you beside the road | drop from the Z2 deck into its path | roof lidar |
  | C2 | 10.5 | rung 3: sees you in the air | spring from tall cover | street cameras |
  | B2 | 10.6 | rung 4: cameras watch cover | cover the cameras miss | road items |
  | A2 | 10.7 | rung 5: stops for cones | duck behind a planter; step out (Hands 1 arrives) | crash memory |
  | A3 | 10.8 | rung 6: watches your old spots | a new spot each hit | the search |
  | B3 | 10.9 | rung 7: all it can learn | step out from behind white traffic (Legs 1 arrives) | none |
  | C3 | 10.10 | rung 7 | the Incident | none |

- **Objective:** only the red car's hits count, at its fault, with 10 or more lost. Or stealth points, or Incidents (10.10).
- **No mid-tile learning.** The tile plays at its stage's `duel.startRung` throughout.
- **The lesson:** after the hit that clears the tile and its write-off, before the report. It teaches `duel.startRung` → `duel.topRung`.
- **Panel:** "CLEAR THE TILE: IT LEARNS ⟨sensor⟩ FROM THE LAST HIT".
- **Between tiles:** the objective line shows the next tile's plan objective, never Prototype 9's write-off count.
- **Validator:** tile 1 is 10.2; each tile's `duel.startRung` equals the last tile's `duel.topRung`.

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
- **DUCK:** hold C on every tile. Speed × `movement.duckSpeedFactor`.
- **Proposed families:** industrial (crates, K-rails, dumpsters) and garden (hedges, statues, columns) for Maps 2–3. Breakable and interactive pieces (shelters, hydrants, chargers, vendor carts) come later.

## 111.8 White cars

- **Fleet:** Prototype 9's driver; it never learns (`proto.learningEnabled` 0, `proto.learn.standoffEnabled` 0).
- **Density:** 0.5 in the tile in test until 10.9; 1.0 from 10.9 (`story.traffic.monument.<tile>`), where the fleet is moving cover (`duel.twoWay`).
- **10.10:** the fleet tailgates (`traffic.whiteTimeGap`) and brakes no harder than `traffic.whiteBraking`. Open: Prototype 9's driver at a short gap instead (Lawrence).
- **Fleet update (proposed, open):** the fleet takes the red car's certified lessons between maps, never between tiles.

## 111.9 The dummy

- **Speed:** 70% of Prototype 9's. `movement.walkSpeed` 56.7; `movement.runSpeed` 113.4.
- **Parts:** Prototype 9's gifts: Battery 1 at B1, Hands 1 at A2, Legs 1 at B3. The duel's drone stays home (`duel.*Arrives` 0).
- **Unstick:** pressed against a car and not moving for 0.6 s, the dummy steps to the nearest free ground.

## 111.10 Flow and interface

- **Story:** Prototype 9's save screen (NEW GAME, CONTINUE, RENAME, ERASE), the name, the parts splash, the story map, the tile card.
- **Tile card:** the plan's tale and objective; a NEW line for the stage's idea.
- **Panel:** the car's rung, what it learns at the clear, HOLD C · DUCK.
- **Field overlays:** beam; cones and rings; ? and ! stages; notice meter; stop line; ghost; crash outlines and remembered spots; cameras; lunge guide; block-lift countdown.
- **Red car:** Prototype 9's sedan, repainted red; roof sensors.
- **Sound:** volume starts at 5 of 10 (`audio.settings.master`); a saved setting wins.

## 111.11 The pipeline (v3)

- **Each tile's facts:** road and set piece from Prototype 9's plan, and measured affordances (`engine/affordances.js`): lanes, a deck over the road, roadside cover by kind.
- **Validator refuses:**
  - test-road words (plinth, barrier, junction);
  - a planter, a drop or a named cover kind the tile lacks;
  - count-only labels;
  - text that has the dummy hit the car;
  - a stage sequence that breaks §111.2.
- **Probes:** `engine/p9_probe.js` (flank, cut-in, cover bots).

  | Tile | Cover bot, clear time (plan v3f) |
  |---|---|
  | A1 | 19 s |
  | B1 | 36 s |
  | C1 | 57 s |
  | C2 | 19 s |
  | B2 | not cleared in 8 min (the bot cannot path round the ring road) |
  | A2 | 20 s |
  | A3 | 231 s |
  | B3 | 7 s |
  | C3 | 50 s (Incident) |

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
