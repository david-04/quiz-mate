#!/usr/bin/env bash

set -e

echo Building the frontend...

cd "`dirname "${BASH_SOURCE[0]}"`/../frontend"
rm -rf build
yarn build
