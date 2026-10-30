---
title: Reverse proxy et répartition de charge
description: Publier des applications internes avec mod_proxy (ProxyPass, en-têtes, WebSocket, délais), récupérer l'IP réelle avec mod_remoteip, répartir la charge avec mod_proxy_balancer (méthodes, affinité, sondes mod_proxy_hcheck) et piloter les membres avec balancer-manager.
tags: [apache, reverse proxy, mod_proxy, load balancing, balancer, websocket]
icon: split
---

## Modules

```bash
sudo a2enmod proxy proxy_http proxy_wstunnel headers remoteip
sudo a2enmod proxy_balancer lbmethod_byrequests lbmethod_bybusyness lbmethod_bytraffic slotmem_shm proxy_hcheck
```

Sous RHEL ils sont chargés par `/etc/httpd/conf.modules.d/00-proxy.conf`. N'oubliez pas `setsebool -P httpd_can_network_connect on`.

## Reverse proxy simple

```apache
<VirtualHost *:443>
    ServerName app.exemple.fr
    SSLEngine on
    SSLCertificateFile    /etc/ssl/exemple/app.fullchain.pem
    SSLCertificateKeyFile /etc/ssl/exemple/app.key

    ProxyPreserveHost On
    ProxyRequests Off                      # JAMAIS « On » : cela ferait un proxy ouvert
    RequestHeader set X-Forwarded-Proto "https"
    RequestHeader set X-Forwarded-Port "443"

    ProxyPass        /api/  http://10.0.20.31:8080/api/ connectiontimeout=5 timeout=60 retry=10
    ProxyPassReverse /api/  http://10.0.20.31:8080/api/

    ProxyPass        /      http://127.0.0.1:3000/
    ProxyPassReverse /      http://127.0.0.1:3000/
    ProxyPassReverseCookieDomain 127.0.0.1 app.exemple.fr
</VirtualHost>
```

