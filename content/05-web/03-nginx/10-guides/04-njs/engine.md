---
title: "JavaScript Engine"
description: "Nginx — JavaScript Engine. Starting from version 0.8.6, multiple JavaScript engines are supported. To specify a particular engine, use the js_engine directive available for both the http and stream. By default, the njs engine is used."
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

Starting from version 0.8.6, multiple JavaScript engines are supported. To specify a particular engine, use the `js_engine` directive available for both the [[12-directives/js-engine-http-js|http]] and [[12-directives/js-engine-stream-js|stream]]. By default, the njs engine is used.

## njs engine

> [!NOTE]
> The njs engine is deprecated since 1.0.0; new code should use the QuickJS engine instead.

njs is an embeddable JavaScript engine developed as a part of the njs module. See the [[10-guides/04-njs/compatibility|Compatibility]] section for details.

## QuickJS engine

[QuickJS](https://bellard.org/quickjs/) is a lightweight, embeddable JavaScript engine that supports the [ES2023](https://tc39.es/ecma262/2023/) specification, including features as modules, asynchronous generators, proxies and BigInt.

Since version 0.8.6, a drop-in replacement for [[10-guides/04-njs/reference|njs/nginx objects]] has been introduced to ensure compatibility with the njs engine, with the following exceptions:

- njs-specific API: [[10-guides/04-njs/reference|njs.dump()]], `console.dump()`.
- deprecated API: `require()`, use the `import` statement instead.
- `js_preload_object` directive for [[12-directives/js-preload-object-http-js|http]] and [[12-directives/js-preload-object-stream-js|stream]].

njs built-in modules status:

- [[10-guides/04-njs/reference|buffer]]: since 0.8.6.
- [[10-guides/04-njs/reference|crypto]]: since 0.8.10.
- [[10-guides/04-njs/reference|fs]]: since 0.8.9.
- [[10-guides/04-njs/reference|querystring]]: since 0.8.10.
- [[10-guides/04-njs/reference|WebCrypto]]: since 0.8.10.
- [[10-guides/04-njs/reference|xml]]: since 0.8.10.
- [[10-guides/04-njs/reference|zlib]]: since 0.8.5.

njs built-in objects status:

- [[10-guides/04-njs/reference|process]]: since 0.8.8.
- [[10-guides/04-njs/reference|TextDecoder]]: since 0.8.10.
- [[10-guides/04-njs/reference|TextEncoder]]: since 0.8.10.

nginx built-in objects status:

- [[10-guides/04-njs/reference|ngx.fetch]]: since 0.9.1.
- [[10-guides/04-njs/reference|shared dictionary]]: since 0.8.8.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
