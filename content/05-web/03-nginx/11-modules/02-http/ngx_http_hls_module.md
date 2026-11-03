---
title: "ngx_http_hls_module"
description: "Module nginx ngx_http_hls_module — The ngx_http_hls_module module provides HTTP Live Streaming (HLS) server-side support for MP4 and MOV media files. Such files typically have the .mp4, .m4v, .m4a, .mov, or .qt filename extensions. The module supports…"
tags: [nginx, module, ngx_http_hls_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_hls_module` module provides HTTP Live Streaming (HLS) server-side support for MP4 and MOV media files. Such files typically have the `.mp4`, `.m4v`, `.m4a`, `.mov`, or `.qt` filename extensions. The module supports H.264 video codec, AAC and MP3 audio codecs.

For each media file, two URIs are supported:

- A playlist URI with the “`.m3u8`” filename extension. The URI can accept optional arguments:

  - “`start`” and “`end`” define playlist boundaries in seconds (1.9.0).
  - “`offset`” shifts an initial playback position to the time offset in seconds (1.9.0). A positive value sets a time offset from the beginning of the playlist. A negative value sets a time offset from the end of the last fragment in the playlist.
  - “`len`” defines the fragment length in seconds.
- A fragment URI with the “`.ts`” filename extension. The URI can accept optional arguments:

  - “`start`” and “`end`” define fragment boundaries in seconds.

> [!NOTE]
> This module is available as part of our [abonnement commercial](https://nginx.com/products/).

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

With this configuration, the following URIs are supported for the “`/var/video/test.mp4`” file:

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
