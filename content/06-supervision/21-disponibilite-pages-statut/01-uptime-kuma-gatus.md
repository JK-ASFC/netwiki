---
title: Uptime Kuma et Gatus
description: Surveillance de disponibilité auto-hébergée — Uptime Kuma (MIT, Node.js : sondes HTTP(S) avec mot-clé, TCP, ping, DNS, certificats, Docker, bases de données, push ; notifications vers plus de 90 services dont e-mail, Teams, Slack, Telegram, ntfy ; pages de statut ; installation Docker ou Node.js sous Linux et Windows ; sauvegarde) et Gatus (Apache 2.0, Go : configuration YAML versionnable, conditions sur statut, temps de réponse, corps JSON, certificat, DNS ; alertes ; page de statut ; Docker et Helm), placement des sondes et bonnes pratiques.
tags: [uptime kuma, gatus, disponibilité, supervision, page de statut, alertes]
icon: info
---

Ces outils vérifient régulièrement qu'un service répond **comme le verrait un utilisateur** (site web, API, port, DNS, certificat) et alertent en cas de panne. Ils complètent la supervision interne ([[04-zabbix/01-presentation-installation|Zabbix]], [[02-prometheus/01-presentation-installation|Prometheus]]) : installez-les **hors** de l'infrastructure surveillée (VPS, autre site) pour détecter aussi les pannes d'accès Internet.

| | **Uptime Kuma** | **Gatus** |
| --- | --- | --- |
| Configuration | Interface web | **Fichier YAML** (Git, revue) |
| Sondes | HTTP(S), mot-clé, JSON, TCP, ping, DNS, Docker, bases, gRPC, push | HTTP(S), TCP, ICMP, DNS, SSH, STARTTLS, conditions fines |
| Pages de statut | Oui, multiples | Oui |

## Uptime Kuma

```bash
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
# Sans Docker (Linux, Windows, macOS) : Node.js 20+, git clone https://github.com/louislam/uptime-kuma.git && npm run setup && pm2 start server/server.js --name uptime-kuma
```

Premier accès `http://<hôte>:3001` : créer le compte administrateur (activer la 2FA), puis *Ajouter une sonde* : type, URL, intervalle, nombre de réessais, **expiration du certificat**, notifications. Sauvegarde : le volume `data` (SQLite).

## Gatus

```yaml
# config.yaml
alerting:
  teams: { webhook-url: "https://…webhook.office.com/…", default-alert: { failure-threshold: 3, success-threshold: 2, send-on-resolved: true } }
endpoints:
  - name: Intranet
    group: Web
    url: "https://intranet.corp.exemple.fr/sante"
    interval: 1m
    conditions: ["[STATUS] == 200", "[RESPONSE_TIME] < 800", "[CERTIFICATE_EXPIRATION] > 336h", "[BODY].etat == ok"]
    alerts: [{ type: teams }]
  - name: DNS public
    group: Réseau
    url: "9.9.9.9"
    dns: { query-name: "www.corp.exemple.fr", query-type: "A" }
    conditions: ["[DNS_RCODE] == NOERROR"]
  - name: Relais SMTP
    group: Messagerie
    url: "starttls://smtp.corp.exemple.fr:587"
    conditions: ["[CONNECTED] == true", "[CERTIFICATE_EXPIRATION] > 168h"]
```

```bash
docker run -d -p 8080:8080 -v $PWD/config.yaml:/config/config.yaml --name gatus twinproduction/gatus
```

Suite : [[02-pages-statut-healthchecks|pages de statut et Healthchecks]] · [[03-interface-graphique|interfaces graphiques]] · [[90-aide-memoire|aide-mémoire]].
