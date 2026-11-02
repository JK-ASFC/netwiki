---
title: Knative, OpenFaaS, Fission et KEDA — aide-mémoire
description: Commandes kn (service create/update/list/describe/delete, revision list, route list, domain, broker, trigger), faas-cli (login, new, build, push, deploy, up, list, invoke, logs, remove, store), fission (env, function, route, timer, mqtrigger, function log) et KEDA (kubectl get scaledobject, scaledjob, triggerauthentication, journaux de l'opérateur) avec exemples.
tags: [aide-mémoire, knative, kn, openfaas, faas-cli, fission, keda]
icon: terminal
---

Explications : [[01-knative|Knative]] · [[02-openfaas-fission|OpenFaaS et Fission]] · [[03-keda|KEDA]].

```bash
kn service list ; kn service describe bonjour ; kn service update bonjour --image IMG:2 ; kn service delete bonjour ; kn revision list ; kn route list
kn broker create defaut ; kn trigger create t1 --broker defaut --filter type=commande.creee --sink ksvc:traitement
faas-cli list ; faas-cli store list ; faas-cli build -f f.yml ; faas-cli push -f f.yml ; faas-cli deploy -f f.yml ; faas-cli logs purge-cache ; faas-cli remove purge-cache
fission function list ; fission function log -f --name bonjour ; fission route list ; fission timer list ; fission mqtrigger list ; fission function delete --name bonjour
kubectl get scaledobjects,scaledjobs,triggerauthentications -A ; kubectl -n keda logs deploy/keda-operator --tail=50
```
