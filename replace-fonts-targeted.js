const fs = require('fs');
const spaceGroteskFiles = [
  './src/components/ui/login-1.tsx',
  './src/app/pricing/page.tsx',
  './src/app/page.tsx',
  './src/app/dashboard/settings/page.tsx',
  './src/components/dashboard/sidebar.tsx',
  './src/app/features/page.tsx'
];

spaceGroteskFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/'Sora'/g, "'Space Grotesk'").replace(/"Sora"/g, '"Space Grotesk"');
    fs.writeFileSync(file, content);
    console.log(`Reverted Space Grotesk in ${file}`);
  }
});

// For waitlist-hero.tsx
let waitlistPath = './src/components/ui/waitlist-hero.tsx';
if (fs.existsSync(waitlistPath)) {
  let lines = fs.readFileSync(waitlistPath, 'utf8').split('\n');
  if (lines.length > 270) {
    if (lines[163].includes('Sora')) lines[163] = lines[163].replace(/Sora/g, 'Inter');
    if (lines[275].includes('Sora')) lines[275] = lines[275].replace(/Sora/g, 'Space Grotesk');
    if (lines[296].includes('Sora')) lines[296] = lines[296].replace(/Sora/g, 'Inter');
  }
  fs.writeFileSync(waitlistPath, lines.join('\n'));
  console.log('Fixed waitlist-hero.tsx');
}

// For navbar.tsx
let navbarPath = './src/components/ui/navbar.tsx';
if (fs.existsSync(navbarPath)) {
  let lines = fs.readFileSync(navbarPath, 'utf8').split('\n');
  if (lines.length > 170) {
    if (lines[52].includes('Sora')) lines[52] = lines[52].replace(/Sora/g, 'Space Grotesk');
    [67, 85, 98, 115, 148, 162, 172].forEach(i => {
      if (lines[i] && lines[i].includes('Sora')) lines[i] = lines[i].replace(/Sora/g, 'Inter');
    });
  }
  fs.writeFileSync(navbarPath, lines.join('\n'));
  console.log('Fixed navbar.tsx');
}
