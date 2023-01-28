const fs = require("fs");
const path = require("path");

const utils = require("./utils");
const { MIN_PORT, MAX_PORT, DEFAULT_CONFIG_FILE, GITHUB_PAGES_ASSETS_URL } = require("./constants");

//----------------------------------------------------------------------------------------------------------------------
// Handlers to validate and import config keys
//----------------------------------------------------------------------------------------------------------------------

const PROPERTY_HANDLERS = {
    "http-port": (config, value, fail) => config.httpPort = parsePort(value, fail),
    "https-port": (config, value, fail) => config.httpsPort = parsePort(value, fail),
    "https-key-file": (config, value, fail) => config.httpsKeyFile = parseFile(value, fail),
    "https-cert-file": (config, value, fail) => config.httpsCertFile = parseFile(value, fail),
    "static-assets-source": (config, value, fail) => config.staticAssetSource = parseStaticAssetsSource(value, fail),
};

//----------------------------------------------------------------------------------------------------------------------
// Load and/or create the configuration as required
//----------------------------------------------------------------------------------------------------------------------

module.exports.getConfig = configFile => {
    if (!configFile && !fs.existsSync(DEFAULT_CONFIG_FILE)) {
        createConfigurationFileAndExit(DEFAULT_CONFIG_FILE);
    }
    const fileName = configFile || DEFAULT_CONFIG_FILE;
    const lines = loadConfigurationFile(fileName);
    const failedToLoadConfigFile = `Failed to load configuration file ${fileName}:`;
    const config = extractConfigurationProperties(
        lines, (line, message) => utils.fail([failedToLoadConfigFile, `${line.trim()}`, message])
    );
    validateConfiguration(config, message => utils.fail([failedToLoadConfigFile, message]));
    return config;
};

//----------------------------------------------------------------------------------------------------------------------
// Create a new configuration file
//----------------------------------------------------------------------------------------------------------------------

function createConfigurationFileAndExit(configFile) {
    const defaultConfigPath = path.join(__dirname, "default.cfg");
    if (!fs.existsSync(defaultConfigPath)) {
        fail("INTERNAL ERROR: ${defaultConfigPath} does not exist");
    }
    fs.writeFileSync(configFile, fs.readFileSync(defaultConfigPath).toString().replace(/\r/g, ""), { flag: "wx" });
    utils.fail([
        `Created a new configuration file: ${DEFAULT_CONFIG_FILE}`,
        "Please review the settings and start the Quiz Mate again"
    ]);
}

//----------------------------------------------------------------------------------------------------------------------
// Load the configuration file
//----------------------------------------------------------------------------------------------------------------------

function loadConfigurationFile(configFile) {
    if (!fs.existsSync(configFile)) {
        utils.fail(`ERROR: The configuration file ${configFile} does not exist`);
    }
    return fs.readFileSync(configFile)
        .toString()
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => !line.match(/^([;#].*|)$/));
}

//----------------------------------------------------------------------------------------------------------------------
// Extract all properties
//----------------------------------------------------------------------------------------------------------------------

function extractConfigurationProperties(lines, fail) {
    const config = {};
    lines.forEach(line => processLine(config, line, fail));
    return config;
}

//----------------------------------------------------------------------------------------------------------------------
// Extract the property from one line
//----------------------------------------------------------------------------------------------------------------------

function processLine(config, line, fail) {
    const { key, value } = splitLine(line, fail);
    const handler = PROPERTY_HANDLERS[key];
    if (!handler) {
        fail(line, `Unknown property name ${key}`);
    } else {
        handler(config, value, message => fail(line, message));
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Split a line into key and value
//----------------------------------------------------------------------------------------------------------------------

function splitLine(line, fail) {
    const index = line.indexOf("=");
    if (index < 0) {
        fail(line, "The line is not in 'key=value' format");
    }
    return { key: line.replace(/\s*=.*/, ""), value: line.replace(/^[^=]*=\s*/, "") };
}

//----------------------------------------------------------------------------------------------------------------------
// Parse a port number
//----------------------------------------------------------------------------------------------------------------------

function parsePort(value, fail) {
    if ("" === value) {
        return undefined;
    } else if (!value.match(/^\d+$/)) {
        fail("The port must be a number");
    }
    const port = parseInt(value);
    if (port < MIN_PORT || MAX_PORT <= port) {
        fail(`The port must be between ${MIN_PORT} and ${MAX_PORT}`);
    }
    return port;
}

//----------------------------------------------------------------------------------------------------------------------
// Parse a file name/path
//----------------------------------------------------------------------------------------------------------------------

function parseFile(value, fail) {
    if ("" === value) {
        return undefined;
    } else if (!fs.existsSync(value)) {
        fail(`File ${value} does not exist`);
    }
    return value;
}

//----------------------------------------------------------------------------------------------------------------------
// Parse the static assets source
//----------------------------------------------------------------------------------------------------------------------

function parseStaticAssetsSource(value, fail) {
    if ("" === value || "local" === value.toLowerCase()) {
        return ".";
    } else if ("github" === value.toLowerCase()) {
        return GITHUB_PAGES_ASSETS_URL.replace(/\/+$/, "");
    } else if (value.match(/^https?:\/\/.*/)) {
        return value.replace(/\/+$/, "");
    } else {
        return fail("The static asset source must be set to 'local', 'github', or an http(s):// URL");
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Validate the configuration
//----------------------------------------------------------------------------------------------------------------------

function validateConfiguration(config, fail) {
    if (!config.httpPort && !config.httpsPort) {
        fail("Neither http-port nor https-port is set");
    }
    if (!!config.httpsPort !== !!config.httpsKeyFile || !!config.httpsKeyFile !== !!config.httpsCertFile) {
        fail("https-port, https-key-file and https-cert-file must all be set together");
    }
}
