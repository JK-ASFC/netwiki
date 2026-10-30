---
title: Fournisseurs d'infrastructure, CI et exploitation
description: Terraform / OpenTofu pour l'architecte réseau — fournisseurs vSphere, Proxmox, NetBox, Palo Alto PAN-OS, FortiOS, DNS et clouds, provisionnement de VM avec cloud-init, articulation avec Ansible, pipeline GitLab CI (fmt, validate, plan sur demande de fusion, apply manuel), détection de dérive, sécurité (secrets, comptes de service, analyse statique) et erreurs fréquentes.
tags: [terraform, opentofu, vsphere, proxmox, netbox, pan-os, fortios, gitlab ci, dérive]
icon: cloud
---

## Fournisseurs courants

| Domaine | Fournisseur | Exemples de ressources |
| --- | --- | --- |
| Virtualisation | `vmware/vsphere` | VM, dossiers, réseaux distribués |
| Virtualisation | `bpg/proxmox` (ou `telmate/proxmox`) | VM, conteneurs LXC, fichiers cloud-init |
| IPAM / DCIM | `e-breuninger/netbox` | Préfixes, adresses IP, VLAN, équipements |
| Pare-feu | `PaloAltoNetworks/panos` | Objets, règles de sécurité et NAT, zones |
| Pare-feu | `fortinetdev/fortios` | Adresses, politiques, VPN |
| DNS | `hashicorp/dns` (RFC 2136), `cloudflare/cloudflare`, `pan-net/powerdns` | Enregistrements |
| Cloud | `hashicorp/azurerm`, `hashicorp/aws`, `hashicorp/google` | VNet/VPC, NSG, VPN, ExpressRoute/Direct Connect |
| Secrets | `hashicorp/vault` | Lecture de secrets, configuration de Vault |

## Exemple : VM Proxmox avec adresse réservée dans NetBox

```hcl main.tf
data "netbox_prefix" "serveurs" {
  prefix = "10.0.20.0/24"
}

resource "netbox_available_ip_address" "vm" {
  prefix_id   = data.netbox_prefix.serveurs.id
  dns_name    = "srv-app-01.corp.exemple.fr"
  status      = "active"
  description = "Géré par Terraform"
}

resource "proxmox_virtual_environment_vm" "app" {
  name      = "srv-app-01"
  node_name = "pve-01"

  clone {
    vm_id = 9000                       # modèle Debian 12 cloud-init
  }
  cpu    { cores = 2 }
  memory { dedicated = 4096 }

  network_device {
    bridge  = "vmbr0"
    vlan_id = 20
  }

  initialization {
    ip_config {
      ipv4 {
        address = netbox_available_ip_address.vm.ip_address
        gateway = "10.0.20.1"
      }
    }
    dns {
      servers = ["10.0.10.53"]
      domain  = "corp.exemple.fr"
    }
    user_account {
      username = "ansible"
      keys     = [file("~/.ssh/ansible.pub")]
    }
  }
}
```

## Exemple : règle de pare-feu Palo Alto

```hcl
resource "panos_security_rule_group" "applis" {
  position_keyword = "bottom"

  rule {
    name                  = "WEB-vers-BDD"
    source_zones          = ["DMZ"]
    source_addresses      = ["srv-web-01", "srv-web-02"]
    source_users          = ["any"]
    destination_zones     = ["SERVEURS"]
    destination_addresses = ["srv-db-01"]
    applications          = ["postgres"]
    services              = ["application-default"]
    categories            = ["any"]
    action                = "allow"
    log_end               = true
  }
}
```

Une **validation** (commit) reste nécessaire sur PAN-OS ou Panorama : prévoyez une étape de commit (ressource dédiée ou script) dans le pipeline.

## Terraform et Ansible

| Terraform | Ansible |
| --- | --- |
| Crée et détruit les **ressources** (VM, réseaux, règles, enregistrements) | Configure **l'intérieur** des machines et les équipements |
| État explicite, plan des différences | Idempotent, sans état |

Enchaînement courant : Terraform crée la VM et l'adresse dans NetBox → l'inventaire dynamique NetBox d'[[01-ansible/01-presentation-installation|Ansible]] la voit → Ansible applique les rôles.

## Pipeline GitLab CI

```yaml .gitlab-ci.yml
image:
  name: ghcr.io/opentofu/opentofu:1.10
  entrypoint: [""]

variables:
  TF_ROOT: environnements/prod

stages: [ validate, plan, apply ]

validate:
  stage: validate
  script:
    - cd $TF_ROOT
    - tofu fmt -check -recursive
    - tofu init -input=false
    - tofu validate

plan:
  stage: plan
  script:
    - cd $TF_ROOT
    - tofu init -input=false
    - tofu plan -input=false -out=plan.tfplan
    - tofu show -no-color plan.tfplan > plan.txt
  artifacts:
    paths: [ "$TF_ROOT/plan.tfplan", "$TF_ROOT/plan.txt" ]
    expire_in: 1 week

apply:
  stage: apply
  script:
    - cd $TF_ROOT
    - tofu init -input=false
    - tofu apply -input=false plan.tfplan
  rules:
    - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
      when: manual
  environment: production
```

Le plan est publié sur la demande de fusion pour **revue** ; l'application est manuelle, sur la branche principale, avec le plan **exact** relu. Voir [[02-gitlab/03-ci-cd-runners|GitLab CI/CD]].

## Dérive

Une **dérive** est une modification faite hors Terraform (console, CLI). Détection : `terraform plan -detailed-exitcode` planifié chaque nuit (code 2 = différences) avec alerte. Traitement : réintégrer la modification dans le code, ou la laisser écraser au prochain `apply`.

## Sécurité

- [ ] État dans un backend chiffré, verrouillé, à accès restreint
- [ ] Variables `sensitive = true`, secrets depuis Vault ou les variables protégées de la CI — jamais dans les `.tfvars` versionnés
- [ ] Comptes de service dédiés par fournisseur, droits minimaux
- [ ] Versions des fournisseurs figées, fichier `.terraform.lock.hcl` **versionné**
- [ ] Analyse statique : `tflint`, `trivy config` / `checkov`
- [ ] `prevent_destroy` sur les ressources critiques

## Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `Error acquiring the state lock` | Autre exécution en cours ou verrou orphelin | Attendre ; sinon `force-unlock` après vérification |
| `Provider produced inconsistent result after apply` | Bogue du fournisseur, attribut normalisé par l'API | Mettre à jour le fournisseur, `ignore_changes` |
| `Failed to query available provider packages` | Pas d'accès au registre | Miroir (`provider_installation`), proxy, cache des fournisseurs |
| Plan qui veut tout recréer | Clés `for_each` modifiées, passage `count` → `for_each` | Blocs `moved` |
| `Resource already exists` | Objet créé hors Terraform | Bloc `import` |
| `Inconsistent dependency lock file` | Fournisseur changé sans mise à jour du verrou | `terraform init -upgrade`, versionner le fichier |
