---
title: gopass — aide-mémoire des commandes
description: Commandes gopass avec exemples — setup, init, generate, insert, show (-c, -o), edit, ls, find, grep, otp, mv, cp, rm, history, sync, mounts, recipients, audit, fsck, config, et commandes GPG utiles (export/import de clés publiques).
tags: [aide-mémoire, gopass, gpg, secrets]
icon: terminal
---

Référence rapide ; explications dans [[01-presentation-installation|gopass]].

```bash
gopass setup ; gopass init --store equipe-reseau --path ~/.local/share/gopass/stores/equipe-reseau
gopass generate -s reseau/ap-wifi/psk 32          # -s : avec symboles
gopass insert -m serveurs/srv-db-01               # -m : multiligne
gopass show -c reseau/fw-paris/admin ; gopass show -o reseau/fw-paris/admin
gopass edit serveurs/srv-db-01
gopass ls ; gopass ls -f ; gopass find radius ; gopass grep 10.0.20
gopass otp reseau/fw-paris/admin
gopass cp modele/serveur serveurs/srv-web-02 ; gopass mv a b ; gopass rm -r obsolete/
gopass history reseau/fw-paris/admin
gopass sync
gopass mounts ; gopass mounts add equipe git@gitlab.corp.exemple.fr:infra/secrets.git ; gopass mounts remove equipe
gopass recipients ; gopass recipients add bob@corp.exemple.fr ; gopass recipients remove bob@corp.exemple.fr
gopass audit                                      # mots de passe faibles ou dupliqués
gopass fsck                                       # vérifie et répare le magasin
gopass config
gpg --armor --export alice@corp.exemple.fr > alice.asc ; gpg --import bob.asc ; gpg --list-keys
```
