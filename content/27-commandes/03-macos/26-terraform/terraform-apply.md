---
title: "terraform apply"
description: "macOS — terraform apply (Application) : Applique les changements pour atteindre l'état désiré."
tags: [macos, commande, terraform]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Terraform |
| **Contexte** | Application |
| **Commande type** | `terraform apply` |

## Rôle

Applique les changements pour atteindre l'état désiré.

## Options

| Option | Rôle |
| --- | --- |
| `-auto-approve` | sans confirmation |
| `-var ‹cle=valeur›` | variable |
| `-var-file ‹fichier.tfvars›` | fichier de variables |
| `-target ‹ressource›` | limite à une ressource |
| `-parallelism ‹N›` | opérations en parallèle (défaut 10) |
| `-input=false` | sans invite |

## Exemples

**Appliquer**

```zsh
terraform apply
```

**Sans confirmation**

```zsh
terraform apply -auto-approve
```

**Un plan sauve**

```zsh
terraform apply tfplan
```

## Dans les autres shells

- [[27-commandes/01-bash/25-terraform/terraform-apply|terraform apply (Bash)]]

*Mots-clés : terraform apply appliquer deploy auto-approve iac*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
