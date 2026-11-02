---
title: Présentation, installation et utilisation
description: Suivi des erreurs applicatives auto-hébergé — Sentry self-hosted (licence FSL/BSL, Docker Compose, exigences matérielles élevées, SDK pour tous les langages, regroupement des erreurs, versions et commits, alertes, performances, rejeu de session), GlitchTip (MIT, compatible avec les SDK Sentry, léger : Django, PostgreSQL, Redis, supervision de disponibilité) et Errbit (MIT, compatible Airbrake, Ruby et MongoDB) : installation, DSN, intégration aux applications, alertes vers e-mail, Slack, Teams, rétention et choix.
tags: [sentry, glitchtip, errbit, erreurs, exceptions, apm, sdk]
icon: info
---

Un **outil de suivi d'erreurs** reçoit chaque exception non gérée d'une application (pile d'appels, utilisateur, navigateur, version déployée), **regroupe** les occurrences identiques, alerte et suit leur résolution. Indispensable pour une application web ou mobile en production.

| | **Sentry self-hosted** | **GlitchTip** | **Errbit** |
| --- | --- | --- | --- |
| Licence | FSL (source disponible, devient libre après 2 ans) | MIT | MIT |
| SDK | Sentry (tous langages) | **SDK Sentry** (même DSN) | Airbrake |
| Ressources | Lourdes (≈ 16 Go RAM, Kafka, ClickHouse…) | Légères (Django, PostgreSQL, Redis) | Légères (Ruby, MongoDB) |
| Fonctions | Erreurs, performances, rejeu de session, profilage, cron | Erreurs, performances basiques, disponibilité | Erreurs |

## GlitchTip (recommandé pour l'auto-hébergement simple)

```bash
curl -LO https://glitchtip.com/assets/docker-compose.sample.yml && mv docker-compose.sample.yml compose.yml
# Renseigner SECRET_KEY, GLITCHTIP_DOMAIN=https://erreurs.corp.exemple.fr, EMAIL_URL, puis
docker compose up -d
```

## Sentry self-hosted

```bash
git clone https://github.com/getsentry/self-hosted.git && cd self-hosted
git checkout <dernière version>          # étiquette de version, pas la branche principale
./install.sh                             # crée l'administrateur ; puis docker compose up -d (port 9000)
```

## Intégrer une application

```python
import sentry_sdk
sentry_sdk.init(dsn="https://<clé>@erreurs.corp.exemple.fr/3", environment="prod", release="inventaire@1.8.2", traces_sample_rate=0.1)
```

Le **DSN** se trouve dans les paramètres du projet. Masquer les données personnelles (`send_default_pii=False`, règles de nettoyage côté serveur) et définir une **rétention** courte (90 jours) pour respecter le RGPD.

<!-- CAPTURE: GlitchTip — liste des problèmes d'un projet | _assets/glitchtip-problemes.png -->
<!-- CAPTURE: Sentry — détail d'une erreur avec pile d'appels | _assets/sentry-erreur.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
