test:
	@env TZ=Asia/Singapore pnpm exec vitest run
.PHONY: test

test-watch:
	@env TZ=Asia/Singapore pnpm exec vitest

types:
	@pnpm exec tsc --noEmit

types-watch:
	@pnpm exec tsc --noEmit --watch

test-types: build 
	@pnpm exec attw --pack lib

build: prepare-build
	@pnpm exec tsc -p tsconfig.lib.json 
	@env BABEL_ENV=esm pnpm exec babel src --config-file ./babel.config.json --source-root src --out-dir lib --extensions .js,.ts --out-file-extension .js --quiet
	@env BABEL_ENV=cjs pnpm exec babel src --config-file ./babel.config.json --source-root src --out-dir lib --extensions .js,.ts --out-file-extension .cjs --quiet
	@node copy.mjs
	@make build-cts
	
build-cts:
	@find lib -name '*.d.ts' | while read file; do \
		new_file=$${file%.d.ts}.d.cts; \
		sed 's/\.js"/\.cjs"/g; s/\.ts"/\.cts"/g' $$file > $$new_file; \
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
