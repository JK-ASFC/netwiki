---
title: "<IfDefine>"
description: "Directive Apache <IfDefine> (core) — Contient des directives qui ne s'appliqueront que si un test retourne \"vrai\" au démarrage du serveur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contient des directives qui ne s'appliqueront que si un test retourne "vrai" au démarrage du serveur |
| **Syntaxe** | `<IfDefine [!]paramètre> ... </IfDefine>` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | All |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La section `<IfDefine test>...</IfDefine>` permet de conférer un caractère conditionnel à un ensemble de directives. Les directives situées à l'intérieur d'une section `<IfDefine>` ne s'appliquent que si *test* est vrai. Si *test* est faux, tout ce qui se trouve entre les balises de début et de fin est ignoré.

*test* peut se présenter sous deux formes :

- *nom paramètre*
- `!`*nom paramètre*

Dans le premier cas, les directives situées entre les balises de début et de fin ne s'appliqueront que si le paramètre nommé *nom paramètre* est défini. Le second format inverse le test, et dans ce cas, les directives ne s'appliqueront que si *nom paramètre* n'est **pas** défini.

L'argument *nom paramètre* est une définition qui peut être effectuée par la ligne de commande [[10-commandes/httpd|httpd]] via le paramètre `-Dparamètre` au démarrage du serveur, ou via la directive [[13-directives/define|Define]].

Les sections `<IfDefine>` peuvent être imbriquées, ce qui permet d'implémenter un test multi-paramètres simple. Exemple :

```
httpd -DReverseProxy -DUseCache -DMemCache ...
```

```apache
<IfDefine ReverseProxy>
  LoadModule proxy_module   modules/mod_proxy.so
  LoadModule proxy_http_module   modules/mod_proxy_http.so
  <IfDefine UseCache>
    LoadModule cache_module   modules/mod_cache.so
    <IfDefine MemCache>
      LoadModule mem_cache_module   modules/mod_mem_cache.so
    </IfDefine>
    <IfDefine !MemCache>
      LoadModule cache_disk_module   modules/mod_cache_disk.so
    </IfDefine>
  </IfDefine>
</IfDefine>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
