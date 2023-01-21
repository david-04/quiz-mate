const roomItem = "reconnect-room";
const playerItem = "reconnect-player";

export function reconnectModeIsAvailable() {
    return window.localStorage.getItem(roomItem) !== null && window.localStorage.getItem(playerItem) !== null;
}

export function getReconnectRoom() {
    return localStorage.getItem(roomItem);
}

export function getReconnectPlayer() {
    return localStorage.getItem(playerItem);
}

export function enableReconnectMode(room, player) {
    localStorage.setItem(roomItem, room);
    localStorage.setItem(playerItem, player);
}

export function disableReconnectMode() {
    localStorage.removeItem(roomItem);
    localStorage.removeItem(playerItem);
}
