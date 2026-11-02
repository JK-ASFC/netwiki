---
title: privacyIDEA
description: privacyIDEA — serveur d'authentification multifacteur open source (NetKnights, AGPL), types de jetons (HOTP, TOTP, WebAuthn/passkeys, push, SMS, e-mail, certificats, questions), installation sur Ubuntu (dépôt NetKnights) ou en environnement Python, base de données, résolveurs LDAP/Active Directory et royaumes, politiques (inscription, authentification, verrouillage), intégration RADIUS avec FreeRADIUS (VPN, pare-feu, Wi-Fi), fournisseur d'identifiants Windows, PAM et SSH sous Linux, Keycloak et SSO, audit et sauvegarde.
tags: [privacyidea, mfa, otp, totp, webauthn, radius, freeradius, 2fa]
icon: shield-check
---

**privacyIDEA** (AGPL, NetKnights) centralise le **second facteur** de toute l'infrastructure : les utilisateurs restent dans l'annuaire existant (AD, LDAP, SQL), privacyIDEA gère leurs **jetons** et répond aux demandes d'authentification par API REST ou **RADIUS**.

| Jeton | Usage |
| --- | --- |
| **TOTP / HOTP** | Applications d'authentification (FreeOTP, Aegis, Microsoft Authenticator), jetons matériels |
| **WebAuthn / passkey** | Clés FIDO2 (YubiKey, Nitrokey), biométrie |
| **Push** | Application privacyIDEA Authenticator |
| SMS, e-mail | Code ponctuel (moins sûr) |
| Certificat, SSH, questions, liste de codes | Cas particuliers, secours |

## Installation (Ubuntu 22.04/24.04)

```bash
wget https://lancelot.netknights.it/NetKnights-Release.asc
sudo gpg --import --no-default-keyring --keyring /etc/apt/trusted.gpg.d/netknights.gpg NetKnights-Release.asc
echo "deb http://lancelot.netknights.it/community/$(lsb_release -cs)/stable $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/privacyidea.list
sudo apt update && sudo apt install privacyidea-apache2       # Apache + MariaDB + configuration complète
sudo pi-manage admin add admin -e admin@corp.exemple.fr        # administrateur de l'interface
```

Autres systèmes : environnement virtuel Python (`pip install privacyidea`), configuration `/etc/privacyidea/pi.cfg` (`SQLALCHEMY_DATABASE_URI`, `SECRET_KEY`, `PI_PEPPER`, clé de chiffrement `encKey` à **sauvegarder** : sans elle les jetons sont perdus), serveur WSGI derrière Apache ou Nginx ; image de conteneur communautaire.

## Configuration

1. **Résolveur** (*Config → Users → New ldapresolver*) : `ldaps://dc01.corp.exemple.fr`, base, compte de liaison, préréglage **Active Directory** (attributs `sAMAccountName`, `mail`, `mobile`).
2. **Royaume** (*realm*) regroupant un ou plusieurs résolveurs, défini par défaut.
3. **Politiques** : *scope=webui/user* (les utilisateurs inscrivent leur jeton eux-mêmes), *scope=authentication* (`otppin=userstore` : mot de passe AD + OTP, ou `passOnNoToken` en transition), *scope=enrollment* (types autorisés, libellé, longueur), verrouillage après N échecs.
4. Test : `curl -s -d "user=alice" -d "pass=MotDePasseAD123456" https://mfa.corp.exemple.fr/validate/check | jq .result`.

## RADIUS (VPN, pare-feu, Wi-Fi, équipements)

```bash
sudo apt install privacyidea-radius            # greffon rlm_perl pour FreeRADIUS
```

FreeRADIUS reçoit la demande (VPN [[02-openvpn/01-presentation|OpenVPN]], FortiGate, Palo Alto, Cisco ASA, [[03-wireguard/01-presentation-installation|WireGuard]] via passerelle…), la transmet à privacyIDEA (`/etc/privacyidea/rlm_perl.ini` : URL et royaume) et renvoie Access-Accept ou Access-Challenge (demande du code). Voir [[01-freeradius/01-presentation|FreeRADIUS]].

## Postes et serveurs

- **Windows** : *privacyIDEA Credential Provider* (ouverture de session et RDP avec second facteur, mode hors ligne).
- **Linux** : module PAM `privacyidea-pam` ou `pam_python` pour SSH et sudo.
- **SSO** : greffon pour [[05-keycloak/01-presentation-installation|Keycloak]], SimpleSAMLphp, ADFS ; [[13-authentik/01-presentation-installation|Authentik]] peut aussi l'appeler.

## Exploitation

- Audit complet dans l'interface (*Audit*) et dans la base ; journaux `/var/log/privacyidea/`.
- Sauvegarde : base de données, `/etc/privacyidea` (dont **encKey** et clés de signature des audits).
- Haute disponibilité : plusieurs serveurs sur une base répliquée (Galera, PostgreSQL), RADIUS en redondance.

Interface : [[03-interface-graphique|interface graphique]] · commandes : [[90-aide-memoire|aide-mémoire]].
