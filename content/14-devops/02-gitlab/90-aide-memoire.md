---
title: GitLab — aide-mémoire des commandes
description: Commandes GitLab auto-hébergé avec exemples — gitlab-ctl (reconfigure, status, restart, tail, service), console Rails, vérifications (gitlab-rake gitlab:check, env:info, doctor:secrets), sauvegarde et restauration (gitlab-backup, gitlab-secrets.json, gitlab.rb), mises à jour, réinitialisation du mot de passe root, runners (gitlab-runner register, list, verify), glab et API REST.
tags: [aide-mémoire, gitlab, gitlab-ctl, gitlab-runner, sauvegarde, ci/cd, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|GitLab]].

## Service (Omnibus)

```bash
sudo gitlab-ctl reconfigure                # après toute modification de /etc/gitlab/gitlab.rb
sudo gitlab-ctl status
sudo gitlab-ctl restart
sudo gitlab-ctl restart puma
sudo gitlab-ctl tail                       # tous les journaux
sudo gitlab-ctl tail nginx/gitlab_error.log
sudo gitlab-ctl show-config | less
sudo gitlab-rake gitlab:env:info
sudo gitlab-rake gitlab:check SANITIZE=true
sudo gitlab-rake gitlab:doctor:secrets
sudo gitlab-rake gitlab:artifacts:check
```

## Sauvegarde et restauration

```bash
sudo gitlab-backup create STRATEGY=copy SKIP=artifacts
sudo cp /etc/gitlab/gitlab-secrets.json /etc/gitlab/gitlab.rb /srv/sauvegardes/gitlab/     # indispensables, non inclus !
ls /var/opt/gitlab/backups/
# Restauration (même version de GitLab)
sudo gitlab-ctl stop puma && sudo gitlab-ctl stop sidekiq
sudo gitlab-backup restore BACKUP=1730250000_2026_10_30_17.5.1
sudo gitlab-ctl reconfigure && sudo gitlab-ctl restart && sudo gitlab-rake gitlab:check SANITIZE=true
```

## Administration

```bash
sudo gitlab-rake "gitlab:password:reset[root]"
sudo gitlab-rails console
# Dans la console : user = User.find_by_username('amartin'); user.block!   |   Feature.enabled?(:nom_fonction)
sudo gitlab-rake gitlab:cleanup:orphan_job_artifact_files DRY_RUN=true
sudo gitlab-rake cache:clear
```

## Mise à jour

```bash
sudo gitlab-backup create
sudo apt update && sudo apt install gitlab-ee=17.5.1-ee.0       # respecter le chemin de mise à jour officiel
sudo gitlab-rake gitlab:background_migrations:status            # attendre la fin avant la version suivante
```

## Runners

```bash
sudo gitlab-runner register --non-interactive --url https://gitlab.exemple.fr --token glrt-XXXXXXXX \
  --executor docker --docker-image alpine:3.20 --description "runner-docker-paris"
sudo gitlab-runner list
sudo gitlab-runner verify
sudo gitlab-runner status
sudo gitlab-runner run --debug                    # premier plan (dépannage)
sudo nano /etc/gitlab-runner/config.toml          # concurrent, privileged, volumes…
```

## glab et API

```bash
glab auth login --hostname gitlab.exemple.fr
glab mr list
glab mr create --fill --target-branch main
glab ci status
glab ci view
curl -s -H "PRIVATE-TOKEN: $JETON" "https://gitlab.exemple.fr/api/v4/projects?membership=true&per_page=20" | jq '.[].path_with_namespace'
curl -s -H "PRIVATE-TOKEN: $JETON" "https://gitlab.exemple.fr/api/v4/projects/42/pipelines?status=failed" | jq '.[0]'
curl -s -X POST -H "PRIVATE-TOKEN: $JETON" "https://gitlab.exemple.fr/api/v4/projects/42/pipeline?ref=main"
```
