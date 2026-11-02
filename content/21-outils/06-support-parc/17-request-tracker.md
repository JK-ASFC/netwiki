---
title: Request Tracker (RT)
description: Request Tracker (Best Practical, GPL v2) — système de tickets en Perl piloté par courriel : files, droits fins, scrips et modèles, champs personnalisés, tableaux de bord, articles ; installation Debian/Ubuntu (paquets request-tracker5), RT 6 depuis les sources (configure, make testdeps et fixdeps, initialize-database, /opt/rt6), serveur web (Apache, NGINX avec FastCGI, rt-server), passerelle de courriel rt-mailgate (Postfix), tâches planifiées, client rt en CLI, REST 2, sauvegarde, mise à jour et dépannage.
tags: [request tracker, rt, tickets, helpdesk, perl, courriel, postfix]
icon: ticket
---

**Request Tracker** (RT, Best Practical, GPL v2) est un système de tickets éprouvé, très utilisé dans les universités, chez les hébergeurs et les équipes réseau et sécurité (CERT, NOC). Tout tourne autour du **courriel** : chaque **file** (*queue*) a son adresse, les réponses par courriel alimentent le ticket, et les **scrips** (condition + action + modèle) automatisent notifications et traitements. Les droits sont très fins (par file, groupe, rôle). Alternatives : [[14-osticket|osTicket]], [[16-otobo-znuny|OTOBO / Znuny]], [[06-zammad|Zammad]].

Prérequis : Perl 5.26.3+, PostgreSQL ou MySQL 8.0.31+ / MariaDB 10.6+, Apache ou NGINX, un MTA ([[01-postfix/01-presentation|Postfix]]).

## Debian / Ubuntu (paquets RT 5)

```bash
sudo apt install -y request-tracker5 rt5-db-postgresql rt5-apache2 rt5-clients postgresql
# dbconfig-common propose de créer la base ; répondre aux questions (nom RT, adresse web)
```

Le paquet `rt5-apache2` fournit la configuration Apache de RT : l'inclure dans le virtual host HTTPS comme indiqué dans `/usr/share/doc/rt5-apache2/README.Debian`, puis `sudo systemctl reload apache2`.

Configuration : fichiers `.pm` dans `/etc/request-tracker5/RT_SiteConfig.d/` (par exemple `50-site.pm`), puis `sudo update-rt-siteconfig` et rechargement d'Apache.

```perl
Set($rtname, 'corp.exemple.fr');
Set($Organization, 'corp.exemple.fr');
Set($WebDomain, 'rt.corp.exemple.fr');
Set($WebPort, 443);
Set($WebPath, '');
Set($CorrespondAddress, 'support@corp.exemple.fr');
Set($CommentAddress, 'support-commentaires@corp.exemple.fr');
Set($Timezone, 'Europe/Paris');
```

## RT 6 depuis les sources (RHEL, Debian, autres Unix)

```bash
V=6.0.4
wget https://download.bestpractical.com/pub/rt/release/rt-$V.tar.gz && tar xzf rt-$V.tar.gz && cd rt-$V
./configure --with-db-type=Pg --with-web-user=www-data --with-web-group=www-data      # RHEL : apache
make testdeps                     # modules Perl manquants
sudo make fixdeps                 # les installe depuis CPAN (à relancer si besoin)
sudo make install                 # installe dans /opt/rt6
sudo make initialize-database     # crée le schéma (ou assistant web : /opt/rt6/sbin/rt-server)
```

Configuration dans `/opt/rt6/etc/RT_SiteConfig.pm` (mêmes directives `Set(...)`). Le serveur autonome `/opt/rt6/sbin/rt-server --port 8080` sert aux essais ; en production, Apache (`mod_fcgid` ou `mod_perl`) ou NGINX + `spawn-fcgi` selon la documentation *web_deployment*.

> [!WARNING]
> Le compte initial est **`root` / `password`** : le changer immédiatement (*Logged in as root → Préférences*).

