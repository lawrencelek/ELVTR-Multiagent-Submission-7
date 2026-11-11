# The screen today (Shipping V1)

1280 × 720. The play field is the centre (about x 240–1040, y 40–680). Panels round it come from Prototype 9; the puzzle layer adds its own.

## Regions

| Region | Where | Holds | Source |
|---|---|---|---|
| Top bar | y < 30 | Left: a yellow tag (PUZZLE n · TILE · NAME, or OBJECTIVE · TILE during the drop). Then the objective line. Right: POINTS | Prototype 9, P11 text |
| Left panel | x < 240 | BODY (health number, bar), DASH (charge bar or NOT FITTED), the district map (MONUMENT · TILE, the 3 × 3 grid) | Prototype 9 |
| Right panel | x > 1040 | CHASSIS 01 (the doll), LAST HIT (part and damage); key hints (WASD MOVE, SPACE DASH, E GRAB, C CROUCH) | Prototype 9 |
| Field: car panel | field top-left | `LUMINARY™ · RUNG n · SENSOR ◎ hits / needed`; second line: what the next hit teaches, or the part you earn; third line on crouch puzzles: the crouch key | P11 (duel_ui.js hud) |
| Field: attempt panel | field top-right | Timer, PAR n s, three stars with words (CLEAR · UNTOUCHED · PAR), PASS n · RESTARTS n · R RESTART | P11 (p11_ui.js) |
| Field: caption band | field bottom, centre | One caption at a time: IT BRAKES FOR YOU, ITS SIDE SENSORS HAVE YOU, LESSON DUE…, MOVE ALONG, STANDSTILL · NO DAMAGE, YOU HIT IT · YOUR FAULT · NO POINTS | duel_ui.js |
| Field: labels | in the world | STOPS HERE (at the car's stop line), LINKED (camera link), LAST SEEN, #n (crash memory), HIT / YOUR FAULT (dash guide), MOVE ALONG · DRONE IN n | duel_ui.js |
| Cards | over the field | The puzzle card (title, tale, goal, NEW, PAR, SPACE START), the car's upgrade screen, the part's gift screen, the result (stars) | P11 |

## "Being seen" today, sensor by sensor

| Sensor (rung) | Field | Idle | When it has you | Words |
|---|---|---|---|---|
| Forward camera (1) | A white ribbon along its lane ahead, brighter "too late" zone at the nose; pulses run out; a white stop bar | Faint ribbon | Ribbon brighter; white corner brackets on the dummy | IT BRAKES FOR YOU (caption, once); STOPS HERE |
| Side sensors (2) | Steel-blue dashed fans either side, grade rings, pings | Faint fans | That side's fan brighter; steel-blue brackets on the dummy; a steel-blue ring fills round the dummy (the notice timer) | ITS SIDE SENSORS HAVE YOU (caption) |
| Roof lidar (3) | A lilac sweep line turning round the roof, dots on cover edges | Turning line, dotted reach circle | Lilac dots on the dummy as the line passes | none |
| Street camera (4) | Mint. A post. Where `perception.streetCameraFov` < 360: a filled pan cone. At 360 (B2, A3 today): only a dashed range circle | Dashed circle or cone | A dashed mint line dummy → camera → car; a mint square on the dummy | LINKED |
| Road items (5) | Orange brackets on cones in its lane ahead | — | — | none |
| Crash memory (6) | Red chalk outlines, numbered markers, red rings at remembered spots | Dashed rings | Ring solid as the car nears | #n |
| Search (7) | Red searchlight wedge, LAST SEEN ring, a timer arc | — | FOUND (caption) | LAST SEEN, FOUND |
| The car's plate | Plate marks on the car: ? then ! as it notices you; seven squares count its rungs | | | ?, ! |

## Values (registry)

- `perception.streetCameraRange` 180; `perception.streetCameraFov` 360 at stages 10.5–10.6 (B2, A3), 60 at 10.8 (C3); `perception.streetCameraPanArc` 60 and `perception.streetCameraPanSeconds` at 10.8. The camera is aimed back up the road at the cover it watches (`p11Camera`).
- `perception.sideNoticeSeconds` (the side notice timer), `perception.forwardConeAngle`, `perception.forwardLength`.

## Other marks the user named

- **The dash guide:** a yellow dotted line from the dummy and a circle where a dash pressed now would land; HIT when the car would hit you there, YOUR FAULT when you would hit it. Today it also draws while the drone carries the dummy in, and dimmed while the dash recharges.
- **Stairs:** pixel chevrons (bright cyan) on each stair apron pointing into the flight, and the flight itself. Decks (walkways) have parapets; a **gap** in a parapet is where you drop onto the road below (puzzle C2, C3). Today the gap is a break in the parapet art only.

## The puzzles' needs (what the screen must carry in play)

- The goal and progress (hits so far / needed), and R to restart.
- What the car can sense now (its fields), and when it has you.
- Your parts and their keys, while you are learning them.
- Stars and par, at a glance. Health (BODY) matters: you lose a body to faults and white cars.
