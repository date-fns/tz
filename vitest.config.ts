import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/tests.ts"],
    isolate: false,
    sequence: {
      // It will speed up the tests but won't work with Sinon
      // concurrent: true,
    },
  },
});
