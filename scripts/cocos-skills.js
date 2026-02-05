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

// Path to the actual compiled CLI
const cliPath = join(__dirname, '..', 'cli', 'dist', 'index.js');

// Spawn the actual CLI process
const proc = spawn(process.execPath, [cliPath, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

proc.on('exit', (code) => {
  process.exit(code ?? 0);
});
