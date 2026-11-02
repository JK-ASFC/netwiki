---
title: Présentation et comparatif
description: Plateformes d'auto-hébergement à catalogue d'applications — YunoHost (Debian, authentification unique, messagerie, domaines), CasaOS (tableau de bord Docker de ZimaOS), Runtipi (applications Docker en un clic) et Umbrel (umbrelOS, Bitcoin et serveur personnel) : architecture, prérequis, sécurité, exposition sur Internet, sauvegardes et choix selon l'usage (association, PME, laboratoire, foyer).
tags: [yunohost, casaos, runtipi, umbrel, auto-hébergement, docker, homelab]
icon: info
---

Ces plateformes installent des applications auto-hébergées (cloud de fichiers, wiki, mots de passe, multimédia, domotique…) **en quelques clics** depuis une interface web, en masquant Docker, les proxys inverses et les certificats.

| | **YunoHost** | **CasaOS** | **Runtipi** | **Umbrel** |
| --- | --- | --- | --- | --- |
| Base | Debian (système complet) | Couche sur Debian/Ubuntu (ou ZimaOS) | Couche sur toute distribution Linux | umbrelOS (système complet) ou Linux |
| Applications | Paquets YunoHost (≈ 500), installés sur l'hôte | Conteneurs Docker (App Store + Compose) | Conteneurs Docker (≈ 300) | Conteneurs Docker (App Store) |
| Comptes | **Utilisateurs LDAP + SSO** pour toutes les applis | Un compte d'administration | Un compte d'administration | Un compte |
| Domaines, TLS | Domaines multiples, Let's Encrypt, **serveur de messagerie** complet | Ports locaux | Traefik intégré, Let's Encrypt | Ports locaux, Tor |
| Public visé | Associations, petites structures, foyers | Foyer, NAS domestique | Laboratoire, foyer | Foyer, Bitcoin |
| Licence | AGPL | Apache 2.0 | GPL | PolyForm (non commerciale) |

> [!WARNING]
> Ces plateformes simplifient mais n'exonèrent pas de l'administration : **mises à jour**, **sauvegardes hors machine**, mots de passe forts et 2FA, et exposition minimale sur Internet (VPN [[03-wireguard/01-presentation-installation|WireGuard]] ou [[05-tailscale-headscale/01-presentation-installation|Tailscale]] plutôt que des ports ouverts). Pour une entreprise, préférez des services déployés et supervisés individuellement.

## Choisir

- **Association ou petite structure** avec comptes utilisateurs, e-mail et SSO : **YunoHost** — voir [[02-yunohost|YunoHost]].
- **Foyer ou NAS** avec applications Docker et interface simple : **CasaOS** ou **Runtipi** — voir [[03-casaos-runtipi-umbrel|CasaOS, Runtipi et Umbrel]].
- **Nœud Bitcoin/Lightning** et applications personnelles : **Umbrel**.
- Besoin de contrôle total : Docker Compose à la main ([[01-docker/01-presentation-installation|Docker]]) avec un proxy inverse ([[04-traefik/01-presentation-installation|Traefik]]) ou [[08-portainer/01-presentation-installation|Portainer]].

## Prérequis communs

Machine dédiée (mini-PC, VM, Raspberry Pi 4/5 avec SSD), 4 Go de RAM minimum (8 Go et plus pour de nombreuses applis), IP fixe ou réservation DHCP, nom de domaine si exposition publique, sauvegarde vers un autre support.
