---
title: Sympa
description: Sympa, gestionnaire de listes de diffusion (Perl, GPL) très utilisé par les universités et administrations françaises — installation Debian, sympa.conf, domaines virtuels (robots), intégration Postfix (transport ou alias), interface web WWSympa, création et paramétrage des listes (abonnement, modération, archives), listes alimentées par LDAP ou SQL, authentification SSO (CAS, Shibboleth), commandes par e-mail et en ligne de commande.
tags: [sympa, listes de diffusion, postfix, wwsympa, ldap, cas, shibboleth, renater]
icon: mails
---

**Sympa** (*SYsteme de Multi-Postage Automatique*) est développé en France à l'origine par le CRU et RENATER. Il gère des milliers de listes avec des **sources d'abonnés dynamiques** (annuaire LDAP, base SQL, autre liste), une **interface web** riche (WWSympa) et une authentification **SSO** (CAS, Shibboleth). C'est le choix courant des universités et des administrations ; [[06-mailman/01-presentation-installation|Mailman 3]] en est l'alternative.

## Installation

```bash
sudo apt install sympa          # questions debconf : base de données (MariaDB ou PostgreSQL), domaine, adresse d'administration
sudo systemctl status sympa wwsympa
```

Fichiers principaux : `/etc/sympa/sympa/sympa.conf` (configuration générale), `/etc/sympa/<domaine>/robot.conf` (domaine virtuel), `/var/lib/sympa/list_data/` (listes).

```text /etc/sympa/sympa/sympa.conf
domain          listes.exemple.fr
listmaster      admin@exemple.fr
lang            fr
wwsympa_url     https://listes.exemple.fr/sympa
db_type         MySQL
db_name         sympa
db_user         sympa
db_passwd       MotDePasse
```

## Intégration avec Postfix

Le plus simple est un **transport** dédié au domaine des listes :

```text /etc/postfix/master.cf
sympa      unix  -  n  n  -  -  pipe
  flags=hqRu null_sender= user=sympa argv=/usr/lib/sympa/bin/queue ${nexthop}
sympabounce unix  -  n  n  -  -  pipe
  flags=hqRu null_sender= user=sympa argv=/usr/lib/sympa/bin/bouncequeue ${nexthop}
```

```bash
sudo postconf -e "sympa_destination_recipient_limit = 1" "sympabounce_destination_recipient_limit = 1"
# transport_maps et virtual_mailbox_domains pour listes.exemple.fr : voir la documentation de Sympa (fichiers générés transport.sympa et virtual.sympa)
sudo systemctl reload postfix
```

L'autre méthode, plus ancienne, passe par des **alias** générés automatiquement (`sympa_newaliases.pl`).

## Créer et gérer des listes

Par l'interface web (`https://listes.exemple.fr/sympa`) : *Créer une liste*, choisir un **modèle** (liste de discussion, liste d'information, liste privée…), puis régler :

| Paramètre | Choix courants |
| --- | --- |
| Abonnement | Ouvert, sur validation du propriétaire, fermé |
| Envoi | Abonnés seulement, modéré, propriétaire seulement (liste d'information) |
| Visibilité | Publique, sur l'intranet, cachée |
| Archives | Web, réservées aux abonnés |
| Source des abonnés | Manuelle, **LDAP** (groupe de l'annuaire), **SQL**, inclusion d'autres listes |

Commandes par e-mail à `sympa@listes.exemple.fr` : `SUBSCRIBE liste Prénom Nom`, `SIGNOFF liste`, `LISTS`, `REVIEW liste`, `WHICH`, `HELP`.

```bash
sudo -u sympa /usr/lib/sympa/bin/sympa.pl --create_list --robot listes.exemple.fr --input_file liste.xml
sudo -u sympa /usr/lib/sympa/bin/sympa.pl --sync_include=liste@listes.exemple.fr   # resynchroniser une liste LDAP
sudo -u sympa /usr/lib/sympa/bin/sympa.pl --health_check
```

## Authentification

*Configuration de WWSympa* : comptes locaux, **LDAP**, **CAS** ou **Shibboleth** (fédération Éducation-Recherche). Les droits (créer des listes, envoyer, voir les archives) se règlent par **scénarios** (*scenari*), réutilisables entre listes.

Voir aussi : [[01-listmonk-phplist|Listmonk et phpList]] · [[06-mailman/04-mailman2-migration|Mailman 2 et migration]]. Commandes : [[90-aide-memoire|aide-mémoire]].
