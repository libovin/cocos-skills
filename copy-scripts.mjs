#!/usr/bin/env node

/**
 * Copy scripts directory to the skills folder after build
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { rmSync } from 'fs';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Copy entire scripts directory to skills folder
const srcDir = path.join(__dirname, 'scripts');
const destDir = path.join(__dirname, 'skills', 'cocos-skills', 'scripts');

// Remove old scripts if exists
if (fs.existsSync(destDir)) {
  rmSync(destDir, { recursive: true, force: true });
}

// Copy entire scripts directory
copyDirectory(srcDir, destDir);
console.log('✓ Copied scripts/ to skills/cocos-skills/scripts/');

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
