---
title: Checkov, KICS, Terrascan et TFLint
description: Analyse statique de l'infrastructure as code — pourquoi (détecter erreurs de configuration et failles avant déploiement), Checkov (Terraform, CloudFormation, Kubernetes, Dockerfile, Helm ; politiques, SARIF, pré-commit), KICS (très large couverture de plateformes, requêtes), Terrascan (politiques OPA/Rego, conformité) et TFLint (erreurs et bonnes pratiques Terraform, règles fournisseurs) ; intégration CI et complémentarité avec trivy/tfsec.
tags: [iac, checkov, kics, terrascan, tflint, terraform, kubernetes, sécurité, opa]
icon: shield-check
---

L'**infrastructure as code** (Terraform, CloudFormation, manifestes Kubernetes, Dockerfile, Helm) peut contenir des **erreurs de configuration** dangereuses : bucket public, port ouvert à tous, chiffrement désactivé, privilèges excessifs. Ces analyseurs **statiques** les détectent avant le déploiement, en CI.

## Checkov

**Checkov** (Bridgecrew/Prisma) est le plus répandu : des centaines de politiques pour **Terraform, CloudFormation, Kubernetes, Dockerfile, Helm, ARM, Serverless**. Sortie SARIF, politiques personnalisées (Python ou YAML).

```bash
python3 -m pip install checkov
checkov -d .                                   # analyse le répertoire
checkov -d . --framework terraform kubernetes
checkov -f main.tf --compact
checkov -d . -o sarif --output-file-path .      # rapport SARIF pour la forge
checkov -d . --skip-check CKV_AWS_18,CKV_AWS_21 # ignorer des règles
```

```yaml .pre-commit-config.yaml
  - repo: https://github.com/bridgecrewio/checkov
    rev: 3.x.x
    hooks: [ { id: checkov, args: ["-d", "."] } ]
```

## KICS

**KICS** (Checkmarx, *Keeping Infrastructure as Code Secure*) couvre une **très large gamme** de plateformes (Terraform, Kubernetes, Docker, Ansible, CloudFormation, Helm, OpenAPI…) avec des requêtes ouvertes et faciles à étendre.

```bash
docker run -t -v "$PWD":/path checkmarx/kics:latest scan -p /path -o /path
# --report-formats sarif,json ; --queries-path pour des requêtes personnalisées
```

## Terrascan

**Terrascan** s'appuie sur **OPA/Rego** : politiques exprimées comme du code, utile pour la **conformité** (CIS, normes internes) sur Terraform, Kubernetes, Helm, Dockerfile.

```bash
# binaire des versions GitHub ; image tenable/terrascan
terrascan scan -i terraform -d .
terrascan scan -i k8s -d ./manifests -o sarif > terrascan.sarif
terrascan scan -p ./policies-internes                # politiques Rego maison
```

## TFLint

**TFLint** est spécifique à **Terraform** : au-delà de la sécurité, il repère les **erreurs** (types, attributs invalides, valeurs non conformes au fournisseur) et les **mauvaises pratiques** que `terraform validate` ne voit pas, grâce aux greffons de fournisseurs (AWS, Azure, GCP).

```bash
# binaire des versions GitHub ; brew install tflint
tflint --init                                  # installe les greffons déclarés
tflint --recursive
tflint -f compact
```

```hcl .tflint.hcl
plugin "aws" { enabled = true, version = "0.x.x", source = "github.com/terraform-linters/tflint-ruleset-aws" }
```

## En intégration continue

```yaml .gitlab-ci.yml (extrait)
iac-scan:
  image: python:3.12
  script:
    - pip install checkov
    - checkov -d . -o sarif --output-file-path . --soft-fail      # --soft-fail : ne bloque pas au début
  artifacts: { reports: { sast: results_sarif.sarif } }
```

Commencer en **avertissement** (`--soft-fail`) pour mesurer la dette, corriger ou justifier les règles, puis rendre l'étape **bloquante**. Gérer les exceptions par des annotations (`#checkov:skip`) documentées, pas en désactivant globalement.

## Complémentarité

- **TFLint** valide la justesse Terraform ; **Checkov/KICS/Terrascan** valident la sécurité et la conformité : on les combine.
- Pour les **images de conteneurs** et les dépendances, voir Trivy et Grype (chapitre sécurité) ; **tfsec** a fusionné avec Trivy.
- Associer ces analyses à la [[01-gitleaks-detect-secrets-trufflehog|détection de secrets]] et aux [[03-linters-shellcheck|linters]] dans la même chaîne CI.

## Choisir

| Besoin | Outil |
| --- | --- |
| Couverture large, standard, SARIF | Checkov |
| Très nombreuses plateformes, requêtes ouvertes | KICS |
| Conformité par politiques OPA/Rego | Terrascan |
| Justesse et bonnes pratiques Terraform | TFLint |

Commandes : [[90-aide-memoire|aide-mémoire]].
