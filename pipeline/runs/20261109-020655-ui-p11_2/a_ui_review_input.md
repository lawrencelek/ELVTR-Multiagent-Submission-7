# The brief (the user, verbatim)

Second pass, after the fixes for the first review (F1-F15). The user's original brief: hatched area is overlapping with the front car lights too much., giving mixed signals, too hard to read. ... side sensors etc should show scan radius rather than just being on the car. some things can be on the car, some can be shown as 'sensor' feedback, like those visualisations of car lidar. Judge whether P11.2 fixes it; find what is still wrong; new problems the fixes made.

# The marks the renderer draws around the red car

Prototype 11.2 (GDD Edit 117) after the first adversarial UI review (pipeline/runs/20261109-013907-ui-p11_1). Bottom to top. World units: the field is 800 × 640; RED-01 is 50.4 × 25.2; the dummy's body radius is 13. The fix list it answers: F1-F15 of that review.

## Off for RED-01 in P11 (white cars keep them)

Prototype 9's forward hatch, side outlines and dotted fill, headlight wedge and its notice flash, brake fan, speech bubbles; the dummy's view edges (all P11). RED-01 keeps its lamps and Prototype 9's roof plate (R01).

## RED-01's marks

| Mark | Drawn | Means | Colour |
|---|---|---|---|
| Rung 0 | Nothing but the plate and seven empty squares | Blind | — |
| Forward ribbon (rung 1 up) | A band along its lane path ahead of the nose, car width + 2 × body radius, to its forward reach (fwdLen at rung 1; `perception.coneRadius` 340 from rung 2). Pulses run out along it | What it brakes for: you in its path | White, fill α 0.08, edges α 0.45; brighter when you are in its path |
| Too-late zone | The first part of the ribbon: reaction × speed + speed² / (2 × braking) + body radius | Step in here and it cannot stop: it hits you, its fault | White α 0.17 |
| Stop line, idle | Dashed white across the lane at the too-late zone's end | Where it would stop if it braked now | White |
| Stop line, braking | Solid when it arrives; STOPS HERE while it brakes | Where it will stop | White |
| Forward cone (rung 2 up) | Outline and 3 grade arcs (± `perception.forwardConeAngle` 10° round its look) | Its graded forward sight; filled faintly when it has you | White |
| Side fans (rung 2 up) | Two fans 10°-95° off the nose, reach 227, a dashed grade ring, pings running out from the mirror pods; ray-cast: cut by tall cover, by low cover while you duck, and by deck tops (parapet gaps open) | Its side sensors | Steel blue α 0.12; the fan that has you α 0.3, faster pings |
| Lidar (rung 3 up) | A thin sweep line round the roof puck; return dots on cover, deck edges and parapet gaps fade behind it; a ring of returns on you when you are in its world (on its road, or falling off a deck onto it) | Its roof lidar | Steel blue |
| Caught box | Corner brackets round the dummy in the colour of the sensor that has it | Sensing / caught | White (forward), steel blue (side) |
| Notice arc | Round the dummy, filling over `perception.sideNoticeSeconds` (× `perception.duckNoticeFactor` ducked) | Time before it notices you | Steel blue |
| Plate marks | Seven squares under the R01 plate, filled to the rung; ? (suspects) or ! (has you) beside the plate | Rung; awareness | Red squares; white glyph |
| Street cameras (rung 4 up) | Post with a 4-unit mint lens; the 60° pan cone always shown (α 0.13, edge α 0.5); LINKED as before | A camera that reports you | Mint |
| Item brackets (rung 5 up) | Orange corner brackets on cones in its lane ahead | It will stop for them | Orange |
| Memory rings (rung 6 up) | A red numbered ring per remembered spot (`duel.memoryRadius` 50); solid as the car nears (within 220) | Spots it watches | Red #ff5a5a |
| Ghost (rung 7) | Red dashed body ring, search ring and countdown arc, LAST SEEN; a red searchlight wedge from the roof sweeping onto it | Where it searches | Red |
| Kit (P11.1) | Lens bar white, mirror pods steel blue, roof puck steel blue, link antenna stub mint, bumper strip orange, tally marks red, searchlight red | Hardware labels | as listed |
| Captions | One at a time, in a band above the field's bottom (IT BRAKES FOR YOU, ITS SIDE CONES HAVE YOU, …) | Events | Sensor colour |
| HUD | Panel and strip fade to α 0.3 while the car or the dummy is under them | — | — |
| Lunge guide | Yellow (yours), brighter when the dash will be hit by the car at its fault | Your dash | Yellow |
| Dummy text | DUCKED · HIDDEN / SEEN and EXPECTED are cut; MOVE ALONG stays (the anti-stall lift) | — | — |

