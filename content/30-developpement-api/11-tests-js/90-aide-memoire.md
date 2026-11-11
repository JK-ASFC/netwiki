---
title: Tests JavaScript — aide-mémoire
description: Commandes Vitest, Jest, Mocha et AVA (exécution, watch, couverture, rapports JUnit pour la CI) et le lanceur intégré node --test.
tags: [aide-mémoire, vitest, jest, mocha, ava, javascript, tests]
icon: terminal
---

Explications : [[01-vitest-jest-mocha|Vitest, Jest, Mocha et AVA]].

```bash
# Vitest
npm install -D vitest
npx vitest              # watch
npx vitest run --coverage
npx vitest run --reporter=junit --outputFile=resultats.xml

# Jest
npm install -D jest jest-junit
npx jest --watch
npx jest --ci --coverage --reporters=default --reporters=jest-junit

# Mocha (+ Chai, Sinon)
npm install -D mocha chai sinon mocha-junit-reporter
npx mocha 'test/**/*.spec.js' --reporter mocha-junit-reporter

# AVA
npm install -D ava
npx ava

# Node.js intégré (sans dépendance)
node --test
```
