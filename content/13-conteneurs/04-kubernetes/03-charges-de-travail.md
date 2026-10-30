---
title: Charges de travail, kubectl et Helm
description: Déployer des applications sur Kubernetes — manifestes Deployment (réplicas, sondes, ressources, mises à jour progressives), StatefulSet, DaemonSet, Job et CronJob, mise à l'échelle automatique (HPA), commandes kubectl essentielles, namespaces et quotas, Kustomize et Helm.
tags: [kubernetes, deployment, statefulset, daemonset, cronjob, hpa, kubectl, helm, kustomize]
icon: boxes
---

## Deployment

```yaml inventaire-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inventaire
  namespace: reseau
  labels: { app: inventaire }
spec:
  replicas: 3
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxUnavailable: 0, maxSurge: 1 }
  selector:
    matchLabels: { app: inventaire }
  template:
    metadata:
      labels: { app: inventaire }
    spec:
      containers:
        - name: web
          image: registre.corp.exemple.fr/reseau/inventaire:1.4.2
          ports:
            - containerPort: 8000
          env:
            - name: DB_HOST
              value: inventaire-db
            - name: DB_PASSWORD
              valueFrom: { secretKeyRef: { name: inventaire-db, key: password } }
          resources:
            requests: { cpu: 100m, memory: 256Mi }
            limits:   { memory: 512Mi }
          readinessProbe:
            httpGet: { path: /sante, port: 8000 }
            periodSeconds: 10
          livenessProbe:
            httpGet: { path: /sante, port: 8000 }
            initialDelaySeconds: 30
          securityContext:
            runAsNonRoot: true
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: ScheduleAnyway
          labelSelector: { matchLabels: { app: inventaire } }
```

| Élément | Rôle |
| --- | --- |
| `requests` | Ressources **réservées** (placement par le scheduler) |
| `limits` | Plafond (dépassement mémoire → pod tué *OOMKilled*) |
| `readinessProbe` | Le pod ne reçoit du trafic qu'une fois prêt |
| `livenessProbe` | Redémarre un conteneur bloqué |
| `startupProbe` | Laisse le temps aux démarrages lents |
| `RollingUpdate` | Mise à jour pod par pod sans interruption |

## Autres contrôleurs

| Objet | Exemple d'usage |
| --- | --- |
| **StatefulSet** | Base de données répliquée : noms stables (`db-0`, `db-1`), un PVC par réplique |
| **DaemonSet** | Agent sur chaque nœud (Fluent Bit, node-exporter) |
| **Job** | Migration de schéma, traitement ponctuel |
| **CronJob** | Sauvegarde nocturne (`schedule: "30 1 * * *"`) |

```yaml cronjob-sauvegarde.yaml
apiVersion: batch/v1
kind: CronJob
metadata: { name: sauvegarde-db, namespace: reseau }
spec:
  schedule: "30 1 * * *"
  concurrencyPolicy: Forbid
  jobTemplate:
    spec:
      backoffLimit: 2
      template:
        spec:
          restartPolicy: OnFailure
          containers:
            - name: pgdump
              image: postgres:17.4
              command: ["sh", "-c", "pg_dump -h inventaire-db -U inventaire -Fc inventaire > /sauvegardes/inventaire-$(date +%F).dump"]
              envFrom: [ { secretRef: { name: inventaire-db-pg } } ]
              volumeMounts: [ { name: sauvegardes, mountPath: /sauvegardes } ]
          volumes:
            - name: sauvegardes
              persistentVolumeClaim: { claimName: sauvegardes }
```

## kubectl essentiel

| Commande | Rôle |
| --- | --- |
| `kubectl apply -f fichier.yaml` | Créer / mettre à jour (déclaratif) |
| `kubectl get pods -n reseau -o wide` | Pods, nœud, IP |
| `kubectl describe pod <pod>` | Détails et **événements** |
| `kubectl logs -f deploy/inventaire --all-containers` | Journaux |
| `kubectl exec -it <pod> -- sh` | Shell dans un conteneur |
| `kubectl rollout status / history / undo deploy/inventaire` | Suivi et retour arrière d'une mise à jour |
| `kubectl set image deploy/inventaire web=…:1.4.3` | Changer d'image |
| `kubectl scale deploy/inventaire --replicas=5` | Mise à l'échelle |
| `kubectl port-forward svc/inventaire 8000:80` | Accès local temporaire |
| `kubectl top pods` | Consommation (metrics-server requis) |
| `kubectl get events --sort-by=.lastTimestamp` | Événements récents |
| `kubectl diff -f fichier.yaml` | Différence avec l'existant |

## Mise à l'échelle automatique

```bash
kubectl autoscale deployment inventaire -n reseau --cpu-percent=70 --min=3 --max=10
kubectl get hpa -n reseau
```

Le **HPA** nécessite **metrics-server** et des `requests` CPU définies.

## Namespaces et quotas

```yaml quota-reseau.yaml
apiVersion: v1
kind: ResourceQuota
metadata: { name: quota, namespace: reseau }
spec:
  hard: { requests.cpu: "8", requests.memory: 16Gi, limits.memory: 32Gi, pods: "50" }
---
apiVersion: v1
kind: LimitRange
metadata: { name: valeurs-par-defaut, namespace: reseau }
spec:
  limits:
    - type: Container
      default: { memory: 512Mi }
      defaultRequest: { cpu: 100m, memory: 128Mi }
```

## Helm

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm show values ingress-nginx/ingress-nginx > valeurs.yaml        # paramètres disponibles
helm upgrade --install ingress-nginx ingress-nginx/ingress-nginx -n ingress-nginx --create-namespace -f valeurs.yaml
helm list -A
helm history ingress-nginx -n ingress-nginx
helm rollback ingress-nginx 3 -n ingress-nginx
```

## Kustomize

```yaml overlays/prod/kustomization.yaml
resources: [ ../../base ]
namespace: reseau-prod
images:
  - name: registre.corp.exemple.fr/reseau/inventaire
    newTag: 1.4.2
patches:
  - target: { kind: Deployment, name: inventaire }
    patch: |
      - op: replace
        path: /spec/replicas
        value: 5
```

```bash
kubectl apply -k overlays/prod
```

Pour un déploiement continu piloté par Git (revue, historique, retour arrière), utilisez **Argo CD** ou **Flux**.
