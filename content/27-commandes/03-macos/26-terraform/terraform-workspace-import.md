---
title: "terraform workspace / import"
description: "macOS — terraform workspace / import (Espaces & import) : Gère les espaces de travail et importe des ressources existantes."
tags: [macos, commande, terraform]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Terraform |
| **Contexte** | Espaces & import |
| **Commande type** | `terraform workspace list` |

## Rôle

Gère les espaces de travail et importe des ressources existantes.

## Options

| Option | Rôle |
| --- | --- |
| `workspace list` | liste les espaces |
| `workspace new ‹nom›` | crée un espace |
| `workspace select ‹nom›` | bascule d'espace |
| `import ‹adresse id›` | importe une ressource existante |

## Exemples

**Nouvel espace**

```zsh
terraform workspace new staging
```

**Basculer**

```zsh
terraform workspace select prod
```

**Importer**

```zsh
terraform import aws_instance.web i-0abc123
```

## Dans les autres shells

- [[27-commandes/01-bash/25-terraform/terraform-workspace-import|terraform workspace / import (Bash)]]

*Mots-clés : terraform workspace espace import état existant iac*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
