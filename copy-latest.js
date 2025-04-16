import fs from 'fs';
import path from 'path';

// Copy calculator files for each widget.
const calculators = ['hedge', 'mowing', 'yard-dirt', 'mulching'];

calculators.forEach(name => {
  const dir = `./dist/${name}`;
  const files = fs.readdirSync(dir);
  const latest = files.find(f => f.startsWith(`${name}-calculator.`) && f.endsWith('.js'));
  if (latest) {
    fs.copyFileSync(
      path.join(dir, latest),
      path.join(dir, `${name}-calculator.js`)
    );
    console.log(`✅ Copied ${latest} → ${name}-calculator.js`);
  } else {
    console.warn(`⚠️  No output found for ${name}`);
  }
});

// Copy manifest.json from the .vite folder to the root of dist.
const viteDir = './dist/.vite';
const manifestSrc = path.join(viteDir, 'manifest.json');
const manifestDest = path.join('./dist', 'manifest.json');

if (fs.existsSync(viteDir) && fs.existsSync(manifestSrc)) {
  fs.copyFileSync(manifestSrc, manifestDest);
  console.log("✅ Copied manifest.json from .vite folder to dist root");
} else {
  console.warn("⚠️  manifest.json not found in dist/.vite");
}

