---
title: Terraform / OpenTofu — aide-mémoire des commandes
description: Commandes Terraform et OpenTofu avec exemples — cycle (init, fmt, validate, plan, apply, destroy), plans enregistrés, variables (-var, -var-file, TF_VAR_), état (state list, show, mv, rm, pull, import et blocs import), espaces de travail, sorties, ciblage et remplacement (-target, -replace), verrouillage des fournisseurs, console, graph, journalisation (TF_LOG), mise à niveau, commandes propres à OpenTofu (-exclude, évaluation anticipée, chiffrement, miroirs).
tags: [aide-mémoire, terraform, opentofu, iac, plan, état, import]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Terraform]]. Avec **OpenTofu**, remplacez `terraform` par `tofu` ; ses commandes propres sont regroupées en fin de page et expliquées dans [[04-opentofu|OpenTofu]].

## Cycle de travail

```bash
terraform init
terraform init -upgrade                          # mettre à jour les fournisseurs dans les contraintes
terraform init -backend-config=backend-prod.hcl
terraform fmt -recursive
terraform validate
terraform plan -out=plan.tfplan
terraform show plan.tfplan
terraform show -json plan.tfplan | jq '.resource_changes[] | {address, actions: .change.actions}'
terraform apply plan.tfplan
terraform apply -auto-approve                    # CI uniquement
terraform destroy -target=proxmox_vm_qemu.labo
```

## Variables

```bash
terraform plan -var="nb_vm=3" -var-file=prod.tfvars
export TF_VAR_mot_de_passe_admin='...'           # variables sensibles par l'environnement
```

## État

```bash
terraform state list
terraform state show 'proxmox_vm_qemu.web[0]'
terraform state mv 'proxmox_vm_qemu.web' 'module.web.proxmox_vm_qemu.web'
terraform state rm 'proxmox_vm_qemu.ancienne'        # oublier sans détruire
terraform state pull > etat-sauvegarde.json
terraform import 'proxmox_vm_qemu.existante' pve1/qemu/120
terraform plan -generate-config-out=genere.tf        # avec des blocs import
terraform force-unlock <id-verrou>
terraform refresh                                    # (préférer : terraform apply -refresh-only)
terraform apply -refresh-only
```

```hcl
import {
  to = proxmox_vm_qemu.existante
  id = "pve1/qemu/120"
}
```

## Espaces de travail, sorties, ciblage

```bash
terraform workspace list
terraform workspace new preprod
terraform workspace select prod
terraform output
terraform output -raw ip_frontal
terraform plan -replace='proxmox_vm_qemu.web[1]'     # recréer une ressource
terraform apply -target=module.reseau                # exceptionnel
```

## Outils

```bash
terraform providers
terraform providers lock -platform=linux_amd64 -platform=windows_amd64 -platform=darwin_arm64
terraform console                                    # évaluer des expressions
terraform graph | dot -Tsvg > graphe.svg
TF_LOG=DEBUG TF_LOG_PATH=terraform.log terraform plan
terraform version
```

## Propre à OpenTofu

```bash
tofu version
tofu init -var="environnement=prod"                  # variables utilisées dans le backend / les sources de modules
tofu plan -exclude=module.labo                       # tout sauf ce module
tofu plan -target-file=cibles.txt -exclude-file=exclusions.txt
tofu test                                            # *.tftest.hcl et *.tofutest.hcl
tofu init -upgrade                                   # après migration depuis Terraform : nouveau .terraform.lock.hcl
tofu providers mirror /opt/tofu/fournisseurs         # miroir local pour réseau isolé
export TF_VAR_phrase_etat='...'                      # phrase de passe du chiffrement d'état (pbkdf2)
export TF_ENCRYPTION="$(cat encryption.hcl)"         # configuration du chiffrement hors du dépôt
docker run --rm -v "$PWD":/srv -w /srv ghcr.io/opentofu/opentofu:1.10 plan
```
