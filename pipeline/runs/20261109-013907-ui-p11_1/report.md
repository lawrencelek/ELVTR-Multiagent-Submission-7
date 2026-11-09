# Adversarial UI review: p11_1

**Verdict:** The red car carries two sensor languages at once: Prototype 9's hatch, headlight wedge and side outlines, and Prototype 10's cones. They disagree on reach, on side, and on whether a blind car can see. The cones also ignore height and cover. As a result the screen telegraphs none of the nine twists before the player fails, and in puzzle 1 it points the player away from the solution.

## Findings

| Id | Severity | Shots | What | Player reads | Fix |
|---|---|---|---|---|---|
| F1 | blocker | 2_B1_a_field, 2_B1_a_car, 3_C1_a_field, 5_A2_a_field, 7_C2_a_field, 9_C3_a_field | Forward sight is drawn up to four times over: P9 hatch (fwdLen), P9 headlight wedge, rung-1 band (fwdLen), and P10 forward cone (340). The lengths differ and the shapes overlap. In 3_C1_a the hatch (x 740-1230) sits inside the cone (x 740-1320) under the headlight. The P9 side dotted fill fires on the side away from the dummy (8_B3_b). | Several zones of unclear meaning. Which edge is the danger? | Gate all P9 sensor marks (hatch, side outlines, dotted fill, headlight wedge, notice flash) off for RED-01 when s.p11 is set. White cars keep them. RED-01 keeps its lamps. Draw one forward ribbon (see sensor_feedback rung 1). |
| F2 | blocker | 1_A1_a_field, 1_A1_a_car, 1_A1_b_field, 1_A1_lesson_clip_field | At rung 0 the blind car draws a forward hatch, side arcs, a headlight wedge and an awareness bar. The training clip says the car 'saw' the hatch. | It sees its lane, so stay out of it. That is the opposite of the solution, 'stand in its lane'. It also contradicts the hint 'It cannot see you'. | Rung 0 draws nothing but the lamps and the plate with 7 empty squares. The clip replays the overlay of the car's rung at the time of the hit. |
| F3 | blocker | 3_C1_a_field, 4_B2_b_field, 6_A3_a_field, 8_B3_a_field | The side and forward fans paint over decks, escalators, buildings, kiosks and hedges. Nothing is clipped by height or cover. 3_C1_a: the fan covers the Z2 deck and both escalators (x 600-1080 y 240-480). 6_A3_a: the red has-you sector covers the kiosk (x 840-895 y 405-515). 8_B3_a: the fan covers the hedge (x 350-540 y 470-515). | Height and cover do not matter, which cancels the twists of puzzles 3, 4, 5, 7 and 8. | Ray-cast each fan. Stop it at tall cover (shadow wedge behind it). Low cover casts a shadow only while the dummy is ducked, so the shadow appears when the player presses C. Leave deck tops unpainted below rung 3. |
| F4 | blocker | 5_A2_a_field, 5_A2_b_field, 7_C2_a_field, 7_C2_b_field, 9_C3_a_field | The street camera is about 8 px at 2x and its pan cone cannot be seen while idle. In 9_C3_a the cone (x 900-1260) is the same grey-green as the side fans. | The cabinet or kiosk is safe cover. The camera is decoration. | Draw the mint pan cone always (idle α 0.08). It brightens when you are inside, and LINKED fires on catch. Enlarge the post (proposed 8 px lens at 1x). Mark the dash-break point on the post. |
| F5 | major | 2_B1_a_field, 2_B1_b_field, 2_B1_b_car | Puzzle 2's new idea is the stop line, but it draws only once the car brakes. Before a failure the only cue is the unlabelled hatch length. Edit 115 §115.4: the cut-in bot logs 0 hits / 8 your-fault contacts. | No window is visible; stepping in feels random. | From rung 1, draw a dashed stop line at fwdLen ahead at all times. Shade the nose-to-line band as 'too late to stop' in white α 0.12. The line goes solid when braking. |
| F6 | major | 4_B2_a_field, 5_A2_a_field | Lesson 3 says roof lidar sees a dummy jumping or falling off a deck. Edit 115 §115.4 measured that it does not close a deck drop, and A2's drop still clears. No puzzle is played at rung 3: puzzle 4 teaches 2→4 at once. | Drops are closed, so stop trying them. Or: the card lied. | Either make lidar close drops within a proposed perception.lidarRange and show its sweep on deck edges, or fold rung 3 into rung 4's lesson and drop the drop claim from the card. |
| F7 | major | 4_B2_b_field, 4_B2_b_car, 6_A3_a_field, 5_A2_b_car, 3_C1_b_car | Caught states use yellow (the dummy's colour) and red (the car's colour). The dummy turns orange inside the red sector (4_B2_b x 395-445 y 675-750). Cones turn invisible on red (6_A3_a x 925-955 y 415-445). A dithered dummy disappears in the yellow fill (5_A2_b_car x 170-230 y 215-300). | The dummy and the cones vanish at the moment of truth. | State is shown by brightness in the sensor's own colour, plus a corner-bracket box round the dummy in that colour. Remove the yellow and red fills. |
| F8 | major | 2_B1_a_field, 3_C1_b_field, 6_A3_a_car, 9_C3_r7_car, 9_C3_r7_field | Above the car sit a P9 plate, a tag about 350 px wide, ?/!, 3 pips, a track bar, a notice ring and P9 speech bubbles. They cover the dummy, its arrow and the fans. In 9_C3_r7 a label ending 'EN' collides with the tag end (x 770-800 y 945-960). | A pile of labels; the dummy is lost. | Keep the plate, with ?/! on it and 7 squares under it. Cut the tag text, pips and track bar. Cut the bubbles on RED-01. Move the notice arc to the dummy. |
| F9 | major | 6_A3_b_field, 7_C2_b_field, 5_A2_a_field, 8_B3_a_field | The forward hatch and headlight run straight ahead while the lane curves. They cross buildings (6_A3_b x 375-480 y 600-1220), a deck (8_B3_a) and other roads (7_C2_a). | It sees through buildings, and will drive there. | Draw the forward ribbon along the lane polyline. At rung 4, a cone in the lane bends the ribbon round the cone (swerve preview). At rung 5, the ribbon ends at the cone with the stop line. |
| F10 | major | 1_A1_lesson_fit_field | The lesson card shows CLOSED and NEXT but no OPEN line. NEXT repeats the new rule ('It stops for you in its lane') instead of the trick still open (LESSON[1][2]: cut in). The fitting close-up is not in the shot because the card covers the field. | What is closed, but not what to try. | Add an OPEN row from LESSON[n][2]. Make NEXT name the puzzle and its open trick. Show the fitting with the new sensor's field drawn on the road before the card. |
| F11 | major | 9_C3_r6_field, 9_C3_r6_car, 9_C3_r7_field, 9_C3_r7_car | At rung 6 no memory ring is visible: only a chalk figure with a yellow triangle (x 635-700 y 550-640). The tallies cannot be counted. At rung 7 the amber ghost, search ring, STOPS HERE label and escalator overlap (x 560-870 y 980-1210). | The boss's two new rungs have no on-field shape. The player learns them by repeating a move and failing. | Rung 6: a red numbered ring per site that brightens as the car nears. Rung 7: a red dashed ghost silhouette whose single ring empties over duel.searchSeconds. Draw the STOPS HERE label on the side away from the ghost. |
| F12 | major | 7_C2_b_field, 6_A3_b_field | The HUD covers the car: the strip hides RED-01 and its tag (7_C2_b x 1190-1260 y 160-280), and the panel covers the plate (6_A3_b). | The car disappears at the decision point. | Fade the HUD to α 0.3 while the car or dummy is under it, or keep lanes out of a 130 px top band in each puzzle's layout. |
| F13 | minor | 2_B1_a_field, 3_C1_a_field, 3_C1_b_field | One sensor has several reaches in the registry. Forward: perception.forwardLength 720, perception.coneRadius 340, fwdLen. Side: perception.sideRadius 100, perception.sideCloseRange 180, the derived 227, perception.sideConeRange 240, perception.sideWaryRange 360. The rings draw at the 2 grades of 227, but the stages act at 180 and 360 (360 lies beyond the fan). | The forward reach shrinks from rung 1 to rung 2. The rings do not line up with SLOWING or STOPPING. | One id per reach. Rings at the thresholds the sim acts on. sideWaryRange must not exceed the fan reach. Retire perception.sideRadius and perception.sideHalfAngle for RED-01. |
| F14 | minor | 5_A2_a_car, 5_A2_b_car, 7_C2_b_car, 9_C3_r6_car | Kit pieces are 2-4 px and misleading. The mint fin ring reads as 'camera'. The puck renders white and its spin cannot be seen. The bumper strip merges with the stop line at the nose. The yellow tallies look like lamps. | Which sensor this car has is unreadable at play size. | Kit is a label only. Each piece pulses in step with its field the first time that field acts in a puzzle. Recolour the puck to steel blue, and the tallies and searchlight to red. |
| F15 | minor | 4_B2_a_field, 6_A3_b_field, 7_C2_a_field, 8_B3_a_field, 5_A2_a_field | Level art competes with the overlay. Cyan escalator corner brackets look like detection boxes. Kiosk cyan screens read as camera lenses (7_C2_a x 720-770). Hedge and planter (8_B3_a) look like the tall cover. The island kiosk reads as an LED sign (4_B2_a x 770-820 y 715-770). MOVE ALONG fires at the hiding spot (5_A2_a, 7_C2_a). LED diagonal stripes echo the hatch. | Cover and cameras do not read as puzzle pieces. The game pushes you out of the intended hiding spot. | Cover gets one readable outline and a height cue: tall casts a ground shadow, low gets a short lip. Use one camera post design. Escalators lose their brackets. Cut MOVE ALONG in P11. Hatch is gone (F1). |

