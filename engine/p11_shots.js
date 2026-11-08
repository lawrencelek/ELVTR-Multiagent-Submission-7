// Prototype 11: each puzzle as played, in the game's renderer: the field a few seconds after the drop (the red car in view).
//   node engine/p11_shots.js OUTDIR [seconds] [tiles...]   → OUTDIR/p11_<n>_<tile>.png
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright'); const go = require('./p11_goto.js');
const OUT = path.resolve(process.argv[2] || 'shots'), SECS = +(process.argv[3] || 3.5), only = process.argv.slice(4);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const P = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'content', 'puzzles_map1.json'), 'utf8')).puzzles;
  const br = await chromium.launch(), errs = [];
  for (const q of P) {
    if (only.length && !only.includes(q.tile)) continue;
    const pg = await br.newPage({ viewport: { width: 1280, height: 720 } }); pg.on('pageerror', (e) => errs.push(q.tile + ': ' + e.message));
    if (!(await go(pg, q.tile))) { errs.push(q.tile + ': no card'); await pg.close(); continue; }
    await pg.keyboard.press('Enter');
    const t0 = Date.now(); while (Date.now() - t0 < 12000) { const ok = await pg.evaluate(() => { const s = window.__dummies.sim; return s.phase === 'play' && !s.rescue; }); if (ok) break; await pg.waitForTimeout(150); }
    await pg.waitForTimeout(SECS * 1000);
    await pg.screenshot({ path: path.join(OUT, `p11_${q.n}_${q.tile}.png`), clip: { x: 240, y: 40, width: 800, height: 640 } });
    await pg.close();
  }
  console.log(JSON.stringify({ ok: !errs.length, errors: errs.slice(0, 5) }));
  await br.close();
})();
