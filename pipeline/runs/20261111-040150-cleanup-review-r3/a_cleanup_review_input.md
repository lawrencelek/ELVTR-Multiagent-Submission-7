# Round 2: the review

Review the new build against your spec (round 2 output). You wrote the spec; you did not build it.

# The brief (the user, verbatim)

Create an adversarial UI agent to clean up the screen interfaces.

There are too many text boxes, some are more like almost debug text, many superfluous messages onscreen now, create a new FINAL V2 build with more concise messages.

Also the 'dash' helper (line and circle pointing outwards) stays visible when the drone is picked up which looks ridiculous. It should only be on when the dummy is on the ground, and can dash.

Also, the CCTV camera is not quite clear how the player is spotted. Having the line is cool but actually shouldn't it be like a cone of vision, like for the cars? The UI agent should also create regular language for all the different UI visualisations of 'being seen'.

Also, the 'up arrows' for the staircases are just too visible now. The gaps in the railings need to be a bit more clear. There can be a subtle arrow here, for where to jump down.

Also, the first two screens are just too easy now. The dummy needs to land TWO hits successfully on the target car in the first two screens.

(The user's own requests stand over the spec: the upgrade screen keeps the car's model line SED-01-001 · LUMINARY™ · AMBASSADOR and its part names, which the user asked for in Edits 120–121.)

# Your spec

