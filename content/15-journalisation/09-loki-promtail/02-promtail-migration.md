---
title: Promtail et migration vers Alloy
description: Promtail — agent historique de collecte pour Loki, déprécié (fin de support en 2026) au profit de Grafana Alloy : configuration existante (scrape_configs, static_configs, journal systemd, relabel_configs, pipeline_stages regex, json, labels, timestamp, drop, multiline), positions, dépannage, et procédure de migration (alloy convert --source-format=promtail, équivalences de composants, test en parallèle, bascule), avec exemples.
tags: [promtail, loki, grafana alloy, migration, journaux, déprécié]
icon: info
---

**Promtail** lit des fichiers de journaux et le journal systemd, ajoute des étiquettes et pousse vers [[01-loki|Loki]]. Grafana l'a **déprécié** : plus de nouvelles fonctions, fin de support annoncée pour 2026. Les installations existantes doivent migrer vers **Grafana Alloy**.

## Configuration typique (pour la lire et la migrer)

```yaml
# /etc/promtail/config.yml
server: { http_listen_port: 9080 }
positions: { filename: /var/lib/promtail/positions.yaml }
clients: [{ url: http://loki.corp.exemple.fr:3100/loki/api/v1/push }]
scrape_configs:
  - job_name: journal
    journal: { max_age: 12h, labels: { job: systemd-journal } }
    relabel_configs:
      - { source_labels: [__journal__systemd_unit], target_label: unit }
      - { source_labels: [__journal__hostname], target_label: host }
  - job_name: nginx
    static_configs: [{ targets: [localhost], labels: { job: nginx, __path__: /var/log/nginx/*.log } }]
    pipeline_stages:
      - regex: { expression: '^(?P<ip>\S+) .* "(?P<methode>\S+) (?P<chemin>\S+) \S+" (?P<statut>\d+)' }
      - labels: { methode: "" }
      - drop: { expression: '.*GET /sante.*' }
```

## Migrer vers Alloy

```bash
sudo apt install alloy
alloy convert --source-format=promtail --output=/etc/alloy/config.alloy /etc/promtail/config.yml
alloy fmt /etc/alloy/config.alloy
sudo systemctl enable --now alloy        # faire tourner en parallèle quelques heures en envoyant vers un locataire de test
sudo systemctl disable --now promtail    # puis basculer
```

| Promtail | Alloy |
| --- | --- |
| `static_configs` + `__path__` | `local.file_match` + `loki.source.file` |
| `journal` | `loki.source.journal` |
| `relabel_configs` | `discovery.relabel` / `loki.relabel` |
| `pipeline_stages` | `loki.process` (étapes `stage.regex`, `stage.labels`, `stage.drop`…) |
| `clients` | `loki.write` |

Vérifier ensuite dans l'interface d'Alloy (`http://localhost:12345`) que chaque composant reçoit et envoie des lignes. Commandes : [[90-aide-memoire|aide-mémoire]].
