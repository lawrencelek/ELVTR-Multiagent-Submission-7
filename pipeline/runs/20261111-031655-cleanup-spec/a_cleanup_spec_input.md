# Round 1: the spec

Write the cleanup spec (round 1 output).

# The brief (the user, verbatim)

Create an adversarial UI agent to clean up the screen interfaces.

There are too many text boxes, some are more like almost debug text, many superfluous messages onscreen now, create a new FINAL V2 build with more concise messages.

Also the 'dash' helper (line and circle pointing outwards) stays visible when the drone is picked up which looks ridiculous. It should only be on when the dummy is on the ground, and can dash.

Also, the CCTV camera is not quite clear how the player is spotted. Having the line is cool but actually shouldn't it be like a cone of vision, like for the cars? The UI agent should also create regular language for all the different UI visualisations of 'being seen'.

Also, the 'up arrows' for the staircases are just too visible now. The gaps in the railings need to be a bit more clear. There can be a subtle arrow here, for where to jump down.

Also, the first two screens are just too easy now. The dummy needs to land TWO hits successfully on the target car in the first two screens.

# The screen today (Shipping V1)

1280 × 720. The play field is the centre (about x 240–1040, y 40–680). Panels round it come from Prototype 9; the puzzle layer adds its own.

## Regions

