---
title: "large_client_header_buffers"
description: "Directive nginx large_client_header_buffers (ngx_http_core_module) — Définit le nombre (number) et la taille (size) maximaux des tampons de lecture des en-têtes de requête volumineux. Une ligne de requête ne peut pas dépasser la taille d'un tampon, sinon l'erreur 414…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `large_client_header_buffers number size;` |
| **Valeur par défaut** | `large_client_header_buffers 4 8k;` |
| **Contexte** | `http`, `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit le nombre (*number*) et la taille (*size*) maximaux des tampons de lecture des en-têtes de requête volumineux. Une ligne de requête ne peut pas dépasser la taille d'un tampon, sinon l'erreur `414 Request-URI Too Large` est renvoyée au client. Un champ d'en-tête ne peut pas non plus dépasser la taille d'un tampon, sinon l'erreur `400 Bad Request` est renvoyée. Les tampons ne sont alloués qu'à la demande. Par défaut, un tampon fait 8K octets. Si la connexion passe à l'état persistant après le traitement de la requête, ces tampons sont libérés.

Les limites s'appliquent de la même façon aux connexions HTTP/2 et HTTP/3. La taille d'un tampon limite la taille maximale d'un champ d'en-tête compressé avec, respectivement, [HPACK](https://datatracker.ietf.org/doc/html/rfc7541) et [QPACK](https://datatracker.ietf.org/doc/html/rfc9204). Si le codage de Huffman est appliqué, la taille réelle des noms et valeurs décompressés peut être supérieure. La taille maximale de l'en-tête de requête complet est limitée après décompression.

Si la directive est indiquée au niveau [[12-directives/server-http-core|server]], la valeur du serveur par défaut peut être utilisée. Les détails figurent dans la section « [[10-guides/02-http/server-names|Choix du serveur virtuel]] ».

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
