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
      if (s === 0 && ty >= 10 && ty <= 12) return ty === 10 ? P.chromeL : P.chrome;
      if (ty === 12 && v === 1) return P.chromeD;
      if (v === 9 && ty >= 12 && ty <= 27) return T.crease;
      if (ty === 29 && v <= 19) return P.chrome;
      if (ty >= 30 && ty <= 41) return v <= 19 - ((ty - 30) >> 2) ? (gl(s, ty - 31, 15, 5) ? P.glint : P.glass) : T.top;
      if (ty >= 42 && ty <= 71) {
        if (ty >= 44 && ty <= 51 && v <= 7) return P.glass;
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
      if (v <= 20) return ty > 35 && ty < 95 && (ty - 34) % 6 === 0 ? P.pod2 : T.roof;
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
      3(s, k) { const { cx, Y, P, K, t } = k, y = Y + 58; s.disc(cx, y, 4, 20, K[3]); s.disc(cx, y, 2, 6, P.glass); sweep(s, cx, y, t * 6, 2, K[3]); },
      4(s, k) { const { cx, Y, P, K } = k; s.px(cx, Y + 65, P.podBody); s.rect(cx - 1, Y + 66, 3, 3, P.podBody); s.rect(cx - 2, Y + 69, 5, 4, P.podBody); s.rect(cx, Y + 67, 1, 5, K[4]); },
      5(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 13, Y + 1, 27, 2, P.podBody); for (const d of [3, 7, 11]) { s.rect(cx - d - 1, Y + 1, 2, 2, K[5]); s.rect(cx + d, Y + 1, 2, 2, K[5]); } },
      6(s, k) { const { cx, Y, P, K, mem } = k; s.rect(cx - 6, Y + 16, 13, 5, P.podBody); s.rect(cx - 6, Y + 16, 13, 1, P.chrome); [-5, -1, 3].forEach((d, i) => s.rect(cx + d, Y + 17, 3, 3, i < mem ? K[6] : P.tail)); },
      7(s, k) { const { cx, Y, P } = k, y = Y + 47; s.disc(cx, y, 3, 12, P.chromeD); s.disc(cx, y, 2, 5, lamp(k)); s.px(cx + 1, y - 1, P.ink); },
    },
    VANGUARD: {
      1(s, k) { const { cx, Y, P, K, t } = k; s.rect(cx - 4, Y + 35, 9, 3, P.podBody); s.rect(cx - 2, Y + 36, 5, 1, K[1]); s.px(cx, Y + 36, P.glass); s.px(cx + 3, Y + 36, mod2(Math.floor(t * 2)) ? P.tail : P.warn); },
      2(s, k) { const { Y, P, K, W } = k; for (const x of [2, W - 5]) { s.rect(x, Y + 29, 3, 4, P.podBody); s.rect(x, Y + 29, 3, 1, K[2]); s.rect(x, Y + 32, 3, 1, K[2]); } },
      3(s, k) {
        const { cx, Y, P, K, t } = k, y = Y + 53;
        s.rect(cx - 4, y - 4, 9, 9, P.pod3); for (const [dx, dy] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) s.del(cx + dx, y + dy);
        const d = [[1, 0], [1, 1], [0, 1], [-1, 1]][((Math.floor(t * 8) % 4) + 4) % 4];
        for (let i = -3; i <= 3; i++) s.px(cx + i * d[0], y + i * d[1], K[3]);
      },
      4(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 2, Y + 62, 5, 3, P.podBody); s.rect(cx - 1, Y + 63, 3, 1, K[4]); s.rect(cx, Y + 65, 1, 5, P.chromeL); },
      5(s, k) { const { cx, Y, P, K } = k; for (let i = -8; i <= 8; i++) s.px(cx + i, Y - 4, Math.abs(i) === 4 || Math.abs(i) === 8 ? P.podBody : K[5]); },
      6(s, k) { const { cx, Y, P, K, mem } = k; s.rect(cx - 2, Y + 12, 5, 1, P.chrome); s.rect(cx - 6, Y + 13, 13, 8, P.podBody); [-5, -1, 3].forEach((d, i) => s.rect(cx + d, Y + 14, 3, 6, i < mem ? K[6] : P.tail)); },
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
      7(s, k) { const { cx, Y, P } = k; s.rect(cx - 3, Y + 29, 7, 3, P.chromeD); s.rect(cx - 2, Y + 29, 5, 1, lamp(k)); },
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
    LUMINARY: { W: 57, H: 108, model: 'SED-01-001', tag: 'S01', name: 'LUMINARY™', role: 'CEO car', fleet: 'sedan', line: 'Meridian Imperial', callsign: 'Ambassador', job: 'Chauffeurs the board', map: 1, mapName: 'Monument' },
    VANGUARD: { W: 59, H: 107, model: 'POL-01-001', tag: 'P01', name: 'VANGUARD™', role: 'police and security', fleet: 'police', line: 'Warden Imperial', callsign: 'Marshal', job: 'Escorts dignitaries and parades', map: 2, mapName: 'Parkland' },
    ENIGMA: { W: 61, H: 112, model: 'VAN-01-001', tag: 'V01', name: 'ENIGMA™', role: 'delivery', fleet: 'van', line: 'Porter Imperial', callsign: 'Concierge', job: 'White-glove deliveries to penthouses', map: 3, mapName: 'Waterfront' },
  };
  for (const k in classes) { const c = GEO[k]; classes[k].nose = [cxOf(c), c.Y0]; classes[k].centre = [cxOf(c), c.Y0 + ((c.L + c.E) >> 1)]; }

  const kit = {
    LUMINARY: {
      1: { name: 'VALET LENS', look: 'Chrome-cased lens bar at the windscreen top', why: 'A chauffeur car watches the lane so the board never jolts.' },
      2: { name: 'MIRROR EYES', look: 'Sensor lenses set into both mirror caps', why: 'An executive car hides its side sensors in its mirrors.' },
      3: { name: 'HALO DOME', look: 'Flush glass dome mid-roof, violet ring, turning sweep', why: 'A CEO car keeps its lidar flush under glass.' },
      4: { name: 'SHARK FIN', look: 'Shark-fin aerial at the roof edge, mint link strip', why: 'Luxury cars carry a shark fin; this one talks to cameras.' },
      5: { name: 'PARK RADAR', look: 'Six orange parking-sensor dots across the front bumper', why: 'Its parking sensors now read cones and road items.' },
      6: { name: 'LEDGER', look: 'Chrome plate on the bonnet, a red lamp per crash spot', why: 'The board\'s car keeps minutes of every incident.' },
      7: { name: 'SUNROOF LAMP', look: 'Lamp risen through the sunroof, red lens', why: 'The chauffeur never steps out; the lamp looks instead.' },
    },
    VANGUARD: {
      1: { name: 'DASH CAM', look: 'Black dash-cam box, white lens, blinking REC dot', why: 'Every patrol car records the road ahead.' },
      2: { name: 'PLATE READER', look: 'Twin-lens pod on each mirror, fore and aft', why: 'Patrol cars read both pavements as they pass.' },
      3: { name: 'SPEED LIDAR', look: 'Roof turret with a rotating violet bar', why: 'Police carry speed lidar; this one scans for bodies.' },
      4: { name: 'RADIO MAST', look: 'Aerial base with mint link light and chrome whip', why: 'Dispatch relays what the street cameras see.' },
      5: { name: 'BAR RADAR', look: 'Orange sensor slit along the push bar', why: 'The push bar clears the road; now it reads it first.' },
      6: { name: 'CASE FILE', look: 'Clipboard on the bonnet, a red tally bar per crash spot', why: 'Police open a case on every crash scene.' },
      7: { name: 'PILLAR SPOT', look: 'Spotlight on the driver\'s A-pillar, red lens', why: 'The pillar spotlight is the patrol car\'s search tool.' },
    },
    ENIGMA: {
      1: { name: 'CAB CAM', look: 'Camera bar at the cab windscreen top', why: 'A delivery van creeps the kerb lane; the cab cam watches it.' },
      2: { name: 'WING EYES', look: 'Sensor lens filling each big van mirror', why: 'Vans have huge blind spots; the big mirrors cover them.' },
      3: { name: 'DOCK LIDAR', look: 'Violet puck on a cross-bar over the box roof', why: 'It maps loading docks; now it maps you.' },
      4: { name: 'TRACKER', look: 'Telematics box on the rear roof, mint LED strip', why: 'Every parcel is tracked; the tracker hears the cameras.' },
      5: { name: 'KERB RADAR', look: 'Orange sensor strip across the black bumper', why: 'A van stops at kerbs all day and reads what lies there.' },
      6: { name: 'MANIFEST', look: 'Board on the box header, a red lamp per crash spot', why: 'A van logs every drop; now it logs every crash.' },
      7: { name: 'DOOR LAMP', look: 'Work lamp on the cab roof front, red lens', why: 'It finds door numbers in the dark; now it finds you.' },
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
