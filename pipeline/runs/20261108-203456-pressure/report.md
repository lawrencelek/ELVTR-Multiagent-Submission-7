# Prototype 11: pressure test · 20261108-203456-pressure

Agent: `pipeline/agents/puzzle_designer.md` (opus), $0.9375. Probes: `engine/p11_probe.js`, 120 s a bot (the boss 240 s).

## Probes (counted hits / your-fault contacts, first hit in s)

| # | Tile | Built | idle | stand | side | cutin | cover |
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

## Verdicts

| # | Tile | Verdict | Obvious move fails | Intended solvable | Top fix |
|---|---|---|---|---|---|
| 1 | A1 First Contact | **keep** | True | True | Hide cone homes when the kit has no hands1. Check by hand. |
| 2 | B1 Kerbside | **fix** | True | True | Move the cabinet and kiosk to the kerb. Halve the walk to the lane. |
| 3 | C1 Set Back | **fix** | untested | True | Probe C1 cutin with kit [] by hand. If it clears, the twist is broken. |
| 4 | C2 Overpass | **fix** | True | untested | Port P10's gap bot into p11_probe. Run it on C2. |
| 5 | B2 Roundabout | **fix** | untested | untested | Port P10's conebait bot. Run it on B2. |
| 6 | A2 Red Light | **rework** | untested | untested | Strip the tall cover. Leave the bollards and the switch box. |
| 7 | A3 CCTV | **fix** | False | untested | Place the camera by data: camera.watch cabinet, as on L9. Set breakableCameras true. |
| 8 | B3 Crossing | **rework** | False | untested | Cut clients to Map 2 now (§112.6 cut order item 3). |
| 9 | C3 Certification | **fix** | True | True | Move the hedge so it is at least 200 from the camera. |

## Top changes

1. A3: place the camera by data (camera.watch), keep one tall piece, move the drop. Today cover clears in 4.6 s.
2. B3: cut clients to Map 2; rebuild as the one-step duck breather. Today cutin clears in 4.9 s.
3. Port P10's gap and conebait bots. C2 and B2 solutions are UNTESTED.
4. A2: one-press light, no tall cover, cross-street traffic only. Today cover clears at 45.7 s; every bot took a white hit.
5. C3: move the hedge off the 180 range edge (179.9); par 45 → 60; verify hit 3 needs the camera.

## Vehicles

**One learner per map. Map 1 stays RED-01, a sedan, for all nine. After Certification, a new class learns on Map 2.**

- Clarity: the boss is the same car using its rungs. A swap per puzzle breaks 'it remembers'.
- One new thing per puzzle: a class behaviour is a second rule. It would double every puzzle's load.
- Cost: only the sedan's ladder is measured (P10 test road). Nine classes mean nine re-measures.
- Lore: Certification certifies one car. Seniority (New → Senior) needs one car to rise.
- Puzzle space: a class reshapes a whole ladder. That suits a map, not a level.

| Map | District | Learner | Class | New puzzle space |
|---|---|---|---|---|
| 1 | Monument | RED-01, Meridian | sedan | Forward camera, side sensors, lidar, cameras, road items, memory, search. |
| 2 | CBD (Edit 96 tales; confirm) | Porter learner | van | Clients on the zebra: the late swerve is the choice.; Cruise 120: wider walk windows. Length 68: more flank faults.; White tailgaters behind a slow van: Incidents.; Buses as moving tall cover. legs1 jump arrives. |
| 3 | Campus (Edit 96 tales; confirm) | Warden learner | police | Feints: bait the commit, then step into the committed line.; Cruise 150: tighter dash windows.; Cameras and lights as the boss's toolset. |

## Map

