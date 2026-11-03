---
title: "proxy_password"
description: "Directive nginx proxy_password (ngx_mgmt_module) — Définit le mot de passe pour l'authentification auprès du mandataire. Par défaut, le mot de passe est envoyé en clair. Si le mandataire prend en charge TLS, la connexion vers lui peut être protégée…"
tags: [nginx, directive, ngx_mgmt_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `proxy_password string;` |
| **Valeur par défaut** | — |
| **Contexte** | `mgmt` |
| **Apparue dans la version** | 1.27.4 |
| **Module** | [[11-modules/05-autres/ngx_mgmt_module\|ngx_mgmt_module]] |

## Utilisation

Définit le mot de passe pour l'authentification auprès du [[12-directives/proxy|mandataire]].

Par défaut, le mot de passe est envoyé en clair. Si le mandataire prend en charge TLS, la connexion vers lui peut être protégée avec le module [[11-modules/03-stream/ngx_stream_proxy_module|stream]] :

```nginx
mgmt {
    proxy          127.0.0.1:8080;
    proxy_username <name>;
    proxy_password <password>;
}

stream {
    server {
        listen 127.0.0.1:8080;

        proxy_ssl                     on;
        proxy_ssl_verify              on;
        proxy_ssl_trusted_certificate <proxy_ca_file>;

        proxy_pass <proxy_host>:<proxy_port>;
    }
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
