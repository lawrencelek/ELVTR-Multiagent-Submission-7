# DUMMIES GDD — Edit 111: Prototype 9 × Prototype 10 (Submission 7)

**7 November 2026.** Story mode, Map 1 (Monument), tiles 1–9. Build: `index.html` (Submission 7). Sources: `engine/duel.js`, `engine/duel_ui.js`, `engine/build_p9.py`, `content/story_map1.json`.

## 111.1 Scope

- **World:** Prototype 9, unchanged. Districts, tiles, decks, fleet, tile cards, gifts, HUD, sound.
- **Driver:** Prototype 10's red car (`testroad.js`, unchanged) drives the tile in test.
- **Plan:** each tile reads one ladder stage from the pipeline (`content/story_map1.json`).
- **New registry IDs:** none. Every value below is an existing ID.

## 111.2 The duel in a Prototype 9 tile

- **Tile sim:** the tile in test's ground traffic sim takes the red car's brain. Other cars keep Prototype 9's driver.
- **Red car:** one at a time (`duel.carsOnRoad`). It returns `duel.redReturnSeconds` after leaving the screen.
- **Rung:** starts at `duel.startRung`; learns up to `duel.topRung`; one lesson per qualifying hit.
- **Standstill:** a red car below `duel.standstillSpeed` takes no damage from a walk or a dash.
- **Kerbs:** run kerb to kerb, across the oncoming lane where there is one.
- **Height (rung 3):** a deck over its road is the plinth. A drop through a parapet gap counts as a hit from above.
- **Cover:** Prototype 9's statics. Its planters are low cover at `props.planter.height`.
- **Planter rows:** added along the road when `duel.planters` is 1, never under a deck. There must be room behind a row to crouch.
- **Vault:** a dash vaults a planter; a walk does not.
- **Street cameras (rung 4):** up to 3, on the kerb by tall cover, aimed back up the road. None has a roadside planter in reach. Range is `perception.streetCameraRange`; field is `perception.streetCameraFov`.
- **Sight field:** 10.9's proportional cones (`perception.coneRadius`, `perception.forwardGrades`, `perception.sideGrades`) from rung 2 on.
- **Block lift:** from 10.2, `duel.blockSeconds` 10 (10.7's value). After it, FARSIGHT sets the dummy down on free ground clear of every lane. No car waits for ever.
- **Incident (10.10):** the fleet tailgates (`traffic.whiteTimeGap`) and brakes no harder than `traffic.whiteBraking`. An Incident scores `scoring.incidentPoints`. It counts toward the objective once the dummy has moved.

## 111.3 Objective and clear

- **Objective:** the plan's count of damaging red hits (10 or more lost) or stealth points (`scoring.stealthUnseen`, `scoring.stealthLost`, `scoring.stealthSeen`).
- **Clear:** when the objective is met, Prototype 9's clear runs. Write-off, report, ferry, next card.
- **Floor:** other hits in the tile in test hold at `story.missFloor` (`story.floorHold`).
- **Clearing hit:** teaches nothing. The next tile's stage is the next lesson.

## 111.4 White cars

- **Fleet:** Prototype 9's fleet never learns (`proto.learningEnabled` 0; `proto.learn.standoffEnabled` 0).
- **Density, tiles 1–8:** 0.5 in the tile in test (`story.traffic.monument.<tile>`).
- **Density, tile 9 (10.9):** 1.0. The fleet becomes moving cover (`duel.twoWay`).

## 111.5 Parts

- **Gifts:** Battery 1 at B1, Hands 1 at A2, Legs 1 at B3, as Prototype 9 delivers them.
- **Duel drone:** stays home (`duel.dashArrives`, `duel.jumpArrives`, `duel.conesArrives`, `duel.duckArrives` all 0).
- **DUCK:** from tile 6 (stage 10.6). Hold C. Speed scales by `movement.duckSpeedFactor`.

## 111.6 The pipeline's view (v3)

- **Each tile's facts:** the agents see the tile's road and set piece from Prototype 9's district plan.
- **Measured affordances:** `engine/affordances.js` measures each tile on the built world. It reports lanes, a deck over the road, roadside planters and tall cover.
- **Validator:** refuses a plan that uses a planter, or a drop, a tile does not have. It also refuses test-road words (plinth, barrier, junction).

## 111.7 Interface

- **Tile card:** Prototype 9's level card, with the plan's tale and objective, and a NEW line for the stage's idea.
- **Panel:** the car's rung, and the hit that teaches the next rung.
- **Lesson card:** shows after the car leaves. Rung, the hit, what it now does, what is closed, what is open.
- **Field overlays:**
  - beam;
  - cones and rings;
  - ? and ! stages;
  - notice meter;
  - stop line;
  - ghost;
  - chalk outlines and remembered spots;
  - cameras and link;
  - lunge guide (`ui.lungeGuide`);
  - block-lift countdown.
- **Red car:** Prototype 9's sedan, repainted red, with a red outline.
