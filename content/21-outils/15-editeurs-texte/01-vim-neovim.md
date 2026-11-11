---
title: Vim et Neovim
description: L'éditeur présent sur tous les serveurs et son successeur moderne — Vim (modes, déplacements, édition, recherche et remplacement, fenêtres et onglets, registres, macros, vimdiff, enregistrer un fichier root, ~/.vimrc conseillé pour l'administrateur) et Neovim (configuration Lua init.lua, LSP et Treesitter intégrés, lazy.nvim, distributions LazyVim et kickstart.nvim, :checkhealth).
tags: [vim, neovim, vi, éditeur, terminal, vimrc, lua, lsp]
icon: file-code
---

`vi` (souvent Vim, parfois sa version minimale `vim-tiny` ou BusyBox) est installé sur **presque tous les systèmes Unix** : savoir l'utiliser est indispensable pour modifier une configuration sur un serveur ou un équipement. **Neovim** reprend Vim avec une configuration en Lua et des fonctions d'éditeur moderne intégrées.

| | Vim | Neovim |
| --- | --- | --- |
| Licence | Vim (compatible GPL) | Apache 2.0 et Vim |
| Configuration | `~/.vimrc` (Vimscript, Vim9 script) | `~/.config/nvim/init.lua` (Lua) ou `init.vim` |
| LSP (complétion, diagnostics) | Par greffon | **Intégré** |
| Coloration syntaxique avancée | Expressions régulières | **Treesitter** intégré |
| Présent par défaut | Quasi partout | À installer |

```bash
sudo apt install vim ; sudo dnf install vim-enhanced
sudo apt install neovim ; sudo dnf install neovim ; brew install neovim ; winget install Neovim.Neovim
vimtutor                     # tutoriel interactif de 30 minutes, en français si la langue du système l'est
```

## Les modes

| Mode | Entrer | Rôle |
| --- | --- | --- |
| **Normal** | `Échap` | Déplacements et commandes (mode de départ) |
| **Insertion** | `i` (avant le curseur), `a` (après), `o` (nouvelle ligne dessous), `O` (dessus), `A` (fin de ligne) | Saisir du texte |
| **Visuel** | `v` (caractères), `V` (lignes), `Ctrl+v` (bloc) | Sélectionner |
| **Commande** | `:` | Enregistrer, quitter, remplacer, configurer |

## L'essentiel

| Action | Commande |
| --- | --- |
| Enregistrer / quitter / les deux / quitter sans enregistrer | `:w` / `:q` / `:wq` ou `ZZ` / `:q!` |
| Début / fin de ligne | `0` / `$` |
| Mot suivant / précédent | `w` / `b` |
| Début / fin du fichier, ligne 42 | `gg` / `G` / `42G` ou `:42` |
| Supprimer caractère / ligne / jusqu'à la fin du mot | `x` / `dd` / `dw` |
| Copier une ligne / coller | `yy` / `p` |
| Annuler / rétablir | `u` / `Ctrl+r` |
| Rechercher / suivant / précédent | `/motif` / `n` / `N` |
| Remplacer dans tout le fichier (avec confirmation) | `:%s/ancien/nouveau/gc` |
| Répéter la dernière modification | `.` |
| Indenter / désindenter des lignes sélectionnées | `>` / `<` |
| Commenter un bloc | `Ctrl+v`, sélectionner, `I#`, `Échap` |

Les commandes se combinent : **opérateur + nombre + déplacement**. `d3w` supprime trois mots, `y$` copie jusqu'à la fin de la ligne, `ci"` remplace le texte entre guillemets.

## Fenêtres, onglets, fichiers

```text
:e /etc/hosts        ouvrir un fichier            :sp / :vsp     découper horizontalement / verticalement
Ctrl+w w             changer de fenêtre            :tabnew        nouvel onglet ; gt / gT pour naviguer
:ls  :b2             lister / afficher un tampon   :Explore       explorateur de fichiers (netrw)
```

## Macros et registres

```text
qa … q        enregistrer une macro dans le registre a     @a / 10@a    la rejouer une ou dix fois
"ayy          copier la ligne dans le registre a            "ap          coller le registre a
:reg          voir les registres                            "+y / "+p    presse-papiers du système (si compilé avec +clipboard)
```

## Astuces d'administrateur

```bash
vimdiff ancien.conf nouveau.conf          # comparer (]c / [c : différence suivante ; do / dp : récupérer / envoyer)
sudoedit /etc/ssh/sshd_config             # éditer en root avec SON vim et SA configuration
vim scp://admin@serveur//etc/nginx/nginx.conf   # éditer un fichier distant (netrw)
vim +42 fichier ; vim +/motif fichier     # ouvrir à la ligne 42 ou sur un motif
```

Fichier ouvert sans les droits ? `:w !sudo tee % > /dev/null` puis `:e!` (Vim ; avec Neovim, préférer `sudoedit`).

## ~/.vimrc conseillé

```vim ~/.vimrc
set nocompatible
syntax on
filetype plugin indent on
set number relativenumber      " numéros de ligne
set ignorecase smartcase       " recherche insensible à la casse sauf si majuscule
set incsearch hlsearch
set expandtab tabstop=4 shiftwidth=4
set autoindent
set mouse=a
set scrolloff=5
set undofile undodir=~/.vim/undo   " annulation persistante (créer le dossier)
autocmd FileType yaml setlocal tabstop=2 shiftwidth=2
nnoremap <Space> :nohlsearch<CR>
```

## Neovim

```lua ~/.config/nvim/init.lua
vim.g.mapleader = " "
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.expandtab = true
vim.opt.shiftwidth = 4
vim.opt.ignorecase = true
vim.opt.smartcase = true
vim.opt.clipboard = "unnamedplus"
vim.opt.undofile = true

-- Serveur de langage (Neovim 0.11 et plus) : ici bash-language-server, à installer à part
vim.lsp.config("bashls", { cmd = { "bash-language-server", "start" }, filetypes = { "sh", "bash" } })
vim.lsp.enable("bashls")
```

- **Gestion des greffons** : *lazy.nvim* est le gestionnaire le plus utilisé ; *mason.nvim* installe les serveurs de langage (bash, YAML, Ansible, Terraform, Python…).
- **Distributions prêtes à l'emploi** : **kickstart.nvim** (un seul fichier commenté, idéal pour apprendre) et **LazyVim** (complet).
- `:checkhealth` diagnostique l'installation (presse-papiers, Python, serveurs de langage, Treesitter).

```bash
nvim --headless "+Lazy! sync" +qa         # synchroniser les greffons sans interface (scripts, CI)
```

Voir aussi : [[02-emacs|GNU Emacs]] · [[03-kate-geany|Kate et Geany]]. Commandes : [[90-aide-memoire|aide-mémoire]].
