# Adversarial UI review: p11_2

**Verdict:** P11.2 removes the hatch at rungs 1–5 and gives the side sensors a real reach, but the hatch is back on RED-01 in the boss, the lidar still shows no reach, and the forward marks and the rings round the dummy now contradict each other.

## Findings

| Id | Severity | Shots | What | Player reads | Fix |
|---|---|---|---|---|---|
| F1 | blocker | 9_C3_a_field, 9_C3_a_car, 9_C3_r6_field, 9_C3_r7_field | A diagonal white hatch fills RED-01's lane from the nose (≈640 px) to the LED gateway pillar (1085 px), y 965-1065, under the too-late zone and stop line. It is ray-cut at the pillar, so it is P9's forward hatch. It appears only in the boss (fleet 0.5), so the white-traffic path re-enables P9 marks on RED-01. | Hatch over its headlights again, plus ribbon and stop line on top: three forward marks | Gate P9 marks per car (learner flag), not per puzzle. Add the boss at fleet 0.5 to engine/p11_test.js with a check that no hatch pixels fall inside RED-01's ribbon. |
| F2 | blocker | 5_A2_a_car, 6_A3_a_car, 7_C2_a_car, 8_B3_a_car, 9_C3_r6_car | From rung 3, the lidar sweep ends at the puck rim. No return dots show on the cabinet, kiosk, deck edges or parapet gaps in any shot. The registry has no lidar reach, only perception.lidarHeight 26. | Rung 3 added a dark dot on the roof | Draw a 360° sweep to proposed perception.lidarRange with a dotted reach ring and returns on edges in range. Use the lidar's own colour. Then fix the sim so the drop is closed, or rewrite lesson 3 (F6 stays open, and is now invisible as well as false). |
| F3 | major | 5_A2_a_field, 8_B3_a_field, 6_A3_b_field | The forward cone is straight (±10°, reach 340) and the ribbon follows the curved lane. In 5_A2_a the cone runs west (385-870 px) while the ribbon turns south at 640. In 8_B3_a the cone holds the dummy on the north kerb (640,430) in white brackets with ?; the ribbon never touches the kerb. | Two forward beams. It brakes round corners it cannot see, and it sees kerbs it does not brake for | One forward mark: fill the ribbon only where the lane is inside the cone. Past that, outline only. Keep the cone as a 1 px edge. Cut the 3 grade arcs. Rewrite lesson 1: 'It brakes for a dummy it sees ahead.' |
| F4 | major | 4_B2_b_car, 5_A2_b_car, 6_A3_a_field, 3_C1_a_field | Up to four marks on the dummy: P9 white body ring, steel notice arc, steel lidar return ring, corner brackets. In 4_B2_b (418,735) a white ring and a steel ring sit at the same radius inside white brackets. | A target with no single meaning | Cut the P9 ring in P11. The notice arc is the only ring, in the noticing sensor's colour. Lidar returns are dots on the body. Brackets only when caught. |
| F5 | major | 4_B2_b_field, 4_B2_b_car | Caption ITS SIDE CONES HAVE YOU; the caught brackets are white (forward). | Its forward camera has me, or the caption is wrong | One caughtBy field drives the bracket colour, caption, glyph and notice arc colour. |
| F6 | major | 3_C1_b_field, 7_C2_a_field, 8_B3_a_field, 9_C3_a_car | Ribbon, too-late zone and stop line draw on top of decks the car passes under: the Z2 highway (3_C1_b, stop line at x440 on the deck), the highway in C2 (300-630), the B3 skybridge (800-900,650-850). The car and dummy are dithered under the deck; their feedback is not. | The car's path and stop line are on the highway | Layer order: road → ground feedback → deck → plate/glyph. Dither ground feedback under deck tops as the car is dithered. |
| F7 | major | 2_B1_a_field, 2_B1_b_field, 3_C1_b_field | At rung 1 the ribbon runs to the tile edge (perception.forwardLength 720; 2_B1_b 0-1300 px). At rung 2 it ends at 680 px (perception.coneRadius 340; 3_C1_b 320-1000). | The new sensor made it shorter-sighted | Use perception.coneRadius 340 for forward reach from rung 1 in sim and draw. Retire forwardLength from P11. |
| F8 | major | 3_C1_a_field, 6_A3_a_field, 8_B3_a_field | Side fans draw 10°–95° to 227 (coneRadius × sideConeRatio). The registry also holds perception.sideConeRange 240, sideRadius 100, sideCloseRange 180, sideWaryRange 360 and sideHalfAngle 80. F13 was declined. | A hard edge: outside it I am safe | Reverse F13 for every drawn edge. Each edge maps to exactly one id the sim reads. The dashed grade ring = sideCloseRange 180 only if the sim grades there; otherwise cut it. |
| F9 | major | 5_A2_a_field, 5_A2_a_car, 7_C2_a_field, 7_C2_b_field | In the puzzles that teach cameras, the pan cone is unreadable: an 8 px mint lens (738,468 in A2; 693,470 in C2), plus a grey wedge into a rooftop in A2 (735-780,190-470) and no visible cone in C2. Only 9_C3 shows it (900-1260,560-905). | A green lamp on a post | Raise the cone fill to proposed α0.2, ray-cut by tall cover, tick the pan limits on the range arc, and draw a mint link line camera → link stub while LINKED. |
| F10 | major | 9_C3_r6_field, 9_C3_r7_field | The remembered spot is a grey dummy outline with a yellow ⚠ (660,590). No red numbered ring, though the car is about 210 world units away, inside the 220 trigger. | A warning about me, in my colour | Draw the red ring and number. Cut the silhouette and ⚠. Register 220 as proposed duel.memoryWatchRange. |
| F11 | major | 9_C3_b_field | White car S01 shows a P9 bubble 'Stopping for the dummy. Window closing.' (980-1395,690-790) over the kiosk camera cone, and a red brake fan (1240-1335,865-940). | The game narrates my target; red = it remembers | In P11: no bubbles on white cars; brake fan grey or off. |
| F12 | major | 7_C2_b_field, 7_C2_b_car | Car under the top-right panel at α0.3. The panel text overprints the plate; the ? glyph is lost. | Nothing about the car's awareness | Draw plate, squares and glyph above the HUD. Hide panel text while the car is under it. |
| F13 | minor | 2_B1_a_field, 9_C3_r7_field, 6_A3_a_field | The idle stop line is white dashed, like the painted highway stop bars (C3 370-595,1095; A3 1010-1235,1150). It sits 10 px from the skybridge's pink dashed edge (B1 x765/x775). STOPS HERE in 9_C3_r7 labels the paint. | Road paint | Solid bar with end ticks and a ▲ toward the car; dash only while idle at α0.6. Level stop bars to solid grey. |
| F14 | minor | 1_A1_lesson_fit_field, 5_A2_a_field, 7_C2_a_field | Mint = cameras and lesson chrome (REC, SENSOR FITTED, inset frame). Red dashed ring = drone fitting and search. Yellow = you, HUD frame, FARSIGHT caption, memory ⚠. One sensor has three names: side cones, side sensors, pods. | Colour stops meaning anything | Lesson chrome and HUD frame neutral; fitting ring white; drop 'FARSIGHT:'; one name, SIDE SENSORS. |
| F15 | minor | 2_B1_a_car, 9_C3_r6_car, 1_A1_lesson_fit_field | Kit pieces are 2-4 px. Tally marks and searchlight are red on red. Pods read as mirrors. The fitting close-up shows LENS BAR / WINDSCREEN but not what the lens draws on the road. | Decoration | In the close-up, animate the piece emitting its feedback (lens → ribbon, pods → fans, puck → sweep). Move tallies to a plate numeral. |

