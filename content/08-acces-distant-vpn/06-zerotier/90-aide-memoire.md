---
title: ZeroTier — aide-mémoire des commandes
description: Commandes ZeroTier avec exemples — installation, zerotier-cli (info, join, leave, listnetworks, listpeers, peers, set allowManaged/allowDefault/allowGlobal), autorisation des membres, API du contrôleur (Central et auto-hébergé), routes gérées, ponts, règles de flux, Windows et macOS, dépannage.
tags: [aide-mémoire, zerotier, zerotier-cli, sd-wan, mesh vpn]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|ZeroTier]].

## Installation et client

```bash
curl -s https://install.zerotier.com | sudo bash
sudo zerotier-cli info                          # adresse du nœud (10 caractères), version, état ONLINE
sudo zerotier-cli join 8056c2e21c000001
sudo zerotier-cli listnetworks
sudo zerotier-cli listpeers
sudo zerotier-cli peers                          # tableau lisible (LEAF, PLANET, latence, chemin direct/relayé)
sudo zerotier-cli set 8056c2e21c000001 allowManaged=1     # adresses et routes gérées
sudo zerotier-cli set 8056c2e21c000001 allowDefault=1     # route par défaut via le réseau (nœud de sortie)
sudo zerotier-cli set 8056c2e21c000001 allowGlobal=0
sudo zerotier-cli leave 8056c2e21c000001
```

```powershell
winget install ZeroTier.ZeroTierOne
& "C:\Program Files (x86)\ZeroTier\One\zerotier-cli.bat" join 8056c2e21c000001
```

## Contrôleur auto-hébergé (API locale)

```bash
TOKEN=$(sudo cat /var/lib/zerotier-one/authtoken.secret)
NODE=$(sudo zerotier-cli info | awk '{print $3}')
# Créer un réseau
curl -s -X POST -H "X-ZT1-Auth: $TOKEN" "http://127.0.0.1:9993/controller/network/${NODE}______" -d '{}' | jq .id
NET=8056c2e21c000001
curl -s -X POST -H "X-ZT1-Auth: $TOKEN" "http://127.0.0.1:9993/controller/network/$NET" \
  -d '{"name":"maillage-admin","private":true,"ipAssignmentPools":[{"ipRangeStart":"10.147.20.1","ipRangeEnd":"10.147.20.254"}],"routes":[{"target":"10.147.20.0/24"}]}'
# Autoriser un membre
curl -s -X POST -H "X-ZT1-Auth: $TOKEN" "http://127.0.0.1:9993/controller/network/$NET/member/a1b2c3d4e5" -d '{"authorized": true}'
curl -s -H "X-ZT1-Auth: $TOKEN" "http://127.0.0.1:9993/controller/network/$NET/member" | jq .
```

Avec **ZeroTier Central** (service hébergé), les mêmes opérations se font dans l'interface web ou l'API `https://api.zerotier.com/api/v1/` avec un jeton personnel.

## Route vers un réseau local (passerelle)

```bash
# Sur la passerelle membre (10.147.20.10) : routage + NAT ou route de retour
echo 'net.ipv4.ip_forward = 1' | sudo tee /etc/sysctl.d/99-zt.conf && sudo sysctl --system
# Dans le contrôleur : route gérée 10.0.0.0/16 via 10.147.20.10
```

## Dépannage

| Symptôme | Piste |
| --- | --- |
| Membre `ACCESS_DENIED` | Non autorisé dans le contrôleur |
| `RELAY` dans `peers` | Pas de chemin direct : UDP 9993 sortant filtré, NAT symétrique |
| Pas d'adresse | `allowManaged=0` ou aucun pool d'adresses |
