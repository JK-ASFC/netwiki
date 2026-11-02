---
title: mitmproxy — aide-mémoire des commandes
description: Commandes et raccourcis mitmproxy avec exemples — mitmproxy, mitmweb, mitmdump, options (--mode, -p, --listen-host, --set, --ssl-insecure, --ignore-hosts, --allow-hosts, -w, -r, -s, --server-replay, --client-replay), expressions de filtre (~d, ~u, ~m, ~c, ~h, ~b, ~q, ~s, !, &, |) et raccourcis console.
tags: [aide-mémoire, mitmproxy, mitmdump, filtres]
icon: terminal
---

Explications : [[01-presentation-utilisation|mitmproxy]].

## Lancement

```bash
mitmproxy -p 8080
mitmweb --listen-host 0.0.0.0 -p 8080 --web-port 8081
mitmdump -w capture.mitm
mitmdump -nr capture.mitm --flow-detail 2
mitmproxy --ignore-hosts '^(.+\.)?banque\.fr:443$'      # ne pas intercepter (tunnel TLS transparent)
mitmproxy --allow-hosts 'api\.corp\.exemple\.fr'        # n'intercepter que cet hôte
mitmproxy --ssl-insecure                                 # accepter des certificats amont invalides (laboratoire)
mitmproxy --set block_global=false --set anticache=true
mitmdump -s script.py --set termlog_verbosity=debug
mitmproxy --client-replay capture.mitm
```

## Filtres

| Expression | Signification |
| --- | --- |
| `~d domaine` | Domaine |
| `~u regex` | URL |
| `~m POST` | Méthode |
| `~c 404` | Code de réponse |
| `~h "Authorization"` | En-tête (requête ou réponse) |
| `~b motclé` | Corps |
| `~q` / `~s` | Requêtes sans réponse / réponses |
| `!`, `&`, `\|` | Négation, ET, OU |

## Raccourcis console

`?` aide · `Entrée` détail · `Tab` requête/réponse · `f` filtre de vue · `i` filtre d'interception · `a` reprendre · `e` éditer · `r` rejouer · `w` enregistrer · `z` vider · `q` quitter.
