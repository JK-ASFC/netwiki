---
title: Postfix — aide-mémoire des commandes
description: Commandes Postfix avec exemples — vérification et rechargement (postfix check, reload), paramètres (postconf, postconf -n, -e, -M), files d'attente (mailq, postqueue -p/-f, postsuper -d/-h/-r, postcat), tables (postmap, newaliases), relais authentifié, TLS, restrictions anti-relais, tests (swaks, openssl s_client, telnet SMTP), journaux et pflogsumm.
tags: [aide-mémoire, postfix, smtp, postconf, postqueue, swaks]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|Postfix]].

## Service et paramètres

```bash
sudo postfix check
sudo postfix reload
sudo systemctl status postfix
postconf -n                                   # paramètres modifiés par rapport aux valeurs par défaut
postconf mail_version myhostname mydestination relayhost
postconf -d smtpd_tls_security_level          # valeur par défaut
sudo postconf -e 'message_size_limit = 52428800'
sudo postconf -e 'smtpd_tls_security_level = may' 'smtp_tls_security_level = may'
postconf -M                                    # services de master.cf
sudo postconf -M submission/inet="submission inet n - y - - smtpd"
```

## Files d'attente

```bash
mailq                                          # = postqueue -p
postqueue -p | tail -1                         # total
sudo postqueue -f                              # tenter de délivrer maintenant
sudo postqueue -s exemple.com                  # pour un domaine
sudo postcat -vq 4F3A21C0B2                    # contenu d'un message en file
sudo postsuper -d 4F3A21C0B2                   # supprimer un message
sudo postsuper -d ALL deferred                 # vider la file « deferred »
sudo postsuper -h 4F3A21C0B2 / -H 4F3A21C0B2   # suspendre / libérer
sudo postsuper -r ALL                          # remettre en file (après correction de configuration)
# Supprimer tous les messages d'un expéditeur indésirable
mailq | awk '/^[0-9A-F]/ && /spam@exemple\.net/ {print $1}' | tr -d '*!' | sudo postsuper -d -
```

## Tables

```bash
sudo postmap /etc/postfix/sasl_passwd          # après modification d'une table hash/lmdb
sudo postmap -q amartin@exemple.fr hash:/etc/postfix/virtual    # tester une recherche
sudo newaliases                                 # /etc/aliases
```

## Relais authentifié (smarthost)

```bash
sudo postconf -e 'relayhost = [smtp.fournisseur.fr]:587' 'smtp_sasl_auth_enable = yes' \
  'smtp_sasl_password_maps = hash:/etc/postfix/sasl_passwd' 'smtp_sasl_security_options = noanonymous' 'smtp_tls_security_level = encrypt'
echo "[smtp.fournisseur.fr]:587 compte@exemple.fr:MotDePasse" | sudo tee /etc/postfix/sasl_passwd
sudo chmod 600 /etc/postfix/sasl_passwd && sudo postmap /etc/postfix/sasl_passwd && sudo postfix reload
```

## Restrictions (extrait de main.cf)

```ini
smtpd_helo_required = yes
smtpd_recipient_restrictions =
    permit_mynetworks,
    permit_sasl_authenticated,
    reject_unauth_destination,
    reject_unknown_recipient_domain,
    reject_rbl_client zen.spamhaus.org
mynetworks = 127.0.0.0/8 10.0.0.0/8
disable_vrfy_command = yes
smtpd_tls_cert_file = /etc/letsencrypt/live/mail.exemple.fr/fullchain.pem
smtpd_tls_key_file = /etc/letsencrypt/live/mail.exemple.fr/privkey.pem
smtpd_tls_mandatory_protocols = !SSLv2, !SSLv3, !TLSv1, !TLSv1.1
```

## Tests

```bash
swaks --to alice.martin@exemple.fr --from test@exemple.fr --server mail.exemple.fr
swaks --to externe@exemple.com --server mail.exemple.fr:587 --tls --auth LOGIN --auth-user amartin@exemple.fr
openssl s_client -connect mail.exemple.fr:25 -starttls smtp -crlf </dev/null | head -20
openssl s_client -connect mail.exemple.fr:465 -crlf </dev/null | head
echo "Test" | mail -s "Test Postfix" alice.martin@exemple.fr
```

## Journaux

```bash
sudo tail -f /var/log/mail.log                         # RHEL : /var/log/maillog
sudo journalctl -u postfix -f
grep "status=deferred" /var/log/mail.log | tail
grep "4F3A21C0B2" /var/log/mail.log                     # suivre un message par son identifiant
pflogsumm -d yesterday /var/log/mail.log | less         # rapport quotidien
```
