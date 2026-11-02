---
title: Yeti et IntelOwl
description: Outils CTI complémentaires — Yeti (Apache 2.0 : plate-forme de renseignement orientée analystes, observables, entités, indicateurs YARA/Sigma/regex, flux, enrichissements, graphe, Yeti 2 sur ArangoDB, Docker) et IntelOwl (AGPL, Honeynet : enrichissement automatisé de fichiers et d'observables par plus de 100 analyseurs — VirusTotal, AbuseIPDB, Shodan, YARA, ClamAV, CAPE —, playbooks, connecteurs MISP et OpenCTI, API et pyintelowl, Docker), installation, usage en SOC et confidentialité des soumissions.
tags: [yeti, intelowl, cti, enrichissement, observables, analyse de fichiers]
icon: info
---

## Yeti

**Yeti** (*Your Everyday Threat Intelligence*) aide les analystes à organiser leurs connaissances : observables, entités (acteurs, campagnes, malwares), **indicateurs** (règles YARA, Sigma, expressions régulières) et liens entre eux, avec des flux et enrichissements automatiques.

```bash
git clone https://github.com/yeti-platform/yeti-docker.git && cd yeti-docker/prod
docker compose up -d                      # interface http://<hôte>:80 ; créer l'utilisateur avec la commande indiquée dans la documentation
```

## IntelOwl

**IntelOwl** soumet un fichier ou un observable (IP, domaine, URL, hachage) à de nombreux **analyseurs** en une fois et agrège les résultats : gain de temps considérable pour le tri des alertes.

```bash
git clone https://github.com/intelowlproject/IntelOwl && cd IntelOwl
./start prod up                           # interface http://<hôte> ; analyseurs configurés dans l'interface (clés API des services)
```

```bash
pip install pyintelowl
pyintelowl -k "$CLE_API" -u https://intelowl.corp.exemple.fr analyse observable -v 198.51.100.77 -a AbuseIPDB,Shodan_Search
```

> [!WARNING]
> Les analyseurs en ligne transmettent l'observable ou le **fichier** à des services tiers (VirusTotal…) : ne soumettez jamais un document interne confidentiel à un service public ; privilégiez les analyseurs locaux (YARA, ClamAV, sandbox interne) pour ces cas.

Interface : [[04-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
