---
title: "SSLSessionCache"
description: "Directive Apache SSLSessionCache (mod_ssl) — Type du cache de session SSL global et inter-processus. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Type du cache de session SSL global et inter-processus |
| **Syntaxe** | `SSLSessionCache type` |
| **Valeur par défaut** | `SSLSessionCache none` |
| **Contexte** | configuration du serveur |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet de configurer le type de stockage du cache de session SSL global et inter-processus. Ce cache est une fonctionnalité optionnelle qui accélère le traitement parallèle des requêtes. Pour ce qui est des requêtes vers un même processus du serveur (via HTTP keep-alive), OpenSSL met en cache les informations de session SSL en interne. Mais comme les clients modernes demandent des images en ligne et d'autres données via des requêtes parallèles (un nombre de quatre requêtes parallèles est courant), ces requêtes vont être servies par *plusieurs* processus du serveur pré-déclenchés. Ici, un cache inter-processus permet d'éviter des négociations de session inutiles.

Les quatre *type*s de stockage suivants sont actuellement supportés :

- `none`

  Cette valeur désactive le cache de session global et inter-processus, ce qui va ralentir le serveur de manière sensible et peut poser problème avec certains navigateurs, en particulier si les certificats clients sont activés. Cette configuration n'est pas recommandée.
- `nonenotnull`

  Cette valeur désactive tout cache de session global et inter-processus. Cependant, elle force OpenSSL à envoyer un identifiant de session non nul afin de s'adapter aux clients bogués qui en nécessitent un.
- `dbm:/chemin/vers/fichier-données`

  Cette valeur utilise un fichier de hashage DBM sur disque local pour synchroniser les caches OpenSSL locaux en mémoire des processus du serveur. Ce cache de session peut être sujet à des problèmes de fiabilité sous forte charge. Pour l'utiliser, le module [[12-modules/mod_socache_dbm|mod_socache_dbm]] doit être chargé.
- `shmcb:/chemin/vers/fichier-données`\[`(`*nombre*`)`\]

  Cette valeur utilise un tampon cyclique à hautes performances (d'une taille d'environ *nombre* octets) dans un segment de mémoire partagée en RAM (établi via `/chemin/vers/fichier-données`, pour synchroniser les caches OpenSSL locaux en mémoire des processus du serveur. C'est le type de cache de session recommandé. Pour l'utiliser, le module [[12-modules/mod_socache_shmcb|mod_socache_shmcb]] doit être chargé.
- `dc:UNIX:/chemin/vers/socket`

  Cette valeur utilise les bibliothèques de mise en cache de sessions distribuée sur [distcache](http://distcache.sourceforge.net/). L'argument doit spécifier le serveur ou mandataire à utiliser en utilisant la syntaxe d'adressage distcache ; par exemple, `UNIX:/chemin/vers/socket` spécifie une socket de domaine Unix (en général un mandataire de dc\_client local) ; `IP:serveur.example.com:9001` spécifie une adresse IP. Pour l'utiliser, le module [[12-modules/mod_socache_dc|mod_socache_dc]] doit être chargé.

**Exemples**

```apache
SSLSessionCache "dbm:/usr/local/apache/logs/ssl_gcache_data"
SSLSessionCache "shmcb:/usr/local/apache/logs/ssl_gcache_data(512000)"
```

Le mutex `ssl-cache` permet de sérialiser l'accès au cache de session afin d'éviter toute corruption. Ce mutex peut être configuré via la directive [[13-directives/mutex|Mutex]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
