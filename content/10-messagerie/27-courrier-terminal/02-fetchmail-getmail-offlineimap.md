---
title: fetchmail, getmail6 et OfflineIMAP
description: Récupérer et synchroniser des boîtes aux lettres — fetchmail (relève POP3/IMAP vers le MTA ou un MDA local, mode démon, .fetchmailrc, SSL et vérification des certificats), getmail6 (relève sûre en Python 3 vers Maildir ou un MDA, getmailrc, password_command) et OfflineIMAP (synchronisation bidirectionnelle IMAP ↔ Maildir, offlineimaprc, mbsync comme alternative) ; cas d'usage (regrouper des boîtes, migration, sauvegarde, lecture hors ligne).
tags: [fetchmail, getmail6, offlineimap, mbsync, isync, imap, pop3, maildir, migration, sauvegarde]
icon: square-terminal
---

| Outil | Sens | Usage typique |
| --- | --- | --- |
| **fetchmail** | Serveur distant → MTA ou MDA local | Rapatrier sur son serveur le courrier d'une boîte chez un fournisseur |
| **getmail6** | Serveur distant → Maildir ou MDA | Même usage, configuration plus simple et plus sûre |
| **OfflineIMAP** | Serveur IMAP ↔ Maildir local (**bidirectionnel**) | Lecture hors ligne avec Mutt/NeoMutt, sauvegarde, migration |
| mbsync (isync) | Serveur IMAP ↔ Maildir (bidirectionnel) | Alternative plus rapide à OfflineIMAP |

```bash
sudo apt install fetchmail getmail6 offlineimap3 isync
```

## fetchmail

```text ~/.fetchmailrc
set daemon 300                         # relève toutes les 5 minutes
set logfile ~/.fetchmail.log

poll imap.fournisseur.fr protocol IMAP
    user "alice@fournisseur.fr" there with password "MotDePasse" is "alice" here
    ssl sslcertck
    folder INBOX
    keep                               # laisser une copie sur le serveur distant (sinon : supprimés après relève)
    mda "/usr/lib/dovecot/dovecot-lda -d alice"
```

```bash
chmod 600 ~/.fetchmailrc
fetchmail -c                # vérifier s'il y a du courrier, sans relever
fetchmail -v                # relève détaillée (test)
fetchmail                   # lance le démon selon "set daemon"
fetchmail -q                # arrêter le démon
```

Sans `mda`, fetchmail remet les messages au **MTA local** (port 25), qui applique ses filtres anti-spam. Sous Debian, `/etc/fetchmailrc` et le service `fetchmail` permettent une relève système pour plusieurs comptes.

## getmail6

```ini ~/.config/getmail/getmailrc
[retriever]
type = SimpleIMAPSSLRetriever
server = imap.fournisseur.fr
username = alice@fournisseur.fr
password_command = ("pass", "mail/fournisseur")
mailboxes = ("INBOX",)

[destination]
type = Maildir
path = ~/Maildir/

[options]
read_all = false          # ne récupérer que les nouveaux messages
delete = false            # laisser les messages sur le serveur
message_log = ~/.config/getmail/getmail.log
```

```bash
getmail --rcfile getmailrc --getmaildir ~/.config/getmail
# Relève régulière : timer systemd utilisateur ou cron
*/10 * * * * getmail --rcfile getmailrc --getmaildir ~/.config/getmail --quiet
```

Destinations possibles : `Maildir`, `Mboxrd`, ou `MDA_external` (Dovecot LDA, procmail). getmail6 garde la trace des messages déjà récupérés, même avec `delete = false`.

## OfflineIMAP

```ini ~/.offlineimaprc
[general]
accounts = Exemple
maxsyncaccounts = 1

[Account Exemple]
localrepository = Local
remoterepository = Distant
autorefresh = 5
quick = 10

[Repository Local]
type = Maildir
localfolders = ~/Mail/Exemple

[Repository Distant]
type = IMAP
remotehost = mail.exemple.fr
remoteuser = alice@exemple.fr
remotepasseval = __import__("subprocess").check_output(["pass", "show", "mail/alice"]).decode().strip()
sslcacertfile = /etc/ssl/certs/ca-certificates.crt
folderfilter = lambda f: f not in ["Junk", "Trash"]
```

```bash
offlineimap -o              # une synchronisation puis sortie
offlineimap                 # synchronisation continue (autorefresh)
offlineimap --dry-run -o    # simuler
```

**mbsync** (paquet `isync`) fait la même chose, plus vite, avec un fichier `~/.mbsyncrc` (`IMAPAccount`, `IMAPStore`, `MaildirStore`, `Channel`) et la commande `mbsync -a`.

## Cas d'usage

- **Migration** d'une messagerie : copier toutes les boîtes d'un ancien serveur vers un nouveau ; pour une migration serveur à serveur, `imapsync` est l'outil de référence (voir les pages Dovecot du wiki).
- **Sauvegarde** : une copie Maildir locale synchronisée, sauvegardée avec le reste du poste ou du serveur.
- **Recherche hors ligne** : Maildir + **notmuch** indexe des centaines de milliers de messages pour NeoMutt ou aerc.

Voir aussi : [[01-mutt-neomutt-aerc|Mutt, NeoMutt, aerc]]. Commandes : [[90-aide-memoire|aide-mémoire]].
