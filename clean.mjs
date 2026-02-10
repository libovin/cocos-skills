#!/usr/bin/env node

/**
 * Clean build artifacts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clean main cli/dist
const distDir = path.join(__dirname, 'cli', 'dist');
let cleaned = false;
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✓ Removed cli/dist');
  cleaned = true;
}

// Clean copied dist in skills folder
const skillsDistDir = path.join(__dirname, 'skills', 'cocos-skills', 'cli', 'dist');
if (fs.existsSync(skillsDistDir)) {
  fs.rmSync(skillsDistDir, { recursive: true, force: true });
  console.log('✓ Removed skills/cocos-skills/cli/dist');
  cleaned = true;
}

if (!cleaned) {
  console.log('✓ No build artifacts found');
}

