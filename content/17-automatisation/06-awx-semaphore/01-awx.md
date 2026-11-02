---
title: AWX
description: AWX (Red Hat, Apache 2.0) — projet amont d'Ansible Automation Platform : interface web, API REST et planificateur pour exécuter Ansible en équipe ; installation sur Kubernetes avec AWX Operator (K3s pour un serveur unique), objets (organisations, équipes, identifiants, projets Git, inventaires statiques et dynamiques NetBox/VMware, modèles de tâches et de workflows, planifications, approbations), environnements d'exécution (ansible-builder), RBAC et LDAP/SAML, notifications, sauvegarde, mises à jour et alternatives.
tags: [awx, ansible, automation platform, kubernetes, opérateur, rbac]
icon: info
---

**AWX** apporte à [[01-ansible/01-presentation-installation|Ansible]] une **interface web**, une **API**, des **droits** fins et un **journal** : les administrateurs lancent des playbooks validés sans accès direct aux mots de passe (coffre d'**identifiants**), les exécutions sont historisées, planifiées ou déclenchées par API. C'est la version libre en amont d'**Ansible Automation Platform** (Red Hat), qui apporte le support et des versions stabilisées.

## Installation (AWX Operator sur K3s)

```bash
curl -sfL https://get.k3s.io | sh -                                   # serveur unique 4 vCPU / 8 Go mini
git clone https://github.com/ansible/awx-operator.git && cd awx-operator && git checkout <dernière version>
export NAMESPACE=awx && make deploy                                   # ou kustomize avec la version de l'opérateur
cat <<'EOF2' | kubectl apply -n awx -f -
apiVersion: awx.ansible.com/v1beta1
kind: AWX
metadata: { name: awx }
spec:
  service_type: ClusterIP
  ingress_type: ingress
  hostname: awx.corp.exemple.fr
  postgres_storage_class: local-path
EOF2
kubectl -n awx get pods -w
kubectl -n awx get secret awx-admin-password -o jsonpath='{.data.password}' | base64 -d ; echo
```

## Mise en place

1. **Organisation** et **équipes** (liées aux groupes LDAP/AD ou SAML).
2. **Identifiants** : machine (SSH ou WinRM), coffre Ansible Vault, source Git, NetBox, VMware, OpenBao/Vault (recherche de secrets).
3. **Projet** : dépôt Git des playbooks (mise à jour au lancement).
4. **Inventaire** : statique, ou **source dynamique** ([[08-netbox-nautobot/01-netbox|NetBox]], VMware, Azure, fichier du dépôt).
5. **Modèle de tâche** : playbook + inventaire + identifiants + **questionnaire** (survey) pour les paramètres ; droits d'exécution par équipe.
6. **Workflows** (enchaînements avec approbation), **planifications**, **notifications** (e-mail, Teams, webhook).

Environnements d'exécution : images conteneur contenant les collections et bibliothèques Python, construites avec `ansible-builder`.

Suite : [[02-semaphore|Semaphore UI]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
