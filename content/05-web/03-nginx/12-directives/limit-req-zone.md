---
title: "limit_req_zone"
description: "Directive nginx limit_req_zone (ngx_http_limit_req_module) — Définit les paramètres d'une zone de mémoire partagée qui conserve l'état de différentes clés. L'état contient notamment le nombre actuel de requêtes excédentaires. La clé (key) peut contenir du…"
tags: [nginx, directive, ngx_http_limit_req_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `limit_req_zone key zone=name:size rate=rate [sync];` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_limit_req_module\|ngx_http_limit_req_module]] |

## Utilisation

Définit les paramètres d'une zone de mémoire partagée qui conserve l'état de différentes clés. L'état contient notamment le nombre actuel de requêtes excédentaires. La clé (*key*) peut contenir du texte, des variables ou une combinaison des deux. Les requêtes dont la clé est vide ne sont pas comptabilisées.

> [!NOTE]
> Avant la version 1.7.6, une clé (*key*) devait contenir exactement une variable.

Exemple d'utilisation :

```nginx
limit_req_zone $binary_remote_addr zone=one:10m rate=1r/s;
```

Ici, les états sont conservés dans une zone « one » de 10 mégaoctets, et le débit moyen de traitement des requêtes pour cette zone ne peut pas dépasser 1 requête par seconde.

L'adresse IP du client sert de clé. Notez qu'on utilise ici la variable `$binary_remote_addr` au lieu de `$remote_addr`. La taille de `$binary_remote_addr` est toujours de 4 octets pour une adresse IPv4 et de 16 octets pour une adresse IPv6. Un état occupe toujours 64 octets sur les plates-formes 32 bits et 128 octets sur les plates-formes 64 bits. Une zone d'un mégaoctet peut contenir environ 16 000 états de 64 octets ou environ 8 000 états de 128 octets.

Lorsque la zone est pleine, l'état le moins récemment utilisé est supprimé. Si même après cela un nouvel état ne peut pas être créé, la requête est terminée avec une [[12-directives/limit-req-status|erreur]].

Le débit s'exprime en requêtes par seconde (r/s). Pour un débit inférieur à une requête par seconde, on l'exprime en requêtes par minute (r/m). Par exemple, une demi-requête par seconde s'écrit 30r/m.

En outre, les fonctions suivantes sont disponibles dans le cadre de notre [abonnement commercial](https://nginx.com/products/) :

- Le paramètre `rate` peut contenir des variables (1.31.3). Le débit est alors évalué à l'exécution pour chaque requête. Exemple :

  ```nginx
  map $uri $rate {
      default       10r/s;
      /api/slow     1r/s;
      /api/fast     100r/s;
  }

  limit_req_zone $binary_remote_addr zone=one:10m rate=$rate;
  ```
- Le paramètre `sync` (1.15.3) active la [[12-directives/zone-sync|synchronisation]] de la zone de mémoire partagée.
- Les [[11-modules/02-http/ngx_http_api_module|informations d'état]] de chaque zone de mémoire partagée de ce type peuvent être [[11-modules/02-http/ngx_http_api_module|consultées]] ou [[11-modules/02-http/ngx_http_api_module|remises à zéro]] avec l'[[11-modules/02-http/ngx_http_api_module|API]] depuis la version 1.17.7.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
