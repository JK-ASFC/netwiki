---
title: Matrix, Synapse et Element Server Suite
description: Matrix — protocole ouvert de messagerie fédérée et chiffrée de bout en bout (salons, espaces, appels, ponts vers d'autres messageries), choix d'un serveur domestique, Synapse (Element, AGPL : implémentation de référence en Python, PostgreSQL, workers, délégation .well-known, fédération, inscription, administration par API), Element Server Suite Community (déploiement Helm de Synapse, Matrix Authentication Service, Element Web, Element Call et LiveKit, Ingress et certificats), installation par paquets Debian/Ubuntu ou Docker, reverse proxy, sauvegarde et administration (synapse-admin, API admin), et usage en entreprise (SSO OIDC, ponts, clients Element).
tags: [matrix, synapse, element, ess, messagerie, chiffrement, fédération]
icon: info
---

**Matrix** est un protocole **ouvert** de messagerie instantanée : chaque organisation héberge son **serveur domestique** (*homeserver*), les utilisateurs (`@jk:corp.exemple.fr`) discutent dans des **salons** chiffrés de bout en bout, et les serveurs peuvent se **fédérer** (comme le courriel). Il est utilisé par de nombreuses administrations (dont **Tchap** pour l'État français) et des entreprises pour garder la maîtrise de leurs échanges. Le client de référence est **Element** (web, bureau, mobile).

| Serveur | Langage | Licence | État |
| --- | --- | --- | --- |
| **Synapse** | Python | AGPL | Référence, le plus complet |
| [[02-dendrite-conduit-continuwuity\|Dendrite]] | Go | AGPL | Maintenance réduite |
| [[02-dendrite-conduit-continuwuity\|Conduit / Continuwuity]] | Rust | Apache 2.0 | Légers, petites instances |

## Synapse (paquets Debian/Ubuntu)

```bash
sudo apt install -y lsb-release wget apt-transport-https
sudo wget -O /usr/share/keyrings/matrix-org-archive-keyring.gpg https://packages.matrix.org/debian/matrix-org-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/matrix-org-archive-keyring.gpg] https://packages.matrix.org/debian/ $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/matrix-org.list
sudo apt update && sudo apt install matrix-synapse-py3       # nom du serveur demandé : corp.exemple.fr (définitif !)
sudo apt install postgresql && sudo -u postgres createuser --pwprompt synapse && sudo -u postgres createdb --encoding=UTF8 --locale=C --template=template0 --owner=synapse synapse
```

```yaml
# /etc/matrix-synapse/conf.d/corp.yaml
public_baseurl: https://matrix.corp.exemple.fr/
database:
  name: psycopg2
  args: { user: synapse, password: MdpSynapse2026, database: synapse, host: localhost }
enable_registration: false
federation_domain_whitelist: [corp.exemple.fr, partenaire.exemple.org]     # ou retirer pour fédérer avec tous
```

Le **nom du serveur** (`corp.exemple.fr`) apparaît dans tous les identifiants et ne peut plus changer ; le service peut tourner ailleurs (`matrix.corp.exemple.fr`) grâce à la **délégation** : fichiers `https://corp.exemple.fr/.well-known/matrix/server` (`{"m.server": "matrix.corp.exemple.fr:443"}`) et `…/client`. Reverse proxy [[03-nginx/01-presentation|NGINX]] vers `localhost:8008` pour `/_matrix` et `/_synapse/client`.

```bash
sudo systemctl restart matrix-synapse
register_new_matrix_user -c /etc/matrix-synapse/homeserver.yaml http://localhost:8008      # premier administrateur
```

Docker : `matrixdotorg/synapse`. Authentification d'entreprise : **OIDC** ([[05-keycloak/01-presentation-installation|Keycloak]], Entra ID) ou, mieux, **Matrix Authentication Service**.

## Element Server Suite Community (Kubernetes)

**ESS Community** (Element) déploie avec un chart Helm unique : Synapse, **Matrix Authentication Service**, **Element Web**, **Element Call** (visioconférence avec LiveKit) et les Ingress, sur un petit cluster (par exemple [[05-k3s/01-presentation-installation|K3s]]).

```bash
helm upgrade --install --namespace ess --create-namespace ess oci://ghcr.io/element-hq/ess-helm/matrix-stack -f nom-de-serveur.yaml -f hotes.yaml -f tls.yaml
```

## Exploitation

- Sauvegarde : base PostgreSQL + `media_store` + clés de signature (`*.signing.key`).
- Administration : API admin (`/_synapse/admin/v2/users`), outil web **synapse-admin**.
- Ponts (*bridges*) vers d'autres messageries (Slack, Teams, IRC, Signal, WhatsApp) : mautrix-* — attention aux conditions d'utilisation des services tiers.

Suite : [[02-dendrite-conduit-continuwuity|Dendrite, Conduit et Continuwuity]] · [[03-interface-graphique|Element]] · [[90-aide-memoire|aide-mémoire]].
