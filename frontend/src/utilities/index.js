import { client } from "../connection/config";
import { MS_PER_SEC, SEC_PER_MIN, TRIPLE_ZERO, ROOM_CODE_MIN, ROOM_CODE_MAX } from "./constants";

const ALERT_SECONDS = 10;

export const calculateTime = (seconds, hideMinutes) => {
    const min = Math.floor(seconds / SEC_PER_MIN);
    const sec = seconds - min * SEC_PER_MIN;
    if (hideMinutes && min === 0) {
        return addLeadingZero(sec);
    } else {
        return `${min}:${addLeadingZero(sec)}`;
    }
};

export const addLeadingZero = number => {
    if (number < ALERT_SECONDS) {
        return "0" + number;
    } else {
        return number;
    }
};

export const validateJson = json => {
    let result = true;
    if (json && "object" === typeof json && Array.isArray(json.questions)) {
        json.questions.forEach(question => result = result && validateQuestion(question));
        result = result && !!json.questions.length;
    } else {
        result = false;
    }
    return result;
};
function validateQuestion(question) {
    if (typeof question === "object" && question !== null) {
        if (question.hasOwnProperty("question")
            && question.hasOwnProperty("correct")
            && question.hasOwnProperty("answers")) {
            if (Array.isArray(question.answers) && 1 <= question.answers.length) {
                return true;
            }
        }
    }
    return false;
}

export function formatSpeed(duration, points) {
    if (0 === points) {
        return "";
    } else {
        const average = Math.round(duration / points);
        const sec = Math.floor(average / MS_PER_SEC);
        const ms = `${average - MS_PER_SEC * sec}`;
        return [`${sec}`, ".", TRIPLE_ZERO.substring(0, TRIPLE_ZERO.length - ms.length), ms, " seconds"].join("");
    }
}

export function sortByPoints(a, b) {
    if (a.points < b.points) {
        return 1;
    } else if (a.points > b.points) {
        return -1;
    } else if (a.duration < b.duration) {
        return -1;
    } else if (a.duration > b.duration) {
        return 1;
    } else {
        return 0;
    }
};

const ASCII_CODE_FOR_A = 65;
const LETTERS_IN_ALPHABET = 26;

export function toLetter(index) {
    return String.fromCharCode(ASCII_CODE_FOR_A + (index % LETTERS_IN_ALPHABET));
}

//----------------------------------------------------------------------------------------------------------------------
// Check if a given string is a valid room code
//----------------------------------------------------------------------------------------------------------------------

export function isValidRoomCode(roomCodeRaw) {
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

//----------------------------------------------------------------------------------------------------------------------
// Keep track of the current game being played or hosted
//----------------------------------------------------------------------------------------------------------------------

let beforeUnloadWarning = undefined;
let hasInstalledOnBeforeUnloadListener = false;

export function onHostStartGame(title) {
    document.title = title || "Quiz Mate";
    beforeUnloadWarning = [
        "You are you sure you want to exit?",
        "This will abort the quiz you're currently hosting.",
        "You won't be able to re-join as the host."
    ].join(" ");
}

export function onPlayerJoinGame(title) {
    document.title = title || "Quiz Mate";
    beforeUnloadWarning = "Are you sure you want to exit the the quiz?";
}

export function onExitGame() {
    document.title = "Quiz Mate";
    beforeUnloadWarning = undefined;
}

export function installOnBeforeUnloadListener() {
    if (!hasInstalledOnBeforeUnloadListener) {
        window.addEventListener("beforeunload", onBeforeUnload, { capture: true });
        hasInstalledOnBeforeUnloadListener = true;
    }
    return true;
}

function onBeforeUnload(event) {
    if (beforeUnloadWarning) {
        event.returnValue = "beforeUnloadWarning";
        return false;
    }
    return true;
}

//----------------------------------------------------------------------------------------------------------------------
// Get the URL (with optional room code)
//----------------------------------------------------------------------------------------------------------------------

export function getServerUrl(roomCode) {
    return undefined === roomCode ? client : `${client}/#/${roomCode}`;
}
