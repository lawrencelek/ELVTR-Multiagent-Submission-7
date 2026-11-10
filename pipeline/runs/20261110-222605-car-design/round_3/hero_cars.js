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
    S: ['011', '100', '010', '001', '110'], P: ['111', '101', '111', '100', '100'], R: ['110', '101', '110', '101', '101'],
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
        const { cx, Y, P, K, t } = k, y = Y + 57, d = dir8(t, 8);
        s.disc(cx, y, 4, 20, K[3]); s.disc(cx, y, 3, 12, P.glass);
        s.px(cx, y, P.glint); s.px(cx + d[0], y + d[1], K[3]); s.px(cx + 2 * d[0], y + 2 * d[1], K[3]);
      },
      4(s, k) { // stepped shark fin on the roof's rear edge, mint link strip up its spine
        const { cx, Y, P, K } = k;
        s.px(cx, Y + 65, P.podBody); s.rect(cx - 1, Y + 66, 3, 1, P.podBody); s.rect(cx - 2, Y + 67, 5, 2, P.podBody); s.rect(cx - 3, Y + 69, 7, 3, P.podBody);
        s.rect(cx, Y + 67, 1, 2, K[4]); s.rect(cx - 1, Y + 69, 3, 2, K[4]);
      },
      5(s, k) { // bumper strip, four parking-sensor lamps
        const { cx, Y, P, K } = k; s.rect(cx - 10, Y, 21, 2, P.podBody);
        for (const d of [2, 7]) { s.rect(cx - d - 2, Y, 3, 2, K[5]); s.rect(cx + d, Y, 3, 2, K[5]); }
      },
      6(s, k) { const { cx, Y, P, K, mem } = k; s.rect(cx - 6, Y + 16, 13, 5, P.podBody); s.rect(cx - 6, Y + 16, 13, 1, P.chromeL); [-5, -1, 3].forEach((d, i) => s.rect(cx + d, Y + 17, 3, 3, i < mem ? K[6] : P.tail)); },
      7(s, k) { spotLamp(s, k, k.cx + 12, k.Y + 48); }, // kerb-side roof lamp, off the centre line
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
      7(s, k) { spotLamp(s, k, k.cx - 18, k.Y + 36); }, // A-pillar spotlight, driver's side
    },
    GENESIS: {
      1(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 3, Y + 37, 7, 3, P.podBody); s.rect(cx - 2, Y + 38, 5, 1, K[1]); s.px(cx, Y + 38, P.glass); },
      2(s, k) { mirrorPod(s, k, 38, 5, 4, [[1, 2]]); },
      3(s, k) { // airbox behind the cockpit: intake slot, violet lidar ring with a turning hand
        const { cx, Y, P, K, t } = k, y = Y + 51, d = dir8(t, 8);
        s.rect(cx - 4, Y + 46, 9, 9, P.podBody); s.del(cx - 4, Y + 46); s.del(cx + 4, Y + 46);
        s.rect(cx - 2, Y + 46, 5, 2, P.pod3);
        s.disc(cx, y, 3, 12, K[3]); s.disc(cx, y, 2, 5, P.pod3);
        s.px(cx + d[0], y + d[1], K[3]); s.px(cx, y, P.podHi);
      },
      4(s, k) { const { cx, Y, P, K } = k; s.rect(cx - 3, Y + 65, 7, 4, P.podBody); s.rect(cx - 2, Y + 66, 5, 2, K[4]); },
      5(s, k) { const { cx, Y, P, K } = k; for (let i = -13; i <= 13; i++) for (const r of [-2, -1]) s.px(cx + i, Y + r, Math.abs(i) % 5 === 0 ? P.podBody : K[5]); },
      6(s, k) { // pace-notes tablet on the cowl, behind the louvres
        const { cx, Y, P, K, mem } = k;
        s.rect(cx - 6, Y + 23, 13, 4, P.podBody); s.rect(cx - 6, Y + 26, 13, 1, P.chromeD);
        [-5, -1, 3].forEach((d, i) => s.rect(cx + d, Y + 24, 3, 2, i < mem ? K[6] : P.tail));
      },
      7(s, k) { spotLamp(s, k, k.cx, k.Y + 10); }, // rally spot lamp on the bonnet front
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
      7: { name: 'LIMELIGHT', look: 'Gunmetal lamp on the roof\'s kerb side, red lens', why: 'The chauffeur never steps out; the spotlight looks instead.' },
    },
    VANGUARD: {
      1: { name: 'EYEWITNESS', look: 'Black dash-cam box, white lens, blinking REC dot', why: 'A patrol car records the road ahead as evidence.' },
      2: { name: 'OUTRIDERS', look: 'Black pod on each mirror, lenses fore and aft', why: 'Escort riders guard a convoy\'s flanks; these pods do now.' },
      3: { name: 'AIR SUPPORT', look: 'Octagonal roof turret, violet ring, turning radar hand', why: 'Police call the helicopter for a view from above.' },
      4: { name: 'ALL POINTS', look: 'Black aerial base on the rear roof, mint link lamp', why: 'An all-points bulletin puts every camera on the lookout.' },
      5: { name: 'ROADBLOCK', look: 'Orange sensor lamps along the push bar', why: 'Police know a roadblock when they see one: they stop.' },
      6: { name: 'RAP SHEET', look: 'Clipboard on the bonnet, a red line per crash spot', why: 'Every offence goes on the record; so does every crash.' },
      7: { name: 'MANHUNT', look: 'Gunmetal spotlight on the driver\'s A-pillar, red lens', why: 'The search starts where the suspect was last seen.' },
    },
    GENESIS: {
      1: { name: 'RACING LINE', look: 'Onboard camera bar at the windscreen top', why: 'A racer owns its line; anything on it gets seen.' },
      2: { name: 'SPOTTER', look: 'Carbon pod on each mirror, blue-grey lens', why: 'A spotter calls every car alongside; these lenses do too.' },
      3: { name: 'BLIMP', look: 'Carbon airbox behind the cockpit, violet lidar ring', why: 'Race TV watches from the blimp overhead; so does this.' },
      4: { name: 'PIT WALL', look: 'Telemetry base on the engine cover, mint link lamp', why: 'The pit wall watches every screen and radios the driver.' },
      5: { name: 'YELLOW FLAG', look: 'Orange LED strip across the front splitter', why: 'Drivers slow for debris under a yellow flag.' },
      6: { name: 'PACE NOTES', look: 'Carbon tablet on the cowl, a red lamp per crash spot', why: 'Rally crews note every bad corner and lift there.' },
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
