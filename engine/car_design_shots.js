// DUMMIES · Prototype 11.4: shots for the car design agent (pipeline/car_design.py).
//   node engine/car_design_shots.js OUT --ref       the level's own style: every in-level car sprite (1x, 4x), the learner, play, the upgrade screen, the gift screen
//   node engine/car_design_shots.js OUT --preview   the agent's hero cars (engine/hero_cars.js, built into p11/): a sheet per class, and the upgrade screen
// Writes OUT/*.png and OUT/shots.json ({ shots: [{ shot, kind, note }], errors }).
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright'); const go = require('./p11_goto.js');
const ROOT = path.resolve(__dirname, '..'), A = process.argv.slice(2), OUT = path.resolve(A[0] || 'car_design_shots'), REF = A.includes('--ref'), PREVIEW = A.includes('--preview');
const meta = [], errs = [];
async function playPage(br, tile) {
  const pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); pg.on('pageerror', (e) => errs.push(tile + ': ' + e.message)); pg.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errs.push(tile + ' console: ' + m.text().slice(0, 200)); });
  await pg.addInitScript({ path: path.join(ROOT, 'qa', 'pad.js') });
  if (!(await go(pg, tile))) throw new Error(tile + ': no card'); await pg.keyboard.press('Enter');
  await pg.waitForFunction(() => { const s = window.__dummies.sim; return s && s.phase === 'play' && !s.rescue; }, null, { timeout: 20000 });
  return pg;
}
const shot = async (pg, name, kind, note, clip) => { await pg.screenshot({ path: path.join(OUT, name + '.png'), clip }); meta.push({ shot: name, kind, note }); };
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch();
  if (REF) {
    const pg = await playPage(br, 'A1');
    // 1. every in-level car sprite: east and nose up, 1x and 4x, on the road; the learner (the sedan recoloured red) at 4x and 8x
    await pg.evaluate(() => {
      const s = window.__dummies.sim, P = s.P, PIX = window.PIX, U = PIX.U, EXT = (h) => Math.round(h * P['proto.art.extrusion'] / U), UI = window.DUEL_UI;
      const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; cv.id = 'sheet'; Object.assign(cv.style, { position: 'fixed', left: '0', top: '0', zIndex: 99, imageRendering: 'pixelated' }); document.body.appendChild(cv);
      const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = PIX.PAL.road || '#2a2f3a'; g.fillRect(0, 0, 1280, 720);
      const toCv = (S) => { const c = document.createElement('canvas'); c.width = S.w; c.height = S.h; const x = c.getContext('2d'), id = x.createImageData(S.w, S.h); new Uint32Array(id.data.buffer).set(S.d); x.putImageData(id, 0, 0); return c; };
      g.fillStyle = '#ffffff'; g.font = '700 14px monospace';
      const cls = ['sedan', 'police', 'sports', 'hatchback', 'wagon', 'suv', 'van', 'bus'];
      cls.forEach((k, i) => {
        const L = Math.round((P['vehicles.' + k + '.length'] || 56) / U), W = Math.round((P['vehicles.' + k + '.width'] || 28) / U), h = EXT(P['vehicles.' + k + '.height'] || 22);
        const x0 = 20 + i * 155; g.fillText(k + ' ' + L + 'x' + W + ' h' + h, x0, 20);
        const E = toCv(PIX.car(k, L, W, h, 0, false)), N = toCv(PIX.car(k, L, W, h, -Math.PI / 2, false));
        g.drawImage(E, x0, 30); g.drawImage(N, x0 + 70, 30);
        g.drawImage(E, x0, 110, E.width * 4, E.height * 4);
        g.drawImage(N, x0 + 10, 300, N.width * 4, N.height * 4);
      });
      const L = Math.round(P['vehicles.sedan.length'] / U), W = Math.round(P['vehicles.sedan.width'] / U), h = EXT(P['vehicles.sedan.height']);
      const R = toCv(UI.redSprite(PIX.car('sedan', L, W, h, -Math.PI / 2, false))), RB = toCv(UI.redSprite(PIX.car('sedan', L, W, h, -Math.PI / 2, true)));
      g.fillText('learner (red sedan) nose up: 4x, 6x, braking 4x', 20, 545); g.drawImage(R, 20, 560, R.width * 4, R.height * 4); g.drawImage(R, 150, 556, R.width * 6, R.height * 6);
      g.drawImage(RB, 400, 560, RB.width * 4, RB.height * 4);
      const D = toCv(PIX.dummy(0, 0)); g.fillText('dummy 4x', 540, 545); g.drawImage(D, 540, 560, D.width * 4, D.height * 4);
      const C = toCv(PIX.CONE); g.fillText('cone 4x', 640, 545); g.drawImage(C, 640, 560, C.width * 4, C.height * 4);
      const DR = toCv(PIX.DRONE); g.fillText('drone 4x', 740, 545); g.drawImage(DR, 740, 560, DR.width * 4, DR.height * 4);
    });
    await shot(pg, 'ref_sprites', 'reference', 'Every in-level car sprite from pixel.js carSprite: east and nose up at 1x (top row) and 4x; the learner (sedan recoloured red, redSprite) nose up at 4x and 6x, and braking at 4x; the dummy, a cone, the drone. Art px: 1 px = 2 world units in play.');
    await pg.evaluate(() => document.getElementById('sheet').remove());
    // 2. play: the learner in its tile, full frame and a 4x crop round it
    await pg.waitForFunction(() => { const T = window.__dummies.sim.duelT, c = T && T.cars.find((q) => q.red && !q.gone); return c && c.x > 120 && c.x < 680 && c.y > 80 && c.y < 560; }, null, { timeout: 30000 }).catch(() => {});
    await shot(pg, 'ref_play', 'reference', 'Play, puzzle 1 (A1): the learner in its lane, the dummy, the tile art and the HUD. The field is 800 x 640 screen px at 1280 x 720.');
    const c = await pg.evaluate(() => { const T = window.__dummies.sim.duelT, c = T.cars.find((q) => q.red && !q.gone); return c ? [c.x, c.y] : [400, 320]; });
    const cx = 240 + Math.max(60, Math.min(740, c[0])), cy = 40 + Math.max(50, Math.min(590, c[1]));
    await pg.screenshot({ path: path.join(OUT, 'ref_play_crop.png'), clip: { x: cx - 60, y: cy - 45, width: 120, height: 90 } });
    const sharp = path.join(OUT, 'ref_play_crop.png'); meta.push({ shot: 'ref_play_crop', kind: 'reference', note: 'A 120 x 90 crop round the learner in play, as rendered (upscale it in your head: this is 1 screen px per pixel).' });
    await pg.close();
    // 3. the upgrade screen today (P11.3) and the Dummy Chassis gift screen
    const pg2 = await playPage(br, 'C1');
    await pg2.evaluate(() => { const s = window.__dummies.sim; s.phase = 'gift'; s.emit('gift', { node: 'battery1' }); }); await pg2.waitForTimeout(2600);
    await shot(pg2, 'ref_gift', 'reference', 'The Dummy Chassis gift screen, settled: the doll is 4x pixel art (64 x 108 art px). The family the car upgrade screen belongs to.');
    await pg2.close();
  }
  // 4. the upgrade screen with whatever hero car is built: A1 settled, C2 settled (two pieces); and, in preview, the agent's sheet
  for (const tile of ['A1', 'C2']) {
    const pg = await playPage(br, tile), sol = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa', 'solutions', tile + '.json'), 'utf8'));
    await pg.evaluate((sc) => window.__qaRun(sc, 120), sol.script);
    for (let i = 0; i < 40; i++) { if (await pg.evaluate(() => window.__dummies.sim.phase === 'lesson')) break; await pg.keyboard.press('Enter'); await pg.waitForTimeout(350); }
    for (const t of PREVIEW ? [0.6, 1.15, 3.0] : [3.0]) { await pg.evaluate((t) => { const L = window.__dummies.sim.duelT.lesson; if (L) L.pin = t; }, t); await pg.waitForTimeout(160); await shot(pg, `${PREVIEW ? 'prev' : 'ref'}_upgrade_${tile}_${String(t).replace('.', '_')}`, PREVIEW ? 'preview' : 'reference', `The car upgrade screen after puzzle ${tile} at ${t} s (pinned)${PREVIEW ? ', with your hero car' : ' as built in P11.3: the vector kit sedan (kitBody) pixel-scaled'}.`); }
    await pg.close();
  }
  if (PREVIEW) {
    const pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); pg.on('pageerror', (e) => errs.push('sheet: ' + e.message));
    await pg.goto('file://' + path.join(ROOT, 'p11', 'index.html')); await pg.waitForFunction(() => window.DUEL_UI && window.PIX, null, { timeout: 20000 });
    const info = await pg.evaluate(() => {
      const HC = window.HERO_CARS; if (!HC) return { error: 'no HERO_CARS' };
      const out = { classes: Object.keys(HC.classes || {}), error: null };
      for (const cls of out.classes) {
        const C0 = HC.classes[cls], cv = document.createElement('canvas'); cv.width = 1280; cv.height = 720; cv.className = 'sheet'; cv.dataset.cls = cls; Object.assign(cv.style, { position: 'fixed', left: '0', top: '0', zIndex: 99 }); document.body.appendChild(cv);
        const g = cv.getContext('2d'); g.imageSmoothingEnabled = false; g.fillStyle = '#0b0f1a'; g.fillRect(0, 0, 1280, 720); g.fillStyle = '#f4f8fa'; g.font = '700 15px monospace';
        g.fillText(cls + ' · ' + (C0.model || '') + ' · ' + C0.W + ' x ' + C0.H + ' art px', 16, 22);
        const S = 3, put = (cv2, x, y, sc) => g.drawImage(cv2, x, y, cv2.width * sc, cv2.height * sc);
        [0, 3, 7].forEach((n, i) => { const cv2 = window.DUEL_UI.heroCanvas(cls, { has: n, t: 0.4 }); g.fillText('rung ' + n, 16 + i * (C0.W * S + 24), 44); if (cv2) put(cv2, 16 + i * (C0.W * S + 24), 52, S); });
        const x1 = 16 + 3 * (C0.W * S + 24);
        for (let n = 1; n <= 7; n++) { const cv2 = window.DUEL_UI.heroCanvas(cls, { t: 0.4 }, n), K = (HC.kit && HC.kit[cls] && HC.kit[cls][n]) || {}; const col = (n - 1) % 4, row = Math.floor((n - 1) / 4), x = x1 + col * 140, y = 52 + row * 330; g.fillStyle = '#16202e'; g.fillRect(x, y, C0.W * 2, C0.H * 2); if (cv2) put(cv2, x, y, 2); g.fillStyle = '#f4f8fa'; g.font = '700 12px monospace'; g.fillText(n + ' ' + String(K.name || '').slice(0, 16), x, y + C0.H * 2 + 14); }
        const b1 = window.DUEL_UI.heroCanvas(cls, { has: 7, t: 0.4 }); if (b1) { g.fillStyle = '#f4f8fa'; g.fillText('1x', 16, 52 + C0.H * S + 26); put(b1, 16, 52 + C0.H * S + 34, 1); }
      }
      out.error = window.DUEL_UI.heroCanvas.err || null; return out;
    });
    if (info.error) errs.push('hero_cars: ' + info.error);
    for (const cls of info.classes || []) {
      await pg.evaluate((cls) => { for (const c of document.querySelectorAll('canvas.sheet')) c.style.display = c.dataset.cls === cls ? 'block' : 'none'; }, cls);
      await shot(pg, 'prev_sheet_' + cls, 'preview', `Your ${cls}: the body with pieces to rung 0, 3 and 7 at 3x (as on the upgrade screen); each piece alone at 2x; the full car at 1x.`);
    }
    await pg.close();
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify({ shots: meta, errors: errs }, null, 1));
  console.log(JSON.stringify({ shots: meta.length, errors: errs }));
  await br.close();
})();
