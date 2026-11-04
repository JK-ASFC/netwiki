---
title: "lynis upload-only"
description: "Bash — lynis upload-only (Audit / Lynis Enterprise) : Envoie le fichier de rapport déjà produit vers un serveur Lynis Enterprise, sans refaire d'audit. Sans Enterprise, cette commande n'a pas d'objet."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
lynis upload-only
```

**Auditer puis envoyer**

```bash
sudo lynis audit system --upload
```

**Voir les réglages d'envoi**

```bash
lynis show settings
```

## Dans les autres shells

- [[27-commandes/03-macos/23-securite-acces/lynis-upload-only|lynis upload-only (macOS)]]

*Mots-clés : lynis upload-only upload enterprise rapport envoi cisofy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
