---
title: BIND 9 — aide-mémoire des commandes
description: Commandes BIND 9 avec exemples — service named, vérification (named-checkconf, named-checkzone), rndc (reload, reconfig, flush, freeze/thaw, sync, dumpdb, querylog, status, retransfer), mises à jour dynamiques (nsupdate avec TSIG), clés (tsig-keygen, rndc-confgen), DNSSEC (dnssec-policy, rndc dnssec -status, dnssec-keygen), requêtes de test (dig, delv, host), transferts de zone, statistiques et journaux.
tags: [aide-mémoire, bind9, named, rndc, dig, nsupdate, dnssec]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|BIND 9]]. Sous RHEL, le service s'appelle `named` et la configuration est dans `/etc/named.conf` ; sous Debian, `named` (paquet `bind9`) et `/etc/bind/`.

## Service et vérifications

```bash
sudo systemctl status named
sudo named-checkconf                                  # syntaxe de named.conf (silencieux si OK)
sudo named-checkconf -z                               # + chargement de toutes les zones
sudo named-checkzone exemple.fr /var/lib/bind/db.exemple.fr
sudo named-checkzone -D -o - exemple.fr db.exemple.fr # zone normalisée
named -V                                              # version et options de compilation
```

## rndc

```bash
sudo rndc status
sudo rndc reload                         # recharger configuration et zones modifiées
sudo rndc reload exemple.fr              # une zone
sudo rndc reconfig                       # nouvelle configuration, nouvelles zones seulement
sudo rndc flush                          # vider tout le cache
sudo rndc flushname www.exemple.com      # un nom
sudo rndc flushtree exemple.com          # un nom et ses sous-domaines
sudo rndc freeze exemple.fr              # suspendre les mises à jour dynamiques (avant édition manuelle)
sudo rndc thaw exemple.fr                # reprendre (relit le fichier)
sudo rndc sync -clean exemple.fr         # écrire le journal .jnl dans le fichier de zone
sudo rndc retransfer exemple.fr          # secondaire : retransfert complet
sudo rndc notify exemple.fr              # primaire : notifier les secondaires
sudo rndc querylog on                    # journaliser les requêtes (temporairement)
sudo rndc dumpdb -cache                  # cache dans named_dump.db
sudo rndc stats                          # statistiques dans named.stats
sudo rndc zonestatus exemple.fr
sudo rndc addzone nouvelle.fr '{ type primary; file "/var/lib/bind/db.nouvelle.fr"; };'   # avec allow-new-zones yes
```

## Requêtes de test

```bash
dig @10.0.10.53 www.exemple.fr A
dig @10.0.10.53 exemple.fr MX +short
dig @10.0.10.53 exemple.fr SOA +multiline
dig -x 10.0.30.10 @10.0.10.53                 # inverse
dig exemple.fr NS +trace                     # résolution depuis la racine
dig @ns1.exemple.fr exemple.fr AXFR          # transfert de zone (doit être refusé hors secondaires)
dig @10.0.10.53 exemple.fr DNSKEY +dnssec +multiline
dig @10.0.10.53 www.exemple.fr +dnssec        # drapeau ad = validé
delv @10.0.10.53 www.exemple.fr               # validation DNSSEC détaillée
host -t TXT exemple.fr 10.0.10.53
dig +tcp @10.0.10.53 exemple.fr ANY           # forcer TCP
dig @10.0.10.53 version.bind CHAOS TXT        # version annoncée (à masquer)
```

## Mises à jour dynamiques

```bash
tsig-keygen -a hmac-sha256 cle-ddns > /etc/bind/cle-ddns.key
nsupdate -k /etc/bind/cle-ddns.key <<'EOF'
server 10.0.10.53
zone exemple.fr
update delete test.exemple.fr A
update add test.exemple.fr 300 A 10.0.30.50
send
EOF
nsupdate -l                                   # en local avec la clé de session (session.key)
```

## DNSSEC

```bash
# Signature automatique : dans la zone, dnssec-policy default; inline-signing yes;
sudo rndc dnssec -status exemple.fr
sudo rndc dnssec -checkds -key 12345 published exemple.fr    # après publication du DS chez le registre
sudo rndc signing -list exemple.fr
dig @10.0.10.53 exemple.fr DS +short
dnssec-dsfromkey /var/cache/bind/Kexemple.fr.+013+12345.key   # DS à transmettre au registre
```

## Clés et contrôle

```bash
sudo rndc-confgen -a                 # crée rndc.key
tsig-keygen -a hmac-sha256 transfert-ns2    # clé pour les transferts primaire/secondaire
```

## Journaux et statistiques

```bash
sudo journalctl -u named -f
sudo tail -f /var/log/named/query.log
curl -s http://127.0.0.1:8053/json/v1/server | jq .   # statistics-channels { inet 127.0.0.1 port 8053; };
```
