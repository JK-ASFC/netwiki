---
title: "aio"
description: "Directive nginx aio (ngx_http_core_module) — Enables or disables the use of asynchronous file I/O (AIO) on FreeBSD and Linux: nginx location /video/ { aio on; output_buffers 1 64k; } On FreeBSD, AIO can be used starting from FreeBSD 4.3. Prior…"
tags: [nginx, directive, ngx_http_core_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `aio on \| off \| threads[=pool];` |
| **Valeur par défaut** | `aio off;` |
| **Contexte** | `http`, `server`, `location` |
| **Apparue dans la version** | 0.8.11 |
| **Module** | [[11-modules/02-http/ngx_http_core_module\|ngx_http_core_module]] |

## Utilisation

Enables or disables the use of asynchronous file I/O (AIO) on FreeBSD and Linux:

```nginx
location /video/ {
    aio            on;
    output_buffers 1 64k;
}
```

On FreeBSD, AIO can be used starting from FreeBSD 4.3. Prior to FreeBSD 11.0, AIO can either be linked statically into a kernel:

```nginx
options VFS_AIO
```

or loaded dynamically as a kernel loadable module:

```nginx
kldload aio
```

On Linux, AIO can be used starting from kernel version 2.6.22. Also, it is necessary to enable [[12-directives/directio|directio]], or otherwise reading will be blocking:

```nginx
location /video/ {
    aio            on;
    directio       512;
    output_buffers 1 128k;
}
```

On Linux, [[12-directives/directio|directio]] can only be used for reading blocks that are aligned on 512-byte boundaries (or 4K for XFS). File’s unaligned end is read in blocking mode. The same holds true for byte range requests and for FLV requests not from the beginning of a file: reading of unaligned data at the beginning and end of a file will be blocking.

When both AIO and [[12-directives/sendfile|sendfile]] are enabled on Linux, AIO is used for files that are larger than or equal to the size specified in the [[12-directives/directio|directio]] directive, while [[12-directives/sendfile|sendfile]] is used for files of smaller sizes or when [[12-directives/directio|directio]] is disabled.

```nginx
location /video/ {
    sendfile       on;
    aio            on;
    directio       8m;
}
```

Finally, files can be read and [[12-directives/sendfile|sent]] using multi-threading (1.7.11), without blocking a worker process:

```nginx
location /video/ {
    sendfile       on;
    aio            threads;
}
```

Read and send file operations are offloaded to threads of the specified [[12-directives/thread-pool|pool]]. If the pool name is omitted, the pool with the name “`default`” is used. The pool name can also be set with variables:

```nginx
aio threads=pool$disk;
```

By default, multi-threading is disabled, it should be enabled with the `--with-threads` configuration parameter. Currently, multi-threading is compatible only with the [[10-guides/01-introduction/events|Connection processing methods]], [[10-guides/01-introduction/events|Connection processing methods]], and [[10-guides/01-introduction/events|Connection processing methods]] methods. Multi-threaded sending of files is only supported on Linux.

See also the [[12-directives/sendfile|sendfile]] directive.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
