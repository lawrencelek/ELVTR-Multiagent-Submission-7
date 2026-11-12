/* DUMMIES · Prototype 11 (GDD Edit 113): the puzzle game's screens in Prototype 9's renderer.
   The puzzle grid (the story map's screen), the result card (the report's), the clock and stars strip over the field, the hint,
   the broken camera posts. Prototype 9's helpers (panel, txt, wrapText, theme) come in from game.js (G.U). */
(function (root) {
  'use strict';
  const P11 = root.P11, DUEL_UI = root.DUEL_UI; if (!P11) return;
  const TAU = Math.PI * 2, YEL = '#F5C542', RED = '#ff3d3d', CAM = '#9ff2c8';
  let ctx = null;
  const rect = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const text = (t, x, y, size, c, al, wt, fam) => { ctx.fillStyle = c; ctx.font = `${wt || 700} ${size}px ${fam || 'B612, system-ui, sans-serif'}`; ctx.textAlign = al || 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(t, x, y); };
  const BRAND = '"Nunito", "Segoe UI", system-ui, sans-serif';
  function star(x, y, R, on, col) { // a five-point star, filled when earned
    ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? R * 0.45 : R; ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } ctx.closePath();
    if (on) { ctx.fillStyle = col || YEL; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 1.5; ctx.stroke(); } else { ctx.strokeStyle = 'rgba(159,184,200,0.7)'; ctx.lineWidth = 2; ctx.stroke(); }
  }
  const stars = (x, y, R, arr, gap) => arr.forEach((v, i) => star(x + i * (gap || R * 2.4), y, R, !!v));
  const fmt = (s) => (s == null ? '—' : s < 60 ? s.toFixed(1) + ' s' : Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'));

  // ---------- the puzzle grid: Map 1's 3×3, stars, states; the puzzle under the cursor
  function grid(cx, app, G) {
    ctx = cx; const U = G.U, FT = U.FT, pr = app.story; if (!pr) return;
    const sv = P11.saveOf(pr), sel = app.p11Sel && P11.BY[app.p11Sel] ? app.p11Sel : sv.cur || P11.ORDER.find((t) => P11.stateOf(pr, t) === 'open') || 'A1';
    const x = G.FX + 16, y = G.FY + 14, w = G.FW - 32, h = G.FH - 28; U.panel(x, y, w, h);
    const solved = P11.ORDER.filter((t) => sv.best[t]).length, nb = P11.ORDER.filter((t) => P11.BY[t].built).length; // built puzzles only (Map 2: three in build)
    { let tx = x + 24; (P11.MAPS || [{ id: 'monument', name: 'Monument' }]).forEach((m, i) => { // FINAL V2.1 (Edit 125): the map tabs
      const open = !P11.mapOpen || P11.mapOpen(pr, m.id), cur = m.id === (P11.mapId ? P11.mapId() : 'monument'), lab = (i + 1) + ' · ' + m.name.toUpperCase() + (open ? '' : ' · LOCKED'); ctx.font = '700 18px ' + U.F_UI; const tw = ctx.measureText(lab).width + 24;
      U.rr(tx - 10, y + 16, tw, 34, 8); ctx.fillStyle = cur ? 'rgba(79,195,232,0.18)' : 'rgba(0,0,0,0)'; ctx.fill(); if (cur || (app.p11Tab && cur)) { ctx.strokeStyle = app.p11Tab ? YEL : FT.accent; ctx.lineWidth = app.p11Tab ? 2.5 : 1.5; ctx.stroke(); }
      G.hit(tx - 10, y + 16, tw, 34, 'p11map:' + m.id, () => { if (P11.setMap(pr, m.id)) { app.p11Sel = null; app.p11Tab = false; } else app.p11Deny = { t: m.id, at: G.t, why: 'map' }; });
      U.txt(lab, tx + 2, y + 40, '700 18px ' + U.F_UI, cur ? FT.accent : open ? FT.text : FT.off); tx += tw + 8; }); }
    U.txt('★ ' + P11.starCount(pr) + ' / ' + nb * 3 + '   ·   ' + solved + ' / ' + nb, x + w - 24, y + 40, '700 18px ' + U.F_UI, FT.text, 'right');
    const top = y + 62, gh = h - 62 - 96, g = 10, ch = Math.floor((gh - 2 * g) / 3), cw = Math.min(Math.floor(((w - 72) * 0.6 - 2 * g) / 3), Math.floor(ch * 1.5)), gx = x + 24;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const t = 'ABC'[c] + (r + 1), q = P11.BY[t], st = P11.stateOf(pr, t), X0 = gx + c * (cw + g), Y0 = top + r * (ch + g), on = sel === t && !app.p11Tab;
      G.hit(X0, Y0, cw, ch, 'p11:' + t, () => { if (on) G.push('ok'); else app.p11Sel = t; });
      U.rr(X0, Y0, cw, ch, 10);
      ctx.fillStyle = st === 'solved' ? 'rgba(79,195,232,0.26)' : st === 'open' ? FT.keyTop : st === 'build' ? 'rgba(40,46,56,0.35)' : 'rgba(40,46,56,0.6)'; ctx.fill();
      ctx.strokeStyle = on ? FT.accent : FT.itemEdge; ctx.lineWidth = on ? 3 : 1; ctx.stroke();
      if (st === 'open') { U.rr(X0 - 3, Y0 - 3, cw + 6, ch + 6, 12); ctx.strokeStyle = YEL; ctx.lineWidth = Math.floor(G.t * 2) % 2 ? 4 : 2.5; ctx.stroke(); }
      if (st === 'build') { ctx.save(); U.rr(X0, Y0, cw, ch, 10); ctx.clip(); ctx.strokeStyle = 'rgba(159,184,200,0.12)'; ctx.lineWidth = 6; for (let k = -ch; k < cw; k += 18) { ctx.beginPath(); ctx.moveTo(X0 + k, Y0 + ch); ctx.lineTo(X0 + k + ch, Y0); ctx.stroke(); } ctx.restore(); }
      const dim = st === 'build' || st === 'locked';
      const im = st === 'solved' && G.thumb ? G.thumb(P11.mapId ? P11.mapId() : 'monument', t) : null; // FINAL V2.1 (Edit 124): a solved puzzle shows its tile
      if (im) { ctx.save(); U.rr(X0, Y0, cw, ch, 10); ctx.clip(); ctx.imageSmoothingEnabled = false; const sc = Math.max(cw / im.width, ch / im.height); ctx.globalAlpha = 0.6; ctx.drawImage(im, X0 + (cw - im.width * sc) / 2, Y0 + (ch - im.height * sc) / 2, im.width * sc, im.height * sc);
        ctx.globalAlpha = 1; const gr = ctx.createLinearGradient(0, Y0, 0, Y0 + ch); gr.addColorStop(0, 'rgba(8,10,16,0.55)'); gr.addColorStop(0.45, 'rgba(8,10,16,0.15)'); gr.addColorStop(1, 'rgba(8,10,16,0.7)'); ctx.fillStyle = gr; ctx.fillRect(X0, Y0, cw, ch); ctx.restore();
        U.rr(X0, Y0, cw, ch, 10); ctx.strokeStyle = on ? FT.accent : FT.itemEdge; ctx.lineWidth = on ? 3 : 1; ctx.stroke(); }
      U.txt(t, X0 + 10, Y0 + 20, '700 14px ' + U.F_UI, FT.dim);
      U.txt(String(q.n), X0 + cw - 12, Y0 + 34, '900 30px ' + BRAND, dim ? FT.off : YEL, 'right');
      U.fitText(q.name.toUpperCase(), X0 + 10, Y0 + ch * 0.55, cw - 20, 17, 11, dim ? FT.off : FT.text);
      if (st === 'solved') stars(X0 + 22, Y0 + ch - 20, 10, P11.starsOf(pr, t), 26);
      else U.txt(st === 'open' ? 'OPEN' : st === 'build' ? 'IN BUILD' : 'LOCKED', X0 + 10, Y0 + ch - 12, '700 13px ' + U.F_UI, st === 'open' ? YEL : FT.off);
    }
    // the puzzle under the cursor
    const q = P11.BY[sel], st = P11.stateOf(pr, sel), b = sv.best[sel], ix = gx + 3 * cw + 2 * g + 24, iw = x + w - 24 - ix, iy = top;
    U.rr(ix, iy, iw, gh, 12); ctx.fillStyle = FT.item; ctx.fill(); ctx.strokeStyle = FT.itemEdge; ctx.lineWidth = 1; ctx.stroke();
    U.txt('PUZZLE ' + q.n, ix + 18, iy + 30, '700 15px ' + U.F_UI, FT.accent);
    U.txt(q.name, ix + 18, iy + 66, '900 32px ' + BRAND, FT.text);
    let yy = iy + 100;
    yy += 24 * U.wrapText('NEW · ' + P11.keys(q.newLine || q.new).toUpperCase(), ix + 18, yy, iw - 36, 24, '700 17px ' + U.F_UI, YEL, 2) + 8; // FINAL V2: the card's words, one source
    yy += 24 * U.wrapText(P11.cardGoal(q), ix + 18, yy, iw - 36, 24, '400 17px ' + U.F_UI, FT.text, 3) + 10;
    U.txt('★★★ UNDER ' + q.par + ' s', ix + 18, yy, '700 16px ' + U.F_UI, FT.dim); yy += 34; // FINAL V2.1 (playtest: what is PAR?)
    if (b) { U.txt('BEST ' + fmt(b.time), ix + 18, yy, '700 18px ' + U.F_UI, FT.text); stars(ix + 160, yy - 7, 11, b.stars, 28); }
    else U.txt(st === 'open' ? '' : st === 'build' ? 'IN BUILD' : 'LOCKED', ix + 18, yy, '700 15px ' + U.F_UI, st === 'open' ? YEL : FT.off);
    const deny = app.p11Deny && app.p11Deny.t === sel && G.t - app.p11Deny.at < 1.6, denyMap = app.p11Deny && app.p11Deny.why === 'map' && G.t - app.p11Deny.at < 1.6;
    const ok = st === 'open' || st === 'solved', bt = ok ? (st === 'solved' ? 'PLAY AGAIN · ' : 'PLAY · ') + 'PUZZLE ' + q.n + ' · ' + q.name.toUpperCase() : deny ? (st === 'build' ? 'PUZZLE ' + q.n + ' IS STILL IN BUILD' : 'SOLVE THE PUZZLE BEFORE IT FIRST') : 'PICK AN OPEN PUZZLE';
    U.rr(x + 24, y + h - 78, w - 48, 44, 12); ctx.fillStyle = ok ? FT.sel : FT.item; ctx.fill(); ctx.strokeStyle = deny ? RED : FT.accent; ctx.lineWidth = 1.5; ctx.stroke();
    if (ok) G.hit(x + 24, y + h - 78, w - 48, 44, 'p11:play', () => G.push('ok'));
    U.txt(denyMap ? 'CERTIFY ' + (P11.MAPS[Math.max(0, P11.MAPS.findIndex((m) => m.id === app.p11Deny.t) - 1)] || P11.MAPS[0]).name.toUpperCase() + ' TO OPEN ' + String(app.p11Deny.t).toUpperCase() : bt, x + w / 2, y + h - 49, '700 19px ' + U.F_UI, denyMap ? RED : ok ? FT.selText : deny ? RED : FT.text, 'center');
    if (!G.touch) U.txt(G.pad ? 'STICK PICK · A PLAY · B BACK' : 'ARROWS PICK · SPACE PLAY · SHIFT BACK', x + w / 2, y + h - 10, '700 15px ' + U.F_UI, FT.dim, 'center');
    const cel = pr.p11 && pr.p11.celebrate; if (cel) celebrate(cel, app, G, x, y, w, h);
  }
  // FINAL V2.1 (Edit 125): a map certified. The tiles light one by one, the stars count up, the next map's car rolls in; any key opens it
  const sparks = [];
  function celebrate(cel, app, G, x, y, w, h) {
    const U = G.U, FT = U.FT, M0 = (P11.MAPS || []).find((m) => m.id === cel.map), M1 = (P11.MAPS || []).find((m) => m.id === cel.next), pr = app.story;
    if (app.p11CelFor !== cel.map) { app.p11CelFor = cel.map; app.p11CelT = app.realT; sparks.length = 0; }
    const t = app.realT - app.p11CelT, cx = x + w / 2;
    rect(x, y, w, h, `rgba(5,7,15,${Math.min(0.82, t * 2)})`);
    if (sparks.length < 160 && t < 3) for (let i = 0; i < 4; i++) { const a = Math.random() * TAU, v = 120 + Math.random() * 260; sparks.push({ x: cx, y: y + h * 0.36, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 120, t0: G.t, c: [YEL, '#4fc3e8', '#ffffff', '#ff5a5a'][i % 4] }); }
    for (let i = sparks.length - 1; i >= 0; i--) { const q = sparks[i], a = G.t - q.t0; if (a > 1.6) { sparks.splice(i, 1); continue; } ctx.globalAlpha = 1 - a / 1.6; rect(q.x + q.vx * a, q.y + q.vy * a + 160 * a * a, 4, 4, q.c); } ctx.globalAlpha = 1;
    const k = Math.min(1, t / 0.5), sc = 0.6 + 0.4 * (1 - Math.pow(1 - k, 3));
    ctx.save(); ctx.translate(cx, y + h * 0.3); ctx.scale(sc, sc); text((M0 ? M0.name.toUpperCase() : 'MAP') + ' CERTIFIED', 0, 0, 52, YEL, 'center', 900, BRAND); ctx.restore();
    const BL = M0 ? M0.ORDER.filter((t) => M0.BY[t].built) : [], n = BL.length || 9, lit = Math.min(n, Math.floor(t / 0.12)), s0 = Math.min(1, Math.max(0, (t - 0.4) / 1.4));
    for (let i = 0; i < n; i++) { const bx = cx - (n * 34) / 2 + i * 34, by = y + h * 0.42; rect(bx, by, 28, 28, i < lit ? '#4fc3e8' : 'rgba(159,184,200,0.2)'); if (i < lit) text(String(BL.length ? M0.BY[BL[i]].n : i + 1), bx + 14, by + 20, 15, '#05070f', 'center', 900, BRAND); }
    if (M0) { let st = 0; for (const t2 of M0.ORDER) { const b = (pr.p11 && (M0.i === 0 ? pr.p11 : (pr.p11.maps || {})[M0.id]) || {}).best; const v = b && b[t2]; if (v) st += v.stars.reduce((u, q) => u + q, 0); } text('★ ' + Math.round(st * s0) + ' / ' + n * 3, cx, y + h * 0.42 + 72, 28, YEL, 'center', 900, BRAND); }
    if (M1 && t > 1.4) { const a = Math.min(1, (t - 1.4) / 0.5); ctx.globalAlpha = a; text(M1.name.toUpperCase() + ' IS OPEN', cx, y + h * 0.66, 30, '#ffffff', 'center', 900, BRAND);
      const L = M1.LEARNER || {}; text((L.name || '') + (L.model ? '  ·  ' + L.model : '') + ' ON PATROL', cx, y + h * 0.66 + 34, 17, '#9fb8c8', 'center'); ctx.globalAlpha = 1; }
    if (t > 1.2) { const on = Math.floor(G.t * 2) % 2; text(G.touch ? 'TAP · ' + (M1 ? 'ENTER ' + M1.name.toUpperCase() : 'CONTINUE') : 'SPACE · ' + (M1 ? 'ENTER ' + M1.name.toUpperCase() : 'CONTINUE'), cx, y + h - 40, 20, on ? YEL : '#ffe58a', 'center'); }
    G.hit(x, y, w, h, 'p11:celebrate', () => G.push('ok'));
  }

  // ---------- the result card: three stars, the time, what comes next
  function result(cx, s, G) {
    ctx = cx; const U = G.U, FT = U.FT, p = s.p11; if (!p || !p.result) return;
    if (p.shownAt == null) p.shownAt = G.t;
    const t = G.t - p.shownAt, q = p.q, res = p.result, rec = p.record || {}, best = rec.best;
    rect(G.FX, G.FY, G.FW, G.FH, 'rgba(5,7,15,0.72)');
    const w = Math.min(G.FW - 80, 880), h = Math.min(G.FH - 60, 470), x = G.FX + (G.FW - w) / 2, y = G.FY + (G.FH - h) / 2;
    U.panel(x, y, w, h); G.hit(x, y, w, h, 'p11:result', () => G.push('ok'));
    U.txt('PUZZLE ' + q.n + (rec.certified && q.tile === (P11.lastOf ? P11.lastOf() : P11.ORDER[P11.ORDER.length - 1]) ? ' · CERTIFIED' : ' · SOLVED'), x + 32, y + 44, '700 17px ' + U.F_UI, FT.accent);
    U.txt(q.name, x + 32, y + 92, '900 44px ' + BRAND, FT.text);
    const labels = ['CLEAR', 'UNTOUCHED', 'UNDER ' + q.par + ' s'], why = ['', '', '']; // FINAL V2 (Edit 123, review r2): no sentences under the stars
    const sw = (w - 64) / 3;
    for (let i = 0; i < 3; i++) {
      const k = Math.max(0, Math.min(1, (t - 0.15 - i * 0.28) / 0.22)), cxs = x + 32 + sw * i + sw / 2, cys = y + 170, on = !!res.stars[i];
      ctx.save(); ctx.translate(cxs, cys); const sc = on ? (k < 1 ? 0.6 + 0.7 * k - 0.3 * k * k : 1) : 1; ctx.scale(sc, sc); ctx.globalAlpha = on ? Math.max(0.15, k) : 1; star(0, 0, 38, on && k > 0); ctx.restore();
      U.txt(labels[i], cxs, cys + 66, '700 18px ' + U.F_UI, on ? YEL : FT.dim, 'center');
      U.fitText(why[i], cxs - sw / 2 + 12, cys + 92, sw - 24, 14, 10, FT.dim);
    }
    let yy = y + 300;
    U.txt(fmt(res.attempt), x + 32, yy, '700 20px ' + U.F_UI, FT.text); yy += 30; // FINAL V2: the time; no counters
    if (best && (best.plays > 1 || Math.abs(best.time - res.attempt) > 0.05)) { U.txt('BEST ' + fmt(best.time), x + 32, yy, '700 16px ' + U.F_UI, FT.dim); stars(x + 150, yy - 6, 8, best.stars, 20); if (rec.newTime && best.plays > 1) U.txt('NEW BEST', x + 230, yy, '700 16px ' + U.F_UI, YEL); yy += 30; }
    const nx = rec.next && P11.BY[rec.next];
    U.fitText(nx ? 'NEXT · ' + nx.name.toUpperCase() : rec.mapDone ? (P11.MAP ? P11.MAP.name.toUpperCase() : 'MAP') + ' CERTIFIED' + (rec.nextMap ? ' · ' + rec.nextMap.toUpperCase() + ' IS OPEN' : '') : rec.certified ? 'CERTIFIED' : 'BACK TO THE PUZZLE GRID', x + 32, yy, w - 64, 17, 12, nx ? FT.accent : YEL);
    if (t > 0.6) U.txt(G.touch ? 'TAP · NEXT' : 'SPACE · NEXT     R · AGAIN     SHIFT · GRID', x + w - 32, y + h - 24, '700 17px ' + U.F_UI, YEL, 'right');
  }

  // ---------- over the field: the clock and stars strip, the hint, flashes, broken camera posts
  const flashes = [];
  let seenEv = new WeakMap();
  function strip(cx, s, G) {
    ctx = cx; const p = s && s.p11; if (!p || s.phase === 'brief' || s.phase === 'lesson' || s.phase === 'report' || s.duelDone) return;
    // FINAL V2 (Edit 123): no attempt panel in the field. Time, par and stars sit top right; R RESTART in the keys
    const hint = s.p11Hint && s.p11Hint();
    if (hint) { ctx.save(); ctx.font = '700 18px B612, system-ui, sans-serif'; const tw = ctx.measureText('HINT · ' + hint).width + 32, hx = G.FX + (G.FW - tw) / 2, hy = G.FY + G.FH - 64;
      rect(hx, hy, tw, 36, 'rgba(10,12,18,0.9)'); ctx.strokeStyle = YEL; ctx.lineWidth = 2; ctx.strokeRect(hx + 1, hy + 1, tw - 2, 34); text('HINT · ' + hint, hx + 16, hy + 25, 18, YEL); ctx.restore(); }
    // flashes: a restart, a broken camera
    let i = seenEv.get(s) || 0; const ev = s.events; if (i > ev.length) i = 0;
    for (; i < ev.length; i++) { const e = ev[i];
      if (e.type === 'p11-restart') flashes.push({ t: 1.1, n: 'RESTART', c: YEL });
      else if (e.type === 'camera-broken') flashes.push({ t: 1.6, n: 'CAMERA BROKEN', c: CAM });
      else if (e.type === 'p11-hint') flashes.push({ t: 1.6, n: 'HINT', c: YEL }); }
    seenEv.set(s, i);
    for (let k = flashes.length - 1; k >= 0; k--) { const f = flashes[k]; f.t -= 1 / 60; if (f.t <= 0) { flashes.splice(k, 1); continue; }
      ctx.save(); ctx.globalAlpha = Math.min(1, f.t * 3); ctx.font = '900 22px ' + BRAND; const tw = ctx.measureText(f.n).width + 32, fx = G.FX + (G.FW - tw) / 2, fy = G.FY + G.FH * 0.32;
      rect(fx, fy, tw, 38, 'rgba(10,12,18,0.85)'); text(f.n, G.FX + G.FW / 2, fy + 27, 22, f.c, 'center', 900, BRAND); ctx.restore(); }
  }
  function broken(cx, s, G) { // in world units, under the field's transform: a broken post, its cone gone
    const p = s && s.p11, T = s && s.duelT; if (!p || !p.broken.length || !T || s.sc !== T.duelSc || s.phase === 'lesson') return;
    ctx = cx; const k = G.RA / G.U; ctx.save(); ctx.beginPath(); ctx.rect(G.FX, G.FY, G.FW, G.FH); ctx.clip(); ctx.translate(G.FX, G.FY); ctx.scale(k, k);
    for (const c of p.broken) { ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(c[0] - 8, c[1] - 8); ctx.lineTo(c[0] + 8, c[1] + 8); ctx.moveTo(c[0] + 8, c[1] - 8); ctx.lineTo(c[0] - 8, c[1] + 8); ctx.stroke();
      ctx.fillStyle = 'rgba(40,40,40,0.5)'; for (let j = 0; j < 3; j++) { ctx.beginPath(); ctx.arc(c[0] + 4 + j * 3, c[1] - 14 - j * 7 - (G.t * 9 % 7), 4 + j * 1.5, 0, TAU); ctx.fill(); }
      ctx.font = '700 9px B612, system-ui, sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(12,14,20,0.8)'; ctx.fillRect(c[0] - 26, c[1] + 12, 52, 13); ctx.fillStyle = RED; ctx.fillText('BROKEN', c[0], c[1] + 22); }
    ctx.restore();
  }
  if (DUEL_UI) { // the duel's layers, then Prototype 11's
    const f0 = DUEL_UI.field, h0 = DUEL_UI.hud;
    DUEL_UI.field = (cx, s, G) => { f0(cx, s, G); broken(cx, s, Object.assign({ t: performance.now() / 1000 }, G)); };
    DUEL_UI.hud = (cx, s, G) => { h0(cx, s, G); strip(cx, s, G); };
  }
  root.P11_UI = { grid, result, strip };
})(typeof window !== 'undefined' ? window : globalThis);
