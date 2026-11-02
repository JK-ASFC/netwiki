---
title: GnuPG et age — aide-mémoire des commandes
description: Commandes gpg (full-generate-key, quick-generate-key, list-keys, list-secret-keys, fingerprint, import, export, export-secret-keys, edit-key, card-edit, gen-revoke, encrypt, decrypt, symmetric, sign, clearsign, detach-sign, verify, delete-keys, refresh-keys, gpgconf --kill gpg-agent) et age (age-keygen, -r, -R, -i, -d, -p, -a, -o) avec exemples.
tags: [aide-mémoire, gnupg, gpg, age]
icon: terminal
---

Explications : [[01-gnupg|GnuPG]] · [[02-age|age]].

```bash
gpg --quick-generate-key "JK <jk@corp.exemple.fr>" ed25519 sign 2y ; gpg --quick-add-key <empreinte> cv25519 encr 2y
gpg -k ; gpg -K ; gpg --fingerprint ID ; gpg --edit-key ID    # expire, adduid, trust, save
gpg --import cle.asc ; gpg --export -a ID > pub.asc ; gpg --delete-secret-and-public-keys ID ; gpg --refresh-keys
gpg -e -a -r ID fichier ; gpg -d fichier.asc ; gpg -c fichier ; gpg --clearsign msg.txt ; gpg -b -a fichier ; gpg --verify fichier.asc fichier
gpg --card-status ; gpgconf --kill gpg-agent ; echo RELOADAGENT | gpg-connect-agent
age-keygen -o cle.txt ; age-keygen -y cle.txt ; age -r age1… -o f.age f ; age -d -i cle.txt f.age > f ; age -p f > f.age ; age -R ~/.ssh/id_ed25519.pub f > f.age
```
