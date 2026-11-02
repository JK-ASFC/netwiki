---
title: etcd
description: etcd (CNCF) — magasin clé-valeur distribué et fortement cohérent (Raft), cœur de Kubernetes : rôle, quorum et nombre de membres, installation (binaires GitHub sur Linux, macOS et Windows, paquets des distributions, Docker), configuration d'un cluster de trois membres (initial-cluster, URL pair et client), TLS mutuel et authentification, etcdctl (put, get, watch, member list, endpoint health, endpoint status), sauvegarde et restauration (snapshot save, etcdutl snapshot restore), compaction, défragmentation, quota d'espace et alarmes, supervision.
tags: [etcd, raft, kubernetes, clé-valeur, consensus, etcdctl]
icon: info
---

**etcd** stocke de petites données critiques avec une **cohérence forte** : configuration, élection de leader, verrous, et surtout l'**état complet de [[04-kubernetes/01-presentation-architecture|Kubernetes]]**. Il fonctionne en cluster **impair** (3 ou 5 membres) : il faut une majorité (quorum) pour écrire.

| Membres | Pannes tolérées |
| --- | --- |
| 1 | 0 (test uniquement) |
| **3** | 1 |
| 5 | 2 |

| Port | Usage |
| --- | --- |
| **2379** | Clients |
| 2380 | Communication entre membres |

## Installation

```bash
ETCD_VER=v3.5.17     # version courante : https://github.com/etcd-io/etcd/releases
curl -L "https://github.com/etcd-io/etcd/releases/download/${ETCD_VER}/etcd-${ETCD_VER}-linux-amd64.tar.gz" | tar xz
sudo cp etcd-${ETCD_VER}-linux-amd64/etcd* /usr/local/bin/
etcd --version ; etcdctl version
```

Paquets : `sudo apt install etcd-server etcd-client` (Debian/Ubuntu), `etcd` (Fedora). Windows et macOS : archives `windows-amd64.zip` et `darwin-arm64.zip`, `brew install etcd`. Docker : `gcr.io/etcd-development/etcd`.

## Cluster de trois membres (TLS)

```bash
# /etc/systemd/system/etcd.service — membre etcd1 (adapter nom et adresses sur etcd2, etcd3)
ExecStart=/usr/local/bin/etcd --name etcd1 --data-dir /var/lib/etcd \
  --listen-peer-urls https://10.0.20.161:2380 --initial-advertise-peer-urls https://10.0.20.161:2380 \
  --listen-client-urls https://10.0.20.161:2379,https://127.0.0.1:2379 --advertise-client-urls https://10.0.20.161:2379 \
  --initial-cluster etcd1=https://10.0.20.161:2380,etcd2=https://10.0.20.162:2380,etcd3=https://10.0.20.163:2380 \
  --initial-cluster-state new --initial-cluster-token etcd-corp \
  --cert-file /etc/etcd/pki/etcd1.crt --key-file /etc/etcd/pki/etcd1.key --trusted-ca-file /etc/etcd/pki/ca.crt --client-cert-auth \
  --peer-cert-file /etc/etcd/pki/etcd1.crt --peer-key-file /etc/etcd/pki/etcd1.key --peer-trusted-ca-file /etc/etcd/pki/ca.crt --peer-client-cert-auth \
  --quota-backend-bytes 8589934592 --auto-compaction-mode periodic --auto-compaction-retention 1h
```

```bash
export ETCDCTL_API=3 ETCDCTL_ENDPOINTS=https://10.0.20.161:2379,https://10.0.20.162:2379,https://10.0.20.163:2379 \
  ETCDCTL_CACERT=/etc/etcd/pki/ca.crt ETCDCTL_CERT=/etc/etcd/pki/admin.crt ETCDCTL_KEY=/etc/etcd/pki/admin.key
etcdctl member list -w table ; etcdctl endpoint health ; etcdctl endpoint status -w table
etcdctl put /config/proxy "http://proxy.corp.exemple.fr:3128" ; etcdctl get /config --prefix ; etcdctl watch /config --prefix
```

## Sauvegarde et maintenance

```bash
etcdctl snapshot save /sauv/etcd-$(date +%F).db --endpoints=https://10.0.20.161:2379
etcdutl snapshot status /sauv/etcd-2026-11-02.db -w table
etcdutl snapshot restore /sauv/etcd-2026-11-02.db --data-dir /var/lib/etcd-restaure --name etcd1 \
  --initial-cluster etcd1=https://10.0.20.161:2380,etcd2=https://10.0.20.162:2380,etcd3=https://10.0.20.163:2380 \
  --initial-advertise-peer-urls https://10.0.20.161:2380
etcdctl defrag --endpoints=https://10.0.20.161:2379        # un membre à la fois
etcdctl alarm list ; etcdctl alarm disarm                  # après un dépassement du quota (NOSPACE)
```

> [!TIP]
> etcd est très sensible à la latence disque : placez `--data-dir` sur SSD, surveillez `etcd_disk_wal_fsync_duration_seconds` (métriques `/metrics`) et sauvegardez au moins quotidiennement.

Suite : [[02-consul|Consul]] · [[90-aide-memoire|aide-mémoire]].
