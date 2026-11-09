// Prototype 11.3: the car's upgrade screen, as a player sees it, for the adversarial UI redesign (pipeline/ui_upgrade.py).
// (1) The reference: the dummy's own upgrade screen (Prototype 9's gift: the Dummy Chassis and the drone), frame by frame.
// (2) The car's lesson after a clear, frame by frame, on puzzles that teach rungs 1, 2, 3 then 4, and 5 (A1, B1, C2, A2).
//     A lesson that honours L.pin (seconds) is pinned at each time; one that does not is polled on the clock.
//   node engine/p11_upgrade_shots.js OUTDIR [--ref] [--car] [--rm] [--with-rm] [--old] [tiles...]   → OUTDIR/*.png, shots.json (--rm: reduced motion; --old: the clock times for the P11.2 lesson)
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright'); const go = require('./p11_goto.js');
const ROOT = path.resolve(__dirname, '..'), A = process.argv.slice(2), OUT = path.resolve(A[0] || 'upgrade_shots');
const REF = A.includes('--ref') || !A.includes('--car'), CAR = A.includes('--car') || !A.includes('--ref'), only = A.slice(1).filter((x) => !x.startsWith('--'));
const OLD = A.includes('--old'), timesOf = (rm) => (rm ? [0.5, 1.2, 1.45] : OLD ? [0.2, 0.8, 1.6, 2.4, 3.0, 3.4, 3.8, 4.2, 4.6, 5.2, 6.0, 7.5] : [0.15, 0.6, 0.95, 1.15, 1.3, 1.45, 1.7, 1.9, 2.3, 3.0]);
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const br = await chromium.launch(), errs = [], meta = [];
  const page = async (rm) => { const pg = await br.newPage({ viewport: { width: 1280, height: 720 }, reducedMotion: rm ? 'reduce' : 'no-preference' }); pg.on('pageerror', (e) => errs.push(e.message)); await pg.addInitScript({ path: path.join(ROOT, 'qa', 'pad.js') }); return pg; };
  if (REF) { // the dummy's upgrade: a part forced onto the gift screen, polled on the clock
    const pg = await page(); await go(pg, 'C1'); await pg.keyboard.press('Enter');
    await pg.waitForFunction(() => { const s = window.__dummies.sim; return s && s.phase === 'play' && !s.rescue; }, null, { timeout: 20000 });
    const fall = await pg.evaluate(() => { const s = window.__dummies.sim; s.phase = 'gift'; s.emit('gift', { node: 'battery1' }); return [s.P['ui.gift.fallSeconds'], s.P['ui.gift.holdSeconds']]; });
    const t0 = Date.now();
    for (const t of [0.15, 0.5, 0.9, 1.2, 1.45, 1.8, 2.6, 4.0]) { const w = t * 1000 - (Date.now() - t0); if (w > 0) await pg.waitForTimeout(w); const n = 'ref_gift_' + t.toFixed(2).replace('.', '_'); await pg.screenshot({ path: path.join(OUT, n + '.png') }); meta.push({ shot: n, kind: 'reference', t, note: 'Prototype 9 gift screen; ui.gift.fallSeconds ' + fall[0] + ', ui.gift.holdSeconds ' + fall[1] }); }
    await pg.close();
  }
  const jobs = (only.length ? only : ['A1', 'B1', 'C2', 'A2']).map((t) => [t, A.includes('--rm')]); if (A.includes('--with-rm')) jobs.push(['A1', true]);
  if (CAR) for (const [tile, RMODE] of jobs) {
    const TIMES = timesOf(RMODE), pg = await page(RMODE); if (!(await go(pg, tile))) { errs.push(tile + ': no card'); await pg.close(); continue; }
    await pg.keyboard.press('Enter');
    await pg.waitForFunction(() => { const s = window.__dummies.sim; return s && s.phase === 'play' && !s.rescue; }, null, { timeout: 20000 });
    const sol = JSON.parse(fs.readFileSync(path.join(ROOT, 'qa', 'solutions', tile + '.json'), 'utf8'));
    const run = await pg.evaluate((sc) => window.__qaRun(sc, 120), sol.script);
    for (let k = 0; k < 2; k++) { // the stars, then Enter: the lesson (a clear that teaches two rungs: two lessons)
      let ph = null; for (let i = 0; i < 60; i++) { ph = await pg.evaluate(() => { const s = window.__dummies.sim; return s.phase === 'lesson' ? 'lesson' : s.phase + (s.p11 && s.p11.result ? ':result' : ''); }); if (ph === 'lesson') break; await pg.keyboard.press('Enter'); await pg.waitForTimeout(400); }
      if (ph !== 'lesson') { if (k === 0) errs.push(tile + ': no lesson (' + run.reason + ', ' + ph + ')'); break; }
      const L = await pg.evaluate(() => { const L = window.__dummies.sim.duelT.lesson; return { from: L.from, to: L.to, part: L.part || null }; });
      if (L.part) { await pg.screenshot({ path: path.join(OUT, `car_${tile}_part.png`) }); meta.push({ shot: `car_${tile}_part`, kind: 'part card', tile }); break; }
      const pinned = await pg.evaluate(() => { const L = window.__dummies.sim.duelT.lesson; L.pin = 0; return true; }); let pinnedNew = false;
      const t0 = Date.now();
      for (const t of TIMES) {
        const name = `car_${tile}_r${L.to}${RMODE ? '_rm' : ''}_${t.toFixed(2).replace('.', '_')}`;
        const hasPin = await pg.evaluate((t) => { const L = window.__dummies.sim.duelT.lesson; if (!L) return null; L.pin = t; return !!L.pinOk; }, t);
        if (hasPin == null) break;
        if (hasPin) { pinnedNew = true; await pg.waitForTimeout(150); } else { const w = t * 1000 - (Date.now() - t0); if (w > 0) await pg.waitForTimeout(w); }
        await pg.screenshot({ path: path.join(OUT, name + '.png') }); meta.push({ shot: name, kind: 'car upgrade', tile, from: L.from, to: L.to, t, pinned: !!hasPin, reducedMotion: RMODE });
      }
      await pg.evaluate(() => { const L = window.__dummies.sim.duelT.lesson; if (L) { delete L.pin; } });
      for (let i = 0; i < 4; i++) { await pg.keyboard.press('Enter'); await pg.waitForTimeout(300); const ph2 = await pg.evaluate(() => window.__dummies.sim.phase); if (ph2 !== 'lesson') break; }
      await pg.waitForTimeout(600);
      if (await pg.evaluate(() => !!(window.__dummies.sim.duelT && window.__dummies.sim.duelT.lessons && window.__dummies.sim.duelT.lessons.some((q) => q.pair)))) break; // Prototype 11.3: two rungs, one screen
      if (!pinnedNew) break;
    }
    await pg.close();
  }
  fs.writeFileSync(path.join(OUT, 'shots.json'), JSON.stringify({ shots: meta, errors: errs }, null, 1));
  console.log(JSON.stringify({ shots: meta.length, errors: errs }));
  await br.close();
})();
