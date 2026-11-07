## LADDER
```json
[
 {
  "stage": "10.1",
  "title": "THE TEST ROAD",
  "startRung": 0,
  "topRung": 0,
  "teaches": "Nothing. The red car drives straight through.",
  "closes": "walk into its path and let it hit you",
  "opens": "walk into its path",
  "measuredOpenWaysOnTheTestRoad": "walkin 3.73, flank 2.54, aim 1.8, stand 1.27, standOff 1.27, standSouth 1.21, wander 0.93",
  "keyValues": {
   "duel.enabled": 1,
   "duel.carsOnRoad": 1,
   "duel.redReturnSeconds": 4,
   "proto.learningEnabled": 0,
   "proto.learn.standoffEnabled": 0,
   "perception.forwardLength": 0,
   "proto.driver.cautionZone": 0,
   "run.appearances.road": 1000,
   "run.quota.road": 1000000
  }
 },
 {
  "stage": "10.2",
  "title": "THE FIRST LESSON",
  "startRung": 0,
  "topRung": 1,
  "teaches": "At the clear: the forward camera. It will brake for a dummy in its lane.",
  "closes": "walk into its path and let it hit you (it senses nothing yet)",
  "opens": "the cut-in: dash into its path just ahead of its nose",
  "measuredOpenWaysOnTheTestRoad": "flank 2.81, walkin 1.94, aim 1.6, wander 0.53",
  "keyValues": {
   "perception.forwardLength": 720,
   "duel.topRung": 1,
   "duel.standstillSpeed": 5,
   "duel.dashArrives": 2
  }
 },
 {
  "stage": "10.3",
  "title": "THE SIDE SENSORS",
  "startRung": 1,
  "topRung": 2,
  "teaches": "At the clear: side sensors. It will notice a dummy beside the road and stop short.",
  "closes": "the cut-in: wait beside its lane; dash into its path just ahead of its nose (Battery 1)",
  "opens": "height: a deck over its road",
  "measuredOpenWaysOnTheTestRoad": "jump 2.69, plinth 2.67, gap 2.07, aim 2.0, flank 1.8, dashjump 0.47",
  "keyValues": {
   "proto.driver.cautionZone": 180,
   "duel.topRung": 2,
   "duel.dashArrives": 3,
   "duel.startRung": 1,
   "duel.jumpArrives": 2,
   "perception.sideNoticeSeconds": 0.6
  }
 },
 {
  "stage": "10.4",
  "title": "THE ROOF LIDAR",
  "startRung": 2,
  "topRung": 3,
  "teaches": "At the clear: the roof lidar. It will see a dummy in the air.",
  "closes": "height: drop through a gap in a deck over its road as it drives under, or jump into its path",
  "opens": "cover: tall roadside cover",
  "measuredOpenWaysOnTheTestRoad": "jump 2.69, gap 2.21, aim 2.0, flank 1.8, dashjump 0.47",
  "keyValues": {
   "duel.topRung": 3,
   "duel.startRung": 2,
   "duel.jumpArrives": 3
  }
 },
 {
  "stage": "10.5",
  "title": "THE STREET CAMERAS",
  "startRung": 3,
  "topRung": 4,
  "teaches": "At the clear: street cameras. Cover a camera watches will no longer hide you.",
  "closes": "cover: spring from behind a building, cabinet, kiosk or billboard into its path",
  "opens": "cover the cameras miss; a cone in its lane",
  "measuredOpenWaysOnTheTestRoad": "conebait 2.0, lurk 0.8",
  "keyValues": {
   "duel.topRung": 4,
   "duel.startRung": 3,
   "duel.conesArrives": 2
  }
 },
 {
  "stage": "10.6",
  "title": "DUCK",
  "startRung": 4,
  "topRung": 5,
  "teaches": "At the clear: road items. It will stop for a cone, never swerve round it.",
  "closes": "cover the cameras miss, or a cone in its lane: it swerves into you",
  "opens": "low cover: duck (hold C) behind a planter or hedge",
  "measuredOpenWaysOnTheTestRoad": "planter 3.03, lurk 0.8",
  "keyValues": {
   "duel.topRung": 5,
   "duel.startRung": 4,
   "duel.conesArrives": 3,
   "duel.duckArrives": 2,
   "duel.planters": 1,
   "props.planter.height": 14,
   "body.duckHeight": 6,
   "movement.duckSpeedFactor": 0.35,
   "perception.duckNoticeFactor": 1.5,
   "perception.sensorHeight": 14,
   "perception.lidarHeight": 26,
   "perception.streetCameraHeight": 60
  }
 },
 {
  "stage": "10.7",
  "title": "CRASH MEMORY",
  "startRung": 5,
  "topRung": 6,
  "teaches": "At the clear: crash memory. It will watch every spot you struck from.",
  "closes": "duck (hold C) behind a planter or hedge by its road; spring into its path",
  "opens": "a new spot each time",
  "measuredOpenWaysOnTheTestRoad": "roam 6.97, lurk 0.6, flankOpen 0.4",
  "keyValues": {
   "duel.redReturnSeconds": 2,
   "duel.topRung": 6,
   "duel.startRung": 5,
   "duel.duckArrives": 3,
   "duel.memoryRadius": 50,
   "duel.memorySites": 3,
   "duel.runInLength": 200,
   "proto.health.standard": 500,
   "duel.blockSeconds": 10
  }
 },
 {
  "stage": "10.8",
  "title": "THE SEARCH",
  "startRung": 6,
  "topRung": 7,
  "teaches": "At the clear: the search. Seen then hidden, it will search where it last saw you.",
  "closes": "a new spot each time: roam the tile's cover",
  "opens": "hide before it sees you",
  "measuredOpenWaysOnTheTestRoad": "roam 2.87, lure 2.24, peekmove 1.21, flankOpen 1.07, lurk 0.8, gap 0.6",
  "keyValues": {
   "duel.topRung": 7,
   "duel.startRung": 6,
   "duel.searchRadius": 60,
   "duel.searchSeconds": 4,
   "perception.streetCameraFov": 60,
   "perception.streetCameraPanArc": 60,
   "perception.streetCameraPanSeconds": 3,
   "perception.streetCameraPanHold": 1,
   "scoring.stealthUnseen": 3,
   "scoring.stealthLost": 2,
   "scoring.stealthSeen": 1,
   "ui.tip.holdSeconds": 7
  }
 },
 {
  "stage": "10.9",
  "title": "THE TWO-WAY ROAD",
  "startRung": 7,
  "topRung": 7,
  "teaches": "Nothing new: it has learned all it can. Prototype 9's two-way traffic is moving cover.",
  "closes": "moving cover: step out from behind white traffic into its path",
  "opens": "moving cover",
  "measuredOpenWaysOnTheTestRoad": "flankOpen 4.85, roam 2.31, lure 2.23, kerb 2.09, peekmove 1.48, jump 1.27, gap 0.93",
  "keyValues": {
   "duel.startRung": 7,
   "perception.forwardConeAngle": 10,
   "perception.sideConeAxis": 52.5,
   "perception.sideConeAngle": 42.5,
   "duel.twoWay": 1,
   "duel.whiteInterval": 3.5,
   "traffic.junctionLookahead": 400,
   "traffic.junctionGap": 2.2,
   "perception.coneRadius": 340,
   "perception.sideConeRatio": 0.6666666666666666,
   "perception.forwardGrades": 3,
   "perception.sideGrades": 2
  }
 },
 {
  "stage": "10.10",
  "title": "THE INCIDENT",
  "startRung": 7,
  "topRung": 7,
  "teaches": "Nothing new. White cars tailgate it: make it stop hard and the car behind runs into it (an Incident, scored).",
  "closes": "the Incident: make it stop hard in front of a tailgater",
  "opens": "the Incident",
  "measuredOpenWaysOnTheTestRoad": "flankOpen 5.4, kerb 2.76, lure 2.44, dashjump 2.08, roam 1.48, peekmove 1.34, jump 1.27; Incidents about 0.6 a minute",
  "keyValues": {
   "traffic.whiteTimeGap": 0.5,
   "traffic.whiteBraking": 45,
   "traffic.whiteSpeedRatio": 1.12,
   "scoring.incidentPoints": 250,
   "traffic.incidentSeconds": 2
  }
 }
]
```

