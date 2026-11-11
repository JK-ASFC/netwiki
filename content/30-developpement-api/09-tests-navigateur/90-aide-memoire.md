---
title: Tests navigateur — aide-mémoire
description: Commandes et exécution headless de Selenium (Grid, WebDriver), Cypress (open, run), WebdriverIO (init, run), Puppeteer (captures, PDF) et Robot Framework (robot, Browser Library).
tags: [aide-mémoire, selenium, cypress, webdriverio, puppeteer, robot framework, e2e]
icon: terminal
---

Explications : [[01-selenium-cypress-webdriverio|Selenium, Cypress, WebdriverIO, Puppeteer et Robot Framework]].

```bash
# Selenium Grid (conteneurs)
docker run -d -p 4444:4444 --name selenium-hub selenium/hub:latest
docker run -d --link selenium-hub:hub -e SE_EVENT_BUS_HOST=hub selenium/node-chrome:latest
python3 -m pip install selenium

# Cypress
npm install -D cypress
npx cypress open          # interactif
npx cypress run --browser chrome    # CI (headless)

# WebdriverIO
npm init wdio@latest . ; npx wdio run wdio.conf.js

# Puppeteer
npm install puppeteer     # télécharge un Chromium

# Robot Framework
python3 -m pip install robotframework robotframework-browser
rfbrowser init
robot --outputdir resultats tests/
```

| En CI | Astuce |
| --- | --- |
| Headless | `--headless=new`, `cypress run`, `headless:"new"` |
| Images prêtes | selenium/*, cypress/included, mcr.microsoft.com/playwright |
| Rapports | JUnit XML + captures/vidéos en artefacts |
| Stabilité | attentes explicites, sélecteurs `data-testid` |
