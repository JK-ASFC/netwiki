---
title: OpenKM, LogicalDOC et SeedDMS — aide-mémoire
description: Adresses, comptes par défaut à changer, accès WebDAV et CMIS, démarrage et sauvegarde d'OpenKM, LogicalDOC et SeedDMS.
tags: [aide-mémoire, openkm, logicaldoc, seeddms, ged]
icon: terminal
---

Explications : [[01-openkm-logicaldoc-seeddms|OpenKM, LogicalDOC et SeedDMS]].

| GED | Interface | Compte initial | WebDAV / CMIS |
| --- | --- | --- | --- |
| OpenKM CE | `:8080/OpenKM` | okmAdmin / admin | `/OpenKM/webdav` |
| LogicalDOC CE | `:8080` | admin / admin | `/webdav`, `/service/cmis` |
| SeedDMS | `/` (Apache) | admin / admin (après installation) | `/webdav/index.php` |

```bash
# OpenKM
/opt/openkm/bin/startup.sh ; /opt/openkm/bin/shutdown.sh ; tail -f /opt/openkm/logs/catalina.out

# LogicalDOC
/opt/logicaldoc/bin/logicaldoc.sh start|stop

# SeedDMS (index texte intégral : Outils d'administration → Index texte intégral → Reconstruire)
sudo tail -f /var/log/apache2/error.log

# Sauvegarde cohérente (exemple MariaDB + dépôt)
mysqldump --single-transaction ged > /sauvegardes/ged-$(date +%F).sql
tar czf /sauvegardes/depot-$(date +%F).tgz /var/lib/ged/depot

# Monter la GED en WebDAV sous Linux
sudo mount -t davfs https://ged.exemple.fr/webdav /mnt/ged
```
