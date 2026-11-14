// Prototype 11: open p11/index.html at one puzzle's card from a save that has solved the puzzles before it.
// require('./p11_goto.js')(page, 'C3') → resolves at the card (phase 'brief'). Used by the P11 tests and probes.
module.exports = async function gotoPuzzle(pg, tile, root) {
  const path = require('path');
  const dir = process.env.P11_DIR || 'final_v2'; // P11_URL (e.g. http://localhost:8765): load over HTTP; the sound engine stays silent on file:// (FINAL V3.2)
  await pg.goto(process.env.P11_URL ? process.env.P11_URL.replace(/\/$/, '') + '/' + dir + '/index.html' : 'file://' + path.join(root || path.resolve(__dirname, '..'), dir, 'index.html'));
  await pg.evaluate((tile) => { // FINAL V2.1 (Edit 125): 'parkland:A1' opens Map 2 with Map 1 certified; 'waterfront:A1' Map 3 (Edit 126)
    try { localStorage.clear(); } catch (e) { /* none */ }
    const [mid, t0] = tile.includes(':') ? tile.split(':') : ['monument', tile], maps = window.P11.MAPS || [{ id: 'monument', BY: window.P11.BY, ORDER: window.P11.ORDER }];
    const pr = window.STORY.newProgress(), rec = (m, upto) => { const best = {}; for (const t of m.ORDER.slice(0, upto == null ? m.ORDER.length : m.ORDER.indexOf(upto))) if (m.BY[t].built) best[t] = { stars: [1, 1, 1], time: 5, first: 5, plays: 1 }; return best; };
    const m0 = maps[0], mi = maps.findIndex((m) => m.id === mid);
    pr.p11 = mi <= 0 ? { v: 1, cur: t0, best: rec(m0, t0), certified: false } : { v: 1, cur: null, best: rec(m0), certified: true, map: mid, maps: Object.assign(Object.fromEntries(maps.slice(1, mi).map((m) => [m.id, { cur: null, best: rec(m), certified: true }])), { [mid]: { cur: t0, best: rec(maps[mi], t0), certified: false } }) }; // Edit 126: and every map between certified
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
