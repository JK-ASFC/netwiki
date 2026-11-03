---
title: "Setting up hashes"
description: "Nginx — Setting up hashes. To quickly process static sets of data such as server names, map directive’s values, MIME types, names of request header strings, nginx uses hash tables. During the start and each re-configuration nginx selects the…"
tags: [nginx, guide]
icon: book-open
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

To quickly process static sets of data such as server names, [[12-directives/map-http-map|map]] directive’s values, MIME types, names of request header strings, nginx uses hash tables. During the start and each re-configuration nginx selects the minimum possible sizes of hash tables such that the bucket size that stores keys with identical hash values does not exceed the configured parameter (hash bucket size). The size of a table is expressed in buckets. The adjustment is continued until the table size exceeds the hash max size parameter. Most hashes have the corresponding directives that allow changing these parameters, for example, for the server names hash they are [[12-directives/server-names-hash-max-size-http-core|server_names_hash_max_size]] and [[12-directives/server-names-hash-bucket-size-http-core|server_names_hash_bucket_size]].

The hash bucket size parameter is aligned to the size that is a multiple of the processor’s cache line size. This speeds up key search in a hash on modern processors by reducing the number of memory accesses. If hash bucket size is equal to one processor’s cache line size then the number of memory accesses during the key search will be two in the worst case — first to compute the bucket address, and second during the key search inside the bucket. Therefore, if nginx emits the message requesting to increase either hash max size or hash bucket size then the first parameter should first be increased.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
