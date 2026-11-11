---
title: DKIM, DMARC, ARC, SPF et greylisting — aide-mémoire
description: Commandes et réglages d'OpenDKIM (génération de clés, testkey), OpenDMARC, OpenARC, policyd-spf et Postgrey, branchement dans Postfix (milters et services de politique) et tests.
tags: [aide-mémoire, opendkim, opendmarc, openarc, policyd-spf, postgrey, postfix]
icon: terminal
---

Explications : [[01-opendkim-opendmarc-openarc|OpenDKIM, OpenDMARC, OpenARC]] · [[02-policyd-spf-postgrey|policyd-spf, Postgrey]].

## Ports et sockets conseillés

| Service | Socket | Branchement Postfix |
| --- | --- | --- |
| OpenDKIM | `inet:8891@localhost` | `smtpd_milters`, `non_smtpd_milters` |
| OpenDMARC | `inet:8893@localhost` | `smtpd_milters` (après OpenDKIM) |
| OpenARC | `inet:8894@localhost` | `smtpd_milters` |
| policyd-spf | `unix:private/policyd-spf` (master.cf) | `check_policy_service` |
| Postgrey | `inet:127.0.0.1:10023` | `check_policy_service` |

## Commandes

```bash
sudo opendkim-genkey -b 2048 -d exemple.fr -s s2026 -D /etc/opendkim/keys/exemple.fr
sudo opendkim-testkey -d exemple.fr -s s2026 -vvv
dig +short TXT s2026._domainkey.exemple.fr ; dig +short TXT _dmarc.exemple.fr ; dig +short TXT exemple.fr
sudo postconf -e "smtpd_milters = inet:localhost:8891, inet:localhost:8893" "non_smtpd_milters = inet:localhost:8891" "milter_default_action = accept"
sudo postconf smtpd_recipient_restrictions
sudo systemctl restart opendkim opendmarc postgrey && sudo systemctl reload postfix
grep -E "opendkim|opendmarc|policyd-spf|postgrey" /var/log/mail.log | tail -20
swaks --to test@exemple.org --from alice@exemple.fr --server localhost
```
