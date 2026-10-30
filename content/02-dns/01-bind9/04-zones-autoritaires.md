---
title: Zones autoritaires et enregistrements
description: Déclarer une zone primaire, syntaxe des fichiers de zone ($TTL, $ORIGIN, SOA détaillé), tous les enregistrements courants (A, AAAA, CNAME, MX, TXT/SPF/DKIM/DMARC, SRV, CAA, HTTPS), zones inverses IPv4/IPv6 et classless, délégation, $GENERATE et bonnes pratiques.
tags: [bind9, zone, soa, enregistrements, ptr, reverse, mx, spf, dkim, dmarc]
icon: file-code
---

## Déclarer une zone primaire

```named /etc/bind/named.conf.local
zone "exemple.fr" {
    type primary;
    file "/etc/bind/zones/db.exemple.fr";
    allow-transfer { key "xfer-key"; };   // voir l'article primaire/secondaire
    also-notify { 10.0.20.54; };
    notify yes;
};

zone "20.0.10.in-addr.arpa" {
    type primary;
    file "/etc/bind/zones/db.10.0.20";
};
```

## Fichier de zone complet commenté

```dns /etc/bind/zones/db.exemple.fr
$ORIGIN exemple.fr.          ; nom ajouté aux noms relatifs (sans point final)
$TTL 3600                     ; TTL par défaut des enregistrements (1 h)

; ------------------------------------------------------------------ SOA
@   IN  SOA ns1.exemple.fr. hostmaster.exemple.fr. (
        2026011501  ; serial      : AAAAMMJJnn — À INCRÉMENTER à chaque modification
        7200        ; refresh     : intervalle de vérification des secondaires (2 h)
        900         ; retry       : nouvel essai après un échec de refresh (15 min)
        1209600     ; expire      : un secondaire cesse de répondre après 14 j sans contact
        3600 )      ; minimum     : TTL des réponses NÉGATIVES (NXDOMAIN) (1 h)

; ------------------------------------------------------------------ serveurs de noms
@           IN  NS      ns1.exemple.fr.
@           IN  NS      ns2.exemple.fr.
ns1         IN  A       203.0.113.53
ns1         IN  AAAA    2001:db8:10::53
ns2         IN  A       198.51.100.53

; ------------------------------------------------------------------ web
@           IN  A       203.0.113.10
@           IN  AAAA    2001:db8:10::10
www         IN  CNAME   exemple.fr.
@           IN  HTTPS   1 . alpn="h2,h3"
@           IN  CAA     0 issue "letsencrypt.org"
@           IN  CAA     0 iodef "mailto:securite@exemple.fr"

; ------------------------------------------------------------------ messagerie
@           IN  MX      10 mx1.exemple.fr.
@           IN  MX      20 mx2.exemple.fr.
mx1         IN  A       203.0.113.25
mx2         IN  A       198.51.100.25
@           IN  TXT     "v=spf1 mx ip4:203.0.113.0/24 include:_spf.prestataire.com -all"
_dmarc      IN  TXT     "v=DMARC1; p=quarantine; rua=mailto:dmarc@exemple.fr; adkim=s; aspf=s"
sel2026._domainkey IN TXT ( "v=DKIM1; k=rsa; "
                            "p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAx...partie1"
                            "...partie2IDAQAB" )
_mta-sts    IN  TXT     "v=STSv1; id=20260115"
_smtp._tls  IN  TXT     "v=TLSRPTv1; rua=mailto:tlsrpt@exemple.fr"
autodiscover IN CNAME   autodiscover.outlook.com.

; ------------------------------------------------------------------ services (SRV)
; _service._proto  TTL  IN SRV priorité poids port cible
_sip._tls   IN  SRV     10 60 5061 sip1.exemple.fr.
_sip._tls   IN  SRV     10 40 5061 sip2.exemple.fr.
_xmpp-client._tcp IN SRV 5 0 5222 chat.exemple.fr.

; ------------------------------------------------------------------ divers
vpn         300 IN A    203.0.113.30          ; TTL spécifique (5 min) avant une migration
*.dev       IN  A       203.0.113.40          ; joker : n'importe quoi.dev.exemple.fr
ssh01       IN  SSHFP   4 2 123456789abcdef67890123456789abcdef67890123456789abcdef6789012
```

