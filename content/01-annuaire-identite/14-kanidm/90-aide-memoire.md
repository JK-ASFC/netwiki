---
title: Kanidm — aide-mémoire des commandes
description: Référence complète des commandes Kanidm avec exemples — serveur en conteneur (server.toml, certificat de test, sauvegardes en ligne planifiées), comptes de secours (recover-account admin et idm_admin), sauvegarde et restauration de la base, client kanidm (installation, configuration, connexion, sessions), personnes (création, mise à jour, jetons de réinitialisation, état des identifiants, POSIX, mot de passe Unix, clés SSH, validité), groupes (membres, POSIX, politiques de compte : MFA exigée, longueur minimale, durée de session), comptes de service et jetons d'API, OAuth2/OIDC (création, URL de redirection, correspondance de portées, secret, découverte), intégration Linux kanidm-unixd (PAM, NSS, SSH), LDAPS en lecture et santé.
tags: [aide-mémoire, kanidm, idm, oidc, oauth2, posix, ssh, ldap, mfa]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Kanidm]]. Exemples : domaine `idm.corp.exemple.fr`, conteneur `kanidmd`, volume `kanidmd`. Les commandes d'administration des personnes et groupes utilisent le compte `idm_admin` ; celles du système (domaine) le compte `admin`.

## Serveur

```toml /data/server.toml (dans le volume kanidmd)
bindaddress = "[::]:8443"
ldapbindaddress = "[::]:3636"
domain = "idm.corp.exemple.fr"
origin = "https://idm.corp.exemple.fr"
db_path = "/data/kanidm.db"
tls_chain = "/data/chain.pem"
tls_key = "/data/key.pem"

[online_backup]
path = "/data/sauvegardes/"
schedule = "00 22 * * *"
versions = 7
```

```bash
docker volume create kanidmd
# Certificat autosigné pour un test (en production : chaîne de l'AC d'entreprise dans chain.pem / key.pem)
docker run --rm -it -v kanidmd:/data kanidm/server:latest kanidmd cert-generate
docker run -d --name kanidmd --restart unless-stopped -p 443:8443 -p 636:3636 -v kanidmd:/data kanidm/server:latest
docker logs -f kanidmd
docker exec kanidmd kanidmd healthcheck

# Comptes de secours : réinitialiser le mot de passe (affiché une fois)
docker exec -it kanidmd kanidmd recover-account admin
docker exec -it kanidmd kanidmd recover-account idm_admin
```

## Sauvegarde et restauration

```bash
docker exec -it kanidmd kanidmd database backup /data/sauvegarde-$(date +%F).json
docker exec kanidmd ls -l /data/sauvegardes/                       # sauvegardes en ligne planifiées
# Restauration : serveur arrêté, conteneur temporaire sur le même volume
docker stop kanidmd
docker run --rm -it -v kanidmd:/data kanidm/server:latest kanidmd database restore /data/sauvegarde-2026-11-15.json
docker start kanidmd
docker run --rm -it -v kanidmd:/data kanidm/server:latest kanidmd database verify
```

## Client kanidm

```bash
sudo dnf install kanidm-clients                                    # Fedora
sudo zypper install kanidm-clients                                 # openSUSE
brew tap kanidm/kanidm && brew install kanidm                      # macOS
```

```toml ~/.config/kanidm
uri = "https://idm.corp.exemple.fr"
verify_ca = true
```

```bash
kanidm login -D idm_admin
kanidm login -D admin
kanidm self whoami -D idm_admin
kanidm session list
kanidm logout -D idm_admin
```

## Personnes

```bash
kanidm person create amartin "Alice Martin" -D idm_admin
kanidm person update amartin --mail alice.martin@exemple.fr -D idm_admin
kanidm person get amartin -D idm_admin
kanidm person list -D idm_admin
kanidm person search martin -D idm_admin
kanidm person delete bpetit -D idm_admin

# Identifiants : lien de réinitialisation (l'utilisateur définit mot de passe, passkey, TOTP)
kanidm person credential create-reset-token amartin 86400 -D idm_admin
kanidm person credential status amartin -D idm_admin

# Validité du compte
kanidm person validity show amartin -D idm_admin
kanidm person validity expire-at amartin 2026-12-31T23:59:59+01:00 -D idm_admin
kanidm person validity begin-from amartin 2026-12-01T08:00:00+01:00 -D idm_admin

# POSIX (connexion aux serveurs Linux) et mot de passe Unix
kanidm person posix set amartin --shell /bin/bash -D idm_admin
kanidm person posix show amartin -D idm_admin
kanidm person posix set-password amartin -D idm_admin

# Clés SSH
kanidm person ssh add-publickey amartin "portable" "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExempleCleAlice amartin@poste" -D idm_admin
kanidm person ssh list-publickeys amartin -D idm_admin
kanidm person ssh delete-publickey amartin "portable" -D idm_admin
```

