---
title: Varnish — aide-mémoire des commandes
description: Commandes Varnish avec exemples — démarrage (varnishd, paramètres systemd), administration (varnishadm : vcl.load, vcl.use, vcl.list, ban, backend.list, param.show/set, status), observation (varnishlog avec requêtes VSL, varnishncsa, varnishstat, varnishtop, varnishhist), VCL type (backend, sonde, purge, bypass), tests du cache avec curl.
tags: [aide-mémoire, varnish, vcl, cache, varnishlog, varnishadm]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Varnish]].

## Service

```bash
sudo systemctl edit varnish          # surcharger ExecStart (port, VCL, taille du cache)
# ExecStart=/usr/sbin/varnishd -a :6081 -a localhost:8443,PROXY -f /etc/varnish/default.vcl -s malloc,2G -p feature=+http2
sudo systemctl restart varnish
varnishd -V
varnishd -C -f /etc/varnish/default.vcl > /dev/null && echo "VCL OK"     # compiler pour vérifier
```

## varnishadm

```bash
sudo varnishadm status
sudo varnishadm vcl.list
sudo varnishadm vcl.load v20261029 /etc/varnish/default.vcl
sudo varnishadm vcl.use v20261029                     # bascule à chaud
sudo varnishadm vcl.discard v20261028
sudo varnishadm backend.list
sudo varnishadm backend.set_health default.web1 sick  # retirer un serveur (auto pour le rétablir)
sudo varnishadm "ban req.http.host == www.exemple.fr && req.url ~ ^/actualites"
sudo varnishadm ban.list
sudo varnishadm param.show default_ttl
sudo varnishadm param.set default_ttl 300
sudo varnishadm storage.list
```

## Observation

```bash
varnishstat -1 | grep -E "MAIN.cache_hit |MAIN.cache_miss |MAIN.n_object |MAIN.client_req "
varnishstat -1 -f MAIN.cache_hit -f MAIN.cache_miss
varnishlog -g request -q 'ReqURL ~ "^/api"'
varnishlog -q 'RespStatus >= 500'
varnishlog -i ReqURL,RespStatus,VCL_call -q 'ReqHeader:Host eq "www.exemple.fr"'
varnishlog -g raw -i Backend_health                    # santé des serveurs
varnishncsa -F '%h %r %s %{Varnish:hitmiss}x %D'        # journal au format Apache
varnishtop -i ReqURL                                    # URL les plus demandées
varnishtop -i BereqURL                                  # URL envoyées aux serveurs (miss)
varnishhist                                             # histogramme des temps de réponse
```

## VCL type

```vcl
vcl 4.1;
import directors;

probe sante {
    .url = "/health";
    .interval = 5s;
    .timeout = 2s;
    .window = 5;
    .threshold = 3;
}
backend web1 { .host = "10.0.30.21"; .port = "8080"; .probe = sante; }
backend web2 { .host = "10.0.30.22"; .port = "8080"; .probe = sante; }

acl purgeurs { "127.0.0.1"; "10.0.99.0"/24; }

sub vcl_init {
    new grappe = directors.round_robin();
    grappe.add_backend(web1);
    grappe.add_backend(web2);
}

sub vcl_recv {
    set req.backend_hint = grappe.backend();
    if (req.method == "PURGE") {
        if (!client.ip ~ purgeurs) { return (synth(405, "Interdit")); }
        return (purge);
    }
    if (req.url ~ "^/(admin|panier|compte)") { return (pass); }
    if (req.http.Authorization) { return (pass); }
    unset req.http.Cookie;
}

sub vcl_backend_response {
    if (bereq.url ~ "\.(css|js|png|jpg|svg|woff2)$") { set beresp.ttl = 1d; }
    set beresp.grace = 6h;
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }
}
```

## Tests

```bash
curl -sI http://127.0.0.1:6081/ -H "Host: www.exemple.fr" | grep -iE "x-cache|age|x-varnish"
curl -X PURGE http://127.0.0.1:6081/actualites/ -H "Host: www.exemple.fr"
```
