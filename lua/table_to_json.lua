local JSON = require('./lua/json');
local MODES_FILE = './lua/modes.lua';

-- Read the modes.lua file
local modeTable = {};
do
    local file = io.open(MODES_FILE, 'r');
    assert(file, 'Could not open file: ' .. MODES_FILE);
    local modeScript = file:read('a');
    modeTable = load(modeScript)();
    file:close();
end

-- Process the modes
do
    for k,mode in pairs(modeTable) do
        if not mode.unlock then
            modeTable[k].unlock = {};
        end
    end
    local newModeTable = {};
    for _,mode in pairs(modeTable) do
        newModeTable[mode.name] = mode;
    end
    modeTable = newModeTable;
end

-- Convert to JSON
local modeJSON = JSON.encode(modeTable);
print(modeJSON);