---
title: Knot DNS, NSD et MaraDNS — aide-mémoire des commandes
description: Référence complète des commandes Knot DNS, NSD et MaraDNS avec exemples — Knot (installation, knotc : configuration à chaud, état et rechargement des zones, transactions de modification, lecture, signature, roulement et soumission de la KSK, sauvegarde et restauration, statistiques ; keymgr : clés DNSSEC, DS, TSIG ; kzonecheck, kjournalprint ; kdig : AXFR avec TSIG, DNSSEC, DoT, DoH, NSID), NSD (installation, nsd-control-setup, vérifications, zones ajoutées à chaud par motif, transferts, écriture, statistiques, journaux), MaraDNS et Deadwood (services, askmara) et tests communs.
tags: [aide-mémoire, knot dns, knotc, keymgr, kdig, nsd, nsd-control, maradns, deadwood, dns autoritaire]
icon: terminal
---

Références : [[01-knot-dns|Knot DNS]], [[02-nsd|NSD]], [[03-maradns|MaraDNS]]. Exemples : zone `corp.exemple.fr`, serveurs `ns1.corp.exemple.fr` (primaire) et `ns2.corp.exemple.fr`.

## Knot DNS : installation et service

```bash
sudo apt install knot knot-dnsutils                    # Debian / Ubuntu (kdig, khost dans knot-dnsutils)
sudo dnf install knot knot-utils                       # Fedora, RHEL avec EPEL
sudo systemctl enable --now knot
knotd --version
sudo knotc conf-check                                  # /etc/knot/knot.conf
sudo knotc status
sudo knotc reload
```

## Knot DNS : zones (knotc)

```bash
sudo knotc zone-status
sudo knotc zone-status corp.exemple.fr
sudo knotc zone-reload corp.exemple.fr
sudo knotc zone-refresh corp.exemple.fr                # secondaire : vérifier le SOA du primaire
sudo knotc zone-retransfer corp.exemple.fr             # secondaire : transfert complet
sudo knotc zone-notify corp.exemple.fr
sudo knotc zone-flush corp.exemple.fr                  # écrire la zone (journal → fichier)
sudo knotc zone-read corp.exemple.fr @ SOA
sudo knotc zone-read corp.exemple.fr www

# Modifier une zone par transaction (numéro de série incrémenté automatiquement)
sudo knotc zone-begin corp.exemple.fr
sudo knotc zone-set corp.exemple.fr www 300 CNAME srv-web-01
sudo knotc zone-set corp.exemple.fr srv-web-02 300 A 10.0.30.12
sudo knotc zone-unset corp.exemple.fr ancien A
sudo knotc zone-diff corp.exemple.fr                   # modifications en attente
sudo knotc zone-commit corp.exemple.fr                 # ou zone-abort pour annuler
```

## Knot DNS : configuration à chaud

```bash
sudo knotc conf-read 'zone[corp.exemple.fr]'
sudo knotc conf-begin
sudo knotc conf-set 'zone[labo.corp.exemple.fr]'
sudo knotc conf-set 'zone[labo.corp.exemple.fr].file' 'labo.corp.exemple.fr.zone'
sudo knotc conf-commit
```

## Knot DNS : DNSSEC et TSIG

```bash
sudo knotc zone-sign corp.exemple.fr                   # resigner maintenant (zone avec dnssec-signing: on)
sudo keymgr corp.exemple.fr list
sudo keymgr corp.exemple.fr ds                         # DS à publier chez le registre
sudo keymgr corp.exemple.fr dnskey
sudo knotc zone-key-rollover corp.exemple.fr ksk       # roulement anticipé de la KSK
sudo knotc zone-ksk-submitted corp.exemple.fr          # signaler que le nouveau DS est publié
keymgr -t transfert hmac-sha256                        # générer une clé TSIG (bloc de configuration affiché)
```

## Knot DNS : sauvegarde, outils hors ligne, statistiques

```bash
sudo knotc zone-backup +backupdir /srv/sauvegardes/knot-$(date +%F)
sudo knotc zone-restore +backupdir /srv/sauvegardes/knot-2026-11-15 corp.exemple.fr
kzonecheck -o corp.exemple.fr /var/lib/knot/corp.exemple.fr.zone
sudo kjournalprint /var/lib/knot/journal corp.exemple.fr         # modifications enregistrées
sudo knotc stats
sudo knotc zone-stats corp.exemple.fr
sudo journalctl -u knot -f
```

## kdig (client de Knot)

```bash
kdig @ns1.corp.exemple.fr corp.exemple.fr SOA +norecurse
kdig @ns1.corp.exemple.fr corp.exemple.fr AXFR -y hmac-sha256:transfert:c2VjcmV0LWJhc2U2NC1kZS1sYS1jbGUtdHNpZw==
kdig +dnssec +multi corp.exemple.fr DNSKEY
kdig @9.9.9.9 +tls-ca +tls-host=dns.quad9.net www.exemple.org      # DNS over TLS vérifié
kdig @9.9.9.9 +https www.exemple.org                                 # DNS over HTTPS
kdig @ns1.corp.exemple.fr +nsid corp.exemple.fr SOA
```

## NSD

```bash
sudo apt install nsd                                   # Debian / Ubuntu (RHEL : EPEL, FreeBSD : pkg install nsd)
sudo nsd-control-setup                                 # clés du canal de contrôle (une fois)
sudo nsd-checkconf /etc/nsd/nsd.conf
sudo nsd-checkzone corp.exemple.fr /etc/nsd/zones/corp.exemple.fr.zone
sudo systemctl enable --now nsd
sudo nsd-control status
sudo nsd-control reload                                # relire les fichiers de zone modifiés
sudo nsd-control reload corp.exemple.fr
sudo nsd-control reconfig                              # relire nsd.conf
sudo nsd-control zonestatus
sudo nsd-control zonestatus corp.exemple.fr
sudo nsd-control notify corp.exemple.fr
sudo nsd-control transfer corp.exemple.fr              # secondaire : vérifier et transférer si plus récent
sudo nsd-control force_transfer corp.exemple.fr        # secondaire : transfert complet
sudo nsd-control write                                 # écrire les zones transférées sur disque
# Zones ajoutées à chaud à partir d'un motif « pattern » de nsd.conf
sudo nsd-control addzone labo.corp.exemple.fr secondaires-corp
sudo nsd-control delzone labo.corp.exemple.fr
sudo nsd-control stats_noreset | grep -E "num.queries|num.rcode"
sudo nsd-control verbosity 2
sudo nsd-control log_reopen
# Secret TSIG (base64, 32 octets)
head -c 32 /dev/urandom | base64
```

## MaraDNS et Deadwood

```bash
sudo apt install maradns maradns-deadwood              # MaraDNS (autoritaire) et Deadwood (récursif)
sudo systemctl status maradns maradns-deadwood
sudo systemctl restart maradns
# Configuration dans /etc/maradns/ : mararc et zones csv2 (MaraDNS), dwood3rc (Deadwood)
askmara Asrv-test-01.labo.exemple.fr. 10.0.10.60       # question de type A (préfixe A, nom terminé par un point)
dig @10.0.10.60 srv-test-01.labo.exemple.fr +short
```

## Tests communs

```bash
dig @ns1.corp.exemple.fr corp.exemple.fr SOA +norecurse
for ns in ns1 ns2; do printf '%s ' $ns; dig +short @$ns.corp.exemple.fr corp.exemple.fr SOA | awk '{print $3}'; done
dig @ns1.corp.exemple.fr corp.exemple.fr AXFR             # doit être refusé sans clé
sudo ss -ulpn | grep ':53 '
```