## Marks

| Mark | Layer | Decision | Conflicts | Why |
|---|---|---|---|---|
| Rung 0: plate + 7 empty squares, no overlay | P10 overlay | keep | Empty grey squares read as a grille | True to the sim. The hint card carries the lane. |
| Forward ribbon | P10 overlay | merge | Forward cone (straight) diverges on curves: 5_A2_a, 8_B3_a; Reach drops 720→340 between rung 1 and 2: 2_B1_a vs 3_C1_b; Drawn over deck tops while the car is below: 3_C1_b, 7_C2_a, 8_B3_a | Merge with the cone: fill only where the lane path is inside the ±10° cone. Past that, outline only. |
| Too-late zone | P10 overlay | keep | Width = car + 2 × body.radius. The outer 13-unit strips are side contact; B1 cut-in bot logged 0 hits / 8 your-fault (Edit 115 §115.4) | Core of puzzle 2. Narrow it to the width that scores its fault. |
| Stop line, idle (dashed) | P10 overlay | keep | Painted highway stop bars, black/white dashed: 9_C3_r7 370-595,1095; 6_A3_a 1010-1235,1150; Skybridge pink dashed edge 10 px away: 2_B1_a x765 vs x775 | Redraw as a solid bar with end ticks and a ▲ toward the car. Dashes belong to paint. |
| Stop line, braking + STOPS HERE | P10 overlay | keep | 6_A3_a: label at 580,705 sits on a white-outlined block; 9_C3_r7: label at 636,1079 reads as the highway's painted bar | Anchor the label to the line's end, ahead of the nose, never beside the body. |
| Forward cone + 3 grade arcs | P10 overlay | merge | Ribbon (two forward truths); Grade arcs stack with the stop line and ribbon edges: 3_C1_a shows four vertical lines at 865/955/1215 px | Keep the outline only, as the edge of the ribbon's fill. Cut the 3 grade arcs. |
| Side fans + dashed grade ring + pings | P10 overlay | keep | Lidar uses the same steel blue; Invisible over plaza art: 4_B2_a; Registry has six side reaches (F7); Rear lobes behind the car when the front is clipped by a deck: 3_C1_b 185-330 px | Right idea. Fix the reach id; drop the grade ring unless it maps to one id. |
| Lidar sweep line + returns + return ring on you | P10 overlay | move to feedback | Side fans (same colour); Return ring on you = second steel ring next to the notice arc | Needs a 360° reach ring and sweep in its own colour. Returns on you as dots, not a ring. |
| Caught box (corner brackets) | P10 overlay | keep | 4_B2_b: white brackets under the caption ITS SIDE CONES HAVE YOU; Cyan escalator corner brackets, same shape: 3_C1_a 865-940,355-445 | Drive brackets, caption and glyph from one caughtBy field. |
| Notice arc | P10 overlay | keep | Dummy's white ring, same radius; Lidar return ring, same colour | Make it the only ring on the dummy. Colour it by the noticing sensor. |
| Plate squares (7) | P11 kit | keep | HUD title RUNG n repeats it | Readable at play size; the HUD can keep the name only. |
| ? / ! glyph beside plate | P10 overlay | keep | White roof flash on ! says the same thing; Under the HUD at 7_C2_b, unreadable | One awareness mark. Cut the flash. |
| R01 plate (P9) | P9 pixel | keep | S01 white-car plates use the same blue: 9_C3_a | Fine. The squares mark the learner. |
| Street camera: post, mint lens, 60° pan cone, LINKED | P10 overlay | keep | Mint lesson chrome (REC, SENSOR FITTED, inset frame); Cone into a roof, not cut by tall cover: 5_A2_a 735-780,190-470 | Raise the fill, ray-cut it, mark the pan limits. |
| Item brackets | P10 overlay | keep |  | Also move the stop line to the cone. |
| Memory rings | P10 overlay | keep | Yellow ⚠ = you | Draw as specified. 220 is not in the registry: proposed duel.memoryWatchRange. |
| Ghost: body ring, search ring, countdown, LAST SEEN, red searchlight wedge | P10 overlay | keep | Red dashed fitting ring (1_A1_lesson_fit); Ghost sits on the escalator's cyan << bracket: 9_C3_r7 755,1090 | Works. Free the red dashed ring from the fitting. |
| Kit: lens bar | P11 kit | keep |  | A label only; the ribbon is the feedback. |
| Kit: mirror pods | P11 kit | keep | Puck, same colour | Fans start at the pods, so the pods earn their place. |
| Kit: roof puck | P11 kit | keep | Pods and side fans | Recolour to the lidar colour; make it the sweep's centre. |
| Kit: link antenna stub | P11 kit | keep |  | Make it the end point of the camera link line. |
| Kit: bumper strip | P11 kit | keep |  | Legible enough; it ties to the cone brackets. |
| Kit: tally marks | P11 kit | move to car | Livery | Show as a white numeral 1–3 on the plate. Cut the bonnet marks. |
| Kit: searchlight | P11 kit | keep | Livery | The wedge carries it; the piece is only its origin. |
| Captions | HUD | keep | 'SIDE CONES' (caption, lesson 2) vs 'SIDE SENSORS' (HUD) vs 'pods' (kit) | Use one sensor name everywhere. |
| HUD fade α0.3 | HUD | keep | ? glyph and plate | Fails at α0.3. Draw the car's plate and glyph above the HUD. |
| Lunge guide | P10 overlay | keep | Yellow HUD frame, FARSIGHT caption, yellow ⚠ on memory spot | It is the fault predictor puzzles 4–9 need. Yellow must mean you only. |
| FARSIGHT: MOVE ALONG | HUD | merge | Rung names | Drop 'FARSIGHT:'. Keep MOVE ALONG. |
| MISSED: dummy's white ring + facing arrow | P9 pixel | cut | Forward white; Notice arc, same radius | Keep the arrow, cut the ring in P11. |
| MISSED: white roof flash on ! | P10 overlay | cut | ! glyph; Lens bar | Two marks for one fact; P9 marks are meant to be off. |
| MISSED: P9 forward hatch on RED-01 in the boss | P9 pixel | cut | Ribbon, too-late zone, stop line | 9_C3_a, 9_C3_r6, 9_C3_r7, 640-1085 px. |
| MISSED: white car speech bubble + red brake fan | P9 pixel | cut | Red = memory/search; Covers the kiosk camera cone | 9_C3_b 980-1395,690-790. White cars are noise in the boss. |
| MISSED: fitting red dashed ring + ✓ icon | P10 overlay | merge | Ghost search ring | Recolour to neutral white; red dashed belongs to search. |
| MISSED: lesson chrome (TRAINING CLIP, REC, SENSOR FITTED, inset frame) | HUD | merge | Street cameras | Lesson chrome goes neutral grey-white. |
| MISSED: unattributed dashed ring | P10 overlay | cut | Camera 60° cone; Side grade ring | No inventoried mark has this centre. |
| MISSED: checker dither on occluded car/dummy | P9 pixel | keep | Overlay drawn undithered above the same deck | Apply the same dither to ground-level feedback under decks. |
| MISSED: escalator corner brackets | P9 pixel | keep | Caught box shape | Level art. Change the caught box shape to a solid tick ring or diamond corners. |