## Passerelle de courriel

Postfix transmet les messages reçus à RT par `rt-mailgate` (`/etc/aliases`) :

```text
support:              "|/usr/bin/rt-mailgate --queue Support --action correspond --url https://rt.corp.exemple.fr/"
support-commentaires: "|/usr/bin/rt-mailgate --queue Support --action comment --url https://rt.corp.exemple.fr/"
```

```bash
sudo newaliases
```

(Avec l'installation depuis les sources, le binaire est `/opt/rt6/bin/rt-mailgate`.) Autoriser l'adresse du serveur de courriel dans le droit *CreateTicket* / *ReplyToTicket* du groupe *Everyone* pour la file, ou restreindre aux utilisateurs connus.

## Tâches planifiées

```text
# /etc/cron.d/request-tracker
0 * * * *  www-data /opt/rt6/sbin/rt-clean-sessions --older 2D
0 0 * * *  www-data /opt/rt6/sbin/rt-email-digest -m daily
0 0 * * 1  www-data /opt/rt6/sbin/rt-email-digest -m weekly
0 * * * *  www-data /opt/rt6/sbin/rt-email-dashboards
*/15 * * * * www-data /opt/rt6/bin/rt-crontool --search RT::Search::FromSQL --search-arg "Status = 'stalled' AND Due < 'now'" --action RT::Action::SetStatus --action-arg open
```

## Interface

| Menu | Usage |
| --- | --- |
| Accueil (*RT at a glance*) | Tickets à moi, files, tableaux de bord personnalisables |
| Recherche → Tickets | Constructeur de requêtes (TicketSQL), recherches enregistrées, graphiques |
| Admin → Files | Adresses, cycles de vie, droits, **scrips**, modèles, champs personnalisés |
| Admin → Utilisateurs, Groupes | Comptes, groupes (synchronisation LDAP par l'extension *RT::Extension::LDAPImport*) |
| Articles | Base de connaissances réutilisable dans les réponses |

<!-- CAPTURE: Page d'accueil RT avec tickets et files | _assets/rt-accueil.png -->
<!-- CAPTURE: Administration d'une file, liste des scrips | _assets/rt-scrips.png -->

## Client en ligne de commande et API

```bash
export RTSERVER=https://rt.corp.exemple.fr RTUSER=jk
rt ls -q Support "Status = 'new'"
rt show ticket/1234
rt create -t ticket set queue=Support subject="Panne imprimante 2e étage" text="Signalé par l'accueil"
rt correspond -m "Intervention prévue à 14 h" 1234
rt edit ticket/1234 set status=resolved
curl -s -H "Authorization: token $JETON_RT" "https://rt.corp.exemple.fr/REST/2.0/tickets?query=Queue='Support'" | jq '.items[].id'
```

Le jeton de l'API REST 2 se crée dans *Préférences → Jetons d'authentification*.

## Sauvegarde, mise à jour

- Sauvegarde : base (`pg_dump rt5` ou le nom choisi) et configuration (`RT_SiteConfig.d/` ou `RT_SiteConfig.pm`, extensions locales).
- Mise à jour depuis les sources : arrêter le serveur web, sauvegarder, `./configure` avec les mêmes options, `sudo make upgrade` puis `sudo make upgrade-database` (en indiquant la version précédente), redémarrer.

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Courriels rejetés par RT (« permission denied ») | Droits *CreateTicket* / *ReplyToTicket* | Droits de la file pour *Everyone* ou *Unprivileged* |
| `rt-mailgate` : erreur de connexion | URL, certificat, proxy | Tester l'URL, `--no-verify-ssl` en dépannage uniquement |
| Configuration ignorée (Debian) | `update-rt-siteconfig` non lancé | Lancer puis recharger Apache |
| Module Perl manquant après mise à jour | Dépendances | `make testdeps`, `make fixdeps` |

Commandes : [[90-aide-memoire|aide-mémoire]].