## Declined or open (the designer's call)

- F10: the lesson card keeps no OPEN line in P11. The open trick is the next puzzle's solution; Edit 113 chose not to give it away.
- F6: lesson 3's claim (lidar closes the drop) is measured false on A2; puzzle 4 teaches rungs 3 and 4 together. Open.
- F15 (part): MOVE ALONG stays. Escalator brackets are Prototype 9's art.
- F13: the registry's several reaches per sensor: documented, not consolidated.

Level pieces as before (`p11_marks.md`).


# Sensor parameters (registry ids, values at the boss)

```json
{
 "duel.topRung": 7,
 "duel.lessonClipSeconds": 3,
 "duel.lessonHoldSeconds": 0.8,
 "duel.lessonFitSeconds": 2,
 "duel.memoryRadius": 50,
 "duel.memorySites": 3,
 "duel.searchRadius": 60,
 "duel.searchSeconds": 4,
 "perception.forwardLength": 720,
 "perception.sideNoticeSeconds": 0.6,
 "perception.duckNoticeFactor": 1.5,
 "perception.sensorHeight": 14,
 "perception.lidarHeight": 26,
 "perception.streetCameraHeight": 60,
 "perception.streetCameraRange": 180,
 "perception.streetCameraFov": 60,
 "perception.streetCameraPanArc": 60,
 "perception.streetCameraPanSeconds": 3,
 "perception.streetCameraPanHold": 1,
 "perception.sideCloseRange": 180,
 "perception.sideWaryRange": 360,
 "perception.sideAwareSpeed": 0.85,
 "perception.sideWarySpeed": 0.6,
 "perception.sideCloseSpeed": 0.35,
 "perception.sideAwareNoticeRate": 0.5,
 "perception.sideWaryNoticeRate": 1,
 "perception.forwardConeAngle": 10,
 "perception.sideConeAxis": 52.5,
 "perception.sideConeAngle": 42.5,
 "perception.sideConeRange": 240,
 "perception.trackSeconds": 3,
 "perception.forwardConeSensitivity": 1,
 "perception.sideConeSensitivity": 0.5,
 "perception.coneRadius": 340,
 "perception.sideConeRatio": 0.6666666666666666,
 "perception.forwardGrades": 3,
 "perception.sideGrades": 2,
 "perception.coneGrowthPerMemory": 0.04,
 "perception.coneGrowthMax": 0.2,
 "body.radius": 13,
 "sensing.coneReach": 900,
 "perception.sideRadius": 100,
 "perception.sideHalfAngle": 80,
 "proto.art.noticeFlashHz": 4,
 "(derived) forward cone reach": 340,
 "(derived) side cone reach": 227,
 "(derived) side cone edges deg": [
  10,
  95
 ]
}
```

# Lesson card text per rung (what it now does, what that closes, what stays open)

```js
const LESSON = {
    1: ['It brakes for a dummy in its lane and stops short of you.', 'Standing in its lane.', 'Cut in: wait beside the road; dash into its lane just ahead of its nose, too late to stop.'],
    2: ['Side cones: it notices a dummy beside the road. It slows, then stops short. ? means it suspects you; ! means it has you.', 'Cutting in from beside the road, unseen.', 'Height: it watches the ground. Drop or jump onto it from a deck.'],
    3: ['Roof lidar: it sees a dummy in the air, jumping or falling off a deck onto its road. Up on a deck you are still out of its world.', 'The drop and the jump onto it.', 'Cover: wait behind a building; spring into its path just ahead of it.'],
    4: ['Street cameras share what they see. Behind cover, a camera can still give you away.', 'Springs from cover a camera watches.', 'Cover the cameras miss; a cone in its lane makes it swerve into you.'],
    5: ['Road items: it stops for a cone and never swerves round it.', 'The cone bait.', 'DUCK (hold C) behind a low planter; spring into its path just ahead of it.'],
    6: ['Crash memory: it remembers every spot you struck from, and watches them.', 'The same spot twice.', 'A new spot every time.'],
    7: ['The search: seen, then hidden, it searches where it last saw you (the ghost).', 'Hiding after it has seen you.', 'Hide before it sees you, or crawl away from its ghost.'],
  };
```

