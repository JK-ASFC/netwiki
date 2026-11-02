---
title: OPA, Gatekeeper et Kyverno — aide-mémoire
description: Commandes opa (eval, test, fmt, check, run --server, build), conftest (test, verify), Gatekeeper (get constrainttemplates, constraints, audit, journaux), Kyverno (kubectl get clusterpolicy, policyreport, policyexception ; CLI kyverno apply, test, jp) avec exemples.
tags: [aide-mémoire, opa, rego, conftest, gatekeeper, kyverno]
icon: terminal
---

Explications : [[01-opa-gatekeeper|OPA et Gatekeeper]] · [[02-kyverno|Kyverno]].

```bash
opa version ; opa eval -d . -i entree.json "data.paquet.deny" ; opa test . -v ; opa fmt -l . ; opa check . ; opa run --server --addr :8181 .
conftest test deploiement.yaml -p politiques/ ; conftest verify -p politiques/
kubectl get constrainttemplates ; kubectl get constraints ; kubectl describe k8sregistresautorises registre-entreprise
kubectl -n gatekeeper-system logs deploy/gatekeeper-audit --tail=30
kubectl get clusterpolicy,policy -A ; kubectl get policyreport -A ; kubectl get policyexception -A ; kubectl describe clusterpolicy bonnes-pratiques
kyverno apply politique.yaml --resource ressource.yaml ; kyverno test tests/ ; kyverno version
```
