---
title: "ngx_http_charset_module"
description: "Module nginx ngx_http_charset_module — Le module ngx_http_charset_module ajoute le jeu de caractères indiqué au champ d'en-tête de réponse Content-Type. Il peut aussi convertir les données d'un jeu de caractères à un autre, avec certaines limites :"
tags: [nginx, module, ngx_http_charset_module]
icon: puzzle
---

Le module `ngx_http_charset_module` ajoute le jeu de caractères indiqué au champ d'en-tête de réponse `Content-Type`. Il peut aussi convertir les données d'un jeu de caractères à un autre, avec certaines limites :

- la conversion ne se fait que dans un sens, du serveur vers le client ;
- seuls les jeux de caractères à un octet peuvent être convertis
- ou les jeux de caractères à un octet vers ou depuis UTF-8.

## Exemple de configuration

```nginx
include        conf/koi-win;

charset        windows-1251;
source_charset koi8-r;
```

## Directives

- [[12-directives/charset|charset]]
- [[12-directives/charset-map|charset_map]]
- [[12-directives/charset-types|charset_types]]
- [[12-directives/override-charset|override_charset]]
- [[12-directives/source-charset|source_charset]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