# The nine puzzles (Edit 115)

# DUMMIES GDD — Edit 115: Map 1 redesigned; the learner returns as a drone car

**8 November 2026 · Lawrence Lek.** Builds Edits 113–114. Sources: the tile inventory (`docs/DUMMIES_Level_Inventory.md`), the Edit 114 pressure test, probes v3 (`engine/p11_probe.js`). Governs `content/puzzles_map1.json`. Newest wins.

## 115.1 The escalation

- **Nine puzzles train one car.** RED-01 (sedan, Meridian) climbs rungs 0 → 7 over Map 1.
- **Certified, it returns on Map 2 as a drone car:** a Senior white car with every rung. Map 1's tricks fail on it.
- **Map 2 trains a new learner** (van, Porter); Map 3 another (police, Warden). Edit 114 §114.6.
- Proposed: `fleet.droneOf.<map>` (the certified learner's model), `fleet.droneShare` (its share of the white traffic).

## 115.2 Rules

- One new thing a puzzle. Each part is used on the puzzle after it is earned.
- Each puzzle uses its tile's architecture: highways and their parapet gaps, escalators, the island, the canyon.
- The kit is issued per test (`kit`), as in Hitman GO.
- No white traffic until the boss: `story.traffic.monument.<tile>` 0, decks included.
- The puzzle places its own pieces (`layout`, §115.5).
- The traffic-light switch and the clients move to Map 2, with the van.

## 115.3 The nine

| # | Tile | Name | Rung | NEW | Kit | Tile assets | Obvious → twist | Solution | Clear brings | Par / target |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | A1 | First Contact | 0 → 1 | The red car, blind | — | Open road under the Z1 highway | Walk into its side → your fault | Stand in its lane | Forward camera | 10 / 30 |
| 2 | B1 | Stop Line | 1 → 2 | Forward camera: its stop line | — | Open kerb by the podium skybridge; the near lane | Stand in its lane → it stops | Wait at the kerb; step in inside its line | Side sensors | 15 / 40 |
| 3 | C1 | High Road | 2 | Side sensors: it sees the kerb | — | Z2 highway, its east parapet gap over the road, two escalators | Wait at the kerb → seen; it stops short | Escalator up; drop through the gap as it passes | Battery 1 (dash) | 20 / 60 |
| 4 | B2 | The Island | 2 → 4 | Battery 1: the dash | Dash | The monument's island between the split lanes; a kiosk on it | Walk out → seen. Dash at its side → your fault | Cross to the island; hide behind the kiosk; dash ahead of its nose | Roof lidar, then street cameras | 20 / 60 |
| 5 | A2 | CCTV | 4 | Street cameras; a dash breaks a post | Dash | A cabinet on the kerb, one camera on it; the neon arcade | Hide behind the cabinet → the camera tells it | Break the post between passes; hide; dash | Hands 1 (cones) | 30 / 80 |
| 6 | A3 | Swerve | 4 → 5 | Hands 1: cones | Cones only | A kiosk by the road; two cones by the drop | No dash: seen at the kerb; it stops short | A cone in its lane; hide behind the kiosk; step into the other lane as it swerves | Road items | 30 / 80 |
| 7 | C2 | Portal | 5 | Road items: it stops for cones | Dash, cones | The portal tower's road; a kiosk with a breakable camera; two cones | A cone in its lane → it stops now | Break the camera; hide behind the kiosk; dash | Super Knees | 30 / 80 |
| 8 | B3 | LED Canyon | 5 | Super Knees: duck | Dash, Super Knees | The canyon's jog; a hedge and a planter by the road | Hide behind the hedge standing → it sees you over it | Duck behind the hedge; dash out | — | 25 / 70 |
| 9 | C3 | Certification | 5 → 6 → 7 | The boss | Dash, cones, Super Knees | Cabinet (no camera), hedge, kiosk (camera); the LED gateway; white traffic 0.5 | The same move twice → it remembers | Cabinet; ducked at the hedge; break the camera, use the kiosk | Arcade | 60 / 120 |

- **Grid order:** A1 → B1 → C1 → B2 → A2 → A3 → C2 → B3 → C3.
- **Parts:** the dash (3's clear) opens 4; cones (5's) open 6; Super Knees (7's) open 8 and the boss's hedge.
- **Car lessons:** at 1, 2, 4 (two) and 6; two mid-puzzle lessons in 9.
- **Puzzle 4 teaches two rungs:** roof lidar does not close a drop (§115.4), so it ships with street cameras. Built: `engine/p11.js`.
- **Puzzle 8 teaches nothing:** its card says Certification is next.

![Map 1 as played, v3](img/p11_map1_v3.jpg)

## 115.4 Verified (probes v3, 120 s a bot; the boss 200 s)

Counted hits / your-fault contacts, @ seconds to the first hit. Scripted checks set the move up by teleport.

| # | Puzzle | idle | stand | side | cut-in | cover | Intended move (scripted) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | First Contact | 0/0 | 1/0 @1.7 | 1/1 @11.2 | 1/0 @2.4 | 1/0 @2.9 | Stand in its lane | Verified |
| 2 | Stop Line | 0/0 | 0/0 | 1/2 @42 | 0/8 | 0/0 | Step in late (side bot) | Obvious fails; intended partly |
| 3 | High Road | 0/0 | 0/0 | 0/4 | 0/0 | 0/0 | Drop: 1/0 @2.9 | Verified |
| 4 | The Island | 0/0 | 0/0 | 0/1 | 0/0 | 0/0 | Spring from the kiosk: 0 | Obvious fails; intended unverified |
| 5 | CCTV | 0/0 | 0/0 | 0/1 | 0/0 | 0/0 | Break, then cover: 1/0 @29 | Verified. Drop also clears (84.5 s) |
| 6 | Swerve | 0/0 | 0/0 | 0/3 | 0/0 | 0/0 | Cone bait: 1/0 @92.5 | Verified; tight window |
| 7 | Portal | 0/0 | 0/0 | 0/2 | 0/0 | 0/0 | Cone: 0 (twist holds). Break, then cover: 0 | Obvious fails; intended unverified |
| 8 | LED Canyon | 0/0 | 0/0 | 0/3 | 0/0 | 1/1 @33.6 (ducked) | Duck, then dash | Verified |
| 9 | Certification | 0/0 | 0/0 | 0/2 | 0/0 | 0/3 | Break, then cover: 3 hits, cleared @8 | Verified |

- **Fixed from Edit 114:** no generic bot clears 2–9 now. v2's first-pass cheese (A3 4.6 s, B3 4.9 s) is gone.
- **Measured:** roof lidar (rung 3) does not close a deck drop. A2's drop hits at 90–120 px triggers at rungs 2 and 3; rung 3 grades it SEEN.
- **Untested by any bot:** 4's spring, 7's break-and-spring. Day 3 players decide them.



# The puzzles as data

```json
[{"n": 1, "tile": "A1", "name": "First Contact", "stage": "10.2", "rungs": null, "kit": [], "earns": "car", "objective": {"kind": "hits", "count": 1, "label": "GET HIT BY THE RED CAR"}, "hints": ["It cannot see you. Be where it is going, and wait."], "par": 10, "target": 30, "fleet": 0, "layout": {"drop": [400, 224], "cones": []}, "camera": null}, {"n": 2, "tile": "B1", "name": "Stop Line", "stage": "10.3", "rungs": null, "kit": [], "earns": "car", "objective": {"kind": "hits", "count": 1, "label": "GET HIT BY THE RED CAR"}, "hints": ["It stops for what it sees in its lane. Step in when it can no longer stop."], "par": 15, "target": 40, "fleet": 0, "layout": {"drop": [368, 224], "cones": []}, "camera": null}, {"n": 3, "tile": "C1", "name": "High Road", "stage": "10.3", "rungs": null, "kit": [], "earns": "battery1", "objective": {"kind": "hits", "count": 1, "label": "GET HIT BY THE RED CAR"}, "hints": ["It watches the kerbs, not the sky."], "par": 20, "target": 60, "fleet": 0, "layout": {"drop": [464, 224], "cones": []}, "camera": null}, {"n": 4, "tile": "B2", "name": "The Island", "stage": "10.4", "rungs": null, "kit": ["battery1"], "earns": "car", "objective": {"kind": "hits", "count": 1, "label": "GET HIT BY THE RED CAR"}, "hints": ["Hide where its sensors cannot see. Dash to land ahead of its nose."], "par": 20, "target": 60, "fleet": 0, "layout": {"drop": [416, 496], "cones": [], "cover": [{"kind": "kiosk", "at": 0.5, "side": "N", "gap": 2}]}, "camera": null}, {"n": 5, "tile": "A2", "name": "CCTV", "stage": "10.5", "rungs": null, "kit": ["battery1"], "earns": "hands1", "objective": {"kind": "hits", "count": 1, "label": "GET HIT BY THE RED CAR"}, "hints": ["A dash breaks a camera post. Break it while the car is away."], "par": 30, "target": 80, "fleet": 0, "layout": {"drop": [336, 128], "cones": [], "cover": [{"kind": "cabinet", "at": 0.46, "side": "N", "gap": 2}]}, "camera": {"watch": "cabinet"}}, {"n": 6, "tile": "A3", "name": "Swerve", "stage": "10.6", "rungs": null, "kit": ["hands1"], "earns": "car", "objective": {"kind": "hits", "count": 1, "label": "GET HIT BY THE RED CAR"}, "hints": ["A cone in its lane: it swerves. Be where the swerve goes."], "par": 30, "target": 80, "fleet": 0, "layout": {"drop": [400, 224], "cones": [[340, 224], [470, 220]], "cover": [{"kind": "kiosk", "at": 0.57, "side": "N", "gap": 2}]}, "camera": null}, {"n": 7, "tile": "C2", "name": "Portal", "stage": "10.6", "rungs": null, "kit": ["battery1", "hands1"], "earns": "knees1", "objective": {"kind": "hits", "count": 1, "label": "GET HIT BY THE RED CAR"}, "hints": ["Cones stop it. Cameras still break."], "par": 30, "target": 80, "fleet": 0, "layout": {"drop": [400, 224], "cones": [[480, 236], [520, 236]], "cover": [{"kind": "kiosk", "at": 0.56, "side": "N", "gap": 2}]}, "camera": {"watch": "kiosk"}}, {"n": 8, "tile": "B3", "name": "LED Canyon", "stage": "10.6", "rungs": null, "kit": ["battery1", "knees1"], "earns": null, "objective": {"kind": "hits", "count": 1, "label": "GET HIT BY THE RED CAR"}, "hints": ["Low cover hides you only if you are lower. Hold C."], "par": 25, "target": 70, "fleet": 0, "layout": {"drop": [320, 224], "cones": [], "cover": [{"kind": "hedge", "at": 0.74, "side": "N", "gap": 2}, {"kind": "planter", "at": 0.9, "side": "N", "gap": 2}]}, "camera": null}, {"n": 9, "tile": "C3", "name": "Certification", "stage": "10.8", "rungs": null, "kit": ["battery1", "hands1", "knees1"], "earns": null, "objective": {"kind": "hits", "count": 3, "label": "THREE HITS · A NEW WAY EACH"}, "hints": ["A street camera tells it what it sees. Hide where the camera cannot look.", "It remembers where you came from. Use a new spot.", "A dash breaks a camera post. Then its cover is yours."], "par": 60, "target": 120, "fleet": 0.5, "layout": {"drop": [400, 384], "cover": [{"kind": "cabinet", "at": 0.51, "side": "N", "gap": 2}, {"kind": "kiosk", "at": 0.675, "side": "N", "gap": 2}, {"kind": "hedge", "at": 0.15, "side": "S", "gap": 2}], "cones": [[360, 380], [640, 368]]}, "camera": {"watch": "kiosk"}}]
```

# The kit as built (the design under review)

# DUMMIES GDD — Edit 116: Prototype 11.1, RED-01's kit

**9 November 2026 · Lawrence Lek.** Builds Edits 113–115. Governs the red car's look in Prototype 11.1 (`p11/index.html`). Prototype 11.0 is frozen at `p11_0/index.html`. Newest wins.

## 116.1 Rule

- **One icon.** The sedan silhouette, the red livery and the RED-01 tag stay fixed. Nothing is repainted or reshaped.
- **One piece a rung.** Each lesson bolts one piece into a fixed slot. Pieces accumulate.
- **A piece points where its sensor looks.** The nose looks forward, the mirrors outward, the roof all round.
- **A piece takes its field's colour.** The hardware and its field on the road read as one.

## 116.2 The kit

| Rung | Sensor | Piece | Slot | Colour | Live state |
|---|---|---|---|---|---|
| R0 | Blind | — | — | — | — |
| R1 | Forward camera | Lens bar | Windscreen top | White (`C.text`), as the beam | — |
| R2 | Side sensors | Two pods | Both mirrors | Steel blue (`#7fa8bc`), as the side cones | — |
| R3 | Roof lidar | Puck | Roof | Mint (`C.cam`) | Spins |
| R4 | Street cameras | Link fin | Rear roof | Mint (`C.cam`) | Pulses while a camera reports you |
| R5 | Road items | Bumper strip | Front bumper | Cone orange (`#ff8a1f`) | — |
| R6 | Crash memory | Three tally marks | Bonnet | Dummy yellow (`C.dummy`) | One fills a remembered spot, up to `duel.memorySites` 3 |
| R7 | Search | Searchlight | Roof, front | Search amber (`C.search`) | Blinks and sweeps while it searches |

- **R3 and R4 share mint.** Shape separates them: the puck spins, the fin pulses.
- **Replaces the halo** (`drawHalo`) in P11. Its lidar sweep and search beacon become pieces 3 and 7.

![RED-01's kit at rungs 0–7, and the fitting close-up](img/p11_1_kit.jpg)

## 116.3 Where it shows

| Moment | Shows |
|---|---|
| Play | The kit over the sprite, scaled to the car (`c.L` × `c.W`, 50.4 × 25.2) |
| Tag | RED-01 · R*n* NAME, then seven squares, filled to the car's rung |
| A new rung | The newest piece glints: one ring a second for `duel.kitGlintSeconds` 3. It also glints at each puzzle's first pass |
| Lesson, clip | The kit as it was before the lesson |
| Lesson, fitting | The new piece appears as the drone lands. A close-up shows KIT · RUNG *n* OF 7, the piece lowered into its slot, its name and its slot |

- **At play scale, pieces are 2–4 px.** The tag's squares carry the count.
- **The fitting close-up teaches the piece once.** On the road, the colour ties it to its field.

## 116.4 Across maps (Edit 115 §115.1)

- **The Map 2 drone car is a white Senior with all seven pieces.** It reads as finished. Proposed with `fleet.droneOf.<map>`.
- **A new learner starts bare.** Porter, the van, fills the same slots, scaled to its body.
- **Not built:** Map 2.

## 116.5 Measured (9 November, headless Chromium)

| Check | Result |
|---|---|
| `engine/p11_test.js --boss 200` | Pass. The boss is cleared at 114 s with 3 hits; it reaches rung 7 after 2 mid-puzzle lessons. Each lesson shows the close-up |
| `engine/p9_tiles_test.js` (Submission 7) | Pass, 9 tiles. The kit is P11 only (`s.p11`); `index.html` is unchanged |
| Page errors | None |

## 116.6 Registry

| Value | Id | Status |
|---|---|---|
| Glint length | `duel.kitGlintSeconds` 3 | Proposed |
| Tally slots | `duel.memorySites` 3 | Registered |
| Squares on the tag | The ladder's top rung, 7 (`DUEL.RUNGS`, Edits 101–108) | Build value |
| Piece colours and slots | `KIT`, `C` in `engine/duel_ui.js` | Build values (art) |

## 116.7 Engine hooks

| Hook | Where | Does |
|---|---|---|
| `kitPieces(rung, o)` | `engine/duel_ui.js` | Draws the seven pieces in a unit car's frame (64 × 30, nose +x) |
| `drawKit(c)` | Field | Draws the live kit: spin, link pulse, tallies, search sweep. Holds the glint per sim |
| `kitTag` | `drawTag` | Draws the tag's squares |
| `kitInset` | `drawFit` | Draws the fitting close-up, on the side away from the car |
| Gate | `s.p11` | Submission 7 keeps the halo |
| Build | `build_p9.py --p11` | Labels the build P11.1 · PUZZLES |


# Screenshots (Read every one)

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/1_A1_a_car.png` · puzzle 1 A1 First Contact · rung 0 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/1_A1_a_field.png` · puzzle 1 A1 First Contact · rung 0 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/1_A1_b_car.png` · puzzle 1 A1 First Contact · rung 0 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/1_A1_b_field.png` · puzzle 1 A1 First Contact · rung 0 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/2_B1_a_car.png` · puzzle 2 B1 Stop Line · rung 1 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/2_B1_a_field.png` · puzzle 2 B1 Stop Line · rung 1 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/2_B1_b_car.png` · puzzle 2 B1 Stop Line · rung 1 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/2_B1_b_field.png` · puzzle 2 B1 Stop Line · rung 1 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/3_C1_a_car.png` · puzzle 3 C1 High Road · rung 2 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/3_C1_a_field.png` · puzzle 3 C1 High Road · rung 2 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/3_C1_b_car.png` · puzzle 3 C1 High Road · rung 2 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/3_C1_b_field.png` · puzzle 3 C1 High Road · rung 2 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/4_B2_a_car.png` · puzzle 4 B2 The Island · rung 2 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/4_B2_a_field.png` · puzzle 4 B2 The Island · rung 2 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/4_B2_b_car.png` · puzzle 4 B2 The Island · rung 2 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/4_B2_b_field.png` · puzzle 4 B2 The Island · rung 2 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/5_A2_a_car.png` · puzzle 5 A2 CCTV · rung 4 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/5_A2_a_field.png` · puzzle 5 A2 CCTV · rung 4 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/5_A2_b_car.png` · puzzle 5 A2 CCTV · rung 4 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/5_A2_b_field.png` · puzzle 5 A2 CCTV · rung 4 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/6_A3_a_car.png` · puzzle 6 A3 Swerve · rung 4 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/6_A3_a_field.png` · puzzle 6 A3 Swerve · rung 4 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/6_A3_b_car.png` · puzzle 6 A3 Swerve · rung 4 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/6_A3_b_field.png` · puzzle 6 A3 Swerve · rung 4 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/7_C2_a_car.png` · puzzle 7 C2 Portal · rung 5 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/7_C2_a_field.png` · puzzle 7 C2 Portal · rung 5 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/7_C2_b_car.png` · puzzle 7 C2 Portal · rung 5 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/7_C2_b_field.png` · puzzle 7 C2 Portal · rung 5 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/8_B3_a_car.png` · puzzle 8 B3 LED Canyon · rung 5 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/8_B3_a_field.png` · puzzle 8 B3 LED Canyon · rung 5 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/8_B3_b_car.png` · puzzle 8 B3 LED Canyon · rung 5 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/8_B3_b_field.png` · puzzle 8 B3 LED Canyon · rung 5 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/9_C3_a_car.png` · puzzle 9 C3 Certification · rung 5 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/9_C3_a_field.png` · puzzle 9 C3 Certification · rung 5 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/9_C3_b_car.png` · puzzle 9 C3 Certification · rung 5 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/9_C3_b_field.png` · puzzle 9 C3 Certification · rung 5 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/9_C3_r6_car.png` · puzzle 9 C3 Certification · rung 6 · rung 6 forced, one remembered spot · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/9_C3_r6_field.png` · puzzle 9 C3 Certification · rung 6 · rung 6 forced, one remembered spot · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/9_C3_r7_car.png` · puzzle 9 C3 Certification · rung 7 · rung 7 forced, searching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/9_C3_r7_field.png` · puzzle 9 C3 Certification · rung 7 · rung 7 forced, searching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/1_A1_lesson_clip_field.png` · puzzle 1 A1  · rung 0 · lesson beat 1: the training clip · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-020655-ui-p11_2/shots/1_A1_lesson_fit_field.png` · puzzle 1 A1  · rung 1 · lesson beat 2: the fitting and its close-up · the field, 800 x 640