---
title: Vues (split-horizon) et ACL
description: Servir des réponses différentes selon l'origine du client avec les vues BIND — interne/externe, partage de zones entre vues, clés TSIG par vue pour les transferts, résolution récursive interne et pièges courants.
tags: [bind9, views, split-horizon, split-brain, acl, match-clients]
icon: split
---

## Pourquoi des vues ?

Le **split-horizon** (ou *split-brain*) répond différemment à une même question selon le client :

| Client | `intranet.exemple.fr` | `www.exemple.fr` |
| --- | --- | --- |
| Interne (10.0.0.0/8) | `10.0.20.15` (IP privée) | `10.0.20.10` (accès direct, sans NAT) |
| Externe (Internet) | NXDOMAIN (n'existe pas) | `203.0.113.10` (IP publique) |

Un même serveur peut aussi faire **résolveur récursif pour l'interne** et **autoritaire non récursif pour l'externe**.

## Règles fondamentales

1. Dès qu'une vue est définie, **toutes les zones** doivent être dans une vue (y compris les zones par défaut : sous Debian, déplacer l'`include "named.conf.default-zones"` dans la vue concernée).
2. Les vues sont évaluées **dans l'ordre** : la première dont `match-clients` (et `match-destinations`) correspond est utilisée.
3. Chaque vue a son propre **cache** et ses propres options (récursion, ACL…), qui surchargent le bloc `options`.

## Exemple complet

```named /etc/bind/named.conf.acl
acl "interne" {
    10.0.0.0/8;
    172.16.0.0/12;
    192.168.0.0/16;
    localhost;
};
```

```named /etc/bind/named.conf.local
include "/etc/bind/keys/xfer-interne.key";
include "/etc/bind/keys/xfer-externe.key";

view "interne" {
    // Les secondaires de la vue interne s'identifient par la clé « xfer-interne »
    match-clients { key "xfer-interne"; !key "xfer-externe"; interne; };

    recursion yes;
    allow-recursion { interne; };
    allow-query-cache { interne; };

    include "/etc/bind/named.conf.default-zones";

    zone "exemple.fr" {
        type primary;
        file "/etc/bind/zones/interne/db.exemple.fr";
        allow-transfer { key "xfer-interne"; };
    };

    zone "20.0.10.in-addr.arpa" {
        type primary;
        file "/etc/bind/zones/interne/db.10.0.20";
        allow-transfer { key "xfer-interne"; };
    };

    zone "corp.local" {
        type forward;
        forward only;
        forwarders { 10.0.10.11; 10.0.10.12; };
    };
};

view "externe" {
    match-clients { key "xfer-externe"; any; };

    recursion no;
    allow-query { any; };

    zone "exemple.fr" {
        type primary;
        file "/etc/bind/zones/externe/db.exemple.fr";
        allow-transfer { key "xfer-externe"; };
    };
};
```

> [!IMPORTANT]
> Le `match-clients` de la vue interne commence par **exclure** la clé externe (`!key "xfer-externe";`) : sinon un secondaire externe situé dans un réseau privé tomberait dans la vue interne et recevrait la zone interne.

## Éviter la duplication des enregistrements

Deux approches pour ne pas maintenir deux copies complètes :

### 1. `$INCLUDE` d'un fichier commun

```dns /etc/bind/zones/interne/db.exemple.fr
$TTL 3600
@ IN SOA ns1.exemple.fr. hostmaster.exemple.fr. ( 2026011501 7200 900 1209600 3600 )
$INCLUDE /etc/bind/zones/commun/exemple.fr.inc      ; NS, MX, SPF, DKIM…
www       IN A 10.0.20.10
intranet  IN A 10.0.20.15
```

```dns /etc/bind/zones/externe/db.exemple.fr
$TTL 3600
@ IN SOA ns1.exemple.fr. hostmaster.exemple.fr. ( 2026011501 7200 900 1209600 3600 )
$INCLUDE /etc/bind/zones/commun/exemple.fr.inc
www       IN A 203.0.113.10
```

### 2. `in-view` : partager une zone entre vues (9.10+)

```named
view "interne" {
    match-clients { interne; };
    zone "exemple.com" { type primary; file "/etc/bind/zones/db.exemple.com"; };   // définie une fois
};
view "externe" {
    match-clients { any; };
    zone "exemple.com" { in-view "interne"; };   // même contenu, même mémoire
};
```

Utile pour les zones **identiques** dans les deux vues (seules quelques zones diffèrent réellement).

## Zones dynamiques et vues

Une zone dynamique (mise à jour par DHCP ou `nsupdate`) ne peut être modifiée **que dans une seule vue**. Pour qu'une mise à jour atteigne la bonne vue, le client doit correspondre à son `match-clients` : utilisez une **clé TSIG dédiée** et placez-la en tête du `match-clients`.

```named
view "interne" {
    match-clients { key "ddns-dhcp"; !key "xfer-externe"; interne; };
    zone "dhcp.exemple.fr" {
        type primary;
        file "/var/lib/bind/db.dhcp.exemple.fr";
        update-policy { grant ddns-dhcp zonesub ANY; };
    };
};
```

## match-destinations

Sélectionne la vue selon l'**adresse IP du serveur** interrogée (serveur multi-adresses) :

```named
view "dmz" {
    match-destinations { 192.168.100.53; };
    ...
};
```

## Tests

```bash
# Depuis un poste interne
dig @10.0.20.53 intranet.exemple.fr +short          # 10.0.20.15
# Simuler un client externe depuis le serveur : ne fonctionne pas avec 127.0.0.1 (localhost = interne)
dig @203.0.113.53 intranet.exemple.fr               # depuis Internet : NXDOMAIN
# Voir quelle vue a répondu : activer le canal de journalisation « queries »
sudo rndc querylog on
journalctl -u named | grep "view interne"
# Statistiques par vue
sudo rndc stats && grep -A5 "View: interne" /var/cache/bind/named.stats
```

## Pièges courants

> [!WARNING]
> - **Zone par défaut hors vue** → `named-checkconf` : « when using 'view' statements, all zones must be in views ».
> - **Clients NATés** : si le pare-feu fait du NAT source vers le serveur DNS, tous les clients externes semblent internes (ou l'inverse). Vérifiez l'IP source réelle vue par BIND.
> - **IPv6 oublié** : un client interne qui interroge en IPv6 doit aussi figurer dans l'ACL interne (`fd00::/8`, préfixe global interne).
> - **Cache séparé** : vider le cache d'une vue : `rndc flush interne`.
> - Les **secondaires** doivent recevoir chaque version de la zone : une clé TSIG par vue, comme dans l'exemple.
