---
title: Configuration, LDAP, SSH et Actions
description: Configurer Gitea par app.ini (serveur, base, service, sécurité, courriel, journaux), sources d'authentification LDAP/Active Directory et OAuth2/OIDC, SSH intégré ou via OpenSSH, Gitea Actions avec act_runner, registre de paquets et règles de sécurité (inscription, 2FA, branches protégées).
tags: [gitea, app.ini, ldap, active directory, ssh, actions, act_runner, sécurité]
icon: settings-2
---

## app.ini

```appini /etc/gitea/app.ini (extrait)
APP_NAME = Forge Exemple
RUN_MODE = prod

[server]
DOMAIN           = git.corp.exemple.fr
ROOT_URL         = https://git.corp.exemple.fr/
HTTP_ADDR        = 127.0.0.1
HTTP_PORT        = 3000
SSH_DOMAIN       = git.corp.exemple.fr
SSH_PORT         = 22
START_SSH_SERVER = false            ; utiliser l'OpenSSH du système
LFS_START_SERVER = true

[database]
DB_TYPE = postgres
HOST    = 127.0.0.1:5432
NAME    = gitea
USER    = gitea
PASSWD  = MotDePasse

[service]
DISABLE_REGISTRATION      = true
REQUIRE_SIGNIN_VIEW       = true
DEFAULT_KEEP_EMAIL_PRIVATE = true
ENABLE_NOTIFY_MAIL        = true

[security]
INSTALL_LOCK       = true
MIN_PASSWORD_LENGTH = 12
PASSWORD_COMPLEXITY = lower,upper,digit

[mailer]
ENABLED   = true
PROTOCOL  = smtp
SMTP_ADDR = relais.corp.exemple.fr
SMTP_PORT = 25
FROM      = "Forge" <git@exemple.fr>

[actions]
ENABLED = true

[log]
MODE  = file
LEVEL = Info
```

```bash
sudo systemctl restart gitea
```

La liste complète des paramètres est dans le *config cheat sheet* de la documentation ; `custom/conf/app.example.ini` les décrit.

## LDAP / Active Directory

*Administration du site → Sources d'authentification → Ajouter* (type **LDAP via BindDN**), ou en ligne de commande :

```bash
sudo -u git gitea --config /etc/gitea/app.ini admin auth add-ldap \
  --name "Active Directory" \
  --security-protocol ldaps --host dc1.corp.exemple.fr --port 636 \
  --bind-dn "CN=svc_gitea,OU=Services,DC=corp,DC=exemple,DC=fr" --bind-password 'MotDePasseCompteService' \
  --user-search-base "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr" \
  --user-filter "(&(objectClass=user)(sAMAccountName=%s)(memberOf=CN=GG_Forge,OU=Groupes,DC=corp,DC=exemple,DC=fr))" \
  --admin-filter "(memberOf=CN=GG_Forge_Admins,OU=Groupes,DC=corp,DC=exemple,DC=fr)" \
  --username-attribute sAMAccountName --firstname-attribute givenName --surname-attribute sn \
  --email-attribute mail --synchronize-users
sudo -u git gitea --config /etc/gitea/app.ini admin auth list
```

OAuth2/OIDC (Keycloak, Entra ID, GitLab) s'ajoute dans la même page (type *OAuth2*, fournisseur *OpenID Connect*, URL de découverte).

## SSH

| Mode | Configuration |
| --- | --- |
| **OpenSSH du système** (recommandé) | `START_SSH_SERVER = false` : Gitea gère `~git/.ssh/authorized_keys` (clés des utilisateurs avec commande forcée) |
| Serveur SSH intégré | `START_SSH_SERVER = true`, `SSH_LISTEN_PORT = 2222` : utile en conteneur |
| Docker avec passerelle SSH | Redirection du SSH de l'hôte vers le conteneur (documentation « SSH passthrough ») |

Avec OpenSSH, ajoutez dans `sshd_config` une option `AuthorizedKeysCommand` (`gitea keys`) pour de meilleures performances avec beaucoup de clés.

## Gitea Actions

Les workflows (`.gitea/workflows/*.yaml`) utilisent la syntaxe de **GitHub Actions** ; ils s'exécutent sur des **act_runner**.

```bash
# Jeton : Administration du site → Actions → Runners → Créer un nouveau runner
wget -O act_runner https://dl.gitea.com/act_runner/0.2.11/act_runner-0.2.11-linux-amd64 && chmod +x act_runner
./act_runner register --no-interactive --instance https://git.corp.exemple.fr \
  --token <jeton> --name runner-01 --labels "ubuntu-latest:docker://node:20-bookworm"
./act_runner daemon
```

```yaml .gitea/workflows/verification.yaml
name: Vérification
on: [ push, pull_request ]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install yamllint && yamllint .
```

## Registre de paquets

Chaque utilisateur ou organisation dispose d'un registre : conteneurs (`docker login git.corp.exemple.fr`), npm, PyPI, Maven, NuGet, Helm, générique… Authentification par jeton d'accès.

## Sécurité

- [ ] `DISABLE_REGISTRATION = true`, `REQUIRE_SIGNIN_VIEW = true`
- [ ] Double authentification encouragée/obligatoire (`[security]` / politiques d'organisation)
- [ ] Branches protégées (revues requises, vérifications de statut), signatures de commits
- [ ] `app.ini` en 640, `SECRET_KEY` et `INTERNAL_TOKEN` protégés
- [ ] Mises à jour régulières (correctifs de sécurité)
