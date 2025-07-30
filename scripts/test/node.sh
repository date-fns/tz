#! /usr/bin/env bash

# This script runs tests against different Node.js versions.

set -e

printf "🤖 Running Node.js versions tests\n"

# First, make sure the library is built
printf "👷 Building the package\n"
make build > /dev/null

versions=(
  "18"
  "20"
  "22"
  "23"
  "24"
)

for version in "${versions[@]}"; do
  printf "\n🚧 Running tests in Node.js v$version\n\n"
  cmd="node@${version}"

  mise x $cmd -- node test/node/commonjs.cjs
  printf "✅ Package CommonJS is ok!\n"

  mise x $cmd -- node test/node/esm.js
  printf "✅ Package ESM is ok!\n"

  printf "👷 Running unit tests\n"
  TZ=Asia/Singapore mise x $cmd -- pnpm vitest run

  printf "\n✅ Node.js v$version is ok!\n"
done

printf "\n✅ All Node.js tests passed\n"