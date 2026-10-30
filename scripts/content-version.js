// Version du contenu officiel : date (UTC) du dernier commit Git, au format AAAA.MM.JJ.HHMM.
// Le même commit donne la même version pour le contenu livré avec l'application et pour le paquet
// hebdomadaire : NetWiki n'applique jamais un contenu plus ancien que celui déjà installé.
// Copyright (c) 2026 JK-ASFC — licence MIT.

const { execFileSync } = require('node:child_process');

function formatContentVersion(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}.${p(date.getUTCMonth() + 1)}.${p(date.getUTCDate())}.${p(date.getUTCHours())}${p(date.getUTCMinutes())}`;
}

function contentVersion(root) {
  let ms = NaN;
  try {
    ms = Number(execFileSync('git', ['log', '-1', '--format=%ct'], { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()) * 1000;
  } catch {}
  return formatContentVersion(new Date(Number.isFinite(ms) && ms > 0 ? ms : Date.now()));
}

module.exports = { contentVersion, formatContentVersion };
