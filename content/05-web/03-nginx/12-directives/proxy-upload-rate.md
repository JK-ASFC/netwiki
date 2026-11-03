---
title: "proxy_upload_rate"
description: "Directive nginx proxy_upload_rate (ngx_stream_proxy_module) — Limite la vitesse de lecture des données du client. Le débit s'exprime en octets par seconde. La valeur zéro désactive la limitation. La limite s'applique par connexion : si le client ouvre…"
tags: [nginx, directive, ngx_stream_proxy_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_upload_rate rate;` |
| **Valeur par défaut** | `proxy_upload_rate 0;` |
| **Contexte** | `stream`, `server` |
| **Apparue dans la version** | 1.9.3 |
| **Module** | [[11-modules/03-stream/ngx_stream_proxy_module\|ngx_stream_proxy_module]] |

## Utilisation

Limite la vitesse de lecture des données du client. Le *débit* s'exprime en octets par seconde. La valeur zéro désactive la limitation. La limite s'applique par connexion : si le client ouvre simultanément deux connexions, le débit global sera le double de la limite indiquée.

La valeur du paramètre peut contenir des variables (1.17.0). C'est utile lorsque le débit doit être limité selon une condition :

```nginx
map $slow $rate {
    1     4k;
    2     8k;
}

proxy_upload_rate $rate;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
