export const server = (process.env.NODE_ENV === "development" ? "http://localhost:3001" : window.location.origin);
export const client = (process.env.NODE_ENV === "development" ? "http://localhost:3000" : window.location.origin);

export const createNewRoom = "CREATE_NEW_ROOM";
export const roomCreated = "ROOM_CREATED";
export const closeRoom = "CLOSE_ROOM";
export const gameCompleted = "GAME_COMPLETED";

export const userCountUpdate = "USER_COUNT_UPDATE";

export const addToRoom = "ADD_TO_ROOM";
export const joinedToRoom = "JOINED_TO_ROOM";
export const nicknameIsTaken = "NICKNAME_IS_TAKEN";
export const roomNotFound = "ROOM_NOT_FOUND";

export const newQuestion = "NEW_QUESTION";
export const answersOpen = "ANSWERS_OPEN";
export const closeQuestion = "CLOSE_QUESTION";
export const answersClose = "ANSWERS_CLOSE";
export const answerSelected = "ANSWER_SELECTED";
export const answerCountUpdate = "ANSWER_COUNT_UPDATE";
export const timerSync = "TIMER_SYNC";

export const answerStatsRequest = "ANSWER_STATS_REQUEST";
export const answerStatsResponse = "ANSWER_STATS_RESPONSE";

export const generalRankingRequest = "GENERAL_RANKING_REQUEST";
export const generalRankingResponse = "GENERAL_RANKING_RESPONSE";
