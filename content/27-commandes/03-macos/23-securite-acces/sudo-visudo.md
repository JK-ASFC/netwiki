---
title: "sudo / visudo"
description: "macOS — sudo / visudo (Élévation de droits) : Exécute une commande en root ; visudo édite en sécurité la liste des autorisations."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Élévation de droits |
| **Commande type** | `sudo commande` |

## Rôle

Exécute une commande en root ; visudo édite en sécurité la liste des autorisations.

## En détail

sudo exécute une commande avec les droits administrateur, ponctuellement. visudo édite en sécurité la liste de qui a le droit d'utiliser sudo.

## Options

| Option | Rôle |
| --- | --- |
| `‹commande›` | exécute en root |
| `-u ‹utilisateur›` | exécute en tant qu'un autre compte |
| `-l` | liste vos droits sudo |
| `-k` | oublié l'authentification en cache |
| `visudo` | édite /etc/sudoers en validant la syntaxe |

## Exemples

**Une commande en root**

```zsh
sudo softwareupdate -i -a
```

**Éditer les droits**

```zsh
sudo visudo
```

**Voir mes droits**

```zsh
sudo -l
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/sudo-visudo|sudo / visudo (Bash)]]

*Mots-clés : sudo root administrateur visudo droits élévation privilèges*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
