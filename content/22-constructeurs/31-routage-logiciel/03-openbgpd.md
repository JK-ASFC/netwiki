---
title: OpenBGPD
description: OpenBGPD — implémentation BGP-4 libre du projet OpenBSD (ISC), aussi portée sur Linux et FreeBSD (openbgpd-portable) : installation, bgpd.conf (AS, router-id, réseaux annoncés, voisins, groupes, filtres allow/deny, RPKI via rpki-client), contrôle avec bgpctl (show summary, rib, neighbor, reload), usage comme serveur de route, et OpenOSPFD.
tags: [openbgpd, bgp, openbsd, rpki, serveur de route, bgpctl]
icon: info
---

**OpenBGPD** (licence ISC) est le démon BGP d'**OpenBSD** : code compact, séparation des privilèges, syntaxe lisible, **RPKI** natif avec `rpki-client`. Il sert de routeur de bordure sur [[09-bsd/02-openbsd|OpenBSD]] et de **serveur de route** dans plusieurs IXP. La version *portable* fonctionne sur Linux et FreeBSD (sans installer les routes dans le noyau sur Linux : usage serveur de route ou collecteur).

## Installation

```bash
# OpenBSD : intégré au système
rcctl enable bgpd && rcctl start bgpd
# Debian/Ubuntu (portable)
sudo apt install openbgpd
# FreeBSD
sudo pkg install openbgpd
```

## `/etc/bgpd.conf`

```text
AS 65001
router-id 10.0.255.1
prefix-set mes_reseaux { 198.51.100.0/24 }
network prefix-set mes_reseaux

group "transit" {
	neighbor 203.0.113.1 {
		remote-as 64500
		descr "Transit-Operateur"
	}
}

# Politique : n'annoncer que nos préfixes, refuser les martiens et les AS privés en entrée
deny from any
deny to any
allow from group "transit"
allow to group "transit" prefix-set mes_reseaux
deny from ebgp ovs invalid                    # RPKI : rejeter les annonces invalides
```

RPKI : `rpki-client` (cron ou `rcctl`) produit `/var/db/rpki-client/openbgpd`, à inclure dans la configuration.

```bash
bgpd -n                     # vérifier la syntaxe
bgpctl reload
```

## bgpctl

```bash
bgpctl show summary
bgpctl show neighbor 203.0.113.1
bgpctl show rib 9.9.9.9
bgpctl show rib neighbor 203.0.113.1 in
bgpctl show rib out
bgpctl show sets
bgpctl neighbor 203.0.113.1 clear
bgpctl network show
```

OSPF sur OpenBSD : **ospfd** / `ospfctl` (même philosophie). Comparaison : [[01-frrouting|FRR]] · [[02-bird|BIRD]] · [[90-aide-memoire|aide-mémoire]].
