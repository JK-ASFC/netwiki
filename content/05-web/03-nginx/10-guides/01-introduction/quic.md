---
title: "Prise en charge de QUIC et HTTP/3"
description: "Nginx — Prise en charge de QUIC et HTTP/3. La prise en charge des protocoles QUIC et HTTP/3 est disponible depuis la version 1.25.0 et incluse dans les paquets binaires Linux. Consultez la documentation de ngx_http_v3_module."
tags: [nginx, guide]
icon: book-open
---

La prise en charge des protocoles [QUIC](https://datatracker.ietf.org/doc/html/rfc9000) et [HTTP/3](https://datatracker.ietf.org/doc/html/rfc9114) est disponible depuis la version 1.25.0 et incluse dans les paquets binaires Linux. Consultez la documentation de [[11-modules/02-http/ngx_http_v3_module|ngx_http_v3_module]].

## Compilation à partir des sources

La compilation se configure avec la commande `configure`. Voir [[10-guides/01-introduction/configure|Compiler nginx à partir des sources]] pour plus de détails.

La bibliothèque [OpenSSL](https://openssl.org) 3.5.1 ou supérieure est recommandée pour compiler nginx avec QUIC. Sinon, une couche de compatibilité [OpenSSL](https://openssl.org) est utilisée, qui ne prend pas en charge les [[12-directives/ssl-early-data|données précoces]]. Les bibliothèques précompilées [BoringSSL](https://boringssl.googlesource.com/boringssl), [LibreSSL](https://www.libressl.org) ou [QuicTLS](https://github.com/quictls/openssl) peuvent aussi être utilisées.

Commande pour configurer nginx avec [BoringSSL](https://boringssl.googlesource.com/boringssl) :

```
./configure
    --with-debug
    --with-http_v3_module
    --with-cc-opt="-I../boringssl/include"
    --with-ld-opt="-L../boringssl/build -lstdc++"
```

nginx peut aussi être configuré avec [QuicTLS](https://github.com/quictls/openssl) :

```
./configure
    --with-debug
    --with-http_v3_module
    --with-cc-opt="-I../quictls/build/include"
    --with-ld-opt="-L../quictls/build/lib"
```

nginx peut aussi être configuré avec [LibreSSL](https://www.libressl.org) :

```
./configure
    --with-debug
    --with-http_v3_module
    --with-cc-opt="-I../libressl/build/include"
    --with-ld-opt="-L../libressl/build/lib"
```

Après la configuration, nginx est compilé et installé avec `make`.

## Conseils de configuration

La directive [[12-directives/listen-http-core|listen]] du module [[11-modules/02-http/ngx_http_core_module|ngx_http_core_module]] dispose d'un nouveau paramètre [[11-modules/02-http/ngx_http_core_module|quic]] qui active HTTP/3 sur QUIC sur le port indiqué.

Avec le paramètre `quic`, on peut aussi indiquer le paramètre [[11-modules/02-http/ngx_http_core_module|reuseport]] pour un bon fonctionnement avec plusieurs processus de travail.

Pour [[12-directives/quic-retry|activer]] la validation d'adresse :

```c
quic_retry on;
```

Pour [[12-directives/ssl-early-data|activer]] le 0-RTT :

```c
ssl_early_data on;
```

Pour [[12-directives/quic-gso|activer]] le GSO (Generic Segmentation Offloading) :

```c
quic_gso on;
```

Pour [[12-directives/quic-host-key|définir]] la clé d'hôte des différents jetons :

```c
quic_host_key <filename>;
```

QUIC nécessite le protocole TLSv1.3, activé par défaut dans la directive [[12-directives/ssl-protocols-http-ssl|ssl_protocols]].

Par défaut, l'[optimisation GSO propre à Linux](http://vger.kernel.org/lpc_net2018_talks/willemdebruijn-lpc2018-udpgso-paper-DRAFT-1.pdf) est désactivée. Activez-la si l'interface réseau correspondante est configurée pour prendre en charge le GSO.

## Dépannage

Conseils pour identifier les problèmes :

- Vérifiez que nginx est compilé avec la bonne bibliothèque SSL.
- Vérifiez que nginx utilise la bonne bibliothèque SSL à l'exécution (`nginx -V` affiche celle utilisée).
- Vérifiez que le client envoie réellement ses requêtes en QUIC. Il est conseillé de commencer avec un client console simple comme [ngtcp2](https://nghttp2.org/ngtcp2) pour vérifier la configuration du serveur avant d'essayer de vrais navigateurs, parfois très exigeants sur les certificats.
- Compilez nginx avec la [[10-guides/01-introduction/debugging-log|prise en charge du débogage]] et consultez le journal de débogage. Il contient tous les détails sur la connexion et la raison de son échec. Tous les messages concernés portent le préfixe « `quic` » et se filtrent facilement.
- Pour aller plus loin, un débogage supplémentaire peut être activé avec les macros suivantes : `NGX_QUIC_DEBUG_PACKETS`, `NGX_QUIC_DEBUG_FRAMES`, `NGX_QUIC_DEBUG_ALLOC`, `NGX_QUIC_DEBUG_CRYPTO`.

  ```
  ./configure
      --with-http_v3_module
      --with-debug
      --with-cc-opt="-DNGX_QUIC_DEBUG_PACKETS -DNGX_QUIC_DEBUG_CRYPTO"
  ```

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
