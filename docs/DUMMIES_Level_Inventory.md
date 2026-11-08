# DUMMIES — Level inventory: tiles and level design assets

**8 November 2026 · Lawrence Lek.** Measured from Prototype 9's world (`engine/p9/world6.js`) by `engine/inventory.js`; data in `content/inventory_tiles.json`. Pictures: `docs/img/tiles_<district>.jpg` and the Monument Puzzle Atlas artifact. A tile is 800 × 640 world units (`world.width`, `world.height`).

## 1 Districts

| Map | District | Act | Mood | Prototype 9 order |
|---|---|---|---|---|
| 1 | Monument | ACT I · INDUCTION | Neon commerce, LED walls. One road snakes under two north–south highways and splits round the monument. | A1 B1 C1 C2 B2 A2 A3 B3 C3 |
| 2 | Parkland | ACT II · OPENING DAY | Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath. | C1 C2 C3 B3 A3 A2 A1 B1 B2 |
| 3 | Waterfront | ACT III · CUSTOMS | A hill walled by towers; a river below. The valley avenue meets the tunnel and the beach road at the circus; the hill's bridges cross the drive and the river. | A1 B1 C1 C2 C3 B3 A3 A2 B2 |

## 2 Monument: the nine tiles

| Tile | Plan (world6.js) | Landmark | Ground roads (lanes: from → to, turn) | Above the street | Escalators, stairs | Solids by kind | Cones | Prototype 9 task |
|---|---|---|---|---|---|---|---|---|
| A1 | Start, west edge. The road passes under the Z1 highway (north–south) at 90°; escalators | LED-wall tower facing the entry | W→E; E→W | deck Z1, 1 drop gap, 2 heads | 2 | low mass 25, wall 5, tall mass 5, column 4, booth 1, planter 1 | 2 | any |
| B1 | A Z1 skybridge crosses the road at 90°, from a podium roof to the walkway ring | Podium and tower at the bridge head | W→E; E→W | walkway Z1; roof@Z1+drop ×1 | 1 | low mass 10, tall mass 8, planter 5, wall 4, column 4 | 2 | dash (gift battery1) |
| C1 | Under the Z2 highway at 90°, then an R96 bend south; Z2 escalators (run 112) | LED drum tower in the bend | W→S 90°; S→W -90° | deck Z2, 1 drop gap, 2 heads | 2 | tall mass 17, low mass 8, wall 4, column 4, planter 1 | 2 | drop |
| A2 | Under the Z1 highway at 90°, then an R96 bend south | Neon arcade along the road | E→S -90°; S→E 90° | deck Z1, 1 drop gap, 2 heads | 2 | low mass 16, tall mass 8, column 4, wall 3, planter 3 | 2 | cone (gift hands1) |
| B2 | The road splits round the monument's island; the walkway ring bridges both lanes at Z1; skybridge north | The monument | W→E; E→W (splits round the island) | walkway Z1; roof@Z1+drop ×4 | 4 | low mass 27, column 10, tall mass 9, sculpture 4, planter 2, monument 1 | 2 | struck |
| C2 | A 45° corner cut, then under the Z2 highway at 90°. The highway runs through a tower; a roof plaza at Z2 opens off its parapet, and an escalator drops from the plaza to the street | Portal tower and roof plaza (Chongqing) | N→W 90°; W→N -90° | deck Z2, 1 drop gap, 2 heads; roof@Z2+drop ×1 | 2 | low mass 12, tall mass 7, column 4, planter 3, wall 1 | 2 | level |
| A3 | A 45° corner cut, then under the Z1 highway at 90° | Stacked LED cubes, each cantilevered off the one below | N→E -90°; E→N 90° | deck Z1, 1 drop gap, 2 heads | 2 | low mass 36, tall mass 8, wall 4, column 4, planter 1 | 2 | combo |
| B3 | A 45° jog between two LED walls; a Z1 skybridge crosses the jog at 90° | LED canyon and its skybridge | W→E; E→W | walkway Z1; roof@Z1+drop ×2 | 1 | low mass 31, tall mass 9, planter 4, column 2, wall 1 | 2 | jump (gift legs1) |
| C3 | Under the Z2 highway at 90°; the exit through an LED gateway | LED gateway arch over the road | W→E; E→W | deck Z2, 1 drop gap, 2 heads | 2 | low mass 21, tall mass 6, column 4, planter 3, wall 3, booth 1 | 2 | bounce |

