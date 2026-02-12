#!/usr/bin/env node

/**
 * Clean build artifacts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clean main scripts/dist
const distDir = path.join(__dirname, 'scripts', 'dist');
let cleaned = false;
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
  console.log('✓ Removed scripts/dist');
  cleaned = true;
}

// Clean copied dist in skills folder
const skillsDistDir = path.join(__dirname, 'skills', 'cocos-skills', 'scripts', 'dist');
if (fs.existsSync(skillsDistDir)) {
  fs.rmSync(skillsDistDir, { recursive: true, force: true });
  console.log('✓ Removed skills/cocos-skills/scripts/dist');
  cleaned = true;
}

if (!cleaned) {
  console.log('✓ No build artifacts found');
}

