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

## Réinitialiser : les trois modes

| Commande | Index | Répertoire de travail | Usage |
| --- | --- | --- | --- |
| `git reset --soft HEAD~1` | conservé | conservé | Défaire le commit, regrouper |
| `git reset --mixed HEAD~1` (défaut) | réinitialisé | conservé | Défaire commit + désindexer |
| `git reset --hard HEAD~1` | réinitialisé | **écrasé** | Tout jeter (destructif) |

```bash
git reset <commit> -- fichier       # désindexer un fichier précis
git restore --source=HEAD~2 fichier # récupérer une ancienne version d'un fichier
```

## Rebase avancé et fusion

```bash
git rebase --onto main correctif~3 correctif    # déplacer seulement les 3 derniers commits sur main
git rebase -i --autosquash HEAD~5               # fixup!/squash! regroupés automatiquement
git rebase --continue ; git rebase --abort ; git rebase --skip
git merge --no-ff --no-commit sujet             # fusionner sans valider (inspecter avant)
git merge -X ours sujet ; git merge -X theirs sujet   # stratégie de résolution
git merge --squash sujet                        # un seul commit à partir d'une branche
git mergetool                                    # résolveur graphique de conflits
git rerere                                       # réutilise la résolution de conflits déjà vus
```

## Historique : formats et recherche

```bash
git log --oneline --graph --decorate --all
git log --pretty=format:'%h %ad %an %s' --date=short
git log --stat ; git log -p ; git log --follow -- fichier.cfg
git log -S "motDePasse" --oneline        # pioche : commits où la chaîne apparaît/disparaît
git log -G "regex" -p                     # idem par expression rationnelle
git log main..sujet ; git log sujet ^main # commits d'une branche absents de l'autre
git shortlog -sn                          # nombre de commits par auteur
git describe --tags --dirty               # nom lisible basé sur la dernière étiquette
git range-diff main sujet-v1 sujet-v2     # comparer deux versions d'une série
```

## Notes, archive, bundle

```bash
git notes add -m "Validé par la revue sécurité" <commit>
git archive --format=tar.gz -o release-1.4.2.tgz v1.4.2           # exporter un arbre sans .git
git bundle create depot.bundle --all                              # dépôt dans un seul fichier (transfert hors ligne)
git clone depot.bundle recupere
```

## Inspection bas niveau (plomberie)

```bash
git rev-parse HEAD ; git rev-parse --short HEAD ; git rev-parse --abbrev-ref HEAD
git rev-list --count HEAD                 # nombre de commits
git cat-file -p HEAD ; git cat-file -t <sha>    # contenu / type d'un objet
git ls-files ; git ls-files --others --exclude-standard   # fichiers suivis / non suivis
git show-ref ; git for-each-ref --format='%(refname:short)'
git count-objects -vH                     # taille de la base d'objets
```

## Worktree, sparse-checkout, maintenance

```bash
git worktree add ../projet-hotfix hotfix/urgent ; git worktree list ; git worktree remove ../projet-hotfix
git sparse-checkout init --cone ; git sparse-checkout set apps/web libs/commun   # extraire une partie d'un mono-dépôt
git maintenance start                     # tâches d'entretien automatiques (gc, commit-graph…)
git commit-graph write --reachable        # accélère les parcours d'historique
```

## Sous-modules (compléments)

```bash
git submodule update --init --recursive --remote
git submodule foreach 'git switch main && git pull'
git -c protocol.file.allow=always submodule add ../lib.git libs/lib
git submodule deinit -f libs/lib && git rm libs/lib      # retirer un sous-module
```

## Configuration avancée

```bash
git config --global alias.lg "log --oneline --graph --decorate --all"
git config --global alias.st "status -sb"
git config --global rerere.enabled true
git config --global merge.conflictstyle zdiff3
git config --global rebase.autosquash true
git config --global push.autoSetupRemote true
git config --global diff.algorithm histogram
git config --global maintenance.auto false
# Identité conditionnelle par répertoire (perso vs pro)
git config --global includeIf.gitdir:~/pro/.path ~/pro/.gitconfig
```

## Nettoyage d'un secret poussé

```bash
pip install git-filter-repo         # ou paquet git-filter-repo
git filter-repo --invert-paths --path secrets.env        # supprimer un fichier de tout l'historique
git filter-repo --replace-text expressions.txt            # remplacer des chaînes (ex. motDePasse==>***)
# Puis : révoquer le secret, forcer la mise à jour du distant, prévenir l'équipe (clones à refaire)
```

> [!WARNING]
> `git filter-repo` et `reset --hard` réécrivent ou détruisent l'historique. Ne jamais réécrire une branche partagée sans coordination ; un secret exposé reste compromis même après réécriture (le **révoquer**).
