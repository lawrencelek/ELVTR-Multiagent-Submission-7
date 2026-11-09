// DUMMIES · Prototype 11 adversarial QA: click everywhere. A crawler that taps every screen it reaches (a grid over the whole
// canvas, then each tap target the game drew), presses keys and pad buttons, flicks the analog stick, resizes and blurs the
// window, and follows wherever that leads, for N minutes. Fails nothing; reports every screen reached, every transition,
// page errors, blank canvases and screens it could not leave.
//   node qa/clicks.js OUTDIR [minutes] [seed] [page dir: p11]
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..'), OUT = path.resolve(process.argv[2] || 'qa/runs/clicks'), MIN = +(process.argv[3] || 5), SEED = +(process.argv[4] || 7), DIR = process.argv[5] || 'p11';
let seed = SEED; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }, pick = (a) => a[Math.floor(rnd() * a.length)];
const KEYS = ['Enter', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'Space', 'KeyR', 'KeyM', 'Minus', 'Equal', 'KeyP', 'KeyC', 'Tab', 'Backspace', 'KeyA', 'KeyZ', 'Digit1', 'KeyX', 'KeyT', 'KeyG', 'Delete'];
const BTNS = ['A', 'B', 'X', 'Y', 'START', 'SELECT', 'UP', 'DOWN', 'LEFT', 'RIGHT', 'LB', 'RB'];
(async () => {
  fs.mkdirSync(path.join(OUT, 'shots'), { recursive: true });
  const br = await chromium.launch(), ctx = await br.newContext({ viewport: { width: 1280, height: 720 } }), pg = await ctx.newPage();
  await pg.addInitScript({ path: path.join(__dirname, 'pad.js') });
  const errs = [], cons = []; pg.on('pageerror', (e) => errs.push({ t: Date.now(), msg: e.message, stack: String(e.stack || '').split('\n').slice(0, 3).join(' | ') })); pg.on('console', (m) => { if (m.type() === 'error') cons.push(m.text().slice(0, 200)); });
  await pg.goto('file://' + path.join(ROOT, DIR, 'index.html')); await pg.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } }); await pg.reload(); await pg.waitForTimeout(800);
  const key = () => pg.evaluate(() => { const a = window.__dummies; if (!a) return 'none'; const s = a.sim; return a.screen + (a.paused ? '+paused' : '') + (a.screen === 'game' && s ? ':' + s.phase + (s.p11 ? ':' + s.p11.q.tile : '') : ''); });
  const hits = () => pg.evaluate(() => (window.__dummiesHits ? window.__dummiesHits() : []));
  const stats = { actions: 0, taps: 0, grid: 0, keys: 0, pads: 0, sticks: 0, odd: 0 }, screens = {}, edges = {}, tags = {}, stuck = [], blank = [];
  let cur = await key(), since = Date.now(), gridLeft = [], lastShot = new Set();
  const t0 = Date.now();
  while (Date.now() - t0 < MIN * 60000) {
    if (!screens[cur]) { screens[cur] = { visits: 0, ms: 0 }; gridLeft = []; for (let y = 30; y < 720; y += 60) for (let x = 40; x < 1280; x += 80) gridLeft.push([x, y]); } // a new screen: tap all of it
    screens[cur].visits++;
    if (!lastShot.has(cur) && lastShot.size < 60) { lastShot.add(cur); await pg.screenshot({ path: path.join(OUT, 'shots', cur.replace(/[^a-z0-9+:_-]/gi, '_').replace(/:/g, '-') + '.png') }); }
    const r = rnd(); let act;
    if (gridLeft.length && r < 0.5) { const [x, y] = gridLeft.splice(Math.floor(rnd() * gridLeft.length), 1)[0]; await pg.mouse.click(x, y); stats.grid++; act = 'grid ' + x + ',' + y; }
    else if (r < 0.72) { const H = await hits(); if (H.length) { const h = pick(H); const x = h.x + rnd() * h.w, y = h.y + rnd() * h.h; await pg.mouse.click(x, y); tags[h.tag || '?'] = (tags[h.tag || '?'] || 0) + 1; stats.taps++; act = 'tap ' + h.tag; } else { await pg.mouse.click(rnd() * 1280, rnd() * 720); stats.taps++; act = 'tap any'; } }
    else if (r < 0.86) { const k = pick(KEYS); await pg.keyboard.press(k); stats.keys++; act = 'key ' + k; }
    else if (r < 0.95) { const b = pick(BTNS); await pg.evaluate((b) => window.__qa.press(b, 0.12), b); stats.pads++; act = 'pad ' + b; }
    else if (r < 0.985) { const a = rnd() * Math.PI * 2, m = 0.3 + rnd() * 0.7; await pg.evaluate(([a, m]) => { const p = window.__qa.pad; p.x = Math.cos(a) * m; p.y = Math.sin(a) * m; setTimeout(() => { p.x = 0; p.y = 0; }, 400); }, [a, m]); stats.sticks++; act = 'stick'; }
    else { const o = rnd(); if (o < 0.4) { await pg.setViewportSize({ width: 640 + Math.floor(rnd() * 900), height: 360 + Math.floor(rnd() * 500) }); await pg.waitForTimeout(200); await pg.setViewportSize({ width: 1280, height: 720 }); act = 'resize'; } else if (o < 0.7) { await pg.evaluate(() => { window.dispatchEvent(new Event('blur')); document.dispatchEvent(new Event('visibilitychange')); setTimeout(() => window.dispatchEvent(new Event('focus')), 300); }); act = 'blur'; } else { await pg.evaluate(() => { window.__qa.pad.on = false; setTimeout(() => { window.__qa.pad.on = true; }, 500); }); act = 'pad unplugged'; } stats.odd++; }
    stats.actions++;
    await pg.waitForTimeout(90 + rnd() * 160);
    const nk = await key();
    if (nk !== cur) { const e = cur + ' → ' + nk; edges[e] = (edges[e] || 0) + 1; screens[cur].ms += Date.now() - since; cur = nk; since = Date.now(); }
    else if (Date.now() - since > 75000 && !cur.startsWith('game:play')) { stuck.push({ screen: cur, secs: Math.round((Date.now() - since) / 1000), last: act }); since = Date.now(); await pg.keyboard.press('Escape'); }
    if (stats.actions % 150 === 0) { const px = await pg.evaluate(() => { const c = document.querySelector('canvas'); if (!c) return -1; const g = c.getContext('2d'); if (!g) return -1; const d = g.getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 4 * 997) if (d[i] + d[i + 1] + d[i + 2] > 30) n++; return n; }); if (px === 0) blank.push({ screen: cur, at: stats.actions }); }
  }
  const qa = await pg.evaluate(() => ({ findings: window.__qa.findings, errors: window.__qa.errors, log: window.__qa.log.slice(-40) }));
  const out = { page: DIR, minutes: MIN, seed: SEED, stats, screens, edges, tags, stuck, blank, pageErrors: errs.slice(0, 30), consoleErrors: [...new Set(cons)].slice(0, 30), monitor: qa };
  fs.writeFileSync(path.join(OUT, 'clicks.json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ ok: !errs.length, actions: stats.actions, screens: Object.keys(screens).length, errors: errs.length, stuck: stuck.length, blank: blank.length, findings: qa.findings.length }));
  await br.close();
})();
