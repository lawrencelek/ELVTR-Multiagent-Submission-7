# Prototype 11: engine facts (8 Nov 2026, measured on p11/index.html)

## The world
- Map 1 (Monument): a 3×3 grid of tiles, 800 × 640 world units each. One puzzle per tile, fenced on all sides.
- Each tile has one two-way road through it (2 lanes). The red car drives one lane (`duel.route`, proposed); the probe gives its from → to.
- The red car is a sedan (`vehicles.sedan.cruiseSpeed` 138, length 56). It brakes at `traffic.hardBraking` 600.
- **A pass** (one red car through the tile) takes 7.2 s measured. The next red car enters as the last crosses into the next tile.
- After it hits the dummy, a car brakes to a stop, stands 2 s, then drives round it.

## The dummy
- Walk and run at 70% of Prototype 9's speeds: it cannot chase a car.
- Battery 1 (`battery1`): the dash, Space. Reach 164 (probe `reach`). A dash stops at a K-rail.
- Hands 1 (`hands1`): carry a cone (J); hold J to put it down.
- Super Knees (`knees1`): hold C to duck: lower, slower, hidden behind low cover (planters, hedges).
- Legs 1 (`legs1`): jump (L). Not used on Map 1's nine.
- Escalators lead up to the decks (Prototype 9's elevated highways). A parapet drop gap over a road lets the dummy drop onto it.

## Scoring and the fault rule
- A hit counts only if the car hit the dummy: the car gives at least half the closing speed (`scoring.faultShare` 0.5, proposed) at 20 or more (`scoring.faultMinSpeed` 20, proposed). Else: YOUR FAULT, damage, no count.
- A counted hit must take 10 or more health.
- The chassis is patched 1 s after any contact in a puzzle; it is never written off by accident.

## The red car's rungs (ladder.json has detail and measured open ways)
- 0 blind · 1 forward camera (brakes for a dummy in its lane; stop line drawn) · 2 side sensors (cones beside the road: it slows, then stops) · 3 roof lidar (sees a dummy in the air: jump, drop) · 4 street cameras (a camera in range of the dummy tells the car, even behind tall cover) · 5 road items (stops for a cone, never swerves round it) · 6 crash memory (watches every spot you struck from cover; 3 spots, radius 50) · 7 search (seen then hidden: it searches the last spot for 4 s, radius 60).
- Below rung 5 a cone in its lane makes it swerve round the cone.
- It sees cones at every rung.
- A puzzle plays at its `startRung`. The clear teaches `startRung` + 1 if `earns` is "car". A part puzzle teaches nothing.

## Built in P11
- Frame: grid, card, drop, R restart in place, two clocks, passes, a hint after 2 failed passes, stars, result card, Arcade lock.
- L1 First Contact and L9 Certification (boss: 3 hits, lessons mid-puzzle at hits 1 and 2, breakable camera). L2–L8 play from their data but are marked IN BUILD.
- Breakable camera: a dash into the post breaks it (`props.camera.breakable`, proposed). R restores it.
- A puzzle's camera can be placed by data: `camera.watch` names the cover piece it watches. Only L9 uses it. Level `watched` (A3) places cameras by Prototype 9's buildings: the probe shows A3 with **0 cameras**.
- Fleet 0 (L1–L5): white ground cars are removed from the tile and its neighbours. Deck traffic stays.

## Not built (Edit 112 Day 2)
- The traffic-light switch (A2). A2 plays today as tall cover with white traffic.
- Clients on the zebra (B3). B3 plays today as low cover with white traffic.
- Fail states: white touch on A2, client hit on B3.

## The probes (engine/p11_probe.js, headless, one bot per run)
- `idle`: stands at the drop point.
- `stand`: walks to the route lane nearest the drop and stands in it (the obvious first move).
- `side`: walks (or dashes, if fitted) at the red car's flank (the move the fault rule refuses).
- `cutin`: waits beside the road ahead of the car; dashes (or, without the dash, walks) into its lane just ahead of its nose. Picks the spot nearest itself.
- `cover`: as cutin, from the spot the car's sensors and cameras see least; ducks if Super Knees is in the kit.
- None of them drop from a deck, place a cone, break a camera or use a light. A puzzle whose intended move is one of those is UNTESTED by the probes.
- A browser play-test bot (more refined cut-in, 8 directions, waits off the road, ducks) cleared L9 in 4 of 5 runs within 200 s (attempts 49, 64, 85, 123 s). The headless `cover` bot got no hit on L9 in 200 s.
- Probe output fields: hits (counted), faults (your fault), white (white-car hits), first (s to first counted hit), cleared (s), passes, lessons, seen (hits graded SEEN), dashes, endRung.