### Règles de syntaxe à retenir

| Règle | Détail |
| --- | --- |
| **Point final** | `ns1.exemple.fr.` est absolu ; `ns1` est relatif et devient `ns1.exemple.fr.` (ajout de `$ORIGIN`). Oublier le point final dans un MX ou un CNAME produit `mx1.exemple.fr.exemple.fr.` |
| `@` | Représente l'origine (`$ORIGIN`, par défaut le nom de la zone) |
| Nom vide | Une ligne commençant par un espace reprend le nom de la ligne précédente |
| `;` | Commentaire |
| `( … )` | Permet d'écrire un enregistrement sur plusieurs lignes |
| Adresse e-mail du SOA | Le `@` est remplacé par un point : `hostmaster.exemple.fr.` = `hostmaster@exemple.fr` (un point dans la partie locale s'échappe : `prenom\.nom.exemple.fr.`) |
| Chaînes TXT | 255 caractères max par chaîne ; concaténer plusieurs chaînes entre guillemets (DKIM 2048 bits) |
| CNAME | Exclusif : interdit au sommet de la zone (`@`) et sur un nom qui porte un autre type |

### Le numéro de série

Le secondaire ne transfère la zone que si le **serial augmente**. Conventions :

- `AAAAMMJJnn` : date + compteur du jour (lisible, 100 modifications par jour max).
- `serial-update-method unixtime;` ou `date;` : géré automatiquement par BIND pour les zones dynamiques / signées.

> [!WARNING]
> Si un serial a été augmenté par erreur (ex. 2026011599 → 20260115999), on ne peut pas simplement le rediminuer : les secondaires ignoreraient les mises à jour. Il faut utiliser l'arithmétique des numéros de série (RFC 1982) en ajoutant 2³¹ en deux étapes, ou forcer `rndc retransfer` sur chaque secondaire.

## Zones inverses

### IPv4 (/24)

```dns /etc/bind/zones/db.10.0.20
$TTL 3600
@   IN SOA ns1.exemple.fr. hostmaster.exemple.fr. ( 2026011501 7200 900 1209600 3600 )
    IN NS  ns1.exemple.fr.
    IN NS  ns2.exemple.fr.

1   IN PTR passerelle.exemple.fr.
10  IN PTR web01.exemple.fr.
11  IN PTR web02.exemple.fr.
25  IN PTR mx1.exemple.fr.
```

Le nom de la zone s'écrit avec les octets **inversés** : réseau `10.0.20.0/24` → zone `20.0.10.in-addr.arpa`.

### Réseau /16

Zone `10.10.in-addr.arpa` pour `10.10.0.0/16`, avec des noms relatifs sur deux octets :

```dns
5.1    IN PTR srv-a.corp.local.     ; 10.10.1.5
200.3  IN PTR srv-b.corp.local.     ; 10.10.3.200
```

### Délégation classless (RFC 2317)

Pour un bloc plus petit qu'un /24 (ex. `203.0.113.64/26` attribué par l'opérateur) : l'opérateur, propriétaire de `113.0.203.in-addr.arpa`, crée des CNAME vers une sous-zone que vous gérez.

```dns
; Chez l'opérateur, dans 113.0.203.in-addr.arpa
64-127      IN NS    ns1.exemple.fr.
$GENERATE 64-127 $ IN CNAME $.64-127.113.0.203.in-addr.arpa.
```

```named
// Chez vous
zone "64-127.113.0.203.in-addr.arpa" {
    type primary;
    file "/etc/bind/zones/db.203.0.113.64-127";
};
```

