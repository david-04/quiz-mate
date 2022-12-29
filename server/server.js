const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const port = 4001;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const createNewRoom = 'CREATE_NEW_ROOW';
const roomCreated = 'ROOM_CREATED';
const closeRoom = 'CLOSE_ROOM';
const userCountUpdate = 'USER_COUNT_UPDATE';
const gameCompleted = 'GAME_COMPLETED';

const addToRoom = 'ADD_TO_ROOM';
const joinedToRoom = 'JOINED_TO_ROOM';
const nicknameIsTaken = 'NICKNAME_IS_TAKEN';
const roomNotFound = 'ROOM_NOT_FOUND';

const newQuestion = 'NEW_QUESTION';
const answersOpen = 'ANSWERS_OPEN';
const closeQuestion = 'CLOSE_QUESTION';
const answersClose = 'ANSWERS_CLOSE';
const answerSelected = 'ANSWER_SELECTED';
const answerCountUpdate = 'ANSWER_COUNT_UPDATE';
const timerSync = 'TIMER_SYNC';

const answerStatsRequest = 'ANSWER_STATS_REQUEST';
const answerStatsResponse = 'ANSWER_STATS_RESPONSE';

const generalRankingRequest = 'GENERAL_RANKING_REQUEST';
const generalRankingResponse = 'GENERAL_RANKING_RESPONSE';

const createdRooms = [
    {
        roomCode: '111111',
        title: 'quiz testowy',
        hostSocketId: null,
        correctAnswer: null,
        answerCount: 0,
        answerStats: [0, 0, 0, 0],
        players: [
            {
                nickname: 'kowalski',
                points: 0
            }
        ]
    }
];

const getRoomObject = (roomCode) => {
   return createdRooms.find(room => {
       return room.roomCode.toString() === roomCode.toString();
   });
};

const getHostSocket = (roomCode) => {
    const room = getRoomObject(roomCode);
    if(room && room.hostSocketId) {
        return io.sockets.sockets[room.hostSocketId];
    }
    return null;
};

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const addPointsToPlayer = (room, player, answer, id) => {
    let roomObj = getRoomObject(room);
    if(roomObj) {
        roomObj.answerCount += 1;
        let host = getHostSocket(room);
        if(host) host.emit(answerCountUpdate, roomObj.answerCount);
        roomObj.answerStats[answer] += 1;
        const points = answer === roomObj.correctAnswer ? 1 : 0;
        let playerObj = roomObj.players.find(item => {
            return item.nickname === player;
        });
        if(playerObj) {
            playerObj.points += points;
            console.log(id + ' > player "' + player + '" points: ' + playerObj.points + ' (+' + points + ')');
        }
    }
};

const returnLetter = (number) => {
    switch(number) {
        case 0: return 'A';
        case 1: return 'B';
        case 2: return 'C';
        case 3: return 'D';
        default: return '';
    }
};

io.on('connection', socket => {
    console.log(socket.id + ' > user connected');

    //CREATING A NEW ROOM BY HOST
    socket.on(createNewRoom, (data) => {
        let code = 0;
        while(true) {
            code = getRandomInt(100000, 999999);
            if(!getRoomObject(code)) break;
        }
        code = code.toString();
        createdRooms.push({
            ...data,
            roomCode: code,
            hostSocketId: socket.id,
            players: []
        });
        socket.join(code);
        socket.emit(roomCreated, code);
        console.log(socket.id + ' > user created a new room with code ' + code + ' and title "' + data.title + '" (active rooms: ' + createdRooms.length + ')');
    });

    //CLOSING ROOM BY HOST
    socket.on(closeRoom, (code) => {
        const i = createdRooms.findIndex(room => {
            return room.roomCode.toString() === code.toString();
        });
        if(i > -1) {
            let roomObj = getRoomObject(code);
            io.to(code).emit(gameCompleted, roomObj.players);
            createdRooms.splice(i, 1);
            console.log(socket.id + ' > host closed the room with code ' + code + ' (active rooms: ' + createdRooms.length + ')');
        }
    });

    //ADDING NEW USER TO THE ROOM
    socket.on(addToRoom, (roomCode, playerName, reconnectMode) => {
        const theRoom = getRoomObject(roomCode);
        if(theRoom) {
            const isTaken = theRoom.players.findIndex(item => {
                return item.nickname === playerName;
            });
            if(reconnectMode) {
                if(isTaken >= 0) {
                    socket.join(roomCode);
                    socket.emit(joinedToRoom, theRoom);
                    const userCount = theRoom.players.length;
                    console.log(socket.id + ' > user "' + playerName + '" used reconnect mode in room ' + roomCode + ' (players in room: ' + userCount + ')');
                }else{
                    socket.emit(roomNotFound);
                    console.log(socket.id + ' > user not found! Reconnect mode error in room with code ' + roomCode);
                }
            }else{
                if(isTaken >= 0) {
                    socket.emit(nicknameIsTaken);
                    console.log(socket.id + ' > in room ' + roomCode + ' nickname "' + playerName + '" is already taken! Player request rejected!');
                }else{
                    theRoom.players.push({
                        nickname: playerName,
                        points: 0
                    });
                    socket.join(roomCode);
                    socket.emit(joinedToRoom, theRoom);
                    const userCount = theRoom.players.length;
                    let host = getHostSocket(roomCode);
                    if(host) host.emit(userCountUpdate, userCount);
                    console.log(socket.id + ' > user joined to the room ' + roomCode + ' with nickname "' + playerName + '" (players in room: ' + userCount + ')');
                }
            }
        }else{
            socket.emit(roomNotFound);
            console.log(socket.id + ' > room with code ' + roomCode + ' not found!');
        }
    });

    //RUN NEW QUESTION
    socket.on(newQuestion, (room, question) => {
        console.log(socket.id + ' > host of room ' + room + ' opened a new question (correct answer is ' + returnLetter(question.correct) + ')');
        let roomObj = getRoomObject(room);
        if(roomObj) {
            roomObj.correctAnswer = question.correct;
            roomObj.answerCount = 0;
            roomObj.answerStats = [0, 0, 0, 0];
        }
        socket.to(room).emit(answersOpen, question);
    });

    //CLOSE QUESTION
    socket.on(closeQuestion, (room, question) => {
        console.log(socket.id + ' > host of room ' + room + ' closed current question');
        socket.to(room).emit(answersClose, question);
    });

    socket.on(answerSelected, (room, player, answer) => {
        console.log(socket.id + ' > player "' + player + '" send answer ' + returnLetter(answer) + ' in room ' + room);
        addPointsToPlayer(room, player, answer, socket.id);
    });

    socket.on(timerSync, (room, value) => {
        socket.to(room).emit(timerSync, value);
    });

    socket.on(answerStatsRequest, (room) => {
        let roomObj = getRoomObject(room);
        if(roomObj) {
            console.log(socket.id + ' > host of room ' + room + ' requests answer stats');
            socket.emit(answerStatsResponse, roomObj.answerStats);
        }
    });

    socket.on(generalRankingRequest, (room) => {
        let roomObj = getRoomObject(room);
        if(roomObj) {
            console.log(socket.id + ' > host of room ' + room + ' requests general ranking table');
            socket.emit(generalRankingResponse, roomObj.players);
        }
    });

    socket.on('disconnect', () => {
        console.log(socket.id + ' > user disconnected');
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));