- Curve: The rung chain is sound: 0→1, part, 1→2, part, 2→3, 3→4, part, 4→5, 5→7. The difficulty is not. Today A3 and B3 are trivial, and A2 stacks three new things. After the fixes: teach A1–B1, spike at C1, two new verbs in C2–B2, a peak at A2–A3, a breather at B3 (one-step duck), then the boss.
- Order: A1 → B1 → C1 → C2 → B2 → A2 → A3 → B3 → C3. Keep the order. Each clear teaches the next rung. B2's lidar closes C2's drop. A2's cameras arm A3. Swapping breaks the chain. A one-step B3 gives the breather.
- Pacing: A pass is 7.2 s, not 9.2 s (§113.9). Pass budgets have about 22% slack. Measured clears overshoot par: B1 29/10, C1 37.3/15, A2 45.7/30, C3 49–123/45. Upper-bound passes ×7.2 plus overhead come to about 470 s. Real first-timers on untested C2, B2 and A2 decide the band.
- Build: A3: camera.watch, one tall piece, drop moved, re-probe (data, an hour).; B3: cut clients; rebuild as duck; fleet 0; move drop (data).; Port P10's gap and conebait bots into p11_probe. Run C2, B2, and cone cheese on A2/A3/B3.; A2: one-press light, tall cover out, cross-street traffic only (code).; C3: move the hedge; par 60; read the hit-3 trace.; Hide deck traffic on C2 (code).; B1: cover to the kerb. C1: walk-only probe; NEW card says Dash.; Kit trims: hands1 off A2, A3, B3 (data).
- Cut: Clients and Clause 4 on B3: move to Map 2.; A2's second switch press.; White traffic on A3 and B3.; Walking clients, fleet update, ragdoll: already cut.

## Per puzzle

### 1 · A1 First Contact · keep

- New element: One element: the blind red car. The level needs it.
- Obvious move: Probe A1 side: 1 fault, then a counted hit at 11.2 s. The fault shows once. At rung 0 the twist cannot hold longer.
- Intended: Probe A1 stand cleared at 1.7 s in 1 pass. Edit 113 §113.9 bot cleared at 2.7 s (★★★).
- Cheese: cutin cleared at 4.2 s and cover at 2.9 s. This is a teach level, so that is fine.
- Readability: Good. The car drives one lane, and the hint names the rule. The twist is only a side note.
- Risk: Geometry lists cone homes (400,224; 160,224) but the kit is empty. Drawn cones would mislead.
- Risk: Par 10 against 1.7 s gives ★ Par to everyone. That is fine for a teach level.
- Fix (low, code): Hide cone homes when the kit has no hands1. Check by hand. `kit`

### 2 · B1 Kerbside · fix

- New element: Forward camera plus kerb cover. They are the sensor and its counter: one rule.
- Obvious move: Probe B1 stand: 0 hits in 17 passes over 120 s.
- Intended: Probe B1 cover cleared at 29 s, but the hit was graded SEEN. The walking cutin got 0 hits, 7 faults and 5 standstills. The walk-out window is narrow.
- Cheese: side cleared at 38.4 s after 1 fault, graded SEEN. It is slower than intended but generic.
- Readability: The stop line shows the camera. The hint names the twist. Cover sits about 97 units off the lane, which does not read as kerbside.
- Risk: 7 faults on the walking cut-in. First-timers will read the fault rule as unfair.
- Risk: Par 10 needs a first-pass clear. The best bot took 29 s, about 4 passes.
- Fix (high, data): Move the cabinet and kiosk to the kerb. Halve the walk to the lane. `levels.kerb.coverOffset (proposed), level`
- Fix (low, data): Hold par at 10 until Day 3. Raise it if the median player needs over 2 passes. `story.puzzle.par.B1`

### 3 · C1 Set Back · fix

- New element: Dash is the element. Rung 1 does not watch the kerb, so set-back cover forces nothing. The player can wait at the kerb.
- Obvious move: Stand failed (0 hits, 6 passes). No probe tries a walk-out with the dash removed. The 'walk out: too slow' twist is unmeasured.
- Intended: Probe C1 cutin with dash: cleared at 37.3 s, 2 faults in 3 dashes. cover from set-back cover: 0 hits in 11 dashes.
- Cheese: side cleared at 50.2 s after 2 faults. On the bend (route 0,348 → 612,637) a flank dash can land on the nose.
- Readability: The route bends, which makes 'ahead of its nose' harder to judge. The HIT guide carries the readability. The card says cover stands back; that is decoration.
- Risk: 2 of 3 dashes faulted. The window is tight.
- Risk: Par 15 against 37.3 s measured.
- Risk: If walking works from the kerb, the level does not need the dash.
- Fix (high, data): Probe C1 cutin with kit [] by hand. If it clears, the twist is broken. `kit`
- Fix (medium, data): Change NEW to 'Dash.' Drop 'cover set back' from the card. `new, tale`
- Fix (medium, code): Show the HIT guide from the first dash, not only in the hint. `hints`
- Fix (low, data): Use a straight lane if the tile has one. `duel.route (proposed), route`

