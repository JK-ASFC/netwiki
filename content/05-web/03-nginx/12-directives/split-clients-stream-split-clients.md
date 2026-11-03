---
title: "split_clients (ngx_stream_split_clients_module)"
description: "Directive nginx split_clients (ngx_stream_split_clients_module) — Crée une variable pour les tests A/B, par exemple : nginx split_clients \"${remote_addr}AAA\" $variant { 0.5% .one; 2.0% .two; \"\"; } La chaîne d'origine est hachée avec MurmurHash2. Dans l'exemple, les…"
tags: [nginx, directive, ngx_stream_split_clients_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `split_clients string $variable { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_split_clients_module\|ngx_stream_split_clients_module]] |

## Utilisation

Crée une variable pour les tests A/B, par exemple :

```nginx
split_clients "${remote_addr}AAA" $variant {
               0.5%               .one;
               2.0%               .two;
               *                  "";
}
```

La chaîne d'origine est hachée avec MurmurHash2. Dans l'exemple, les valeurs de hachage de 0 à 21474835 (0,5 %) donnent la valeur `".one"` à la variable `$variant`, celles de 21474836 à 107374180 (2 %) la valeur `".two"`, et celles de 107374181 à 4294967295 la valeur `""` (chaîne vide).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
