# Car design agent: the hero cars

**Today's hero:** Today's hero (ref_upgrade_A1_3, ref_upgrade_C2_3) is a vector sedan pixel-scaled. It has a flat #d8343a body with no 1-px rim, no extrusion (no grey rear face), no head or tail lights and no stair-stepped glass. Its parts are soft round blobs and its mirrors are flat tabs, so it reads as clip art pasted over the level, not as the S01 sprite from ref_sprites seen closer.

## Style rules

- Projection: nose up, one rounded-rectangle footprint. The top face is the footprint lifted by the extrusion. The rear face shows below it, fleetSide #8C9AA8, with its bottom row fleetSide2 #5E6B78. Side faces never show left or right.
- The top-face row directly above the rear face is fleetLine #6F7D8B. It is the fold line, and it follows the rounded rear corners.
- Outside ring: 1-px rim. #8FDFFF where the edge faces up or right, #3A4A66 elsewhere. Never a black edge on dark ground.
- Body tones come only from redSprite on fleet greys: top #F1544C (fleetTop), roof #FB5E54 (fleetRoof). Creases and cowl use red() of mid greys (#D23B37, #BB2D2B). fleetSide, fleetLine, glass, head, tail and chrome are unchanged, as redSprite leaves them.
- Glass is flat #0E3A4F bands that span the cabin width minus the pillars. Their edges stair-step 1 px every 4 rows. One 2-px-wide 45° glint (#7FF0FF) sits top right, because the light comes from the top right.
- Headlights are #CFF6FF blocks in the front corners, clipped by the nose curve. Tail lights are #7A2424 blocks in the rear corners and turn #FF3D3D when braking.
- Inner details have no outline (glass, lights, light bar). Parts that sit on the red body get a 1-px #05070B ink ring and a dark housing (podBody #18213A, pod3, chromeD), because rungs 6 and 7 (#ff5a5a) match the body red.
- Scale: hero ≈ 4 hero px for each in-level px (sedan 25×13 h3 → 96×45 h8). Glyphs are 3×5, plates 15×7, the same font as the in-level S01 tag.
- Symmetric about one centre column (odd W). Asymmetric details only where the job needs them: police strobes blue left and red right, the driver's pillar spot, specular pixels on the right.

## Classes

