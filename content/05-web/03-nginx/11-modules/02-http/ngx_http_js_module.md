---
title: "ngx_http_js_module"
description: "Module nginx ngx_http_js_module — The ngx_http_js_module module is used to implement location, variable, and filter handlers in JavaScript with njs."
tags: [nginx, module, ngx_http_js_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_http_js_module` module is used to implement location, variable, and filter handlers in JavaScript with [[10-guides/04-njs/00-index|njs]].

Download and install instructions are available [[10-guides/04-njs/install|here]].

## Example Configuration

The example works since 0.4.0.

```nginx
http {
    # since 0.9.1
    js_engine qjs;

    js_import http.js;

    js_set $foo     http.foo;
    js_set $summary http.summary;
    js_set $hash    http.hash;

    resolver 10.0.0.1;

    server {
        listen 8000;

        location / {
            add_header X-Foo $foo;
            js_content http.baz;
        }

        location = /summary {
            return 200 $summary;
        }

        location = /hello {
            js_content http.hello;
        }

        # since 0.7.0
        location = /fetch {
            js_content                   http.fetch;
            js_fetch_trusted_certificate /path/to/ISRG_Root_X1.pem;
        }

        # since 0.7.0
        location = /crypto {
            add_header Hash $hash;
            return     200;
        }
    }
}
```

The `http.js` file:

```nginx
function foo(r) {
    r.log("hello from foo() handler");
    return "foo";
}

function summary(r) {
    var a, s, h;

    s = "JS summary\n\n";

    s += "Method: " + r.method + "\n";
    s += "HTTP version: " + r.httpVersion + "\n";
    s += "Host: " + r.headersIn.host + "\n";
    s += "Remote Address: " + r.remoteAddress + "\n";
    s += "URI: " + r.uri + "\n";

    s += "Headers:\n";
    for (h in r.headersIn) {
        s += "  header '" + h + "' is '" + r.headersIn[h] + "'\n";
    }

    s += "Args:\n";
    for (a in r.args) {
        s += "  arg '" + a + "' is '" + r.args[a] + "'\n";
    }

    return s;
}

function baz(r) {
    r.status = 200;
    r.headersOut.foo = 1234;
    r.headersOut['Content-Type'] = "text/plain; charset=utf-8";
    r.headersOut['Content-Length'] = 15;
    r.sendHeader();
    r.send("nginx");
    r.send("java");
    r.send("script");

    r.finish();
}

function hello(r) {
    r.return(200, "Hello world!");
}

// since 0.7.0
async function fetch(r) {
    let results = await Promise.all([ngx.fetch('https://nginx.org/'),
                                     ngx.fetch('https://nginx.org/en/')]);

    r.return(200, JSON.stringify(results, undefined, 4));
}

// since 0.9.5
async function hash(r) {
    let hash = await crypto.subtle.digest('SHA-512', r.headersIn.host);
    return Buffer.from(hash).toString('hex');
}

export default {foo, summary, baz, hello, fetch, hash};
```

## Request Argument

Each HTTP njs handler receives one argument, a request [[10-guides/04-njs/reference|object]].

## Directives

- [[12-directives/js-body-filter|js_body_filter]]
- [[12-directives/js-access-http-js|js_access]]
- [[12-directives/js-content|js_content]]
- [[12-directives/js-context-reuse-http-js|js_context_reuse]]
- [[12-directives/js-engine-http-js|js_engine]]
- [[12-directives/js-fetch-buffer-size-http-js|js_fetch_buffer_size]]
- [[12-directives/js-fetch-ciphers-http-js|js_fetch_ciphers]]
- [[12-directives/js-fetch-max-response-buffer-size-http-js|js_fetch_max_response_buffer_size]]
- [[12-directives/js-fetch-protocols-http-js|js_fetch_protocols]]
- [[12-directives/js-fetch-timeout-http-js|js_fetch_timeout]]
- [[12-directives/js-fetch-trusted-certificate-http-js|js_fetch_trusted_certificate]]
- [[12-directives/js-fetch-verify-http-js|js_fetch_verify]]
- [[12-directives/js-fetch-verify-depth-http-js|js_fetch_verify_depth]]
- [[12-directives/js-fetch-proxy-http-js|js_fetch_proxy]]
- [[12-directives/js-fetch-keepalive-http-js|js_fetch_keepalive]]
- [[12-directives/js-fetch-keepalive-requests-http-js|js_fetch_keepalive_requests]]
- [[12-directives/js-fetch-keepalive-time-http-js|js_fetch_keepalive_time]]
- [[12-directives/js-fetch-keepalive-timeout-http-js|js_fetch_keepalive_timeout]]
- [[12-directives/js-header-filter|js_header_filter]]
- [[12-directives/js-import-http-js|js_import]]
- [[12-directives/js-include-http-js|js_include]]
- [[12-directives/js-load-http-native-module|js_load_http_native_module]]
- [[12-directives/js-path-http-js|js_path]]
- [[12-directives/js-periodic-http-js|js_periodic]]
- [[12-directives/js-preload-object-http-js|js_preload_object]]
- [[12-directives/js-set-http-js|js_set]]
- [[12-directives/js-shared-dict-zone-http-js|js_shared_dict_zone]]
- [[12-directives/js-var-http-js|js_var]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