## Marks

| Mark | Layer | Decision | Conflicts | Why |
|---|---|---|---|---|
| Headlight beam (white wedge) | P9 pixel | cut | Hatch; Rung 1 band; Forward cone; White = forward camera; The flash uses the white cars' rule, not RED-01's | On RED-01 the wedge is either a lie (rung 0) or a second copy of the camera (rung 1 and up). Keep it for the white cars only. |
| Lamps (2 px on the sprite) | P9 pixel | keep | Lens bar sits 4 px away (2_B1_a_car) | Hardware, and true at every rung. |
| Brake glow (red fan behind the car) | P9 pixel | move to car | Livery; Has-you fill; Memory red | Braking is already shown by the stop line and the car's motion. On RED-01, show it as the two rear lamps brightening, with no fan. |
| Forward corridor (diagonal hatch) | P9 pixel | merge | Headlight; Rung 1 band; Forward cone; Steel-blue cone fill; LED stripe art; Deck dither | This is the user's complaint, and it holds. The fill goes. The one true fact it carries, the stopping distance, survives as the 'too late' zone of the forward-camera ribbon. |
| Side sensor outlines and their dotted fill | P9 pixel | cut | P10 side cones (reach 227); View edges; Deck dither | It contradicts Prototype 10's cones on reach and on side, and it shows on a blind car. |
| Clip to the dummy's view cone | P9 pixel | cut | True to the sim | What the car senses must not depend on which way the player faces. |
| View edges (two faint lines from the dummy) | P9 pixel | cut | P9 side outlines; P10 cone edges | The puzzles show the whole board, and the lines read as sensor edges. |
| Sprite (sedan recoloured red) | P9 pixel | keep | Has-you red fill; Brake glow | It is the icon. Give red no other meaning in the field. |
| Rung 1 beam (straight band) | P10 overlay | move to feedback | Hatch; Headlight; Red = car | This becomes the single forward-camera ribbon. It follows the lane path, shows a too-late zone, and never turns red. |
| Forward proportional cone (rung 2 up, 3 grade rings) | P10 overlay | merge | Hatch; Headlight; Side-cone colour; Rung-1 reach 720 vs 340 | Forward sight is one fact. Draw it as the white ribbon at every rung from 1, and show the grades as ticks on the ribbon. |
| Side cones (10°-95°, 2 grade rings) | P10 overlay | move to feedback | Yellow = dummy; Red = car; Hatch fill; Cyan tile trims | Keep the fan. Clip it to the ground, cast shadows behind cover, and show state by brightness in steel blue. Drop the yellow and red fills. |
| Grade rings (dashed) | P10 overlay | merge | Stage thresholds; P9 dashed outlines | Draw one ring per threshold the sim acts on. |
| Stop line (STOPS HERE) | P10 overlay | keep | Bumper orange; Ghost amber (9_C3_r7 label at x 560-660 y 1070-1090); Memory red | This is the core feedback for the forward camera. Show it dashed at the stopping distance from rung 1, solid when braking, and white only. |
| ? / ! over the car | P10 overlay | keep | Amber search; Red car | A universal stealth glyph. Put it on the plate, in white. |
| 3-pip awareness meter | P10 overlay | cut | Tag state word; ?/!; Orange cones; Amber search | It is the third copy of one fact. The car's speed and the stop line already show the stage. |
| Track bar | P10 overlay | cut | Pips; Tag squares | Show tracking as the ! fading over perception.trackSeconds. |
| Notice ring | P10 overlay | move to feedback | Tag squares; Yellow = dummy | This is the one timer the player must watch. Draw it as an arc round the dummy, in the colour of the sensor that is filling it. |
| Tag text (RED-01 · Rn NAME · STATE) | P10 overlay | cut | P9 R01 plate; P11 panel line 1; Pips | The panel already says the rung name, and the plate says the ID. The state word repeats ?/!. |
| Tag squares (7) | P10 overlay | move to car | Panel RUNG n | Draw them as 7 px under the plate. It is the only on-car count that survives play size. |
| Kit R1 lens bar | P11 kit | keep | Lamps | A label. The ribbon carries the meaning. |
| Kit R2 mirror pods | P11 kit | keep |  | It points where its fans look. |
| Kit R3 roof puck (spins) | P11 kit | keep | Mint = street cameras; Lamps | Recolour to steel blue (onboard ranging). Make the spin read through the field sweep, not the 4 px puck. |
| Kit R4 link fin (pulses) | P11 kit | keep | Puck mint; Lens bar meaning | It is only right while it pulses with LINKED. Draw it as an antenna stub, not a ring. |
| Kit R5 bumper strip | P11 kit | keep | Stop line at the nose; Old CRAWLING pip | A label. The cone brackets carry the meaning. |
| Kit R6 tally marks | P11 kit | keep | Yellow = you; Lamps | Recolour to red (its memory) and fill per site. |
| Kit R7 searchlight (sweeps) | P11 kit | keep | Orange cones; Yellow dummy | Recolour to red. The field beam carries the sweep. |
| Kit glint (duel.kitGlintSeconds 3, proposed) | P11 kit | keep |  | The cheapest telegraph of what is new. Fire the new sensor's field pulse at the same moment. |
| Street camera post | P10 overlay | keep | Cyan kiosk screens (7_C2_a x 720-770 y 455-505) | Puzzles 5, 7 and 9 turn on it. Enlarge it: proposed lens of 8 px at 1x. |
| Camera range and pan cone | P10 overlay | move to feedback | Steel-blue side fans | It must be visible while idle, or the twist is invisible. |
| LINKED (dashed dummy → camera → car, box) | P10 overlay | keep | Escalator corner brackets | It is the camera's caught state. |
| Chalk outline + numbered marker | P10 overlay | merge | Yellow = you; Memory ring | One mark per site: a red numbered ring. |
| Memory ring (duel.memoryRadius 50) | P10 overlay | keep | Brake glow; Has-you fill | This is rung 6's only feedback. It must draw. |
| CHECKING #n over the tag | P10 overlay | cut | Tag | Show it as the ring brightening as the car nears. |
| EXPECTED | P10 overlay | cut | Memory ring | The ring brightening says it. |
| Ghost body ring | P10 overlay | keep | Stop-line amber; Orange cones; Yellow dummy | Recolour to red: it is the car's belief about you. Draw it as a dashed dummy silhouette. |
| Search ring (duel.searchRadius 60) and countdown arc (duel.searchSeconds 4) | P10 overlay | merge | Ghost ring | One ring that empties as its countdown. |
| Lunge guide | P10 overlay | keep | White = forward camera | Make it yellow always (yours), brighter when it connects, and hide it with no dash in the kit. |
| DUCKED · HIDDEN / SEEN ring | P10 overlay | cut | Sensor box; Yellow | Hidden shows as a cover shadow on the dummy; seen shows as the sensor box. |
| MOVE ALONG countdown (FARSIGHT: MOVE ALONG) | P10 overlay | cut | The cover solutions of 4, 5, 7 and 8 | It pushes the player away from the intended move. Cut it in P11 puzzles. |
| Flashes (IT BRAKES FOR YOU, ITS SIDE CONES HAVE YOU …) | P10 overlay | move to feedback | Field marks | Put them in a fixed caption band at the field bottom, one at a time, in the colour of the sensor named. |
| Panel, top left | HUD | keep | Covers the plate (6_A3_b x 390-460 y 120-150) | Fix the rung-5 text. Fade it when the car passes under. |
| Strip, top right | HUD | keep | Car occluded | Fade it to α 0.3 when the car or dummy is under it. |
| Hint banner | HUD | keep |  | Fine. |
| Broken camera post | P10 overlay | keep |  | Its cone must vanish with it. |
| MISSED: P9 roof plate R01 / S01 | P9 pixel | keep | Tag text; Blue tile trims | It survives as the car's only label, carrying ?/! and the squares. |
| MISSED: P9 speech bubbles (Route locked. / Stopping for the dummy.) | P9 pixel | cut | Tag; Ghost | Remove it from RED-01 in play. Lines belong in the lesson clip. |
| MISSED: deck occlusion dither (red or yellow checker) | P9 pixel | keep | Hatch; Dotted fill; Yellow cone fill | Once the hatch and dots are cut, dither means one thing: under a deck. |
| MISSED: dummy facing arrow and body ring | P9 pixel | keep | White = forward camera | Recolour to dummy yellow. |
| MISSED: escalator corner brackets with chevrons | P9 pixel | keep | Detection boxes; Mint; Steel blue | Keep the chevrons and drop the corner brackets, so corner brackets mean 'detected'. |
| MISSED: lesson clip replays the P9 marks | P10 overlay | cut | Rung 0 truth | The clip must show the sensors the car had at the time of the hit. |