## Sensor feedback

| Rung | Sensor | On the car | Feedback | Idle / sensing / caught | Params |
|---|---|---|---|---|---|
| 1 | Forward camera | White lens bar, windscreen | White ribbon along the lane path, filled only inside the ±10° cone; outline past it. Too-late zone at α0.17, narrowed to the its-fault width. Stop line as a solid bar. Pulses run nose-out | Ribbon α0.08, edge α0.45, idle stop line α0.6 / You inside the fill: ribbon α0.15, pulses ×2 / Stop line jumps to its stopping point, solid; STOPS HERE at the line's end; white brackets; caption IT BRAKES FOR YOU | perception.coneRadius 340 (reach, all rungs), perception.forwardConeAngle 10, body.radius 13, perception.forwardConeSensitivity 1 |
| 2 | Side sensors | Two steel-blue mirror pods (fan origins) | Two steel-blue fans from the pods, ray-cast; shadows behind tall cover, behind low cover while ducked, and on deck tops; pings out from the pods | Fans α0.12, slow pings / The fan holding you α0.3, fast pings; steel notice arc fills on you; ? / Steel brackets, !, car slows; caption ITS SIDE SENSORS HAVE YOU | perception.sideConeAxis 52.5, perception.sideConeAngle 42.5, perception.coneRadius 340 × perception.sideConeRatio 0.667 = 227 (one id chain; retire sideConeRange 240, sideRadius 100, sideHalfAngle 80 from draw), perception.sideNoticeSeconds 0.6, perception.duckNoticeFactor 1.5, perception.sensorHeight 14, perception.sideCloseRange 180 (grade ring only if the sim grades there) |
| 3 | Roof lidar | Lilac puck, sweep centre | Lilac sweep line rotating 360° to a dotted reach ring; return dots on cover edges, deck edges and parapet gaps fade behind it | Ring α0.1, sweep α0.4, returns fade over one turn / You airborne over its road and in range: lilac dots on your body / Lilac brackets, !, caption ITS LIDAR HAS YOU | perception.lidarHeight 26, perception.lidarRange (proposed, 227), perception.lidarSweepSeconds (proposed, 1) |
| 4 | Street cameras | Mint link stub, rear roof (link line end point) | Mint pan cone per camera, ray-cut by tall cover, with ticks at the pan limits; mint link line camera → stub while reporting | Cone fill α0.2 (proposed), edge α0.5, panning / You in the cone: fill α0.35, mint notice arc / Link line drawn, stub pulses, mint brackets, LINKED | perception.streetCameraFov 60, perception.streetCameraRange 180, perception.streetCameraPanArc 60, perception.streetCameraPanSeconds 3, perception.streetCameraPanHold 1, perception.streetCameraHeight 60 |
| 5 | Road items | Orange bumper strip | Orange brackets on any cone inside the ribbon's fill; the stop line moves to the cone's near edge | No mark / Cone in fill: orange brackets / Stop line solid at the cone, orange end ticks, caption IT STOPS FOR THE CONE | perception.coneRadius 340, body.radius 13 |
| 6 | Crash memory | White numeral 1–3 on the plate (replaces bonnet tallies) | Red ring per remembered spot with its number; forward fill grows visibly per memory | Dashed red ring α0.4 / Car within watch range: solid ring / You in a ring: ring fills, red brackets, caption IT REMEMBERS THIS SPOT | duel.memoryRadius 50, duel.memorySites 3, duel.memoryWatchRange (proposed, 220), perception.coneGrowthPerMemory 0.04, perception.coneGrowthMax 0.2 |
| 7 | Search | Red searchlight, front roof (wedge origin) | Red dashed ghost at last seen, red search ring, countdown arc, LAST SEEN; red wedge from roof to ghost, sweeping | No mark / Ghost, ring, countdown running / Wedge on you: red brackets, ! | duel.searchRadius 60, duel.searchSeconds 4, perception.trackSeconds 3 |

