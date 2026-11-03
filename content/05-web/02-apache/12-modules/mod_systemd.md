---
title: "mod_systemd"
description: "Module Apache mod_systemd — Fournit un support amélioré pour l'intégration de systemd. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_systemd]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un support amélioré pour l'intégration de systemd |
| **Statut** | Extension |
| **Identificateur** | `systemd_module` |
| **Fichier source** | `mod_systemd.c` |

## Sommaire

Ce module implémente le support de l'intégration de systemd. Il permet d'utiliser httpd en temps que service avec le paramètre de systemd `Type=notify` (voir la page de manuel [systemd.service(5)](https://www.freedesktop.org/software/systemd/man/systemd.service.html) pour plus de détails). Le module est activé s'il est chargé.

**Exemple basique d'unité de service systemd (à étoffer pour un système en production)**

```
[Unit]
Description=The Apache HTTP Server
After=network.target

[Service]
Type=notify
ExecStart=/usr/local/apache2/bin/httpd -D FOREGROUND -k start
ExecReload=/usr/local/apache2/bin/httpd -k graceful
KillMode=mixed

[Install]
WantedBy=multi-user.target
```

Si vous utilisez `ExecStop` et/ou `KillMode`, vous devez prêter une attention particulière à leur configuration pour ce service. Si elle est présente, une commande `ExecStop` doit être une *operation synchrone* qui se termine elle-même en même temps que le démon. Cette condition n'est pas satisfaite si vous exécutez la commande `httpd -k stop` de manière *asynchrone*, car elle initie l'arrêt du démon. L'exemple ci-dessus utilise `KillMode=mixed` afin que systemd envoie `SIGTERM` au processus parent (et seulement à ce dernier) pour lui indiquer qu'il doit s'arrêter. Les processus encore en cours d'exécution après un temps égal à `TimeoutStopSec` recevront alors le signal `SIGKILL`. Voir [systemd.kill(5)](https://www.freedesktop.org/software/systemd/man/systemd.kill.html) pour plus d'informations.

Ce module ne fournit pas le support de l'activation du socket Systemd.

[[13-directives/extendedstatus|ExtendedStatus]] est activé par défaut si le module est chargé. Si [[13-directives/extendedstatus|ExtendedStatus]] n'est pas explicitement désactivé dans le fichier de configuration, les statistiques à propos de la charge et des requêtes pendant l'exécution apparaîtront dans la sortie de la commande `systemctl status`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
