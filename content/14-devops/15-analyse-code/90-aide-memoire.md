---
title: Analyse du code — aide-mémoire
description: Commandes Semgrep (scan, config, SARIF), CodeQL (database create, analyze), PMD (check, cpd), Checkstyle, SpotBugs et greffons Maven, ESLint (init, --fix), Prettier (--check, --write), pre-commit et extension SonarQube for IDE, avec exemples.
tags: [aide-mémoire, semgrep, codeql, pmd, checkstyle, spotbugs, eslint, prettier]
icon: terminal
---

Explications : [[01-outils-analyse|outils d'analyse et de formatage]].

```bash
semgrep scan --config p/default . ; semgrep scan --config p/secrets --sarif --output secrets.sarif .
codeql database create base-codeql --language=javascript --source-root=. 
codeql database analyze base-codeql codeql/javascript-queries --format=sarif-latest --output=codeql.sarif --download
pmd check -d src/main/java -R rulesets/java/quickstart.xml -f text ; pmd cpd --minimum-tokens 100 -d src/main/java
java -jar checkstyle-all.jar -c /google_checks.xml src/main/java/fr/corp/App.java
mvn spotbugs:check pmd:check checkstyle:check
npm init @eslint/config@latest ; npx eslint . --fix
npx prettier . --check ; npx prettier . --write
pip install pre-commit && pre-commit install && pre-commit run --all-files
code --install-extension SonarSource.sonarlint-vscode
```
