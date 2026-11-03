---
title: Dolibarr et Tryton
description: Dolibarr (GPL v3) — ERP et CRM PHP pour TPE, PME et associations (tiers, devis, factures, stock, projets, RH, point de vente) : installation par archive et assistant /install, paquets deb et rpm, DoliWamp sous Windows, Docker dolibarr/dolibarr, modules, sauvegarde et mise à jour ; Tryton (GPL v3) — ERP modulaire en Python : serveur trytond, client bureau ou web Sao, pip, trytond-admin, PostgreSQL, Docker tryton/tryton.
tags: [dolibarr, tryton, erp, crm, php, python, pme]
icon: briefcase
---

## Dolibarr

**Dolibarr** (GPL v3) est un ERP/CRM simple et modulaire, très utilisé par les TPE, PME, artisans et **associations** (adhérents, dons) : tiers et contacts, devis, commandes, **factures** et paiements, stock, projets et temps, notes de frais, congés, banque, point de vente, site web. On n'active que les modules utiles.

Prérequis : PHP 8.x (`mysqli` ou `pgsql`, `gd`, `curl`, `intl`, `zip`, `imap` facultatif), MariaDB/MySQL ou PostgreSQL, Apache ou NGINX.

```bash
sudo apt install -y apache2 mariadb-server unzip php libapache2-mod-php php-mysql php-gd php-curl php-intl php-zip php-xml php-mbstring
sudo mariadb -e "CREATE DATABASE dolibarr CHARACTER SET utf8mb4; CREATE USER 'dolibarr'@'localhost' IDENTIFIED BY 'MdpDolibarr2026'; GRANT ALL ON dolibarr.* TO 'dolibarr'@'localhost';"
V=24.0.2
wget https://github.com/Dolibarr/dolibarr/archive/refs/tags/$V.tar.gz -O dolibarr-$V.tar.gz && tar xzf dolibarr-$V.tar.gz
sudo mv dolibarr-$V /var/www/dolibarr && sudo mkdir -p /var/lib/dolibarr/documents
sudo chown -R www-data:www-data /var/www/dolibarr/htdocs/conf /var/lib/dolibarr/documents
```

Racine web : `/var/www/dolibarr/htdocs`. Ouvrir `https://gestion.corp.exemple.fr/install/` : vérification des prérequis, base, dossier des documents (`/var/lib/dolibarr/documents`, hors racine web), compte administrateur. À la fin, créer le fichier `install.lock` dans le dossier des documents pour verrouiller l'installateur. Autres méthodes : paquets `.deb`/`.rpm` du projet, **DoliWamp** (installateur Windows tout-en-un), Docker :

```bash
docker run -d --name dolibarr -p 127.0.0.1:8080:80 -e DOLI_DB_HOST=db -e DOLI_DB_USER=dolibarr -e DOLI_DB_PASSWORD=MdpDolibarr2026 -e DOLI_DB_NAME=dolibarr -e DOLI_ADMIN_LOGIN=admin -e DOLI_ADMIN_PASSWORD='MdpAdmin2026!' -v dolibarr-docs:/var/www/documents --network erp dolibarr/dolibarr:latest
```

*Accueil → Configuration* : société, modules, dictionnaires, droits des utilisateurs et groupes. Sauvegarde : *Outils d'administration → Sauvegarde* (base et documents) ou `mysqldump` + dossier `documents`. Mise à jour : remplacer les fichiers, supprimer `install.lock`, lancer `/install/` (mise à jour de la base), recréer `install.lock`.

<!-- CAPTURE: Tableau de bord Dolibarr | _assets/dolibarr-tableau-de-bord.png -->

## Tryton

**Tryton** (GPL v3) est un ERP modulaire en Python, issu d'OpenERP : comptabilité, ventes, achats, stock, production, projets ; serveur **trytond** (PostgreSQL), client de bureau **tryton** (Windows, macOS, Linux) ou client web **Sao**. Versions LTS tous les 2,5 ans environ.

```bash
python3 -m venv /opt/tryton && . /opt/tryton/bin/activate
pip install "trytond[PostgreSQL]" trytond-account trytond-sale trytond-stock
sudo -u postgres createuser -P tryton && sudo -u postgres createdb -O tryton tryton
cat > /opt/tryton/trytond.conf <<'CONF'
[database]
uri = postgresql://tryton:MdpTryton2026@localhost:5432/
[web]
listen = 127.0.0.1:8000
CONF
trytond-admin -c /opt/tryton/trytond.conf -d tryton --all       # crée le schéma et demande le mot de passe de l'administrateur
trytond -c /opt/tryton/trytond.conf
```

Docker : image officielle `tryton/tryton` (serveur et client web). Client de bureau : installateurs du site Tryton (Windows, macOS) ou paquet `tryton` des distributions. Mise à jour de modules : `trytond-admin -c trytond.conf -d tryton --all` après `pip install -U`.

Commandes : [[90-aide-memoire|aide-mémoire]].
