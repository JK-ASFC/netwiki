---
title: Présentation, installation et utilisation
description: Pulumi (Apache 2.0 pour le moteur et la CLI) — Infrastructure as Code dans de vrais langages (TypeScript, Python, Go, C#, Java, YAML) : installation (Windows, Linux, macOS), projets et piles (stacks) par environnement, état (Pulumi Cloud gratuit ou backend auto-hébergé S3, Azure Blob, fichier local), configuration et secrets chiffrés (passphrase, KMS, Vault), fournisseurs (AWS, Azure, GCP, Kubernetes, vSphere, Proxmox, NetBox, et ponts depuis Terraform), pulumi up/preview/destroy/refresh, importer l'existant, composants réutilisables, tests, Automation API, CI et comparaison avec Terraform/OpenTofu.
tags: [pulumi, iac, typescript, python, go, infrastructure as code]
icon: info
---

**Pulumi** décrit l'infrastructure avec un **langage de programmation** : boucles, fonctions, classes, tests unitaires et bibliothèques ordinaires, là où [[04-terraform/01-presentation-installation|Terraform]] utilise HCL. Le principe reste le même : un **état** des ressources, un **aperçu** des changements, puis application.

## Installation

| Système | Commande |
| --- | --- |
| Linux, macOS | `curl -fsSL https://get.pulumi.com \| sh` ; macOS : `brew install pulumi/tap/pulumi` |
| Windows | `winget install pulumi` |

## Projet et état auto-hébergé

```bash
pulumi login s3://etat-pulumi?endpoint=minio.corp.exemple.fr&s3ForcePathStyle=true   # ou « pulumi login --local », ou Pulumi Cloud
export PULUMI_CONFIG_PASSPHRASE=…                                                     # chiffrement des secrets avec une phrase (ou --secrets-provider)
pulumi new python --name reseau-k8s --stack prod
pulumi config set kubernetes:context prod ; pulumi config set --secret mdp_base 'MdpBase2026'
```

```python
# __main__.py — namespaces et quotas pour chaque équipe dans Kubernetes
import pulumi
import pulumi_kubernetes as k8s

equipes = {"reseau": "8", "systeme": "16", "securite": "4"}
for nom, cpu in equipes.items():
    ns = k8s.core.v1.Namespace(nom, metadata={"name": f"equipe-{nom}"})
    k8s.core.v1.ResourceQuota(f"quota-{nom}", metadata={"namespace": ns.metadata["name"]},
                              spec={"hard": {"requests.cpu": cpu, "requests.memory": f"{int(cpu)*4}Gi"}})
pulumi.export("namespaces", [f"equipe-{n}" for n in equipes])
```

```bash
pulumi preview ; pulumi up ; pulumi stack output ; pulumi refresh ; pulumi destroy
pulumi import vsphere:index/virtualMachine:VirtualMachine srv-web-01 /Datacenter/vm/srv-web-01    # reprendre une ressource existante
```

Fournisseurs : AWS, Azure, GCP, Kubernetes, vSphere, Proxmox (communautaire), et tout fournisseur Terraform via `pulumi package add terraform-provider …`. **Automation API** : piloter Pulumi depuis un programme (portail interne de self-service).

Commandes : [[90-aide-memoire|aide-mémoire]].
