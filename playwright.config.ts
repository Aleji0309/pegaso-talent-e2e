import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, ".env"),
});

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 30_000,

  reporter: [
    [
      "html",
      {
        outputFolder: "playwright-report",
        open: "never",
      },
    ],
    [
      "json",
      {
        outputFile: "test-results/results.json",
      },
    ],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? "https://www.pegasotalent.com",

    launchOptions: {
      slowMo: 700,
    },

    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],

  outputDir: "test-results/artifacts",
});
