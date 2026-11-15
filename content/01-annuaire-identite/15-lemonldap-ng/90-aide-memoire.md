---
title: LemonLDAP::NG — aide-mémoire des commandes
description: Référence complète des commandes LemonLDAP::NG 2 avec exemples — installation (paquets Debian, domaine par défaut, sites Nginx, service FastCGI), outil de configuration lemonldap-ng-cli (info, lecture, modification, ajout et suppression de clés, règles d'accès et en-têtes, annuaire Active Directory, sauvegarde, restauration, retour arrière), outil des sessions lemonldap-ng-sessions (recherche, lecture, suppression, seconds facteurs, consentements), purge des caches, rechargement des agents, journalisation (lemonldap-ng.ini), points de terminaison OIDC et SAML, tests curl et sauvegarde.
tags: [aide-mémoire, lemonldap-ng, sso, websso, cli, sessions, oidc, saml, nginx]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|LemonLDAP::NG]] et [[03-interface-graphique|interface graphique]]. Exemples : portail `https://auth.corp.exemple.fr`, manager `https://manager.corp.exemple.fr`, application protégée `appli.corp.exemple.fr`.

```bash
CLI=/usr/share/lemonldap-ng/bin/lemonldap-ng-cli
S=/usr/share/lemonldap-ng/bin/lemonldap-ng-sessions
```

## Installation (Debian / Ubuntu, Nginx)

```bash
sudo apt install lemonldap-ng lemonldap-ng-fastcgi-server nginx
# Remplacer le domaine d'exemple livré (example.com) par le vôtre
sudo sed -i 's/example\.com/corp.exemple.fr/g' /etc/lemonldap-ng/* /var/lib/lemonldap-ng/conf/lmConf-1.json
# Activer les sites du portail, du manager et de l'agent de test
sudo ln -s /etc/lemonldap-ng/portal-nginx.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/lemonldap-ng/manager-nginx.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/lemonldap-ng/handler-nginx.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl enable --now lemonldap-ng-fastcgi-server
sudo systemctl status lemonldap-ng-fastcgi-server nginx
```

## Configuration en ligne de commande

```bash
$CLI info                                          # version, numéro et auteur de la configuration active
$CLI get portal domain
$CLI get authentication userDB passwordDB
$CLI -yes 1 set portal https://auth.corp.exemple.fr/
$CLI -yes 1 set domain corp.exemple.fr

# Annuaire Active Directory
$CLI -yes 1 set authentication AD userDB AD passwordDB AD
$CLI -yes 1 set ldapServer "ldaps://dc01.corp.exemple.fr ldaps://dc02.corp.exemple.fr" ldapBase "DC=corp,DC=exemple,DC=fr"
$CLI -yes 1 set managerDn "CN=svc-llng,OU=Services,DC=corp,DC=exemple,DC=fr" managerPassword 'MotDePasseCompteService'

# Application protégée : règles d'accès (évaluées dans l'ordre) et en-têtes transmis
$CLI -yes 1 addKey locationRules/appli.corp.exemple.fr '^/admin' '$groups =~ /\badmins\b/'
$CLI -yes 1 addKey locationRules/appli.corp.exemple.fr default accept
$CLI -yes 1 addKey exportedHeaders/appli.corp.exemple.fr Auth-User '$uid'
$CLI -yes 1 addKey exportedHeaders/appli.corp.exemple.fr Auth-Mail '$mail'
$CLI -yes 1 addKey exportedHeaders/appli.corp.exemple.fr Auth-Groups '$groups'
$CLI get locationRules/appli.corp.exemple.fr
$CLI -yes 1 delKey locationRules/appli.corp.exemple.fr '^/admin'

# Sauvegarde, restauration, retour à la configuration précédente
$CLI save > /srv/sauvegardes/lmconf-$(date +%F).json
$CLI restore /srv/sauvegardes/lmconf-2026-11-15.json
$CLI rollback
ls /var/lib/lemonldap-ng/conf/                     # une version par fichier lmConf-N.json
```

## Sessions et seconds facteurs

```bash
$S search --where uid=amartin --select _session_id --select ipAddr --select _utime
$S get <id-session>
$S delete <id-session>
$S search --where uid=amartin --select _session_id | jq -r '.[]._session_id' | xargs -r $S delete     # toutes ses sessions
$S secondfactors get amartin
$S secondfactors delete amartin <id-facteur>
$S secondfactors delType amartin TOTP
$S consents get amartin
```

## Caches, agents, journaux

```bash
/usr/share/lemonldap-ng/bin/purgeCentralCache     # sessions expirées (planifié par cron)
/usr/share/lemonldap-ng/bin/purgeLocalCache
# Les agents relisent la configuration à l'appel de l'URL de rechargement (hôte « reload », accès local)
curl -s -H "Host: reload.corp.exemple.fr" http://127.0.0.1/reload
sudo journalctl -u lemonldap-ng-fastcgi-server -f
sudo tail -f /var/log/nginx/error.log
```

Le niveau de journalisation se règle dans `/etc/lemonldap-ng/lemonldap-ng.ini`, section `[all]` : `logLevel = info` (ou `debug` le temps d'un diagnostic), puis redémarrage du service FastCGI.

## Tests

```bash
curl -sk -o /dev/null -w "%{http_code} %{redirect_url}\n" https://appli.corp.exemple.fr/     # 302 vers le portail si non authentifié
curl -s https://auth.corp.exemple.fr/.well-known/openid-configuration | jq '.issuer, .authorization_endpoint, .jwks_uri'
curl -s https://auth.corp.exemple.fr/saml/metadata -o metadata-idp.xml
curl -s https://auth.corp.exemple.fr/ | grep -o "<title>.*</title>"
```

## Sauvegarde

```bash
sudo tar czf /srv/sauvegardes/llng-$(date +%F).tar.gz /etc/lemonldap-ng /var/lib/lemonldap-ng/conf
```
