// Génère build/icon.png (1024×1024) à partir d'un SVG, avec le moteur de rendu d'Electron.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
//   npm run icon
const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

const SIZE = 1024;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6366f1"/>
      <stop offset="1" stop-color="#06b6d4"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.3" cy="0.2" r="0.9">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="0.6" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="64" y="64" width="896" height="896" rx="200" fill="url(#bg)"/>
  <rect x="64" y="64" width="896" height="896" rx="200" fill="url(#glow)"/>
  <g fill="none" stroke="#ffffff" stroke-width="44" stroke-linecap="round" stroke-linejoin="round">
    <rect x="412" y="222" width="200" height="160" rx="28"/>
    <rect x="222" y="642" width="200" height="160" rx="28"/>
    <rect x="602" y="642" width="200" height="160" rx="28"/>
    <path d="M322 642v-80a40 40 0 0 1 40-40h300a40 40 0 0 1 40 40v80"/>
    <path d="M512 382v140"/>
  </g>
</svg>`;

app.whenReady().then(async () => {
  // Rendu dans un canvas : taille exacte et fond transparent, indépendamment de l'écran.
  const win = new BrowserWindow({ show: false, webPreferences: { offscreen: true } });
  await win.loadURL('data:text/html;charset=utf-8,<html><body></body></html>');
  const dataUrl = await win.webContents.executeJavaScript(`new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = c.height = ${SIZE};
      c.getContext('2d').drawImage(img, 0, 0, ${SIZE}, ${SIZE});
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(${JSON.stringify(svg)});
  })`);
  const out = path.join(__dirname, '..', 'build', 'icon.png');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(dataUrl.split(',')[1], 'base64'));
  console.log('Icône générée :', out);
  app.quit();
});
