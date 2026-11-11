---
title: Mutt, NeoMutt et aerc
description: Clients de messagerie en terminal — Mutt (historique, GPL) et NeoMutt (fork enrichi : barre latérale, notmuch, Lua) avec configuration IMAP et SMTP sécurisée, mots de passe par gestionnaire (pass), caches, raccourcis, envoi de messages et pièces jointes depuis des scripts ; aerc (Go, MIT : onglets, terminal intégré, accounts.conf, filtres, revue de correctifs Git par e-mail).
tags: [mutt, neomutt, aerc, client mail, terminal, imap, smtp, pass, scripts]
icon: square-terminal
---

Un client en terminal se lance **dans une session SSH**, se pilote entièrement au clavier et s'intègre aux scripts. Il convient aux administrateurs qui lisent les alertes d'un serveur, aux développeurs qui reçoivent des correctifs par e-mail, et à ceux qui gèrent beaucoup de courrier.

| | Mutt | NeoMutt | aerc |
| --- | --- | --- | --- |
| Langage, licence | C, GPL | C, GPL (fork de Mutt) | Go, MIT |
| Points forts | Stable, présent partout, scripts | Barre latérale, **notmuch** (recherche), Lua, nombreux correctifs intégrés | Moderne, onglets, terminal intégré, configuration simple, flux Git par e-mail |
| Configuration | `~/.muttrc` | `~/.config/neomutt/neomuttrc` | `~/.config/aerc/{aerc,accounts,binds}.conf` |

```bash
sudo apt install mutt neomutt aerc ; sudo dnf install mutt neomutt aerc ; brew install neomutt aerc
```

## NeoMutt (et Mutt)

```text ~/.config/neomutt/neomuttrc
set realname   = "Alice Martin"
set from       = "alice@exemple.fr"
set imap_user  = "alice@exemple.fr"
set imap_pass  = "`pass show mail/alice`"          # mot de passe lu dans le gestionnaire pass
set folder     = "imaps://mail.exemple.fr/"
set spoolfile  = "+INBOX"
set record     = "+Sent"
set postponed  = "+Drafts"
set trash      = "+Trash"
mailboxes =INBOX =Sent =Drafts =Alertes

set smtp_url   = "smtps://alice@exemple.fr@mail.exemple.fr:465/"
set smtp_pass  = $imap_pass
set ssl_force_tls = yes

set header_cache     = ~/.cache/neomutt/headers
set message_cachedir = ~/.cache/neomutt/bodies
set sidebar_visible  = yes                          # NeoMutt
set sort = threads
set editor = "vim"
auto_view text/html
```

```text ~/.mailcap
text/html; w3m -I %{charset} -T text/html; copiousoutput
application/pdf; xdg-open %s
```

| Touche | Action |
| --- | --- |
| `↑` `↓` / `Entrée` | Naviguer / ouvrir |
| `m` / `r` / `g` / `f` | Nouveau / répondre / répondre à tous / transférer |
| `d` / `u` / `$` | Supprimer / annuler / synchroniser |
| `c` | Changer de dossier |
| `/` / `l` | Rechercher / limiter l'affichage (`~f alice ~d <7d`) |
| `t` / `T` | Marquer un message / un motif ; `;` applique une action aux marqués |
| `v` | Pièces jointes |

### Envoyer depuis un script

```bash
echo "La sauvegarde de cette nuit a échoué." | mutt -s "[srv-web1] Sauvegarde en échec" -- admin@exemple.fr
mutt -s "Rapport mensuel" -a rapport.pdf -- direction@exemple.fr < corps.txt
```

Sur un serveur sans configuration IMAP, `mutt` envoie via le `sendmail` local (Postfix configuré en relais).

## aerc

```ini ~/.config/aerc/accounts.conf
[Exemple]
source            = imaps://alice%40exemple.fr@mail.exemple.fr
source-cred-cmd   = pass show mail/alice
outgoing          = smtps://alice%40exemple.fr@mail.exemple.fr:465
outgoing-cred-cmd = pass show mail/alice
from              = Alice Martin <alice@exemple.fr>
default           = INBOX
copy-to           = Sent
```

```bash
chmod 600 ~/.config/aerc/accounts.conf
aerc
```

- Commandes avec `:` (`:compose`, `:reply -a`, `:archive flat`, `:cf Alertes`), raccourcis dans `binds.conf`.
- **Filtres** d'affichage dans `aerc.conf` (`text/html = html`, `text/plain = colorize`).
- **Terminal intégré** : `:term` ouvre un shell dans un onglet.
- Flux **Git par e-mail** : appliquer un correctif reçu (`:pipe -m git am -3`), très utilisé par les projets qui travaillent par listes de diffusion.

> [!TIP]
> Ne laissez jamais un mot de passe en clair dans ces fichiers : utilisez `pass`, `secret-tool` ou le trousseau du système, et des droits `600`.

Voir aussi : [[02-fetchmail-getmail-offlineimap|fetchmail, getmail6, OfflineIMAP]]. Commandes : [[90-aide-memoire|aide-mémoire]].
