# The brief (the user, verbatim)

hatched area is overlapping with the front car lights too much., giving mixed signals, too hard to read. Have an adversarial UI agent to examine the car markings and escalating puzzle mechanics with level design. If possible, side sensors etc should show scan radius rather than just being on the car. some things can be on the car, some can be shown as 'sensor' feedback, like those visualisations of car lidar.

# The marks the renderer draws around the red car

Bottom to top. "World units" are the field's pixels at 1x (the field is 800 × 640). RED-01 is 50.4 × 25.2. The dummy's body radius is 13.

## Layer 1: Prototype 9's pixel art (`engine/p9/game.js`, vendored; every car on the dummy's level, the red car included)

| Mark | Drawn | Means in the code | Colour |
|---|---|---|---|
| Headlight beam | A white wedge straight ahead of every car's nose, widening, fading in thirds; shadowed by the dummy and other cars | The car's lights. Prototype 9's art; no rule. It flashes at `proto.art.noticeFlashHz` 4 when the car has "noticed" the dummy by Prototype 9's white-car rule | White, translucent |
| Lamps | Two pixels on the sprite's own headlights (`ui.lampsOnCar` 1) | The lights' source | White |
| Brake glow | A red fan behind a braking car | Braking; held at a standstill for safety | Red |
| Forward corridor (the hatch) | A diagonal hatch (every 4th pixel; every 3rd when "hot"), outlined, straight ahead of the nose, as wide as the car plus the dummy's radius, as long as the car's stopping distance (`fwdLen`) | Prototype 9's WHITE-CAR forward sensor. Drawn for the red car too, at every rung, including rung 0 (blind) | Label grey; ink outline when hot |
| Side sensor outlines | Two dashed sectors, each side of the nose, radius `perception.sideRadius` 100, half angle `perception.sideHalfAngle` 80°; dotted fill on a side detection | Prototype 9's WHITE-CAR side sensors. Drawn for the red car too, at every rung | Label grey |
| Clip | Layer 1's sensor marks only draw inside the dummy's view cone (reach `sensing.coneReach` 900) | What the dummy can see | — |
| View edges | Two faint lines: the dummy's view cone | The dummy's sight | Grey |
| Sprite | Prototype 9's sedan, recoloured red for RED-01; white cars as drawn | — | Red / fleet colours |

## Layer 2: Prototype 10's vector overlay (`engine/duel_ui.js`), the red car only

