---
title: Fluentd et Vector — aide-mémoire des commandes
description: Commandes Fluentd (fluentd --dry-run, -c, -v, fluent-gem install/list, fluent-cat pour tester, monitor_agent, journaux du service) et Vector (validate, test, top, tap, vrl, list, generate, graph, --watch-config) avec exemples.
tags: [aide-mémoire, fluentd, vector, vrl]
icon: terminal
---

Explications : [[01-fluentd|Fluentd]] · [[02-vector|Vector]].

```bash
fluentd --version ; fluentd --dry-run -c /etc/fluent/fluentd.conf ; fluentd -c fluentd.conf -v
sudo fluent-gem list | grep plugin ; sudo fluent-gem install fluent-plugin-s3
echo '{"message":"test"}' | fluent-cat test.journal          # injecter un événement (source forward requise)
curl -s localhost:24220/api/plugins.json | jq . ; sudo journalctl -u fluentd -f ; tail -f /var/log/fluent/fluentd.log
vector --version ; vector validate /etc/vector/vector.yaml ; vector test /etc/vector/tests.yaml ; vector list
vector top ; vector tap 'nginx_*' ; vector vrl ; vector graph --config vector.yaml | dot -Tsvg > graphe.svg
vector --config vector.yaml --watch-config ; vector generate 'file/remap/console' > exemple.toml
```