```dns /etc/bind/zones/db.203.0.113.64-127
$TTL 3600
@   IN SOA ns1.exemple.fr. hostmaster.exemple.fr. ( 2026011501 7200 900 1209600 3600 )
    IN NS ns1.exemple.fr.
65  IN PTR fw.exemple.fr.
70  IN PTR vpn.exemple.fr.
```

### IPv6 (ip6.arpa)

Chaque **quartet** hexadécimal est un label, à l'envers. Pour `2001:db8:10::/48` → zone `0.1.0.0.8.b.d.0.1.0.0.2.ip6.arpa`.

```dns
; 2001:db8:10::10  → adresse complète 2001:0db8:0010:0000:0000:0000:0000:0010
0.1.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0.0 IN PTR web01.exemple.fr.
```

```bash
# Calculer le nom inverse d'une adresse
dig -x 2001:db8:10::10 +noall +question
# ou : python3 -c "import ipaddress; print(ipaddress.ip_address('2001:db8:10::10').reverse_pointer)"
```

## Délégation d'un sous-domaine

```dns
; Dans db.exemple.fr : déléguer lab.exemple.fr à deux serveurs internes
lab         IN NS   ns1.lab.exemple.fr.
lab         IN NS   ns2.lab.exemple.fr.
ns1.lab     IN A    203.0.113.81      ; enregistrements de colle (glue) obligatoires
ns2.lab     IN A    203.0.113.82      ; car les NS sont DANS le sous-domaine délégué
```

Si le sous-domaine est signé DNSSEC, ajoutez son enregistrement **DS** dans la zone parente.

## $GENERATE : enregistrements en série

```dns
; host-10 … host-50 → 10.0.30.10 … 10.0.30.50
$GENERATE 10-50 host-$ IN A 10.0.30.$
; PTR correspondants dans la zone inverse 30.0.10.in-addr.arpa
$GENERATE 10-50 $ IN PTR host-$.exemple.fr.
; Décalage et format : ${offset,largeur,base} → dhcp-001 … dhcp-100 pour .101-.200
$GENERATE 101-200 dhcp-${-100,3,d} IN A 10.0.40.$
```

## $INCLUDE

```dns
$INCLUDE /etc/bind/zones/inc/mx-communs.inc
```

Pratique pour partager des enregistrements (MX, SPF) entre plusieurs zones.

## Vérifier et charger

```bash
sudo named-checkzone exemple.fr /etc/bind/zones/db.exemple.fr
sudo named-checkzone 20.0.10.in-addr.arpa /etc/bind/zones/db.10.0.20
sudo rndc reload exemple.fr          # recharge une seule zone
sudo rndc zonestatus exemple.fr      # serial chargé, type, fichiers, prochain refresh
dig @localhost exemple.fr SOA +short
dig @localhost exemple.fr ANY +norec  # les serveurs modernes répondent de façon minimale à ANY (RFC 8482)
dig @localhost -x 10.0.20.10 +short
```

## Bonnes pratiques

> [!TIP]
> - **Deux serveurs autoritaires minimum**, sur des réseaux et opérateurs différents (RFC 2182).
> - Baisser le TTL d'un enregistrement **plusieurs heures avant** une migration (au moins l'ancien TTL), puis le remonter.
> - TTL de référence : 3600 s pour la plupart des enregistrements, 300 s pour ce qui peut basculer, 86400 s pour les NS et enregistrements stables.
> - Toujours créer les **PTR** des serveurs de messagerie et des serveurs exposés (les serveurs SMTP distants les vérifient).
> - Publier **SPF, DKIM et DMARC**, et `v=spf1 -all` + `p=reject` sur les domaines qui n'envoient jamais de courriel.
> - Ajouter un enregistrement **CAA** pour limiter les autorités de certification.
> - Versionner les fichiers de zone et automatiser l'incrément du serial.
