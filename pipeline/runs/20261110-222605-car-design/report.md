# Car design agent: the hero cars

**Today's hero:** The previous module's three cars (prev_sheet_LUMINARY, prev_sheet_VANGUARD, prev_sheet_ENIGMA) look like the level's cars: they have a 1-px rim, an extruded rear face, stepped glass bands and corner head and tail lights. But all three are the same flat learner red (#F1544C top, #FB5E54 roof), so they differ only by outline. The ENIGMA van is dropped. Several part names are generic gear labels (DASH CAM, PARK RADAR, SHARK FIN, PLATE READER, CAB CAM), not this car's trade language.

## Style rules

- Projection as carSprite: nose up, one footprint. The top face is the footprint lifted by the extrusion E. The rear face shows below it: the class side tone, with its bottom row in the class side2 tone. Side faces never show. Where the footprint narrows (GENESIS's front-wing trailing edge), the same rule shows a rear-face wedge behind it.
- The top-face row directly above any rear-face pixel is the class line tone. It is the fold line, and it follows rounded corners and wing steps.
- Outside ring: g.rim(#8FDFFF, #3A4A66). It is lit where the edge faces up or right. No black edge on dark ground.
- Body tones come from the class ramp, not redSprite. Each class has its own roof, spec, top, shade, crease, deep, line, side and side2 tones. Glass #0E3A4F, glint #7FF0FF, head #CFF6FF, tail #7A2424/warn #FF3D3D and chrome keep the level's values.
- Metallic is a ramp: a hard 2-row spec band across each panel (bonnet, roof, boot), a cool shade on the outer column and on the panel's far end, and a darker crease line. It is not a flat grey.
- Glass is flat bands that stair-step 1 px every 4 rows (rear glass on GENESIS: every 2 rows). Each pane has one 2-px 45° glint at its top right, because the light comes from the top right.
- Headlights are #CFF6FF blocks in the front corners, clipped by the nose curve. Tail lights are #7A2424 blocks in the rear corners and turn #FF3D3D when braking.
- Inner details have no outline. Parts get a 1-px #05070B ink ring (4-neighbour) and a dark housing (podBody, pod3, chromeD). That ring lets white parts read on the white VANGUARD roof, red parts on the GENESIS red, and keeps every part clear of the grey LUMINARY.
- Scale: about 4 hero px for each in-level px. The plate is 15×7 with 3×5 glyphs, the same font as the in-level roof tag.
- Each car is symmetric about one centre column (odd W). Asymmetry appears only where the job needs it: police strobes and light bar blue left and red right, the driver's A-pillar spot, specular pixels on the right.

## Classes

| Class | Model | Silhouette | Details | Buffer |
|---|---|---|---|---|
| LUMINARY | SED-01-001 | Stretched executive sedan, footprint 45×96 (ratio 2.13). Soft corners (r9 front, r8 rear), long bonnet, long roof, long boot. 4×6 mirror caps. Extrusion 8, so the car stands tall. | Chrome grille 11×6: chromeD frame, slats alternating chrome and chromeL; Hard spec bands at bonnet rows 11–12, roof rows 43–44 and boot rows 82–83, broken by the crease lines; Bonnet creases at v=±9; a cool shade at the bonnet's rear (rows 23–28) and on the outer column; chromeL trim under the windscreen (row 29) and the rear glass (row 80); chromeL bar between the tail lights; Glass sunroof 15×7; a drip rail in crease at v=±17; Rear face: chromeL bumper strip and the blue S01 plate | [57, 108] |
| VANGUARD | POL-01-001 | Wider, shorter pursuit sedan, footprint 47×90, r7 corners. A gunmetal push bar 27 px wide sits 5 rows ahead of the nose. 5×7 mirrors and a light bar across the roof front. Extrusion 8. | Light bar rows 41–44 on the white roof: podBody frame, 4-px lamps. Blue on the left and red on the right alternate at 2 Hz; Black grille in a chrome frame, with blue and red hidden strobes in phase with the bar; Chequer bands at the cowl and above the boot (the Sillitoe police chequer); Black mirror caps; chrome rear bumper strip; P01 plate | [59, 107] |
| GENESIS | SPT-01-001 | Mid-engined racer, footprint 51×98, the widest and lowest (extrusion 6). Wedge nose (29 px wide at row 0, 49 at row 12) over a carbon splitter 31 px wide. Front wings to v=24, a Coke-bottle waist at v=20 (rows 31–60) and rear haunches to v=25. Short cockpit, louvred engine cover, and a 55-px carbon rear wing at rows 82–88 that overhangs the haunches. Mirror pods sit on the waist at rows 38–41. | Low mouth grille (rows 1–4, v≤9) with podBody and pod3 mesh rows; slanted stair-step slit headlights; Twin bonnet louvre vents at v=9..12, rows 14–21; A dark-red rear-face wedge behind each front wing, made by the footprint step: depth from projection, not paint; Side intakes on the haunch leading edge (rows 61–70): pod3 slot with a podBody inner edge; Engine-cover louvres every 3 rows at v=6..10; Carbon wing: lit chrome leading row, podBody chord, red endplates with a spec top. The blue R01 plate sits in the wing centre (the rear face is too shallow for it); Slanted tail-light strips and a centre rain light; diffuser fins on the rear face | [63, 108] |

## Kit by class

| Class | Rung | Part | Look | Why |
|---|---|---|---|---|
| LUMINARY | 1 | OUTLOOK | Chrome-cased lens bar at the windscreen top: white lens with a dark pupil. | The board wants no surprises on the road ahead. |
| LUMINARY | 2 | WINGMEN | Blue-grey sensor lens in each mirror cap, with a chromeL spec pixel at its top right. | A CEO never walks alone; the mirrors watch both flanks. |
| LUMINARY | 3 | OVERSIGHT | Flush glass dome mid-roof: violet ring, glass core, a hand turning in eight steps. | The board sees everything from above, flush and discreet. |
| LUMINARY | 4 | INSIDER TIP | Dark shark-fin aerial at the roof's rear edge with a mint link strip down its spine. | Contacts on the street tip the chauffeur off. |
| LUMINARY | 5 | RED TAPE | Dark strip across the front bumper with four orange parking-sensor lamps. | Cones and barrier tape now stop it, like any procedure. |
| LUMINARY | 6 | AUDIT TRAIL | Chrome-topped plate on the bonnet with three red lamps, one lit per remembered crash spot. | Every incident leaves a trail the board can check. |
| LUMINARY | 7 | LIMELIGHT | Round gunmetal lamp risen through the sunroof; its red lens flashes while it searches. | The chauffeur never steps out; the spotlight looks instead. |
| VANGUARD | 1 | EYEWITNESS | Black dash-cam box at the windscreen top: white lens, dark pupil, a REC dot blinking at 1 Hz. | A patrol car records the road ahead as evidence. |
| VANGUARD | 2 | OUTRIDERS | Black pod on each mirror with blue-grey lenses facing forward and back. | Escort riders guard a convoy's flanks; these pods do now. |
| VANGUARD | 3 | AIR SUPPORT | Octagonal roof turret on the white roof: violet ring, dark core, a radar hand turning. | Police call the helicopter for a view from above. |
| VANGUARD | 4 | ALL POINTS | Black aerial base on the rear roof with a mint link light and a chrome whip. | An all-points bulletin puts every camera on the lookout. |
| VANGUARD | 5 | ROADBLOCK | Orange sensor slit along the push bar, split into lamps by dark gaps. | Police know a roadblock when they see one: they stop. |
| VANGUARD | 6 | RAP SHEET | Gunmetal clipboard on the black bonnet: a white sheet with three red lines, one per crash spot. | Every offence goes on the record; so does every crash. |
| VANGUARD | 7 | MANHUNT | Gunmetal spotlight on the driver's A-pillar; its red lens flashes while it searches. | The search starts where the suspect was last seen. |
| GENESIS | 1 | RACING LINE | Onboard camera bar at the windscreen top: white lens, dark pupil. | A racer owns its line; anything on it gets seen. |
| GENESIS | 2 | SPOTTER | Blue-grey lens in each mirror pod, with a chromeL spec pixel. | A spotter calls every car alongside; these lenses do too. |
| GENESIS | 3 | ROLL HOOP | Carbon airbox behind the cockpit with an intake slot and a violet lidar ring turning on top. | The roll hoop carries the high camera; this one scans all round. |
| GENESIS | 4 | PIT WALL | Telemetry aerial on the engine cover: a carbon base, a mint link strip and a chrome whip. | The pit wall watches every screen and radios the driver. |
| GENESIS | 5 | YELLOW FLAG | Orange LED strip across the splitter lip, split into four-pixel lamps. | Drivers slow for debris under a yellow flag. |
| GENESIS | 6 | PACE NOTES | Carbon tablet on the bonnet between the vents, with three red lamps, one lit per crash spot. | Rally crews note every bad corner and lift there. |
| GENESIS | 7 | RECON LAP | Gunmetal spot lamp on the roof front; its red lens flashes while it searches. | Drivers lap slowly before the race to scout the track. |

**Model line:** Panel top left in label ink #7FA8BC: 'SED-01-001 · LUMINARY™ · AMBASSADOR' (POL-01-001 · VANGUARD™ · MARSHAL; SPT-01-001 · GENESIS™ · AURUM). The car repeats the in-level tag in tagFill/tagInk: S01 and P01 on the rear-face plate, R01 on the rear wing.

## Risks

- Untested: the browser was not available in round 1, so no render or syntax run was made. Round 2 must confirm the module loads and every class draws.
- VANGUARD in level: the black top #3A4252 and faces #2C3240 sit close to road2 #272C38. The car reads through its white roof, light bar and cyan rim. Check the in-level crop; if it sinks, lift the top to #4A5468.
- livery() keeps a pixel when b−r>40 (head, rims, crown blue) or r−g>100 (warn). Every other light pixel is mapped by lightness k: ≥0.93 roof, ≥0.80 top, ≥0.53 side, ≥0.445 line, else side2. fleetSide and fleetLine are now recoloured too, unlike redSprite, so the rear face matches the livery.
- Slot moves on GENESIS: rung 4 sits on the engine cover (the car has no rear roof); rung 5 sits on the splitter lip ahead of the nose (row Y0−2); the R01 plate sits on the wing, because the rear face is only 6 rows deep.
- GENESIS roof is 16 rows. Rung 7 (rows 41–45) and rung 3 (rows 47–55) share ink row 46; rung 1's ink row 40 touches rung 7's. The parts themselves do not overlap.
- Part-name width: RACING LINE, YELLOW FLAG, AIR SUPPORT, INSIDER TIP and AUDIT TRAIL are 11 characters, roughly 360 px at 48 px Nunito 900. Check them against the 380-px text column.
- 1-px features below the 3x read threshold: the VANGUARD and GENESIS whips, the REC dot, the mirror spec pixels.
- VANGUARD chequer rows (24–25, 76–77) run the full width and touch the rim; check for buzz at 1x.
- Light-bar and strobe blinking run on o.t at 2 Hz. If the host pins t for screenshots, every capture shows one phase.

## Round 2 review

**Verdict:** All three cars belong to the level's family: 1-px cyan rim, extruded rear face, stepped glass and corner lamps. But the LUMINARY grey is so pale that it reads as a white fleet car in level and as banded trim on the hero. The mirror parts read as tiny 'e' rings. Four parts are 1-row slivers or mushroom stubs. The GENESIS cockpit stacks three parts into one black column.

| Id | Severity | Shots | What | Fix |
|---|---|---|---|---|
| D1 | major | prev_sheet_LUMINARY, prev_upgrade_A1_3, prev_upgrade_C2_3 | In level, the LUMINARY livery is roof #C8D1DB over top #949FAD. At 4x and in the training clip the sedan reads near-white, the same family as fleet #DDE6EE/#F4F8FB, so the learner does not stand out from the white fleet. The hero uses the same pale ramp, so the CEO car looks like an appliance next to the red GENESIS. | Gunmetal ramp, used for hero and level alike: roof #AEB8C5, top #808B9B, shade #687383, crease #58626F, line #3E4756, side #4E5868, side2 #323946. Top lightness drops from ~158 to ~135, and the roof from ~208 to ~182, well under the fleet's 228+. |
| D2 | major | prev_sheet_LUMINARY, prev_upgrade_A1_3 | Metallic does not read. The 2-row spec bands at ty 11–12, 43–44 and 82–83 run full width and match the chromeL trims at ty 29, 80 and 92. The car shows six parallel white stripes that read as seams, not sheen. | Replace each horizontal spec band with a 45° stair-stepped sheen falling from top right to bottom left. It is 3 px wide, with a 1-px parallel line 5 px further right, on the bonnet (from ty 7), roof (from ty 42) and boot (from ty 81). The chrome trims stay horizontal, so sheen and trim now differ in angle. The cowl shade shrinks from ty 23–28 to ty 25–28. |
| D3 | major | prev_sheet_LUMINARY, prev_sheet_VANGUARD, prev_sheet_GENESIS, prev_upgrade_C2_1_15 | Rung 2 is a 2×3 or 3×2 #7fa8bc lens set straight on the mirror cap. Its ink ring eats the cap, so each mirror reads as a black 'e' or 'o' ring with no housing. On LUMINARY the #7fa8bc lens is close to the grey body. | Shared mirrorPod: a podBody housing the size of the cap, with a 2-px-wide rung-2 lens inside and a chromeL spec pixel at the lens's top right. LUMINARY: 4×6 with a 2×4 lens. VANGUARD: 5×7 with two 2×2 lenses, fore and aft. GENESIS: 5×4 with a 2×2 lens. LUMINARY W 57→59 and VANGUARD W 59→61 give room for the outer ink and rim, which were clipped at x=0. |
| D4 | major | prev_sheet_GENESIS | At rung 7 the GENESIS centre line stacks the camera (ty 37–39), the RECON LAP lamp (41–45) and the 9×9 airbox (47–55). The inks touch, so the three read as one black totem over the cockpit. | Move rung 7 to the bonnet front as a rally spot lamp: a chromeD housing r3 at ty 9 and a red lens r2, ink rows ty 5–13, clear of the grille (0–4) and PACE NOTES (14–20). The slot change is justified: rally cars carry their search lamps on the bonnet. The cockpit then holds only the camera and the airbox. |
| D5 | major | prev_sheet_LUMINARY, prev_sheet_VANGUARD, prev_sheet_GENESIS | Rung 5 is a 1-row strip on all three cars (LUMINARY 19×1 at ty 1, VANGUARD 17×1 at ty −4, GENESIS 25×1 at ty −2). At 3x it reads as a dashed orange hairline, the weakest part on every car. | Make it 2 rows. LUMINARY: a 21×2 podBody strip at ty 0–1 with four 3×2 orange lamps. VANGUARD: 21×2 on the push bar, rows −4 and −3, with podBody gaps every 5 px. GENESIS: 27×2 over the splitter, rows −2 and −1, with gaps every 5 px. |
| D6 | minor | prev_sheet_VANGUARD, prev_sheet_GENESIS | Rung 4 on VANGUARD and GENESIS is a 7×3 base with a 1×2 chromeL whip trailing behind it. The whip is invisible on the white roof, and the whole shape reads as a downward arrow or mushroom with a stray tail. | Drop the whip. A 7×4 podBody base with a 5×2 mint link lamp. |
| D7 | minor | prev_sheet_LUMINARY, prev_upgrade_C2_3 | The LUMINARY shark fin is 5×4 (ty 66–69). At 3x it reads as a dark spade, and its 1-px mint column is lost. | A 7-wide, 7-tall stepped fin (rows 1/3/5/5/7/7/7 px) at ty 64–70. Mint 1×2 up the spine and a 3×2 mint block at its base. |
| D8 | minor | prev_sheet_LUMINARY | The LIMELIGHT lamp is a chromeD r2 disc with a 5-px lens. It sits on the sunroof's glint and reads as a dot, not the CEO car's showpiece. | A chromeD housing r3 (lim 10) with a lens r2 (lim 4) and an ink glint at (+1, −1). Still at ty 48. Its ink row 52 clears the OVERSIGHT ink row 53. |
| D9 | minor | prev_sheet_GENESIS | The GENESIS tail lights, #7A2424 on #D8262C, merge into the shade at the bottom corners and read as dirt, not lamps. | Frame each tail block with a podBody top row and inner column, so it reads as a lamp housing on red. Braking still swaps to warn. |
| D10 | minor | prev_sheet_VANGUARD | In level, the VANGUARD top #3A4252 against road2 #272C38 holds only by its rim at 1x. | Lift the in-level top to #424B5E. The hero stays as it is. |
| D11 | minor | prev_sheet_LUMINARY, prev_sheet_GENESIS | Two names miss the brief. WINGMEN is dating and aviation slang, not a chauffeur's word. ROLL HOOP names where the part sits, not what it does. | LUMINARY 2: ENTOURAGE (a CEO's people flank them on both sides). GENESIS 3: BLIMP (race TV gets the overhead view from the blimp; this part sees from above). Both are unique across classes and under 14 characters. |

## Round 3 review

**Verdict:** Round 2 fixed the livery and the metallic finish. LUMINARY now reads gunmetal in level, clearly darker than the white fleet; VANGUARD reads panda; GENESIS reads race red. The remaining faults are part layout: on two cars the fitted parts stack into one touching column, one lamp is too small, and the plate font misreads.

| Id | Severity | Shots | What | Fix |
|---|---|---|---|---|
| D1 | major | prev_sheet_LUMINARY, prev_upgrade_C2_1_15, prev_upgrade_C2_3 | At rung 7 the LUMINARY centre column is one dark chain from ty 37 to 71. It runs OUTLOOK (ink 37–41), then LIMELIGHT (ink 44–52), OVERSIGHT (ink 53–63) and the INSIDER TIP fin (ink 63–71). The dome and fin share ink row 63, and the lamp's ink row 52 touches the dome's row 53. On the sheet at 3x the four parts read as one totem: a red cross over a violet ring over a black spade. GENESIS had the same fault in round 2 (its D4). | Move LIMELIGHT off the centre line to the roof's kerb side at (cx+12, ty 48): it covers v 9–15 and its ink v 8–16, inside the crease at v=17 and clear of the sunroof (v≤7). Move the OVERSIGHT dome up to ty 57 (ink 52–62). Move the fin down to ty 65–71 (ink 64–72). This leaves a body row at ty 63 between dome and fin. |
| D2 | major | prev_sheet_GENESIS | The rung-7 GENESIS rally lamp at ty 9 has its ink at rows 5–13. Row 5 touches the grille (rows 0–4) and row 13 touches PACE NOTES (ink 14–20). The nose reads as grille, red cross and red-lamp tablet fused into one black block between the louvres. | Move the lamp to ty 10 (ink 6–14), which leaves row 5 as body below the grille. Move PACE NOTES to the cowl, behind the louvres (they end at row 21): a 13×4 carbon tablet at ty 23–26 with a chromeD bottom row and three 3×2 lamps. Its ink runs rows 22–27 and v≤7; row 28 stays body before the deep cowl line at 29. |
| D3 | minor | prev_sheet_VANGUARD | MANHUNT is an r2 disc with a 3-px lens at (cx−19, ty 37). On the sheet it is the smallest part, a red dot under the left mirror pod, much weaker than the other rung-7 lamps (r3 with a 5-px lens). | Use the shared spotLamp (r3 housing, r2 lens) at (cx−18, ty 36). Ink spans rows 32–40 and v 14–22: clear of the light bar (41+), the dash-cam ink (v≤5) and the mirror pod's ink column v=23. |
| D4 | minor | prev_sheet_LUMINARY, prev_upgrade_A1_3 | The 3×5 S glyph (111/100/111/001/111) is the 5 glyph, so the plate reads '501' instead of S01. | Change the S glyph to 011/100/010/001/110. |
| D5 | minor | prev_sheet_GENESIS | The BLIMP airbox's ink row (ty 56) lies on the rear glass's top row (56). The airbox and the glass merge into one black mass behind the cockpit. | Move the airbox up 1 row: ty 46–54, ring at ty 51, ink 45–55. Its ink still clears the camera (ink ends at 40), and row 55 stays roof. |

## Round 4 review

**Verdict:** Round 3 fixed the D1 to D5 stacks that were reported. Two parts still sit with their ink rows on dark glass, so they merge with it: on LUMINARY the sunroof fuses with the OVERSIGHT dome and touches LIMELIGHT, and the INSIDER TIP fin merges with the rear glass; on GENESIS the BLIMP airbox merges with the rear glass. The LUMINARY roof also breaks into two tones behind the dome.

| Id | Severity | Shots | What | Fix |
|---|---|---|---|---|
| D1 | major | prev_upgrade_C2_3, prev_upgrade_C2_1_15, prev_sheet_LUMINARY | The LUMINARY sunroof is glass #0E3A4F at ty 45–51, v≤7. The OVERSIGHT dome's ink starts at ty 52, directly under the last glass row. In C2_3 the sunroof slab, dome ink and violet ring read as one dark block under the lens bar. At rung 7 the LIMELIGHT ink sits at v=8, so it touches the sunroof's right edge at ty 45–51. On the sheet the red lamp looks stuck to the glass. | Shrink the sunroof and move it forward: ty 43–48, v≤6, glint from ty 43. Move the dome up to ty 56 (ring rows 52–60, ink 51–61). Body rows 49–50 now separate the sunroof from the dome ink, and column v=7 separates it from the LIMELIGHT ink (v 8–16). |
| D2 | minor | prev_upgrade_C2_3, prev_sheet_LUMINARY | The INSIDER TIP fin spans ty 65–71, so its bottom ink row is ty 72, the first row of the rear glass. The fin's base dissolves into the glass, and at 3x the black spade looks like it grows out of the rear window. | Move the fin up 1 row: ty 64–70 (ink 63–71). Row 62 stays body between the dome ink (to 61) and the fin ink. Row 71 stays body above the glass. |
| D3 | minor | prev_sheet_GENESIS | The BLIMP airbox spans ty 46–54, so its ink at ty 55 sits on the last roof row, against the rear glass at ty 56. At rung 3 and rung 7 the airbox's bottom and the rear glass join into one black band behind the cockpit. The fix for last round's D5 moved the box up 1 row, which was not enough. | Shorten the airbox to 8 rows: ty 46–53, intake slot 1 row at ty 46, lidar ring centred at ty 50 (rows 47–53). Its ink runs ty 45–54, which leaves ty 55 as red roof above the glass. |
| D4 | minor | prev_upgrade_C2_3, prev_sheet_LUMINARY | The LUMINARY roof centre (v≤16) switches from roof #AEB8C5 to top #808B9B at ty 64. The rear 8 roof rows read as a second dark panel, a band behind the dome that looks like a separate sunroof shadow. The sheen also stops at ty 63, which makes a hard horizontal cut. | Keep the roof tone to ty 69 with the sheen running to there. Use the cool shade #687383 only on ty 70–71 as the roof's rear drop, a 2-row edge that matches the shaded bonnet rear (ty 25–28). |

Cost: $0.94
