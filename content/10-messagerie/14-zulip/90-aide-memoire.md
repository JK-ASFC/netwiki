---
title: Zulip — aide-mémoire des commandes
description: Commandes Zulip avec exemples — installation, redémarrage, manage.py (organisations, administrateurs, lien de création, rôles, désactivation, réinitialisation de mot de passe, courriel de test, LDAP, enregistrement push), sauvegarde et restauration, mise à jour, journaux, API REST.
tags: [aide-mémoire, zulip, manage.py, sauvegarde]
icon: terminal
---

Explications : [[01-presentation-installation|installation et exploitation]] · [[02-interface-graphique|interface]].

```bash
M=/home/zulip/deployments/current
sudo ./zulip-server-*/scripts/setup/install --certbot --email=admin@corp.exemple.fr --hostname=chat.corp.exemple.fr
su zulip -c "$M/scripts/restart-server"
sudo $M/scripts/zulip-puppet-apply                              # après modification de /etc/zulip/zulip.conf
su zulip -c "$M/manage.py list_realms"
su zulip -c "$M/manage.py show_admins -r ''"
su zulip -c "$M/manage.py generate_realm_creation_link"
su zulip -c "$M/manage.py send_password_reset_email -u jk@corp.exemple.fr"
su zulip -c "$M/manage.py deactivate_user -r '' ancien.agent@corp.exemple.fr"
su zulip -c "$M/manage.py send_test_email admin@corp.exemple.fr"
su zulip -c "$M/manage.py query_ldap jk"
su zulip -c "$M/manage.py sync_ldap_user_data"
su zulip -c "$M/manage.py register_server"
su zulip -c "$M/manage.py backup --output=/srv/sauvegardes/zulip-$(date +%F).tar.gz"
sudo $M/scripts/setup/restore-backup /srv/sauvegardes/zulip-2026-11-02.tar.gz
curl -fLO https://download.zulip.com/server/zulip-server-latest.tar.gz && sudo $M/scripts/upgrade-zulip zulip-server-latest.tar.gz
sudo tail -f /var/log/zulip/errors.log /var/log/zulip/server.log
sudo supervisorctl status
```

## API REST

```bash
curl -s https://chat.corp.exemple.fr/api/v1/server_settings | jq '.zulip_version'
curl -s -u jk@corp.exemple.fr:CLE_API_PERSONNELLE https://chat.corp.exemple.fr/api/v1/users/me | jq
curl -s -X POST https://chat.corp.exemple.fr/api/v1/messages -u supervision-bot@chat.corp.exemple.fr:CLE_API_DU_ROBOT -d type=stream -d to=infra -d topic=sauvegardes --data-urlencode 'content=Sauvegarde terminée sur srv-bkp-01'
```

La clé API personnelle se trouve dans *Paramètres personnels → Compte et confidentialité → Gérer la clé API*.

## Clients

```powershell
winget install --id Zulip.Zulip -e
```

```bash
brew install --cask zulip
```
