# Round 3: review and fix

Review the renders of your module from round 2 as if someone else drew them, then return the corrected module (round 2+ output).

# The brief (the user, verbatim)

how about for new colour scheme- grey-metallic car luminary, then white and black vanguard police car, then instead of enigma can we do 'genesis' which is a racing car, red car. So they are all 'higher class' cars too. as it progresses. Try a bit smarter with the upgrade names, befitting the function.

# Your round 1 spec

```json
{
 "verdict_current": "The previous module's three cars (prev_sheet_LUMINARY, prev_sheet_VANGUARD, prev_sheet_ENIGMA) look like the level's cars: they have a 1-px rim, an extruded rear face, stepped glass bands and corner head and tail lights. But all three are the same flat learner red (#F1544C top, #FB5E54 roof), so they differ only by outline. The ENIGMA van is dropped. Several part names are generic gear labels (DASH CAM, PARK RADAR, SHARK FIN, PLATE READER, CAB CAM), not this car's trade language.",
 "style_rules": [
  "Projection as carSprite: nose up, one footprint. The top face is the footprint lifted by the extrusion E. The rear face shows below it: the class side tone, with its bottom row in the class side2 tone. Side faces never show. Where the footprint narrows (GENESIS's front-wing trailing edge), the same rule shows a rear-face wedge behind it.",
  "The top-face row directly above any rear-face pixel is the class line tone. It is the fold line, and it follows rounded corners and wing steps.",
  "Outside ring: g.rim(#8FDFFF, #3A4A66). It is lit where the edge faces up or right. No black edge on dark ground.",
  "Body tones come from the class ramp, not redSprite. Each class has its own roof, spec, top, shade, crease, deep, line, side and side2 tones. Glass #0E3A4F, glint #7FF0FF, head #CFF6FF, tail #7A2424/warn #FF3D3D and chrome keep the level's values.",
  "Metallic is a ramp: a hard 2-row spec band across each panel (bonnet, roof, boot), a cool shade on the outer column and on the panel's far end, and a darker crease line. It is not a flat grey.",
  "Glass is flat bands that stair-step 1 px every 4 rows (rear glass on GENESIS: every 2 rows). Each pane has one 2-px 45° glint at its top right, because the light comes from the top right.",
  "Headlights are #CFF6FF blocks in the front corners, clipped by the nose curve. Tail lights are #7A2424 blocks in the rear corners and turn #FF3D3D when braking.",
  "Inner details have no outline. Parts get a 1-px #05070B ink ring (4-neighbour) and a dark housing (podBody, pod3, chromeD). That ring lets white parts read on the white VANGUARD roof, red parts on the GENESIS red, and keeps every part clear of the grey LUMINARY.",
  "Scale: about 4 hero px for each in-level px. The plate is 15×7 with 3×5 glyphs, the same font as the in-level roof tag.",
  "Each car is symmetric about one centre column (odd W). Asymmetry appears only where the job needs it: police strobes and light bar blue left and red right, the driver's A-pillar spot, specular pixels on the right."
 ],
 "classes": [
  {
   "class": "LUMINARY",
   "model": "SED-01-001",
   "silhouette": "Stretched executive sedan, footprint 45×96 (ratio 2.13). Soft corners (r9 front, r8 rear), long bonnet, long roof, long boot. 4×6 mirror caps. Extrusion 8, so the car stands tall.",
   "livery": "Grey metallic. Hero ramp: roof #B9C3CE, spec band #E8EEF4, top #949FAD, cool shade #7A8594, crease #66717F, fold line #4A5362, rear face graphite #5C6676 over #3C4452. In level, livery(): roof #C8D1DB, top #949FAD, side #5C6676, line #4A5362, side2 #3C4452. That makes a mid-grey car with a bright roof: darker than the white fleet (#DDE6EE), lighter than the road (#1E222C).",
   "accent": "#E8C67E",
   "details": [
    "Chrome grille 11×6: chromeD frame, slats alternating chrome and chromeL",
    "Hard spec bands at bonnet rows 11–12, roof rows 43–44 and boot rows 82–83, broken by the crease lines",
    "Bonnet creases at v=±9; a cool shade at the bonnet's rear (rows 23–28) and on the outer column",
    "chromeL trim under the windscreen (row 29) and the rear glass (row 80); chromeL bar between the tail lights",
    "Glass sunroof 15×7; a drip rail in crease at v=±17",
    "Rear face: chromeL bumper strip and the blue S01 plate"
   ],
   "buffer": [
    57,
    108
   ]
  },
  {
   "class": "VANGUARD",
   "model": "POL-01-001",
   "silhouette": "Wider, shorter pursuit sedan, footprint 47×90, r7 corners. A gunmetal push bar 27 px wide sits 5 rows ahead of the nose. 5×7 mirrors and a light bar across the roof front. Extrusion 8.",
   "livery": "Panda white and black. Black (charcoal #3A4252, gloss band #5E6A82, shade #2E3544) on the bonnet, boot and rear face (#2C3240 / #1A1E27). White cabin band: roof #F4F8FB and white flanks along the cabin, with an outer column #DDE6EE. A 2-row chequer (2-px squares) marks the band's front and back edges at rows 24–25 and 76–77. In level, livery(): fleetRoof becomes white, fleetTop black, the faces dark. The in-level police sprite then reads as a black car with a white roof, and its light bar keeps its colours.",
   "accent": "#5AA9FF",
   "details": [
    "Light bar rows 41–44 on the white roof: podBody frame, 4-px lamps. Blue on the left and red on the right alternate at 2 Hz",
    "Black grille in a chrome frame, with blue and red hidden strobes in phase with the bar",
    "Chequer bands at the cowl and above the boot (the Sillitoe police chequer)",
    "Black mirror caps; chrome rear bumper strip; P01 plate"
   ],
   "buffer": [
    59,
    107
   ]
  },
  {
   "class": "GENESIS",
   "model": "SPT-01-001",
   "silhouette": "Mid-engined racer, footprint 51×98, the widest and lowest (extrusion 6). Wedge nose (29 px wide at row 0, 49 at row 12) over a carbon splitter 31 px wide. Front wings to v=24, a Coke-bottle waist at v=20 (rows 31–60) and rear haunches to v=25. Short cockpit, louvred engine cover, and a 55-px carbon rear wing at rows 82–88 that overhangs the haunches. Mirror pods sit on the waist at rows 38–41.",
   "livery": "Racing red: roof #EE3A35, spec #FF7A6A, top #D8262C, shade #B21E26, deep #6E1219, fold line #5A1218, rear face #7C1A20 over #4E0E14. Twin white stripes at v=2..4 run nose to tail. In level, livery(): roof #F0403A, top #D8262C, dark-red faces.",
   "accent": "#FF4D3D",
   "details": [
    "Low mouth grille (rows 1–4, v≤9) with podBody and pod3 mesh rows; slanted stair-step slit headlights",
    "Twin bonnet louvre vents at v=9..12, rows 14–21",
    "A dark-red rear-face wedge behind each front wing, made by the footprint step: depth from projection, not paint",
    "Side intakes on the haunch leading edge (rows 61–70): pod3 slot with a podBody inner edge",
    "Engine-cover louvres every 3 rows at v=6..10",
    "Carbon wing: lit chrome leading row, podBody chord, red endplates with a spec top. The blue R01 plate sits in the wing centre (the rear face is too shallow for it)",
    "Slanted tail-light strips and a centre rain light; diffuser fins on the rear face"
   ],
   "buffer": [
    63,
    108
   ]
  }
 ],
 "kit": [
  {
   "class": "LUMINARY",
   "rung": 1,
   "name": "OUTLOOK",
   "look": "Chrome-cased lens bar at the windscreen top: white lens with a dark pupil.",
   "why": "The board wants no surprises on the road ahead."
  },
  {
   "class": "LUMINARY",
   "rung": 2,
   "name": "WINGMEN",
   "look": "Blue-grey sensor lens in each mirror cap, with a chromeL spec pixel at its top right.",
   "why": "A CEO never walks alone; the mirrors watch both flanks."
  },
  {
   "class": "LUMINARY",
   "rung": 3,
   "name": "OVERSIGHT",
   "look": "Flush glass dome mid-roof: violet ring, glass core, a hand turning in eight steps.",
   "why": "The board sees everything from above, flush and discreet."
  },
  {
   "class": "LUMINARY",
   "rung": 4,
   "name": "INSIDER TIP",
   "look": "Dark shark-fin aerial at the roof's rear edge with a mint link strip down its spine.",
   "why": "Contacts on the street tip the chauffeur off."
  },
  {
   "class": "LUMINARY",
   "rung": 5,
   "name": "RED TAPE",
   "look": "Dark strip across the front bumper with four orange parking-sensor lamps.",
   "why": "Cones and barrier tape now stop it, like any procedure."
  },
  {
   "class": "LUMINARY",
   "rung": 6,
   "name": "AUDIT TRAIL",
   "look": "Chrome-topped plate on the bonnet with three red lamps, one lit per remembered crash spot.",
   "why": "Every incident leaves a trail the board can check."
  },
  {
   "class": "LUMINARY",
   "rung": 7,
   "name": "LIMELIGHT",
   "look": "Round gunmetal lamp risen through the sunroof; its red lens flashes while it searches.",
   "why": "The chauffeur never steps out; the spotlight looks instead."
  },
  {
   "class": "VANGUARD",
   "rung": 1,
   "name": "EYEWITNESS",
   "look": "Black dash-cam box at the windscreen top: white lens, dark pupil, a REC dot blinking at 1 Hz.",
   "why": "A patrol car records the road ahead as evidence."
  },
  {
   "class": "VANGUARD",
   "rung": 2,
   "name": "OUTRIDERS",
   "look": "Black pod on each mirror with blue-grey lenses facing forward and back.",
   "why": "Escort riders guard a convoy's flanks; these pods do now."
  },
  {
   "class": "VANGUARD",
   "rung": 3,
   "name": "AIR SUPPORT",
   "look": "Octagonal roof turret on the white roof: violet ring, dark core, a radar hand turning.",
   "why": "Police call the helicopter for a view from above."
  },
  {
   "class": "VANGUARD",
   "rung": 4,
   "name": "ALL POINTS",
   "look": "Black aerial base on the rear roof with a mint link light and a chrome whip.",
   "why": "An all-points bulletin puts every camera on the lookout."
  },
  {
   "class": "VANGUARD",
   "rung": 5,
   "name": "ROADBLOCK",
   "look": "Orange sensor slit along the push bar, split into lamps by dark gaps.",
   "why": "Police know a roadblock when they see one: they stop."
  },
  {
   "class": "VANGUARD",
   "rung": 6,
   "name": "RAP SHEET",
   "look": "Gunmetal clipboard on the black bonnet: a white sheet with three red lines, one per crash spot.",
   "why": "Every offence goes on the record; so does every crash."
  },
  {
   "class": "VANGUARD",
   "rung": 7,
   "name": "MANHUNT",
   "look": "Gunmetal spotlight on the driver's A-pillar; its red lens flashes while it searches.",
   "why": "The search starts where the suspect was last seen."
  },
  {
   "class": "GENESIS",
   "rung": 1,
   "name": "RACING LINE",
   "look": "Onboard camera bar at the windscreen top: white lens, dark pupil.",
   "why": "A racer owns its line; anything on it gets seen."
  },
  {
   "class": "GENESIS",
   "rung": 2,
   "name": "SPOTTER",
   "look": "Blue-grey lens in each mirror pod, with a chromeL spec pixel.",
   "why": "A spotter calls every car alongside; these lenses do too."
  },
  {
   "class": "GENESIS",
   "rung": 3,
   "name": "ROLL HOOP",
   "look": "Carbon airbox behind the cockpit with an intake slot and a violet lidar ring turning on top.",
   "why": "The roll hoop carries the high camera; this one scans all round."
  },
  {
   "class": "GENESIS",
   "rung": 4,
   "name": "PIT WALL",
   "look": "Telemetry aerial on the engine cover: a carbon base, a mint link strip and a chrome whip.",
   "why": "The pit wall watches every screen and radios the driver."
  },
  {
   "class": "GENESIS",
   "rung": 5,
   "name": "YELLOW FLAG",
   "look": "Orange LED strip across the splitter lip, split into four-pixel lamps.",
   "why": "Drivers slow for debris under a yellow flag."
  },
  {
   "class": "GENESIS",
   "rung": 6,
   "name": "PACE NOTES",
   "look": "Carbon tablet on the bonnet between the vents, with three red lamps, one lit per crash spot.",
   "why": "Rally crews note every bad corner and lift there."
  },
  {
   "class": "GENESIS",
   "rung": 7,
   "name": "RECON LAP",
   "look": "Gunmetal spot lamp on the roof front; its red lens flashes while it searches.",
   "why": "Drivers lap slowly before the race to scout the track."
  }
 ],
 "model_line": "Panel top left in label ink #7FA8BC: 'SED-01-001 · LUMINARY™ · AMBASSADOR' (POL-01-001 · VANGUARD™ · MARSHAL; SPT-01-001 · GENESIS™ · AURUM). The car repeats the in-level tag in tagFill/tagInk: S01 and P01 on the rear-face plate, R01 on the rear wing.",
 "sentences": {
  "LUMINARY": {
   "1": "It sees you in its lane and brakes for the board.",
   "2": "Its mirrors now watch the pavements on both sides.",
   "3": "It sees you jump or drop onto its road.",
   "4": "Street cameras tip it off where you hide.",
   "5": "It stops for cones now, instead of swerving round them.",
   "6": "It logs every crash spot and slows there next time.",
   "7": "It stops and shines its lamp where it lost you."
  },
  "VANGUARD": {
   "1": "It brakes when it sees you in its lane.",
   "2": "It watches both pavements as it passes.",
   "3": "It catches you jumping or dropping onto the road.",
   "4": "Every street camera reports you. It knows where you hide.",
   "5": "It stops for cones instead of swerving round them.",
   "6": "It keeps a record of every crash spot and slows there.",
   "7": "It sweeps its spotlight where it last saw you."
  },
  "GENESIS": {
   "1": "It sees you on its line and brakes.",
   "2": "It knows when you are alongside, on either side.",
   "3": "It sees you jump or drop onto the track.",
   "4": "The pit wall reads the street cameras: it knows where you hide.",
   "5": "It slows for cones and debris. No swerving.",
   "6": "It notes every crash spot and brakes there next lap.",
   "7": "It slows and searches where it lost you."
  }
 },
 "risks": [
  "Untested: the browser was not available in round 1, so no render or syntax run was made. Round 2 must confirm the module loads and every class draws.",
  "VANGUARD in level: the black top #3A4252 and faces #2C3240 sit close to road2 #272C38. The car reads through its white roof, light bar and cyan rim. Check the in-level crop; if it sinks, lift the top to #4A5468.",
  "livery() keeps a pixel when b−r>40 (head, rims, crown blue) or r−g>100 (warn). Every other light pixel is mapped by lightness k: ≥0.93 roof, ≥0.80 top, ≥0.53 side, ≥0.445 line, else side2. fleetSide and fleetLine are now recoloured too, unlike redSprite, so the rear face matches the livery.",
  "Slot moves on GENESIS: rung 4 sits on the engine cover (the car has no rear roof); rung 5 sits on the splitter lip ahead of the nose (row Y0−2); the R01 plate sits on the wing, because the rear face is only 6 rows deep.",
  "GENESIS roof is 16 rows. Rung 7 (rows 41–45) and rung 3 (rows 47–55) share ink row 46; rung 1's ink row 40 touches rung 7's. The parts themselves do not overlap.",
  "Part-name width: RACING LINE, YELLOW FLAG, AIR SUPPORT, INSIDER TIP and AUDIT TRAIL are 11 characters, roughly 360 px at 48 px Nunito 900. Check them against the 380-px text column.",
  "1-px features below the 3x read threshold: the VANGUARD and GENESIS whips, the REC dot, the mirror spec pixels.",
  "VANGUARD chequer rows (24–25, 76–77) run the full width and touch the rim; check for buzz at 1x.",
  "Light-bar and strobe blinking run on o.t at 2 Hz. If the host pins t for screenshots, every capture shows one phase."
 ]
}
```

