#!/usr/bin/env bash

set -e
cd "`dirname "${BASH_SOURCE[0]}"`/.."

env GENERATE_SOURCEMAP=false ./scripts/build.sh

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
cat ./backend/src/constants.js | sed "s|\${CURRENT_QUIZ_MATE_VERSION\}|$VERSION|g" > ./dist/backend/constants.js

echo Patching the package.json...
node ./scripts/patch-package-json.js backend/package.json "$VERSION" dist/package.json

echo Copying LICENSE and README...
cp ./LICENSE ./dist/
sed -E "s|]\s*\((./)?docs/|](https://david-04.github.io/quiz-mate/|g" ./README.md > ./dist/README.md

echo Copying the frontend to docs/frontend
mkdir -p ./docs/frontend
cp -rf ./dist/frontend/* ./docs/frontend/
