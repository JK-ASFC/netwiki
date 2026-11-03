---
title: "keyval_zone (ngx_stream_keyval_module)"
description: "Directive nginx keyval_zone (ngx_stream_keyval_module) — Sets the name and size of the shared memory zone that keeps the key-value database. Key-value pairs are managed by the API. The optional state parameter specifies a file that keeps the current state…"
tags: [nginx, directive, ngx_stream_keyval_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `keyval_zone zone=name:size [state=file] [timeout=time] [type=string\|ip\|prefix] [sync];` |
| **Valeur par défaut** | — |
| **Contexte** | `stream` |
| **Module** | [[11-modules/03-stream/ngx_stream_keyval_module\|ngx_stream_keyval_module]] |

## Utilisation

Sets the *name* and *size* of the shared memory zone that keeps the key-value database. Key-value pairs are managed by the [[11-modules/02-http/ngx_http_api_module|API]].

The optional `state` parameter specifies a *file* that keeps the current state of the key-value database in the JSON format and makes it persistent across nginx restarts. Changing the file content directly should be avoided.

Exemples :

```nginx
keyval_zone zone=one:32k state=/var/lib/nginx/state/one.keyval; # path for Linux
keyval_zone zone=one:32k state=/var/db/nginx/state/one.keyval;  # path for FreeBSD
```

The optional `timeout` parameter (1.15.0) sets the time after which key-value pairs are removed from the zone.

The optional `type` parameter (1.17.1) activates an extra index optimized for matching the key of a certain type and defines matching rules when evaluating a [[12-directives/keyval-stream-keyval|keyval]] `$variable`.

> [!NOTE]
> The index is stored in the same shared memory zone and thus requires additional storage.

- **`type=string`**

  default, no index is enabled; variable lookup is performed using exact match of the record key and a search key

- **`type=ip`**

  the search key is the textual representation of IPv4 or IPv6 address or CIDR range; to match a record key, the search key must belong to a subnet specified by a record key or exactly match an IP address

- **`type=prefix`**

  variable lookup is performed using prefix match of a record key and a search key (1.17.5); to match a record key, the record key must be a prefix of the search key

The optional `sync` parameter (1.15.0) enables [[12-directives/zone-sync|synchronization]] of the shared memory zone. The synchronization requires the `timeout` parameter to be set.

> [!NOTE]
> If the synchronization is enabled, removal of key-value pairs (no matter [[11-modules/02-http/ngx_http_api_module|one]] or [[11-modules/02-http/ngx_http_api_module|all]]) will be performed only on a target cluster node. The same key-value pairs on other cluster nodes will be removed upon `timeout`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
