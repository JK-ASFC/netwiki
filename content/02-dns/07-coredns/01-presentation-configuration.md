---
title: Présentation, installation et configuration
description: CoreDNS (CNCF) — serveur DNS en Go configuré par Corefile et greffons (forward, cache, file, hosts, kubernetes, rewrite, log, errors, prometheus, health, reload, loop, acl), installation (binaire Linux/Windows/macOS, conteneur), DNS de Kubernetes (ConfigMap coredns, stub domains, NodeLocal DNSCache), transfert conditionnel vers Active Directory, zones locales, supervision et dépannage.
tags: [coredns, dns, kubernetes, corefile, greffons, forward, prometheus]
icon: info
---

**CoreDNS** (CNCF, Apache 2.0) est un serveur DNS dont chaque fonction est un **greffon** enchaîné dans un fichier **Corefile**. C'est le **DNS par défaut de [[04-kubernetes/01-presentation-architecture|Kubernetes]]**, mais il sert aussi de redirecteur ou de petit serveur de zones partout (binaires Linux, Windows, macOS).

## Installation

```bash
# Binaire (Releases GitHub) ou conteneur
docker run -d --name coredns -p 53:53/udp -p 53:53/tcp -v /etc/coredns:/etc/coredns coredns/coredns -conf /etc/coredns/Corefile
```

## Corefile

```text /etc/coredns/Corefile
# Zone de l'Active Directory : transfert conditionnel vers les contrôleurs de domaine
corp.exemple.fr {
    forward . 10.0.10.11 10.0.10.12
    cache 60
    log
    errors
}

# Zone locale servie depuis un fichier
labo.exemple.fr {
    file /etc/coredns/db.labo.exemple.fr
    errors
}

# Tout le reste : résolveurs amont en DNS sur TLS
. {
    hosts /etc/coredns/hosts.local {
        fallthrough
    }
    forward . tls://9.9.9.9 tls://149.112.112.112 {
        tls_servername dns.quad9.net
        health_check 5s
    }
    cache 300
    prometheus 0.0.0.0:9153
    health :8080
    ready :8181
    reload
    loop
    errors
}
```

## Dans Kubernetes

La configuration est la ConfigMap `coredns` de l'espace `kube-system` :

```bash
kubectl -n kube-system get configmap coredns -o yaml
kubectl -n kube-system edit configmap coredns          # ajouter un bloc pour corp.exemple.fr (forward vers les DC)
kubectl -n kube-system rollout restart deployment coredns
kubectl run -it --rm dnstest --image=busybox:1.36 --restart=Never -- nslookup kubernetes.default
```

Bloc par défaut : greffon `kubernetes cluster.local in-addr.arpa ip6.arpa` (noms des services `service.espace.svc.cluster.local`) puis `forward . /etc/resolv.conf`. Pour les gros clusters, **NodeLocal DNSCache** place un cache sur chaque nœud.

## Greffons utiles

| Greffon | Usage |
| --- | --- |
| `forward` | Redirection (UDP, TCP, DoT) avec contrôle de santé |
| `cache` | Cache positif et négatif |
| `file`, `auto` | Zones depuis des fichiers RFC 1035 |
| `hosts` | Fichier de type `/etc/hosts` |
| `rewrite` | Réécrire une question (alias, migration de domaine) |
| `acl` | Autoriser/refuser par réseau source |
| `prometheus`, `health`, `ready` | Supervision (`:9153/metrics`) |
| `log`, `errors` | Journalisation |

## Dépannage

| Symptôme | Cause et correction |
| --- | --- |
| Pods qui bouclent en `CrashLoopBackOff` avec « Loop detected » | `forward . /etc/resolv.conf` pointe vers 127.0.0.53 (systemd-resolved) : utiliser le vrai résolveur du nœud |
| Noms internes non résolus dans les pods | Ajouter un bloc de transfert conditionnel pour le domaine interne |
| Résolution lente | `ndots:5` des pods : utiliser des FQDN terminés par un point ou réduire `ndots` |

Commandes : [[90-aide-memoire|aide-mémoire]].
