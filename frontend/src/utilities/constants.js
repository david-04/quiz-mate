export const ONE_HUNDRED = 100;
export const TRIPLE_ZERO = "000";
export const TEN = 10;

export const TIMER_ANIMATE_INTERVAL_SECONDS = 10;

export const MS_PER_SEC = 1000;
export const SEC_PER_MIN = 60;

export const ROOM_CODE_MIN = 100_000;
export const ROOM_CODE_MAX = 999_999;

// This parameter defines the maximum size of web socket messages that can be exchanged between the client and the
// server. The default is 1MB. The value needs to be increased if larger objects (like images) need to be sent from
// the host to the server and/or from server to the players. At the moment, images are not sent to the backend or the
// players - so we can leave the default of 1 MB.
//
// The same size must also be configured in ../../backend/src/constants.js

export const MAX_WEB_SOCKET_MESSAGE_SIZE = 1 * 1024 * 1024;
