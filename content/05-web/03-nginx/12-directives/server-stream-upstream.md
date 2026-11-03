---
title: "server (ngx_stream_upstream_module)"
description: "Directive nginx server (ngx_stream_upstream_module) — Defines the address and other parameters of a server. The address can be specified as a domain name or IP address with an obligatory port, or as a UNIX-domain socket path specified after the “unix:”…"
tags: [nginx, directive, ngx_stream_upstream_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `server address [parameters];` |
| **Valeur par défaut** | — |
| **Contexte** | `upstream` |
| **Module** | [[11-modules/03-stream/ngx_stream_upstream_module\|ngx_stream_upstream_module]] |

## Utilisation

Defines the *address* and other *parameters* of a server. The address can be specified as a domain name or IP address with an obligatory port, or as a UNIX-domain socket path specified after the “`unix:`” prefix. A domain name that resolves to several IP addresses defines multiple servers at once.

Les paramètres suivants peuvent être définis :

- **`weight`=*number***

  définit le poids du serveur ; 1 par défaut.

- **`max_conns`=*number***

  limits the maximum *number* of simultaneous connections to the proxied server (1.11.5). Default value is zero, meaning there is no limit. If the server group does not reside in the [[12-directives/zone-stream-upstream|shared memory]], the limitation works per each worker process.

  > [!NOTE]
  > Prior to version 1.11.5, this parameter was available as part of our [abonnement commercial](https://nginx.com/products/).

- **`max_fails`=*number***

  sets the number of unsuccessful attempts to communicate with the server that should happen in the duration set by the `fail_timeout` parameter to consider the server unavailable for a duration also set by the `fail_timeout` parameter. By default, the number of unsuccessful attempts is set to 1. The zero value disables the accounting of attempts. Here, an unsuccessful attempt is an error or timeout while establishing a connection with the server.

- **`fail_timeout`=*time***

  définit

  - la durée pendant laquelle le nombre indiqué de tentatives échouées doit survenir pour que le serveur soit considéré comme indisponible ;
  - et la durée pendant laquelle le serveur est considéré comme indisponible.

  Par défaut, ce paramètre vaut 10 secondes.

- **`backup`**

  marks the server as a backup server. Connections to the backup server will be passed when the primary servers are unavailable.

  > [!NOTE]
  > The parameter cannot be used along with the [[12-directives/hash-stream-upstream|hash]] and [[12-directives/random-stream-upstream|random]] load balancing methods.

- **`down`**

  désigne le serveur comme indisponible en permanence.

- **`resolve`**

  monitors changes of the IP addresses that correspond to a domain name of the server, and automatically modifies the upstream configuration without the need of restarting nginx. The server group must reside in the [[12-directives/zone-stream-upstream|shared memory]].

  In order for this parameter to work, the `resolver` directive must be specified in the [[12-directives/resolver-stream-core|stream]] block or in the corresponding [[12-directives/resolver-stream-upstream|upstream]] block.

  > [!NOTE]
  > Avant la version 1.27.3, ce paramètre n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

- **`service`=*name***

  active la résolution des enregistrements DNS [SRV](https://datatracker.ietf.org/doc/html/rfc2782) et définit le nom (*name*) du service (1.9.13). Pour que ce paramètre fonctionne, il faut indiquer le paramètre `resolve` pour le serveur et un nom d'hôte sans numéro de port.

  Si le nom du service ne contient pas de point (« `.` »), le nom conforme à la [RFC](https://datatracker.ietf.org/doc/html/rfc2782) est construit et le protocole TCP est ajouté au préfixe du service. Par exemple, pour rechercher l'enregistrement SRV `_http._tcp.backend.example.com`, il faut indiquer la directive :

  ```nginx
  server backend.example.com service=http resolve;
  ```

  Si le nom du service contient un ou plusieurs points, le nom est construit en joignant le préfixe du service et le nom du serveur. Par exemple, pour rechercher les enregistrements SRV `_http._tcp.backend.example.com` et `server1.backend.example.com`, il faut indiquer les directives :

  ```nginx
  server backend.example.com service=_http._tcp resolve;
  server example.com service=server1.backend resolve;
  ```

  Les enregistrements SRV de plus haute priorité (ceux qui partagent la plus petite valeur de priorité) deviennent les serveurs principaux, les autres des serveurs de secours. Si le paramètre `backup` est indiqué pour le serveur, les enregistrements de haute priorité deviennent des serveurs de secours et les autres sont ignorés.

  > [!NOTE]
  > Avant la version 1.27.3, ce paramètre n'était disponible que dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

En outre, les paramètres suivants sont disponibles dans le cadre de notre [abonnement commercial](https://nginx.com/products/) :

- **`slow_start`=*time***

  sets the *time* during which the server will recover its weight from zero to a nominal value, when unhealthy server becomes [[12-directives/health-check-stream-upstream-hc|healthy]], or when the server becomes available after a period of time it was considered unavailable. Default value is zero, i.e. slow start is disabled.

  > [!NOTE]
  > The parameter cannot be used along with the [[12-directives/hash-stream-upstream|hash]] and [[12-directives/random-stream-upstream|random]] load balancing methods.

> [!NOTE]
> S'il n'y a qu'un seul serveur dans un groupe, les paramètres `max_fails`, `fail_timeout` et `slow_start` sont ignorés et ce serveur n'est jamais considéré comme indisponible.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
