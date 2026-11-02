---
title: Task et Just — aide-mémoire des commandes
description: Commandes Task (--list, --list-all, --summary, --dry, --force, --watch, --parallel, -d, -t, VAR=valeur, -- arguments, --init) et Just (--list, --show, --dry-run, --evaluate, --choose, --justfile, --set, --fmt, --init) avec exemples.
tags: [aide-mémoire, task, just]
icon: terminal
---

Explications : [[01-presentation-utilisation|Task et Just]].

```bash
task --init ; task --list ; task --list-all ; task --summary deploy
task plan ENV=prod ; task --dry deploy ; task --force image ; task --watch lint ; task --parallel lint test
task -d infra/ plan ; task -t ci/Taskfile.yml build ; task deploy -- --limit srv-web-01
just --init ; just --list ; just --show deploy ; just --dry-run deploy prod
just --evaluate ; just --set env prod deploy ; just --choose ; just --justfile ci/justfile build ; just --fmt --unstable
```
