---
title: Outils d'analyse et de formatage du code
description: Analyse statique dans l'éditeur et en CI — SonarQube for IDE (ex-SonarLint : VS Code, IntelliJ, Visual Studio, Eclipse, mode connecté), Semgrep CE (LGPL : règles de sécurité multi-langages, semgrep scan --config, SARIF, Docker), CodeQL CLI (GitHub : bases de code et requêtes, gratuit pour le code open source et la recherche, licence GitHub Advanced Security pour le code privé), PMD 7, Checkstyle et SpotBugs (Java, Maven et Gradle), ESLint (configuration plate eslint.config.js) et Prettier, intégration Git (pre-commit) et pipelines CI.
tags: [sonarlint, semgrep, codeql, pmd, checkstyle, spotbugs, eslint, prettier, analyse statique]
icon: scan-search
---

Ces outils complètent [[07-sonarqube/01-presentation-installation|SonarQube]] : ils signalent erreurs, mauvaises pratiques et failles **avant** la fusion, dans l'éditeur, en *pre-commit* ou en CI.

| Outil | Licence | Langages | Rôle |
| --- | --- | --- | --- |
| **SonarQube for IDE** (ex-SonarLint) | LGPL | Nombreux | Analyse en direct dans l'éditeur, règles alignées sur SonarQube |
| **Semgrep CE** | LGPL 2.1 | 30+ | Règles de sécurité et de style par motifs, simples à écrire |
| **CodeQL CLI** | Conditions GitHub | C/C++, C#, Go, Java/Kotlin, JS/TS, Python, Ruby, Swift | Analyse sémantique (flux de données), requêtes QL |
| **PMD** | BSD | Java, Apex, JS, XML… | Mauvaises pratiques, code mort, duplication (CPD) |
| **Checkstyle** | LGPL | Java | Conventions de style (Google, Sun) |
| **SpotBugs** | LGPL | Bytecode Java | Bogues probables (successeur de FindBugs) ; extension FindSecBugs |
| **ESLint** | MIT | JavaScript, TypeScript | Linter de référence de l'écosystème JS |
| **Prettier** | MIT | JS, TS, CSS, HTML, JSON, YAML, Markdown | **Formatage** automatique, sans débat de style |

## SonarQube for IDE

Extension des éditeurs **VS Code**, **IntelliJ IDEA** (et IDE JetBrains), **Visual Studio** et **Eclipse** (anciennement SonarLint). Fonctionne seule, ou en **mode connecté** à un serveur SonarQube (ou SonarQube Cloud) pour partager le profil de règles et les problèmes ignorés de l'équipe.

```powershell
code --install-extension SonarSource.sonarlint-vscode
```

## Semgrep CE

```bash
python3 -m pip install semgrep          # ou : brew install semgrep ; Docker : semgrep/semgrep
semgrep scan --config p/default .
semgrep scan --config p/owasp-top-ten --sarif --output semgrep.sarif .
semgrep scan --config regles-internes.yml src/
```

Exemple de règle interne (`regles-internes.yml`) :

```yaml
rules:
  - id: pas-de-verify-false
    pattern: requests.$METHOD(..., verify=False, ...)
    message: Vérification TLS désactivée
    languages: [python]
    severity: ERROR
```

Les configurations du registre public (`p/...`) envoient des statistiques anonymes à semgrep.dev ; les fichiers de règles locaux n'en envoient pas sans connexion à un compte.

## CodeQL CLI

```bash
codeql database create base-codeql --language=python --source-root=.
codeql database analyze base-codeql codeql/python-queries --format=sarif-latest --output=codeql.sarif --download
```

Licence : utilisation gratuite pour le **code open source** et la recherche académique ; pour du code privé d'entreprise, une licence GitHub (Advanced Security / Code Security) est nécessaire. Binaires pour Linux, Windows et macOS (archive `codeql-bundle`), intégré à GitHub Actions (`github/codeql-action`).

## PMD, Checkstyle, SpotBugs (Java)

```bash
pmd check -d src/main/java -R rulesets/java/quickstart.xml -f text      # PMD 7
pmd cpd --minimum-tokens 100 -d src/main/java                            # recherche de duplications
java -jar checkstyle-all.jar -c /google_checks.xml src/main/java/fr/corp/App.java
mvn spotbugs:check ; mvn pmd:check ; mvn checkstyle:check                # greffons Maven
```

Gradle : plugins `pmd`, `checkstyle` (intégrés) et `com.github.spotbugs`. Les règles et seuils se versionnent dans le dépôt pour que la CI et les postes appliquent la même politique.

## ESLint et Prettier

```bash
npm init @eslint/config@latest          # crée eslint.config.js (configuration « plate », seule prise en charge des versions récentes)
npx eslint .
npx eslint . --fix
npm install --save-dev --save-exact prettier
npx prettier . --check
npx prettier . --write
```

Faire cohabiter les deux : laisser **Prettier** gérer la mise en forme et **ESLint** la qualité (désactiver les règles de style d'ESLint avec `eslint-config-prettier`). Fichiers à ignorer : `.prettierignore` et la clé `ignores` d'`eslint.config.js`.

## Intégration

- **pre-commit** (framework Python) : `.pre-commit-config.yaml` avec les dépôts de hooks de Semgrep, ESLint, Prettier, puis `pre-commit install`.
- **CI** : produire des rapports **SARIF** (Semgrep, CodeQL, ESLint via formateur) importables dans GitLab, GitHub ou [[07-sonarqube/01-presentation-installation|SonarQube]], et faire échouer le pipeline au-delà d'un seuil (*quality gate*).

Commandes : [[90-aide-memoire|aide-mémoire]].
