---
title: Listmonk et phpList
description: Deux gestionnaires de newsletters auto-hébergés — Listmonk (Go, AGPL : binaire unique et PostgreSQL, Docker Compose, listes avec simple ou double opt-in, campagnes, modèles, plusieurs serveurs SMTP, gestion des rebonds, API, port 9000) et phpList (PHP, AGPL : installation, config.php, envoi par cron processqueue, rebonds processbounces, limites de débit) ; délivrabilité, désinscription en un clic et RGPD.
tags: [listmonk, phplist, newsletter, e-mailing, postgresql, smtp, rebonds, rgpd, désinscription]
icon: mails
---

Ces outils envoient des **lettres d'information** à des listes d'abonnés : gestion des inscriptions et désinscriptions, modèles, campagnes, statistiques. L'envoi passe par un **serveur SMTP** (le vôtre, [[23-plateformes-envoi/02-postal|Postal]] ou un service d'envoi).

| | Listmonk | phpList |
| --- | --- | --- |
| Technologie | Go (binaire unique) + PostgreSQL | PHP + MariaDB/MySQL |
| Performances | Très élevées (centaines de milliers d'abonnés sur un petit serveur) | Correctes, envoi par lots via cron |
| Interface | Moderne, éditeur visuel et Markdown | Plus ancienne, très complète |
| API | REST complète | REST (greffon) |
| Licence | AGPL | AGPL |

## Listmonk

```bash
mkdir listmonk && cd listmonk
curl -fsSL https://raw.githubusercontent.com/knadh/listmonk/master/docker-compose.yml -o docker-compose.yml
docker compose up -d
# Interface : http://serveur:9000 — créer le compte administrateur au premier accès
```

Installation par binaire :

```bash
./listmonk --new-config          # crée config.toml (base PostgreSQL, adresse d'écoute)
./listmonk --install             # crée les tables
./listmonk                       # démarre ; après une mise à jour : ./listmonk --upgrade
```

### Configuration

| Où | Réglage |
| --- | --- |
| *Paramètres → SMTP* | Un ou plusieurs serveurs SMTP, connexions simultanées, débit maximal |
| *Paramètres → Général* | URL publique (liens de désinscription), adresse d'expédition |
| *Paramètres → Rebonds* | Boîte POP où arrivent les rebonds, ou webhooks (SES, SendGrid, Postmark…) ; action après N rebonds (blocage, suppression) |
| *Paramètres → Confidentialité* | Désinscription en un clic, export et suppression des données à la demande |
| *Listes* | Publiques ou privées, **simple** ou **double opt-in** (confirmation par e-mail) |
| *Modèles* | Gabarits HTML des campagnes et des messages système |

### API

```bash
curl -u 'api_user:jeton' http://serveur:9000/api/subscribers -H 'Content-Type: application/json' \
  -d '{"email":"alice@exemple.fr","name":"Alice","lists":[3],"status":"enabled"}'
curl -u 'api_user:jeton' "http://serveur:9000/api/campaigns?per_page=10" | jq '.data.results[].name'
```

## phpList

```bash
sudo apt install apache2 mariadb-server php php-mysql php-curl php-gd php-xml php-mbstring php-zip php-imap
# Télécharger l'archive phpList 3 depuis le site du projet, la décompresser dans /var/www/phplist
sudo mysql -e "CREATE DATABASE phplist; CREATE USER 'phplist'@'localhost' IDENTIFIED BY 'MotDePasse'; GRANT ALL ON phplist.* TO 'phplist'@'localhost';"
```

```php /var/www/phplist/lists/config/config.php
$database_host = 'localhost';
$database_name = 'phplist';
$database_user = 'phplist';
$database_password = 'MotDePasse';
define('PHPMAILERHOST', 'smtp.exemple.fr');
define('MAILQUEUE_BATCH_SIZE', 500);       // messages par lot
define('MAILQUEUE_BATCH_PERIOD', 3600);    // par heure
$bounce_mailbox_host = 'imap.exemple.fr';
$bounce_mailbox_user = 'rebonds@exemple.fr';
$bounce_mailbox_password = 'MotDePasse';
```

Puis ouvrir `https://serveur/lists/admin/` pour initialiser la base et créer l'administrateur. L'envoi et le traitement des rebonds se font par **cron** :

```bash
*/5 * * * * www-data php /var/www/phplist/lists/admin/index.php -pprocessqueue -c /var/www/phplist/lists/config/config.php
0 * * * *   www-data php /var/www/phplist/lists/admin/index.php -pprocessbounces -c /var/www/phplist/lists/config/config.php
```

## Délivrabilité et RGPD

- Domaine d'expédition authentifié : **SPF, DKIM, DMARC** (voir la page SPF, DKIM et DMARC du wiki).
- **Désinscription en un clic** (en-têtes `List-Unsubscribe` et `List-Unsubscribe-Post`), exigée par Gmail et Yahoo pour les envois en masse.
- **Consentement** prouvé (double opt-in conseillé), registre des inscriptions, suppression sur demande.
- Débit progressif sur une nouvelle IP ou un nouveau domaine ; surveiller rebonds et plaintes.

Voir aussi : [[02-mautic|Mautic]] · [[03-sympa|Sympa]]. Commandes : [[90-aide-memoire|aide-mémoire]].
