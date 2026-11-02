---
title: age
description: age (BSD) — outil de chiffrement de fichiers moderne, simple et sans configuration : clés X25519 (age-keygen), destinataires multiples, chiffrement vers des clés SSH, chiffrement par phrase de passe, armure ASCII, intégration avec SOPS, greffons (YubiKey avec age-plugin-yubikey, TPM), installation Linux, Windows, macOS, implémentation Rust rage, et comparaison avec GnuPG.
tags: [age, chiffrement, x25519, sops, ssh, fichiers]
icon: info
---

**age** (« a-gué ») ne fait qu'une chose : **chiffrer des fichiers**, avec des clés courtes et sans trousseau ni configuration. Il convient pour chiffrer des sauvegardes, transmettre un secret ou protéger des fichiers dans Git avec [[24-sops/01-presentation-utilisation|SOPS]]. Pour les signatures et la messagerie, [[01-gnupg|GnuPG]] reste nécessaire.

| Système | Installation |
| --- | --- |
| Debian/Ubuntu, RHEL | `sudo apt install age` · `sudo dnf install age` |
| Windows | `winget install FiloSottile.age` |
| macOS | `brew install age` |

```bash
age-keygen -o ~/.config/age/cle.txt              # affiche la clé publique « age1… »
age -r age1qz…exemple -r age1xy…collegue -o secrets.tar.age secrets.tar     # plusieurs destinataires
age -d -i ~/.config/age/cle.txt -o secrets.tar secrets.tar.age
age -R ~/.ssh/id_ed25519.pub -o note.age note.txt                           # vers une clé SSH existante
age -d -i ~/.ssh/id_ed25519 note.age
age -p -o sauvegarde.tar.age sauvegarde.tar                                 # phrase de passe
age -a -r age1qz…exemple message.txt                                        # sortie ASCII (copier-coller)
tar czf - /etc | age -r age1qz…exemple > etc-$(date +%F).tar.gz.age         # sauvegarde chiffrée à la volée
```

Clé sur **YubiKey** : `age-plugin-yubikey` (la clé privée reste dans la clé matérielle). Conserver une **clé de secours** hors ligne parmi les destinataires des sauvegardes.

Commandes : [[90-aide-memoire|aide-mémoire]].
