# Round 2: the review

Review the build against your spec (round 2 output). You wrote the spec; you did not build it.

# The brief (the user, verbatim)

Have a UI adversarial redesign agent redesign the car upgrade screen. It should look similar to the 'Dummy Chassis' upgrade screen, with (1) the replay video, (2) the new part arriving on the car with juice and like an upgrade, and (3) a simple sentence saying what the car learned. (Round 2: the build after your round-1 findings U1-U7 were fixed: drone held above the car on a lengthening, split tether; the name pop capped to the column; rays and glow fade by 145 px; the landing flash on the car's column only, both rings at the landing; the replay loop starts with the car in view, with a 0.1 s dip; the copy drawn crisp, the car solid under a deck; the bumper strip seated in the nose.)

# Your spec

```json
{
 "verdict_current": "The current lesson reads as a log entry, not a reward. It runs 5.8 s over three beats before the one sentence appears (car_A1_r1_6_0). The hit plays at full-field scale, where RED-01 is about 50 px (car_A1_r1_0_8). The part fits in a 320 x 178 inset that covers the clip while a second, tiny drone lands in the world (car_C2_r3_3_8). It closes on a red-framed text wall with rung numbers, CLOSED/NEXT rows and a yellow ENTER prompt (car_A1_r1_7_5, car_C2_r3_7_5).",
 "keep_from_reference": [
  "Panel geometry: the play field less 36/26 px margins, so [276,66,728,588]. Same #0b0f1a fill, same 2 px cyan frame, same 0.18 s veil and same 0.86→1 back-ease over 0.3 s (ref_gift_0_15).",
  "The hero object fills the left column and sits dimmed to 60% with a radial glow until the part lands (ref_gift_0_15, ref_gift_0_50).",
  "The arrival: an 'INCOMING' label, pulsing corner brackets on the empty slot, then the drone lowers the part on a tether, lets go and climbs away. The part falls with three ghost trails (ref_gift_0_15 → ref_gift_0_50).",
  "The landing hit: screen shake, the part flashing white, turning rays, two expanding rings, a spark burst and one panel flash (ref_gift_0_90).",
  "The text column on the right: a small cyan label, then the part name popping big (scale 1.4→1, 0.28 s), then a badge line, then the body text (ref_gift_0_90, ref_gift_1_20).",
  "The continue prompt blinks bottom right in cyan, and A / SPACE / TAP continues (ref_gift_1_45, ref_gift_1_80).",
  "The fanfare's structure: a whoosh on the fall, a thud on the landing, an arpeggio, a held chord, pings."
 ],
 "change_for_the_car": [
  "Hero: the kit sedan (kitBody + kitPieces) at 5x, rotated −90° so the nose points up. That gives a 150 x 320 silhouette, the same tall footprint as the 4x doll. A sideways car would leave the column empty above and below. Glow and accents use red #ff3d3d, the car's colour, not cyan or gold.",
  "The replay replaces 'NEXT FROM THE CORPORATION' in the text column, in a 380 x 228 box. The source is a 456 x 274 crop centred between the car at −1.0 s and the impact point, clamped to the field and drawn at 0.833x. That keeps RED-01 at about 42 px instead of shrinking the whole field.",
  "The landing is synced to the replay's impact frame (both at 1.1 s), so your hit and the car's new part land as one slam. The player sees that their hit caused the part.",
  "Rays and rings use the new piece's kit colour (e.g. #c3a6ff for the roof puck), not gold. Yellow is kept for the player only: the impact box on the dummy in the replay and the word 'YOUR'.",
  "The name line shows the piece (ROOF PUCK) in red. The badge line shows the sensor (ROOF LIDAR) with a dot in the kit colour, standing in for the reference's 'A · DASH'.",
  "The body is one sentence of at most 12 words instead of a 4-line description. No CLOSED, no NEXT, no rung numbers.",
  "Progress on the ladder is a row of 7 colour pips under the car, with no digits. It replaces 'RUNG 3 OF 7' and 'RUNG 2 → 3'.",
  "The continue prompt appears at 1.6 s, not 1.2 s: the landing is 0.4 s later than the reference because the replay needs 0.9 s to reach the impact.",
  "Input moves from ENTER-only to the reference's A / SPACE / TAP, with Enter kept as an alias."
 ],
 "layout": [
  {
   "region": "veil",
   "box": [
    240,
    40,
    800,
    640
   ],
   "holds": "rgba(10,12,18,0.86) over the frozen field",
   "why": "Same as the reference. The HUD columns either side stay readable."
  },
  {
   "region": "panel",
   "box": [
    276,
    66,
    728,
    588
   ],
   "holds": "#0b0f1a fill, 2 px #3fd0ff frame, 12 px corner radius",
   "why": "The reference panel exactly, for the family look. Replaces the red full-field card frame."
  },
  {
   "region": "hero column",
   "box": [
    300,
    90,
    290,
    540
   ],
   "holds": "The red radial glow (r 200, #ff3d3d at 0.22) and the rays, clipped to this box",
   "why": "The rays must not run behind the sentence or the replay. The reference's rays do cross the text (ref_gift_1_20), but there they compete with nothing that moves."
  },
  {
   "region": "hero car",
   "box": [
    375,
    200,
    150,
    320
   ],
   "holds": "kitBody at 5x, nose up, every earned piece drawn, the new slot empty until 1.1 s",
   "why": "Same visual weight as the doll. Nose up puts the windscreen, roof and bumper slots in a clear vertical order."
  },
  {
   "region": "slot brackets",
   "box": [
    0,
    0,
    0,
    0
   ],
   "holds": "Four 10 px L-brackets, 3 px, in the kit colour, 8 px outside the new piece's slot (box follows the slot)",
   "why": "Tells the eye where the part will land before the drone arrives (ref_gift_0_15)."
  },
  {
   "region": "drone lane",
   "box": [
    375,
    90,
    150,
    140
   ],
   "holds": "drawDrone at 3x scale, a 1 px #9fb8c8 tether, the piece at 5x",
   "why": "The drop comes in from above the car. The drone climbs out the top of the panel."
  },
  {
   "region": "kit pips",
   "box": [
    330,
    556,
    240,
    16
   ],
   "holds": "7 squares 24 x 12 at 36 px pitch: earned ones in their kit colour, unearned #1a2230 outlined #9fb8c8",
   "why": "Shows the ladder without numbers. The newest pip fills at the landing."
  },
  {
   "region": "label",
   "box": [
    600,
    96,
    380,
    20
   ],
   "holds": "'RED-01 · NEW PART INCOMING' (blinking), then 'RED-01 LEARNED' after the landing",
   "why": "Same slot and role as 'CORPORATION DRONE · INCOMING' and 'NEW PART FITTED'."
  },
  {
   "region": "name",
   "box": [
    600,
    124,
    380,
    48
   ],
   "holds": "The piece name, e.g. ROOF PUCK",
   "why": "Same role as BATTERY 1. 48 px fits the longest names (BUMPER STRIP, SEARCHLIGHT) in 380 px."
  },
  {
   "region": "sensor line",
   "box": [
    600,
    184,
    380,
    24
   ],
   "holds": "A 20 px dot in the kit colour, then the sensor name, e.g. ROOF LIDAR",
   "why": "Stands in for the 'A · DASH' badge line."
  },
  {
   "region": "sentence",
   "box": [
    600,
    222,
    380,
    102
   ],
   "holds": "The one sentence, at most 3 lines",
   "why": "The takeaway. It sits directly under the name so one glance covers both."
  },
  {
   "region": "replay label",
   "box": [
    600,
    338,
    380,
    16
   ],
   "holds": "'YOUR HIT' in #ffd400, then ' · ITS TRAINING CLIP' in #9ff2c8",
   "why": "Names the clip as the player's, in the player's colour."
  },
  {
   "region": "replay",
   "box": [
    600,
    360,
    380,
    228
   ],
   "holds": "The cropped recorded frames, 2 px #9ff2c8 border, #9ff2c8 tint at 0.10, scan lines at 0.08",
   "why": "A legible, looping picture-in-picture of the hit. Light tint so the dummy stays yellow."
  },
  {
   "region": "prompt",
   "box": [
    780,
    606,
    200,
    24
   ],
   "holds": "'A · CONTINUE' (or SPACE / TAP), right-aligned to x 980",
   "why": "The reference's position and colour (ref_gift_1_45)."
  }
 ],
 "timeline": [
  {
   "t0": 0.0,
   "t1": 0.3,
   "beat": "Panel in",
   "draws": "Veil fades in over 0.18 s. The panel scales 0.86→1 with a back-ease. The hero car appears dimmed to 60% with the new slot empty. Kit pips show the old count.",
   "sound": "Soft panel swish, the same as the gift screen."
  },
  {
   "t0": 0.2,
   "t1": 1.1,
   "beat": "Replay, first pass",
   "draws": "The replay box plays the last 0.9 s before the hit at real speed. The label reads 'YOUR HIT · ITS TRAINING CLIP'.",
   "sound": "None of its own; the whoosh carries it."
  },
  {
   "t0": 0.3,
   "t1": 0.85,
   "beat": "Drone descends",
   "draws": "Label 'RED-01 · NEW PART INCOMING' blinks at 4 Hz in #3fd0ff. The slot brackets pulse. The drone lowers the piece on a tether from y 90 to 40 px above the slot.",
   "sound": "Rising whoosh, 0.3–1.1 s (giftFanfare part 1)."
  },
  {
   "t0": 0.85,
   "t1": 1.1,
   "beat": "Release and fall",
   "draws": "The tether lets go and the drone climbs out of the top of the panel. The piece falls into its slot with 3 ghost trails at 0.5/0.3/0.15 alpha.",
   "sound": "Whoosh peaks."
  },
  {
   "t0": 1.1,
   "t1": 1.1,
   "beat": "Landing = impact",
   "draws": "The replay reaches its impact frame and freezes, with a 2 px #ffd400 box on the dummy. At the same moment: the piece lands, the car goes to full brightness, the newest pip fills, and the landing effects fire (see juice).",
   "sound": "Impact crunch from the game's hit sound plus the gift thud, layered."
  },
  {
   "t0": 1.1,
   "t1": 1.38,
   "beat": "Name pops",
   "draws": "The label switches to 'RED-01 LEARNED'. The piece name pops in at 48 px #ff3d3d (scale 1.4→1). The sensor line fades in.",
   "sound": "Four-note arpeggio, a fourth below the gift's, square timbre (1.15–1.5 s)."
  },
  {
   "t0": 1.3,
   "t1": 1.5,
   "beat": "Sentence in",
   "draws": "The sentence fades in and rises 8 px into its box.",
   "sound": "Held chord, 1.5–2.1 s."
  },
  {
   "t0": 1.1,
   "t1": 1.6,
   "beat": "Impact hold",
   "draws": "The replay holds the impact frame for 0.5 s.",
   "sound": "One ping at 1.2 s, in time with the slot glint."
  },
  {
   "t0": 1.6,
   "t1": 1.6,
   "beat": "Continue prompt",
   "draws": "'A · CONTINUE' appears in #3fd0ff and blinks at 2 Hz. The replay loop starts.",
   "sound": "None."
  },
  {
   "t0": 1.6,
   "t1": 99,
   "beat": "Hold until input",
   "draws": "The replay loops: 2.0 s of play (−2.0 → 0 s) plus a 0.5 s impact hold, a 2.5 s cycle. The rays keep turning and the roof puck keeps spinning. Nothing else moves.",
   "sound": "Silence after the chord."
  }
 ],
 "juice": [
  {
   "effect": "Panel back-ease scale 0.86→1",
   "when": "0.0",
   "secs": 0.3,
   "why": "The family signature, the same as the reference."
  },
  {
   "effect": "Slot brackets pulse, alpha 0.4↔1 at 3 Hz",
   "when": "0.3–1.1",
   "secs": 0.8,
   "why": "Shows where the part will land."
  },
  {
   "effect": "Drone descent and climb-out with the tethered piece",
   "when": "0.3–1.1",
   "secs": 0.8,
   "why": "Delivers the part in person, like the Corporation drone does for the dummy."
  },
  {
   "effect": "3 ghost trails on the falling piece",
   "when": "0.85–1.1",
   "secs": 0.25,
   "why": "Sells the speed of the drop."
  },
  {
   "effect": "Panel shake, 6 px decaying",
   "when": "1.1",
   "secs": 0.3,
   "why": "The landing hit. 6 px, not the reference's 8 px, because the replay box shakes with the panel and must stay readable. The HUD does not shake."
  },
  {
   "effect": "Piece flashes white at 7 Hz",
   "when": "1.1",
   "secs": 0.4,
   "why": "Points the eye at the new hardware on the car."
  },
  {
   "effect": "Panel white flash at 0.25 alpha",
   "when": "1.1",
   "secs": 0.2,
   "why": "Fuses the replay's impact and the landing into one beat."
  },
  {
   "effect": "Two rings, #ff3d3d then the kit colour, radius 20→180 px, clipped to the hero column",
   "when": "1.1",
   "secs": 0.5,
   "why": "The car's colour and the new sensor's colour, both announced."
  },
  {
   "effect": "12 spark lines, white, 40–90 px",
   "when": "1.1",
   "secs": 0.45,
   "why": "Impact energy. 12, not the reference's 16, because there are fewer pixels left of x 590."
  },
  {
   "effect": "kitGlint from the new slot (rings out of the piece)",
   "when": "1.2",
   "secs": 0.6,
   "why": "The piece switching on. Replaces the old field-draw on the road."
  },
  {
   "effect": "12 rays in the kit colour at 0.30 alpha, turning 20°/s, clipped to [300,90,290,540]",
   "when": "1.1–exit",
   "secs": 0,
   "why": "The lingering reward glow (ref_gift_1_20). Clipped so it never sits behind the sentence or the replay."
  },
  {
   "effect": "Name scale pop 1.4→1",
   "when": "1.1",
   "secs": 0.28,
   "why": "Same as the reference: the name is the headline."
  },
  {
   "effect": "Sentence fade and 8 px rise",
   "when": "1.3",
   "secs": 0.2,
   "why": "Arrives after the name, so the eye reads the name first and the sentence second."
  },
  {
   "effect": "Newest kit pip fills, white for 0.15 s then the kit colour",
   "when": "1.1",
   "secs": 0.15,
   "why": "Shows the ladder moved, with no number."
  },
  {
   "effect": "Prompt blinks at 2 Hz",
   "when": "1.6–exit",
   "secs": 0,
   "why": "Same as the reference."
  }
 ],
 "sentences": {
  "1": "It brakes for you when you stand in its lane.",
  "2": "It spots you beside the road and stops short.",
  "3": "It sees you jump or drop onto its road.",
  "4": "Street cameras tell it where you hide.",
  "5": "It stops for a cone instead of swerving into you.",
  "6": "It remembers every spot you hit it from.",
  "7": "If it saw you, it searches where you were last."
 },
 "text": [
  {
   "line": "RED-01 · NEW PART INCOMING",
   "size_px": 20,
   "colour": "#3fd0ff, blinking at 4 Hz",
   "when": "0.3–1.1"
  },
  {
   "line": "RED-01 LEARNED",
   "size_px": 20,
   "colour": "#3fd0ff",
   "when": "1.1–exit"
  },
  {
   "line": "Piece name, e.g. ROOF PUCK; auto-shrinks to fit 380 px, floor 40 px",
   "size_px": 48,
   "colour": "#ff3d3d",
   "when": "1.1 pop–exit"
  },
  {
   "line": "Kit-colour dot, then the sensor name, e.g. ROOF LIDAR",
   "size_px": 22,
   "colour": "#f4f8fa text, dot in the kit colour",
   "when": "1.1–exit"
  },
  {
   "line": "The rung's sentence (see sentences), 34 px line height, at most 3 lines",
   "size_px": 26,
   "colour": "#f4f8fa",
   "when": "1.3–exit"
  },
  {
   "line": "YOUR HIT · ITS TRAINING CLIP",
   "size_px": 16,
   "colour": "'YOUR HIT' #ffd400, the rest #9ff2c8",
   "when": "0.2–exit"
  },
  {
   "line": "A · CONTINUE (SPACE · CONTINUE on keyboard, TAP · CONTINUE on touch)",
   "size_px": 22,
   "colour": "#3fd0ff",
   "when": "1.6–exit, blinking at 2 Hz"
  }
 ],
 "input": "Presses held over from the stars card are ignored: the screen needs a fresh press after 0.25 s. A, SPACE, TAP or Enter between 0.25 s and 1.6 s (or 2.1 s for two rungs) jumps to the settled state: piece on the car, all text shown, prompt shown, replay looping. The landing sound does not replay. The same input after the prompt shows continues to play. There is no separate skip label; the prompt is the only input text.",
 "two_rungs": "One panel, one drone, one replay, one prompt. Puzzle 4 (C2) teaches roof lidar, then street cameras. The drone carries both pieces. It drops the roof puck to land at 1.1 s on the replay's impact frame, with all the landing effects. It then slides to the rear-roof slot (1.1–1.45 s) and drops the link fin to land at 1.6 s. The second landing gets rings, piece flash, glint and its pip fill, but no shake, no panel flash and no sparks, so it reads as a follow-up, not a restart. The text column stacks two entries, each a 36 px red name and a 22 px sentence in 28 px lines: name 1 at [600,124,380,36], sentence 1 at [600,166,380,58], name 2 at [600,236,380,36], sentence 2 at [600,278,380,58]. The sensor lines are dropped. Label: 'RED-01 LEARNED 2 THINGS'. Name 1 pops at 1.1 s, sentence 1 at 1.3 s, name 2 at 1.6 s, sentence 2 at 1.8 s. The prompt shows at 2.1 s and the rays switch to the second kit colour at 1.6 s. Boss C3 (5→6, then 6→7 on separate hits) uses the single-rung screen each time.",
 "reduced_motion": "The veil and panel fade in over 0.2 s with no scale. The car shows at full brightness from the start. The new piece fades in at its slot over 0.3 s from 0.4 s, followed by a single static ring in the kit colour at 0.5 alpha, with no drone, trails, shake, flashes or sparks. The rays are static at 0.2 alpha and the roof puck does not spin. The name and sentence fade in over 0.2 s at 0.6 s and 0.75 s. The prompt shows at 1.0 s and does not blink. The replay still plays and loops (it is content), with no scan lines. Sound unchanged except the whoosh.",
 "cut": [
  "The full-field clip beat (3 s) and the full-field impact hold (0.8 s): the replay lives in its 380 x 228 box.",
  "The world-view fitting beat: the small drone over the frozen field, the dashed red ring and the sensor field drawn on the road. It duplicated the inset and put two cars on screen at once (car_C2_r3_3_8).",
  "The 320 x 178 kit inset that covered the clip (car_A1_r1_3_4, car_C2_r3_4_2).",
  "Every rung number: 'KIT · RUNG 3 OF 7', 'RED-01 · RUNG 2 → 3', 'Rung 0 → 1'.",
  "'FARSIGHT · TRAINING LOG · RED-01', 'LESSON: …', 'Your hit: FRONT CORNER · STRUCK'.",
  "The 22 px long rung text, the CLOSED row and the NEXT row. The next-puzzle line belongs on that puzzle's level card.",
  "The replay clock ('−1.7 s · …'), the blinking REC dot and 'SENSOR FITTED · …' in the clip's top bar.",
  "The green 'IMPACT · FRONT' box (car_A1_r1_3_0): the player's hit is marked in yellow, not the car's green.",
  "The red full-field card frame and the yellow 'ENTER · CONTINUE' (car_A1_r1_7_5): continue is cyan.",
  "The second full lesson on two-rung clears (a stutter): replaced by one panel with a double drop.",
  "The reference's four sparkle pings: cut to one ping per piece."
 ],
 "acceptance": [
  "Pinned at 0.6 s (A1 and C2): the panel is visible at [276,66,728,588] with a cyan frame; the HUD columns (x<232, x>1048) are unchanged and do not shake.",
  "Pinned at 0.6 s: the replay box [600,360,380,228] shows both the dummy and RED-01, the car sprite at least 40 px long, and no rung text or clock.",
  "Pinned at 0.6 s: the hero car is nose up inside [375,200,150,320], dimmed, with the new slot empty, kit-colour brackets on it and the drone above with the piece on a tether.",
  "Pinned at 1.15 s: the replay shows the impact frame with a yellow box on the dummy; the piece is in its slot on the hero car; rings in red and the kit colour are visible inside x<590.",
  "Pinned at 1.45 s: the label reads 'RED-01 LEARNED' in cyan; the piece name is red at 48 px or less in [600,124,380,48]; the sentence is fully visible in [600,222,380,102].",
  "In every shot, the visible sentence has at most 12 words, no digits, and matches the sentences table for that rung.",
  "Pinned at 1.7 s: the cyan prompt is right-aligned to x 980 at y 606–630; no yellow text exists outside the replay label and the impact box.",
  "Pinned at 3.0 s vs 1.7 s: the replay frames differ (the loop is running) and the replay stays inside its box; no ray pixels at x≥590.",
  "No shot from 0 to 4 s contains 'RUNG', '→', 'CLOSED', 'NEXT', 'TRAINING LOG', 'LESSON:' or 'ENTER'.",
  "Kit pips at [330,556,240,16]: at 1.0 s the earned count equals the old rung; at 1.3 s it equals the new rung, the newest in the kit colour.",
  "Two-rung C2, pinned at 1.3, 1.9 and 2.3 s: one panel throughout; at 1.9 s both the roof puck and the link fin are on the car; at 2.3 s two names, two sentences, one replay box and one prompt; no panel scale-in after 0.3 s.",
  "Reduced motion, pinned at 0.5 and 1.2 s: no drone, no offset, no rotated rays; at 1.2 s the piece is on the car and the name, sentence and a non-blinking prompt are visible."
 ]
}
```

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


# Screenshots of the build (Read every one)

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_0_15.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 0.15 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_0_60.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 0.6 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_0_95.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 0.95 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_1_15.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 1.15 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_1_30.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 1.3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_1_45.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 1.45 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_1_70.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 1.7 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_1_90.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 1.9 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_2_30.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 2.3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_3_00.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_0_15.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 0.15 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_0_60.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 0.6 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_0_95.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 0.95 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_1_15.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 1.15 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_1_30.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 1.3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_1_45.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 1.45 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_1_70.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 1.7 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_1_90.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 1.9 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_2_30.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 2.3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_B1_r2_3_00.png` · the car's upgrade after puzzle B1, rung 1 → 2, at 3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_0_15.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 0.15 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_0_60.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 0.6 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_0_95.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 0.95 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_1_15.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 1.15 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_1_30.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 1.3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_1_45.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 1.45 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_1_70.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 1.7 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_1_90.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 1.9 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_2_30.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 2.3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_C2_r3_3_00.png` · the car's upgrade after puzzle C2, rung 2 → 3, at 3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_0_15.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 0.15 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_0_60.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 0.6 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_0_95.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 0.95 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_1_15.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 1.15 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_1_30.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 1.3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_1_45.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 1.45 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_1_70.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 1.7 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_1_90.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 1.9 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_2_30.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 2.3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A2_r5_3_00.png` · the car's upgrade after puzzle A2, rung 4 → 5, at 3 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_rm_0_50.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 0.5 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_rm_1_20.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 1.2 s (pinned)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261109-125540-upgrade-review-r2/shots/car_A1_r1_rm_1_45.png` · the car's upgrade after puzzle A1, rung 0 → 1, at 1.45 s (pinned)