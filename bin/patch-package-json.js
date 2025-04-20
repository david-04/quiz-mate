import { readFileSync, writeFileSync } from "fs";

const [input, version, output, ...rest] = process.argv.slice(2);

if (!output || rest.length) {
    console.error("ERROR: Invalid arguments.");
    console.error("Usage: node patch-package-json.js [INPUT_FILE] [QUIZ_MATE_VERSION_NUMBER] [OUTPUT_FILE]");
    process.exit(1);
}

const json = JSON.parse(readFileSync(input).toString());
["scripts", "packageManager", "private"].forEach(property => delete json[property]);
json.version = version;

const dependencies = json.dependencies || {};
for (const key of Object.keys(dependencies)) {
    if (!dependencies[key].match(/^\d.*/)) {
        console.error(`ERROR: ${input} contains dependencies with flexible version numbers`);
        process.exit(1);
    }
}

writeFileSync(output, JSON.stringify(json, undefined, 1 + 1));
