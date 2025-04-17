import fs from 'fs';
import path from 'path';

const calculators = ['hedge', 'mowing', 'yardDirt', 'mulching'];

calculators.forEach(name => {
  const dir = path.join('dist', name);
  const files = fs.readdirSync(dir);
  const latest = files.find(f =>
    f.startsWith(`${name}-calculator.`) && f.endsWith('.js')
  );

  if (!latest) {
    console.warn(`⚠️  No output found for ${name}`);
    return;
  }

  // remove any stale un-hashed file first
  files
    .filter(f => f === `${name}-calculator.js`)
    .forEach(f => fs.unlinkSync(path.join(dir, f)));

  // copy the hash-named file to the stable name
  fs.copyFileSync(
    path.join(dir, latest),
    path.join(dir, `${name}-calculator.js`)
  );
  console.log(`✅ Copied ${latest} → ${name}-calculator.js`);
});