## Groupes et politiques de compte

```bash
kanidm group create reseau -D idm_admin
kanidm group add-members reseau amartin bpetit -D idm_admin
kanidm group remove-members reseau bpetit -D idm_admin
kanidm group list-members reseau -D idm_admin
kanidm group list -D idm_admin
kanidm group posix set reseau -D idm_admin                         # attribue un gidNumber
kanidm group posix show reseau -D idm_admin

# Politique appliquée à tous les comptes personnes : MFA obligatoire, 12 caractères, session de 8 h
kanidm group account-policy enable idm_all_persons -D idm_admin
kanidm group account-policy credential-type-minimum idm_all_persons mfa -D idm_admin
kanidm group account-policy password-minimum-length idm_all_persons 12 -D idm_admin
kanidm group account-policy auth-expiry idm_all_persons 28800 -D idm_admin
```

## Comptes de service et jetons d'API

```bash
kanidm service-account create svc-sauvegarde "Sauvegarde" idm_admin -D idm_admin
kanidm service-account api-token generate svc-sauvegarde "jeton-sauvegarde" -D idm_admin
kanidm service-account api-token status svc-sauvegarde -D idm_admin
kanidm service-account api-token destroy svc-sauvegarde <id-du-jeton> -D idm_admin
```

## OAuth2 / OpenID Connect

```bash
kanidm system oauth2 create grafana "Grafana" https://grafana.corp.exemple.fr -D idm_admin
kanidm system oauth2 add-redirect-url grafana https://grafana.corp.exemple.fr/login/generic_oauth -D idm_admin
kanidm group create grafana_utilisateurs -D idm_admin
kanidm group add-members grafana_utilisateurs amartin -D idm_admin
kanidm system oauth2 update-scope-map grafana grafana_utilisateurs openid profile email groups -D idm_admin
kanidm system oauth2 prefer-short-username grafana -D idm_admin      # « amartin » au lieu de « amartin@idm.corp.exemple.fr »
kanidm system oauth2 show-basic-secret grafana -D idm_admin
kanidm system oauth2 get grafana -D idm_admin
kanidm system oauth2 list -D idm_admin
curl -s https://idm.corp.exemple.fr/oauth2/openid/grafana/.well-known/openid-configuration | jq '.issuer, .authorization_endpoint, .token_endpoint'
```

## Serveurs Linux (kanidm-unixd)

```toml /etc/kanidm/unixd
pam_allowed_login_groups = ["reseau"]
default_shell = "/bin/bash"
home_alias = "name"
```

```text /etc/nsswitch.conf (extrait)
passwd: compat kanidm
group:  compat kanidm
```

```text /etc/ssh/sshd_config.d/kanidm.conf
AuthorizedKeysCommand /usr/sbin/kanidm_ssh_authorizedkeys %u
AuthorizedKeysCommandUser nobody
```

```bash
sudo systemctl enable --now kanidm-unixd kanidm-unixd-tasks
kanidm-unix status
kanidm-unix auth-test --name amartin
sudo kanidm-unix cache-invalidate
sudo kanidm-unix cache-clear
getent passwd amartin
id amartin
/usr/sbin/kanidm_ssh_authorizedkeys amartin
```

## LDAP, système, santé

```bash
kanidm system domain show -D admin
# LDAPS en lecture seule (base dérivée du domaine)
ldapsearch -H ldaps://idm.corp.exemple.fr -x -b "dc=idm,dc=corp,dc=exemple,dc=fr" "(name=amartin)"
ldapsearch -H ldaps://idm.corp.exemple.fr -x -b "dc=idm,dc=corp,dc=exemple,dc=fr" "(class=group)" name member
curl -s https://idm.corp.exemple.fr/status
docker logs --since 1h kanidmd 2>&1 | grep -E "ERROR|WARN"
```