## MAP1
```json
{
 "id": "monument",
 "name": "Monument",
 "act": "ACT I · INDUCTION",
 "intro": "Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal.",
 "tiles": [
  {
   "id": "A1",
   "n": 1,
   "title": "The welcome wall",
   "task": {
    "kind": "any"
   },
   "tale": "Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud.",
   "prototype9": {
    "road": "Start, west edge. The road passes under the Z1 highway (north–south) at 90°; escalators",
    "setPiece": "LED-wall tower facing the entry",
    "builtFor": "any",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "setback",
      "deck",
      "rail",
      "tall",
      "low",
      "watched"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "planter": 1,
      "kiosk": 1,
      "hedge": 1,
      "bollard": 3
     },
     "redLanes": 2,
     "roadOnScreen": [
      800,
      800
     ],
     "deckOverRoad": true,
     "stairs": 2,
     "roadsidePlanters": 1,
     "planterRowsThatFit": 2,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 4
    }
   }
  },
  {
   "id": "B1",
   "n": 2,
   "title": "The podium bridge",
   "task": {
    "kind": "dash"
   },
   "tale": "Battery 1 is fitted. The skybridge was built for shoppers who never came; staff watch you dash into a colleague.",
   "prototype9": {
    "road": "A Z1 skybridge crosses the road at 90°, from a podium roof to the walkway ring",
    "setPiece": "Podium and tower at the bridge head",
    "builtFor": "dash",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "deck",
      "rail",
      "tall",
      "low",
      "watched"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "planter": 1,
      "kiosk": 1,
      "hedge": 1,
      "billboard": 1
     },
     "redLanes": 2,
     "roadOnScreen": [
      792,
      800
     ],
     "deckOverRoad": true,
     "stairs": 1,
     "roadsidePlanters": 0,
     "planterRowsThatFit": 2,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 3
    }
   }
  },
  {
   "id": "C1",
   "n": 3,
   "title": "The LED drum",
   "task": {
    "kind": "drop"
   },
   "tale": "The LED drum lights each bend. Step off the high road onto a car: gravity is company policy.",
   "prototype9": {
    "road": "Under the Z2 highway at 90°, then an R96 bend south; Z2 escalators (run 112)",
    "setPiece": "LED drum tower in the bend",
    "builtFor": "drop",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "setback",
      "deck",
      "rail",
      "tall",
      "low",
      "watched"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "planter": 1,
      "kiosk": 1,
      "hedge": 1,
      "billboard": 1,
      "bollard": 3
     },
     "redLanes": 2,
     "roadOnScreen": [
      872,
      960
     ],
     "deckOverRoad": true,
     "stairs": 2,
     "roadsidePlanters": 0,
     "planterRowsThatFit": 2,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 2
    }
   }
  },
  {
   "id": "C2",
   "n": 4,
   "title": "The portal tower",
   "task": {
    "kind": "level"
   },
   "tale": "The road runs through the portal tower at the sixth floor. Take your write-off up there; ignore the view.",
   "prototype9": {
    "road": "A 45° corner cut, then under the Z2 highway at 90°. The highway runs through a tower; a roof plaza at Z2 opens off its parapet, and an escalator drops from the plaza to the street",
    "setPiece": "Portal tower and roof plaza (Chongqing)",
    "builtFor": "level",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "deck",
      "tall",
      "low",
      "watched"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "planter": 1,
      "kiosk": 1,
      "hedge": 1
     },
     "redLanes": 2,
     "roadOnScreen": [
      840,
      928
     ],
     "deckOverRoad": true,
     "stairs": 2,
     "roadsidePlanters": 0,
     "planterRowsThatFit": 2,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 2
    }
   }
  },
  {
   "id": "B2",
   "n": 5,
   "title": "The monument",
   "task": {
    "kind": "struck"
   },
   "tale": "The plaque reads ZERO ACCIDENTS: a target, not a record. Stand near it until a colleague finds you.",
   "prototype9": {
    "road": "The road splits round the monument\\'s island; the walkway ring bridges both lanes at Z1; skybridge north",
    "setPiece": "The monument",
    "builtFor": "struck",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "setback",
      "deck",
      "tall",
      "low"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "kiosk": 1
     },
     "redLanes": 2,
     "roadOnScreen": [
      840,
      840
     ],
     "deckOverRoad": true,
     "stairs": 4,
     "roadsidePlanters": 1,
     "planterRowsThatFit": 1,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 14
    }
   }
  },
  {
   "id": "A2",
   "n": 6,
   "title": "The neon shops",
   "task": {
    "kind": "cone"
   },
   "tale": "The neon shops sell nothing, but the traffic reads them. Hands 1 is fitted: bait a colleague with a cone.",
   "prototype9": {
    "road": "Under the Z1 highway at 90°, then an R96 bend south",
    "setPiece": "Neon arcade along the road",
    "builtFor": "cone",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "setback",
      "deck",
      "rail",
      "tall",
      "low",
      "watched"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "planter": 1,
      "kiosk": 1,
      "bollard": 3
     },
     "redLanes": 2,
     "roadOnScreen": [
      880,
      784
     ],
     "deckOverRoad": true,
     "stairs": 2,
     "roadsidePlanters": 0,
     "planterRowsThatFit": 2,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 5
    }
   }
  },
  {
   "id": "A3",
   "n": 7,
   "title": "The stacked cubes",
   "task": {
    "kind": "combo",
    "param": "story.task.comboEasy"
   },
   "tale": "The stacked cubes rose one budget at a time. Build the same way: one hit, then another, quickly.",
   "prototype9": {
    "road": "A 45° corner cut, then under the Z1 highway at 90°",
    "setPiece": "Stacked LED cubes, each cantilevered off the one below",
    "builtFor": "combo",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "setback",
      "deck",
      "tall",
      "low",
      "watched"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "planter": 1,
      "kiosk": 1,
      "hedge": 1,
      "billboard": 1,
      "bollard": 3
     },
     "redLanes": 2,
     "roadOnScreen": [
      848,
      760
     ],
     "deckOverRoad": true,
     "stairs": 2,
     "roadsidePlanters": 1,
     "planterRowsThatFit": 2,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 4
    }
   }
  },
  {
   "id": "B3",
   "n": 8,
   "title": "The LED canyon",
   "task": {
    "kind": "jump"
   },
   "tale": "Two screens advertise to each other all night. Legs 1 is fitted: jump into a car between them.",
   "prototype9": {
    "road": "A 45° jog between two LED walls; a Z1 skybridge crosses the jog at 90°",
    "setPiece": "LED canyon and its skybridge",
    "builtFor": "jump",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "setback",
      "deck",
      "rail",
      "tall",
      "low",
      "watched"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "planter": 1,
      "kiosk": 1,
      "hedge": 1,
      "billboard": 1,
      "bollard": 3
     },
     "redLanes": 2,
     "roadOnScreen": [
      848,
      848
     ],
     "deckOverRoad": true,
     "stairs": 1,
     "roadsidePlanters": 0,
     "planterRowsThatFit": 2,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 5
    }
   }
  },
  {
   "id": "C3",
   "n": 9,
   "title": "The LED gateway",
   "task": {
    "kind": "bounce"
   },
   "tale": "The gateway thanked the car that wrote you off for driving safely. Let one colleague throw you into the next.",
   "prototype9": {
    "road": "Under the Z2 highway at 90°; the exit through an LED gateway",
    "setPiece": "LED gateway arch over the road",
    "builtFor": "bounce",
    "measured": {
     "levelsThatFit": [
      "open",
      "cones",
      "kerb",
      "deck",
      "rail",
      "tall",
      "low",
      "watched"
     ],
     "roadsideCover": {
      "cabinet": 1,
      "planter": 1,
      "kiosk": 1,
      "hedge": 1,
      "bollard": 3
     },
     "redLanes": 2,
     "roadOnScreen": [
      800,
      800
     ],
     "deckOverRoad": true,
     "stairs": 2,
     "roadsidePlanters": 0,
     "planterRowsThatFit": 2,
     "plantersForAnAmbush": true,
     "tallCoverByRoad": 1
    }
   }
  }
 ],
 "taskLabels": {
  "any": "ANY WRITE-OFF",
  "dash": "DASH INTO A CAR",
  "drop": "DROP ONTO A CAR",
  "jump": "JUMP INTO A CAR",
  "level": "ON A RAISED ROAD",
  "cone": "CONE-BAITED CAR",
  "push": "PUSH OFF A CAR",
  "bounce": "THROWN INTO A CAR",
  "struck": "STRUCK, NOT DASHING",
  "combo": "COMBO ×{n}",
  "cls": "A {cls}"
 },
 "controls": "Arrows or WASD move. Parts, once earned (PROGRESSION): Space dash (Battery 1); L jump (Legs 1); hold C duck (Super Knees); J picks up and puts down a cone (Hands 1). Walk off a deck through a gap in its parapet to drop."
}
```

