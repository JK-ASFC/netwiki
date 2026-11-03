---
title: Bash, Zsh, fish, Nushell, Starship et Oh My Zsh
description: Choisir et configurer son shell — Bash (GPL : shell par défaut de Linux, .bashrc, historique horodaté, scripts robustes set -euo pipefail, ShellCheck), Zsh (MIT : shell par défaut de macOS, complétion, .zshrc) et Oh My Zsh (MIT : thèmes et greffons git, sudo, autosuggestions), fish (GPL : autosuggestions et coloration sans configuration, abréviations, fonctions, non POSIX), Nushell (MIT : données structurées en tableaux, pipelines typés, JSON, CSV) et l'invite Starship (ISC : multi-shell, starship.toml), changement de shell par défaut.
tags: [bash, zsh, fish, nushell, starship, oh my zsh, shell, terminal]
icon: terminal
---

| Shell | Points forts | Compatibilité POSIX | Licence |
| --- | --- | --- | --- |
| **Bash** | Présent partout, langage des scripts d'administration | Oui | GPL 3.0 |
| **Zsh** | Complétion avancée, globbing, défaut de macOS | Presque (mode `emulate sh`) | MIT |
| **fish** | Autosuggestions, coloration, aide intégrée sans configuration | **Non** | GPL 2.0 |
| **Nushell** | Les commandes produisent des **tableaux** filtrables | Non | MIT |

**Règle** : utiliser le shell interactif de son choix, mais écrire les **scripts** en Bash (`#!/usr/bin/env bash`) ou POSIX `sh` pour qu'ils tournent partout.

```bash
cat /etc/shells
chsh -s "$(command -v zsh)"       # changer son shell par défaut (nouvelle session)
```

## Bash

`~/.bashrc` utile :

```bash
HISTSIZE=50000
HISTFILESIZE=100000
HISTCONTROL=ignoreboth            # ignorer doublons et commandes précédées d'une espace
HISTTIMEFORMAT='%F %T '           # horodatage dans history
shopt -s histappend checkwinsize
alias ll='ls -alF --color=auto'
alias grep='grep --color=auto'
```

En-tête de script robuste :

```bash
#!/usr/bin/env bash
set -euo pipefail                 # arrêt sur erreur, variable non définie, échec dans un pipeline
IFS=$'\n\t'
trap 'echo "Erreur ligne $LINENO" >&2' ERR
```

Vérifier chaque script avec **ShellCheck** (`apt install shellcheck`, `shellcheck script.sh`). `Ctrl+r` recherche dans l'historique.

## Zsh et Oh My Zsh

`apt install zsh` (défaut sur macOS). **Oh My Zsh** ajoute thèmes et greffons :

```bash
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

Dans `~/.zshrc` : `plugins=(git sudo docker kubectl)` (`sudo` : `Échap` deux fois préfixe la commande par sudo), `ZSH_THEME="robbyrussell"`. Greffons tiers répandus : `zsh-autosuggestions`, `zsh-syntax-highlighting` (cloner dans `$ZSH_CUSTOM/plugins/`). Mise à jour : `omz update`. Oh My Zsh ralentit le démarrage s'il y a trop de greffons : n'activer que l'utile.

## fish

`apt install fish`, `brew install fish`. Autosuggestions (`→` pour accepter), coloration et complétion fonctionnent sans configuration ; `fish_config` ouvre une interface web de réglage. Configuration dans `~/.config/fish/config.fish` :

```text
abbr -a gs git status
abbr -a k kubectl
set -gx EDITOR vim
fish_add_path ~/.local/bin
function maj
    sudo apt update; and sudo apt full-upgrade -y
end
funcsave maj
```

Syntaxe différente de Bash (`set var valeur`, `; and`, substitution `(…)` — `$(…)` accepté depuis fish 3.4) : lancer les scripts Bash avec `bash script.sh`.

## Nushell

`winget install Nushell.Nushell`, `brew install nushell`, `cargo install nu`. Les commandes renvoient des données structurées :

```text
ls | where size > 100mb | sort-by modified --reverse
ps | where cpu > 10 | select name pid cpu
open inventaire.json | get serveurs | where os == "debian" | select nom ip
open ventes.csv | where montant > 1000 | sort-by montant
http get https://api.corp.exemple.fr/v1/etat | get services
```

Très pratique pour explorer du JSON, du YAML, du CSV ou des sorties d'API ; pas de compatibilité avec la syntaxe Bash.

## Starship (invite)

```bash
curl -sS https://starship.rs/install.sh | sh          # ou brew, winget install Starship.Starship, apt (Debian 13)
echo 'eval "$(starship init bash)"' >> ~/.bashrc      # zsh : starship init zsh ; fish : starship init fish | source
```

PowerShell : `Invoke-Expression (&starship init powershell)` dans `$PROFILE`. L'invite affiche branche Git, contexte Kubernetes, version des langages, durée de la dernière commande ; réglages dans `~/.config/starship.toml` (exiger une police *Nerd Font* pour les icônes).

Voir aussi : [[01-tmux-screen-zellij|tmux et Screen]] · [[03-dotfiles-chezmoi-stow|dotfiles]] · [[19-powershell/01-presentation-installation|PowerShell]]. Commandes : [[90-aide-memoire|aide-mémoire]].
