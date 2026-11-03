---
title: "pass"
description: "Directive nginx pass (ngx_stream_pass_module) — Définit l'adresse du serveur auquel passer la connexion client. L'adresse peut être une adresse IP et un port : nginx pass 127.0.0.1:12345; ou le chemin d'un socket de domaine UNIX : nginx pass…"
tags: [nginx, directive, ngx_stream_pass_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `pass address;` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_pass_module\|ngx_stream_pass_module]] |

## Utilisation

Définit l'adresse du serveur auquel passer la connexion client. L'adresse peut être une adresse IP et un port :

```nginx
pass 127.0.0.1:12345;
```

ou le chemin d'un socket de domaine UNIX :

```nginx
pass unix:/tmp/stream.socket;
```

L'adresse peut aussi être indiquée avec des variables :

```nginx
pass $upstream;
```

> [!NOTE]
> Si le [[11-modules/03-stream/ngx_stream_core_module|protocole PROXY]] est utilisé, l'en-tête est lu avant le passage de la connexion ; le paramètre `proxy_protocol` doit donc être indiqué sur la socket d'écoute du serveur d'origine :
>
> ```nginx
> server {
>     listen 12345 proxy_protocol;
>
>     set_real_ip_from 192.168.1.0/24;
>
>     pass 127.0.0.1:8000;
> }
> ```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
