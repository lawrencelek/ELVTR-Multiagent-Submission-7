// DUMMIES · FINAL V3.2: records the gameplay video's scenes in Chromium, with the game's own sound (a tap on its Web Audio output).
// Real inputs: keys and the virtual pad (qa/pad.js); bosses by engine/p9_play_test.js's cut-in bot. Needs the build served over HTTP
// (the sound engine is silent on file://):  (cd <repo> && python3 -m http.server 8765) &  P11_URL=http://localhost:8765 node qa/video.js OUT [scene ...]
// Scenes: start (intro → new game → puzzle 1 → its lesson), gift (Map 1 puzzle 3 → Battery 1), map2 (Parkland B2), boss (Map 3's boss → the send-off).
// Out: OUT/<scene>.webm (video), OUT/<scene>.audio.webm, OUT/<scene>.json (offsets and marks, seconds from the video's start).
const path = require('path'), fs = require('fs'); const { chromium } = require('playwright');
const ROOT = path.resolve(__dirname, '..'), OUT = path.resolve(process.argv[2] || 'qa/runs/video'), URL = (process.env.P11_URL || 'http://localhost:8765').replace(/\/$/, ''), DIR = process.env.P11_DIR = process.env.P11_DIR || 'final_v3';
process.env.P11_URL = URL; const goto = require(path.join(ROOT, 'engine', 'p11_goto.js')); fs.mkdirSync(OUT, { recursive: true });
const SOL = (mid, t) => JSON.parse(fs.readFileSync(path.join(__dirname, 'solutions', (mid === 'monument' ? '' : mid + '_') + t + '.json'), 'utf8'));
const TAP = `(() => { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; const orig = AudioNode.prototype.connect; window.__rec = { taps: [] };
  AudioNode.prototype.connect = function (dest, ...a) { const r = orig.call(this, dest, ...a);
    try { if (dest && dest instanceof AudioDestinationNode) { const ctx = dest.context; let t = ctx.__tap;
      if (!t) { const md = ctx.createMediaStreamDestination(), mr = new MediaRecorder(md.stream, { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 160000 }); t = ctx.__tap = { md, mr, chunks: [], t0: Date.now(), n: 0 }; mr.ondataavailable = (e) => { if (e.data && e.data.size) t.chunks.push(e.data); }; mr.start(250); window.__rec.taps.push(t); }
      t.n++; orig.call(this, t.md); } } catch (e) { window.__rec.err = String(e); }
    return r; };
  window.__audioDump = () => new Promise((res) => { const T = window.__rec.taps.slice().sort((a, b) => b.n - a.n)[0]; if (!T) return res(null); T.mr.onstop = async () => { const b = new Blob(T.chunks, { type: 'audio/webm' }), buf = new Uint8Array(await b.arrayBuffer()); let s = ''; for (let i = 0; i < buf.length; i += 32768) s += String.fromCharCode.apply(null, buf.subarray(i, i + 32768)); res({ t0: T.t0, b64: btoa(s) }); }; T.mr.stop(); });
})();`;
async function scene(br, name, body) {
  const ctx = await br.newContext({ viewport: { width: 1280, height: 720 }, recordVideo: { dir: OUT, size: { width: 1280, height: 720 } } }), pg = await ctx.newPage(), T0 = Date.now(), marks = {}, errs = [];
  await pg.addInitScript({ path: path.join(__dirname, 'pad.js') }); await pg.addInitScript(TAP); pg.on('pageerror', (e) => errs.push(e.message));
  const mark = (k) => { marks[k] = +((Date.now() - T0) / 1000).toFixed(2); console.log(name, k, marks[k]); };
  const st = () => pg.evaluate(() => { const a = window.__dummies, s = a && a.sim, p = s && s.p11; return { screen: a && a.screen, phase: s && s.phase, tile: p ? p.q.tile : (s && s.screenName ? s.screenName() : null), result: p && p.result, rescue: !!(s && s.rescue), card: !!(s && s.lessonCard) }; });
  const until = async (f, ms, tick) => { const t0 = Date.now(); let q; while (Date.now() - t0 < ms) { q = await st(); if (f(q)) return q; if (tick) await tick(q); await pg.waitForTimeout(120); } return null; };
  const tap = async (tag, ms) => { const t0 = Date.now(); while (Date.now() - t0 < (ms || 4000)) { const H = await pg.evaluate(() => (window.__dummiesHits ? window.__dummiesHits() : [])); const h = H.find((q) => q.tag === tag) || H.find((q) => String(q.tag).startsWith(tag)); if (h) { await pg.mouse.click(h.x + h.w / 2, h.y + h.h / 2); await pg.waitForTimeout(300); return h.tag; } await pg.waitForTimeout(150); } return null; };
  const key = async (k, w) => { await pg.keyboard.press(k); await pg.waitForTimeout(w == null ? 250 : w); };
  const play = async (mid, tile) => { // from the card: drop in, play the script (or the boss bot), to the result
    const sol = SOL(mid, tile); mark('card'); await pg.waitForTimeout(2200); await key('Enter'); await until((w) => w.phase === 'play' && !w.rescue, 15000); mark('play');
    for (let a = 1; a <= 4; a++) {
      if (a > 1) { await key('KeyR'); await until((w) => w.phase === 'play' && !w.rescue, 10000); }
      if (sol.bot === 'cutin') { const bot = fs.readFileSync(path.join(ROOT, 'engine', 'p9_play_test.js'), 'utf8'), m = bot.match(/await pg\.evaluate\(\(bot\) => \{([\s\S]*?)\n  \}, BOT\);/); await pg.evaluate(`((bot) => {${m[1]}})('cutin')`);
        await until((w) => !!w.result, 300000, async (w) => { if (w.phase === 'lesson') { mark('lesson' + Date.now() % 1000); await pg.waitForTimeout(3500); await key('Enter'); } }); await pg.evaluate(() => clearInterval(window.__auto)); }
      else { const run = pg.evaluate(([sc]) => window.__qaRun(sc, 150), [sol.script]); await until((w) => !!w.result || ['report', 'writeoff'].includes(w.phase), 160000, async (w) => { if (w.phase === 'lesson') await key('Enter'); }); await run.catch(() => null); }
      const z = await until((w) => w.phase === 'report' || !!w.result, 10000); if (z && z.result) break;
    }
    mark('result'); await until((w) => w.phase === 'report', 10000); await pg.waitForTimeout(3200);
  };
  try { await body({ pg, st, until, tap, key, mark, play }); } catch (e) { errs.push('scene: ' + e.message); }
  const a = await pg.evaluate(() => window.__audioDump && window.__audioDump()).catch(() => null);
  const vid = pg.video(); await ctx.close(); const vp = await vid.path(); fs.renameSync(vp, path.join(OUT, name + '.webm'));
  if (a) fs.writeFileSync(path.join(OUT, name + '.audio.webm'), Buffer.from(a.b64, 'base64'));
  fs.writeFileSync(path.join(OUT, name + '.json'), JSON.stringify({ name, audioOffset: a ? (a.t0 - T0) / 1000 : null, marks, errors: errs }, null, 1)); console.log(name, 'done', errs.slice(0, 3));
}
const SCENES = {
  async start({ pg, st, until, tap, key, mark, play }) { // intro → title → STORY → new game → the grid → puzzle 1 → its lesson → puzzle 2's card
    await pg.goto(URL + '/' + DIR + '/index.html'); await pg.evaluate(() => { try { localStorage.clear(); } catch (e) { /* none */ } }); await pg.reload(); await until((z) => z.screen === 'intro', 15000); mark('intro'); await pg.waitForTimeout(3500);
    for (let i = 0; i < 4 && (await st()).screen === 'intro'; i++) { if (!(await tap('intro:start', 1500))) await key('Enter'); await pg.waitForTimeout(600); }
    await until((z) => z.screen === 'title', 8000); mark('title'); await pg.waitForTimeout(2500); await tap('title:STORY'); await until((z) => z.screen === 'saves', 5000); await pg.waitForTimeout(1200);
    (await tap('save:new', 2000)) || (await tap('save:1', 2000)); await pg.waitForTimeout(500); await tap('act:1:NEW GAME', 2000); await pg.waitForTimeout(800);
    await pg.keyboard.type('CHASSIS 01', { delay: 90 }); await pg.waitForTimeout(500); await key('Enter', 600);
    for (let i = 0; i < 40; i++) { const z = await st(); if (z.screen === 'storymap') break; if (z.screen === 'splash') { await pg.waitForTimeout(2500); if (!(await tap('splash:continue', 800))) await key('Enter'); } await pg.waitForTimeout(300); }
    mark('grid'); await pg.waitForTimeout(2500); await tap('p11:A1'); await pg.waitForTimeout(500); if ((await st()).screen === 'storymap' && !(await tap('p11:play', 2500))) await key('Space');
    await until((w) => w.phase === 'brief', 15000); await play('monument', 'A1');
    await key('Enter'); await until((w) => w.phase === 'lesson' || w.phase === 'brief', 8000); mark('lesson'); await pg.waitForTimeout(7000);
    await until((w) => w.phase === 'brief', 20000, async (w) => { if (w.phase === 'lesson') await key('Enter', 1200); }); mark('next'); await pg.waitForTimeout(2500);
  },
  async gift({ pg, until, key, mark, play }) { await goto(pg, 'C1', ROOT); await play('monument', 'C1'); await key('Enter'); await until((w) => w.phase === 'gift', 8000); mark('gift'); await pg.waitForTimeout(7500); await key('Enter', 1500); },
  async map2({ pg, until, key, mark, play }) { await goto(pg, 'parkland:B2', ROOT); await play('parkland', 'B2'); },
  async boss({ pg, st, until, key, mark, play }) {
    await goto(pg, 'waterfront:C3', ROOT); await play('waterfront', 'C3'); await key('Enter');
    await until((w) => w.phase === 'voyage', 10000); mark('tour'); await until((w) => w.phase === 'unveil', 30000); mark('unveil'); await pg.waitForTimeout(6200); await key('Space');
    await until((w) => w.phase === 'cheer', 30000); mark('cheer'); await until((w) => w.phase === 'ending', 15000); mark('ending'); await pg.waitForTimeout(4500);
  },
};
(async () => { const br = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }), want = process.argv.slice(3); for (const n of Object.keys(SCENES)) if (!want.length || want.includes(n)) await scene(br, n, SCENES[n]); await br.close(); })();
