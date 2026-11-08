# DUMMIES GDD — Edit 114: Map 1 pressure test; one learner per map

**8 November 2026 · Lawrence Lek.** Source: `pipeline/runs/20261108-203456-pressure/` (puzzle level design specialist agent, opus, $0.9375; 45 headless probe runs). Builds Edits 112–113. Newest wins.

## 114.1 Method

- **Agent:** `pipeline/agents/puzzle_designer.md`. One headless call, no tools, costed like the pipeline's other agents.
- **Inputs:** Edits 112–113, `content/puzzles_map1.json`, the ladder (measured open ways), the fleet's classes, engine facts (`pipeline/inputs/p11_engine.md`), the probes.
- **Probes:** `engine/p11_probe.js`. Every puzzle × five bots, 120 s each (boss 240 s).
  - idle; stand (in the route lane); side (into its flank); cutin (into its lane ahead of its nose); cover (the same, from the least-seen spot).
  - No bot drops, places cones, breaks cameras or uses a light. Those moves are UNTESTED.
- **Checks per puzzle:** element necessary; obvious move fails; intended solvable; cheese; readability; failure modes; pacing; steps gate.
- **Rerun:** `python3 pipeline/pressure_test.py`.

## 114.2 Probe results

Counted hits / contacts at your fault, @ seconds to the first counted hit.

| # | Puzzle | Built | idle | stand | side | cutin | cover |
|---|---|---|---|---|---|---|---|
| 1 | A1 First Contact | yes | 0/0 | 1/0 @1.7 | 1/1 @11.2 | 1/0 @4.2 | 1/0 @2.9 |
| 2 | B1 Kerbside | no | 0/0 | 0/0 | 1/1 @38.4 | 0/7 | 1/0 @29 |
| 3 | C1 Set Back | no | 0/0 | 0/0 | 1/2 @50.2 | 1/2 @37.3 | 0/0 |
| 4 | C2 Overpass | no | 0/0 | 0/0 | 0/2 | 0/0 | 0/0 |
| 5 | B2 Roundabout | no | 0/0 | 0/0 | 0/1 | 0/0 | 0/0 |
| 6 | A2 Red Light | no | 0/0 | 0/2 | 0/6 | 0/1 | 1/0 @45.7 |
| 7 | A3 CCTV | no | 0/0 | 0/0 | 0/5 | 1/0 @56.8 | 1/0 @4.6 |
| 8 | B3 Crossing | no | 0/0 | 0/2 | 0/3 | 1/0 @4.9 | 0/5 |
| 9 | C3 Certification | yes | 0/0 | 0/0 | 0/2 | 1/3 @235.1 | 0/11 |

## 114.3 Verdicts

| # | Puzzle | Verdict | Finding | Fix (kind) |
|---|---|---|---|---|
| 1 | A1 First Contact | keep | Teach level works: stand clears in 1.7 s. Cones drawn with no Hands 1 | Hide cones without `hands1` (code, low) |
| 2 | B1 Kerbside | fix | Stand fails: 0 hits in 17 passes. Walking cut-in: 7 faults. Cover sits 97 from the route lane | `route` 1, the near lane; or cover on the route's kerb (data) |
| 3 | C1 Set Back | fix | Rung 1 ignores the kerb: set-back cover forces nothing. Walking out from the kerb is untested | A hedge row along the kerb: a walk stops at it, a dash vaults it (row 696) (data, proposed level) |
| 4 | C2 Overpass | fix | Every ground bot fails: the twist holds. The drop is untested. Deck traffic can hit the dummy | Drop bot in the probes (code); deck traffic off on this tile (code) |
| 5 | B2 Roundabout | fix | The route splits round the monument (south side); there is no roundabout. The cone is untested | Cone-bait bot (code); cone homes by the drop (data); rename to fit the split (data) |
| 6 | A2 Red Light | rework | Three new things (light, white traffic, two steps). Tall cover clears at 45.7 s. Every moving bot took a white hit | One-press light; white traffic on the cross street only; tall cover out; `hands1` out (code + data) |
| 7 | A3 CCTV | fix | **0 street cameras**: the premise is missing. Cover clears on the first pass, 4.6 s | `camera.watch` cabinet, `breakableCameras`; one tall piece; drop beyond dash reach 164; fleet 0 (data) |
| 8 | B3 Crossing | rework | Clients unbuilt. Cut-in clears on the first pass, 4.9 s | Lawrence decides: build clients (Day 2), or move them to Map 2 and make B3 the duck breather (data) |
| 9 | C3 Certification | fix | Par 45 beats every bot attempt (49–123 s). The hedge sits on the camera's range edge (179.9 of 180) | Par 60 until Day 3 (`story.puzzle.par.C3`); hedge clear of the range; check hit 3 needs the camera (data) |