| Directive | Rôle |
| --- | --- |
| `ProxyPass` | Associe un chemin à une URL de backend (l'ordre compte : du plus spécifique au plus général) |
| `ProxyPassReverse` | Réécrit les en-têtes `Location`, `Content-Location`, `URI` des redirections du backend |
| `ProxyPreserveHost On` | Transmet l'en-tête `Host` d'origine (nécessaire à la plupart des applications) |
| `ProxyPass /chemin !` | Exclure un chemin (servi localement) — à placer **avant** la règle générale |
| `X-Forwarded-For` / `X-Forwarded-Host` | Ajoutés automatiquement par `mod_proxy_http` |
| Paramètres `timeout`, `retry`, `keepalive=On`, `max`, `ttl` | Comportement de la connexion au backend |

### Backend HTTPS

```apache
SSLProxyEngine On
SSLProxyVerify require
SSLProxyCACertificateFile /etc/ssl/exemple/corp-ca.pem
SSLProxyCheckPeerName on
ProxyPass / https://app-interne.corp.exemple.fr:8443/
ProxyPassReverse / https://app-interne.corp.exemple.fr:8443/
```

### WebSocket

```apache
# 2.4.47+ : mise à niveau gérée directement par mod_proxy_http
ProxyPass /ws/ http://127.0.0.1:3000/ws/ upgrade=websocket
# Versions antérieures : mod_proxy_wstunnel
# RewriteEngine On
# RewriteCond %{HTTP:Upgrade} websocket [NC]
# RewriteRule ^/ws/(.*) ws://127.0.0.1:3000/ws/$1 [P,L]
```

## Apache derrière un répartiteur : IP réelle

```apache /etc/apache2/conf-available/remoteip.conf
RemoteIPHeader X-Forwarded-For
RemoteIPInternalProxy 10.0.10.5 10.0.10.6        # IP des répartiteurs (HAProxy, F5, WAF)
# Ou avec le protocole PROXY (HAProxy « send-proxy-v2 ») :
# RemoteIPProxyProtocol On
```

Remplacez ensuite `%h` par `%a` dans `LogFormat` pour journaliser l'IP du client.

## Répartition de charge

```apache
<Proxy "balancer://ferme-app">
    BalancerMember http://10.0.20.31:8080 route=app1 loadfactor=1 hcmethod=GET hcuri=/health hcinterval=10 hcfails=3 hcpasses=2
    BalancerMember http://10.0.20.32:8080 route=app2 loadfactor=1 hcmethod=GET hcuri=/health hcinterval=10 hcfails=3 hcpasses=2
    BalancerMember http://10.0.20.33:8080 status=+H                      # secours (hot standby)
    ProxySet lbmethod=bybusyness
    ProxySet stickysession=ROUTEID
    ProxySet failonstatus=502,503,504
</Proxy>

Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/; HttpOnly; Secure" env=BALANCER_ROUTE_CHANGED

ProxyPass        /  balancer://ferme-app/
ProxyPassReverse /  balancer://ferme-app/
```

| `lbmethod` | Algorithme |
| --- | --- |
| `byrequests` | Tourniquet pondéré par nombre de requêtes |
| `bytraffic` | Pondéré par volume d'octets |
| `bybusyness` | Membre avec le moins de requêtes en cours |
| `heartbeat` | Selon la charge annoncée par les backends (mod_heartmonitor) |

| Statut de membre | Signification |
| --- | --- |
| `+H` | Secours : utilisé seulement si tous les autres sont en erreur |
| `+D` | Désactivé |
| `+N` | Drainage : plus de nouvelles sessions, sessions affines conservées |
| `+E` | En erreur (positionné automatiquement) |

### Affinité de session

- Cookie applicatif existant (`JSESSIONID`, `PHPSESSID`) : `stickysession=JSESSIONID|jsessionid` avec un `route` correspondant au suffixe du serveur (Tomcat `jvmRoute`).
- Cookie ajouté par Apache (`ROUTEID`) comme ci-dessus.

> [!TIP]
> Préférez des applications **sans état** (sessions en base ou Redis) : la répartition devient libre et la perte d'un membre est transparente pour les utilisateurs.

## Console balancer-manager

```apache
<Location /balancer-manager>
    SetHandler balancer-manager
    Require ip 10.0.10.0/24
</Location>
ProxyPass /balancer-manager !
```

Elle permet de modifier à chaud le poids, l'état (drainage, désactivation) et la route des membres — pratique pour retirer un serveur avant maintenance.

> [!WARNING]
> Protégez strictement `/balancer-manager` (IP d'administration + authentification) : il permet de rediriger le trafic de production.

## Proxy pour plusieurs applications par chemin

```apache
ProxyPass        /grafana/   http://10.0.30.10:3000/
ProxyPassReverse /grafana/   http://10.0.30.10:3000/
ProxyPass        /kibana/    http://10.0.30.11:5601/
ProxyPassReverse /kibana/    http://10.0.30.11:5601/
```

L'application doit savoir qu'elle est servie sous un sous-chemin (Grafana : `root_url` + `serve_from_sub_path`), sinon ses liens absolus cassent. Sinon, utilisez un **sous-domaine par application**.

## Cache de proxy

```apache
CacheQuickHandler off
CacheEnable disk /api/catalogue
CacheRoot /var/cache/apache2/mod_cache_disk
CacheDefaultExpire 300
CacheIgnoreHeaders Set-Cookie
Header set X-Cache "%{CACHE_STATUS}e"
```

Pour un cache HTTP avancé devant Apache, voir [[03-varnish/01-presentation-installation|Varnish]].

## Dépannage

| Message (error.log) | Cause |
| --- | --- |
| `AH01114: HTTP: failed to make connection to backend` | Backend arrêté, pare-feu, SELinux (`httpd_can_network_connect`) |
| `AH01102: error reading status line from remote server` | Délai dépassé (`timeout`), backend qui ferme la connexion |
| `AH00898: Error reading from remote server` / 502 | Réponse invalide du backend, keep-alive incompatible (`disablereuse=On`) |
| `AH01144: No protocol handler was valid for the URL` | Module `proxy_http` (ou `proxy_wstunnel`, `proxy_fcgi`) non chargé |
| Redirections vers l'IP interne | `ProxyPassReverse` manquant ou `ProxyPreserveHost` |
| Boucle de redirection HTTPS | Le backend ne voit pas `X-Forwarded-Proto: https` |
