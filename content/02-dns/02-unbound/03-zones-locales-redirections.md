---
title: Zones locales, redirections, RPZ et vues
description: Déclarer des noms locaux et des zones inverses (local-zone, local-data), rediriger des domaines vers d'autres serveurs (forward-zone pour Active Directory, stub-zone), répondre comme autoritaire secondaire (auth-zone), filtrer avec des listes ou une RPZ, et servir des réponses différentes selon le client (vues).
tags: [unbound, local-zone, forward-zone, stub-zone, rpz, filtrage, vues, active directory]
icon: split
---

## Noms locaux

```unbound /etc/unbound/unbound.conf.d/local.conf
server:
    # Zone locale : Unbound fait autorité pour ces noms, le reste du domaine renvoie NXDOMAIN
    local-zone: "lab.exemple.fr." static
    local-data: "lab.exemple.fr.        IN SOA ns.lab.exemple.fr. hostmaster.exemple.fr. 1 3600 1200 604800 300"
    local-data: "nas.lab.exemple.fr.    IN A 192.168.1.10"
    local-data: "imprimante.lab.exemple.fr. IN A 192.168.1.20"
    local-data: "_ipp._tcp.lab.exemple.fr. IN SRV 0 0 631 imprimante.lab.exemple.fr."
    local-data-ptr: "192.168.1.10 nas.lab.exemple.fr."
    local-data-ptr: "192.168.1.20 imprimante.lab.exemple.fr."

    # Surcharger un seul nom public (accès interne direct) sans masquer le reste du domaine
    local-zone: "portail.exemple.fr." redirect
    local-data: "portail.exemple.fr. IN A 10.0.20.15"
```

| Type de `local-zone` | Comportement pour un nom **sans** `local-data` |
| --- | --- |
| `static` | NXDOMAIN / NODATA (Unbound fait autorité) |
| `transparent` | Résolution normale (on n'ajoute que quelques noms) |
| `typetransparent` | Comme transparent, même si le nom existe localement avec un autre type |
| `redirect` | Toute la zone (et ses sous-domaines) répond avec les données du sommet |
| `refuse` / `deny` | REFUSED / pas de réponse |
| `always_nxdomain` / `always_null` / `always_refuse` | Blocage (utile pour le filtrage) |
| `inform` / `inform_deny` | Journaliser (et bloquer) |
| `nodefault` | Désactiver une zone par défaut (ex. `10.in-addr.arpa`) pour la rediriger |

> [!NOTE]
> Unbound crée automatiquement des zones locales vides pour les plages privées inverses (`10.in-addr.arpa`, `168.192.in-addr.arpa`…). Pour transmettre ces zones à un autre serveur (Active Directory), déclarez `local-zone: "10.in-addr.arpa." nodefault` puis une `forward-zone` ou `stub-zone`.

## Redirection conditionnelle : Active Directory

```unbound /etc/unbound/unbound.conf.d/forward.conf
server:
    private-domain: "corp.exemple.fr"           # autoriser les IP privées dans les réponses AD
    domain-insecure: "corp.exemple.fr"          # zone AD non signée
    local-zone: "10.in-addr.arpa." nodefault
    domain-insecure: "10.in-addr.arpa"

forward-zone:
    name: "corp.exemple.fr"
    forward-addr: 10.0.10.11
    forward-addr: 10.0.10.12

forward-zone:
    name: "10.in-addr.arpa"
    forward-addr: 10.0.10.11
    forward-addr: 10.0.10.12
```

## stub-zone : interroger directement des autoritaires

```unbound
stub-zone:
    name: "dmz.exemple.fr"
    stub-addr: 10.0.20.53          # serveur autoritaire (BIND, PowerDNS) qui ne fait pas de récursion
    stub-addr: 10.0.20.54
    stub-prime: no
```

| Clause | Requêtes envoyées | Cible |
| --- | --- | --- |
| `forward-zone` | Récursives (RD=1) | Un autre **résolveur** (DC Active Directory, résolveur public) |
| `stub-zone` | Itératives (RD=0) | Des serveurs **autoritaires** de la zone |

## auth-zone : copie autoritaire d'une zone

Unbound peut charger une zone complète (fichier local ou transfert depuis un primaire) et y répondre :

```unbound
auth-zone:
    name: "exemple.fr"
    primary: 10.0.20.53                 # transfert AXFR/IXFR depuis le primaire
    zonefile: "/var/lib/unbound/exemple.fr.zone"
    for-downstream: yes                 # répondre aux clients comme un autoritaire
    for-upstream: yes                   # utiliser la zone pour la résolution
```

## Filtrage

### Listes simples

```unbound /etc/unbound/unbound.conf.d/blocage.conf
server:
    local-zone: "publicite.example." always_null       # répond 0.0.0.0 / ::
    local-zone: "malware.example." always_nxdomain
    include: "/etc/unbound/listes/blocage.conf"        # fichier généré : une ligne local-zone par domaine
```

```bash
# Générer une liste à partir d'un fichier de domaines (un par ligne)
awk '{print "local-zone: \"" $1 ".\" always_nxdomain"}' domaines-bloques.txt | sudo tee /etc/unbound/listes/blocage.conf
sudo unbound-checkconf && sudo unbound-control reload
```

### RPZ (Response Policy Zones)

```unbound
server:
    module-config: "respip validator iterator"

rpz:
    name: "rpz.local"
    zonefile: "/etc/unbound/rpz.local.zone"
    rpz-log: yes
    rpz-log-name: "rpz-local"
    rpz-action-override: nxdomain       # facultatif : forcer l'action

rpz:
    name: "rpz.menaces.example"
    primary: 192.0.2.10                 # flux fourni par un éditeur (transfert de zone)
    zonefile: "/var/lib/unbound/rpz-menaces.zone"
    rpz-log: yes
```

Le format de la zone RPZ est le même que pour BIND (`domaine CNAME .` = NXDOMAIN, `CNAME *.` = NODATA, `CNAME rpz-passthru.` = liste blanche) : voir [[01-bind9/09-securite-rpz-dot-doh|RPZ avec BIND]].

> [!TIP]
> **Pi-hole** ou **AdGuard Home** peuvent servir d'interface de filtrage et de statistiques, avec Unbound comme résolveur amont validant (Pi-hole → `127.0.0.1#5335` → Unbound).

## Vues : réponses selon le client

```unbound
server:
    access-control-view: 10.0.0.0/8 interne
    access-control-view: 192.168.50.0/24 invites

view:
    name: "interne"
    local-zone: "intranet.exemple.fr." static
    local-data: "intranet.exemple.fr. IN A 10.0.20.15"

view:
    name: "invites"
    view-first: yes                         # puis les zones globales
    local-zone: "intranet.exemple.fr." always_nxdomain
    local-zone: "reseaux-sociaux.example." always_nxdomain
```

## Données locales à chaud

```bash
sudo unbound-control local_data test.lab.exemple.fr A 192.168.1.99
sudo unbound-control local_data_remove test.lab.exemple.fr
sudo unbound-control local_zone bloque.example always_nxdomain
sudo unbound-control list_local_zones | head
```

Les ajouts à chaud ne survivent pas à un redémarrage : reportez-les dans la configuration.
