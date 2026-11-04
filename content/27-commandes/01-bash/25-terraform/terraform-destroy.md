---
title: "terraform destroy"
description: "Bash — terraform destroy (Destruction) : Détruit toute l'infrastructure gérée."
tags: [bash, commande, terraform]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Terraform |
| **Contexte** | Destruction |
| **Commande type** | `terraform destroy` |

## Rôle

Détruit toute l'infrastructure gérée.

## Options

| Option | Rôle |
| --- | --- |
| `-auto-approve` | sans confirmation |
| `-target ‹ressource›` | limite à une ressource |
| `-var ‹cle=valeur›` | variable |
| `-var-file ‹fichier.tfvars›` | fichier de variables |

## Exemples

**Tout détruire**

```bash
terraform destroy
```

**Une ressource**

```bash
terraform destroy -target aws_instance.web
```

## Dans les autres shells

- [[27-commandes/03-macos/26-terraform/terraform-destroy|terraform destroy (macOS)]]

*Mots-clés : terraform destroy détruire supprimer teardown iac*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
