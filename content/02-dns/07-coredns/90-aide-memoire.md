---
title: CoreDNS — aide-mémoire des commandes
description: Commandes CoreDNS avec exemples — lancement (binaire, conteneur), liste des greffons compilés, validation, tests dig, métriques Prometheus, santé, Kubernetes (ConfigMap, redémarrage, journaux, test depuis un pod, NodeLocal DNSCache).
tags: [aide-mémoire, coredns, dns, kubernetes]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-configuration|CoreDNS]].

```bash
coredns -version ; coredns -plugins
coredns -conf /etc/coredns/Corefile -dns.port 53
docker logs -f coredns
dig @127.0.0.1 srv-ad-01.corp.exemple.fr +short ; dig @127.0.0.1 www.exemple.org AAAA
curl -s http://127.0.0.1:9153/metrics | grep coredns_dns_requests_total | head
curl -s http://127.0.0.1:8080/health ; curl -s http://127.0.0.1:8181/ready
kubectl -n kube-system get pods -l k8s-app=kube-dns
kubectl -n kube-system logs -l k8s-app=kube-dns --tail=50
kubectl -n kube-system get configmap coredns -o jsonpath='{.data.Corefile}'
kubectl -n kube-system rollout restart deployment coredns
kubectl run -it --rm dnstest --image=busybox:1.36 --restart=Never -- nslookup srv-ad-01.corp.exemple.fr
```
