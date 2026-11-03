---
title: "LogLevel"
description: "Directive Apache LogLevel (core) — Contrôle la verbosité du journal des erreurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle la verbosité du journal des erreurs |
| **Syntaxe** | `LogLevel [module:]niveau [module:niveau] ...` |
| **Valeur par défaut** | `LogLevel warn` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | La configuration du niveau de journalisation par module et par répertoire est disponible depuis la version 2.3.6 du serveur HTTP Apache |

## Utilisation

La directive `LogLevel` permet d'ajuster la verbosité des messages enregistrés dans les journaux d'erreur (voir la directive [[13-directives/errorlog|ErrorLog]] directive). Les *niveau*x disponibles sont présentés ci-après, par ordre de criticité décroissante :

| **Niveau** | **Description** | **Exemple** |
| --- | --- | --- |
| `emerg` | Urgences - le système est inutilisable. | "Child cannot open lock file. Exiting" |
| `alert` | Des mesures doivent être prises immédiatement. | "getpwuid: couldn't determine user name from uid" |
| `crit` | Conditions critiques. | "socket: Failed to get a socket, exiting child" |
| `error` | Erreurs. | "Premature end of script headers" |
| `warn` | Avertissements. | "child process 1234 did not exit, sending another SIGHUP" |
| `notice` | Evènement important mais normal. | "httpd: caught SIGBUS, attempting to dump core in ..." |
| `info` | Informations. | "Server seems busy, (you may need to increase StartServers, or Min/MaxSpareServers)..." |
| `debug` | Messages de débogage. | "Opening config file ..." |
| `trace1` | Messages de traces | "proxy: FTP: control connection complete" |
| `trace2` | Messages de traces | "proxy: CONNECT: sending the CONNECT request to the remote proxy" |
| `trace3` | Messages de traces | "openssl: Handshake: start" |
| `trace4` | Messages de traces | "read from buffered SSL brigade, mode 0, 17 bytes" |
| `trace5` | Messages de traces | "map lookup FAILED: map=rewritemap key=keyname" |
| `trace6` | Messages de traces | "cache lookup FAILED, forcing new map lookup" |
| `trace7` | Messages de traces, enregistrement d'une grande quantité de données | "\| 0000: 02 23 44 30 13 40 ac 34 df 3d bf 9a 19 49 39 15 \|" |
| `trace8` | Messages de traces, enregistrement d'une grande quantité de données | "\| 0000: 02 23 44 30 13 40 ac 34 df 3d bf 9a 19 49 39 15 \|" |

Lorsqu'un niveau particulier est spécifié, les messages de tous les autres niveaux de criticité supérieure seront aussi enregistrés. *Par exemple*, si `LogLevel info` est spécifié, les messages de niveaux `notice` et `warn` seront aussi émis.

Il est recommandé d'utiliser un niveau `crit` ou inférieur.

Par exemple :

```apache
LogLevel notice
```

> [!NOTE]
> **Note**
>
> Si la journalisation s'effectue directement dans un fichier, les messages de niveau `notice` ne peuvent pas être supprimés et sont donc toujours journalisés. Cependant, ceci ne s'applique pas lorsque la journalisation s'effectue vers `syslog`.

Spécifier un niveau sans nom de module va attribuer ce niveau à tous les modules. Spécifier un niveau avec nom de module va attribuer ce niveau à ce module seulement. Il est possible de spécifier un module par le nom de son fichier source ou par son identificateur, avec ou sans le suffixe `_module`. Les trois spécifications suivantes sont donc équivalentes :

```apache
LogLevel info ssl:warn
LogLevel info mod_ssl.c:warn
LogLevel info ssl_module:warn
```

Il est aussi possible d'attribuer un niveau de journalisation par répertoire :

```apache
LogLevel info
<Directory "/usr/local/apache/htdocs/app">
  LogLevel debug
</Directory>
```

> [!NOTE]
> La configuration du niveau de journalisation par répertoire n'affecte que les messages journalisés après l'interprétation de la requête et qui sont associés à cette dernière. Les messages de journalisation associés à la connexion ou au serveur ne sont pas affectés.

## Voir aussi

- [[13-directives/errorlog|ErrorLog]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
