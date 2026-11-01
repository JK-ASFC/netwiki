// Génère les visuels des installateurs aux couleurs de NetWiki, avec le moteur de rendu d'Electron :
//   - Windows (NSIS) : build/installerSidebar.bmp, build/uninstallerSidebar.bmp (164×314), build/installerHeader.bmp (150×57) ;
//   - macOS (DMG)    : build/background.png (540×380) et build/background@2x.png (1080×760).
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
//   npm run installer-art
const { app, BrowserWindow } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.join(__dirname, '..');
const out = (f) => path.join(root, 'build', f);
const font = (pkg, file) => pathToFileURL(path.join(root, 'node_modules', '@fontsource-variable', pkg, 'files', file)).href;
const icon = 'data:image/png;base64,' + fs.readFileSync(out('icon.png')).toString('base64');

const BASE_CSS = `
  @font-face { font-family: Inter; src: url('${font('inter', 'inter-latin-wght-normal.woff2')}') format('woff2'); font-weight: 100 900; }
  @font-face { font-family: JBMono; src: url('${font('jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')}') format('woff2'); font-weight: 100 800; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 100%; height: 100%; overflow: hidden; }
  body { font-family: Inter, sans-serif; color: #e6edf6; background: #04070d; position: relative; -webkit-font-smoothing: antialiased; }
  .bg { position: absolute; inset: 0; background:
      radial-gradient(90% 60% at 20% 10%, rgba(99,102,241,.38), transparent 70%),
      radial-gradient(80% 60% at 90% 100%, rgba(6,182,212,.30), transparent 70%),
      radial-gradient(120% 90% at 50% 40%, #0d1630 0%, #04070d 70%); }
  .grid { position: absolute; inset: 0; opacity: .5; background-image:
      linear-gradient(rgba(148,163,184,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.07) 1px, transparent 1px);
      background-size: 14px 14px; }
  .term { position: absolute; font-family: JBMono, monospace; color: #34d399; opacity: .28; white-space: pre; line-height: 1.55; }
  .term b { color: #22d3ee; font-weight: 400; }
  .nom { font-family: JBMono, monospace; font-weight: 700; letter-spacing: .5px; }
  .nom i { font-style: normal; color: #22d3ee; }
  .barre { height: 3px; border-radius: 3px; background: linear-gradient(90deg, #6366f1, #22d3ee, #34d399); }
  .doux { color: #8b98ad; }
`;

const TERM = `<b>sw-paris-01#</b> show vlan brief
<b>fw-paris #</b> get system status
<b>admin@pa></b> show session all
<b>root@srv01:~#</b> ss -ltnp
<b>PS C:\\></b> Get-NetIPConfiguration
<b>rtr-lyon#</b> show ip bgp summary
<b>$</b> netwiki --install`;

/** Panneau latéral des pages d'accueil et de fin (installation / désinstallation). */
const sidebar = (sous) => `
  <div class="bg"></div><div class="grid"></div>
  <div class="term" style="left:10px;top:10px;font-size:6.6px">${TERM}</div>
  <div style="position:absolute;left:0;right:0;top:92px;text-align:center">
    <img src="${icon}" style="width:68px;height:68px;filter:drop-shadow(0 6px 18px rgba(99,102,241,.55))">
    <div class="nom" style="font-size:25px;margin-top:10px">Net<i>Wiki</i></div>
    <div class="doux" style="font-size:9.5px;margin-top:6px;line-height:1.35">Le wiki de<br>l'architecte réseau</div>
  </div>
  <div style="position:absolute;left:14px;right:14px;bottom:44px">
    <div style="font-size:9px;color:#cbd5e1;margin-bottom:6px">${sous}</div>
    <div class="barre"></div>
  </div>
  <div class="doux" style="position:absolute;left:14px;right:14px;bottom:14px;font-size:8px;line-height:1.45">
    Open source · licence MIT<br>© 2026 JK-ASFC
  </div>`;

/** Bandeau des pages intermédiaires (dossier, installation) : à droite de l'en-tête. */
const header = `
  <div class="bg"></div>
  <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-right:10px">
    <div style="text-align:right">
      <div class="nom" style="font-size:17px">Net<i>Wiki</i></div>
      <div class="doux" style="font-size:7.5px;margin-top:2px">Installation sécurisée</div>
    </div>
    <img src="${icon}" style="width:38px;height:38px">
  </div>
  <div class="barre" style="position:absolute;left:0;right:0;bottom:0;height:2px;border-radius:0"></div>`;

