Prototype 11.2 (GDD Edit 117) after the first adversarial UI review (pipeline/runs/20261109-013907-ui-p11_1). Bottom to top. World units: the field is 800 × 640; RED-01 is 50.4 × 25.2; the dummy's body radius is 13. The fix list it answers: F1-F15 of that review.

## Off for RED-01 in P11 (white cars keep them)

Prototype 9's forward hatch, side outlines and dotted fill, headlight wedge and its notice flash, brake fan, speech bubbles; the dummy's view edges (all P11). RED-01 keeps its lamps and Prototype 9's roof plate (R01).

## RED-01's marks

| Mark | Drawn | Means | Colour |
|---|---|---|---|
| Rung 0 | Nothing but the plate and seven empty squares | Blind | — |
| Forward ribbon (rung 1 up) | A band along its lane path ahead of the nose, car width + 2 × body radius, to its forward reach (fwdLen at rung 1; `perception.coneRadius` 340 from rung 2). Pulses run out along it | What it brakes for: you in its path | White, fill α 0.08, edges α 0.45; brighter when you are in its path |
| Too-late zone | The first part of the ribbon: reaction × speed + speed² / (2 × braking) + body radius | Step in here and it cannot stop: it hits you, its fault | White α 0.17 |
| Stop line, idle | Dashed white across the lane at the too-late zone's end | Where it would stop if it braked now | White |
| Stop line, braking | Solid when it arrives; STOPS HERE while it brakes | Where it will stop | White |
| Forward cone (rung 2 up) | Outline and 3 grade arcs (± `perception.forwardConeAngle` 10° round its look) | Its graded forward sight; filled faintly when it has you | White |
| Side fans (rung 2 up) | Two fans 10°-95° off the nose, reach 227, a dashed grade ring, pings running out from the mirror pods; ray-cast: cut by tall cover, by low cover while you duck, and by deck tops (parapet gaps open) | Its side sensors | Steel blue α 0.12; the fan that has you α 0.3, faster pings |
| Lidar (rung 3 up) | A thin sweep line round the roof puck; return dots on cover, deck edges and parapet gaps fade behind it; a ring of returns on you when you are in its world (on its road, or falling off a deck onto it) | Its roof lidar | Steel blue |
| Caught box | Corner brackets round the dummy in the colour of the sensor that has it | Sensing / caught | White (forward), steel blue (side) |
| Notice arc | Round the dummy, filling over `perception.sideNoticeSeconds` (× `perception.duckNoticeFactor` ducked) | Time before it notices you | Steel blue |
| Plate marks | Seven squares under the R01 plate, filled to the rung; ? (suspects) or ! (has you) beside the plate | Rung; awareness | Red squares; white glyph |
| Street cameras (rung 4 up) | Post with a 4-unit mint lens; the 60° pan cone always shown (α 0.13, edge α 0.5); LINKED as before | A camera that reports you | Mint |
| Item brackets (rung 5 up) | Orange corner brackets on cones in its lane ahead | It will stop for them | Orange |
| Memory rings (rung 6 up) | A red numbered ring per remembered spot (`duel.memoryRadius` 50); solid as the car nears (within 220) | Spots it watches | Red #ff5a5a |
| Ghost (rung 7) | Red dashed body ring, search ring and countdown arc, LAST SEEN; a red searchlight wedge from the roof sweeping onto it | Where it searches | Red |
| Kit (P11.1) | Lens bar white, mirror pods steel blue, roof puck steel blue, link antenna stub mint, bumper strip orange, tally marks red, searchlight red | Hardware labels | as listed |
| Captions | One at a time, in a band above the field's bottom (IT BRAKES FOR YOU, ITS SIDE CONES HAVE YOU, …) | Events | Sensor colour |
| HUD | Panel and strip fade to α 0.3 while the car or the dummy is under them | — | — |
| Lunge guide | Yellow (yours), brighter when the dash will be hit by the car at its fault | Your dash | Yellow |
| Dummy text | DUCKED · HIDDEN / SEEN and EXPECTED are cut; MOVE ALONG stays (the anti-stall lift) | — | — |

## Declined or open (the designer's call)

- F10: the lesson card keeps no OPEN line in P11. The open trick is the next puzzle's solution; Edit 113 chose not to give it away.
- F6: lesson 3's claim (lidar closes the drop) is measured false on A2; puzzle 4 teaches rungs 3 and 4 together. Open.
- F15 (part): MOVE ALONG stays. Escalator brackets are Prototype 9's art.
- F13: the registry's several reaches per sensor: documented, not consolidated.

Level pieces as before (`p11_marks.md`).