# Your last review

```json
{
 "verdict": "All three cars belong to the level's family: 1-px cyan rim, extruded rear face, stepped glass and corner lamps. But the LUMINARY grey is so pale that it reads as a white fleet car in level and as banded trim on the hero. The mirror parts read as tiny 'e' rings. Four parts are 1-row slivers or mushroom stubs. The GENESIS cockpit stacks three parts into one black column.",
 "findings": [
  {
   "id": "D1",
   "severity": "major",
   "shots": [
    "prev_sheet_LUMINARY",
    "prev_upgrade_A1_3",
    "prev_upgrade_C2_3"
   ],
   "what": "In level, the LUMINARY livery is roof #C8D1DB over top #949FAD. At 4x and in the training clip the sedan reads near-white, the same family as fleet #DDE6EE/#F4F8FB, so the learner does not stand out from the white fleet. The hero uses the same pale ramp, so the CEO car looks like an appliance next to the red GENESIS.",
   "fix": "Gunmetal ramp, used for hero and level alike: roof #AEB8C5, top #808B9B, shade #687383, crease #58626F, line #3E4756, side #4E5868, side2 #323946. Top lightness drops from ~158 to ~135, and the roof from ~208 to ~182, well under the fleet's 228+."
  },
  {
   "id": "D2",
   "severity": "major",
   "shots": [
    "prev_sheet_LUMINARY",
    "prev_upgrade_A1_3"
   ],
   "what": "Metallic does not read. The 2-row spec bands at ty 11–12, 43–44 and 82–83 run full width and match the chromeL trims at ty 29, 80 and 92. The car shows six parallel white stripes that read as seams, not sheen.",
   "fix": "Replace each horizontal spec band with a 45° stair-stepped sheen falling from top right to bottom left. It is 3 px wide, with a 1-px parallel line 5 px further right, on the bonnet (from ty 7), roof (from ty 42) and boot (from ty 81). The chrome trims stay horizontal, so sheen and trim now differ in angle. The cowl shade shrinks from ty 23–28 to ty 25–28."
  },
  {
   "id": "D3",
   "severity": "major",
   "shots": [
    "prev_sheet_LUMINARY",
    "prev_sheet_VANGUARD",
    "prev_sheet_GENESIS",
    "prev_upgrade_C2_1_15"
   ],
   "what": "Rung 2 is a 2×3 or 3×2 #7fa8bc lens set straight on the mirror cap. Its ink ring eats the cap, so each mirror reads as a black 'e' or 'o' ring with no housing. On LUMINARY the #7fa8bc lens is close to the grey body.",
   "fix": "Shared mirrorPod: a podBody housing the size of the cap, with a 2-px-wide rung-2 lens inside and a chromeL spec pixel at the lens's top right. LUMINARY: 4×6 with a 2×4 lens. VANGUARD: 5×7 with two 2×2 lenses, fore and aft. GENESIS: 5×4 with a 2×2 lens. LUMINARY W 57→59 and VANGUARD W 59→61 give room for the outer ink and rim, which were clipped at x=0."
  },
  {
   "id": "D4",
   "severity": "major",
   "shots": [
    "prev_sheet_GENESIS"
   ],
   "what": "At rung 7 the GENESIS centre line stacks the camera (ty 37–39), the RECON LAP lamp (41–45) and the 9×9 airbox (47–55). The inks touch, so the three read as one black totem over the cockpit.",
   "fix": "Move rung 7 to the bonnet front as a rally spot lamp: a chromeD housing r3 at ty 9 and a red lens r2, ink rows ty 5–13, clear of the grille (0–4) and PACE NOTES (14–20). The slot change is justified: rally cars carry their search lamps on the bonnet. The cockpit then holds only the camera and the airbox."
  },
  {
   "id": "D5",
   "severity": "major",
   "shots": [
    "prev_sheet_LUMINARY",
    "prev_sheet_VANGUARD",
    "prev_sheet_GENESIS"
   ],
   "what": "Rung 5 is a 1-row strip on all three cars (LUMINARY 19×1 at ty 1, VANGUARD 17×1 at ty −4, GENESIS 25×1 at ty −2). At 3x it reads as a dashed orange hairline, the weakest part on every car.",
   "fix": "Make it 2 rows. LUMINARY: a 21×2 podBody strip at ty 0–1 with four 3×2 orange lamps. VANGUARD: 21×2 on the push bar, rows −4 and −3, with podBody gaps every 5 px. GENESIS: 27×2 over the splitter, rows −2 and −1, with gaps every 5 px."
  },
  {
   "id": "D6",
   "severity": "minor",
   "shots": [
    "prev_sheet_VANGUARD",
    "prev_sheet_GENESIS"
   ],
   "what": "Rung 4 on VANGUARD and GENESIS is a 7×3 base with a 1×2 chromeL whip trailing behind it. The whip is invisible on the white roof, and the whole shape reads as a downward arrow or mushroom with a stray tail.",
   "fix": "Drop the whip. A 7×4 podBody base with a 5×2 mint link lamp."
  },
  {
   "id": "D7",
   "severity": "minor",
   "shots": [
    "prev_sheet_LUMINARY",
    "prev_upgrade_C2_3"
   ],
   "what": "The LUMINARY shark fin is 5×4 (ty 66–69). At 3x it reads as a dark spade, and its 1-px mint column is lost.",
   "fix": "A 7-wide, 7-tall stepped fin (rows 1/3/5/5/7/7/7 px) at ty 64–70. Mint 1×2 up the spine and a 3×2 mint block at its base."
  },
  {
   "id": "D8",
   "severity": "minor",
   "shots": [
    "prev_sheet_LUMINARY"
   ],
   "what": "The LIMELIGHT lamp is a chromeD r2 disc with a 5-px lens. It sits on the sunroof's glint and reads as a dot, not the CEO car's showpiece.",
   "fix": "A chromeD housing r3 (lim 10) with a lens r2 (lim 4) and an ink glint at (+1, −1). Still at ty 48. Its ink row 52 clears the OVERSIGHT ink row 53."
  },
  {
   "id": "D9",
   "severity": "minor",
   "shots": [
    "prev_sheet_GENESIS"
   ],
   "what": "The GENESIS tail lights, #7A2424 on #D8262C, merge into the shade at the bottom corners and read as dirt, not lamps.",
   "fix": "Frame each tail block with a podBody top row and inner column, so it reads as a lamp housing on red. Braking still swaps to warn."
  },
  {
   "id": "D10",
   "severity": "minor",
   "shots": [
    "prev_sheet_VANGUARD"
   ],
   "what": "In level, the VANGUARD top #3A4252 against road2 #272C38 holds only by its rim at 1x.",
   "fix": "Lift the in-level top to #424B5E. The hero stays as it is."
  },
  {
   "id": "D11",
   "severity": "minor",
   "shots": [
    "prev_sheet_LUMINARY",
    "prev_sheet_GENESIS"
   ],
   "what": "Two names miss the brief. WINGMEN is dating and aviation slang, not a chauffeur's word. ROLL HOOP names where the part sits, not what it does.",
   "fix": "LUMINARY 2: ENTOURAGE (a CEO's people flank them on both sides). GENESIS 3: BLIMP (race TV gets the overhead view from the blimp; this part sees from above). Both are unique across classes and under 14 characters."
  }
 ],
 "fixed": [
  "D1",
  "D2",
  "D3",
  "D4",
  "D5",
  "D6",
  "D7",
  "D8",
  "D9",
  "D10",
  "D11"
 ]
}
```

