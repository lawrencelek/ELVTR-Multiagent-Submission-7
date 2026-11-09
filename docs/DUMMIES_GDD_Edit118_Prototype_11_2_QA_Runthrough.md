# DUMMIES GDD — Edit 118: Prototype 11.2 QA, an analog pad, the full runthrough

**9 November 2026 · Lawrence Lek.** Builds Edits 115–117. Governs Prototype 11.2's QA (`qa/`, `pipeline/qa_attack.py`) and its input fixes. Newest wins.

- **Request (01:45):** "run an adversarial QA agent, which can move in more than eight directions … try to break the nine levels, click everywhere. Build a full runthrough of the game, with all working menus and save game."

## 118.1 Method

| Part | Does | Result |
|---|---|---|
| Virtual pad (`qa/pad.js`) | A standard gamepad behind `navigator.getGamepads()`. The left stick takes any angle and strength. A 10 Hz monitor watches throughout | 16 angles from rest, 0°–330°: the dummy moves within 0.1° of the stick |
| Adversarial QA agent (`pipeline/qa_attack.py`, opus) | Round 1: attack plans and one intended solution per puzzle. The harness runs them through the pad. Round 2: follow-ups on what broke. Then a bug report | §118.3 |
| Solver (`qa/headless.js`) | The attack language on the headless sim. Grid search over hide spots and timings | One pad script per puzzle that clears it (§118.2) |
| Click everywhere (`qa/clicks.js`) | Taps a grid over every screen, then the game's tap targets. Presses keys and pad buttons, flicks the stick, resizes, blurs, unplugs the pad | §118.4 |
| Full runthrough (`qa/runthrough.js`) | Plays the whole game with real inputs (taps, keys, the pad), recorded on video | §118.5 |

## 118.2 The nine puzzles, solved with the pad

Each puzzle has one pad script in `qa/solutions/<tile>.json`. They were tuned by grid search on the headless sim, then played in the browser by the runthrough (§118.5).

| # | Tile | Edit 115's move | The pad clears it by | Same move? | Window (headless) | Runthrough |
|---|---|---|---|---|---|---|
| 1 | A1 | Stand in its lane | Standing in its lane | Yes | Any | ★★★ 2.6 s |
| 2 | B1 | Step in inside its stop line | Waiting at the kerb, then stepping 40 ahead of its nose when the nose is 70–110 away | Yes | Wide | ★★★ 2.8 s |
| 3 | C1 | Escalator up; drop through the gap | Climbing the stair end-on, crossing the deck's middle, stepping off the gap when the nose is 60–100 away | Yes | Wide | ★★★ 13.2 s |
| 4 | B2 | Hide behind the kiosk; dash ahead of its nose | Waiting at the kiosk's east side, then **walking** in when the nose is 45–95 away. A dash from behind the kiosk overshoots the lane: 0 clears in 90 runs | No (walk, not dash) | Wide | ★★★ 5.6 s |
| 5 | A2 | Break the camera; hide behind the cabinet; dash | **The deck drop**: west stair end-on onto Z1, off the east gap when the nose is 60–120 away. Behind the cabinet there is no room: 24 units to the block, and the dummy needs 26 | No (drop) | Wide | ★★★ 9.8 s |
| 6 | A3 | A cone in its lane; step into its swerve | Picking up a cone from 30–34 units (closer, you kick it); a tap drops it 45 ahead, in its lane; waiting off the road, then stepping into the other lane when the nose is 60–150 from the cone | Yes | Wide | ★★★ 27.4 s |
| 7 | C2 | Break the camera; hide behind the kiosk; dash | **The deck drop**: south stair onto Z2, off the east gap when the nose is 50–65 away | No (drop) | **Narrow (15 units)** | ★★★ 18.0 s |
| 8 | B3 | Duck behind the hedge; dash out | **A dash from open ground** 135 off the lane, on pass 1. Walking cannot cross the hedge; a dash from behind it overshoots | No (open dash) | Wide | ★·★ 19.4 s |
| 9 | C3 | Three hits, a new way each | The cut-in bot (`engine/p9_play_test.js`, keyboard), as `engine/p11_test.js` plays it; A or Enter through the two mid-puzzle lessons | — | — | ★·★ 32.1 s |

