// Prototype 11: open p11/index.html at one puzzle's card from a save that has solved the puzzles before it.
// require('./p11_goto.js')(page, 'C3') → resolves at the card (phase 'brief'). Used by the P11 tests and probes.
module.exports = async function gotoPuzzle(pg, tile, root) {
  const path = require('path');
  await pg.goto('file://' + path.join(root || path.resolve(__dirname, '..'), 'p11', 'index.html'));
  await pg.evaluate((tile) => {
    try { localStorage.clear(); } catch (e) { /* none */ }
    const pr = window.STORY.newProgress(), order = window.P11.ORDER, best = {};
    for (const t of order.slice(0, order.indexOf(tile))) if (window.P11.BY[t].built) best[t] = { stars: [1, 1, 1], time: 5, first: 5, plays: 1 };
    pr.p11 = { v: 1, cur: tile, best, certified: false };
    localStorage.setItem('dummies.p11.save1', JSON.stringify({ v: 1, name: 'TEST DUMMY 1', saved: Date.now(), progress: pr }));
  }, tile);
  await pg.reload(); await pg.waitForTimeout(1000);
  for (let i = 0; i < 120; i++) {
    const s = await pg.evaluate(() => { const a = window.__dummies; return { screen: a.screen, phase: a.sim && a.sim.phase }; });
    if (s.phase === 'brief') return true;
    if (s.screen !== 'game' && s.screen !== 'loading') { await pg.keyboard.press('Enter'); await pg.waitForTimeout(350); } else await pg.waitForTimeout(200);
  }
  return false;
};
