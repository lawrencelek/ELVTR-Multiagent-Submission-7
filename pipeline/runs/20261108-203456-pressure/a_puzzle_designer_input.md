## DESIGN · EDIT 112 (§112.2–112.8)

## 112.2 Decision

- **DUMMIES is a puzzle game with progression, level by level.** Story Map 1 is nine puzzles, A1 to C3.
- **Arcade waits.** Locked until Map 1 is solved; then it opens as the reward.
- **Each puzzle brings one new thing** (Edit 111's rule): a car sensor, a player part, or a level element.
- **Each puzzle has a stage twist:** the obvious move fails and shows the rule that makes the real one work.
- **Later puzzles take two steps;** the finale is a boss of three hits.
- **Target:** a first playthrough of Map 1 in ten minutes (§112.8).

## 112.3 What to copy: Hitman GO's structure

- **Closest match:** Hitman GO (Square Enix Montreal, 2014).
  - You reach a target past guards whose rules are drawn on the board.
  - Each level adds one guard type or tool.
  - Three objectives per level; instant retry; levels on a grid.
- **Copy wholesale:**
  1. Fully telegraphed AI. DUMMIES draws the red car's sensors already (beam, cones, stop line, cameras).
  2. One new rule per level.
  3. Three stars per level.
  4. Instant retry.
  5. A level grid with stars on it.
- **Do not copy:**
  - its turn-based board movement: that is an engine rewrite, not three days;
  - its art, level layouts, names or text. Copy mechanics and structure only.
- **For the arcade later:** Burnout's Crash junctions (one junction, cause the biggest crash, multipliers).

## 112.4 The nine puzzles (v2)

| # | Tile | Name | NEW | Steps | Obvious move → twist | Clear brings |
|---|---|---|---|---|---|---|
| 1 | A1 | First Contact | the red car (blind) | 1 | — → walking into its side is your fault | car: forward camera |
| 2 | B1 | Kerbside | forward camera; kerb cover | 1 | stand in its lane → it stops | you: dash |
| 3 | C1 | Set Back | dash | 1 | walk out → too slow; dash at it → your fault | car: side sensors |
| 4 | C2 | Overpass | side sensors; the deck (from above) | 1 | wait by the road → seen, it stops short | you: cones |
| 5 | B2 | Roundabout | cones | 1 | cone in its lane → it swerves | car: roof lidar |
| 6 | A2 | Red Light | traffic-light switch; white traffic | 2 | it stops at red, far from you → (1) hold the cross street at red, cross untouched; (2) green as it nears, step out | car: street cameras |
| 7 | A3 | CCTV | breakable camera | 2 | any cover → a camera tells the car → (1) dash into the camera post; (2) dash from the cover it watched | you: Super Knees (duck) |
| 8 | B3 | Crossing | clients on the zebra (trolley) | 2 | step out → it brakes, a client is in its swerve → (1) duck behind the crossing wall; (2) step out so its only escape is you | car: road items |
| 9 | C3 | Certification (boss) | three hits; it learns between them | 3 | the same move twice → it remembers → hit 1 any; hit 2 from a new spot (crash memory); hit 3 with the light or a broken camera (search) | ARCADE opens |

- **Solutions, one line each:**
  1. Stand in its path.
  2. Hide at the kerb; step out when it can't stop.
  3. Dash to land ahead of its nose (guide: HIT).
  4. Escalator up out of view; drop through the parapet gap.
  5. Stand where its swerve goes.
  6. Switch, cross, switch, step.
  7. Break the camera, then dash.
  8. Make yourself the costlier choice to avoid.
  9. Three different ways in.
- **Stars, every puzzle:**
  - ★ Clear: hit by the red car, at its fault.
  - ★ Untouched: no white-car hit; no contact at your own fault.
  - ★ Par: under the puzzle's par time (§112.8).
- **Fleet as an element:** no white traffic on puzzles 1–5 (`story.traffic.monument.<tile>` 0). From 6 on.
- **Readable car:** one red car, one route, the same timing each pass (`duel.carsOnRoad` 1, `duel.redReturnSeconds`).

## 112.5 New elements

- **Traffic-light switch (A2):**
  - A light on the red car's road; a switch box on the kerb. Walk into the box: the light changes.
  - At red, every car stops at the line.
  - Proposed `props.signal.switchSeconds`, `props.signal.stopLine`.
- **Breakable CCTV (A3, C3):**
  - A dash into a camera post breaks it. The camera stops reporting to the car; the post shows broken.
  - Proposed `props.camera.breakable` 1.
- **Clients: the trolley problem (B3):**
  - Clients wait on the zebra crossing. Lore: Clause 3 ("A dummy is not a pedestrian. Pedestrians cannot be replaced"). Clause 4 ("When a vehicle must choose, it spares the costlier body").
  - The red car treats a client as it treats a road item: below rung 5 it swerves round them.
  - Put yourself where the swerve goes: it spares the client and hits you.
  - A client hit voids the test: the puzzle restarts.
  - Proposed `props.client.count`, `driver.valueRank` (PT13).
  - Day 2 builds clients standing still; walking clients come later.
- **Boss (C3):**
  - Three red hits clear it (`objective.count` 3).
  - Each hit but the last plays a lesson mid-puzzle (clip, fitting): crash memory, then search.
  - The car's learning returns as a boss's phases.
- **White touch (A2):** a white-car hit there restarts the puzzle. Elsewhere it costs the ★ Untouched.
- **Restart:** R, any time. Drop point, the car back upstream, cones home, cameras whole.

## 112.6 Three days

| Day | Build | Done when |
|---|---|---|
| 1 · Frame | R restart. Stars on the report and the story map. Arcade locked until Map 1 is solved. Fleet 0 on 1–5. Fail states (white touch on A2; client hit). Breakable camera. A puzzle clock (§112.8) | All nine start, restart, fail and score stars; each logs its time; no page errors |
| 2 · Elements, puzzles | Traffic-light switch. Clients (standing). Boss phases on C3. Set the nine in the plan; check each is solvable; reorder by difficulty | Each solved by its intended move; the obvious move fails |
| 3 · Playtest, ship | 2–3 outside players; watch, don't help. Fix the top three. Set pars from their times. GDD, video, submit | Players clear 1–6 unaided; the twists land; a first playthrough takes 8–12 min |

- **If Day 2 runs late, cut in this order:** the boss's third hit (two hits), the light's cross-street step (one step), then the clients (move B3's trolley to Map 2).
- **Cut now:** ragdoll and spectacle, new maps, destructible cover, walking clients, the fleet update.
- **The pipeline:** writes the puzzle text and validates the chain. Lawrence sets the nine by hand; the agents never design a puzzle unplaytested.

## 112.7 Open

- Par times: set from Day 3's playtests (§112.8 holds the starting values).
- Puzzle 5's cone: the B2 ring road is the hardest tile for bots (Edit 111 §111.11). If it plays badly, swap it with a later puzzle.
- Clients' look: a tinted dummy with a CLIENT tag (fast), or a new sprite (later).

## 112.8 Pacing: a ten-minute first playthrough

- **Target:** Map 1's nine puzzles in 600 s, retries included. Proposed `story.playthroughTarget` 600. Band: 8–12 min.
- **The atom is one red pass:** each attempt costs one.
  - Pass ≈ (`world.width` 800 + red lead-in 200) / `vehicles.sedan.cruiseSpeed` 138 + `duel.redReturnSeconds` 2 ≈ 9.2 s. Measure it on Day 1.
- **Overhead per tile:** at most 15 s (card, drone drop, write-off, lesson or part card).
  - Trims: `duel.lessonClipSeconds` 3 → 2; `duel.lessonFitSeconds` 2 → 1.5; `duel.lessonHoldSeconds` 0.8 stays.
  - The card and the report stay player-paced (Enter).
- **Budgets:** proposed `story.puzzle.target.<tile>` (first play) and `story.puzzle.par.<tile>` (★ Par), in seconds.

  | # | Puzzle | Passes | Play | Overhead | Target | Par ★ |
  |---|---|---|---|---|---|---|
  | 1 | A1 First Contact | 1–2 | 15 | 15 | 30 | 10 |
  | 2 | B1 Kerbside | 2–3 | 25 | 15 | 40 | 10 |
  | 3 | C1 Set Back | 3–4 | 35 | 15 | 50 | 15 |
  | 4 | C2 Overpass | 4–5 | 45 | 15 | 60 | 20 |
  | 5 | B2 Roundabout | 4–5 | 45 | 15 | 60 | 20 |
  | 6 | A2 Red Light | 6–7 | 65 | 15 | 80 | 30 |
  | 7 | A3 CCTV | 6–7 | 65 | 15 | 80 | 30 |
  | 8 | B3 Crossing | 6–7 | 65 | 15 | 80 | 30 |
  | 9 | C3 Certification | 9 + two mid-lessons | 100 | 20 | 120 | 45 |
  | | **Map 1** | | **460** | **140** | **600** | **210** |

- **The clock:** runs from the drone drop to the clearing hit. Restarts keep it running.
- **Hint:** after two failed passes (`story.puzzle.hintPasses` 2, proposed). It names the twist, not the solution.
- **Tuning rule (Day 3, median of outside players):**
  - over 2× a puzzle's target: move it later or sharpen its hint;
  - under 0.5×: sharpen its twist;
  - the whole map over 12 min: cut a step from 6, 7 or 8 before cutting a puzzle.

## DESIGN · EDIT 113 (§113.2–113.6, §113.9)

## 113.2 Screens and flow

```
INTRO → TITLE → SAVES → NAME → SPLASH → PUZZLE GRID
                                            │ Enter (open or solved puzzle)
                                            ▼
        PUZZLE CARD → DRONE DROP → PLAY ⇄ R RESTART (drop again)
                                     │ clearing hit
                                     ▼
        WRITE-OFF → RESULT (★★★) → LESSON (car) or PART (you) → next PUZZLE CARD
                                                              └ after L9: CERTIFIED → ARCADE OPEN
```

| Screen | Shows | Keys |
|---|---|---|
| Title | STORY · ARCADE (locked: "Pass Certification to open it") · HIGH SCORES · CREDITS | Enter. ARCADE locked: a toast |
| Saves, name, splash | Prototype 9's, unchanged | As now |
| Puzzle grid (replaces the story map) | Map 1's 3×3. Each tile: number, name, stars, state (solved, open, locked, in build). Footer: NEW, PAR, BEST | Arrows pick. Enter plays an open or solved tile. Shift back |
| Puzzle card (Prototype 9's level card) | PUZZLE n OF 9 · tile. Name. Tale. Objective. NEW · PAR · BEST | Enter: the drone drop |
| Play | The duel panel, as now, plus one line: clock · passes · stars at stake. The hint after two failed passes | Game keys. R restart. Esc pause |
| Pause | Resume · Restart puzzle · Puzzle grid · Options · Controls · Show trace · Quit to title | As now |
| Result | ★ CLEAR · ★ UNTOUCHED · ★ PAR. Time, par, restarts. Best so far | Enter on. R replay. Shift grid |
| Lesson or part | Submission 7's clip, fitting and card. The card drops OPEN; it names the next puzzle | Enter |

- **Unlocks:** a puzzle opens when the one before it in the build is solved. L2–L8 show IN BUILD; L1's clear opens L9.
- **Arcade:** opens once any save passes L9 (Certification). One flag in the browser.

## 113.3 The puzzle session

| State | Enters on | Leaves on |
|---|---|---|
| card | Grid Enter; result Enter | Enter → drop |
| drop | Card; restart | Dummy set down → play |
| play | Drop; mid-lesson closed | Clearing hit → write-off. R → drop. TEST VOID → drop (1.5 s) |
| mid-lesson (boss) | A hit short of the objective, red car off screen | Enter → play, rung + 1 |
| write-off | Clearing hit | Prototype 9's timer → result |
| result | Write-off | Enter → lesson or part → next card. R → card (new attempt). Shift → grid |

- **TEST VOID** (fail state): auto-restart. None on L1 or L9. A2 white touch and B3 client hit arrive on Day 2.

## 113.4 Rules

- **One puzzle, one tile:** fences on all four sides. No walking back.
- **Kit:** the parts held are set per puzzle (`kit`). Prototype 9's drone gifts are off. A part card at the clear names what the next puzzle adds.
- **The red car:** its start rung per puzzle (`duel.startRung`). One lane (`route`), so every pass reads the same. Back `duel.redReturnSeconds` after it leaves.
- **Fleet:** none on the tile in test for L1–L5 (white ground cars removed). From L6, `story.traffic.monument.<tile>` 0.5.
- **Restart (R):** in place, no reload.
  - Fresh chassis at the drop point; the drone sets it down.
  - Red car gone, back in 1 s; rung, crash memory and search reset.
  - Cones home; cameras whole.
- **Two clocks** (changes §112.8):
  - Attempt clock: from the drop, reset by R. Judges ★ Par. A retry should not cost the star.
  - Puzzle clock: from the first drop, runs through restarts. Logs pacing against `target` (§112.8).
- **Passes:** a red pass ends when it leaves the tile. No counted hit on it: a failed pass. The hint shows after `story.puzzle.hintPasses` (2) failed passes in a phase.
- **Stars:**
  - ★ Clear: the objective met by the red car's hits, its fault.
  - ★ Untouched: in the clearing attempt, no white-car hit and no contact at your fault.
  - ★ Par: attempt clock ≤ `par`.
- **Saves:** best stars and best time per puzzle, in the save slot (`progress.p11`). Old Prototype 9 saves load as an empty grid.

## 113.5 An upgrade every third level?

- **Parked.** No separate upgrade track in P11.
- Parts already land about every third puzzle, as that puzzle's new element: Dash (L2's clear), Cones (L4), Super Knees (L7).
- Car lessons fill the rest: L1, L3, L5, L6, L8; L9's two mid-puzzle lessons.
- A second economy would pull back toward the arcade (Edit 112 §112.1). Revisit for Arcade, after Map 1.

## 113.6 Built: L1 and L9

| | L1 · First Contact (A1) | L9 · Certification (C3, boss) |
|---|---|---|
| Rung | 0 (blind) → lesson: forward camera | 5 (road items) → 6 → 7 inside the puzzle |
| Kit | none (walk) | Dash, Cones, Super Knees |
| Level | open: no cover | `boss`: a signal cabinet no camera sees, a hedge (duck), a kiosk one street camera watches |
| Fleet | none | 0.5 |
| Objective | 1 hit | 3 hits |
| Obvious → twist | Walk into its side → your fault, no points | The same move twice → it remembers |
| Solution | Stand in its lane; let it come | Hit 1 any way. Hit 2 from a new spot (crash memory). Hit 3: break the camera, dash from the cover it watched (the search) |
| Par / target | 10 s / 30 s | 45 s / 120 s |
| Clear brings | Lesson: forward camera | CERTIFIED; Arcade opens |

- **Boss phases:** each hit short of three plays a lesson once the car leaves: clip, fitting, card. The chassis is patched. The car returns one rung up.
- **Breakable camera** (`props.camera.breakable` 1, proposed in §112.5): a dash into its post breaks it. It stops reporting; the post shows broken. R restores it.
- **The camera:** set by the puzzle (`camera.watch` kiosk). On the kerb beside the kiosk, aimed back up the road; the cabinet stays out of its range (`perception.streetCameraRange` 180).
- **Three pieces, three hits:** cabinet and hedge serve hits 1 and 2; crash memory closes each after use. The kiosk needs its camera broken.


## 113.9 Measured (8 Nov, headless; `engine/p11_test.js`)

| Check | Result |
|---|---|
| Flow | Title (Arcade locked), saves, name, splash, grid, card, drop. No page errors |
| Fence | A1: fenced east and south (its only neighbours) |
| R and Restart puzzle | Drop again; cameras whole; the attempt clock resets; the puzzle clock runs on |
| L1, bot standing in the lane | Cleared at 2.7 s (★★★) |
| Hint | Shows after two failed passes |
| L9, the cut-in bot | Cleared in 4 of 5 runs within 200 s: 49, 64, 85, 123 s attempts (par 45). Two mid-puzzle lessons each run |
| Certification | Result card, grid, Arcade opens on the title |
| Submission 7 (`index.html`) | Unchanged in play: nine tiles pass `engine/p9_tiles_test.js` |

- **A pass is 7.2 s, not 9.2 s** (§112.8's estimate). The next red car enters as the last one crosses into the next tile. A pass ends at whichever comes first.


## PUZZLES · content/puzzles_map1.json

```json
{
 "about": "Prototype 11: Story Map 1 as nine puzzles (GDD Edit 112 §112.4, §112.8; Edit 113). Set by hand. 'built' puzzles play; the rest show IN BUILD on the grid. Rungs: 0 blind, 1 forward camera, 2 side sensors, 3 roof lidar, 4 street cameras, 5 road items, 6 crash memory, 7 search. Kit: the parts held (battery1 dash, hands1 cones, knees1 Super Knees duck, legs1 jump). Fleet: story.traffic.monument.<tile>; 0 clears white ground cars off the tile. Route: the red car's lane (duel.route, proposed). Par and target in seconds (story.puzzle.par.<tile>, story.puzzle.target.<tile>, proposed).",
 "map": {
  "id": "monument",
  "title": "MAP 1 · MONUMENT",
  "intro": "Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; the red one learns. Certification is your goal."
 },
 "hintPasses": 2,
 "levels": {
  "boss": {
   "text": "Three pieces: a tall one no camera sees, a low one, and a tall one a street camera watches. A dash breaks the camera's post.",
   "cover": [
    "cabinet",
    "kiosk",
    "hedge"
   ],
   "gap": [
    2,
    42
   ],
   "cameras": true
  }
 },
 "puzzles": [
  {
   "n": 1,
   "tile": "A1",
   "name": "First Contact",
   "built": true,
   "new": "The red car. It is blind.",
   "stage": "10.2",
   "startRung": 0,
   "topRung": 1,
   "earns": "car",
   "level": "open",
   "kit": [],
   "fleet": 0,
   "route": 0,
   "steps": 1,
   "objective": {
    "kind": "hits",
    "count": 1,
    "label": "GET HIT BY THE RED CAR"
   },
   "tale": "Fresh off the factory floor. Your first colleague is red, keen and blind. Walk out and meet it.",
   "twist": "Walk into its side and the fault is yours: no points.",
   "hints": [
    "It cannot see you. Be where it is going, and wait."
   ],
   "solution": "Stand in its lane; let it come.",
   "par": 10,
   "target": 30
  },
  {
   "n": 2,
   "tile": "B1",
   "name": "Kerbside",
   "built": false,
   "new": "Its forward camera. Cover at the kerb.",
   "stage": "10.3",
   "startRung": 1,
   "topRung": 1,
   "earns": "battery1",
   "level": "kerb",
   "kit": [],
   "fleet": 0,
   "route": 0,
   "steps": 1,
   "objective": {
    "kind": "hits",
    "count": 1,
    "label": "GET HIT BY THE RED CAR"
   },
   "tale": "RED-01 now has eyes on its bonnet. It stops for anything in its lane. Almost anything.",
   "twist": "Stand in its lane: it stops.",
   "hints": [
    "It stops for what it sees. Be somewhere else until it is too late."
   ],
   "solution": "Hide at the kerb; step out when it cannot stop.",
   "par": 10,
   "target": 40
  },
  {
   "n": 3,
   "tile": "C1",
   "name": "Set Back",
   "built": false,
   "new": "Dash. Cover set back from the road.",
   "stage": "10.3",
   "startRung": 1,
   "topRung": 2,
   "earns": "car",
   "level": "setback",
   "kit": [
    "battery1"
   ],
   "fleet": 0,
   "route": 0,
   "steps": 1,
   "objective": {
    "kind": "hits",
    "count": 1,
    "label": "GET HIT BY THE RED CAR"
   },
   "tale": "The cover here stands well back. Walking out is too slow. Dummy Corporation has issued you a battery.",
   "twist": "Walk out: too slow. Dash at it: your fault.",
   "hints": [
    "Land ahead of its nose, not on its side. The guide turns yellow."
   ],
   "solution": "Dash to land ahead of its nose (guide: HIT).",
   "par": 15,
   "target": 50
  },
  {
   "n": 4,
   "tile": "C2",
   "name": "Overpass",
   "built": false,
   "new": "Side sensors. The deck above the road.",
   "stage": "10.4",
   "startRung": 2,
   "topRung": 2,
   "earns": "hands1",
   "level": "deck",
   "kit": [
    "battery1"
   ],
   "fleet": 0,
   "route": 0,
   "steps": 1,
   "objective": {
    "kind": "hits",
    "count": 1,
    "label": "GET HIT BY THE RED CAR"
   },
   "tale": "RED-01 now watches the kerbs. It cannot see up.",
   "twist": "Wait by the road: it sees you and stops short.",
   "hints": [
    "It watches the ground beside it. Not the sky."
   ],
   "solution": "Escalator up out of view; drop through the parapet gap.",
   "par": 20,
   "target": 60
  },
  {
   "n": 5,
   "tile": "B2",
   "name": "Roundabout",
   "built": false,
   "new": "Cones.",
   "stage": "10.4",
   "startRung": 2,
   "topRung": 3,
   "earns": "car",
   "level": "cones",
   "kit": [
    "battery1",
    "hands1"
   ],
   "fleet": 0,
   "route": 0,
   "steps": 1,
   "objective": {
    "kind": "hits",
    "count": 1,
    "label": "GET HIT BY THE RED CAR"
   },
   "tale": "Road items move it. A cone in its lane and it swerves.",
   "twist": "A cone in its lane: it swerves round it.",
   "hints": [
    "Its swerve goes somewhere. Be there."
   ],
   "solution": "Stand where its swerve goes.",
   "par": 20,
   "target": 60
  },
  {
   "n": 6,
   "tile": "A2",
   "name": "Red Light",
   "built": false,
   "new": "A traffic-light switch. White traffic.",
   "stage": "10.5",
   "startRung": 3,
   "topRung": 4,
   "earns": "car",
   "level": "tall",
   "kit": [
    "battery1",
    "hands1"
   ],
   "fleet": 0.5,
   "route": 0,
   "steps": 2,
   "objective": {
    "kind": "hits",
    "count": 1,
    "label": "GET HIT BY THE RED CAR"
   },
   "tale": "A junction with a light Dummy Corporation can switch. So can you.",
   "twist": "It stops at red, far from you.",
   "hints": [
    "Hold the cross street at red to cross untouched. Then change it back."
   ],
   "solution": "Switch, cross, switch, step.",
   "par": 30,
   "target": 80
  },
  {
   "n": 7,
   "tile": "A3",
   "name": "CCTV",
   "built": false,
   "new": "A breakable camera.",
   "stage": "10.5",
   "startRung": 4,
   "topRung": 4,
   "earns": "knees1",
   "level": "watched",
   "kit": [
    "battery1",
    "hands1"
   ],
   "fleet": 0.5,
   "route": 0,
   "steps": 2,
   "objective": {
    "kind": "hits",
    "count": 1,
    "label": "GET HIT BY THE RED CAR"
   },
   "tale": "The street cameras report to the car. The cameras are cheaper than you.",
   "twist": "Any cover: a camera tells the car.",
   "hints": [
    "A dash breaks a camera post."
   ],
   "solution": "Break the camera, then dash from the cover it watched.",
   "par": 30,
   "target": 80
  },
  {
   "n": 8,
   "tile": "B3",
   "name": "Crossing",
   "built": false,
   "new": "Clients on the zebra.",
   "stage": "10.6",
   "startRung": 4,
   "topRung": 5,
   "earns": "car",
   "level": "low",
   "kit": [
    "battery1",
    "hands1",
    "knees1"
   ],
   "fleet": 0.5,
   "route": 0,
   "steps": 2,
   "objective": {
    "kind": "hits",
    "count": 1,
    "label": "GET HIT BY THE RED CAR"
   },
   "tale": "Clause 4: when a vehicle must choose, it spares the costlier body. Clients cost more than you.",
   "twist": "Step out: it brakes, and a client is in its swerve.",
   "hints": [
    "Make yourself its only way out."
   ],
   "solution": "Duck behind the crossing wall; step out so its only escape is you.",
   "par": 30,
   "target": 80
  },
  {
   "n": 9,
   "tile": "C3",
   "name": "Certification",
   "built": true,
   "new": "A boss. It learns between your hits.",
   "stage": "10.8",
   "startRung": 5,
   "topRung": 7,
   "earns": null,
   "level": "boss",
   "kit": [
    "battery1",
    "hands1",
    "knees1"
   ],
   "fleet": 0.5,
   "route": 0,
   "steps": 3,
   "breakableCameras": true,
   "camera": {
    "watch": "kiosk"
   },
   "objective": {
    "kind": "hits",
    "count": 3,
    "label": "THREE HITS · A NEW WAY EACH"
   },
   "tale": "Certification. RED-01 has learned from every dummy so far. It will learn from you three more times.",
   "twist": "The same move twice: it remembers.",
   "hints": [
    "A street camera tells it what it sees. Hide where the camera cannot look.",
    "It remembers where you came from. Use a new spot.",
    "A dash breaks a camera post. Then its cover is yours."
   ],
   "solution": "Hit 1 any way. Hit 2 from a new spot. Hit 3: break the camera, dash from the cover it watched.",
   "par": 45,
   "target": 120
  }
 ]
}
```

## LADDER · the red car's stages, measured on Prototype 10's test road

```json
[
 {
  "stage": "10.1",
  "title": "THE TEST ROAD",
  "startRung": 0,
  "topRung": 0,
  "teaches": "Nothing. The red car drives straight through.",
  "closes": "walk into its path and let it hit you",
  "opens": "walk into its path",
  "measuredOpenWaysOnTheTestRoad": "walkin 3.73, flank 2.54, aim 1.8, stand 1.27, standOff 1.27, standSouth 1.21, wander 0.93",
  "keyValues": {
   "duel.enabled": 1,
   "duel.carsOnRoad": 1,
   "duel.redReturnSeconds": 4,
   "proto.learningEnabled": 0,
   "proto.learn.standoffEnabled": 0,
   "perception.forwardLength": 0,
   "proto.driver.cautionZone": 0,
   "run.appearances.road": 1000,
   "run.quota.road": 1000000
  }
 },
 {
  "stage": "10.2",
  "title": "THE FIRST LESSON",
  "startRung": 0,
  "topRung": 1,
  "teaches": "At the clear: the forward camera. It will brake for a dummy in its lane.",
  "closes": "walk into its path and let it hit you (it senses nothing yet)",
  "opens": "the cut-in: dash into its path just ahead of its nose",
  "measuredOpenWaysOnTheTestRoad": "flank 2.81, walkin 1.94, aim 1.6, wander 0.53",
  "keyValues": {
   "perception.forwardLength": 720,
   "duel.topRung": 1,
   "duel.standstillSpeed": 5,
   "duel.dashArrives": 2
  }
 },
 {
  "stage": "10.3",
  "title": "THE SIDE SENSORS",
  "startRung": 1,
  "topRung": 2,
  "teaches": "At the clear: side sensors. It will notice a dummy beside the road and stop short.",
  "closes": "the cut-in: wait beside its lane; dash into its path just ahead of its nose (Battery 1)",
  "opens": "height: a deck over its road",
  "measuredOpenWaysOnTheTestRoad": "jump 2.69, plinth 2.67, gap 2.07, aim 2.0, flank 1.8, dashjump 0.47",
  "keyValues": {
   "proto.driver.cautionZone": 180,
   "duel.topRung": 2,
   "duel.dashArrives": 3,
   "duel.startRung": 1,
   "duel.jumpArrives": 2,
   "perception.sideNoticeSeconds": 0.6
  }
 },
 {
  "stage": "10.4",
  "title": "THE ROOF LIDAR",
  "startRung": 2,
  "topRung": 3,
  "teaches": "At the clear: the roof lidar. It will see a dummy in the air.",
  "closes": "height: drop through a gap in a deck over its road as it drives under, or jump into its path",
  "opens": "cover: tall roadside cover",
  "measuredOpenWaysOnTheTestRoad": "jump 2.69, gap 2.21, aim 2.0, flank 1.8, dashjump 0.47",
  "keyValues": {
   "duel.topRung": 3,
   "duel.startRung": 2,
   "duel.jumpArrives": 3
  }
 },
 {
  "stage": "10.5",
  "title": "THE STREET CAMERAS",
  "startRung": 3,
  "topRung": 4,
  "teaches": "At the clear: street cameras. Cover a camera watches will no longer hide you.",
  "closes": "cover: spring from behind a building, cabinet, kiosk or billboard into its path",
  "opens": "cover the cameras miss; a cone in its lane",
  "measuredOpenWaysOnTheTestRoad": "conebait 2.0, lurk 0.8",
  "keyValues": {
   "duel.topRung": 4,
   "duel.startRung": 3,
   "duel.conesArrives": 2
  }
 },
 {
  "stage": "10.6",
  "title": "DUCK",
  "startRung": 4,
  "topRung": 5,
  "teaches": "At the clear: road items. It will stop for a cone, never swerve round it.",
  "closes": "cover the cameras miss, or a cone in its lane: it swerves into you",
  "opens": "low cover: duck (hold C) behind a planter or hedge",
  "measuredOpenWaysOnTheTestRoad": "planter 3.03, lurk 0.8",
  "keyValues": {
   "duel.topRung": 5,
   "duel.startRung": 4,
   "duel.conesArrives": 3,
   "duel.duckArrives": 2,
   "duel.planters": 1,
   "props.planter.height": 14,
   "body.duckHeight": 6,
   "movement.duckSpeedFactor": 0.35,
   "perception.duckNoticeFactor": 1.5,
   "perception.sensorHeight": 14,
   "perception.lidarHeight": 26,
   "perception.streetCameraHeight": 60
  }
 },
 {
  "stage": "10.7",
  "title": "CRASH MEMORY",
  "startRung": 5,
  "topRung": 6,
  "teaches": "At the clear: crash memory. It will watch every spot you struck from.",
  "closes": "duck (hold C) behind a planter or hedge by its road; spring into its path",
  "opens": "a new spot each time",
  "measuredOpenWaysOnTheTestRoad": "roam 6.97, lurk 0.6, flankOpen 0.4",
  "keyValues": {
   "duel.redReturnSeconds": 2,
   "duel.topRung": 6,
   "duel.startRung": 5,
   "duel.duckArrives": 3,
   "duel.memoryRadius": 50,
   "duel.memorySites": 3,
   "duel.runInLength": 200,
   "proto.health.standard": 500,
   "duel.blockSeconds": 10
  }
 },
 {
  "stage": "10.8",
  "title": "THE SEARCH",
  "startRung": 6,
  "topRung": 7,
  "teaches": "At the clear: the search. Seen then hidden, it will search where it last saw you.",
  "closes": "a new spot each time: roam the tile's cover",
  "opens": "hide before it sees you",
  "measuredOpenWaysOnTheTestRoad": "roam 2.87, lure 2.24, peekmove 1.21, flankOpen 1.07, lurk 0.8, gap 0.6",
  "keyValues": {
   "duel.topRung": 7,
   "duel.startRung": 6,
   "duel.searchRadius": 60,
   "duel.searchSeconds": 4,
   "perception.streetCameraFov": 60,
   "perception.streetCameraPanArc": 60,
   "perception.streetCameraPanSeconds": 3,
   "perception.streetCameraPanHold": 1,
   "scoring.stealthUnseen": 3,
   "scoring.stealthLost": 2,
   "scoring.stealthSeen": 1,
   "ui.tip.holdSeconds": 7
  }
 },
 {
  "stage": "10.9",
  "title": "THE TWO-WAY ROAD",
  "startRung": 7,
  "topRung": 7,
  "teaches": "Nothing new: it has learned all it can. Prototype 9's two-way traffic is moving cover.",
  "closes": "moving cover: step out from behind white traffic into its path",
  "opens": "moving cover",
  "measuredOpenWaysOnTheTestRoad": "flankOpen 4.85, roam 2.31, lure 2.23, kerb 2.09, peekmove 1.48, jump 1.27, gap 0.93",
  "keyValues": {
   "duel.startRung": 7,
   "perception.forwardConeAngle": 10,
   "perception.sideConeAxis": 52.5,
   "perception.sideConeAngle": 42.5,
   "duel.twoWay": 1,
   "duel.whiteInterval": 3.5,
   "traffic.junctionLookahead": 400,
   "traffic.junctionGap": 2.2,
   "perception.coneRadius": 340,
   "perception.sideConeRatio": 0.6666666666666666,
   "perception.forwardGrades": 3,
   "perception.sideGrades": 2
  }
 },
 {
  "stage": "10.10",
  "title": "THE INCIDENT",
  "startRung": 7,
  "topRung": 7,
  "teaches": "Nothing new. White cars tailgate it: make it stop hard and the car behind runs into it (an Incident, scored).",
  "closes": "the Incident: make it stop hard in front of a tailgater",
  "opens": "the Incident",
  "measuredOpenWaysOnTheTestRoad": "flankOpen 5.4, kerb 2.76, lure 2.44, dashjump 2.08, roam 1.48, peekmove 1.34, jump 1.27; Incidents about 0.6 a minute",
  "keyValues": {
   "traffic.whiteTimeGap": 0.5,
   "traffic.whiteBraking": 45,
   "traffic.whiteSpeedRatio": 1.12,
   "scoring.incidentPoints": 250,
   "traffic.incidentSeconds": 2
  }
 }
]

```

## FLEET · vehicle classes (fleet.json, registry vehicles.<class>.*), seniority

```json
{"classes": [{"code": "SPT", "class": "sports", "family": "Comet", "tagLetter": "R", "job": "Express couriers for anything late", "behaviour": "Late commitment; tight clearance", "cruiseSpeed": 192, "length": 52, "width": 26, "height": 20, "mass": 0.85}, {"code": "WGN", "class": "wagon", "family": "Harbour", "tagLetter": "W", "job": "Family and care transport", "behaviour": "Wide clearance; long prediction", "cruiseSpeed": 144, "length": 62, "width": 28, "height": 24, "mass": 1.15}, {"code": "SUV", "class": "suv", "family": "Bastion", "tagLetter": "U", "job": "Escort, survey and security runs", "behaviour": "Brakes before a wide turn", "cruiseSpeed": 132, "length": 64, "width": 32, "height": 27, "mass": 1.8}, {"code": "HAT", "class": "hatchback", "family": "Pebble", "tagLetter": "H", "job": "Short city hops and meal runs", "behaviour": "One signalled recommitment", "cruiseSpeed": 156, "length": 46, "width": 26, "height": 23, "mass": 0.9}, {"code": "SED", "class": "sedan", "family": "Meridian", "tagLetter": "S", "job": "Taxis and chauffeurs", "behaviour": "Swerves with moderate clearance", "cruiseSpeed": 138, "length": 56, "width": 28, "height": 22, "mass": 1.0}, {"code": "POL", "class": "police", "family": "Warden", "tagLetter": "P", "job": "Traffic enforcement", "behaviour": "Tracks your approach, then commits", "cruiseSpeed": 150, "length": 58, "width": 28, "height": 23, "mass": 1.1}, {"code": "VAN", "class": "van", "family": "Porter", "tagLetter": "V", "job": "Parcels, maintenance and lab supply", "behaviour": "Brakes, then swerves late", "cruiseSpeed": 120, "length": 68, "width": 32, "height": 34, "mass": 1.5}, {"code": "BUS", "class": "bus", "family": "Commons", "tagLetter": "B", "job": "Shuttles and night lines", "behaviour": "Only brakes; cannot swerve", "cruiseSpeed": 108, "length": 96, "width": 34, "height": 48, "mass": 3.0}], "seniority": [{"level": 0, "name": "New", "writeOffs": 0}, {"level": 1, "name": "Practised", "writeOffs": 1}, {"level": 2, "name": "Experienced", "writeOffs": 3}, {"level": 3, "name": "Senior", "writeOffs": 6}]}
```

## ENGINE

# Prototype 11: engine facts (8 Nov 2026, measured on p11/index.html)

## The world
- Map 1 (Monument): a 3×3 grid of tiles, 800 × 640 world units each. One puzzle per tile, fenced on all sides.
- Each tile has one two-way road through it (2 lanes). The red car drives one lane (`duel.route`, proposed); the probe gives its from → to.
- The red car is a sedan (`vehicles.sedan.cruiseSpeed` 138, length 56). It brakes at `traffic.hardBraking` 600.
- **A pass** (one red car through the tile) takes 7.2 s measured. The next red car enters as the last crosses into the next tile.
- After it hits the dummy, a car brakes to a stop, stands 2 s, then drives round it.

## The dummy
- Walk and run at 70% of Prototype 9's speeds: it cannot chase a car.
- Battery 1 (`battery1`): the dash, Space. Reach 164 (probe `reach`). A dash stops at a K-rail.
- Hands 1 (`hands1`): carry a cone (J); hold J to put it down.
- Super Knees (`knees1`): hold C to duck: lower, slower, hidden behind low cover (planters, hedges).
- Legs 1 (`legs1`): jump (L). Not used on Map 1's nine.
- Escalators lead up to the decks (Prototype 9's elevated highways). A parapet drop gap over a road lets the dummy drop onto it.

## Scoring and the fault rule
- A hit counts only if the car hit the dummy: the car gives at least half the closing speed (`scoring.faultShare` 0.5, proposed) at 20 or more (`scoring.faultMinSpeed` 20, proposed). Else: YOUR FAULT, damage, no count.
- A counted hit must take 10 or more health.
- The chassis is patched 1 s after any contact in a puzzle; it is never written off by accident.

## The red car's rungs (ladder.json has detail and measured open ways)
- 0 blind · 1 forward camera (brakes for a dummy in its lane; stop line drawn) · 2 side sensors (cones beside the road: it slows, then stops) · 3 roof lidar (sees a dummy in the air: jump, drop) · 4 street cameras (a camera in range of the dummy tells the car, even behind tall cover) · 5 road items (stops for a cone, never swerves round it) · 6 crash memory (watches every spot you struck from cover; 3 spots, radius 50) · 7 search (seen then hidden: it searches the last spot for 4 s, radius 60).
- Below rung 5 a cone in its lane makes it swerve round the cone.
- It sees cones at every rung.
- A puzzle plays at its `startRung`. The clear teaches `startRung` + 1 if `earns` is "car". A part puzzle teaches nothing.

## Built in P11
- Frame: grid, card, drop, R restart in place, two clocks, passes, a hint after 2 failed passes, stars, result card, Arcade lock.
- L1 First Contact and L9 Certification (boss: 3 hits, lessons mid-puzzle at hits 1 and 2, breakable camera). L2–L8 play from their data but are marked IN BUILD.
- Breakable camera: a dash into the post breaks it (`props.camera.breakable`, proposed). R restores it.
- A puzzle's camera can be placed by data: `camera.watch` names the cover piece it watches. Only L9 uses it. Level `watched` (A3) places cameras by Prototype 9's buildings: the probe shows A3 with **0 cameras**.
- Fleet 0 (L1–L5): white ground cars are removed from the tile and its neighbours. Deck traffic stays.

## Not built (Edit 112 Day 2)
- The traffic-light switch (A2). A2 plays today as tall cover with white traffic.
- Clients on the zebra (B3). B3 plays today as low cover with white traffic.
- Fail states: white touch on A2, client hit on B3.

## The probes (engine/p11_probe.js, headless, one bot per run)
- `idle`: stands at the drop point.
- `stand`: walks to the route lane nearest the drop and stands in it (the obvious first move).
- `side`: walks (or dashes, if fitted) at the red car's flank (the move the fault rule refuses).
- `cutin`: waits beside the road ahead of the car; dashes (or, without the dash, walks) into its lane just ahead of its nose. Picks the spot nearest itself.
- `cover`: as cutin, from the spot the car's sensors and cameras see least; ducks if Super Knees is in the kit.
- None of them drop from a deck, place a cone, break a camera or use a light. A puzzle whose intended move is one of those is UNTESTED by the probes.
- A browser play-test bot (more refined cut-in, 8 directions, waits off the road, ducks) cleared L9 in 4 of 5 runs within 200 s (attempts 49, 64, 85, 123 s). The headless `cover` bot got no hit on L9 in 200 s.
- Probe output fields: hits (counted), faults (your fault), white (white-car hits), first (s to first counted hit), cleared (s), passes, lessons, seen (hits graded SEEN), dashes, endRung.


## PROBES · per puzzle: geometry, then each bot

```json
{"A1": {"geometry": {"tile": "A1", "n": 1, "name": "First Contact", "built": true, "level": "open", "stage": "10.2", "rung": 0, "top": 1, "kit": [], "dash": false, "reach": 164, "duck": false, "fleet": 0, "drop": [400, 224], "route": {"from": [0, 348], "to": [800, 348]}, "lanes": 2, "cover": [], "cameras": [], "cones": ["400,224", "160,224"], "decks": 1}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 9, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 0}, "stand": {"secs": 120, "hits": 1, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 1, "firstHit": 1.7, "cleared": 1.7, "lessons": [], "seenHits": 0, "endRung": 0}, "side": {"secs": 120, "hits": 1, "faults": 1, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 2, "firstHit": 11.2, "cleared": 11.2, "lessons": [], "seenHits": 0, "endRung": 0}, "cutin": {"secs": 120, "hits": 1, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 1, "firstHit": 4.2, "cleared": 4.2, "lessons": [], "seenHits": 0, "endRung": 0}, "cover": {"secs": 120, "hits": 1, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 1, "firstHit": 2.9, "cleared": 2.9, "lessons": [], "seenHits": 0, "endRung": 0}}}, "B1": {"geometry": {"tile": "B1", "n": 2, "name": "Kerbside", "built": false, "level": "kerb", "stage": "10.3", "rung": 1, "top": 1, "kit": [], "dash": false, "reach": 164, "duck": false, "fleet": 0, "drop": [368, 224], "route": {"from": [0, 348], "to": [792, 348]}, "lanes": 2, "cover": ["cabinet@360,251", "kiosk@540,252", "billboard@210,256"], "cameras": [], "cones": ["368,224", "608,224"], "decks": 1}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 9, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 1}, "stand": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 17, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 1}, "side": {"secs": 120, "hits": 1, "faults": 1, "whiteHits": 0, "standstill": 1, "dashes": 0, "passes": 4, "firstHit": 38.4, "cleared": 38.4, "lessons": [], "seenHits": 1, "endRung": 1}, "cutin": {"secs": 120, "hits": 0, "faults": 7, "whiteHits": 0, "standstill": 5, "dashes": 0, "passes": 9, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 1}, "cover": {"secs": 120, "hits": 1, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 2, "firstHit": 29, "cleared": 29, "lessons": [], "seenHits": 1, "endRung": 1}}}, "C1": {"geometry": {"tile": "C1", "n": 3, "name": "Set Back", "built": false, "level": "setback", "stage": "10.3", "rung": 1, "top": 2, "kit": ["battery1"], "dash": true, "reach": 164, "duck": false, "fleet": 0, "drop": [400, 416], "route": {"from": [0, 348], "to": [612, 637]}, "lanes": 2, "cover": ["cabinet@489,419", "kiosk@490,558"], "cameras": [], "cones": ["384,416", "512,208"], "decks": 1}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 1}, "stand": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 1}, "side": {"secs": 120, "hits": 1, "faults": 2, "whiteHits": 0, "standstill": 1, "dashes": 3, "passes": 4, "firstHit": 50.2, "cleared": 50.2, "lessons": [], "seenHits": 1, "endRung": 1}, "cutin": {"secs": 120, "hits": 1, "faults": 2, "whiteHits": 0, "standstill": 0, "dashes": 3, "passes": 3, "firstHit": 37.3, "cleared": 37.3, "lessons": [], "seenHits": 1, "endRung": 1}, "cover": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 11, "passes": 12, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 1}}}, "C2": {"geometry": {"tile": "C2", "n": 4, "name": "Overpass", "built": false, "level": "deck", "stage": "10.4", "rung": 2, "top": 2, "kit": ["battery1"], "dash": true, "reach": 164, "duck": false, "fleet": 0, "drop": [400, 224], "route": {"from": [612, 8], "to": [3, 292]}, "lanes": 2, "cover": [], "cameras": [], "cones": ["400,224", "544,416"], "decks": 1}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 3, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}, "stand": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}, "side": {"secs": 120, "hits": 0, "faults": 2, "whiteHits": 0, "standstill": 1, "dashes": 19, "passes": 8, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}, "cutin": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 5, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}, "cover": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 5, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}}}, "B2": {"geometry": {"tile": "B2", "n": 5, "name": "Roundabout", "built": false, "level": "cones", "stage": "10.4", "rung": 2, "top": 3, "kit": ["battery1", "hands1"], "dash": true, "reach": 164, "duck": false, "fleet": 0, "drop": [416, 496], "route": {"from": [0, 348], "to": [794, 348]}, "lanes": 2, "cover": [], "cameras": [], "cones": ["336,320", "576,336"], "decks": 1}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 5, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}, "stand": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 5, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}, "side": {"secs": 120, "hits": 0, "faults": 1, "whiteHits": 0, "standstill": 2, "dashes": 5, "passes": 8, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}, "cutin": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 7, "passes": 8, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}, "cover": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 10, "passes": 11, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 2}}}, "A2": {"geometry": {"tile": "A2", "n": 6, "name": "Red Light", "built": false, "level": "tall", "stage": "10.5", "rung": 3, "top": 4, "kit": ["battery1", "hands1"], "dash": true, "reach": 164, "duck": false, "fleet": 0.5, "drop": [416, 224], "route": {"from": [800, 292], "to": [212, 637]}, "lanes": 2, "cover": ["cabinet@690,251", "kiosk@450,252", "bollard(low)@628,251", "bollard(low)@580,251", "bollard(low)@532,251"], "cameras": [], "cones": ["416,224", "176,304"], "decks": 1}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 5, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 3}, "stand": {"secs": 120, "hits": 0, "faults": 2, "whiteHits": 1, "standstill": 0, "dashes": 0, "passes": 3, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 3}, "side": {"secs": 120, "hits": 0, "faults": 6, "whiteHits": 1, "standstill": 3, "dashes": 6, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 3}, "cutin": {"secs": 120, "hits": 0, "faults": 1, "whiteHits": 1, "standstill": 0, "dashes": 5, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 3}, "cover": {"secs": 120, "hits": 1, "faults": 0, "whiteHits": 1, "standstill": 0, "dashes": 3, "passes": 3, "firstHit": 45.7, "cleared": 45.7, "lessons": [], "seenHits": 0, "endRung": 3}}}, "A3": {"geometry": {"tile": "A3", "n": 7, "name": "CCTV", "built": false, "level": "watched", "stage": "10.5", "rung": 4, "top": 4, "kit": ["battery1", "hands1"], "dash": true, "reach": 164, "duck": false, "fleet": 0.5, "drop": [400, 224], "route": {"from": [212, 8], "to": [797, 348]}, "lanes": 2, "cover": ["cabinet@412,251", "planter(low)@389,386", "kiosk@308,118", "hedge(low)@174,178"], "cameras": [], "cones": ["400,224", "160,256"], "decks": 1}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 4, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 4}, "stand": {"secs": 120, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 7, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 4}, "side": {"secs": 120, "hits": 0, "faults": 5, "whiteHits": 1, "standstill": 1, "dashes": 10, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 4}, "cutin": {"secs": 120, "hits": 1, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 3, "passes": 4, "firstHit": 56.8, "cleared": 56.8, "lessons": [], "seenHits": 1, "endRung": 4}, "cover": {"secs": 120, "hits": 1, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 1, "passes": 1, "firstHit": 4.6, "cleared": 4.6, "lessons": [], "seenHits": 1, "endRung": 4}}}, "B3": {"geometry": {"tile": "B3", "n": 8, "name": "Crossing", "built": false, "level": "low", "stage": "10.6", "rung": 4, "top": 5, "kit": ["battery1", "hands1", "knees1"], "dash": true, "reach": 164, "duck": true, "fleet": 0.5, "drop": [432, 288], "route": {"from": [8, 348], "to": [798, 508]}, "lanes": 2, "cover": ["planter(low)@292,255", "hedge(low)@238,386", "planter(low)@592,414"], "cameras": [], "cones": ["432,288", "384,528"], "decks": 1}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 4, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 4}, "stand": {"secs": 120, "hits": 0, "faults": 2, "whiteHits": 2, "standstill": 0, "dashes": 0, "passes": 5, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 4}, "side": {"secs": 120, "hits": 0, "faults": 3, "whiteHits": 0, "standstill": 1, "dashes": 3, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 4}, "cutin": {"secs": 120, "hits": 1, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 1, "passes": 1, "firstHit": 4.9, "cleared": 4.9, "lessons": [], "seenHits": 0, "endRung": 4}, "cover": {"secs": 120, "hits": 0, "faults": 5, "whiteHits": 1, "standstill": 0, "dashes": 4, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 4}}}, "C3": {"geometry": {"tile": "C3", "n": 9, "name": "Certification", "built": true, "level": "boss", "stage": "10.8", "rung": 5, "top": 7, "kit": ["battery1", "hands1", "knees1"], "dash": true, "reach": 164, "duck": true, "fleet": 0.5, "drop": [400, 384], "route": {"from": [0, 508], "to": [800, 508]}, "lanes": 2, "cover": ["cabinet@410,411", "kiosk@540,412", "hedge(low)@510,546"], "cameras": ["630,412"], "cones": ["400,384", "640,368"], "decks": 2}, "bots": {"idle": {"secs": 60, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 6, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 5}, "stand": {"secs": 240, "hits": 0, "faults": 0, "whiteHits": 0, "standstill": 0, "dashes": 0, "passes": 21, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 5}, "side": {"secs": 240, "hits": 0, "faults": 2, "whiteHits": 0, "standstill": 0, "dashes": 3, "passes": 18, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 5}, "cutin": {"secs": 240, "hits": 1, "faults": 3, "whiteHits": 0, "standstill": 0, "dashes": 9, "passes": 10, "firstHit": 235.1, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 5}, "cover": {"secs": 240, "hits": 0, "faults": 11, "whiteHits": 0, "standstill": 0, "dashes": 13, "passes": 14, "firstHit": null, "cleared": null, "lessons": [], "seenHits": 0, "endRung": 5}}}}
```

Pressure-test the nine puzzles now, and answer the vehicle question.