const fs = require('fs');
const path = require('path');

const utilsDir = path.resolve(__dirname, '..');
const repoRoot = path.resolve(utilsDir, '..');
const target = path.join(utilsDir, 'node_modules');
const linkPath = path.join(repoRoot, 'node_modules');

if (!fs.existsSync(target)) {
  process.exit(0);
}

if (fs.existsSync(linkPath)) {
  process.exit(0);
}

try {
  const type = process.platform === 'win32' ? 'junction' : 'dir';
  fs.symlinkSync(target, linkPath, type);
  console.log('Created root node_modules link for build resolution');
} catch (error) {
  console.log('Skipping node_modules link:', error.message);
}