## Puzzles

| # | Tile | New | Screen tells it | Misread | Fix |
|---|---|---|---|---|---|
| 1 | A1 | The red car, blind | yes | The south lane runs under building overhangs; the car dithers out at 210-310 px (1_A1_b). The lunge guide is the only fault cue for the side-contact twist | Pull the overhangs off the lane or dim them over the road. Brighten the lunge guide only for nose contact. |
| 2 | B1 | Forward camera: its stop line | yes | The ribbon reaches the tile edge (2_B1_b). The stop line sits 10 px from the skybridge's dashed edge. The too-late zone's outer 13 units score your fault (cut-in 0/8) | F7, F13; narrow the too-late zone to the its-fault width. |
| 3 | C1 | Side sensors see the kerb | yes | Steel caught brackets coincide with the cyan escalator brackets (3_C1_a). Ribbon and fan sliver draw on the Z2 deck (3_C1_b). The parapet gap is not marked as a fan opening | F6; change the caught-box shape; draw the fan's ray through the parapet gap as a lit notch on the deck edge. |
| 4 | B2 | The dash | no | Fans vanish over the plaza art (4_B2_a). White brackets under a SIDE caption (4_B2_b). The kiosk does not read as cover against the island's screen | F5; fan edges α0.6 on busy tiles; cast a fan shadow behind the kiosk. |
| 5 | A2 | Street cameras; a dash breaks a post | no | The camera is a green dot. Its cone points into a rooftop. The lidar from rung 3 shows nothing and does not close the drop (clears at 84.5 s) | F9, F2. |
| 6 | A3 | Cones (hands) | no | Nothing shows the swerve before it happens. White-outlined blocks south of the road read as forward marks | With a cone in its lane at rung 4, bend the ribbon into the other lane at the swerve point. Block outlines to grey. |
| 7 | C2 | Road items: it stops for cones | no | The kiosk camera has no visible cone (7_C2_a/b), so 'break the camera' has no target. An unattributed dashed ring reads as 360° camera reach | F9; cut the ring; stop line moves to the cone (rung 5 feedback). |
| 8 | B3 | Super Knees: duck | no | Hedge and planter read the same as each other and as tall cover. The forward cone catches you on the kerb (8_B3_a) and seems to see over the hedge. The duck rule lives in HUD text | F3; give low cover a height cue (cap line + short shadow). Show the fan shadow behind the hedge only while ducked. |
| 9 | C3 | The boss: memory, then search | no | Hatch is back on RED-01 (F1). The memory spot is a yellow ⚠. S01's bubble and red brake fan. The ghost sits on an escalator bracket | F1, F10, F11; nudge the ghost label off level brackets. |

