---
title: Webmin, Ajenti et Froxlor — aide-mémoire
description: Installation, ports et services de Webmin (10000, Usermin), Ajenti (8000) et Froxlor (cron de génération des configurations), et points de sécurité.
tags: [aide-mémoire, webmin, ajenti, froxlor, administration]
icon: terminal
---

Explications : [[01-webmin-ajenti-froxlor|Webmin, Ajenti et Froxlor]].

| Outil | Port | Service |
| --- | --- | --- |
| Webmin | 10000 | `webmin` |
| Usermin | 20000 | `usermin` |
| Ajenti | 8000 | `ajenti` |
| Froxlor | via le serveur web | cron `froxlor_master_cronjob.php` |

```bash
# Webmin
sudo apt install webmin --install-recommends
sudo systemctl status webmin
sudo /usr/share/webmin/changepass.pl /etc/webmin root 'NouveauMotDePasse'
# restreindre : /etc/webmin/miniserv.conf → allow= (réseaux autorisés)

# Ajenti
curl https://raw.githubusercontent.com/ajenti/ajenti/master/scripts/install.sh | sudo bash -s -
sudo systemctl status ajenti

# Froxlor
*/5 * * * * root /usr/bin/php /var/www/froxlor/scripts/froxlor_master_cronjob.php --tasks
```

> HTTPS + mot de passe fort + 2FA, écoute sur le réseau d'administration seulement, jamais exposé sur Internet, mises à jour immédiates.