## REGISTRY
```json
[
 {
  "id": "perception.reactionDelay",
  "label": "Reaction delay",
  "unit": "s",
  "default": 0.3,
  "min": 0,
  "max": null,
  "about": "Vehicle sensing response delay."
 },
 {
  "id": "perception.sideRadius",
  "label": "Side-sensor reach",
  "unit": "px",
  "default": 100,
  "min": 0,
  "max": null,
  "about": "Short side sensors at the nose."
 },
 {
  "id": "perception.sideNoticeSeconds",
  "label": "Side notice time",
  "unit": "s",
  "default": 0.6,
  "min": 0,
  "max": 5,
  "about": "Rung 2's side sensors notice a dummy in the driver's field (proto.driver.cautionZone either side of its path) after it has stayed there this long. Weaker than t"
 },
 {
  "id": "perception.sideCloseRange",
  "label": "Side field: close range",
  "unit": "px",
  "default": 0,
  "min": 0,
  "max": 720,
  "about": "Rung 2 up: a dummy in the field within this distance of the car's nose (beside it, its gap from the flank) is CLOSE: about the dash's reach. The car slows to pe"
 },
 {
  "id": "perception.sideWaryRange",
  "label": "Side field: wary range",
  "unit": "px",
  "default": 0,
  "min": 0,
  "max": 720,
  "about": "Rung 2 up: a dummy in the field beyond perception.sideCloseRange but within this distance of the car's nose is WARY: the car slows to perception.sideWarySpeed; "
 },
 {
  "id": "perception.sideAwareSpeed",
  "label": "Side field: aware speed",
  "unit": "fraction",
  "default": 1,
  "min": 0,
  "max": 1,
  "about": "Rung 2 up, staged: AWARE (in the field, beyond perception.sideWaryRange), the car's speed is capped at this share of its cruise. 10.8 sets 0.85"
 },
 {
  "id": "perception.sideWarySpeed",
  "label": "Side field: wary speed",
  "unit": "fraction",
  "default": 1,
  "min": 0,
  "max": 1,
  "about": "Rung 2 up, staged: WARY, the car's speed is capped at this share of its cruise. 10.8 sets 0.6"
 },
 {
  "id": "perception.sideCloseSpeed",
  "label": "Side field: close speed",
  "unit": "fraction",
  "default": 1,
  "min": 0,
  "max": 1,
  "about": "Rung 2 up, staged: CLOSE, the car's speed is capped at this share of its cruise, until it notices the dummy and stops. 10.8 sets 0.35"
 },
 {
  "id": "perception.sideAwareNoticeRate",
  "label": "Side field: aware notice rate",
  "unit": "fraction",
  "default": 1,
  "min": 0,
  "max": 1,
  "about": "Rung 2 up, staged: AWARE, the notice meter fills at this share of its speed: noticed after perception.sideNoticeSeconds divided by it. 0: aware, but it never no"
 },
 {
  "id": "perception.sideWaryNoticeRate",
  "label": "Side field: wary notice rate",
  "unit": "fraction",
  "default": 1,
  "min": 0,
  "max": 1,
  "about": "Rung 2 up, staged: WARY, the notice meter fills at this share of its speed: noticed after perception.sideNoticeSeconds divided by it. 10.8 sets 1 (a slower WARY"
 },
 {
  "id": "vehicles.sedan.cruiseSpeed",
  "label": "Sedan cruise speed",
  "unit": "px/s",
  "default": 138,
  "min": 0,
  "max": null,
  "about": "Nominal class cruise speed; changing this is not changing the fixed damage-reference speed."
 },
 {
  "id": "perception.forwardLength",
  "label": "Forward beam length",
  "unit": "world units",
  "default": 320,
  "min": 0,
  "max": 2000,
  "about": "A car's forward beam: a rectangle from the nose along its heading. The P1.7 driver override sets 560 in every prototype sim"
 },
 {
  "id": "perception.sideHalfAngle",
  "label": "Side arcs half-angle",
  "unit": "degrees",
  "default": 80,
  "min": 0,
  "max": 180,
  "about": "Half-angle of the drawn side arcs (with perception.sideRadius). Since P1.7 they drive nothing; the driver's field (proto.driver.cautionZone) slows the car (row "
 },
 {
  "id": "duel.enabled",
  "label": "The test road",
  "unit": "flag",
  "default": 0,
  "min": 0,
  "max": 1,
  "about": "1: the Monument test road (prototypes/p10/testroad.js): scenario A, one sedan type, the red car alone on the road. Prototype 10 sets 1"
 },
 {
  "id": "duel.carsOnRoad",
  "label": "Cars on the test road",
  "unit": "count",
  "default": 1,
  "min": 1,
  "max": 20,
  "about": "Most cars on the test road at once. 10.1 to 10.7: the red car alone"
 },
 {
  "id": "duel.redReturnSeconds",
  "label": "Red car return",
  "unit": "s",
  "default": 4,
  "min": 0,
  "max": 60,
  "about": "Seconds between the red car leaving the screen and its next appearance (V29: models return soon enough to see them adapt)"
 },
 {
  "id": "duel.startRung",
  "label": "Red car start rung",
  "unit": "rung",
  "default": 0,
  "min": 0,
  "max": 6,
  "about": "The red car's rung at the start. 0: it senses and learns nothing (10.1). Each lesson teaches the next rung (handover v2 §12, §14.2)"
 },
 {
  "id": "duel.topRung",
  "label": "Highest rung taught",
  "unit": "rung",
  "default": 0,
  "min": 0,
  "max": 6,
  "about": "The highest rung a lesson can teach in this build. 10.1: 0, no lessons. 10.2: 1, the forward camera: a hit on its nose teaches it"
 },
 {
  "id": "duel.standstillSpeed",
  "label": "Standstill speed",
  "unit": "world units/s",
  "default": 0,
  "min": 0,
  "max": 60,
  "about": "A car slower than this is at a standstill. A dash or a walk into it does no damage and teaches nothing: it passed its test. 0: off (10.1). 10.2 sets 5, the thre"
 },
 {
  "id": "duel.dashArrives",
  "label": "Dash arrives",
  "unit": "enum",
  "default": 0,
  "min": 0,
  "max": 3,
  "about": "When Battery 1, the dash, arrives by drone on the test road. 0: never; on foot (10.1). 1: as the rung-1 lesson ends. 2: the first time the learning car brakes f"
 },
 {
  "id": "duel.jumpArrives",
  "label": "Jump arrives",
  "unit": "enum",
  "default": 0,
  "min": 0,
  "max": 3,
  "about": "When Legs 1, the jump, arrives by drone on the test road. 0: never. 1: as the rung-2 lesson ends. 2: the first time the learning car swerves away from the dummy"
 },
 {
  "id": "duel.conesArrives",
  "label": "Cones arrive",
  "unit": "enum",
  "default": 0,
  "min": 0,
  "max": 3,
  "about": "When Hands 1, the cones, arrive by drone on the test road. 0: never. 1: as the rung-4 lesson ends. 2: the first time the learning car stops for a dummy only its"
 },
 {
  "id": "duel.duckArrives",
  "label": "Duck arrives",
  "unit": "enum",
  "default": 0,
  "min": 0,
  "max": 3,
  "about": "When DUCK arrives by drone on the test road. 0: never. 1: as the rung-5 lesson ends. 2: the first time the learning car stops at a cone instead of swerving (the"
 },
 {
  "id": "duel.planters",
  "label": "Planters by the road",
  "unit": "flag",
  "default": 0,
  "min": 0,
  "max": 1,
  "about": "Low planter rows by the test road: 0 none; 1 three rows (north of road A, west; south of road A, east; east of road B, south). Five planters to a row (world.gar"
 },
 {
  "id": "perception.duckNoticeFactor",
  "label": "Ducked notice",
  "unit": "ratio",
  "default": 1.5,
  "min": 1,
  "max": 4,
  "about": "DUCK: the driver's field takes this many times perception.sideNoticeSeconds to notice a ducked dummy (stealth games: awareness fills slower crouched)"
 },
 {
  "id": "perception.sensorHeight",
  "label": "Sensor height",
  "unit": "world units",
  "default": 14,
  "min": 1,
  "max": 40,
  "about": "Rungs 1–2: the height of the learning car's camera and side sensors. Sightlines over low cover start here"
 },
 {
  "id": "perception.lidarHeight",
  "label": "Lidar height",
  "unit": "world units",
  "default": 26,
  "min": 1,
  "max": 60,
  "about": "Rung 3 and up: the roof lidar's height, above the roof (vehicles.sedan.height). It sees over low cover sooner"
 },
 {
  "id": "perception.streetCameraHeight",
  "label": "Street camera height",
  "unit": "world units",
  "default": 60,
  "min": 10,
  "max": 200,
  "about": "Rung 4 and up: the street cameras' height on their posts. Sightlines over low cover start here"
 },
 {
  "id": "perception.streetCameraRange",
  "label": "Street camera range",
  "unit": "world units",
  "default": 0,
  "min": 0,
  "max": 1000,
  "about": "Rung 4 and up: a street camera sees a dummy within this of its post. 0: the whole screen (10.5). 10.6 sets 180: the barrier and the building corner, which they "
 },
 {
  "id": "perception.streetCameraFov",
  "label": "Street camera field of view",
  "unit": "degrees",
  "default": 360,
  "min": 10,
  "max": 360,
  "about": "Rung 4 and up: a street camera sees only within this angle, centred on its aim along the cover it was put up for. 360: all round (10.5–10.7). 10.8 sets 60"
 },
 {
  "id": "perception.streetCameraPanArc",
  "label": "Street camera pan arc",
  "unit": "degrees",
  "default": 0,
  "min": 0,
  "max": 180,
  "about": "Rung 4 and up: the arc a street camera's aim sweeps across, centred on its aim, as Metal Gear Solid's cameras pan. 0: fixed (10.5–10.7). 10.8 sets 60"
 },
 {
  "id": "perception.streetCameraPanSeconds",
  "label": "Street camera pan time",
  "unit": "seconds",
  "default": 3,
  "min": 0.5,
  "max": 20,
  "about": "Seconds a panning street camera takes to sweep from one end of perception.streetCameraPanArc to the other, at a steady rate. 10.8 sets 3"
 },
 {
  "id": "perception.streetCameraPanHold",
  "label": "Street camera pan hold",
  "unit": "seconds",
  "default": 1,
  "min": 0,
  "max": 10,
  "about": "Seconds a panning street camera rests at each end of its sweep. 10.8 sets 1"
 },
 {
  "id": "duel.lessonClipSeconds",
  "label": "Lesson clip",
  "unit": "s",
  "default": 3,
  "min": 0.5,
  "max": 10,
  "about": "Beat 1 of a lesson: the seconds before the hit, replayed as the car's training clip. The sim waits meanwhile. Also what the clip must show (rows 685, 687): rung"
 },
 {
  "id": "duel.lessonHoldSeconds",
  "label": "Lesson hold",
  "unit": "s",
  "default": 0.8,
  "min": 0,
  "max": 5,
  "about": "Beat 1 ends on the hit: the frame of impact holds this long, boxed as the car's vision would mark it"
 },
 {
  "id": "duel.lessonFitSeconds",
  "label": "Lesson fitting",
  "unit": "s",
  "default": 2,
  "min": 0.5,
  "max": 10,
  "about": "Beat 2 of a lesson: the new sensor fitted on screen, after the clip. Then play resumes and the car drives back in"
 },
 {
  "id": "duel.runInLength",
  "label": "Run-in length",
  "unit": "world units",
  "default": 0,
  "min": 0,
  "max": 2000,
  "about": "How far before the screen's edge the red car appears on the test road. 0: the forward beam plus a car length (10.2–10.6, row 670). Above 0, the car appears at t"
 },
 {
  "id": "duel.memoryRadius",
  "label": "Crash memory radius",
  "unit": "world units",
  "default": 0,
  "min": 0,
  "max": 400,
  "about": "Rung 6: a crash's spring spot covers this radius. A hit sprung within it of an earlier crash's spot teaches rung 6; at rung 6 a dummy within it of a remembered "
 },
 {
  "id": "duel.memorySites",
  "label": "Crash memory sites",
  "unit": "count",
  "default": 0,
  "min": 0,
  "max": 100,
  "about": "Rung 6: how many crash spots the car remembers, the latest first. 0: every crash. An older spot falls out of memory (counters are capped and can fall back; hand"
 },
 {
  "id": "duel.blockSeconds",
  "label": "Block lift",
  "unit": "seconds",
  "default": 0,
  "min": 0,
  "max": 120,
  "about": "A car kept waiting for the dummy (in its path, or noticed in its field) this long calls FARSIGHT: a drone lifts the dummy to the side of the road, holds it unti"
 },
 {
  "id": "duel.searchRadius",
  "label": "Search radius",
  "unit": "world units",
  "default": 0,
  "min": 0,
  "max": 400,
  "about": "Rung 7: a dummy within this of the ghost (where the car last had it, before cover took it away) is found: cover does not hide it and the field notices it at onc"
 },
 {
  "id": "duel.searchSeconds",
  "label": "Search time",
  "unit": "seconds",
  "default": 0,
  "min": 0,
  "max": 60,
  "about": "Rung 7: how long the car searches after it loses the dummy behind cover. It slows to stop short of the ghost meanwhile; then it gives up and drives on. 0: no se"
 },
 {
  "id": "perception.forwardConeAngle",
  "label": "Field: forward cone half-angle",
  "unit": "degrees",
  "default": 0,
  "min": 0,
  "max": 60,
  "about": "Rung 2 up: the driver's field is three cones, not a rectangle. The forward cone runs from the nose, this many degrees either side of the heading, out to percept"
 },
 {
  "id": "perception.sideConeAxis",
  "label": "Field: side cone axis",
  "unit": "degrees",
  "default": 60,
  "min": 0,
  "max": 180,
  "about": "Coned field: each side cone's centre line, this many degrees off the heading, from the nose (row 733; row 731 measured from the centre). A side cone begins no n"
 },
 {
  "id": "perception.sideConeAngle",
  "label": "Field: side cone half-angle",
  "unit": "degrees",
  "default": 45,
  "min": 0,
  "max": 90,
  "about": "Coned field: each side cone spans this many degrees either side of perception.sideConeAxis, clipped at the forward cone's edge. 10.8 sets 45: 30° to 120° off th"
 },
 {
  "id": "perception.sideConeRange",
  "label": "Field: side cone range",
  "unit": "px",
  "default": 220,
  "min": 0,
  "max": 720,
  "about": "Coned field: each side cone reaches this far from the nose (plus body.radius; row 733). 10.8 sets 240 (220 in row 731)"
 },
 {
  "id": "perception.forwardConeSensitivity",
  "label": "Field: forward cone sensitivity",
  "unit": "fraction",
  "default": 1,
  "min": 0.05,
  "max": 1,
  "about": "Coned field: the forward cone's sensitivity. It scales the stage ranges (perception.sideCloseRange, perception.sideWaryRange) and the notice meter's fill rate. "
 },
 {
  "id": "perception.sideConeSensitivity",
  "label": "Field: side cone sensitivity",
  "unit": "fraction",
  "default": 1,
  "min": 0.05,
  "max": 1,
  "about": "Coned field: each side cone's sensitivity. A dummy must come this much closer for each stage; the notice meter fills this much slower. 10.8 sets 0.5"
 },
 {
  "id": "ui.lungeGuide",
  "label": "Lunge guide",
  "unit": "flag",
  "default": 0,
  "min": 0,
  "max": 1,
  "about": "1: while a car is near, a dotted line and a reticle show where a dash pressed now would land. Yellow with HIT when it meets the red car on its predicted path; w"
 },
 {
  "id": "perception.trackSeconds",
  "label": "Field: tracking after notice",
  "unit": "seconds",
  "default": 0,
  "min": 0,
  "max": 30,
  "about": "Coned field: a dummy the car has noticed and then lost from its cones and path stays tracked this long (inside the rung's rectangle), then is forgotten: the not"
 },
 {
  "id": "duel.twoWay",
  "label": "Two-way roads",
  "unit": "flag",
  "default": 0,
  "min": 0,
  "max": 1,
  "about": "1: the junction's two roads carry traffic both ways, on the left (London): road A eastbound in its north lane, westbound in its south lane; road B southbound in"
 },
 {
  "id": "duel.whiteInterval",
  "label": "White traffic interval",
  "unit": "seconds",
  "default": 0,
  "min": 0,
  "max": 30,
  "about": "Seconds between white sedans entering, on average (each 60–140% of it), on a lane chosen by the golden ratio. White sedans never learn: they brake for what is i"
 },
 {
  "id": "traffic.junctionLookahead",
  "label": "Give way: lookahead",
  "unit": "px",
  "default": 0,
  "min": 0,
  "max": 1000,
  "about": "Two-way roads: a car decides at the junction from this far before the box, before it is too close to stop gently (row 735; row 734: road B held while road A was"
 },
 {
  "id": "perception.coneRadius",
  "label": "Field: radius",
  "unit": "px",
  "default": 0,
  "min": 0,
  "max": 720,
  "about": "Rung 2 up, coned: the proportional field (row 735). The forward cone reaches this far from the car's middle; the side cones perception.sideConeRatio of it. 0: t"
 },
 {
  "id": "perception.sideConeRatio",
  "label": "Field: side reach",
  "unit": "fraction",
  "default": 0.8,
  "min": 0.1,
  "max": 1,
  "about": "Proportional field: each side cone reaches this fraction of perception.coneRadius. 10.9 sets 0.8"
 },
 {
  "id": "perception.forwardGrades",
  "label": "Field: forward grades",
  "unit": "count",
  "default": 3,
  "min": 1,
  "max": 3,
  "about": "Proportional field: equal rings split the forward cone into this many grades, outermost AWARE, then SLOWING, then CRAWLING. 10.9 sets 3"
 },
 {
  "id": "perception.sideGrades",
  "label": "Field: side grades",
  "unit": "count",
  "default": 2,
  "min": 1,
  "max": 3,
  "about": "Proportional field: equal rings split each side cone into this many grades, outermost AWARE, then SLOWING. 10.9 sets 2"
 },
 {
  "id": "perception.coneGrowthPerMemory",
  "label": "Field: growth per memory",
  "unit": "fraction",
  "default": 0,
  "min": 0,
  "max": 0.5,
  "about": "Proportional field: the radius grows by this fraction for each crash spot the car remembers (duel.memorySites), up to perception.coneGrowthMax: the field is par"
 },
 {
  "id": "perception.coneGrowthMax",
  "label": "Field: growth cap",
  "unit": "fraction",
  "default": 0,
  "min": 0,
  "max": 1,
  "about": "Proportional field: the most the radius grows, as a fraction. 10.9 sets 0.2 (320 to 384: 60% of the screen)"
 },
 {
  "id": "traffic.junctionGap",
  "label": "Give way: gap",
  "unit": "seconds",
  "default": 0,
  "min": 0,
  "max": 10,
  "about": "Two-way roads: a road B car gives way while a road A car would reach the junction box within this many seconds; any car waits while a crossing car is in the box"
 },
 {
  "id": "traffic.whiteTimeGap",
  "label": "White traffic: time gap",
  "unit": "seconds",
  "default": 0,
  "min": 0,
  "max": 5,
  "about": "White sedans follow the car ahead at this time gap instead of traffic.timeGap: they tailgate. 0: traffic.timeGap. 10.10 sets 0.5"
 },
 {
  "id": "traffic.whiteBraking",
  "label": "White traffic: braking",
  "unit": "px/s²",
  "default": 0,
  "min": 0,
  "max": 400,
  "about": "White sedans brake no harder than this (traffic.hardBraking is the red car's). 0: no limit. 10.10 sets 45"
 },
 {
  "id": "scoring.incidentPoints",
  "label": "Incident points",
  "unit": "points",
  "default": 0,
  "min": 0,
  "max": 5000,
  "about": "A white sedan runs into the back of the red car (it stopped hard; the white car could not): an Incident, worth this. 0: off. 10.10 sets 250"
 },
 {
  "id": "traffic.incidentSeconds",
  "label": "Incident: standstill",
  "unit": "seconds",
  "default": 0,
  "min": 0,
  "max": 10,
  "about": "After an Incident the two cars stand this long, then drive on. 10.10 sets 2"
 },
 {
  "id": "traffic.whiteSpeedRatio",
  "label": "White traffic: speed",
  "unit": "ratio",
  "default": 0,
  "min": 0,
  "max": 2,
  "about": "White sedans cruise at this multiple of their cruise speed: they close on the red car and sit at traffic.whiteTimeGap behind it. 0: their cruise speed. 10.10 se"
 }
]
```

