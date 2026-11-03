---
title: Chaîne d'approvisionnement — aide-mémoire
description: Commandes Syft (SBOM SPDX, CycloneDX), Grype (scan d'images et de SBOM, fail-on, base), Cosign (génération de clés, signature, vérification, keyless, attestations, triangulate), in-toto (run, verify) et Tekton Chains (installation, configuration) avec exemples.
tags: [aide-mémoire, syft, grype, cosign, in-toto, tekton chains]
icon: terminal
---

Explications : [[01-sbom-signature-attestations|SBOM, vulnérabilités, signature et attestations]].

```bash
syft registre.corp.exemple.fr/infra/api:2.4.0 -o spdx-json=sbom.spdx.json ; syft dir:. -o cyclonedx-json
grype registre.corp.exemple.fr/infra/api:2.4.0 --fail-on high ; grype sbom:./sbom.spdx.json ; grype db update
cosign generate-key-pair
cosign sign --key cosign.key registre.corp.exemple.fr/infra/api@sha256:3f1c…
cosign verify --key cosign.pub registre.corp.exemple.fr/infra/api@sha256:3f1c…
cosign attest --key cosign.key --type spdxjson --predicate sbom.spdx.json registre.corp.exemple.fr/infra/api@sha256:3f1c…
cosign tree registre.corp.exemple.fr/infra/api@sha256:3f1c…        # signatures, attestations et SBOM attachés
in-toto-run --step-name build --signing-key cle-ci --materials src --products dist -- make -C src dist
in-toto-verify --layout root.layout --verification-keys responsable.pub
kubectl get configmap chains-config -n tekton-chains -o yaml
```
