---
title: Airsonic-Advanced
description: Airsonic-Advanced, héritier Java de Subsonic et Airsonic (GPL) — état du projet (peu maintenu), installation existante en Docker ou WAR (Java, port 4040), dossiers de musique, transcodage, utilisateurs, base de données externe, sauvegarde, et migration vers Navidrome ou gonic.
tags: [airsonic, airsonic-advanced, subsonic, java, musique, migration, navidrome]
icon: music
---

**Airsonic-Advanced** est un fork d'**Airsonic**, lui-même fork libre de **Subsonic** (devenu propriétaire). Écrit en Java (Spring Boot), il propose une interface web, l'API Subsonic, les podcasts, les vidéos et une gestion fine des utilisateurs.

> [!WARNING]
> Le projet n'a plus de version publiée depuis longtemps et ses dépendances vieillissent. Pour une nouvelle installation, préférez **Navidrome** (voir la page dédiée du wiki) ou **gonic**, compatibles avec les mêmes clients Subsonic. Cette page sert à exploiter une installation existante et à préparer sa migration.

## Installation existante

```bash
# Docker (image de la communauté)
docker run -d --name airsonic --restart unless-stopped -p 4040:4040 \
  -v airsonic_data:/var/airsonic -v /srv/musique:/var/music:ro \
  -e JAVA_OPTS="-Xmx512m" airsonicadvanced/airsonic-advanced:latest

# Fichier WAR autonome (Java 11 ou plus)
java -Dserver.port=4040 -Dairsonic.home=/var/airsonic -jar airsonic.war
```

| Réglage | Emplacement |
| --- | --- |
| Dossiers de musique, podcasts | *Paramètres → Dossiers de médias* |
| Transcodage | *Paramètres → Transcodage* (FFmpeg) |
| Utilisateurs et droits | *Paramètres → Utilisateurs* |
| Base de données | HSQLDB intégrée par défaut ; PostgreSQL ou MariaDB possibles (`airsonic.properties`) |
| Contexte d'URL derrière un proxy | `server.servlet.context-path` (ex. `/musique`) |

## Sauvegarde

Arrêter le service, puis sauvegarder `/var/airsonic` (base, `airsonic.properties`, index, pochettes).

## Migrer vers Navidrome

1. Installer Navidrome avec le **même dossier de musique** (voir la page Navidrome du wiki).
2. Recréer les utilisateurs.
3. Exporter les **listes de lecture** depuis Airsonic (fichiers M3U) et les placer dans un dossier analysé par Navidrome (`PlaylistsPath`).
4. Pointer les **clients Subsonic** (DSub, Symfonium, Substreamer) vers la nouvelle adresse : l'API est la même.
5. Les notes et favoris ne se migrent pas tous automatiquement : des scripts communautaires existent, à tester sur une copie.

Voir aussi : [[01-comparatif|choisir un serveur de musique]]. Commandes : [[90-aide-memoire|aide-mémoire]].
