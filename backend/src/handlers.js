const constants = require("./constants");
const commands = constants.commands;
const state = require("./state");
const logger = require("./logger");


//----------------------------------------------------------------------------------------------------------------------
// Allocate points
//----------------------------------------------------------------------------------------------------------------------

const addPointsToPlayer = (io, socket, room, player, _index, answer) => {
    const roomObj = state.getRoom(room);
    if (roomObj) {
        roomObj.answerCount++;
        state.getHostSocket(io, room)?.emit(commands.ANSWER_COUNT_UPDATE, roomObj.answerCount);
        roomObj.answerStats[answer]++;
        const playerObj = roomObj.players.find(item => item.nickname === player);
        if (playerObj && answer === roomObj.correctAnswer) {
            playerObj.points++;
            playerObj.duration += (Date.now() - roomObj.questionStart);
            logger.log(socket, room, `Player "${player}" received 1 point (new total: ${playerObj.points})`);
        }
    }
};

//----------------------------------------------------------------------------------------------------------------------
// Handle requests
//----------------------------------------------------------------------------------------------------------------------

module.exports.onWebsocketConnect = (io, socket) => {

    const log = (roomCode, message) => logger.log(socket, roomCode, message);
    log(null, "A client connected");

    //------------------------------------------------------------------------------------------------------------------
    // The host creates a room
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.CREATE_NEW_ROOM, data => {
        const roomCode = state.createRoom(socket, data);
        socket.join(roomCode);
        socket.emit(commands.ROOM_CREATED, roomCode);
        log(roomCode, `The host created room "${data.title}" (active rooms: ${state.getRoomCount()})`);
    });

    //------------------------------------------------------------------------------------------------------------------
    // The host closes a room
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.CLOSE_ROOM, roomCode => {
        const roomObj = state.getRoom(roomCode);
        if (roomObj) {
            io.to(roomCode).emit(commands.GAME_COMPLETED, roomObj.players);
            state.deleteRoom(roomCode);
            log(roomCode, `The host closed the room (active rooms: ${state.getRoomCount()})`);
        } else {
            log(roomCode, `The host tried to close non-existent room (active rooms: ${state.getRoomCount()})`);
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // A player joins a room
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.ADD_TO_ROOM, (roomCode, playerName, reconnectMode) => {
        const theRoom = state.getRoom(roomCode);
        if (theRoom) {
            const isTaken = theRoom.players.findIndex(item => item.nickname === playerName);
            if (reconnectMode) {
                if (isTaken >= 0) {
                    socket.join(roomCode);
                    socket.emit(commands.JOINED_TO_ROOM, theRoom);
                    const userCount = theRoom.players.length;
                    log(roomCode, `User "${playerName}" re-joined the room (total players: ${userCount})`);
                } else {
                    socket.emit(commands.ROOM_NOT_FOUND);
                    log(roomCode, `Unknown user "${playerName}" tried to re-join the room (rejected)`);
                }
            } else if (isTaken >= 0) {
                socket.emit(commands.NICKNAME_IS_TAKEN);
                log(roomCode, `User "${playerName}" tried to join room, but name is already taken (rejected)`);
            } else {
                theRoom.players.push({ nickname: playerName, points: 0, duration: 0 });
                socket.join(roomCode);
                socket.emit(commands.JOINED_TO_ROOM, theRoom);
                const userCount = theRoom.players.length;
                const host = state.getHostSocket(io, roomCode);
                if (host) {
                    host.emit(commands.USER_COUNT_UPDATE, userCount);
                }
                log(roomCode, `User "${playerName}" joined the room (total players: ${userCount})`);
            }
        } else {
            socket.emit(commands.ROOM_NOT_FOUND);
            log(roomCode, `User "${playerName}" tried to join non-existent room (rejected)`);
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // The host starts a question
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.NEW_QUESTION, (roomCode, question) => {
        log(roomCode, "The host started next question");
        const roomObj = state.getRoom(roomCode);
        if (roomObj) {
            roomObj.correctAnswer = question.correct;
            roomObj.answerCount = 0;
            roomObj.answerStats = question.answers.map(() => 0);
            roomObj.questionIndex = question.index;
            roomObj.questionStart = Date.now();
        }
        socket.to(roomCode).emit(commands.ANSWERS_OPEN, { ...question, correct: undefined });
    });

    //------------------------------------------------------------------------------------------------------------------
    // The host closes a question
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.CLOSE_QUESTION, (roomCode, question) => {
        log(roomCode, "The host ended the current question");
        socket.to(roomCode).emit(commands.ANSWERS_CLOSE, question);
    });

    //------------------------------------------------------------------------------------------------------------------
    // A player submits an answer
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.ANSWER_SELECTED, (roomCode, player, index, answer) => {
        log(roomCode, `Player "${player}" sent answer ${answer} for question ${index + 1}`);
        addPointsToPlayer(io, socket, roomCode, player, index, answer);
    });

    //------------------------------------------------------------------------------------------------------------------
    // ???
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.TIMER_SYNC, (roomCode, value) => socket.to(roomCode).emit(commands.TIMER_SYNC, value));

    //------------------------------------------------------------------------------------------------------------------
    // The host requests answer statistics
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.ANSWER_STATS_REQUEST, roomCode => {
        const roomObj = state.getRoom(roomCode);
        if (roomObj) {
            log(roomCode, `The host requested answer statistics`);
            socket.emit(commands.ANSWER_STATS_RESPONSE, roomObj.answerStats);
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // The host requests the leaderboard
    //------------------------------------------------------------------------------------------------------------------

    socket.on(commands.GENERAL_RANKING_REQUEST, roomCode => {
        const roomObj = state.getRoom(roomCode);
        if (roomObj) {
            log(roomCode, "The host requested the leaderboard");
            socket.emit(commands.GENERAL_RANKING_RESPONSE, roomObj.players);
        }
    });

    //------------------------------------------------------------------------------------------------------------------
    // A client disconnects
    //------------------------------------------------------------------------------------------------------------------

    socket.on("disconnect", () => log(null, `A client disconnected`));
};