## Sensor feedback

| Rung | Sensor | On the car | Feedback | Idle / sensing / caught | Params |
|---|---|---|---|---|---|
| 1 | Forward camera | Lens bar (windscreen top), white | A white ribbon along the lane path, car width + 2 × body.radius wide, to forward reach. The nose-to-stopping-distance segment is shaded as 'too late'. A dashed stop line sits at its end. No hatch, no headlight wedge. | Ribbon edges α 0.10; too-late band α 0.12; stop line dashed / Dummy inside the ribbon beyond the line: white corner box on the dummy, stop line goes solid, STOPS HERE label / Car stops at the line, box flashes once, caption IT BRAKES FOR YOU in the bottom band | perception.forwardLength 720, fwdLen (stopping distance; proposed id perception.stopDistance), body.radius 13 |
| 2 | Side sensors | Mirror pods, steel blue | Two steel-blue ground fans at 10°-95° off the nose. They are ray-cast: they stop at tall cover and at deck edges, and low cover shades them only when the dummy is ducked. One dashed ring sits at the close threshold. Returns are short steel-blue ticks on the dummy's edge facing the car. | Fan α 0.05 + 0.2 × sensitivity; ring dashed / Returns on the dummy; a steel-blue arc round the dummy fills over the notice time (×1.5 ducked); ? on the plate / Steel-blue corner box on the dummy; the sector containing the dummy goes to α 0.35; ! on the plate; stop line drops | perception.sideConeAxis 52.5, perception.sideConeAngle 42.5, perception.sideConeRange 240 vs (derived) side cone reach 227: pick one, perception.sideCloseRange 180, perception.sideWaryRange 360 (must be ≤ reach), perception.sideConeSensitivity 0.5, perception.sideNoticeSeconds 0.6, perception.duckNoticeFactor 1.5, perception.sideAwareNoticeRate 0.5, perception.sideWaryNoticeRate 1, perception.sensorHeight 14 |
| 3 | Roof lidar | Roof puck, steel blue, spins | A thin steel-blue sweep line rotating 360° round the roof. Where it crosses deck edges and parapet gaps inside its reach, it leaves fading return dots, so it visibly covers the sky. An airborne dummy inside reach collects returns. | Sweep line α 0.15, deck-edge returns α 0.2 fading over one rotation / Airborne dummy within reach: returns on the dummy, arc filling / Steel-blue box on the airborne dummy, ! on the plate, stop line drops | perception.lidarHeight 26, proposed perception.lidarRange, proposed perception.lidarSweepSeconds |
| 4 | Street cameras | Link fin, mint antenna stub; pulses only while linked | Drawn on the world camera, not the car: an enlarged post with a mint lens, and a mint 60° cone panning across its arc, always visible. The cone casts the same cover shadows as the fans, from a height of 60. | Mint cone α 0.08 panning; post lens steady / Dummy inside the cone: cone α 0.2, mint arc filling on the dummy / LINKED: mint dashed dummy → post → car, mint box on the dummy, fin pulses, ! on the plate | perception.streetCameraRange 180, perception.streetCameraFov 60, perception.streetCameraPanArc 60, perception.streetCameraPanSeconds 3, perception.streetCameraPanHold 1, perception.streetCameraHeight 60 |
| 5 | Road items | Bumper strip, cone orange | An orange corner bracket on every cone inside the forward ribbon. Before rung 5, the ribbon bends round a cone in the lane (swerve preview). From rung 5, it ends at the cone with the stop line. | No mark / Cone inside the ribbon: orange bracket / Stop line placed short of the cone; ribbon ends there; no swerve | perception.forwardLength 720 (item reach = forward reach), fwdLen |
| 6 | Crash memory | Three tally marks on the bonnet, red, one filled per site | A red numbered ring at each remembered spot. Fans grow per memory, and the growth is visible as the fan edge stepping out. | Ring dashed α 0.3 / Car approaching the site: ring solid and brightening / Dummy inside a ring as the car passes: red box, ! on the plate, stop line drops | duel.memoryRadius 50, duel.memorySites 3, perception.coneGrowthPerMemory 0.04, perception.coneGrowthMax 0.2, proposed duel.memoryCheckRange |
| 7 | Search | Searchlight on the roof front, red, sweeps while searching | A red dashed dummy silhouette (the ghost) at the last-seen point. One ring round it empties as the countdown. A narrow searchlight wedge sweeps inside the ring. | No mark / Seen, then lost: ghost and full ring appear, ring empties, searchlight sweeps / Dummy inside the ring when the searchlight crosses: red box, !, stop line drops | duel.searchRadius 60, duel.searchSeconds 4, perception.trackSeconds 3 |