| Mark | Drawn | Means in the code | Colour |
|---|---|---|---|
| Rung 1 beam | A straight translucent band ahead of the nose, car width + 2 × body radius, `fwdLen` long | The forward camera: it brakes for a dummy in its lane | White α 0.07; red α 0.15 when the dummy is in its path |
| Proportional cones (rung 2 up) | A forward cone (± `perception.forwardConeAngle` 10° round its look, from the nose corners) with 3 dashed grade rings (`perception.forwardGrades`) to reach 340 (`perception.coneRadius`); two side cones (10° to 95° off the nose, each side) with 2 rings (`perception.sideGrades`) to reach 227 (`perception.sideConeRatio` × 340) | What the car sees, graded: each ring nearer is a stronger grade. Side cones are half as sensitive (`perception.sideConeSensitivity` 0.5) | Steel blue fill α 0.05 + 0.2 × sensitivity; YELLOW fill when the car has noticed the dummy; dashed white rings and edges |
| Stop line | A bar across the lane where the braking car will stop; dashed while it approaches; label STOPS HERE | Where it stops short of you | White; red (#ff5a5a) when it expects you (crash memory); amber when searching |
| Awareness | Over the tag: ? (suspects) or ! (has you); a 3-pip meter; a track bar | Its side notice stages: AWARE, SLOWING, CRAWLING, STOPPING | Grey, amber, orange, red |
| Notice ring | A small arc filling right of the tag, `perception.sideNoticeSeconds` 0.6 | Time to notice you in a side cone | White; yellow when full |
| Tag | A label above the car: RED-01 · R*n* NAME · state (AWARE, SLOWING, SEARCHING, FOUND, DRIVING OFF), then seven squares filled to the rung (P11.1) | Its rung and state | White on dark; red squares |
| Kit (P11.1) | One piece a rung on the car (Edit 116): lens bar, mirror pods, roof puck (spins), link fin (pulses while a camera reports you), bumper strip, 3 tally marks, searchlight (sweeps while searching); the newest glints 3 s | Its hardware | White, steel blue, mint, mint, orange, yellow, amber |
| Street cameras (rung 4 up) | A post with a mint lens; a dashed range, a 60° cone that pans (`perception.streetCameraRange` 180, `perception.streetCameraFov` 60, pan `perception.streetCameraPanArc` 60 every `perception.streetCameraPanSeconds` 3) | A camera that reports the dummy to the car | Mint (#9ff2c8) |
| LINKED | A dashed line dummy → camera → car, a box round the dummy, label LINKED | A camera is giving you away | Mint |
| Crash marks | A chalk outline and a numbered marker per crash; from rung 6 the remembered spots ringed (`duel.memoryRadius` 50, up to `duel.memorySites` 3); CHECKING #n over the tag | Where you struck from; what it watches | Chalk; red (#ff5a5a) |
| Ghost (rung 7) | Where it last saw you: a dashed body ring, a search ring (`duel.searchRadius` 60), a countdown arc (`duel.searchSeconds` 4) | Where it searches | Amber (#ffb347) |
| Lunge guide | Where a dash pressed now would land | Yellow when the red car will be there | White / yellow |
| Dummy marks | DUCKED · HIDDEN / DUCKED · SEEN ring; EXPECTED; MOVE ALONG countdown | Its read of the dummy | Grey, yellow, red |
| Flashes | Text by the car or dummy: IT BRAKES FOR YOU, ITS SIDE CONES HAVE YOU, LESSON DUE, YOU HIT IT · YOUR FAULT · NO POINTS, STANDSTILL · NO DAMAGE, HONK | Events | White, red, grey, yellow |

## Layer 3: Prototype 11's frame (`engine/p11_ui.js`)

| Mark | Drawn | Colour |
|---|---|---|
| Panel, top left | RED-01 · RUNG *n* · NAME ◎ hits / count; a second line: what the next hit teaches it | Red border, red and white text |
| Strip, top right | Clock, ★ CLEAR ★ UNTOUCHED ★ PAR, PASS *n* · RESTARTS · R RESTART | Yellow border |
| Hint banner | After two failed passes, bottom | Yellow |
| Broken camera post | A broken post where a dash broke it | — |

## The lesson (between puzzles and mid-boss)

Beat 1, the training clip: the hit replayed in green, REC, IMPACT box. Beat 2, the fitting: a drone lowers the sensor; its field draws out; P11.1 adds a close-up box (KIT · RUNG *n* OF 7, the piece dropping into its slot). Then the card: what it now does, what that closes, what is open, the next puzzle.

## Level pieces

Roadside cover: planter 120 × 16 and hedge 96 × 16 (low; a ducked dummy is hidden behind them); cabinet 44 × 22, kiosk 30 × 20, billboard 64 × 12 (tall). Decks (highways, Z1 and Z2) with parapet gaps over the road; escalators. Cones (orange). Prototype 9's tile art (LED screens, sculptures, arcades).


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

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/1_A1_a_car.png` · puzzle 1 A1 First Contact · rung 0 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/1_A1_a_field.png` · puzzle 1 A1 First Contact · rung 0 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/1_A1_b_car.png` · puzzle 1 A1 First Contact · rung 0 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/1_A1_b_field.png` · puzzle 1 A1 First Contact · rung 0 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/2_B1_a_car.png` · puzzle 2 B1 Stop Line · rung 1 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/2_B1_a_field.png` · puzzle 2 B1 Stop Line · rung 1 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/2_B1_b_car.png` · puzzle 2 B1 Stop Line · rung 1 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/2_B1_b_field.png` · puzzle 2 B1 Stop Line · rung 1 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/3_C1_a_car.png` · puzzle 3 C1 High Road · rung 2 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/3_C1_a_field.png` · puzzle 3 C1 High Road · rung 2 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/3_C1_b_car.png` · puzzle 3 C1 High Road · rung 2 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/3_C1_b_field.png` · puzzle 3 C1 High Road · rung 2 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/4_B2_a_car.png` · puzzle 4 B2 The Island · rung 2 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/4_B2_a_field.png` · puzzle 4 B2 The Island · rung 2 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/4_B2_b_car.png` · puzzle 4 B2 The Island · rung 2 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/4_B2_b_field.png` · puzzle 4 B2 The Island · rung 2 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/5_A2_a_car.png` · puzzle 5 A2 CCTV · rung 4 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/5_A2_a_field.png` · puzzle 5 A2 CCTV · rung 4 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/5_A2_b_car.png` · puzzle 5 A2 CCTV · rung 4 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/5_A2_b_field.png` · puzzle 5 A2 CCTV · rung 4 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/6_A3_a_car.png` · puzzle 6 A3 Swerve · rung 4 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/6_A3_a_field.png` · puzzle 6 A3 Swerve · rung 4 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/6_A3_b_car.png` · puzzle 6 A3 Swerve · rung 4 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/6_A3_b_field.png` · puzzle 6 A3 Swerve · rung 4 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/7_C2_a_car.png` · puzzle 7 C2 Portal · rung 5 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/7_C2_a_field.png` · puzzle 7 C2 Portal · rung 5 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/7_C2_b_car.png` · puzzle 7 C2 Portal · rung 5 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/7_C2_b_field.png` · puzzle 7 C2 Portal · rung 5 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/8_B3_a_car.png` · puzzle 8 B3 LED Canyon · rung 5 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/8_B3_a_field.png` · puzzle 8 B3 LED Canyon · rung 5 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/8_B3_b_car.png` · puzzle 8 B3 LED Canyon · rung 5 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/8_B3_b_field.png` · puzzle 8 B3 LED Canyon · rung 5 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/9_C3_a_car.png` · puzzle 9 C3 Certification · rung 5 · mid-tile, dummy at the drop · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/9_C3_a_field.png` · puzzle 9 C3 Certification · rung 5 · mid-tile, dummy at the drop · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/9_C3_b_car.png` · puzzle 9 C3 Certification · rung 5 · dummy on the kerb ahead, car approaching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/9_C3_b_field.png` · puzzle 9 C3 Certification · rung 5 · dummy on the kerb ahead, car approaching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/9_C3_r6_car.png` · puzzle 9 C3 Certification · rung 6 · rung 6 forced, one remembered spot · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/9_C3_r6_field.png` · puzzle 9 C3 Certification · rung 6 · rung 6 forced, one remembered spot · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/9_C3_r7_car.png` · puzzle 9 C3 Certification · rung 7 · rung 7 forced, searching · 2x crop round the car
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/9_C3_r7_field.png` · puzzle 9 C3 Certification · rung 7 · rung 7 forced, searching · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/1_A1_lesson_clip_field.png` · puzzle 1 A1  · rung 0 · lesson beat 1: the training clip · the field, 800 x 640
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-013907-ui-p11_1/shots/1_A1_lesson_fit_field.png` · puzzle 1 A1  · rung 1 · lesson beat 2: the fitting and its close-up · the field, 800 x 640