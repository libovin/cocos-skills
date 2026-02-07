import fs from 'fs';

const typesContent = fs.readFileSync('cli/src/types.ts', 'utf8');
const moduleDescContent = fs.readFileSync('cli/src/lib/module-descriptions.ts', 'utf8');

// All modules to check
const modules = ['scene', 'asset-db', 'project', 'builder', 'engine', 'information', 'preferences', 'program', 'programming', 'server', 'device', 'extension'];

let allMatch = true;

modules.forEach(mod => {
  // Extract from VALID_MODULES - match until the closing bracket
  let validActions = [];
  if (mod === 'extension') {
    const validMatch = typesContent.match(new RegExp(mod + ':\\s*\\[([\\s\\S]*?)\\]\\s*as const;'));
    validActions = validMatch ? validMatch[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, '')) : [];
  } else {
    const validMatch = typesContent.match(new RegExp(mod + ':\\s*\\[([\\s\\S]*?)\\]\\s*as const,'));
    validActions = validMatch ? validMatch[1].match(/'([^']+)'/g).map(s => s.replace(/'/g, '')) : [];
  }

  // Extract from ACTION_DESCRIPTIONS - match module block until next module or closing
  let descActions = [];
  if (mod === 'extension') {
    const descMatch = moduleDescContent.match(new RegExp(mod + ':\\s*\\{([\\s\\S]*?)\\}\\s*}\\s*as const;'));
    descActions = descMatch ? descMatch[1].match(/'([^']+)':\s*'[^']*'/g).map(s => s.match(/'([^']+)':/)[1]) : [];
  } else {
    const descMatch = moduleDescContent.match(new RegExp(mod + ':\\s*\\{([\\s\\S]*?)\\},'));
    descActions = descMatch ? descMatch[1].match(/'([^']+)':\s*'[^']*'/g).map(s => s.match(/'([^']+)':/)[1]) : [];
  }

  validActions.sort();
  descActions.sort();

  const validSet = new Set(validActions);
  const descSet = new Set(descActions);

  const missingInDesc = validActions.filter(a => !descSet.has(a));
  const extraInDesc = descActions.filter(a => !validSet.has(a));

  if (missingInDesc.length > 0 || extraInDesc.length > 0) {
    console.log('Module ' + mod + ' has differences:');
    if (missingInDesc.length > 0) console.log('  Missing in ACTION_DESCRIPTIONS (' + missingInDesc.length + '):', missingInDesc.join(', '));
    if (extraInDesc.length > 0) console.log('  Extra in ACTION_DESCRIPTIONS (' + extraInDesc.length + '):', extraInDesc.join(', '));
    allMatch = false;
  } else {
    console.log('Module ' + mod + ': OK (' + validActions.length + ' actions)');
  }
});

if (allMatch) {
  console.log('\nSUCCESS: All modules are consistent between types.ts and module-descriptions.ts');
} else {
  process.exit(1);
}
