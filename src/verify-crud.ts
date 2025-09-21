#!/usr/bin/env node

/**
 * Verify CRUD Implementation
 * Check that all modules have the expected CRUD structure
 */

import * as fs from 'fs';
import * as path from 'path';

const modulesDir = path.join(__dirname, 'modules');

function checkModuleStructure() {
  console.log('🔍 Checking CRUD implementation across all modules...\n');

  const modules = fs
    .readdirSync(modulesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let totalModules = 0;
  let modulesWithDataAccess = 0;
  let modulesWithManagers = 0;

  modules.forEach((moduleName) => {
    totalModules++;
    const modulePath = path.join(modulesDir, moduleName);
    const indexPath = path.join(modulePath, 'index.ts');
    const dataAccessPath = path.join(modulePath, 'data-access');

    if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');

      // Check for data-access export
      const hasDataAccess =
        indexContent.includes("export * from './data-access'") ||
        indexContent.includes('data-access/repositories');

      // Check for manager class
      const hasManager =
        indexContent.includes('extends BaseManager') || indexContent.includes('class.*Manager');

      if (hasDataAccess) modulesWithDataAccess++;
      if (hasManager) modulesWithManagers++;

      const status = [];
      if (hasDataAccess) status.push('✅ Data Access');
      if (hasManager) status.push('✅ Manager');
      if (fs.existsSync(dataAccessPath)) status.push('✅ Repositories');

      console.log(`📁 ${moduleName.padEnd(30)} ${status.join(' ')}`);

      if (status.length === 0) {
        console.log(`   ⚠️  No CRUD implementation detected`);
      }
    }
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total Modules: ${totalModules}`);
  console.log(
    `   With Data Access: ${modulesWithDataAccess} (${Math.round((modulesWithDataAccess / totalModules) * 100)}%)`
  );
  console.log(
    `   With Managers: ${modulesWithManagers} (${Math.round((modulesWithManagers / totalModules) * 100)}%)`
  );

  if (modulesWithDataAccess === totalModules && modulesWithManagers >= totalModules * 0.8) {
    console.log(`\n🎉 CRUD implementation is comprehensive!`);
  } else {
    console.log(`\n📝 CRUD implementation is in progress...`);
  }
}

checkModuleStructure();
