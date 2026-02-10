#!/usr/bin/env node

/**
 * Copy scripts and CLI dist to the skills directory after build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { copyFileSync } from 'fs';
import { mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 1. Copy the wrapper script
const srcScript = path.join(__dirname, 'scripts', 'cocos-skills.js');
const destScriptDir = path.join(__dirname, 'skills', 'cocos-skills', 'scripts');
const destScript = path.join(destScriptDir, 'cocos-skills.js');

mkdirSync(destScriptDir, { recursive: true });
copyFileSync(srcScript, destScript);
console.log('✓ Copied cocos-skills.js to skills/cocos-skills/scripts/');

// 2. Copy CLI dist files to skills folder (so the skill is self-contained)
const srcDistDir = path.join(__dirname, 'cli', 'dist');
const destDistDir = path.join(__dirname, 'skills', 'cocos-skills', 'cli', 'dist');

// Remove old dist if exists
if (fs.existsSync(destDistDir)) {
  rmSync(destDistDir, { recursive: true, force: true });
}

// Copy entire dist directory
copyDirectory(srcDistDir, destDistDir);
console.log('✓ Copied cli/dist to skills/cocos-skills/cli/dist/');

function copyDirectory(src, dest) {
  mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(src, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}
