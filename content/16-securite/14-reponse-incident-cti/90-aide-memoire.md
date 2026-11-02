---
title: Réponse à incident et CTI — aide-mémoire
description: Commandes et API de TheHive (api/v1 alert, case, query ; état des services), Cortex (analyse d'un observable), MISP (API REST restSearch, PyMISP, cake console : Admin, Server, mise à jour des galaxies et taxonomies, flux), OpenCTI (docker compose, connecteurs, API GraphQL) et IntelOwl (pyintelowl, start) avec exemples.
tags: [aide-mémoire, thehive, cortex, misp, opencti, intelowl]
icon: terminal
---

Explications : [[01-thehive|TheHive]] · [[02-misp-opencti|MISP et OpenCTI]] · [[03-yeti-intelowl|Yeti et IntelOwl]].

```bash
H="Authorization: Bearer $CLE_API"
curl -s -H "$H" -H 'Content-Type: application/json' -X POST https://thehive/api/v1/query -d '{"query":[{"_name":"listCase"},{"_name":"filter","_field":"status","_value":"New"}]}' | jq '.[].title'
curl -s -H "Authorization: $CLE_MISP" -H 'Accept: application/json' -H 'Content-Type: application/json' -X POST https://misp/attributes/restSearch -d '{"type":"ip-dst","last":"1d","to_ids":true,"returnFormat":"text"}'
sudo -u www-data /var/www/MISP/app/Console/cake Admin updateGalaxies ; sudo -u www-data /var/www/MISP/app/Console/cake Admin updateTaxonomies
sudo -u www-data /var/www/MISP/app/Console/cake Server fetchFeed 1 all
docker compose ps ; docker compose logs -f opencti ; docker compose logs -f connector-mitre
pyintelowl -k "$CLE" -u https://intelowl analyse file -f suspect.docx -a Yara_Scan,ClamAV ; ./start prod down
```
