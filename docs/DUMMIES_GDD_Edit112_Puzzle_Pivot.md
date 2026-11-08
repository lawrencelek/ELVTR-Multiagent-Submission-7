# DUMMIES GDD — Edit 112: Puzzle pivot (from the 1-on-1 with Joshua Burdick, 7 November)

**8 November 2026 · Lawrence Lek** (revised 18:25: Lawrence's elements; 18:46: the ten-minute target). Source: the 1-on-1 transcript (00:54–18:17; Joshua's own game excluded). Governs Story Map 1. Newest wins over Edit 111.

## 112.1 What was said about DUMMIES

**Lawrence's state**

- Human playtesting came too late. The first outside feedback (about 1.5 weeks before) said it was too easy: walk into a car's path and you get hit.
- A side quest on level design (the maps) left the escalation behind.
- Two genres pull against each other: the arcade (combos, destroying yourself) and outsmarting the cars (stealth: hide behind barriers, jump out).
- Car learning is back in, but clarity has suffered.
- Most fun, in Lawrence's words: outsmarting the car. The combos are fun too.

**Joshua's advice**

- **Find the core identity first.** Progression and upgrades only add to a game that is already fun.
- **Lean into the puzzle:** work out how to get hit by the one car you need to be hit by.
- **Validate it:** build about four puzzles of rising complexity.
  - The other road is all-in on combos and spectacle (ragdolls, things flying). Validate whichever is more fun.
- **Progression can be new elements, not an ability system.** Each puzzle brings something not met before.
  - His examples: control traffic lights, a bridge that goes up and down, a cone that blocks.
  - Zelda works because upgrades unlock discovery.
- **Respect the player's intelligence.** Puzzles can be complicated.
- **Build, then iterate.** You cannot imagine a whole puzzle into working. Playtest each one over and over.
- **Order is free.** A puzzle that turns out too hard moves later.
- **The best puzzles have stages.** "I think I've got it" uncovers a rule you didn't know; the goal shifts.
- **The hook:** how do you get yourself destroyed the fastest, for the most points? Rarely seen. A crash-test dummy keeps it light, not grim.

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
