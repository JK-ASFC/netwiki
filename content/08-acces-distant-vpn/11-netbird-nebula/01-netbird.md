---
title: NetBird
description: NetBird — réseau maillé WireGuard et accès Zero Trust open source (BSD-3, composants serveur AGPL) : architecture (management, signal, relay/TURN, tableau de bord, agents), cloud ou auto-hébergement (script getting-started avec Zitadel, ou IdP existant Keycloak, Authentik, Entra ID), installation des clients sur Linux, Windows, macOS, Android, iOS, clés d'installation, groupes et politiques d'accès, routes réseau et routeurs de sortie, DNS, contrôle de posture, SSH, API et comparaison avec Tailscale/Headscale.
tags: [netbird, wireguard, mesh, ztna, zero trust, vpn, sso]
icon: info
---

**NetBird** relie postes, serveurs et réseaux par des tunnels **WireGuard pair à pair**, orchestrés par un serveur de gestion qui distribue clés et **politiques d'accès**. Proche de [[05-tailscale-headscale/01-presentation-installation|Tailscale]], il se distingue par une plateforme **entièrement auto-hébergeable** (tableau de bord compris) et une intégration native aux fournisseurs d'identité.

| Composant | Rôle |
| --- | --- |
| **Management** | Comptes, pairs, groupes, politiques, routes, DNS ; API |
| **Signal** | Échange des candidats ICE entre pairs (établissement des connexions directes) |
| **Relay / TURN** | Relais quand aucune connexion directe n'est possible |
| **Dashboard** | Interface web |
| **Agent** `netbird` | Client WireGuard (noyau ou espace utilisateur) sur chaque machine |

## Serveur auto-hébergé

Prérequis : VM Linux avec Docker, nom DNS public (`netbird.corp.exemple.fr`), ports TCP 80/443 et UDP 3478 (+ plage relais selon la version).

```bash
export NETBIRD_DOMAIN=netbird.corp.exemple.fr
curl -fsSL https://github.com/netbirdio/netbird/releases/latest/download/getting-started-with-zitadel.sh | bash
```

Le script déploie le tout avec **Zitadel** comme IdP. Pour réutiliser un IdP existant ([[05-keycloak/01-presentation-installation|Keycloak]], [[13-authentik/01-presentation-installation|Authentik]], Entra ID, Okta, Google), suivre le guide *self-hosting* « advanced » (`setup.env` puis `configure.sh`, `docker compose up -d`). Le service cloud `app.netbird.io` évite l'hébergement.

## Clients

```bash
curl -fsSL https://pkgs.netbird.io/install.sh | sh          # Linux (dépôt APT/RPM ajouté) ; aussi FreeBSD, Synology, OpenWrt
netbird up --management-url https://netbird.corp.exemple.fr   # connexion via le navigateur (SSO)
netbird up --setup-key 1A2B3C4D-…                             # serveurs : clé d'installation, sans interaction
netbird status -d
```

Windows : `winget install NetBird.NetBird` ou MSI ; macOS : `brew install --cask netbirdio/tap/netbird-ui` ou PKG ; Android/iOS : stores. Docker : image `netbirdio/netbird` avec `NB_SETUP_KEY`.

## Politiques et routes

1. **Groupes** : `admins-reseau`, `serveurs-prod`, `postes-it` (attribués à la main, par clé d'installation ou synchronisés depuis l'IdP).
2. **Politiques d'accès** : source → destination, protocole et ports (par défaut, une règle *All* autorise tout : la supprimer en production).
3. **Network routes / Networks** : un pair Linux sert de **routeur** vers `10.0.20.0/24` (masquerade, haute disponibilité avec plusieurs routeurs et métriques) ; routes de sortie Internet (*exit node*).
4. **DNS** : serveurs de noms par domaine (`corp.exemple.fr` → `10.0.10.53`) poussés aux pairs.
5. **Posture checks** : version minimale du client ou de l'OS, géolocalisation, processus présent.

## Exploitation

- Mises à jour : nouvelle image Docker du serveur ; agents via le gestionnaire de paquets.
- Journaux d'activité (qui a ajouté quel pair), expiration des sessions des pairs utilisateurs, révocation d'un pair.
- API REST (jetons d'accès personnels ou comptes de service) et fournisseur Terraform.

Suite : [[02-nebula|Nebula]] · [[03-interface-graphique|interface graphique]] · [[90-aide-memoire|aide-mémoire]].
