---
title: policyd-spf et Postgrey
description: Deux services de politique Postfix — policyd-spf (postfix-policyd-spf-python : vérification SPF en réception, policyd-spf.conf, rejet sur Fail, en-tête Received-SPF, master.cf et smtpd_recipient_restrictions) et Postgrey (greylisting : principe, options de délai et de durée, listes blanches de clients et de destinataires, statistiques, inconvénients avec les grands fournisseurs) ; ordre des restrictions et dépannage.
tags: [policyd-spf, spf, postgrey, greylisting, postfix, anti-spam, policy service]
icon: shield-check
---

Un **service de politique** (*policy service*) est consulté par Postfix pendant la conversation SMTP, avant l'acceptation du message ; il répond d'accepter, de refuser ou de différer. Les restrictions Postfix sont détaillées dans la page [[01-postfix/07-anti-spam-restrictions|anti-spam et restrictions]].

## policyd-spf : vérifier SPF

```bash
sudo apt install postfix-policyd-spf-python
```

```text /etc/postfix-policyd-spf-python/policyd-spf.conf
debugLevel = 1
TestOnly = 1
HELO_reject = Fail
Mail_From_reject = Fail
PermError_reject = False
TempError_Defer = False
skip_addresses = 127.0.0.0/8,::ffff:127.0.0.0/104,::1
```

| Réglage | Rôle |
| --- | --- |
| `Mail_From_reject = Fail` | Refuser quand le SPF de l'expéditeur échoue (`-all`) |
| `HELO_reject` | Même chose pour le nom annoncé au HELO |
| `PermError_reject` | Refuser si l'enregistrement SPF est invalide (déconseillé : beaucoup d'erreurs chez des expéditeurs légitimes) |
| `skip_addresses` | Clients non vérifiés (local, relais internes) |

```text /etc/postfix/master.cf
policyd-spf  unix  -  n  n  -  0  spawn
    user=policyd-spf argv=/usr/bin/policyd-spf
```

```bash
sudo postconf -e "policyd-spf_time_limit = 3600"
sudo postconf -e "smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination, check_policy_service unix:private/policyd-spf"
sudo systemctl reload postfix
```

Le service ajoute un en-tête `Received-SPF` exploité ensuite par OpenDMARC ou les filtres anti-spam.

> [!TIP]
> Avec DMARC, il vaut souvent mieux **ne pas rejeter** sur SPF seul (`Mail_From_reject = False`) et laisser DMARC décider, car le transfert de messages casse SPF sans que l'expéditeur soit en tort.

## Postgrey : le greylisting

Le **greylisting** répond « réessayez plus tard » (code 450) au premier message d'un triplet inconnu (adresse IP, expéditeur, destinataire). Un vrai serveur réessaie après quelques minutes et le message passe ; beaucoup de robots d'envoi de spam ne réessaient jamais.

```bash
sudo apt install postgrey
```

```text /etc/default/postgrey
POSTGREY_OPTS="--inet=127.0.0.1:10023 --delay=60 --max-age=35 --auto-whitelist-clients=5"
```

| Option | Rôle |
| --- | --- |
| `--delay=60` | Délai minimal avant d'accepter le nouvel essai (secondes) |
| `--max-age=35` | Jours avant d'oublier un triplet |
| `--auto-whitelist-clients=5` | Après 5 messages acceptés, le client n'est plus mis en attente |

```bash
sudo postconf -e "smtpd_recipient_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination, check_policy_service unix:private/policyd-spf, check_policy_service inet:127.0.0.1:10023"
sudo systemctl restart postgrey && sudo systemctl reload postfix
```

Listes blanches : `/etc/postgrey/whitelist_clients.local` (serveurs ou domaines d'envoi à ne jamais retarder), `/etc/postgrey/whitelist_recipients.local` (destinataires exemptés, par exemple `postmaster@`).

```bash
grep postgrey /var/log/mail.log | tail
sudo postgreyreport < /var/log/mail.log | head      # triplets jamais revenus (souvent du spam)
```

Inconvénients : retard des premiers messages (codes de validation, réinitialisations de mot de passe), et problèmes avec les grands fournisseurs qui réessaient depuis **une autre IP** de leur parc. Rspamd propose un greylisting plus fin (seulement pour les messages au score douteux).

Voir aussi : [[01-opendkim-opendmarc-openarc|OpenDKIM, OpenDMARC, OpenARC]]. Commandes : [[90-aide-memoire|aide-mémoire]].
