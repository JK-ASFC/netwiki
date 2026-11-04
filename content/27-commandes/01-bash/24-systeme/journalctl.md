---
title: "journalctl"
description: "Bash — journalctl (Analyse d'incidents) : Journaux systemd, ici en suivi temps réel."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Analyse d'incidents |
| **Commande type** | `journalctl -u ssh -f` |

## Rôle

Journaux systemd, ici en suivi temps réel.

## En détail

Affiche les journaux du système : l'historique de ce qui s'est passé (démarrages, erreurs, services). C'est le premier endroit ou regarder quand quelque chose ne marche pas.

## Options

| Option | Rôle |
| --- | --- |
| `-u ‹unite›` | service (ex: ssh.service) |
| `-f` | suit en direct |
| `-n ‹N›` | dernières N lignes |
| `-p ‹priorite›` | niveau (err, warning) |
| `-b` | depuis le dernier démarrage |
| `--since ‹date›` | depuis une date ou heure (ex : "2026-01-01 10:00", "yesterday", "-1h") ; voir aussi --until |
| `-k` | messages du noyau |
| `-g ‹motif›` | filtre par motif (grep dans le journal, accepte une regex) |
| `(priorites du plus grave au moins grave : 0 emerg · 1 alert · 2 crit · 3 err · 4 warning · 5 notice · 6 info · 7 debug ; -p err affiche err ET tout ce qui est plus grave)` |  |

## Exemples

**Erreurs depuis le boot**

```bash
journalctl -b -p err
```

**Un service en direct**

```bash
journalctl -u ssh -f
```

*Mots-clés : logs journaux erreurs systemd boot noyau suivre tail debug*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
