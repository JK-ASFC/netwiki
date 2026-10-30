---
title: Serveur Git, hooks, LFS et dépannage
description: Héberger des dépôts Git sans forge (dépôt nu sur SSH, git-shell, HTTP intelligent via git-http-backend et Nginx), hooks côté client et serveur (pre-commit, pre-receive), Git LFS pour les fichiers volumineux, signature des commits (SSH, GPG), sous-modules, maintenance et erreurs fréquentes.
tags: [git, serveur git, git-shell, hooks, pre-receive, lfs, signature, dépannage]
icon: server
---

## Serveur Git minimal (SSH)

Sans forge, un serveur SSH suffit pour partager des dépôts :

```bash
sudo adduser --system --shell /usr/bin/git-shell --group --home /srv/git git
sudo -u git mkdir -p /srv/git/.ssh && sudo -u git touch /srv/git/.ssh/authorized_keys
cat alice.pub | sudo tee -a /srv/git/.ssh/authorized_keys
sudo -u git git init --bare /srv/git/configurations.git
# Clients
git clone git@srv-git.corp.exemple.fr:/srv/git/configurations.git
```

`git-shell` n'autorise que les commandes Git (pas de shell interactif). Pour la gestion des droits par dépôt, des revues et une interface web, préférez une forge : [[02-gitlab/01-presentation-installation|GitLab]], [[03-gitea/01-presentation-installation|Gitea]] ou [[04-forgejo/01-presentation-installation|Forgejo]].

## HTTP intelligent (Nginx + git-http-backend)

```nginx /etc/nginx/sites-available/git.conf
server {
    listen 443 ssl;
    server_name git.corp.exemple.fr;
    ssl_certificate     /etc/ssl/certs/git.crt;
    ssl_certificate_key /etc/ssl/private/git.key;

    location ~ /git(/.*) {
        auth_basic "Dépôts Git";
        auth_basic_user_file /etc/nginx/git.htpasswd;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME /usr/lib/git-core/git-http-backend;
        fastcgi_param GIT_PROJECT_ROOT /srv/git;
        fastcgi_param GIT_HTTP_EXPORT_ALL "";
        fastcgi_param REMOTE_USER $remote_user;
        fastcgi_param PATH_INFO $1;
        fastcgi_pass unix:/run/fcgiwrap.socket;
    }
}
```

(paquets `fcgiwrap` et `apache2-utils` pour `htpasswd`).

## Hooks

| Hook | Côté | Usage |
| --- | --- | --- |
| `pre-commit` | Client | Lint, recherche de secrets, format |
| `commit-msg` | Client | Vérifier le format du message |
| `pre-push` | Client | Tests rapides |
| **`pre-receive`** | Serveur | Refuser un push (secret détecté, branche protégée, format) |
| `post-receive` | Serveur | Déclencher un déploiement, notifier |

```bash .git/hooks/pre-commit (ou via le framework pre-commit)
#!/bin/sh
# Refuser un commit contenant un secret détecté par gitleaks
gitleaks protect --staged --redact -v || {
  echo "Secret détecté : commit refusé." >&2
  exit 1
}
```

```yaml .pre-commit-config.yaml (framework pre-commit, partagé dans le dépôt)
repos:
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.24.0
    hooks: [ { id: gitleaks } ]
  - repo: https://github.com/adrienverge/yamllint
    rev: v1.35.1
    hooks: [ { id: yamllint } ]
```

```bash
pip install pre-commit && pre-commit install
```

Les hooks client ne sont pas versionnés dans `.git/hooks` : le framework **pre-commit** (ou `core.hooksPath`) les partage. Les contrôles **obligatoires** doivent être faits côté serveur ou en CI.

## Fichiers volumineux : Git LFS

```bash
git lfs install
git lfs track "*.iso" "*.bin" "firmwares/**"
git add .gitattributes
git add firmwares/c9300-17.12.04.bin && git commit -m "Firmware C9300"
git lfs ls-files
```

Les fichiers sont stockés par la forge (LFS activé) et remplacés dans le dépôt par de petits pointeurs.

## Signature des commits

```bash
# Signature SSH (Git ≥ 2.34)
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
git log --show-signature -1
```

La forge affiche les commits « vérifiés » si la clé de signature est déclarée dans le profil.

## Sous-modules

```bash
git submodule add https://gitlab.corp.exemple.fr/reseau/roles-ansible.git roles
git clone --recurse-submodules https://gitlab.corp.exemple.fr/reseau/automatisation.git
git submodule update --init --recursive
```

## Maintenance

```bash
git gc                       # compactage
git maintenance start        # tâches de maintenance planifiées (Git ≥ 2.31)
git fsck                     # intégrité
git count-objects -vH        # taille du dépôt
```

## Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `Permission denied (publickey)` | Clé SSH absente ou non déclarée | `ssh -vT git@forge`, déclarer la clé publique |
| `SSL certificate problem: unable to get local issuer certificate` | AC interne / proxy TLS inconnu | `http.sslCAInfo`, `http.sslBackend schannel` (Windows) |
| `! [rejected] main -> main (fetch first)` | Le distant a des commits que vous n'avez pas | `git pull --rebase` puis `git push` |
| `! [remote rejected] … (protected branch hook declined)` | Branche protégée | Passer par une demande de fusion |
| `fatal: refusing to merge unrelated histories` | Dépôt local et distant créés séparément | `git pull --allow-unrelated-histories` (une fois, en connaissance de cause) |
| `detached HEAD` | Extraction d'un commit/étiquette | `git switch -c nouvelle-branche` pour conserver le travail |
| Push refusé : fichier trop volumineux | Limite de la forge | Git LFS, ou retirer le fichier de l'historique |
| Fins de ligne modifiées sur tous les fichiers | `core.autocrlf` incohérent | `.gitattributes`, `git add --renormalize .` |