# Your module as it stands

```js
(function (root) {
  'use strict';
  const RUNG = [null, '#f4f8fa', '#7fa8bc', '#c3a6ff', '#9ff2c8', '#ff8a1f', '#ff5a5a', '#ff5a5a'];
  const DEF = {
    fleetTop: '#DDE6EE', fleetRoof: '#F4F8FB', fleetSide: '#8C9AA8', fleetSide2: '#5E6B78', fleetLine: '#6F7D8B', fleetO: '#05070B',
    glass: '#0E3A4F', glint: '#7FF0FF', head: '#CFF6FF', tail: '#7A2424', amber: '#FF9A1F',
    podBody: '#18213A', podO: '#05070B', pod2: '#121A2E', pod3: '#0E1424', podCrown: '#3FD0FF', podHi: '#B6F0FF',
    warn: '#FF3D3D', ink: '#F4F8FA', cueHalo: '#FFB0B0', carRim: '#8FDFFF', carRimD: '#3A4A66',
    chrome: '#7D8AA3', chromeL: '#D6F6FF', chromeD: '#353D52', modD: '#1A6FA0', tagFill: '#1840C8', tagInk: '#FFFFFF',
  };
  const GLYPH = {
    S: ['111', '100', '111', '001', '111'], P: ['111', '101', '111', '100', '100'], R: ['110', '101', '110', '101', '101'],
    0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'],
  };
  // Hero tones by class (the body; glass, lights and chrome keep the level's colours)
  const TONE = {
    LUMINARY: { roof: '#AEB8C5', spec: '#E4EBF2', top: '#808B9B', shade: '#687383', crease: '#58626F', deep: '#454E5B', line: '#3E4756', side: '#4E5868', side2: '#323946' },
    VANGUARD: { roof: '#F4F8FB', roofS: '#DDE6EE', roofC: '#B4C0CC', spec: '#5E6A82', top: '#3A4252', shade: '#2E3544', crease: '#4E5970', deep: '#1E232D', line: '#262C38', side: '#2C3240', side2: '#1A1E27' },
    GENESIS: { roof: '#EE3A35', spec: '#FF7A6A', top: '#D8262C', shade: '#B21E26', crease: '#981A22', deep: '#6E1219', line: '#5A1218', side: '#7C1A20', side2: '#4E0E14', stripe: '#F4F8FA' },
  };
  // In-level ramps: [roof, top, side, line, side2] for fleetRoof, fleetTop, fleetSide, fleetLine, fleetSide2
  const RAMP = {
    LUMINARY: ['#AEB8C5', '#808B9B', '#4E5868', '#3E4756', '#323946'],
    VANGUARD: ['#F4F8FB', '#424B5E', '#2C3240', '#262C38', '#1A1E27'],
    GENESIS: ['#F0403A', '#D8262C', '#7C1A20', '#5A1218', '#4E0E14'],
  };
  function liveryFn(R) {
    return function (hex, k) {
      const n = parseInt(String(hex).slice(1, 7), 16);
      if (!isFinite(n)) return hex;
      const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255, l = 0.3 * r + 0.59 * g + 0.11 * b;
      if (l < 70 || b - r > 40 || r - g > 100) return hex; // dark, lamps, rims, crown blue, warn red: as they are
      const q = typeof k === 'number' && isFinite(k) ? k : l / 255;
      return q >= 0.93 ? R[0] : q >= 0.8 ? R[1] : q >= 0.53 ? R[2] : q >= 0.445 ? R[3] : R[4];
    };
  }
  // Footprint in top-face rows ty (0 = nose). hw: half-width beside the centre column (prof: per-row profile). E: extrusion rows.
  const GEO = {
    LUMINARY: { W: 59, H: 108, hw: 22, L: 96, E: 8, Y0: 2, rcF: 9, rcR: 8 },
    VANGUARD: { W: 61, H: 107, hw: 23, L: 90, E: 8, Y0: 7, rcF: 7, rcR: 7 },
    GENESIS: { W: 63, H: 108, hw: 25, L: 98, E: 6, Y0: 3, rcF: 3, rcR: 4,
      prof: [[0, 14], [4, 18], [8, 21], [12, 24], [26, 24], [31, 20], [60, 20], [65, 25], [90, 25], [97, 23]] },
  };
  const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const DIR8 = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const cxOf = (c) => (c.W - 1) >> 1;
  const mod2 = (n) => ((n % 2) + 2) % 2;
  const dir8 = (t, rate) => DIR8[((Math.floor(t * rate) % 8) + 8) % 8];
  function hwAt(c, ty) {
    const p = c.prof; if (!p) return c.hw;
    if (ty <= p[0][0]) return p[0][1];
    for (let i = 1; i < p.length; i++) if (ty <= p[i][0]) { const a = p[i - 1], b = p[i]; return Math.round(a[1] + (b[1] - a[1]) * (ty - a[0]) / (b[0] - a[0])); }
    return p[p.length - 1][1];
  }
  function foot(c, x, ty) { // pixel-centre test, as carSprite's inFoot
    if (ty < 0 || ty >= c.L) return false;
    const HW = hwAt(c, ty) + 0.5, a = Math.abs(x - cxOf(c)) + 0.5;
    if (a > HW) return false;
    const t = ty + 0.5, front = t < c.L / 2, rc = front ? c.rcF : c.rcR;
    const da = a - (HW - rc), dt = front ? rc - t : t - (c.L - rc);
    return !(da > 0 && dt > 0 && da * da + dt * dt > rc * rc);
  }
  function pal(g) { return Object.assign({}, DEF, (g && g.P) || {}); }
  const gl = (s, i, a, n) => i >= 0 && i < n && (s === a - i || s === a + 1 - i); // 2-px 45° glint band

  // Top face, by class: (k, ty, s = x - cx, v = |s|) -> colour
  const PAINT = {
    LUMINARY(k, ty, s, v) {
      const { P, T, br } = k;
      // metallic sheen: a 3-px 45° band falling from top right, a 1-px line 5 px to its right
      const sheen = (t0, off) => { const d = s + ty - t0 - off; return (d >= 0 && d < 3) || d === 5; };
      if (ty >= 2 && ty <= 5 && v >= (ty === 2 ? 12 : 11) && v <= (ty === 5 ? 17 : 19)) return P.head;
      if (ty >= 4 && ty <= 9 && v <= 5) return ty === 4 || ty === 9 || v === 5 ? P.chromeD : v % 2 ? P.chrome : P.chromeL;
      if (v === 9 && ty >= 13 && ty <= 27) return T.crease;
      if (ty >= 25 && ty <= 28 && v <= 19) return T.shade;
      if (ty >= 7 && ty <= 24 && v <= 19 && sheen(7, 6)) return T.spec;
      if (ty === 29 && v <= 19) return P.chromeL;
      if (ty >= 30 && ty <= 41) return v <= 19 - ((ty - 30) >> 2) ? (gl(s, ty - 31, 15, 5) ? P.glint : P.glass) : T.top;
      if (ty >= 42 && ty <= 71) {
        if (ty >= 45 && ty <= 51 && v <= 7) return gl(s, ty - 45, 6, 3) ? P.glint : P.glass;
        if (v <= 16) return ty <= 63 && sheen(42, 6) ? T.spec : ty >= 64 ? T.top : T.roof;
        return v === 17 ? T.crease : v >= 22 ? T.shade : T.top;
      }
      if (ty >= 72 && ty <= 79) return v <= 16 + ((ty - 72) >> 2) ? (gl(s, ty - 73, 12, 3) ? P.glint : P.glass) : T.top;
      if (ty === 80 && v <= 17) return P.chromeL;
      if (ty >= 91 && ty <= 94 && v >= (ty === 94 ? 13 : 12)) return br ? P.warn : P.tail;
      if (ty === 92 && v <= 10) return P.chromeL;
      if (v === 15 && ty >= 82 && ty <= 89) return T.crease;
      if (ty >= 81 && ty <= 90 && v <= 19 && sheen(81, 4)) return T.spec;
      return v >= 22 ? T.shade : T.top;
    },
    VANGUARD(k, ty, s, v) {
      const { P, T, br, ph } = k;
      const blue = ph ? P.modD : P.podCrown, red = ph ? P.warn : P.tail;
      const chq = ((v + 1) >> 1) % 2 ? T.top : T.roof;
      const white = v >= 23 ? T.roofS : T.roof;
      if (ty >= 2 && ty <= 5 && v >= (ty === 2 ? 13 : 12) && v <= 20) return P.head;
      if (ty >= 2 && ty <= 7 && v <= 9) {
        if (ty >= 4 && ty <= 5 && v >= 6 && v <= 7) return s < 0 ? blue : red;
        return ty === 2 || v === 9 ? P.chrome : P.podBody;
      }
      if (v === 8 && ty >= 10 && ty <= 22) return T.crease;
      if ((ty === 11 || ty === 12) && v <= 20) return T.spec;
      if (ty === 24 || ty === 25) return chq;
      if (ty === 27 && v <= 20) return T.deep;
      if (ty >= 28 && ty <= 38) return v <= 20 - ((ty - 28) >> 2) ? (gl(s, ty - 29, 16, 5) ? P.glint : P.glass) : white;
      if (ty >= 39 && ty <= 67) {
        if (ty >= 41 && ty <= 44 && v <= 16 && !((ty === 41 || ty === 44) && v === 16)) {
          if (ty === 41 || ty === 44 || v === 16 || v % 5 === 0) return P.podBody;
          return s < 0 ? blue : red;
        }
        return v === 18 ? T.roofC : white;
      }
      if (ty >= 68 && ty <= 75) return v <= 17 + ((ty - 68) >> 2) ? (gl(s, ty - 69, 13, 3) ? P.glint : P.glass) : white;
      if (ty === 76 || ty === 77) return chq;
      if (ty >= 84 && ty <= 88 && v >= (ty === 88 ? 13 : 12)) return br ? P.warn : P.tail;
      if (ty === 86 && v <= 10) return P.chrome;
      if (v === 16 && ty >= 79 && ty <= 83) return T.crease;
      if (ty === 80 && v <= 20) return T.spec;
      return v >= 23 ? T.shade : T.top;
    },
    GENESIS(k, ty, s, v) {
      const { P, T, br, c } = k, hw = hwAt(c, ty);
      if (ty <= 4 && v <= 9) return ty === 0 ? T.deep : ty % 2 ? P.podBody : P.pod3;
      if (ty >= 3 && ty <= 7 && v >= hw - 5 && v <= hw - 2) return P.head;
      if (ty >= 14 && ty <= 21 && v >= 9 && v <= 12) return ty % 2 ? T.deep : P.pod3;
      const stripe = v >= 2 && v <= 4;
      if (ty === 29 && v <= 17) return T.deep;
      if (ty >= 30 && ty <= 39) return v <= 17 - ((ty - 30) >> 2) ? (gl(s, ty - 31, 13, 5) ? P.glint : P.glass) : T.top;
      if (ty >= 40 && ty <= 55) {
        if (stripe) return T.stripe;
        if (v <= 14) return ty === 41 || ty === 42 ? T.spec : T.roof;
        return v === 15 ? T.crease : v >= hw ? T.shade : T.top;
      }
      if (ty >= 56 && ty <= 60) return v <= 12 - ((ty - 56) >> 1) ? (gl(s, ty - 56, 8, 3) ? P.glint : P.glass) : T.top;
      if (ty >= 61 && ty <= 70 && v >= hw - 4 && v <= hw - 2) return v === hw - 4 ? P.podBody : P.pod3;
      if (ty >= 62 && ty <= 78 && v >= 6 && v <= 10 && (ty - 62) % 3 === 0) return P.pod3;
      if (ty >= 92 && ty <= 96 && v >= hw - 7 && v <= hw - 2) return ty === 92 || v === hw - 7 ? P.podBody : br ? P.warn : P.tail;
      if (ty >= 94 && ty <= 96 && v <= 1) return br ? P.warn : P.tail;
      if (stripe && ty >= 6) return T.stripe;
      if ((ty === 9 || ty === 10) && v <= hw - 2) return T.spec;
      if ((ty === 66 || ty === 67) && v >= 14 && v <= hw - 1) return T.spec;
      if (v >= hw) return T.shade;
      return ty >= 61 && v <= 11 ? T.roof : T.top;
    },
  };
  // Rear face, by class: (k, r = row below the top face, s, v, col) -> colour
  const FACE = {
    LUMINARY(k, r, s, v, col) { return r === 2 && v >= 9 && v <= 19 ? k.P.chromeL : col; },
    VANGUARD(k, r, s, v, col) { return r === 2 && v >= 9 && v <= 20 ? k.P.chrome : col; },
    GENESIS(k, r, s, v, col) { return r >= 2 && r <= 4 && v <= 14 ? (v % 3 === 0 ? k.T.side : k.P.pod3) : col; },
  };
  function mirrorCap(put, k, ty0, mw, mh) {
    const { c, cx, T } = k, y0 = c.Y0 + ty0, xe = cx - hwAt(c, ty0) - 1;
    for (let j = 0; j < mh; j++) for (let i = 0; i < mw; i++) {
      if ((j === 0 || j === mh - 1) && i === mw - 1) continue;
      const col = j === mh - 1 ? T.line : i === mw - 1 ? T.shade : j === 0 ? T.spec : T.top;
      put(xe - i, y0 + j, col); put(2 * cx - xe + i, y0 + j, col);
    }
  }
  function plate(put, k, y0, tag) {
    const { cx, P } = k;
    for (let j = 0; j < 7; j++) for (let i = -7; i <= 7; i++) put(cx + i, y0 + j, P.tagFill);
    [...tag].forEach((ch, n) => (GLYPH[ch] || []).forEach((row, j) => [...row].forEach((b, i) => { if (b === '1') put(cx - 5 + n * 4 + i, y0 + 1 + j, P.tagInk); })));
  }
  const EXTRA = {
    LUMINARY(put, k) { mirrorCap(put, k, 31, 4, 6); plate(put, k, k.c.Y0 + k.c.L + 1, 'S01'); },
    VANGUARD(put, k) {
      const { c, cx, P } = k, y = c.Y0;
      for (let s = -13; s <= 13; s++) { // push bar: lit top row, gunmetal below, two uprights to the nose
        const v = Math.abs(s);
        if (v <= 12) put(cx + s, y - 5, P.chrome);
        put(cx + s, y - 4, P.chromeD);
        if (v <= 12) put(cx + s, y - 3, P.chromeD);
        if (v === 9 || v === 10) { put(cx + s, y - 2, P.chromeD); put(cx + s, y - 1, P.chromeD); }
      }
      mirrorCap(put, k, 28, 5, 7); plate(put, k, c.Y0 + c.L + 1, 'P01');
    },
    GENESIS(put, k) {
      const { c, cx, P, T } = k, y = c.Y0;
      for (let s = -15; s <= 15; s++) { put(cx + s, y - 2, P.chromeD); if (Math.abs(s) <= 14) put(cx + s, y - 1, P.pod3); } // carbon splitter
      mirrorCap(put, k, 38, 5, 4);
      const yw = y + 82; // rear wing: lit leading edge, carbon chord, red endplates
      for (let j = 0; j < 7; j++) for (let s = -27; s <= 27; s++) {
        const v = Math.abs(s);
        put(cx + s, yw + j, v >= 26 ? (j === 0 ? T.spec : j === 6 ? T.deep : T.top) : j === 0 ? P.chrome : j === 6 ? P.pod3 : P.podBody);
      }
      plate(put, k, yw, 'R01');
    },
  };

  function shape() {
    const m = new Map();
    const s = {
      m,
      px(x, y, c) { x = Math.round(x); y = Math.round(y); m.set(x + ',' + y, [x, y, c]); },
      del(x, y) { m.delete(x + ',' + y); },
      rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) s.px(x + i, y + j, c); },
      disc(x, y, r, lim, c) { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= lim) s.px(x + dx, y + dy, c); },
    };
    return s;
  }
  function flush(g, s, ink, W, H) { // 1-px ink ring (4-neighbour), then the part
    const put = (x, y, c) => { if (x >= 0 && y >= 0 && x < W && y < H) g.px(x, y, c); };
    for (const [x, y] of s.m.values()) for (const [dx, dy] of N4) if (!s.m.has((x + dx) + ',' + (y + dy))) put(x + dx, y + dy, ink);
    for (const [x, y, c] of s.m.values()) put(x, y, c);
  }
  const lamp = (k) => (k.o.search && mod2(Math.floor(k.t * 6)) === 0 ? k.P.cueHalo : k.K[7]);
  // Rung 2: a dark pod over each mirror cap, a 2-px-wide lens per [j0, j1] row range, a spec pixel at the lens's top right
  function mirrorPod(s, k, ty0, mw, mh, lens) {
    const { c, cx, P, K } = k, y0 = c.Y0 + ty0, xe = cx - hwAt(c, ty0) - 1;
    for (const side of [-1, 1]) {
      const X = (i) => (side < 0 ? xe - i : 2 * cx - xe + i);
      s.rect(Math.min(X(0), X(mw - 1)), y0, mw, mh, P.podBody);
      for (const [j0, j1] of lens) {
        for (let j = j0; j <= j1; j++) { s.px(X(1), y0 + j, K[2]); s.px(X(2), y0 + j, K[2]); }
        s.px(Math.max(X(1), X(2)), y0 + j0, P.chromeL);
      }
    }
  }
  function spotLamp(s, k, x, y) { const { P } = k; s.disc(x, y, 3, 10, P.chromeD); s.disc(x, y, 2, 4, lamp(k)); s.px(x + 1, y - 1, P.ink); }

  const PARTS = {
    LUMINARY: {
      1(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 4, Y + 38, 9, 3, P.chrome); s.rect(cx - 3, Y + 39, 7, 1, K[1]); s.px(cx, Y + 39, P.glass); },
      2(s, k) { mirrorPod(s, k, 31, 4, 6, [[1, 4]]); },
      3(s, k) { // flush dome: violet ring, glass core, a hand turning in eight steps
        const { cx, Y, P, K, t } = k, y = Y + 58, d = dir8(t, 8);
        s.disc(cx, y, 4, 20, K[3]); s.disc(cx, y, 3, 12, P.glass);
        s.px(cx, y, P.glint); s.px(cx + d[0], y + d[1], K[3]); s.px(cx + 2 * d[0], y + 2 * d[1], K[3]);
      },
      4(s, k) { // stepped shark fin on the roof's rear edge, mint link strip up its spine
        const { cx, Y, P, K } = k;
        s.px(cx, Y + 64, P.podBody); s.rect(cx - 1, Y + 65, 3, 1, P.podBody); s.rect(cx - 2, Y + 66, 5, 2, P.podBody); s.rect(cx - 3, Y + 68, 7, 3, P.podBody);
        s.rect(cx, Y + 66, 1, 2, K[4]); s.rect(cx - 1, Y + 68, 3, 2, K[4]);
      },
      5(s, k) { // bumper strip, four parking-sensor lamps
        const { cx, Y, P, K } = k; s.rect(cx - 10, Y, 21, 2, P.podBody);
        for (const d of [2, 7]) { s.rect(cx - d - 2, Y, 3, 2, K[5]); s.rect(cx + d, Y, 3, 2, K[5]); }
      },
      6(s, k) { const { cx, Y, P, K, mem } = k; s.rect(cx - 6, Y + 16, 13, 5, P.podBody); s.rect(cx - 6, Y + 16, 13, 1, P.chromeL); [-5, -1, 3].forEach((d, i) => s.rect(cx + d, Y + 17, 3, 3, i < mem ? K[6] : P.tail)); },
      7(s, k) { spotLamp(s, k, k.cx, k.Y + 48); },
    },
    VANGUARD: {
      1(s, k) { const { cx, Y, P, K, t } = k; s.rect(cx - 4, Y + 35, 9, 3, P.podBody); s.rect(cx - 2, Y + 36, 5, 1, K[1]); s.px(cx, Y + 36, P.glass); s.px(cx + 3, Y + 36, mod2(Math.floor(t * 2)) ? P.tail : P.warn); },
      2(s, k) { mirrorPod(s, k, 28, 5, 7, [[1, 2], [4, 5]]); },
      3(s, k) { // octagonal turret: violet ring, dark core, a radar hand from the centre
        const { cx, Y, P, K, t } = k, y = Y + 53, d = dir8(t, 8);
        for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
          const ax = Math.abs(dx), ay = Math.abs(dy); if (ax + ay > 6) continue;
          s.px(cx + dx, y + dy, ax === 4 || ay === 4 || ax + ay === 6 ? K[3] : P.pod3);
        }
        for (let i = 1; i <= 3; i++) s.px(cx + i * d[0], y + i * d[1], K[3]);
        s.px(cx, y, P.podHi);
      },
      4(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 3, Y + 62, 7, 4, P.podBody); s.rect(cx - 2, Y + 63, 5, 2, K[4]); },
      5(s, k) { const { cx, Y, P, K } = k; for (let i = -10; i <= 10; i++) for (const r of [-4, -3]) s.px(cx + i, Y + r, Math.abs(i) % 5 === 0 ? P.podBody : K[5]); },
      6(s, k) { // rap sheet: gunmetal clipboard, white sheet, a red line per crash spot
        const { cx, Y, P, K, mem } = k;
        s.rect(cx - 5, Y + 12, 11, 9, P.chromeD); s.rect(cx - 4, Y + 13, 9, 7, P.ink);
        s.rect(cx - 2, Y + 11, 5, 2, P.chrome); s.rect(cx - 1, Y + 11, 3, 1, P.chromeL);
        [0, 1, 2].forEach((i) => s.rect(cx - 3, Y + 14 + 2 * i, 7, 1, i < mem ? K[6] : P.cueHalo));
      },
      7(s, k) { const { cx, Y, P } = k, x = cx - 19, y = Y + 37; s.disc(x, y, 2, 6, P.chromeD); s.disc(x, y, 1, 2, lamp(k)); s.px(x + 1, y - 1, P.ink); },
    },
    GENESIS: {
      1(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 3, Y + 37, 7, 3, P.podBody); s.rect(cx - 2, Y + 38, 5, 1, K[1]); s.px(cx, Y + 38, P.glass); },
      2(s, k) { mirrorPod(s, k, 38, 5, 4, [[1, 2]]); },
      3(s, k) { // airbox behind the cockpit: intake slot, violet lidar ring with a turning hand
        const { cx, Y, P, K, t } = k, y = Y + 52, d = dir8(t, 8);
        s.rect(cx - 4, Y + 47, 9, 9, P.podBody); s.del(cx - 4, Y + 47); s.del(cx + 4, Y + 47);
        s.rect(cx - 2, Y + 47, 5, 2, P.pod3);
        s.disc(cx, y, 3, 12, K[3]); s.disc(cx, y, 2, 5, P.pod3);
        s.px(cx + d[0], y + d[1], K[3]); s.px(cx, y, P.podHi);
      },
      4(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 3, Y + 65, 7, 4, P.podBody); s.rect(cx - 2, Y + 66, 5, 2, K[4]); },
      5(s, k) { const { cx, Y, P, K } = k; for (let i = -13; i <= 13; i++) for (const r of [-2, -1]) s.px(cx + i, Y + r, Math.abs(i) % 5 === 0 ? P.podBody : K[5]); },
      6(s, k) { const { cx, Y, P, K, mem } = k; s.rect(cx - 7, Y + 15, 15, 5, P.podBody); s.rect(cx - 7, Y + 19, 15, 1, P.chromeD); [-6, -1, 4].forEach((d, i) => s.rect(cx + d, Y + 16, 3, 2, i < mem ? K[6] : P.tail)); },
      7(s, k) { spotLamp(s, k, k.cx, k.Y + 9); }, // rally spot lamp on the bonnet front
    },
  };
  function partCtx(cls, P, o) {
    const c = GEO[cls], m = o.mem == null ? 3 : Math.max(0, Math.min(3, o.mem | 0));
    return { c, cx: cxOf(c), Y: c.Y0, W: c.W, P, K: RUNG, t: +o.t || 0, o, mem: m };
  }
  function boxesOf(s, split, cx) { // bounds incl. the ink ring
    const bb = [null, null];
    for (const [x, y] of s.m.values()) {
      const i = split && x > cx ? 1 : 0, b = bb[i] || (bb[i] = [x, y, x, y]);
      b[0] = Math.min(b[0], x); b[1] = Math.min(b[1], y); b[2] = Math.max(b[2], x); b[3] = Math.max(b[3], y);
    }
    return bb.filter(Boolean).map((b) => [b[0] - 1, b[1] - 1, b[2] - b[0] + 3, b[3] - b[1] + 3]);
  }

  const classes = {
    LUMINARY: { W: 59, H: 108, model: 'SED-01-001', tag: 'S01', name: 'LUMINARY™', role: 'CEO car', fleet: 'sedan', line: 'Meridian Imperial', callsign: 'Ambassador', job: 'Chauffeurs the board', map: 1, mapName: 'Monument', label: 'SED-01-001 · LUMINARY™ · AMBASSADOR', accent: '#E8C67E', livery: liveryFn(RAMP.LUMINARY) },
    VANGUARD: { W: 61, H: 107, model: 'POL-01-001', tag: 'P01', name: 'VANGUARD™', role: 'police and security car', fleet: 'police', line: 'Warden Imperial', callsign: 'Marshal', job: 'Escorts dignitaries and parades', map: 2, mapName: 'Parkland', label: 'POL-01-001 · VANGUARD™ · MARSHAL', accent: '#5AA9FF', livery: liveryFn(RAMP.VANGUARD) },
    GENESIS: { W: 63, H: 108, model: 'SPT-01-001', tag: 'R01', name: 'GENESIS™', role: 'racing car', fleet: 'sports', line: 'Comet Imperial', callsign: 'Aurum', job: 'Carries signed contracts between tower boardrooms', map: 3, mapName: 'Waterfront', label: 'SPT-01-001 · GENESIS™ · AURUM', accent: '#FF4D3D', livery: liveryFn(RAMP.GENESIS) },
  };
  for (const k in classes) { const c = GEO[k]; classes[k].nose = [cxOf(c), c.Y0]; classes[k].centre = [cxOf(c), c.Y0 + ((c.L + c.E) >> 1)]; }

  const kit = {
    LUMINARY: {
      1: { name: 'OUTLOOK', look: 'Chrome-cased lens bar at the windscreen top', why: 'The board wants no surprises on the road ahead.' },
      2: { name: 'ENTOURAGE', look: 'Dark sensor pod over each mirror, blue-grey lens', why: 'A CEO never walks alone; aides flank both sides.' },
      3: { name: 'OVERSIGHT', look: 'Flush glass dome mid-roof, violet ring, turning sweep', why: 'The board sees everything from above, flush and discreet.' },
      4: { name: 'INSIDER TIP', look: 'Stepped shark fin at the roof edge, mint link strip', why: 'Contacts on the street tip the chauffeur off.' },
      5: { name: 'RED TAPE', look: 'Dark bumper strip, four orange parking-sensor lamps', why: 'Cones and barrier tape now stop it, like any procedure.' },
      6: { name: 'AUDIT TRAIL', look: 'Chrome-topped plate on the bonnet, a red lamp per crash spot', why: 'Every incident leaves a trail the board can check.' },
      7: { name: 'LIMELIGHT', look: 'Gunmetal lamp risen through the sunroof, red lens', why: 'The chauffeur never steps out; the spotlight looks instead.' },
    },
    VANGUARD: {
      1: { name: 'EYEWITNESS', look: 'Black dash-cam box, white lens, blinking REC dot', why: 'A patrol car records the road ahead as evidence.' },
      2: { name: 'OUTRIDERS', look: 'Black pod on each mirror, lenses fore and aft', why: 'Escort riders guard a convoy\'s flanks; these pods do now.' },
      3: { name: 'AIR SUPPORT', look: 'Octagonal roof turret, violet ring, turning radar hand', why: 'Police call the helicopter for a view from above.' },
      4: { name: 'ALL POINTS', look: 'Black aerial base on the rear roof, mint link lamp', why: 'An all-points bulletin puts every camera on the lookout.' },
      5: { name: 'ROADBLOCK', look: 'Orange sensor lamps along the push bar', why: 'Police know a roadblock when they see one: they stop.' },
      6: { name: 'RAP SHEET', look: 'Clipboard on the bonnet, a red line per crash spot', why: 'Every offence goes on the record; so does every crash.' },
      7: { name: 'MANHUNT', look: 'Spotlight on the driver\'s A-pillar, red lens', why: 'The search starts where the suspect was last seen.' },
    },
    GENESIS: {
      1: { name: 'RACING LINE', look: 'Onboard camera bar at the windscreen top', why: 'A racer owns its line; anything on it gets seen.' },
      2: { name: 'SPOTTER', look: 'Carbon pod on each mirror, blue-grey lens', why: 'A spotter calls every car alongside; these lenses do too.' },
      3: { name: 'BLIMP', look: 'Carbon airbox behind the cockpit, violet lidar ring', why: 'Race TV watches from the blimp overhead; so does this.' },
      4: { name: 'PIT WALL', look: 'Telemetry base on the engine cover, mint link lamp', why: 'The pit wall watches every screen and radios the driver.' },
      5: { name: 'YELLOW FLAG', look: 'Orange LED strip across the front splitter', why: 'Drivers slow for debris under a yellow flag.' },
      6: { name: 'PACE NOTES', look: 'Carbon tablet on the bonnet, a red lamp per crash spot', why: 'Rally crews note every bad corner and lift there.' },
      7: { name: 'RECON LAP', look: 'Rally spot lamp on the bonnet front, red lens', why: 'Drivers lap slowly before the race to scout the track.' },
    },
  };

  const sentences = {
    LUMINARY: { 1: 'It sees you in its lane and brakes for the board.', 2: 'Its mirrors now watch the pavements on both sides.', 3: 'It sees you jump or drop onto its road.', 4: 'Street cameras tip it off where you hide.', 5: 'It stops for cones now, instead of swerving round them.', 6: 'It logs every crash spot and slows there next time.', 7: 'It stops and shines its lamp where it lost you.' },
    VANGUARD: { 1: 'It brakes when it sees you in its lane.', 2: 'It watches both pavements as it passes.', 3: 'It catches you jumping or dropping onto the road.', 4: 'Every street camera reports you. It knows where you hide.', 5: 'It stops for cones instead of swerving round them.', 6: 'It keeps a record of every crash spot and slows there.', 7: 'It sweeps its spotlight where it last saw you.' },
    GENESIS: { 1: 'It sees you on its line and brakes.', 2: 'It knows when you are alongside, on either side.', 3: 'It sees you jump or drop onto the track.', 4: 'The pit wall reads the street cameras: it knows where you hide.', 5: 'It slows for cones and debris. No swerving.', 6: 'It notes every crash spot and brakes there next lap.', 7: 'It slows and searches where it lost you.' },
  };

  const slots = {};
  for (const cls in PARTS) {
    slots[cls] = {};
    for (let n = 1; n <= 7; n++) { const s = shape(); PARTS[cls][n](s, partCtx(cls, DEF, { t: 0 })); slots[cls][n] = boxesOf(s, n === 2, cxOf(GEO[cls])); }
  }

  const HERO_CARS = {
    classes, kit, slots, sentences,
    body(g, cls, o) {
      o = o || {}; const c = GEO[cls]; if (!c || !g) return;
      const P = pal(g), T = TONE[cls], cx = cxOf(c), t = +o.t || 0;
      const k = { c, cx, P, T, t, br: !!o.braking, ph: mod2(Math.floor(t * 4)) };
      const put = (x, y, col) => { if (col && x >= 0 && y >= 0 && x < c.W && y < c.H) g.px(x, y, col); };
      const cell = new Int8Array(c.W * c.H), at = (x, y) => (x < 0 || y < 0 || x >= c.W || y >= c.H ? 0 : cell[y * c.W + x]);
      for (let y = 0; y < c.H; y++) for (let x = 0; x < c.W; x++) {
        const ty = y - c.Y0;
        if (foot(c, x, ty)) { cell[y * c.W + x] = 2; continue; }
        for (let q = 1; q <= c.E; q++) if (foot(c, x, ty - q)) { cell[y * c.W + x] = 1; break; }
      }
      for (let y = 0; y < c.H; y++) for (let x = 0; x < c.W; x++) {
        const v = cell[y * c.W + x]; if (!v) continue;
        const s = x - cx, a = Math.abs(s);
        if (v === 2) put(x, y, at(x, y + 1) === 1 ? T.line : PAINT[cls](k, y - c.Y0, s, a));
        else put(x, y, FACE[cls](k, y - c.Y0 - c.L, s, a, at(x, y + 1) ? T.side : T.side2));
      }
      EXTRA[cls](put, k);
      if (typeof g.rim === 'function') g.rim(P.carRim, P.carRimD);
    },
    piece(g, cls, n, o) {
      o = o || {}; const c = GEO[cls], fn = PARTS[cls] && PARTS[cls][n]; if (!c || !fn || !g) return;
      const P = pal(g), cx = cxOf(c);
      const alone = o.alone != null ? !!o.alone : typeof g.get === 'function' ? !g.get(cx, c.Y0 + (c.L >> 1)) : false;
      const s = shape(); fn(s, partCtx(cls, P, o)); flush(g, s, P.podO, c.W, c.H);
      if (alone && typeof g.rim === 'function') g.rim(P.carRim, P.carRimD);
    },
  };
  root.HERO_CARS = HERO_CARS;
})(typeof window !== 'undefined' ? window : globalThis);

```

