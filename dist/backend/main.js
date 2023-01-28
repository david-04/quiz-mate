#!/usr/bin/env node

const config = require("./config");
const { DEFAULT_CONFIG_FILE, VERSION } = require("./constants");
const express = require("./express");
const utils = require("./utils");

//----------------------------------------------------------------------------------------------------------------------
// Output for quiz-mate --help
//----------------------------------------------------------------------------------------------------------------------

const HELP_MESSAGE = utils.normalizeMessage(`
    Quiz Mate ${VERSION}

    Usage: quiz-mate [CONFIG_FILE]

    The configuration is read from the specified CONFIG_FILE (default: ${DEFAULT_CONFIG_FILE}).
`);

//----------------------------------------------------------------------------------------------------------------------
// Parse the command line arguments
//----------------------------------------------------------------------------------------------------------------------

function parseAndProcessCommandLine(args) {
    if (0 < args.filter(arg => ["-h", "--help", "/?"].includes(arg.toLowerCase().trim())).length) {
        console.log(HELP_MESSAGE);
    } else if (0 < args.filter(arg => ["-v", "--version"].includes(arg.toLowerCase().trim())).length) {
        console.log(VERSION);
    } else if (1 < args.length) {
        utils.fail("ERROR: Too many arguments. Try 'quiz-mate --help' for more information.");
    } else {
        express.start(config.getConfig(1 <= args.length ? args[0] : undefined));
    }
}

//----------------------------------------------------------------------------------------------------------------------
// Start the application
//----------------------------------------------------------------------------------------------------------------------

parseAndProcessCommandLine(process.argv.slice(1 + 1));
