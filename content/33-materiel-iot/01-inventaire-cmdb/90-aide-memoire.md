---
title: FusionInventory, i-doit et CMDBuild — aide-mémoire
description: Commandes de l'agent FusionInventory (Linux, Windows, inventaire local, remontée serveur), installation d'i-doit Open (bases LAMP, API JSON-RPC) et notes CMDBuild (Tomcat, PostgreSQL).
tags: [aide-mémoire, fusioninventory, i-doit, cmdbuild, inventaire, cmdb]
icon: terminal
---

Explications : [[01-fusioninventory-idoit-cmdbuild|FusionInventory, i-doit et CMDBuild]].

```bash
# Agent FusionInventory / GLPI
sudo apt install fusioninventory-agent
fusioninventory-agent --server https://glpi.exemple.fr/front/inventory.php
fusioninventory-agent --local /tmp --json          # inventaire local (test)
systemctl status fusioninventory-agent

# Windows (MSI)
# msiexec /i fusioninventory-agent_x64.msi /quiet SERVER="https://glpi.exemple.fr/front/inventory.php" RUNNOW=1

# i-doit Open (bases)
sudo mysql -e "CREATE DATABASE idoit_data; CREATE DATABASE idoit_system;"
# API JSON-RPC (exemple de version)
curl -X POST https://idoit.exemple.fr/src/jsonrpc.php -H 'Content-Type: application/json' \
  -d '{"version":"2.0","method":"idoit.version","params":{"apikey":"…"},"id":1}'
```

| Outil | Accès | Base |
| --- | --- | --- |
| i-doit Open | Apache/PHP | MariaDB/MySQL (idoit_data, idoit_system) |
| CMDBuild | Tomcat | PostgreSQL |
| GLPI (rappel) | Apache/PHP | MariaDB/MySQL |