/** Fond de la fenêtre du DMG macOS : glisser NetWiki vers Applications, sécurité, soutien. */
const dmg = `
  <div class="bg"></div><div class="grid"></div>
  <div class="term" style="right:16px;top:14px;font-size:7.5px;text-align:right;opacity:.2">${TERM}</div>
  <div style="position:absolute;left:28px;top:24px;display:flex;align-items:center;gap:12px">
    <img src="${icon}" style="width:44px;height:44px">
    <div><div class="nom" style="font-size:24px">Net<i>Wiki</i></div>
      <div class="doux" style="font-size:11px;margin-top:2px">Le wiki de l'architecte réseau</div></div>
  </div>
  <div style="position:absolute;left:0;right:0;top:112px;text-align:center;font-size:12.5px;color:#cbd5e1">Glissez NetWiki dans le dossier Applications</div>
  <svg style="position:absolute;left:224px;top:178px" width="92" height="40" viewBox="0 0 92 40">
    <defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="92" y2="0"><stop offset="0" stop-color="#6366f1"/><stop offset="1" stop-color="#22d3ee"/></linearGradient></defs>
    <path d="M4 20 H78" stroke="url(#g)" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 9"/>
    <path d="M70 9 L84 20 L70 31" fill="none" stroke="#22d3ee" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <div style="position:absolute;left:24px;width:350px;bottom:18px;padding:9px 12px;border-radius:9px;font-size:9.5px;line-height:1.5;background:rgba(15,23,42,.72);border:1px solid rgba(148,163,184,.18)">
    <b style="color:#34d399">Sécurité</b> · aucune télémétrie, données locales, mises à jour signées (Ed25519), code source ouvert.<br>
    <span class="doux">Premier lancement : clic droit sur NetWiki → Ouvrir, puis confirmez.</span>
  </div>
  <div style="position:absolute;left:400px;width:140px;top:266px;text-align:center;font-size:10.5px;font-weight:600;color:#f472b6">♥ Soutenir le projet</div>
</div>`;

/** BMP 24 bits (format attendu par NSIS) à partir d'une image Electron. */
function toBmp(img) {
  const { width, height } = img.getSize();
  const bgra = img.toBitmap();
  const rowSize = Math.ceil((width * 3) / 4) * 4;
  const buf = Buffer.alloc(54 + rowSize * height);
  buf.write('BM', 0);
  buf.writeUInt32LE(buf.length, 2);
  buf.writeUInt32LE(54, 10);
  buf.writeUInt32LE(40, 14);
  buf.writeInt32LE(width, 18);
  buf.writeInt32LE(height, 22);
  buf.writeUInt16LE(1, 26);
  buf.writeUInt16LE(24, 28);
  buf.writeUInt32LE(rowSize * height, 34);
  for (let y = 0; y < height; y++) {
    const row = 54 + (height - 1 - y) * rowSize;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      buf[row + x * 3] = bgra[i];
      buf[row + x * 3 + 1] = bgra[i + 1];
      buf[row + x * 3 + 2] = bgra[i + 2];
    }
  }
  return buf;
}

let seq = 0;
async function render(html, width, height, scale = 1) {
  const win = new BrowserWindow({ show: false, width: width * scale, height: height * scale, useContentSize: true, webPreferences: { offscreen: true } });
  const doc = `<!doctype html><html><head><meta charset="utf-8"><style>${BASE_CSS} body{zoom:${scale}}</style></head><body>${html}</body></html>`;
  const file = path.join(app.getPath('temp'), `netwiki-art-${process.pid}-${++seq}.html`);
  fs.writeFileSync(file, doc);
  await win.loadFile(file);
  await win.webContents.executeJavaScript('document.fonts.ready.then(() => new Promise((r) => setTimeout(r, 300)))');
  const img = await win.webContents.capturePage({ x: 0, y: 0, width: width * scale, height: height * scale });
  win.destroy();
  fs.rmSync(file, { force: true });
  return img.resize({ width: width * scale, height: height * scale, quality: 'best' });
}

app.on('window-all-closed', () => {}); // fenêtres de rendu fermées une à une : ne pas quitter entre deux visuels
app.whenReady().then(async () => {
  try {
    fs.writeFileSync(out('installerSidebar.bmp'), toBmp(await render(sidebar('Installation de NetWiki'), 164, 314)));
    fs.writeFileSync(out('uninstallerSidebar.bmp'), toBmp(await render(sidebar('Désinstallation de NetWiki'), 164, 314)));
    fs.writeFileSync(out('installerHeader.bmp'), toBmp(await render(header, 150, 57)));
    fs.writeFileSync(out('background.png'), (await render(dmg, 540, 380)).toPNG());
    fs.writeFileSync(out('background@2x.png'), (await render(dmg, 540, 380, 2)).toPNG());
    console.log('Visuels des installateurs générés dans build/.');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
  app.quit();
});
