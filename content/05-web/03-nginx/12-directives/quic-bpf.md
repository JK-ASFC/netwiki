---
title: "quic_bpf"
description: "Directive nginx quic_bpf (ngx_http_v3_module) — Active le routage des paquets QUIC avec eBPF, ce qui permet la migration des connexions QUIC. Depuis la version 1.31.7, cela permet aussi de conserver les connexions QUIC établies lors des…"
tags: [nginx, directive, ngx_http_v3_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `quic_bpf on \| off;` |
| **Valeur par défaut** | `quic_bpf off;` |
| **Contexte** | `main` |
| **Module** | [[11-modules/02-http/ngx_http_v3_module\|ngx_http_v3_module]] |

## Utilisation

Active le routage des paquets QUIC avec [eBPF](https://ebpf.io/), ce qui permet la migration des connexions QUIC. Depuis la version 1.31.7, cela permet aussi de conserver les connexions QUIC établies lors des [[10-guides/01-introduction/control|rechargements de configuration]] et des [[10-guides/01-introduction/control|mises à jour à chaud]].

> [!NOTE]
> La valeur de la directive ne peut pas être modifiée lors d'un rechargement de configuration ; il faut redémarrer nginx. La directive ne peut pas être désactivée lors d'une mise à jour à chaud si les tables BPF QUIC sont héritées de l'instance précédente de nginx.

> [!NOTE]
> Cette directive n'est prise en charge que sous Linux 5.7+.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
