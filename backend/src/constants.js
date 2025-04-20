//----------------------------------------------------------------------------------------------------------------------
// The version number is inserted during the build process
//----------------------------------------------------------------------------------------------------------------------

module.exports.VERSION = "${CURRENT_QUIZ_MATE_VERSION}";

//----------------------------------------------------------------------------------------------------------------------
// Externally hosted frontend assets
//----------------------------------------------------------------------------------------------------------------------

module.exports.GITHUB_PAGES_ASSETS_URL = "https://david-04.github.io/quiz-mate/frontend";

//----------------------------------------------------------------------------------------------------------------------
// Commands sent between the frontend and the backend
//----------------------------------------------------------------------------------------------------------------------

module.exports.commands = {

    CREATE_NEW_ROOM: "CREATE_NEW_ROOM",
    ROOM_CREATED: "ROOM_CREATED",
    CLOSE_ROOM: "CLOSE_ROOM",

    USER_COUNT_UPDATE: "USER_COUNT_UPDATE",
    GAME_COMPLETED: "GAME_COMPLETED",

    ADD_TO_ROOM: "ADD_TO_ROOM",
    JOINED_TO_ROOM: "JOINED_TO_ROOM",
    NICKNAME_IS_TAKEN: "NICKNAME_IS_TAKEN",
    ROOM_NOT_FOUND: "ROOM_NOT_FOUND",

    NEW_QUESTION: "NEW_QUESTION",
    ANSWERS_OPEN: "ANSWERS_OPEN",
    CLOSE_QUESTION: "CLOSE_QUESTION",
    ANSWERS_CLOSE: "ANSWERS_CLOSE",
    ANSWER_SELECTED: "ANSWER_SELECTED",
    ANSWER_COUNT_UPDATE: "ANSWER_COUNT_UPDATE",
    TIMER_SYNC: "TIMER_SYNC",

    ANSWER_STATS_REQUEST: "ANSWER_STATS_REQUEST",
    ANSWER_STATS_RESPONSE: "ANSWER_STATS_RESPONSE",

    GENERAL_RANKING_REQUEST: "GENERAL_RANKING_REQUEST",
    GENERAL_RANKING_RESPONSE: "GENERAL_RANKING_RESPONSE"
};

//----------------------------------------------------------------------------------------------------------------------
// Other
//----------------------------------------------------------------------------------------------------------------------

module.exports.DEFAULT_CONFIG_FILE = "quiz-mate.cfg";

module.exports.ROOM_CODE_MIN = 100_000;
module.exports.ROOM_CODE_MAX = 999_999;

module.exports.MIN_PORT = 1;
module.exports.MAX_PORT = 65_535;

// This parameter defines the maximum size of web socket messages that can be exchanged between the client and the
// server. The default is 1MB. The value needs to be increased if larger objects (like images) need to be sent from
// the host to the server and/or from server to the players. At the moment, images are not sent to the backend or the
// players - so we can leave the default of 1 MB.
//
// The same size must also be configured in ../../frontend/src/utilities/constants.js

module.exports.MAX_WEB_SOCKET_MESSAGE_SIZE = 1 * 1024 * 1024;
