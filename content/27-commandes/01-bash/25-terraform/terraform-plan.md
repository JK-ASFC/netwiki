---
title: "terraform plan"
description: "Bash — terraform plan (Planification) : Calcule et affiche le plan d'exécution, sans rien appliquer."
tags: [bash, commande, terraform]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Terraform |
| **Contexte** | Planification |
| **Commande type** | `terraform plan` |

## Rôle

Calcule et affiche le plan d'exécution, sans rien appliquer.

## Options

| Option | Rôle |
| --- | --- |
| `-out ‹plan.tfplan›` | enregistre le plan |
| `-var ‹cle=valeur›` | variable |
| `-var-file ‹fichier.tfvars›` | fichier de variables |
| `-target ‹ressource›` | limite à une ressource |
| `-destroy` | plan de destruction |
| `-refresh=false` | ne rafraichit pas l'état |
| `-input=false` | sans invite |
| `-detailed-exitcode` | code de sortie détaillé (CI) |

## Exemples

**Voir le plan**

```bash
terraform plan
```

**Sauver le plan**

```bash
terraform plan -out tfplan
```

**Avec variables**

```bash
terraform plan -var-file prod.tfvars
```

## Dans les autres shells

- [[27-commandes/03-macos/26-terraform/terraform-plan|terraform plan (macOS)]]

*Mots-clés : terraform plan dry-run diff changement iac out*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
