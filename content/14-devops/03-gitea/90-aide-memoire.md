---
title: Gitea — aide-mémoire des commandes
description: Commandes Gitea avec exemples — service et binaire, commande gitea admin (utilisateurs : création, liste, changement de mot de passe, administrateur ; authentification LDAP ; régénération des hooks et clés), gitea doctor, sauvegarde (gitea dump) et restauration, Docker, Gitea Actions (act_runner register), API REST et tea (client CLI).
tags: [aide-mémoire, gitea, forge, git, gitea admin, act_runner]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Gitea]]. Exécuter les commandes avec l'utilisateur du service et le fichier de configuration :

```bash
G="sudo -u git gitea --config /etc/gitea/app.ini"
```

## Utilisateurs et authentification

```bash
$G admin user create --username amartin --email alice.martin@exemple.fr --password 'MotDePasseInitial2026' --must-change-password
$G admin user create --username admin-forge --email forge@exemple.fr --random-password --admin
$G admin user list
$G admin user change-password --username amartin --password 'NouveauMotDePasse2026'
$G admin user delete --username ancien
$G admin auth list
$G admin auth add-ldap --name AD --security-protocol LDAPS --host dc01.corp.exemple.fr --port 636 \
  --bind-dn "CN=svc-gitea,OU=Services,DC=corp,DC=exemple,DC=fr" --bind-password "$MDP_LDAP" \
  --user-search-base "OU=Utilisateurs,DC=corp,DC=exemple,DC=fr" --user-filter "(&(objectClass=user)(sAMAccountName=%s))" \
  --username-attribute sAMAccountName --email-attribute mail
$G admin regenerate hooks
$G admin regenerate keys
```

## Santé, sauvegarde, restauration

```bash
$G doctor check --all
$G dump -f /srv/sauvegardes/gitea-$(date +%F).zip         # dépôts, base, configuration
# Restauration : extraire l'archive, remettre app.ini, data/, repos/, importer gitea-db.sql, puis :
$G admin regenerate hooks
```

## Docker

```bash
docker exec -it -u git gitea gitea admin user list
docker exec -u git gitea gitea dump -f /tmp/gitea-dump.zip && docker cp gitea:/tmp/gitea-dump.zip .
```

## Gitea Actions (act_runner)

```bash
./act_runner register --no-interactive --instance https://forge.exemple.fr --token "$JETON_RUNNER" --name runner-paris --labels ubuntu-latest:docker://node:20-bookworm
./act_runner daemon
```

## API et tea

```bash
curl -s -H "Authorization: token $JETON" "https://forge.exemple.fr/api/v1/repos/search?q=configs" | jq '.data[].full_name'
curl -s -X POST -H "Authorization: token $JETON" -H "Content-Type: application/json" https://forge.exemple.fr/api/v1/user/repos -d '{"name":"nouveau-depot","private":true}'
tea login add --name forge --url https://forge.exemple.fr --token "$JETON"
tea repos ls
tea pulls ls --repo reseau/configs
```
