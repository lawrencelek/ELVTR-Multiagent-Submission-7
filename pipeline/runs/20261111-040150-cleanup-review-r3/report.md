# FINAL V2: the adversarial review

**Verdict:** The cleanup worked: no panels cover the field, there are no debug words, the top bar has one goal and one count, the CCTV draws a 90° cone and the dash guide is gone during drops. But two of the 'being seen' rules still break: the car's '!' stays white whichever sensor has you, and C3 puts the S01 plate on three cars at once, so the player can't tell which car is the target.

## Acceptance

| Check | Pass | Shots | Note |
|---|---|---|---|
| No HUD panel inside the field (x 240–1040, y 40–680). Only world marks and at most one caption appear there. | yes | p_A1_play, p_B2_play, p_C3_play, p_B3_play | The car panel and attempt panel are gone. The A1 stairs (x 655–720, y 70–135) and the C1 stair head are now visible. |
| Top bar shows 'PUZZLE n · <NAME>' with no tile id and no 'OBJECTIVE'. Drop and play text match. | yes | p_A1_drop, p_A1_play, p_C3_drop, p_C3_play |  |
| Objective reads '0 / 2' on A1 and B1, '0 / 1' on C1–B3, and '3 HITS · NEW WAY EACH  0 / 3' on C3. The count appears nowhere else. | yes | p_A1_play, p_B1_play, p_C1_play, p_C3_play |  |
| Top bar right shows 'n.n / PAR s' and three star pips with no words. No POINTS in Story. | yes | p_A1_play, p_B2_seen_camera | No shot shows a dimmed pip, so the lost-star state is untested. |
| No in-play shot contains RUNG, PASS, RESTARTS, CHASSIS, DRONE, TEACHES, EARN, 'KEYS:', 'OUTWIT' or 'R restarts'. | yes | p_A1_play, p_B3_play, p_C3_play | EARN appears only on cards, as the spec says. |
| 'R  RESTART' appears exactly once in play, in the key panel. | yes | p_A1_play, p_C1_play, p_C3_play |  |
| Key panel lists fitted parts only. WASD only on A1 and B1. 'CROUCH' fits. | yes | p_A1_play, p_C1_play, p_A3_play, p_B3_play, p_C3_play | 'CROUCH' ends at x≈1243, inside the panel. |
| DASH panel absent on A1, B1 and C1. LAST HIT absent before the first hit. | yes | p_A1_play, p_B1_play, p_C1_play, p_A1_lesson_clip |  |
| Right panel car block shows 'LUMINARY™', the sensor name in its rung colour, and seven pips. | yes | p_A1_play, p_C1_play, p_B2_play, p_A3_play | The pips light up to the current rung, each in its rung colour. |
| No world label below 11px. STOPS HERE, LINKED and #n are absent. | yes | p_B1_seen_ahead, p_B2_seen_camera | No shot shows LAST SEEN, HIT/FAULT or DRONE IN, so their 11px size is untested. |
| B2 seen-camera caption reads 'SEEN · STREET CAMERA' in mint, never 'SIDE SENSORS'. | yes | p_B2_seen_camera, p_C3_seen_camera |  |
| B2 and A3 draw a filled 90° mint cone with no 360° dashed circle. C3 draws a 60° cone. | yes | p_B2_drop, p_A3_drop, p_C3_drop | In p_C3_drop the cone measures ≈65°, which fits the 60° FOV allowing for pan. |
| Seen shots for forward camera, side sensors, lidar and camera each show corner brackets on the dummy in that sensor's colour, and a plate '!' in the same colour. | no | p_C1_seen_side, p_C2_play, p_B2_seen_camera | The inventory logs every '!' as #f4f8fa, including the side-sensor and street-camera seen shots. In p_C1_seen_side (x≈738, y≈348) the '!' is white beside a steel-blue caption. No shot shows the lidar seen state. |
| Side-sensor sensing shot shows an open steel-blue arc round the dummy and a steel-blue '?' on the plate. | yes | p_C1_play | Arc at x≈705–724, y≈245–280; '?' is #7fa8bc. |
| Dash guide is absent in every drop shot and while the dash recharges. | yes | p_C2_drop, p_B2_drop, p_A3_drop, p_B3_drop, p_C3_drop, p_B2_play, p_A3_play | No guide in any drop. The guide shows in B2, A3 and B3 play. No shot shows the recharge state. |
| Stair marks are #5e7080 chevrons with no cyan bracket boxes. | yes | p_A1_play, p_C1_play, p_B2_play |  |
| C1 and C2 deck gaps show yellow end caps. A faint yellow down-chevron appears below the gap only when the dummy is on the deck nearby. | no | p_C1_drop, p_C3_drop, p_A1_play | The caps are 3px yellow ticks (C1 x 397/560, y 343/375) and are hard to see at play size. No shot puts the dummy within 120px of a gap, so the down-chevron is unverified. |
| Every card shows 'SPACE · START', a tale of two lines or fewer, and no 'Tile X. Puzzle n of 9.' line. | yes | p_A1_card, p_B2_card, p_C3_card | Drawn in #f5c542 where the spec asked for #3fd0ff. Lesson and gift screens draw 'SPACE · CONTINUE' in #3fd0ff, so the two prompts don't match. |
| Result has no PUZZLE CLOCK, RESTARTS or PASSES. Pause has no 'Show trace' or 'registry'. Controls have no 'T TUNING' or '???'. | yes | p_A1_result, p_pause, p_pause_controls |  |
| The dummy's facing arrow is yellow in all play shots. | yes | p_A1_play, p_B1_seen_ahead, p_C1_seen_side |  |

## Findings

