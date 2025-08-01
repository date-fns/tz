#! /usr/bin/env bash

# This script runs tests against different JavaScript engines.

set -e

printf "🤖 Running JavaScript engines tests\n"

cd test/engines

engines=(
  "hermes"
  "javascriptcore"
)

# Install engines
printf "👷 Installing the engines\n"
engines_list=$(IFS=,; echo "${engines[*]}")
jsvu --os=linux64 --engines=$engines_list > /dev/null

# Add jsvu to PATH
PATH="$PATH:~/.jsvu/bin"

failed=0

for engine in "${engines[@]}"; do
  code="src/$engine.ts"
  bundle="dist/$engine.js"

  if [[ "$engine" == "hermes" ]]; then
    name="Hermes"
    bundle_cmd="pnpm exec metro build $code --out $bundle --minify false"
    engine_cmd="hermes -w"

  elif [[ "$engine" == "javascriptcore" ]]; then
    name="JavaScriptCore"
    bundle_cmd="pnpm exec rolldown --no-treeshake --file=$bundle $code"
    engine_cmd="javascriptcore"

  else
    echo "🛑 Unknown engine $engine"
    exit 1
  fi

  printf "\n🚧 Running tests with $name engine\n\n"

  printf "👷 Building engine bundle $bundle\n"
  eval $bundle_cmd > /dev/null || {
    printf "\n🛑 $name engine bundle build failed\n"
    failed=1
    continue
  }

  printf "👷 Running tests\n"
  $engine_cmd $bundle || {
    printf "\n🛑 $name engine tests failed\n"
    failed=1
    continue
  }

  printf "✅ $name is ok!\n"
done

if [[ $failed -ne 0 ]]; then
  printf "\n🛑 Some JavaScript engines tests failed\n"
  exit 1
fi

printf "\n✅ All JavaScript engines tests passed\n"