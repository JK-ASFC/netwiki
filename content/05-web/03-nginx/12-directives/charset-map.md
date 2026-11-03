---
title: "charset_map"
description: "Directive nginx charset_map (ngx_http_charset_module) — Décrit la table de conversion d'un jeu de caractères à un autre. La table inverse est construite à partir des mêmes données. Les codes des caractères sont en hexadécimal. Les caractères manquants…"
tags: [nginx, directive, ngx_http_charset_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `charset_map charset1 charset2 { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/02-http/ngx_http_charset_module\|ngx_http_charset_module]] |

## Utilisation

Décrit la table de conversion d'un jeu de caractères à un autre. La table inverse est construite à partir des mêmes données. Les codes des caractères sont en hexadécimal. Les caractères manquants dans la plage 80-FF sont remplacés par « `?` ». Lors d'une conversion depuis UTF-8, les caractères absents du jeu à un octet sont remplacés par « `&#XXXX;` ».

Exemple :

```nginx
charset_map koi8-r windows-1251 {
    C0 FE ; # small yu
    C1 E0 ; # small a
    C2 E1 ; # small b
    C3 F6 ; # small ts
    ...
}
```

Pour décrire une table de conversion vers UTF-8, les codes UTF-8 se placent dans la seconde colonne, par exemple :

```nginx
charset_map koi8-r utf-8 {
    C0 D18E ; # small yu
    C1 D0B0 ; # small a
    C2 D0B1 ; # small b
    C3 D186 ; # small ts
    ...
}
```

Les tables de conversion complètes de `koi8-r` vers `windows-1251`, et de `koi8-r` et `windows-1251` vers `utf-8`, sont fournies dans les fichiers de la distribution `conf/koi-win`, `conf/koi-utf` et `conf/win-utf`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
