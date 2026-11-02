---
title: Amavis (amavisd-new)
description: Amavis (amavisd-new, GPL) — interface de filtrage du courrier entre le MTA et les analyseurs : SpamAssassin, ClamAV, DKIM, quarantaine ; installation Debian/Ubuntu (paquet amavisd-new) et RHEL (EPEL amavis), intégration Postfix (content_filter, master.cf ports 10024/10025), fichiers /etc/amavis/conf.d, activation antivirus et antispam, signature DKIM (amavisd-new genrsa, testkeys), libération de quarantaine, comparaison avec Rspamd et dépannage.
tags: [amavis, amavisd-new, spamassassin, clamav, postfix, antispam, antivirus]
icon: filter
---

**Amavis** (*amavisd-new*, GPL) est un démon en Perl placé entre [[01-postfix/01-presentation|Postfix]] et les moteurs d'analyse : il fait examiner chaque message par [[01-presentation-installation|SpamAssassin]] et un antivirus (ClamAV), ajoute les en-têtes de score, met en **quarantaine** ou rejette, et peut signer en **DKIM**. C'est l'architecture historique de nombreuses suites (iRedMail, anciennes installations ISPConfig). Pour un nouveau serveur, [[04-rspamd/01-presentation-installation|Rspamd]] est plus rapide et plus complet.

## Installation

```bash
sudo apt install -y amavisd-new spamassassin clamav-daemon clamav-freshclam pyzor razor arj cabextract lhasa unrar-free p7zip-full
sudo usermod -aG amavis clamav && sudo usermod -aG clamav amavis
# selon la version de Debian/Ubuntu, le paquet peut se nommer « amavis » ; RHEL / Rocky : sudo dnf install -y epel-release && sudo dnf install -y amavis spamassassin clamd clamav-update
```

Activer les analyses dans `/etc/amavis/conf.d/15-content_filter_mode` (Debian) :

```perl
use strict;
@bypass_virus_checks_maps = (\%bypass_virus_checks, \@bypass_virus_checks_acl, \$bypass_virus_checks_re);
@bypass_spam_checks_maps  = (\%bypass_spam_checks,  \@bypass_spam_checks_acl,  \$bypass_spam_checks_re);
1;
```

Réglages locaux dans `/etc/amavis/conf.d/50-user` :

```perl
use strict;
$myhostname = 'mail.corp.exemple.fr';
@local_domains_acl = ( ".corp.exemple.fr" );
$sa_tag_level_deflt  = -999;   # en-têtes ajoutés à tous les messages
$sa_tag2_level_deflt = 6.0;    # marqué comme spam
$sa_kill_level_deflt = 15.0;   # action « spam » (quarantaine ou rejet)
$final_spam_destiny  = D_DISCARD;
$final_virus_destiny = D_DISCARD;
1;
```

## Intégration à Postfix

`/etc/postfix/main.cf` :

```text
content_filter = smtp-amavis:[127.0.0.1]:10024
```

`/etc/postfix/master.cf` :

```text
smtp-amavis unix -    -    n    -    2    smtp
  -o smtp_data_done_timeout=1200
  -o smtp_send_xforward_command=yes
  -o disable_dns_lookups=yes
  -o max_use=20
127.0.0.1:10025 inet n -    n    -    -    smtpd
  -o content_filter=
  -o local_recipient_maps=
  -o relay_recipient_maps=
  -o smtpd_restriction_classes=
  -o smtpd_client_restrictions=
  -o smtpd_helo_restrictions=
  -o smtpd_sender_restrictions=
  -o smtpd_recipient_restrictions=permit_mynetworks,reject
  -o mynetworks=127.0.0.0/8
  -o receive_override_options=no_header_body_checks,no_unknown_recipient_checks
```

```bash
sudo systemctl restart amavis clamav-daemon postfix
```

Le message passe : Postfix (25) → Amavis (10024) → analyses → Postfix (10025) → livraison.

## DKIM, quarantaine

```bash
sudo amavisd-new genrsa /var/lib/amavis/dkim/corp.exemple.fr.pem 2048
# dans 50-user : $enable_dkim_signing = 1; dkim_key('corp.exemple.fr', 'dkim', '/var/lib/amavis/dkim/corp.exemple.fr.pem');
sudo amavisd-new showkeys        # enregistrement TXT à publier (dkim._domainkey.corp.exemple.fr)
sudo amavisd-new testkeys        # vérifie la publication DNS
sudo amavisd-release spam-AbCdEf123456.gz     # libère un message mis en quarantaine
```

## Dépannage

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| Messages bloqués « Connection refused » vers 10024 | Amavis arrêté ou trop lent | `systemctl status amavis`, journaux, nombre de processus (`$max_servers` et `maxproc` de `master.cf` identiques) |
| Aucun en-tête `X-Spam-*` | Analyse antispam désactivée | Décommenter `@bypass_spam_checks_maps` |
| Antivirus en erreur | ClamAV sans base ou droits sur les fichiers temporaires | `freshclam`, groupes `amavis`/`clamav` |
| Charge élevée | Gros volumes | Passer à [[04-rspamd/01-presentation-installation\|Rspamd]] |

Journaux : `/var/log/mail.log` (préfixe `amavis[...]`). Commandes : [[90-aide-memoire|aide-mémoire]].
