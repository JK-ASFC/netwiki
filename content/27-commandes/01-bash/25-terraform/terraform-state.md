---
title: "terraform state"
description: "Bash — terraform state (État (state)) : Inspecte et manipule l'état Terraform."
tags: [bash, commande, terraform]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Terraform |
| **Contexte** | État (state) |
| **Commande type** | `terraform state list` |

## Rôle

Inspecte et manipule l'état Terraform.

## Options

| Option | Rôle |
| --- | --- |
| `list` | liste les ressources |
| `show ‹ressource›` | détail d'une ressource |
| `rm ‹ressource›` | retire de l'état (sans détruire) |
| `mv ‹src dst›` | déplace/renomme dans l'état |
| `pull` | exporte l'état (JSON) |

## Exemples

**Lister**

```bash
terraform state list
```

**Détail**

```bash
terraform state show aws_instance.web
```

**Retirer**

```bash
terraform state rm aws_instance.old
```

## Dans les autres shells

- [[27-commandes/03-macos/26-terraform/terraform-state|terraform state (macOS)]]

*Mots-clés : terraform state état list show rm mv import iac*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
