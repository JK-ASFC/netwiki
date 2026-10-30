---
title: Configuration, sécurité, cluster et réplication
description: Configurer CouchDB (local.ini — écoute, administrateurs, authentification obligatoire, TLS ou reverse proxy), droits par base (_security, membres et administrateurs), comptes _users, mise en cluster (cookie, nom de nœud, ports Erlang, _cluster_setup), et réplication ponctuelle, continue et bidirectionnelle via _replicator avec gestion des conflits.
tags: [couchdb, local.ini, sécurité, _security, cluster, réplication, _replicator, tls]
icon: settings-2
---

## local.ini

```couchdb /opt/couchdb/etc/local.ini
[couchdb]
single_node = true                 ; false en cluster
max_document_size = 8000000

[chttpd]
bind_address = 127.0.0.1           ; 0.0.0.0 si accès direct (préférer un reverse proxy HTTPS)
port = 5984
require_valid_user = true          ; aucune requête anonyme

[chttpd_auth]
timeout = 3600
require_valid_user = true

[admins]
admin = MotDePasseLong             ; haché automatiquement au démarrage

[log]
writer = journald
level = info
```

```bash
sudo systemctl restart couchdb
```

Les paramètres peuvent aussi se modifier à chaud : `curl -u admin:… -X PUT http://127.0.0.1:5984/_node/_local/_config/log/level -d '"debug"'`.

## HTTPS

| Option | Mise en œuvre |
| --- | --- |
| **Reverse proxy** (recommandé) | Nginx/HAProxy en HTTPS devant `127.0.0.1:5984` — voir [[03-nginx/05-reverse-proxy-repartition\|Nginx reverse proxy]] |
| TLS natif | Section `[ssl]` : `enable = true`, `port = 6984`, `cert_file`, `key_file` |

## Droits par base

Par défaut (3.x), une nouvelle base n'est accessible qu'aux **administrateurs du serveur**. On délègue avec l'objet `_security` :

```bash
curl -u admin:… -X PUT http://127.0.0.1:5984/inventaire/_security -H 'Content-Type: application/json' -d '{
  "admins":  { "names": ["resp_inventaire"], "roles": ["inventaire_admin"] },
  "members": { "names": [], "roles": ["inventaire_lecteur", "inventaire_admin"] }
}'
```

| Catégorie | Droits |
| --- | --- |
| Administrateurs du serveur | Tout |
| `admins` de la base | Documents de conception (vues, validation), `_security` de la base |
| `members` de la base | Lecture et écriture des documents |

### Comptes utilisateurs

```bash
curl -u admin:… -X PUT http://127.0.0.1:5984/_users/org.couchdb.user:app_inventaire \
  -H 'Content-Type: application/json' \
  -d '{"name":"app_inventaire","password":"MotDePasse","roles":["inventaire_lecteur"],"type":"user"}'
```

Pour limiter l'écriture (lecture seule, champs obligatoires), ajoutez une fonction `validate_doc_update` dans un document de conception.

## Cluster

```mermaid
flowchart LR
  LB["Répartiteur HTTPS"] --> N1["couch1"] & N2["couch2"] & N3["couch3"]
  N1 <-- "Erlang 4369 + 9100-9200" --> N2
  N2 <--> N3
  N1 <--> N3
```

```text /opt/couchdb/etc/vm.args (chaque nœud)
-name couchdb@couch1.corp.exemple.fr
-setcookie CookieSecretIdentiqueSurTousLesNoeuds
-kernel inet_dist_listen_min 9100
-kernel inet_dist_listen_max 9200
```

```couchdb /opt/couchdb/etc/local.ini (chaque nœud)
[couchdb]
single_node = false
[chttpd]
bind_address = 0.0.0.0
[cluster]
q = 2
n = 3
```

```bash
# Depuis couch1 : ajouter les autres nœuds puis finaliser
curl -u admin:… -X POST http://couch1:5984/_cluster_setup -H 'Content-Type: application/json' \
  -d '{"action":"enable_cluster","bind_address":"0.0.0.0","username":"admin","password":"…","port":5984,"node_count":"3","remote_node":"couch2.corp.exemple.fr","remote_current_user":"admin","remote_current_password":"…"}'
curl -u admin:… -X POST http://couch1:5984/_cluster_setup -H 'Content-Type: application/json' \
  -d '{"action":"add_node","host":"couch2.corp.exemple.fr","port":5984,"username":"admin","password":"…"}'
# (répéter pour couch3)
curl -u admin:… -X POST http://couch1:5984/_cluster_setup -H 'Content-Type: application/json' -d '{"action":"finish_cluster"}'
curl -u admin:… http://couch1:5984/_membership
```

L'assistant de Fauxton (*Setup*) réalise les mêmes étapes. Tous les nœuds doivent avoir le **même administrateur** (même hachage) et le **même cookie**.

## Réplication

```bash
# Réplication continue entre deux serveurs, persistante (survit aux redémarrages)
curl -u admin:… -X POST http://127.0.0.1:5984/_replicator -H 'Content-Type: application/json' -d '{
  "_id": "inventaire-vers-lyon",
  "source": { "url": "http://127.0.0.1:5984/inventaire", "headers": { "Authorization": "Basic YWRtaW46Li4u" } },
  "target": { "url": "https://couch-lyon.corp.exemple.fr/inventaire", "headers": { "Authorization": "Basic cmVwbGljYXRldXI6Li4u" } },
  "continuous": true,
  "create_target": true
}'
```

| Option | Effet |
| --- | --- |
| `continuous: true` | Suit les modifications en permanence |
| Deux documents A→B et B→A | Réplication **bidirectionnelle** (multi-maîtres) |
| `selector` / `doc_ids` | Réplication filtrée (sous-ensemble de documents) |
| `create_target` | Crée la base cible si absente |

### Conflits

Quand un même document est modifié des deux côtés, CouchDB choisit une révision « gagnante » de façon déterministe et conserve les autres :

```bash
curl -u admin:… 'http://127.0.0.1:5984/inventaire/srv-web-01?conflicts=true'      # champ _conflicts
curl -u admin:… -X DELETE 'http://127.0.0.1:5984/inventaire/srv-web-01?rev=2-abc…'  # supprimer la révision perdante
```

L'application doit prévoir la **résolution des conflits** (fusion, règle métier).
