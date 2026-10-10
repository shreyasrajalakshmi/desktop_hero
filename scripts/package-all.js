// Builds the macOS (Apple Silicon .dmg) and Windows (x64 NSIS .exe) installers and gathers them,
// with clear names, in dist/Desktop-Hero-Installers/.   Usage: npm run package:all
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');
const out = path.join(dist, 'Desktop-Hero-Installers');

// ELECTRON_RUN_AS_NODE (set by some terminals/IDEs) breaks Electron tooling, so never pass it on.
const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

function run(label, args) {
  console.log(`\n==> ${label}`);
  const r = spawnSync('npx', ['electron-builder', ...args], { cwd: root, env, stdio: 'inherit' });
  if (r.status !== 0) {
    console.error(`\n${label} failed (exit ${r.status}).`);
    process.exit(r.status || 1);
  }
}

function find(re, what) {
  const hit = fs.readdirSync(dist).find(f => re.test(f));
  if (!hit) {
    console.error(`Could not find the ${what} in dist/ after building.`);
    process.exit(1);
  }
  return path.join(dist, hit);
}

console.log('==> Cleaning dist/');
fs.rmSync(dist, { recursive: true, force: true });

run('Building macOS .dmg (arm64)', ['--mac', 'dmg', '--arm64']);
run('Building Windows .exe (x64, NSIS)', ['--win', 'nsis', '--x64']);

console.log('\n==> Collecting installers');
fs.mkdirSync(out, { recursive: true });
fs.copyFileSync(find(/-arm64\.dmg$/, 'macOS .dmg'), path.join(out, 'Desktop-Hero-Mac-Installer.dmg'));
fs.copyFileSync(find(/Setup.*\.exe$/, 'Windows setup .exe'), path.join(out, 'Desktop-Hero-Windows-Setup.exe'));
fs.writeFileSync(path.join(out, 'HOW-TO-INSTALL.txt'),
  "Mac: Open 'Desktop-Hero-Mac-Installer.dmg' and drag Desktop Hero to Applications.\n" +
  "Windows: Double-click 'Desktop-Hero-Windows-Setup.exe' and install.\n");

console.log(`\nDone. Installers are in ${path.relative(root, out)}/`);
for (const f of fs.readdirSync(out)) {
  console.log(`  ${f}  (${(fs.statSync(path.join(out, f)).size / 1048576).toFixed(1)} MB)`);
}
