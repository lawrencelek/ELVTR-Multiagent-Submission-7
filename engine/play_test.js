// Plays junction.html (the Prototype 10 junction build) in Chromium: tile 1's card, START, an autopilot dummy that walks into the red car's path until the
// objective is met, the PASSED card, tile 2's card. Fails on any page error. With --video DIR it records the session.
// node engine/play_test.js [--video docs/video]
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const vi = process.argv.indexOf('--video'), VID = vi > 0 ? path.resolve(ROOT, process.argv[vi + 1]) : null;

(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext(Object.assign({ viewport: { width: 820, height: 720 } }, VID ? { recordVideo: { dir: VID, size: { width: 820, height: 720 } } } : {}));
  const pg = await ctx.newPage(), errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto('file://' + path.join(ROOT, 'junction.html'));
  await pg.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
  await pg.reload(); await pg.waitForTimeout(1500);
  const card1 = await pg.evaluate(() => document.querySelector('#story .card') && document.querySelector('#story h1').textContent);
  await pg.keyboard.press('Enter'); await pg.waitForTimeout(400);
  // autopilot: stand 110 ahead of the red car's nose, on its lane (P10's walk-in bot)
  await pg.evaluate(() => {
    const down = new Set(), key = (k, on) => { if (on === down.has(k)) return; on ? down.add(k) : down.delete(k); dispatchEvent(new KeyboardEvent(on ? 'keydown' : 'keyup', { key: k })); };
    window.__auto = setInterval(() => {
      const s = window.__p10.sim, b = s.body, c = s.onRoad().find((q) => q.red);
      let tx = 200, ty = 292;
      if (c) { const h = c.h, d = c.L / 2 + 110; tx = c.x + Math.cos(h) * d; ty = c.y + Math.sin(h) * d; if (tx < 20 || tx > 780 || ty < 20 || ty > 620) { tx = 200; ty = 292; } }
      const dx = tx - b.x, dy = ty - b.y;
      key('ArrowRight', dx > 6); key('ArrowLeft', dx < -6); key('ArrowDown', dy > 6); key('ArrowUp', dy < -6);
    }, 50);
  });
  const t0 = Date.now(); let st = null;
  while (Date.now() - t0 < 120000) { st = await pg.evaluate(() => ({ state: window.__story.state, tile: window.__story.tile, hud: document.getElementById('hud9').textContent })); if (st.state === 'won') break; await pg.waitForTimeout(500); }
  await pg.evaluate(() => clearInterval(window.__auto));
  const passed = await pg.evaluate(() => document.querySelector('#story h1') && document.querySelector('#story .k').textContent);
  await pg.waitForTimeout(1800);
  await pg.keyboard.press('Enter'); await pg.waitForTimeout(1200);
  const card2 = await pg.evaluate(() => document.querySelector('#story h1') && document.querySelector('#story h1').textContent);
  await pg.waitForTimeout(1500);
  await ctx.close(); await br.close();
  const ok = !errs.length && !!card1 && st && st.state === 'won' && /PASSED/.test(passed || '') && !!card2;
  console.log(JSON.stringify({ ok, card1, lastHud: st && st.hud, passed, card2, seconds: Math.round((Date.now() - t0) / 1000), errors: errs }));
  process.exit(ok ? 0 : 1);
})();
