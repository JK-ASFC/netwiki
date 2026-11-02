---
title: Technitium DNS Server — aide-mémoire des commandes
description: Commandes Technitium DNS Server avec exemples — installation et service, conteneur, API HTTP (connexion et jeton, zones, enregistrements, cache, blocage, statistiques, sauvegarde et restauration), tests dig et DoH, journaux.
tags: [aide-mémoire, technitium, dns, api]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|Technitium DNS Server]].

```bash
sudo systemctl status dns ; sudo systemctl restart dns          # service « dns » de l'installation Linux
docker logs -f technitium
API=http://dns01:5380/api
TOKEN=$(curl -s "$API/user/login?user=admin&pass=MotDePasse&includeInfo=false" | jq -r .token)
curl -s "$API/zones/list?token=$TOKEN" | jq '.response.zones[] | {name, type, dnssecStatus}'
curl -s "$API/zones/create?token=$TOKEN&zone=labo.corp.exemple.fr&type=Primary"
curl -s "$API/zones/records/get?token=$TOKEN&domain=corp.exemple.fr&zone=corp.exemple.fr&listZone=true" | jq '.response.records | length'
curl -s "$API/zones/records/delete?token=$TOKEN&domain=ancien.corp.exemple.fr&zone=corp.exemple.fr&type=A&ipAddress=10.0.20.99"
curl -s "$API/cache/flush?token=$TOKEN"
curl -s "$API/blocked/add?token=$TOKEN&domain=domaine-malveillant.example"
curl -s "$API/dashboard/stats/get?token=$TOKEN&type=LastHour" | jq .response.stats
dig @dns01 srv-ad-01.corp.exemple.fr +short
curl -s -H 'accept: application/dns-json' "https://dns01.corp.exemple.fr/dns-query?name=www.exemple.org&type=A" | jq .
```
