---
title: "terraform fmt / validate"
description: "macOS — terraform fmt / validate (Qualité & sortie) : Formate le code, valide la configuration, lit les sorties."
tags: [macos, commande, terraform]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Terraform |
| **Contexte** | Qualité & sortie |
| **Commande type** | `terraform validate` |

## Rôle

Formate le code, valide la configuration, lit les sorties.

## Options

| Option | Rôle |
| --- | --- |
| `fmt` | formate les fichiers |
| `-recursive` | (fmt) inclut les sous-dossiers |
| `-check` | (fmt) vérifie sans modifier |
| `validate` | valide la configuration |
| `output ‹nom›` | affiche une sortie |
| `-json` | sortie JSON |

## Exemples

**Formater**

```zsh
terraform fmt -recursive
```

**Valider**

```zsh
terraform validate
```

**Une sortie**

```zsh
terraform output ip_publique
```

## Dans les autres shells

- [[27-commandes/01-bash/25-terraform/terraform-fmt-validate|terraform fmt / validate (Bash)]]

*Mots-clés : terraform fmt validate output format lint vérifier iac*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
