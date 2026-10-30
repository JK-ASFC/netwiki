---
title: HAProxy — aide-mémoire des commandes
description: Commandes HAProxy avec exemples — vérification (haproxy -c), rechargement sans coupure, socket d'exécution (show info, show stat, show servers state, disable/enable server, set weight, set server state maint/drain, show table, clear table, show errors, add/del server), page de statistiques, configuration type (frontend TLS, ACL, backends, contrôles de santé, collage de session, limitation par stick-table), journaux et tests.
tags: [aide-mémoire, haproxy, répartition de charge, socat, runtime api, tls]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|HAProxy]].

## Service et vérification

```bash
sudo haproxy -c -f /etc/haproxy/haproxy.cfg          # tester
sudo systemctl reload haproxy                        # rechargement sans perte de connexions
haproxy -vv | head -5
sudo journalctl -u haproxy -f
```

## API d'exécution (socket)

```bash
# global : stats socket /run/haproxy/admin.sock mode 660 level admin
S=/run/haproxy/admin.sock
echo "show info" | sudo socat stdio $S | grep -E "Version|CurrConns|Uptime"
echo "show stat" | sudo socat stdio $S | cut -d, -f1,2,18,19 | column -s, -t      # pxname, svname, status, weight
echo "show servers state" | sudo socat stdio $S
echo "disable server app/web1" | sudo socat stdio $S
echo "enable server app/web1" | sudo socat stdio $S
echo "set server app/web1 state drain" | sudo socat stdio $S          # plus de nouvelles sessions
echo "set server app/web1 state maint" | sudo socat stdio $S
echo "set server app/web1 state ready" | sudo socat stdio $S
echo "set weight app/web1 50%" | sudo socat stdio $S
echo "show table" | sudo socat stdio $S
echo "show table limite-ip" | sudo socat stdio $S
echo "clear table limite-ip key 203.0.113.50" | sudo socat stdio $S
echo "show errors" | sudo socat stdio $S
echo "show sess" | sudo socat stdio $S | head
echo "add server app/web3 10.0.30.23:8080 check" | sudo socat stdio $S      # serveur dynamique (2.4+)
echo "enable server app/web3" | sudo socat stdio $S
sudo socat readline unix-connect:$S                                         # mode interactif (prompt)
```

## Configuration type

```haproxy
global
    log /dev/log local0
    stats socket /run/haproxy/admin.sock mode 660 level admin
    ssl-default-bind-options ssl-min-ver TLSv1.2
defaults
    mode http
    log global
    option httplog
    timeout connect 5s
    timeout client 60s
    timeout server 60s
frontend web
    bind :80
    bind :443 ssl crt /etc/haproxy/certs/ alpn h2,http/1.1
    http-request redirect scheme https unless { ssl_fc }
    stick-table type ip size 100k expire 10m store http_req_rate(10s)
    http-request track-sc0 src
    http-request deny deny_status 429 if { sc_http_req_rate(0) gt 100 }
    acl est_api path_beg /api
    use_backend api if est_api
    default_backend app
backend app
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200
    cookie SRV insert indirect nocache
    server web1 10.0.30.21:8080 check cookie web1
    server web2 10.0.30.22:8080 check cookie web2
backend api
    balance leastconn
    server api1 10.0.30.31:9000 check inter 2s fall 3 rise 2
listen stats
    bind 10.0.99.5:8404
    stats enable
    stats uri /
    stats refresh 10s
    stats auth admin:MotDePasseStats
```

## Tests

```bash
curl -I https://app.exemple.fr
curl -s -o /dev/null -w "%{http_code} %{time_total}\n" https://app.exemple.fr/api/health
for i in $(seq 10); do curl -s https://app.exemple.fr/qui; done        # vérifier la répartition
```
