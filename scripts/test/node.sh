#! /usr/bin/env bash

# This script runs tests against different Node.js versions.

set -e

# First, make sure the library is built
make build

versions_array=(
  "node@18"
  "node@20"
  "node@22"
  "node@23"
  "node@24"
)

for version in "${versions_array[@]}"; do
  printf "\n🚧 Running tests in $version\n"

  mise x "${version}" -- node --eval 'require("./lib")'
  printf "✅ Package CommonJS is ok!\n"

  mise x "${version}" -- node scripts/test/node/esm.js
  printf "✅ Package ESM is ok!\n"

  TZ=Asia/Singapore mise x "${version}" -- pnpm exec vitest run
done

printf "✅ All Node.js tests passed\n"