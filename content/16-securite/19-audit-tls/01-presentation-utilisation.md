---
title: Présentation, installation et utilisation
description: Auditer la configuration TLS — testssl.sh (GPL, Bash et OpenSSL : protocoles SSL/TLS, suites, ordre, PFS, en-têtes HSTS, certificat et chaîne, OCSP, vulnérabilités Heartbleed, ROBOT, POODLE, LUCKY13, STARTTLS pour SMTP, IMAP, LDAP, RDP ; sorties JSON, CSV, HTML ; Docker) et SSLyze (AGPL, Python : analyse rapide et scriptable, vérification de conformité au profil Mozilla, intégration CI), installation Linux, macOS, Windows, lecture des résultats et corrections (recommandations ANSSI et Mozilla).
tags: [testssl.sh, sslyze, tls, audit, certificats, chiffrement, conformité]
icon: info
---

Ces outils vérifient qu'un serveur n'accepte que des **protocoles** et **suites de chiffrement** robustes, que son **certificat** est valide et complet, et qu'il n'est pas vulnérable aux attaques TLS connues. À lancer après chaque changement de configuration et périodiquement sur les services exposés.

| | **testssl.sh** | **SSLyze** |
| --- | --- | --- |
| Langage | Bash + OpenSSL (aucune dépendance Python) | Python |
| Points forts | Très complet, rapport lisible, STARTTLS de nombreux protocoles | Rapide, API Python, **vérification de conformité** (profil Mozilla) en CI |

## Installation

```bash
git clone --depth 1 https://github.com/testssl/testssl.sh.git && cd testssl.sh && ./testssl.sh --version   # Linux, macOS, WSL ; Docker : drwetter/testssl.sh
pipx install sslyze                         # Linux, macOS, Windows
sudo apt install testssl.sh                 # paquet Debian/Ubuntu (version parfois plus ancienne)
```

## testssl.sh

```bash
./testssl.sh https://intranet.corp.exemple.fr
./testssl.sh --severity MEDIUM --htmlfile rapport.html --jsonfile rapport.json intranet.corp.exemple.fr:443
./testssl.sh --starttls smtp smtp.corp.exemple.fr:25
./testssl.sh --starttls ldap dc01.corp.exemple.fr:389 ; ./testssl.sh dc01.corp.exemple.fr:636
./testssl.sh --file cibles.txt --parallel --csvfile parc.csv
./testssl.sh -p -s -f -h intranet.corp.exemple.fr    # protocoles, suites, PFS, en-têtes seulement
```

## SSLyze

```bash
sslyze intranet.corp.exemple.fr:443 smtp.corp.exemple.fr:587 --starttls=auto
sslyze --mozilla_config=intermediate intranet.corp.exemple.fr     # code de sortie ≠ 0 si non conforme (CI)
sslyze --json_out=resultats.json --targets_in=cibles.txt
```

## Corriger

- Désactiver SSLv3, TLS 1.0 et 1.1 ; garder TLS 1.2 (suites ECDHE + AES-GCM ou ChaCha20) et TLS 1.3.
- Chaîne de certificats complète, clé RSA 2048+ ou ECDSA P-256, HSTS sur les sites publics.
- Modèles de configuration : générateur Mozilla SSL Configuration (NGINX, Apache, HAProxy…) ; voir aussi [[03-nginx/04-https-tls|NGINX]] et [[01-haproxy/05-tls|HAProxy]].

Commandes : [[90-aide-memoire|aide-mémoire]].
