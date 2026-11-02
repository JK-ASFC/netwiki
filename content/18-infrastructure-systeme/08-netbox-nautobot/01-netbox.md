---
title: NetBox
description: NetBox Community — source de vérité de l'infrastructure réseau (NetBox Labs, Apache 2.0) : IPAM (agrégats, préfixes, plages, adresses IP, VLAN, VRF, ASN), DCIM (sites, baies, types d'équipements, interfaces, câbles, alimentation), circuits, virtualisation, tenants, champs personnalisés et étiquettes, installation Docker (netbox-docker) ou manuelle (PostgreSQL, Redis, Gunicorn, Nginx), import CSV, API REST et GraphQL, intégrations Ansible et Terraform, scripts personnalisés, greffons, sauvegarde et mises à jour.
tags: [netbox, ipam, dcim, source de vérité, api, ansible, terraform, automatisation réseau]
icon: info
---

**NetBox** (Apache 2.0, NetBox Labs) est devenu la **source de vérité** de référence pour les équipes réseau : on y modélise ce qui **doit** exister (adresses, VLAN, équipements, câbles), puis les outils d'automatisation ([[01-ansible/01-presentation-installation|Ansible]], [[04-terraform/01-presentation-installation|Terraform]], scripts) s'en servent pour configurer et contrôler le réseau réel.

| Domaine | Objets |
| --- | --- |
| **IPAM** | RIR, agrégats, **préfixes** (hiérarchie, rôles, utilisation), plages, **adresses IP**, **VLAN** et groupes, **VRF**, ASN, services |
| **DCIM** | Régions, **sites**, emplacements, **baies** (élévation), fabricants, types d'équipements (bibliothèque *devicetype-library*), **équipements**, interfaces, **câbles**, alimentation |
| Circuits | Opérateurs, circuits, terminaisons |
| Virtualisation | Clusters, machines virtuelles, interfaces |
| Organisation | *Tenants*, contacts, étiquettes, **champs personnalisés** |

## Installation (Docker)

```bash
git clone -b release https://github.com/netbox-community/netbox-docker.git && cd netbox-docker
cat > docker-compose.override.yml <<'EOF'
services:
  netbox:
    ports: ["8000:8080"]
EOF
docker compose pull && docker compose up -d
docker compose exec netbox /opt/netbox/netbox/manage.py createsuperuser
```

Installation manuelle (Ubuntu/Debian) : PostgreSQL, Redis, code de la *release* dans `/opt/netbox`, `configuration.py` (`ALLOWED_HOSTS`, `DATABASE`, `REDIS`, `SECRET_KEY` via `generate_secret_key.py`), `upgrade.sh` (environnement Python, migrations, fichiers statiques), Gunicorn + Nginx, service `netbox` et `netbox-rq`. Publiez en HTTPS ; authentification LDAP/AD (`django-auth-ldap`) ou **SSO OIDC/SAML** ([[05-keycloak/01-presentation-installation|Keycloak]], [[13-authentik/01-presentation-installation|Authentik]]).

## Démarrer la modélisation

1. Organisation : régions, **sites** (`PARIS-DC1`), tenants.
2. Bibliothèque de **types d'équipements** (import YAML de la *devicetype-library* : Cisco, Aruba, Juniper…).
3. **Agrégats et préfixes** (`10.0.0.0/8` → `10.0.20.0/24` rôle *Serveurs*, VLAN 20), VRF si besoin.
4. Équipements (rôle, plateforme, site, baie, position), interfaces, **câbles**.
5. Adresses IP attribuées aux interfaces ; *Next available IP* pour allouer.

Import massif : *Import* (CSV, JSON, YAML) sur chaque liste.

## API

```bash
TOKEN=0123456789abcdef0123456789abcdef01234567      # jeton créé dans Profil → API Tokens
curl -s -H "Authorization: Token $TOKEN" -H "Accept: application/json" \
  "https://netbox.corp.exemple.fr/api/ipam/prefixes/?q=10.0.20.0/24" | jq '.results[] | {prefix, vlan: .vlan.vid, utilization: .utilization}'
# Prochaine adresse libre d'un préfixe (id 42), avec description
curl -s -X POST -H "Authorization: Token $TOKEN" -H "Content-Type: application/json" \
  https://netbox.corp.exemple.fr/api/ipam/prefixes/42/available-ips/ -d '{"description":"srv-web-05","dns_name":"srv-web-05.corp.exemple.fr"}'
```

GraphQL : `https://netbox.corp.exemple.fr/graphql/`. Client Python : `pynetbox`.

## Automatisation

- **Ansible** : collection `netbox.netbox` (inventaire dynamique `nb_inventory`, modules `netbox_device`, `netbox_ip_address`).
- **Terraform** : fournisseur `e-breuninger/netbox` (allocation d'IP pour les VM).
- **Scripts personnalisés** et **webhooks / event rules** (notifier un outil à chaque création).
- Greffons : topologie, BGP, documents, inventaire.

## Exploitation

- Sauvegarde : base PostgreSQL (`pg_dump netbox`) et dossier `media/`.
- Mise à jour : lire les notes de version (migrations), `git checkout <version>` + `./upgrade.sh`, ou nouvelle image netbox-docker.
- Journal des modifications (*Changelog*) : qui a modifié quoi.

Suite : [[02-nautobot|Nautobot]] · interface : [[03-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
