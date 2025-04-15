import fs from 'fs';
import path from 'path';

const calculators = ['hedge', 'mowing', 'mulching'];

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
