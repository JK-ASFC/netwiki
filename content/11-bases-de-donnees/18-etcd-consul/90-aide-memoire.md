---
title: etcd et Consul — aide-mémoire des commandes
description: Commandes etcdctl (member list/add/remove, endpoint health/status, put, get --prefix, del, watch, lease, snapshot save, defrag, alarm, compaction, user, role), etcdutl et consul (members, info, operator raft, catalog, services register, kv, acl, snapshot, keygen, validate, reload, monitor, debug) avec exemples.
tags: [aide-mémoire, etcd, etcdctl, consul]
icon: terminal
---

Explications : [[01-etcd|etcd]] · [[02-consul|Consul]].

## etcd

```bash
etcdctl member list -w table ; etcdctl endpoint health --cluster ; etcdctl endpoint status --cluster -w table
etcdctl member add etcd4 --peer-urls=https://10.0.20.164:2380 ; etcdctl member remove 8e9e05c52164694d
etcdctl put cle valeur ; etcdctl get cle ; etcdctl get / --prefix --keys-only | head ; etcdctl del cle ; etcdctl watch cle
etcdctl lease grant 60 ; etcdctl put --lease=<id> verrou x
etcdctl snapshot save sauv.db ; etcdutl snapshot status sauv.db -w table ; etcdctl defrag ; etcdctl alarm list
etcdctl compaction $(etcdctl endpoint status -w json | jq '.[0].Status.header.revision')
etcdctl user add root ; etcdctl auth enable
```

## Consul

```bash
consul members ; consul info | head -40 ; consul operator raft list-peers ; consul monitor -log-level=debug
consul catalog services ; consul catalog nodes -service=web ; consul services register web.hcl ; consul services deregister web.hcl
consul kv put cle valeur ; consul kv get -recurse ; consul kv export config/ > kv.json ; consul kv import @kv.json
consul acl token list ; consul acl policy create -name lecture-kv -rules @lecture.hcl ; consul acl token create -policy-name lecture-kv
consul snapshot save sauv.snap ; consul snapshot restore sauv.snap ; consul keygen ; consul validate /etc/consul.d/ ; consul reload
consul debug -duration=30s
```
