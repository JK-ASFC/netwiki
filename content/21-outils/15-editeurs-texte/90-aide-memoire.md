---
title: Éditeurs de texte — aide-mémoire
description: Commandes et raccourcis essentiels de Vim et Neovim (modes, édition, recherche, remplacement, vimdiff, sudoedit, :checkhealth), GNU Emacs (raccourcis, TRAMP, Magit, daemon et emacsclient), Kate (sessions, SFTP) et Geany (compiler, exécuter).
tags: [aide-mémoire, vim, neovim, emacs, tramp, kate, geany]
icon: terminal
---

Explications : [[01-vim-neovim|Vim et Neovim]] · [[02-emacs|GNU Emacs]] · [[03-kate-geany|Kate et Geany]].

## Vim et Neovim

```text
i a o O A        passer en insertion         Échap         revenir en mode normal
:w :q :wq :q!    enregistrer, quitter        ZZ            enregistrer et quitter
gg G 42G         début, fin, ligne 42        0 $ w b       début/fin de ligne, mot suivant/précédent
dd yy p x u      supprimer/copier la ligne, coller, supprimer un caractère, annuler ; Ctrl+r rétablir
/motif n N       rechercher                  :%s/a/b/gc    remplacer avec confirmation
v V Ctrl+v       sélection caractères, lignes, bloc      > <   indenter
:sp :vsp Ctrl+w w   découper, changer de fenêtre        :tabnew gt   onglets
qa … q @a        macro                       .             répéter
```

```bash
vimtutor ; vimdiff a.conf b.conf ; sudoedit /etc/fichier ; vim +42 fichier
vim scp://admin@serveur//etc/hosts
nvim +checkhealth ; nvim --headless "+Lazy! sync" +qa
```

## GNU Emacs

```text
C-x C-f  ouvrir    C-x C-s  enregistrer    C-x C-c  quitter    C-g  annuler la commande
C-s / C-r  rechercher    M-%  remplacer    C-/  annuler    C-x 2 / C-x 3 / C-x 1 / C-x o  fenêtres
C-x d  Dired    C-x g  Magit    M-x  commande    C-h t  tutoriel
/ssh:admin@srv:/etc/hosts    /sudo::/etc/hosts    /ssh:admin@srv|sudo:srv:/etc/hosts
```

```bash
emacs -nw fichier ; emacs --daemon ; emacsclient -t fichier ; emacsclient -c fichier
```

## Kate et Geany

```bash
kate -s exploitation ; kate sftp://admin@serveur/etc/nginx/nginx.conf
geany fichier.py          # F8 compiler, F9 construire, F5 exécuter
```
