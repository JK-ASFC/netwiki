---
title: "ngx_http_hls_module"
description: "Module nginx ngx_http_hls_module — Le module ngx_http_hls_module fournit côté serveur la prise en charge de HTTP Live Streaming (HLS) pour les fichiers multimédias MP4 et MOV. Ces fichiers ont généralement l'extension .mp4, .m4v, .m4a, .mov ou .qt. Le…"
tags: [nginx, module, ngx_http_hls_module]
icon: puzzle
---

Le module `ngx_http_hls_module` fournit côté serveur la prise en charge de HTTP Live Streaming (HLS) pour les fichiers multimédias MP4 et MOV. Ces fichiers ont généralement l'extension `.mp4`, `.m4v`, `.m4a`, `.mov` ou `.qt`. Le module prend en charge le codec vidéo H.264 et les codecs audio AAC et MP3.

Pour chaque fichier multimédia, deux URI sont pris en charge :

- Un URI de liste de lecture, d'extension « `.m3u8` ». Il accepte des arguments facultatifs :

  - « `start` » et « `end` » définissent les bornes de la liste de lecture en secondes (1.9.0).
  - « `offset` » décale la position initiale de lecture du nombre de secondes indiqué (1.9.0). Une valeur positive définit un décalage depuis le début de la liste de lecture, une valeur négative depuis la fin du dernier fragment de la liste.
  - « `len` » définit la longueur des fragments en secondes.
- Un URI de fragment, d'extension « `.ts` ». Il accepte des arguments facultatifs :

  - « `start` » et « `end` » définissent les bornes du fragment en secondes.

> [!NOTE]
> Ce module est disponible dans le cadre de notre [abonnement commercial](https://nginx.com/products/).

## Exemple de configuration

```nginx
location / {
    hls;
    hls_fragment            5s;
    hls_buffers             10 10m;
    hls_mp4_buffer_size     1m;
    hls_mp4_max_buffer_size 5m;
    root /var/video/;
}
```

Avec cette configuration, les URI suivants sont pris en charge pour le fichier « `/var/video/test.mp4` » :

```nginx
http://hls.example.com/test.mp4.m3u8?offset=1.000&start=1.000&end=2.200
http://hls.example.com/test.mp4.m3u8?len=8.000
http://hls.example.com/test.mp4.ts?start=1.000&end=2.200
```

## Directives

- [[12-directives/hls|hls]]
- [[12-directives/hls-buffers|hls_buffers]]
- [[12-directives/hls-forward-args|hls_forward_args]]
- [[12-directives/hls-fragment|hls_fragment]]
- [[12-directives/hls-mp4-buffer-size|hls_mp4_buffer_size]]
- [[12-directives/hls-mp4-max-buffer-size|hls_mp4_max_buffer_size]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
