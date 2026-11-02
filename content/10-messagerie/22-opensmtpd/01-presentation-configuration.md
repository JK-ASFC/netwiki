---
title: Présentation, installation et configuration
description: OpenSMTPD (ISC, projet OpenBSD) — serveur SMTP simple et sécurisé, alternative à Postfix et Exim : installation OpenBSD (intégré), Debian/Ubuntu, RHEL (EPEL), Alpine, Arch, FreeBSD, macOS ; syntaxe smtpd.conf (pki, table, listen, action, match), réception pour un domaine, livraison maildir ou LMTP vers Dovecot, soumission authentifiée sur 587/465, relais vers un smarthost, filtres (DKIM, Rspamd), commandes smtpctl et dépannage.
tags: [opensmtpd, smtpd, smtp, openbsd, mta, relais, messagerie]
icon: send
---

**OpenSMTPD** (ISC) est le serveur SMTP du projet **OpenBSD**, intégré au système de base et porté sur Linux, FreeBSD et macOS (version *portable*). Sa configuration tient en quelques lignes lisibles et son architecture à privilèges séparés le rend sûr. Il convient aux serveurs qui doivent envoyer des notifications, relayer vers un *smarthost* ou héberger une messagerie simple avec [[02-dovecot/01-presentation-installation|Dovecot]]. Pour des besoins avancés (politiques fines, très gros volumes) : [[01-postfix/01-presentation|Postfix]].

## Installation

```bash
# OpenBSD : déjà présent (rcctl enable smtpd)
sudo apt install -y opensmtpd                                  # Debian / Ubuntu (demande le nom de courrier)
sudo dnf install -y epel-release && sudo dnf install -y opensmtpd   # RHEL / Rocky / Alma
sudo apk add opensmtpd                                         # Alpine
sudo pacman -S opensmtpd                                       # Arch
sudo pkg install opensmtpd && sudo sysrc smtpd_enable=YES       # FreeBSD
brew install opensmtpd                                         # macOS
```

Arrêter et désactiver tout autre MTA (Postfix, Exim) qui occuperait le port 25. Windows n'est pas pris en charge (utiliser une VM ou WSL).

## Configuration (smtpd.conf)

Emplacement : `/etc/mail/smtpd.conf` (OpenBSD) ou `/etc/smtpd.conf` (Debian/Ubuntu, selon le paquet). Les règles `match` sont évaluées dans l'ordre : la première qui correspond s'applique.

```text
pki mail.corp.exemple.fr cert "/etc/ssl/mail.corp.exemple.fr.crt"
pki mail.corp.exemple.fr key  "/etc/ssl/private/mail.corp.exemple.fr.key"

table aliases file:/etc/mail/aliases
table utilisateurs file:/etc/mail/passwd

listen on lo
listen on egress tls pki mail.corp.exemple.fr
listen on egress port submission tls-require pki mail.corp.exemple.fr auth <utilisateurs>
listen on egress port smtps smtps pki mail.corp.exemple.fr auth <utilisateurs>

action "local" lmtp "/var/dovecot/lmtp" alias <aliases>
action "relais" relay helo mail.corp.exemple.fr

match from any for domain "corp.exemple.fr" action "local"
match for local action "local"
match auth from any for any action "relais"
match from local for any action "relais"
```

- `egress` désigne les interfaces de la route par défaut (sous Linux, indiquer l'interface ou l'adresse : `listen on eth0`).
- Livraison : `maildir "%{user.directory}/Maildir"` à la place de `lmtp …` sans Dovecot, ou `mbox`.
- Mots de passe de soumission : fichier `utilisateurs` au format `jk@corp.exemple.fr $2b$…` (empreinte produite par `smtpctl encrypt`).
- Relais par un fournisseur : `action "relais" relay host smtp+tls://compte@smtp.fournisseur.exemple:587 auth <secrets>` avec une table `secrets` (`compte jk@corp.exemple.fr:MotDePasse`).

```bash
sudo smtpd -n                      # vérifie la configuration
sudo smtpctl encrypt               # demande un mot de passe et affiche son empreinte
sudo systemctl restart opensmtpd   # Linux ; OpenBSD : rcctl restart smtpd
```

Signature **DKIM** et antispam : filtres (`filter-dkimsign`, `filter-rspamd` des ports/paquets) déclarés par `filter "rspamd" proc-exec "filter-rspamd"` puis `listen on egress tls pki mail.corp.exemple.fr filter "rspamd"` ; voir [[04-rspamd/01-presentation-installation|Rspamd]].

## Exploitation

```bash
sudo smtpctl show queue            # messages en file
sudo smtpctl show stats
sudo smtpctl schedule all          # relancer immédiatement les envois en attente
sudo smtpctl remove 1a2b3c4d5e6f7a8b
sudo smtpctl trace all ; sudo smtpctl untrace all
sudo tail -f /var/log/maillog      # OpenBSD ; /var/log/mail.log sous Debian
```

| Symptôme | Cause probable | Correction |
| --- | --- | --- |
| `smtpd -n` signale une erreur de syntaxe | Ordre ou mot-clé incorrect | Relire la ligne indiquée (syntaxe 6.4+ avec `action`/`match`) |
| « 550 Invalid recipient » | Domaine non couvert par un `match … for domain` | Ajouter le domaine ou la table |
| Relais refusé pour les clients | Pas d'authentification ou `match auth` absent | Port 587 avec `auth`, règle `match auth` |
| Messages bloqués en file | Port 25 sortant filtré, DNS | `smtpctl show queue`, passer par un smarthost |

Commandes : [[90-aide-memoire|aide-mémoire]].
