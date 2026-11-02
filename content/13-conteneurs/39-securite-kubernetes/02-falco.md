---
title: Falco
description: Falco (CNCF, Apache 2.0) — détection d'intrusions à l'exécution pour conteneurs, Kubernetes et hôtes Linux par observation des appels système (eBPF moderne) : installation (Helm sur Kubernetes, paquets Debian/RHEL sur hôte), règles (shell dans un conteneur, lecture de fichiers sensibles, connexion sortante inattendue, élévation de privilèges), macros et listes, personnalisation et exceptions, sorties (journaux, Falcosidekick vers Slack, Teams, SIEM, Loki), greffons (journaux d'audit Kubernetes, CloudTrail), Falcosidekick UI, Talon (réponse automatique) et réglage du bruit.
tags: [falco, ids, runtime, ebpf, kubernetes, détection, falcosidekick]
icon: info
---

**Falco** observe en temps réel les **appels système** des conteneurs et de l'hôte et déclenche une alerte quand un comportement correspond à une **règle** : un shell ouvert dans un conteneur de production, la lecture de `/etc/shadow`, une connexion vers un port inhabituel, un binaire lancé depuis `/tmp`. Il complète [[01-audit-analyse|Trivy]] (vulnérabilités connues) en détectant les **attaques en cours**.

## Installation

```bash
helm repo add falcosecurity https://falcosecurity.github.io/charts && helm repo update
helm install falco falcosecurity/falco -n falco --create-namespace \
  --set driver.kind=modern_ebpf --set falcosidekick.enabled=true --set falcosidekick.webui.enabled=true \
  --set falcosidekick.config.slack.webhookurl=https://hooks.slack.com/services/…
kubectl -n falco logs ds/falco -c falco --tail=20
```

Sur un hôte Linux sans Kubernetes : dépôt `download.falco.org` puis `sudo apt install falco` (choix du pilote eBPF moderne), service `falco-modern-bpf`.

## Règles personnalisées

```yaml
# falco_rules.local.yaml (ou customRules dans les valeurs Helm)
- list: images_admin_autorisees
  items: [registry.corp.exemple.fr/outils/debug]

- rule: Shell dans un conteneur de production
  desc: Un shell interactif est lancé dans un conteneur hors images d'administration
  condition: >
    spawned_process and container and shell_procs and proc.tty != 0
    and k8s.ns.name startswith "prod" and not container.image.repository in (images_admin_autorisees)
  output: Shell (user=%user.name ns=%k8s.ns.name pod=%k8s.pod.name image=%container.image.repository cmd=%proc.cmdline)
  priority: WARNING
  tags: [conteneur, mitre_execution]
```

Commencez avec les règles par défaut, observez le bruit pendant quelques jours, puis ajoutez des **exceptions** ciblées plutôt que de désactiver des règles entières. **Falcosidekick** route les alertes vers Slack, Teams, [[05-wazuh/01-presentation-installation|Wazuh]], Elasticsearch, Loki ou un webhook ; **Falco Talon** peut réagir (étiqueter, isoler, supprimer un pod).

<!-- CAPTURE: Falcosidekick UI — tableau des alertes | _assets/falcosidekick-ui.png -->

Commandes : [[90-aide-memoire|aide-mémoire]].
