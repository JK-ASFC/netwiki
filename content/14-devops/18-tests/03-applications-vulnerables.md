---
title: OWASP Juice Shop et WebGoat
description: Applications web volontairement vulnérables pour la formation et l'essai des outils de sécurité — OWASP Juice Shop (MIT : boutique moderne Angular/Node.js couvrant le Top 10 OWASP, tableau des scores, défis, mode CTF ; Docker bkimminich/juice-shop, port 3000) et OWASP WebGoat (leçons guidées Java/Spring, WebWolf ; Docker webgoat/webgoat, ports 8080 et 9090, fuseau horaire TZ), avec règles d'isolement réseau.
tags: [owasp, juice shop, webgoat, sécurité, formation, pentest, ctf]
icon: bug
---

Ces applications **contiennent volontairement des failles** : injection SQL, XSS, contrôle d'accès cassé, désérialisation, XXE… Elles servent à former les développeurs et à tester les scanners ([[07-sonarqube/01-presentation-installation|SonarQube]], [[15-analyse-code/01-outils-analyse|Semgrep]], OWASP ZAP).

> **Ne jamais les exposer** sur Internet ni sur le réseau de production : les lier à `127.0.0.1` ou les placer dans un réseau isolé de formation, puis les supprimer après usage.

| | OWASP Juice Shop | OWASP WebGoat |
| --- | --- | --- |
| Technologie | Node.js, Angular | Java, Spring Boot |
| Approche | Boutique réaliste, défis à trouver soi-même, tableau des scores | Leçons guidées avec explications et exercices |
| Port | 3000 | 8080 (WebGoat), 9090 (WebWolf) |
| Licence | MIT | GPL 2.0 |

## OWASP Juice Shop

```bash
docker run -d --name juice-shop -p 127.0.0.1:3000:3000 bkimminich/juice-shop
# sans Docker (Linux, Windows, macOS) : archive de la version publiée, puis npm start
```

Ouvrir `http://localhost:3000`. Le **tableau des scores** (à trouver : c'est le premier défi) suit la progression. Pour un CTF interne, le mode CTF génère des drapeaux compatibles avec CTFd et FBCTF ; plusieurs instances (une par équipe) se déploient avec MultiJuicer sur Kubernetes.

## OWASP WebGoat

```bash
docker run -it -p 127.0.0.1:8080:8080 -p 127.0.0.1:9090:9090 -e TZ=Europe/Paris webgoat/webgoat
# Java 25 : java -jar webgoat-<version>.jar  (--webgoat.port=… --webwolf.port=…)
```

WebGoat : `http://localhost:8080/WebGoat` (créer un compte local) ; **WebWolf** (`http://localhost:9090/WebWolf`) simule le serveur de l'attaquant (boîte mail, hébergement de fichiers). La variable `TZ` doit correspondre au fuseau de l'utilisateur pour certaines leçons. Pour passer par un proxy d'interception (ZAP, Burp), déclarer des noms d'hôtes (`WEBGOAT_HOST`, `WEBWOLF_HOST`) dans le fichier hosts plutôt que `localhost`.

Commandes : [[90-aide-memoire|aide-mémoire]].
