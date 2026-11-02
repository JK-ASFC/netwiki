---
title: Présentation, installation et utilisation
description: Kanidm — système de gestion d'identité moderne écrit en Rust (comptes de personnes et de service, groupes, politiques de crédentiels, passkeys/WebAuthn, TOTP), fournisseur OAuth2/OIDC, LDAPS en lecture, RADIUS, intégration Linux (kanidm-unixd : connexion, SSH par clés de l'annuaire), installation en conteneur, configuration server.toml, récupération de l'administrateur, outil kanidm, réplication et sauvegarde.
tags: [kanidm, identité, oidc, passkeys, webauthn, ldap, rust, ssh]
icon: info
---

**Kanidm** (MPL 2.0) est un annuaire d'identité conçu « sécurisé par défaut » : authentification forte par **passkeys/WebAuthn** et TOTP, **OAuth2/OIDC** intégré, **LDAPS en lecture seule** pour les applications anciennes, module **RADIUS**, et outils Unix pour se connecter aux serveurs Linux avec les comptes et clés SSH de l'annuaire. Plus léger que [[03-freeipa/01-presentation-installation|FreeIPA]] ; il ne remplace pas Kerberos ni un DNS intégré.

## Installation (conteneur)

```bash
docker volume create kanidmd
docker create --name kanidmd -p 443:8443 -p 636:3636 -v kanidmd:/data docker.io/kanidm/server:latest
# Configuration minimale dans le volume
docker run --rm -i -v kanidmd:/data alpine sh -c 'cat > /data/server.toml' <<'EOF'
bindaddress = "[::]:8443"
ldapbindaddress = "[::]:3636"
db_path = "/data/kanidm.db"
tls_chain = "/data/chain.pem"
tls_key = "/data/key.pem"
domain = "idm.corp.exemple.fr"
origin = "https://idm.corp.exemple.fr"
EOF
# Copier chain.pem et key.pem (certificat valide pour idm.corp.exemple.fr) dans le volume, puis :
docker start kanidmd
docker exec -it kanidmd kanidmd recover-account admin          # mot de passe de l'administrateur système
docker exec -it kanidmd kanidmd recover-account idm_admin      # administrateur des identités
```

> [!WARNING]
> Le paramètre `domain` est définitif (il entre dans les identifiants des passkeys) : choisissez-le avant toute mise en production.

## Utilisation

Client : `kanidm` (paquets pour Debian/Ubuntu, Fedora, openSUSE, Arch, macOS `brew install kanidm`), configuré dans `~/.config/kanidm` (`uri = "https://idm.corp.exemple.fr"`).

```bash
kanidm login -D idm_admin
kanidm person create alice "Alice Martin" -D idm_admin
kanidm person credential create-reset-token alice -D idm_admin   # lien/jeton pour que l'utilisatrice crée sa passkey
kanidm group create admins-linux -D idm_admin
kanidm group add-members admins-linux alice -D idm_admin
kanidm person posix set alice --gidnumber 10001 -D idm_admin
kanidm person ssh add-publickey alice poste "ssh-ed25519 AAAAC3Nza... alice@poste" -D idm_admin
```

## OAuth2 / OIDC

```bash
kanidm system oauth2 create grafana "Grafana" https://grafana.corp.exemple.fr -D idm_admin
kanidm system oauth2 add-redirect-url grafana https://grafana.corp.exemple.fr/login/generic_oauth -D idm_admin
kanidm system oauth2 update-scope-map grafana grafana-utilisateurs openid profile email -D idm_admin
kanidm system oauth2 show-basic-secret grafana -D idm_admin
# Découverte : https://idm.corp.exemple.fr/oauth2/openid/grafana/.well-known/openid-configuration
```

## Serveurs Linux (kanidm-unixd)

```bash
sudo apt install kanidm-unixd     # selon la distribution : dépôt de Kanidm
```

```toml /etc/kanidm/unixd
pam_allowed_login_groups = ["admins-linux"]
default_shell = "/bin/bash"
home_alias = "name"
```

`AuthorizedKeysCommand /usr/sbin/kanidm_ssh_authorizedkeys %u` dans `sshd_config` : les clés SSH viennent de l'annuaire ; module NSS/PAM `kanidm` pour les comptes.

## Exploitation

- Interface web : `https://idm.corp.exemple.fr` (portail personnel : passkeys, TOTP, applications) — administration surtout en ligne de commande.
- Sauvegarde en ligne automatique (`online_backup` dans `server.toml`) ou `kanidmd database backup` ; réplication entre serveurs (paires de réplication par certificats).
- Supervision : `https://idm.corp.exemple.fr/status`.

Commandes : [[90-aide-memoire|aide-mémoire]].
