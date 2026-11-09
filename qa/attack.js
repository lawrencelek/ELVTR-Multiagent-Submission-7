// DUMMIES · Prototype 11 adversarial QA: run attack scripts on the nine puzzles through the virtual analog pad (qa/pad.js).
// Each plan: a puzzle, a hypothesis, a script in the attack language, a time limit. Each runs in its own page from a save that
// has solved the puzzles before it; the monitor watches throughout. Out: per plan, what happened and what the monitor found.
//   node qa/attack.js PLANS.json OUT.json [page dir: p11] [parallel: 3]
//   node qa/attack.js --geo OUT.json [page dir]         the nine tiles as an attacker needs them
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..'), go = require(path.join(ROOT, 'engine', 'p11_goto.js'));
const geoMode = process.argv[2] === '--geo', A = process.argv;
const PLANS = geoMode ? null : JSON.parse(fs.readFileSync(A[2], 'utf8')), OUT = path.resolve(A[3]), DIR = A[4] || 'p11', PAR = +(A[5] || 3);
process.env.P11_DIR = DIR;
async function open(br, tile) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 720 } }), pg = await ctx.newPage(), errs = [];
  await pg.addInitScript({ path: path.join(__dirname, 'pad.js') }); pg.on('pageerror', (e) => errs.push(e.message));
  if (!(await go(pg, tile))) { await ctx.close(); return null; }
  await pg.keyboard.press('Enter');
  await pg.waitForFunction(() => { const s = window.__dummies.sim; return s && s.phase === 'play' && !s.rescue; }, null, { timeout: 20000 });
  return { ctx, pg, errs };
}
const summary = (pg) => pg.evaluate(() => {
  const a = window.__dummies, s = a.sim, p = s && s.p11, ev = (s && s.events) || [], T = s && s.duelT;
  return { screen: a.screen, phase: s && s.phase, cleared: !!(s && ((p && p.result) || s.phase === 'writeoff' || s.phase === 'report')), result: p && p.result, progress: s && s.duelProgress ? s.duelProgress() : null, rung: T && T.rung,
    passes: p && p.passes, failed: p && p.failed, restarts: p && p.restarts, attempt: p && +(p.attempt || 0).toFixed(1), faults: ev.filter((e) => e.type === 'fault').length, standstill: ev.filter((e) => e.type === 'touch' && e.standstill).length,
    body: s && [Math.round(s.body.x), Math.round(s.body.y)], alive: s && s.body.alive, broken: T && T.level && (T.level.cameras || []).length, points: s && s.run && s.run.points };
});
(async () => {
  const br = await chromium.launch();
  if (geoMode) {
    const P = JSON.parse(fs.readFileSync(path.join(ROOT, 'content', 'puzzles_map1.json'), 'utf8')).puzzles, out = [];
    for (const q of P) { const o = await open(br, q.tile); if (!o) continue; out.push(await o.pg.evaluate(() => window.__qa.geo())); await o.ctx.close(); }
    fs.writeFileSync(OUT, JSON.stringify(out)); console.log(JSON.stringify({ tiles: out.length })); await br.close(); return;
  }
  const res = new Array(PLANS.length); let next = 0;
  const worker = async () => {
    while (next < PLANS.length) {
      const i = next++, pl = PLANS[i], t0 = Date.now(); let o = null;
      try {
        o = await open(br, pl.tile); if (!o) { res[i] = { id: pl.id, tile: pl.tile, error: 'no card' }; continue; }
        const run = await o.pg.evaluate(([sc, secs]) => window.__qaRun(sc, secs), [pl.script, Math.min(240, pl.secs || 90)]);
        await o.pg.waitForTimeout(1500);
        const end = await summary(o.pg), mon = await o.pg.evaluate(() => ({ findings: window.__qa.findings, errors: window.__qa.errors, trace: window.__qa.trace.filter((q, k) => k % 4 === 0).slice(0, 120) }));
        let shot = null; if (pl.shot !== false) { shot = path.join(path.dirname(OUT), 'attack_shots', String(pl.id).replace(/[^a-z0-9_-]/gi, '_') + '.png'); fs.mkdirSync(path.dirname(shot), { recursive: true }); await o.pg.screenshot({ path: shot, clip: { x: 240, y: 40, width: 800, height: 640 } }); }
        res[i] = { id: pl.id, tile: pl.tile, hypothesis: pl.hypothesis, run, end, findings: mon.findings, pageErrors: o.errs.concat(mon.errors.map((e) => e.msg)).slice(0, 5), trace: mon.trace, secs: +((Date.now() - t0) / 1000).toFixed(1), shot };
      } catch (e) { res[i] = { id: pl.id, tile: pl.tile, error: String(e.message || e).slice(0, 300) }; }
      finally { if (o) await o.ctx.close(); }
      process.stdout.write(`${pl.id} ${res[i].error ? 'ERROR ' + res[i].error : (res[i].end.cleared ? 'CLEARED' : 'not cleared') + ' · ' + res[i].run.reason + ' · findings ' + res[i].findings.length}\n`);
    }
  };
  await Promise.all(Array.from({ length: PAR }, worker));
  fs.writeFileSync(OUT, JSON.stringify(res, null, 1));
  console.log(JSON.stringify({ plans: res.length, cleared: res.filter((r) => r.end && r.end.cleared).length, findings: res.reduce((n, r) => n + ((r.findings || []).length), 0), errors: res.filter((r) => r.error || (r.pageErrors || []).length).length }));
  await br.close();
})();
