---
title: Mises à jour dynamiques (DDNS) et nsupdate
description: Zones dynamiques RFC 2136, allow-update vs update-policy, clés TSIG par usage, nsupdate en ligne de commande et en script, journaux .jnl, rndc freeze/thaw/sync, intégration ISC DHCP et Kea, mises à jour GSS-TSIG pour Active Directory.
tags: [bind9, ddns, nsupdate, tsig, update-policy, dhcp, dynamique]
icon: refresh-ccw
---

## Principe

Une zone **dynamique** accepte des modifications à chaud via le protocole **UPDATE** (RFC 2136), sans éditer de fichier ni recharger. Usages : enregistrement automatique des clients DHCP, Let's Encrypt (défi DNS-01), automatisation (Ansible, Terraform), clients qui mettent à jour leur propre adresse.

BIND écrit chaque modification dans un **journal** `<fichier>.jnl`, puis le fusionne périodiquement dans le fichier de zone.

## Autoriser les mises à jour

### allow-update (simple)

```named
zone "dyn.exemple.fr" {
    type primary;
    file "/var/lib/bind/db.dyn.exemple.fr";
    allow-update { key "ddns-admin"; };
};
```

Tout détenteur de la clé peut modifier **n'importe quel** enregistrement de la zone.

### update-policy (fin)

```named
zone "exemple.fr" {
    type primary;
    file "/var/lib/bind/db.exemple.fr";
    update-policy {
        // Le DHCP peut tout gérer sous dhcp.exemple.fr (A, TXT, DHCID…)
        grant ddns-dhcp subdomain dhcp.exemple.fr. ANY;
        // L'outil ACME ne peut créer que des TXT _acme-challenge
        grant acme-key name _acme-challenge.exemple.fr. TXT;
        grant acme-key wildcard *._acme-challenge.exemple.fr. TXT;   // sous-domaines (9.20 : préférer « subdomain »)
        // Chaque hôte ne peut modifier que son propre nom (clé nommée comme l'hôte)
        grant * self * A AAAA;
        // Ansible gère toute la zone
        grant ansible-key zonesub ANY;
    };
};
```

| Type de règle | Portée |
| --- | --- |
| `name` | Exactement ce nom |
| `subdomain` | Ce nom et tout ce qui est en dessous |
| `zonesub` | Toute la zone (équivaut à `subdomain` du nom de zone) |
| `wildcard` | Noms correspondant au motif |
| `self` | Le nom égal au nom de la clé |
| `selfsub` / `selfwild` | Sous-domaines du nom de la clé |
| `tcp-self` / `6to4-self` | Basé sur l'IP source (PTR) |
| `krb5-self`, `ms-self`, `krb5-subdomain`, `ms-subdomain` | Identité Kerberos (GSS-TSIG) d'un poste Windows / Kerberos |

> [!IMPORTANT]
> Avec `update-policy`, BIND considère la zone comme **dynamique** : n'éditez plus le fichier à la main pendant que le serveur tourne (voir *freeze/thaw* ci-dessous). Placez la zone dans un dossier où `named` peut écrire (`/var/lib/bind` sous Debian, `/var/named/dynamic` sous RHEL).

## Créer les clés

```bash
tsig-keygen -a hmac-sha256 ddns-dhcp   > /etc/bind/keys/ddns-dhcp.key
tsig-keygen -a hmac-sha256 acme-key    > /etc/bind/keys/acme-key.key
tsig-keygen -a hmac-sha256 ansible-key > /etc/bind/keys/ansible-key.key
chown root:bind /etc/bind/keys/*.key && chmod 640 /etc/bind/keys/*.key
```

Une clé **par usage** : on peut en révoquer une sans impacter les autres, et les journaux indiquent quelle clé a fait quoi.

## nsupdate

### Interactif / script

```bash
nsupdate -k /etc/bind/keys/ansible-key.key <<'EOF'
server 10.0.20.53
zone exemple.fr
update delete test.exemple.fr. A
update add test.exemple.fr. 300 IN A 10.0.20.99
update add test.exemple.fr. 300 IN TXT "créé par nsupdate"
show
send
EOF
```

### Commandes nsupdate

| Commande | Effet |
| --- | --- |
| `server <ip> [port]` | Serveur cible (sinon le primaire du SOA) |
| `zone <zone>` | Zone à modifier |
| `update add <nom> <ttl> <classe> <type> <données>` | Ajouter |
| `update delete <nom> [type] [données]` | Supprimer (tout le nom, un type, ou une valeur précise) |
| `prereq nxdomain <nom>` / `prereq yxdomain <nom>` | Condition : le nom ne doit pas / doit exister |
| `prereq nxrrset` / `yxrrset` | Condition sur un type d'enregistrement |
| `show` | Afficher la mise à jour en préparation |
| `send` | Envoyer (transaction atomique) |
| `answer` | Afficher la réponse du serveur |
| `key <algo>:<nom> <secret>` | Clé en ligne |
| `gsstsig` | Utiliser Kerberos (Active Directory) |

```bash
# Mise à jour locale avec la clé de session auto-générée (exécuté sur le serveur lui-même)
sudo nsupdate -l <<'EOF'
zone exemple.fr
update add tmp.exemple.fr 60 A 10.0.20.200
send
EOF
```

