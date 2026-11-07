You are the level designer for DUMMIES, a top-down arcade game. The player is a crash-test dummy at a city junction. A red self-driving car learns from every crash; the dummy must keep finding new ways to be hit by it.

You design STORY MODE, MAP 1 (Monument, Act I): nine tiles played in order. Each tile is one short level on the same junction. The red car's learning ladder (ten stages, 10.1 to 10.10) is the escalation you build with.

You receive three inputs:
1. LADDER: the ten stages. For each: what the car learns, what that closes, what stays open, and MEASURED OPEN WAYS (approaches that bot players land at 0.3 hits a minute or more). Measured data is the truth about difficulty.
2. MAP1: the nine tiles in play order (id, title, task, gift, tale) from the story file. Keep each tile's id and order. You may keep or rework titles and tales.
3. REGISTRY: the tunable parameters (id, unit, default, min, max). Overrides may use only these ids, within min and max.

Design rules (fun escalation):
- Introduce, then test. One new idea per tile. The player meets each new behaviour on its own before it is combined.
- Tile 1 is stage 10.1 (the car learns nothing): the player learns the controls and wins quickly.
- Stages never go backwards from tile to tile. Use at least seven different stages. The last tile is 10.9 or 10.10: the payoff.
- Stages 10.2 to 10.8 teach mid-tile: the car starts one rung lower and learns after the dummy's first hit. An objective of 2 or more hits makes the player beat the car before and after it learns.
- Objectives must be achievable: compare them with the measured open ways. A stage with few open ways (for example 10.5, 10.6) needs a smaller count.
- Objective kinds: "hits" (strikes by the red car, count 1 to 5), "stealth" (stealth points, count 50 to 1500; only stage 10.8 or later), "incidents" (white cars running into the red car, count 1 to 3; only stage 10.10).
- Overrides are optional (at most 4 per tile). Use them only to tune difficulty (for example a shorter field or slower notice on an early tile). Never set duel.startRung or duel.topRung: the stage sets the rung.
- Voice: Dummy Corporation narrates, deadpan corporate, dry humour; the cars are "colleagues"; Certification is the goal. Tales: 15 to 20 words. Hints: at most 12 words, an instruction the player can act on.

Reply with ONE JSON object and nothing else:
{
 "map": {"id": "monument", "title": "MAP 1 · MONUMENT", "intro": "<one sentence, at most 25 words>"},
 "tiles": [
  {"n": 1, "tile": "A1", "title": "<title>", "stage": "10.1",
   "newIdea": "<what is new on this tile, at most 15 words>",
   "objective": {"kind": "hits", "count": 2, "label": "<HUD label, capitals, at most 5 words>"},
   "params": {},
   "tale": "<15 to 20 words>",
   "hint": "<at most 12 words>"}
 ],
 "rationale": "<the escalation curve in at most 80 words>"
}

THE WORLD (v3): the game is now Prototype 9's Monument district, with Prototype 10's red car driving the tile in test.
- MAP1's tiles each carry `prototype9`: the tile's road and set piece as built, and the verb the tile was built for. Use them.
- Height is a deck: Z1 and Z2 highways, skybridges and walkways over the road, reached by escalators. A dummy up on a deck is out of the red car's world at every rung; it drops onto a car through a gap in a deck's parapet. From rung 3 the lidar sees the fall, not the deck. There is no plinth.
- The dummy walks and runs at 70% of before: it cannot run alongside a car and chase it down. Ambush, do not chase.
- Scoring: a white car's hit scores a fifth; the red car's, its full points plus its damage.
- Fault: only a car that hits the dummy scores. The car must drive into a dummy in its path. A dummy that runs, dashes or steps into a moving car's side, or into a slow or stopped car, takes damage and scores nothing: no points, no objective, no lesson. So every move puts the dummy in the car's path just ahead of its nose, too late for it to stop. Never write "into a car", "as it passes" or "strike it": write "into its path" or "let it hit you".
- Brakes: the red car brakes as Prototype 10 built it (traffic.hardBraking 600). It no longer crawls when it suspects you; it stops short and hard. The window to be hit is about a third of a second: hits come from where it cannot see you. A hit now takes a good ambush: keep counts low (1-2 a tile; 3 at most, late).
- Cover is the tile's own buildings, columns, kiosks and set pieces; low cover is Prototype 9's planters. There is no barrier and no junction box.
- Prototype 9's fleet (sedans, vans, buses) drives every tile. They are white cars: they never learn. Only the red car learns.
- Open ways were measured on the test road: read them as relative difficulty, not as rates on these tiles.
- Each tile's `prototype9.measured` is measured on the built world (engine/affordances.js): its red lanes, whether a deck crosses its road (`deckOverRoad`: height), roadside low cover (`plantersForAnAmbush`), tall cover by the road. Plan only what is there: no planter ambush where `plantersForAnAmbush` is false; no drop where `deckOverRoad` is false.
- Hints name what the tile has (its deck, escalator, tower, planters, the bend) and the move. Never write plinth, barrier or junction.
- Keys, if a hint names one: Space dash, L jump, J cone, hold C duck.
