---
title: Tinyproxy et Privoxy — aide-mémoire des commandes
description: Commandes Tinyproxy et Privoxy avec exemples — services systemd, test avec curl -x, journaux, rechargement, vérification de la configuration, variables http_proxy/https_proxy/no_proxy, proxy APT/DNF/Git/Docker.
tags: [aide-mémoire, tinyproxy, privoxy, proxy]
icon: terminal
---

Explications : [[01-tinyproxy|Tinyproxy]] · [[02-privoxy|Privoxy]].

## Services et tests

```bash
sudo systemctl status tinyproxy privoxy
sudo systemctl reload tinyproxy ; sudo systemctl restart privoxy
sudo tail -f /var/log/tinyproxy/tinyproxy.log
sudo tail -f /var/log/privoxy/logfile
curl -x http://10.0.20.5:8888 -sI https://deb.debian.org | head -1
curl -x http://10.0.20.6:8118 -s http://p.p/show-status | head
ss -tlnp | grep -E '8888|8118'
```

## Utiliser un proxy depuis les clients

```bash
export http_proxy=http://10.0.20.5:8888 https_proxy=http://10.0.20.5:8888 no_proxy=localhost,127.0.0.1,.corp.exemple.fr
echo 'Acquire::http::Proxy "http://10.0.20.5:8888"; Acquire::https::Proxy "http://10.0.20.5:8888";' | sudo tee /etc/apt/apt.conf.d/90proxy
echo 'proxy=http://10.0.20.5:8888' | sudo tee -a /etc/dnf/dnf.conf
git config --global http.proxy http://10.0.20.5:8888
sudo mkdir -p /etc/systemd/system/docker.service.d && printf '[Service]\nEnvironment="HTTPS_PROXY=http://10.0.20.5:8888"\n' | sudo tee /etc/systemd/system/docker.service.d/proxy.conf
```

Windows (PowerShell) : `netsh winhttp set proxy 10.0.20.5:8888 "<local>;*.corp.exemple.fr"`.