```json
{
 "verdict": "Every play shot carries 13 to 16 text blocks across five panels. Two of those panels sit inside the field and hide the map, and debug counters, gamepad and keyboard keys mixed together, and one-off narration repeat the same goal and key up to three times. Each sensor marks 'seen' its own way. The CCTV at B2 shows a range circle, not a view, and its caption names the wrong sensor.",
 "principles": [
  "Keep no HUD panel inside the field. The field holds only world marks and one caption band.",
  "Show each fact once: goal and count in the top bar, time and stars at top bar right, keys in the right panel, the car in the right panel.",
  "In play, labels are 2–5 words. Sentences appear only on cards, upgrade, gift and result screens.",
  "Draw in-world labels at 11px or larger, or cut them.",
  "Show only the active device's keys. Never write 'B (KEYS: C)'.",
  "Show no internal names in play: RUNG, CHASSIS 01, PASS, RESTARTS, DRONE, SED-01-001, registry.",
  "Every sensor uses one grammar: idle, sensing, seen. Only colour and field shape differ.",
  "Draw what the sim does. A cone only where the FOV is under 360.",
  "Colour budget: yellow #ffd400/#f5c542 is the dummy and player aids. #f4f8fa is the forward camera only. Rung colours are fixed. Scenery wayfinding uses #5e7080.",
  "Draw a player aid only when its action is available now."
 ],
 "regions": [
  {
   "region": "Top bar, left tag",
   "now": "Yellow chip. 'OBJECTIVE · A1' in the drop, 'PUZZLE 1 · A1 · FIRST CONTACT' in play",
   "decision": "keep",
   "after": "'PUZZLE 1 · FIRST CONTACT' in drop and play alike",
   "why": "The map already shows the tile id. The drop state needs no different tag."
  },
  {
   "region": "Top bar, objective line",
   "now": "'GET HIT BY THE LUMINARY™ (0 of 1). R restarts.'; drop: 'Write off a body. Last hit: … (0 of 1)'",
   "decision": "keep",
   "after": "'GET HIT · ITS FAULT  0 / 2'. The count is the only place hits are shown.",
   "why": "This is the single home for goal and progress. R moves to the key panel. The drop line is jargon, and on C3 it shows the wrong count (0 of 1 vs 0 of 3)."
  },
  {
   "region": "Top bar, right",
   "now": "POINTS 0",
   "decision": "merge",
   "after": "Story: '3.3 / 10 s' (18px #f5c542; turns #9fb8c8 past par) and three 12px star pips. Arcade keeps POINTS.",
   "why": "In Story, stars and par drive play and points never do. This takes over the attempt panel's job."
  },
  {
   "region": "Field: attempt panel (x≈730–1030, y≈50–133)",
   "now": "Timer, PAR, three stars with words, 'PASS 1 · RESTARTS 0 · R RESTART'",
   "decision": "cut",
   "after": "",
   "why": "It covers the world: billboards at B1 and C1, the stair at A1. Its content moves to top bar right and the key panel. PASS and RESTARTS are debug."
  },
  {
   "region": "Field: car panel (x≈250–640, y≈50–123)",
   "now": "'LUMINARY™ · RUNG n · SENSOR ◎ n/n' plus up to two lines of narration and keys",
   "decision": "move",
   "after": "Right panel block at x 1056–1264, y 350–440. Line 1: 'LUMINARY™' 13px #e8c67e. Line 2: current top sensor name 15px in its rung colour, or 'BLIND' at rung 0. Line 3: seven 10×6px pips in rung colours, lit up to the current rung.",
   "why": "It covers the A1 stairs (p_A1_play x 615–720) and the C1 stair head. The count moves to the top bar. The narration goes to cards."
  },
  {
   "region": "Field: caption band",
   "now": "Seven caption types, some stale or wrong. p_B2_play and p_B2_seen_camera say 'ITS SIDE SENSORS HAVE YOU' during a camera link.",
   "decision": "shrink",
   "after": "One caption, 14px, centred at y≈566. Shown 1.5 s, in the colour of the sensor that caused it. Grammar: 'SEEN · <SENSOR>', first sighting per sensor per attempt, plus four outcome captions (see texts).",
   "why": "One teaching moment per sensor. It must name the sensor that actually has you."
  },
  {
   "region": "Field: in-world labels",
   "now": "STOPS HERE 8px, LINKED 9px, #n, LAST SEEN, HIT/YOUR FAULT, MOVE ALONG · DRONE IN n",
   "decision": "shrink",
   "after": "Only LAST SEEN, HIT / FAULT and DRONE IN n survive, all at 11px.",
   "why": "8–9px labels are unreadable at play size (p_C1_seen_side x 712–772, y 416). The marks already carry the meaning."
  },
  {
   "region": "Left panel: BODY",
   "now": "'BODY' and 500 at 36px, plus a bar",
   "decision": "shrink",
   "after": "'BODY' 15px #9fb8c8, number 22px, bar unchanged",
   "why": "Health matters, but a 36px number outweighs the goal."
  },
  {
   "region": "Left panel: DASH",
   "now": "'DASH  NOT FITTED' and an empty bar (A1–C1)",
   "decision": "cut",
   "after": "Hidden until Battery 1 is fitted. Then 'DASH' plus the charge bar.",
   "why": "A part you do not own is not actionable."
  },
  {
   "region": "Left panel: district map",
   "now": "'MONUMENT · A1' or 'MONUMENT · A1 · DRONE' plus the grid",
   "decision": "keep",
   "after": "'MONUMENT' 15px plus the grid. The yellow tile frame shows where you are.",
   "why": "The tile id is visible on the grid. 'DRONE' is a state flag."
  },
  {
   "region": "Right panel: doll",
   "now": "'CHASSIS 01', doll, 'LAST HIT —'",
   "decision": "shrink",
   "after": "Doll scaled to y 40–250. No label. 'LAST HIT  R ARM −100' appears only after the first hit.",
   "why": "CHASSIS 01 is an internal name. The '—' placeholder says nothing. This frees y 350–440 for the car block."
  },
  {
   "region": "Right panel: key hints",
   "now": "WASD MOVE, SPACE DASH, E GRAB, C CROUCH. 'CROUCH' clips the panel edge at x≈1264 (p_B3_play).",
   "decision": "keep",
   "after": "Rows for fitted parts only, plus 'R  RESTART' as the last row. 'WASD MOVE' only on puzzles 1–2. Panel widened so 'CROUCH' fits.",
   "why": "This is the one home for keys. R restart was shown twice before."
  },
  {
   "region": "Cards (puzzle, upgrade, gift, result)",
   "now": "Title, 'Tile A1. Puzzle 1 of 9.', 3-line tale, goal, 'NEW · … · PAR n s'. No 'SPACE START' visible in any card shot.",
   "decision": "shrink",
   "after": "Title, a tale of 2 lines or fewer, goal, 'NEW · …', 'PAR n s', and 'SPACE · START' at bottom right in #3fd0ff",
   "why": "Sentences live here, but short ones. The card has no visible way forward today."
  }
 ],
 "texts": [
  {
   "now": "PUZZLE n · <TILE> · <NAME>",
   "where": "top bar chip",
   "decision": "rewrite",
   "after": "PUZZLE 1 · FIRST CONTACT",
   "when": "drop and play",
   "why": "The tile id lives on the map."
  },
  {
   "now": "OBJECTIVE · <TILE>",
   "where": "top bar chip, drop",
   "decision": "merge",
   "after": "PUZZLE 1 · FIRST CONTACT",
   "when": "drop",
   "why": "The puzzle does not change identity when the drone lands."
  },
  {
   "now": "GET HIT BY THE LUMINARY™ (n of N). R restarts.",
   "where": "top bar",
   "decision": "rewrite",
   "after": "GET HIT · ITS FAULT  0 / 2  (puzzles 1–2); GET HIT · ITS FAULT  0 / 1  (3–8)",
   "when": "drop and play",
   "why": "Fewest words. The count appears once. R moves to the key panel."
  },
  {
   "now": "THREE HITS · A NEW WAY EACH (0 of 3). R restarts.",
   "where": "top bar",
   "decision": "rewrite",
   "after": "3 HITS · NEW WAY EACH  0 / 3",
   "when": "C3 drop and play",
   "why": "Same pattern as the other puzzles."
  },
  {
   "now": "Write off a body. Last hit: <goal> (0 of 1).",
   "where": "top bar, drop",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "Jargon. On C3 it states 0 of 1 for a 3-hit goal. Lowercase 'luminary™' is a casing bug."
  },
  {
   "now": "POINTS / 0",
   "where": "top bar right",
   "decision": "cut",
   "after": "",
   "when": "Story mode",
   "why": "Not used to act in Story. Arcade keeps it."
  },
  {
   "now": "⏱ n.n s / PAR n s",
   "where": "attempt panel",
   "decision": "merge",
   "after": "3.3 / 10 s",
   "when": "drop and play, top bar right",
   "why": "One reading gives both time and par."
  },
  {
   "now": "CLEAR / UNTOUCHED / PAR (star words, 11px)",
   "where": "attempt panel",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "Three pips remain, dimmed (#5e7080) once a star is lost. The words are on the result screen."
  },
  {
   "now": "PASS 1  ·  RESTARTS 0  ·  R RESTART",
   "where": "attempt panel",
   "decision": "rewrite",
   "after": "R  RESTART",
   "when": "key panel, last row, always",
   "why": "The counters are debug. The key belongs with the keys."
  },
  {
   "now": "LUMINARY™ · RUNG n · <SENSOR>   ◎ n / N",
   "where": "field top-left",
   "decision": "rewrite",
   "after": "LUMINARY™ / <SENSOR> / seven pips (e.g. 'SIDE SENSORS' in #7fa8bc; rung 0: 'BLIND' in #9fb8c8)",
   "when": "right panel, always in play",
   "why": "RUNG is an internal word. The pips show the ladder. The count lives in the top bar."
  },
  {
   "now": "YOUR HIT TEACHES IT <SENSOR> / YOUR NEXT HIT TEACHES IT <SENSOR>",
   "where": "car panel line 2",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "Narration. The upgrade screen tells it with a replay."
  },
  {
   "now": "CLEAR THE TILE: YOU EARN <PART> (<VERB>)",
   "where": "car panel line 2",
   "decision": "rewrite",
   "after": "EARN · BATTERY 1 · DASH",
   "when": "puzzle card only, under the NEW line",
   "why": "It motivates before play. It is not needed during play."
  },
  {
   "now": "ALL IT CAN LEARN: OUTWIT IT",
   "where": "car panel, B3",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "Narration with no action."
  },
  {
   "now": "PRESS B (KEYS: C) · CROUCH BEHIND LOW COVER",
   "where": "car panel line 3",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "It repeats the 'C CROUCH' key row and mixes devices. The cover hint goes on the B3 card tale."
  },
  {
   "now": "IT BRAKES FOR YOU",
   "where": "caption",
   "decision": "rewrite",
   "after": "SEEN · FORWARD CAMERA",
   "when": "first forward-camera sighting per attempt, 1.5 s, #f4f8fa",
   "why": "One grammar."
  },
  {
   "now": "ITS SIDE SENSORS HAVE YOU",
   "where": "caption",
   "decision": "rewrite",
   "after": "SEEN · SIDE SENSORS",
   "when": "first side-sensor sighting per attempt, 1.5 s, #7fa8bc",
   "why": "One grammar. It must never show while the camera is the source (wrong in p_B2_play and p_B2_seen_camera)."
  },
  {
   "now": "(none today) lidar / camera / search sightings",
   "where": "caption",
   "decision": "rewrite",
   "after": "SEEN · ROOF LIDAR (#c3a6ff) / SEEN · STREET CAMERA (#9ff2c8) / SEEN · SEARCH (#ff5a5a)",
   "when": "first sighting per sensor per attempt",
   "why": "Every sensor follows the same rule."
  },
  {
   "now": "FOUND",
   "where": "caption",
   "decision": "merge",
   "after": "SEEN · SEARCH",
   "when": "search re-acquires you",
   "why": "One grammar."
  },
  {
   "now": "LESSON DUE…",
   "where": "caption",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "A state flag. The upgrade screen follows anyway."
  },
  {
   "now": "MOVE ALONG / MOVE ALONG · DRONE IN n",
   "where": "caption and world label",
   "decision": "rewrite",
   "after": "DRONE IN 3",
   "when": "standstill pickup countdown, 11px yellow, above the dummy",
   "why": "One place, three words."
  },
  {
   "now": "STANDSTILL · NO DAMAGE",
   "where": "caption",
   "decision": "rewrite",
   "after": "IT STOPPED",
   "when": "car halts short of you",
   "why": "Says what happened, in fewer words."
  },
  {
   "now": "YOU HIT IT · YOUR FAULT · NO POINTS",
   "where": "caption",
   "decision": "rewrite",
   "after": "YOUR FAULT",
   "when": "dummy strikes the car",
   "why": "The UNTOUCHED pip dims alongside it, so 'NO POINTS' is redundant."
  },
  {
   "now": "STOPS HERE",
   "where": "world, car stop bar, 8px",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "Unreadable. The white stop bar is the mark."
  },
  {
   "now": "LINKED",
   "where": "world, camera link, 9px",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "The mint link line says it."
  },
  {
   "now": "#n",
   "where": "world, crash memory",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "The order of crashes does not change play. The ring and chalk outline remain."
  },
  {
   "now": "LAST SEEN",
   "where": "world, search",
   "decision": "keep",
   "after": "LAST SEEN",
   "when": "lost state, 11px #ff5a5a",
   "why": "This is the one belief the player must outwit."
  },
  {
   "now": "HIT / YOUR FAULT",
   "where": "world, dash guide",
   "decision": "rewrite",
   "after": "HIT / FAULT",
   "when": "dash guide visible, 11px #ffd400",
   "why": "Fewest words. It is a player aid, so it stays yellow."
  },
  {
   "now": "? / !",
   "where": "car plate, 12px / 14px #f4f8fa",
   "decision": "rewrite",
   "after": "? (sensing) / ! (seen), 16px, in the rung colour of the sensor that has you",
   "when": "sensing / seen",
   "why": "White here meant the forward camera even when the side sensors had you (p_C1_seen_side)."
  },
  {
   "now": "BODY / 500 / 800",
   "where": "left panel",
   "decision": "keep",
   "after": "BODY 15px; number 22px",
   "when": "always",
   "why": "Health matters. The type is smaller."
  },
  {
   "now": "DASH / NOT FITTED",
   "where": "left panel",
   "decision": "rewrite",
   "after": "DASH (charge bar only)",
   "when": "only once Battery 1 is fitted",
   "why": "A part you do not own is not actionable."
  },
  {
   "now": "MONUMENT · <TILE> / MONUMENT · <TILE> · DRONE",
   "where": "left panel map",
   "decision": "rewrite",
   "after": "MONUMENT",
   "when": "always",
   "why": "The grid shows the tile. DRONE is a debug flag."
  },
  {
   "now": "CHASSIS 01",
   "where": "right panel",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "Internal name."
  },
  {
   "now": "LAST HIT / —",
   "where": "right panel",
   "decision": "rewrite",
   "after": "LAST HIT  R ARM −100",
   "when": "only after the first hit of the run",
   "why": "The empty placeholder is noise."
  },
  {
   "now": "WASD MOVE",
   "where": "key panel",
   "decision": "keep",
   "after": "WASD  MOVE",
   "when": "puzzles 1–2 only",
   "why": "Learned by puzzle 3."
  },
  {
   "now": "SPACE DASH / E GRAB / C CROUCH",
   "where": "key panel",
   "decision": "keep",
   "after": "SPACE  DASH / E  GRAB / C  CROUCH",
   "when": "once the part is fitted. Gamepad glyphs replace keys when a pad is active.",
   "why": "One home for keys. Widen the panel so 'CROUCH' does not clip at x 1264."
  },
  {
   "now": "Tile <X>. Puzzle n of 9.",
   "where": "card",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "The title already holds the number. The tile is on the map."
  },
  {
   "now": "Get the Luminary™ to hit you. Its fault, not yours.",
   "where": "card goal (8 cards)",
   "decision": "rewrite",
   "after": "Get hit twice. Its fault, not yours. (puzzles 1–2) / Get hit. Its fault, not yours. (3–8)",
   "when": "card",
   "why": "Shorter, and it states the new count."
  },
  {
   "now": "Three hits by the Luminary™, each its fault. A new way each time.",
   "where": "C3 card goal",
   "decision": "rewrite",
   "after": "Get hit three times. A new way each time.",
   "when": "card",
   "why": "Shorter."
  },
  {
   "now": "NEW · <thing>.   ·   PAR n s",
   "where": "card",
   "decision": "rewrite",
   "after": "A1 'NEW · THE LUMINARY™ · BLIND'; B1 'NEW · FORWARD CAMERA · SEES ITS LANE'; C1 'NEW · SIDE SENSORS · SEE BOTH KERBS'; C2 'NEW · DASH · SPACE'; B2 'NEW · STREET CAMERAS · A DASH BREAKS A POST'; A3 'NEW · ROAD ITEMS · STOPS FOR CONES'; B3 'NEW · SUPER KNEES · C CROUCHES'; C3 'NEW · BOSS · LEARNS BETWEEN HITS'. PAR on its own line: 'PAR 20 s'.",
   "when": "card",
   "why": "Removes mixed-device keys ('B … (KEYS: C)'), and par becomes its own fact."
  },
  {
   "now": "Card tales (3 lines)",
   "where": "card",
   "decision": "rewrite",
   "after": "A1 'Fresh off the factory floor. Your first colleague is red, keen and blind.' B1 'Now it has eyes on its bonnet. It brakes for what it sees in time.' C1 'Now it watches both kerbs. The high road has a gap. Gravity is company policy.' C2 'The road runs through the portal tower. It cannot see through the kiosk.' B2 'The plaque reads ZERO ACCIDENTS. The street cameras watch the island.' A3 'The cubes rose one budget at a time. Now it stops for cones.' B3 'Two screens advertise all night. Low hedges line the canyon. Crouch behind them.' C3 'It has learned from every dummy so far. Three more lessons.'",
   "when": "card",
   "why": "At most 2 lines at 31px."
  },
  {
   "now": "(missing) SPACE START",
   "where": "card",
   "decision": "rewrite",
   "after": "SPACE · START",
   "when": "card, bottom right, #3fd0ff",
   "why": "No card shot shows how to proceed."
  },
  {
   "now": "SED-01-001 · LUMINARY™ · AMBASSADOR",
   "where": "upgrade screen",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "Internal serial."
  },
  {
   "now": "YOUR HIT · ITS TRAINING CLIP",
   "where": "upgrade screen",
   "decision": "rewrite",
   "after": "YOUR HIT",
   "when": "upgrade screen",
   "why": "Fewest words."
  },
  {
   "now": "SPACE CONTINUE / SPACE · CONTINUE",
   "where": "gift / upgrade",
   "decision": "rewrite",
   "after": "SPACE · CONTINUE",
   "when": "all cards",
   "why": "One form."
  },
  {
   "now": "Dash: A (keys: Space). Reach a car's path from cover set back from the road.",
   "where": "gift screen",
   "decision": "rewrite",
   "after": "SPACE dashes. Reach the road from far cover.",
   "when": "gift",
   "why": "Active device only. Shorter."
  },
  {
   "now": "NEXT PUZZLE / Puzzle 4: Portal. New: Battery 1: the dash.",
   "where": "gift screen",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "The next card says it."
  },
  {
   "now": "TIME 2.6 s · PUZZLE CLOCK 2.6 s · RESTARTS 0 · PASSES 1",
   "where": "result",
   "decision": "rewrite",
   "after": "2.6 s",
   "when": "result",
   "why": "Debug counters."
  },
  {
   "now": "GET HIT BY THE LUMINARY™ / 2.6 s · under par",
   "where": "result star sublines",
   "decision": "rewrite",
   "after": "(cut) / 2.6 s",
   "when": "result",
   "why": "Repeats the goal and the time."
  },
  {
   "now": "NEXT · PUZZLE 2 · STOP LINE · NEW: ITS FORWARD CAMERA. IT STOPS FOR YOU IN ITS LANE.",
   "where": "result",
   "decision": "rewrite",
   "after": "NEXT · STOP LINE",
   "when": "result",
   "why": "The next card teaches it."
  },
  {
   "now": "Show trace / SHIPPING V1 · PUZZLES · registry / T TUNING",
   "where": "pause, controls",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "Debug in a shipping build."
  },
  {
   "now": "??? / A Corporation drone brings / Super Knees fits it / J ???",
   "where": "controls",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "List fitted keys only."
  },
  {
   "now": "Self-driving cars are designed never to hit anyone. Your training: get hit, in combos, and earn your parts.",
   "where": "title",
   "decision": "rewrite",
   "after": "Self-driving cars never hit anyone. Your job: get hit.",
   "when": "title",
   "why": "'In combos' is arcade language and untrue in Story."
  },
  {
   "now": "Nine puzzles. Get the Luminary™ to hit you. It learns from every one.",
   "where": "modes, STORY",
   "decision": "rewrite",
   "after": "Nine puzzles. It learns from every hit.",
   "when": "modes",
   "why": "Shorter."
  },
  {
   "now": "3 save slots · a new game begins in Monument A1",
   "where": "modes",
   "decision": "cut",
   "after": "",
   "when": "",
   "why": "The next screen shows it."
  },
  {
   "now": "Locked. Pass Certification, Map 1's puzzle 9, to open it. / LOCKED · SOLVE MAP 1",
   "where": "modes, ARCADE",
   "decision": "merge",
   "after": "LOCKED · CLEAR PUZZLE 9",
   "when": "modes",
   "why": "Two texts for one fact."
  },
  {
   "now": "ARROWS CHOOSE · SPACE SELECT (22px #3fd0ff) / … · SHIFT BACK (15px #9fb8c8)",
   "where": "modes, saves",
   "decision": "rewrite",
   "after": "ARROWS CHOOSE · SPACE SELECT · SHIFT BACK, 15px #9fb8c8 on both",
   "when": "menus",
   "why": "One style."
  },
  {
   "now": "STORY · SAVE GAMES / SAVE GAMES / SAVED IN THIS BROWSER",
   "where": "saves",
   "decision": "merge",
   "after": "Top: STORY; header: SAVE GAMES",
   "when": "saves",
   "why": "The same title twice. The storage note is not actionable."
  },
  {
   "now": "Monument A1 · into slot 1 / No story saved here.",
   "where": "saves",
   "decision": "rewrite",
   "after": "SLOT 1 / (cut)",
   "when": "saves",
   "why": "EMPTY already says it."
  },
  {
   "now": "DUMMIES / DUMMY CORPORATION / SELECT A MODE / STORY / ARCADE / HIGH SCORES / CREDITS / NEW GAME / EMPTY / 1 2 3 / 5 / >>>",
   "where": "menus, cards",
   "decision": "keep",
   "after": "unchanged",
   "when": "as now",
   "why": "Short and functional."
  }
 ],
 "seen_language": {
  "grammar": [
   "Every sensor has three states: idle, sensing, seen. Two edge states: hidden (cover cuts the field) and lost (search only).",
   "The field is drawn in the sensor's rung colour. Idle: fill 10%, edge 35%, dashed. Sensing: fill 20% where the dummy is. Seen: fill 25%, solid edge.",
   "One dummy mark per state. Sensing: an open arc round the dummy, r 18px, 2px, filling clockwise. Seen: four corner brackets, 28×28 box, 6px arms, 2px. Both in the sensor's colour.",
   "Car plate: '?' while sensing, '!' when seen, 16px, in the same colour.",
   "If several sensors have you, the highest rung draws the dummy mark and plate mark. Lower fields only brighten.",
   "Sensors without a notice timer skip sensing and go straight from idle to seen.",
   "Words: 'SEEN · <SENSOR>' once per sensor per attempt. No other seen text.",
   "The steel-blue fill ring, mint square and lilac dots on the dummy are removed. The arc and brackets replace them.",
   "The dummy's facing arrow is drawn #ffd400, not white. White belongs to the forward camera."
  ],
  "states": [
   {
    "state": "idle",
    "field": "Fill 10%, dashed edge 35%, sensor colour",
    "on_dummy": "none",
    "on_car": "plate blank",
    "words": ""
   },
   {
    "state": "sensing",
    "field": "Fill 20% in the field section that holds the dummy",
    "on_dummy": "Open arc r 18px filling clockwise over the notice time (side sensors: perception.sideNoticeSeconds)",
    "on_car": "'?' 16px in sensor colour",
    "words": ""
   },
   {
    "state": "seen",
    "field": "Fill 25%, solid edge 60%",
    "on_dummy": "Four corner brackets 28×28, 2px, sensor colour",
    "on_car": "'!' 16px in sensor colour",
    "words": "SEEN · <SENSOR> (first time per attempt, 1.5 s)"
   },
   {
    "state": "hidden",
    "field": "Field clipped at the cover. The occluded wedge has no fill. Cover edge ticked in sensor colour.",
    "on_dummy": "none",
    "on_car": "plate blank",
    "words": ""
   },
   {
    "state": "lost",
    "field": "Red search wedge sweeps. Dashed red ring r 22px at the last seen position.",
    "on_dummy": "Brackets fade out over 0.5 s",
    "on_car": "'?' red",
    "words": "LAST SEEN (at ring, 11px)"
   }
  ],
  "sensors": [
   {
    "sensor": "forward camera",
    "colour": "#f4f8fa",
    "field_shape": "Ribbon along its lane to perception.forwardLength. Brighter too-late zone at the nose. White stop bar.",
    "idle": "Ribbon 10%, no pulses",
    "seen": "Ribbon 25%, white brackets on dummy, white '!'",
    "params": [
     "perception.forwardLength",
     "perception.forwardConeAngle"
    ]
   },
   {
    "sensor": "side sensors",
    "colour": "#7fa8bc",
    "field_shape": "Two fans either side, dashed edge. Grade rings and pings cut.",
    "idle": "Both fans 10%",
    "seen": "That side's fan 25% plus brackets. Sensing arc fills over perception.sideNoticeSeconds before this.",
    "params": [
     "perception.sideNoticeSeconds"
    ]
   },
   {
    "sensor": "roof lidar",
    "colour": "#c3a6ff",
    "field_shape": "Sweep line round the roof plus dotted reach circle. Ticks on cover edges.",
    "idle": "Sweep line 35%, circle 10%",
    "seen": "Brackets when the sweep crosses the dummy, held for ui.seenHoldSeconds 0.6 (proposed)",
    "params": [
     "ui.seenHoldSeconds (proposed)"
    ]
   },
   {
    "sensor": "street camera",
    "colour": "#9ff2c8",
    "field_shape": "Filled cone from the post, angle perception.streetCameraFov, radius perception.streetCameraRange",
    "idle": "Cone 10%, edges 35%",
    "seen": "Cone 25%, brackets, dashed mint line dummy→post, solid line post→car",
    "params": [
     "perception.streetCameraFov",
     "perception.streetCameraRange",
     "perception.streetCameraPanArc",
     "perception.streetCameraPanSeconds"
    ]
   },
   {
    "sensor": "road items",
    "colour": "#ff8a1f",
    "field_shape": "Uses the forward ribbon. The subject is the cone, not the dummy.",
    "idle": "No mark on cones",
    "seen": "Brackets on each cone inside the ribbon",
    "params": [
     "perception.forwardLength"
    ]
   },
   {
    "sensor": "crash memory",
    "colour": "#ff5a5a",
    "field_shape": "Red chalk outline plus ring at each remembered spot. Numbers cut.",
    "idle": "Ring dashed 35%",
    "seen": "Ring solid 60% while the car is approaching it. No dummy mark: this is belief, not sight.",
    "params": []
   },
   {
    "sensor": "search",
    "colour": "#ff5a5a",
    "field_shape": "Red searchlight wedge plus LAST SEEN ring plus timer arc on the ring",
    "idle": "Wedge 10%",
    "seen": "Wedge 25%, red brackets, red '!', caption 'SEEN · SEARCH'",
    "params": []
   }
  ]
 },
 "cctv": {
  "fov_deg": 90,
  "pan": "B2 and A3: fixed (perception.streetCameraPanArc 0 at stages 10.5–10.6, proposed), aimed by p11Camera at the cover it watches. C3: unchanged, perception.streetCameraFov 60, pan perception.streetCameraPanArc 60 over perception.streetCameraPanSeconds.",
  "idle": "Mint #9ff2c8 cone fill 10%, edge lines 1px at 35%, range arc at perception.streetCameraRange 180. The post has a 6px lens tick along the aim. The dashed 360° range circle is removed.",
  "seen": "Cone fill 25%, solid edges. Mint brackets on the dummy. Dashed mint line dummy→post, then solid post→car (the report). Car plate '!' in mint. Caption 'SEEN · STREET CAMERA'. Once the post is broken by a dash, the cone is not drawn.",
  "params": [
   "perception.streetCameraFov 360→90 at 10.5–10.6 (value change)",
   "perception.streetCameraPanArc 0 at 10.5–10.6 (proposed)",
   "perception.streetCameraRange 180",
   "perception.streetCameraPanSeconds"
  ],
  "why": "The user wants a cone. Today's sim sees 360° at B2 and A3, so drawing a cone over it would lie. The fix is to make the sim a cone: a registry change, not a new mechanic. C3 already draws a true 60° cone (p_C3_drop), so the camera then looks the same everywhere. The link line stays because it shows the report to the car."
 },
 "dash_guide": {
  "show_when": "All of: Battery 1 fitted, dash fully charged, dummy on the ground and free to act (not drone-carried, not in drop, not mid-dash, not falling, not on a card or lesson), and the game unpaused.",
  "hide_when": "Any of: drone carrying or dropping the dummy (today visible in p_B2_drop, p_A3_drop, p_C3_drop), dash recharging (no dimmed draw), airborne or dropping from a parapet, mid-dash, a card or screen open, dash not fitted.",
  "look": "#ffd400 dotted line, 2px dots every 5px, from the dummy to the landing point at dash.distance (proposed id if absent). Landing circle r 9px, 1.5px, 70% alpha. 'HIT' or 'FAULT' 11px #ffd400 beside the circle only when it applies. No other text."
 },
 "stairs_and_gaps": {
  "stair_arrows": "Remove the cyan bracket boxes and the bright '<<'/'>>'/'^^' (every play shot, e.g. p_B2_play shows four). Draw one 2-chevron mark, 8px, #5e7080 at 60%, on the apron pointing into the flight. Brighten it to 100% only when the dummy is within ui.stairHintRadius 48px (proposed).",
  "parapet_gaps": "At each gap end, draw a 3×8px end cap in #ffd400 at 80% so the break reads as a deliberate opening. Shift the deck edge inside the gap 2px lighter. Parapet art is otherwise unchanged.",
  "jump_down_arrow": "One 8px down-chevron #ffd400 at 40%, drawn on the road 12px below the gap centre, pointing away from the deck. It pulses 40→70% every 1.5 s, only while the dummy is on that deck within ui.gapHintRadius 120px (proposed). Hidden while airborne."
 },
 "acceptance": [
  "No play or drop shot has a HUD panel inside the field (x 240–1040, y 40–680). Only world marks and at most one caption appear there.",
  "The top bar shows 'PUZZLE n · <NAME>' with no tile id and no 'OBJECTIVE'. The drop and play shots of each puzzle have identical top-bar text.",
  "The objective line reads 'GET HIT · ITS FAULT  0 / 2' on A1 and B1, '… 0 / 1' on C1–B3, and '3 HITS · NEW WAY EACH  0 / 3' on C3. The hit count appears nowhere else.",
  "Top bar right shows 'n.n / PAR s' and three star pips with no star words. POINTS is absent in Story.",
  "No in-play shot contains RUNG, PASS, RESTARTS, CHASSIS, DRONE, TEACHES, EARN, 'KEYS:', 'OUTWIT' or 'R restarts'.",
  "'R  RESTART' appears exactly once in play, in the key panel.",
  "The key panel lists only fitted parts. WASD appears only on A1 and B1. 'CROUCH' fits inside the panel.",
  "The DASH panel is absent on A1, B1 and C1. LAST HIT is absent before the first hit.",
  "The car block in the right panel shows 'LUMINARY™', the sensor name in its rung colour, and seven pips.",
  "No world label below 11px. STOPS HERE, LINKED and #n are absent.",
  "p_B2_seen_camera equivalent: the caption reads 'SEEN · STREET CAMERA' in mint, never 'SIDE SENSORS'.",
  "B2 and A3 cameras draw a filled 90° mint cone, with no 360° dashed circle. C3 draws a 60° cone.",
  "Seen shots for the forward camera, side sensors, lidar and camera each show four corner brackets on the dummy in that sensor's colour, and a plate '!' in the same colour.",
  "The side-sensor sensing shot shows an open steel-blue arc round the dummy and a steel-blue '?' on the plate.",
  "The dash guide (yellow dotted line and circle) is absent in every drop shot and while the dash recharges.",
  "Stair marks are #5e7080 chevrons with no cyan bracket boxes.",
  "C1 and C2 deck gaps show yellow end caps. A faint yellow down-chevron appears below the gap only when the dummy is on the deck nearby.",
  "Every card shows 'SPACE · START', a tale of 2 lines or fewer, and no 'Tile X. Puzzle n of 9.' line.",
  "The result screen shows no 'PUZZLE CLOCK', 'RESTARTS' or 'PASSES'. Pause shows no 'Show trace' or 'registry'. Controls show no 'T TUNING' or '???'.",
  "The dummy's facing arrow is yellow, not white, in all play shots."
 ],
 "risks": [
  "Two hits on A1/B1 (puzzle.A1.hitsNeeded 2, puzzle.B1.hitsNeeded 2, proposed) reuse C3's multi-hit flow. The mid-puzzle lesson must stay off there (puzzle.<id>.midLesson false, proposed), or puzzle 1 shows a boss beat. Hit 1 must not write off the body; that rule exists only for the boss today.",
  "Par must rise with the hit count, or PAR becomes impossible: puzzle.A1.par 10→20, puzzle.B1.par 15→30 (proposed, to tune). A1 today clears in 2.6 s, so the brief is right that it is too easy, but a second identical hit in a blind-car puzzle can feel like repetition. The B1 second hit should need the other side of the stop line.",
  "perception.streetCameraFov 90 with a fixed aim at B2/A3 changes what the camera covers. Re-run both solve routes and confirm the watched cover still sits inside the cone.",
  "Removing the attempt panel and moving the car block shifts the right panel. The doll must shrink, and gamepad glyph rows must still fit at 1280×720.",
  "Hiding WASD after puzzle 2 and showing fitted parts only depends on the save state knowing what is fitted. A wrong state hides a key the player needs.",
  "Highest rung wins the dummy mark. A player seen by both side sensors and camera sees only mint, and may not learn that the side sensors also had them. The lower field still brightens to cover this.",
  "'!' on the cue key today also means 'Blocked, warning you' (blue). The cue key rows must be redrawn to the new grammar, or '!' carries two meanings.",
  "Shortening card tales removes some lore. The writer of record should approve the rewritten lines."
 ]
}
```

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


