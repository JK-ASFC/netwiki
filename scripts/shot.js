// Outil de test : lance NetWiki avec un profil temporaire, exécute un script optionnel puis capture la fenêtre.
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
//   SHOT_OUT=capture.png SHOT_JS="..." npx electron scripts/shot.js
const { app } = require('electron');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

process.env.NETWIKI_AUTOMATION = '1'; // pas d'écran de démarrage ni de question sur les mises à jour
if (process.env.SHOT_SPLASH === '1') process.env.NETWIKI_FORCE_SPLASH = '1'; // capturer l'écran de démarrage
const out = process.env.SHOT_OUT || path.join(process.cwd(), 'shot.png');
const steps = (process.env.SHOT_JS || '').split('\n---\n').filter((s) => s.trim());
const delay = Number(process.env.SHOT_DELAY || 1800);
const profile = process.env.SHOT_PROFILE || path.join(os.tmpdir(), 'netwiki-shot-profile');

app.setPath('userData', profile);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

app.on('browser-window-created', (_e, win) => {
  win.webContents.setBackgroundThrottling(false);
  win.webContents.on('console-message', (e, level, message) => {
    const msg = e.message ?? message;
    const lvl = e.level ?? level;
    if (lvl === 'error' || lvl === 3 || lvl === 'warning' || lvl === 2) console.log(`[renderer ${lvl}] ${msg}`);
  });
  win.webContents.once('did-finish-load', async () => {
    try {
      await wait(delay);
      for (const [i, js] of steps.entries()) {
        const res = await win.webContents.executeJavaScript(`(async () => { ${js} })()`);
        if (res !== undefined) console.log(`[step ${i}]`, JSON.stringify(res));
        await wait(delay);
      }
      const img = await win.webContents.capturePage();
      fs.writeFileSync(out, img.toPNG());
      console.log('capture :', out);
    } catch (err) {
      console.error('échec :', err);
    }
    app.quit();
  });
});

require('../main.js');
