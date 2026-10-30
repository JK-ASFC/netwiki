---
title: Statistiques, journaux et dépannage
description: Page de statistiques et métriques Prometheus intégrées, configuration des journaux (rsyslog, format HTTP et TCP, champs de temps et indicateurs de terminaison), analyse avec halog, supervision, et résolution des erreurs fréquentes (503, 504, connexions refusées, sondes en échec).
tags: [haproxy, statistiques, prometheus, logs, halog, dépannage, termination state]
icon: bug
---

## Page de statistiques et Prometheus

```haproxy
frontend stats
    bind :8404
    mode http
    http-request use-service prometheus-exporter if { path /metrics }
    stats enable
    stats uri /stats
    stats refresh 10s
    stats show-legends
    stats show-node
    stats auth admin:MotDePasseLong
    stats admin if { src 10.0.10.0/24 }          # boutons d'action (drain, maint) depuis le réseau d'administration
    acl reseau_admin src 10.0.10.0/24 10.0.30.0/24
    http-request deny unless reseau_admin
    http-request return status 200 content-type text/plain string "OK" if { path /health }
```

- `http://lb:8404/stats` : tableau de bord (sessions, débits, erreurs, état des sondes, temps de réponse par serveur).
- `http://lb:8404/metrics` : métriques Prometheus natives (`haproxy_frontend_http_requests_total`, `haproxy_backend_up`, `haproxy_server_response_time_average_seconds`…).
- Supervision Centreon : `apps::haproxy::web::plugin` ou SNMP ; Zabbix : modèle *HAProxy by HTTP*.

## Journalisation

HAProxy envoie ses journaux à **syslog** (il n'écrit jamais lui-même dans un fichier).

```haproxy
global
    log /dev/log local0 info
    # ou vers un collecteur distant :
    # log 10.0.60.21:514 local0 info
    # log ring@tampon local0 (ring buffer, TCP, sans perte)
```

```ini /etc/rsyslog.d/49-haproxy.conf
$AddUnixListenSocket /var/lib/haproxy/dev/log      # chroot de HAProxy (Debian)
local0.* /var/log/haproxy.log
& stop
```

### Ligne de journal HTTP (`option httplog`)

```text
Jan 15 10:42:13 lb01 haproxy[1234]: 203.0.113.50:51824 [15/Jan/2026:10:42:13.012] fe_https~ be_web/web02 0/0/1/34/35 200 5123 - - ---- 812/790/14/7/0 0/0 {www.exemple.fr} "GET /accueil HTTP/2.0"
```

| Champ | Signification |
| --- | --- |
| `fe_https~` | Frontend (`~` = TLS) |
| `be_web/web02` | Backend / serveur choisi |
| `0/0/1/34/35` | **TR/Tw/Tc/Tr/Ta** : réception requête / attente en file / connexion serveur / réponse serveur / total (ms) |
| `200 5123` | Statut, octets |
| `----` | **Indicateurs de terminaison** (4 caractères) |
| `812/790/14/7/0` | Connexions : processus / frontend / backend / serveur / tentatives |
| `0/0` | Position dans la file serveur / backend |

### Indicateurs de terminaison (les deux premiers caractères)

| Code | Signification |
| --- | --- |
| `--` | Session normale |
| `CD` | Le **client** a interrompu pendant le transfert de données |
| `cD` | Délai client dépassé pendant les données (`timeout client`) |
| `CH` / `CR` | Client parti pendant les en-têtes / requête incomplète |
| `SH` | Le **serveur** a fermé ou refusé pendant les en-têtes (crash, refus) |
| `sH` | Délai serveur dépassé en attendant les en-têtes de réponse (`timeout server`) → **504** |
| `SC` | Connexion au serveur refusée → **503** |
| `sC` | Délai de connexion au serveur dépassé (`timeout connect`) |
| `sQ` / `SQ` | Délai dépassé / abandon en **file d'attente** (serveurs saturés) |
| `PR` | Requête bloquée par une règle du proxy (`http-request deny`) |
| `PH` | Réponse bloquée par le proxy (en-tête invalide) |
| `LR` | Réponse produite localement (redirection, `return`, stats) |
| `IR` / `IH` | Erreur interne |

### Format JSON (SIEM)

```haproxy
defaults
    log-format '{"time":"%t","client":"%ci","frontend":"%f","backend":"%b","server":"%s","tr":%TR,"tw":%Tw,"tc":%Tc,"trs":%Tr,"ta":%Ta,"status":%ST,"bytes":%B,"term":"%ts","host":"%[capture.req.hdr(0)]","request":"%HM %HU"}'
```

## Analyser avec halog

```bash
sudo apt install haproxy-log-analyzer 2>/dev/null || true   # halog est souvent fourni avec haproxy (contrib)
halog -st < /var/log/haproxy.log              # répartition des codes de statut
halog -srv -H < /var/log/haproxy.log          # statistiques par serveur
halog -ua -H < /var/log/haproxy.log | head    # URL les plus lentes
halog -tc < /var/log/haproxy.log              # indicateurs de terminaison
halog -e -H < /var/log/haproxy.log | head     # erreurs uniquement
```

## Erreurs fréquentes

| Symptôme | Cause probable | Vérification |
| --- | --- | --- |
| **503** `SC--` / `<NOSRV>` | Aucun serveur UP dans le backend, ou mauvais `use_backend` | Page de stats, `show servers state` |
| **504** `sH--` | Serveur trop lent | `timeout server`, temps `Tr` dans les journaux |
| **502** `SH--` / `PH--` | Réponse invalide ou serveur qui ferme | `show errors` (capture de la réponse fautive) |
| Sondes en échec (`L7STS`, `L4CON`, `L4TOUT`) | Mauvaise URL/Host de sonde, pare-feu, SELinux (`haproxy_connect_any`) | `curl` manuel depuis le nœud avec les mêmes en-têtes |
| `Proxy … started` absent / service KO | Erreur de configuration | `haproxy -c -f /etc/haproxy/haproxy.cfg` |
| `cannot bind socket` | Port occupé, IP non portée (VIP) | `ss -tlnp`, `net.ipv4.ip_nonlocal_bind=1` |
| Sessions persistantes perdues après bascule | Stick-tables non synchronisées | Section `peers` |
| `sQ--` nombreux | Saturation : `maxconn` serveur atteint | Ajouter des serveurs, augmenter `maxconn` si l'application le supporte |
| Clients vus avec l'IP d'HAProxy | `X-Forwarded-For` non exploité par l'application, ou mode tcp | `option forwardfor`, `send-proxy-v2` |
| Certificat inattendu | SNI / ordre des certificats | Voir [[05-tls]] |

## Commandes utiles

| Commande | Usage |
| --- | --- |
| `haproxy -c -f haproxy.cfg` | Valider la configuration |
| `haproxy -vv` | Version et options de compilation |
| `systemctl reload haproxy` | Recharger sans coupure |
| `echo "show stat" \| socat stdio /run/haproxy/admin.sock` | État des frontends/backends/serveurs |
| `echo "show errors" \| socat stdio …` | Requêtes/réponses invalides capturées |
| `tcpdump -ni any port 8080 -A` | Observer le dialogue avec un serveur |
| `curl -v --resolve www.exemple.fr:443:10.0.10.100 https://www.exemple.fr/` | Tester la VIP avec le bon SNI |
