---
title: LinOTP
description: LinOTP — serveur d'authentification OTP open source (LinOTP GmbH, AGPL), jetons pris en charge (HOTP, TOTP, mOTP, SMS, e-mail, questions, jetons matériels), installation sur Debian (dépôt officiel, base MariaDB/PostgreSQL), configuration (résolveurs LDAP/AD, royaumes, politiques), portail d'auto-service, API de validation, intégration RADIUS avec FreeRADIUS, comparaison avec privacyIDEA.
tags: [linotp, otp, mfa, radius, totp, 2fa]
icon: shield-check
---

**LinOTP** (AGPL, LinOTP GmbH, anciennement KeyIdentity) est un serveur d'authentification à usage unique historique — **privacyIDEA** en est issu par fork en 2014. Il gère jetons HOTP/TOTP, mOTP, SMS, e-mail, questions et jetons matériels, avec résolveurs LDAP/AD, politiques et portail d'auto-service.

| | LinOTP | [[01-privacyidea\|privacyIDEA]] |
| --- | --- | --- |
| Développement | Éditeur (LinOTP GmbH), rythme plus lent | Communauté + NetKnights, très actif |
| WebAuthn / passkeys, push | Selon version | Oui |
| Fournisseur d'identifiants Windows | Commercial | Libre |
| Choix conseillé | Parc LinOTP existant | **Nouveau projet** |

## Installation (Debian 12)

Ajoutez le dépôt Debian officiel indiqué dans la documentation de LinOTP (`linotp.org`, l'URL et la clé dépendent de la version majeure), puis :

```bash
sudo apt update && sudo apt install linotp mariadb-server
```

L'installation configure Apache (interface d'administration `https://otp.corp.exemple.fr/manage/`, auto-service `/selfservice/`) et demande le compte administrateur.

## Configuration

*LinOTP Config → Useridresolvers* : résolveur **LDAP** (Active Directory : `sAMAccountName`, base, compte de liaison, TLS) → *Realms* : royaume par défaut → *Policies* : `scope=authentication` (`otppin=1` = mot de passe de l'annuaire + OTP), `scope=selfservice` (`enrollTOTP`, `resync`), `scope=enrollment`.

Test de validation :

```bash
curl -s "https://otp.corp.exemple.fr/validate/check?user=alice&pass=MotDePasseAD123456" | jq .result.value
```

## RADIUS

LinOTP fournit un module FreeRADIUS (`linotp-freeradius-perl` / `rlm_perl`) : FreeRADIUS reçoit les demandes des VPN et équipements et interroge l'API `validate` — même principe que [[01-privacyidea|privacyIDEA]] et [[01-freeradius/01-presentation|FreeRADIUS]].

Journaux : `/var/log/linotp/linotp.log`. Interface : [[03-interface-graphique|interface graphique]].
