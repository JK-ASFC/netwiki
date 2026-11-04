---
title: "ssh-copy-id"
description: "Bash — ssh-copy-id (Accès distant / Bastion) : Pousse ta clé publique vers le serveur."
tags: [bash, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | SSH |
| **Contexte** | Accès distant / Bastion |
| **Commande type** | `ssh-copy-id -i ~/.ssh/id_ed25519.pub edwin@10.20.0.2` |

## Rôle

Pousse ta clé publique vers le serveur.

## En détail

Installe votre clé publique sur un serveur distant pour y autoriser la connexion par clé. Évite de copier le fichier à la main.

## Options

| Option | Rôle |
| --- | --- |
| `-i ‹cle›` | clé publique |
| `-p ‹port›` | port |

## Exemples

**Pousser sa clé**

```bash
ssh-copy-id edwin@10.20.0.2
```

## Dans les autres shells

- [[27-commandes/03-macos/24-ssh/ssh-copy-id|ssh-copy-id (macOS)]]

*Mots-clés : déployer clé publique authorized_keys autoriser accès ssh-copy-id*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
