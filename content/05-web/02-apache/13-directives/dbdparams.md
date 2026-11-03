---
title: "DBDParams"
description: "Directive Apache DBDParams (mod_dbd) — Paramètres de la connexion à la base de données. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dbd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Paramètres de la connexion à la base de données |
| **Syntaxe** | `DBDParams param1=valeur1[,param2=valeur2]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dbd\|mod_dbd]] |

## Utilisation

Cette directive permet de spécifier des paramètres selon les besoins du pilote concerné. En général, les paramètres à passer concernent tout ce qui n'a pas de valeur par défaut comme le nom d'utilisateur, le mot de passe, le nom de la base de données, le nom d'hôte et le numéro de port de la connexion.

Les paramètres de la chaîne de connexion en fonction des différents pilotes comprennent :

**FreeTDS (pour MSSQL et SyBase)**

username, password, appname, dbname, host, charset, lang, server

**MySQL**

host, port, user, pass, dbname, sock, flags, fldsz, group, reconnect

**Oracle**

user, pass, dbname, server

**PostgreSQL**

La chaîne de connexion est passée directement à `PQconnectdb`

**SQLite2**

La chaîne de connexion est scindée avec comme séparateur le caractère ':', et `partie1:partie2` est utilisé dans `sqlite_open(partie1, atoi(partie2), NULL)`

**SQLite3**

La chaîne de connexion est passée directement à `sqlite3_open`

**ODBC**

datasource, user, password, connect, ctimeout, stimeout, access, txmode, bufsize

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
