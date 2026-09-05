import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const zipOutput = path.resolve(rootDir, 'apts-ecommerce.zip');
const tempDir = path.resolve(rootDir, '.temp_package');

console.log('📦 Preparing clean APTS E-Commerce project bundle for ZIP download...');

// 1. Clean previous artifacts
if (fs.existsSync(zipOutput)) {
  fs.unlinkSync(zipOutput);
}
if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

// 2. Directories and files to copy
const includeItems = [
  'backend',
  'frontend',
  'traffic-simulator',
  'scripts',
  'package.json',
  'README.md'
];

function copyFolderExclude(src, dest, excludes) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (excludes.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      copyFolderExclude(srcPath, destPath, excludes);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const packageRootDir = path.join(tempDir, 'apts-ecommerce');
fs.mkdirSync(packageRootDir, { recursive: true });

const excludes = ['node_modules', 'dist', '.git', '.cache', '.vite', '.DS_Store'];

for (const item of includeItems) {
  const src = path.join(rootDir, item);
  const dest = path.join(packageRootDir, item);

  if (!fs.existsSync(src)) {
    console.warn(`⚠️ Skipped missing item: ${item}`);
    continue;
  }

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyFolderExclude(src, dest, excludes);
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('🗜️ Creating ZIP archive using PowerShell Compress-Archive...');

try {
  // PowerShell Compress-Archive command
  const psCmd = `powershell -NoProfile -Command "Compress-Archive -Path '${packageRootDir}\\*' -DestinationPath '${zipOutput}' -CompressionLevel Optimal -Force"`;
  execSync(psCmd, { stdio: 'inherit' });
  console.log(`✅ Success! Created: ${zipOutput}`);
} catch (err) {
  console.error('❌ Failed to zip package:', err);
  process.exit(1);
} finally {
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}
