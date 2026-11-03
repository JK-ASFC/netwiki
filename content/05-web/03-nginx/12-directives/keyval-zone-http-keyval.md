---
title: "keyval_zone (ngx_http_keyval_module)"
description: "Directive nginx keyval_zone (ngx_http_keyval_module) — Définit le nom (name) et la taille (size) de la zone de mémoire partagée qui contient la base clé-valeur. Les paires clé-valeur sont gérées par l'API. Le paramètre facultatif state indique un fichier…"
tags: [nginx, directive, ngx_http_keyval_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keyval_zone zone=name:size [state=file] [timeout=time] [type=string\|ip\|prefix] [sync];` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_keyval_module\|ngx_http_keyval_module]] |

## Utilisation

Définit le nom (*name*) et la taille (*size*) de la zone de mémoire partagée qui contient la base clé-valeur. Les paires clé-valeur sont gérées par l'[[11-modules/02-http/ngx_http_api_module|API]].

Le paramètre facultatif `state` indique un fichier (*file*) qui conserve l'état actuel de la base clé-valeur au format JSON et la rend persistante entre les redémarrages de nginx. Il faut éviter de modifier directement le contenu de ce fichier.

Exemples :

```nginx
keyval_zone zone=one:32k state=/var/lib/nginx/state/one.keyval; # path for Linux
keyval_zone zone=one:32k state=/var/db/nginx/state/one.keyval;  # path for FreeBSD
```

Le paramètre facultatif `timeout` (1.15.0) définit la durée au bout de laquelle les paires clé-valeur sont supprimées de la zone.

Le paramètre facultatif `type` (1.17.1) active un index supplémentaire optimisé pour un certain type de clé et définit les règles de correspondance lors de l'évaluation d'une variable [[12-directives/keyval-http-keyval|keyval]] `$variable`.

> [!NOTE]
> L'index est stocké dans la même zone de mémoire partagée et occupe donc de la place supplémentaire.

- **`type=string`**

  par défaut, aucun index : la recherche se fait par correspondance exacte entre la clé de l'enregistrement et la clé recherchée

- **`type=ip`**

  la clé recherchée est la représentation textuelle d'une adresse IPv4 ou IPv6 ou d'une plage CIDR ; pour correspondre, elle doit appartenir au sous-réseau désigné par la clé de l'enregistrement ou correspondre exactement à une adresse IP

- **`type=prefix`**

  la recherche se fait par correspondance de préfixe entre la clé de l'enregistrement et la clé recherchée (1.17.5) ; pour correspondre, la clé de l'enregistrement doit être un préfixe de la clé recherchée

Le paramètre facultatif `sync` (1.15.0) active la [[12-directives/zone-sync|synchronisation]] de la zone de mémoire partagée. La synchronisation nécessite de définir le paramètre `timeout`.

> [!NOTE]
> Si la synchronisation est activée, la suppression des paires clé-valeur (qu'il s'agisse d'[[11-modules/02-http/ngx_http_api_module|une seule]] ou de [[11-modules/02-http/ngx_http_api_module|toutes]]) n'a lieu que sur le nœud ciblé du cluster. Les mêmes paires sur les autres nœuds sont supprimées à l'expiration de `timeout`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
