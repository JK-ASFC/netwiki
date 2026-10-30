---
title: OpenTofu — présentation, fonctions propres et migration
description: OpenTofu, le fork libre de Terraform (MPL 2.0, Linux Foundation puis CNCF) — historique et gouvernance, compatibilité avec Terraform, registre OpenTofu, différences de fonctionnement, chiffrement natif de l'état et des plans, évaluation anticipée des variables (backend, sources de modules), fournisseurs multiples avec for_each, option -exclude, fichiers .tofu, registres OCI, tests, migration depuis Terraform et retour arrière.
tags: [opentofu, tofu, terraform, iac, chiffrement, état, migration, mpl, oci, linux foundation]
icon: git-branch
---

**OpenTofu** est un outil d'infrastructure en tant que code **libre** (licence **MPL 2.0**), né en 2023 d'un fork de Terraform 1.5. Il reprend le même langage (**HCL**), les mêmes fichiers `*.tf`, le même format d'état et les mêmes fournisseurs ; la commande s'appelle `tofu`. Les concepts généraux (fournisseurs, ressources, état, plan) sont expliqués dans [[01-presentation-installation|Terraform — présentation]] ; cette page décrit ce qu'OpenTofu apporte **en propre** et comment y migrer.

## Historique et gouvernance

| Date | Événement |
| --- | --- |
| Août 2023 | HashiCorp passe Terraform (versions suivant la 1.5.x) de la MPL 2.0 à la **BSL 1.1** |
| Août–sept. 2023 | Manifeste **OpenTF** signé par des éditeurs et utilisateurs ; fork accepté par la **Linux Foundation** et renommé **OpenTofu** |
| Janv. 2024 | **OpenTofu 1.6** : première version stable, registre public, `tofu test` |
| 2024 | 1.7 (chiffrement de l'état, fonctions des fournisseurs, `removed`), 1.8 (évaluation anticipée, fichiers `.tofu`) |
| 2025 | 1.9 (`for_each` sur les fournisseurs, `-exclude`), 1.10 (registres **OCI**, verrou S3 natif, fournisseur de clés externe) ; projet accueilli par la **CNCF** |

Points clés pour une entreprise :

- **Licence MPL 2.0** sans restriction d'usage : on peut l'intégrer à une offre commerciale, à un service managé ou à un outil interne sans analyse juridique de la BSL.
- **Gouvernance ouverte** : comité technique multi-éditeurs, feuille de route publique, fonctionnalités proposées et votées par la communauté (RFC sur GitHub `opentofu/opentofu`).
- **Registre public** `registry.opentofu.org` : il référence les mêmes fournisseurs et modules que le registre HashiCorp (ils sont publiés sur GitHub), signés par leurs auteurs.

> [!NOTE]
> Terraform reste parfaitement utilisable en interne sous BSL. Le choix se fait surtout sur la **licence**, la **gouvernance**, les **fonctions propres** décrites ci-dessous et l'intégration éventuelle à **HCP Terraform** (exclusif à Terraform).

## Ce qui est identique

| Élément | Terraform | OpenTofu |
| --- | --- | --- |
| Langage | HCL, fichiers `*.tf`, `*.tfvars`, `*.tf.json` | Idem, plus les fichiers `*.tofu` (voir plus bas) |
| Bloc de configuration | `terraform { required_providers {…} backend {…} }` | Même bloc `terraform { }` |
| Commandes | `terraform init/plan/apply/state/import…` | `tofu init/plan/apply/state/import…` (mêmes options) |
| Variables d'environnement | `TF_VAR_*`, `TF_LOG`, `TF_CLI_ARGS`, `TF_DATA_DIR` | Les mêmes noms `TF_*` |
| Fournisseurs | `hashicorp/aws`, `bpg/proxmox`, `e-breuninger/netbox`… | Mêmes fournisseurs, servis par `registry.opentofu.org` |
| Backends | s3, http, pg, azurerm, gcs, consul, kubernetes, local | Les mêmes (sauf `cloud` / `remote` liés à HCP) |
| Format d'état | JSON v4 | JSON v4 (compatible tant que l'état n'est pas chiffré) |

## Ce qui diffère

| Fonction | OpenTofu | Terraform |
| --- | --- | --- |
| Chiffrement de l'état et des plans | **Natif** (bloc `encryption`) | Non : chiffrement côté stockage uniquement |
| Variables et `locals` dans `backend` et `source` des modules | **Oui** (évaluation anticipée) | Non : valeurs littérales ou `-backend-config` |
| `for_each` sur un bloc `provider` | **Oui** | Non : un alias par instance |
| Exclure une ressource du plan | **`-exclude`** | Non (seulement `-target`) |
| Fichiers propres à l'outil | **`*.tofu`** prioritaires sur `*.tf` | — |
| Modules et fournisseurs dans un **registre OCI** (Harbor, GitLab, Artifactory…) | **Oui** | Non |
| HCP Terraform, Terraform Enterprise, Sentinel, *stacks* | Non (utiliser un backend et une CI) | Oui |
| Fonctions supplémentaires | `cidrcontains`, `templatestring`, `base64gunzip`, `urldecode`, `issensitive`… | Sous-ensemble |

Les versions évoluent en parallèle : une fonction ajoutée d'un côté peut apparaître plus tard de l'autre. Vérifiez le *changelog* de la version que vous ciblez.

## Installation et vérification

```bash
# Debian / Ubuntu / RHEL — script officiel (ajoute le dépôt de paquets signé)
curl -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh
chmod +x install-opentofu.sh
./install-opentofu.sh --install-method deb      # ou rpm, apk, brew, standalone
rm install-opentofu.sh

# Binaire autonome vérifié (cosign / GPG) dans /usr/local/bin
./install-opentofu.sh --install-method standalone

# Conteneur (CI)
docker run --rm -v "$PWD":/srv -w /srv ghcr.io/opentofu/opentofu:1.10 init

tofu version
```

```powershell
winget install OpenTofu.Tofu
# ou : choco install opentofu   /   scoop install opentofu
tofu version
```

Pour figer la version par projet : **tofuenv** (fichier `.opentofu-version`) ou l'image de conteneur avec une étiquette précise. Contraignez aussi la version dans le code :

```hcl versions.tf
terraform {
  required_version = ">= 1.10.0"
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"     # résolu en registry.opentofu.org/bpg/proxmox
      version = "~> 0.66"
    }
  }
}
```

## Chiffrement de l'état et des plans

L'état contient tous les attributs des ressources, secrets compris (voir [[02-etat-modules-import|état distant]]). OpenTofu le chiffre **avant** de l'écrire dans le backend (AES-256-GCM) : le compartiment S3, MinIO ou GitLab ne voit qu'un contenu chiffré.

| Fournisseur de clés | Source de la clé |
| --- | --- |
| `pbkdf2` | Phrase de passe (16 caractères minimum), dérivée par PBKDF2 |
| `aws_kms`, `gcp_kms` | Service de gestion de clés du cloud |
| `openbao` | Moteur *transit* d'OpenBao (fork libre de Vault, API compatible) |
| `external` | Programme externe qui renvoie la clé (HSM, coffre maison) |

```hcl encryption.tf
variable "phrase_etat" {
  type      = string
  sensitive = true
}

terraform {
  encryption {
    key_provider "pbkdf2" "cle_etat" {
      passphrase = var.phrase_etat
    }

    method "aes_gcm" "chiffre" {
      keys = key_provider.pbkdf2.cle_etat
    }

    state {
      method   = method.aes_gcm.chiffre
      enforced = true     # refuse d'écrire un état en clair
    }

    plan {
      method   = method.aes_gcm.chiffre
      enforced = true     # plans enregistrés (-out) chiffrés aussi
    }
  }
}
```

```bash
export TF_VAR_phrase_etat='une phrase longue et unique'
tofu init
tofu apply
```

**Chiffrer un état existant** : déclarez une méthode `unencrypted` en repli, appliquez une fois, puis retirez le repli.

```hcl encryption.tf (migration)
terraform {
  encryption {
    key_provider "pbkdf2" "cle_etat" {
      passphrase = var.phrase_etat
    }
    method "aes_gcm" "chiffre" {
      keys = key_provider.pbkdf2.cle_etat
    }
    method "unencrypted" "en_clair" {}

    state {
      method = method.aes_gcm.chiffre
      fallback {
        method = method.unencrypted.en_clair   # lit l'ancien état en clair
      }
    }
  }
}
```

La même logique de `fallback` sert à **changer de clé** (ancienne clé en repli, nouvelle clé en méthode principale).

> [!WARNING]
> Perdre la phrase de passe ou la clé KMS rend l'état **illisible** : l'infrastructure continue de tourner mais OpenTofu ne sait plus la gérer. Conservez la clé dans un coffre ([[07-vault/01-presentation-installation|Vault / OpenBao]], [[08-vaultwarden/01-presentation-installation|Vaultwarden]]) et testez la restauration. Un état chiffré n'est **plus lisible par Terraform**.

La configuration peut aussi être fournie hors du code par la variable d'environnement `TF_ENCRYPTION` (même syntaxe HCL), pratique en CI pour ne pas exposer le choix du fournisseur de clés dans le dépôt.

## Évaluation anticipée : variables dans le backend et les modules

OpenTofu évalue les **variables** et les **`locals`** dès `tofu init`. On peut donc paramétrer le backend et la source des modules, ce que Terraform refuse.

```hcl backend.tf
variable "environnement" {
  type = string     # preprod ou prod, fourni à l'init
}

locals {
  cle_etat = "reseau/${var.environnement}/terraform.tfstate"
}

terraform {
  backend "s3" {
    bucket         = "tofu-etats"
    key            = local.cle_etat
    region         = "fr-paris-1"
    endpoints      = { s3 = "https://minio.corp.exemple.fr" }
    use_path_style = true
    use_lockfile   = true
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
  }
}

variable "version_modules" {
  type    = string
  default = "v2.3.0"
}

module "vlan" {
  source = "git::https://gitlab.corp.exemple.fr/infra/modules/vlan-netbox.git?ref=${var.version_modules}"
}
```

```bash
tofu init -var="environnement=prod"
tofu plan -var="environnement=prod"
```

Seules les valeurs **connues sans rien interroger** sont acceptées (variables, `locals`, fonctions pures) — pas d'attribut de ressource ni de source de données.

## Fournisseurs multiples avec for_each

Un seul bloc `provider` peut créer une instance par site, région ou pare-feu :

```hcl sites.tf
variable "sites" {
  type = map(string)
  default = {
    paris = "https://fw-paris.corp.exemple.fr"
    lyon  = "https://fw-lyon.corp.exemple.fr"
  }
}

provider "fortios" {
  alias    = "site"
  for_each = var.sites
  hostname = each.value
  token    = var.jeton_fortios
}

resource "fortios_firewall_address" "dns_interne" {
  for_each = var.sites
  provider = fortios.site[each.key]
  name     = "DNS-INTERNE"
  subnet   = "10.0.10.53 255.255.255.255"
}
```

Le `for_each` du fournisseur doit être connu à l'init ; retirer une clé alors que des ressources l'utilisent encore est bloquant (supprimez d'abord les ressources).

## Exclure, cibler, tester

```bash
tofu plan  -exclude=module.labo                 # tout sauf le labo
tofu apply -exclude='proxmox_virtual_environment_vm.test["vm-99"]'
tofu plan  -target-file=cibles.txt              # liste de cibles dans un fichier
tofu plan  -exclude-file=exclusions.txt
tofu test                                       # exécute les fichiers *.tftest.hcl / *.tofutest.hcl
```

```hcl tests/dns.tftest.hcl
run "noms_valides" {
  command = plan
  assert {
    condition     = alltrue([for n in keys(var.serveurs) : can(regex("^srv-", n))])
    error_message = "Les noms de serveurs doivent commencer par srv-."
  }
}
```

`tofu test` crée de vraies ressources avec `command = apply` puis les détruit ; les blocs `mock_provider` et `override_resource` permettent de tester sans infrastructure.

## Fichiers .tofu : un module pour les deux outils

Si `main.tofu` et `main.tf` existent dans le même dossier, **OpenTofu lit `main.tofu` et ignore `main.tf`**, tandis que Terraform ignore les `.tofu`. Un module partagé peut ainsi garder une version compatible Terraform et une version qui utilise les fonctions propres à OpenTofu (chiffrement, `for_each` de fournisseur).

```text
modules/pare-feu/
├── main.tf        ← lu par Terraform
├── main.tofu      ← lu par OpenTofu (remplace main.tf)
├── variables.tf   ← commun
└── outputs.tf     ← commun
```

## Registres OCI pour modules et fournisseurs

Depuis la 1.10, les modules peuvent être stockés dans un registre de conteneurs OCI déjà présent (Harbor, GitLab, Artifactory, Nexus) — utile sur un réseau isolé :

```hcl
module "vm_linux" {
  source = "oci://harbor.corp.exemple.fr/iac/modules/vm-linux?tag=1.4.0"
}
```

Les fournisseurs peuvent aussi être servis par un miroir OCI déclaré dans la configuration de la CLI (`~/.tofurc` sous Linux/macOS, `%APPDATA%\tofu.rc` sous Windows, bloc `provider_installation`). Les miroirs classiques (`filesystem_mirror`, `network_mirror`) restent disponibles :

```hcl ~/.tofurc
provider_installation {
  filesystem_mirror {
    path    = "/opt/tofu/fournisseurs"
    include = ["registry.opentofu.org/*/*"]
  }
  direct {
    exclude = ["registry.opentofu.org/*/*"]
  }
}
```

```bash
tofu providers mirror /opt/tofu/fournisseurs     # remplir le miroir depuis un poste connecté
```

## Migrer de Terraform vers OpenTofu

| Version de Terraform | Démarche |
| --- | --- |
| ≤ 1.5.x | Remplacement direct : même état, aucune modification du code |
| 1.6 à 1.9 | Migrer vers l'OpenTofu de même niveau ou plus récent ; vérifier les fonctions utilisées (ex. blocs `removed`, `import` avec `for_each`) |
| ≥ 1.10 | Suivre le guide de migration de la version visée ; retirer les fonctions exclusives à Terraform (`cloud`, *stacks*) et vérifier que les fonctions récentes utilisées (valeurs éphémères, attributs en écriture seule) existent dans la version d'OpenTofu visée |

```bash
# 1. Sauvegarder l'état et vérifier qu'il n'y a aucun changement en attente
terraform plan                  # doit afficher « No changes »
terraform state pull > etat-avant-tofu.json

# 2. Remplacer l'outil
tofu init -upgrade              # retélécharge les fournisseurs depuis registry.opentofu.org
                                # et réécrit .terraform.lock.hcl

# 3. Contrôler
tofu plan                       # doit aussi afficher « No changes »
tofu apply                      # applique (écrit l'état avec OpenTofu)

# 4. Valider le fichier de verrou dans Git, puis activer le chiffrement si souhaité
git add .terraform.lock.hcl && git commit -m "Migration OpenTofu"
```

Points d'attention :

- **HCP Terraform / bloc `cloud`** : remplacez-le par un backend (`s3`, `http` GitLab, `pg`, `azurerm`) avant la migration, après avoir copié l'état (`terraform state pull`).
- **Fichier de verrou** : les empreintes sont liées au registre ; validez le nouveau `.terraform.lock.hcl` et régénérez les plateformes de la CI (`tofu providers lock -platform=linux_amd64 -platform=windows_amd64`).
- **CI** : remplacez l'image `hashicorp/terraform` par `ghcr.io/opentofu/opentofu` et `terraform` par `tofu` (exemple GitLab dans [[03-fournisseurs-infra-ci|fournisseurs et CI]]).
- **Outils annexes** : tflint, Checkov, Trivy, Terragrunt, Atlantis, Spacelift et env0 prennent en charge OpenTofu (Terragrunt : `terragrunt` choisit `tofu` s'il est installé, ou `TG_TF_PATH=tofu`).
- **Retour à Terraform** : possible tant que l'état **n'est pas chiffré** et que le code n'utilise aucune fonction propre à OpenTofu.

## Erreurs fréquentes

| Symptôme | Cause et correction |
| --- | --- |
| `Failed to query available provider packages` | Fournisseur absent du registre OpenTofu ou réseau filtré : vérifiez l'adresse `source`, ouvrez `registry.opentofu.org` et `github.com` dans le proxy, ou utilisez un miroir |
| `the cached package … does not match any of the checksums` | Ancien fichier de verrou Terraform : `tofu init -upgrade` puis validez le nouveau verrou |
| `encryption: … unable to decrypt state` | Mauvaise phrase de passe ou clé changée sans `fallback` |
| `Unsupported block type "cloud"` | Bloc HCP Terraform : remplacez-le par un backend |
| `Variables not allowed` dans le backend | Version d'OpenTofu < 1.8 ou valeur non connue à l'init |
| Terraform ignore une partie du code | Fichiers `.tofu` présents : normal, ils ne sont lus que par OpenTofu |

Commandes : [[90-aide-memoire|aide-mémoire Terraform / OpenTofu]].