### 4 · C2 Overpass · fix

- New element: Side sensors plus the deck: a sensor and its counter. Escalator and drop are new verbs, so it is dense.
- Obvious move: Probe C2: cutin 0 hits, cover 0, side 0 hits and 2 faults, stand 0, all over 120 s.
- Intended: No bot drops. The test road measured gap at 2.07–2.21 per minute (ladder 10.3, 10.4). C2's own gap is unverified.
- Cheese: None found. Every ground bot fails.
- Readability: The hint names the twist without the solution. The escalator and gap must be in view from the drop (400,224).
- Risk: Deck traffic stays at fleet 0 (ENGINE). A white car on the deck costs ★ Untouched, with no warning.
- Risk: A landing on the roof may be scored YOUR FAULT. UNTESTED.
- Risk: The gap may not sit over the route (612,8 → 3,292). Check by hand.
- Fix (high, code): Port P10's gap bot into p11_probe. Run it on C2.
- Fix (high, code): Clear deck traffic on this tile. `story.traffic.deck.C2 (proposed)`
- Fix (medium, data): Check by hand: the gap is above the route and a drop counts as the car's fault. `scoring.faultShare (proposed), scoring.faultMinSpeed (proposed)`

### 5 · B2 Roundabout · fix

- New element: Cones. There is no cover, so the cone is necessary if the deck has no gap.
- Obvious move: No bot places a cone. The ground bots fail: cutin 0 hits, cover 0, side 1 fault, stand 0.
- Intended: Conebait measured 2.0 per minute on the test road with side sensors on (ladder 10.5). B2 itself is unmeasured.
- Cheese: The B2 deck at rung 2 could let C2's drop clear it. UNTESTED.
- Readability: The probe route is straight (0,348 → 794,348), so the name 'Roundabout' misleads. The hint names the twist.
- Risk: Cone homes (336,320; 576,336) sit near the lane. They may already trigger a swerve each pass.
- Risk: Side sensors may stop the car short of a dummy in the swerve lane. UNTESTED on this tile.
- Fix (high, code): Port P10's conebait bot. Run it on B2.
- Fix (medium, data): Move the cone homes off the kerb, next to the drop. `level`
- Fix (medium, data): Confirm no drop gap over the route here. `level`
- Fix (low, data): Do not swap B2 (§112.7). Its clear teaches the lidar that closes C2's drop. `duel.startRung`

### 6 · A2 Red Light · rework

- New element: Three new things: the light, white traffic, two steps. Tall cover at rung 3 makes the light unneeded.
- Obvious move: The light is not built. A2 plays as tall cover.
- Intended: No light exists. No bot uses a switch.
- Cheese: cover cleared at 45.7 s from tall cover. Ladder 10.4 says tall cover is open at rung 3.
- Cheese: Cone bait is open below rung 5 and hands1 is in the kit. UNTESTED.
- Readability: 'Switch, cross, switch, step' is four real-time actions in one pass. It is too dense to infer.
- Risk: Every moving bot took a white hit: stand, side, cutin and cover 1 each. Under TEST VOID they loop restarts.
- Risk: With one box on one kerb, you need a walk back after crossing. That is a soft dead end.
- Risk: A car pulling away from the line may be under faultMinSpeed 20. That scores YOUR FAULT.
- Fix (high, data): Strip the tall cover. Leave the bollards and the switch box. `level`
- Fix (high, code): Use one press. The cross street goes red; its light goes green after a delay. You cross, then step out. `props.signal.switchSeconds (proposed), props.signal.stopLine (proposed), props.signal.startRed (proposed)`
- Fix (high, code): Run white traffic on the cross street only. The light controls it, so it is one element. `story.traffic.monument.A2`
- Fix (medium, data): Remove hands1 from the kit. `kit`
- Fix (medium, data): Put the stop line at least the dash reach (164) from where the player steps out. `props.signal.stopLine (proposed)`

