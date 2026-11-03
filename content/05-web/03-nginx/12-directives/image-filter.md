---
title: "image_filter"
description: "Directive nginx image_filter (ngx_http_image_filter_module) — Définit le type de transformation à appliquer aux images : - off désactive le traitement par le module dans le bloc location englobant. - test vérifie que les réponses sont des images au format JPEG,…"
tags: [nginx, directive, ngx_http_image_filter_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `image_filter off;` ou `image_filter test;` ou `image_filter size;` ou `image_filter rotate 90 \| 180 \| 270;` ou `image_filter resize width height;` ou `image_filter crop width height;` |
| **Valeur par défaut** | `image_filter off;` |
| **Contexte** | `location` |
| **Module** | [[11-modules/02-http/ngx_http_image_filter_module\|ngx_http_image_filter_module]] |

## Utilisation

Définit le type de transformation à appliquer aux images :

- **`off`**

  désactive le traitement par le module dans le bloc location englobant.

- **`test`**

  vérifie que les réponses sont des images au format JPEG, GIF, PNG ou WebP ; sinon, l'erreur `415 Unsupported Media Type` est renvoyée.

- **`size`**

  renvoie des informations sur les images au format JSON, par exemple :

  ```nginx
  { "img" : { "width": 100, "height": 100, "type": "gif" } }
  ```

  En cas d'erreur, la sortie est la suivante :

  ```nginx
  {}
  ```

- **`rotate` `90`|`180`|`270`**

  fait pivoter les images dans le sens inverse des aiguilles d'une montre du nombre de degrés indiqué. La valeur du paramètre peut contenir des variables. Ce mode peut s'utiliser seul ou avec les transformations `resize` et `crop`.

- **`resize` *width* *height***

  réduit proportionnellement une image aux dimensions indiquées. Pour ne réduire qu'une dimension, l'autre peut être indiquée par « `-` ». En cas d'erreur, le serveur renvoie le code `415 Unsupported Media Type`. Les valeurs des paramètres peuvent contenir des variables. Avec le paramètre `rotate`, la rotation a lieu *après* la réduction.

- **`crop` *width* *height***

  réduit proportionnellement une image à la dimension du plus grand côté et rogne les bords superflus de l'autre côté. Pour ne réduire qu'une dimension, l'autre peut être indiquée par « `-` ». En cas d'erreur, le serveur renvoie le code `415 Unsupported Media Type`. Les valeurs des paramètres peuvent contenir des variables. Avec le paramètre `rotate`, la rotation a lieu *avant* la réduction.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
