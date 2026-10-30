---
title: KeePassXC et Bitwarden
description: Gestionnaires de mots de passe pour administrateurs — KeePassXC (base KDBX locale chiffrée, mot de passe maître, fichier clé et YubiKey, intégration navigateur, agent SSH, TOTP, partage KeeShare, déploiement) et Bitwarden (coffres en ligne ou auto-hébergés, organisations, collections, accès d'urgence, CLI, Send), choix selon le contexte, règles d'hygiène pour les comptes d'infrastructure et procédure bris de glace.
tags: [keepassxc, bitwarden, mots de passe, kdbx, totp, coffre, sécurité]
icon: lock-keyhole
---

Les administrateurs manipulent des dizaines de secrets : comptes d'équipements, consoles de gestion (iDRAC, iLO), comptes de service, clés d'API, comptes de secours. Un **gestionnaire de mots de passe** est indispensable — jamais de fichier Excel, de mot de passe partagé par messagerie ou de post-it.

## KeePassXC

**KeePassXC** (GPL) stocke les secrets dans une **base locale** chiffrée (format **KDBX 4**, AES-256 ou ChaCha20, dérivation de clé **Argon2**). Disponible pour Windows, macOS et Linux (KeePassDX / Strongbox sur mobile, même format).

| Protection de la base | Recommandation |
| --- | --- |
| Mot de passe maître | Phrase de passe longue (5 mots aléatoires et plus) |
| Fichier clé | Stocké ailleurs que la base (clé USB) : facteur supplémentaire |
| **YubiKey** (défi-réponse HMAC-SHA1) | Facteur matériel |
| Paramètres Argon2 | Durée de déchiffrement d'environ 1 s sur la machine la plus lente utilisée |

Fonctions utiles :

- **Intégration navigateur** (extension KeePassXC-Browser) : remplissage automatique sur les bons domaines uniquement (protection contre l'hameçonnage).
- **Agent SSH** : charger les clés SSH stockées dans la base à l'ouverture, les retirer au verrouillage ([[01-openssh/04-cles-certificats|clés SSH]]).
- **TOTP** : codes à usage unique (à éviter pour le même compte que le mot de passe si l'on veut garder deux facteurs distincts).
- **KeeShare** : partage de groupes via des fichiers synchronisés (partage simple en équipe).
- Contrôles de santé : mots de passe faibles, réutilisés, divulgués (*Have I Been Pwned*, requête anonymisée).

```bash
# CLI (scripts, serveurs)
keepassxc-cli show -s -a password /srv/coffre/infra.kdbx "Réseau/Commutateurs/admin-sw"
keepassxc-cli generate -L 24 -l -U -n -s
```

```powershell
winget install KeePassXCTeam.KeePassXC
```

**Limites** : synchronisation et partage à organiser soi-même (partage réseau, Syncthing, Nextcloud) avec risque de conflits ; pas de journal centralisé de qui a consulté quoi.

## Bitwarden

**Bitwarden** (cœur open source, service commercial) synchronise des coffres chiffrés de bout en bout entre tous les appareils, avec gestion d'**organisations** :

| Notion | Usage |
| --- | --- |
| Coffre personnel | Secrets d'un utilisateur |
| **Organisation** et **collections** | Secrets d'équipe, droits par collection et par groupe |
| Journaux d'événements (offres Teams/Enterprise) | Qui a consulté ou modifié un élément |
| Accès d'urgence | Délégation à une personne de confiance après délai |
| SSO, politiques | Imposer la double authentification, la complexité du mot de passe maître |
| **Bitwarden Secrets Manager** | Secrets machines (CI/CD, scripts) |
| Send | Partage temporaire chiffré d'un texte ou fichier |

Hébergement : cloud Bitwarden (région UE disponible), **auto-hébergé** (serveur officiel Docker) ou serveur compatible [[08-vaultwarden/01-presentation-installation|Vaultwarden]].

```bash
bw login && export BW_SESSION=$(bw unlock --raw)
bw get password "Pare-feu siège - admin"
bw list items --collectionid <id> | jq '.[].name'
```

## Choisir

| Contexte | Recommandation |
| --- | --- |
| Administrateur seul, ou contexte très sensible et hors ligne | KeePassXC (+ YubiKey) |
| Équipe, partage, traçabilité, mobiles | Bitwarden (organisation) ou Vaultwarden auto-hébergé |
| Secrets applicatifs (API, bases, certificats) | Coffre dédié : [[07-vault/02-secrets-authentification\|HashiCorp Vault]], Bitwarden Secrets Manager |
| Comptes à privilèges avec enregistrement des sessions | Solution PAM (bastion, coffre à privilèges) |

## Hygiène

- [ ] Un secret **unique** par équipement et par compte ; rotation au départ d'un membre de l'équipe
- [ ] Comptes nominatifs autant que possible ; comptes génériques (admin local, `root`, `enable`) dans le coffre d'équipe
- [ ] **Bris de glace** : quelques secrets vitaux (compte de secours AD, accès console des cœurs de réseau, clés de récupération) aussi conservés **hors ligne** (enveloppe scellée, coffre-fort), testés périodiquement
- [ ] Sauvegarde de la base KeePassXC / export chiffré de l'organisation Bitwarden, testée
- [ ] Double authentification sur le compte du gestionnaire de mots de passe