- **Agent errors, corrected here:** it read B2's route as straight (it bends round the island) and named Maps 2–3 CBD and Campus (they are Parkland and Waterfront).

## 114.4 Map

- **Order holds:** each clear arms the next. B2's lidar closes C2's drop; A2's cameras arm A3.
- **Curve after the fixes:** teach (A1–B1), spike (C1), two verbs (C2–B2), peak (A2–A3), breather (B3), boss (C3).
- **Pacing:** passes × 7.2 s plus overhead ≈ 470 s, inside the 600 s target (`story.playthroughTarget`, proposed). C2, B2 and A2 are untested: they decide the band.

## 114.5 Day 2 build order

1. **A3:** camera by data, breakable; one tall piece; drop moved; fleet 0 (data).
2. **B1, C1:** B1 `route` to the near lane; C1 kerb hedge row (data).
3. **C3:** par 60; hedge out of the camera's range; read the hit-3 trace (data).
4. **Probe bots:** drop and cone bait (code). Then test C2 and B2, and cone cheese on A2, A3, B3.
5. **A2:** one-press light (`props.signal.switchSeconds`, `props.signal.stopLine`, proposed); cross-street traffic only (code).
6. **B3:** clients or the duck breather (Lawrence's call).
7. **Polish:** deck traffic off C2; cones hidden without Hands 1 (code).

## 114.6 Vehicles: one learner per map

- **Decision (Lawrence, 8 Nov, 20:23):** one car learns through a map's nine puzzles. The next map trains a new class. Rejected: a class per puzzle.
- **Why:**
  - "It remembers" needs one car. The boss is that car using its rungs.
  - A class is a second rule. A class per puzzle doubles each puzzle's load.
  - Only the sedan's ladder is measured. A class per map is one measurement per map.
  - Certification certifies one car. Seniority (`fleet.seniority`: New → Senior) needs one car to rise.
- **Plan (proposed):**

  | Map | District | Learner | Class | Behaviour (fleet.json) | Puzzle space |
  |---|---|---|---|---|---|
  | 1 | Monument | RED-01 | sedan, Meridian | Swerves with moderate clearance | Rungs 0–7 as built |
  | 2 | Parkland | a Porter, New | van | Brakes, then swerves late | Clients: the late swerve is the choice. Length 68: more flank faults. Cruise 120: wider walk windows. Incidents behind it |
  | 3 | Waterfront | a Warden, New | police | Tracks your approach, then commits | Feints: bait the commit, then step into its line. Cruise 150: tighter dash windows |

- **Carries over:** the kit and verbs (Legs 1 joins on Map 2); the fault rule, stars, grid, R restart, clocks, hints; cones, cameras, the light, decks; rung ids (each class sets `duel.startRung` and its order); lessons.
- **The fleet update (proposed):** RED-01 returns on Map 2 as a Senior white car with its rungs. Map 1's tricks fail on it.
- **Risks:**
  - Each class needs its open ways measured on the test road first.
  - Class speed changes the pass (`vehicles.<class>.cruiseSpeed`). Measure it.
  - The card must say "a new learner".
