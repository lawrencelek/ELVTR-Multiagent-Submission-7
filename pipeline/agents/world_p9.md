
THE WORLD (v3): the game is now Prototype 9's Monument district, with Prototype 10's red car driving the tile in test.
- MAP1's tiles each carry `prototype9`: the tile's road and set piece as built, and the verb the tile was built for. Use them.
- Height is a deck: Z1 and Z2 highways, skybridges and walkways over the road, reached by escalators. A dummy drops onto a car through a gap in a deck's parapet. There is no plinth.
- Cover is the tile's own buildings, columns, kiosks and set pieces; low cover is Prototype 9's planters. There is no barrier and no junction box.
- Prototype 9's fleet (sedans, vans, buses) drives every tile. They are white cars: they never learn. Only the red car learns.
- Open ways were measured on the test road: read them as relative difficulty, not as rates on these tiles.
- Each tile's `prototype9.measured` is measured on the built world (engine/affordances.js): its red lanes, whether a deck crosses its road (`deckOverRoad`: height), roadside low cover (`plantersForAnAmbush`), tall cover by the road. Plan only what is there: no planter ambush where `plantersForAnAmbush` is false; no drop where `deckOverRoad` is false.
- Hints name what the tile has (its deck, escalator, tower, planters, the bend) and the move. Never write plinth, barrier or junction.
- Keys, if a hint names one: Space dash, L jump, J cone, hold C duck.
