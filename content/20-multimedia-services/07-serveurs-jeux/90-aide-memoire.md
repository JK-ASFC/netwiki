---
title: Serveurs de jeux (Minecraft, Terraria) — aide-mémoire des commandes
description: Commandes de serveurs de jeux avec exemples — Minecraft Java (lancement avec options JVM, server.properties, console et RCON avec mcrcon : liste, liste blanche, opérateurs, sauvegarde à chaud save-off/save-all/save-on, arrêt propre), Paper, Docker itzg/minecraft-server, Terraria (serveur dédié, fichier de configuration, commandes de console), service systemd, pare-feu, sauvegardes.
tags: [aide-mémoire, minecraft, terraria, rcon, serveur de jeux, docker]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-minecraft|Minecraft]] et [[02-terraria|Terraria]].

## Minecraft Java

```bash
java -Xms2G -Xmx4G -XX:+UseG1GC -jar paper.jar --nogui
docker run -d --name mc -p 25565:25565 -e EULA=TRUE -e TYPE=PAPER -e MEMORY=4G -e ENABLE_RCON=true -e RCON_PASSWORD="$MDP_RCON" \
  -v /srv/minecraft:/data --restart unless-stopped itzg/minecraft-server
docker exec mc rcon-cli list
```

```properties
# server.properties (extraits)
server-port=25565
max-players=20
online-mode=true
white-list=true
enforce-whitelist=true
enable-rcon=true
rcon.port=25575
rcon.password=MotDePasseRconLong2026
motd=Serveur NetWiki
```

### Console et RCON

```bash
mcrcon -H 127.0.0.1 -P 25575 -p "$MDP_RCON" "list"
mcrcon -H 127.0.0.1 -P 25575 -p "$MDP_RCON" "whitelist add Joueur1" "whitelist list"
mcrcon -H 127.0.0.1 -P 25575 -p "$MDP_RCON" "op Joueur1"
mcrcon -H 127.0.0.1 -P 25575 -p "$MDP_RCON" "say Redémarrage dans 5 minutes"
# Sauvegarde à chaud cohérente
mcrcon -H 127.0.0.1 -P 25575 -p "$MDP_RCON" "save-off" "save-all flush"
tar czf /srv/sauvegardes/minecraft-$(date +%F_%H%M).tar.gz -C /srv/minecraft world world_nether world_the_end
mcrcon -H 127.0.0.1 -P 25575 -p "$MDP_RCON" "save-on"
mcrcon -H 127.0.0.1 -P 25575 -p "$MDP_RCON" "stop"          # arrêt propre
```

Le port RCON (25575) ne doit **jamais** être exposé sur Internet.

## Terraria (serveur dédié)

```bash
./TerrariaServer.bin.x86_64 -config /srv/terraria/serverconfig.txt
```

```text
# /srv/terraria/serverconfig.txt
world=/srv/terraria/Mondes/Monde1.wld
autocreate=2
worldname=Monde1
maxplayers=8
port=7777
password=MotDePasseServeur
secure=1
```

Commandes de console : `help`, `playing`, `kick <joueur>`, `ban <joueur>`, `save`, `say <message>`, `exit`.

## Service et pare-feu

```ini
# /etc/systemd/system/minecraft.service
[Service]
User=minecraft
WorkingDirectory=/srv/minecraft
ExecStart=/usr/bin/java -Xms2G -Xmx4G -jar paper.jar --nogui
ExecStop=/usr/local/bin/mcrcon -H 127.0.0.1 -P 25575 -p ${MDP_RCON} stop
EnvironmentFile=/srv/minecraft/.env
Restart=on-failure
```

```bash
sudo nft add rule inet filter input tcp dport 25565 accept        # Minecraft
sudo nft add rule inet filter input tcp dport 7777 accept         # Terraria
```