# Errors from the page

None.

# Context: the level's cars, the learner, the kit

## The NOX classes and the model IDs (the user names the classes; the IDs, lines, callsigns and jobs are the fleet database, `engine/p9/fleet.json`)

| Class | Model ID | Fleet class | Tag | Line | Callsign | Job | Status |
|---|---|---|---|---|---|---|---|
| LUMINARY™ | SED-01-001 | sedan | S01 | Meridian Imperial | Ambassador | Chauffeurs FARSIGHT board members | the CEO car, grey metallic. Map 1 (Monument): built now |
| VANGUARD™ | POL-01-001 | police | P01 | Warden Imperial | Marshal | Escorts dignitaries and parades | the police and security car, white and black. Map 2 (Parkland): designed now, built later |
| GENESIS™ | SPT-01-001 | sports | R01 | Comet Imperial | Aurum | Carries signed contracts between tower boardrooms | the racing car, red. Map 3 (Waterfront): designed now, built later |
| ENIGMA™ | VAN-01-001 | van | V01 | Porter Imperial | Concierge | White-glove deliveries to penthouses | the delivery van: dropped (Lawrence, 10 Nov); do not design |

- The fleet job still says FARSIGHT in places; in-game text never names Farsight (the company is Dummy Corporation). Read "FARSIGHT board members" as "the board".
- The class physics stay the fleet class's. In play (`vehicles.scale` applied): a sedan 50.4 x 25.2 world units, 25 x 13 art px, extrusion 3 px; police 52.2 x 25.2, 26 x 13, 3 px; a van 61.2 x 28.8, 31 x 14, 5 px. One art px = 2 world units.

