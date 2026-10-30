---
title: État distant, modules et import
description: Gérer l'état Terraform / OpenTofu en équipe (backends S3/MinIO, HTTP GitLab, PostgreSQL, Azure, verrouillage, chiffrement, données sensibles), structurer le code en modules et environnements, utiliser workspaces, boucles et expressions, importer l'existant (blocs import, génération de configuration), refactoriser avec moved / removed et manipuler l'état en sécurité.
tags: [terraform, opentofu, état, backend, modules, import, moved, workspaces]
icon: database
---

## L'état

Le fichier d'état (`terraform.tfstate`) contient les identifiants et **tous les attributs** des ressources, **y compris des secrets** (mots de passe générés, clés). Il ne doit **jamais** être versionné dans Git ni rester sur un poste.

| Backend | Verrouillage | Usage |
| --- | --- | --- |
| `s3` (AWS S3, **MinIO**, Ceph RGW) | Fichier de verrou S3 (`use_lockfile = true`, Terraform ≥ 1.10) ou DynamoDB | Courant, auto-hébergeable avec [[07-minio/01-presentation-installation\|MinIO]] |
| `http` (**GitLab** Terraform state) | Oui (API GitLab) | Projets déjà sur GitLab |
| `pg` (PostgreSQL) | Oui (verrous consultatifs) | Simple sur site |
| `azurerm` | Oui (bail du blob) | Azure |
| `remote` / `cloud` | Oui | HCP Terraform / Terraform Enterprise |

```hcl backend.tf (MinIO)
terraform {
  backend "s3" {
    bucket                      = "terraform-etats"
    key                         = "reseau/dns/terraform.tfstate"
    region                      = "fr-paris-1"
    endpoints                   = { s3 = "https://minio.corp.exemple.fr" }
    use_path_style              = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    use_lockfile                = true
  }
}
```

```hcl backend.tf (GitLab)
terraform {
  backend "http" {}
}
# terraform init \
#   -backend-config="address=https://gitlab.corp.exemple.fr/api/v4/projects/42/terraform/state/prod" \
#   -backend-config="lock_address=https://gitlab.corp.exemple.fr/api/v4/projects/42/terraform/state/prod/lock" \
#   -backend-config="unlock_address=https://gitlab.corp.exemple.fr/api/v4/projects/42/terraform/state/prod/lock" \
#   -backend-config="lock_method=POST" -backend-config="unlock_method=DELETE" \
#   -backend-config="username=ci" -backend-config="password=$GITLAB_TOKEN"
```

**OpenTofu** chiffre l'état nativement (bloc `encryption` avec une clé dérivée d'une phrase de passe, d'OpenBao ou d'un KMS — exemple et migration dans [[04-opentofu|OpenTofu]]). Avec Terraform, chiffrez au niveau du stockage (SSE, chiffrement du compartiment) et restreignez l'accès.

## Modules

```text Organisation type
infra/
├── modules/
│   ├── vm-linux/          (variables.tf, main.tf, outputs.tf, versions.tf)
│   └── vlan-netbox/
└── environnements/
    ├── preprod/  (main.tf, backend.tf, preprod.tfvars)
    └── prod/     (main.tf, backend.tf, prod.tfvars)
```

```hcl environnements/prod/main.tf
module "web" {
  source   = "../../modules/vm-linux"
  for_each = { "srv-web-01" = "10.0.20.11", "srv-web-02" = "10.0.20.12" }

  nom       = each.key
  adresse   = each.value
  vcpu      = 2
  memoire   = 4096
  reseau    = "VLAN20-Serveurs"
  modele    = "debian-12-modele"
}

module "vlan_iot" {
  source  = "git::https://git.corp.exemple.fr/infra/modules.git//vlan-netbox?ref=v1.4.0"
  vid     = 40
  nom     = "IOT"
  site    = "paris"
  prefixe = "10.0.40.0/24"
}
```

Versionnez les modules partagés (étiquettes Git `?ref=v1.4.0`) : un changement de module ne doit pas modifier silencieusement tous les environnements.

## Expressions utiles

| Construction | Usage |
| --- | --- |
| `count = var.actif ? 1 : 0` | Ressource conditionnelle |
| `for_each = toset(var.noms)` | Une ressource par élément (clés stables, préférable à `count`) |
| `dynamic "rule" { … }` | Blocs répétés (règles de pare-feu) |
| `locals { … }` | Valeurs calculées |
| `lifecycle { prevent_destroy = true }` | Protéger une ressource critique |
| `lifecycle { ignore_changes = [tags] }` | Ignorer les modifications faites hors Terraform |
| `lifecycle { create_before_destroy = true }` | Remplacement sans coupure |

**Workspaces** (`terraform workspace new preprod`) : plusieurs états pour un même code ; pratique pour des copies identiques, mais des **répertoires par environnement** restent plus lisibles pour prod/préprod.

## Importer l'existant

```hcl import.tf
import {
  to = dns_a_record_set.serveurs["srv-web-01"]
  id = "srv-web-01.corp.exemple.fr."
}
```

```bash
terraform plan -generate-config-out=genere.tf   # génère la configuration des blocs import sans ressource
terraform apply
```

Reprenez ensuite le code généré (variables, nettoyage des attributs calculés) et supprimez les blocs `import` une fois appliqués.

## Refactoriser sans détruire

```hcl
moved {
  from = vsphere_virtual_machine.web
  to   = module.web["srv-web-01"].vsphere_virtual_machine.vm
}

removed {
  from = dns_a_record_set.ancien
  lifecycle { destroy = false }      # retirer de l'état sans supprimer l'objet réel
}
```

## Manipuler l'état

```bash
terraform state list
terraform state show 'module.web["srv-web-01"].vsphere_virtual_machine.vm'
terraform state mv  ancien_nom nouveau_nom      # préférer les blocs moved (tracés dans le code)
terraform state rm  ressource.retiree           # préférer removed
terraform force-unlock <ID_DU_VERROU>           # seulement si aucun plan/apply n'est en cours
terraform state pull > sauvegarde-etat.json     # copie de sécurité avant opération manuelle
```
