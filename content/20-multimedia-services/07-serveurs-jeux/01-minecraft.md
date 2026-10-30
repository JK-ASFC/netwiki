---
title: Serveur Minecraft
description: Héberger un serveur Minecraft — éditions Java et Bedrock, serveurs Vanilla, Paper et Fabric, prérequis Java, installation sous Linux avec un utilisateur dédié et systemd (screen ou RCON), Docker (itzg/minecraft-server), server.properties (mode en ligne, liste blanche, distance de vue), opérateurs, sauvegardes cohérentes (save-off), performances (Aikar, pré-génération), sécurité réseau (port 25565, DDoS, greffons) et dépannage.
tags: [minecraft, serveur de jeux, paper, java, rcon, docker, sauvegarde]
icon: gamepad
---

Un serveur **Minecraft** permet de jouer à plusieurs dans un monde persistant : usage familial, associatif, pédagogique (Minecraft Education est une édition distincte) ou pour des événements d'entreprise.

| Édition | Serveur | Clients |
| --- | --- | --- |
| **Java** | `server.jar` officiel, **Paper** (optimisé, greffons Bukkit), Fabric/NeoForge (mods) | PC (Windows, macOS, Linux) |
| **Bedrock** | *Bedrock Dedicated Server* (Linux, Windows) | Consoles, mobiles, Windows |

Le **mode en ligne** (`online-mode=true`) vérifie que chaque joueur possède un compte Microsoft/Minecraft valide : ne le désactivez pas (sinon n'importe qui peut prendre le pseudo d'un administrateur).

## Installation (Java, Paper)

```bash
sudo apt install openjdk-21-jre-headless          # Java requis par la version du jeu (21 pour les versions récentes)
sudo useradd -r -m -d /srv/minecraft -s /bin/bash minecraft
sudo -iu minecraft
mkdir serveur && cd serveur
# Télécharger le paper-<version>.jar depuis papermc.io (ou le server.jar officiel), puis :
java -Xms2G -Xmx4G -jar paper.jar --nogui          # premier lancement : crée eula.txt
sed -i 's/eula=false/eula=true/' eula.txt           # acceptation du contrat de licence de Mojang
```

```ini /etc/systemd/system/minecraft.service
[Unit]
Description=Serveur Minecraft (Paper)
After=network-online.target

[Service]
User=minecraft
WorkingDirectory=/srv/minecraft/serveur
ExecStart=/usr/bin/java -Xms4G -Xmx4G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -jar paper.jar --nogui
# Arrêt propre : commande « stop » par RCON (outil mcrcon)
ExecStop=/usr/local/bin/mcrcon -H 127.0.0.1 -P 25575 -p MotDePasseRcon stop
Restart=on-failure
SuccessExitStatus=0 1 143

[Install]
WantedBy=multi-user.target
```

```yaml compose.yaml (Docker — image communautaire très complète)
services:
  minecraft:
    image: itzg/minecraft-server:latest
    environment:
      EULA: "TRUE"
      TYPE: PAPER
      VERSION: LATEST
      MEMORY: 4G
      ENABLE_WHITELIST: "true"
      WHITELIST: "Joueur1,Joueur2"
      OPS: "AdminPseudo"
      RCON_PASSWORD: MotDePasseRcon
      TZ: Europe/Paris
    ports: ["25565:25565"]
    volumes: ["./donnees:/data"]
    restart: unless-stopped
```

Windows : `java -jar` dans un dossier dédié (service via NSSM) ou le serveur Bedrock ; macOS : identique à Linux pour Java.

## server.properties

```properties server.properties (extraits)
motd=Serveur de l'association
online-mode=true
white-list=true
enforce-whitelist=true
max-players=20
view-distance=10
simulation-distance=8
difficulty=normal
pvp=false
enable-rcon=true
rcon.port=25575
rcon.password=MotDePasseRcon
enable-query=false
spawn-protection=16
```

```text Console / RCON
whitelist add NouveauJoueur
op AdminPseudo
save-all
ban PseudoMalveillant Comportement inapproprié
```

## Sauvegardes

```bash /usr/local/sbin/sauvegarde-minecraft.sh
#!/bin/bash
set -euo pipefail
R="mcrcon -H 127.0.0.1 -P 25575 -p MotDePasseRcon"
$R "say Sauvegarde en cours" save-off save-all
sleep 10
tar czf /srv/sauvegardes/minecraft/monde-$(date +%F_%H%M).tgz -C /srv/minecraft/serveur world world_nether world_the_end
$R save-on "say Sauvegarde terminée"
find /srv/sauvegardes/minecraft -name 'monde-*.tgz' -mtime +14 -delete
```

`save-off` suspend l'écriture du monde pendant la copie : la sauvegarde est cohérente sans arrêter le serveur.

## Performances

- **Paper** plutôt que le serveur officiel ; options JVM recommandées (« drapeaux d'Aikar ») ; 2 à 4 Go pour un petit groupe, davantage avec des mods.
- Réduire `view-distance` / `simulation-distance` ; **pré-générer** le monde (greffon Chunky) pour éviter les ralentissements d'exploration.
- Profiler avec le greffon **spark** (`/spark profiler`).

## Sécurité

- [ ] `online-mode=true`, **liste blanche**, opérateurs limités
- [ ] Port **25565** seul exposé ; RCON (25575) et Query **jamais** exposés (liaison locale, mot de passe fort)
- [ ] Greffons et mods depuis des sources reconnues (Modrinth, Hangar, SpigotMC), à jour — des mods piégés circulent
- [ ] Java et serveur à jour (la faille Log4Shell de 2021 touchait Minecraft)
- [ ] Protection contre les dénis de service : serveur derrière un pare-feu, éventuellement un proxy dédié (Velocity) ou un service anti-DDoS si public ; ne pas héberger un serveur public sur le réseau de l'entreprise
- [ ] Utilisateur dédié, sauvegardes hors du serveur

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `Unsupported class file major version` | Version de Java trop ancienne | Installer la version de Java exigée |
| Joueurs : « Not whitelisted » | Liste blanche | `whitelist add` |
| « Failed to verify username » | `online-mode` et client non authentifié / service Mojang indisponible | Client officiel connecté, attendre le rétablissement du service |
| Ralentissements (`Can't keep up!`) | CPU, mémoire, génération de chunks | Paper, pré-génération, spark, distances |
| Connexion impossible de l'extérieur | Port non redirigé, pare-feu | Redirection 25565/TCP, test depuis l'extérieur |