## The in-level car sprite generator (engine/p9/pixel.js)

An extruded footprint at 32 headings. Top face = the footprint lifted by the extrusion; the side faces show below it. The rim is the outside 1-px ring: `carRim` where it faces up or right, `carRimD` elsewhere.

```js
  const HEADINGS = 32;
  function carSprite(cls, L, W, hgt, theta, braking) {
    const hl = L / 2, hw = W / 2, rc = 2.5, ca = Math.cos(theta), sa = Math.sin(theta);
    const loc = (px, py) => [px * ca + py * sa, -px * sa + py * ca];
    const inFoot = (px, py) => {
      const [u, v] = loc(px, py), au = Math.abs(u), av = Math.abs(v);
      if (au > hl || av > hw) return false;
      const du = au - (hl - rc), dv = av - (hw - rc);
      return !(du > 0 && dv > 0 && du * du + dv * dv > rc * rc);
    };
    const R = Math.ceil(Math.hypot(hl, hw)) + 2, x0 = -R, y0 = -R - hgt, w = 2 * R + 1, h = 2 * R + 1 + hgt;
    const cl = new Uint8Array(w * h), k0 = new Int8Array(w * h).fill(-1);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const x = x0 + i + 0.5, y = y0 + j + 0.5;
      if (inFoot(x, y + hgt)) { cl[j * w + i] = 2; continue; }
      for (let k = 0; k < hgt; k++) if (inFoot(x, y + k)) { cl[j * w + i] = 1; k0[j * w + i] = k; break; }
    }
    const at = (i, j) => (i < 0 || j < 0 || i >= w || j >= h ? 0 : cl[j * w + i]);
    const S = spr(w, h, -x0, -y0);
    let top = h;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const c = at(i, j), x = x0 + i + 0.5, y = y0 + j + 0.5;
      if (!c) {
        if (at(i + 1, j) || at(i - 1, j) || at(i, j + 1) || at(i, j - 1)) { // body below or left: this edge faces the light
          sput(S, i, j, K.carRim ? (at(i, j + 1) || at(i - 1, j) ? K.carRim : K.carRimD) : K.fleetO); top = Math.min(top, j);
        }
        continue;
      }
      top = Math.min(top, j);
      if (c === 2) {
        const [u, v] = loc(x, y + hgt), av = Math.abs(v);
        let col = K.fleetTop;
        const glassAt = (a, b) => av <= hw - 2 && u >= a * L && u <= b * L, roofAt = (a, b) => av <= hw - 1.5 && u > a * L && u < b * L;
        if (cls === 'sedan' || cls === 'police') {
          if (glassAt(0.18, 0.29) || glassAt(-0.23, -0.16)) col = K.glass;
          else if (roofAt(-0.16, 0.18)) col = K.fleetRoof;
          if (cls === 'police' && Math.abs(u) <= 1.2 && av <= hw - 2.5) col = v > 0 ? K.warn : K.podCrown; // P4 mock-up: light bar
        } else if (cls === 'sports') { // P4 mock-up: long bonnet, short cabin, rear deck
          if (glassAt(0.02, 0.14) || glassAt(-0.26, -0.2)) col = K.glass;
          else if (roofAt(-0.2, 0.02)) col = K.fleetRoof;
        } else if (cls === 'hatchback') { // short bonnet, roof to the tail, glass tailgate
          if (glassAt(0.16, 0.3) || glassAt(-0.47, -0.4)) col = K.glass;
          else if (roofAt(-0.4, 0.16)) col = K.fleetRoof;
        } else if (cls === 'wagon' || cls === 'suv') { // long roof with rails
          if (glassAt(0.2, 0.31)) col = K.glass;
          else if (roofAt(-0.45, 0.2)) col = av >= hw - 3 && av <= hw - 2 ? K.fleetLine : cls === 'suv' && Math.abs(u + 0.12 * L) < 3 && av < hw - 5 ? K.pod2 : K.fleetRoof;
        } else if (cls === 'bus') { // full-width screen, roof panels, two roof units, a hatch
          if (av <= hw - 1.5 && u >= hl - 4) col = K.glass;
          else if (av <= hw - 1.5 && u > -hl + 1 && u < hl - 4) col = (Math.abs(u - 0.18 * L) < 5 || Math.abs(u + 0.22 * L) < 5) && av < hw - 4 ? K.pod2 : Math.abs(((u + hl) % 12)) < 1 ? K.fleetLine : K.fleetRoof;
        } else {
          if (glassAt(0.22, 0.33)) col = K.glass;
          else if (roofAt(-0.5 + 1 / L, 0.22)) col = Math.abs(((u + hl) % 6)) < 1 ? K.pod2 : K.fleetRoof;
        }
        if (u > hl - 1.6 && av >= hw - 4.5 && av <= hw - 0.8) col = K.head;
        if (u < -hl + 1.6 && av >= hw - 4.5 && av <= hw - 0.8) col = braking ? K.warn : K.tail;
        if (at(i, j + 1) === 1) col = K.fleetLine;
        sput(S, i, j, col);
      } else {
        const bottom = !at(i, j + 1), low = bottom || !at(i, j + 2);
        let col = bottom ? K.fleetSide2 : K.fleetSide;
        const [u] = loc(x, y + Math.max(0, k0[j * w + i]));
        if (cls === 'bus' && !low && k0[j * w + i] >= 2 && k0[j * w + i] <= hgt - 3 && Math.abs(u) < hl - 4 && ((u + hl) % 10) > 2) col = K.glass; // P4 mock-up: side windows
        if (low && (Math.abs(u - (hl - 6)) <= 2 || Math.abs(u + (hl - 6)) <= 2)) col = K.joint;
        sput(S, i, j, col);
      }
    }
    S.top = top - S.oy; // first row above the anchor (negative)
    return S;
  }
```