## PROGRESSION
```json
{
 "about": "Lawrence (7 Nov, 18:06): each tile progresses one thing. CAR (it learns), PLAYER (a part earned) and LEVEL (what the tile offers) interplay; every upgrade is used on the next tile. The engine reads parts and levels; the pipeline's validator reads all of it.",
 "rungs": [
  "Prototype",
  "Forward camera",
  "Side sensors",
  "Roof lidar",
  "Street cameras",
  "Road items",
  "Crash memory",
  "Search"
 ],
 "parts": {
  "battery1": {
   "name": "Battery 1",
   "verb": "DASH",
   "key": "Space",
   "p9": "battery1",
   "text": "Dash: Space. Reach a car's path from cover set back from the road."
  },
  "legs1": {
   "name": "Legs 1",
   "verb": "JUMP",
   "key": "L",
   "p9": "legs1",
   "text": "Jump: L. A dash-jump clears a K-rail."
  },
  "knees1": {
   "name": "Super Knees",
   "verb": "DUCK",
   "key": "hold C",
   "p9": null,
   "text": "Duck: hold C. Low cover hides you from its sensors."
  },
  "hands1": {
   "name": "Hands 1",
   "verb": "CONES",
   "key": "J",
   "p9": "hands1",
   "text": "Cones: J picks one up; hold J to put it down."
  }
 },
 "levels": {
  "open": {
   "text": "No cover by the road.",
   "cover": []
  },
  "kerb": {
   "text": "Tall cover right at the kerb: hide, then step into its path.",
   "cover": [
    "cabinet",
    "kiosk",
    "billboard"
   ],
   "gap": [
    2
   ],
   "bollards": true
  },
  "setback": {
   "text": "Tall cover set back from the road: too far to walk out in time.",
   "cover": [
    "cabinet",
    "kiosk",
    "billboard"
   ],
   "gap": [
    96,
    84
   ],
   "bollards": true
  },
  "deck": {
   "text": "No cover by the road; Prototype 9's deck over it, its parapet gap above the lane.",
   "cover": []
  },
  "rail": {
   "text": "A K-rail along the kerb (a dash stops at it; a jump clears it), tall cover set back behind it.",
   "cover": [
    "cabinet",
    "kiosk",
    "billboard"
   ],
   "gap": [
    96,
    84,
    72,
    60
   ],
   "rail": true
  },
  "tall": {
   "text": "Tall cover by the road.",
   "cover": [
    "cabinet",
    "kiosk",
    "billboard"
   ],
   "gap": [
    2,
    42
   ],
   "bollards": true
  },
  "low": {
   "text": "Low cover only: planters and hedges. Standing, it sees you over them.",
   "cover": [
    "planter",
    "hedge",
    "planter"
   ],
   "gap": [
    2,
    42
   ]
  },
  "watched": {
   "text": "Street cameras watch the tall cover; low cover lies out of their reach.",
   "cover": [
    "cabinet",
    "planter",
    "kiosk",
    "hedge"
   ],
   "gap": [
    2,
    42
   ],
   "cameras": true
  },
  "cones": {
   "text": "No cover by the road; cones to carry.",
   "cover": []
  }
 },
 "tricks": {
  "walkin": {
   "text": "walk into its path and let it hit you",
   "needs": [],
   "levels": [
    "open",
    "kerb",
    "setback",
    "deck",
    "rail",
    "tall",
    "low",
    "watched",
    "cones"
   ],
   "closedBy": 1
  },
  "kerbstep": {
   "text": "hide at the kerb; step into its path at the last moment",
   "needs": [],
   "levels": [
    "kerb"
   ],
   "closedBy": 2
  },
  "dashcover": {
   "text": "dash from tall cover into its path",
   "needs": [
    "battery1"
   ],
   "levels": [
    "setback",
    "tall",
    "kerb"
   ],
   "closedBy": 4
  },
  "drop": {
   "text": "drop through the deck's parapet gap into its path",
   "needs": [],
   "levels": [
    "deck"
   ],
   "closedBy": 3
  },
  "jumprail": {
   "text": "dash, then jump the K-rail into its path",
   "needs": [
    "battery1",
    "legs1"
   ],
   "levels": [
    "rail"
   ],
   "closedBy": 3
  },
  "duckdash": {
   "text": "duck behind low cover; dash into its path",
   "needs": [
    "battery1",
    "knees1"
   ],
   "levels": [
    "low",
    "watched"
   ],
   "closedBy": 6
  },
  "blindspot": {
   "text": "dash from the cover no camera sees",
   "needs": [
    "battery1"
   ],
   "levels": [
    "watched"
   ],
   "closedBy": 6
  },
  "conebait": {
   "text": "put a cone in its lane; stand where it swerves round it",
   "needs": [
    "hands1"
   ],
   "levels": [
    "cones",
    "open"
   ],
   "closedBy": 5
  }
 }
}
```

Design the nine tiles of Map 1 now.