## Colours

- White: RED-01 forward camera: ribbon, too-late zone, stop line, cone edge, white brackets
- Steel blue #7fa8bc: RED-01 side sensors: pods, fans, pings, notice arc, brackets
- Lilac (proposed #b9a7e8): RED-01 roof lidar: puck, sweep, reach ring, returns
- Mint (C.cam): Street cameras: lens, cone, link line, link stub
- Orange #ff8a1f: Cones and its response to them: bumper strip, item brackets, cone stop ticks
- Red #ff5a5a: RED-01's memory and search: rings, ghost, searchlight, plate squares; the livery is the car itself
- Yellow (C.dummy): You: dummy, lunge guide, your prompts (MOVE ALONG, HOLD C)
- Neutral grey-white: HUD frames, lesson chrome, fitting ring, level stop bars

## Cut

- P9 forward hatch on RED-01 in every puzzle, the boss included
- Forward cone grade arcs (3)
- Side fan dashed grade ring, unless mapped to perception.sideCloseRange
- P9 white body ring on the dummy in P11
- White roof flash on !
- Speech bubbles and red brake fans on white cars in P11
- Grey silhouette + yellow ⚠ on memory spots
- 'FARSIGHT:' prefix on MOVE ALONG
- Red dashed fitting ring and ✓ icon
- Unattributed dashed ring at 7_C2_a
- Bonnet tally marks (move to plate numeral)
- perception.forwardLength, sideConeRange, sideRadius, sideHalfAngle from the draw path
- Names 'side cones' and 'pods' in player text

**Priority:** F1, F2, F3, F4, F5, F6, F9, F8, F7, F10, F11, F12, F13, F14, F15

Call: {"label": "a_ui_review", "role": "ui_adversary", "model": "opus", "seconds": 522.1, "cost_usd": 1.9233062000000003, "input_tokens": 16, "cache_write_tokens": 99811, "cache_read_tokens": 469271, "output_tokens": 51545, "prompt_chars": 34470, "models": ["claude-opus-5-5"]}
Cost: $1.92
