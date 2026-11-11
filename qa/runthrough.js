// DUMMIES · Prototype 11: the full runthrough, as a player plays it, recorded. Real inputs only: taps on the game's own tap
// targets (mouse), keys, and the virtual analog pad (qa/pad.js). No save edits, no teleports.
//   intro → title (Arcade locked, high scores, credits) → STORY → a new save, named → splash → the puzzle grid → puzzle 1 …
//   puzzle 2's pause menu (options, controls, restart) → after puzzle 3: quit to title, reload the page, continue the save →
//   puzzles 4-9 (the boss with its two mid-puzzle lessons) → certified → the grid → title: Arcade open → arcade, high scores.
// Each puzzle plays its script from qa/solutions/<tile>.json through the pad (the boss: engine/p9_play_test.js's cut-in bot).
//   node qa/runthrough.js OUTDIR [page dir: p11]      → OUTDIR/runthrough.json, steps.log, shots/, runthrough.webm (.mp4)
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process'); const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..'), OUT = path.resolve(process.argv[2] || 'qa/runs/runthrough'), DIR = process.argv[3] || 'p11';
const SOL = (t) => JSON.parse(fs.readFileSync(path.join(__dirname, 'solutions', t + '.json'), 'utf8'));
fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
const log = [], T0 = Date.now(), say = (ok, step, detail) => { const e = { t: +((Date.now() - T0) / 1000).toFixed(1), ok, step, detail: detail || '' }; log.push(e); console.log((ok ? 'ok   ' : 'FAIL ') + e.t + 's ' + step + (detail ? ' · ' + (typeof detail === 'string' ? detail : JSON.stringify(detail)) : '')); return ok; };
(async () => {
  const br = await chromium.launch(), ctx = await br.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: OUT, size: { width: 1280, height: 720 } } }), pg = await ctx.newPage();
  await pg.addInitScript({ path: path.join(__dirname, 'pad.js') });
  const errs = []; pg.on('pageerror', (e) => errs.push({ t: (Date.now() - T0) / 1000, msg: e.message }));
  const st = () => pg.evaluate(() => { const a = window.__dummies, s = a && a.sim; return { screen: a && a.screen, paused: a && a.paused, phase: s && s.phase, tile: s && s.p11 ? s.p11.q.tile : (s && s.screenName ? s.screenName() : null), rescue: s && s.rescue, result: s && s.p11 ? s.p11.result : null, restarts: s && s.p11 && s.p11.restarts, rung: s && s.duelT && s.duelT.rung, lesson: !!(s && s.duelT && s.duelT.lesson), card: !!(s && s.duelT && s.duelT.lesson && s.duelT.lesson.card) }; });
  const until = async (f, ms, tick) => { const t0 = Date.now(); let q; while (Date.now() - t0 < ms) { q = await st(); if (f(q)) return q; if (tick) await tick(q); await pg.waitForTimeout(120); } return null; };
  const tags = () => pg.evaluate(() => (window.__dummiesHits ? window.__dummiesHits() : []).map((h) => h.tag));
  const tap = async (tag, ms) => { const t0 = Date.now(); while (Date.now() - t0 < (ms || 6000)) { const H = await pg.evaluate(() => (window.__dummiesHits ? window.__dummiesHits() : [])); const h = H.find((q) => q.tag === tag) || H.find((q) => String(q.tag).startsWith(tag)); if (h) { await pg.mouse.click(h.x + h.w / 2, h.y + h.h / 2); await pg.waitForTimeout(350); return h.tag; } await pg.waitForTimeout(150); } return null; };
  const shot = (n) => pg.screenshot({ path: path.join(OUT, 'shots', n + '.png') });
  const key = async (k) => { await pg.keyboard.press(k); await pg.waitForTimeout(250); };
  const puzzles = [];
  const passSplash = async () => { const t0 = Date.now(); while (Date.now() - t0 < 15000) { const z = await st(); if (z.screen === 'storymap') return z; if (z.screen === 'splash') { if (!(await tap('splash:continue', 800))) await key('Enter'); } await pg.waitForTimeout(600); } return null; }; // the splash takes a tap once its beat has played
  // ---------- intro and title
  await pg.goto('file://' + path.join(ROOT, DIR, 'index.html')); await pg.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } }); await pg.reload();
  await until((q) => q.screen === 'intro', 15000); await pg.waitForTimeout(1200); await shot('01_intro');
  for (let i = 0; i < 4 && (await st()).screen === 'intro'; i++) { if (!(await tap('intro:start', 1500))) await key('Enter'); await pg.waitForTimeout(500); }
  let q = await until((z) => z.screen === 'title', 8000); say(!!q, 'intro → title'); await shot('02_title');
  say(true, 'title tap targets', (await tags()).join(', '));
  await tap('title:ARCADE'); await pg.waitForTimeout(400); q = await st(); say(q.screen === 'title', 'Arcade locked before Certification', q.screen); await shot('03_arcade_locked');
  if (await tap('title:HIGH SCORES')) { q = await until((z) => z.screen === 'scores', 4000); say(!!q, 'high scores'); await shot('04_scores'); if (!(await tap('scores:back'))) await key('Escape'); q = await until((z) => z.screen === 'title', 4000); say(!!q, 'high scores → title'); }
  if (await tap('title:CREDITS')) { await pg.waitForTimeout(800); await shot('05_credits'); if (!(await tap('credits:close', 2000))) await key('Escape'); await pg.waitForTimeout(400); say((await st()).screen === 'title', 'credits → title'); }
  // ---------- a new save
  await tap('title:STORY'); q = await until((z) => z.screen === 'saves', 5000); say(!!q, 'STORY → saves'); await shot('06_saves');
  say(true, 'save tap targets', (await tags()).join(', '));
  const slot = (await tap('save:new', 2000)) || (await tap('save:1', 2000)); await pg.waitForTimeout(400);
  const act = await tap('act:1:NEW GAME', 2000); say(!!(slot || act), 'new save', [slot, act].join(' '));
  await pg.waitForTimeout(500); await shot('07_name');
  await pg.keyboard.type('RUNTHROUGH', { delay: 60 }); await pg.waitForTimeout(300); await key('Enter');
  q = await until((z) => z.screen === 'splash' || z.screen === 'storymap', 8000); say(!!q, 'named → ' + (q && q.screen)); await shot('08_splash');
  q = await passSplash(); say(!!q, 'splash → puzzle grid'); await pg.waitForTimeout(500); await shot('09_grid');
  const ORDER = await pg.evaluate(() => window.P11.ORDER);
  // ---------- the puzzles
  const toCard = async (tile) => { // from the grid or a card: puzzle `tile`'s card
    let z = await st();
    if (z.screen === 'storymap') { await tap('p11:' + tile); await pg.waitForTimeout(500); z = await st(); if (z.screen === 'storymap' && !(await tap('p11:play', 2500))) await key('Space'); } // a tap on an open tile opens its card; else PLAY
    return until((w) => w.screen === 'game' && w.phase === 'brief' && w.tile === tile, 15000);
  };
  const playPuzzle = async (tile, opts) => {
    const sol = SOL(tile), rec = { tile, attempts: 0, ok: false };
    let z = await toCard(tile); if (!say(!!z, tile + ' card')) return rec;
    await shot(`p_${tile}_card`); await key('Enter');
    z = await until((w) => w.phase === 'play' && !w.rescue, 15000); if (!say(!!z, tile + ' drone drop → play')) return rec;
    if (opts && opts.pause) await opts.pause();
    const t0 = Date.now();
    for (let a = 1; a <= 4 && !rec.ok; a++) {
      rec.attempts = a; z = await st(); if (z.phase === 'play' && !z.rescue && a > 1) { await key('KeyR'); await until((w) => w.phase === 'play' && !w.rescue, 10000); }
      if (sol.bot === 'cutin') { // the boss: the cut-in bot (keyboard), as engine/p11_test.js runs it
        const bot = fs.readFileSync(path.join(ROOT, 'engine', 'p9_play_test.js'), 'utf8'), m = bot.match(/await pg\.evaluate\(\(bot\) => \{([\s\S]*?)\n  \}, BOT\);/);
        await pg.evaluate(`((bot) => {${m[1]}})('cutin')`);
        let lessons = 0;
        z = await until((w) => !!w.result, 300000, async (w) => { if (w.phase === 'lesson') { if (w.card && lessons < 9) { lessons++; await shot(`p_${tile}_midlesson_${lessons}`); } await key('Enter'); } });
        await pg.evaluate(() => clearInterval(window.__auto)); rec.midLessons = lessons;
      } else {
        const run = pg.evaluate(([sc]) => window.__qaRun(sc, 150), [sol.script]);
        z = await until((w) => !!w.result || ['report', 'writeoff'].includes(w.phase), 160000, async (w) => { if (w.phase === 'lesson') await key('Enter'); });
        await run.catch(() => null);
      }
      z = await until((w) => w.phase === 'report' || !!w.result, 10000); rec.ok = !!(z && (z.result || z.phase === 'report'));
    }
    rec.secs = Math.round((Date.now() - t0) / 1000);
    z = await until((w) => w.phase === 'report', 10000); await pg.waitForTimeout(1600); await shot(`p_${tile}_result`);
    rec.result = z && z.result; say(rec.ok, tile + ' cleared', { attempts: rec.attempts, secs: rec.secs, result: rec.result });
    // result → lesson → the next card (or the grid after the boss)
    await key('Enter');
    z = await until((w) => w.phase === 'lesson' || w.phase === 'gift' || w.phase === 'brief' || w.screen === 'storymap', 8000);
    if (z && z.phase === 'lesson') { await pg.waitForTimeout(1500); await shot(`p_${tile}_lesson_clip`); await pg.waitForTimeout(2600); await shot(`p_${tile}_lesson_fit`); }
    if (z && z.phase === 'gift') { await pg.waitForTimeout(400); await shot(`p_${tile}_gift_drone`); await pg.waitForTimeout(1300); await shot(`p_${tile}_gift_landed`); await pg.waitForTimeout(1200); await shot(`p_${tile}_gift`); rec.gift = true; } // Shipping V1: a part's gift screen
    z = await until((w) => w.phase === 'brief' || w.screen === 'storymap', 20000, async (w) => { if (w.phase === 'lesson' || w.phase === 'gift') await key('Enter'); });
    say(!!z, tile + ' lesson → ' + (z ? (z.screen === 'storymap' ? 'grid' : 'card ' + z.tile) : '?'));
    return rec;
  };
  const pauseMenu = async () => { // puzzle 2: every pause item that keeps you in the puzzle
    await key('Escape'); let z = await st(); say(z.paused, 'pause opens'); await shot('p_pause'); say(true, 'pause tap targets', (await tags()).join(', '));
    for (const it of ['Options', 'Controls']) { const t = await tap('menu:' + it, 2000); await pg.waitForTimeout(600); await shot('p_pause_' + it.toLowerCase()); say(!!t, 'pause › ' + it, t || 'no target'); await key('Escape'); await pg.waitForTimeout(400); z = await st(); if (!z.paused) await key('Escape'); }
    const r0 = (await st()).restarts; const t = await tap('menu:Restart puzzle', 2000); z = await until((w) => w.restarts > r0 && w.phase === 'play' && !w.rescue, 10000); say(!!z, 'pause › Restart puzzle', t || 'no target');
  };
  for (const tile of ORDER.slice(0, 3)) puzzles.push(await playPuzzle(tile, tile === ORDER[1] ? { pause: pauseMenu } : null));
  // ---------- quit, reload, continue the save
  q = await until((z) => z.phase === 'brief', 5000); await key('Enter'); await until((z) => z.phase === 'play' && !z.rescue, 15000);
  await key('Escape'); const qt = await tap('menu:Quit to title', 3000); q = await until((z) => z.screen === 'title', 6000); say(!!q, 'pause › Quit to title', qt || 'no target');
  await pg.reload(); await until((z) => z.screen === 'intro', 15000); await pg.waitForTimeout(800);
  for (let i = 0; i < 4 && (await st()).screen === 'intro'; i++) { if (!(await tap('intro:start', 1500))) await key('Enter'); await pg.waitForTimeout(500); }
  await until((z) => z.screen === 'title', 8000); await tap('title:STORY'); await until((z) => z.screen === 'saves', 5000); await pg.waitForTimeout(400); await shot('10_saves_after_reload');
  const saveTags = await tags(); say(true, 'saves after reload', saveTags.join(', '));
  await tap('save:1'); await pg.waitForTimeout(400); const cont = (await tap('act:1:CONTINUE', 1500)) || (await tap('act:1:', 1500)); say(true, 'continue the save', cont || 'slot tap');
  q = await passSplash(); await pg.waitForTimeout(500); await shot('11_grid_after_reload');
  const saved = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem('dummies.p11.save1')).progress.p11; } catch (e) { return null; } });
  say(!!q && saved && ORDER.slice(0, 3).every((t) => saved.best && saved.best[t]), 'reload keeps puzzles 1-3 solved', saved && Object.keys(saved.best || {}));
  // ---------- puzzles 4-9
  for (const tile of ORDER.slice(3)) { const r = await playPuzzle(tile); puzzles.push(r); if (!r.ok) break; }
  // ---------- certified
  q = await until((z) => z.screen === 'storymap', 10000); await pg.waitForTimeout(600); await shot('12_grid_certified');
  const arc = await pg.evaluate(() => window.P11.arcadeOpen()); say(arc, 'certified: Arcade open');
  const done = await pg.evaluate(() => { try { return JSON.parse(localStorage.getItem('dummies.p11.save1')).progress.p11; } catch (e) { return null; } });
  say(!!done && done.certified, 'save: certified', done && { certified: done.certified, solved: Object.keys(done.best || {}).length });
  for (let i = 0; i < 4 && (await st()).screen !== 'title'; i++) { await key('Escape'); await pg.waitForTimeout(400); if ((await st()).screen !== 'title') { await key('ShiftLeft'); await pg.waitForTimeout(400); } }
  q = await st(); say(q.screen === 'title', 'back to title', q.screen); await shot('13_title_certified');
  await tap('title:ARCADE'); q = await until((z) => z.screen !== 'title', 5000); say(!!q && q.screen !== 'title', 'Arcade opens', q && q.screen); await pg.waitForTimeout(800); await shot('14_arcade');
  for (let i = 0; i < 4 && (await st()).screen !== 'title'; i++) { await key('Escape'); await pg.waitForTimeout(500); }
  const mon = await pg.evaluate(() => ({ findings: window.__qa.findings, errors: window.__qa.errors, screens: window.__qa.screens }));
  const ok = log.every((e) => e.ok) && !errs.length && puzzles.length === ORDER.length && puzzles.every((p) => p.ok);
  const out = { ok, page: DIR, secs: Math.round((Date.now() - T0) / 1000), puzzles, steps: log, pageErrors: errs.slice(0, 20), monitor: mon };
  fs.writeFileSync(path.join(OUT, 'runthrough.json'), JSON.stringify(out, null, 1));
  const vid = await pg.video().path(); await ctx.close(); await br.close();
  const webm = path.join(OUT, 'runthrough.webm'); fs.renameSync(vid, webm);
  try { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', webm, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '28', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', path.join(OUT, 'runthrough.mp4')]); } catch (e) { console.log('ffmpeg: ' + e.message); }
  console.log(JSON.stringify({ ok, secs: out.secs, puzzles: puzzles.map((p) => p.tile + (p.ok ? ' ✓' : ' ✗') + ' ' + p.attempts + '×' + p.secs + 's'), failed: log.filter((e) => !e.ok).map((e) => e.step), pageErrors: errs.length }));
})();
