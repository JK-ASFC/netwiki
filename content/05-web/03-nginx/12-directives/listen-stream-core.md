---
title: "listen (ngx_stream_core_module)"
description: "Directive nginx listen (ngx_stream_core_module) — Définit l'adresse et le port de la socket sur laquelle le serveur acceptera les connexions. On peut n'indiquer que le port. L'adresse peut aussi être un nom d'hôte, par exemple : nginx listen…"
tags: [nginx, directive, ngx_stream_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `listen address:port [default_server] [ssl] [udp] [proxy_protocol] [setfib=number] [fastopen=number] [backlog=number] [rcvbuf=size] [sndbuf=size] [accept_filter=filter] [deferred] [bind] [ipv6only=on\|off] [reuseport] [multipath] [so_keepalive=on\|off\|[keepidle]:[keepintvl]:[keepcnt]];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_core_module\|ngx_stream_core_module]] |

## Utilisation

Définit l'*adresse* et le *port* de la socket sur laquelle le serveur acceptera les connexions. On peut n'indiquer que le port. L'adresse peut aussi être un nom d'hôte, par exemple :

```nginx
listen 127.0.0.1:12345;
listen *:12345;
listen 12345;     # same as *:12345
listen localhost:12345;
```

Les adresses IPv6 s'écrivent entre crochets :

```nginx
listen [::1]:12345;
listen [::]:12345;
```

Les sockets de domaine UNIX s'indiquent avec le préfixe « `unix:` » :

```nginx
listen unix:/var/run/nginx.sock;
```

Les plages de ports (1.15.10) s'indiquent avec le premier et le dernier port séparés par un tiret :

```nginx
listen 127.0.0.1:12345-12399;
listen 12345-12399;
```

Le paramètre `default_server`, s'il est présent, fait du serveur le serveur par défaut pour la paire *adresse*:*port* indiquée (1.25.5). Si aucune directive n'a le paramètre `default_server`, le premier serveur ayant la paire *adresse*:*port* est le serveur par défaut pour cette paire.

Le paramètre `ssl` indique que toutes les connexions acceptées sur ce port fonctionnent en mode SSL.

Le paramètre `udp` configure une socket d'écoute pour les datagrammes (1.9.13). Pour traiter dans la même session les paquets venant de la même adresse et du même port, il faut aussi indiquer le paramètre `reuseport`.

Le paramètre `proxy_protocol` (1.11.4) indique que toutes les connexions acceptées sur ce port doivent utiliser le [protocole PROXY](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt).

> [!NOTE]
> La version 2 du protocole PROXY est prise en charge depuis la version 1.13.11.

La directive `listen` accepte plusieurs paramètres supplémentaires propres aux appels système des sockets. Ils peuvent figurer dans n'importe quelle directive `listen`, mais une seule fois pour un couple *address*:*port* donné.

- **`setfib`=*number***

  ce paramètre (1.25.5) définit la table de routage associée, FIB (option `SO_SETFIB`), de la socket d'écoute. Ne fonctionne actuellement que sous FreeBSD.

- **`fastopen`=*number***

  active « [TCP Fast Open](http://en.wikipedia.org/wiki/TCP_Fast_Open) » pour la socket d'écoute (1.21.0) et [limite](https://datatracker.ietf.org/doc/html/rfc7413#section-5.1) la longueur maximale de la file des connexions dont la poignée de main en trois temps n'est pas terminée.

  > [!NOTE]
  > N'activez cette fonction que si le serveur sait gérer la réception du [même paquet SYN avec données](https://datatracker.ietf.org/doc/html/rfc7413#section-6.1) plusieurs fois.

- **`backlog`=*number***

  définit le paramètre `backlog` de l'appel `listen`, qui limite la longueur maximale de la file des connexions en attente (1.9.2). Par défaut, `backlog` vaut -1 sous FreeBSD, DragonFly BSD et macOS, et 511 sur les autres plates-formes.

- **`rcvbuf`=*size***

  définit la taille du tampon de réception (option `SO_RCVBUF`) du socket d'écoute (1.11.13).

- **`sndbuf`=*size***

  définit la taille du tampon d'envoi (option `SO_SNDBUF`) du socket d'écoute (1.11.13).

- **`accept_filter`=*filter***

  définit le nom du filtre d'acceptation (option `SO_ACCEPTFILTER`) de la socket d'écoute, qui filtre les connexions entrantes avant de les passer à `accept` (1.25.5). Ne fonctionne que sous FreeBSD et NetBSD 5.0+. Valeurs possibles : [dataready](http://man.freebsd.org/accf_data) et [httpready](http://man.freebsd.org/accf_http).

- **`deferred`**

  demande d'utiliser un `accept` différé (option de socket `TCP_DEFER_ACCEPT`) sous Linux (1.25.5).

- **`bind`**

  ce paramètre demande un appel `bind` distinct pour une paire adresse:port donnée. En effet, s'il existe plusieurs directives `listen` avec le même port mais des adresses différentes, et que l'une d'elles écoute sur toutes les adresses de ce port (`*:`*port*), nginx ne fera `bind` que sur `*:`*port*. Notez qu'un appel système `getsockname` est alors effectué pour déterminer l'adresse qui a accepté la connexion. Si les paramètres `setfib`, `fastopen`, `backlog`, `rcvbuf`, `sndbuf`, `accept_filter`, `deferred`, `ipv6only`, `reuseport`, `multipath` ou `so_keepalive` sont utilisés, un appel `bind` distinct est toujours effectué pour la paire *adresse*:*port* concernée.

- **`ipv6only`=`on`|`off`**

  ce paramètre détermine (option de socket `IPV6_V6ONLY`) si un socket IPv6 écoutant sur l'adresse générique `[::]` accepte uniquement les connexions IPv6 ou à la fois IPv6 et IPv4. Il est activé par défaut et ne peut être défini qu'une fois, au démarrage.

- **`reuseport`**

  ce paramètre (1.9.1) crée un socket d'écoute distinct pour chaque processus de travail (option de socket `SO_REUSEPORT` sous Linux 3.9+ et DragonFly BSD, ou `SO_REUSEPORT_LB` sous FreeBSD 12+), ce qui permet au noyau de répartir les connexions entrantes entre les processus de travail. Ne fonctionne actuellement que sous Linux 3.9+, DragonFly BSD et FreeBSD 12+ (1.15.1).

  > [!NOTE]
  > Une mauvaise utilisation de cette option peut avoir des [conséquences](http://man7.org/linux/man-pages/man7/socket.7.html) sur la sécurité.

- **`multipath`**

  ce paramètre (1.29.7) configure le protocole [Multipath TCP](https://datatracker.ietf.org/doc/html/rfc8684) (`IPPROTO_MPTCP`) pour le socket d'écoute. Ne fonctionne actuellement que sous Linux 5.6+.

  > [!NOTE]
  > Ajouter ou retirer ce paramètre active aussi l'option de socket `SO_REUSEPORT`, ce qui peut avoir des [conséquences](http://man7.org/linux/man-pages/man7/socket.7.html) sur la sécurité.

- **`so_keepalive`=`on`|`off`|\[*keepidle*\]:\[*keepintvl*\]:\[*keepcnt*\]**

  ce paramètre configure le comportement « TCP keepalive » du socket d'écoute. S'il est omis, les réglages du système d'exploitation s'appliquent. Avec la valeur « `on` », l'option `SO_KEEPALIVE` est activée pour le socket ; avec « `off` », elle est désactivée. Certains systèmes permettent de régler les paramètres TCP keepalive par socket avec les options `TCP_KEEPIDLE`, `TCP_KEEPINTVL` et `TCP_KEEPCNT`. Sur ces systèmes (actuellement Linux, NetBSD, Dragonfly, FreeBSD et macOS), ils se règlent avec les paramètres *keepidle*, *keepintvl* et *keepcnt*. Un ou deux paramètres peuvent être omis ; le réglage système par défaut de l'option correspondante s'applique alors. Par exemple,

  ```nginx
  so_keepalive=30m::10
  ```

  fixe le délai d'inactivité (`TCP_KEEPIDLE`) à 30 minutes, laisse l'intervalle des sondes (`TCP_KEEPINTVL`) à sa valeur système par défaut et fixe le nombre de sondes (`TCP_KEEPCNT`) à 10.

> [!NOTE]
> Avant la version 1.25.5, des serveurs différents devaient écouter sur des paires *adresse*:*port* différentes.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
