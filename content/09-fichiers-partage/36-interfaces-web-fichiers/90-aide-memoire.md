---
title: File Browser, Filestash et SFTPGo — aide-mémoire des commandes
description: Commandes File Browser (config init/set/cat, users add/update/ls/rm, rules, cmds), Filestash (docker compose, journaux), SFTPGo (sftpgo serve, initprovider, resetprovider, gen completion ; API REST /api/v2 : token, users, connections, dumpdata, loaddata ; journaux) et test de connexion SFTP/FTPS avec exemples.
tags: [aide-mémoire, file browser, filestash, sftpgo]
icon: terminal
---

Explications : [[01-file-browser-filestash|File Browser et Filestash]] · [[02-sftpgo|SFTPGo]].

```bash
filebrowser config cat -d fb.db ; filebrowser users ls -d fb.db ; filebrowser users update jk --scope /srv/partage/jk -d fb.db ; filebrowser users rm ancien -d fb.db
docker compose -f filestash.yml logs -f
sudo systemctl status sftpgo ; sudo journalctl -u sftpgo -f ; sftpgo initprovider -c /etc/sftpgo ; sftpgo --version
T=$(curl -s -u admin:"$MDP" http://localhost:8080/api/v2/token | jq -r .access_token)
curl -s -H "Authorization: Bearer $T" http://localhost:8080/api/v2/users | jq '.[].username'
curl -s -H "Authorization: Bearer $T" http://localhost:8080/api/v2/connections | jq .
curl -s -H "Authorization: Bearer $T" "http://localhost:8080/api/v2/dumpdata?output-data=1" > sftpgo-config.json
sftp -P 2022 partenaire@sftp.corp.exemple.fr ; lftp -u partenaire -e 'set ftp:ssl-force true; ls; bye' sftp.corp.exemple.fr:2121
```
