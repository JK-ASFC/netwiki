// Vérifie tout le contenu du wiki dans le vrai moteur de rendu :
// Copyright (c) 2026 JK-ASFC — licence MIT (voir LICENSE).
// liens wiki / relatifs cassés, images introuvables, langages de code inconnus, diagrammes Mermaid invalides, icônes inconnues, titres manquants.
//   npm run validate
const { app } = require('electron');
const path = require('node:path');
const os = require('node:os');
const fs = require('node:fs');

process.env.NETWIKI_AUTOMATION = '1'; // pas d'écran de démarrage ni de question sur les mises à jour
const profile = path.join(os.tmpdir(), 'netwiki-validate-profile');
fs.rmSync(profile, { recursive: true, force: true });
app.setPath('userData', profile);

const CHECK = async () => {
  const { store, hljs, hasIcon, renderMarkdown, renderMermaid } = window.__netwiki;
  const issues = [];
  const sandbox = document.createElement('div');
  sandbox.style.cssText = 'position:absolute;left:-10000px;top:0;width:900px';
  document.body.append(sandbox);

  for (const f of store.folders.values()) {
    if (f.icon && !hasIcon(f.icon)) issues.push({ page: f.path, type: 'icône de dossier inconnue', detail: f.icon });
  }
  let mermaidCount = 0;
  let codeCount = 0;
  let imageCount = 0;
  for (const p of store.pages.values()) {
    if (!p.fm.title) issues.push({ page: p.path, type: 'titre manquant' });
    if (!p.fm.description) issues.push({ page: p.path, type: 'description manquante' });
    if (p.icon && !hasIcon(p.icon)) issues.push({ page: p.path, type: 'icône inconnue', detail: p.icon });

    // Tableaux : chaque ligne doit avoir autant de cellules que l'en-tête (un « | » non échappé, même dans du code, crée une cellule)
    const cells = (line) => line.trim().replace(/^\|/, '').replace(/(?<!\\)\|$/, '').split(/(?<!\\)\|/).length;
    let inFence = false;
    const lines = p.body.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*(```|~~~)/.test(lines[i])) inFence = !inFence;
      if (inFence || !/^\s*\|.*\|\s*$/.test(lines[i]) || !/^\s*\|?\s*:?-{3,}/.test(lines[i + 1] || '')) continue;
      const expected = cells(lines[i]);
      for (let j = i + 2; j < lines.length && /^\s*\|/.test(lines[j]); j++) {
        if (cells(lines[j]) !== expected) issues.push({ page: p.path, type: 'cellules de tableau', detail: `ligne ${j + 1} : ${lines[j].slice(0, 80)}` });
      }
    }

    const { el } = renderMarkdown(p.body, p);
    el.querySelectorAll('a.broken').forEach((a) =>
      issues.push({ page: p.path, type: 'lien cassé', detail: a.dataset.wikilink || a.textContent })
    );
    for (const img of el.querySelectorAll('img')) {
      const src = img.getAttribute('src') || '';
      if (/^(https?:|data:|blob:)/i.test(src)) continue;
      imageCount++;
      const ok = await new Promise((res) => {
        const probe = new Image();
        probe.onload = () => res(true);
        probe.onerror = () => res(false);
        probe.src = img.src;
      });
      if (!ok) issues.push({ page: p.path, type: 'image introuvable', detail: decodeURIComponent(src.replace(/^wikifile:\/\/local\//, '')) });
    }
    el.querySelectorAll('.code-block .lang').forEach((l) => {
      codeCount++;
      const lang = l.textContent.trim();
      if (lang !== 'texte' && !hljs.getLanguage(lang)) issues.push({ page: p.path, type: 'langage de code inconnu', detail: lang });
    });
    if (el.querySelector('pre.mermaid')) {
      sandbox.innerHTML = '';
      sandbox.append(el);
      mermaidCount += el.querySelectorAll('pre.mermaid').length;
      await renderMermaid(sandbox);
      sandbox.querySelectorAll('.mermaid-error').forEach((e) => issues.push({ page: p.path, type: 'Mermaid invalide', detail: e.textContent.slice(0, 200) }));
    }
  }
  sandbox.remove();
  return { pages: store.pages.size, folders: store.folders.size - 1, codeBlocks: codeCount, diagrams: mermaidCount, images: imageCount, issues };
};

app.on('browser-window-created', (_e, win) => {
  win.webContents.setBackgroundThrottling(false);
  win.webContents.once('did-finish-load', async () => {
    let code = 0;
    try {
      await new Promise((r) => setTimeout(r, 2500));
      const res = await win.webContents.executeJavaScript(`(${CHECK.toString()})()`);
      console.log(`Pages : ${res.pages} · dossiers : ${res.folders} · blocs de code : ${res.codeBlocks} · diagrammes : ${res.diagrams} · images : ${res.images}`);
      if (res.issues.length) {
        code = 1;
        console.log(`\n${res.issues.length} problème(s) :`);
        for (const i of res.issues) console.log(` - [${i.type}] ${i.page}${i.detail ? ' → ' + i.detail : ''}`);
      } else console.log('Aucun problème détecté.');
    } catch (err) {
      console.error('Échec de la validation :', err);
      code = 2;
    }
    app.exit(code);
  });
});

require('../main.js');
