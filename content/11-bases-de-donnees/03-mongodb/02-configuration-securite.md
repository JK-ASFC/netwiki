---
title: Configuration et sécurité
description: Fichier mongod.conf (stockage, journaux, réseau, cache WiredTiger), activation de l'authentification et création des comptes administrateur et applicatifs, rôles intégrés et personnalisés, TLS, authentification par certificats x.509, LDAP/Kerberos (éditions Enterprise ou Percona), chiffrement, audit et liste de contrôle de durcissement.
tags: [mongodb, mongod.conf, authentification, rôles, tls, x509, sécurité, durcissement]
icon: shield-check
---

## mongod.conf

```yaml /etc/mongod.conf
storage:
  dbPath: /var/lib/mongodb
  wiredTiger:
    engineConfig:
      cacheSizeGB: 8            # par défaut : 50 % de (RAM - 1 Go)

systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true
  logRotate: reopen

net:
  port: 27017
  bindIp: 127.0.0.1,10.0.30.41
  tls:
    mode: requireTLS
    certificateKeyFile: /etc/mongodb/tls/mongo1.pem     # certificat + clé dans un même fichier
    CAFile: /etc/mongodb/tls/ca.crt

security:
  authorization: enabled

processManagement:
  timeZoneInfo: /usr/share/zoneinfo
```

```bash
sudo systemctl restart mongod
sudo journalctl -u mongod -n 50
```

> [!WARNING]
> Des dizaines de milliers de bases MongoDB exposées sur Internet **sans authentification** ont été vidées et rançonnées. Ne lancez jamais `bindIp: 0.0.0.0` sans `authorization: enabled`, TLS et pare-feu.

## Créer les comptes

Tant qu'aucun utilisateur n'existe, l'**exception localhost** permet de créer le premier administrateur depuis le serveur lui-même :

```javascript
// mongosh sur le serveur
use admin
db.createUser({
  user: "admin",
  pwd: passwordPrompt(),
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, { role: "readWriteAnyDatabase", db: "admin" }, { role: "clusterAdmin", db: "admin" } ]
})
```

```bash
mongosh "mongodb://mongo1.corp.exemple.fr:27017/?tls=true" -u admin --authenticationDatabase admin
```

```javascript
// Compte applicatif limité à une base
use inventaire
db.createUser({ user: "app_inventaire", pwd: passwordPrompt(), roles: [ { role: "readWrite", db: "inventaire" } ] })

// Compte de supervision et de sauvegarde
use admin
db.createUser({ user: "supervision", pwd: passwordPrompt(), roles: [ "clusterMonitor" ] })
db.createUser({ user: "sauvegarde", pwd: passwordPrompt(), roles: [ "backup", "restore" ] })

db.getUsers()
db.changeUserPassword("app_inventaire", passwordPrompt())
```

## Rôles intégrés

| Rôle | Droits |
| --- | --- |
| `read` / `readWrite` | Lecture / lecture-écriture sur une base |
| `dbAdmin` | Index, statistiques, schéma (pas les données) |
| `userAdmin` | Gestion des comptes d'une base |
| `clusterMonitor` | Supervision (lecture des statistiques) |
| `clusterAdmin` | Administration du replica set / cluster |
| `backup` / `restore` | Sauvegarde et restauration |
| `root` | Tout : à réserver aux urgences |

```javascript
// Rôle personnalisé : lecture d'une collection seulement
use inventaire
db.createRole({
  role: "lectureServeurs",
  privileges: [ { resource: { db: "inventaire", collection: "serveurs" }, actions: [ "find" ] } ],
  roles: []
})
```

## Méthodes d'authentification

| Méthode | Édition |
| --- | --- |
| **SCRAM-SHA-256** | Toutes (défaut) |
| Certificats **x.509** (clients et membres du cluster) | Toutes |
| LDAP (proxy d'authentification et autorisation par groupes) | Enterprise, Percona Server for MongoDB |
| Kerberos (GSSAPI, Active Directory) | Enterprise, Percona Server for MongoDB |

```javascript
// Utilisateur x.509 : le nom est le sujet du certificat client
db.getSiblingDB("$external").runCommand({
  createUser: "CN=app-inventaire,OU=Applications,O=Exemple,C=FR",
  roles: [ { role: "readWrite", db: "inventaire" } ]
})
```

## Chiffrement et audit

| Besoin | Mise en œuvre |
| --- | --- |
| Transport | TLS (`requireTLS`), y compris entre membres du replica set |
| Au repos | Chiffrement du volume (LUKS) ; chiffrement natif WiredTiger : Enterprise / Percona |
| Champs sensibles | *Client-Side Field Level Encryption* / *Queryable Encryption* (chiffrement côté pilote) |
| Audit | Enterprise / Percona (`auditLog`) ; sinon profilage et journaux |

## Durcissement

- [ ] `authorization: enabled` et comptes nominatifs à privilèges minimaux
- [ ] `bindIp` restreint, pare-feu sur 27017 (et ports des `mongos`/config servers)
- [ ] TLS client et entre membres ; `keyFile` ou x.509 pour l'authentification interne du replica set
- [ ] Pas d'exécution JavaScript côté serveur si inutile (`security.javascriptEnabled: false`)
- [ ] Service sous un compte dédié (`mongodb`), droits stricts sur `dbPath` et les clés
- [ ] Sauvegardes chiffrées et testées ; mises à jour mineures régulières
