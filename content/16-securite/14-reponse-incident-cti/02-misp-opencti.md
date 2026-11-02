---
title: MISP et OpenCTI
description: Renseignement sur les menaces (CTI) — MISP (AGPL, CIRCL : partage d'indicateurs de compromission en communautés, événements, attributs, galaxies et taxonomies, flux, synchronisation entre instances, export vers pare-feu, IDS et SIEM, installation par scripts ou Docker, PyMISP) et OpenCTI (Filigran, Apache 2.0 : modèle STIX 2.1, connecteurs MISP, MITRE ATT&CK, AlienVault, CVE, rapports et graphes de connaissance, plate-forme Docker avec Elasticsearch/OpenSearch, Redis, RabbitMQ, MinIO), complémentarité, alimentation des outils de détection et bonnes pratiques TLP.
tags: [misp, opencti, cti, ioc, stix, renseignement, menaces]
icon: info
---

| | **MISP** | **OpenCTI** |
| --- | --- | --- |
| Orientation | **Partage opérationnel** d'indicateurs (IoC) entre organisations | **Connaissance** structurée des menaces (acteurs, campagnes, techniques) |
| Modèle | Événements, attributs, objets | STIX 2.1, graphe |
| Usage typique | Flux d'IoC vers pare-feu, DNS filtrant, SIEM ; communautés CERT/ISAC | Analyse, rapports, suivi d'acteurs et vulnérabilités |

On les combine souvent : MISP comme source d'IoC partagés, OpenCTI comme base de connaissance alimentée par MISP et d'autres connecteurs.

## MISP

```bash
# Ubuntu 24.04 : script d'installation officiel (INSTALL.ubuntu2404.sh dans le dépôt MISP) ; ou Docker :
git clone https://github.com/MISP/misp-docker.git && cd misp-docker && cp template.env .env    # BASE_URL, mots de passe
docker compose up -d                                   # https://<hôte> (admin@admin.test / admin à changer)
```

- **Flux** (*Sync Actions → Feeds*) : activer les flux gratuits (CIRCL OSINT, abuse.ch…) et les communautés (CERT, ISAC sectoriel).
- **Exports** : listes d'IP/domaines pour pare-feu et [[09-dns-filtrants/02-pi-hole|DNS filtrant]], règles Suricata, API REST pour le SIEM.
- Respecter les niveaux **TLP** (CLEAR, GREEN, AMBER, RED) des informations reçues.

```python
from pymisp import PyMISP
misp = PyMISP("https://misp.corp.exemple.fr", CLE_API, ssl=True)
for attr in misp.search(controller="attributes", type_attribute="ip-dst", last="1d", to_ids=True, pythonify=True):
    print(attr.value)
```

## OpenCTI

```bash
git clone https://github.com/OpenCTI-Platform/docker.git opencti-docker && cd opencti-docker && cp .env.sample .env   # générer des UUID et mots de passe
docker compose up -d                         # http://<hôte>:8080
```

Ajouter des **connecteurs** (conteneurs) : MITRE ATT&CK, MISP, CVE, AlienVault OTX, import de fichiers, export STIX. Prévoir de la RAM (16 Go+) pour Elasticsearch/OpenSearch.

Suite : [[03-yeti-intelowl|Yeti et IntelOwl]] · [[90-aide-memoire|aide-mémoire]].
