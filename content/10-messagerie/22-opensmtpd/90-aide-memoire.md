---
title: OpenSMTPD — aide-mémoire des commandes
description: Commandes OpenSMTPD avec exemples — vérification de configuration (smtpd -n), smtpctl (show queue, show stats, schedule, remove, pause, resume, encrypt, trace), services sous OpenBSD et Linux, journaux et test d'envoi.
tags: [aide-mémoire, opensmtpd, smtpctl, smtp]
icon: terminal
---

Explications : [[01-presentation-configuration|OpenSMTPD]].

```bash
sudo smtpd -n
sudo smtpd -dv                                  # premier plan, verbeux (diagnostic)
sudo rcctl enable smtpd && sudo rcctl restart smtpd        # OpenBSD
sudo systemctl restart opensmtpd                           # Linux
sudo smtpctl show queue ; sudo smtpctl show stats
sudo smtpctl schedule all
sudo smtpctl pause mta ; sudo smtpctl resume mta
sudo smtpctl remove all
sudo smtpctl encrypt
sudo smtpctl update table aliases               # après modification d'une table
echo "Test depuis srv-mail-01" | mail -s "Test OpenSMTPD" jk@corp.exemple.fr
sudo tail -f /var/log/maillog
```
