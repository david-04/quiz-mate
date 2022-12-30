#!/usr/bin/env bash

set -e

echo Reverting release...

cd "`dirname "${BASH_SOURCE[0]}"`/.."

for DIRECTORY in docs/frontend dist
do
    git clean -d --force --quiet -- $DIRECTORY
    git checkout -- $DIRECTORY
done
