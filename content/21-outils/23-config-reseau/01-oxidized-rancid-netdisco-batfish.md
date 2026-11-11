---
title: Oxidized, RANCID, Netdisco et Batfish
description: Gestion des configurations réseau — Oxidized (Ruby, Apache 2.0 : récupération des configurations d'équipements, stockage en Git, interface web et API, hooks, nombreux modèles de constructeurs, source CSV ou base, intégration NetBox), RANCID (l'ancêtre : collecte par rancid-run et cron, dépôt CVS/SVN/Git, diffs par courriel, clogin), Netdisco (découverte et cartographie du réseau par SNMP et CDP/LLDP, localisation d'une adresse MAC/IP sur un port, PostgreSQL) et Batfish (analyse et validation hors ligne des configurations, détection d'erreurs, requêtes pybatfish) ; sécurité des identifiants et choix.
tags: [oxidized, rancid, netdisco, batfish, sauvegarde configuration, réseau, git, snmp, validation]
icon: network
---

Garder une **copie à jour des configurations** des routeurs, commutateurs et pare-feu permet de restaurer après panne, de tracer les changements et d'auditer. D'autres outils **cartographient** le réseau ou **valident** une configuration avant de la déployer.

## Oxidized

**Oxidized** se connecte régulièrement aux équipements (SSH/Telnet), récupère leur configuration et l'enregistre dans un dépôt **Git** : chaque modification devient un commit, visible dans une interface web et diffusable par hook (courriel, Slack, webhook). Il prend en charge des centaines de modèles de constructeurs.

```yaml ~/.config/oxidized/config
username: lecture-reseau
password: "…"
model: ios
interval: 3600
rest: 127.0.0.1:8888
vars:
  enable: "…"
source:
  default: csv
  csv:
    file: /home/oxidized/router.db
    delimiter: !ruby/regexp /:/
    map: { name: 0, model: 1, group: 2 }
output:
  default: git
  git:
    user: oxidized
    email: oxidized@exemple.fr
    repo: /home/oxidized/configs.git
hooks:
  notif:
    type: exec
    events: [ post_store ]
    cmd: '/usr/local/bin/notifier.sh'
```

```text ~/oxidized/router.db
rtr-lyon:ios:coeur
sw-paris:ios:acces
fw-dmz:panos:securite
```

```bash
docker run -d --name oxidized -p 127.0.0.1:8888:8888 -v /srv/oxidized:/home/oxidized/.config/oxidized oxidized/oxidized:latest
curl -s http://127.0.0.1:8888/nodes.json | jq '.[] | {name, status, last: .last.status}'
curl -s http://127.0.0.1:8888/node/next/rtr-lyon        # forcer une collecte
git -C /srv/oxidized/configs.git log --oneline | head   # historique des changements
```

La liste des équipements peut venir d'un **CSV**, d'une base SQL ou de **NetBox** (source `http`).

## RANCID

**RANCID** (Really Awful but Cisco-centric Interface Diff) est l'ancêtre : des scripts (`clogin`, `rancid-run`) collectent les configurations via cron et les versionnent (CVS, SVN ou Git), avec envoi des **diffs par courriel**. Encore présent dans beaucoup de réseaux, mais plus rustique qu'Oxidized.

```bash
# /etc/rancid/rancid.conf : LIST_OF_GROUPS="coeur acces"
# ~/.cloginrc : identifiants par équipement (droits 600 obligatoires)
# router.db du groupe : rtr-lyon;cisco;up
su - rancid -c 'rancid-run'
su - rancid -c 'clogin rtr-lyon'       # connexion manuelle de test
```

## Netdisco

**Netdisco** découvre le réseau par **SNMP** et **CDP/LLDP** : il dresse l'inventaire des équipements, des ports et des voisins, et permet de **localiser une adresse MAC ou IP** sur un port précis — très utile pour retrouver où est branché un appareil.

```bash
# Déploiement Docker Compose fourni par le projet (backend de collecte + web + PostgreSQL)
# Interface web : port 5000 ; configurer les communautés SNMP et les plages à explorer
```

Fonctions : recherche d'un nœud (MAC/IP/nom), historique de présence sur les ports, topologie L2, inventaire matériel, (dés)activation de ports selon les droits. SNMP en **lecture seule** et v3 de préférence.

## Batfish

**Batfish** analyse les configurations **hors ligne** (sans toucher au réseau) pour détecter des erreurs et **valider** un changement avant déploiement : routes incohérentes, ACL qui ne font pas ce qu'on croit, boucles, non-conformité à une politique.

```bash
docker run -d --name batfish -p 127.0.0.1:9996:9996 -p 127.0.0.1:9997:9997 batfish/allinone
python3 -m pip install pybatfish
```

```python
from pybatfish.client.session import Session
bf = Session(host="127.0.0.1")
bf.set_network("prod"); bf.init_snapshot("./configs", name="avant", overwrite=True)
print(bf.q.nodeProperties().answer().frame())
print(bf.q.undefinedReferences().answer().frame())        # objets référencés mais absents
print(bf.q.routes(nodes="rtr-lyon").answer().frame())
# Tester l'accessibilité d'un flux à travers les ACL
print(bf.q.reachability(pathConstraints={"startLocation": "sw-acces"}, headers={"dstIps":"10.0.0.0/24","dstPorts":"443"}).answer().frame())
```

On alimente Batfish avec les configurations collectées par Oxidized : **sauvegarde → validation** dans la même chaîne, idéalement en CI avant d'appliquer un changement.

## Choisir

| Besoin | Outil |
| --- | --- |
| Sauvegarder les configs et suivre les changements | Oxidized (moderne) ou RANCID (existant) |
| Localiser un appareil, cartographier le L2 | Netdisco |
| Valider une configuration avant déploiement | Batfish |

> [!WARNING]
> Ces outils détiennent des **identifiants d'administration réseau** (ou au moins de lecture) et des configurations complètes (parfois avec secrets) : compte dédié à droits minimaux, fichiers d'identifiants en 600, dépôt Git et base d'accès restreint, chiffrement du stockage et des sauvegardes.

Commandes : [[90-aide-memoire|aide-mémoire]].
