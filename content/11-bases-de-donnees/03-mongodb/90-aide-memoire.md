---
title: MongoDB — aide-mémoire des commandes
description: Commandes MongoDB avec exemples — connexion mongosh (URI, TLS, authSource), bases, collections et documents (find, projections, tris, insert, update, delete, agrégations), index et explain, utilisateurs et rôles, jeu de réplicas (rs.initiate, rs.status, rs.add, stepDown), sauvegarde et restauration (mongodump, mongorestore, mongoexport, mongoimport), supervision (db.serverStatus, currentOp, killOp, mongostat, mongotop), profilage.
tags: [aide-mémoire, mongodb, mongosh, mongodump, réplication, nosql]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|MongoDB]].

## Connexion

```bash
mongosh
mongosh "mongodb://admin@db1.exemple.fr:27017/?authSource=admin&tls=true"
mongosh "mongodb://app@db1.exemple.fr,db2.exemple.fr,db3.exemple.fr/appdb?replicaSet=rs0&tls=true"
mongosh --eval "db.adminCommand({ ping: 1 })" --quiet
```

## Données

```javascript
show dbs
use appdb
show collections
db.clients.insertOne({ nom: "Martin", ville: "Paris", ca: 12000 })
db.clients.insertMany([{ nom: "Petit", ville: "Lyon" }, { nom: "Durand", ville: "Paris" }])
db.clients.find({ ville: "Paris" }, { nom: 1, _id: 0 }).sort({ nom: 1 }).limit(10)
db.clients.find({ ca: { $gte: 10000 } }).count()
db.clients.updateOne({ nom: "Martin" }, { $set: { ville: "Lille" }, $inc: { visites: 1 } })
db.clients.updateMany({ ville: "Paris" }, { $set: { region: "IDF" } })
db.clients.deleteMany({ actif: false })
db.clients.aggregate([
  { $match: { region: "IDF" } },
  { $group: { _id: "$ville", total: { $sum: "$ca" }, n: { $count: {} } } },
  { $sort: { total: -1 } }
])
db.clients.countDocuments()
db.clients.stats().size
```

## Index

```javascript
db.clients.createIndex({ ville: 1, nom: 1 })
db.clients.createIndex({ email: 1 }, { unique: true })
db.sessions.createIndex({ creeLe: 1 }, { expireAfterSeconds: 86400 })      // TTL
db.clients.getIndexes()
db.clients.dropIndex("ville_1_nom_1")
db.clients.find({ ville: "Paris" }).explain("executionStats")
```

## Utilisateurs et rôles

```javascript
use admin
db.createUser({ user: "admin", pwd: passwordPrompt(), roles: ["root"] })
use appdb
db.createUser({ user: "app", pwd: passwordPrompt(), roles: [{ role: "readWrite", db: "appdb" }] })
db.createUser({ user: "lecture", pwd: passwordPrompt(), roles: [{ role: "read", db: "appdb" }] })
db.getUsers()
db.changeUserPassword("app", passwordPrompt())
db.dropUser("ancien")
```

## Jeu de réplicas

```javascript
rs.initiate({ _id: "rs0", members: [
  { _id: 0, host: "db1.exemple.fr:27017" },
  { _id: 1, host: "db2.exemple.fr:27017" },
  { _id: 2, host: "db3.exemple.fr:27017" } ] })
rs.status()
rs.conf()
rs.add("db4.exemple.fr:27017")
rs.remove("db4.exemple.fr:27017")
rs.stepDown(60)                               // le primaire cède sa place (maintenance)
rs.printSecondaryReplicationInfo()
db.getReplicationInfo()
```

## Sauvegarde et échanges

```bash
mongodump --uri "mongodb://sauvegarde@db1.exemple.fr/?authSource=admin" --gzip --archive=/srv/sauvegardes/mongo-$(date +%F).gz
mongodump --uri "..." --db appdb --collection clients --out /srv/sauvegardes/clients
mongorestore --uri "mongodb://admin@db1.exemple.fr/?authSource=admin" --gzip --archive=/srv/sauvegardes/mongo-2026-10-29.gz --drop
mongorestore --nsFrom "appdb.*" --nsTo "appdb_test.*" --gzip --archive=mongo.gz
mongoexport --uri "..." --db appdb --collection clients --type=csv --fields nom,ville --out clients.csv
mongoimport --uri "..." --db appdb --collection clients --type=csv --headerline --file clients.csv
```

## Supervision

```javascript
db.serverStatus().connections
db.currentOp({ secs_running: { $gt: 5 } })
db.killOp(12345)
db.setProfilingLevel(1, { slowms: 100 })
db.system.profile.find().sort({ ts: -1 }).limit(5)
db.adminCommand({ getLog: "global" })
```

```bash
mongostat --uri "mongodb://admin@db1.exemple.fr/?authSource=admin" 5
mongotop --uri "mongodb://admin@db1.exemple.fr/?authSource=admin" 10
sudo journalctl -u mongod -f
```
