---
title: Présentation, installation et configuration
description: Technitium DNS Server — serveur DNS libre (.NET) récursif et faisant autorité avec interface web, installation sur Linux (script), Windows (installateur), macOS et Docker, zones primaires, secondaires et transferts conditionnels, DNSSEC (signature et validation), blocage par listes et applications (filtrage, géolocalisation, split horizon), DNS chiffré (DoT, DoH, DoQ) en entrée et en sortie, DHCP intégré, clustering, API HTTP, journalisation et sauvegarde.
tags: [technitium, dns, récursif, autoritaire, dnssec, doh, dot, blocage, interface web]
icon: info
---

**Technitium DNS Server** (GPL, Shreyas Zare) réunit dans un seul service, administré par une **interface web** : résolveur récursif avec cache, serveur faisant autorité, **DNSSEC** (signature de zones en un clic et validation), **blocage** de domaines (listes publicitaires et malveillantes), **DNS chiffré** (DoT, DoH, DoQ) côté clients et côté amont, serveur **DHCP**, applications (*DNS Apps* : split horizon, géolocalisation, filtrage avancé) et clustering. Multiplateforme grâce à .NET.

## Installation

```bash
curl -sSL https://download.technitium.com/dns/install.sh | sudo bash          # Linux (service systemd)
docker run -d --name technitium -p 5380:5380 -p 53:53/udp -p 53:53/tcp -v technitium:/etc/dns technitium/dns-server:latest
```

Windows : installateur `DnsServerSetup.zip` depuis `technitium.com/dns` (installé comme service Windows) ; macOS : archive portable avec le runtime .NET.

Interface : `http://<serveur>:5380` — définir le mot de passe administrateur au premier accès, puis activer HTTPS pour la console (*Settings → Web Service*).

> [!NOTE]
> Sur Ubuntu, désactivez l'écoute de `systemd-resolved` sur le port 53 avant l'installation : `DNSStubListener=no` dans `/etc/systemd/resolved.conf`.

## Fonctions principales

| Fonction | Où |
| --- | --- |
| Zones primaires, secondaires, *stub*, **transfert conditionnel** (*Conditional Forwarder*) | *Zones → Add Zone* |
| DNSSEC : signer une zone, roulement de clés | Zone → *DNSSEC Properties* |
| Résolveurs amont (DoT, DoH, DoQ) | *Settings → Proxy & Forwarders* |
| Blocage (listes d'URL, réponse NXDOMAIN ou adresse) | *Settings → Blocking*, onglet *Blocked* |
| DNS chiffré en entrée (DoT 853, DoH 443, DoQ) | *Settings → Optional Protocols* (certificat requis) |
| DHCP | *DHCP → Scopes* |
| Applications (split horizon, NO DATA, filtrage par client) | *Apps → App Store* |
| Cluster (configuration répliquée) | *Administration → Cluster* (selon version) |
| Journaux de requêtes | *Logs → Query Logs* (application *Query Logs (Sqlite)*) |

## Usage type en entreprise

- Résolveur interne pour les postes, avec **transfert conditionnel** de `corp.exemple.fr` vers les contrôleurs de domaine et blocage des domaines malveillants.
- Serveur faisant autorité pour un laboratoire ou une zone publique signée DNSSEC.

## API et sauvegarde

```bash
TOKEN=$(curl -s "http://dns01:5380/api/user/login?user=admin&pass=MotDePasse&includeInfo=false" | jq -r .token)
curl -s "http://dns01:5380/api/zones/list?token=$TOKEN" | jq '.response.zones[].name'
curl -s "http://dns01:5380/api/zones/records/add?token=$TOKEN&domain=srv-web-04.corp.exemple.fr&zone=corp.exemple.fr&type=A&ipAddress=10.0.20.14"
curl -s -o sauvegarde-dns.zip "http://dns01:5380/api/settings/backup?token=$TOKEN&blockLists=true&logs=false&scopes=true&stats=true&zones=true&allowedZones=true&blockedZones=true&dnsSettings=true&logSettings=true&authConfig=true&apps=true"
```

Interface : [[03-interface-graphique|interface web]] · commandes : [[90-aide-memoire|aide-mémoire]].
