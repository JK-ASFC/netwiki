---
title: Playwright
description: Playwright, automatisation de navigateurs (Chromium, Firefox, WebKit) en TypeScript/JavaScript, Python, Java et .NET — installation, enregistreur de tests (codegen), écrire des tests de bout en bout (localisateurs, assertions, authentification réutilisée), exécution en CI et en conteneur, rapports et traces, usages pour l'administrateur (supervision synthétique d'applications web, vérification après mise à jour, captures), bonnes pratiques et sécurité des identifiants.
tags: [playwright, tests, navigateur, automatisation, supervision synthétique, typescript, python]
icon: test-tube
---

**Playwright** (Microsoft, Apache 2.0) pilote de vrais navigateurs (**Chromium**, **Firefox**, **WebKit**) pour tester des applications web de bout en bout. Côté infrastructure, c'est un excellent outil de **supervision synthétique** : un script qui se connecte au portail, passe le SSO, ouvre une page métier et vérifie le résultat détecte des pannes qu'un simple test HTTP ne voit pas.

## Installation

```bash
# Projet Node.js (TypeScript)
npm init playwright@latest            # crée la configuration, un exemple, et installe les navigateurs
npx playwright install --with-deps chromium

# Python
pip install pytest-playwright && playwright install --with-deps chromium
```

Windows et macOS : mêmes commandes (Node.js ou Python requis). Sur un réseau isolé, les navigateurs se téléchargent depuis un miroir interne (`PLAYWRIGHT_DOWNLOAD_HOST`) ou via l'image Docker officielle.

## Enregistrer puis écrire un test

```bash
npx playwright codegen https://intranet.corp.exemple.fr      # enregistre les actions et génère le code
```

```typescript tests/portail.spec.ts
import { test, expect } from '@playwright/test';

test('le portail RH répond et affiche le tableau de bord', async ({ page }) => {
  await page.goto('https://rh.corp.exemple.fr/');
  await page.getByLabel('Identifiant').fill(process.env.SONDE_UTILISATEUR!);
  await page.getByLabel('Mot de passe').fill(process.env.SONDE_MDP!);
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByRole('heading', { name: 'Tableau de bord' })).toBeVisible({ timeout: 15000 });
  await expect(page).toHaveTitle(/RH/);
});
```

| Notion | Bonne pratique |
| --- | --- |
| **Localisateurs** | Par rôle, libellé ou texte visible (`getByRole`, `getByLabel`) plutôt que par sélecteurs CSS fragiles |
| Attentes automatiques | Playwright attend que l'élément soit prêt : pas de pauses fixes |
| Authentification | Se connecter une fois dans une étape de préparation et réutiliser l'**état de stockage** (`storageState`) |
| Identifiants | Variables d'environnement / secrets de la CI, compte de sonde dédié **sans droits** métier |

```bash
npx playwright test                       # tous les tests, navigateurs sans interface
npx playwright test --ui                  # mode interactif
npx playwright show-report                # rapport HTML (captures, vidéos, traces en cas d'échec)
npx playwright show-trace trace.zip       # rejouer pas à pas un échec
```

## Supervision synthétique

- Exécuter les tests toutes les 5 à 15 minutes (tâche planifiée, CI planifiée, conteneur `mcr.microsoft.com/playwright`) et remonter le résultat à la supervision (code de retour, métriques Prometheus via un *pushgateway*, ou intégration Checkmk/Zabbix).
- Mesurer les **temps** des étapes clés (connexion, chargement d'une page) pour suivre l'expérience utilisateur.
- Conserver la **capture d'écran** et la **trace** en cas d'échec : diagnostic immédiat (page d'erreur, certificat, SSO).

Voir aussi [[02-prometheus/02-exporteurs-decouverte|sondes blackbox]] pour les vérifications HTTP simples.

## Bonnes pratiques

- [ ] Tests indépendants et idempotents (pas de création de données en production, ou nettoyage)
- [ ] Compte de sonde exclu des statistiques métier et des alertes de sécurité (déclaré au SOC)
- [ ] Délais raisonnables, réessais limités (`retries: 1`) pour éviter les faux positifs
- [ ] Versions de Playwright et des navigateurs mises à jour ensemble
