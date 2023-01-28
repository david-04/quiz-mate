const fs = require("fs");
const path = require("path");
const { ROOM_CODE_MIN, ROOM_CODE_MAX } = require("./constants");

//----------------------------------------------------------------------------------------------------------------------
// Trim a multi-line message
//----------------------------------------------------------------------------------------------------------------------

module.exports.normalizeMessage = message => message
    .trim()
    .replace(/^[ \t]+/gm, "")
    .replace(/\r/g, "");

//----------------------------------------------------------------------------------------------------------------------
// Print a message and exit
//----------------------------------------------------------------------------------------------------------------------

module.exports.fail = message => {
    if (message) {
        (Array.isArray(message) ? message : [message]).forEach(line => console.error(line));
    }
    process.exit(1);
};

//----------------------------------------------------------------------------------------------------------------------
// Check if the application runs in the local development environment
//----------------------------------------------------------------------------------------------------------------------

module.exports.isDevMode = () => fs.existsSync(path.join(__dirname, "..", "..", "frontend", "package.json"));

//----------------------------------------------------------------------------------------------------------------------
// Check if a given string is a valid room code
//----------------------------------------------------------------------------------------------------------------------

module.exports.isValidRoomCode = roomCodeRaw => {
    const roomCode = parseRoomCode(roomCodeRaw);
    return ROOM_CODE_MIN <= roomCode && roomCode <= ROOM_CODE_MAX && !isNaN(roomCode);
};

function parseRoomCode(roomCode) {
    if ("number" === typeof roomCode) {
        return roomCode;
    } else if ("string" === typeof roomCode && /^\d+$/.test(roomCode)) {
        return parseInt(roomCode);
    } else {
        return NaN;
    }
}
