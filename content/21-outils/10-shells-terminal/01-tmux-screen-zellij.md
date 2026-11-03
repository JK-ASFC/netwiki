---
title: tmux, GNU Screen et Zellij
description: Multiplexeurs de terminal pour l'administrateur — garder une session ouverte sur un serveur malgré une coupure SSH, plusieurs fenêtres et volets dans un seul terminal, partage de session ; tmux (ISC : sessions, fenêtres, volets, préfixe Ctrl+b, ~/.tmux.conf, copie, synchronisation des volets), GNU Screen (GPL : screen -S, -r, -x, Ctrl+a, journalisation, port série) et Zellij (MIT : interface guidée, dispositions KDL, sessions persistantes, greffons), commandes et configuration conseillée.
tags: [tmux, screen, zellij, terminal, ssh, sessions, multiplexeur]
icon: square-terminal
---

Un **multiplexeur** fait tourner les shells sur le serveur, indépendamment de la connexion : une coupure SSH pendant une mise à jour ou une copie de plusieurs heures ne tue plus rien, on se **rattache** à la session. Il découpe aussi le terminal en fenêtres et volets.

| | tmux | GNU Screen | Zellij |
| --- | --- | --- | --- |
| Préfixe | `Ctrl+b` | `Ctrl+a` | Modes affichés en bas (`Ctrl+p` volets, `Ctrl+t` onglets…) |
| Points forts | Standard actuel, scriptable, très configurable | Présent partout depuis longtemps, port série | Prise en main immédiate, dispositions, greffons |
| Systèmes | Linux, macOS, BSD, WSL | Linux, macOS, BSD | Linux, macOS, Windows (récent) |
| Installation | `apt/dnf install tmux`, `brew install tmux` | `apt/dnf install screen` | `apt install zellij` (Debian 13), `brew`, `cargo`, binaire |

## tmux

```bash
tmux new -s maj                   # nouvelle session nommée
tmux ls                           # sessions existantes
tmux attach -t maj                # se rattacher (après une coupure)
tmux kill-session -t maj
```

| Raccourci (après `Ctrl+b`) | Action |
| --- | --- |
| `d` | Se détacher (la session continue) |
| `c` / `n` / `p` / `0…9` | Nouvelle fenêtre / suivante / précédente / numéro |
| `%` / `"` | Volet vertical / horizontal |
| flèches / `z` | Changer de volet / agrandir le volet |
| `[` | Mode défilement et copie (`q` pour sortir) |
| `,` / `$` | Renommer la fenêtre / la session |
| `:setw synchronize-panes` | Taper la même commande dans tous les volets (plusieurs serveurs) |

`~/.tmux.conf` conseillé :

```text
set -g mouse on
set -g history-limit 50000
set -g base-index 1
setw -g pane-base-index 1
set -g default-terminal "tmux-256color"
bind r source-file ~/.tmux.conf \; display "Configuration rechargée"
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"
```

## GNU Screen

```bash
screen -S maj                     # nouvelle session
screen -ls ; screen -r maj        # lister / se rattacher
screen -x maj                     # se joindre à une session déjà attachée (travail à deux)
screen /dev/ttyUSB0 9600          # console série d'un commutateur ou d'un routeur
```

Raccourcis après `Ctrl+a` : `d` détacher, `c` nouvelle fenêtre, `n`/`p` naviguer, `S`/`|` découper, `Tab` changer de région, `H` journaliser la fenêtre dans `screenlog.0`, `k` fermer.

## Zellij

```bash
zellij                            # nouvelle session (nom aléatoire)
zellij -s maj ; zellij ls ; zellij attach maj ; zellij attach -c maj   # -c : créer si absente
zellij kill-session maj
zellij --layout dev.kdl           # disposition décrite en KDL (volets, commandes)
```

La barre du bas rappelle en permanence les raccourcis ; `Ctrl+o` puis `d` détache la session.

Voir aussi : [[02-shells-bash-zsh-fish-nushell|shells]] · [[03-dotfiles-chezmoi-stow|dotfiles]]. Commandes : [[90-aide-memoire|aide-mémoire]].
