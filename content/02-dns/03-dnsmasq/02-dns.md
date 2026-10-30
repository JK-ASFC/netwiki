---
title: "DNS : cache, relais, noms locaux, filtrage"
description: Configurer la partie DNS de dnsmasq — serveurs amont et redirections par domaine (Active Directory), noms locaux (hosts, host-record, CNAME, SRV, TXT, PTR), jokers, blocage de domaines, protection contre le DNS rebinding, DNSSEC, cache et écoute.
tags: [dnsmasq, dns, cache, forward, hosts, filtrage, dnssec]
icon: globe
---

## Serveurs amont

```ini /etc/dnsmasq.d/dns.conf
no-resolv                         # ne pas lire /etc/resolv.conf pour les serveurs amont
server=10.0.10.53                 # résolveurs du siège (Unbound, BIND)
server=10.0.10.54
# server=9.9.9.9                  # ou résolveurs publics
strict-order                      # interroger dans l'ordre (sinon : le plus rapide)
all-servers                       # (alternative) interroger tous les serveurs et garder la première réponse
```

### Redirection par domaine

```ini
# Domaine Active Directory vers les contrôleurs de domaine (via le VPN)
server=/corp.exemple.fr/10.0.10.11
server=/corp.exemple.fr/10.0.10.12
# Zones inverses correspondantes
server=/10.in-addr.arpa/10.0.10.11
# Domaine d'un partenaire, avec port non standard
server=/partenaire.lan/172.20.0.53#5353
# Domaine résolu localement uniquement (jamais transmis)
local=/agence.exemple.fr/
```

> [!NOTE]
> `bogus-priv` empêche de transmettre aux serveurs amont les requêtes **inverses** sur les plages privées non connues localement. Si une zone inverse privée doit partir vers les DC, la ligne `server=/10.in-addr.arpa/…` explicite est prioritaire.

## Noms locaux

### Depuis /etc/hosts (et fichiers additionnels)

```ini
expand-hosts                      # ajoute « domain » aux noms courts des fichiers hosts
domain=agence.exemple.fr
addn-hosts=/etc/dnsmasq.hosts     # fichier supplémentaire au format hosts
# hostsdir=/etc/dnsmasq.hosts.d   # dossier surveillé : rechargé automatiquement
```

```text /etc/dnsmasq.hosts
192.168.30.10   nas
192.168.30.11   imprimante-rdc
192.168.30.12   camera-entree
```

Un `SIGHUP` (`sudo systemctl reload dnsmasq` ou `kill -HUP`) relit les fichiers hosts et vide le cache **sans** redémarrer (mais ne relit pas `dnsmasq.conf`).

### Enregistrements dans la configuration

```ini
host-record=nas.agence.exemple.fr,nas,192.168.30.10,2001:db8:30::10
cname=fichiers.agence.exemple.fr,nas.agence.exemple.fr
srv-host=_ldap._tcp.agence.exemple.fr,dc01.corp.exemple.fr,389,0,100
mx-host=agence.exemple.fr,mail.exemple.fr,10
txt-record=agence.exemple.fr,"v=spf1 -all"
ptr-record=10.30.168.192.in-addr.arpa,nas.agence.exemple.fr
caa-record=agence.exemple.fr,0,issue,letsencrypt.org
```

### Jokers

```ini
address=/dev.agence.exemple.fr/192.168.30.50       # *.dev.agence.exemple.fr et dev.agence… → 192.168.30.50
address=/test/127.0.0.1                            # tout le domaine .test (développement)
```

## Blocage de domaines

```ini
address=/publicite.example/0.0.0.0        # renvoie 0.0.0.0 (et :: en IPv6)
address=/malware.example/                 # NXDOMAIN
server=/bloque.example/                   # ne jamais transmettre (NXDOMAIN local)
conf-file=/etc/dnsmasq.d/listes/blocage.conf
```

```bash
# Générer une liste (un domaine par ligne) au format dnsmasq
sed 's|.*|address=/&/|' domaines-bloques.txt | sudo tee /etc/dnsmasq.d/listes/blocage.conf
sudo dnsmasq --test && sudo systemctl restart dnsmasq
```

Pi-hole repose d'ailleurs sur une version modifiée de dnsmasq (FTL).

## Protection contre le DNS rebinding

```ini
stop-dns-rebind                       # refuser les réponses amont contenant des IP privées
rebind-localhost-ok
rebind-domain-ok=/corp.exemple.fr/    # exception : le domaine AD répond légitimement avec des IP privées
```

## DNSSEC (validation)

```ini
dnssec
conf-file=/usr/share/dnsmasq-base/trust-anchors.conf    # RHEL : /usr/share/dnsmasq/trust-anchors.conf
dnssec-check-unsigned                 # vérifier aussi que les zones non signées le sont réellement
# dnssec-no-timecheck                 # pour les routeurs sans horloge au démarrage (jusqu'à la synchro NTP)
```

> [!WARNING]
> La validation DNSSEC exige des serveurs amont qui transmettent les enregistrements DNSSEC, et une **heure correcte**. Sur un routeur sans RTC, combinez `dnssec-no-timecheck` avec un signal après la synchronisation NTP.

## Cache et écoute

```ini
cache-size=10000                 # entrées (150 par défaut ; 0 = pas de cache)
min-cache-ttl=60                 # plancher de TTL (à utiliser avec prudence)
max-cache-ttl=86400
neg-ttl=300                      # TTL des réponses négatives sans SOA
local-ttl=300                    # TTL des noms locaux (0 par défaut)
dns-forward-max=500              # requêtes simultanées vers l'amont

interface=ens224                 # n'écouter que sur ces interfaces
interface=lo
bind-interfaces                  # se lier uniquement à ces adresses (cohabitation avec un autre DNS)
# bind-dynamic                   # variante qui suit l'apparition/disparition d'interfaces
except-interface=ens192          # ne pas servir l'interface WAN
```

> [!CAUTION]
> Ne laissez jamais dnsmasq répondre sur l'interface **Internet** : ce serait un résolveur ouvert utilisé pour des attaques par amplification. Utilisez `interface=`/`except-interface=` et le pare-feu.

## Ajouts au comportement des requêtes

```ini
domain-needed                    # ne pas transmettre les noms sans point (ex. « nas »)
filter-AAAA                      # (2.89+) ne jamais répondre en IPv6 — réseaux sans IPv6 fonctionnel
add-mac                          # transmettre la MAC du client à l'amont (filtrage par appareil côté amont)
add-subnet=24,48                 # EDNS Client Subnet vers l'amont
```

## Journalisation

```ini
log-queries                      # chaque requête (diagnostic) ; « log-queries=extra » pour plus de détails
log-facility=/var/log/dnsmasq.log
log-async=50
```