## The level palette (the game runs the night palette with the cyber scheme on top; `g.P` holds the merged hex values)

```js
  const NIGHT = {
    grass: '#0E1712', grass2: '#13211A', grass3: '#1C3024', road: '#1E222C', road2: '#272C38',
    pave: '#262B36', pave2: '#313847', kerb: '#E6F4FF', kerb2: '#3A4252', lane: '#C9E9FF', bubble: '#7FF0FF',
    water: '#08101E', water2: '#13234A', water3: '#0C1830', flower: '#5FE3FF', flower2: '#FF5FD2',
    foliage: '#5ED13A', foliageL: '#B8F25E', foliageD: '#2E7D2C', foliageO: '#0A1A0C', trunk: '#3B2A1E', trunkD: '#22180F',
    fleetTop: '#DDE6EE', fleetRoof: '#F4F8FB', fleetSide: '#8C9AA8', fleetSide2: '#5E6B78', fleetLine: '#6F7D8B', fleetO: '#05070B',
    glass: '#0E3A4F', glint: '#7FF0FF', head: '#CFF6FF', tail: '#7A2424', amber: '#FF9A1F',
    podBody: '#18213A', podO: '#05070B', pod2: '#121A2E', pod3: '#0E1424', podCrown: '#3FD0FF', podHi: '#B6F0FF',
    rail: '#2B3446', railSide: '#1A2131', railO: '#3FD0FF',
    cone: '#FF8A1F',
    ink: '#F4F8FA', label: '#7FA8BC', warn: '#FF3D3D', fleet: '#5E6B78', structure: '#3A4252',
    cueHalo: '#FFB0B0', nose: '#F4F8FA', tyre: '#05070B',
    rimLight: '#E6F4FF', rimDark: '#5E7080', // dark ground: the dummy's outer edge is a rim, lit top-right (4.1.3 light)
    barkFill: '#0B1020', barkEdge: '#6FE4FF', barkInk: '#E6F4FF', barkDim: '#7FA8BC', // bark bubbles: dark glass, LED edge
    // Dark-ground outline rule for every sprite: no black edge on dark ground. Rims lit top-right, in a value
    // hierarchy: dummy (above) > cars > cones > barriers > pods > blocks. Inner lines keep their dark inks.
    carRim: '#8FDFFF', carRimD: '#3A4A66', coneRim: '#F2A65A', coneRimD: '#7A4420', jerseyRim: '#8494B8', jerseyRimD: '#2C3550',
    podRim: '#5B6E9C', podRimD: '#262F48', bldgRim: '#46557D', bldgRimD: '#1E263B', foliageO: '#1F4A22',
    mod: '#3FD0FF', modL: '#B6F0FF', modD: '#1A6FA0', // HUD chassis modules
    chrome: '#7D8AA3', chromeL: '#D6F6FF', chromeD: '#353D52', modGlow: '#FF5FD2', // HUD chassis: gunmetal joints, neon LEDs
    tagFill: '#1840C8', tagInk: '#FFFFFF', tagBorder: '#6FE4FF', tagSpentFill: '#F4F8FA', tagSpentInk: '#1840C8',
    popInk: '#FFFFFF', popOutline: '#1840C8', stampFill: '#0B0E17', stampOutline: '#FFB0B0',
    podStripes: ['#2F6BFF', '#3FD0FF', '#9B6BFF', '#E6F4FF'], reflect: ['#2F6BFF', '#3FD0FF', '#9B6BFF', '#FF5FD2', '#E6F4FF'], edgeLight: '#E6F4FF', flowers: 40,
    bldgRoof: '#1A2133', bldgEdge: '#2C3650', bldgFace: '#0D1220', bldgDark: '#080C16', bldgUnit: '#3A4560', bldgUnitD: '#222A3C',
    bldgLed: ['#3FD0FF', '#2F6BFF', '#9B6BFF', '#FF5FD2', '#E6F4FF'], bldgOutline: '#05070B', spill: true,
    jersey: '#3A4252', jerseyTop: '#6B7894', jerseyLed: '#3FD0FF', jerseyO: '#05070B',
    puddle: '#1B2B45', puddleRim: '#5B7BB0', puddleLip: '#0E1422', puddleHi: '#BFEFFF', gate: '#7FA8BC',
    deck: '#3B4459', deck2: '#323A4D', deckJoint: '#262C3B', column: '#4A5470', columnD: '#262D40',
    beam: '#E8F7FF', brakeGlow: '#FF3A3A', bldgRoof1: '#252E44',
  };
  // Cyber: the night palette with a city instead of parkland. Decks for lawns, blocks for trees, jersey barriers for hedges.
```

