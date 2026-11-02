---
title: GnuPG
description: GnuPG (GPL) — implémentation libre d'OpenPGP pour chiffrer et signer fichiers et courriels : installation (Linux, Gpg4win sous Windows avec Kleopatra, GPG Suite ou Homebrew sous macOS), génération de clés (ed25519/cv25519, sous-clés, expiration, certificat de révocation), import, export, serveurs de clés et WKD, confiance, chiffrement et déchiffrement, signatures détachées et vérification de logiciels téléchargés, gpg-agent et cartes à puce (YubiKey), signature des commits Git, sauvegarde des clés et rotation.
tags: [gnupg, gpg, openpgp, chiffrement, signature, kleopatra, yubikey]
icon: info
---

**GnuPG** (`gpg`) chiffre et **signe** des fichiers et courriels selon la norme **OpenPGP**. L'administrateur s'en sert pour **vérifier l'authenticité** des logiciels et dépôts téléchargés, signer des sauvegardes ou des commits, chiffrer des secrets pour des collègues, ou avec [[24-sops/01-presentation-utilisation|SOPS]] et les dépôts APT/RPM.

## Installation

| Système | Outil |
| --- | --- |
| Linux | `gnupg` (préinstallé presque partout) |
| Windows | **Gpg4win** (`winget install GnuPG.Gpg4win`) avec l'interface **Kleopatra** |
| macOS | `brew install gnupg` ou GPG Suite |

## Clés

```bash
gpg --full-generate-key                         # choisir ECC (ed25519/cv25519), expiration 2 ans, nom et e-mail
gpg --list-secret-keys --keyid-format long
gpg --output revocation-jk.asc --gen-revoke jk@corp.exemple.fr        # à conserver hors ligne
gpg --armor --export jk@corp.exemple.fr > jk-public.asc
gpg --armor --export-secret-keys jk@corp.exemple.fr > jk-secret.asc   # sauvegarde chiffrée et hors ligne uniquement
gpg --import collegue-public.asc ; gpg --fingerprint collegue@corp.exemple.fr   # vérifier l'empreinte par un autre canal
gpg --locate-keys collegue@exemple.org                                # recherche WKD/serveurs de clés
```

## Chiffrer, signer, vérifier

```bash
gpg --encrypt --armor -r collegue@corp.exemple.fr -r jk@corp.exemple.fr acces-vpn.txt   # le destinataire et soi-même
gpg --decrypt acces-vpn.txt.asc > acces-vpn.txt
gpg --symmetric --cipher-algo AES256 sauvegarde.tar                    # par phrase de passe
gpg --detach-sign --armor rapport.pdf ; gpg --verify rapport.pdf.asc rapport.pdf
# Vérifier un téléchargement
gpg --import cle-projet.asc && gpg --verify logiciel-1.2.tar.gz.sig logiciel-1.2.tar.gz
```

Signer ses commits : `git config --global user.signingkey <ID> && git config --global commit.gpgsign true`. Clés sur **YubiKey** : `gpg --card-edit` puis `keytocard` (la clé privée ne quitte plus la carte).

Suite : [[02-age|age]] · [[90-aide-memoire|aide-mémoire]].