- **Four of the eight non-boss puzzles are cleared by a move other than Edit 115's** (4, 5, 7, 8). The cause is one rule: a dash is 164 units and a dash into the car is your fault. So a dash from cover beside the lane passes through it.
- **Puzzles 5 and 7 fall to the deck drop.** Lidar (rung 3 up) grades it SEEN but it still scores (Edit 117 §117.3, open).

## 118.3 The adversarial QA agent

- **Run:** `pipeline/runs/20261109-021452-qa`.
  - 87 plans over two rounds (57 + 30), two browsers.
  - Cost $4.55, in 3 calls.
  - The monitor found no off-tile position, no fence crossing and no NaN.
- **Verdict (the agent):** "Map 1 fails QA." It found 15 bugs. My checks below sort them into real ones, design calls and harness artifacts.

| Id | Severity | Bug (the agent) | Checked | State |
|---|---|---|---|---|
| QA-01 | blocker | The boss freezes after hit 1 | Harness artifact. The mid-puzzle lesson waits for A or Enter, and the attack runner never pressed them. The runthrough presses A or Enter through both mid-puzzle lessons (§118.5) | Not a game bug. The runner now treats the lesson as a stop |
| QA-02 | major | B2: an open-kerb dash clears in pass 1, no kiosk needed | Confirmed (B2-03, B2-08). A dash from 135–150 off the lane lands in it | Design call (§118.7) |
| QA-03 | major | B1: walking straight from the drop clears in 1.6 s | Confirmed. It is the intended step-in, on pass 1 | Design call: drop farther, or a later first spawn |
| QA-04 | major | C3: walking across the lane scores hit 1 in pass 1 | Confirmed by the agent; not checked separately | Design call |
| QA-05 | major | A1, A2, A3: columns plug the z1 stair heads | Partly refuted. An end-on climb works: `solutions/A2.json` climbs the west stair at y 80 and clears A2 in the browser. The opening leaves 4 units each side, so angled approaches pin (QA-13) | Real: widen the openings |
| QA-06 | major | A1: the dummy is pushed 7 units into a column at the south-east stair | Plausible. It is on the stair, which the old monitor did not exclude | Recheck with the ground-only monitor |
| QA-07 | major | B3: a dash passes through the low hedge that blocks walking | By design. Edit 115 §115.5: a dash vaults low pieces | Document it on the card |
| QA-08 | major | A dash from cover overshoots the lane, so "dash ahead of its nose" fails on B2, A2, C2 and B3 | Confirmed by my solver: 0 dash clears in 90 B2 runs and 18 A2 runs. A dash is 164 units; a dash into the car is your fault | Design call (§118.7) |
| QA-09 | major | The dummy penetrates kiosks by 5 units | Borderline. Both cases sit within 4 units of the monitor's tolerance | Open |
| QA-10 | major | C2: on the deck, the dummy passes through the z0 block below | Plausible; layer collision | Open |
| QA-11 | major | A2: after a deck-drop contact the dummy cannot move, then ends inside a block | Not reproduced. My A2 drop clears every time | Open |
| QA-12 | minor | B1: a collider at x ≈ 456 that the solids table does not list | Not checked | Open |
| QA-13 | minor | Stairs work end-on only; side walls pin angled approaches; C2 lists overlapping openings | Confirmed: my stair scripts enter end-on | Real: widen and mark the ramp edges |
| QA-14 | minor | Clears report a null result | Harness artifact. P11 keeps the result on `sim.p11.result`; the harness read `sim.result` | Harness fixed (`qa/attack.js`, `qa/headless.js`, `qa/runthrough.js`) |
| QA-15 | minor | No red car for 25 s after R plus START | Unconfirmed by the agent | Open |

- **Analog (the agent):**
  - Stairs accept only end-on entry.
  - An 85° dash crosses the hedge.
  - Step-ins at 27°, 60° and 120° clear B1 as a 90° step does.
  - Hide spots within 1–3 units of a kiosk corner block a straight dash.
  - No NaN under a 720°/s spin during a dash.

## 118.4 Click everywhere

- **Run:** `node qa/clicks.js qa/runs/clicks 6 11 p11`, from an empty browser. 1,653 actions in about 10 minutes:
  - 505 grid taps over every screen it reached;
  - 682 taps on the game's tap targets (83 different ones);
  - 251 keys; 142 pad buttons; 51 stick flicks;
  - 22 resizes, blurs and pad unplugs.
