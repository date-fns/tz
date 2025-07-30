test:
	@env TZ=Asia/Singapore pnpm vitest run
.PHONY: test

test-watch:
	@env TZ=Asia/Singapore pnpm vitest

test-node:
	./scripts/test/node.sh

types:
	@pnpm tsc --noEmit

types-watch:
	@pnpm tsc --noEmit --watch

test-types: build
	@pnpm attw --pack lib

build: prepare-build
	@pnpm tsc -p tsconfig.lib.json
	@env BABEL_ENV=esm pnpm babel src --config-file ./babel.config.json --source-root src --out-dir lib --extensions .js,.ts --out-file-extension .js --quiet
	@env BABEL_ENV=cjs pnpm babel src --config-file ./babel.config.json --source-root src --out-dir lib --extensions .js,.ts --out-file-extension .cjs --quiet
	@node copy.mjs
	@make build-cts

build-cts:
	@find lib -name '*.d.ts' | while read file; do \
		new_file=$${file%.d.ts}.d.cts; \
		cp $$file $$new_file; \
	done

prepare-build:
	@rm -rf lib
	@mkdir -p lib

publish: build
	cd lib && pnpm publish --access public

publish-next: build
	cd lib && pnpm publish --access public --tag next

link:
	@cd lib && pnpm link
