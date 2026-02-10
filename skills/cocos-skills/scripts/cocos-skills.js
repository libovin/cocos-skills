#!/usr/bin/env node
/**
 * Cocos Skills CLI Wrapper
 * This script forwards all arguments to the compiled CLI
 */

import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const args = process.argv.slice(2);

// The CLI is copied to the skills folder during build, so it's always available here
const cliPath = join(__dirname, '../cli/dist/index.js');

if (cliPath) {
  // Run the CLI directly using node
  const proc = spawn(process.execPath, [cliPath, ...args], {
    stdio: 'inherit',
  });
  proc.on('exit', (code) => {
    process.exit(code ?? 0);
  });
} else {
  // Fallback: use npx to run the CLI (requires global/local npm install)
  const proc = spawn('npx', ['cocos-skills', ...args], {
    stdio: 'inherit',
    shell: true,
  });
  proc.on('exit', (code) => {
    process.exit(code ?? 0);
  });
}
