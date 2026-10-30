---
title: Rspamd — aide-mémoire des commandes
description: Commandes Rspamd avec exemples — vérification de la configuration (rspamadm configtest, configdump), rspamc (analyse d'un message, apprentissage spam/ham, statistiques, compteurs, fuzzy), DKIM (rspamadm dkim_keygen), mot de passe de l'interface (rspamadm pw), intégration milter à Postfix, réglages locaux (local.d, override.d), journaux.
tags: [aide-mémoire, rspamd, rspamc, antispam, dkim, postfix]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Rspamd]].

## Configuration

```bash
sudo rspamadm configtest
sudo rspamadm configdump | less
sudo rspamadm configdump actions
sudo rspamadm configwizard               # assistant (Redis, DKIM, interface)
sudo systemctl reload rspamd
rspamd --version
```

```text
# /etc/rspamd/local.d/actions.conf
reject = 15;
add_header = 6;
greylist = 4;
```

## Analyse et apprentissage

```bash
rspamc symbols < message.eml             # score et symboles déclenchés
rspamc -h 127.0.0.1:11334 < message.eml
rspamc learn_spam < spam.eml
rspamc learn_ham < legitime.eml
rspamc learn_spam /var/mail/vhosts/exemple.fr/*/Maildir/.Junk/cur/      # en lot
rspamc stat
rspamc counters | head -20
rspamc fuzzy_add < spam.eml              # stockage fuzzy (si configuré)
```

## DKIM

```bash
sudo mkdir -p /var/lib/rspamd/dkim
sudo rspamadm dkim_keygen -s dkim2026 -d exemple.fr -b 2048 -k /var/lib/rspamd/dkim/exemple.fr.dkim2026.key > /tmp/dkim-dns.txt
sudo chown -R _rspamd:_rspamd /var/lib/rspamd/dkim
cat /tmp/dkim-dns.txt                    # enregistrement TXT dkim2026._domainkey.exemple.fr à publier
dig +short TXT dkim2026._domainkey.exemple.fr
```

```text
# /etc/rspamd/local.d/dkim_signing.conf
selector = "dkim2026";
path = "/var/lib/rspamd/dkim/$domain.$selector.key";
allow_username_mismatch = true;
```

## Interface web et intégration

```bash
rspamadm pw                               # empreinte du mot de passe (local.d/worker-controller.inc : password = "…")
sudo postconf -e 'smtpd_milters = inet:127.0.0.1:11332' 'non_smtpd_milters = inet:127.0.0.1:11332' 'milter_default_action = accept'
sudo postfix reload
```

Interface : `http://127.0.0.1:11334` (à publier derrière un proxy authentifié).

## Journaux

```bash
sudo tail -f /var/log/rspamd/rspamd.log
```
