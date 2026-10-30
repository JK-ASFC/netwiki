---
title: Kubernetes — aide-mémoire des commandes kubectl
description: Commandes kubectl et kubeadm avec exemples — contextes et espaces de noms, lecture (get, describe, -o wide/yaml/jsonpath, étiquettes), journaux et exec, déploiements (apply, rollout status/history/undo, scale, set image, restart), services et port-forward, ConfigMaps et Secrets, nœuds (cordon, drain, taint, top), événements et dépannage, RBAC (auth can-i), kubeadm (init, join, upgrade, certificats), etcd (sauvegarde), Helm.
tags: [aide-mémoire, kubernetes, kubectl, kubeadm, helm, rbac, etcd]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-architecture|Kubernetes]].

## Contextes et espaces de noms

```bash
kubectl config get-contexts
kubectl config use-context prod-paris
kubectl config set-context --current --namespace=appli
kubectl get ns
kubectl create namespace appli
alias k=kubectl
source <(kubectl completion bash)
```

## Lire l'état

```bash
kubectl get nodes -o wide
kubectl get pods -A
kubectl get pods -n appli -o wide --show-labels
kubectl get pods -l app=web -n appli
kubectl get deploy,svc,ingress,pvc -n appli
kubectl get pod web-7d4b9c-x2k8f -n appli -o yaml
kubectl get pods -n appli -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.phase}{"\n"}{end}'
kubectl describe pod web-7d4b9c-x2k8f -n appli
kubectl get events -n appli --sort-by=.lastTimestamp | tail -20
kubectl api-resources | head
kubectl explain deployment.spec.strategy
```

## Journaux, exec, copie, accès

```bash
kubectl logs -f deploy/web -n appli
kubectl logs web-7d4b9c-x2k8f -c sidecar -n appli --previous      # conteneur précédent (après plantage)
kubectl logs -l app=web -n appli --tail 50
kubectl exec -it web-7d4b9c-x2k8f -n appli -- sh
kubectl cp appli/web-7d4b9c-x2k8f:/var/log/app.log ./app.log
kubectl port-forward svc/web 8080:80 -n appli
kubectl debug -it web-7d4b9c-x2k8f -n appli --image=nicolaka/netshoot --target=web     # conteneur de débogage éphémère
kubectl run test-dns --rm -it --image=busybox:1.36 --restart=Never -- nslookup web.appli.svc.cluster.local
```

## Déployer et mettre à jour

```bash
kubectl apply -f deploiement.yaml
kubectl apply -k overlays/prod/                   # Kustomize
kubectl diff -f deploiement.yaml
kubectl create deployment web --image=nginx:1.27 --replicas=3 -n appli --dry-run=client -o yaml > web.yaml
kubectl set image deploy/web nginx=nginx:1.27.2 -n appli
kubectl rollout status deploy/web -n appli
kubectl rollout history deploy/web -n appli
kubectl rollout undo deploy/web -n appli
kubectl rollout restart deploy/web -n appli
kubectl scale deploy/web --replicas=5 -n appli
kubectl autoscale deploy/web --min=2 --max=10 --cpu-percent=70 -n appli
kubectl expose deploy/web --port=80 --target-port=8080 -n appli
kubectl delete -f deploiement.yaml
```

## ConfigMaps et Secrets

```bash
kubectl create configmap app-config --from-file=config.yaml -n appli
kubectl create secret generic db-cred --from-literal=utilisateur=app --from-literal=motdepasse='MotDePasse' -n appli
kubectl create secret tls web-tls --cert=web.crt --key=web.key -n appli
kubectl get secret db-cred -n appli -o jsonpath='{.data.motdepasse}' | base64 -d
```

## Nœuds et capacité

```bash
kubectl top nodes
kubectl top pods -n appli --sort-by=memory
kubectl cordon worker-02
kubectl drain worker-02 --ignore-daemonsets --delete-emptydir-data
kubectl uncordon worker-02
kubectl taint nodes worker-gpu dedie=gpu:NoSchedule
kubectl label node worker-03 zone=paris-b
kubectl describe node worker-02 | grep -A 8 "Allocated resources"
```

## RBAC

```bash
kubectl auth can-i create deployments -n appli --as=amartin
kubectl auth can-i --list -n appli --as=system:serviceaccount:appli:deployer
kubectl create role lecteur --verb=get,list,watch --resource=pods,services -n appli
kubectl create rolebinding lecteur-amartin --role=lecteur --user=amartin -n appli
kubectl get rolebindings,clusterrolebindings -A | grep amartin
```

## Dépannage rapide

| État du pod | Piste |
| --- | --- |
| `Pending` | Ressources insuffisantes, PVC non lié, taints/affinités : `describe pod` |
| `ImagePullBackOff` | Nom/étiquette d'image, accès au registre, `imagePullSecrets` |
| `CrashLoopBackOff` | L'application quitte : `logs --previous`, sondes trop strictes |
| `OOMKilled` | Limite mémoire trop basse : `describe pod` (Last State) |
| Service injoignable | Sélecteur d'étiquettes, `kubectl get endpointslices`, NetworkPolicy |

## kubeadm et etcd

```bash
sudo kubeadm init --control-plane-endpoint k8s-api.exemple.fr:6443 --pod-network-cidr 10.244.0.0/16 --upload-certs
kubeadm token create --print-join-command
sudo kubeadm upgrade plan
sudo kubeadm upgrade apply v1.31.2
sudo kubeadm certs check-expiration
sudo kubeadm certs renew all
sudo ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key snapshot save /srv/sauvegardes/etcd-$(date +%F).db
```

## Helm

```bash
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx && helm repo update
helm install ingress ingress-nginx/ingress-nginx -n ingress --create-namespace -f valeurs.yaml
helm list -A
helm upgrade ingress ingress-nginx/ingress-nginx -n ingress -f valeurs.yaml
helm history ingress -n ingress
helm rollback ingress 2 -n ingress
helm template ingress ingress-nginx/ingress-nginx -f valeurs.yaml > rendu.yaml
helm uninstall ingress -n ingress
```
