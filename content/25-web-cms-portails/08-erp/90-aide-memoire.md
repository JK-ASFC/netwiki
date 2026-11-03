---
title: ERP — aide-mémoire des commandes
description: Commandes Odoo (service, odoo -i -u --stop-after-init, sauvegarde base et filestore, Docker), ERPNext (bench new-site, get-app, install-app, backup, restore, update, migrate, set-admin-password, doctor, frappe_docker), Dolibarr (Docker, sauvegarde), Tryton (trytond-admin), iDempiere (Docker), OFBiz (gradlew) avec exemples.
tags: [aide-mémoire, odoo, erpnext, bench, dolibarr, tryton, idempiere, ofbiz]
icon: terminal
---

Explications : [[01-odoo|Odoo]] · [[02-frappe-erpnext|ERPNext]] · [[03-dolibarr-tryton|Dolibarr, Tryton]] · [[04-idempiere-metasfresh-ofbiz-erp5-frontaccounting|autres ERP]].

## Odoo

```bash
sudo systemctl status odoo ; sudo tail -f /var/log/odoo/odoo-server.log
sudo -u odoo odoo -c /etc/odoo/odoo.conf -d erp -i stock --stop-after-init
sudo -u odoo odoo -c /etc/odoo/odoo.conf -d erp -u all --stop-after-init
sudo -u postgres pg_dump -Fc erp > /srv/sauvegardes/odoo-$(date +%F).dump
sudo tar czf /srv/sauvegardes/odoo-filestore-$(date +%F).tar.gz -C /var/lib/odoo filestore/erp
docker logs -f odoo ; docker exec -it odoo odoo shell -d erp
```

## ERPNext (bench)

```bash
cd ~/frappe-bench
bench new-site erp.corp.exemple.fr --db-root-password 'MdpRootMariadb2026' --admin-password 'MdpAdmin2026!'
bench get-app --branch version-16 erpnext && bench --site erp.corp.exemple.fr install-app erpnext
bench --site erp.corp.exemple.fr backup --with-files
bench --site erp.corp.exemple.fr restore sauvegarde.sql.gz
bench update ; bench --site erp.corp.exemple.fr migrate ; bench doctor
bench --site erp.corp.exemple.fr set-admin-password 'NouveauMdp2026!'
docker compose -f pwd.yml up -d                                        # démonstration frappe_docker
```

## Dolibarr, Tryton, iDempiere, OFBiz

```bash
mysqldump --single-transaction dolibarr > /srv/sauvegardes/dolibarr-$(date +%F).sql
sudo tar czf /srv/sauvegardes/dolibarr-documents-$(date +%F).tar.gz -C /var/lib/dolibarr documents
trytond-admin -c /opt/tryton/trytond.conf -d tryton --all
docker logs -f idempiere
./gradlew cleanAll loadAll && ./gradlew ofbiz
```
