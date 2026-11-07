// Headless (node): what each Map 1 tile offers the duel, measured on Prototype 9's built world with engine/duel.js.
// Per tile: the red car's lanes and their on-screen length; whether a deck crosses its road (height); the roadside low
// cover (Prototype 9's planters near its road, and room for the duel's planter rows); street-camera posts by tall cover.
// The pipeline's ingest passes it to the agents (pipeline/inputs/build/affordances.json), so a hint names what is there.
//   node engine/affordances.js > pipeline/inputs/build/affordances.json
const path = require('path'), fs = require('fs'), Module = require('module');
const E = path.join(__dirname, 'p9'), ROOT = path.resolve(__dirname, '..');
const res = Module._resolveFilename; Module._resolveFilename = function (req, parent, ...a) { if (req.startsWith('../p6/') || req.startsWith('../jump/')) req = path.join(E, path.basename(req)); return res.call(this, req, parent, ...a); }; // the vendored files keep 6B's relative paths
const R = JSON.parse(fs.readFileSync(path.join(__dirname, '.cache', 'runtime.json'), 'utf8')); // engine/build_p9.py writes it
Object.assign(globalThis, { DUMMIES_STORY: R.story, DUMMIES_SIM: R.sim });
globalThis.DUMMIES = require(path.join(E, 'sim.js'));
globalThis.WORLD6 = require(path.join(E, 'world6.js'));
const STORY = globalThis.STORY = require(path.join(E, 'story7.js'));
globalThis.DUMMIES_P10 = require(path.join(__dirname, 'vendor', 'testroad.js'));
Object.assign(globalThis, { DUMMIES_STAGES: R.stages, STORY_MAP1: R.plan, DUEL_RULES: R.rules });
require(path.join(__dirname, 'duel.js'));
const X = globalThis.DUMMIES, D = globalThis.DUEL, order = R.story.districts.find((d) => d.id === 'monument').order, out = {};
const s = new STORY.StorySim('monument', Object.assign({}, R.sim), STORY.newProgress());
for (const t of order) {
  const sc = s.W6.at('ABC'.indexOf(t[0]), +t[1] - 1), T = sc.main || sc.lab, P = T.P;
  const lanes = D.laneInfo(T, P), near = (q) => lanes.some((ln) => Math.abs(X.pathProject(ln.path, q.x + q.w / 2, q.y + q.h / 2).lat) < 160);
  const deck = (sc.layers || []).some((l) => l.inBand && lanes.some((ln) => { for (let u = ln.enterS; u <= ln.exitS; u += 20) { const q = X.pathAt(ln.path, u); if (l.inBand(q.x, q.y)) return true; } return false; }));
  const p9planters = (sc.game.statics || []).filter((q) => q.kind === 'planter' && near(q)).length;
  const room = D.placePlanters(T, sc, P, { 'props.planter.height': 14 }, lanes).length;
  const tall = (sc.game.statics || []).filter((q) => ['block', 'booth', 'sculpture', 'column', 'monument'].includes(q.kind) && near(q)).length;
  const cover = {}; for (const q of D.placeCover(T, sc, P, { 'props.planter.height': 14 }, lanes, D.FAMILY.monument)) cover[q.kind] = (cover[q.kind] || 0) + 1; // the roadside cover the duel adds (engine/duel.js)
  const fits = ['open', 'cones'], coverByLevel = {}; // the level layouts this tile can take (engine/progression.json), measured on its road; what each places
  for (const [id, L] of Object.entries(D.RULES.levels || {})) { if (!L.cover || !L.cover.length) { if (id === 'deck' && deck) fits.push(id); continue; }
    const got = D.placeCover(T, sc, P, { 'props.planter.height': 14 }, lanes, null, L); coverByLevel[id] = [...new Set(got.map((q) => q.kind))]; const tallN = got.filter((q) => !q.low).length, lowN = got.filter((q) => q.low && q.kind !== 'bollard' && q.kind !== 'krail').length;
    if ((id === 'low' && lowN) || (id === 'watched' && tallN && lowN) || (id === 'rail' && tallN && got.some((q) => q.kind === 'krail')) || (['kerb', 'setback', 'tall'].includes(id) && tallN)) fits.push(id); }
  out[t] = { levelsThatFit: fits, coverByLevel, roadsideCover: cover, redLanes: lanes.length, roadOnScreen: lanes.map((l) => Math.round(l.exitS - l.enterS)), deckOverRoad: deck, stairs: (sc.stairs || []).length, roadsidePlanters: p9planters, planterRowsThatFit: room, plantersForAnAmbush: p9planters + room > 0 || !!(cover.planter || cover.hedge), tallCoverByRoad: tall };
}
process.stdout.write(JSON.stringify(out, null, 1) + '\n');
