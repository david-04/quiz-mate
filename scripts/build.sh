#!/usr/bin/env bash

set -e

echo Building the frontend...

cd "`dirname "${BASH_SOURCE[0]}"`/../frontend"

rm -rf build

env PUBLIC_URL=__QUIZ_MATE_ASSETS_URL_PLACEHOLDER__ GENERATE_SOURCEMAP=false yarn build

sed -i \
    's|__QUIZ_MATE_ASSETS_URL_PLACEHOLDER__|.|g' \
    `find ./build -type f \( -name "*.html" -o -name "*.json" \)`

sed -i \
    's|"__QUIZ_MATE_ASSETS_URL_PLACEHOLDER__|globalThis.QUIZ_MATE_ASSETS_URL+"|g' \
    `find ./build -type f -name "*.js"`

NUMBER_OF_MISSED_PLACEHOLDERS=$(grep -r "__QUIZ_MATE_ASSETS_URL_PLACEHOLDER__" ./build | wc -l)

if [ "$NUMBER_OF_MISSED_PLACEHOLDERS" != "0" ]
then
    echo ERROR: Not all instances of __QUIZ_MATE_ASSETS_URL_PLACEHOLDER__ have been replaced
    exit 1
fi