## Puzzles

| # | Tile | New | Screen tells it | Misread | Fix |
|---|---|---|---|---|---|
| 1 | A1 | The red car, blind | no | A hatch, side arcs and a headlight wedge suggest it sees its lane (1_A1_a, 1_A1_b), so the player avoids the lane. | Rung 0 draws nothing but lamps and the plate with 7 empty squares. The clip replays without the P9 marks. |
| 2 | B1 | Forward camera: its stop line | no | No stop line is shown before braking (2_B1_a/b). Three overlapping forward shapes give no window. | A persistent dashed stop line and a 'too late' band from rung 1. The lens bar glints at the first pass. |
| 3 | C1 | Side sensors: it sees the kerb | no | The fans cover the Z2 deck and both escalators (3_C1_a), so the deck looks watched and the drop looks closed. | Ground-clipped fans: deck tops and the parapet gap stay unpainted, which makes the gap read as the hole in its sight. |
| 4 | B2 | Battery 1: the dash | no | The island kiosk reads as an LED sign (4_B2_a x 770-820 y 715-770). Fans paint over it with no shadow. The lunge guide is white and reads as a goal. | Kiosk with a cover outline that casts a fan shadow. Yellow lunge guide that brightens when the dash lands ahead of the nose. Card 4 must name the dash. |
| 5 | A2 | Street cameras; a dash breaks a post | no | The camera cannot be seen (5_A2_a/b), so the cabinet looks safe. MOVE ALONG pushes the player out of cover. The drop still clears because lidar is not closing it. | Visible mint pan cone and post (F4). Cut MOVE ALONG. Resolve F6 so the drop is closed or intended. |
| 6 | A3 | Hands 1: cones | no | The swerve is never previewed. Cones and kiosk sit under the red sector (6_A3_a). The straight hatch runs off the curve (6_A3_b). | The ribbon bends round a placed cone at rung 4, showing where the swerve goes. Orange brackets on the cones. Kiosk shadow. |
| 7 | C2 | Road items: it stops for cones | no | Only a 2 px bumper strip says cones changed. The camera on the kiosk is invisible (7_C2_a x 685-695). The HUD hides the car (7_C2_b). | At the first pass, show the ribbon ending at a placed cone with the stop line. Visible camera cone. HUD fade. |
| 8 | B3 | Super Knees: duck | no | The hedge and planter look like any block. Fans paint over them whether standing or ducked (8_B3_a). The panel says ALL IT CAN LEARN at rung 5. | Low-cover shadow appears only when ducked, so pressing C visibly casts it. Low-cover lip art. Panel: 'NEXT: CERTIFICATION'. |
| 9 | C3 | The boss: rungs 6 and 7 mid-puzzle, white traffic 0.5 | no | No memory ring is drawn at rung 6 (9_C3_r6). The rung-7 ghost, STOPS HERE and the escalator overlap (9_C3_r7). The camera cone matches the fans. White cars' P9 marks add a second language. | Red site rings and the red ghost (F11). Mint camera cone. White cars' marks greyed so RED-01's feedback stands alone. |

