---
title: "terraform init"
description: "macOS — terraform init (Initialisation) : Initialise un répertoire de travail (providers, backend, modules)."
tags: [macos, commande, terraform]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | macOS |
| **Catégorie** | Terraform |
| **Contexte** | Initialisation |
| **Commande type** | `terraform init` |

## Rôle

Initialise un répertoire de travail (providers, backend, modules).

## Options

| Option | Rôle |
| --- | --- |
| `-upgrade` | met à jour providers et modules |
| `-reconfigure` | reconfigure le backend |
| `-migrate-state` | migre l'état vers un nouveau backend |
| `-backend-config ‹fichier›` | config du backend |
| `-input=false` | sans invite interactive |
| `-get=false` | ne télécharge pas les modules |

## Exemples

**Initialiser**

```zsh
terraform init
```

**Mettre à jour**

```zsh
terraform init -upgrade
```

## Dans les autres shells

- [[27-commandes/01-bash/25-terraform/terraform-init|terraform init (Bash)]]

*Mots-clés : terraform init provider backend module initialiser iac*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
