// Smoke test for Map 1 in the integrated game (index.html): each tile from a save that has cleared the tiles before it.
// Intro, title, STORY, the tile's card (Prototype 9's level card with the pipeline's tale and objective), then 10 s of
// play. Checks: the duel joined the tile in test with its stage's rung; the red car has driven on; the stage's values
// reached the tile's traffic sim; no page error. node engine/p9_tiles_test.js [--shots DIR]
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const si = process.argv.indexOf('--shots'), SHOTS = si > 0 ? path.resolve(ROOT, process.argv[si + 1]) : null;
const ORDER = ['A1', 'B1', 'C1', 'C2', 'B2', 'A2', 'A3', 'B3', 'C3'];

(async () => {
  const br = await chromium.launch(), out = [], errs = [];
  for (let k = 1; k <= 9; k++) {
    const pg = await br.newPage({ viewport: { width: 1280, height: 720 } });
    pg.on('pageerror', (e) => errs.push('tile ' + k + ': ' + e.message));
    await pg.goto('file://' + path.join(ROOT, 'index.html'));
    await pg.evaluate(({ k, order }) => { localStorage.clear(); const pr = window.STORY.newProgress(); pr.done.monument = order.slice(0, k - 1); localStorage.setItem('dummies.p7.save1', JSON.stringify({ v: 1, name: 'TEST DUMMY 1', saved: Date.now(), progress: pr })); }, { k, order: ORDER });
    await pg.reload(); await pg.waitForTimeout(900);
    for (const key of ['Enter', 'Enter', 'Enter']) { await pg.keyboard.press(key); await pg.waitForTimeout(450); }
    let st = null;
    for (let i = 0; i < 120; i++) { st = await pg.evaluate(() => { const s = window.__dummies.sim; return s ? { phase: s.phase, rescue: !!s.rescue } : null; }); if (st && st.phase === 'brief') break; if (st && st.phase === 'gift') await pg.keyboard.press('Enter'); await pg.waitForTimeout(200); }
    if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await pg.screenshot({ path: path.join(SHOTS, 'tile' + k + '_card.png') }); }
    await pg.keyboard.press('Enter'); await pg.waitForTimeout(10000);
    if (SHOTS) await pg.screenshot({ path: path.join(SHOTS, 'tile' + k + '_play.png') });
    const r = await pg.evaluate(() => {
      const s = window.__dummies.sim, T = s.duelT, d = s.duelDef, st = window.DUMMIES_STAGES[d.stage].flags;
      const keys = Object.keys(st).filter((q) => q.startsWith('duel.') && !/Arrives$|standstill|redReturn/.test(q));
      const bad = keys.filter((q) => JSON.stringify(T.P[q]) !== JSON.stringify(d.params && d.params[q] != null ? d.params[q] : st[q]));
      return { tile: d.tile, screen: s.screenName(), stage: d.stage, rung: T.rung, startRung: st['duel.startRung'], reds: T.redSeq, phase: s.phase, cams: (T.level.cameras || []).length, planters: T.level.statics.filter((q) => q.kind === 'planter').length, objective: s.duelObjective() && s.duelObjective()[1].slice(0, 40), mismatched: bad.slice(0, 4) };
    });
    out.push(r); console.log(JSON.stringify(r));
    await pg.close();
  }
  await br.close();
  const ok = !errs.length && out.every((r, i) => r.tile === ORDER[i] && r.screen === ORDER[i] && r.rung >= r.startRung && r.reds >= 1 && !r.mismatched.length);
  console.log(JSON.stringify({ ok, tiles: out.length, errors: errs.slice(0, 5) }));
  process.exit(ok ? 0 : 1);
})();
