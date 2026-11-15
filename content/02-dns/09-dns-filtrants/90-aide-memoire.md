---
title: DNS filtrants — aide-mémoire des commandes
description: Référence complète des commandes AdGuard Home, Pi-hole 6 et Blocky avec exemples — installation (scripts officiels, conteneurs), AdGuard Home (service, vérification et mise à jour, API : état, statistiques, journal des requêtes, protection temporaire, listes de filtrage, règles personnalisées, réécritures DNS, clients, cache), Pi-hole (commandes pihole : état, pause, listes gravity, recherche, autorisation et refus, mise à jour, mot de passe, réparation ; pihole-FTL --config ; API v6 avec session ; sauvegarde teleporter), Blocky (validation, CLI, API : blocage, listes, cache, requête), métriques et tests dig/kdig.
tags: [aide-mémoire, adguard home, pi-hole, blocky, dns filtrant, blocage publicitaire, api]
icon: terminal
---

Références : [[01-adguard-home|AdGuard Home]], [[02-pi-hole|Pi-hole]], [[03-blocky|Blocky]], [[04-interface-graphique|interfaces graphiques]]. Exemples : serveur filtrant `dns-filtre.corp.exemple.fr`.

## AdGuard Home

```bash
# Installation (script officiel, dans /opt/AdGuardHome) ou conteneur
curl -s -S -L https://raw.githubusercontent.com/AdguardTeam/AdGuardHome/master/scripts/install.sh | sh -s -- -v
docker run -d --name adguardhome --restart unless-stopped -v /srv/adguard/work:/opt/adguardhome/work -v /srv/adguard/conf:/opt/adguardhome/conf -p 53:53/tcp -p 53:53/udp -p 3000:3000/tcp -p 80:80/tcp adguard/adguardhome

# Service
sudo /opt/AdGuardHome/AdGuardHome -s status
sudo /opt/AdGuardHome/AdGuardHome -s restart
sudo /opt/AdGuardHome/AdGuardHome --check-config -c /opt/AdGuardHome/AdGuardHome.yaml
sudo /opt/AdGuardHome/AdGuardHome --update
```

```bash
A=http://dns-filtre.corp.exemple.fr/control
U="admin:MotDePasse"
curl -s -u $U $A/status | jq '{running, protection_enabled, version}'
curl -s -u $U $A/stats | jq '.num_dns_queries, .num_blocked_filtering, .avg_processing_time'
curl -s -u $U "$A/querylog?limit=20" | jq '.data[] | {time, client, question: .question.name, reason}'
curl -s -u $U -X POST $A/protection -d '{"enabled":false,"duration":600000}'        # pause de 10 min
curl -s -u $U -X POST $A/protection -d '{"enabled":true}'
curl -s -u $U $A/filtering/status | jq '.filters[] | {name, enabled, rules_count}'
curl -s -u $U -X POST $A/filtering/add_url -d '{"name":"Liste malveillants","url":"https://adguardteam.github.io/HostlistsRegistry/assets/filter_11.txt","whitelist":false}'
curl -s -u $U -X POST $A/filtering/refresh -d '{"whitelist":false}'
curl -s -u $U -X POST $A/filtering/set_rules -d '{"rules":["||domaine-malveillant.example^","@@||site-metier.example^"]}'
curl -s -u $U -X POST $A/rewrite/add -d '{"domain":"nas.corp.exemple.fr","answer":"10.0.40.5"}'
curl -s -u $U $A/rewrite/list | jq .
curl -s -u $U $A/clients | jq '.clients[] | {name, ids}'
curl -s -u $U -X POST $A/cache_clear
```

## Pi-hole 6

```bash
curl -sSL https://install.pi-hole.net | bash                     # installation (lire le script avant)
docker run -d --name pihole --restart unless-stopped -p 53:53/tcp -p 53:53/udp -p 80:80/tcp -e TZ=Europe/Paris -e FTLCONF_webserver_api_password='MotDePasse' -v /srv/pihole:/etc/pihole pihole/pihole:latest

pihole status
pihole -v
pihole disable 5m ; pihole enable
pihole -g                                   # mettre à jour les listes (gravity)
pihole -q doubleclick.net                   # dans quelle liste se trouve ce domaine ?
pihole allow site-metier.example
pihole deny domaine-malveillant.example
pihole -up                                  # mettre à jour Pi-hole
pihole setpassword
pihole -r                                   # réparer ou reconfigurer
pihole tail                                 # journal des requêtes en direct
pihole-FTL --config dns.upstreams                                      # lire un réglage
sudo pihole-FTL --config dns.upstreams '["9.9.9.9","149.112.112.112"]' # modifier
sudo pihole-FTL --teleporter                                           # sauvegarde complète (archive zip)
docker exec -it pihole pihole status
```

```bash
# API v6 : ouvrir une session, puis utiliser l'identifiant de session (sid)
P=http://dns-filtre.corp.exemple.fr/api
SID=$(curl -s -X POST $P/auth -d '{"password":"MotDePasse"}' | jq -r .session.sid)
curl -s -H "X-FTL-SID: $SID" $P/stats/summary | jq '.queries | {total, blocked, percent_blocked}'
curl -s -H "X-FTL-SID: $SID" "$P/queries?length=20" | jq '.queries[] | {domain, client: .client.ip, status}'
curl -s -X POST -H "X-FTL-SID: $SID" $P/dns/blocking -d '{"blocking":false,"timer":300}'     # pause 5 min
curl -s -X DELETE -H "X-FTL-SID: $SID" $P/auth                                               # fermer la session
```

## Blocky

```bash
docker run -d --name blocky --restart unless-stopped -p 53:53/udp -p 53:53/tcp -p 4000:4000 -v /srv/blocky/config.yml:/app/config.yml:ro spx01/blocky
blocky validate --config /etc/blocky/config.yml
# CLI (interroge l'API sur localhost:4000)
blocky blocking status
blocky blocking disable --duration 10m
blocky blocking enable
blocky refresh                              # recharger les listes
blocky cache flush
blocky query www.exemple.org --type A
# API HTTP équivalente
curl -s http://localhost:4000/api/blocking/status
curl -s "http://localhost:4000/api/blocking/disable?duration=10m&groups=publicite"
curl -s http://localhost:4000/api/blocking/enable
curl -s -X POST http://localhost:4000/api/lists/refresh
curl -s -X POST http://localhost:4000/api/cache/flush
curl -s -X POST -H "Content-Type: application/json" http://localhost:4000/api/query -d '{"query":"doubleclick.net","type":"A"}' | jq .
curl -s http://localhost:4000/metrics | grep -E "^blocky_(query_total|blocking_enabled|cache_hit_count)" | head
```

## Tests

```bash
dig @dns-filtre.corp.exemple.fr doubleclick.net +short          # 0.0.0.0 ou NXDOMAIN si bloqué
dig @dns-filtre.corp.exemple.fr srv-ad-01.corp.exemple.fr +short
dig @dns-filtre.corp.exemple.fr www.exemple.org +stats | grep "Query time"
kdig @dns-filtre.corp.exemple.fr +tls www.exemple.org            # DNS over TLS si activé
```
