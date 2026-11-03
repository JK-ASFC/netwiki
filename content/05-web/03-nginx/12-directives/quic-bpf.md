---
title: "quic_bpf"
description: "Directive nginx quic_bpf (ngx_http_v3_module) — Enables routing of QUIC packets using eBPF. When enabled, this allows supporting QUIC connection migration. Since 1.31.7, this also allows established QUIC connections to be preserved during…"
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_bpf on \| off;` |
| **Valeur par défaut** | `quic_bpf off;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Enables routing of QUIC packets using [eBPF](https://ebpf.io/). When enabled, this allows supporting QUIC connection migration. Since 1.31.7, this also allows established QUIC connections to be preserved during [[10-guides/01-introduction/control|configuration reloads]] and during [[10-guides/01-introduction/control|live upgrade]].

> [!NOTE]
> The directive value cannot be changed during a configuration reload. To change the directive value, nginx must be restarted. The directive cannot be disabled during the live upgrade if QUIC BPF maps are inherited from the previous nginx instance.

> [!NOTE]
> The directive is only supported on Linux 5.7+.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
