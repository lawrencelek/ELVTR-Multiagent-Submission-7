// Prototype 11 (p11/index.html) in Chromium. Fails on any page error or a broken step.
//   node engine/p11_test.js [--shots DIR] [--boss SECONDS]
// 1. Flow: intro, title (ARCADE locked), STORY, NEW GAME, the name, the splash, the puzzle grid, puzzle 1's card, the drop.
// 2. L1: R restarts in place; a bot stands in the blind red car's lane; the clear; the result's stars; the lesson; the save.
// 3. On to L9 (the next built puzzle): its card. With --boss S: the cut-in bot plays the boss for up to S seconds, and a dash
//    into the camera post breaks it.
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..');
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const SHOTS = arg('shots', null), BOSS = +arg('boss', 0);
const steps = [], fail = (m) => { steps.push('FAIL ' + m); };

(async () => {
  const br = await chromium.launch();
  const pg = await br.newPage({ viewport: { width: 1280, height: 720 } }), errs = [];
  pg.on('pageerror', (e) => errs.push(e.message));
  await pg.goto('file://' + path.join(ROOT, 'p11', 'index.html'));
  await pg.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } });
  await pg.reload(); await pg.waitForTimeout(1200);
  const shot = async (n) => { if (SHOTS) { fs.mkdirSync(path.resolve(ROOT, SHOTS), { recursive: true }); await pg.screenshot({ path: path.resolve(ROOT, SHOTS, n + '.png') }); } };
  const st = () => pg.evaluate(() => { const a = window.__dummies, s = a.sim, p = s && s.p11; return { card: !!(s && s.duelT && s.duelT.lesson && s.duelT.lesson.card), screen: a.screen, phase: s && s.phase, tile: s && s.screenName && s.screenName(), puzzle: p && p.q.tile, rung: s && s.duelT && s.duelT.rung, hits: s && s.duelHits, rescue: !!(s && s.rescue), restarts: p && p.restarts, clock: p && +p.clock.toFixed(2), attempt: p && +p.attempt.toFixed(2), passes: p && p.passes, failed: p && p.failed, result: p && p.result, toast: a.toast && a.toast.msg, lesson: !!(s && s.duelT && s.duelT.lesson), broken: p ? p.broken.length : 0, cams: s && s.duelT ? (s.duelT.level.cameras || []).length : 0 }; });
  const until = async (fn, ms, every) => { const t0 = Date.now(); let s; while (Date.now() - t0 < ms) { s = await st(); if (fn(s)) return s; if (every) await every(s); await pg.waitForTimeout(120); } return s; };
  const key = async (k, n) => { for (let i = 0; i < (n || 1); i++) { await pg.keyboard.press(k); await pg.waitForTimeout(260); } };

  // 1. the flow
  await key('Enter'); await pg.waitForTimeout(300); // the intro: the first press unlocks audio, the second goes on
  await key('Enter');
  let s = await st(); if (s.screen !== 'title') fail('title: ' + s.screen);
  const items = await pg.evaluate(() => window.__dummiesUI.titleItems());
  await shot('01_title');
  const ai = items.indexOf('ARCADE'); for (let i = 0; i < ai; i++) await key('ArrowRight');
  await key('Enter'); s = await st();
  steps.push('title ' + items.join(',') + ' · ARCADE → ' + s.screen + ' · ' + (s.toast || ''));
  if (s.screen !== 'title' || !/locked/i.test(s.toast || '')) fail('arcade not locked');
  for (let i = 0; i < ai; i++) await key('ArrowLeft');
  await key('Enter'); // STORY: the save screen
  s = await until((q) => q.screen === 'storymap', 12000, async (q) => { await pg.keyboard.press('Enter'); await pg.waitForTimeout(500); });
  await pg.waitForTimeout(400); await shot('02_grid');
  steps.push('grid ' + s.screen);
  if (s.screen !== 'storymap') fail('no grid');
  // a locked puzzle refuses: C3 before A1
  await key('ArrowLeft'); await key('ArrowUp'); s = await st(); // A1 → C3 (wraps)
  const sel = await pg.evaluate(() => window.__dummies.p11Sel); await key('Enter'); s = await st();
  steps.push('grid pick ' + sel + ' → ' + s.screen);
  if (s.screen !== 'storymap') fail('a locked puzzle deployed');
  await key('ArrowRight'); await key('ArrowDown'); // back to A1
  await key('Enter');
  s = await until((q) => q.phase === 'brief', 15000);
  await pg.waitForTimeout(500); await shot('03_card_A1');
  steps.push('card ' + s.puzzle + ' ' + s.phase + ' rung ' + s.rung);
  if (s.puzzle !== 'A1' || s.phase !== 'brief') fail('A1 card');
  await key('Enter');
  s = await until((q) => q.phase === 'play' && !q.rescue, 10000);
  const fence = await pg.evaluate(() => window.__dummies.sim.fenceSides().join(''));
  steps.push('drop → play · fences ' + fence);
  await pg.waitForTimeout(1500);
  // 2. R restarts in place
  await key('KeyR'); s = await st();
  steps.push('R → restarts ' + s.restarts + ' phase ' + s.phase + ' rescue ' + s.rescue + ' clock ' + s.clock + ' attempt ' + s.attempt);
  if (s.restarts !== 1 || !s.rescue) fail('restart');
  s = await until((q) => q.phase === 'play' && !q.rescue, 8000);
  await shot('04_play_A1');
  // the pause menu's Restart puzzle
  await key('Escape'); await key('ArrowDown'); await key('Enter'); s = await st();
  steps.push('pause → Restart puzzle → restarts ' + s.restarts + ' rescue ' + s.rescue);
  if (s.restarts !== 2) fail('pause restart');
  // two failed passes (stand clear of the road): the hint
  s = await until((q) => q.failed >= 2, 40000);
  const hint = await pg.evaluate(() => window.__dummies.sim.p11Hint());
  steps.push('failed passes ' + s.failed + ' → hint ' + JSON.stringify(hint));
  if (!hint) fail('no hint after two failed passes');
  await pg.waitForTimeout(300); await shot('04b_hint_A1');
  // the bot: stand in the red car's lane, ahead of it; Enter on the result and the lesson
  await pg.evaluate(() => {
    const down = new Set(), key = (k, on) => { if (on === down.has(k)) return; on ? down.add(k) : down.delete(k); dispatchEvent(new KeyboardEvent(on ? 'keydown' : 'keyup', { code: k, key: k })); };
    const steer = (dx, dy, dead) => { key('ArrowRight', dx > dead); key('ArrowLeft', dx < -dead); key('ArrowDown', dy > dead); key('ArrowUp', dy < -dead); };
    let spot = null;
    window.__auto = setInterval(() => {
      const s = window.__dummies.sim; if (!s || s.phase !== 'play' || s.rescue) { steer(0, 0, 1); return; }
      const T = s.duelT, b = s.body, X = window.DUMMIES, ln = T.redLanes.find((l) => l.i === T.DP['duel.route']) || T.redLanes[0];
      if (!spot) { let best = null; for (let u = ln.enterS + 120; u <= ln.exitS - 120; u += 10) { const q = X.pathAt(ln.path, u), d = Math.hypot(q.x - b.x, q.y - b.y); if (!best || d < best.d) best = { x: q.x, y: q.y, d }; } spot = best; }
      const c = T.cars.find((q) => q.red && !q.spent && !q.ghost);
      const near = c && Math.hypot(c.x - b.x, c.y - b.y) < 70; // let it come: stand still once it is close
      if (near) { steer(0, 0, 1); return; }
      steer(spot.x - b.x, spot.y - b.y, 3);
    }, 50);
  });
  s = await until((q) => !!q.result, 45000);
  await pg.evaluate(() => clearInterval(window.__auto));
  steps.push('L1 result ' + JSON.stringify(s.result));
  if (!s.result || !s.result.stars[0] || s.result.restarts !== 2) fail('L1 not cleared');
  s = await until((q) => q.phase === 'report', 6000);
  await pg.waitForTimeout(1600); await shot('05_result_A1');
  await key('Enter');
  s = await until((q) => q.phase === 'lesson', 4000);
  steps.push('Enter → ' + s.phase);
  await pg.waitForTimeout(1800); await shot('06_lesson_clip');
  s = await until((q) => q.phase !== 'lesson', 15000, async () => { await pg.keyboard.press('Enter'); await pg.waitForTimeout(700); });
  const NEXT = await pg.evaluate(() => window.P11.ORDER[1]); // puzzle 2 (Edit 115: all nine built)
  s = await until((q) => q.phase === 'brief' && q.puzzle === NEXT, 15000);
  await pg.waitForTimeout(500); await shot('07_card_next');
  const save = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem('dummies.p11.save1')).progress.p11; } catch (e) { return null; } });
  steps.push('next → ' + s.puzzle + ' ' + s.phase + ' rung ' + s.rung + ' cams ' + s.cams + ' · save ' + JSON.stringify(save));
  if (s.puzzle !== NEXT || !save || !save.best.A1) fail('next card or save');

  // 3. the boss (optional): the cut-in bot; a scripted dash into the camera post
  if (BOSS > 0) {
    await require('./p11_goto.js')(pg, 'C3'); // the boss, from a save with puzzles 1-8 solved
    await key('Enter');
    s = await until((q) => q.phase === 'play' && !q.rescue, 10000);
    const cam = await pg.evaluate(() => { const s = window.__dummies.sim, c = (s.duelT.level.cameras || [])[0], b = s.body; if (!c) return null; const dx = c[0] - b.x, dy = c[1] - b.y, l = Math.hypot(dx, dy); Object.assign(b, { x: c[0] - dx / l * 40, y: c[1] - dy / l * 40, px: c[0] - dx / l * 40, py: c[1] - dy / l * 40 }); return { c, dir: [dx / l, dy / l] }; });
    if (cam) { // aim and dash into the post
      const k = (c, on) => pg.evaluate(([c, on]) => dispatchEvent(new KeyboardEvent(on ? 'keydown' : 'keyup', { code: c, key: c })), [c, on]);
      const hk = cam.dir[0] > 0.4 ? 'ArrowRight' : cam.dir[0] < -0.4 ? 'ArrowLeft' : null, vk = cam.dir[1] > 0.4 ? 'ArrowDown' : cam.dir[1] < -0.4 ? 'ArrowUp' : null;
      if (hk) await k(hk, true); if (vk) await k(vk, true); await pg.waitForTimeout(80); await pg.keyboard.press('Space'); await pg.waitForTimeout(700); if (hk) await k(hk, false); if (vk) await k(vk, false);
    }
    s = await st(); steps.push('camera dash → broken ' + s.broken + ' cams ' + s.cams);
    if (cam && s.broken !== 1) fail('camera not broken');
    await pg.waitForTimeout(400); await shot('08_camera_broken');
    await key('KeyR'); s = await st(); steps.push('R → cams ' + s.cams + ' broken ' + s.broken);
    if (cam && (s.cams !== 1 || s.broken !== 0)) fail('camera not whole after R');
    s = await until((q) => q.phase === 'play' && !q.rescue, 8000);
    const bot = fs.readFileSync(path.join(__dirname, 'p9_play_test.js'), 'utf8'), m = bot.match(/await pg\.evaluate\(\(bot\) => \{([\s\S]*?)\n  \}, BOT\);/);
    await pg.evaluate(`((bot) => {${m[1]}})('cutin')`);
    const t0 = Date.now(); let lessons = 0, last = null;
    while (Date.now() - t0 < BOSS * 1000) {
      s = await st();
      if (s.lesson && s.phase === 'lesson' && last !== s.rung) { last = s.rung; lessons++; await pg.waitForTimeout(1500); await shot('09_boss_lesson_' + lessons); await until((q) => q.phase !== 'lesson' || q.card, 8000); if (lessons === 1) await shot('09_boss_lesson_card'); }
      if (s.result) break;
      await pg.waitForTimeout(300);
    }
    await pg.evaluate(() => clearInterval(window.__auto));
    s = await st();
    steps.push('boss ' + Math.round((Date.now() - t0) / 1000) + ' s · hits ' + s.hits + ' rung ' + s.rung + ' lessons ' + lessons + ' passes ' + s.passes + ' failed ' + s.failed + ' result ' + JSON.stringify(s.result));
    if (s.result) { // the certified result, then the grid; Arcade opens
      s = await until((q) => q.phase === 'report', 8000); await pg.waitForTimeout(1600); await shot('10_boss_result');
      await key('Enter'); s = await until((q) => q.screen === 'storymap', 8000); await pg.waitForTimeout(300); await shot('11_grid_certified');
      const arc = await pg.evaluate(() => window.P11.arcadeOpen()); steps.push('certified → ' + s.screen + ' · arcade open ' + arc);
      if (s.screen !== 'storymap' || !arc) fail('certification');
      await key('ShiftLeft'); await key('Escape'); await pg.waitForTimeout(300);
      await pg.evaluate(() => { const a = window.__dummies; a.screen = 'title'; a.sim = null; }); await pg.waitForTimeout(400); await shot('12_title_arcade_open');
    } else steps.push('note: the bot did not clear the boss in ' + BOSS + ' s (the bot, not the game: certification untested this run)');
  }
  await br.close();
  const ok = !errs.length && !steps.some((q) => q.startsWith('FAIL'));
  for (const q of steps) console.log(q);
  console.log(JSON.stringify({ ok, errors: errs.slice(0, 5) }));
  process.exit(ok ? 0 : 1);
})();