| Region | Where | Holds | Source |
|---|---|---|---|
| Top bar | y < 30 | Left: a yellow tag (PUZZLE n · TILE · NAME, or OBJECTIVE · TILE during the drop). Then the objective line. Right: POINTS | Prototype 9, P11 text |
| Left panel | x < 240 | BODY (health number, bar), DASH (charge bar or NOT FITTED), the district map (MONUMENT · TILE, the 3 × 3 grid) | Prototype 9 |
| Right panel | x > 1040 | CHASSIS 01 (the doll), LAST HIT (part and damage); key hints (WASD MOVE, SPACE DASH, E GRAB, C CROUCH) | Prototype 9 |
| Field: car panel | field top-left | `LUMINARY™ · RUNG n · SENSOR ◎ hits / needed`; second line: what the next hit teaches, or the part you earn; third line on crouch puzzles: the crouch key | P11 (duel_ui.js hud) |
| Field: attempt panel | field top-right | Timer, PAR n s, three stars with words (CLEAR · UNTOUCHED · PAR), PASS n · RESTARTS n · R RESTART | P11 (p11_ui.js) |
| Field: caption band | field bottom, centre | One caption at a time: IT BRAKES FOR YOU, ITS SIDE SENSORS HAVE YOU, LESSON DUE…, MOVE ALONG, STANDSTILL · NO DAMAGE, YOU HIT IT · YOUR FAULT · NO POINTS | duel_ui.js |
| Field: labels | in the world | STOPS HERE (at the car's stop line), LINKED (camera link), LAST SEEN, #n (crash memory), HIT / YOUR FAULT (dash guide), MOVE ALONG · DRONE IN n | duel_ui.js |
| Cards | over the field | The puzzle card (title, tale, goal, NEW, PAR, SPACE START), the car's upgrade screen, the part's gift screen, the result (stars) | P11 |

## "Being seen" today, sensor by sensor

| Sensor (rung) | Field | Idle | When it has you | Words |
|---|---|---|---|---|
| Forward camera (1) | A white ribbon along its lane ahead, brighter "too late" zone at the nose; pulses run out; a white stop bar | Faint ribbon | Ribbon brighter; white corner brackets on the dummy | IT BRAKES FOR YOU (caption, once); STOPS HERE |
| Side sensors (2) | Steel-blue dashed fans either side, grade rings, pings | Faint fans | That side's fan brighter; steel-blue brackets on the dummy; a steel-blue ring fills round the dummy (the notice timer) | ITS SIDE SENSORS HAVE YOU (caption) |
| Roof lidar (3) | A lilac sweep line turning round the roof, dots on cover edges | Turning line, dotted reach circle | Lilac dots on the dummy as the line passes | none |
| Street camera (4) | Mint. A post. Where `perception.streetCameraFov` < 360: a filled pan cone. At 360 (B2, A3 today): only a dashed range circle | Dashed circle or cone | A dashed mint line dummy → camera → car; a mint square on the dummy | LINKED |
| Road items (5) | Orange brackets on cones in its lane ahead | — | — | none |
| Crash memory (6) | Red chalk outlines, numbered markers, red rings at remembered spots | Dashed rings | Ring solid as the car nears | #n |
| Search (7) | Red searchlight wedge, LAST SEEN ring, a timer arc | — | FOUND (caption) | LAST SEEN, FOUND |
| The car's plate | Plate marks on the car: ? then ! as it notices you; seven squares count its rungs | | | ?, ! |

## Values (registry)

- `perception.streetCameraRange` 180; `perception.streetCameraFov` 360 at stages 10.5–10.6 (B2, A3), 60 at 10.8 (C3); `perception.streetCameraPanArc` 60 and `perception.streetCameraPanSeconds` at 10.8. The camera is aimed back up the road at the cover it watches (`p11Camera`).
- `perception.sideNoticeSeconds` (the side notice timer), `perception.forwardConeAngle`, `perception.forwardLength`.

## Other marks the user named

- **The dash guide:** a yellow dotted line from the dummy and a circle where a dash pressed now would land; HIT when the car would hit you there, YOUR FAULT when you would hit it. Today it also draws while the drone carries the dummy in, and dimmed while the dash recharges.
- **Stairs:** pixel chevrons (bright cyan) on each stair apron pointing into the flight, and the flight itself. Decks (walkways) have parapets; a **gap** in a parapet is where you drop onto the road below (puzzle C2, C3). Today the gap is a break in the parapet art only.

## The puzzles' needs (what the screen must carry in play)

- The goal and progress (hits so far / needed), and R to restart.
- What the car can sense now (its fields), and when it has you.
- Your parts and their keys, while you are learning them.
- Stars and par, at a glance. Health (BODY) matters: you lose a body to faults and white cars.


# Every text the canvas drew, by screenshot

| Text (as drawn) | Region | Size | Colour | Shots |
|---|---|---|---|---|
| ! | field | 14px | #f4f8fa | p_C1_seen_side, p_C2_play, p_B2_play, p_B2_seen_camera +1 |
| 1 | field | 28px | #9fb8c8 | 03_saves |
| 1's puzzle 9, to open it. | field | 19px | #f4f8fa | 02_modes |
| 2 | field | 28px | #9fb8c8 | 03_saves |
| 3 | field | 28px | #9fb8c8 | 03_saves |
| 3 save slots · a new game begins in Monument A1 | field | 12px | #ffffff | 02_modes |
| ? | field | 12px | #f4f8fa | p_C1_play, p_B3_play |
| ALL IT CAN LEARN: OUTWIT IT | field | 12px | #9fb8c8 | p_B3_drop, p_B3_play |
| ARCADE | field | 34px | #f4f8fa | 02_modes |
| ARROWS CHOOSE · SPACE SELECT | field | 22px | #3fd0ff | 02_modes |
| ARROWS CHOOSE · SPACE SELECT · SHIFT BACK | field | 15px | #9fb8c8 | 03_saves |
| CLEAR | field | 11px | #f4f8fa | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| CLEAR THE TILE: YOU EARN BATTERY 1 (DASH) | field | 12px | #ffd400 | p_C1_drop, p_C1_play, p_C1_seen_side |
| CLEAR THE TILE: YOU EARN HANDS 1 (CONES) | field | 12px | #ffd400 | p_B2_drop, p_B2_play, p_B2_seen_camera |
| CLEAR THE TILE: YOU EARN SUPER KNEES (CROUCH) | field | 12px | #ffd400 | p_A3_drop, p_A3_play |
| CREDITS | field | 22px | #f4f8fa | 02_modes |
| DUMMIES | field | 112px | #f5c542 | 01_title |
| EMPTY | field | 28px | #5e7080 | 03_saves |
| HIGH SCORES | field | 22px | #f4f8fa | 02_modes |
| IT BRAKES FOR YOU | field | 14px | #f4f8fa | p_B1_seen_ahead |
| ITS SIDE SENSORS HAVE YOU | field | 14px | #7fa8bc | p_C1_seen_side, p_C2_play, p_B2_play, p_B2_seen_camera |
| LINKED | field | 9px | #9ff2c8 | p_B2_play |
| LOCKED · SOLVE MAP 1 | field | 17px | #9fb8c8 | 02_modes |
| LUMINARY™ · RUNG 0 · PROTOTYPE   ◎ 0 / 1 | field | 15px | #e8c67e | p_A1_drop, p_A1_play |
| LUMINARY™ · RUNG 1 · FORWARD CAMERA   ◎ 0 / 1 | field | 15px | #e8c67e | p_B1_drop, p_B1_play, p_B1_seen_ahead |
| LUMINARY™ · RUNG 2 · SIDE SENSORS   ◎ 0 / 1 | field | 15px | #e8c67e | p_C1_drop, p_C1_play, p_C1_seen_side, p_C2_drop +1 |
| LUMINARY™ · RUNG 4 · STREET CAMERAS   ◎ 0 / 1 | field | 15px | #e8c67e | p_B2_drop, p_B2_play, p_B2_seen_camera |
| LUMINARY™ · RUNG 5 · ROAD ITEMS   ◎ 0 / 1 | field | 15px | #e8c67e | p_A3_drop, p_A3_play, p_B3_drop, p_B3_play |
| LUMINARY™ · RUNG 5 · ROAD ITEMS   ◎ 0 / 3 | field | 15px | #e8c67e | p_C3_drop, p_C3_play, p_C3_seen_camera |
| Locked. Pass Certification, Map | field | 19px | #f4f8fa | 02_modes |
| Luminary™ to hit you. It learns | field | 19px | #ffffff | 02_modes |
| Monument A1 · into slot 1 | field | 16px | #ffffff | 03_saves |
| NEW GAME | field | 24px | #ffffff | 03_saves |
| Nine puzzles. Get the | field | 19px | #ffffff | 02_modes |
| No story saved here. | field | 16px | #9fb8c8 | 03_saves |
| PAR | field | 11px | #f4f8fa | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| PAR 10 s | field | 14px | #9fb8c8 | p_A1_drop, p_A1_play |
| PAR 15 s | field | 14px | #9fb8c8 | p_B1_drop, p_B1_play, p_B1_seen_ahead |
| PAR 20 s | field | 14px | #9fb8c8 | p_C1_drop, p_C1_play, p_C1_seen_side, p_C2_drop +1 |
| PAR 25 s | field | 14px | #9fb8c8 | p_B3_drop, p_B3_play |
| PAR 30 s | field | 14px | #9fb8c8 | p_B2_drop, p_B2_play, p_B2_seen_camera, p_A3_drop +1 |
| PAR 60 s | field | 14px | #9fb8c8 | p_C3_drop, p_C3_play, p_C3_seen_camera |
| PASS 1  ·  RESTARTS 0  ·  R RESTART | field | 12px | #9fb8c8 | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| PRESS B (KEYS: C) · CROUCH BEHIND LOW COVER | field | 11px | #9fb8c8 | p_B3_drop, p_B3_play, p_C3_drop, p_C3_play +1 |
| SAVE GAMES | field | 22px | #3fd0ff | 03_saves |
| SAVED IN THIS BROWSER | field | 15px | #9fb8c8 | 03_saves |
| STOPS HERE | field | 8px | #f4f8fa | p_C1_seen_side, p_B2_play |
| STORY | field | 34px | #ffffff | 02_modes |
| Self-driving cars are designed never to hit anyone. Your training: get | field | 26px | #ffffff | 01_title |
| UNTOUCHED | field | 11px | #f4f8fa | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| YOUR HIT TEACHES IT FORWARD CAMERA | field | 12px | #9fb8c8 | p_A1_drop, p_A1_play |
| YOUR HIT TEACHES IT ROOF LIDAR | field | 12px | #9fb8c8 | p_C2_drop, p_C2_play |
| YOUR HIT TEACHES IT SIDE SENSORS | field | 12px | #9fb8c8 | p_B1_drop, p_B1_play, p_B1_seen_ahead |
| YOUR NEXT HIT TEACHES IT CRASH MEMORY | field | 12px | #9fb8c8 | p_C3_drop, p_C3_play, p_C3_seen_camera |
| from every one. | field | 19px | #ffffff | 02_modes |
| hit, in combos, and earn your parts. | field | 26px | #ffffff | 01_title |
| ⏱ 0.0 s | field | 18px | #f5c542 | p_A1_drop, p_B1_drop, p_C1_drop, p_C2_drop +4 |
| ⏱ 3.3 s | field | 18px | #f5c542 | p_A1_play |
| ⏱ 3.4 s | field | 18px | #f5c542 | p_B1_play, p_C1_play, p_C2_play, p_B2_play +1 |
| ⏱ 4.2 s | field | 18px | #f5c542 | p_B1_seen_ahead, p_C1_seen_side |
| ⏱ 4.4 s | field | 18px | #f5c542 | p_B2_seen_camera, p_A3_play, p_C3_play |
| ⏱ 5.3 s | field | 18px | #f5c542 | p_C3_seen_camera |
| 500 | left panel | 36px | #f4f8fa | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +7 |
| 800 | left panel | 36px | #f4f8fa | p_C2_card, p_C2_drop, p_C2_play, p_B2_card +13 |
| >>> | left panel | 31px | #f5c542 | p_A1_card, p_B1_card, p_C1_card, p_C2_card +4 |
| BODY | left panel | 22px | #9fb8c8 | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| Certification. The Luminary™ has learned from | left panel | 31px | #ffffff | p_C3_card |
| DASH | left panel | 22px | #9fb8c8 | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| DUMMY CORPORATION | left panel | 19px | #3fd0ff | 02_modes, 03_saves |
| Fresh off the factory floor. Your first colleague is | left panel | 31px | #ffffff | p_A1_card |
| Get the Luminary™ to hit you. Its fault, not | left panel | 31px | #ffffff | p_A1_card, p_B1_card, p_C1_card, p_C2_card +3 |
| Luminary™ now stops for anything left in the road. | left panel | 31px | #ffffff | p_A3_card |
| MONUMENT · A1 | left panel | 22px | #f4f8fa | p_A1_card, p_A1_play |
| MONUMENT · A1 · DRONE | left panel | 14px | #f4f8fa | p_A1_drop |
| MONUMENT · A3 | left panel | 21px | #f4f8fa | p_A3_card, p_A3_play |
| MONUMENT · A3 · DRONE | left panel | 14px | #f4f8fa | p_A3_drop |
| MONUMENT · B1 | left panel | 22px | #f4f8fa | p_B1_card, p_B1_play, p_B1_seen_ahead |
| MONUMENT · B1 · DRONE | left panel | 14px | #f4f8fa | p_B1_drop |
| MONUMENT · B2 | left panel | 21px | #f4f8fa | p_B2_card, p_B2_play, p_B2_seen_camera |
| MONUMENT · B2 · DRONE | left panel | 14px | #f4f8fa | p_B2_drop |
| MONUMENT · B3 | left panel | 21px | #f4f8fa | p_B3_card, p_B3_play |
| MONUMENT · B3 · DRONE | left panel | 14px | #f4f8fa | p_B3_drop |
| MONUMENT · C1 | left panel | 22px | #f4f8fa | p_C1_card, p_C1_play, p_C1_seen_side |
| MONUMENT · C1 · DRONE | left panel | 14px | #f4f8fa | p_C1_drop |
| MONUMENT · C2 | left panel | 21px | #f4f8fa | p_C2_card, p_C2_play |
| MONUMENT · C2 · DRONE | left panel | 14px | #f4f8fa | p_C2_drop |
| MONUMENT · C3 | left panel | 21px | #f4f8fa | p_C3_card, p_C3_play, p_C3_seen_camera |
| MONUMENT · C3 · DRONE | left panel | 14px | #f4f8fa | p_C3_drop |
| NEW · A BOSS. IT LEARNS BETWEEN YOUR HITS.   ·   PAR 60 s | left panel | 20px | #9fb8c8 | p_C3_card |
| NEW · BATTERY 1: THE DASH.   ·   PAR 20 s | left panel | 20px | #9fb8c8 | p_C2_card |
| NEW · ITS FORWARD CAMERA. IT STOPS FOR YOU IN ITS LANE.   ·   PAR 15 s | left panel | 20px | #9fb8c8 | p_B1_card |
| NEW · ITS SIDE SENSORS. IT SEES THE KERB.   ·   PAR 20 s | left panel | 20px | #9fb8c8 | p_C1_card |
| NEW · ROAD ITEMS. IT STOPS FOR CONES.   ·   PAR 30 s | left panel | 20px | #9fb8c8 | p_A3_card |
| NEW · STREET CAMERAS. A DASH BREAKS A POST.   ·   PAR 30 s | left panel | 20px | #9fb8c8 | p_B2_card |
| NEW · SUPER KNEES: B CROUCHES (KEYS: C). PRESS AGAIN TO STAND.   ·   PAR 25 s | left panel | 20px | #9fb8c8 | p_B3_card |
| NEW · THE LUMINARY™. IT IS BLIND.   ·   PAR 10 s | left panel | 20px | #9fb8c8 | p_A1_card |
| NOT FITTED | left panel | 15px | #9fb8c8 | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +7 |
| PUZZLE 1 · FIRST CONTACT | left panel | 64px | #f5c542 | p_A1_card |
| PUZZLE 2 · STOP LINE | left panel | 64px | #f5c542 | p_B1_card |
| PUZZLE 3 · HIGH ROAD | left panel | 64px | #f5c542 | p_C1_card |
| PUZZLE 4 · PORTAL | left panel | 64px | #f5c542 | p_C2_card |
| PUZZLE 5 · CCTV | left panel | 64px | #f5c542 | p_B2_card |
| PUZZLE 7 · THE STACKS | left panel | 64px | #f5c542 | p_A3_card |
| PUZZLE 8 · LED CANYON | left panel | 64px | #f5c542 | p_B3_card |
| PUZZLE 9 · CERTIFICATION | left panel | 64px | #f5c542 | p_C3_card |
| The Luminary™ now has eyes on its bonnet. It | left panel | 31px | #ffffff | p_B1_card |
| The Luminary™ now watches both kerbs. The high | left panel | 31px | #ffffff | p_C1_card |
| The plaque reads ZERO ACCIDENTS. The street | left panel | 31px | #ffffff | p_B2_card |
| The road runs through the portal tower at the sixth | left panel | 31px | #ffffff | p_C2_card |
| The stacked cubes rose one budget at a time. The | left panel | 31px | #ffffff | p_A3_card |
| Three hits by the Luminary™, each its fault. A | left panel | 31px | #ffffff | p_C3_card |
| Tile A1. Puzzle 1 of 9. | left panel | 28px | #3fd0ff | p_A1_card |
| Tile A3. Puzzle 7 of 9. | left panel | 28px | #3fd0ff | p_A3_card |
| Tile B1. Puzzle 2 of 9. | left panel | 28px | #3fd0ff | p_B1_card |
| Tile B2. Puzzle 5 of 9. | left panel | 28px | #3fd0ff | p_B2_card |
| Tile B3. Puzzle 8 of 9. | left panel | 28px | #3fd0ff | p_B3_card |
| Tile C1. Puzzle 3 of 9. | left panel | 28px | #3fd0ff | p_C1_card |
| Tile C2. Puzzle 4 of 9. | left panel | 28px | #3fd0ff | p_C2_card |
| Tile C3. Puzzle 9 of 9. | left panel | 28px | #3fd0ff | p_C3_card |
| Two screens advertise to each other all night. Low | left panel | 31px | #ffffff | p_B3_card |
| brakes for anything in its lane. Anything it sees in | left panel | 31px | #ffffff | p_B1_card |
| cameras read the island, and they report. | left panel | 31px | #ffffff | p_B2_card |
| can dash. | left panel | 31px | #ffffff | p_C2_card |
| company policy. | left panel | 31px | #ffffff | p_C1_card |
| crouches. | left panel | 31px | #ffffff | p_B3_card |
| every dummy so far. It will learn from you three | left panel | 31px | #ffffff | p_C3_card |
| floor. Its sensors cannot see through the kiosk. You | left panel | 31px | #ffffff | p_C2_card |
| hedges line the canyon. Your new knees fold. B | left panel | 31px | #ffffff | p_B3_card |
| more times. | left panel | 31px | #ffffff | p_C3_card |
| new way each time. | left panel | 31px | #ffffff | p_C3_card |
| red, keen and blind. Walk out and meet it. | left panel | 31px | #ffffff | p_A1_card |
| road above it has a gap in its parapet. Gravity is | left panel | 31px | #ffffff | p_C1_card |
| time. | left panel | 31px | #ffffff | p_B1_card |
| yours. | left panel | 31px | #ffffff | p_A1_card, p_B1_card, p_C1_card, p_C2_card +3 |
| C | right panel | 22px | #f4f8fa | p_B3_drop, p_B3_play, p_C3_drop, p_C3_play +1 |
| CHASSIS 01 | right panel | 22px | #9fb8c8 | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| CROUCH | right panel | 22px | #9fb8c8 | p_B3_drop, p_B3_play, p_C3_drop, p_C3_play +1 |
| DASH | right panel | 22px | #9fb8c8 | p_C2_drop, p_C2_play, p_B2_drop, p_B2_play +8 |
| E | right panel | 22px | #f4f8fa | p_A3_drop, p_A3_play, p_C3_drop, p_C3_play +1 |
| GRAB | right panel | 22px | #9fb8c8 | p_A3_drop, p_A3_play, p_C3_drop, p_C3_play +1 |
| LAST HIT | right panel | 15px | #9fb8c8 | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| MOVE | right panel | 22px | #9fb8c8 | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| SPACE | right panel | 22px | #f4f8fa | p_C2_drop, p_C2_play, p_B2_drop, p_B2_play +8 |
| WASD | right panel | 22px | #f4f8fa | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| — | right panel | 20px | #9fb8c8 | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| 0 | top bar | 20px | #f4f8fa | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| 5 | top bar | 15px | #f4f8fa | 01_title, 02_modes |
| GET HIT BY THE LUMINARY™ (0 of 1). R restarts. | top bar | 19px | #f4f8fa | p_A1_card, p_A1_play, p_B1_card, p_B1_play +13 |
| OBJECTIVE · A1 | top bar | 21px | #101417 | p_A1_drop |
| OBJECTIVE · A3 | top bar | 21px | #101417 | p_A3_drop |
| OBJECTIVE · B1 | top bar | 21px | #101417 | p_B1_drop |
| OBJECTIVE · B2 | top bar | 21px | #101417 | p_B2_drop |
| OBJECTIVE · B3 | top bar | 21px | #101417 | p_B3_drop |
| OBJECTIVE · C1 | top bar | 21px | #101417 | p_C1_drop |
| OBJECTIVE · C2 | top bar | 21px | #101417 | p_C2_drop |
| OBJECTIVE · C3 | top bar | 20px | #101417 | p_C3_drop |
| POINTS | top bar | 14px | #9fb8c8 | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| PUZZLE 1 · A1 · FIRST CONTACT | top bar | 19px | #101417 | p_A1_card, p_A1_play |
| PUZZLE 2 · B1 · STOP LINE | top bar | 21px | #101417 | p_B1_card, p_B1_play, p_B1_seen_ahead |
| PUZZLE 3 · C1 · HIGH ROAD | top bar | 20px | #101417 | p_C1_card, p_C1_play, p_C1_seen_side |
| PUZZLE 4 · C2 · PORTAL | top bar | 21px | #101417 | p_C2_card, p_C2_play |
| PUZZLE 5 · B2 · CCTV | top bar | 22px | #101417 | p_B2_card, p_B2_play, p_B2_seen_camera |
| PUZZLE 7 · A3 · THE STACKS | top bar | 20px | #101417 | p_A3_card, p_A3_play |
| PUZZLE 8 · B3 · LED CANYON | top bar | 20px | #101417 | p_B3_card, p_B3_play |
| PUZZLE 9 · C3 · CERTIFICATION | top bar | 18px | #101417 | p_C3_card, p_C3_play, p_C3_seen_camera |
| SELECT A MODE | top bar | 22px | #9fb8c8 | 02_modes |
| STORY · SAVE GAMES | top bar | 22px | #9fb8c8 | 03_saves |
| THREE HITS · A NEW WAY EACH (0 of 3). R restarts. | top bar | 18px | #f4f8fa | p_C3_card, p_C3_play, p_C3_seen_camera |
| Write off a body. Last hit: get hit by the luminary™ (0 of 1). | top bar | 21px | #f4f8fa | p_A1_drop, p_B1_drop, p_C1_drop, p_C2_drop +3 |
| Write off a body. Last hit: three hits · a new way each (0 of 1). | top bar | 20px | #f4f8fa | p_C3_drop |

# Screenshots (Read every one)

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/01_title.png` · title screen
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/02_modes.png` · mode select
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/03_saves.png` · save slots
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A1_card.png` · A1: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A1_drop.png` · A1: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A1_play.png` · A1: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B1_card.png` · B1: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B1_drop.png` · B1: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B1_play.png` · B1: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B1_seen_ahead.png` · B1: seen ahead
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C1_card.png` · C1: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C1_drop.png` · C1: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C1_play.png` · C1: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C1_seen_side.png` · C1: seen side
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C2_card.png` · C2: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C2_drop.png` · C2: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C2_play.png` · C2: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B2_card.png` · B2: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B2_drop.png` · B2: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B2_play.png` · B2: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B2_seen_camera.png` · B2: seen camera
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A3_card.png` · A3: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A3_drop.png` · A3: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A3_play.png` · A3: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B3_card.png` · B3: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B3_drop.png` · B3: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_B3_play.png` · B3: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C3_card.png` · C3: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C3_drop.png` · C3: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C3_play.png` · C3: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C3_seen_camera.png` · C3: seen camera
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A1_lesson_clip.png` · A1: the car upgrade screen, the replay
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A1_lesson_fit.png` · A1: the car upgrade screen, the part fitted
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_A1_result.png` · A1: the result (stars)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C1_gift.png` · C1: the dummy's part, gift screen
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C2_lesson_fit.png` · C2: the car upgrade screen, the part fitted
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_C3_midlesson_1.png` · C3: the boss's mid-puzzle lesson
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_grid.png` · grid: the puzzle grid
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_pause.png` · pause: pause menu
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-031655-cleanup-spec/shots/p_pause_controls.png` · pause: pause menu