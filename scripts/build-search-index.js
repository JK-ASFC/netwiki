// Précalcule l'index de recherche dans le vrai moteur de rendu et l'écrit dans dist/search-index.json.
// Garantit un index identique à celui que l'application construirait, en réutilisant exactement son code
// (window.__netwiki.buildSearchIndex). L'application le recharge au lancement si l'empreinte du contenu
// installé correspond, économisant ~2 s de reconstruction. À lancer après « node build.mjs --prod ».
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
const { app } = require('electron');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');
const { contentVersion } = require('./content-version.js');

process.env.NETWIKI_AUTOMATION = '1'; // pas d'écran de démarrage ni de question sur les mises à jour
const profile = path.join(os.tmpdir(), 'netwiki-index-build');
fs.rmSync(profile, { recursive: true, force: true });
app.setPath('userData', profile);

// Métadonnées (minuscules) et données de l'index séparées : l'application lit d'abord les métadonnées
// (empreinte, nombre de pages) pour décider, puis transfère les données volumineuses en chaîne (rapide
// par IPC, contrairement au clone d'un gros objet).
const OUT_META = path.join(__dirname, '..', 'dist', 'search-index.json');
const OUT_DATA = path.join(__dirname, '..', 'dist', 'search-index-data.json');

app.on('browser-window-created', (_e, win) => {
  win.webContents.setBackgroundThrottling(false);
  win.webContents.once('did-finish-load', async () => {
    let code = 0;
    try {
      const res = await win.webContents.executeJavaScript(`(async () => {
        for (let i = 0; i < 300 && (!window.__netwiki || !window.__netwiki.store.pages || window.__netwiki.store.pages.size === 0); i++)
          await new Promise((r) => setTimeout(r, 50));
        return window.__netwiki.buildSearchIndex();
      })()`);
      if (!res || !res.count) throw new Error('index vide');
      fs.writeFileSync(OUT_META, JSON.stringify({ v: contentVersion('.'), sig: res.sig, count: res.count }));
      fs.writeFileSync(OUT_DATA, JSON.stringify(res.idx));
      const kib = (fs.statSync(OUT_DATA).size / 1024).toFixed(0);
      console.log(`Index de recherche précalculé : ${res.count} pages, empreinte ${res.sig}, ${kib} Kio → dist/search-index-data.json`);
    } catch (err) {
      console.error('Échec du précalcul de l’index :', err?.stack || err);
      code = 1;
    }
    app.exit(code);
  });
});

require('../main.js');
