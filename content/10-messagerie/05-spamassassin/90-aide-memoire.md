---
title: SpamAssassin — aide-mémoire des commandes
description: Commandes SpamAssassin avec exemples — vérification (spamassassin --lint), mise à jour des règles (sa-update, sa-compile), analyse d'un message (spamassassin -t, spamc), apprentissage bayésien (sa-learn --spam/--ham, --dump magic, --sync), démon spamd, règles locales (local.cf), intégration Postfix (spamass-milter), journaux.
tags: [aide-mémoire, spamassassin, sa-learn, spamc, antispam, bayes]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|SpamAssassin]].

## Vérification et règles

```bash
spamassassin --lint                       # syntaxe des règles et de local.cf
spamassassin --lint -D 2>&1 | tail        # mode débogage
sudo sa-update && sudo sa-compile         # mettre à jour et compiler les règles
sudo sa-update --checkonly; echo $?       # 0 = mises à jour disponibles
spamassassin -V
sudo systemctl restart spamd              # Debian : spamd (anciennement spamassassin)
```

## Analyse d'un message

```bash
spamassassin -t < message.eml | grep -E "^X-Spam|Content analysis" -A 30
spamc -R < message.eml                    # rapport via le démon spamd
spamc -c < message.eml; echo $?           # score/seuil ; code 1 si spam
```

## Apprentissage bayésien

```bash
sa-learn --spam /var/mail/vhosts/exemple.fr/amartin/Maildir/.Junk/cur/
sa-learn --ham /var/mail/vhosts/exemple.fr/amartin/Maildir/cur/
sa-learn --spam --mbox spam.mbox
sa-learn --dump magic                     # nombre de messages appris (≥ 200 spam et 200 ham pour être actif)
sa-learn --sync
sa-learn --forget < faux-positif.eml
```

## Règles locales

```text
# /etc/spamassassin/local.cf
required_score 5.0
rewrite_header Subject [SPAM]
report_safe 0
use_bayes 1
bayes_auto_learn 1
whitelist_auth *@partenaire.fr
blacklist_from *@spam-connu.example
score URIBL_BLACK 4.0
header LOCAL_FACTURE_URGENTE Subject =~ /facture.*urgent/i
score LOCAL_FACTURE_URGENTE 2.5
describe LOCAL_FACTURE_URGENTE Objet typique d'hameçonnage
```

## Intégration Postfix (milter)

```bash
sudo apt install spamass-milter
sudo postconf -e 'smtpd_milters = unix:/spamass/spamass.sock' 'milter_default_action = accept'
sudo systemctl restart spamass-milter postfix
```

## Journaux

```bash
sudo journalctl -u spamd -f
grep spamd /var/log/mail.log | grep -E "result: Y" | tail
```
