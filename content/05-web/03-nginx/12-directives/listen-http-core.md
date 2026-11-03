---
title: "listen (ngx_http_core_module)"
description: "Directive nginx listen (ngx_http_core_module) — Définit l'adresse (address) et le port (port) IP, ou le chemin (path) d'un socket de domaine UNIX, sur lesquels le serveur accepte les requêtes. On peut indiquer l'adresse et le port, ou seulement…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `listen address[:port] [default_server] [ssl] [http2 \| quic] [proxy_protocol] [setfib=number] [fastopen=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on\|off] [reuseport] [multipath] [so_keepalive=on\|off\|[keepidle]:[keepintvl]:[keepcnt]];` ou `listen port [default_server] [ssl] [http2 \| quic] [proxy_protocol] [setfib=number] [fastopen=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on\|off] [reuseport] [multipath] [so_keepalive=on\|off\|[keepidle]:[keepintvl]:[keepcnt]];` ou `listen unix:path [default_server] [ssl] [http2 \| quic] [proxy_protocol] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [so_keepalive=on\|off\|[keepidle]:[keepintvl]:[keepcnt]];` |
| **Valeur par défaut** | `listen *:80 \| *:8000;` |
| **Contexte** | `server` |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Définit l'adresse (*address*) et le port (*port*) IP, ou le chemin (*path*) d'un socket de domaine UNIX, sur lesquels le serveur accepte les requêtes. On peut indiquer l'adresse et le port, ou seulement l'adresse, ou seulement le port. L'adresse peut aussi être un nom d'hôte, par exemple :

```nginx
listen 127.0.0.1:8000;
listen 127.0.0.1;
listen 8000;
listen *:8000;
listen localhost:8000;
```

Les adresses IPv6 (0.7.36) s'écrivent entre crochets :

```nginx
listen [::]:8000;
listen [::1];
```

Les sockets de domaine UNIX (0.8.21) s'indiquent avec le préfixe « `unix:` » :

```nginx
listen unix:/var/run/nginx.sock;
```

Si seule l'adresse est indiquée, le port 80 est utilisé.

Si la directive est absente, `*:80` est utilisé si nginx s'exécute avec les privilèges du superutilisateur, `*:8000` sinon.

Le paramètre `default_server`, s'il est présent, fait de ce serveur le serveur par défaut pour le couple *address*:*port* indiqué. Si aucune directive n'a le paramètre `default_server`, le premier serveur déclaré avec ce couple *address*:*port* est le serveur par défaut.

> [!NOTE]
> Dans les versions antérieures à 0.8.21, ce paramètre s'appelait simplement `default`.

Le paramètre `ssl` (0.7.14) indique que toutes les connexions acceptées sur ce port fonctionnent en mode SSL. Cela permet une [[10-guides/02-http/configuring-https-servers|configuration]] plus compacte pour un serveur qui traite à la fois HTTP et HTTPS.

Le paramètre `http2` (1.9.5) configure le port pour accepter les connexions [[11-modules/02-http/ngx_http_v2_module|HTTP/2]]. Normalement, il faut aussi indiquer le paramètre `ssl`, mais nginx peut également accepter des connexions HTTP/2 sans SSL.

> [!NOTE]
> Ce paramètre est obsolète ; utiliser plutôt la directive [[12-directives/http2|http2]].

Le paramètre `quic` (1.25.0) configure le port pour accepter les connexions [[11-modules/02-http/ngx_http_v3_module|QUIC]].

