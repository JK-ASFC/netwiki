---
title: Courrier en terminal — aide-mémoire
description: Fichiers et commandes de Mutt et NeoMutt (raccourcis, envoi en script), aerc, fetchmail (-c, -v, -q), getmail6, OfflineIMAP et mbsync.
tags: [aide-mémoire, mutt, neomutt, aerc, fetchmail, getmail6, offlineimap, mbsync]
icon: terminal
---

Explications : [[01-mutt-neomutt-aerc|Mutt, NeoMutt, aerc]] · [[02-fetchmail-getmail-offlineimap|fetchmail, getmail6, OfflineIMAP]].

## Fichiers

| Outil | Configuration |
| --- | --- |
| Mutt / NeoMutt | `~/.muttrc` / `~/.config/neomutt/neomuttrc`, `~/.mailcap` |
| aerc | `~/.config/aerc/accounts.conf` (600), `aerc.conf`, `binds.conf` |
| fetchmail | `~/.fetchmailrc` (600) |
| getmail6 | `~/.config/getmail/getmailrc` |
| OfflineIMAP / mbsync | `~/.offlineimaprc` / `~/.mbsyncrc` |

## Commandes

```bash
echo "Corps" | mutt -s "Sujet" -- admin@exemple.fr
mutt -s "Rapport" -a rapport.pdf -- dest@exemple.fr < corps.txt
neomutt -F ~/.config/neomutt/neomuttrc ; aerc
fetchmail -c ; fetchmail -v ; fetchmail ; fetchmail -q
getmail --rcfile getmailrc --getmaildir ~/.config/getmail
offlineimap -o ; offlineimap --dry-run -o
mbsync -a
```

Raccourcis Mutt/NeoMutt : `m` nouveau · `r` répondre · `g` répondre à tous · `f` transférer · `d` supprimer · `$` synchroniser · `c` changer de dossier · `l` limiter (`~f alice ~d <7d`) · `v` pièces jointes.
