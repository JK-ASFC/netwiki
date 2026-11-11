---
title: Vitest, Jest, Mocha et AVA
description: Frameworks de tests JavaScript et TypeScript — Vitest (rapide, fondé sur Vite, compatible API Jest, watch, couverture), Jest (le plus répandu, mocks et snapshots intégrés, jsdom), Mocha (minimaliste, à combiner avec Chai et Sinon) et AVA (exécution concurrente, ESM) ; mocks, snapshots, couverture, rapport JUnit pour la CI et choix selon le projet.
tags: [vitest, jest, mocha, ava, tests, javascript, typescript, node.js]
icon: flask-conical
---

Quatre frameworks de tests pour **JavaScript/TypeScript**, côté Node.js comme navigateur.

## Vitest

**Vitest** s'appuie sur **Vite** : démarrage très rapide, mode *watch* instantané, prise en charge native de TypeScript et ESM, API **compatible Jest**. C'est le choix par défaut des projets Vite (Vue, React, Svelte modernes).

```bash
npm install -D vitest
```

```javascript calcul.test.ts
import { describe, it, expect, vi } from "vitest";
import { diviser } from "./calcul";

describe("diviser", () => {
  it("divise", () => expect(diviser(6, 2)).toBe(3));
  it("rejette zéro", () => expect(() => diviser(1, 0)).toThrow());
});
```

```bash
npx vitest                               # mode watch
npx vitest run                           # une passe (CI)
npx vitest run --coverage
npx vitest run --reporter=junit --outputFile=resultats.xml
```

## Jest

**Jest** (Meta) est historiquement le plus répandu : **mocks**, **snapshots** et couverture intégrés, environnement **jsdom** pour tester du DOM. Très utilisé avec React (Create React App, Next.js).

```bash
npm install -D jest
```

```javascript
test("addition", () => { expect(2 + 2).toBe(4); });
test("objet", () => { expect({ a: 1 }).toEqual({ a: 1 }); });
```

```bash
npx jest ; npx jest --watch ; npx jest --coverage
npx jest --ci --reporters=default --reporters=jest-junit
```

## Mocha

**Mocha** est **minimaliste** : il fournit la structure (`describe`/`it`) et laisse choisir la bibliothèque d'assertions (**Chai**) et de mocks (**Sinon**). Souplesse maximale, mais plus de configuration.

```bash
npm install -D mocha chai sinon
npx mocha 'test/**/*.spec.js'
npx mocha --reporter mocha-junit-reporter
```

## AVA

**AVA** exécute les fichiers de test **en parallèle** et en isolation (processus séparés), avec une API concise et un bon support ESM. Intéressant pour des suites de tests indépendants.

```bash
npm install -D ava
npx ava
```

```javascript
import test from "ava";
test("addition", t => t.is(2 + 2, 4));
```

## En intégration continue

- Lancer en une passe (`vitest run`, `jest --ci`) et produire un rapport **JUnit** (`jest-junit`, `--reporter=junit`, `mocha-junit-reporter`).
- Couverture via **c8** (Vitest) ou l'option `--coverage` (Jest), avec seuil.
- Pour les tests de composants et de bout en bout dans un vrai navigateur, voir [[09-tests-navigateur/01-selenium-cypress-webdriverio|Cypress, Playwright]].

## Choisir

| Besoin | Outil |
| --- | --- |
| Projet Vite/TypeScript moderne | Vitest |
| Écosystème React, tout intégré | Jest |
| Souplesse, assembler ses briques | Mocha (+ Chai, Sinon) |
| Isolation et parallélisme | AVA |

Côté exécution Node pure, le **lanceur de tests intégré à Node.js** (`node --test`) couvre désormais les besoins simples sans dépendance.

Commandes : [[90-aide-memoire|aide-mémoire]].
