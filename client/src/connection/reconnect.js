const roomItem = 'reconnect-room';
const playerItem = 'reconnect-player';

export const reconnectModeIsAvailable = () => {
    return window.localStorage.getItem(roomItem) !== null && window.localStorage.getItem(playerItem) !== null;
};

export const getReconnectRoom = () => {
    return localStorage.getItem(roomItem);
};

export const getReconnectPlayer = () => {
    return localStorage.getItem(playerItem);
};

export const enableReconnectMode = (room, player) => {
    localStorage.setItem(roomItem, room);
    localStorage.setItem(playerItem, player);
};

export const disableReconnectMode = () => {
    localStorage.removeItem(roomItem);
    localStorage.removeItem(playerItem);
};