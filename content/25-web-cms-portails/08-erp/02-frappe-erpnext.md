---
title: Frappe Framework et ERPNext
description: ERPNext (GPL v3) et Frappe Framework (MIT) — ERP complet en Python et JavaScript (comptabilité, ventes, achats, stock, fabrication, projets, RH avec Frappe HR) : architecture (MariaDB, Redis, Node.js, workers), installation par bench (bench init, new-site, get-app, install-app, setup production) sous Ubuntu/Debian, démonstration et production par frappe_docker (pwd.yml, compose), macOS pour le développement, commandes bench (backup, restore, migrate, update, set-admin-password), sauvegarde et dépannage.
tags: [erpnext, frappe, erp, python, mariadb, bench, docker]
icon: layout-dashboard
---

**Frappe Framework** (MIT) est un cadriciel d'applications web « tout en métadonnées » (*DocTypes*, formulaires, droits, API REST, rapports, flux) ; **ERPNext** (GPL v3) est l'ERP bâti dessus : comptabilité, ventes, achats, **stock**, fabrication, projets, support, et les RH avec l'application **Frappe HR**. Les versions majeures suivent des branches `version-NN` (version 16 actuellement).

| Composant | Rôle |
| --- | --- |
| MariaDB (ou PostgreSQL pour Frappe) | Base de données |
| Redis | Cache, files de tâches, temps réel |
| Gunicorn, workers, scheduler | Application, tâches de fond, planification |
| Node.js (socket.io) | Notifications en temps réel |
| NGINX, supervisor ou systemd | Production (`bench setup production`) |

## Démonstration rapide (Docker)

```bash
git clone https://github.com/frappe/frappe_docker && cd frappe_docker
docker compose -f pwd.yml up -d          # site créé en quelques minutes, http://localhost:8080 (Administrator / admin)
```

`pwd.yml` est **jetable** : pour la production, suivre la documentation de `frappe_docker` (fichiers Compose avec base, Redis, proxy, sauvegardes, images personnalisées contenant vos applications). Windows et macOS : Docker Desktop.

## Production avec bench (Ubuntu / Debian)

```bash
sudo apt install -y git python3-dev python3-venv redis-server mariadb-server libmysqlclient-dev pkg-config xvfb libfontconfig wkhtmltopdf nodejs npm
sudo npm install -g yarn
sudo mysql_secure_installation          # mot de passe root de MariaDB ; jeu de caractères utf8mb4 dans la configuration
sudo adduser frappe && sudo usermod -aG sudo frappe && sudo -iu frappe
pipx install frappe-bench                # ou pip install frappe-bench
bench init --frappe-branch version-16 frappe-bench && cd frappe-bench
bench new-site erp.corp.exemple.fr --db-root-password 'MdpRootMariadb2026' --admin-password 'MdpAdmin2026!'
bench get-app --branch version-16 erpnext
bench --site erp.corp.exemple.fr install-app erpnext
bench --site erp.corp.exemple.fr enable-scheduler
sudo bench setup production frappe      # NGINX + supervisor
bench setup lets-encrypt erp.corp.exemple.fr
```

Ouvrir `https://erp.corp.exemple.fr` : assistant de configuration (société, pays, devise, plan comptable, exercice), puis modules. RH : `bench get-app --branch version-16 hrms && bench --site erp.corp.exemple.fr install-app hrms`.

<!-- CAPTURE: Espace de travail Comptabilité d'ERPNext | _assets/erpnext-comptabilite.png -->

## Exploitation

```bash
cd ~/frappe-bench
bench --site erp.corp.exemple.fr backup --with-files            # sites/<site>/private/backups
bench --site erp.corp.exemple.fr restore sauvegarde.sql.gz --with-private-files fichiers-prives.tar --with-public-files fichiers-publics.tar
bench update                                                     # mise à jour des applications de la branche, migrations, compilation
bench --site erp.corp.exemple.fr migrate
bench --site erp.corp.exemple.fr set-admin-password 'NouveauMdp2026!'
bench --site erp.corp.exemple.fr add-system-manager jk@corp.exemple.fr
bench doctor ; bench --site erp.corp.exemple.fr console
```

Changement de version majeure : `bench switch-to-branch version-NN frappe erpnext --upgrade`, puis `bench update` sur une **copie** d'abord.

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Tâches planifiées et courriels arrêtés | Scheduler désactivé, workers arrêtés | `enable-scheduler`, `bench doctor`, supervisor |
| Erreur de jeu de caractères à la création du site | MariaDB sans `utf8mb4` | `character-set-server = utf8mb4`, `collation-server = utf8mb4_unicode_ci` |
| PDF incorrects | wkhtmltopdf non patché | Version qt patchée |

Commandes : [[90-aide-memoire|aide-mémoire]].
