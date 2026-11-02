---
title: Passbolt et Psono — aide-mémoire des commandes
description: Commandes Passbolt (cake passbolt healthcheck, register_user, migrate, cleanup, send_test_email, mysql_export ; go-passbolt-cli list resource/get/create) et Psono (docker compose, commandes d'administration du serveur), avec exemples de sauvegarde.
tags: [aide-mémoire, passbolt, psono]
icon: terminal
---

Explications : [[01-presentation-installation|Passbolt et Psono]].

```bash
CAKE="sudo su -s /bin/bash -c"
$CAKE "/usr/share/php/passbolt/bin/cake passbolt healthcheck" www-data
$CAKE "/usr/share/php/passbolt/bin/cake passbolt send_test_email --recipient=admin@corp.exemple.fr" www-data
$CAKE "/usr/share/php/passbolt/bin/cake passbolt mysql_export --dir /sauv/passbolt" www-data ; sudo tar czf /sauv/passbolt-gpg.tgz /etc/passbolt/gpg
passbolt list resource --column Name,Username,URI ; passbolt get resource --id <uuid>     # go-passbolt-cli (configurer avec « passbolt configure »)
docker compose ps ; docker compose logs -f psono-combo ; docker compose pull && docker compose up -d      # Psono : mise à jour
```
