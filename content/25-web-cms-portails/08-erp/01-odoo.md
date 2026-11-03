---
title: Odoo Community
description: Odoo Community (LGPL v3) — ERP et CRM modulaires en Python (ventes, achats, stock, comptabilité, CRM, site web, projets, RH) : éditions Community et Enterprise, prérequis (PostgreSQL, wkhtmltopdf), installation par le dépôt nightly.odoo.com sous Debian/Ubuntu, RPM sous RHEL, installateur Windows, Docker (image officielle odoo avec postgres), odoo.conf (admin_passwd, db_filter, list_db, proxy_mode, workers), reverse proxy NGINX, modules (odoo-bin -i, -u), sauvegarde et restauration des bases, mise à jour de version et dépannage.
tags: [odoo, erp, crm, python, postgresql, docker]
icon: factory
---

**Odoo** propose des dizaines d'**applications** intégrées : CRM, ventes, achats, stock, fabrication, comptabilité, facturation, site web et e-commerce, projets, feuilles de temps, RH. L'édition **Community** (LGPL v3) est libre ; l'édition **Enterprise** (licence par utilisateur) ajoute des modules (comptabilité complète dans certains pays, études, mobile, etc.) et la migration assistée entre versions. Une version majeure sort chaque année (Odoo 20 actuellement), chacune maintenue trois ans.

Prérequis : **PostgreSQL** (local ou distant), Python (fourni par le paquet), **wkhtmltopdf** (version patchée qt recommandée) pour les PDF, 2 Go de RAM minimum.

## Debian / Ubuntu (dépôt officiel)

```bash
sudo apt install -y postgresql
wget -q -O - https://nightly.odoo.com/odoo.key | sudo gpg --dearmor -o /usr/share/keyrings/odoo-archive-keyring.gpg
echo 'deb [signed-by=/usr/share/keyrings/odoo-archive-keyring.gpg] https://nightly.odoo.com/20.0/nightly/deb/ ./' | sudo tee /etc/apt/sources.list.d/odoo.list
sudo apt update && sudo apt install -y odoo
sudo systemctl enable --now odoo                  # http://srv-erp-01:8069
```

RHEL/Fedora : dépôt `https://nightly.odoo.com/20.0/nightly/rpm/odoo.repo` puis `dnf install odoo`. **Windows** : installateur `.exe` (Odoo, PostgreSQL et service Windows). **macOS** : depuis les sources (`pip install -r requirements.txt`, `./odoo-bin`) ou Docker.

## Docker

```bash
docker network create odoo
docker run -d --name db --network odoo -e POSTGRES_USER=odoo -e POSTGRES_PASSWORD=MdpOdoo2026 -e POSTGRES_DB=postgres -v odoo-db:/var/lib/postgresql/data postgres:16
docker run -d --name odoo --network odoo -p 127.0.0.1:8069:8069 -e HOST=db -e USER=odoo -e PASSWORD=MdpOdoo2026 \
  -v odoo-data:/var/lib/odoo -v /srv/odoo/config:/etc/odoo -v /srv/odoo/addons:/mnt/extra-addons odoo:20
```

## Configuration (odoo.conf)

`/etc/odoo/odoo.conf` :

```ini
[options]
admin_passwd = MotDePasseMaitreLongEtAleatoire
db_host = localhost
db_user = odoo
db_password = False
db_filter = ^erp$
list_db = False
proxy_mode = True
workers = 4
max_cron_threads = 1
addons_path = /usr/lib/python3/dist-packages/odoo/addons,/opt/odoo/addons-personnalises
data_dir = /var/lib/odoo
```

- `admin_passwd` (**mot de passe maître**) protège la gestion des bases (création, suppression, sauvegarde) : le rendre long et unique, et désactiver le gestionnaire de bases en production (`list_db = False`).
- `workers` > 0 active le mode multiprocessus (prévoir `gevent_port`/`longpolling` 8072 pour le chat et les notifications : NGINX doit router `/websocket` vers 8072).
- `proxy_mode = True` derrière un reverse proxy TLS (en-têtes `X-Forwarded-*`).

Première connexion : `https://erp.corp.exemple.fr/web/database/manager` (créer la base `erp`, langue, pays, compte administrateur), puis *Applications* pour installer les modules.

<!-- CAPTURE: Écran des applications Odoo | _assets/odoo-applications.png -->

## Exploitation

```bash
sudo -u odoo odoo -c /etc/odoo/odoo.conf -d erp -u all --stop-after-init         # mettre à jour tous les modules (après correctif)
sudo -u odoo odoo -c /etc/odoo/odoo.conf -d erp -i stock,purchase --stop-after-init
sudo -u postgres pg_dump -Fc erp > /srv/sauvegardes/odoo-$(date +%F).dump
sudo tar czf /srv/sauvegardes/odoo-filestore-$(date +%F).tar.gz -C /var/lib/odoo filestore/erp
sudo journalctl -u odoo -f ; sudo tail -f /var/log/odoo/odoo-server.log
```

Sauvegarder **la base et le filestore** ensemble (pièces jointes). Changement de version majeure : la base doit être **migrée** (service de l'éditeur pour Enterprise, ou outils communautaires OpenUpgrade pour Community), jamais simplement ouverte par la nouvelle version.

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| PDF vides ou sans en-tête | wkhtmltopdf absent ou non patché | Installer la version recommandée par Odoo |
| Notifications et chat en direct inopérants | `/websocket` non routé vers 8072 | Règle NGINX dédiée avec en-têtes `Upgrade` |
| Liste des bases visible sur Internet | `list_db` actif, `db_filter` absent | `list_db = False`, `db_filter` |
| Module introuvable | `addons_path` incomplet | Ajouter le dossier puis *Mettre à jour la liste des applications* |

Commandes : [[90-aide-memoire|aide-mémoire]].
