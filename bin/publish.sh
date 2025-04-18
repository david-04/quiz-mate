#!/usr/bin/env bash

set -e -o pipefail

function __qm_publish() {
    unset -f __qm_publish

    if [[ -f "publish.sh" ]]; then
        cd .. || return 1
    fi

    if ! npm whoami >/dev/null 2>&1; then
        npm login --scope=@david-04
    fi

    cd "../dist"
    npm publish --access=public
}

__qm_publish "$@"
