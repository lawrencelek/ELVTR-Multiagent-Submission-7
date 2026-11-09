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