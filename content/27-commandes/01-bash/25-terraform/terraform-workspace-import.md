---
title: "terraform workspace / import"
description: "Bash — terraform workspace / import (Espaces & import) : Gère les espaces de travail et importe des ressources existantes."
tags: [bash, commande, terraform]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
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

```bash
terraform workspace new staging
```

**Basculer**

```bash
terraform workspace select prod
```

**Importer**

```bash
terraform import aws_instance.web i-0abc123
```

## Dans les autres shells

- [[27-commandes/03-macos/26-terraform/terraform-workspace-import|terraform workspace / import (macOS)]]

*Mots-clés : terraform workspace espace import état existant iac*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
