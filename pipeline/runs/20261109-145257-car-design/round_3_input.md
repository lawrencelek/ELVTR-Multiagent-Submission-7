# Round 3: review and fix

Review the renders of your module from round 2 as if someone else drew them, then return the corrected module (round 2+ output).

# The brief (the user, verbatim)

Get a design agent to design a more graphically appropriate big car icon for upgrades, consistent with the rest of the level style. RED-01 should have a specific model number, taken from the style guide. In NOX, the cars are called via classes. LUMINARY (CEO car), VANGUARD (police car), ENIGMA (delivery car), GENESIS (sports car). this can be Luminary(TM) model to start with. Then for next maps VANGUARD (police/security car), and ENIGMA. The upgrades can be also relevant to the functioning of each car.

# Your round 1 spec

```json
{
 "verdict_current": "Today's hero (ref_upgrade_A1_3, ref_upgrade_C2_3) is a vector sedan pixel-scaled. It has a flat #d8343a body with no 1-px rim, no extrusion (no grey rear face), no head or tail lights and no stair-stepped glass. Its parts are soft round blobs and its mirrors are flat tabs, so it reads as clip art pasted over the level, not as the S01 sprite from ref_sprites seen closer.",
 "style_rules": [
  "Projection: nose up, one rounded-rectangle footprint. The top face is the footprint lifted by the extrusion. The rear face shows below it, fleetSide #8C9AA8, with its bottom row fleetSide2 #5E6B78. Side faces never show left or right.",
  "The top-face row directly above the rear face is fleetLine #6F7D8B. It is the fold line, and it follows the rounded rear corners.",
  "Outside ring: 1-px rim. #8FDFFF where the edge faces up or right, #3A4A66 elsewhere. Never a black edge on dark ground.",
  "Body tones come only from redSprite on fleet greys: top #F1544C (fleetTop), roof #FB5E54 (fleetRoof). Creases and cowl use red() of mid greys (#D23B37, #BB2D2B). fleetSide, fleetLine, glass, head, tail and chrome are unchanged, as redSprite leaves them.",
  "Glass is flat #0E3A4F bands that span the cabin width minus the pillars. Their edges stair-step 1 px every 4 rows. One 2-px-wide 45° glint (#7FF0FF) sits top right, because the light comes from the top right.",
  "Headlights are #CFF6FF blocks in the front corners, clipped by the nose curve. Tail lights are #7A2424 blocks in the rear corners and turn #FF3D3D when braking.",
  "Inner details have no outline (glass, lights, light bar). Parts that sit on the red body get a 1-px #05070B ink ring and a dark housing (podBody #18213A, pod3, chromeD), because rungs 6 and 7 (#ff5a5a) match the body red.",
  "Scale: hero ≈ 4 hero px for each in-level px (sedan 25×13 h3 → 96×45 h8). Glyphs are 3×5, plates 15×7, the same font as the in-level S01 tag.",
  "Symmetric about one centre column (odd W). Asymmetric details only where the job needs them: police strobes blue left and red right, the driver's pillar spot, specular pixels on the right."
 ],
 "classes": [
  {
   "class": "LUMINARY",
   "model": "SED-01-001",
   "silhouette": "Stretched sedan 45×96 footprint (ratio 2.13, the in-level sedan is 1.92) with front corners r9 and rear r8. Long bonnet (rows 10–29), long roof (42–71), short rear glass, long boot. 4×6 mirror caps stand out 4 px at the windscreen base. Extrusion 8.",
   "details": [
    "Vertical chrome grille 11×6, slats alternating chromeL/chromeD, under a chrome frame row",
    "Single-column chrome mascot on the bonnet nose (rows 10–12)",
    "Two crease lines at v=±9 down the bonnet",
    "Chrome trim row under the windscreen (row 29) and under the rear glass (row 80)",
    "Glass sunroof 15×8 at the roof front; a 1-px drip rail in crease red at v=±17",
    "Chrome bar between the tail lights (row 92); boot-lid seams at v=±15",
    "Rear face: chrome bumper strip, then a blue S01 plate (tagFill/tagInk), the in-level roof tag"
   ],
   "buffer": [
    57,
    108
   ]
  },
  {
   "class": "VANGUARD",
   "model": "POL-01-001",
   "silhouette": "Wider, shorter sedan 47×90 with corners r7 and a gunmetal push bar 27 px wide, 5 rows ahead of the nose on two uprights. 5×7 mirrors. Light bar across the roof front. Extrusion 8.",
   "details": [
    "Light bar rows 41–44, v≤16: podBody frame, 4-px lamps. Blue (#3FD0FF) on the left and red (#FF3D3D) on the right alternate at 2 Hz; the dim states are modD and tail",
    "Black grille with two hidden strobes (blue left, red right) that blink in phase with the bar",
    "Dark cowl line instead of chrome; black panel between the tail lights; gunmetal rear bumper strip",
    "Rear face: P01 plate"
   ],
   "buffer": [
    59,
    107
   ]
  },
  {
   "class": "ENIGMA",
   "model": "VAN-01-001",
   "silhouette": "Cab-forward van. The cab is 45 px wide (rows 0–33) and the cargo box steps out to 49 px (rows 34–95). Square box rear r3, round cab nose r8. 5×7 van mirrors. Extrusion 12, so a tall rear face with doors.",
   "details": [
    "Black-gunmetal bumper (rows 0–3); square headlamps with amber corner indicators",
    "Horizontal-slat grille; short bonnet; wide windscreen",
    "Grey fleetLine across the box front edge (row 34): the step up to the box",
    "Box roof ribs in pod2 every 6 rows (the in-level van's roof stripes); fleetLine roof rails at v=±22",
    "Tall vertical tail lamps at the box corners",
    "Rear face: two doors (centre split, handles, hinges), a chrome-and-gunmetal step bumper, V01 plate"
   ],
   "buffer": [
    61,
    112
   ]
  }
 ],
 "kit": [
  {
   "class": "LUMINARY",
   "rung": 1,
   "name": "VALET LENS",
   "look": "Chrome-cased lens bar at the top of the windscreen behind the rear-view mirror: a white lens with a dark pupil.",
   "why": "A chauffeur car watches the lane ahead so the board's ride never jolts."
  },
  {
   "class": "LUMINARY",
   "rung": 2,
   "name": "MIRROR EYES",
   "look": "Blue-grey sensor lens set into each mirror cap, with a specular pixel at its top right.",
   "why": "An executive car keeps its lines clean, so its side sensors hide in the mirrors."
  },
  {
   "class": "LUMINARY",
   "rung": 3,
   "name": "HALO DOME",
   "look": "Flush 9×9 glass dome mid-roof with a violet ring and a violet sweep line turning inside.",
   "why": "A CEO car won't wear a bucket on its roof; the lidar sits flush under glass."
  },
  {
   "class": "LUMINARY",
   "rung": 4,
   "name": "SHARK FIN",
   "look": "Dark shark-fin aerial at the roof's rear edge with a mint link strip down its spine.",
   "why": "Luxury cars already carry a shark fin; this one talks to the street cameras."
  },
  {
   "class": "LUMINARY",
   "rung": 5,
   "name": "PARK RADAR",
   "look": "Dark strip across the front bumper with six orange parking-sensor dots.",
   "why": "Executive cars have parking sensors; now they read cones and road items."
  },
  {
   "class": "LUMINARY",
   "rung": 6,
   "name": "LEDGER",
   "look": "Chrome-topped plate on the bonnet with three red lamps, one lit per remembered crash spot.",
   "why": "The board's car keeps minutes; it logs every incident."
  },
  {
   "class": "LUMINARY",
   "rung": 7,
   "name": "SUNROOF LAMP",
   "look": "Round gunmetal lamp risen through the sunroof with a red lens that flashes while it searches.",
   "why": "The chauffeur never steps out; a lamp rises through the sunroof to look."
  },
  {
   "class": "VANGUARD",
   "rung": 1,
   "name": "DASH CAM",
   "look": "Black dash-cam box at the windscreen top: white lens, dark pupil, a red REC dot blinking at 1 Hz.",
   "why": "Every patrol car records the road ahead."
  },
  {
   "class": "VANGUARD",
   "rung": 2,
   "name": "PLATE READER",
   "look": "Black pod on each mirror with twin blue-grey lenses facing forward and back.",
   "why": "Patrol cars read both pavements as they pass."
  },
  {
   "class": "VANGUARD",
   "rung": 3,
   "name": "SPEED LIDAR",
   "look": "Chamfered 9×9 roof turret with a violet bar rotating in four 45° steps.",
   "why": "Police already carry speed lidar; this one scans for bodies."
  },
  {
   "class": "VANGUARD",
   "rung": 4,
   "name": "RADIO MAST",
   "look": "Black aerial base on the rear roof with a mint link light and a chrome whip trailing back.",
   "why": "A patrol car stays on the radio to dispatch, and dispatch relays the cameras."
  },
  {
   "class": "VANGUARD",
   "rung": 5,
   "name": "BAR RADAR",
   "look": "Orange sensor slit along the push bar's centre, split into lamps by dark gaps.",
   "why": "The push bar clears the road; now it reads cones and road items first."
  },
  {
   "class": "VANGUARD",
   "rung": 6,
   "name": "CASE FILE",
   "look": "Black clipboard on the bonnet with a chrome clip and three red tally bars, one lit per crash spot.",
   "why": "Police open a case on every crash scene."
  },
  {
   "class": "VANGUARD",
   "rung": 7,
   "name": "PILLAR SPOT",
   "look": "Gunmetal spotlight on the driver's A-pillar with a red lens that flashes while searching.",
   "why": "The A-pillar spotlight is the patrol car's search tool."
  },
  {
   "class": "ENIGMA",
   "rung": 1,
   "name": "CAB CAM",
   "look": "Black camera bar at the cab windscreen top: white lens, dark pupil.",
   "why": "A delivery van creeps along the kerb lane; the cab camera watches it."
  },
  {
   "class": "ENIGMA",
   "rung": 2,
   "name": "WING EYES",
   "look": "Blue-grey lens filling each big van mirror, with a dark housing row under it.",
   "why": "Vans have huge blind spots; their big mirrors carry the side sensors."
  },
  {
   "class": "ENIGMA",
   "rung": 3,
   "name": "DOCK LIDAR",
   "look": "Violet-ringed puck on a gunmetal cross-bar across the box roof, with a white tick orbiting the ring.",
   "why": "It maps loading docks for the drop; now it maps you."
  },
  {
   "class": "ENIGMA",
   "rung": 4,
   "name": "TRACKER",
   "look": "Low black telematics box on the rear roof with a mint LED strip.",
   "why": "Every white-glove parcel is tracked; the tracker now hears the street cameras."
  },
  {
   "class": "ENIGMA",
   "rung": 5,
   "name": "KERB RADAR",
   "look": "Orange sensor strip across the black bumper, split into five-pixel lamps.",
   "why": "A delivery van stops at kerbs all day; it reads what lies there."
  },
  {
   "class": "ENIGMA",
   "rung": 6,
   "name": "MANIFEST",
   "look": "Black board on the box header above the cab with three red lamps, one lit per crash spot.",
   "why": "A van logs every drop; now it logs every crash spot too."
  },
  {
   "class": "ENIGMA",
   "rung": 7,
   "name": "DOOR LAMP",
   "look": "Gunmetal work lamp on the cab roof front, red lens facing forward, flashing while searching.",
   "why": "It finds door numbers in the dark; now it finds you."
  }
 ],
 "model_line": "Panel top left in label ink #7FA8BC: 'SED-01-001 · LUMINARY™ · AMBASSADOR' (POL-01-001 · VANGUARD™ · MARSHAL; VAN-01-001 · ENIGMA™ · CONCIERGE). The car's rear plate repeats the in-level tag (S01 / P01 / V01) in tagFill/tagInk.",
 "sentences": {
  "LUMINARY": {
   "1": "It sees you in its lane and brakes for the board.",
   "2": "Its mirrors now watch the pavements on both sides.",
   "3": "The dome sees you jump or drop onto its road.",
   "4": "Street cameras tell the chauffeur where you hide.",
   "5": "It reads cones and road items in its path.",
   "6": "It logs every crash spot and slows there next time.",
   "7": "It stops, raises the lamp and searches where it lost you."
  },
  "VANGUARD": {
   "1": "It brakes when its dash cam sees you in the lane.",
   "2": "It reads both pavements as it passes.",
   "3": "Its lidar catches you jumping onto the road.",
   "4": "Dispatch relays the street cameras: it knows where you hide.",
   "5": "Its push bar reads cones and road items ahead.",
   "6": "It opens a case on every crash spot.",
   "7": "It sweeps the pillar spotlight where it last saw you."
  },
  "ENIGMA": {
   "1": "Its cab camera sees you in the lane; it brakes.",
   "2": "Its wide mirrors cover the blind spots on both sides.",
   "3": "Its roof lidar sees you jump or drop onto the road.",
   "4": "Its tracker hears the street cameras: it knows where you hide.",
   "5": "It reads cones and kerb items before it stops.",
   "6": "Every crash spot goes on its manifest.",
   "7": "It lights the door lamp and searches where it lost you."
  }
 },
 "risks": [
  "piece() detects 'alone' with !g.get(cx, Y0+L/2). If g.get returns a non-falsy value for an empty pixel, falling parts lose their rim. The host can pass o.alone explicitly.",
  "piece() calls g.rim only when alone. If the host composites the falling part over the body from that buffer, its rim draws over the body. That is intended for readability.",
  "1-px features below the 3x read threshold: the VANGUARD whip, its REC dot, and the LUMINARY mascot column. Check them in the round-2 renders.",
  "ENIGMA is 112 rows (336 screen px, 74% of the hero column), above two thirds; the van's extrusion of 12 drives that.",
  "Slot moves: VANGUARD 7 goes to the driver's A-pillar (the light bar takes the roof front); VANGUARD 5 goes onto the push bar ahead of the bumper; ENIGMA 6 goes to the box header (the van bonnet is 8 rows); LUMINARY 4 overlaps the first row of rear glass (the fin sits on the roof's rear edge).",
  "Rung 3 on LUMINARY (glass core) and ENIGMA (dark core with cross-bar) share the ring form. At 3x the difference is the cross-bar and the core colour.",
  "g.red is used when present, otherwise the local copy of redSprite's formula; outputs match only if g.red takes a '#rrggbb' fleet colour.",
  "Light-bar and strobe blinking runs on o.t (2 Hz). If the host pins t for screenshots, every capture shows one phase."
 ]
}
```

