---
title: Git — aide-mémoire des commandes
description: Commandes Git avec exemples — configuration (identité, éditeur, signature), dépôt (init, clone, remote), travail quotidien (status, add -p, commit, diff, log, show), branches (switch, merge, rebase, cherry-pick), synchronisation (fetch, pull --rebase, push, étiquettes), annulation (restore, reset, revert, reflog), remisage (stash), recherche (grep, blame, bisect), sous-modules et worktree, nettoyage, secrets et grands fichiers (LFS).
tags: [aide-mémoire, git, branches, rebase, reflog, stash, versionnage]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Git]].

## Configuration

```bash
git config --global user.name "Alice Martin"
git config --global user.email "alice.martin@exemple.fr"
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global core.autocrlf input          # Windows : true
git config --global gpg.format ssh && git config --global user.signingkey ~/.ssh/id_ed25519.pub && git config --global commit.gpgsign true
git config --list --show-origin
```

## Dépôt et travail quotidien

```bash
git init
git clone git@forge.exemple.fr:reseau/configs.git
git remote -v
git remote add amont https://github.com/projet/outil.git
git status -sb
git add -p                         # ajouter par morceaux
git commit -m "Ajoute la configuration du commutateur sw-paris-01"
git commit --amend --no-edit       # compléter le dernier commit (non poussé)
git diff                           # non indexé
git diff --staged
git log --oneline --graph --decorate --all -20
git log -p -- configs/sw-paris-01.cfg
git log --since="2 weeks ago" --author="Martin"
git show HEAD~1 --stat
```

## Branches et intégration

```bash
git switch -c correctif/vlan-voix
git switch main
git branch -vv
git merge --no-ff correctif/vlan-voix
git rebase main                    # rejouer sa branche sur main
git rebase -i HEAD~5               # réorganiser/fusionner des commits (non poussés)
git cherry-pick 3f2a1c9
git branch -d correctif/vlan-voix
git push origin --delete correctif/vlan-voix
```

## Synchronisation et étiquettes

```bash
git fetch --all --prune
git pull --rebase
git push -u origin correctif/vlan-voix
git push --force-with-lease        # après un rebase, sans écraser le travail des autres
git tag -a v1.4.0 -m "Version 1.4.0"
git push origin v1.4.0
```

## Annuler

```bash
git restore fichier.cfg                    # annuler les modifications non indexées
git restore --staged fichier.cfg           # désindexer
git reset --soft HEAD~1                    # défaire le commit, garder les changements indexés
git reset --hard origin/main               # revenir à l'état distant (perte des changements locaux !)
git revert 3f2a1c9                         # nouveau commit qui annule (historique partagé)
git reflog                                 # retrouver un état « perdu »
git checkout -b sauvetage HEAD@{3}
```

## Remisage, recherche, débogage

```bash
git stash push -m "essai en cours"
git stash list
git stash pop
git grep -n "snmp-server community"
git blame -L 10,30 configs/sw-paris-01.cfg
git bisect start && git bisect bad && git bisect good v1.3.0     # puis git bisect good/bad jusqu'au coupable, git bisect reset
```

## Sous-modules, worktree, nettoyage

```bash
git submodule add https://forge.exemple.fr/outils/scripts.git outils/scripts
git submodule update --init --recursive
git worktree add ../configs-hotfix hotfix/urgent
git clean -nd                              # simuler la suppression des fichiers non suivis
git clean -fd
git gc --prune=now
```

## Secrets et gros fichiers

```bash
git lfs install && git lfs track "*.iso" && git add .gitattributes
git rm --cached secrets.env && echo "secrets.env" >> .gitignore
# Un secret poussé est compromis : le révoquer, puis réécrire l'historique (git filter-repo) si nécessaire
git filter-repo --path secrets.env --invert-paths
```