### 7 · A3 CCTV · fix

- New element: The probe shows 0 cameras. The breakable camera does not exist on the tile.
- Obvious move: Probe A3 cover cleared at 4.6 s in 1 pass from cover. cutin cleared at 56.8 s.
- Intended: No camera to break. No bot breaks cameras.
- Cheese: cover clears in 4.6 s from the cabinet (412,251) beside the drop (400,224). That is a first-pass ambush.
- Cheese: The kiosk (308,118) would stay unwatched with one camera.
- Cheese: Cone bait is open at rung 4 (ladder 10.5 conebait 2.0). UNTESTED here.
- Readability: The street-camera lesson came at A2's clear, but nothing on the tile shows a camera.
- Risk: White traffic adds noise and teaches no rule. side took 1 white hit.
- Fix (high, data): Place the camera by data: camera.watch cabinet, as on L9. Set breakableCameras true. `camera.watch, props.camera.breakable (proposed), perception.streetCameraRange`
- Fix (high, data): Use one tall piece only. Drop the kiosk or bring it inside range 180. `level`
- Fix (high, data): Move the drop beyond dash reach 164 of the route. `story.puzzle.drop.A3 (proposed)`
- Fix (medium, data): Set fleet 0 and kit [battery1]. `story.traffic.monument.A3, kit`

### 8 · B3 Crossing · rework

- New element: Two new things: clients, and the first use of duck (earned at A3). The trolley repeats B2's swerve rule.
- Obvious move: Probe B3 cutin cleared at 4.9 s, 1 pass, seenHits 0. Side sensors missed the dummy.
- Intended: Clients are not built. B3 plays as low cover.
- Cheese: cutin clears on the first pass from beside the drop (432,288), 60 units off the lane.
- Cheese: Cone bait is open at rung 4 with hands1 in the kit. UNTESTED.
- Readability: Clause 4 asks the player to model the car's cost choice. The hint 'its only way out' is close to the solution.
- Risk: A client hit voids the test, a second restart rule after A2's.
- Risk: White hits: stand 2, cover 1.
- Fix (high, data): Cut clients to Map 2 now (§112.6 cut order item 3). `props.client.count (proposed), driver.valueRank (proposed)`
- Fix (high, data): Rebuild as 'Duck': low wall and hedges, one watched tall piece. Ladder 10.6 measured planter 3.03. `level, camera.watch, duel.startRung`
- Fix (high, data): Move the drop beyond cautionZone 180 of the route. `story.puzzle.drop.B3 (proposed), proto.driver.cautionZone`
- Fix (medium, data): Set fleet 0 and kit [battery1, knees1]. Steps 1. `story.traffic.monument.B3, kit`

### 9 · C3 Certification · fix

- New element: Boss phases. Everything else is an exam of earlier rules.
- Obvious move: Headless: stand 0 hits in 240 s, side 0, cover 0 with 11 faults. cutin got 1 hit at 235.1 s.
- Intended: Browser bot cleared 4 of 5 within 200 s, attempts 49, 64, 85 and 123 s (§113.9).
- Cheese: The browser bot's move set has no camera break. If it cleared hit 3 unbroken, the kiosk is not required. Check its trace.
- Readability: Three hints cover the three phases. Crash-memory spots must be drawn, or the twist hides. UNTESTED.
- Risk: The hedge (510,546) sits 179.9 from the camera (630,412). Range is 180. Its cover state flickers.
- Risk: Par 45 is under every bot attempt.
- Risk: 11 headless cover faults: the dash window from cover is tight.
- Fix (high, data): Move the hedge so it is at least 200 from the camera. `levels.boss.coverAt (proposed), perception.streetCameraRange`
- Fix (medium, data): Set par to 60 for now. Reset it from Day 3 medians. `story.puzzle.par.C3`
- Fix (medium, data): Read the browser bot's hit-3 trace. If the camera stayed whole, close that way in. `camera.watch, duel.memoryRadius`
- Fix (low, data): Trim the lessons: clip 3 → 2, fit 2 → 1.5. `duel.lessonClipSeconds, duel.lessonFitSeconds`

