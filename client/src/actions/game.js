export const switchState = 'game/SWITCH_STATE';
export const setPlayerConfig = 'game/SET_PLAYER_CONFIG';
export const setHostingRoom = 'game/SET_HOSTING_ROOM';

export const switchStateAC = (state) => {
  return {
      type: switchState,
      state
  }
};

export const setPlayerConfigAC = (roomCode, playerName, reconnectMode) => {
    return {
        type: setPlayerConfig,
        roomCode,
        playerName,
        reconnectMode
    }
};

export const setHostingRoomAC = (data) => {
    return {
        type: setHostingRoom,
        data
    }
};