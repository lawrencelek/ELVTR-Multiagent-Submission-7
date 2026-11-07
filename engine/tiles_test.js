// Smoke test for all nine tiles of junction.html: opens each tile from a save (localStorage), starts it from its card,
// lets it run, and checks that the engine took the tile's stage values and overrides, the HUD shows the objective,
// and no page error fired. node engine/tiles_test.js
const path = require('path');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');

(async () => {
  const br = await chromium.launch(), out = [];
  const ctx = await br.newContext({ viewport: { width: 820, height: 720 } });
  const pg = await ctx.newPage(), errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto('file://' + path.join(ROOT, 'junction.html'));
  const n = await pg.evaluate(() => window.__story.tiles.length);
  for (let k = 0; k < n; k++) {
    await pg.evaluate((k) => { localStorage.setItem('dummies.story.map1', JSON.stringify({ tile: k })); }, k);
    await pg.reload(); await pg.waitForTimeout(600);
    const card = await pg.evaluate(() => document.querySelector('#story h1').textContent);
    await pg.keyboard.press('Enter'); await pg.waitForTimeout(6000);
    const r = await pg.evaluate(() => {
      const t = window.__story.tiles[window.__story.tile], s = window.__p10.sim;
      const want = Object.assign({}, window.DUMMIES_STAGES[t.stage].flags, t.params || {});
      const bad = Object.keys(want).filter((q) => JSON.stringify(s.P[q]) !== JSON.stringify(want[q]));
      return { n: t.n, tile: t.tile, stage: t.stage, state: window.__story.state, hud: document.getElementById('hud9').textContent, simT: Math.round(s.t), values: Object.keys(want).length, mismatched: bad.slice(0, 5), cars: s.onRoad().length };
    });
    r.card = card; out.push(r);
  }
  await ctx.close(); await br.close();
  const ok = !errs.length && out.every((r) => r.state === 'play' && !r.mismatched.length && r.simT >= 4 && /TILE/.test(r.hud));
  for (const r of out) console.log(JSON.stringify(r));
  console.log(JSON.stringify({ ok, tiles: out.length, errors: errs }));
  process.exit(ok ? 0 : 1);
})();
