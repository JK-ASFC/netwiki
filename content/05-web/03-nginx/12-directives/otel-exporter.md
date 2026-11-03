---
title: "otel_exporter"
description: "Directive nginx otel_exporter (ngx_otel_module) — Définit les paramètres d'export des données OTel : - endpoint (http|https)://host:port; point de terminaison OTLP/gRPC qui reçoit les données de télémétrie. TLS est pris en charge depuis la version…"
tags: [nginx, directive, ngx_otel_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `otel_exporter { ... }` |
| **Valeur par défaut** | — |
| **Contexte** | `http` |
| **Module** | [[11-modules/05-autres/ngx_otel_module\|ngx_otel_module]] |

## Utilisation

Définit les paramètres d'export des données OTel :

- **`endpoint [(http|https)://]host:port;`**

  point de terminaison OTLP/gRPC qui reçoit les données de télémétrie. TLS est pris en charge depuis la version 0.1.2.

- **`trusted_certificate path;`**

  fichier des certificats d'autorités au format PEM utilisé pour vérifier le point de terminaison TLS (depuis 0.1.2). Par défaut, l'ensemble de certificats du système d'exploitation.

- **`header name value;`**

  en-tête HTTP personnalisé à ajouter aux requêtes d'export de télémétrie (depuis 0.1.2).

- **`interval time;`**

  intervalle maximal entre deux exports ; `5` secondes par défaut.

- **`batch_size number;`**

  nombre maximal de spans envoyés dans un lot par processus de travail ; `512` par défaut.

- **`batch_count number;`**

  nombre de lots en attente par processus de travail ; les spans au-delà de la limite sont abandonnés ; `4` par défaut.

Exemple :

```nginx
otel_exporter {
    endpoint https://otel-example.nginx.com:4317;

    header X-API-Token "my-token-value";
}
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
