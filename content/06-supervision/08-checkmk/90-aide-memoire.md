---
title: Checkmk — aide-mémoire des commandes
description: Commandes Checkmk avec exemples — gestion des sites (omd create, start, stop, status, backup, restore, update), commande cmk (inventaire et découverte des services, vérification, débogage d'un agent, rechargement, rechargement à chaud), agent (check_mk_agent, cmk-agent-ctl register, mises à jour), requêtes Livestatus (lq), API REST avec curl, journaux.
tags: [aide-mémoire, checkmk, omd, cmk, livestatus, api]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Checkmk]]. Les commandes `cmk` et `lq` s'exécutent **dans le site** (`omd su supervision` ou `su - supervision`).

## Sites (OMD)

```bash
sudo omd sites
sudo omd create supervision
sudo omd start supervision
sudo omd status supervision
sudo omd stop supervision
sudo omd config supervision show
sudo omd backup supervision /srv/sauvegardes/supervision-$(date +%F).tar.gz
sudo omd restore /srv/sauvegardes/supervision-2026-10-29.tar.gz
sudo omd update supervision                    # après installation d'une nouvelle version du paquet
sudo omd su supervision
```

## cmk (dans le site)

```bash
cmk --list-hosts
cmk -d srv-web01                    # données brutes de l'agent (débogage)
cmk -vII srv-web01                  # (re)découvrir tous les services
cmk -I srv-web01                    # ajouter les nouveaux services
cmk -v srv-web01                    # exécuter les vérifications et afficher le résultat
cmk -nv srv-web01                   # idem sans soumettre les résultats
cmk -O                              # générer la configuration et recharger le noyau (« activer »)
cmk -R                              # redémarrer le noyau
cmk --check-discovery srv-web01
cmk -D srv-web01                    # configuration effective de l'hôte
cmk --snmpwalk 10.0.99.10           # parcours SNMP enregistré dans ~/var/check_mk/snmpwalks
```

## Agent

```bash
check_mk_agent | head -30                                                 # sur l'hôte supervisé
sudo cmk-agent-ctl register --hostname srv-web01 --server checkmk.exemple.fr --site supervision --user automation
sudo cmk-agent-ctl status
sudo cmk-update-agent register && sudo cmk-update-agent                   # mises à jour automatiques (éditions commerciales)
nc 10.0.30.10 6556 | head                                                 # agent hérité non chiffré (à éviter)
```

```powershell
# Windows
& "C:\Program Files (x86)\checkmk\service\cmk-agent-ctl.exe" register --hostname PC-PARIS-042 --server checkmk.exemple.fr --site supervision --user automation
& "C:\Program Files (x86)\checkmk\service\check_mk_agent.exe" test
```

## Livestatus

```bash
lq "GET hosts\nColumns: name state address\nFilter: state != 0"
lq "GET services\nColumns: host_name description state plugin_output\nFilter: state = 2"
lq "GET status\nColumns: program_version num_hosts num_services"
```

## API REST

```bash
API=https://checkmk.exemple.fr/supervision/check_mk/api/1.0
H=(-H "Authorization: Bearer automation $SECRET" -H "Accept: application/json")
curl -s "${H[@]}" "$API/domain-types/host_config/collections/all" | jq '.value[].id'
curl -s "${H[@]}" -X POST "$API/domain-types/host_config/collections/all?bake_agent=false" -H "Content-Type: application/json" \
  -d '{"folder":"/linux","host_name":"srv-web02","attributes":{"ipaddress":"10.0.30.11"}}'
curl -s "${H[@]}" -X POST "$API/domain-types/service_discovery_run/actions/start/invoke" -H "Content-Type: application/json" -d '{"host_name":"srv-web02","mode":"fix_all"}'
curl -s "${H[@]}" -X POST "$API/domain-types/activation_run/actions/activate-changes/invoke" -H "Content-Type: application/json" -H "If-Match: *" -d '{"redirect":false,"sites":["supervision"],"force_foreign_changes":false}'
```

## Journaux

```bash
tail -f ~/var/log/cmc.log          # noyau CMC (éditions commerciales)
tail -f ~/var/log/nagios.log       # noyau Nagios (édition Raw)
tail -f ~/var/log/web.log
```