| Id | Severity | Shots | What | Fix |
|---|---|---|---|---|
| R1 | blocker | p_C1_seen_side, p_C2_play, p_B2_seen_camera | The plate '!' is always #f4f8fa. When the side sensors or street camera have you, the plate still says 'forward camera'. This breaks the one 'being seen' language the user asked for. | Draw the plate '?' and '!' with the same colour as the dummy brackets: the colour of the highest-rung sensor that has you (#7fa8bc side sensors, #c3a6ff lidar, #9ff2c8 street camera, #ff5a5a search). Keep #f4f8fa for the forward camera only. |
| R2 | major | p_C3_play, p_C3_seen_camera | Three cars carry the 'S01' plate at once (x≈322,455; 335,512; 748,512). In p_C3_drop the white cars had no plate. The player can't tell the target from the white cars that cost UNTOUCHED. | Draw the 'S01' plate on the live LUMINARY™ only. If the extra cars are LUMINARY™ ghosts or memory replays, draw them at 35% alpha in #ff5a5a outline, with no plate. White traffic cars never get a plate. |
| R3 | major | p_C1_play, p_C2_play, p_C2_drop | At 10% fill the side-sensor fans look pale grey-white, the same as the forward ribbon in p_B1_play. The colour rule the grammar depends on can't be seen. | Draw the side-fan edges solid #7fa8bc at 60% alpha, 1.5px; keep the fill at 10%. Keep the forward ribbon edges at 35%, so edge strength tells the two sensors apart along with the colour. |
| R4 | major | p_B2_seen_camera | The camera's report to the car is not visible: no dashed mint line from the dummy to the post, no solid line from the post to the car. The only line from the car is lilac (lidar). The player sees they were spotted but not how the car found out, which is the user's CCTV question. | When the camera has you, draw a 1.5px dashed #9ff2c8 line (80% alpha) from the dummy to the post lens, then a solid 1.5px #9ff2c8 line from the post to the car plate. Hold both for ui.seenHoldSeconds (proposed). |
| R5 | major | p_C1_drop, p_C3_drop, p_A1_play | The parapet gap caps are 3px yellow ticks that blend into the lane edge. The user's 'gaps need to be a bit more clear' is not met. The down-chevron has no evidence shot. | Make the end caps 4×10px #ffd400 at 100%. Draw a 2px #ffd400 line at 30% across the gap opening. Add a capture with the dummy on the C1 deck within 120px of the gap to verify the down-chevron (ui.gapHintRadius, proposed). |
| R6 | major | p_B1_card, p_A1_card | B1 PAR is 18 s for two hits; A1 is 25 s. B1 is the harder puzzle (the car brakes for what it sees), so par runs the wrong way. A1 clears in 20.4 s (p_A1_result). Nothing shows B1 under 18 s. | Set puzzle.B1.par to 30 (proposed), or attach a p_B1_result shot showing a two-hit clear under 18 s. |
| R7 | minor | p_A1_card, p_A1_play | The A1 tale says 'red, keen and blind', but the LUMINARY™ is drawn grey/silver (p_A1_play x≈820, y≈380; p_A1_lesson_clip). The word comes from my own round-1 rewrite. | A1 tale: 'Fresh off the factory floor. Your first colleague is keen and blind.' |
| R8 | minor | p_A1_result | 'SPACE · ON' does not say what happens. 'BEST 20.4 s' repeats the 20.4 s line above it on a first clear. | 'SPACE · NEXT  R · AGAIN  SHIFT · GRID'. Show the BEST line only when it differs from this run. |
| R9 | minor | p_pause | The volume widget (x 1000–1265, y 5–45) covers the time and star pips. The BEING SEEN legend has no ROAD ITEMS or CRASH MEMORY swatch, and its '?' and '!' glyphs are grey. | Hide the volume widget in play-pause, or move it to y 690. Add swatches 'ROAD ITEMS' #ff8a1f and 'CRASH MEMORY' #ff5a5a; merge SEARCH into 'MEMORY · SEARCH'. Draw the legend glyphs in #f4f8fa. |
| R10 | minor | p_A3_gift | The C key is said twice: the 'C CROUCH' chip and 'C crouches.' | Body: 'Press again to stand. Low cover hides you.' |
| R11 | minor | p_A1_lesson_clip, p_A1_lesson_fit | 'brakes for the board' is unclear; 'board' is not a term the player has seen. | 'It sees you in its lane and brakes.' |
| R12 | minor | p_grid | 'OPEN' on the tile and 'NOT YET SOLVED' in the detail panel say the same thing. The NEW line wraps after '·'. | Cut 'NOT YET SOLVED'. Let the detail NEW line wrap at word boundaries only: 'NEW · THE LUMINARY™' / 'BLIND'. |
| R13 | minor | p_A1_card, p_A1_lesson_fit, p_C1_gift | The card prompt is #f5c542 and the lesson and gift prompts are #3fd0ff. 'Press to continue' should look the same everywhere. | Draw 'SPACE · START' in #3fd0ff, 28px, matching 'SPACE · CONTINUE'. |
| R14 | minor | p_A3_play | Lidar marks have become full dotted lilac outlines round whole buildings (x 255–430, y 150–390), which crowds the field. No shot shows the lidar seen state. | Limit lidar ticks to the cover edge facing the car, 6px dashes at 50%. Add a p_A3_seen_lidar capture. |
| R15 | minor | p_C2_play | The dash is fitted and fully charged and the dummy is on the ground, but no dash guide is drawn. | If the dash is blocked here, draw the landing circle at 30% with no line. Otherwise fix the show_when rule so the guide draws whenever a dash is possible. |

**Priority:** R1, R2, R4, R3, R5, R6, R7, R13, R8, R9, R15, R14, R10, R11, R12

Cost: $1.16
