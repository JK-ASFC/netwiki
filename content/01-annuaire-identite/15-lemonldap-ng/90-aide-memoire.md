---
title: LemonLDAP::NG — aide-mémoire des commandes
description: Commandes LemonLDAP::NG avec exemples — services (FastCGI, Nginx/Apache), lemonldap-ng-cli (info, get, set, addKey, save, restore), lemonldap-ng-sessions (search, delete, second facteurs), purge des sessions, rechargement de configuration, journaux et test d'en-têtes.
tags: [aide-mémoire, lemonldap-ng, sso, cli]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|LemonLDAP::NG]].

```bash
systemctl status lemonldap-ng-fastcgi-server nginx
CLI=/usr/share/lemonldap-ng/bin/lemonldap-ng-cli
$CLI info                                   # version et numéro de configuration
$CLI get portal domain ldapServer
$CLI -yes 1 set portal https://auth.corp.exemple.fr/
$CLI -yes 1 addKey locationRules/appli.corp.exemple.fr '^/admin' '$groups =~ /\badmins\b/'
$CLI save > lmconf-sauvegarde.json ; $CLI restore lmconf-sauvegarde.json
S=/usr/share/lemonldap-ng/bin/lemonldap-ng-sessions
$S search --where uid=alice --select _session_id
$S delete <id-session>
$S secondfactors get alice ; $S secondfactors delete alice <id-facteur>
/usr/share/lemonldap-ng/bin/purgeCentralCache   # purge des sessions expirées (planifiée par cron)
journalctl -u lemonldap-ng-fastcgi-server -f
curl -sk -I https://appli.corp.exemple.fr/      # 302 vers le portail si non authentifié
```
