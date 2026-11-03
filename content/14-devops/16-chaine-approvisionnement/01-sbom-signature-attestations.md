---
title: SBOM, vulnérabilités, signature et attestations
description: Sécuriser la chaîne d'approvisionnement logicielle — Syft (SBOM SPDX et CycloneDX d'images, dossiers et archives), Grype (vulnérabilités à partir d'images ou de SBOM, --fail-on, base de données), Cosign (Sigstore : signature d'images et d'artefacts par clé ou sans clé avec OIDC, Fulcio et Rekor, vérification, attestations), in-toto (preuves de chaque étape de construction, layout, in-toto-run et in-toto-verify), Tekton Chains (signature automatique des TaskRun et images, provenance SLSA), politiques d'admission Kubernetes et niveaux SLSA.
tags: [sbom, syft, grype, cosign, sigstore, in-toto, tekton chains, slsa, supply chain]
icon: shield-check
---

Les attaques contre la **chaîne d'approvisionnement** (dépendance compromise, image modifiée, serveur de build piraté) se combattent par trois mesures : **savoir ce que contient** un artefact (SBOM), **vérifier ses vulnérabilités**, et **prouver son origine** (signatures, attestations de provenance). Le cadre **SLSA** décrit les niveaux de maturité ; la politique d'admission Kubernetes ([[02-kyverno|Kyverno]]) bloque ensuite les images non signées.

| Outil | Rôle | Licence |
| --- | --- | --- |
| **Syft** (Anchore) | Génère le **SBOM** (SPDX, CycloneDX) | Apache 2.0 |
| **Grype** (Anchore) | Recherche les **vulnérabilités** connues | Apache 2.0 |
| **Cosign** (Sigstore) | **Signe** et vérifie images, artefacts et attestations | Apache 2.0 |
| **in-toto** | **Preuves** signées de chaque étape et vérification de la chaîne complète | Apache 2.0 |
| **Tekton Chains** | Signature et provenance **automatiques** des pipelines Tekton | Apache 2.0 |

Installation (Linux, macOS, Windows) : `brew install syft grype cosign`, binaires des versions publiées, ou scripts d'installation des projets ; in-toto : `pip install in-toto`.

## Syft et Grype

```bash
syft registre.corp.exemple.fr/infra/api:2.4.0 -o spdx-json=sbom-api.spdx.json
syft dir:. -o cyclonedx-json=sbom-projet.cdx.json
grype registre.corp.exemple.fr/infra/api:2.4.0
grype sbom:./sbom-api.spdx.json --fail-on high          # code retour non nul si vulnérabilité haute ou critique
grype db update ; grype db status
grype registre.corp.exemple.fr/infra/api:2.4.0 -o sarif > grype.sarif
```

Générer le SBOM au moment du build et le conserver avec l'artefact permet de rechercher plus tard une nouvelle faille (`grype sbom:…`) sans reconstruire. Voir aussi Trivy dans [[01-harbor-distribution-zot|Harbor]].

## Cosign

Signature par **clé** :

```bash
cosign generate-key-pair                                 # cosign.key (protégée par mot de passe) et cosign.pub
cosign sign --key cosign.key registre.corp.exemple.fr/infra/api@sha256:3f1c…
cosign verify --key cosign.pub registre.corp.exemple.fr/infra/api@sha256:3f1c…
cosign attest --key cosign.key --type spdxjson --predicate sbom-api.spdx.json registre.corp.exemple.fr/infra/api@sha256:3f1c…
cosign verify-attestation --key cosign.pub --type spdxjson registre.corp.exemple.fr/infra/api@sha256:3f1c…
```

Signature **sans clé** (*keyless*) : `cosign sign registre.corp.exemple.fr/infra/api@sha256:3f1c…` obtient un certificat éphémère de **Fulcio** grâce à l'identité OIDC (compte de l'utilisateur ou jeton de la CI) et inscrit la signature dans le journal de transparence **Rekor** ; la vérification contrôle l'identité attendue :

```bash
cosign verify registre.corp.exemple.fr/infra/api@sha256:3f1c… \
  --certificate-identity=https://gitlab.corp.exemple.fr/infra/api//.gitlab-ci.yml@refs/heads/main \
  --certificate-oidc-issuer=https://gitlab.corp.exemple.fr
```

Toujours signer et vérifier par **empreinte** (`@sha256:…`), jamais par étiquette modifiable. Les clés privées se rangent dans un coffre ([[07-vault/01-presentation-installation|Vault]], KMS) : `cosign sign --key hashivault://cosign …`.

## in-toto

in-toto décrit la chaîne attendue dans un **layout** signé par le responsable du projet (étapes, personnes ou machines autorisées, fichiers produits), puis chaque étape enregistre un **lien** signé :

```bash
in-toto-run --step-name clone --signing-key cle-dev --products src -- git clone https://git.corp.exemple.fr/infra/api.git src
in-toto-run --step-name build --signing-key cle-ci --materials src --products dist -- make -C src dist
in-toto-verify --layout root.layout --verification-keys responsable.pub
```

La vérification refuse l'artefact si une étape manque, a été faite par une clé non autorisée ou si un fichier a changé entre deux étapes.

## Tekton Chains

Extension de [[11-tekton-argo-workflows/01-tekton|Tekton]] qui observe les `TaskRun`/`PipelineRun` terminés, signe leurs résultats et les images produites, et génère une **provenance SLSA** :

```bash
kubectl apply --filename https://infra.tekton.dev/tekton-releases/chains/latest/release.yaml
cosign generate-key-pair k8s://tekton-chains/signing-secrets        # clé stockée dans le secret attendu par Chains
kubectl patch configmap chains-config -n tekton-chains -p '{"data":{"artifacts.taskrun.format":"slsa/v1","artifacts.oci.storage":"oci","transparency.enabled":"true"}}'
```

Les signatures et attestations sont poussées à côté des images dans le registre (stockage `oci`) et, si activé, dans Rekor.

Commandes : [[90-aide-memoire|aide-mémoire]].
