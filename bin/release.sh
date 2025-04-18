#!/usr/bin/env bash

set -e -o pipefail

function __qm_release() {
    unset -f __qm_release

    if [[ -f "release.sh" ]]; then
        cd .. || return 1
    fi

    env GENERATE_SOURCEMAP=false bin/build.sh

    echo "Deleting everything from dist..."
    rm -rf ./dist
    mkdir ./dist

    echo Assembling dist/frontend...
    rm -rf ./dist/frontend
    mkdir -p ./dist/frontend
    cp -r ./frontend/build/* ./dist/frontend/

    echo Assembling dist/backend...
    rm -rf ./dist/backend
    mkdir -p ./dist/backend
    cp -r ./backend/src/* ./dist/backend/

    echo Injecting version number...
    VERSION=$(grep -E "^## \[[0-9.]+\]" CHANGELOG.md | head -1 | sed "s|^\#\# \[||;s|\].*||")
    sed "s|\${CURRENT_QUIZ_MATE_VERSION\}|$VERSION|g" backend/src/constants.js >./dist/backend/constants.js

    echo Patching the package.json...
    node ./bin/patch-package-json.js backend/package.json "$VERSION" dist/package.json

    echo Copying LICENSE and README...
    cp ./LICENSE ./dist/
    sed -E "s|]\s*\((./)?docs/|](https://david-04.github.io/quiz-mate/|g" ./README.md >./dist/README.md

    echo Copying the frontend to docs/frontend
    mkdir -p ./docs/frontend
    cp -rf ./dist/frontend/* ./docs/frontend/
}

__qm_release "$@"
