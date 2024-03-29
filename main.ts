import { exec } from 'child_process';
import { error } from 'console';
import { stderr } from 'process';
import type { Mode } from './types/mode';
import fs from 'fs';
import fetch from 'node-fetch';

const OUTPUT_FILE = './modes.json';
const MODES_URL = 'https://raw.githubusercontent.com/26F-Studio/Techmino/main/parts/modes.lua';
const MODES_PATH = './lua/modes.lua';
const TABLE_TO_JSON_PATH = './lua/table_to_json.lua';
const EXTRA_MODES_PATH = './data/extra_modes.json';

let modes: { [key: string]: Mode } = {};

fetch(MODES_URL)
  .then((response: any) => response.text())
  .then((table: string) => {
    console.log("Modes (lua) fetched successfully");
    fs.writeFileSync(MODES_PATH, table);
    console.log("Modes (lua) saved successfully");
    
    exec('lua -v', (err, _, stderr) => {
      if(err || stderr) {
        console.error("Failed to run Lua! Install it here if you haven't: https://www.lua.org/download.html");
        return;
      }
      exec(`lua ${TABLE_TO_JSON_PATH}`, (err, stdout, stderr) => {
        if(err) {
          console.error(err);
          return;
        } else if(stderr) {
          console.error("Output from stderr when executing table_to_json.lua: " + stderr);
          return;
        }
        modes = JSON.parse(stdout);
        console.log("Modes (lua) parsed successfully");
        
        // Get bottommost mode Y-coordinate (for calculating extra-mode height offset) (higher Y = lower on the screen)
        let yOffset = 0;
        for(let mode of Object.values(modes) as Mode[]) {
          yOffset = Math.max(yOffset, mode.y);
        }
        yOffset += 200;

        // Add extra modes
        const extraModes = JSON.parse(fs.readFileSync(EXTRA_MODES_PATH, 'utf8'));
        for(let mode of extraModes as Mode[]) {
          mode.y += yOffset;
          mode.unlock = mode.unlock ?? [];
          modes[mode.name] = mode;
        }
        console.log("Extra modes added successfully");

        // Add metadata
        let min_x = Infinity;
        let min_y = Infinity;
        let max_x = -Infinity;
        let max_y = -Infinity;
        for(let mode of Object.values(modes) as Mode[]) {
          min_x = Math.min(min_x, mode.x);
          min_y = Math.min(min_y, mode.y);
          max_x = Math.max(max_x, mode.x);
          max_y = Math.max(max_y, mode.y);
        }
        let map: Object = {
          modes: modes,
          starting_mode: modes['sprint_10l'] ? 'sprint_10l' : Object.keys(modes)[0],
          min_x: min_x, min_y: min_y,
          max_x: max_x, max_y: max_y
        };


        // Write output to file
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(map));
        console.log("Modes JSON created successfully.");
        console.log("All done! You can view the generated file at " + OUTPUT_FILE)
      })
    })
  })
  .catch((err: Error) => {
    console.error("Error fetching modes.lua: ", err);
  });

