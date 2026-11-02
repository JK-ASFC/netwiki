// NetWiki — test de bout en bout sur émulateur Android (workflow « Test Android »).
// Pilote l'application installée (version de test 1.0.0, pour simuler une mise à jour disponible) avec Playwright :
// premier lancement, mise à jour, notification, PDF (enregistrement, partage, impression), bouton Retour, thème, icône.
// Résultat : captures d'écran et rapport.md dans le dossier passé en argument.
// Copyright (c) 2026 JK-ASFC — licence MIT.
const fs = require('node:fs');
const path = require('node:path');
const { _android: android } = require('playwright-core');

const OUT = path.resolve(process.argv[2] || 'resultats');
const PKG = 'io.netwiki.app';
fs.mkdirSync(OUT, { recursive: true });
const report = [];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (ok, step, detail = '') => {
  report.push(`| ${ok ? '✅' : '❌'} | ${step} | ${String(detail).replace(/\|/g, '\\|').replace(/\s+/g, ' ').slice(0, 300)} |`);
  console.log(ok ? 'OK  ' : 'ÉCHEC', step, detail);
};

(async () => {
  const [device] = await android.devices();
  if (!device) throw new Error('Aucun appareil Android');
  console.log('Appareil :', device.model(), device.serial());
  const sh = async (cmd) => (await device.shell(cmd)).toString();
  let n = 0;
  const shot = async (name) => {
    const file = path.join(OUT, `${String(++n).padStart(2, '0')}-${name}.png`);
    await device.screenshot({ path: file });
    report.push(`\n![${name}](${path.basename(file)})\n`);
  };
  const step = async (name, fn) => {
    try {
      log(true, name, (await fn()) ?? '');
    } catch (err) {
      log(false, name, err.message || err);
    }
  };

  await sh(`pm grant ${PKG} android.permission.POST_NOTIFICATIONS`).catch(() => {});
  await sh(`am force-stop ${PKG}`);
  await sh(`monkey -p ${PKG} -c android.intent.category.LAUNCHER 1`);
  await sleep(700);
  await shot('demarrage');

  const webview = await device.webView({ pkg: PKG }, { timeout: 60000 });
  const page = await webview.page();
  const ev = (fn, arg) => page.evaluate(fn, arg);
  await page.waitForFunction(() => window.__netwiki?.state?.info, null, { timeout: 60000 });
  await sleep(2500);

  await step('Premier lancement : choix des mises à jour', async () => {
    await page.waitForSelector('#overlays .modal h3', { timeout: 20000 });
    const t = await page.textContent('#overlays .modal h3');
    await shot('premier-lancement');
    await page.click('#overlays .modal-foot .btn.primary');
    return t;
  });

  await step('Mise à jour proposée au démarrage (version de test 1.0.0)', async () => {
    await page.waitForSelector('#overlays .modal h3', { timeout: 30000 });
    const t = await page.textContent('#overlays .modal h3');
    await shot('mise-a-jour-proposee');
    if (!/disponible/.test(t)) throw new Error(t);
    return t;
  });

  await step('Bouton Retour : ferme la fenêtre', async () => {
    await sh('input keyevent 4');
    await sleep(800);
    const open = await ev(() => !!document.querySelector('#overlays .modal'));
    if (open) throw new Error('fenêtre toujours ouverte');
    return 'fermée';
  });

  await step('Écran d’accueil', async () => {
    await sleep(500);
    await shot('accueil');
  });

  await step('Ouverture d’un article', async () => {
    await ev(() => window.__netwiki.actions.navigate({ type: 'page', path: '13-conteneurs/01-docker/01-presentation-installation.md' }));
    await sleep(1200);
    await shot('article');
    return ev(() => document.querySelector('.page-title h1')?.textContent);
  });

  await step('Fenêtre Partager / exporter', async () => {
    await page.click('[data-act="share"]');
    await page.waitForSelector('.share-choices');
    await shot('partager');
  });

  await step('Enregistrer en PDF (Téléchargements)', async () => {
    await page.click('[data-v="save"]');
    await page.waitForFunction(() => /PDF enregistré/.test(document.querySelector('#overlays .modal h3')?.textContent || ''), null, { timeout: 30000 });
    await shot('pdf-enregistre');
    const files = await sh('ls -la /sdcard/Download/NetWiki/');
    await sh('input keyevent 4');
    if (!/\.pdf/.test(files)) throw new Error('aucun PDF : ' + files);
    return files.trim().split('\n').pop();
  });

  await step('Partager le PDF (sélecteur d’Android)', async () => {
    await sleep(600);
    await page.click('[data-act="share"]');
    await page.waitForSelector('.share-choices');
    await page.click('[data-v="share"]');
    await sleep(4000);
    await shot('partage-pdf');
    await sh('input keyevent 4');
    await sleep(1000);
  });

  await step('Imprimer (boîte d’impression d’Android)', async () => {
    await page.click('[data-act="share"]');
    await page.waitForSelector('.share-choices');
    await page.click('[data-v="print"]');
    await sleep(5000);
    await shot('impression');
    await sh('input keyevent 4');
    await sleep(1500);
  });

  await step('Partager le texte (Markdown)', async () => {
    await page.click('[data-act="share"]');
    await page.waitForSelector('.share-choices');
    await page.click('[data-v="text"]');
    await sleep(3000);
    await shot('partage-texte');
    await sh('input keyevent 4');
    await sleep(1000);
  });

  await step('Thème clair (barres système)', async () => {
    await page.click('#btn-theme');
    await sleep(1000);
    await shot('theme-clair');
    await page.click('#btn-theme');
    await sleep(500);
  });

  await step('Paramètres → Mises à jour', async () => {
    await ev(() => window.__netwiki.actions.openSettings());
    await sleep(800);
    await ev(() => document.querySelector('#st-auto')?.scrollIntoView({ block: 'center' }));
    await sleep(400);
    await shot('parametres');
    await sh('input keyevent 4');
    await sleep(600);
  });

  await step('Notification de nouvelle version (tâche de fond)', async () => {
    const r = await ev(async () => {
      const n = window.Capacitor.Plugins.NetWiki;
      await n.configureUpdates({ notify: true, contentVersion: '2000.01.01.0000' });
      await n.runBackgroundCheck();
      return (await n.getInfo()).notifications;
    });
    await sleep(1500);
    const dump = await sh('dumpsys notification --noredact');
    await sh('cmd statusbar expand-notifications');
    await sleep(1500);
    await shot('notification');
    await sh('cmd statusbar collapse');
    const found = /NetWiki 1\.\d+\.\d+ est disponible/.test(dump);
    if (!found) throw new Error('notification absente (autorisée : ' + r + ')');
    return 'notification affichée ; nouveaux articles : ' + /Nouveaux articles dans NetWiki/.test(dump);
  });

  await step('Notification touchée → fenêtre de mise à jour', async () => {
    await sh(`am start -n ${PKG}/.MainActivity --es netwiki_action app-update`);
    await page.waitForSelector('#overlays .modal h3', { timeout: 30000 });
    await shot('depuis-notification');
    const t = await page.textContent('#overlays .modal h3');
    await sh('input keyevent 4');
    return t;
  });

  await step('Téléchargement vérifié (refus d’un APK signé par une autre clé)', async () => {
    const r = await ev(async () => {
      const n = window.Capacitor.Plugins.NetWiki;
      const rel = await (await fetch('https://api.github.com/repos/JK-ASFC/netwiki/releases/tags/v1.45.0')).json();
      const list = rel.assets.find((a) => a.name === 'netwiki-update.json');
      const apk = rel.assets.find((a) => a.name === 'app-debug.apk');
      const doc = JSON.parse(atob(JSON.parse((await n.httpGet({ url: list.browser_download_url })).text).payload));
      try {
        await n.downloadUpdate({ url: apk.browser_download_url, sha256: doc.files['app-debug.apk'].sha256, name: 'test.apk' });
        return 'téléchargé sans refus';
      } catch (e) {
        return `${e.code || ''} ${e.message}`;
      }
    });
    if (!/SIGNATURE/.test(r)) throw new Error(r);
    return r;
  });

  await step('Empreinte incorrecte refusée', async () => {
    const r = await ev(async () => {
      const n = window.Capacitor.Plugins.NetWiki;
      try {
        await n.downloadUpdate({ url: 'https://github.com/JK-ASFC/netwiki/releases/download/v1.45.0/netwiki-update.json', sha256: '0'.repeat(64), name: 'x.apk' });
        return 'accepté';
      } catch (e) {
        return e.message;
      }
    });
    if (!/Empreinte/.test(r)) throw new Error(r);
    return r;
  });

  await step('Autorisation « Installer des applications inconnues »', async () => {
    await ev(() => window.Capacitor.Plugins.NetWiki.openInstallSettings());
    await sleep(2500);
    await shot('autorisation-installation');
    await sh('input keyevent 4');
    await sleep(1500);
  });

  await step('Bouton Retour : article → accueil → sortie', async () => {
    await ev(() => window.__netwiki.actions.navigate({ type: 'page', path: '13-conteneurs/01-docker/01-presentation-installation.md' }));
    await sleep(800);
    for (let i = 0; i < 6; i++) {
      if ((await ev(() => window.__netwiki.state.view.type)) === 'home') break;
      await sh('input keyevent 4');
      await sleep(700);
    }
    const v = await ev(() => window.__netwiki.state.view.type);
    await sh('input keyevent 4');
    await sleep(1500);
    const top = await sh('dumpsys activity activities | grep -m1 -E "mResumedActivity|topResumedActivity"');
    await shot('apres-retour');
    if (v !== 'home') throw new Error('vue ' + v);
    return 'accueil puis ' + (top.includes(PKG) ? 'toujours au premier plan' : 'application en arrière-plan');
  });

  await step('Icône dans le tiroir d’applications', async () => {
    await sh('input keyevent 3');
    await sleep(1200);
    await sh('input swipe 540 1900 540 400 300');
    await sleep(1500);
    await shot('tiroir-applications');
  });

  const info = await sh(`dumpsys package ${PKG} | grep -m2 -E "versionName|versionCode"`);
  report.unshift('# Test Android de NetWiki', '', `Appareil : ${device.model()} — ${info.trim().replace(/\s+/g, ' ')}`, '', '| | Étape | Détail |', '| --- | --- | --- |');
  fs.writeFileSync(path.join(OUT, 'rapport.md'), report.join('\n') + '\n');
  await device.close();
  if (report.some((l) => l.startsWith('| ❌'))) process.exitCode = 1;
})().catch((err) => {
  console.error(err);
  fs.writeFileSync(path.join(OUT, 'rapport.md'), report.join('\n') + `\n\nErreur fatale : ${err.stack || err}\n`);
  process.exit(1);
});
