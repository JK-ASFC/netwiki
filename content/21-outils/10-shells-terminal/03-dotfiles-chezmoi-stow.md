---
title: chezmoi et GNU Stow — gérer ses dotfiles
description: Versionner et déployer ses fichiers de configuration (.bashrc, .zshrc, .tmux.conf, .gitconfig, .ssh/config, starship.toml) sur plusieurs machines — GNU Stow (GPL : liens symboliques depuis un dépôt organisé par paquets, stow, -D, -R, simulation -n) et chezmoi (MIT : copie gérée depuis un dépôt Git, chezmoi init --apply, add, edit, diff, apply, update, modèles par machine, secrets depuis un gestionnaire de mots de passe, chiffrement age, Windows), bonnes pratiques et secrets à exclure.
tags: [dotfiles, chezmoi, stow, git, configuration, bashrc, zshrc]
icon: folder-git-2
---

Les *dotfiles* (fichiers de configuration cachés du dossier personnel) représentent des années de réglages. Les placer dans un **dépôt Git** ([[03-gitea/01-presentation-installation|Gitea]], GitLab interne) permet de retrouver son environnement sur un nouveau poste ou serveur en une commande.

| | GNU Stow | chezmoi |
| --- | --- | --- |
| Principe | **Liens symboliques** vers le dépôt | **Copie** des fichiers depuis un dépôt source |
| Différences par machine | Une branche ou un paquet par machine | **Modèles** (`.tmpl`) selon hôte, système, utilisateur |
| Secrets | Non gérés | Gestionnaires de mots de passe, chiffrement age ou GPG |
| Systèmes | Linux, macOS, BSD | Linux, macOS, BSD, **Windows** |
| Licence | GPL 3.0 | MIT |

## GNU Stow

Organisation : un dossier par « paquet », reproduisant l'arborescence depuis le dossier personnel :

```text
~/dotfiles/
├── bash/.bashrc
├── tmux/.tmux.conf
└── starship/.config/starship.toml
```

```bash
sudo apt install stow                       # brew install stow
cd ~/dotfiles
stow -n -v bash tmux starship               # simulation
stow bash tmux starship                     # crée les liens dans ~ (dossier parent)
stow -R tmux                                # recréer après ajout de fichiers
stow -D bash                                # retirer les liens
```

Si un fichier réel existe déjà à la place du lien, Stow refuse : le déplacer dans le dépôt d'abord (ou `--adopt`, qui reprend le fichier existant dans le dépôt).

## chezmoi

```bash
sh -c "$(curl -fsLS get.chezmoi.io)"       # ou brew, winget install twpayne.chezmoi, apt (Debian 13)
chezmoi init                                # dépôt source dans ~/.local/share/chezmoi
chezmoi add ~/.bashrc ~/.tmux.conf ~/.config/starship.toml
chezmoi edit ~/.bashrc                      # modifier la source
chezmoi diff ; chezmoi apply -v             # comparer puis appliquer
chezmoi cd                                  # aller dans la source pour git add, commit, push
```

Sur une nouvelle machine : `chezmoi init --apply https://git.corp.exemple.fr/jk/dotfiles.git` ; ensuite `chezmoi update` récupère et applique les changements.

**Modèle** (`chezmoi add --template ~/.gitconfig`, fichier `dot_gitconfig.tmpl`) :

```text
[user]
    name = JK
{{- if eq .chezmoi.hostname "pc-perso" }}
    email = jk@perso.exemple.org
{{- else }}
    email = jk@corp.exemple.fr
{{- end }}
```

Les secrets ne sont **jamais** écrits dans le dépôt : chezmoi les lit au moment de `apply` depuis KeePassXC, Bitwarden, 1Password, pass ou Vault (`{{ (keepassxc "Git interne").Password }}`), ou chiffre un fichier entier avec age (`chezmoi add --encrypt ~/.ssh/config`).

## Bonnes pratiques

- Exclure clés privées SSH, jetons d'API, `.netrc`, historiques de shell.
- Garder des fichiers simples et commentés ; tester sur une machine jetable (conteneur, VM) avant de déployer partout.
- Sur les serveurs partagés, se limiter au strict nécessaire (alias, `.tmux.conf`, `.vimrc`).

Voir aussi : [[01-tmux-screen-zellij|tmux]] · [[02-shells-bash-zsh-fish-nushell|shells et Starship]]. Commandes : [[90-aide-memoire|aide-mémoire]].