## 3 Parkland: the nine tiles

| Tile | Plan (world6.js) | Landmark | Ground roads (lanes: from → to, turn) | Above the street | Escalators, stairs | Solids by kind | Cones | Prototype 9 task |
|---|---|---|---|---|---|---|---|---|
| A1 | Start, top edge. The 45° boulevard; the avenue curves to join it at 90° and gives way. The Z1 walkway from B1 lands by escalator | Reservoir terraces: three stepped pools | — | walkway Z1 | 1 | low mass 18, tall mass 17, wall 3, sculpture 2, booth 1, column 1 | 2 | push (gift arms2) |
| B1 | The Z1 highway runs north–south; escalators west (north end) and east (south end). A Z1 walkway crosses the garden and joins the highway at both parapets. The boulevard cuts the corner | Cascade: water steps beside the highway | W→S; S→W | deck Z1, 4 heads; walkway Z1 | 2 | tall mass 58, low mass 33, column 13, sculpture 2, wall 1 | 1 | level |
| C1 | The avenue under a Z1 footbridge that runs west to the B1 highway; escalator at its east end; drop onto cars | Lantern pavilion | S→N; N→S | walkway Z1 | 1 | low mass 54, tall mass 30, wall 3, sculpture 3, column 2, booth 1 | 2 | push (gift arms1) |
| A2 | The avenue passes under the Z1 highway at 90°; escalators north (west end) and south (east end) | Canal along the highway | N→S; S→N | deck Z1, 1 drop gap, 2 heads | 2 | tall mass 37, low mass 16, column 4, sculpture 3, wall 1 | 2 | cone (gift hands2) |
| B2 | Four-arm Z1 roundabout (W, N, E, S). Give way to the ring; the inner lane is the orbit lane. The boulevard passes beneath, through the hole | Reflecting pools under the ring | N→S; S→N | ring Z1, 2 heads | 2 | tall mass 30, column 5 | 2 | combo (gift battery2) |
| C2 | The avenue comes up from the C3 roundabout at 45°, turns 90° and passes under the Z1 highway at 45° | Amphitheatre terraces | S→N -39°; N→S 45° | deck Z1, 1 drop gap, 2 heads | 2 | tall mass 28, low mass 9, sculpture 2, column 2, wall 1 | 2 | cls |
| A3 | A wide R160 bend (buses may use it) | Belvedere: four tiers and a stair up to a lawn, the monolith orchard on top | N→E -90°; E→N 90° | roof@Z1 ×1 | 1 | low mass 86, tall mass 51, wall 2, sculpture 1 | 2 | jump (gift legs2) |
| B3 | The garden street passes under the Z1 highway at 90°; escalators | Sculpture court: a large obelisk, two rings, a row of lit bollards | N→E; E→N; W→E; E→W | deck Z1, 1 drop gap, 2 heads | 2 | tall mass 13, low mass 8, column 7, sculpture 4, wall 1 | 2 | cls |
| C3 | Street roundabout where the street meets the boulevard: four arms at 90°, the street turning west outside it | Sculpture court at grade: a large arch, two medium pieces, a row of lit bollards | — | — | 0 | low mass 16, tall mass 7, wall 3, sculpture 3, booth 1 | 2 | combo |

## 4 Waterfront: the nine tiles

