---
title: "lynis upload-only"
description: "macOS — lynis upload-only (Audit / Lynis Enterprise) : Envoie le fichier de rapport déjà produit vers un serveur Lynis Enterprise, sans refaire d'audit. Sans Enterprise, cette commande n'a pas d'objet."
tags: [macos, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Sécurité & accès |
| **Contexte** | Audit / Lynis Enterprise |
| **Commande type** | `lynis upload-only` |

## Rôle

Envoie le fichier de rapport déjà produit vers un serveur Lynis Enterprise, sans refaire d'audit. Sans Enterprise, cette commande n'a pas d'objet.

## Options

| Option | Rôle |
| --- | --- |
| `(licence) clé de licence dans le profil` | nécessaire pour envoyer |
| `(équivalent) lynis audit system --upload` | auditer puis envoyer |
| `(curl) upload-tool-arguments` | options de curl, proxy compris |

## Exemples

**Envoyer le dernier rapport**

```zsh
lynis upload-only
```

**Auditer puis envoyer**

```zsh
sudo lynis audit system --upload
```

**Voir les réglages d'envoi**

```zsh
lynis show settings
```

## Dans les autres shells

- [[27-commandes/01-bash/22-securite-acces/lynis-upload-only|lynis upload-only (Bash)]]

*Mots-clés : lynis upload-only upload enterprise rapport envoi cisofy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
