# The two screens, as built (Prototype 11.2)

## The reference: the Dummy Chassis gift screen (Prototype 9, Edit 84; `drawGiftPopup` in game.js)

Shown when the dummy earns a part (phase `gift`). Times from the screen's start.
- 0-0.18 s: a veil fades in over the play field. A panel scales 0.86 → 1 with a back-ease (0.3 s).
- Panel: the play field's rect less 36/26 px margins. Left: the chassis doll at 4x pixel scale, dimmed to 60% until the module lands, a cyan radial glow behind it. Right: the text column.
- 0-0.7 s (`ui.gift.fallSeconds` 0.7): label "CORPORATION DRONE · INCOMING", blinking. Pulsing yellow corner brackets on the module's seat. The drone sprite descends over the head with the module on a tether, lets go, climbs away; the module falls into its seat with three ghost trails, glowing cyan.
- 0.7 s, the landing: screen shake (8 px, decays over 0.35 s); the module flashes white (7 Hz, 0.5 s); 14 golden rays turning behind the module; two rings expand (yellow, cyan, 0.6 s); 16 white spark lines burst out (0.55 s); the whole panel flashes white once (0.3 s).
- Text after the landing: "NEW PART FITTED" (cyan label); the part's name pops in (64 px, scale 1.4 → 1 over 0.28 s, yellow); a button badge and the verb ("A · DASH"); a description (22 px, wraps, up to 4 lines); a rule; "NEXT FROM THE CORPORATION" and the next part's tile.
- Sound (`giftFanfare`): a rising whoosh for the fall; a thud and noise on the landing; a four-note arpeggio; a held chord; four sparkle pings.
- Continue: after `ui.gift.holdSeconds` 1.2 s, "SPACE · CONTINUE" (or "A", "TAP") blinks bottom right. A tap or A continues.

## The current car lesson (Prototype 10/11; `lesson` in engine/duel_ui.js)

Shown after a clear that teaches the car (phase `lesson`), after the stars card. Three beats, each over the whole play field.
- Beat 1, the clip (`duel.lessonClipSeconds` 3 s): the last 3 s before the hit, replayed in the game's own graphics (game.js draws the recorded frame), a green camera tint, scan lines, a top bar "TRAINING CLIP · RED-01" and a blinking REC, a bottom bar with the clock relative to the hit ("−1.7 s · YOUR HIT, AS THE CAR SAW IT").
- Hold (`duel.lessonHoldSeconds` 0.8 s): the frame of impact frozen; a green box on the dummy, "IMPACT · FRONT CORNER".
- Beat 2, the fitting (`duel.lessonFitSeconds` 2 s): the impact frame dimmed; a small drone lowers the new piece onto the car; the sensor's field draws out on the road; a dashed red ring round the car. A 320 x 178 inset ("KIT · RUNG 3 OF 7") shows the kit sedan at 2.9x with the piece dropping into its slot, then a glint.
- The card: a full-field dark panel with a red frame. "FARSIGHT · TRAINING LOG · RED-01"; "LESSON: ROOF LIDAR" (40 px red); "Rung 2 → 3. Your hit: FRONT CORNER · STRUCK"; the rung's long text (22 px); CLOSED (what this rung stops); NEXT (the next puzzle's name and what is new). "ENTER · CONTINUE" blinks.
- Enter during beats 1-2 skips to the card; Enter on the card continues.
- A clear that teaches two rungs (puzzle 4: roof lidar, then street cameras) plays two full lessons back to back on the same clip.

## What the code can draw (engine/duel_ui.js, P11 only)

- The replay: game.js draws the recorded frame into the play field before the lesson overlay draws. The overlay can copy those pixels into an offscreen canvas and draw them scaled into any box (a picture-in-picture), every frame, so the clip can play small and loop.
- `kitBody()`: a vector sedan, 64 x 30 units, nose to the right (+x). `kitPieces(rung, {drop:[rung, dy], only})`: the kit drawn on it, any piece offset vertically for a drop. `kitGlint(rung, e)`: rings out of the newest piece's slot. Any scale (the current inset uses 2.9x).
- `redSprite`: Prototype 9's pixel sedan recoloured red (top-down, nose right).
- `drawDrone(x, y, load)`: a small quad drone, optionally carrying a load.
- Text in B612 (sizes as given), rects, arcs, gradients, shadows. Screen shake by translating the panel.
- Sound: the page's synth (tones and noise) through a hook the build can expose; the gift fanfare can be reused or varied.
- Reduced motion: a page flag exists (the gift screen fades instead of falling).

## The kit (Edit 116): one piece a rung, on the car

| Rung | Sensor | Piece | Slot | Colour |
|---|---|---|---|---|
| 1 | Forward camera | Lens bar | Windscreen | #f4f8fa white |
| 2 | Side sensors | Mirror pods | Both mirrors | #7fa8bc steel blue |
| 3 | Roof lidar | Roof puck (spinning) | Roof | #c3a6ff violet |
| 4 | Street cameras | Link fin | Rear roof | #9ff2c8 camera green |
| 5 | Road items | Bumper strip | Front bumper | #ff8a1f cone orange |
| 6 | Crash memory | Tally marks | Bonnet | #ff5a5a memory red |
| 7 | Search | Searchlight | Roof, front | #ff5a5a |

## Palette (one meaning each)

- #ffd400 yellow: you, the dummy, and your rewards. #ff3d3d red: RED-01, the learning car.
- #3fd0ff cyan: the shell's chrome, labels, "continue". #9ff2c8 green: the car's camera and training clip.
- #f4f8fa text; #9fb8c8 dim text; panels #0b0f1a / rgba(10,12,18,0.86).
- Sensor colours as in the kit table.

## The puzzles that teach the car (Map 1, snake order A1 B1 C1 C2 B2 A2 A3 B3 C3)

- 1 A1: rung 0 → 1 (forward camera). 2 B1: 1 → 2 (side sensors). 4 C2: 2 → 3 → 4 (roof lidar, then street cameras: two lessons). 6 A2: 4 → 5 (road items). 9 C3, the boss: 5 → 6 → 7 between hits (mid-puzzle lessons; it comes back for the next hit).
- 3 C1, 5 B2, 7 A3 earn the dummy a part instead (the parts card, not this screen).
