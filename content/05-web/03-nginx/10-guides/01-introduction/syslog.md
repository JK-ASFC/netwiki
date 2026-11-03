---
title: "Journalisation vers syslog"
description: "Nginx — Journalisation vers syslog. Les directives error_log et access_log prennent en charge la journalisation vers syslog. Les paramètres suivants la configurent :"
tags: [nginx, guide]
icon: book-open
---

Les directives [[12-directives/error-log|error_log]] et [[12-directives/access-log-http-log|access_log]] prennent en charge la journalisation vers syslog. Les paramètres suivants la configurent :

- **`server=`*address***

  Définit l'adresse d'un serveur syslog. L'adresse peut être un nom de domaine ou une adresse IP, avec un port facultatif, ou un chemin de socket de domaine UNIX précédé du préfixe « `unix:` ». Sans port, le port UDP 514 est utilisé. Si un nom de domaine se résout en plusieurs adresses IP, la première est utilisée.

- **`facility=`*string***

  Définit la catégorie (facility) des messages syslog, telle que définie dans la [RFC 3164](https://datatracker.ietf.org/doc/html/rfc3164#section-4.1.1). Valeurs possibles : « `kern` », « `user` », « `mail` », « `daemon` », « `auth` », « `intern` », « `lpr` », « `news` », « `uucp` », « `clock` », « `authpriv` », « `ftp` », « `ntp` », « `audit` », « `alert` », « `cron` », « `local0` »..« `local7` ». Par défaut : « `local7` ».

- **`severity=`*string***

  Définit la gravité des messages syslog pour [[12-directives/access-log-http-log|access_log]], telle que définie dans la [RFC 3164](https://datatracker.ietf.org/doc/html/rfc3164#section-4.1.1). Les valeurs possibles sont celles du deuxième paramètre (niveau) de la directive [[12-directives/error-log|error_log]]. Par défaut : « `info` ».

  > [!NOTE]
  > La gravité des messages d'erreur est déterminée par nginx ; le paramètre est donc ignoré dans la directive `error_log`.

- **`tag=`*string***

  Définit l'étiquette des messages syslog. Par défaut : « `nginx` ».

- **`nohostname`**

  Désactive l'ajout du champ « hostname » dans l'en-tête du message syslog (1.9.7).

Exemple de configuration syslog :

```nginx
error_log syslog:server=192.168.1.1 debug;

access_log syslog:server=unix:/var/log/nginx.sock,nohostname;
access_log syslog:server=[2001:db8::1]:12345,facility=local7,tag=nginx,severity=info combined;
```

> [!NOTE]
> La journalisation vers syslog est disponible depuis la version 1.7.1. Dans notre [abonnement commercial](https://nginx.com/products/), elle est disponible depuis la version 1.5.3.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
