const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const socketIO = require("socket.io");

const handlers = require("./handlers");
const logger = require("./logger");
const utils = require("./utils");

//----------------------------------------------------------------------------------------------------------------------
// Start all servers (http, https, socket.io)
//----------------------------------------------------------------------------------------------------------------------

module.exports.start = config => {
    const expressApp = express();
    injectStaticAssets(expressApp, config);
    const servers = createsServers(expressApp, config);
    createSocketIoServer(servers);
    servers.forEach(server => server.start());
};

//----------------------------------------------------------------------------------------------------------------------
// Initialize the Express app to serve static content
//----------------------------------------------------------------------------------------------------------------------

function injectStaticAssets(expressApp, config) {
    const assetsPath = getAssetsPath();
    const indexHtml = loadAndPatchIndexHtml(assetsPath, config);
    ["/", "/index.html"].forEach(url => expressApp.get(url, (_request, response) => response.send(indexHtml)));
    expressApp.use(express.static(assetsPath));
    return expressApp;
}

//----------------------------------------------------------------------------------------------------------------------
// Locate the local path to static assets
//----------------------------------------------------------------------------------------------------------------------

function getAssetsPath() {
    const devPath = path.join(__dirname, "..", "..", "frontend", "build");
    const releasePath = path.join(__dirname, "..", "frontend");
    for (const currentPath of [releasePath, devPath]) {
        if (fs.existsSync(path.join(currentPath, "index.html"))) {
            return currentPath;
        }
    }
    if (!utils.isDevMode()) {
        return fail("INTERNAL ERROR: Unable to locate the directory with the static frontend assets");
    }
    return releasePath;
}

//----------------------------------------------------------------------------------------------------------------------
// Load and patch the index.html file
//----------------------------------------------------------------------------------------------------------------------

function loadAndPatchIndexHtml(assetsPath, config) {
    const indexFile = path.join(assetsPath, "index.html");
    if (fs.existsSync(indexFile)) {
        return fs.readFileSync(indexFile).toString().replace(/"\.\//g, `"${config.staticAssetSource}/`);
    } else {
        return fail(["ERROR: Unable to load index.html.", "Please run 'yarn build' in 'frontend' first."]);
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Create the required HTTP and HTTPS servers
//----------------------------------------------------------------------------------------------------------------------

function createsServers(expressApp, config) {
    const servers = [];
    if (config.httpPort) {
        servers.push(createHttpServer(expressApp, config));
    }
    if (config.httpsPort) {
        servers.push(createHttpsServer(expressApp, config));
    }
    return servers;
}

//----------------------------------------------------------------------------------------------------------------------
// Create an HTTP server
//----------------------------------------------------------------------------------------------------------------------

function createHttpServer(expressApp, config) {
    return createServer(http.createServer(expressApp), "http", config.httpPort);
}

//----------------------------------------------------------------------------------------------------------------------
// Create an HTTPS server
//----------------------------------------------------------------------------------------------------------------------

function createHttpsServer(expressApp, config) {
    const key = fs.readFileSync(config.httpsKeyFile);
    const cert = fs.readFileSync(config.httpsCertFile);
    return createServer(https.createServer({ key, cert }, expressApp), "https", config.httpsPort);
}

//----------------------------------------------------------------------------------------------------------------------
// Attach a start command to the given server
//----------------------------------------------------------------------------------------------------------------------

function createServer(server, protocol, port) {
    const start = () => server.listen(port, () => logger.log(null, null, `Started on ${protocol}://localhost:${port}`));
    return { instance: server, start };
}

//----------------------------------------------------------------------------------------------------------------------
// Create a socket.io server and attach it to all HTTP/HTTPS servers
//----------------------------------------------------------------------------------------------------------------------

function createSocketIoServer(servers) {
    const io = socketIO();
    io.on("connection", socket => handlers.onWebsocketConnect(io, socket));
    servers.forEach(server => io.attach(server.instance, { cors: { origin: "*" } }));
    return io;
}
