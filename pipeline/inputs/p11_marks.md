Bottom to top. "World units" are the field's pixels at 1x (the field is 800 × 640). RED-01 is 50.4 × 25.2. The dummy's body radius is 13.

## Layer 1: Prototype 9's pixel art (`engine/p9/game.js`, vendored; every car on the dummy's level, the red car included)

| Mark | Drawn | Means in the code | Colour |
|---|---|---|---|
| Headlight beam | A white wedge straight ahead of every car's nose, widening, fading in thirds; shadowed by the dummy and other cars | The car's lights. Prototype 9's art; no rule. It flashes at `proto.art.noticeFlashHz` 4 when the car has "noticed" the dummy by Prototype 9's white-car rule | White, translucent |
| Lamps | Two pixels on the sprite's own headlights (`ui.lampsOnCar` 1) | The lights' source | White |
| Brake glow | A red fan behind a braking car | Braking; held at a standstill for safety | Red |
| Forward corridor (the hatch) | A diagonal hatch (every 4th pixel; every 3rd when "hot"), outlined, straight ahead of the nose, as wide as the car plus the dummy's radius, as long as the car's stopping distance (`fwdLen`) | Prototype 9's WHITE-CAR forward sensor. Drawn for the red car too, at every rung, including rung 0 (blind) | Label grey; ink outline when hot |
| Side sensor outlines | Two dashed sectors, each side of the nose, radius `perception.sideRadius` 100, half angle `perception.sideHalfAngle` 80°; dotted fill on a side detection | Prototype 9's WHITE-CAR side sensors. Drawn for the red car too, at every rung | Label grey |
| Clip | Layer 1's sensor marks only draw inside the dummy's view cone (reach `sensing.coneReach` 900) | What the dummy can see | — |
| View edges | Two faint lines: the dummy's view cone | The dummy's sight | Grey |
| Sprite | Prototype 9's sedan, recoloured red for RED-01; white cars as drawn | — | Red / fleet colours |

## Layer 2: Prototype 10's vector overlay (`engine/duel_ui.js`), the red car only

| Mark | Drawn | Means in the code | Colour |
|---|---|---|---|
| Rung 1 beam | A straight translucent band ahead of the nose, car width + 2 × body radius, `fwdLen` long | The forward camera: it brakes for a dummy in its lane | White α 0.07; red α 0.15 when the dummy is in its path |
| Proportional cones (rung 2 up) | A forward cone (± `perception.forwardConeAngle` 10° round its look, from the nose corners) with 3 dashed grade rings (`perception.forwardGrades`) to reach 340 (`perception.coneRadius`); two side cones (10° to 95° off the nose, each side) with 2 rings (`perception.sideGrades`) to reach 227 (`perception.sideConeRatio` × 340) | What the car sees, graded: each ring nearer is a stronger grade. Side cones are half as sensitive (`perception.sideConeSensitivity` 0.5) | Steel blue fill α 0.05 + 0.2 × sensitivity; YELLOW fill when the car has noticed the dummy; dashed white rings and edges |
| Stop line | A bar across the lane where the braking car will stop; dashed while it approaches; label STOPS HERE | Where it stops short of you | White; red (#ff5a5a) when it expects you (crash memory); amber when searching |
| Awareness | Over the tag: ? (suspects) or ! (has you); a 3-pip meter; a track bar | Its side notice stages: AWARE, SLOWING, CRAWLING, STOPPING | Grey, amber, orange, red |
| Notice ring | A small arc filling right of the tag, `perception.sideNoticeSeconds` 0.6 | Time to notice you in a side cone | White; yellow when full |
| Tag | A label above the car: RED-01 · R*n* NAME · state (AWARE, SLOWING, SEARCHING, FOUND, DRIVING OFF), then seven squares filled to the rung (P11.1) | Its rung and state | White on dark; red squares |
| Kit (P11.1) | One piece a rung on the car (Edit 116): lens bar, mirror pods, roof puck (spins), link fin (pulses while a camera reports you), bumper strip, 3 tally marks, searchlight (sweeps while searching); the newest glints 3 s | Its hardware | White, steel blue, mint, mint, orange, yellow, amber |
| Street cameras (rung 4 up) | A post with a mint lens; a dashed range, a 60° cone that pans (`perception.streetCameraRange` 180, `perception.streetCameraFov` 60, pan `perception.streetCameraPanArc` 60 every `perception.streetCameraPanSeconds` 3) | A camera that reports the dummy to the car | Mint (#9ff2c8) |
| LINKED | A dashed line dummy → camera → car, a box round the dummy, label LINKED | A camera is giving you away | Mint |
| Crash marks | A chalk outline and a numbered marker per crash; from rung 6 the remembered spots ringed (`duel.memoryRadius` 50, up to `duel.memorySites` 3); CHECKING #n over the tag | Where you struck from; what it watches | Chalk; red (#ff5a5a) |
| Ghost (rung 7) | Where it last saw you: a dashed body ring, a search ring (`duel.searchRadius` 60), a countdown arc (`duel.searchSeconds` 4) | Where it searches | Amber (#ffb347) |
| Lunge guide | Where a dash pressed now would land | Yellow when the red car will be there | White / yellow |
| Dummy marks | DUCKED · HIDDEN / DUCKED · SEEN ring; EXPECTED; MOVE ALONG countdown | Its read of the dummy | Grey, yellow, red |
| Flashes | Text by the car or dummy: IT BRAKES FOR YOU, ITS SIDE CONES HAVE YOU, LESSON DUE, YOU HIT IT · YOUR FAULT · NO POINTS, STANDSTILL · NO DAMAGE, HONK | Events | White, red, grey, yellow |

## Layer 3: Prototype 11's frame (`engine/p11_ui.js`)

| Mark | Drawn | Colour |
|---|---|---|
| Panel, top left | RED-01 · RUNG *n* · NAME ◎ hits / count; a second line: what the next hit teaches it | Red border, red and white text |
| Strip, top right | Clock, ★ CLEAR ★ UNTOUCHED ★ PAR, PASS *n* · RESTARTS · R RESTART | Yellow border |
| Hint banner | After two failed passes, bottom | Yellow |
| Broken camera post | A broken post where a dash broke it | — |

## The lesson (between puzzles and mid-boss)

Beat 1, the training clip: the hit replayed in green, REC, IMPACT box. Beat 2, the fitting: a drone lowers the sensor; its field draws out; P11.1 adds a close-up box (KIT · RUNG *n* OF 7, the piece dropping into its slot). Then the card: what it now does, what that closes, what is open, the next puzzle.

## Level pieces

Roadside cover: planter 120 × 16 and hedge 96 × 16 (low; a ducked dummy is hidden behind them); cabinet 44 × 22, kiosk 30 × 20, billboard 64 × 12 (tall). Decks (highways, Z1 and Z2) with parapet gaps over the road; escalators. Cones (orange). Prototype 9's tile art (LED screens, sculptures, arcades).
