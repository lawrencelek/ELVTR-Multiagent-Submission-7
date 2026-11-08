// Prototype 9's 27 tiles as pictures, in the game's own renderer (p11/index.html): no cars, no dummy, no HUD.
//   node engine/inventory_shots.js OUTDIR [district ...]     → OUTDIR/<district>_<tile>.png (the 800 × 640 field)
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const OUT = path.resolve(process.argv[2] || 'tiles'), only = process.argv.slice(3);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch(), pg = await br.newPage({ viewport: { width: 1280, height: 720 } }), errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto('file://' + path.resolve(__dirname, '..', 'p11', 'index.html')); await pg.waitForTimeout(1200);
  const box = await pg.evaluate(() => { const c = document.querySelector('canvas'), r = c.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
  for (const id of only.length ? only : ['monument', 'parkland', 'waterfront']) {
    const names = await pg.evaluate((id) => { const s = new window.WORLD6.Sim6(id, Object.assign({}, window.STORY.P7SIM)); window.__inv = s; return s.W6.scs.map((q) => q.name); }, id);
    for (const t of names) {
      await pg.evaluate((t) => {
        const a = window.__dummies, s = window.__inv, sc = s.W6.scs.find((q) => q.name === t);
        for (const q of s.W6.sims) q.cars = [];
        s.enter(sc); s.buildView(); s.step = () => {}; s.phase = 'play'; s.body.x = -400; s.body.y = -400; s.body.alive = false;
        a.sim = s; a.mode = 'arcade'; a.screen = 'game'; a.paused = false;
      }, t);
      await pg.waitForTimeout(350);
      const fr = await pg.evaluate(() => window.__dummiesUI && window.__dummiesUI.field ? window.__dummiesUI.field() : null);
      const clip = fr ? { x: box.x + fr.x, y: box.y + fr.y, width: fr.w, height: fr.h } : { x: box.x + 240 * box.w / 1280, y: box.y + 40 * box.h / 720, width: 800 * box.w / 1280, height: 640 * box.h / 720 };
      await pg.screenshot({ path: path.join(OUT, `${id}_${t}.png`), clip });
    }
  }
  console.log(JSON.stringify({ ok: !errs.length, errors: errs.slice(0, 3), box }));
  await br.close();
})();
