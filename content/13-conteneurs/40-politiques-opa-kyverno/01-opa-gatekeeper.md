---
title: Open Policy Agent et Gatekeeper
description: Open Policy Agent (OPA, CNCF) — moteur de politiques générique et langage Rego (règles, données, décisions), usages (Kubernetes, API, Terraform avec Conftest, autorisation de microservices, Envoy), CLI opa (eval, test, fmt, run en serveur) ; Gatekeeper — contrôleur d'admission Kubernetes à base d'OPA (ConstraintTemplate, Constraint, audit des ressources existantes, mode dryrun/warn/deny, bibliothèque de politiques, mutations, exclusions), installation et exemples.
tags: [opa, open policy agent, rego, gatekeeper, kubernetes, policy as code, conftest]
icon: info
---

**OPA** évalue des **politiques écrites en Rego** sur des données JSON et rend une décision (autoriser, refuser, liste de violations). Il sert partout : Kubernetes, API, pipelines (**Conftest** sur des fichiers Terraform, Dockerfile, YAML), autorisation dans les applications. **Gatekeeper** l'intègre à Kubernetes comme **contrôleur d'admission** : une ressource non conforme est refusée à la création.

## OPA en ligne de commande

```bash
# opa : binaire unique (Linux, macOS, Windows) — brew install opa, winget install OpenPolicyAgent.OPA
cat > politique.rego <<'EOF2'
package terraform.regles
import rego.v1

deny contains msg if {
  some r in input.resource_changes
  r.type == "aws_s3_bucket"
  r.change.after.acl == "public-read"
  msg := sprintf("Bucket public interdit : %s", [r.address])
}
EOF2
terraform show -json plan.tfplan > plan.json
opa eval -d politique.rego -i plan.json "data.terraform.regles.deny" --format pretty
conftest test plan.json -p politique.rego        # même chose, orienté CI
opa test . -v ; opa fmt -w .
```

## Gatekeeper

```bash
helm repo add gatekeeper https://open-policy-agent.github.io/gatekeeper/charts && helm install gatekeeper gatekeeper/gatekeeper -n gatekeeper-system --create-namespace
```

```yaml
apiVersion: templates.gatekeeper.sh/v1
kind: ConstraintTemplate
metadata: { name: k8sregistresautorises }
spec:
  crd: { spec: { names: { kind: K8sRegistresAutorises }, validation: { openAPIV3Schema: { type: object, properties: { registres: { type: array, items: { type: string } } } } } } }
  targets:
    - target: admission.k8s.gatekeeper.sh
      rego: |
        package k8sregistresautorises
        violation[{"msg": msg}] {
          c := input.review.object.spec.containers[_]
          not startswith(c.image, input.parameters.registres[_])
          msg := sprintf("Image hors registre autorisé : %v", [c.image])
        }
---
apiVersion: constraints.gatekeeper.sh/v1beta1
kind: K8sRegistresAutorises
metadata: { name: registre-entreprise }
spec:
  enforcementAction: dryrun          # observer d'abord, puis « deny »
  match: { kinds: [{ apiGroups: [""], kinds: [Pod] }], excludedNamespaces: [kube-system] }
  parameters: { registres: ["registry.corp.exemple.fr/"] }
```

`kubectl get k8sregistresautorises registre-entreprise -o yaml` montre les violations détectées par l'**audit** sur les ressources déjà présentes. Bibliothèque prête à l'emploi : *Gatekeeper Library*.

Suite : [[02-kyverno|Kyverno]] · [[90-aide-memoire|aide-mémoire]].