## Colours

- Red #ff5a5a: RED-01 and what it knows about you: livery, plate squares, panel, tallies, memory rings, ghost, searchlight
- White: Forward camera: ribbon, too-late band, stop line, lens bar. Also neutral text, never a field fill
- Steel blue #7fa8bc: Onboard ranging: side fans, lidar sweep, pods, puck, their returns and catch box
- Mint #9ff2c8: Street cameras: post lens, pan cone, LINKED, link fin
- Orange #ff8a1f: Road items: traffic cones, their brackets, bumper strip
- Yellow (C.dummy): You: the dummy, facing arrow, lunge guide, your score strip and hints
- Grey: Other traffic's own sensing (P9 white cars) and dead objects (broken post)

## Cut

- P9 forward hatch on RED-01 (all rungs)
- P9 side outlines and dotted fill on RED-01
- P9 headlight wedge and notice flash on RED-01 (lamps stay)
- Brake-glow fan on RED-01
- Clip of RED-01 marks to the dummy's view cone
- Dummy view edges in P11
- Yellow 'noticed' cone fill
- Red 'has you' cone fill
- Amber as a hue (search moves to red)
- 3-pip awareness meter and track bar
- Tag text line (RED-01 · Rn NAME · STATE)
- CHECKING #n, EXPECTED, DUCKED · HIDDEN / SEEN text
- Chalk figure and yellow warning triangle (merged into the red site ring)
- MOVE ALONG / FARSIGHT loiter text in P11 puzzles
- P9 speech bubbles on RED-01 in play
- Escalator corner brackets (chevrons stay)
- Lesson 3's claim that lidar closes the drop, unless the sim is fixed

**Priority:** F2, F1, F3, F4, F5, F6, F7, F8, F9, F11, F12, F10, F13, F14, F15

Call: {"label": "a_ui_review", "role": "ui_adversary", "model": "opus", "seconds": 493.9, "cost_usd": 1.9269386000000002, "input_tokens": 12, "cache_write_tokens": 109777, "cache_read_tokens": 306873, "output_tokens": 49365, "prompt_chars": 36369, "models": ["claude-opus-5-5"]}
Cost: $1.93
