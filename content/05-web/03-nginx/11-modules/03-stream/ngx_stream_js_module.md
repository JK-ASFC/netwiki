---
title: "ngx_stream_js_module"
description: "Module nginx ngx_stream_js_module — The ngx_stream_js_module module is used to implement session and variable handlers in JavaScript with njs."
tags: [nginx, module, ngx_stream_js_module]
icon: puzzle
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

The `ngx_stream_js_module` module is used to implement session and variable handlers in JavaScript with [[10-guides/04-njs/00-index|njs]].

Les instructions de téléchargement et d'installation sont disponibles [[10-guides/04-njs/install|ici]].

## Exemple de configuration

L'exemple fonctionne depuis la version 0.4.0.

```nginx
stream {
    # since 0.9.1
    js_engine qjs;

    js_import stream.js;

    js_set $bar stream.bar;
    js_set $req_line stream.req_line;

    server {
        listen 12345;

        js_preread stream.preread;
        return     $req_line;
    }

    server {
        listen 12346;

        js_access  stream.access;
        proxy_pass 127.0.0.1:8000;
        js_filter  stream.header_inject;
    }
}

http {
    server {
        listen 8000;
        location / {
            return 200 $http_foo\n;
        }
    }
}
```

The `stream.js` file:

```nginx
var line = '';

function bar(s) {
    var v = s.variables;
    s.log("hello from bar() handler!");
    return "bar-var" + v.remote_port + "; pid=" + v.pid;
}

function preread(s) {
    s.on('upload', function (data, flags) {
        var n = data.indexOf('\n');
        if (n != -1) {
            line = data.substr(0, n);
            s.done();
        }
    });
}

function req_line(s) {
    return line;
}

// Read HTTP request line.
// Collect bytes in 'req' until
// request line is read.
// Injects HTTP header into a client's request

var my_header =  'Foo: foo';
function header_inject(s) {
    var req = '';
    s.on('upload', function(data, flags) {
        req += data;
        var n = req.search('\n');
        if (n != -1) {
            var rest = req.substr(n + 1);
            req = req.substr(0, n + 1);
            s.send(req + my_header + '\r\n' + rest, flags);
            s.off('upload');
        }
    });
}

function access(s) {
    if (s.remoteAddress.match('^192.*')) {
        s.deny();
        return;
    }

    s.allow();
}

export default {bar, preread, req_line, header_inject, access};
```

## Session Object Properties

Each stream njs handler receives one argument, a stream session [[10-guides/04-njs/reference|object]].

## Directives

- [[12-directives/js-access-stream-js|js_access]]
- [[12-directives/js-context-reuse-stream-js|js_context_reuse]]
- [[12-directives/js-engine-stream-js|js_engine]]
- [[12-directives/js-fetch-buffer-size-stream-js|js_fetch_buffer_size]]
- [[12-directives/js-fetch-ciphers-stream-js|js_fetch_ciphers]]
- [[12-directives/js-fetch-max-response-buffer-size-stream-js|js_fetch_max_response_buffer_size]]
- [[12-directives/js-fetch-protocols-stream-js|js_fetch_protocols]]
- [[12-directives/js-fetch-timeout-stream-js|js_fetch_timeout]]
- [[12-directives/js-fetch-trusted-certificate-stream-js|js_fetch_trusted_certificate]]
- [[12-directives/js-fetch-verify-stream-js|js_fetch_verify]]
- [[12-directives/js-fetch-verify-depth-stream-js|js_fetch_verify_depth]]
- [[12-directives/js-fetch-proxy-stream-js|js_fetch_proxy]]
- [[12-directives/js-fetch-keepalive-stream-js|js_fetch_keepalive]]
- [[12-directives/js-fetch-keepalive-requests-stream-js|js_fetch_keepalive_requests]]
- [[12-directives/js-fetch-keepalive-time-stream-js|js_fetch_keepalive_time]]
- [[12-directives/js-fetch-keepalive-timeout-stream-js|js_fetch_keepalive_timeout]]
- [[12-directives/js-filter|js_filter]]
- [[12-directives/js-import-stream-js|js_import]]
- [[12-directives/js-include-stream-js|js_include]]
- [[12-directives/js-load-stream-native-module|js_load_stream_native_module]]
- [[12-directives/js-path-stream-js|js_path]]
- [[12-directives/js-periodic-stream-js|js_periodic]]
- [[12-directives/js-preload-object-stream-js|js_preload_object]]
- [[12-directives/js-preread|js_preread]]
- [[12-directives/js-set-stream-js|js_set]]
- [[12-directives/js-shared-dict-zone-stream-js|js_shared_dict_zone]]
- [[12-directives/js-var-stream-js|js_var]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
