---
title: "Interface en ligne de commande"
description: "Nginx — Interface en ligne de commande. Les scripts njs peuvent être développés et débogués en ligne de commande. L'utilitaire est disponible après l'installation du paquet Linux ou la compilation à partir des sources. Contrairement à njs exécuté dans nginx,…"
tags: [nginx, guide]
icon: book-open
---

Les scripts njs peuvent être développés et débogués en ligne de commande. L'utilitaire est disponible après l'installation du [[10-guides/04-njs/install|paquet]] Linux ou la compilation à partir des [[10-guides/04-njs/install|sources]]. Contrairement à njs exécuté dans nginx, les objets nginx ([[10-guides/04-njs/reference|HTTP]] et [[10-guides/04-njs/reference|Stream]]) ne sont pas disponibles dans l'utilitaire.

```nginx
$ echo "2**3" | njs -q
8

$ njs
>> globalThis
global {
 njs: njs {
  version: '0.3.9'
 },
 global: [Circular],
 process: process {
  argv: [
   '/usr/bin/njs'
  ],
  env: {
   PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
   HOSTNAME: 'f777c149d4f8',
   TERM: 'xterm',
   NGINX_VERSION: '1.17.9',
   NJS_VERSION: '0.3.9',
   PKG_RELEASE: '1~buster',
   HOME: '/root'
  }
 },
 console: {
  log: [Function: native],
  dump: [Function: native],
  time: [Function: native],
  timeEnd: [Function: native]
 },
 print: [Function: native]
}
>>
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
