---
title: Invoice Ninja, Akaunting, Kimai et Crater
description: Facturation et temps auto-hébergés — Invoice Ninja 5 (Elastic License pour certaines fonctions : devis, factures, paiements en ligne, portail client, récurrences ; Docker invoiceninja-debian, APP_URL, APP_KEY, IN_USER_EMAIL), Akaunting (BSL pour la v3 : comptabilité en ligne, factures, dépenses, banques ; composer, php artisan install, Docker), Kimai 2 (MIT : suivi du temps, projets, clients, tarifs, export et factures ; Docker kimai/kimai2, ADMINMAIL, DATABASE_URL, bin/console kimai:install, kimai:user:create) et Crater (archivé, successeur InvoiceShelf), sauvegarde et mise à jour.
tags: [invoice ninja, akaunting, kimai, crater, invoiceshelf, facturation, temps]
icon: receipt
---

| Outil | Licence | Usage | Socle |
| --- | --- | --- | --- |
| **Invoice Ninja 5** | Code source disponible (Elastic License 2.0 ; fonctions avancées en offre payante) | Devis, factures, paiements en ligne (Stripe, PayPal…), récurrences, portail client, dépenses | Laravel, MariaDB |
| **Akaunting** | v3 sous BSL (vérifier les conditions) | Comptabilité simple, factures, dépenses, banques, multi-sociétés ; applications payantes | Laravel, MySQL |
| **Kimai 2** | MIT | **Suivi du temps** (pointage, feuilles de temps), projets et activités, tarifs, exports et factures | Symfony, MariaDB |
| **Crater** | AAL | **Archivé** : migrer vers son successeur **InvoiceShelf** ou Invoice Ninja | Laravel |

La facturation électronique obligatoire entre entreprises (France, à partir de 2026 selon la taille) impose de passer par une **plateforme agréée** : vérifier que l'outil s'y connecte avant de l'adopter pour la facturation légale. Pour un ERP complet : [[08-erp/01-odoo|Odoo]], [[08-erp/03-dolibarr-tryton|Dolibarr]].

## Invoice Ninja (Docker)

```bash
git clone https://github.com/invoiceninja/dockerfiles.git -b debian invoiceninja && cd invoiceninja
docker run --rm -it invoiceninja/invoiceninja-debian php artisan key:generate --show    # copier la clé dans .env
nano .env       # APP_URL=https://facturation.corp.exemple.fr, APP_KEY=base64:…, IN_USER_EMAIL, IN_PASSWORD, base, SMTP
docker compose up -d
```

`IN_USER_EMAIL` et `IN_PASSWORD` créent le compte principal au premier démarrage (à retirer ensuite du fichier). Sans eux, le compte par défaut est `admin@example.com` / `changeme!` : à changer immédiatement. Paramètres : *Settings* (société, TVA, numérotation, modèles de factures, passerelles de paiement, courriel). Sauvegarde : base MariaDB et volume des fichiers (`public/storage`, `storage`).

<!-- CAPTURE: Tableau de bord Invoice Ninja | _assets/invoiceninja-tableau-de-bord.png -->

## Akaunting

```bash
cd /var/www && sudo git clone https://github.com/akaunting/akaunting.git && cd akaunting
sudo composer install --no-dev && sudo npm install && sudo npm run production
sudo php artisan install --db-name="akaunting" --db-username="akaunting" --db-password="MdpAkaunting2026" --admin-email="compta@corp.exemple.fr" --admin-password='MdpAdmin2026!'
sudo chown -R www-data:www-data storage bootstrap/cache
```

Ou l'archive prête à l'emploi et l'assistant web, ou l'image Docker `akaunting/akaunting`. Tâche planifiée Laravel : `* * * * * www-data php /var/www/akaunting/artisan schedule:run`.

## Kimai 2

```yaml
services:
  kimai:
    image: kimai/kimai2:apache
    ports: ["127.0.0.1:8001:8001"]
    environment:
      ADMINMAIL: temps@corp.exemple.fr
      ADMINPASS: "MdpAdmin2026!"
      DATABASE_URL: "mysql://kimai:MdpKimai2026@db/kimai?charset=utf8mb4&serverVersion=11.4.0-MariaDB"
    volumes: ["kimai-data:/opt/kimai/var/data", "kimai-plugins:/opt/kimai/var/plugins"]
    depends_on: [db]
  db:
    image: mariadb:11.4
    environment: { MARIADB_DATABASE: kimai, MARIADB_USER: kimai, MARIADB_PASSWORD: MdpKimai2026, MARIADB_RANDOM_ROOT_PASSWORD: "1" }
    volumes: ["db-data:/var/lib/mysql"]
volumes: { kimai-data: {}, kimai-plugins: {}, db-data: {} }
```

Installation classique (Linux, Windows, macOS) : PHP 8.1+, Composer, `git clone https://github.com/kimai/kimai.git`, `composer install --optimize-autoloader`, `DATABASE_URL` dans `.env`, puis `bin/console kimai:install -n`. Administration : clients, projets, activités, tarifs, équipes, rôles ; exports (PDF, Excel) et **factures** à partir des temps ; applications mobiles et de bureau tierces.

```bash
bin/console kimai:user:create jk jk@corp.exemple.fr ROLE_SUPER_ADMIN      # le mot de passe est demandé
bin/console kimai:user:list ; bin/console kimai:reload
```

<!-- CAPTURE: Feuille de temps hebdomadaire Kimai | _assets/kimai-feuille-temps.png -->

## Crater (archivé)

Crater n'est plus développé. Son successeur communautaire **InvoiceShelf** reprend le code et propose une migration ; à défaut, exporter clients et factures (CSV/PDF) vers Invoice Ninja ou Dolibarr.

Commandes : [[90-aide-memoire|aide-mémoire]].
