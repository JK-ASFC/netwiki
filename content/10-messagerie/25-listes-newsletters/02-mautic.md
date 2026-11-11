---
title: Mautic
description: Mautic, plate-forme d'automatisation marketing libre (PHP Symfony, GPL) — contacts, segments, formulaires, pages d'atterrissage, campagnes automatisées, scoring, suivi des visites ; installation (Composer, Docker), base MariaDB, tâches cron indispensables (segments, campagnes, envoi, imports), envoi d'e-mails par SMTP ou service, file d'attente, RGPD et performances.
tags: [mautic, marketing automation, e-mailing, campagnes, segments, php, symfony, cron, rgpd]
icon: mails
---

**Mautic** va plus loin qu'un gestionnaire de newsletters : il suit le comportement des **contacts** (pages visitées, e-mails ouverts, formulaires remplis), les classe en **segments** dynamiques et déclenche des **campagnes** automatisées (suite d'e-mails, changement de score, notification d'un commercial).

| Notion | Rôle |
| --- | --- |
| Contacts et entreprises | Fiches enrichies par les formulaires, les imports et le suivi |
| Segments | Listes dynamiques selon des filtres (pays, score, page visitée…) |
| Formulaires et pages | Intégrés au site ou hébergés par Mautic |
| Campagnes | Scénarios visuels : déclencheurs, conditions, actions |
| Scoring (points) | Note d'intérêt des contacts |
| Suivi | Script JavaScript sur le site, pixel dans les e-mails |

## Installation

```bash
# Composer (méthode recommandée), PHP 8.x avec intl, mbstring, mysql, zip, imap, gd, bcmath
composer create-project mautic/recommended-project:^5 /var/www/mautic --no-interaction
# Racine web : /var/www/mautic/docroot ; puis assistant d'installation dans le navigateur

# Docker : images mautic/mautic (web, cron, worker) avec MariaDB
```

## Tâches cron (indispensables)

Mautic ne fait rien tout seul : segments, campagnes et envois sont traités par des commandes planifiées.

```bash
*/5  * * * * www-data php /var/www/mautic/bin/console mautic:segments:update
*/5  * * * * www-data php /var/www/mautic/bin/console mautic:campaigns:update
*/5  * * * * www-data php /var/www/mautic/bin/console mautic:campaigns:trigger
*/2  * * * * www-data php /var/www/mautic/bin/console messenger:consume email --limit=500 --time-limit=110
*/15 * * * * www-data php /var/www/mautic/bin/console mautic:import
0    3 * * * www-data php /var/www/mautic/bin/console mautic:maintenance:cleanup --days-old=365
```

Décaler les tâches pour éviter qu'elles se chevauchent sur une grosse base. Les versions récentes utilisent **Symfony Messenger** pour la file d'envoi (commande `messenger:consume`).

## Envoi des e-mails

*Configuration → Paramètres des e-mails* : DSN SMTP (`smtp://user:mdp@smtp.exemple.fr:587`) ou transport d'un service (Amazon SES, Mailjet, Sendgrid…), adresse d'expédition, désinscription. Authentifier le domaine (SPF, DKIM, DMARC) et suivre les rebonds (webhooks du service ou boîte de rebonds).

## RGPD et performances

- Bandeau de consentement sur le site avant le suivi ; option « ne pas suivre » ; anonymisation des adresses IP.
- Purge régulière des anciennes données (`mautic:maintenance:cleanup`).
- Base volumineuse : MariaDB bien dimensionnée, cache Redis, workers séparés pour l'envoi.

Voir aussi : [[01-listmonk-phplist|Listmonk et phpList]]. Commandes : [[90-aide-memoire|aide-mémoire]].
