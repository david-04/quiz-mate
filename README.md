# Quizario

real-time multi user quiz app

## Instalation
server side:
```
cd server
npm install
npm start
```
client side:
```
cd client
npm install
npm start
```
If you want to run the application on other devices in your LAN network, you must enter your private IP address to the variables in the file `client/src/connection/config.js`
```
export const server = (process.env.NODE_ENV === 'development' ? 'http://localhost:4001' : 'http://localhost:4001');
export const client = (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://localhost:3000');
```
In this configuration the application works only on one computer. If you enter here an address similar to `192.168.1.14`, other devices will be able to connect to the server.

If your device still can't connect to the server, try temporarily disabling antivirus and/or firewall on your computer.

## Features
* playing in many rooms at the same time
* player results statistics with export to CSV file
* built-in question editor
* multi language support (currently in english and polish)

## Technologies
* [React.js (create-react-app)](https://github.com/facebook/create-react-app)
* [react-router](https://github.com/ReactTraining/react-router)
* [react-redux](https://github.com/reduxjs/react-redux)
* [Socket.io](https://github.com/socketio/socket.io) + [socket.io-client](https://github.com/socketio/socket.io-client#readme)
* [react-bootstrap](https://github.com/react-bootstrap/react-bootstrap)
* [Express.js](https://github.com/expressjs/express)
* [react-switch-lang](https://www.npmjs.com/package/react-switch-lang)
* [react-file-download](https://github.com/kennethjiang/js-file-download)
* [qrcode.react](https://github.com/zpao/qrcode.react)