---
title: Technitium DNS Server — aide-mémoire des commandes
description: Référence complète des commandes Technitium DNS Server avec exemples — installation (script Linux, conteneur, Windows), service et ports, API HTTP (connexion et jeton permanent, zones : liste, création, activation, suppression, export ; enregistrements : lecture, ajout, remplacement, suppression ; cache ; blocage et listes autorisées, mise à jour des listes ; DHCP : étendues et baux ; paramètres ; statistiques ; sauvegarde et restauration), tests dig et DNS over HTTPS.
tags: [aide-mémoire, technitium, dns, api, dhcp, blocage, doh]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|Technitium DNS Server]] et [[03-interface-graphique|interface graphique]]. Exemples : serveur `dns01.corp.exemple.fr`, console sur le port 5380.

## Installation et service

```bash
curl -sSL https://download.technitium.com/dns/install.sh | sudo bash      # Linux (installe .NET et le service « dns »)
sudo systemctl status dns
sudo systemctl restart dns
docker run -d --name technitium --restart unless-stopped -p 5380:5380 -p 53:53/udp -p 53:53/tcp -p 853:853 -v technitium:/etc/dns technitium/dns-server:latest
docker logs -f technitium
# Windows : installeur « Technitium DNS Server Setup » (service Windows « DnsService »)
```

| Port | Usage |
| --- | --- |
| 5380 / 53443 | Console web HTTP / HTTPS (et API) |
| 53 | DNS |
| 853 | DNS over TLS |
| 443 (ou 8053) | DNS over HTTPS |
| 67 | DHCP (si activé) |

## API : connexion

```bash
API=http://dns01.corp.exemple.fr:5380/api
# Jeton de session
TOKEN=$(curl -s "$API/user/login?user=admin&pass=MotDePasse&includeInfo=false" | jq -r .token)
# Jeton permanent pour l'automatisation (à stocker dans un coffre)
curl -s "$API/user/createToken?user=admin&pass=MotDePasse&tokenName=automatisation" | jq -r .token
```

## API : zones et enregistrements

```bash
curl -s "$API/zones/list?token=$TOKEN" | jq '.response.zones[] | {name, type, disabled, dnssecStatus}'
curl -s "$API/zones/create?token=$TOKEN&zone=labo.corp.exemple.fr&type=Primary"
curl -s "$API/zones/create?token=$TOKEN&zone=corp.exemple.fr&type=Forwarder&forwarder=10.0.10.11"     # redirection conditionnelle
curl -s "$API/zones/disable?token=$TOKEN&zone=labo.corp.exemple.fr"
curl -s "$API/zones/enable?token=$TOKEN&zone=labo.corp.exemple.fr"
curl -s "$API/zones/export?token=$TOKEN&zone=labo.corp.exemple.fr" -o labo.corp.exemple.fr.zone
curl -s "$API/zones/delete?token=$TOKEN&zone=labo.corp.exemple.fr"

curl -s "$API/zones/records/get?token=$TOKEN&domain=corp.exemple.fr&zone=corp.exemple.fr&listZone=true" | jq '.response.records[] | {name, type, ttl, rData}'
curl -s "$API/zones/records/add?token=$TOKEN&domain=srv-web-02.labo.corp.exemple.fr&zone=labo.corp.exemple.fr&type=A&ttl=3600&ipAddress=10.0.30.12&ptr=true&createPtrZone=true"
curl -s "$API/zones/records/add?token=$TOKEN&domain=intranet.labo.corp.exemple.fr&zone=labo.corp.exemple.fr&type=CNAME&ttl=3600&cname=srv-web-02.labo.corp.exemple.fr"
curl -s "$API/zones/records/add?token=$TOKEN&domain=srv-web-02.labo.corp.exemple.fr&zone=labo.corp.exemple.fr&type=A&ttl=300&ipAddress=10.0.30.13&overwrite=true"   # remplacer
curl -s "$API/zones/records/delete?token=$TOKEN&domain=ancien.corp.exemple.fr&zone=corp.exemple.fr&type=A&ipAddress=10.0.20.99"
```

## API : cache, blocage, statistiques

```bash
curl -s "$API/cache/flush?token=$TOKEN"
curl -s "$API/cache/delete?token=$TOKEN&domain=www.exemple.org"
curl -s "$API/blocked/add?token=$TOKEN&domain=domaine-malveillant.example"
curl -s "$API/blocked/list?token=$TOKEN" | jq .response
curl -s "$API/allowed/add?token=$TOKEN&domain=site-metier.example"
curl -s "$API/settings/forceUpdateBlockLists?token=$TOKEN"
curl -s "$API/dashboard/stats/get?token=$TOKEN&type=LastHour" | jq .response.stats
curl -s "$API/dashboard/stats/getTop?token=$TOKEN&type=LastDay&statsType=TopBlockedDomains&limit=10" | jq .response
```

## API : DHCP et paramètres

```bash
curl -s "$API/dhcp/scopes/list?token=$TOKEN" | jq '.response.scopes[] | {name, enabled, startingAddress, endingAddress}'
curl -s "$API/dhcp/leases/list?token=$TOKEN" | jq '.response.leases[] | {address, hardwareAddress, hostName, leaseExpires}'
curl -s "$API/settings/get?token=$TOKEN" | jq '.response | {dnsServerDomain, forwarders, enableBlocking}'
```

## Sauvegarde et restauration

```bash
curl -s "$API/settings/backup?token=$TOKEN&blockLists=true&logs=false&scopes=true&stats=true&zones=true&allowedZones=true&blockedZones=true&dnsSettings=true&logSettings=true&authConfig=true" -o technitium-$(date +%F).zip
curl -s -F "file=@technitium-2026-11-15.zip" "$API/settings/restore?token=$TOKEN&blockLists=true&scopes=true&stats=true&zones=true&allowedZones=true&blockedZones=true&dnsSettings=true&logSettings=true&authConfig=true&deleteExistingFiles=true"
```

## Tests

```bash
dig @dns01.corp.exemple.fr srv-ad-01.corp.exemple.fr +short
dig @dns01.corp.exemple.fr domaine-malveillant.example +short             # 0.0.0.0 ou NXDOMAIN si bloqué
kdig @dns01.corp.exemple.fr +tls www.exemple.org
curl -s -H 'accept: application/dns-json' "https://dns01.corp.exemple.fr/dns-query?name=www.exemple.org&type=A" | jq .
```
