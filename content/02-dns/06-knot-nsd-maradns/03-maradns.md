---
title: MaraDNS
description: MaraDNS — petit serveur DNS libre et sûr (Sam Trenholme) avec deux démons : maradns (faisant autorité) et Deadwood (résolveur récursif et cache), installation sous Linux et Windows, fichiers mararc et dwood3rc, zones au format csv2, cas d'usage (petits réseaux, DNS interne léger, poste Windows) et limites.
tags: [maradns, deadwood, dns, windows, léger]
icon: globe
---

**MaraDNS** (licence BSD) est un serveur DNS minimaliste, conçu pour la sécurité, utilisable sous **Linux** et **Windows** :

| Démon | Rôle |
| --- | --- |
| `maradns` | Faisant autorité (zones au format *csv2*) |
| **Deadwood** | Résolveur récursif avec cache, ou redirecteur vers des résolveurs amont |

Usage : petit réseau, laboratoire, DNS local sur un poste Windows sans rôle serveur. Pour un DNS d'entreprise, préférez [[01-bind9/01-presentation|BIND9]], [[02-unbound/01-presentation-installation|Unbound]] ou [[08-technitium/01-presentation-installation|Technitium]].

## Installation

```bash
sudo apt install maradns maradns-deadwood        # Debian / Ubuntu
# Autres systèmes et Windows : archive depuis maradns.samiam.org (sous Windows, Deadwood s'installe comme service)
```

## Configuration

```text /etc/maradns/mararc
ipv4_bind_addresses = "10.0.10.60"
chroot_dir = "/etc/maradns"
csv2 = {}
csv2["labo.exemple.fr."] = "db.labo"
```

```text /etc/maradns/db.labo
labo.exemple.fr. NS ns1.labo.exemple.fr. ~
ns1.labo.exemple.fr. A 10.0.10.60 ~
srv-test-01.labo.exemple.fr. A 10.0.50.11 ~
labo.exemple.fr. MX 10 mail.labo.exemple.fr. ~
```

```text /etc/maradns/dwood3rc
bind_address = "127.0.0.1"
recursive_acl = "127.0.0.1/8, 10.0.0.0/8"
upstream_servers = {}
upstream_servers["."] = "10.0.10.53, 10.0.10.54"
```

```bash
sudo systemctl restart maradns maradns-deadwood
dig @10.0.10.60 srv-test-01.labo.exemple.fr
```

Limites : pas de DNSSEC signé pour les zones servies, peu d'outils d'administration ; projet maintenu par une seule personne.
