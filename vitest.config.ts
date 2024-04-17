import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/tests.ts"],
    isolate: false,
    sequence: {
      concurrent: true,
    },
  },
});