# Every text the canvas drew in the new build, by screenshot

| Text (as drawn) | Region | Size | Colour | Shots |
|---|---|---|---|---|
| ! | field | 16px | #f4f8fa | p_B1_seen_ahead, p_C1_seen_side, p_C2_play, p_B2_seen_camera +2 |
| 1 | field | 28px | #9fb8c8 | 03_saves |
| 2 | field | 28px | #9fb8c8 | 03_saves |
| 3 | field | 28px | #9fb8c8 | 03_saves |
| ? | field | 16px | #7fa8bc | p_C1_play |
| ARCADE | field | 34px | #f4f8fa | 02_modes |
| ARROWS CHOOSE · SPACE SELECT | field | 22px | #3fd0ff | 02_modes |
| ARROWS CHOOSE · SPACE SELECT · SHIFT BACK | field | 15px | #9fb8c8 | 03_saves |
| CREDITS | field | 22px | #f4f8fa | 02_modes |
| Clear puzzle 9 to open it. | field | 19px | #f4f8fa | 02_modes |
| DUMMIES | field | 112px | #f5c542 | 01_title |
| EMPTY | field | 28px | #5e7080 | 03_saves |
| HIGH SCORES | field | 22px | #f4f8fa | 02_modes |
| LOCKED · CLEAR PUZZLE 9 | field | 17px | #9fb8c8 | 02_modes |
| NEW GAME | field | 24px | #ffffff | 03_saves |
| Nine puzzles. It learns from | field | 19px | #ffffff | 02_modes |
| SAVE GAMES | field | 22px | #3fd0ff | 03_saves |
| SEEN · FORWARD CAMERA | field | 14px | #f4f8fa | p_B1_seen_ahead, p_B3_play |
| SEEN · SIDE SENSORS | field | 14px | #7fa8bc | p_C1_seen_side, p_C2_play |
| SEEN · STREET CAMERA | field | 14px | #9ff2c8 | p_B2_seen_camera, p_C3_seen_camera |
| SLOT 1 | field | 16px | #ffffff | 03_saves |
| STORY | field | 34px | #ffffff | 02_modes |
| Self-driving cars never hit anyone. Your job: get hit. | field | 26px | #ffffff | 01_title |
| every hit. | field | 19px | #ffffff | 02_modes |
| 500 | left panel | 24px | #f4f8fa | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +7 |
| 800 | left panel | 24px | #f4f8fa | p_C2_card, p_C2_drop, p_C2_play, p_B2_card +13 |
| >>> | left panel | 31px | #f5c542 | p_A1_card, p_B1_card, p_C1_card, p_C2_card +4 |
| BODY | left panel | 22px | #9fb8c8 | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| DASH | left panel | 22px | #9fb8c8 | p_C2_card, p_C2_drop, p_C2_play, p_B2_card +13 |
| DUMMY CORPORATION | left panel | 19px | #3fd0ff | 02_modes, 03_saves |
| EARN · BATTERY 1 · DASH | left panel | 20px | #9fb8c8 | p_C1_card |
| EARN · HANDS 1 · CONES | left panel | 20px | #9fb8c8 | p_B2_card |
| EARN · SUPER KNEES · CROUCH | left panel | 20px | #9fb8c8 | p_A3_card |
| Fresh off the factory floor. Your first colleague is | left panel | 31px | #ffffff | p_A1_card |
| Get hit three times. A new way each time. | left panel | 31px | #ffffff | p_C3_card |
| Get hit twice. Its fault, not yours. | left panel | 31px | #ffffff | p_A1_card, p_B1_card |
| Get hit. Its fault, not yours. | left panel | 31px | #ffffff | p_C1_card, p_C2_card, p_B2_card, p_A3_card +1 |
| It has learned from every dummy so far. Three | left panel | 31px | #ffffff | p_C3_card |
| MONUMENT | left panel | 24px | #f4f8fa | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +24 |
| NEW · BOSS · LEARNS BETWEEN HITS | left panel | 20px | #f5c542 | p_C3_card |
| NEW · DASH · SPACE | left panel | 20px | #f5c542 | p_C2_card |
| NEW · FORWARD CAMERA · SEES ITS LANE | left panel | 20px | #f5c542 | p_B1_card |
| NEW · ROAD ITEMS · STOPS FOR CONES | left panel | 20px | #f5c542 | p_A3_card |
| NEW · SIDE SENSORS · SEE BOTH KERBS | left panel | 20px | #f5c542 | p_C1_card |
| NEW · STREET CAMERAS · A DASH BREAKS A POST | left panel | 20px | #f5c542 | p_B2_card |
| NEW · SUPER KNEES · C CROUCHES | left panel | 20px | #f5c542 | p_B3_card |
| NEW · THE LUMINARY™ · BLIND | left panel | 20px | #f5c542 | p_A1_card |
| Now it has eyes on its bonnet. It brakes for what it | left panel | 31px | #ffffff | p_B1_card |
| Now it watches both kerbs. The high road has a | left panel | 31px | #ffffff | p_C1_card |
| PAR 18 s | left panel | 20px | #9fb8c8 | p_B1_card |
| PAR 20 s | left panel | 20px | #9fb8c8 | p_C1_card, p_C2_card |
| PAR 25 s | left panel | 20px | #9fb8c8 | p_A1_card, p_B3_card |
| PAR 30 s | left panel | 20px | #9fb8c8 | p_B2_card, p_A3_card |
| PAR 60 s | left panel | 20px | #9fb8c8 | p_C3_card |
| PUZZLE 1 · FIRST CONTACT | left panel | 64px | #f5c542 | p_A1_card |
| PUZZLE 2 · STOP LINE | left panel | 64px | #f5c542 | p_B1_card |
| PUZZLE 3 · HIGH ROAD | left panel | 64px | #f5c542 | p_C1_card |
| PUZZLE 4 · PORTAL | left panel | 64px | #f5c542 | p_C2_card |
| PUZZLE 5 · CCTV | left panel | 64px | #f5c542 | p_B2_card |
| PUZZLE 7 · THE STACKS | left panel | 64px | #f5c542 | p_A3_card |
| PUZZLE 8 · LED CANYON | left panel | 64px | #f5c542 | p_B3_card |
| PUZZLE 9 · CERTIFICATION | left panel | 64px | #f5c542 | p_C3_card |
| The cubes rose one budget at a time. Now it stops | left panel | 31px | #ffffff | p_A3_card |
| The plaque reads ZERO ACCIDENTS. The street | left panel | 31px | #ffffff | p_B2_card |
| The road runs through the portal tower. It cannot | left panel | 31px | #ffffff | p_C2_card |
| Two screens advertise all night. Low hedges line | left panel | 31px | #ffffff | p_B3_card |
| cameras watch the island. | left panel | 31px | #ffffff | p_B2_card |
| for cones. | left panel | 31px | #ffffff | p_A3_card |
| gap. Gravity is company policy. | left panel | 31px | #ffffff | p_C1_card |
| more lessons. | left panel | 31px | #ffffff | p_C3_card |
| red, keen and blind. | left panel | 31px | #ffffff | p_A1_card |
| see through the kiosk. | left panel | 31px | #ffffff | p_C2_card |
| sees in time. | left panel | 31px | #ffffff | p_B1_card |
| the canyon. Crouch behind them. | left panel | 31px | #ffffff | p_B3_card |
| 0.0 / 18 s | right panel | 18px | #f5c542 | p_B1_card, p_B1_drop |
| 0.0 / 20 s | right panel | 18px | #f5c542 | p_C1_card, p_C1_drop, p_C2_card, p_C2_drop |
| 0.0 / 25 s | right panel | 18px | #f5c542 | p_A1_card, p_A1_drop, p_B3_card, p_B3_drop |
| 0.0 / 30 s | right panel | 18px | #f5c542 | p_B2_card, p_B2_drop, p_A3_card, p_A3_drop |
| 0.0 / 60 s | right panel | 18px | #f5c542 | p_C3_card, p_C3_drop |
| 3.3 / 18 s | right panel | 18px | #f5c542 | p_B1_play |
| 3.3 / 20 s | right panel | 18px | #f5c542 | p_C2_play |
| 3.3 / 25 s | right panel | 18px | #f5c542 | p_A1_play |
| 3.3 / 30 s | right panel | 18px | #f5c542 | p_B2_play |
| 3.4 / 20 s | right panel | 18px | #f5c542 | p_C1_play |
| 3.4 / 25 s | right panel | 18px | #f5c542 | p_B3_play |
| 4.0 / 18 s | right panel | 18px | #f5c542 | p_B1_seen_ahead |
| 4.2 / 20 s | right panel | 18px | #f5c542 | p_C1_seen_side |
| 4.3 / 30 s | right panel | 18px | #f5c542 | p_B2_seen_camera, p_A3_play |
| 4.5 / 60 s | right panel | 18px | #f5c542 | p_C3_play |
| 5.4 / 60 s | right panel | 18px | #f5c542 | p_C3_seen_camera |
| BLIND | right panel | 15px | #9fb8c8 | p_A1_drop, p_A1_play |
| C | right panel | 22px | #f4f8fa | p_B3_drop, p_B3_play, p_C3_drop, p_C3_play +1 |
| CROUCH | right panel | 17px | #9fb8c8 | p_B3_drop, p_B3_play, p_C3_drop, p_C3_play +1 |
| DASH | right panel | 17px | #9fb8c8 | p_C2_drop, p_C2_play, p_B2_drop, p_B2_play +8 |
| E | right panel | 22px | #f4f8fa | p_A3_drop, p_A3_play, p_C3_drop, p_C3_play +1 |
| FORWARD CAMERA | right panel | 15px | #f4f8fa | p_B1_drop, p_B1_play, p_B1_seen_ahead |
| GRAB | right panel | 17px | #9fb8c8 | p_A3_drop, p_A3_play, p_C3_drop, p_C3_play +1 |
| LUMINARY™ | right panel | 13px | #e8c67e | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| MOVE | right panel | 17px | #9fb8c8 | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +1 |
| R | right panel | 22px | #f4f8fa | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| RESTART | right panel | 17px | #9fb8c8 | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +16 |
| ROAD ITEMS | right panel | 15px | #ff8a1f | p_A3_drop, p_A3_play, p_B3_drop, p_B3_play +3 |
| SIDE SENSORS | right panel | 15px | #7fa8bc | p_C1_drop, p_C1_play, p_C1_seen_side, p_C2_drop +1 |
| SPACE | right panel | 22px | #f4f8fa | p_C2_drop, p_C2_play, p_B2_drop, p_B2_play +8 |
| SPACE · START | right panel | 28px | #f5c542 | p_A1_card, p_B1_card, p_C1_card, p_C2_card +4 |
| STREET CAMERAS | right panel | 15px | #9ff2c8 | p_B2_drop, p_B2_play, p_B2_seen_camera |
| WASD | right panel | 22px | #f4f8fa | p_A1_drop, p_A1_play, p_B1_drop, p_B1_play +1 |
| 3 HITS · NEW WAY EACH  0 / 3 | top bar | 22px | #f4f8fa | p_C3_card, p_C3_drop, p_C3_play, p_C3_seen_camera |
| 5 | top bar | 15px | #f4f8fa | 01_title, 02_modes |
| GET HIT · ITS FAULT  0 / 1 | top bar | 22px | #f4f8fa | p_C1_card, p_C1_drop, p_C1_play, p_C1_seen_side +13 |
| GET HIT · ITS FAULT  0 / 2 | top bar | 22px | #f4f8fa | p_A1_card, p_A1_drop, p_A1_play, p_B1_card +3 |
| PUZZLE 1 · FIRST CONTACT | top bar | 22px | #101417 | p_A1_card, p_A1_drop, p_A1_play |
| PUZZLE 2 · STOP LINE | top bar | 22px | #101417 | p_B1_card, p_B1_drop, p_B1_play, p_B1_seen_ahead |
| PUZZLE 3 · HIGH ROAD | top bar | 22px | #101417 | p_C1_card, p_C1_drop, p_C1_play, p_C1_seen_side |
| PUZZLE 4 · PORTAL | top bar | 22px | #101417 | p_C2_card, p_C2_drop, p_C2_play |
| PUZZLE 5 · CCTV | top bar | 22px | #101417 | p_B2_card, p_B2_drop, p_B2_play, p_B2_seen_camera |
| PUZZLE 7 · THE STACKS | top bar | 22px | #101417 | p_A3_card, p_A3_drop, p_A3_play |
| PUZZLE 8 · LED CANYON | top bar | 22px | #101417 | p_B3_card, p_B3_drop, p_B3_play |
| PUZZLE 9 · CERTIFICATION | top bar | 22px | #101417 | p_C3_card, p_C3_drop, p_C3_play, p_C3_seen_camera |
| SELECT A MODE | top bar | 22px | #9fb8c8 | 02_modes |
| STORY · SAVE GAMES | top bar | 22px | #9fb8c8 | 03_saves |

