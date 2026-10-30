---
title: "Sécurité : RBAC, admission, secrets"
description: Sécuriser un cluster Kubernetes — authentification (certificats, OIDC avec Keycloak/Entra ID, comptes de service), autorisation RBAC (Role, ClusterRole, bindings), Pod Security Admission, contrôleurs de politiques (Kyverno, Gatekeeper), sécurité des images, audit de l'API, chiffrement d'etcd et référentiels (CIS, kube-bench).
tags: [kubernetes, rbac, oidc, pod security, kyverno, audit, kube-bench, sécurité]
icon: shield-check
---

## Authentification

| Méthode | Usage |
| --- | --- |
| Certificats clients | Administrateurs d'urgence (`admin.conf`) ; pas de révocation simple : à limiter |
| **OIDC** (Keycloak, Entra ID, Dex) | Utilisateurs nominatifs, groupes de l'annuaire, MFA via le fournisseur |
| **Comptes de service** | Applications et automates dans le cluster (jetons projetés, courte durée) |
| Jetons statiques | À proscrire |

```yaml kubeadm (extrait ClusterConfiguration) — OIDC
apiServer:
  extraArgs:
    - name: oidc-issuer-url
      value: https://sso.corp.exemple.fr/realms/infra
    - name: oidc-client-id
      value: kubernetes
    - name: oidc-username-claim
      value: preferred_username
    - name: oidc-groups-claim
      value: groups
```

Côté poste : greffon `kubectl oidc-login` (kubelogin) qui ouvre le navigateur pour s'authentifier.

## RBAC

```yaml rbac-equipe-reseau.yaml
# Droits de déploiement dans le namespace « reseau »
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: deployeur, namespace: reseau }
rules:
  - apiGroups: ["", "apps", "batch", "networking.k8s.io"]
    resources: ["deployments", "statefulsets", "services", "configmaps", "pods", "pods/log", "jobs", "cronjobs", "ingresses"]
    verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
  - apiGroups: [""]
    resources: ["pods/exec"]
    verbs: ["create"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata: { name: equipe-reseau-deployeur, namespace: reseau }
subjects:
  - kind: Group
    name: GG_K8S_Reseau          # groupe transmis par OIDC
    apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: deployeur
  apiGroup: rbac.authorization.k8s.io
---
# Lecture seule sur tout le cluster pour le support
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata: { name: support-lecture }
subjects:
  - { kind: Group, name: GG_K8S_Support, apiGroup: rbac.authorization.k8s.io }
roleRef: { kind: ClusterRole, name: view, apiGroup: rbac.authorization.k8s.io }
```

```bash
kubectl auth can-i create deployments -n reseau --as alice --as-group GG_K8S_Reseau
kubectl auth can-i --list -n reseau --as system:serviceaccount:reseau:inventaire
```

| ClusterRole intégré | Droits |
| --- | --- |
| `cluster-admin` | Tout : réservé à quelques administrateurs |
| `admin` | Tout dans un namespace (y compris RBAC du namespace) |
| `edit` | Lecture/écriture des ressources (pas de RBAC) |
| `view` | Lecture (sans les Secrets) |

> [!WARNING]
> Certains droits valent une élévation de privilèges : lire les **Secrets**, `pods/exec`, créer des pods dans un namespace privilégié, `escalate`/`bind`/`impersonate`, modifier les webhooks d'admission. Auditez-les.

## Comptes de service

```yaml
apiVersion: v1
kind: ServiceAccount
metadata: { name: inventaire, namespace: reseau }
automountServiceAccountToken: false     # pas de jeton monté si l'application n'appelle pas l'API
```

## Pod Security Admission

```bash
kubectl label namespace reseau \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/warn=restricted
```

| Niveau | Interdit notamment |
| --- | --- |
| `privileged` | Rien (namespaces système) |
| `baseline` | Conteneurs privilégiés, `hostNetwork`, `hostPath`, capacités dangereuses |
| **`restricted`** | En plus : exécution en root, élévation de privilèges ; exige `seccompProfile` et `drop: ALL` |

## Politiques avancées

**Kyverno** ou **OPA Gatekeeper** imposent des règles : registres autorisés, étiquettes obligatoires, limites de ressources, interdiction de `latest`, images signées (Cosign).

```yaml kyverno-registre.yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata: { name: registre-autorise }
spec:
  validationFailureAction: Enforce
  rules:
    - name: images-internes
      match: { any: [ { resources: { kinds: [ Pod ] } } ] }
      validate:
        message: "Images autorisées uniquement depuis registre.corp.exemple.fr"
        pattern:
          spec:
            containers:
              - image: "registre.corp.exemple.fr/*"
```

## Audit et durcissement

| Mesure | Mise en œuvre |
| --- | --- |
| **Journal d'audit** de l'API | `--audit-policy-file`, `--audit-log-path` (qui a fait quoi) vers le SIEM |
| Chiffrement d'etcd | `EncryptionConfiguration` (voir [[05-stockage-configuration]]) |
| etcd et kubelet | TLS mutuel (par défaut avec kubeadm), ports filtrés |
| Nœuds | Système minimal, mises à jour, accès SSH restreint |
| Images | Registre interne, analyse (Trivy), signatures |
| Détection à l'exécution | **Falco** (appels système suspects) |
| Référentiel | **CIS Kubernetes Benchmark** : `kube-bench` ; analyse de configuration : `kubescape` |
