---
title: TiDB
description: TiDB — base SQL distribuée compatible MySQL (PingCAP, Apache 2.0) : composants (TiDB sans état, PD, stockage TiKV, TiFlash en colonnes pour l'analytique), installation avec TiUP (playground de test, topologie YAML, tiup cluster deploy, start, display, scale-out, upgrade), port 4000, TiDB Dashboard, supervision Grafana et Prometheus intégrée, sauvegarde BR, migration depuis MySQL (DM, Dumpling, Lightning).
tags: [tidb, mysql, sql distribué, tikv, tiup, htap, newsql]
icon: info
---

**TiDB** se présente aux applications comme un serveur [[01-mariadb-mysql/01-presentation|MySQL]] (port **4000**, pilotes MySQL) mais répartit les données dans **TiKV** (clé-valeur distribué, Raft) et peut répliquer en colonnes dans **TiFlash** pour des requêtes analytiques sur les mêmes données (HTAP).

| Composant | Rôle | Minimum en production |
| --- | --- | --- |
| **TiDB** | Couche SQL sans état (répartiteur devant) | 2 |
| **PD** | Métadonnées, horodatage, placement | 3 |
| **TiKV** | Stockage transactionnel | 3 |
| TiFlash | Réplique en colonnes (optionnelle) | 2 |

## Installation avec TiUP

```bash
curl --proto '=https' --tlsv1.2 -sSf https://tiup-mirrors.pingcap.com/install.sh | sh && source ~/.bashrc
tiup playground                        # cluster de test local (Linux, macOS)
```

```yaml
# topologie.yaml
global: { user: tidb, deploy_dir: /opt/tidb-deploy, data_dir: /srv/tidb-data }
pd_servers: [{ host: 10.0.20.71 }, { host: 10.0.20.72 }, { host: 10.0.20.73 }]
tidb_servers: [{ host: 10.0.20.74 }, { host: 10.0.20.75 }]
tikv_servers: [{ host: 10.0.20.81 }, { host: 10.0.20.82 }, { host: 10.0.20.83 }]
monitoring_servers: [{ host: 10.0.20.90 }]
grafana_servers: [{ host: 10.0.20.90 }]
```

```bash
tiup cluster check topologie.yaml --user root -p --apply   # vérifier et corriger les prérequis système
tiup cluster deploy tidb-prod v8.5.0 topologie.yaml --user root -p
tiup cluster start tidb-prod --init                        # affiche le mot de passe root généré
tiup cluster display tidb-prod
mysql -h 10.0.20.74 -P 4000 -u root -p
```

Windows : clients uniquement (serveurs Linux). Kubernetes : **TiDB Operator**.

Exploitation : **TiDB Dashboard** (`http://<pd>:2379/dashboard` : requêtes lentes, diagnostics), Grafana déployé par TiUP, sauvegarde **BR** (`tiup br backup full --pd 10.0.20.71:2379 --storage "s3://…"`), migration depuis MySQL avec **DM** (réplication continue) ou Dumpling + Lightning.

Interface : [[04-interface-graphique|interfaces graphiques]] · commandes : [[90-aide-memoire|aide-mémoire]].