- **Result:** clean.
  - No page errors. No blank canvas. No screen it could not leave. No monitor finding.
  - The one console error is a font request the session's proxy refused, not the game.
- **Reach:** 11 screen states and 18 transitions:
  - intro, title, high scores, saves, name, splash, the grid;
  - puzzle 1's card and play;
  - pause, over both card and play.

  A new save opens puzzle 1 only, so later puzzles are the runthrough's to cover (§118.5).

## 118.5 The full runthrough

- **Run:** `node qa/runthrough.js qa/runs/runthrough p11`. Real inputs only: taps on the game's tap targets, keys and the virtual pad. No save edits, no teleports.
- **Result:** pass. 4 min 36 s; nine puzzles, each cleared on the first attempt; no page errors; no monitor findings.

| Stage | Checked |
|---|---|
| Intro | The audio gate, then START |
| Title | Arcade locked before Certification. High Scores and back. Credits and close |
| Story | A new save, named RUNTHROUGH on the keyboard; the splash; the puzzle grid |
| Puzzle 2's pause menu | Opens; Options and back; Controls and back; Restart puzzle (restarts = 1) |
| Each puzzle | Card, drone drop, play, the clear, the result card, the lesson (clip, fitting, card), the next card |
| Save and reload | After puzzle 3: Pause › Quit to title; reload the page; STORY; slot 1 offers CONTINUE, RENAME, ERASE; Continue; the grid keeps A1, B1 and C1 solved |
| The boss | Mid-puzzle lessons passed with Enter; cleared; certified |
| After certification | The save shows certified, 9 solved; back to title; ARCADE opens the arcade |

- **Video:** [`docs/p11_runthrough.mp4`](p11_runthrough.mp4), 4 min 36 s.
- **Shots:** every card, result and lesson in `qa/runs/runthrough/shots/` (not committed).
- **Bugs the runthrough found in its own harness:**
  - a tap on an open grid tile opens its card, so PLAY must not be pressed too;
  - the splash takes a tap only once its beat has played;
  - P11's result lives on `sim.p11.result`.

  None was a game bug. The first runs mistook the last for a boss freeze (QA-01).

## 118.6 Fixed in P11.2

| Bug | Fix |
|---|---|
| Pad and touch players cannot duck: DUCK is only on C and Ctrl, so B3 and the boss need a keyboard | Hold B (no jump in Map 1), LB, RB or LT. The HUD reads HOLD C OR PAD B. Measured: B, LB, RB and LT all duck and release |
| Monitor: `inside-solid` fired on decks and stairs over the columns | The monitor checks only on the ground (`qa/pad.js`) |

## 118.7 Design calls (Lawrence's)

| Call | Options | Evidence |
|---|---|---|
| The dash cannot land a dummy ahead of a nose from cover (puzzles 4, 5, 7, 8) | End the dash at the first lane overlap. Or scale its length with the stick (analog players get the short dash). Or set cover at about `movement.lungeDistance` − ½ `world.laneWidth` (≈ 136) from the lane centre | QA-08; 0 dash clears in 108 solver runs. B2's and B3's only dash clears start 125–150 off the lane |
| Pass-1 clears (B1, B2, C3 hit 1) | A later first spawn (proposed `story.puzzle.firstSpawnSeconds`), or drops farther from the lane | QA-02, QA-03, QA-04. Par is beaten by 4–10× |
| The deck drop solves 5 and 7 | Make lidar (rung 3 up) close the drop, or keep it as each tile's second solution | Runthrough: A2 9.8 s, C2 18.0 s. Edit 117 §117.3 |
| Z1 stairs are 4 units wider than the dummy each side | Widen the openings to 40+, or move the columns | QA-05, QA-13. End-on entry only |
| Cone pickup: walking into a cone kicks it; the pickup reach is 30–34 | A wider reach, or no kick while Hands are fitted | `qa/solutions/A3.json` |

## 118.8 Registry

| Value | Id | Status |
|---|---|---|
| Pad duck | Input map: B / LB / RB / LT held → `duck` | Build value (P11) |
| Cone pickup reach | `body.radius` + `props.cone.radius`; contact kicks the cone | Registered; see §118.3 |
| Dash | `movement.lungeDistance` 164, `movement.lungeDuration` 0.3 | Registered |
