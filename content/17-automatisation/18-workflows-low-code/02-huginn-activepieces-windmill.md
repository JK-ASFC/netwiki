---
title: Huginn, Activepieces et Windmill
description: Plates-formes d'automatisation auto-hébergées — Huginn (MIT, Ruby : agents qui surveillent le web, les flux RSS, les API et réagissent ; scénarios ; Docker), Activepieces (MIT pour l'édition communautaire : alternative à Zapier avec pièces pour des centaines d'applications, flux avec branches et boucles, IA, Docker Compose avec PostgreSQL et Redis) et Windmill (AGPL : scripts Python, TypeScript, Go, Bash, SQL transformés en interfaces et workflows, planification, droits, secrets, workers, Docker Compose, Helm), comparaison avec n8n et Node-RED, et usages pour l'exploitation.
tags: [huginn, activepieces, windmill, automatisation, workflows, zapier, scripts]
icon: info
---

| Outil | Pour qui | Points forts |
| --- | --- | --- |
| **Huginn** | Techniciens curieux | **Agents** qui surveillent sites, flux, API et déclenchent des actions ; ancien mais stable |
| **Activepieces** | Équipes métier et support | Interface simple « déclencheur → étapes », nombreuses intégrations SaaS, IA |
| **Windmill** | Équipes d'exploitation et développeurs | Transformer des **scripts** en outils internes avec formulaires, planifications, droits et journal |
| [[05-ia-productivite/06-n8n\|n8n]] | Intégrateurs | Très riche, licence *Sustainable Use* |

## Huginn

```bash
docker run -d --name huginn -p 3000:3000 -v huginn-data:/var/lib/mysql ghcr.io/huginn/huginn     # compte initial admin / password à changer
```

Exemple : *Website Agent* (surveille la page d'avis de sécurité d'un éditeur) → *Trigger Agent* (mot clé « critique ») → *Email Agent* ou *Post Agent* (webhook Teams).

## Activepieces

```bash
git clone https://github.com/activepieces/activepieces.git && cd activepieces
sh tools/deploy.sh                       # génère le fichier .env (clés, mots de passe)
docker compose -p activepieces up -d     # http://<hôte>:8080
```

Flux : déclencheur (webhook, planification, nouvel e-mail, formulaire) → étapes (pièces : Microsoft 365, Google, Slack, HTTP, bases de données, code JavaScript) avec branches et boucles.

## Windmill

```bash
curl -O https://raw.githubusercontent.com/windmill-labs/windmill/main/docker-compose.yml
curl -O https://raw.githubusercontent.com/windmill-labs/windmill/main/Caddyfile
curl -o .env https://raw.githubusercontent.com/windmill-labs/windmill/main/.env
docker compose up -d                      # http://<hôte> (admin@windmill.dev / changeme à changer)
```

```python
# Script Windmill : les paramètres deviennent un formulaire, l'exécution est journalisée
import requests

def main(prefixe: str, netbox_token: str):
    r = requests.get("https://netbox.corp.exemple.fr/api/ipam/prefixes/", params={"q": prefixe},
                     headers={"Authorization": f"Token {netbox_token}"}, timeout=10)
    return [p["prefix"] for p in r.json()["results"]]
```

Les secrets sont stockés en **ressources** et **variables** chiffrées ; les **workers** peuvent être dédiés (réseau d'administration, accès SSH).

<!-- CAPTURE: Activepieces — éditeur de flux | _assets/activepieces-flux.png -->
<!-- CAPTURE: Windmill — script avec formulaire généré | _assets/windmill-script.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
