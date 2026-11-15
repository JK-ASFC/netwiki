---
title: CoreDNS — aide-mémoire des commandes
description: Référence complète des commandes CoreDNS avec exemples — installation (binaire, service systemd, conteneur), Corefile type (redirection, cache, fichiers hosts, zone fichier, journaux, erreurs, métriques, santé, rechargement, boucle), lancement et greffons, tests dig, métriques Prometheus utiles, et dans Kubernetes : ConfigMap, redémarrage, journaux, service kube-dns et points de terminaison, pod de diagnostic DNS, resolv.conf des pods, redirection conditionnelle vers l'Active Directory.
tags: [aide-mémoire, coredns, kubernetes, kube-dns, corefile, dns, prometheus]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-configuration|CoreDNS]]. Exemples : serveur `10.0.10.70`, domaine AD `corp.exemple.fr` servi par `10.0.10.11` et `10.0.10.12`.

## Installation hors Kubernetes

```bash
# Binaire (remplacer 1.11.3 par la version voulue)
curl -LO https://github.com/coredns/coredns/releases/download/v1.11.3/coredns_1.11.3_linux_amd64.tgz
sudo tar -xzf coredns_1.11.3_linux_amd64.tgz -C /usr/local/bin
coredns -version
coredns -plugins                                      # greffons compilés
sudo useradd --system --no-create-home --shell /usr/sbin/nologin coredns
# Conteneur
docker run -d --name coredns -p 53:53/udp -p 53:53/tcp -p 9153:9153 -v /etc/coredns:/etc/coredns coredns/coredns:1.11.3 -conf /etc/coredns/Corefile
```

```text /etc/coredns/Corefile
corp.exemple.fr:53 {
    forward . 10.0.10.11 10.0.10.12
    cache 60
    errors
}
labo.exemple.fr:53 {
    file /etc/coredns/db.labo.exemple.fr
    errors
}
.:53 {
    hosts /etc/coredns/hosts {
        fallthrough
    }
    forward . tls://9.9.9.9 tls://149.112.112.112 {
        tls_servername dns.quad9.net
        health_check 5s
    }
    cache 300
    log
    errors
    prometheus :9153
    health :8080
    ready :8181
    reload 10s
    loop
}
```

```ini /etc/systemd/system/coredns.service
[Unit]
Description=CoreDNS
After=network-online.target
Wants=network-online.target

[Service]
User=coredns
AmbientCapabilities=CAP_NET_BIND_SERVICE
ExecStart=/usr/local/bin/coredns -conf /etc/coredns/Corefile
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now coredns
sudo journalctl -u coredns -f
coredns -conf /etc/coredns/Corefile -dns.port 1053    # essai sur un autre port
```

## Tests et métriques

```bash
dig @10.0.10.70 srv-ad-01.corp.exemple.fr +short
dig @10.0.10.70 www.exemple.org AAAA
dig @10.0.10.70 -p 1053 www.exemple.org
curl -s http://127.0.0.1:8080/health
curl -s http://127.0.0.1:8181/ready
curl -s http://127.0.0.1:9153/metrics | grep -E "^coredns_dns_requests_total|^coredns_dns_responses_total|^coredns_cache_(hits|misses)_total|^coredns_forward_healthcheck_failures_total" | head -20
```

| Métrique | Lecture |
| --- | --- |
| `coredns_dns_responses_total{rcode="SERVFAIL"}` | Échecs (amont injoignable, boucle) |
| `coredns_cache_hits_total` / `coredns_cache_misses_total` | Efficacité du cache |
| `coredns_forward_healthcheck_failures_total` | Serveurs amont en échec |
| `coredns_dns_request_duration_seconds` | Latence (histogramme) |

## Kubernetes

```bash
kubectl -n kube-system get pods -l k8s-app=kube-dns -o wide
kubectl -n kube-system get svc kube-dns
kubectl -n kube-system get endpointslices -l kubernetes.io/service-name=kube-dns
kubectl -n kube-system logs -l k8s-app=kube-dns --tail=50
kubectl -n kube-system get configmap coredns -o jsonpath='{.data.Corefile}'
kubectl -n kube-system edit configmap coredns              # le greffon reload applique la modification en moins de 2 min
kubectl -n kube-system rollout restart deployment coredns
kubectl -n kube-system rollout status deployment coredns

# Pod de diagnostic DNS
kubectl run -it --rm dnstest --image=busybox:1.36 --restart=Never -- nslookup kubernetes.default.svc.cluster.local
kubectl run -it --rm dnsutils --image=registry.k8s.io/e2e-test-images/jessie-dnsutils:1.3 --restart=Never -- dig srv-ad-01.corp.exemple.fr
kubectl exec -it deploy/app-web -n production -- cat /etc/resolv.conf     # serveur, domaines de recherche, ndots
```

Redirection conditionnelle vers l'Active Directory : ajouter dans la ConfigMap un bloc avant `.:53` :

```text Corefile (ConfigMap coredns, extrait)
corp.exemple.fr:53 {
    errors
    cache 30
    forward . 10.0.10.11 10.0.10.12
}
```
