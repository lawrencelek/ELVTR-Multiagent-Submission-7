# Vendored sources

Copied unchanged from [ELVTR-Multiagent-Submission-6B-audio](https://github.com/lawrencelek/ELVTR-Multiagent-Submission-6B-audio) at commit `18860f1` (Prototype 10.10). `engine/build.py` patches `game_p10.js` at build time (3 lines: story mode sets the stage per tile), so these files stay byte-identical to their source.

| File | Source | Bytes | md5 |
|---|---|---|---|
| `engine/vendor/sim.js` | `prototypes/p6/sim.js` | 295,641 | `f08764a3811e91a3885ffb9aceb3e90d` |
| `engine/vendor/jump.js` | `prototypes/jump/jump.js` | 4,774 | `e45a54d5303db3a15c3d724a2a97aa14` |
| `engine/vendor/testroad.js` | `prototypes/p10/testroad.js` | 83,905 | `3b170ca24d430a002da16ddc87b9cd6b` |
| `engine/vendor/game_p10.js` | `prototypes/p10/game_p10.js` | 63,716 | `f0c8165a0a65a1d991f1fffd1c4b7c74` |
| `engine/vendor/shell.html` | `prototypes/p10/shell.html` | 725 | `405d7050b2c81af0e402f36fc4f24ee4` |
| `engine/vendor/sim_flags.json` | `prototypes/p10/sim_flags.json` | 51,371 | `39a17a130428cb1e51f692ae603bb1fe` |
| `pipeline/inputs/tuning.parameters.json` | `content/params/tuning.parameters.json` | 556,737 | `2a98f60af020d3bcf1f5102544fe1993` |
| `pipeline/inputs/story_v2.json` | `content/story/story_v2.json` | 12,256 | `913098ef85803757e8eddf05db4d4635` |

## Prototype 9 (the integrated game, `index.html`)

Copied unchanged from the same commit. `engine/build_p9.py` patches `game.js` and `shell.html` at build time (each patch asserted to match once). `audio/` is `prototypes/p9/audio/` (music and effects, 38 MB).

| File | Source | Bytes | md5 |
|---|---|---|---|
| `engine/p9/jump.js` | `prototypes/jump/jump.js` | 4,774 | `e45a54d5303db3a15c3d724a2a97aa14` |
| `engine/p9/sim.js` | `prototypes/p6/sim.js` | 295,641 | `f08764a3811e91a3885ffb9aceb3e90d` |
| `engine/p9/pixel.js` | `prototypes/p6/pixel.js` | 86,218 | `99c7eb830369c7c198a8af86bd11d0b5` |
| `engine/p9/lab.js` | `prototypes/p6/lab.js` | 30,690 | `50475bf820f0779b57bd1f3acb15e7e9` |
| `engine/p9/circus_valley.js` | `prototypes/p6/circus_valley.js` | 54,190 | `9b5809500a02b361d9fdebc1b12dd8df` |
| `engine/p9/world6.js` | `prototypes/p6/world6.js` | 256,627 | `bcd92da1235eb7f754794cb5b86e1123` |
| `engine/p9/content.js` | `prototypes/p6/content.js` | 98,207 | `39bc0304b4c9e22c10c71b265a5b2168` |
| `engine/p9/game.js` | `prototypes/p6/game.js` | 357,495 | `bfbde41b9a0cacf226ae225265e91c39` |
| `engine/p9/story7.js` | `prototypes/p7/story.js` | 39,609 | `4052795b5764dc871e9cd22b8eccef28` |
| `engine/p9/lore.js` | `prototypes/p8/lore.js` | 5,892 | `29a2525c13cee9e5e010b2b2707b8380` |
| `engine/p9/pads.js` | `prototypes/controls/pads.js` | 8,397 | `307c38f051fba243e2c090e2679898d5` |
| `engine/p9/audio.js` | `prototypes/p9/audio.js` | 26,414 | `7c6667d46515761897fbbd8ae9e8e27f` |
| `engine/p9/shell.html` | `prototypes/p9/shell.html` | 9,604 | `711115ee26106feb1db4df9e6e398029` |
| `engine/p9/fleet.json` | `content/db/fleet.json` | 48,308 | `f0b57e6e9ed3221923bec810d4909d26` |
| `engine/p9/cues.json` | `content/audio/cues.json` | 113,235 | `d923baa2f0f23900a6e1c90037c3f481` |
| `engine/p9/story_v2.json` | `content/story/story_v2.json` | 12,256 | `913098ef85803757e8eddf05db4d4635` |
