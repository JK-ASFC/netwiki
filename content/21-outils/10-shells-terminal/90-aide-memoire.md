---
title: Shells et terminal — aide-mémoire
description: Commandes et raccourcis tmux (sessions, volets, synchronisation), GNU Screen (-S, -r, -x, port série), Zellij (attach, layout), Bash (historique, set -euo pipefail, ShellCheck), Zsh et Oh My Zsh, fish (abbr, funcsave), Nushell, Starship, chsh, GNU Stow et chezmoi.
tags: [aide-mémoire, tmux, screen, zellij, bash, zsh, fish, nushell, starship, chezmoi, stow]
icon: terminal
---

Explications : [[01-tmux-screen-zellij|tmux, Screen, Zellij]] · [[02-shells-bash-zsh-fish-nushell|shells, Starship, Oh My Zsh]] · [[03-dotfiles-chezmoi-stow|chezmoi et Stow]].

## Multiplexeurs

```bash
tmux new -s maj ; tmux ls ; tmux attach -t maj      # Ctrl+b d détacher, % " découper, [ défiler, z agrandir
screen -S maj ; screen -ls ; screen -r maj ; screen -x maj ; screen /dev/ttyUSB0 9600    # Ctrl+a d détacher
zellij -s maj ; zellij ls ; zellij attach -c maj ; zellij --layout dev.kdl
```

## Shells

```bash
chsh -s "$(command -v zsh)" ; cat /etc/shells
set -euo pipefail ; shellcheck script.sh ; HISTTIMEFORMAT='%F %T '
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" ; omz update
abbr -a gs git status ; funcsave maj ; fish_config            # fish
ls | where size > 100mb | sort-by modified                     # Nushell
curl -sS https://starship.rs/install.sh | sh ; eval "$(starship init bash)"
```

## Dotfiles

```bash
cd ~/dotfiles && stow -n -v bash ; stow bash tmux ; stow -D bash ; stow -R tmux
chezmoi init --apply https://git.corp.exemple.fr/jk/dotfiles.git
chezmoi add ~/.bashrc ; chezmoi edit ~/.bashrc ; chezmoi diff ; chezmoi apply -v ; chezmoi update ; chezmoi cd
```
