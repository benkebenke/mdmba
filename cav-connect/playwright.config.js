import { defineConfig, devices } from "@playwright/test";

// System tests live in e2e/. Playwright starts the app itself (npm run dev)
// and drives it in a phone-sized Chromium window.
export default defineConfig({
  testDir: "e2e",
  use: { baseURL: "http://localhost:5173", ...devices["Pixel 7"] },
  webServer: {
    command: "npm run dev -- --port 5173 --strictPort",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