`nsupdate -l` utilise la clé `/run/named/session.key` ; il faut autoriser `local` dans la politique : `update-policy local;` ou `grant local-ddns zonesub any;`.

## Éditer manuellement une zone dynamique

```bash
sudo rndc freeze exemple.fr      # fusionne le journal dans le fichier, suspend les mises à jour
sudo vi /var/lib/bind/db.exemple.fr   # incrémenter le serial !
sudo rndc thaw exemple.fr        # recharge le fichier et réactive les mises à jour

sudo rndc sync -clean exemple.fr # fusionne le journal dans le fichier et supprime le .jnl (sans suspendre)
named-journalprint /var/lib/bind/db.exemple.fr.jnl   # lire le journal
```

> [!WARNING]
> Éditer le fichier d'une zone dynamique **sans freeze** : vos modifications seront écrasées, ou BIND refusera de charger la zone (« journal out of sync with zone ») au prochain démarrage. En cas de problème : `rndc freeze`, supprimer le `.jnl`, `rndc thaw`.

## Intégration avec ISC DHCP

Côté BIND, une clé et une politique ; côté `dhcpd.conf` :

```dhcpd
ddns-update-style standard;
ddns-domainname "dhcp.exemple.fr.";
ddns-rev-domainname "in-addr.arpa.";
update-static-leases on;

key ddns-dhcp {
    algorithm hmac-sha256;
    secret "c2VjcmV0LWV4ZW1wbGUtYmFzZTY0LWRlLTMyLW9jdGV0cw==";
};
zone dhcp.exemple.fr. {
    primary 10.0.20.53;
    key ddns-dhcp;
}
zone 40.0.10.in-addr.arpa. {
    primary 10.0.20.53;
    key ddns-dhcp;
}
```

Détails, gestion des conflits (enregistrements DHCID) et options : voir [[01-isc-dhcp/07-ddns-bind|DDNS avec BIND dans ISC DHCP]].

### Avec Kea (kea-dhcp-ddns)

```json
{
  "DhcpDdns": {
    "ip-address": "127.0.0.1",
    "port": 53001,
    "tsig-keys": [ { "name": "ddns-dhcp", "algorithm": "HMAC-SHA256", "secret": "c2VjcmV0..." } ],
    "forward-ddns": { "ddns-domains": [ { "name": "dhcp.exemple.fr.", "key-name": "ddns-dhcp",
        "dns-servers": [ { "ip-address": "10.0.20.53" } ] } ] },
    "reverse-ddns": { "ddns-domains": [ { "name": "40.0.10.in-addr.arpa.", "key-name": "ddns-dhcp",
        "dns-servers": [ { "ip-address": "10.0.20.53" } ] } ] }
  }
}
```

## GSS-TSIG (mises à jour sécurisées Kerberos)

Permet aux postes Windows du domaine de mettre à jour BIND de manière sécurisée, comme avec un DNS Windows.

```named
options {
    tkey-gssapi-keytab "/etc/bind/dns.keytab";   // keytab du principal DNS/ns1.corp.local@CORP.LOCAL
};
zone "corp.exemple.fr" {
    type primary;
    file "/var/lib/bind/db.corp.exemple.fr";
    update-policy {
        grant CORP.LOCAL ms-self corp.exemple.fr A AAAA;          // chaque machine son propre nom
        grant "admin-dns@CORP.LOCAL" zonesub ANY;
    };
};
```

> [!NOTE]
> Dans un environnement Active Directory, la solution la plus simple reste souvent de laisser le DNS AD gérer la zone AD et de configurer BIND en **redirection conditionnelle** vers les contrôleurs de domaine. La forme intégrée **Samba AD + BIND9_DLZ** est une autre option.

## Let's Encrypt (défi DNS-01) avec certbot

```ini /etc/letsencrypt/rfc2136.ini
dns_rfc2136_server = 10.0.20.53
dns_rfc2136_port = 53
dns_rfc2136_name = acme-key
dns_rfc2136_secret = bWEtY2xlLWFjbWUtYmFzZTY0Li4u
dns_rfc2136_algorithm = HMAC-SHA256
```

```bash
sudo apt install python3-certbot-dns-rfc2136
sudo certbot certonly --dns-rfc2136 --dns-rfc2136-credentials /etc/letsencrypt/rfc2136.ini -d '*.exemple.fr' -d exemple.fr
```

## Dépannage

| Message (client ou journal) | Cause |
| --- | --- |
| `update failed: REFUSED` | Clé non autorisée par la politique, ou IP refusée |
| `tsig verify failure (BADSIG)` | Secret différent entre client et serveur |
| `tsig verify failure (BADTIME)` | Horloges décalées de plus de 5 minutes (NTP !) |
| `update failed: NOTAUTH` | Le serveur interrogé n'est pas primaire pour la zone |
| `update failed: YXDOMAIN` / `NXRRSET` | Prérequis (`prereq`) non satisfait |
| `journal file … out of sync with zone` | Fichier de zone modifié sans freeze |
| `permission denied` sur `.jnl` | Dossier non inscriptible (AppArmor / SELinux / droits) |

```bash
sudo rndc trace 3 && journalctl -u named -f     # augmenter temporairement le niveau de debug
sudo rndc notrace
```
