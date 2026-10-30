---
title: Icinga 2 — aide-mémoire des commandes
description: Commandes Icinga 2 avec exemples — vérification (icinga2 daemon -C), fonctionnalités (feature enable/list), assistant de nœud et PKI (node wizard, pki ticket, ca list/sign), objets (icinga2 object list), API REST (objets, actions : vérification, acquittement, maintenance, notifications personnalisées, statut), console, Icinga Web 2 et icingacli (Director, modules), journaux.
tags: [aide-mémoire, icinga2, api, icingacli, director, supervision]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Icinga]].

## Démon et fonctionnalités

```bash
sudo icinga2 daemon -C                     # vérifier la configuration
sudo systemctl reload icinga2
sudo icinga2 feature list
sudo icinga2 feature enable api command
sudo icinga2 feature disable notification   # ex. sur un satellite
sudo icinga2 object list --type Host --name 'srv-*'
sudo icinga2 object list --type Service --name '*!https'
sudo icinga2 variable list | head
sudo tail -f /var/log/icinga2/icinga2.log
```

## Nœuds, agents, PKI

```bash
sudo icinga2 node wizard                         # assistant (maître, satellite ou agent)
sudo icinga2 pki ticket --cn agent01.exemple.fr  # ticket à donner à l'agent (sur le maître)
sudo icinga2 ca list                             # demandes de signature en attente
sudo icinga2 ca sign <empreinte>
sudo icinga2 api setup                           # API et certificats (maître)
```

## API REST

```bash
A="https://icinga.exemple.fr:5665/v1"
C=(-k -s -u api-user:"$MDP" -H "Accept: application/json")
curl "${C[@]}" "$A/status/IcingaApplication" | jq '.results[0].status.icingaapplication.app.version'
curl "${C[@]}" "$A/objects/hosts?filter=host.state!=0" | jq '.results[].name'
curl "${C[@]}" "$A/objects/services?filter=service.state==2&attrs=display_name&attrs=last_check_result" | jq '.results[].attrs.display_name'
# Forcer une vérification
curl "${C[@]}" -X POST "$A/actions/reschedule-check" -d '{"type":"Service","filter":"host.name==\"srv-web01\" && service.name==\"https\"","force":true}'
# Acquitter
curl "${C[@]}" -X POST "$A/actions/acknowledge-problem" -d '{"type":"Service","filter":"service.name==\"https\"","author":"amartin","comment":"Intervention","notify":false,"sticky":true}'
# Maintenance de 2 h
curl "${C[@]}" -X POST "$A/actions/schedule-downtime" -d "{\"type\":\"Host\",\"filter\":\"host.name==\\\"srv-web01\\\"\",\"author\":\"amartin\",\"comment\":\"Mise à jour\",\"start_time\":$(date +%s),\"end_time\":$(date -d '+2 hour' +%s),\"all_services\":true}"
# Résultat passif
curl "${C[@]}" -X POST "$A/actions/process-check-result" -d '{"type":"Service","filter":"host.name==\"srv-web01\" && service.name==\"sauvegarde\"","exit_status":0,"plugin_output":"Sauvegarde OK"}'
```

## Console et icingacli

```bash
sudo icinga2 console --connect "https://api-user:$MDP@localhost:5665/"
sudo icingacli module list
sudo icingacli director config deploy                # déployer la configuration du Director
sudo icingacli director host create srv-web02 --imports linux-host --address 10.0.30.11
sudo icingacli monitoring list services --problems   # selon les modules installés
```

## Définition type

```text
object Host "srv-web01" {
  import "generic-host"
  address = "10.0.30.10"
  vars.os = "Linux"
  vars.http_vhosts["intranet"] = { http_vhost = "intranet.exemple.fr", http_ssl = true, http_uri = "/health" }
}
apply Service "https-" for (nom => config in host.vars.http_vhosts) {
  import "generic-service"
  check_command = "http"
  vars += config
}
```
