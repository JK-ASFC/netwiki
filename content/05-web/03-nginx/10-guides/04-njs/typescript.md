---
title: "Writing njs code using TypeScript definition files"
description: "Nginx — Writing njs code using TypeScript definition files. TypeScript is a typed superset of JavaScript that compiles to plain JavaScript."
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

[TypeScript](https://www.typescriptlang.org) is a typed superset of JavaScript that compiles to plain JavaScript.

TypeScript supports definition files that contain type information of existing JavaScript libraries. This enables other programs to use the values defined in the files as if they were statically typed TypeScript entities.

njs provides TypeScript definition files for its [[10-guides/04-njs/reference|API]] which can be used to:

- Get autocompletion and API check in an editor
- Write njs type-safe code

## Compiling TypeScript definition files

```nginx
$ git clone https://github.com/nginx/njs
$ cd njs && ./configure && make ts
$ ls build/ts/
njs_core.d.ts
njs_shell.d.ts
ngx_http_js_module.d.ts
ngx_stream_js_module.d.ts
```

## API checks and autocompletions

Put `*.d.ts` files to a place where you editor can find it.

`test.js`:

```nginx
/// <reference path="ngx_http_js_module.d.ts" />
/**
 * @param {NginxHTTPRequest} r
 * */
function content_handler(r) {
    r.headersOut['content-type'] = 'text/plain';
    r.return(200, "Hello");
}
```

## Writing njs type-safe code

`test.ts`:

```nginx
/// <reference path="ngx_http_js_module.d.ts" />
function content_handler(r: NginxHTTPRequest) {
    r.headersOut['content-type'] = 'text/plain';
    r.return(200, "Hello from TypeScript");
}
```

TypeScript installation:

```nginx
# npm install -g typescript
```

TypeScript compilation:

```nginx
$ tsc test.ts
$ cat test.js
```

The resulting `test.js` file can be used directly with njs.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
