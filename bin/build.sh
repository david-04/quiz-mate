#!/usr/bin/env bash

set -e -o pipefail

function __qm_build() {
    unset -f __qm_build

    echo Building the frontend...

    if [[ -f bin/build.sh ]]; then
        cd frontend || return 1
    else
        cd "../frontend" || return 1
    fi

    if [[ -d build ]]; then
        rm -r build
    fi

    env PUBLIC_URL=__QUIZ_MATE_ASSETS_URL_PLACEHOLDER__ GENERATE_SOURCEMAP=false yarn build

    # shellcheck disable=SC2046
    sed -i \
        's|__QUIZ_MATE_ASSETS_URL_PLACEHOLDER__|.|g' \
        $(find build -type f \( -name "*.html" -o -name "*.json" \))

    # shellcheck disable=SC2046
    sed -i \
        's|"__QUIZ_MATE_ASSETS_URL_PLACEHOLDER__|globalThis.QUIZ_MATE_ASSETS_URL+"|g' \
        $(find build -type f -name "*.js")

    NUMBER_OF_MISSED_PLACEHOLDERS=$(grep -r "__QUIZ_MATE_ASSETS_URL_PLACEHOLDER__" build | wc -l || true)

    if [ "$NUMBER_OF_MISSED_PLACEHOLDERS" != "0" ]; then
        echo ERROR: Not all instances of __QUIZ_MATE_ASSETS_URL_PLACEHOLDER__ have been replaced >&2
        return 1
    fi
}

__qm_build "$@"
