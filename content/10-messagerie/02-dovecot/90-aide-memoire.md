---
title: Dovecot — aide-mémoire des commandes
description: Commandes Dovecot avec exemples — configuration (doveconf -n, -a), rechargement, administration (doveadm : who, kick, user, auth test, pw, mailbox list/status, search, fetch, expunge, move, quota, index, force-resync, backup et sync, replicator), Sieve (sievec), tests IMAP (openssl s_client), journaux.
tags: [aide-mémoire, dovecot, doveadm, imap, sieve, quota]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Dovecot]].

## Configuration et service

```bash
doveconf -n                                 # configuration effective (hors défauts)
doveconf -a | grep -E "^ssl_min_protocol|^mail_location|^auth_mechanisms"
doveconf -P ssl_key | head -1               # vérifier qu'un paramètre est lu (masque les secrets)
sudo doveadm reload
sudo systemctl restart dovecot
dovecot --version
```

## Utilisateurs et sessions

```bash
sudo doveadm who                            # connexions en cours
sudo doveadm kick amartin@exemple.fr        # déconnecter
sudo doveadm user amartin@exemple.fr        # répertoire, uid, quota…
sudo doveadm auth test amartin@exemple.fr   # tester l'authentification (mot de passe demandé)
sudo doveadm auth lookup amartin@exemple.fr
doveadm pw -s ARGON2ID                      # générer une empreinte de mot de passe
```

## Boîtes aux lettres

```bash
sudo doveadm mailbox list -u amartin@exemple.fr
sudo doveadm mailbox status -u amartin@exemple.fr "messages vsize unseen" INBOX
sudo doveadm mailbox create -u amartin@exemple.fr Archives/2026
sudo doveadm search -u amartin@exemple.fr mailbox INBOX from fournisseur@exemple.com since 2026-10-01
sudo doveadm fetch -u amartin@exemple.fr "hdr.subject date.received" mailbox INBOX since 7d
sudo doveadm move -u amartin@exemple.fr Archives/2026 mailbox INBOX before 2026-01-01
sudo doveadm expunge -u amartin@exemple.fr mailbox Corbeille savedbefore 30d
sudo doveadm expunge -A mailbox Junk savedbefore 30d          # tous les utilisateurs
sudo doveadm quota get -u amartin@exemple.fr
sudo doveadm quota recalc -u amartin@exemple.fr
sudo doveadm index -u amartin@exemple.fr INBOX
sudo doveadm force-resync -u amartin@exemple.fr '*'            # réparer des index corrompus
```

## Sauvegarde et migration

```bash
sudo doveadm backup -u amartin@exemple.fr -D maildir:/srv/sauvegardes/mail/amartin       # copie unidirectionnelle
sudo doveadm -o mail_fsync=never backup -R -u amartin@exemple.fr imapc:              # rapatrier depuis un ancien serveur IMAP (imapc configuré)
sudo doveadm sync -u amartin@exemple.fr tcp:mail2.exemple.fr                          # synchronisation bidirectionnelle
sudo doveadm replicator status '*'
```

## Sieve

```bash
sievec /var/mail/vhosts/exemple.fr/amartin/sieve/regles.sieve    # compiler/vérifier un script
```

```text
require ["fileinto", "vacation"];
if header :contains "subject" "[Supervision]" { fileinto "Alertes"; stop; }
vacation :days 1 :subject "Absent" "Je suis absente jusqu'au 4 novembre.";
```

## Tests et journaux

```bash
openssl s_client -connect mail.exemple.fr:993 -crlf -quiet
# a1 LOGIN amartin@exemple.fr MotDePasse
# a2 LIST "" "*"
# a3 LOGOUT
sudo journalctl -u dovecot -f
sudo doveadm log errors
```
