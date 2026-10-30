---
title: Seafile — aide-mémoire des commandes
description: Commandes Seafile avec exemples — démarrage et arrêt (seafile.sh, seahub.sh), Docker Compose, réinitialisation du mot de passe administrateur, ramasse-miettes (seaf-gc), vérification et réparation des bibliothèques (seaf-fsck), export de bibliothèques, client en ligne de commande (seaf-cli), API Web, sauvegarde (bases et données), journaux.
tags: [aide-mémoire, seafile, seaf-cli, seaf-gc, seaf-fsck, synchronisation]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Seafile]]. Chemins d'une installation classique : `/opt/seafile/seafile-server-latest/`.

## Serveur

```bash
cd /opt/seafile/seafile-server-latest
./seafile.sh start && ./seahub.sh start
./seahub.sh stop && ./seafile.sh stop
./reset-admin.sh                                   # réinitialiser / créer l'administrateur
# Docker
cd /opt/seafile-docker && docker compose up -d && docker compose logs -f seafile
docker exec -it seafile /opt/seafile/seafile-server-latest/reset-admin.sh
```

## Maintenance des données

```bash
./seafile.sh stop                                    # recommandé (ou --dry-run à chaud)
./seaf-gc.sh --dry-run                               # ramasse-miettes : estimation
./seaf-gc.sh                                         # supprimer les blocs inutilisés
./seaf-gc.sh -r                                      # inclure les bibliothèques supprimées
./seaf-fsck.sh                                       # vérifier toutes les bibliothèques
./seaf-fsck.sh --repair <id-bibliotheque>
./seaf-fsck.sh --export /srv/export <id-bibliotheque>     # exporter les fichiers en clair
./seafile.sh start
```

## Client en ligne de commande (seaf-cli)

```bash
sudo apt install seafile-cli
seaf-cli init -d ~/.seafile-client
seaf-cli start
seaf-cli list-remote -s https://seafile.exemple.fr -u alice.martin@exemple.fr
seaf-cli sync -l <id-bibliotheque> -s https://seafile.exemple.fr -d ~/Seafile/Projets -u alice.martin@exemple.fr
seaf-cli status
seaf-cli desync -d ~/Seafile/Projets
```

## API Web

```bash
TOKEN=$(curl -s -d "username=alice.martin@exemple.fr&password=$MDP" https://seafile.exemple.fr/api2/auth-token/ | jq -r .token)
curl -s -H "Authorization: Token $TOKEN" https://seafile.exemple.fr/api2/repos/ | jq '.[] | {name, id, size}'
curl -s -H "Authorization: Token $TOKEN" "https://seafile.exemple.fr/api2/repos/<id>/dir/?p=/" | jq '.[].name'
```

## Sauvegarde

```bash
mysqldump --single-transaction ccnet_db > /srv/sauvegardes/seafile/ccnet_db.sql
mysqldump --single-transaction seafile_db > /srv/sauvegardes/seafile/seafile_db.sql
mysqldump --single-transaction seahub_db > /srv/sauvegardes/seafile/seahub_db.sql
rsync -a /opt/seafile/seafile-data /srv/sauvegardes/seafile/        # après les bases (cohérence)
```

## Journaux

```bash
tail -f /opt/seafile/logs/seafile.log /opt/seafile/logs/seahub.log
```
