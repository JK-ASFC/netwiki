---
title: "Execution model and integration points"
description: "Nginx — Execution model and integration points. JavaScript code in njs never runs on its own. nginx calls it at a fixed set of integration points, each bound to a handler by a configuration directive. There is no start-up script, no background thread, and no event…"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

JavaScript code in [[10-guides/04-njs/00-index|njs]] never runs on its own. nginx calls it at a fixed set of integration points, each bound to a handler by a configuration directive. There is no start-up script, no background thread, and no event loop of its own: nginx invokes a handler, the handler runs, and control returns to nginx.

This article describes when handlers are called and how to choose the right one. The exact contract of each directive is documented in [[11-modules/02-http/ngx_http_js_module|ngx_http_js_module]] and [[11-modules/03-stream/ngx_stream_js_module|ngx_stream_js_module]].

## Execution model

1. When the configuration is loaded, the [[12-directives/js-import-http-js|js_import]] directive compiles the JavaScript modules. Syntax errors are reported at this point, before nginx starts serving traffic.
2. When a request or a stream session reaches one of the integration points, a JavaScript context is created, the imported modules are evaluated in it, and the configured handlers are called.
3. When the request or session is finished, the context is destroyed or, with the [[10-guides/04-njs/engine|QuickJS]] engine, returned to a pool of reusable contexts. Nothing survives it except the data explicitly stored in a [[10-guides/04-njs/reference|shared dictionary]] or sent elsewhere.

The only integration point not driven by a client request is `js_periodic`, which is driven by an nginx timer. JavaScript code cannot create an integration point of its own: it cannot open a listening socket, spawn a thread, or arrange to be called back outside of the handlers enabled by the configuration.

## HTTP integration points

Handlers receive the [[10-guides/04-njs/reference|HTTP Request]] object as the first argument, except for `js_periodic`, which receives a [[10-guides/04-njs/reference|Periodic Session]] object.

|   |   |   |
| --- | --- | --- |
| **Directive** | **When it runs** | **Asynchronous operations** |
| [[12-directives/js-access-http-js\|js_access]] | access phase, before the request is passed further | supported |
| [[12-directives/js-content\|js_content]] | content phase, instead of an upstream or a static file | supported |
| [[12-directives/js-header-filter\|js_header_filter]] | once, when the response header is ready to be sent | not supported |
| [[12-directives/js-body-filter\|js_body_filter]] | for every chunk of the response body | not supported |
| [[12-directives/js-set-http-js\|js_set]] | when the variable is referenced for the first time, at whatever phase that happens, or on every reference with `nocache` | not supported |
| [[12-directives/js-periodic-http-js\|js_periodic]] | at a regular interval, without a client request | supported |

Handlers marked as not supporting asynchronous operations must produce their result before returning: they cannot wait for a subrequest, a fetch, or a timer. Such a handler may still be declared `async` as long as everything it awaits settles immediately.

There is no handler for the rewrite or log phases. A `js_set` variable referenced from a directive of the corresponding phase is evaluated at that phase, which is the usual way to run code at the end of a request.

## Stream integration points

Handlers receive the [[10-guides/04-njs/reference|Stream Session]] object as the first argument, except for `js_periodic`, which receives a [[10-guides/04-njs/reference|Periodic Session]] object.

|   |   |   |
| --- | --- | --- |
| **Directive** | **When it runs** | **Asynchronous operations** |
| [[12-directives/js-access-stream-js\|js_access]] | access phase | in [[10-guides/04-njs/reference\|s.on()]] callbacks |
| [[12-directives/js-preread\|js_preread]] | preread phase, before the connection to the upstream is made | in [[10-guides/04-njs/reference\|s.on()]] callbacks |
| [[12-directives/js-filter\|js_filter]] | content phase, to register data filters for both directions | not supported |
| [[12-directives/js-set-stream-js\|js_set]] | when the variable is referenced for the first time, at whatever phase that happens, or on every reference with `nocache` | not supported |
| [[12-directives/js-periodic-stream-js\|js_periodic]] | at a regular interval, without a client session | supported |

The `js_access`, `js_preread`, and `js_filter` handlers are called once, and are expected to register [[10-guides/04-njs/reference|s.on()]] callbacks for the data that arrives later. The handler itself must return immediately.

## Choosing an integration point

- **generate a response instead of proxying it**

  [[12-directives/js-content|js_content]]

- **allow or deny a request or a connection, possibly after asking an external service**

  [[12-directives/js-access-http-js|js_access]] for requests, [[12-directives/js-access-stream-js|js_access]] for connections, or [[12-directives/js-preread|js_preread]] when the decision depends on the data sent by the client

- **compute a value for another nginx directive**

  [[12-directives/js-set-http-js|js_set]] binds a handler to a variable, which is how a computed value reaches `proxy_pass`, `log_format`, and other directives that accept variables. A handler called earlier can also assign a variable declared with [[12-directives/js-var-http-js|js_var]] through [[10-guides/04-njs/reference|r.variables]]

- **change the response of an upstream server**

  [[12-directives/js-header-filter|js_header_filter]] for the header, [[12-directives/js-body-filter|js_body_filter]] for the body

- **rewrite the byte stream of a proxied connection**

  [[12-directives/js-filter|js_filter]]

- **refresh a cache, poll an API, or report metrics without a client request**

  [[12-directives/js-periodic-http-js|js_periodic]]

Several handlers may be combined for the same request, for example an access check followed by a body filter. Each of them is a separate call with its own constraints.

## State and lifetime

Module top-level code is evaluated for each new JavaScript context, that is, for each request or stream session that invokes JavaScript. With the [[10-guides/04-njs/engine|QuickJS]] engine, a context may instead be taken from a pool of reusable contexts, see [[12-directives/js-context-reuse-http-js|js_context_reuse]], in which case the modules are not evaluated again and the changes previously made to the module scope are inherited.

> [!NOTE]
> Module-level variables therefore cannot be used to pass data between requests or to cache results: depending on the engine and on context reuse, such data is either lost or inherited from an unrelated request. Expensive initialization in the module scope is also paid for on every new context.

nginx runs several worker processes that do not share memory by default. The njs mechanism for sharing state across workers is a [[10-guides/04-njs/reference|shared dictionary]] specified with the [[12-directives/js-shared-dict-zone-http-js|js_shared_dict_zone]] directive.

Asynchronous operations such as [[10-guides/04-njs/reference|ngx.fetch()]], [[10-guides/04-njs/reference|r.subrequest()]], and [[10-guides/04-njs/reference|setTimeout()]] are driven by the nginx event loop. There are no threads: a handler that computes for a long time blocks the whole worker process, and with it every other connection this worker serves.

## Using njs outside of nginx

- The [[10-guides/04-njs/cli|command-line utility]] runs njs without nginx, which is convenient for developing and debugging the parts of a script that do not depend on the request.
- njs is not Node.js. It implements the ECMAScript language, a set of [[10-guides/04-njs/reference|built-in modules]], and the nginx objects, but not the Node.js API and not package resolution. Libraries can still be used if they are bundled beforehand, see [[10-guides/04-njs/node-modules|Using node modules with njs]].
- [[10-guides/04-njs/native-modules|Native modules]] extend njs with code written in C. The shared library is loaded when the configuration is parsed, and the module it registers is then imported like any other module.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