## The learner's red recolour (`redSprite`; `g.red(hex)` applies it)

```js
  function redSprite(S) {
    if (redArt.has(S)) return redArt.get(S);
    const LV = liveryOf(); if (LV) { const R0 = liverySprite(S, LV); redArt.set(S, R0); return R0; }
    const d = new Uint32Array(S.d.length);
    for (let i = 0; i < d.length; i++) {
      const c = S.d[i]; if (!c) { d[i] = 0; continue; }
      const r = c & 255, g = (c >>> 8) & 255, b = (c >>> 16) & 255, a = c >>> 24, l = 0.3 * r + 0.59 * g + 0.11 * b;
      if (l < 70 || (b > r + 25 && b > g)) { d[i] = c; continue; } // glass, tyres, rims: as they are
      const k = l / 255, nr = Math.min(255, Math.round(120 + 135 * k)), ng = Math.round(28 + 70 * k * k), nb = Math.round(28 + 60 * k * k);
      d[i] = ((a << 24) | (nb << 16) | (ng << 8) | nr) >>> 0;
    }
    const R = Object.assign(Object.create(Object.getPrototypeOf(S)), S, { d });
    redArt.set(S, R); return R;
  }
```

## Today's kit (Edit 116): one part a rung, in its rung colour, on a 64 x 30 unit sedan frame, nose +x

