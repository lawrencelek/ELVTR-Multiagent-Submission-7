# DUMMIES GDD — Edit 113: Prototype 11, the puzzle game's architecture

**8 November 2026 · Lawrence Lek.** Builds Edit 112 (puzzle pivot). Governs Prototype 11 (`p11/index.html`). Newest wins over Edits 111–112.

## 113.1 Shape

- **P11 is Story Map 1 as nine puzzles.** Prototype 9's world, art, HUD and sound. Prototype 10's red car. UI layout unchanged.
- **Build order:** the frame, then L1, then L9. L2–L8 follow (Edit 112 §112.6, Day 2).
- **Files:**

  | File | Holds |
  |---|---|
  | `content/puzzles_map1.json` | The nine puzzles: tile, rung, kit, level, fleet, route, objective, hints, par, target, `built` |
  | `engine/p11.js` | The puzzle rules: fence, kit, restart, clocks, passes, hints, stars, mid-puzzle lessons, breakable cameras, saves |
  | `engine/p11_ui.js` | The puzzle grid, the result card, the HUD line, the broken-camera mark |
  | `engine/build_p9.py --p11` | Bundles `p11/index.html` with the patches below |

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

## 113.7 Registry

| Value | Id | Status |
|---|---|---|
| Par, target per puzzle | `story.puzzle.par.<tile>`, `story.puzzle.target.<tile>` | Proposed (§112.8); held in `puzzles_map1.json` |
| Hint after failed passes | `story.puzzle.hintPasses` 2 | Proposed (§112.8) |
| The red car's lane | `duel.route` (lane index) | Proposed |
| Kit per puzzle | `story.puzzle.kit.<tile>` | Proposed; held in `puzzles_map1.json` |
| White cars off the tile | `story.traffic.monument.<tile>` 0 | Registered id; 0 now honoured by P11 |
| Breakable camera | `props.camera.breakable` 1 | Proposed (§112.5) |
| Restart key | R | Input map |
| Start rung, top rung, return | `duel.startRung`, `duel.topRung`, `duel.redReturnSeconds` | Registered |
| Memory, search | `duel.memorySites` 3, `duel.memoryRadius` 50, `duel.searchRadius` 60, `duel.searchSeconds` 4 | Registered (10.8's values) |

## 113.8 Engine hooks

| Hook | Where | Does |
|---|---|---|
| `PuzzleSim` extends `DuelStorySim` | `p11.js` | `canCross` (this tile only), kit, fleet, route, clocks, passes, stars, `restart()`, mid-lessons, camera breaks |
| `P11.progressFor(save)` | `game.js` sim start | A one-puzzle progress: the other eight marked done, so the puzzle's tile is in test |
| Title | `game.js` | ARCADE card locked until Certification |
| Puzzle grid | `game.js` story map | Drawn and driven by `p11_ui.js` |
| Level card | `game.js` | Puzzle text: number, name, NEW, PAR, BEST |
| Restart | `game.js` keys, pause | R and "Restart puzzle" call `sim.restart()` |
| Result | `game.js` report | The star card; Enter, R, Shift |
| Next puzzle | `game.js` menus | New sim for the next puzzle (about 1.2 s build), then its card |
| Lesson card | `duel_ui.js` | P11: no OPEN line; NEXT: the next puzzle |
| Build | `build_p9.py --p11` | `p11/index.html`; audio from `../audio/` |
