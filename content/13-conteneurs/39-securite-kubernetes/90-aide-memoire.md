---
title: kube-bench, Kubescape, Trivy et Falco — aide-mémoire
description: Commandes kube-bench (run --targets, --benchmark, --check, --json), Kubescape (scan, scan framework, scan control, list frameworks, --format, --compliance-threshold), Trivy (image, fs, repo, config, k8s, sbom, --severity, --ignore-unfixed, --exit-code, .trivyignore, clean) et Falco (falco --list, -r, validation des règles, journaux, falcoctl artifact) avec exemples.
tags: [aide-mémoire, kube-bench, kubescape, trivy, falco]
icon: terminal
---

Explications : [[01-audit-analyse|kube-bench, Kubescape et Trivy]] · [[02-falco|Falco]].

```bash
kube-bench run --targets node ; kube-bench run --benchmark cis-1.9 --check 4.2.1,4.2.6 ; kube-bench run --json > kb.json
kubescape list frameworks ; kubescape scan framework cis-v1.10.0 ; kubescape scan control C-0057 ; kubescape scan --compliance-threshold 80 deploiements/
trivy image --severity HIGH,CRITICAL IMG ; trivy image --ignore-unfixed --exit-code 1 IMG ; trivy fs . ; trivy repo https://git.corp.exemple.fr/infra/app
trivy config . ; trivy k8s --report summary cluster ; trivy sbom sbom.json ; echo "CVE-2024-12345" >> .trivyignore ; trivy clean --all
falco --version ; falco --list | head ; falco -V /etc/falco/falco_rules.local.yaml ; kubectl -n falco logs ds/falco -c falco -f
falcoctl artifact list ; falcoctl artifact install falco-rules
```
