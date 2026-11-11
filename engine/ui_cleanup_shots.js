// FINAL V2 (GDD Edit 123): shots for the UI cleanup agent (pipeline/ui_cleanup.py). Every screen a player meets, each with the
// texts the canvas drew in that frame (fillText, as drawn: words, position, size, colour), so the agent can name each one.
//   node engine/ui_cleanup_shots.js OUTDIR [build dir: p11 | final_v2]   → OUTDIR/<shot>.png, OUTDIR/shots.json
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright'); const go = require('./p11_goto.js');
const OUT = path.resolve(process.argv[2] || 'shots'), DIR = process.argv[3] || 'final_v2', ROOT = path.resolve(__dirname, '..');
process.env.P11_DIR = DIR;
const REC = () => { // the canvas's words, frame by frame
  window.__txtCur = []; window.__txtLast = []; let last = -1; const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => raf((ts) => { if (ts !== last) { window.__txtLast = window.__txtCur; window.__txtCur = []; last = ts; } cb(ts); });
  const P = CanvasRenderingContext2D.prototype, f0 = P.fillText;
  P.fillText = function (t, x, y, w) { try { if (this.canvas && this.canvas.width >= 600 && String(t).trim() && this.globalAlpha > 0.05) { const m = this.getTransform(), X = m.a * x + m.c * y + m.e, Y = m.b * x + m.d * y + m.f; window.__txtCur.push({ t: String(t), x: Math.round(X), y: Math.round(Y), font: this.font, fill: String(this.fillStyle), a: +this.globalAlpha.toFixed(2) }); } } catch (e) { /* none */ } return f0.call(this, t, x, y, w); };
};
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch(), errs = [], shots = [];
  const page = async () => { const pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); await pg.addInitScript(REC); pg.on('pageerror', (e) => errs.push(e.message)); return pg; };
  const snap = async (pg, name, what) => {
    await pg.waitForTimeout(120); await pg.screenshot({ path: path.join(OUT, name + '.png') });
    const texts = await pg.evaluate(() => { const seen = new Set(), out = []; for (const q of window.__txtLast || []) { const k = q.t + '|' + q.x + '|' + q.y; if (seen.has(k)) continue; seen.add(k); out.push(q); } return out; });
    shots.push({ shot: name, what, texts }); };
  const st = (pg) => pg.evaluate(() => { const a = window.__dummies, s = a && a.sim; return { screen: a && a.screen, phase: s && s.phase, rescue: !!(s && s.rescue) }; });
  const until = async (pg, f, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { const z = await st(pg); if (f(z)) return z; await pg.waitForTimeout(100); } return null; };
  // menus: title, mode select, saves, the grid
  { const pg = await page(); await pg.goto('file://' + path.join(ROOT, DIR, 'index.html')); await pg.waitForTimeout(2500);
    await snap(pg, '01_title', 'title screen'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(900); await pg.keyboard.press('Enter'); await pg.waitForTimeout(900);
    await snap(pg, '02_modes', 'mode select'); await pg.keyboard.press('Enter'); await pg.waitForTimeout(1200); await snap(pg, '03_saves', 'save slots'); await pg.close(); }
  const play = async (tile, list) => { // a puzzle: its card, the drone drop, then play at set times; optional poses of the dummy in a field
    const pg = await page(); if (!(await go(pg, tile))) { errs.push(tile + ': no card'); await pg.close(); return; }
    await pg.waitForTimeout(600); await snap(pg, `p_${tile}_card`, `${tile}: the puzzle card`);
    await pg.keyboard.press('Enter'); await pg.waitForTimeout(700); await snap(pg, `p_${tile}_drop`, `${tile}: the drone drops the dummy in`);
    await until(pg, (z) => z.phase === 'play' && !z.rescue, 12000);
    for (const [secs, name, pose] of list) {
      if (pose) await pg.evaluate((pose) => { const s = window.__dummies.sim, T = s.duelT, b = s.body, X = window.DUMMIES, c = T && T.cars.find((q) => q.red && !q.gone && !q.ghost); if (!b) return;
        if (pose === 'cam' && T.level.cameras && T.level.cameras.length) { const cam = T.level.cameras[0], aim = (T.cameraAim(cam) || 0) * Math.PI / 180, R = (T.P['perception.streetCameraRange'] || 200) * 0.55; b.x = cam[0] + Math.cos(aim) * R; b.y = cam[1] + Math.sin(aim) * R; }
        else if (c && c.path && X && X.pathAt) { const p = X.pathAt(c.path, Math.min(c.path.length, c.s + c.L / 2 + (pose === 'ahead' ? 150 : 40))), d = (pose === 'side' ? c.W / 2 + 46 : 0); b.x = p.x + p.nx * d; b.y = p.y + p.ny * d; }
        b.px = b.x; b.py = b.y; b.vx = 0; b.vy = 0; }, pose);
      await pg.waitForTimeout(secs * 1000); await snap(pg, `p_${tile}_${name}`, `${tile}: ${name.replace(/_/g, ' ')}`);
    }
    await pg.close(); };
  await play('A1', [[3, 'play']]);
  await play('B1', [[3, 'play'], [0.4, 'seen_ahead', 'ahead']]);
  await play('C1', [[3, 'play'], [0.5, 'seen_side', 'side']]);
  await play('C2', [[3, 'play']]);
  await play('B2', [[3, 'play'], [0.6, 'seen_camera', 'cam']]);
  await play('A3', [[4, 'play']]);
  await play('B3', [[3, 'play']]);
  await play('C3', [[4, 'play'], [0.6, 'seen_camera', 'cam']]);
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify({ build: DIR, shots, errors: errs }, null, 1));
  console.log(JSON.stringify({ ok: !errs.length, shots: shots.length, errors: errs.slice(0, 5) }));
  await br.close();
})();
