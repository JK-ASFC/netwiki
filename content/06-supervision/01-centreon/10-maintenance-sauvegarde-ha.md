---
title: Maintenance, sauvegarde, mises à jour et haute disponibilité
description: Sauvegarde intégrée et restauration complète, rétention et partitionnement des données, purge, mises à jour mineures et majeures, migration vers un nouveau serveur, haute disponibilité, journaux et tâches planifiées de Centreon.
tags: [centreon, sauvegarde, restauration, mise à jour, upgrade, partitionnement, haute disponibilité]
icon: archive
---

## Sauvegarde intégrée

*Administration → Paramètres → Sauvegarde* :

| Paramètre | Recommandation |
| --- | --- |
| Sauvegarde activée | Oui |
| Répertoire | `/var/cache/centreon/backup` (volume séparé, puis copie externe) |
| Répertoire temporaire | `/tmp/backup` |
| Base de configuration (`centreon`) | Tous les jours |
| Base de supervision (`centreon_storage`) | Sauvegarde **complète** le dimanche, partielle (hors données volumineuses) les autres jours |
| Fichiers de configuration | Oui |
| Rétention | 7 à 30 jours |

Le script `/usr/share/centreon/cron/centreon-backup.pl` est lancé par `/etc/cron.d/centreon` (vers 03:30). Copiez ensuite les archives hors du serveur (rsync, outil de sauvegarde d'entreprise).

### Ce que contient une sauvegarde complète

| Élément | Emplacement |
| --- | --- |
| Base `centreon` (configuration) | dump SQL |
| Base `centreon_storage` (états, journaux, métriques) | dump SQL ou instantané LVM |
| Configuration Centreon | `/etc/centreon`, `/etc/centreon-engine`, `/etc/centreon-broker`, `/etc/centreon-gorgone` |
| Graphiques | `/var/lib/centreon/metrics`, `/var/lib/centreon/status` (RRD) |
| Plugins et scripts personnalisés | `/usr/lib/centreon/plugins` (paquets), vos scripts |
| Configuration système | `/etc/snmp`, `/etc/postfix`, certificats HTTPS |

> [!TIP]
> Complétez par un **export CLAPI** quotidien (`centreon -e`) versionné : il permet de restaurer ou comparer la configuration objet par objet, indépendamment de la base.

## Restauration complète (nouveau serveur)

1. Installer **la même version** de Centreon (mêmes dépôts) sur le nouveau serveur, **sans** lancer l'assistant web.
2. Arrêter les services : `systemctl stop cbd centengine gorgoned`.
3. Restaurer les bases :

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS centreon; DROP DATABASE IF EXISTS centreon_storage;"
mysql -u root -p -e "CREATE DATABASE centreon; CREATE DATABASE centreon_storage;"
gunzip -c centreon.sql.gz | mysql -u root -p centreon
gunzip -c centreon_storage.sql.gz | mysql -u root -p centreon_storage
# Recréer l'utilisateur SQL « centreon » avec le mot de passe de /etc/centreon/conf.pma.php ou databases.yaml
```

4. Restaurer les fichiers (`/etc/centreon*`, RRD) avec les bons propriétaires (`centreon`, `centreon-engine`, `centreon-broker`, `centreon-gorgone`).
5. Si l'IP du central change : mettre à jour la configuration des collecteurs (Broker, Gorgone), l'adresse du central dans *Configuration → Collecteurs*.
6. Démarrer les services, régénérer et exporter la configuration de tous les collecteurs, régénérer la base de traps.

## Rétention et volumétrie des données

*Administration → Paramètres → Options → Gestion des données* (selon version) :

| Donnée | Rétention typique |
| --- | --- |
| Données de performance en base (`data_bin`) | 31 à 180 jours |
| Graphiques RRD | 180 à 365 jours (la résolution diminue avec le temps) |
| Journaux d'événements (`logs`) | 31 à 180 jours |
| Données de disponibilité (rapports) | 1 an+ |

### Partitionnement

Les grosses tables de `centreon_storage` (`data_bin`, `logs`, `log_archive_host`, `log_archive_service`) sont **partitionnées par jour** : la purge consiste à supprimer des partitions entières (instantané) au lieu de `DELETE` massifs.

```bash
# Tâche quotidienne (cron centreon) : création des partitions futures et suppression des anciennes
/usr/bin/php /usr/share/centreon/cron/centreon-partitioning.php
# Vérifier l'état
mysql centreon_storage -e "SELECT TABLE_NAME, COUNT(*) AS partitions FROM information_schema.PARTITIONS WHERE TABLE_SCHEMA='centreon_storage' AND PARTITION_NAME IS NOT NULL GROUP BY TABLE_NAME;"
```

> [!WARNING]
> Si la tâche de partitionnement échoue plusieurs jours (disque plein, base arrêtée), les insertions finissent par échouer faute de partition pour la date du jour (erreurs dans les journaux de Broker). Surveillez l'espace disque de `/var/lib/mysql` et les journaux `/var/log/centreon/centreon-partitioning.log`.

## Mises à jour

### Mineure (ex. 24.10.3 → 24.10.5)

```bash
sudo dnf clean all --enablerepo=* && sudo dnf update -y 'centreon*'     # Debian : apt update && apt upgrade
sudo systemctl daemon-reload
# Si l'interface demande une mise à jour : ouvrir https://<central>/centreon et suivre l'assistant de mise à jour
sudo systemctl restart cbd centengine gorgoned php-fpm
```

Puis mettre à jour **les collecteurs** (`dnf update 'centreon*'`), redémarrer `centengine` et `gorgoned`, et exporter la configuration.

### Majeure (ex. 24.10 → 25.04)

1. Lire les **notes de version** et la procédure de montée de version de la version cible (changements de PHP, de MariaDB, d'OS supportés, modules).
2. **Sauvegarde complète** + instantané de VM.
3. Mettre à jour les modules commerciaux si présents.
4. Remplacer le dépôt Centreon (`centreon-25.04.repo` / ligne `apt-standard-25.04-stable`), mettre à jour PHP si exigé.
5. `dnf update 'centreon*' php-*` → assistant web de mise à jour → redémarrage des services.
6. Mettre à jour les serveurs distants puis les collecteurs, exporter les configurations.
7. Vérifier les collecteurs, les graphiques, les notifications, l'API.

> [!IMPORTANT]
> On ne saute pas plusieurs versions majeures en une fois sans vérifier la matrice de compatibilité : la documentation indique les versions de départ supportées pour chaque montée de version.

## Migration vers un nouveau serveur (nouvel OS)

Cas typique : passage d'Alma 8 à Alma 9. Installer un central neuf **dans la même version**, puis suivre la procédure officielle de migration (copie des bases et des fichiers, script de migration fourni par Centreon), et enfin rediriger les collecteurs vers le nouveau central. Monter de version **après** la migration.

## Haute disponibilité

| Option | Description |
| --- | --- |
| **Centreon HA** (édition commerciale) | Cluster actif/passif Pacemaker + Corosync, réplication MariaDB, VIP, synchronisation des fichiers ; collecteurs en option |
| Sauvegarde + VM | Restauration rapide sur un hyperviseur en HA (RTO de quelques dizaines de minutes) |
| Collecteurs | En cas de perte du central, ils continuent les contrôles et conservent les données en **rétention** Broker (rejouées au retour du central) |

> [!NOTE]
> Les **notifications** sont émises par les collecteurs : elles continuent de fonctionner pendant une indisponibilité du central (si les collecteurs ont un relais SMTP).

## Journaux de référence

| Composant | Journal |
| --- | --- |
| Centreon Engine | `/var/log/centreon-engine/centengine.log` |
| Centreon Broker (central) | `/var/log/centreon-broker/central-broker-master.log`, `central-rrd-master.log` |
| Module Broker des collecteurs | `/var/log/centreon-broker/<collecteur>-module.log` (ou `module-poller.log`) |
| Gorgone | `/var/log/centreon-gorgone/gorgoned.log` |
| Interface web, SQL | `/var/log/centreon/*.log`, `/var/log/php-fpm/centreon-error.log` |
| Traps | `/var/log/centreon/centreontrapd.log` |
| Apache | `/var/log/httpd/` (Debian : `/var/log/apache2/`) |

## Tâches planifiées

`/etc/cron.d/centreon`, `/etc/cron.d/centstorage`, `/etc/cron.d/centreon-partitioning`, `/etc/cron.d/centreon-backup` : calcul de la disponibilité (`centreon-eventReportBuilder`, `dashboardBuilder`), purge, partitionnement, sauvegarde, statistiques. Vérifiez qu'elles s'exécutent (`/var/log/centreon/`).

## Liste de maintenance périodique

- [ ] Espace disque (`/var/lib/mysql`, `/var/lib/centreon`, `/var/log`) < 80 %
- [ ] Sauvegardes présentes et copiées hors serveur ; test de restauration semestriel
- [ ] Collecteurs à jour et connectés, latence normale
- [ ] Mises à jour mineures appliquées (sécurité)
- [ ] Services en état UNKNOWN / désactivés depuis longtemps nettoyés
- [ ] Acquittements anciens revus
- [ ] Revue des contacts (départs) et des ACL
