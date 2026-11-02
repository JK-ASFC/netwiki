---
title: Présentation, installation et utilisation
description: Terragrunt (Gruntwork, MIT) et Terramate (MPL 2.0) — orchestrer Terraform et OpenTofu sur de nombreux environnements et modules : Terragrunt (terragrunt.hcl, configuration du backend et des fournisseurs générée, include et locals, dépendances entre unités et sorties, run --all, stacks, cache), Terramate (piles, génération de code, orchestration par graphe, détection des changements avec Git pour n'exécuter que les piles modifiées, intégration CI), installation Windows, Linux, macOS et choix selon la structure du dépôt.
tags: [terragrunt, terramate, terraform, opentofu, iac, monorepo]
icon: info
---

Quand un dépôt [[04-terraform/01-presentation-installation|Terraform]] / [[04-terraform/04-opentofu|OpenTofu]] grossit (plusieurs environnements, régions, dizaines de modules), on répète backends et fournisseurs partout et l'on applique tout à chaque modification. **Terragrunt** supprime la duplication et gère les dépendances ; **Terramate** organise des **piles** et n'exécute que celles touchées par un changement Git.

## Installation

| Outil | Windows | macOS | Linux |
| --- | --- | --- | --- |
| Terragrunt | `winget install Gruntwork.Terragrunt` | `brew install terragrunt` | binaire GitHub |
| Terramate | binaire GitHub | `brew install terramate` | binaire GitHub, `go install` |

## Terragrunt

```text
infra/
├── root.hcl                      # backend et fournisseur communs
├── prod/
│   ├── reseau/terragrunt.hcl
│   └── cluster/terragrunt.hcl   # dépend de reseau
└── recette/…
```

```hcl
# root.hcl
remote_state {
  backend = "s3"
  generate = { path = "backend.tf", if_exists = "overwrite" }
  config = {
    bucket = "etat-terraform"
    key    = "${path_relative_to_include()}/terraform.tfstate"
    endpoints = { s3 = "https://minio.corp.exemple.fr" }
    region = "us-east-1"
    use_path_style = true
    skip_credentials_validation = true
  }
}
```

```hcl
# prod/cluster/terragrunt.hcl
include "root" { path = find_in_parent_folders("root.hcl") }
terraform { source = "git::https://git.corp.exemple.fr/infra/modules.git//cluster?ref=v2.3.0" }
dependency "reseau" { config_path = "../reseau" }
inputs = { vlan_id = dependency.reseau.outputs.vlan_cluster, nb_noeuds = 5 }
```

```bash
cd infra/prod/cluster && terragrunt plan ; terragrunt apply
cd infra/prod && terragrunt run --all plan        # toutes les unités, dans l'ordre des dépendances (« run-all » sur les anciennes versions)
```

## Terramate

```bash
terramate create infra/prod/reseau ; terramate create infra/prod/cluster --after /infra/prod/reseau
terramate list --changed                          # piles modifiées depuis la branche principale
terramate run --changed -- terraform plan         # n'exécuter que ce qui a changé
terramate generate                                # code généré (backend, fournisseurs) à partir de blocs globals
```

Commandes : [[90-aide-memoire|aide-mémoire]].