# Screenshots of the new build (Read every one)

- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/01_title.png` · title screen
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/02_modes.png` · mode select
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/03_saves.png` · save slots
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A1_card.png` · A1: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A1_drop.png` · A1: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A1_play.png` · A1: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B1_card.png` · B1: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B1_drop.png` · B1: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B1_play.png` · B1: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B1_seen_ahead.png` · B1: seen ahead
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C1_card.png` · C1: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C1_drop.png` · C1: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C1_play.png` · C1: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C1_seen_side.png` · C1: seen side
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C2_card.png` · C2: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C2_drop.png` · C2: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C2_play.png` · C2: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B2_card.png` · B2: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B2_drop.png` · B2: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B2_play.png` · B2: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B2_seen_camera.png` · B2: seen camera
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A3_card.png` · A3: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A3_drop.png` · A3: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A3_play.png` · A3: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B3_card.png` · B3: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B3_drop.png` · B3: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_B3_play.png` · B3: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C3_card.png` · C3: the puzzle card
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C3_drop.png` · C3: the drone drops the dummy in
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C3_play.png` · C3: play
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C3_seen_camera.png` · C3: seen camera
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A1_lesson_clip.png` · A1: the car upgrade screen, the replay
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A1_lesson_fit.png` · A1: the car upgrade screen, the part fitted
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A1_result.png` · A1: the result (stars)
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_A3_gift.png` · A3: the dummy's part, gift screen
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C1_gift.png` · C1: the dummy's part, gift screen
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_C3_midlesson_1.png` · C3: the boss's mid-puzzle lesson
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_grid.png` · grid: the puzzle grid
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_pause.png` · pause: pause menu
- `/home/claude/elvtr-multiagent-submission-7/pipeline/runs/20261111-040150-cleanup-review-r3/shots/p_pause_controls.png` · pause: pause menu