| Tile | Plan (world6.js) | Landmark | Ground roads (lanes: from → to, turn) | Above the street | Escalators, stairs | Solids by kind | Cones | Prototype 9 task |
|---|---|---|---|---|---|---|---|---|
| A1 | Upper town. The ridge road runs between the edge wall and hill blocks. The west bridge leaves at a T, under a portal block | Portal block over the bridge | — | hill@Z1+drop ×1 | 0 |  | 0 | cls |
| B1 | The valley road enters the tunnel at the cove head. The ridge road runs over it on the hilltop. Stairs climb both cove walls | Tunnel portal in the cove head | S→N; N→S | hill@Z1+drop ×1 | 2 | portal 2 | 2 | jump (gift legs3) |
| C1 | Upper town. The east bridge leaves at a T, under a portal block | Portal block over the bridge | — | hill@Z1+drop ×1 | 0 |  | 0 | cls |
| A2 | Start, west edge. Cliff, avenue, beach. A walkway leaves the cliff top over the avenue to a beach terrace | Beach terrace: deck, canopy, stair to the sand | W→E; E→W | deck Z1, 2 drop gap, 4 heads; walkway Z1; hill@Z1+drop ×1, terrace@Z1+drop ×1 | 4 | low mass 5, column 4, wall 2, booth 1, tall mass 1, planter 1 | 2 | cone |
| B2 | The circus between the cove and the beach. Tunnel road north; beach road south. A beach park either side | Plinth and lit slab; obelisk and arch on the sand | — | hill@Z1+drop ×1 | 2 | low mass 30, tall mass 12, planter 4, sculpture 3 | 2 | combo (gift battery3) |
| C2 | Cliff, avenue, beach. The cliff-top walkway and the bridge cross the avenue. Exit east | Beach terrace | W→E; E→W | deck Z1, 2 drop gap, 4 heads; walkway Z1; hill@Z1+drop ×1, terrace@Z1+drop ×1 | 4 | low mass 5, column 4, wall 2, planter 1, tall mass 1, booth 1 | 2 | drop |
| A3 | The drive on the seawall. The west bridge crosses it and the river. A walkway joins a pier tower | Pier tower | W→E 45°; E→W -45° | deck Z1, 4 drop gap, 3 heads; walkway Z1; hill@Z1+drop ×1, roof@Z1+drop ×1 | 2 | column 5, wall 2, booth 1 | 2 | level |
| B3 | The beach road meets the drive at a T. Stairs climb to two landings; walkways cross the drive to stilt houses | River stilt houses | — | walkway Z1; hill@Z1+drop ×1, terrace@Z1+drop ×2, roof@Z1+drop ×2 | 2 | tall mass 14, low mass 10 | 2 | push (gift arms3) |
| C3 | The drive swings inland under the east bridge and leaves east. A walkway joins a pier tower | Pier tower | W→E 45°; E→W -45° | deck Z1, 4 drop gap, 3 heads; walkway Z1; hill@Z1+drop ×1, roof@Z1+drop ×1 | 2 | column 5, wall 2, booth 1 | 2 | bounce |

## 5 Level design assets

### 5.1 Architecture (Prototype 9)

| Asset | Where | What it does in a puzzle |
|---|---|---|
| Z1 highway (deck, 160 wide: `world.deckWidth`) | Monument A1, A2, A3; Parkland B1, A2, C2, B3; Waterfront A2, C2, A3, C3 | Traffic above; escalators up; one parapet drop gap where the road below crosses (`world.deckDropGaps` 1) |
| Z2 highway | Monument C1, C2, C3 | As Z1, higher: a longer fall (`world.dropSeconds` × √height) |
| Parapet drop gap | Every Monument deck tile, on the east parapet over the road | Drop onto a car below. Works at rungs 2 and 3 (measured) |
| Escalators | 2 on each deck tile; 1–4 on skybridge tiles | The way up to a deck, walkway or roof |
| Skybridge, walkway | Monument B1, B3; B2 (the ring); Parkland A1, B1, C1 | A walk above the road; no drop gaps |
| Roof floors (+drop) | Monument B1, B2 ×4, C2, B3 ×2 | Drop off a roof edge onto pavement |
| The monument and its island | Monument B2 | Tall cover between the two split lanes |
| Ring roundabout (Z1) | Parkland B2 | Four arms; give way to the ring |
| Street roundabout, junction | Parkland C3; A1 | Give-way; a natural home for a traffic light (Map 2) |
| Hill, tunnel, river, bridges | Waterfront | Drops off the hill and bridges; the river rescue (drone) |
| Buildings (blocks), booths, columns, sculptures | Every tile | Tall solids: block sight and walking |
| Low masses (`proto.art.jumpableTop`) | Terraces, cubes, pool rims | Low cover; jumpable |

### 5.2 Placed pieces (Submission 7 cover, `engine/duel.js` COVER)

| Kind | Size (w × d) | Low | Notes |
|---|---|---|---|
| planter | 120 × 16 | yes | A dash vaults it; a walk does not. Hides a ducked dummy (`props.planter.height` 14) |
| hedge | 96 × 16 | yes | As a planter, 18 high |
| cabinet | 44 × 22 | no | Tall: hides a standing dummy from the car's own sensors |
| kiosk | 30 × 20 | no | Tall, narrow |
| billboard | 64 × 12 | no | Tall, wide and thin |
| krail | 160 × 12 | yes | A dash stops at it; a jump clears it |
| bollard | 10 × 10 | yes | Posts 38 apart: wider than a dummy (`body.radius` 13) |

