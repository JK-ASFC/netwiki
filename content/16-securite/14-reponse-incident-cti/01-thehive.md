---
title: TheHive
description: TheHive (StrangeBee) — plate-forme de gestion des incidents de sécurité pour SOC et CERT : versions (TheHive 4 libre en fin de vie, TheHive 5 avec licence Community gratuite et éditions payantes), architecture (Cassandra, Elasticsearch, stockage de fichiers), installation (paquets Debian/RHEL, Docker Compose, script), alertes, cas, tâches, observables, modèles, TTP MITRE ATT&CK, Cortex (analyseurs et répondeurs pour enrichir les observables), intégrations MISP, Wazuh et SIEM, API et tableaux de bord.
tags: [thehive, cortex, réponse à incident, soc, cert, misp, observables]
icon: info
---

**TheHive** centralise le traitement des incidents : les **alertes** arrivent du SIEM, de la messagerie ou de [[02-misp-opencti|MISP]], deviennent des **cas** avec tâches, journal, **observables** (IP, domaines, hachages, adresses e-mail) et techniques **MITRE ATT&CK**. **Cortex**, son compagnon, enrichit automatiquement les observables (réputation, sandbox, WHOIS) et peut agir (bloquer une IP).

> [!NOTE]
> TheHive 4 (AGPL) n'est plus maintenu. TheHive 5 est distribué par StrangeBee avec une licence **Community** gratuite (limitée en nombre d'utilisateurs et de fonctions) et des éditions payantes : vérifiez les conditions.

## Installation (Docker Compose de StrangeBee)

```bash
git clone https://github.com/StrangeBeeCorp/docker.git thehive-docker && cd thehive-docker/prod1-thehive
# Ajuster .env / docker-compose.yml : mémoire de Cassandra et Elasticsearch, nom d'hôte, certificats
./scripts/init.sh && docker compose up -d       # interface http(s)://<hôte> (admin@thehive.local / secret à changer)
```

Paquets : dépôt StrangeBee (Debian/Ubuntu, RHEL) avec Cassandra 4 et Elasticsearch 7/8 installés séparément.

## Organisation

| Notion | Rôle |
| --- | --- |
| **Organisation** | Cloisonnement (plusieurs équipes ou clients) |
| **Alerte** | Signalement brut à trier (importer en cas, fusionner, ignorer) |
| **Cas** | Incident : sévérité, TLP/PAP, tâches, observables, TTP |
| **Modèle de cas** | Tâches prédéfinies (hameçonnage, rançongiciel, compte compromis) |

```bash
# Créer une alerte depuis un script ou le SIEM
curl -s -X POST https://thehive.corp.exemple.fr/api/v1/alert -H "Authorization: Bearer $CLE_API" -H 'Content-Type: application/json' -d '{
  "type": "wazuh", "source": "srv-web-01", "sourceRef": "regle-5712-1730541000", "title": "Force brute SSH", "description": "1 200 échecs en 5 min",
  "severity": 2, "observables": [{ "dataType": "ip", "data": "198.51.100.77" }] }'
```

Suite : [[02-misp-opencti|MISP et OpenCTI]] · [[03-yeti-intelowl|Yeti et IntelOwl]] · [[04-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
