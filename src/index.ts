#!/usr/bin/env node

import { startServer } from "./server.js";

startServer().catch((error) => {
  console.error("Failed to start eSIM Agent MCP server:", error);
  process.exit(1);
});
