---
title: Alacritty, Kitty, WezTerm et Ghostty
description: Les terminaux modernes accélérés par la carte graphique pour l'administrateur — Alacritty (Rust, minimaliste, TOML, avec tmux), Kitty (onglets, dispositions, kittens ssh, icat et diff, contrôle à distance), WezTerm (Rust, Lua, multiplexeur intégré, domaines SSH, port série, Windows) et Ghostty (Zig, interface native, configuration simple) ; comparatif, installation, configuration, polices et le problème de terminfo en SSH.
tags: [alacritty, kitty, wezterm, ghostty, terminal, gpu, ssh, terminfo, tmux]
icon: square-terminal
---

Ces terminaux dessinent le texte avec la **carte graphique** : défilement fluide sur de gros journaux, faible latence, ligatures et couleurs vraies. Ils se configurent par **fichier texte**, facile à versionner avec ses dotfiles (voir [[10-shells-terminal/03-dotfiles-chezmoi-stow|chezmoi et Stow]]).

## Comparatif

| | Alacritty | Kitty | WezTerm | Ghostty |
| --- | --- | --- | --- | --- |
| Langage, licence | Rust, Apache 2.0 | C et Python, GPL 3 | Rust, MIT | Zig, MIT |
| Plates-formes | Linux, macOS, Windows, BSD | Linux, macOS, BSD | Linux, macOS, **Windows**, BSD | Linux, macOS |
| Configuration | `alacritty.toml` (TOML) | `kitty.conf` | `~/.wezterm.lua` (**Lua**) | `~/.config/ghostty/config` |
| Onglets et volets | **Non** (s'utilise avec tmux ou Zellij) | Oui, dispositions | Oui, **multiplexeur intégré** | Oui (onglets et volets natifs) |
| Particularités | Minimaliste, très rapide | Protocole d'images, « kittens », contrôle à distance | SSH et port série intégrés, sessions persistantes | Interface native (GTK, AppKit), réglages par défaut soignés |
| `TERM` envoyé | `alacritty` | `xterm-kitty` | `xterm-256color` (par défaut) | `xterm-ghostty` |

## Installation

```bash
# Alacritty
sudo apt install alacritty ; sudo dnf install alacritty ; brew install --cask alacritty ; winget install Alacritty.Alacritty
# Kitty
sudo apt install kitty ; sudo dnf install kitty ; brew install --cask kitty
# WezTerm
brew install --cask wezterm ; winget install wez.wezterm      # Linux : dépôt APT/RPM du projet, Flatpak, AppImage
# Ghostty
brew install --cask ghostty                                   # Linux : paquets des distributions (Arch, Fedora COPR, Snap, Flatpak communautaire)
```

## Alacritty

```toml ~/.config/alacritty/alacritty.toml
[font]
normal = { family = "JetBrainsMono Nerd Font" }
size = 11.0

[window]
padding = { x = 6, y = 6 }
option_as_alt = "Both"          # macOS : Option se comporte comme Alt

[scrolling]
history = 50000

[terminal.shell]
program = "/usr/bin/tmux"
args = ["new-session", "-A", "-s", "principal"]
```

Alacritty ne gère ni onglets ni volets : il s'associe naturellement à **tmux** ou Zellij (voir [[10-shells-terminal/01-tmux-screen-zellij|multiplexeurs]]). Les anciennes configurations YAML se convertissent avec `alacritty migrate`.

## Kitty

```text ~/.config/kitty/kitty.conf
font_family      JetBrainsMono Nerd Font
font_size        11
scrollback_lines 50000
enabled_layouts  splits,stack
map ctrl+shift+enter launch --location=split --cwd=current
map ctrl+shift+t     new_tab_with_cwd
allow_remote_control yes
```

Les **kittens** sont des outils intégrés :

```bash
kitten ssh admin@serveur          # copie automatiquement le terminfo de Kitty sur le serveur
kitten icat capture.png           # afficher une image dans le terminal
kitten diff ancien.conf nouveau.conf
kitten themes                     # choisir un thème
kitty @ ls                        # contrôle à distance (fenêtres, onglets)
kitty @ send-text --match title:prod "uptime\n"
```

## WezTerm

```lua ~/.wezterm.lua
local wezterm = require 'wezterm'
local config = wezterm.config_builder()

config.font = wezterm.font 'JetBrainsMono Nerd Font'
config.font_size = 11
config.scrollback_lines = 50000
config.ssh_domains = {
  { name = 'bastion', remote_address = 'bastion.exemple.lan', username = 'admin' },
}
config.keys = {
  { key = '|', mods = 'CTRL|SHIFT', action = wezterm.action.SplitHorizontal { domain = 'CurrentPaneDomain' } },
  { key = '_', mods = 'CTRL|SHIFT', action = wezterm.action.SplitVertical { domain = 'CurrentPaneDomain' } },
}
return config
```

```bash
wezterm ssh admin@serveur                       # client SSH intégré
wezterm connect bastion                         # domaine SSH : onglets et volets ouverts côté serveur, persistants
wezterm serial --baud 9600 /dev/ttyUSB0         # console série d'un équipement réseau (COM3 sous Windows)
wezterm cli list                                # volets et onglets
```

WezTerm est le choix multiplateforme le plus complet, y compris sous **Windows** (alternative à Windows Terminal, avec la même configuration que sur Linux et macOS).

## Ghostty

```text ~/.config/ghostty/config
font-family = JetBrainsMono Nerd Font
font-size = 11
theme = dark:Catppuccin Mocha,light:Catppuccin Latte
scrollback-limit = 50000000
keybind = ctrl+shift+backslash=new_split:right
```

```bash
ghostty +list-themes
ghostty +list-keybinds --default
ghostty +show-config --default --docs | less    # toutes les options documentées
```

## Le piège du terminfo en SSH

Kitty, Alacritty et Ghostty annoncent leur propre type de terminal (`TERM=xterm-kitty`, `alacritty`, `xterm-ghostty`). Si le serveur ne connaît pas ce type, `htop`, `vim` ou `less` affichent des erreurs (« unknown terminal type ») ou se comportent mal.

```bash
# Copier la description du terminal sur le serveur (une fois par serveur et par utilisateur)
infocmp -x xterm-ghostty | ssh admin@serveur -- tic -x -
# Ou, plus simple, se présenter comme un xterm pour SSH
alias ssh='TERM=xterm-256color ssh'
# Kitty : kitten ssh le fait automatiquement
```

## Polices

Une police **Nerd Font** (JetBrains Mono, Fira Code, Hack…) ajoute les icônes utilisées par les invites comme Starship (voir [[10-shells-terminal/02-shells-bash-zsh-fish-nushell|shells]]) et par les éditeurs en terminal.

```bash
brew install --cask font-jetbrains-mono-nerd-font
# Linux : télécharger depuis nerdfonts.com dans ~/.local/share/fonts puis fc-cache -f
```

Voir aussi : [[02-xfce-terminal|Xfce Terminal et terminaux des bureaux]]. Commandes : [[90-aide-memoire|aide-mémoire]].
