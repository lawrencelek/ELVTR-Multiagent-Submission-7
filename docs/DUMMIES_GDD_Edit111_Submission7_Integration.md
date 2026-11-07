# DUMMIES GDD — Edit 111: Prototype 9 × Prototype 10 (Submission 7)

**7 November 2026.** Story mode, Map 1 (Monument), tiles 1–9. Build: `index.html` (Submission 7). Sources: `engine/duel.js`, `engine/duel_ui.js`, `engine/build_p9.py`, `content/story_map1.json`.

## 111.1 Scope

- **World:** Prototype 9, unchanged. Districts, tiles, decks, fleet, tile cards, gifts, HUD, sound.
- **Driver:** Prototype 10's red car (`testroad.js`, unchanged) drives the tile in test.
- **Plan:** each tile reads one ladder stage from the pipeline (`content/story_map1.json`).
- **New registry IDs:** none registered. Five are proposed (§111.8–111.10): `scoring.whiteShare`, `scoring.redDamageBonus`, `scoring.faultShare`, `scoring.faultMinSpeed`, `traffic.hitStandSeconds`. Every other value is an existing ID.

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
- **Density, tile 9 (10.9 or later; v3e plays 10.10):** 1.0. The fleet becomes moving cover (`duel.twoWay`).

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
- **Lesson:** shows after the car leaves. Prototype 10's beats (§111.10), then the card: rung, the hit, what it now does, what is closed, what is open.
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

## 111.8 Playtest fixes (Lawrence, 7 November)

- **Stuck against a white car:** duel planters sit on the kerb line or a clear body width off it. They also stay 30 clear of every static, so no slot is narrower than a body (`body.radius`).
- **Unstick:** a dummy pressed against a car, moving and not moving for 0.6 s, steps to the nearest free ground.
- **Height:** a dummy on a deck or walkway is out of the red car's world at every rung. Rung 3's lidar sees a jump or a fall onto its road, never the deck.
- **Line of sight:** the level blocks it.
  - Buildings, walls, booths, columns, sculptures and the monument block it.
  - Masses block it by their drawn height (`ht`, `proto.art.extrusion`).
  - Planters are low cover (`props.planter.height`).
- **Native art:** duel planters and street-camera posts are painted into the tile's ground art, as Prototype 9 paints its own. They sit under decks, cars and props.
- **Forward cone:** drawn from the nose on. Its edges still run through the front corners.
- **Red car:** no outline box; red paint and roof sensors only.
- **Dummy speed:** 70%. `movement.walkSpeed` 56.7; `movement.runSpeed` 113.4. It can no longer run alongside a car.
- **Scoring:**
  - A white car's hit scores 20% (proposed `scoring.whiteShare` 0.2, not yet registered).
  - The red car's hit scores 100% plus its damage (proposed `scoring.redDamageBonus` 1, not yet registered).
- **Labels:** the validator refuses an objective label that only counts ("HITS: 3") or names write-offs.

## 111.9 Fault and brakes (Lawrence, 7 November)

- **Fault rule:** only a vehicle that hits the dummy scores.
  - At contact, compare speeds along the contact normal, just before it.
  - The vehicle is at fault when it gives at least half the closing speed (proposed `scoring.faultShare` 0.5).
  - It must also move at 20 or more (proposed `scoring.faultMinSpeed` 20).
  - Otherwise the dummy hit it. Damage stands. No points, no objective, no lesson.
  - Flash: YOU HIT IT · YOUR FAULT · NO POINTS.
  - Applies to every vehicle, red and white.
  - A drop counts when the car moves at `scoring.faultMinSpeed` or more.
  - A bounce off one car into another keeps the first hit's fault.
- **What it closes:** dashing into a slow car's front corner. A probe logged 9 of 10 scoring hits that way: dummy at ~1,000 px/s, car at 9–85.
- **What stays open:** be in its path, too late for it to stop.
  - Cross its nose; the nose hits you: its fault.
  - Dash into its side: yours.
- **Red car's brakes:** `traffic.hardBraking` 600, the registry's value and Prototype 10's.
  - The fleet keeps Prototype 9's 79 (Highway Code, P1.7).
  - Prototype 10's safe envelope assumes 600. At 79 the car crawls by a suspected dummy: 44 px/s at a 300 gap. At 600: 146.
  - Stop from cruise (`vehicles.sedan.cruiseSpeed` 138), `perception.reactionDelay` 0.3: 57 px. It was 162.
- **Lunge guide:** HIT only where the car would hit the dummy. YOUR FAULT where the dummy would hit the car.
- **Lesson text:** rung 1 opens the cut-in, not the flank. Rung 2 learns from a hit you cut in for.
- **Plan text:** the validator refuses hints and labels that have the dummy hit the car ("into a car", "as it passes", "strike it").
- **Measured (`engine/p9_probe.js`, plan v3d's counts):**
  - The corner-dash bot scores nothing. B1: 10 dashes, all its own fault.
  - Cut-in or cover bot, first clear: A1 30 s, B1 26 s, C1 21 s, C2 116 s, B2 320 s, C3 237 s.
  - In 6 min: A2 and A3 1 of 2 hits; B3 1 of 3.
- **Incident (v3e's tile 9, 10.10):** a cut-in bot, seen and stopped hard, caused one in 5 s. Tailgaters brake at `traffic.whiteBraking` 45; the red car at 600.

## 111.10 Playtest fixes 2 (Lawrence, 7 November, 16:16–16:19)

- **A car that hits the dummy stops.**
  - It brakes at `traffic.hardBraking` (600) and stands 2 s (proposed `traffic.hitStandSeconds`, after `traffic.incidentSeconds`). Then it drives on.
  - Every vehicle, at either fault. No more shoving the dummy to the screen's edge.
  - The red car, having hit you, drives off as Prototype 9's driver does: it stops for you and passes round you. It no longer ignores you (was row 681).
  - It no longer watches its field once it has hit you: it drives on.
- **Block lift for any car you keep waiting:** the red car, the red car that hit you, or the fleet. FARSIGHT lifts the dummy after `duel.blockSeconds`. Before, only the live red car counted, so a car held behind the dummy could stall the lesson.
- **Cones:** the red car sees road items at every rung (`perception.forwardLength`). Rung 0 is blind to the dummy only.
  - Before: rung 0 had no beam, so it ran over a cone. Prototype 9 shoves a struck cone aside, so the car seemed to drive through it.
- **The lesson, as Prototype 10 played it:**
  - Beat 1: your hit replayed as the car's training clip (`duel.lessonClipSeconds` 3). The frame of impact holds, boxed (`duel.lessonHoldSeconds` 0.8).
  - Beat 2: a drone fits the new sensor; its field draws out (`duel.lessonFitSeconds` 2).
  - Then the card. Enter skips to the card, then closes it.
- **Fleet update (proposed, open):** the fleet takes the red car's certified lessons between maps, never between tiles. Within a map, only the red car learns.

