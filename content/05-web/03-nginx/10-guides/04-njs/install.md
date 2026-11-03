---
title: "Download and install"
description: "Nginx — Download and install. For Linux, njs modules packages can be used:"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

## Installing as a Linux package

For Linux, njs modules packages can be used:

- `nginx-module-njs` — njs [[12-directives/load-module|dynamic]] modules
- `nginx-module-njs-dbg` — debug symbols for the `nginx-module-njs` package

After package installation, njs dynamic modules need to be loaded with the [[12-directives/load-module|load_module]] directive:

```nginx
load_module modules/ngx_http_js_module.so;
```

or

```nginx
load_module modules/ngx_stream_js_module.so;
```

## Building from the sources

The [repository](https://github.com/nginx/njs) with njs sources can be cloned with the following command (requires [Git](https://git-scm.com/) client):

```nginx
git clone https://github.com/nginx/njs
```

Then the modules should be compiled from [[10-guides/01-introduction/configure|nginx]] root directory using the `--add-module` configuration parameter:

```nginx
./configure --add-module=path-to-njs/nginx
```

The modules can also be built as [[12-directives/load-module|dynamic]]:

```nginx
./configure --add-dynamic-module=path-to-njs/nginx
```

### Adding QuickJS engine support

Make sure you have built the QuickJS library:

```nginx
git clone https://github.com/bellard/quickjs
cd quickjs
CFLAGS='-fPIC' make libquickjs.a
```

At the module compilation step, also specify the include (`-I`) and library (`-L`) paths with the `--with-cc-opt=` and `--with-ld-opt=` configuration parameters:

```nginx
./configure --add-module=path-to-njs/nginx \
    --with-cc-opt="-I path-to-quickjs" \
    --with-ld-opt="-L path-to-quickjs"
```

## Building njs command-line utility

To build only the njs command-line [[10-guides/04-njs/cli|utility]], run `./configure` and `make njs` commands from njs root directory. After building, the utility is available as `./build/njs`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
