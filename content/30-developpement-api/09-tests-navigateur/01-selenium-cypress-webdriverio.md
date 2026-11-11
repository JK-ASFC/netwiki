---
title: Selenium, Cypress, WebdriverIO, Puppeteer et Robot Framework
description: Automatiser le navigateur pour les tests de bout en bout — Selenium (standard WebDriver W3C, multi-langages et multi-navigateurs, Selenium Grid et conteneurs), Cypress (tout-en-un JavaScript, exécution dans le navigateur, attentes automatiques), WebdriverIO (WebDriver et DevTools, mobile via Appium), Puppeteer (pilotage Chrome par CDP, génération de PDF et captures), Robot Framework (tests en mots-clés lisibles, bibliothèques Browser/Selenium) ; place de Playwright (déjà dans le wiki) et exécution en CI headless.
tags: [selenium, cypress, webdriverio, puppeteer, robot framework, tests e2e, webdriver, navigateur]
icon: mouse-pointer-click
---

Les tests **de bout en bout** (E2E) pilotent un vrai navigateur pour vérifier qu'une application web fonctionne du point de vue de l'utilisateur. [[04-developpement/09-playwright|Playwright]] est déjà présenté dans le wiki ; voici les autres grands outils.

## Selenium

Le **standard** historique, fondé sur le protocole **WebDriver** (norme W3C). Multi-langages (Java, Python, C#, JS, Ruby) et multi-navigateurs (Chrome, Firefox, Edge, Safari). **Selenium Grid** répartit les tests sur plusieurs navigateurs et machines.

```bash
python3 -m pip install selenium
# Grid en conteneurs (hub + navigateurs)
docker run -d -p 4442-4444:4442-4444 --name selenium-hub selenium/hub:latest
docker run -d --link selenium-hub:hub -e SE_EVENT_BUS_HOST=hub selenium/node-chrome:latest
```

```python
from selenium import webdriver
from selenium.webdriver.common.by import By

o = webdriver.ChromeOptions(); o.add_argument("--headless=new")
d = webdriver.Chrome(options=o)       # ou Remote(command_executor="http://grid:4444", ...)
d.get("https://intranet.exemple.fr")
d.find_element(By.NAME, "q").send_keys("procédure")
assert "Résultats" in d.title
d.quit()
```

Universel mais plus verbeux ; incontournable pour tester **plusieurs navigateurs réels** à grande échelle.

## Cypress

**Cypress** (JavaScript) est tout-en-un : exécution **dans** le navigateur, attentes automatiques (moins de tests instables), interface de débogage, captures et vidéos. Historiquement centré Chromium/Firefox.

```bash
npm install -D cypress
npx cypress open                       # mode interactif
npx cypress run                        # mode CI (headless)
```

```javascript cypress/e2e/connexion.cy.js
it("se connecte", () => {
  cy.visit("/login");
  cy.get("#user").type("test");
  cy.get("#pass").type(Cypress.env("mdp"), { log: false });
  cy.contains("Se connecter").click();
  cy.url().should("include", "/tableau-de-bord");
});
```

## WebdriverIO

**WebdriverIO** pilote via WebDriver **ou** DevTools, avec un riche écosystème de services ; il gère aussi le **mobile** (via **Appium**) — utile pour tester applications web et natives avec le même outil.

```bash
npm init wdio@latest .                  # assistant de configuration
npx wdio run wdio.conf.js
```

## Puppeteer

**Puppeteer** pilote **Chrome/Chromium** via le protocole CDP. Moins orienté « framework de test » que « automatisation du navigateur » : idéal pour **captures d'écran**, **génération de PDF**, extraction, en plus des tests.

```bash
npm install puppeteer
```

```javascript
import puppeteer from "puppeteer";
const navigateur = await puppeteer.launch({ headless: "new" });
const page = await navigateur.newPage();
await page.goto("https://intranet.exemple.fr/rapport", { waitUntil: "networkidle0" });
await page.pdf({ path: "rapport.pdf", format: "A4" });
await page.screenshot({ path: "capture.png", fullPage: true });
await navigateur.close();
```

## Robot Framework

**Robot Framework** décrit les tests en **mots-clés lisibles** (proches du langage naturel), accessibles aux non-développeurs. Avec la **Browser Library** (fondée sur Playwright) ou la **SeleniumLibrary**.

```bash
python3 -m pip install robotframework robotframework-browser
rfbrowser init                          # installe les navigateurs (Browser Library)
robot tests/                            # exécute les suites .robot, génère log.html et report.html
```

```text connexion.robot
*** Settings ***
Library    Browser
*** Test Cases ***
Connexion valide
    New Page    https://intranet.exemple.fr/login
    Fill Text    id=user    test
    Fill Secret    id=pass    $MDP
    Click    text=Se connecter
    Get Url    *=    /tableau-de-bord
```

## En intégration continue

Exécuter en mode **headless** (`--headless`, `cypress run`, `headless: "new"`), dans des conteneurs contenant déjà les navigateurs (images officielles Selenium, Cypress, Playwright). Collecter captures, vidéos et rapports **JUnit** comme artefacts. Stabiliser les tests avec des **attentes explicites** et des sélecteurs robustes (`data-testid`).

## Choisir

| Besoin | Outil |
| --- | --- |
| Projet neuf, rapide, multi-navigateurs modernes | [[04-developpement/09-playwright\|Playwright]] |
| Tester de nombreux navigateurs réels, grille | Selenium (Grid) |
| Tout-en-un JS, bon confort de développement | Cypress |
| Web + mobile (Appium) | WebdriverIO |
| Automatisation Chrome, PDF, captures | Puppeteer |
| Tests lisibles par des non-développeurs | Robot Framework |

Commandes : [[90-aide-memoire|aide-mémoire]].
