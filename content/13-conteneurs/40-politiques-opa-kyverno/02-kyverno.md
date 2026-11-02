---
title: Kyverno
description: Kyverno (CNCF) — moteur de politiques natif Kubernetes écrit en YAML (sans langage dédié) : installation Helm, ClusterPolicy et Policy, règles validate (Audit ou Enforce), mutate (ajouter étiquettes, valeurs par défaut), generate (créer NetworkPolicy, quotas, secrets à la création d'un namespace), verifyImages (signatures Cosign, attestations), rapports de politiques, exceptions (PolicyException), bibliothèque de politiques et Pod Security Standards, CLI kyverno (apply, test) en CI, et comparaison avec Gatekeeper.
tags: [kyverno, kubernetes, politiques, admission, cosign, pod security]
icon: info
---

**Kyverno** exprime les politiques en **YAML Kubernetes** : plus accessible que Rego pour les équipes d'exploitation. Il **valide**, **modifie** (*mutate*), **génère** des ressources et **vérifie les signatures** d'images.

```bash
helm repo add kyverno https://kyverno.github.io/kyverno/ && helm install kyverno kyverno/kyverno -n kyverno --create-namespace
helm install kyverno-policies kyverno/kyverno-policies -n kyverno --set podSecurityStandard=restricted --set validationFailureAction=Audit
```

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata: { name: bonnes-pratiques }
spec:
  validationFailureAction: Audit          # Enforce une fois le bruit traité
  background: true
  rules:
    - name: limites-obligatoires
      match: { any: [{ resources: { kinds: [Pod] } }] }
      validate:
        message: "CPU et mémoire doivent avoir des limites."
        pattern: { spec: { containers: [{ resources: { limits: { memory: "?*", cpu: "?*" } } }] } }
    - name: etiquette-equipe
      match: { any: [{ resources: { kinds: [Deployment] } }] }
      mutate:
        patchStrategicMerge: { metadata: { labels: { +(equipe): "non-renseignee" } } }
    - name: refus-par-defaut-reseau
      match: { any: [{ resources: { kinds: [Namespace] } }] }
      generate:
        apiVersion: networking.k8s.io/v1
        kind: NetworkPolicy
        name: refus-par-defaut
        namespace: "{{request.object.metadata.name}}"
        synchronize: true
        data: { spec: { podSelector: {}, policyTypes: [Ingress] } }
    - name: images-signees
      match: { any: [{ resources: { kinds: [Pod] } }] }
      verifyImages:
        - imageReferences: ["registry.corp.exemple.fr/*"]
          attestors: [{ entries: [{ keys: { publicKeys: "-----BEGIN PUBLIC KEY-----\n…\n-----END PUBLIC KEY-----" } }] }]
```

```bash
kubectl get clusterpolicy ; kubectl get policyreport -A ; kubectl get clusterpolicyreport
kyverno apply bonnes-pratiques.yaml --resource deploiement.yaml        # tester en CI (CLI : brew install kyverno, binaire Windows/Linux)
```

| | Kyverno | [[01-opa-gatekeeper\|Gatekeeper]] |
| --- | --- | --- |
| Langage | YAML | Rego |
| Mutation, génération | Oui, riches | Mutation limitée, pas de génération |
| Hors Kubernetes | Non (sauf CLI et JSON) | OPA partout (API, Terraform, applications) |

Commandes : [[90-aide-memoire|aide-mémoire]].
