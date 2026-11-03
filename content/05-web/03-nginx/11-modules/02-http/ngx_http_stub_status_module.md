---
title: "ngx_http_stub_status_module"
description: "Module nginx ngx_http_stub_status_module — Le module ngx_http_stub_status_module donne accès aux informations d'état de base."
tags: [nginx, module, ngx_http_stub_status_module]
icon: puzzle
---

Le module `ngx_http_stub_status_module` donne accès aux informations d'état de base.

Ce module n'est pas compilé par défaut ; il doit être activé avec le paramètre de configuration `--with-http_stub_status_module`.

## Exemple de configuration

```nginx
location = /basic_status {
    stub_status;
}
```

Cette configuration crée une page web simple avec les données d'état de base, qui peut ressembler à ceci :

```nginx
Active connections: 291
server accepts handled requests
 16630948 16630948 31070465
Reading: 6 Writing: 179 Waiting: 106
```

## Données

Les informations d'état suivantes sont fournies :

- **`Active connections`**

  Nombre actuel de connexions clientes actives, connexions `Waiting` comprises.

- **`accepts`**

  Nombre total de connexions clientes acceptées.

- **`handled`**

  Nombre total de connexions traitées. En général, il est égal à `accepts`, sauf si certaines limites de ressources ont été atteintes (par exemple la limite [[12-directives/worker-connections|worker_connections]]).

- **`requests`**

  Nombre total de requêtes des clients.

- **`Reading`**

  Nombre actuel de connexions dont nginx lit l'en-tête de requête.

- **`Writing`**

  Nombre actuel de connexions sur lesquelles nginx écrit la réponse au client.

- **`Waiting`**

  Nombre actuel de connexions clientes inactives en attente d'une requête.

## Directives

- [[12-directives/stub-status|stub_status]]

## Variables intégrées

- [[13-variables/connections-active|$connections_active]]
- [[13-variables/connections-reading|$connections_reading]]
- [[13-variables/connections-writing|$connections_writing]]
- [[13-variables/connections-waiting|$connections_waiting]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
