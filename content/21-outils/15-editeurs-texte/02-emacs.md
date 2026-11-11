---
title: GNU Emacs
description: GNU Emacs pour l'administrateur — installation (interface graphique ou terminal), raccourcis essentiels, Dired, édition de fichiers distants et en root avec TRAMP (/ssh:, /sudo:, sauts multiples), Magit pour Git, Org mode pour les procédures et notes, Eglot (LSP) et use-package intégrés, mode serveur avec emacsclient, configuration init.el et distributions Doom Emacs et Spacemacs.
tags: [emacs, éditeur, tramp, magit, org mode, elisp, eglot, lsp]
icon: file-code
---

**GNU Emacs** (licence GPL) est un éditeur extensible en **Emacs Lisp**. Pour l'administrateur, ses atouts sont **TRAMP** (éditer des fichiers distants ou en root de façon transparente), **Magit** (une interface Git très efficace) et **Org mode** (notes, procédures, listes de tâches exécutables).

```bash
sudo apt install emacs ; sudo dnf install emacs ; brew install --cask emacs ; winget install GNU.Emacs
sudo apt install emacs-nox      # serveur : version sans interface graphique
emacs -nw fichier               # ouvrir dans le terminal
```

## Raccourcis essentiels

`C-` = Ctrl, `M-` = Alt (ou Échap puis la touche).

| Action | Raccourci |
| --- | --- |
| Ouvrir / enregistrer / enregistrer sous | `C-x C-f` / `C-x C-s` / `C-x C-w` |
| Quitter | `C-x C-c` |
| **Annuler la commande en cours** | `C-g` |
| Annuler la modification | `C-/` |
| Rechercher / en arrière | `C-s` / `C-r` |
| Rechercher et remplacer | `M-%` |
| Début / fin de ligne, de fichier | `C-a` / `C-e`, `M-<` / `M->` |
| Couper la ligne / coller | `C-k` / `C-y` |
| Marquer, copier, couper | `C-espace`, `M-w`, `C-w` |
| Découper la fenêtre / changer / fermer les autres | `C-x 2` ou `C-x 3` / `C-x o` / `C-x 1` |
| Changer de tampon / lister | `C-x b` / `C-x C-b` |
| Exécuter une commande par son nom | `M-x` |
| Aide sur une touche / une fonction | `C-h k` / `C-h f` ; tutoriel : `C-h t` |

## Dired : gérer les fichiers

`C-x d` ouvre un répertoire : `RET` ouvrir, `C` copier, `R` renommer ou déplacer, `D` supprimer, `m` marquer, `+` créer un dossier, `g` actualiser, `C-x C-q` passer en édition pour **renommer plusieurs fichiers** comme du texte.

## TRAMP : fichiers distants et root

Dans `C-x C-f`, on saisit un chemin spécial :

| Chemin | Effet |
| --- | --- |
| `/ssh:admin@serveur:/etc/nginx/nginx.conf` | Fichier distant par SSH |
| `/sudo::/etc/hosts` | Fichier local en root |
| `/ssh:admin@serveur\|sudo:serveur:/etc/ssh/sshd_config` | Fichier distant en root (saut SSH puis sudo) |
| `/ssh:bastion\|ssh:interne:/var/log/syslog` | Rebond par un bastion |
| `/docker:conteneur:/etc/app.conf` | Fichier dans un conteneur |

Dired, la recherche et `M-x shell` fonctionnent aussi sur ces chemins : on administre le serveur depuis l'Emacs local, avec sa configuration.

## Magit

`M-x magit-status` (ou `C-x g`) affiche l'état du dépôt : `s` indexer, `u` désindexer, `c c` valider, `P p` pousser, `F p` récupérer, `l l` historique, `b b` changer de branche. On peut indexer **des morceaux de fichier** en se plaçant dessus. Magit s'installe depuis MELPA (voir la configuration ci-dessous).

## Org mode

Fichiers `.org` : titres repliables (`*`, `**`), listes de tâches (`TODO`, `DONE`), tableaux qui s'alignent tout seuls, liens, dates. Les **blocs de code** s'exécutent dans le document (`C-c C-c`) : pratique pour des procédures d'exploitation dont on garde le résultat.

```text
* Procédure de mise à jour du serveur web
** TODO Vérifier l'espace disque
#+begin_src shell :dir /ssh:admin@web1:
df -h /
#+end_src
```

## Configuration

```elisp ~/.config/emacs/init.el
;; Dépôts de paquets
(require 'package)
(add-to-list 'package-archives '("melpa" . "https://melpa.org/packages/") t)
(package-initialize)

;; Réglages de base
(setq inhibit-startup-screen t
      make-backup-files nil          ; pas de fichiers fichier~
      ring-bell-function 'ignore)
(global-display-line-numbers-mode 1)
(savehist-mode 1)
(recentf-mode 1)

;; use-package est intégré depuis Emacs 29
(use-package magit :ensure t :bind ("C-x g" . magit-status))
(use-package yaml-mode :ensure t)

;; Eglot (client LSP intégré depuis Emacs 29)
(add-hook 'sh-mode-hook #'eglot-ensure)
(add-hook 'python-mode-hook #'eglot-ensure)
```

## Mode serveur

```bash
emacs --daemon                       # ou : systemctl --user enable --now emacs
emacsclient -c fichier               # nouvelle fenêtre instantanée
emacsclient -t fichier               # dans le terminal
export EDITOR="emacsclient -t" VISUAL="emacsclient -c -a ''"   # pour git, crontab -e, sudoedit
```

## Distributions

- **Doom Emacs** : rapide, raccourcis de Vim (evil-mode), modules à activer.
- **Spacemacs** : raccourcis de Vim ou d'Emacs, organisation par « couches ».

Voir aussi : [[01-vim-neovim|Vim et Neovim]] · [[03-kate-geany|Kate et Geany]]. Commandes : [[90-aide-memoire|aide-mémoire]].