Le paramètre `proxy_protocol` (1.5.12) indique que toutes les connexions acceptées sur ce port utilisent le [protocole PROXY](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

> [!NOTE]
> La version 2 du protocole PROXY est prise en charge depuis la version 1.13.11.

La directive `listen` accepte plusieurs paramètres supplémentaires propres aux appels système des sockets. Ils peuvent figurer dans n'importe quelle directive `listen`, mais une seule fois pour un couple *address*:*port* donné.

> [!NOTE]
> Dans les versions antérieures à 0.8.21, ils ne pouvaient figurer que dans la directive `listen` portant le paramètre `default`.

- **`setfib`=*number***

  ce paramètre (0.8.44) définit la table de routage associée (FIB, option `SO_SETFIB`) du socket d'écoute. Ne fonctionne actuellement que sous FreeBSD.

- **`fastopen`=*number***

  active « [TCP Fast Open](http://en.wikipedia.org/wiki/TCP_Fast_Open) » pour le socket d'écoute (1.5.8) et [limite](https://datatracker.ietf.org/doc/html/rfc7413#section-5.1) la longueur maximale de la file des connexions dont la poignée de main en trois temps n'est pas terminée.

  > [!NOTE]
  > N'activez cette fonction que si le serveur sait gérer la réception du [même paquet SYN avec données](https://datatracker.ietf.org/doc/html/rfc7413#section-6.1) plusieurs fois.

- **`backlog`=*number***

  définit le paramètre `backlog` de l'appel `listen`, qui limite la longueur maximale de la file des connexions en attente. Par défaut, `backlog` vaut -1 sous FreeBSD, DragonFly BSD et macOS, et 511 sur les autres plates-formes.

- **`rcvbuf`=*size***

  définit la taille du tampon de réception (option `SO_RCVBUF`) du socket d'écoute.

- **`sndbuf`=*size***

  définit la taille du tampon d'envoi (option `SO_SNDBUF`) du socket d'écoute.

- **`accept_filter`=*filter***

  définit le nom du filtre d'acceptation (option `SO_ACCEPTFILTER`) du socket d'écoute, qui filtre les connexions entrantes avant de les transmettre à `accept`. Ne fonctionne que sous FreeBSD et NetBSD 5.0+. Valeurs possibles : [dataready](http://man.freebsd.org/accf_data) et [httpready](http://man.freebsd.org/accf_http).

- **`deferred`**

  demande l'utilisation d'un `accept` différé (option de socket `TCP_DEFER_ACCEPT`) sous Linux.

- **`bind`**

  demande un appel `bind` distinct pour le couple *address*:*port* donné. C'est utile car, s'il existe plusieurs directives `listen` avec le même port mais des adresses différentes, et que l'une d'elles écoute sur toutes les adresses pour ce port (`*:`*port*), nginx ne fait `bind` que sur `*:`*port*. Dans ce cas, l'appel système `getsockname` est utilisé pour déterminer l'adresse qui a accepté la connexion. Si les paramètres `setfib`, `fastopen`, `backlog`, `rcvbuf`, `sndbuf`, `accept_filter`, `deferred`, `ipv6only`, `reuseport`, `multipath` ou `so_keepalive` sont utilisés, un appel `bind` distinct est toujours fait pour le couple *address*:*port* concerné.

- **`ipv6only`=`on`|`off`**

  ce paramètre (0.7.42) détermine (option de socket `IPV6_V6ONLY`) si un socket IPv6 écoutant sur l'adresse générique `[::]` accepte uniquement les connexions IPv6 ou à la fois IPv6 et IPv4. Il est activé par défaut et ne peut être défini qu'une fois, au démarrage.

  > [!NOTE]
  > Avant la version 1.3.4, si ce paramètre était omis, les réglages du système d'exploitation s'appliquaient au socket.

- **`reuseport`**

  ce paramètre (1.9.1) crée un socket d'écoute distinct pour chaque processus de travail (option de socket `SO_REUSEPORT` sous Linux 3.9+ et DragonFly BSD, ou `SO_REUSEPORT_LB` sous FreeBSD 12+), ce qui permet au noyau de répartir les connexions entrantes entre les processus de travail. Ne fonctionne actuellement que sous Linux 3.9+, DragonFly BSD et FreeBSD 12+ (1.15.1).

  > [!NOTE]
  > Une mauvaise utilisation de cette option peut avoir des [conséquences](http://man7.org/linux/man-pages/man7/socket.7.html) sur la sécurité.

- **`multipath`**

  ce paramètre (1.29.7) configure le protocole [Multipath TCP](https://datatracker.ietf.org/doc/html/rfc8684) (`IPPROTO_MPTCP`) pour le socket d'écoute. Ne fonctionne actuellement que sous Linux 5.6+.

  > [!NOTE]
  > Ajouter ou retirer ce paramètre active aussi l'option de socket `SO_REUSEPORT`, ce qui peut avoir des [conséquences](http://man7.org/linux/man-pages/man7/socket.7.html) sur la sécurité.

- **`so_keepalive`=`on`|`off`|\[*keepidle*\]:\[*keepintvl*\]:\[*keepcnt*\]**

  ce paramètre (1.1.11) configure le comportement « TCP keepalive » du socket d'écoute. S'il est omis, les réglages du système d'exploitation s'appliquent. Avec la valeur « `on` », l'option `SO_KEEPALIVE` est activée pour le socket ; avec « `off` », elle est désactivée. Certains systèmes permettent de régler les paramètres TCP keepalive par socket avec les options `TCP_KEEPIDLE`, `TCP_KEEPINTVL` et `TCP_KEEPCNT`. Sur ces systèmes (actuellement Linux, NetBSD, Dragonfly, FreeBSD et macOS), ils se règlent avec les paramètres *keepidle*, *keepintvl* et *keepcnt*. Un ou deux paramètres peuvent être omis ; le réglage système par défaut de l'option correspondante s'applique alors. Par exemple,

  ```nginx
  so_keepalive=30m::10
  ```

  fixe le délai d'inactivité (`TCP_KEEPIDLE`) à 30 minutes, laisse l'intervalle des sondes (`TCP_KEEPINTVL`) à sa valeur système par défaut et fixe le nombre de sondes (`TCP_KEEPCNT`) à 10.

Exemple :

```nginx
listen 127.0.0.1 default_server accept_filter=dataready backlog=1024;
```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
