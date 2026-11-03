---
title: "nginx JavaScript module"
description: "Nginx — nginx JavaScript module. njs is an nginx module that extends the server's functionality through JavaScript scripting, enabling the creation of custom server-side logic and more."
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

njs is an nginx module that extends the server's functionality through JavaScript scripting, enabling the creation of custom server-side logic and more.

nginx calls JavaScript handlers at a fixed set of [[10-guides/04-njs/integration|integration points]]: HTTP request and response processing phases, stream session phases, variable evaluation, and periodic timers. njs is not a standalone application runtime: it has no start-up script and no event loop of its own, JavaScript code runs only when nginx invokes a configured handler, and control returns to nginx once the handler completes.

> [!NOTE]
> The built-in [[10-guides/04-njs/engine|njs]] JavaScript engine is deprecated since 1.0.0; new configurations should use the [[10-guides/04-njs/engine|QuickJS]] engine.

## Getting started

- [[10-guides/04-njs/install|Download and install]]
- [[10-guides/04-njs/integration|Execution model and integration points]]
- [Examples](https://github.com/nginx/njs-examples/)
- [[10-guides/04-njs/cli|Command-line interface]]

## Reference

- [[10-guides/04-njs/reference|Reference]]
- [[11-modules/02-http/ngx_http_js_module|ngx_http_js_module]]
- [[11-modules/03-stream/ngx_stream_js_module|ngx_stream_js_module]]
- [[10-guides/04-njs/engine|JavaScript Engine]]
- [[10-guides/04-njs/compatibility|Compatibility]]
- [[10-guides/04-njs/native-modules|Native modules]]
- [[10-guides/04-njs/node-modules|Using node modules with njs]]
- [[10-guides/04-njs/typescript|Writing njs code using TypeScript definition files]]
- [[10-guides/04-njs/preload-objects|Understanding preloaded objects]]

## Project

- 
- [[10-guides/04-njs/security|Security]]
- Tested OS and platforms

## Use cases

- Complex access control and security checks in njs before a request reaches an upstream server
- Manipulating response headers
- Writing flexible asynchronous content handlers and filters

See [examples](https://github.com/nginx/njs-examples/) for more njs use cases.

## Basic HTTP Example

To use njs in nginx:

- [[10-guides/04-njs/install|install]] njs
- create an njs script file, for example, `http.js`. See [[10-guides/04-njs/reference|Reference]] for the list of njs properties and methods.

  ```nginx
  function hello(r) {
      r.return(200, "Hello world!");
  }

  export default {hello};
  ```
- in the `nginx.conf` file, enable [[11-modules/02-http/ngx_http_js_module|ngx_http_js_module]] module and specify the [[12-directives/js-import-http-js|js_import]] directive with the `http.js` script file:

  ```nginx
  load_module modules/ngx_http_js_module.so;

  events {}

  http {
      # since 0.9.1
      js_engine qjs;

      js_import http.js;

      server {
          listen 8000;

          location / {
              js_content http.hello;
          }
      }
  }
  ```

There is also a standalone [[10-guides/04-njs/cli|command line]] utility that can be used independently of nginx for njs development and debugging.

## Tested OS and platforms

- FreeBSD / amd64;
- Linux / x86, amd64, arm64, ppc64el;
- Solaris 11 / amd64;
- macOS / x86\_64;

## Presentation at nginx.conf 2018

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