# Your last review

```json
{
 "verdict": "The three bodies match the level's family: red top face, grey rear face, 1-px rim, stair-stepped glass and the corner lights. The parts break in four places: on LUMINARY the dome and the fin merge into one shape, ENIGMA's camera and lamp stack into one black block, VANGUARD's lidar barely shows its violet, and ENIGMA's ribs turn the box into a black-striped grille.",
 "findings": [
  {
   "id": "D1",
   "severity": "major",
   "shots": [
    "prev_upgrade_C2_3",
    "prev_sheet_LUMINARY"
   ],
   "what": "LUMINARY rung 3 HALO DOME (centre ty 58, ink rows 53–63) and rung 4 SHARK FIN (ink rows 64–73) have touching ink rings. At 3x they read as one black keyhole hanging from the dome. The fin's base also covers the first row of rear glass (ty 72).",
   "fix": "Move the dome to ty 57 (ink 52–62). Shorten the fin to ty 65–70 (ink 64–71) so it ends on the roof's last row. Shrink rung 7 SUNROOF LAMP to r2 (ink 44–50). That leaves red gap rows 42–43, 51 and 63 between rungs 1, 7, 3 and 4."
  },
  {
   "id": "D2",
   "severity": "major",
   "shots": [
    "prev_sheet_ENIGMA"
   ],
   "what": "ENIGMA rung 1 CAB CAM ink (rows 23–27) and rung 7 DOOR LAMP ink (rows 28–32) sit on the centre column and touch. At rung 7 they form one 7×10 black block, so neither part reads.",
   "fix": "Move DOOR LAMP to the left (kerb-side) corner of the cab roof: 6×3 gunmetal at v 11–16, ty 30–32, with a 4-px red lens on its front row. Its slot moves; the reason is that a door lamp lights the kerb side."
  },
  {
   "id": "D3",
   "severity": "major",
   "shots": [
    "prev_sheet_ENIGMA",
    "prev_sheet_ENIGMA 1x"
   ],
   "what": "ENIGMA box ribs in pod2 every 6 rows (ty 40…94, 10 lines) turn the cargo roof into a black-and-red shutter. The level's van shows 3–4 sparse roof lines. The DOCK LIDAR cross-bar and the TRACKER get lost among the stripes.",
   "fix": "Draw three ribs only, at ty 44, 66 and 88, v ≤ 19. They clear the lidar (53–63), the tracker (81–86) and the tail lamps (v ≥ 21)."
  },
  {
   "id": "D4",
   "severity": "major",
   "shots": [
    "prev_sheet_VANGUARD"
   ],
   "what": "VANGUARD rung 3 SPEED LIDAR is a 9×9 pod3 block with a single 1-px violet diagonal. At 3x it reads as a black 'no entry' disc, and the rung's violet is 7 px in total. Its corners are chamfered by a single pixel only.",
   "fix": "Make it an octagon (|dx|+|dy| ≤ 6, a 2-step chamfer) with a 1-px #c3a6ff ring and a pod3 core. Keep a 5-px violet bar rotating inside the core in four 45° steps."
  },
  {
   "id": "D5",
   "severity": "major",
   "shots": [
    "prev_sheet_VANGUARD"
   ],
   "what": "VANGUARD rung 6 CASE FILE has three 3×6 red bars in a 13×8 black box. They repeat the light bar's red lamps and the grille strobes, so at 3x and at 1x the bonnet reads as a second light bar. It does not read as a clipboard.",
   "fix": "Make it a clipboard: an 11×8 podBody board at ty 12–19, a chrome clip 5×2 at ty 11–12 with a chromeL top, and three 7×1 horizontal tally lines at ty 14, 16 and 18 (red when lit, tail when not)."
  },
  {
   "id": "D6",
   "severity": "major",
   "shots": [
    "prev_sheet_LUMINARY",
    "prev_upgrade_A1_3"
   ],
   "what": "LUMINARY rung 5 PARK RADAR is 27 px wide (v ≤ 13 plus ink to v 14). Its ink ring covers the inner corners of both headlights (ty 2–5, v 11–14).",
   "fix": "Narrow the strip to v ≤ 9 (19 px, ink to v 10) with four 2×2 orange dots at v 2–3 and 6–7. The headlights stay whole."
  },
  {
   "id": "D7",
   "severity": "minor",
   "shots": [
    "prev_sheet_LUMINARY"
   ],
   "what": "The mascot has chromeD side pixels at ty 12 (v 1) under its column. At 3x it reads as a stray '+' under the grille, and at 1x as noise.",
   "fix": "Draw the mascot as one column at ty 10–11 (chromeL, chrome), with no side pixels."
  },
  {
   "id": "D8",
   "severity": "minor",
   "shots": [
    "prev_sheet_LUMINARY",
    "prev_upgrade_A1_0_6"
   ],
   "what": "The 15×8 sunroof is flat glass with no glint, so at rung 0 it reads as a hole in the roof rather than glass.",
   "fix": "Move the sunroof to ty 43–50 and give it the same 2-px 45° glint at its top right (s 4–7, rows 43–45) as the other glass bands."
  },
  {
   "id": "D9",
   "severity": "minor",
   "shots": [
    "prev_upgrade_A1_3",
    "prev_upgrade_C2_3"
   ],
   "what": "The panel prints 'SED-01-001 · AMBASSADOR'. The class name is missing from the model line.",
   "fix": "Add classes[cls].label = 'SED-01-001 · LUMINARY™ · AMBASSADOR' (and the same for POL and VAN) for the host to print verbatim."
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
  "D9"
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
    S: ['111', '100', '111', '001', '111'], P: ['111', '101', '111', '100', '100'], V: ['101', '101', '101', '101', '010'],
    0: ['111', '101', '101', '101', '111'], 1: ['010', '110', '010', '010', '111'],
  };
  // Footprint in top-face rows ty (0 = nose). hw: half-width beside the centre column. E: extrusion rows (rear face).
  const GEO = {
    LUMINARY: { W: 57, H: 108, hw: 22, L: 96, E: 8, Y0: 2, rcF: 9, rcR: 8 },
    VANGUARD: { W: 59, H: 107, hw: 23, L: 90, E: 8, Y0: 7, rcF: 7, rcR: 7 },
    ENIGMA: { W: 61, H: 112, hw: 24, cab: 22, cabEnd: 34, L: 96, E: 12, Y0: 2, rcF: 8, rcR: 3 },
  };
  const N4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const cxOf = (c) => (c.W - 1) >> 1;
  const hwAt = (c, ty) => (c.cab != null && ty < c.cabEnd ? c.cab : c.hw);
  const mod2 = (n) => ((n % 2) + 2) % 2;

  function foot(c, x, ty) { // pixel-centre test, as carSprite's inFoot
    if (ty < 0 || ty >= c.L) return false;
    const HW = hwAt(c, ty) + 0.5, a = Math.abs(x - cxOf(c)) + 0.5;
    if (a > HW) return false;
    const t = ty + 0.5, front = t < c.L / 2, rc = front ? c.rcF : c.rcR;
    const da = a - (HW - rc), dt = front ? rc - t : t - (c.L - rc);
    return !(da > 0 && dt > 0 && da * da + dt * dt > rc * rc);
  }
  function redOf(hex) { // redSprite's recolour, per colour
    const n = parseInt(String(hex).slice(1, 7), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255, l = 0.3 * r + 0.59 * g + 0.11 * b;
    if (l < 70 || (b > r + 25 && b > g)) return hex;
    const k = l / 255, h2 = (v) => v.toString(16).padStart(2, '0');
    return '#' + h2(Math.min(255, Math.round(120 + 135 * k))) + h2(Math.round(28 + 70 * k * k)) + h2(Math.round(28 + 60 * k * k));
  }
  function pal(g) { return Object.assign({}, DEF, (g && g.P) || {}); }
  function tones(g, P) {
    const red = g && typeof g.red === 'function' ? (h) => g.red(h) || redOf(h) : redOf;
    return { top: red(P.fleetTop), roof: red(P.fleetRoof), crease: red('#A6ACB2'), deep: red('#7C8086') };
  }
  const gl = (s, i, a, n) => i >= 0 && i < n && (s === a - i || s === a + 1 - i); // 2-px 45° glint band

  // Top face, by class: (k, ty, s = x - cx, v = |s|) -> colour
  const PAINT = {
    LUMINARY(k, ty, s, v) {
      const { P, T, br } = k;
      if (ty >= 2 && ty <= 5 && v >= (ty === 2 ? 12 : 11) && v <= (ty === 5 ? 17 : 19)) return P.head;
      if (ty >= 4 && ty <= 9 && v <= 5) return ty === 4 || v === 5 ? P.chrome : ty === 9 || v % 2 ? P.chromeD : P.chromeL;
      if (s === 0 && ty >= 10 && ty <= 11) return ty === 10 ? P.chromeL : P.chrome;
      if (v === 9 && ty >= 12 && ty <= 27) return T.crease;
      if (ty === 29 && v <= 19) return P.chrome;
      if (ty >= 30 && ty <= 41) return v <= 19 - ((ty - 30) >> 2) ? (gl(s, ty - 31, 15, 5) ? P.glint : P.glass) : T.top;
      if (ty >= 42 && ty <= 71) {
        if (ty >= 43 && ty <= 50 && v <= 7) return gl(s, ty - 43, 6, 3) ? P.glint : P.glass;
        return v <= 16 ? T.roof : v === 17 ? T.crease : T.top;
      }
      if (ty >= 72 && ty <= 79) return v <= 16 + ((ty - 72) >> 2) ? (gl(s, ty - 73, 12, 3) ? P.glint : P.glass) : T.top;
      if (ty === 80 && v <= 17) return P.chrome;
      if (ty >= 91 && ty <= 94 && v >= (ty === 94 ? 13 : 12)) return br ? P.warn : P.tail;
      if (ty === 92 && v <= 10) return P.chrome;
      if (v === 15 && ty >= 82 && ty <= 89) return T.crease;
      return T.top;
    },
    VANGUARD(k, ty, s, v) {
      const { P, T, br, ph } = k;
      const blue = ph ? P.modD : P.podCrown, red = ph ? P.warn : P.tail;
      if (ty >= 2 && ty <= 5 && v >= (ty === 2 ? 13 : 12) && v <= 20) return P.head;
      if (ty >= 2 && ty <= 7 && v <= 9) {
        if (ty >= 4 && ty <= 5 && v >= 6 && v <= 7) return s < 0 ? blue : red;
        return ty === 2 || v === 9 ? P.chromeD : P.podBody;
      }
      if (v === 8 && ty >= 10 && ty <= 24) return T.crease;
      if (ty === 27 && v <= 20) return T.deep;
      if (ty >= 28 && ty <= 38) return v <= 20 - ((ty - 28) >> 2) ? (gl(s, ty - 29, 16, 5) ? P.glint : P.glass) : T.top;
      if (ty >= 39 && ty <= 67) {
        if (ty >= 41 && ty <= 44 && v <= 16 && !((ty === 41 || ty === 44) && v === 16)) {
          if (ty === 41 || ty === 44 || v === 16 || v % 5 === 0) return P.podBody;
          return s < 0 ? blue : red;
        }
        return v <= 17 ? T.roof : v === 18 ? T.crease : T.top;
      }
      if (ty >= 68 && ty <= 75) return v <= 17 + ((ty - 68) >> 2) ? (gl(s, ty - 69, 13, 3) ? P.glint : P.glass) : T.top;
      if (ty === 76 && v <= 18) return T.crease;
      if (ty >= 84 && ty <= 88 && v >= (ty === 88 ? 13 : 12)) return br ? P.warn : P.tail;
      if (ty === 86 && v <= 10) return P.podBody;
      if (v === 16 && ty >= 78 && ty <= 83) return T.crease;
      return T.top;
    },
    ENIGMA(k, ty, s, v) {
      const { P, T, br } = k;
      if (ty <= 3 && v <= 18) return P.chromeD;
      if (ty >= 4 && ty <= 7 && v >= 13 && v <= 19) return P.head;
      if (ty >= 4 && ty <= 7 && v >= 20) return P.amber;
      if (ty >= 4 && ty <= 9 && v <= 10) return ty === 4 || v === 10 ? P.chrome : ty % 2 ? P.chromeD : P.podBody;
      if (v === 11 && ty >= 11 && ty <= 15) return T.crease;
      if (ty === 17 && v <= 19) return T.deep;
      if (ty >= 18 && ty <= 27) return v <= 20 - (((ty - 18) / 5) | 0) ? (gl(s, ty - 19, 16, 5) ? P.glint : P.glass) : T.top;
      if (ty >= 28 && ty <= 33) return v <= 18 ? T.roof : v === 19 ? T.crease : T.top;
      if (ty === 34) return P.fleetLine;
      if (ty >= 88 && ty <= 94 && v >= 21 && v <= 23) return br ? P.warn : P.tail;
      if (v <= 20) return v <= 19 && (ty === 44 || ty === 66 || ty === 88) ? P.pod2 : T.roof;
      if (v === 21) return T.crease;
      return v === 22 && ty >= 36 && ty <= 93 ? P.fleetLine : T.top;
    },
  };
  // Rear face, by class: (k, r = row below the top face, s, v, col) -> colour
  const FACE = {
    LUMINARY(k, r, s, v, col) { return r === 2 && v >= 9 && v <= 19 ? k.P.chrome : col; },
    VANGUARD(k, r, s, v, col) { return r === 2 && v >= 9 && v <= 20 ? k.P.chromeD : col; },
    ENIGMA(k, r, s, v, col) {
      const { P } = k;
      if (r >= 8) return r === 8 ? P.chrome : P.chromeD;
      if (s === 0 && r >= 0 && r <= 6) return P.fleetSide2;
      if (v === 2 && r === 3) return P.chromeD;
      if (v === 21 && (r === 1 || r === 6)) return P.chromeD;
      return col;
    },
  };
  function mirrorCap(put, k, ty0, mw, mh) {
    const { c, cx, P, T } = k, y0 = c.Y0 + ty0, xe = cx - hwAt(c, ty0) - 1;
    for (let j = 0; j < mh; j++) for (let i = 0; i < mw; i++) {
      if ((j === 0 || j === mh - 1) && i === mw - 1) continue;
      const col = j === mh - 1 ? P.fleetLine : i === mw - 1 ? T.crease : T.top;
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
    ENIGMA(put, k) { mirrorCap(put, k, 18, 5, 7); plate(put, k, k.c.Y0 + k.c.L + 5, 'V01'); },
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
  function sweep(s, x, y, a, len, c) { for (let i = 0; i <= len; i++) s.px(x + Math.round(i * Math.cos(a)), y + Math.round(i * Math.sin(a)), c); }

  const PARTS = {
    LUMINARY: {
      1(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 4, Y + 38, 9, 3, P.chrome); s.rect(cx - 3, Y + 39, 7, 1, K[1]); s.px(cx, Y + 39, P.glass); },
      2(s, k) { const { Y, P, K, W } = k; for (const [x, hi] of [[3, 4], [W - 5, W - 4]]) { s.rect(x, Y + 32, 2, 3, K[2]); s.px(hi, Y + 32, P.chromeL); } },
      3(s, k) { const { cx, Y, P, K, t } = k, y = Y + 57; s.disc(cx, y, 4, 20, K[3]); s.disc(cx, y, 2, 6, P.glass); sweep(s, cx, y, t * 6, 2, K[3]); },
      4(s, k) { const { cx, Y, P, K } = k; s.px(cx, Y + 65, P.podBody); s.rect(cx - 1, Y + 66, 3, 2, P.podBody); s.rect(cx - 2, Y + 68, 5, 3, P.podBody); s.rect(cx, Y + 66, 1, 4, K[4]); },
      5(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 9, Y + 1, 19, 2, P.podBody); for (const d of [2, 6]) { s.rect(cx - d - 1, Y + 1, 2, 2, K[5]); s.rect(cx + d, Y + 1, 2, 2, K[5]); } },
      6(s, k) { const { cx, Y, P, K, mem } = k; s.rect(cx - 6, Y + 16, 13, 5, P.podBody); s.rect(cx - 6, Y + 16, 13, 1, P.chrome); [-5, -1, 3].forEach((d, i) => s.rect(cx + d, Y + 17, 3, 3, i < mem ? K[6] : P.tail)); },
      7(s, k) { const { cx, Y, P } = k, y = Y + 47; s.disc(cx, y, 2, 5, P.chromeD); s.disc(cx, y, 1, 2, lamp(k)); s.px(cx + 1, y - 1, P.ink); },
    },
    VANGUARD: {
      1(s, k) { const { cx, Y, P, K, t } = k; s.rect(cx - 4, Y + 35, 9, 3, P.podBody); s.rect(cx - 2, Y + 36, 5, 1, K[1]); s.px(cx, Y + 36, P.glass); s.px(cx + 3, Y + 36, mod2(Math.floor(t * 2)) ? P.tail : P.warn); },
      2(s, k) { const { Y, P, K, W } = k; for (const x of [2, W - 5]) { s.rect(x, Y + 29, 3, 4, P.podBody); s.rect(x, Y + 29, 3, 1, K[2]); s.rect(x, Y + 32, 3, 1, K[2]); } },
      3(s, k) {
        const { cx, Y, P, K, t } = k, y = Y + 53;
        for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
          const ax = Math.abs(dx), ay = Math.abs(dy); if (ax + ay > 6) continue;
          s.px(cx + dx, y + dy, ax === 4 || ay === 4 || ax + ay === 6 ? K[3] : P.pod3);
        }
        const d = [[1, 0], [1, 1], [0, 1], [-1, 1]][((Math.floor(t * 8) % 4) + 4) % 4];
        for (let i = -2; i <= 2; i++) s.px(cx + i * d[0], y + i * d[1], K[3]);
      },
      4(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 2, Y + 62, 5, 3, P.podBody); s.rect(cx - 1, Y + 63, 3, 1, K[4]); s.rect(cx, Y + 65, 1, 5, P.chromeL); },
      5(s, k) { const { cx, Y, P, K } = k; for (let i = -8; i <= 8; i++) s.px(cx + i, Y - 4, Math.abs(i) === 4 || Math.abs(i) === 8 ? P.podBody : K[5]); },
      6(s, k) {
        const { cx, Y, P, K, mem } = k;
        s.rect(cx - 5, Y + 12, 11, 8, P.podBody); s.rect(cx - 2, Y + 11, 5, 2, P.chrome); s.rect(cx - 1, Y + 11, 3, 1, P.chromeL);
        [0, 1, 2].forEach((i) => s.rect(cx - 3, Y + 14 + 2 * i, 7, 1, i < mem ? K[6] : P.tail));
      },
      7(s, k) { const { cx, Y, P } = k, x = cx - 20, y = Y + 38; s.disc(x, y, 2, 6, P.chromeD); s.disc(x, y, 1, 2, lamp(k)); s.px(x + 1, y - 1, P.ink); },
    },
    ENIGMA: {
      1(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 3, Y + 24, 7, 3, P.podBody); s.rect(cx - 2, Y + 25, 5, 1, K[1]); s.px(cx, Y + 25, P.glass); },
      2(s, k) { const { Y, P, K, W } = k; for (const [x, hi] of [[4, 6], [W - 7, W - 5]]) { s.rect(x, Y + 19, 3, 3, K[2]); s.rect(x, Y + 22, 3, 1, P.podBody); s.px(hi, Y + 19, P.chromeL); } },
      3(s, k) {
        const { cx, Y, P, K, t } = k, y = Y + 58, a = t * 6;
        s.rect(cx - 14, y, 29, 1, P.chromeD); s.disc(cx, y, 4, 20, K[3]); s.disc(cx, y, 2, 6, P.podBody);
        s.px(cx + Math.round(3 * Math.cos(a)), y + Math.round(3 * Math.sin(a)), P.ink); s.px(cx, y, K[3]);
      },
      4(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 3, Y + 82, 7, 4, P.podBody); s.rect(cx - 3, Y + 82, 7, 1, P.chromeD); s.rect(cx - 2, Y + 84, 5, 1, K[4]); },
      5(s, k) { const { cx, Y, P, K } = k; for (let i = -15; i <= 15; i++) { const c = Math.abs(i) % 5 === 0 ? P.podBody : K[5]; s.px(cx + i, Y + 1, c); s.px(cx + i, Y + 2, c); } },
      6(s, k) { const { cx, Y, P, K, mem } = k; s.rect(cx - 8, Y + 35, 17, 5, P.podBody); [-6, -1, 4].forEach((d, i) => s.rect(cx + d, Y + 36, 3, 3, i < mem ? K[6] : P.tail)); },
      7(s, k) { const { cx, Y, P } = k; s.rect(cx - 17, Y + 30, 6, 3, P.chromeD); s.rect(cx - 16, Y + 30, 4, 1, lamp(k)); },
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
    LUMINARY: { W: 57, H: 108, model: 'SED-01-001', tag: 'S01', name: 'LUMINARY™', role: 'CEO car', fleet: 'sedan', line: 'Meridian Imperial', callsign: 'Ambassador', job: 'Chauffeurs the board', map: 1, mapName: 'Monument', label: 'SED-01-001 · LUMINARY™ · AMBASSADOR' },
    VANGUARD: { W: 59, H: 107, model: 'POL-01-001', tag: 'P01', name: 'VANGUARD™', role: 'police and security', fleet: 'police', line: 'Warden Imperial', callsign: 'Marshal', job: 'Escorts dignitaries and parades', map: 2, mapName: 'Parkland', label: 'POL-01-001 · VANGUARD™ · MARSHAL' },
    ENIGMA: { W: 61, H: 112, model: 'VAN-01-001', tag: 'V01', name: 'ENIGMA™', role: 'delivery', fleet: 'van', line: 'Porter Imperial', callsign: 'Concierge', job: 'White-glove deliveries to penthouses', map: 3, mapName: 'Waterfront', label: 'VAN-01-001 · ENIGMA™ · CONCIERGE' },
  };
  for (const k in classes) { const c = GEO[k]; classes[k].nose = [cxOf(c), c.Y0]; classes[k].centre = [cxOf(c), c.Y0 + ((c.L + c.E) >> 1)]; }

  const kit = {
    LUMINARY: {
      1: { name: 'VALET LENS', look: 'Chrome-cased lens bar at the windscreen top', why: 'A chauffeur car watches the lane so the board never jolts.' },
      2: { name: 'MIRROR EYES', look: 'Sensor lenses set into both mirror caps', why: 'An executive car hides its side sensors in its mirrors.' },
      3: { name: 'HALO DOME', look: 'Flush glass dome mid-roof, violet ring, turning sweep', why: 'A CEO car keeps its lidar flush under glass.' },
      4: { name: 'SHARK FIN', look: 'Shark-fin aerial at the roof edge, mint link strip', why: 'Luxury cars carry a shark fin; this one talks to cameras.' },
      5: { name: 'PARK RADAR', look: 'Four orange parking-sensor dots between the headlights', why: 'Its parking sensors now read cones and road items.' },
      6: { name: 'LEDGER', look: 'Chrome plate on the bonnet, a red lamp per crash spot', why: 'The board\'s car keeps minutes of every incident.' },
      7: { name: 'SUNROOF LAMP', look: 'Lamp risen through the sunroof, red lens', why: 'The chauffeur never steps out; the lamp looks instead.' },
    },
    VANGUARD: {
      1: { name: 'DASH CAM', look: 'Black dash-cam box, white lens, blinking REC dot', why: 'Every patrol car records the road ahead.' },
      2: { name: 'PLATE READER', look: 'Twin-lens pod on each mirror, fore and aft', why: 'Patrol cars read both pavements as they pass.' },
      3: { name: 'SPEED LIDAR', look: 'Octagonal roof turret, violet ring, rotating bar', why: 'Police carry speed lidar; this one scans for bodies.' },
      4: { name: 'RADIO MAST', look: 'Aerial base with mint link light and chrome whip', why: 'Dispatch relays what the street cameras see.' },
      5: { name: 'BAR RADAR', look: 'Orange sensor slit along the push bar', why: 'The push bar clears the road; now it reads it first.' },
      6: { name: 'CASE FILE', look: 'Clipboard on the bonnet, a red tally line per crash spot', why: 'Police open a case on every crash scene.' },
      7: { name: 'PILLAR SPOT', look: 'Spotlight on the driver\'s A-pillar, red lens', why: 'The pillar spotlight is the patrol car\'s search tool.' },
    },
    ENIGMA: {
      1: { name: 'CAB CAM', look: 'Camera bar at the cab windscreen top', why: 'A delivery van creeps the kerb lane; the cab cam watches it.' },
      2: { name: 'WING EYES', look: 'Sensor lens filling each big van mirror', why: 'Vans have huge blind spots; the big mirrors cover them.' },
      3: { name: 'DOCK LIDAR', look: 'Violet puck on a cross-bar over the box roof', why: 'It maps loading docks; now it maps you.' },
      4: { name: 'TRACKER', look: 'Telematics box on the rear roof, mint LED strip', why: 'Every parcel is tracked; the tracker hears the cameras.' },
      5: { name: 'KERB RADAR', look: 'Orange sensor strip across the black bumper', why: 'A van stops at kerbs all day and reads what lies there.' },
      6: { name: 'MANIFEST', look: 'Board on the box header, a red lamp per crash spot', why: 'A van logs every drop; now it logs every crash.' },
      7: { name: 'DOOR LAMP', look: 'Work lamp on the cab roof\'s kerb-side corner, red lens', why: 'It finds door numbers in the dark; now it finds you.' },
    },
  };

  const sentences = {
    LUMINARY: { 1: 'It sees you in its lane and brakes for the board.', 2: 'Its mirrors now watch the pavements on both sides.', 3: 'The dome sees you jump or drop onto its road.', 4: 'Street cameras tell the chauffeur where you hide.', 5: 'It reads cones and road items in its path.', 6: 'It logs every crash spot and slows there next time.', 7: 'It stops, raises the lamp and searches where it lost you.' },
    VANGUARD: { 1: 'It brakes when its dash cam sees you in the lane.', 2: 'It reads both pavements as it passes.', 3: 'Its lidar catches you jumping onto the road.', 4: 'Dispatch relays the street cameras: it knows where you hide.', 5: 'Its push bar reads cones and road items ahead.', 6: 'It opens a case on every crash spot.', 7: 'It sweeps the pillar spotlight where it last saw you.' },
    ENIGMA: { 1: 'Its cab camera sees you in the lane; it brakes.', 2: 'Its wide mirrors cover the blind spots on both sides.', 3: 'Its roof lidar sees you jump or drop onto the road.', 4: 'Its tracker hears the street cameras: it knows where you hide.', 5: 'It reads cones and kerb items before it stops.', 6: 'Every crash spot goes on its manifest.', 7: 'It lights the door lamp and searches where it lost you.' },
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
      const P = pal(g), T = tones(g, P), cx = cxOf(c), t = +o.t || 0;
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
        if (v === 2) put(x, y, at(x, y + 1) === 1 ? P.fleetLine : PAINT[cls](k, y - c.Y0, s, a));
        else put(x, y, FACE[cls](k, y - c.Y0 - c.L, s, a, at(x, y + 1) ? P.fleetSide : P.fleetSide2));
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
| LUMINARY™ | SED-01-001 | sedan | S01 | Meridian Imperial | Ambassador | Chauffeurs FARSIGHT board members | the CEO car, Map 1 (Monument): built now |
| VANGUARD™ | POL-01-001 | police | P01 | Warden Imperial | Marshal | Escorts dignitaries and parades | police and security, Map 2 (Parkland): designed now, built later |
| ENIGMA™ | VAN-01-001 | van | V01 | Porter Imperial | Concierge | White-glove deliveries to penthouses | delivery, Map 3 (Waterfront): designed now, built later |
| GENESIS™ | SPT-01-001 | sports | R01 | Comet Imperial | Aurum | Carries signed contracts between tower boardrooms | the sports car: named, no map yet; do not design |

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

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_upgrade_A1_0_6.png` · The car upgrade screen after puzzle A1 at 0.6 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_upgrade_A1_1_15.png` · The car upgrade screen after puzzle A1 at 1.15 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_upgrade_A1_3.png` · The car upgrade screen after puzzle A1 at 3 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_upgrade_C2_0_6.png` · The car upgrade screen after puzzle C2 at 0.6 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_upgrade_C2_1_15.png` · The car upgrade screen after puzzle C2 at 1.15 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_upgrade_C2_3.png` · The car upgrade screen after puzzle C2 at 3 s (pinned), with your hero car.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_sheet_LUMINARY.png` · Your LUMINARY: the body with pieces to rung 0, 3 and 7 at 3x (as on the upgrade screen); each piece alone at 2x; the full car at 1x.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_sheet_VANGUARD.png` · Your VANGUARD: the body with pieces to rung 0, 3 and 7 at 3x (as on the upgrade screen); each piece alone at 2x; the full car at 1x.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/round_2/shots/prev_sheet_ENIGMA.png` · Your ENIGMA: the body with pieces to rung 0, 3 and 7 at 3x (as on the upgrade screen); each piece alone at 2x; the full car at 1x.

# The level, for comparison (Read again as needed)

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/ref/ref_sprites.png` · Every in-level car sprite from pixel.js carSprite: east and nose up at 1x (top row) and 4x; the learner (sedan recoloured red, redSprite) nose up at 4x and 6x, and braking at 4x; the dummy, a cone, the drone. Art px: 1 px = 2 world units in play.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/ref/ref_play.png` · Play, puzzle 1 (A1): the learner in its lane, the dummy, the tile art and the HUD. The field is 800 x 640 screen px at 1280 x 720.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/ref/ref_play_crop.png` · A 120 x 90 crop round the learner in play, as rendered (upscale it in your head: this is 1 screen px per pixel).
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/ref/ref_gift.png` · The Dummy Chassis gift screen, settled: the doll is 4x pixel art (64 x 108 art px). The family the car upgrade screen belongs to.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/ref/ref_upgrade_A1_3.png` · The car upgrade screen after puzzle A1 at 3 s (pinned) as built in P11.3: the vector kit sedan (kitBody) pixel-scaled.
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-145257-car-design/ref/ref_upgrade_C2_3.png` · The car upgrade screen after puzzle C2 at 3 s (pinned) as built in P11.3: the vector kit sedan (kitBody) pixel-scaled.