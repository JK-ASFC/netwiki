---
title: Mailman 3 — aide-mémoire des commandes
description: Commandes Mailman 3 avec exemples — commande mailman (info, lists, create, remove, members, addmembers, delmembers, syncmembers, inject, withlist), files d'attente et démon, interface Postorius et archives HyperKitty (django-admin), API REST avec curl, intégration Postfix, sauvegarde et journaux.
tags: [aide-mémoire, mailman, listes de diffusion, postorius, hyperkitty]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Mailman]]. Exécuter les commandes avec l'utilisateur `list` (Debian) ou `mailman` selon l'installation.

## Commandes mailman

```bash
sudo -u list mailman info
sudo -u list mailman lists
sudo -u list mailman create reseau@listes.exemple.fr --owner amartin@exemple.fr
sudo -u list mailman members reseau@listes.exemple.fr
echo "bpetit@exemple.fr" | sudo -u list mailman addmembers - reseau@listes.exemple.fr
echo "bpetit@exemple.fr" | sudo -u list mailman delmembers -f - -l reseau@listes.exemple.fr
sudo -u list mailman syncmembers abonnes.txt reseau@listes.exemple.fr       # aligner sur un fichier
sudo -u list mailman inject -l reseau@listes.exemple.fr message.eml
sudo -u list mailman remove ancienne@listes.exemple.fr
sudo -u list mailman status
sudo -u list mailman restart
sudo -u list mailman unshunt                                                  # relancer les messages en erreur
sudo -u list mailman withlist -r mailman.config.config reseau@listes.exemple.fr
```

## Interface web (Django)

```bash
sudo -u www-data mailman-web check
sudo -u www-data mailman-web createsuperuser
sudo -u www-data mailman-web hyperkitty_import -l reseau@listes.exemple.fr archive.mbox
sudo -u www-data mailman-web update_index      # index de recherche des archives
```

## API REST

```bash
curl -s -u restadmin:"$MDP" http://127.0.0.1:8001/3.1/lists | jq '.entries[].fqdn_listname'
curl -s -u restadmin:"$MDP" http://127.0.0.1:8001/3.1/lists/reseau.listes.exemple.fr/roster/member | jq '.entries[].email'
curl -s -u restadmin:"$MDP" -X POST http://127.0.0.1:8001/3.1/members -d list_id=reseau.listes.exemple.fr -d subscriber=cdurand@exemple.fr -d pre_verified=true -d pre_confirmed=true -d pre_approved=true
```

## Intégration Postfix

```ini
# /etc/postfix/main.cf (extrait)
transport_maps = hash:/var/lib/mailman3/data/postfix_lmtp
local_recipient_maps = proxy:unix:passwd.byname $alias_maps hash:/var/lib/mailman3/data/postfix_lmtp
relay_domains = hash:/var/lib/mailman3/data/postfix_domains
```

## Journaux et sauvegarde

```bash
sudo tail -f /var/log/mailman3/mailman.log /var/log/mailman3/smtp.log
sudo -u postgres pg_dump mailman > /srv/sauvegardes/mailman.sql      # selon la base utilisée
sudo tar czf /srv/sauvegardes/mailman-$(date +%F).tar.gz /etc/mailman3 /var/lib/mailman3
```
