---
title: Velociraptor et GRR — aide-mémoire
description: Commandes Velociraptor (config generate, config client, debian server, rpm client, gui pour un essai local, artifacts list/collect en ligne de commande, query, user add, service) et requêtes VQL fréquentes (processus, connexions, fichiers récents, tâches planifiées), avec exemples.
tags: [aide-mémoire, velociraptor, vql, grr]
icon: terminal
---

Explications : [[01-presentation-installation|Velociraptor et GRR]].

```bash
velociraptor gui                                   # instance locale de test (navigateur ouvert automatiquement)
velociraptor config generate -i ; velociraptor --config server.config.yaml config client > client.config.yaml
velociraptor --config server.config.yaml user add jk --role administrator
velociraptor --config client.config.yaml rpm client --binary velociraptor-linux-amd64
velociraptor artifacts list | grep -i persistence ; velociraptor artifacts collect Windows.System.Pslist --output pslist.zip
velociraptor query "SELECT * FROM info()" ; sudo systemctl status velociraptor_server
```

```sql
SELECT * FROM netstat() WHERE Status = 'ESTAB' AND Raddr.IP =~ '^(?!10\\.)'
SELECT FullPath, Mtime FROM glob(globs='C:/Users/*/AppData/Roaming/**/*.exe') WHERE Mtime > now() - 86400 * 7
SELECT * FROM Artifact.Windows.System.TaskScheduler()
```
