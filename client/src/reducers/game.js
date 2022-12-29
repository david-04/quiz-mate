import {switchState, setPlayerConfig, setHostingRoom} from '../actions/game'

const defaultStore = {
    state: '',
    roomCode: null,
    playerName: null,
    reconnectMode: false,
    hostingRoom: null
};

export default (state = defaultStore, action) => {
    switch(action.type) {
        case switchState:
            return {
              ...state,
              state: action.state
            };
        case setPlayerConfig:
            return {
                ...state,
                roomCode: action.roomCode,
                playerName: action.playerName,
                reconnectMode: action.reconnectMode
            };
        case setHostingRoom:
            return {
                ...state,
                hostingRoom: action.data
            };
        default:
            return state;
    }
}