```js
  const KIT = { side: '#7fa8bc', cone: '#ff8a1f', ink: 'rgba(8,10,14,0.9)',
    name: ['', 'Lens bar', 'Mirror pods', 'Roof puck', 'Link fin', 'Bumper strip', 'Tally marks', 'Searchlight'],
    slot: ['', 'Windscreen', 'Both mirrors', 'Roof', 'Rear roof', 'Front bumper', 'Bonnet', 'Roof, front'],
    at: [null, [13.5, 0], [6.5, 18.5], [-7, 0], [-21, 0], [31.5, 0], [22, 0], [1, -7]] };
  const kitSeen = new WeakMap(), kitTop = () => Math.max(1, DUELR().length - 1 || 7), kitGlintS = () => (T.DP || T.P)['duel.kitGlintSeconds'] || 3;
  function kitPieces(rung, o) { // o: { t, link, mem, search, drop: [rung, dy] }; the slots in Edit 116 §116.2
    const ink = KIT.ink, dy = (n) => (o.drop && o.drop[0] === n ? o.drop[1] : 0), on = (n) => rung >= n && (!o.only || o.only === n);
    const box = (n, x, y, w, h, col) => { y += dy(n); rect(x - 0.9, y - 0.9, w + 1.8, h + 1.8, ink); rect(x, y, w, h, col); };
    const dot = (n, x, y, r, col) => { y += dy(n); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x, y, r + 0.9, 0, TAU); ctx.fill(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); };
    if (on(1)) box(1, 12, -5, 3, 10, C.text); // R1 forward camera: a lens bar at the windscreen's top
    if (on(2)) { dot(2, 6.5, -18.5, 2.6, KIT.side); dot(2, 6.5, 18.5, 2.6, KIT.side); } // R2 side sensors: a pod on each mirror
    if (on(3)) { dot(3, -7, 0, 5, '#0d0f13'); const a = o.t * 6, y = dy(3); ctx.strokeStyle = '#c3a6ff'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(-7, y, 4, 0, TAU); ctx.moveTo(-7, y); ctx.lineTo(-7 + Math.cos(a) * 4, y + Math.sin(a) * 4); ctx.stroke(); } // R3 roof lidar: a spinning puck
    if (on(4)) { box(4, -22, -0.8, 1.6, 1.6, C.cam); box(4, -27, -0.6, 6, 1.2, C.cam); dot(4, -27, 0, 1.6, C.cam); if (o.link) { ctx.save(); ctx.strokeStyle = C.cam; ctx.lineWidth = 1.4; ctx.globalAlpha = 0.55 + 0.45 * Math.sin(o.t * 12); for (const r of [5, 9]) { ctx.beginPath(); ctx.arc(-24, dy(4), r, Math.PI * 0.62, Math.PI * 1.38); ctx.stroke(); } ctx.restore(); } } // R4 street cameras: a link fin; it pulses while a camera reports you
    if (on(5)) box(5, o.seat ? 27.5 : 30, -12, 3, 24, KIT.cone); // R5 road items: a bumper strip
    if (on(6)) for (let i = 0; i < 3; i++) box(6, 17 + i * 4, -6, 2, 12, i < o.mem ? '#ff5a5a' : 'rgba(255,90,90,0.3)'); // R6 crash memory: a tally a remembered spot
    if (on(7)) { if (o.search) { const a = -Math.PI / 2 + Math.sin(o.t * 3) * 0.9; ctx.save(); ctx.fillStyle = 'rgba(255,90,90,0.25)'; ctx.beginPath(); ctx.moveTo(1, -7); ctx.arc(1, -7, 46, a - 0.3, a + 0.3); ctx.closePath(); ctx.fill(); ctx.restore(); }
      dot(7, 1, -7, 2.6, o.search && Math.floor(o.t * 6) % 2 === 0 ? '#ff5a5a' : 'rgba(255,90,90,0.6)'); } // R7 search: a roof searchlight; it sweeps while it searches
  }
  function kitGlint(n, e) { // rings out of the newest piece's slot, one a second
    const at = KIT.at[n]; if (!at) return; const ph = e % 1;
    ctx.save(); ctx.strokeStyle = C.text; ctx.lineWidth = 1.4; ctx.globalAlpha = 1 - ph;
    for (const sy of n === 2 ? [-1, 1] : [1]) { ctx.beginPath(); ctx.arc(at[0], at[1] * sy, 4 + 10 * ph, 0, TAU); ctx.stroke(); }
    ctx.restore();
  }
  function kitCar(c, rung, o, e) { ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h); ctx.scale(c.L / 64, c.W / 30); kitPieces(rung, o); if (e != null && rung >= 1) kitGlint(rung, e); ctx.restore(); }
  function kitMem() { return Math.min(T.crashes ? T.crashes.length : 0, Math.round(T.P['duel.memorySites'] || 3)); }
  function drawKit(c) { // the field: the kit on the red car, live
    let k = kitSeen.get(T); if (!k || k.rung !== T.rung || T.t < k.t0) { k = { rung: T.rung, t0: T.t }; kitSeen.set(T, k); } // a new rung (a fitting, a new puzzle): glint again
    const e = T.t - k.t0, cam = T.rung >= 4 && T.seeingCamera ? T.seeingCamera() : null;
    kitCar(c, T.rung, { t: T.t, link: !!(cam && c.hidden && (c.noticed || (c.hz && c.hz.inPath))), mem: kitMem(), search: !!(c.lkp && !c.lkp.found) }, e < kitGlintS() ? e : null);
  }
  function plateMarks(c, st) { // under Prototype 9's roof plate (game.js tagRect): seven squares filled to the rung; ? or ! beside the plate, white
    const U = (Gk && Gk.U) || 2, top = Math.round(c.y / U) - 12 - (c._lift || 0), y0 = (top - 2) * U, n = kitTop(), sq = 6, w = n * sq - 2, x0 = c.x - w / 2;
    rect(x0 - 2, y0 - 1, w + 4, 7, 'rgba(12,14,20,0.75)'); for (let i = 0; i < n; i++) rect(x0 + i * sq, y0, 4, 5, i < T.rung ? C.red : 'rgba(255,255,255,0.28)');
    if (st) { const g = st >= 3 ? '!' : '?'; label(g, c.x + 24, y0 - 6, st >= 3 ? 14 : 12, C.text); }
    if (c.lkp && !c.lkp.found) label('?', c.x + 24, y0 - 6, 12, SCAN.mem);
  }
```

## The upgrade screen (Edit 119)

- 1280 x 720. Panel 276, 66, 728 x 588 (#0b0f1a, cyan frame). Hero column 300, 90, 290 x 454: the car, nose up, centred on 450, 360. Pips (the seven rungs) at 330, 556.
- The drone lowers each part on a tether to above the nose, lets go; it falls into its slot. Brackets (kit colour) mark the slot first. On landing: rings and a burst from the slot; rays from the car's centre.
- Text column at x 600: "LUMINARY™ LEARNED", the part name (Nunito 900, red), the sensor, one sentence, the replay box.

# Renders of your module (Read every one)

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_upgrade_A1_0_6.png` · The car upgrade screen after puzzle A1 at 0.6 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_upgrade_A1_1_15.png` · The car upgrade screen after puzzle A1 at 1.15 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_upgrade_A1_3.png` · The car upgrade screen after puzzle A1 at 3 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_upgrade_C2_0_6.png` · The car upgrade screen after puzzle C2 at 0.6 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_upgrade_C2_1_15.png` · The car upgrade screen after puzzle C2 at 1.15 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_upgrade_C2_3.png` · The car upgrade screen after puzzle C2 at 3 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_sheet_LUMINARY.png` · Your LUMINARY: the body with pieces to rung 0, 3 and 7 at 3x (as on the upgrade screen); each piece alone at 2x; the full car at 1x; the in-level sprite in your livery, 1x and 4x, on the night road.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_sheet_VANGUARD.png` · Your VANGUARD: the body with pieces to rung 0, 3 and 7 at 3x (as on the upgrade screen); each piece alone at 2x; the full car at 1x; the in-level sprite in your livery, 1x and 4x, on the night road.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/round_2/shots/prev_sheet_GENESIS.png` · Your GENESIS: the body with pieces to rung 0, 3 and 7 at 3x (as on the upgrade screen); each piece alone at 2x; the full car at 1x; the in-level sprite in your livery, 1x and 4x, on the night road.

# The level, for comparison (Read again as needed)

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/ref/ref_sprites.png` · Every in-level car sprite from pixel.js carSprite: east and nose up at 1x (top row) and 4x; the learner (sedan recoloured red, redSprite) nose up at 4x and 6x, and braking at 4x; the dummy, a cone, the drone. Art px: 1 px = 2 world units in play.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/ref/ref_play.png` · Play, puzzle 1 (A1): the learner in its lane, the dummy, the tile art and the HUD. The field is 800 x 640 screen px at 1280 x 720.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/ref/ref_play_crop.png` · A 120 x 90 crop round the learner in play, as rendered (upscale it in your head: this is 1 screen px per pixel).
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/ref/ref_gift.png` · The Dummy Chassis gift screen, settled: the doll is 4x pixel art (64 x 108 art px). The family the car upgrade screen belongs to.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/ref/ref_upgrade_A1_3.png` · The car upgrade screen after puzzle A1 at 3 s (pinned) as built in P11.3: the vector kit sedan (kitBody) pixel-scaled.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261110-222605-car-design/ref/ref_upgrade_C2_3.png` · The car upgrade screen after puzzle C2 at 3 s (pinned) as built in P11.3: the vector kit sedan (kitBody) pixel-scaled.