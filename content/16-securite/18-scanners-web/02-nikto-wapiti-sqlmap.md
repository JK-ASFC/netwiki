---
title: Nikto, Wapiti, Arachni et sqlmap
description: Scanners web classiques — Nikto (GPL, Perl : fichiers et répertoires dangereux, versions obsolètes, mauvaises configurations du serveur web), Wapiti (GPL, Python : scanner applicatif boîte noire, injections SQL, XSS, inclusions de fichiers, SSRF, rapports HTML), Arachni (framework Ruby, projet arrêté), sqlmap (GPL : détection et exploitation des injections SQL, options --batch, --risk, --level, --dbs, --tables, --dump, utilisation d'une requête capturée, tamper) ; installation Linux, Windows et macOS, utilisation responsable et lecture des résultats.
tags: [nikto, wapiti, arachni, sqlmap, scanner web, injection sql, pentest]
icon: info
---

> [!WARNING]
> Ces outils sont **intrusifs** (sqlmap peut extraire ou modifier des données). Usage réservé aux systèmes dont vous êtes responsable ou couverts par un mandat d'audit écrit, de préférence sur un environnement de recette.

| Outil | Cible | État |
| --- | --- | --- |
| **Nikto** | Configuration du **serveur web** (fichiers sensibles, versions, en-têtes) | Maintenu |
| **Wapiti** | **Application** web en boîte noire (injections, XSS, SSRF, CRLF…) | Maintenu |
| Arachni | Application web | **Abandonné** (dernière version 2017) : utiliser Wapiti, [[03-cybersecurite/02-owasp-zap\|ZAP]] ou [[01-nuclei\|Nuclei]] |
| **sqlmap** | **Injections SQL** sur un paramètre précis | Maintenu |

## Installation

```bash
sudo apt install nikto sqlmap wapiti          # Debian/Ubuntu/Kali ; RHEL : via pipx ou sources
pipx install wapiti3 ; pipx install sqlmap    # Windows, macOS, Linux (Python 3)
git clone https://github.com/sullo/nikto && perl nikto/program/nikto.pl -Version
```

## Exemples

```bash
nikto -h https://recette.corp.exemple.fr -Tuning 123b -o nikto.html -Format htm
wapiti -u https://recette.corp.exemple.fr/ --scope folder -m "sql,xss,file,ssrf,exec" -f html -o rapport-wapiti/
wapiti -u https://recette.corp.exemple.fr/ --cookie cookies.json --skip-crawl --start https://recette.corp.exemple.fr/compte   # zone authentifiée
sqlmap -u "https://recette.corp.exemple.fr/produits?id=12" --batch --level 2 --risk 1 --dbs
sqlmap -r requete.txt -p recherche --batch --dbms=postgresql --tables -D boutique      # requête copiée depuis Burp ou ZAP
```

Les résultats sont des **pistes** : confirmer chaque vulnérabilité manuellement, mesurer l'impact, puis corriger (requêtes paramétrées, échappement des sorties, en-têtes de sécurité, mises à jour) et re-tester.

Suite : [[90-aide-memoire|aide-mémoire]].
