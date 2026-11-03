---
title: "listen (ngx_mail_core_module)"
description: "Directive nginx listen (ngx_mail_core_module) — Définit l'adresse (address) et le port (port) du socket sur lequel le serveur accepte les requêtes. On peut indiquer seulement le port. L'adresse peut aussi être un nom d'hôte, par exemple : nginx…"
tags: [nginx, directive, ngx_mail_core_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `listen address:port [ssl] [proxy_protocol] [backlog=number] [rcvbuf=size] [sndbuf=size] [bind] [ipv6only=on\|off] [multipath] [so_keepalive=on\|off\|[keepidle]:[keepintvl]:[keepcnt]];` |
| **Valeur par défaut** | — |
| **Contexte** | `server` |
| **Module** | [[11-modules/04-mail/ngx_mail_core_module\|ngx_mail_core_module]] |

## Utilisation

Définit l'adresse (*address*) et le port (*port*) du socket sur lequel le serveur accepte les requêtes. On peut indiquer seulement le port. L'adresse peut aussi être un nom d'hôte, par exemple :

```nginx
listen 127.0.0.1:110;
listen *:110;
listen 110;     # same as *:110
listen localhost:110;
```

Les adresses IPv6 (0.7.58) s'écrivent entre crochets :

```nginx
listen [::1]:110;
listen [::]:110;
```

Les sockets de domaine UNIX (1.3.5) s'indiquent avec le préfixe « `unix:` » :

```nginx
listen unix:/var/run/nginx.sock;
```

Des serveurs différents doivent écouter sur des couples *address*:*port* différents.

Le paramètre `ssl` indique que toutes les connexions acceptées sur ce port fonctionnent en mode SSL.

Le paramètre `proxy_protocol` (1.19.8) indique que toutes les connexions acceptées sur ce port utilisent le [protocole PROXY](http://www.haproxy.org/download/1.8/doc/proxy-protocol.txt). Les informations obtenues sont transmises au [[11-modules/04-mail/ngx_mail_auth_http_module|serveur d'authentification]] et peuvent servir à [[11-modules/04-mail/ngx_mail_realip_module|remplacer l'adresse du client]].

La directive `listen` accepte plusieurs paramètres supplémentaires propres aux appels système des sockets.

- **`backlog`=*number***

  définit le paramètre `backlog` de l'appel `listen`, qui limite la longueur maximale de la file des connexions en attente (1.9.2). Par défaut, `backlog` vaut -1 sous FreeBSD, DragonFly BSD et macOS, et 511 sur les autres plates-formes.

- **`rcvbuf`=*size***

  définit la taille du tampon de réception (option `SO_RCVBUF`) du socket d'écoute (1.11.13).

- **`sndbuf`=*size***

  définit la taille du tampon d'envoi (option `SO_SNDBUF`) du socket d'écoute (1.11.13).

- **`bind`**

  ce paramètre demande un appel `bind` distinct pour le couple adresse:port donné. En effet, s'il existe plusieurs directives `listen` avec le même port mais des adresses différentes, et que l'une d'elles écoute sur toutes les adresses pour ce port (`*:`*port*), nginx ne fait `bind` que sur `*:`*port*. Dans ce cas, l'appel système `getsockname` est utilisé pour déterminer l'adresse qui a accepté la connexion. Si les paramètres `backlog`, `rcvbuf`, `sndbuf`, `ipv6only`, `multipath` ou `so_keepalive` sont utilisés, un appel `bind` distinct est toujours fait pour le couple *address*:*port* concerné.

- **`ipv6only`=`on`|`off`**

  ce paramètre détermine (option de socket `IPV6_V6ONLY`) si un socket IPv6 écoutant sur l'adresse générique `[::]` accepte uniquement les connexions IPv6 ou à la fois IPv6 et IPv4. Il est activé par défaut et ne peut être défini qu'une fois, au démarrage.

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

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
