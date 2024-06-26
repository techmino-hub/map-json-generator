# DEPRECATED
# This program has been superseded by [its rewrite in Rust](https://github.com/techmino-hub/map-json-generator-2) for ease of installation and use.
Besides, Node doesn't have good TypeScript support, the code is a mess, and I really want to learn Rust.

# Map.json Generator
This repo contains code to generate `map.json` for displaying the mode map in [Techmino Hub](https://techmino-hub.github.io/).

## Dependencies
1. [`lua`](https://www.lua.org/download.html)
2. `ts-node`, installed using `npm i -g ts-node`
3. node type definitions, installed using `npm i --save-dev @types/node`
4. node fetch type definitions, installed using `npm i --save-dev @types/node-fetch`
5. node fetch module, installed using `npm i node-fetch`

## Running
After installing dependencies, run `main.ts` by doing `ts-node main.ts`

## About Extra Modes
The `/data/extra_modes.json` file exists because some of the modes in-game are not actually in the mode map.  
Reasons can include:
- It's a hidden mode (no I'm not spoiling how to access it; go find out yourself 😉)
- It's a mode which no longer exists in the latest version of the game
- It's an old version of some modes with different/unique mechanics

Note that the Y coordinate aren't the same as the Y coordinates on the normal map; they are shifted down 200 units under the bottommost "non-extra" mode.

## Output Format
The output will be generated in `./modes.json` by default. The output will be a minified JSON containing an object.  
Here's a non-minified JSON for reference:
```json
{
    "modes": {
        "sprint_10l": {
            "name": "sprint_10l",
            "shape": 1,
            "unlock": ["sprint_20l"],
            "size": 40,
            "x": 0,
            "y": 0,
            "icon": "sprint1"
        },
        "sprint_20l": {
            "name": "sprint_20l",
            "shape": 1,
            "unlock": [],
            "size": 50,
            "x": -200,
            "y": 200,
            "icon": "sprint1"
        }
    },
    "starting_mode": "sprint_10l",
    "min_x": -200,
    "max_x": 0,
    "min_y": 0,
    "max_y": 200
}
```