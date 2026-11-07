// Plays the integrated game (index.html) in Chromium: intro, title, STORY, the tile's card, then an autopilot dummy that
// stands in the red car's way until the tile clears (or the time runs out). Fails on any page error.
//   node engine/p9_play_test.js [--tile N] [--through M] [--seconds S] [--shots DIR] [--video DIR] [--bot walkin|flank]
// --through M plays on until tile M is cleared (default: the tile it starts on).
// --tile N starts on Map 1's tile N (1-9) from a save that has cleared the tiles before it.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const TILE = +arg('tile', 1), THROUGH = +arg('through', arg('tile', 1)), SECS = +arg('seconds', 120), SHOTS = arg('shots', null), VID = arg('video', null), BOT = arg('bot', 'walkin');
const ORDER = ['A1', 'B1', 'C1', 'C2', 'B2', 'A2', 'A3', 'B3', 'C3'];

(async () => {
  const br = await chromium.launch();
  const ctx = await br.newContext(Object.assign({ viewport: { width: 1280, height: 720 } }, VID ? { recordVideo: { dir: path.resolve(ROOT, VID), size: { width: 1280, height: 720 } } } : {}));
  const pg = await ctx.newPage(), errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto('file://' + path.join(ROOT, 'index.html'));
  await pg.evaluate(({ tile, order }) => {
    try { localStorage.clear(); } catch (e) { /* none */ }
    if (tile > 1) { const pr = window.STORY.newProgress(); pr.done.monument = order.slice(0, tile - 1); localStorage.setItem('dummies.p7.save1', JSON.stringify({ v: 1, name: 'TEST DUMMY 1', saved: Date.now(), progress: pr })); }
  }, { tile: TILE, order: ORDER });
  await pg.reload(); await pg.waitForTimeout(1200);
  const shot = async (n) => { if (SHOTS) { fs.mkdirSync(path.resolve(ROOT, SHOTS), { recursive: true }); await pg.screenshot({ path: path.resolve(ROOT, SHOTS, n + '.png') }); } };
  const st = () => pg.evaluate(() => { const a = window.__dummies, s = a.sim; return { screen: a.screen, phase: s && s.phase, tile: s && s.screenName && s.screenName(), duel: s && s.duelDef && s.duelDef.tile, stage: s && s.duelDef && s.duelDef.stage, rung: s && s.duelT && s.duelT.rung, hits: s && s.duelHits, done: s && s.story && (s.story.done.monument || []).length, rescue: !!(s && s.rescue) }; });
  await shot('00_intro');
  for (const k of ['Enter', 'Enter']) { await pg.keyboard.press(k); await pg.waitForTimeout(500); }
  await shot('01_title');
  await pg.keyboard.press('Enter');
  let s = null; for (let i = 0; i < 200; i++) { s = await st(); if (s.phase === 'brief') break; await pg.waitForTimeout(150); }
  await pg.waitForTimeout(600); await shot('02_card');
  const card = s;
  await pg.keyboard.press('Enter');
  for (let i = 0; i < 100; i++) { s = await st(); if (s.phase === 'play' && !s.rescue) break; await pg.waitForTimeout(150); }
  await pg.evaluate((bot) => { // the autopilot: ahead of the red car's nose on its lane (walkin), or beside its path (flank), Enter on any card
    const down = new Set(), key = (k, on) => { if (on === down.has(k)) return; on ? down.add(k) : down.delete(k); dispatchEvent(new KeyboardEvent(on ? 'keydown' : 'keyup', { code: k, key: k })); };
    window.__auto = setInterval(() => {
      const s = window.__dummies.sim; if (!s) return;
      if (s.phase === 'lesson' || s.phase === 'report' || s.phase === 'brief' || s.phase === 'gift') { ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach((k) => key(k, false)); dispatchEvent(new KeyboardEvent('keydown', { code: 'Enter', key: 'Enter' })); dispatchEvent(new KeyboardEvent('keyup', { code: 'Enter', key: 'Enter' })); return; }
      const b = s.body, T = s.duelT, c = T && T.cars.find((q) => q.red && !q.spent);
      let tx = b.x, ty = b.y;
      if (c && b.alive) { // an ambush, not a chase (the dummy walks at 70%): a spot on the car's path well ahead of it, kept until that car has passed
        const X = window.DUMMIES, side = bot === 'flank' ? 56 : 0;
        if (!window.__spot || window.__spot.car !== c.id || c.s > window.__spot.s) { let sAt = c.s + 320; for (; sAt > c.s + 120; sAt -= 20) { const q = X.pathAt(c.path, sAt); if (q.x > 40 && q.x < 760 && q.y > 40 && q.y < 600) break; } window.__spot = { car: c.id, s: sAt }; }
        const q = X.pathAt(c.path, window.__spot.s); tx = q.x + q.nx * side; ty = q.y + q.ny * side; }
      tx = Math.max(24, Math.min(776, tx)); ty = Math.max(24, Math.min(616, ty));
      const dx = tx - b.x, dy = ty - b.y;
      key('ArrowRight', dx > 6); key('ArrowLeft', dx < -6); key('ArrowDown', dy > 6); key('ArrowUp', dy < -6);
    }, 50);
  }, BOT);
  const t0 = Date.now(); let n = 0, lastShot = 0;
  while (Date.now() - t0 < SECS * 1000) {
    s = await st();
    if (Date.now() - lastShot > 8000) { await shot('play_' + String(n++).padStart(2, '0')); lastShot = Date.now(); }
    if (s.done >= THROUGH) break;
    await pg.waitForTimeout(400);
  }
  await pg.evaluate(() => clearInterval(window.__auto));
  await shot('zz_end');
  const trace = await pg.evaluate(() => { const s = window.__dummies.sim, T = s && s.duelT; return { lessons: T ? T.lessons : null, crashes: T ? T.crashes.length : null, events: s ? s.events.slice(-12).map((e) => e.type) : [] }; });
  await ctx.close(); await br.close();
  const ok = !errs.length && card.phase === 'brief' && card.duel === ORDER[TILE - 1];
  console.log(JSON.stringify({ ok, card, end: s, cleared: s.done >= THROUGH, seconds: Math.round((Date.now() - t0) / 1000), trace, errors: errs.slice(0, 5) }));
  process.exit(ok ? 0 : 1);
})();
