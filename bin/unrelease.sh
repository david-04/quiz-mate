#!/usr/bin/env bash

set -e -o pipefail

function __qm_unrelease() {
    unset -f __qm_unrelease

    echo Reverting release...

    if [[ -f "unrelease.sh" ]]; then
        cd .. || return 1
    fi

    local DIRECTORY

    for DIRECTORY in docs/frontend dist; do
        git clean -d --force --quiet -- "$DIRECTORY"
        git checkout -- "$DIRECTORY"
    done
}

__qm_unrelease "$@"
