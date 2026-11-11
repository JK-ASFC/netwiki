---
title: Terminaux graphiques — aide-mémoire
description: Commandes d'installation et d'utilisation d'Alacritty, Kitty (kittens ssh, icat, diff, contrôle à distance), WezTerm (ssh, connect, serial, cli), Ghostty (+list-themes, +show-config) et Xfce Terminal (onglets, drop-down), correction du terminfo en SSH et polices Nerd Font.
tags: [aide-mémoire, alacritty, kitty, wezterm, ghostty, xfce terminal, terminfo]
icon: terminal
---

Explications : [[01-alacritty-kitty-wezterm-ghostty|Alacritty, Kitty, WezTerm, Ghostty]] · [[02-xfce-terminal|Xfce Terminal]].

## Fichiers de configuration

| Terminal | Fichier |
| --- | --- |
| Alacritty | `~/.config/alacritty/alacritty.toml` |
| Kitty | `~/.config/kitty/kitty.conf` |
| WezTerm | `~/.wezterm.lua` |
| Ghostty | `~/.config/ghostty/config` |
| Xfce Terminal | canal xfconf `xfce4-terminal` (ou `~/.config/xfce4/terminal/terminalrc`) |

## Commandes

```bash
alacritty migrate                                     # YAML → TOML
kitten ssh admin@serveur ; kitten icat image.png ; kitten diff a b ; kitten themes
kitty @ ls ; kitty @ send-text --match title:prod "uptime\n"
wezterm ssh admin@serveur ; wezterm connect bastion ; wezterm serial --baud 9600 /dev/ttyUSB0 ; wezterm cli list
ghostty +list-themes ; ghostty +list-keybinds --default ; ghostty +show-config --default --docs
xfce4-terminal --tab -T bastion -e "ssh admin@bastion" --tab -T local
xfce4-terminal --drop-down
```

## Terminfo et SSH

```bash
infocmp -x xterm-ghostty | ssh admin@serveur -- tic -x -      # idem avec xterm-kitty, alacritty
TERM=xterm-256color ssh admin@serveur                         # contournement
```

## Polices

```bash
brew install --cask font-jetbrains-mono-nerd-font
fc-cache -f ; fc-list | grep -i nerd
```
