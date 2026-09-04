import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const zipOutput = path.resolve(rootDir, 'amazon-store-system.zip');
const tempDir = path.resolve(rootDir, '.temp_package');

console.log('📦 Preparing clean project bundle for ZIP download...');

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
  'supabase',
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

const packageRootDir = path.join(tempDir, 'amazon-store-system');
fs.mkdirSync(packageRootDir, { recursive: true });

const excludes = ['node_modules', 'dist', '.git', '.cache', '.vite', '.DS_Store'];

for (const item of includeItems) {
  const itemSrc = path.join(rootDir, item);
  const itemDest = path.join(packageRootDir, item);

  if (!fs.existsSync(itemSrc)) continue;

  const stat = fs.statSync(itemSrc);
  if (stat.isDirectory()) {
    copyFolderExclude(itemSrc, itemDest, excludes);
  } else {
    fs.copyFileSync(itemSrc, itemDest);
  }
}

console.log('📦 Compressing archive...');

try {
  if (process.platform === 'win32') {
    execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\amazon-store-system\\*' -DestinationPath '${zipOutput}' -Force"`, {
      stdio: 'inherit'
    });
  } else {
    execSync(`cd "${tempDir}" && zip -r "${zipOutput}" amazon-store-system`, {
      stdio: 'inherit'
    });
  }

  // Clean temp directory
  fs.rmSync(tempDir, { recursive: true, force: true });

  const stats = fs.statSync(zipOutput);
  const mb = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`\n🎉 Success! Created: ${zipOutput} (${mb} MB)`);
  console.log(`Ready for user download.\n`);
} catch (err) {
  console.error('Failed to create ZIP archive:', err);
  process.exit(1);
}