- Tall pieces stand north of a road running across: drawn upward, they never cover a lane.
- Street camera posts (`perception.streetCameraRange` 180): placed by a puzzle (`camera.watch`); breakable by a dash (`props.camera.breakable`, proposed).
- Cones: two homes on most tiles (`world6` coneHomes); a puzzle can move or remove them (`layout.cones`).

### 5.3 Vehicles (fleet.json)

| Class | Family | Code | Job | Behaviour | Cruise | Length × width |
|---|---|---|---|---|---|---|
| sports | Comet | SPT | Express couriers for anything late | Late commitment; tight clearance | 192 | 52 × 26 |
| wagon | Harbour | WGN | Family and care transport | Wide clearance; long prediction | 144 | 62 × 28 |
| suv | Bastion | SUV | Escort, survey and security runs | Brakes before a wide turn | 132 | 64 × 32 |
| hatchback | Pebble | HAT | Short city hops and meal runs | One signalled recommitment | 156 | 46 × 26 |
| sedan | Meridian | SED | Taxis and chauffeurs | Swerves with moderate clearance | 138 | 56 × 28 |
| police | Warden | POL | Traffic enforcement | Tracks your approach, then commits | 150 | 58 × 28 |
| van | Porter | VAN | Parcels, maintenance and lab supply | Brakes, then swerves late | 120 | 68 × 32 |
| bus | Commons | BUS | Shuttles and night lines | Only brakes; cannot swerve | 108 | 96 × 34 |

- Seniority (`fleet.seniority`): New (0 write-offs), Practised (1), Experienced (3), Senior (6).

### 5.4 The dummy (kit)

| Part | Verb | Key | Use |
|---|---|---|---|
| Battery 1 (`battery1`) | DASH | Space | Dash: Space. Reach a car's path from cover set back from the road. |
| Legs 1 (`legs1`) | JUMP | L | Jump: L. A running jump clears a K-rail. |
| Super Knees (`knees1`) | DUCK | hold C | Duck: hold C. Low cover hides you from its sensors. |
| Hands 1 (`hands1`) | CONES | J | Cones: J picks one up; hold J to put it down. |

### 5.5 The red car's rungs (Prototype 10)

| Rung | Learns | Closes | Leaves open (test road) |
|---|---|---|---|
| 0 | The Test Road | walk into its path and let it hit you | walkin 3.73, flank 2.54, aim 1.8, stand 1.27, standOff 1.27, standSouth 1.21, wander 0.93 |
| 1 | The First Lesson | walk into its path and let it hit you (it senses nothing yet) | flank 2.81, walkin 1.94, aim 1.6, wander 0.53 |
| 2 | The Side Sensors | the cut-in: wait beside its lane; dash into its path just ahead of its nose (Battery 1) | jump 2.69, plinth 2.67, gap 2.07, aim 2.0, flank 1.8, dashjump 0.47 |
| 3 | The Roof Lidar | height: drop through a gap in a deck over its road as it drives under, or jump into its path | jump 2.69, gap 2.21, aim 2.0, flank 1.8, dashjump 0.47 |
| 4 | The Street Cameras | cover: spring from behind a building, cabinet, kiosk or billboard into its path | conebait 2.0, lurk 0.8 |
| 5 | Duck | cover the cameras miss, or a cone in its lane: it swerves into you | planter 3.03, lurk 0.8 |
| 6 | Crash Memory | duck (hold C) behind a planter or hedge by its road; spring into its path | roam 6.97, lurk 0.6, flankOpen 0.4 |
| 7 | The Search | a new spot each time: roam the tile's cover | roam 2.87, lure 2.24, peekmove 1.21, flankOpen 1.07, lurk 0.8, gap 0.6 |
| 7 | The Two-Way Road | moving cover: step out from behind white traffic into its path | flankOpen 4.85, roam 2.31, lure 2.23, kerb 2.09, peekmove 1.48, jump 1.27, gap 0.93 |
| 7 | The Incident | the Incident: make it stop hard in front of a tailgater | flankOpen 5.4, kerb 2.76, lure 2.44, dashjump 2.08, roam 1.48, peekmove 1.34, jump 1.27; Incidents about 0.6 a minute |
