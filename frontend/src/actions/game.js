export const switchState = "game/SWITCH_STATE";
export const setPlayerConfig = "game/SET_PLAYER_CONFIG";
export const setHostingRoom = "game/SET_HOSTING_ROOM";

export function switchStateAC(state) {
    return { type: switchState, state };
}

export function setPlayerConfigAC(roomCode, playerName, reconnectMode) {
    return {
        type: setPlayerConfig,
        roomCode,
        playerName,
        reconnectMode
    };
}

export function setHostingRoomAC(data) {
    return { type: setHostingRoom, data };
}
