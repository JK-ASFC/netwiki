---
title: TLS, DANE et MTA-STS
description: Chiffrer les échanges SMTP avec Postfix — certificats (Let's Encrypt, chaînes), TLS opportuniste en réception et en émission, protocoles et journalisation, TLS obligatoire par destination, DANE (TLSA + DNSSEC), MTA-STS en émission (résolveur de politiques) et en réception (publication), rapports TLS-RPT.
tags: [postfix, tls, starttls, dane, tlsa, mta-sts, tls-rpt, certificat]
icon: lock
---

## Certificats

```postfix /etc/postfix/main.cf
# Clé et chaîne dans un seul paramètre (Postfix ≥ 3.4) ; plusieurs paires possibles (RSA + ECDSA)
smtpd_tls_chain_files =
    /etc/letsencrypt/live/mx1.exemple.fr/privkey.pem,
    /etc/letsencrypt/live/mx1.exemple.fr/fullchain.pem
```

```bash /etc/letsencrypt/renewal-hooks/deploy/postfix.sh
#!/bin/sh
systemctl reload postfix
```

Le certificat doit couvrir `myhostname` (nom du MX) et les noms utilisés par les clients (`smtp.exemple.fr`).

## Réception (smtpd)

```postfix
smtpd_tls_security_level = may              # port 25 : TLS proposé, pas exigé (RFC 3207)
smtpd_tls_protocols = >=TLSv1.2
smtpd_tls_mandatory_protocols = >=TLSv1.2
smtpd_tls_mandatory_ciphers = high
smtpd_tls_loglevel = 1
smtpd_tls_received_header = yes             # version TLS dans l'en-tête Received
smtpd_tls_session_cache_database = lmdb:${data_directory}/smtpd_scache
```

> [!IMPORTANT]
> Sur le port **25**, gardez `may` : exiger TLS (`encrypt`) ferait rejeter les serveurs légitimes qui ne le gèrent pas. Le TLS est **obligatoire** sur `submission`/`submissions` (voir [[04-domaines-virtuels-dovecot]]).

## Émission (smtp)

```postfix
smtp_tls_security_level = may               # TLS opportuniste vers les autres serveurs
smtp_tls_protocols = >=TLSv1.2
smtp_tls_loglevel = 1
smtp_tls_session_cache_database = lmdb:${data_directory}/smtp_scache
smtp_tls_CAfile = /etc/ssl/certs/ca-certificates.crt
```

### TLS obligatoire pour certains partenaires

```postfix
smtp_tls_policy_maps = lmdb:/etc/postfix/politique_tls
```

```text /etc/postfix/politique_tls
partenaire.fr          secure match=.partenaire.fr
banque.example         encrypt
[relais.corp.exemple.fr]:25   verify match=relais.corp.exemple.fr
```

| Niveau | Effet |
| --- | --- |
| `none` | Pas de TLS |
| `may` | TLS si disponible, certificat non vérifié |
| `encrypt` | TLS obligatoire, certificat non vérifié |
| `dane` | DANE si des enregistrements TLSA DNSSEC existent, sinon `may` |
| `verify` / `secure` | TLS obligatoire et certificat vérifié (nom) |

## DANE

DANE publie l'empreinte du certificat du MX dans le DNS (**TLSA**), protégée par **DNSSEC** : l'émetteur sait que TLS est obligatoire et quel certificat attendre.

### Émission avec DANE

```postfix
smtp_dns_support_level = dnssec
smtp_tls_security_level = dane
```

Nécessite un **résolveur local validant** (Unbound sur le serveur) — voir [[02-unbound/01-presentation-installation|Unbound]].

### Publier DANE pour son MX

```bash
# Empreinte SHA-256 de la clé publique (type 3 1 1 : certificat du serveur, clé publique, SHA-256)
openssl x509 -in /etc/letsencrypt/live/mx1.exemple.fr/cert.pem -noout -pubkey \
  | openssl pkey -pubin -outform DER | openssl dgst -sha256 -binary | xxd -p -c 64
```

```dns
_25._tcp.mx1.exemple.fr. 3600 IN TLSA 3 1 1 8f3b0c…e41a
```

Avec Let's Encrypt, **réutilisez la clé** au renouvellement (`--reuse-key`) ou publiez à l'avance l'empreinte de la clé suivante, sinon le TLSA ne correspond plus. La zone doit être signée ([[01-bind9/07-dnssec|DNSSEC]]).

## MTA-STS

Alternative à DANE sans DNSSEC : la politique est publiée en **HTTPS**.

### Publier une politique (réception)

```dns
_mta-sts.exemple.fr.   TXT "v=STSv1; id=20251029"
_smtp._tls.exemple.fr. TXT "v=TLSRPTv1; rua=mailto:tls-rapports@exemple.fr"
```

```text https://mta-sts.exemple.fr/.well-known/mta-sts.txt
version: STSv1
mode: enforce
mx: mx1.exemple.fr
mx: mx2.exemple.fr
max_age: 604800
```

Commencez par `mode: testing` et analysez les rapports TLS-RPT ; changez l'`id` à chaque modification de la politique.

### Appliquer MTA-STS en émission

Postfix ne gère pas MTA-STS nativement ; on utilise un serveur de politiques comme **postfix-mta-sts-resolver** :

```bash
sudo apt install postfix-mta-sts-resolver
sudo systemctl enable --now postfix-mta-sts-resolver
```

```postfix
smtp_tls_policy_maps = socketmap:inet:127.0.0.1:8461:postfix
```

## Vérifier

```bash
posttls-finger -t30 -T180 -c -L verbose,summary gmail.com     # TLS vers un domaine (outil Postfix)
openssl s_client -starttls smtp -connect mx1.exemple.fr:25 -servername mx1.exemple.fr </dev/null
grep "TLS connection established" /var/log/mail.log | tail
```

Des services en ligne (Internet.nl, testeurs MTA-STS/DANE) vérifient la configuration vue de l'extérieur.
