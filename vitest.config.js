// eslint-disable-next-line import/no-unresolved
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/test/**/*.test.js", "src/**/*.test.js"],
    setupFiles: "./test/helpers/setup-db.js",
    clearMocks: true,
    threads: false,
  },
});
