import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.chitrojaal.app",
  appName: "ChitroJaal",
  webDir: "public",

  server: {
    url: "https://chitrojaal.com/admin",
    cleartext: false,
  },
};

export default config;
