---
title: AWX et Semaphore — aide-mémoire des commandes
description: Commandes awx CLI (login, job_templates list/launch, jobs list/stdout/monitor, inventory, projects update) et API REST d'AWX, opérations Kubernetes de l'opérateur (pods, journaux, sauvegarde AWXBackup, restauration), ansible-builder, et Semaphore (semaphore setup, server, user add/change/list, migrate, API) avec exemples.
tags: [aide-mémoire, awx, semaphore, ansible]
icon: terminal
---

Explications : [[01-awx|AWX]] · [[02-semaphore|Semaphore UI]].

```bash
pip install awxkit ; export CONTROLLER_HOST=https://awx.corp.exemple.fr CONTROLLER_USERNAME=jk CONTROLLER_PASSWORD=…
awx job_templates list -f human ; awx job_templates launch "Mises à jour Linux" --monitor ; awx jobs list --status failed -f human ; awx jobs stdout 1234
awx projects update "Playbooks infra" --monitor ; awx inventory_sources update "NetBox" --monitor
curl -s -u jk:$MDP https://awx.corp.exemple.fr/api/v2/ping/ | jq .
kubectl -n awx get pods ; kubectl -n awx logs deploy/awx-task -c awx-task --tail=50
kubectl -n awx apply -f - <<< 'apiVersion: awx.ansible.com/v1beta1
kind: AWXBackup
metadata: { name: sauvegarde-awx }
spec: { deployment_name: awx }'
ansible-builder build -t registry.corp.exemple.fr/awx/ee-infra:1.0 -f execution-environment.yml
semaphore user list --config config.json ; semaphore user add --admin --login jk --name JK --email jk@corp.exemple.fr --password … --config config.json
semaphore user change-by-login --login jk --password nouveau --config config.json ; semaphore migrate --config config.json
```