| Class | Model | Silhouette | Details | Buffer |
|---|---|---|---|---|
| LUMINARY | SED-01-001 | Stretched sedan 45×96 footprint (ratio 2.13, the in-level sedan is 1.92) with front corners r9 and rear r8. Long bonnet (rows 10–29), long roof (42–71), short rear glass, long boot. 4×6 mirror caps stand out 4 px at the windscreen base. Extrusion 8. | Vertical chrome grille 11×6, slats alternating chromeL/chromeD, under a chrome frame row; Single-column chrome mascot on the bonnet nose (rows 10–12); Two crease lines at v=±9 down the bonnet; Chrome trim row under the windscreen (row 29) and under the rear glass (row 80); Glass sunroof 15×8 at the roof front; a 1-px drip rail in crease red at v=±17; Chrome bar between the tail lights (row 92); boot-lid seams at v=±15; Rear face: chrome bumper strip, then a blue S01 plate (tagFill/tagInk), the in-level roof tag | [57, 108] |
| VANGUARD | POL-01-001 | Wider, shorter sedan 47×90 with corners r7 and a gunmetal push bar 27 px wide, 5 rows ahead of the nose on two uprights. 5×7 mirrors. Light bar across the roof front. Extrusion 8. | Light bar rows 41–44, v≤16: podBody frame, 4-px lamps. Blue (#3FD0FF) on the left and red (#FF3D3D) on the right alternate at 2 Hz; the dim states are modD and tail; Black grille with two hidden strobes (blue left, red right) that blink in phase with the bar; Dark cowl line instead of chrome; black panel between the tail lights; gunmetal rear bumper strip; Rear face: P01 plate | [59, 107] |
| ENIGMA | VAN-01-001 | Cab-forward van. The cab is 45 px wide (rows 0–33) and the cargo box steps out to 49 px (rows 34–95). Square box rear r3, round cab nose r8. 5×7 van mirrors. Extrusion 12, so a tall rear face with doors. | Black-gunmetal bumper (rows 0–3); square headlamps with amber corner indicators; Horizontal-slat grille; short bonnet; wide windscreen; Grey fleetLine across the box front edge (row 34): the step up to the box; Box roof ribs in pod2 every 6 rows (the in-level van's roof stripes); fleetLine roof rails at v=±22; Tall vertical tail lamps at the box corners; Rear face: two doors (centre split, handles, hinges), a chrome-and-gunmetal step bumper, V01 plate | [61, 112] |

## Kit by class

| Class | Rung | Part | Look | Why |
|---|---|---|---|---|
| LUMINARY | 1 | VALET LENS | Chrome-cased lens bar at the top of the windscreen behind the rear-view mirror: a white lens with a dark pupil. | A chauffeur car watches the lane ahead so the board's ride never jolts. |
| LUMINARY | 2 | MIRROR EYES | Blue-grey sensor lens set into each mirror cap, with a specular pixel at its top right. | An executive car keeps its lines clean, so its side sensors hide in the mirrors. |
| LUMINARY | 3 | HALO DOME | Flush 9×9 glass dome mid-roof with a violet ring and a violet sweep line turning inside. | A CEO car won't wear a bucket on its roof; the lidar sits flush under glass. |
| LUMINARY | 4 | SHARK FIN | Dark shark-fin aerial at the roof's rear edge with a mint link strip down its spine. | Luxury cars already carry a shark fin; this one talks to the street cameras. |
| LUMINARY | 5 | PARK RADAR | Dark strip across the front bumper with six orange parking-sensor dots. | Executive cars have parking sensors; now they read cones and road items. |
| LUMINARY | 6 | LEDGER | Chrome-topped plate on the bonnet with three red lamps, one lit per remembered crash spot. | The board's car keeps minutes; it logs every incident. |
| LUMINARY | 7 | SUNROOF LAMP | Round gunmetal lamp risen through the sunroof with a red lens that flashes while it searches. | The chauffeur never steps out; a lamp rises through the sunroof to look. |
| VANGUARD | 1 | DASH CAM | Black dash-cam box at the windscreen top: white lens, dark pupil, a red REC dot blinking at 1 Hz. | Every patrol car records the road ahead. |
| VANGUARD | 2 | PLATE READER | Black pod on each mirror with twin blue-grey lenses facing forward and back. | Patrol cars read both pavements as they pass. |
| VANGUARD | 3 | SPEED LIDAR | Chamfered 9×9 roof turret with a violet bar rotating in four 45° steps. | Police already carry speed lidar; this one scans for bodies. |
| VANGUARD | 4 | RADIO MAST | Black aerial base on the rear roof with a mint link light and a chrome whip trailing back. | A patrol car stays on the radio to dispatch, and dispatch relays the cameras. |
| VANGUARD | 5 | BAR RADAR | Orange sensor slit along the push bar's centre, split into lamps by dark gaps. | The push bar clears the road; now it reads cones and road items first. |
| VANGUARD | 6 | CASE FILE | Black clipboard on the bonnet with a chrome clip and three red tally bars, one lit per crash spot. | Police open a case on every crash scene. |
| VANGUARD | 7 | PILLAR SPOT | Gunmetal spotlight on the driver's A-pillar with a red lens that flashes while searching. | The A-pillar spotlight is the patrol car's search tool. |
| ENIGMA | 1 | CAB CAM | Black camera bar at the cab windscreen top: white lens, dark pupil. | A delivery van creeps along the kerb lane; the cab camera watches it. |
| ENIGMA | 2 | WING EYES | Blue-grey lens filling each big van mirror, with a dark housing row under it. | Vans have huge blind spots; their big mirrors carry the side sensors. |
| ENIGMA | 3 | DOCK LIDAR | Violet-ringed puck on a gunmetal cross-bar across the box roof, with a white tick orbiting the ring. | It maps loading docks for the drop; now it maps you. |
| ENIGMA | 4 | TRACKER | Low black telematics box on the rear roof with a mint LED strip. | Every white-glove parcel is tracked; the tracker now hears the street cameras. |
| ENIGMA | 5 | KERB RADAR | Orange sensor strip across the black bumper, split into five-pixel lamps. | A delivery van stops at kerbs all day; it reads what lies there. |
| ENIGMA | 6 | MANIFEST | Black board on the box header above the cab with three red lamps, one lit per crash spot. | A van logs every drop; now it logs every crash spot too. |
| ENIGMA | 7 | DOOR LAMP | Gunmetal work lamp on the cab roof front, red lens facing forward, flashing while searching. | It finds door numbers in the dark; now it finds you. |

**Model line:** Panel top left in label ink #7FA8BC: 'SED-01-001 · LUMINARY™ · AMBASSADOR' (POL-01-001 · VANGUARD™ · MARSHAL; VAN-01-001 · ENIGMA™ · CONCIERGE). The car's rear plate repeats the in-level tag (S01 / P01 / V01) in tagFill/tagInk.

## Risks

- piece() detects 'alone' with !g.get(cx, Y0+L/2). If g.get returns a non-falsy value for an empty pixel, falling parts lose their rim. The host can pass o.alone explicitly.
- piece() calls g.rim only when alone. If the host composites the falling part over the body from that buffer, its rim draws over the body. That is intended for readability.
- 1-px features below the 3x read threshold: the VANGUARD whip, its REC dot, and the LUMINARY mascot column. Check them in the round-2 renders.
- ENIGMA is 112 rows (336 screen px, 74% of the hero column), above two thirds; the van's extrusion of 12 drives that.
- Slot moves: VANGUARD 7 goes to the driver's A-pillar (the light bar takes the roof front); VANGUARD 5 goes onto the push bar ahead of the bumper; ENIGMA 6 goes to the box header (the van bonnet is 8 rows); LUMINARY 4 overlaps the first row of rear glass (the fin sits on the roof's rear edge).
- Rung 3 on LUMINARY (glass core) and ENIGMA (dark core with cross-bar) share the ring form. At 3x the difference is the cross-bar and the core colour.
- g.red is used when present, otherwise the local copy of redSprite's formula; outputs match only if g.red takes a '#rrggbb' fleet colour.
- Light-bar and strobe blinking runs on o.t (2 Hz). If the host pins t for screenshots, every capture shows one phase.

## Round 2 review

**Verdict:** The three bodies match the level's family: red top face, grey rear face, 1-px rim, stair-stepped glass and the corner lights. The parts break in four places: on LUMINARY the dome and the fin merge into one shape, ENIGMA's camera and lamp stack into one black block, VANGUARD's lidar barely shows its violet, and ENIGMA's ribs turn the box into a black-striped grille.

| Id | Severity | Shots | What | Fix |
|---|---|---|---|---|
| D1 | major | prev_upgrade_C2_3, prev_sheet_LUMINARY | LUMINARY rung 3 HALO DOME (centre ty 58, ink rows 53–63) and rung 4 SHARK FIN (ink rows 64–73) have touching ink rings. At 3x they read as one black keyhole hanging from the dome. The fin's base also covers the first row of rear glass (ty 72). | Move the dome to ty 57 (ink 52–62). Shorten the fin to ty 65–70 (ink 64–71) so it ends on the roof's last row. Shrink rung 7 SUNROOF LAMP to r2 (ink 44–50). That leaves red gap rows 42–43, 51 and 63 between rungs 1, 7, 3 and 4. |
| D2 | major | prev_sheet_ENIGMA | ENIGMA rung 1 CAB CAM ink (rows 23–27) and rung 7 DOOR LAMP ink (rows 28–32) sit on the centre column and touch. At rung 7 they form one 7×10 black block, so neither part reads. | Move DOOR LAMP to the left (kerb-side) corner of the cab roof: 6×3 gunmetal at v 11–16, ty 30–32, with a 4-px red lens on its front row. Its slot moves; the reason is that a door lamp lights the kerb side. |
| D3 | major | prev_sheet_ENIGMA, prev_sheet_ENIGMA 1x | ENIGMA box ribs in pod2 every 6 rows (ty 40…94, 10 lines) turn the cargo roof into a black-and-red shutter. The level's van shows 3–4 sparse roof lines. The DOCK LIDAR cross-bar and the TRACKER get lost among the stripes. | Draw three ribs only, at ty 44, 66 and 88, v ≤ 19. They clear the lidar (53–63), the tracker (81–86) and the tail lamps (v ≥ 21). |
| D4 | major | prev_sheet_VANGUARD | VANGUARD rung 3 SPEED LIDAR is a 9×9 pod3 block with a single 1-px violet diagonal. At 3x it reads as a black 'no entry' disc, and the rung's violet is 7 px in total. Its corners are chamfered by a single pixel only. | Make it an octagon (|dx|+|dy| ≤ 6, a 2-step chamfer) with a 1-px #c3a6ff ring and a pod3 core. Keep a 5-px violet bar rotating inside the core in four 45° steps. |
| D5 | major | prev_sheet_VANGUARD | VANGUARD rung 6 CASE FILE has three 3×6 red bars in a 13×8 black box. They repeat the light bar's red lamps and the grille strobes, so at 3x and at 1x the bonnet reads as a second light bar. It does not read as a clipboard. | Make it a clipboard: an 11×8 podBody board at ty 12–19, a chrome clip 5×2 at ty 11–12 with a chromeL top, and three 7×1 horizontal tally lines at ty 14, 16 and 18 (red when lit, tail when not). |
| D6 | major | prev_sheet_LUMINARY, prev_upgrade_A1_3 | LUMINARY rung 5 PARK RADAR is 27 px wide (v ≤ 13 plus ink to v 14). Its ink ring covers the inner corners of both headlights (ty 2–5, v 11–14). | Narrow the strip to v ≤ 9 (19 px, ink to v 10) with four 2×2 orange dots at v 2–3 and 6–7. The headlights stay whole. |
| D7 | minor | prev_sheet_LUMINARY | The mascot has chromeD side pixels at ty 12 (v 1) under its column. At 3x it reads as a stray '+' under the grille, and at 1x as noise. | Draw the mascot as one column at ty 10–11 (chromeL, chrome), with no side pixels. |
| D8 | minor | prev_sheet_LUMINARY, prev_upgrade_A1_0_6 | The 15×8 sunroof is flat glass with no glint, so at rung 0 it reads as a hole in the roof rather than glass. | Move the sunroof to ty 43–50 and give it the same 2-px 45° glint at its top right (s 4–7, rows 43–45) as the other glass bands. |
| D9 | minor | prev_upgrade_A1_3, prev_upgrade_C2_3 | The panel prints 'SED-01-001 · AMBASSADOR'. The class name is missing from the model line. | Add classes[cls].label = 'SED-01-001 · LUMINARY™ · AMBASSADOR' (and the same for POL and VAN) for the host to print verbatim. |

**Fixed in its module:** D1, D2, D3, D4, D5, D6, D7, D8, D9

## Round 3 review

**Verdict:** The bodies still read as the level's learner sedan seen closer, and the round-2 collisions are gone, but five problems remain: VANGUARD's lidar looks like a 'no entry' sign, LUMINARY's dome sweep looks like a letter n, VANGUARD's pillar spot breaks the silhouette, the sunroof merges into the windscreen, and the host still prints the model line without the class name.

| Id | Severity | Shots | What | Fix |
|---|---|---|---|---|
| E1 | major | prev_sheet_VANGUARD | On SPEED LIDAR, the violet bar crosses the octagon from edge to edge, so at 3x and 1x the turret reads as ⊘, a prohibition sign, not a scanner. | Draw a radius instead: a podHi centre pixel and a 3-px violet hand from the centre to the ring. The hand turns in eight 45° steps from a direction table (no rounded trig), so diagonals stay clean stair-steps. |
| E2 | major | prev_upgrade_C2_3, prev_sheet_LUMINARY | In HALO DOME, the 2-px sweep starts at the centre of a 21-px glass core inside a 2-px ring. At 3x it joins the ring and reads as '∩' or 'n' (C2_3 at 450,377). | Thin the ring to 1 px (disc r4 lim 20 minus a glass core r3 lim 12). Light the centre pixel in glint and draw a 2-px violet hand at radius 1–2 in eight steps, so it no longer touches the ring. |
| E3 | major | prev_sheet_VANGUARD | PILLAR SPOT is centred at v 20, ty 38. Its ink reaches v 23, the body's outermost column, so the red lamp bulges past the left flank at rung 7 (sheet 445,188). | Centre it at v 19, ty 37. The ink then ends at v 22, leaving the v 23 red column and the rim whole. It clears the mirror (v ≥ 24) and the dash cam (v ≤ 5). |
| E4 | major | prev_upgrade_A1_0_6, prev_upgrade_A1_3, prev_upgrade_C2_3 | The panel still prints 'SED-01-001 · AMBASSADOR'. The host builds the line from model and callsign and ignores classes[cls].label. | Host side: print classes[cls].label verbatim. The module keeps label. This cannot be fixed inside the module, so it is not listed as fixed. |
| E5 | minor | prev_upgrade_A1_3, prev_upgrade_A1_0_6 | Only one red row (ty 42) separates the sunroof (ty 43–50) from the windscreen (ty 30–41). At 3x the two glass areas read as one keyhole-shaped windscreen. | Move the sunroof to ty 45–51, leaving three red rows (42–44). Move the SUNROOF LAMP to ty 48 (ink 45–51), the dome to ty 58 (ink 53–63), and the fin to ty 66–70 (ink 65–71). That leaves red gap rows 52 and 64. |
| E6 | minor | prev_sheet_LUMINARY | The 2-row PARK RADAR (ty 1–2) has ink at ty 3, touching the grille's chrome frame at ty 4. At rung 7 the radar and the grille merge into one dark block on the nose. | Make it a 1-row strip at ty 1 (ink ty 0 and 2) with 2×1 orange dots at v 2–3 and 6–7. Row ty 3 stays red. |
| E7 | minor | prev_upgrade_A1_3 | The 2-px mascot column under the grille (ty 10–11) reads at 3x as a drip below the grille (450,236). At 1x it is a stray dot. | Remove the mascot. The chrome grille and the chrome trim rows carry the executive look. |
| E8 | minor | prev_sheet_VANGUARD | The RADIO MAST mint light is 3 px. Its 5-px whip runs onto the rear glass (ty 68–69), and with its 3-wide ink it reads as a pin pushed into the window. | Widen the base to 7×3 with a 5×1 mint strip. Cut the whip to 2 px (ty 65–66), so its ink ends at ty 67 on the roof. |
| E9 | minor | prev_sheet_ENIGMA | The rear-door handles (v 2, r 3) and hinges (v 21, r 1 and r 6) are single chromeD pixels. At 1x they are noise. | Make the handles 1×2 (r 3–4) and the hinges 2×1 (v 20–21). |

**Fixed in its module:** E1, E2, E3, E5, E6, E7, E8, E9

## Round 4 review

**Verdict:** The round-3 fixes hold: the sunroof is separate from the windscreen, the pillar spot stays inside the flank, the lidar hands are radii and the host now prints the full model line. Two problems remain in the module: LUMINARY's shark fin sits on the rear glass, and ENIGMA's lidar tick still uses rounded trig. One host problem remains: at 0.6 s the drone covers the model line.

| Id | Severity | Shots | What | Fix |
|---|---|---|---|---|
| F1 | major | prev_upgrade_C2_3, prev_sheet_LUMINARY | The SHARK FIN body runs from ty 66 to 70, so its ink ring reaches ty 71. That #05070B ink lies directly on the rear glass, which starts at ty 72. There is no red row between them. At 3x the fin and the glass merge, so the fin reads as a black drop sitting on the window (C2_3 at 450,410; sheet rung 7 at 491,265). | Cut the fin to 4 rows. Tip pixel at ty 66, a 3-px row at 67, 5-px rows at 68–69, and a mint spine at ty 67–69. The ink then runs from ty 65 to 70. Row 71 stays red above the glass, and rows 64 and 65 stay red below the dome ink, which ends at 63. |
| F2 | minor | prev_sheet_ENIGMA | The DOCK LIDAR tick is still placed with Math.round(3·cos), (3·sin). At diagonal angles it lands off the clean grid, and it turns at a different rate and step from the VANGUARD and LUMINARY hands (E1, E2). | Use the DIR8 table at 8 steps a second. The tick sits at radius 3 on the axes and at (±2, ±2) on the diagonals. Every one of those pixels lies in the ring band (r² between 7 and 20), never in the r²≤6 core. |
| F3 | minor | prev_upgrade_A1_0_6, prev_upgrade_C2_0_6 | At 0.6 s the drone (420–480, 108–170) covers the model line 'SED-01-001 · LUMINARY™ · AMBASSADOR' at y 105. | Host side: start the drone's path below y 130, or draw the model line after the drone. The module cannot fix this, so it is not listed as fixed. |

**Fixed in its module:** F1, F2

Rounds 1-3: $3.94 (one run); round 4: resumed.
