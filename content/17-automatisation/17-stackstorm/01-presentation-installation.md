---
title: Présentation, installation et utilisation
description: StackStorm (Linux Foundation, Apache 2.0) — automatisation pilotée par les événements et remédiation automatique : architecture (capteurs, déclencheurs, règles, actions, workflows Orquesta, packs, ChatOps avec hubot/errbot, file RabbitMQ, MongoDB), installation (script st2 sur Ubuntu et RHEL, Docker Compose, Helm), packs de l'Exchange (Ansible, Jira, Slack, VMware, NetBox…), règle simple, workflow, clés et secrets du datastore, CLI st2, interface web et cas d'usage (auto-remédiation d'alertes, provisionnement).
tags: [stackstorm, st2, événements, remédiation, workflows, chatops, automatisation]
icon: info
---

**StackStorm** relie des **événements** (alerte de supervision, webhook, nouveau ticket, message de chat) à des **actions** automatiques : redémarrer un service, agrandir un disque, ouvrir un ticket enrichi, lancer un playbook [[01-ansible/01-presentation-installation|Ansible]]. On parle d'« IFTTT pour l'exploitation » ou d'**auto-remédiation**.

| Notion | Rôle |
| --- | --- |
| **Capteur** (*sensor*) | Surveille une source et émet des **déclencheurs** (*triggers*) |
| **Règle** | Si tel déclencheur avec tels critères → telle action |
| **Action** | Commande, script, appel d'API (fourni par un **pack**) |
| **Workflow** (Orquesta) | Enchaînement d'actions avec conditions et parallélisme |
| **Pack** | Ensemble capteurs + actions + règles pour un produit (Slack, Jira, VMware, NetBox…) |

## Installation

```bash
curl -sSL https://stackstorm.com/packages/install.sh | bash -s -- --user=st2admin --password='MdpSt2-2026'   # Ubuntu/RHEL dédié
# Docker : dépôt StackStorm/st2-docker (docker compose up -d) ; Kubernetes : chart stackstorm-ha
st2 login st2admin ; st2 action list --pack=core
```

Interface web : `https://<hôte>/` (historique des exécutions, règles, actions, éditeur de workflows).

## Exemple : redémarrer un service sur alerte

```yaml
# /opt/stackstorm/packs/corp/rules/redemarrer_nginx.yaml
name: redemarrer_nginx_sur_alerte
pack: corp
enabled: true
trigger:
  type: core.st2.webhook
  parameters: { url: alertes }            # POST https://st2/api/v1/webhooks/alertes
criteria:
  trigger.body.alertname: { type: equals, pattern: NginxDown }
action:
  ref: core.remote_sudo
  parameters:
    hosts: "{{ trigger.body.labels.instance }}"
    cmd: systemctl restart nginx
```

```bash
st2 pack install slack jira ansible
st2ctl reload --register-rules
st2 run core.remote hosts=srv-web-01 cmd=uptime
st2 execution list -n 10 ; st2 trace list -n 5
```

> [!WARNING]
> Une auto-remédiation mal bornée peut aggraver un incident (boucle de redémarrages). Limitez le nombre d'exécutions, notifiez systématiquement les humains et commencez par des actions de **diagnostic** et d'**enrichissement** avant les actions correctives.

Commandes : [[90-aide-memoire|aide-mémoire]].
