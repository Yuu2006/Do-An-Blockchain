const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create build directory
const buildDir = path.join(__dirname, 'build-manual');
if (fs.existsSync(buildDir)) {
  fs.rmSync(buildDir, { recursive: true });
}
fs.mkdirSync(buildDir, { recursive: true });

// Copy manifest
fs.copyFileSync(
  path.join(__dirname, 'manifest.json'),
  path.join(buildDir, 'manifest.json')
);

// Copy assets
const assetsDir = path.join(buildDir, 'assets');
fs.mkdirSync(assetsDir, { recursive: true });
fs.copyFileSync(
  path.join(__dirname, 'assets', 'icon.png'),
  path.join(assetsDir, 'icon.png')
);

// Build popup with esbuild
console.log('Building popup...');
execSync(`npx esbuild popup.tsx --bundle --outfile=${buildDir}/popup.js --format=iife --jsx=automatic --external:react --external:react-dom`, {
  stdio: 'inherit',
  cwd: __dirname
});

// Create popup.html
const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script src="popup.js"></script>
</body>
</html>`;
fs.writeFileSync(path.join(buildDir, 'popup.html'), popupHtml);

// Build background
console.log('Building background...');
execSync(`npx esbuild background.ts --bundle --outfile=${buildDir}/background.js --format=iife`, {
  stdio: 'inherit',
  cwd: __dirname
});

// Build content script
console.log('Building content script...');
execSync(`npx esbuild contents/interceptor.ts --bundle --outfile=${buildDir}/content.js --format=iife`, {
  stdio: 'inherit',
  cwd: __dirname
});

console.log(`✅ Build complete! Extension built in ${buildDir}`);
console.log('Load this folder in Chrome: chrome://extensions/');
