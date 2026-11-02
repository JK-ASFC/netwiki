---
title: kube-bench, Kubescape et Trivy
description: Audit de sécurité Kubernetes et des images — kube-bench (Aqua : contrôles du CIS Kubernetes Benchmark sur les nœuds, exécution en Job, profils par distribution), Kubescape (CNCF : posture selon NSA-CISA, MITRE ATT&CK, CIS, analyse de manifestes et de charts, score de risque, opérateur dans le cluster, VS Code et CI) et Trivy (Aqua : vulnérabilités des images, systèmes de fichiers, dépôts Git, SBOM, mauvaises configurations IaC Kubernetes/Terraform/Dockerfile, secrets, licences ; trivy k8s, Trivy Operator, intégration CI et registres), installation Windows, Linux, macOS et usage.
tags: [kube-bench, kubescape, trivy, kubernetes, cis, vulnérabilités, sbom]
icon: info
---

| Outil | Ce qu'il vérifie | Où l'exécuter |
| --- | --- | --- |
| **kube-bench** | Réglages des composants Kubernetes et des nœuds selon le **CIS Benchmark** | Sur chaque nœud (Job ou binaire) |
| **Kubescape** | Posture du cluster et des manifestes (NSA-CISA, MITRE, CIS), RBAC à risque | Poste, CI, opérateur |
| **Trivy** | **Vulnérabilités** (images, paquets, dépendances), mauvaises configurations IaC, secrets, SBOM | Poste, CI, registre, opérateur |

## kube-bench

```bash
kubectl apply -f https://raw.githubusercontent.com/aquasecurity/kube-bench/main/job.yaml
kubectl logs job/kube-bench | grep -E '^\[FAIL\]|^\[WARN\]' | head -30
# Binaire sur un nœud : kube-bench run --targets master,node,etcd,policies --benchmark cis-1.9
```

Les distributions durcies ([[26-rke2-rancher/01-rke2|RKE2]], OKD) ont leurs propres profils (`--benchmark rke2-cis-1.7`…) ; les clusters gérés (AKS, EKS, GKE) ont un benchmark dédié.

## Kubescape

```bash
curl -s https://raw.githubusercontent.com/kubescape/kubescape/master/install.sh | /bin/bash   # Windows : winget install kubescape ; macOS : brew install kubescape
kubescape scan                                   # cluster courant, tous les référentiels
kubescape scan framework nsa,mitre --exclude-namespaces kube-system
kubescape scan deploiements/ --format junit --output resultats.xml      # manifestes ou charts en CI
```

## Trivy

| Système | Installation |
| --- | --- |
| Debian/Ubuntu | Dépôt `aquasecurity.github.io/trivy-repo` puis `sudo apt install trivy` |
| RHEL | Dépôt RPM du projet |
| Windows | Binaire ZIP des versions GitHub (ou Docker) |
| macOS | `brew install trivy` |

```bash
trivy image --severity HIGH,CRITICAL --ignore-unfixed registry.corp.exemple.fr/infra/inventaire:1.8.2
trivy image --exit-code 1 --severity CRITICAL app:candidat              # bloque le pipeline CI
trivy fs --scanners vuln,secret,misconfig .                             # dépôt de code
trivy config terraform/                                                 # IaC (Terraform, Kubernetes, Dockerfile, Helm)
trivy image --format cyclonedx --output sbom.json app:1.0               # SBOM
trivy k8s --report summary cluster                                      # cluster entier
```

En continu : **Trivy Operator** (rapports `VulnerabilityReport`, `ConfigAuditReport` dans le cluster) et analyse intégrée aux registres ([[01-docker/02-images-dockerfile-registres|Harbor]] utilise Trivy).

Suite : [[02-falco|Falco]] · [[90-aide-memoire|aide-mémoire]].
