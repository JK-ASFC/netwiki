---
title: Terragrunt et Terramate — aide-mémoire des commandes
description: Commandes Terragrunt (init, plan, apply, destroy, output, run --all, --queue-include-dir, --non-interactive, hclfmt, render, graph, find, cache) et Terramate (create, list, list --changed, run, run --changed, generate, fmt, experimental, cloud) avec exemples.
tags: [aide-mémoire, terragrunt, terramate]
icon: terminal
---

Explications : [[01-presentation-utilisation|Terragrunt et Terramate]].

```bash
terragrunt --version ; terragrunt init ; terragrunt plan ; terragrunt apply ; terragrunt output -json ; terragrunt destroy
terragrunt run --all plan ; terragrunt run --all apply --non-interactive ; terragrunt run --all plan --queue-include-dir prod/cluster
terragrunt hclfmt ; terragrunt render --json ; terragrunt dag graph | dot -Tsvg > graphe.svg
terramate version ; terramate list ; terramate list --changed ; terramate run -- terraform init ; terramate run --changed -- terraform apply -auto-approve
terramate generate ; terramate fmt ; terramate create infra/recette/app
```
