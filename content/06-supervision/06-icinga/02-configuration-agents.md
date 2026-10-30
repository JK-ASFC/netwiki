---
title: Configuration (DSL), agents et satellites
description: Configurer Icinga 2 avec son langage — hôtes, modèles, variables personnalisées, règles apply et apply for, commandes de contrôle (CheckCommand, ITL), dépendances ; zones et endpoints (zones.conf), distribution de la configuration, agents Linux et Windows (Icinga for Windows), satellites de sites distants et signature des certificats.
tags: [icinga2, dsl, apply, zones, agent, satellite, icinga for windows, certificats]
icon: settings-2
---

## Hôtes et règles apply

```icinga2 /etc/icinga2/zones.d/master/hotes-paris.conf
object Host "r1-paris" {
  import "generic-host"
  address = "10.0.0.1"
  vars.site = "paris"
  vars.role = "routeur"
  vars.snmpv3 = true
  vars.interfaces["Gi0/0/0"] = { index = 1, description = "WAN opérateur" }
  vars.interfaces["Gi0/0/1"] = { index = 2, description = "LAN cœur" }
}

object Host "srv-web-01.corp.exemple.fr" {
  import "generic-host"
  address = "10.0.20.15"
  vars.os = "Linux"
  vars.agent_endpoint = name              // contrôles exécutés par l'agent du serveur
}
```

```icinga2 /etc/icinga2/zones.d/master/services.conf
apply Service "ping4" {
  import "generic-service"
  check_command = "ping4"
  assign where host.address
}

// Un service par interface déclarée dans l'hôte
apply Service "if-" for (nom => conf in host.vars.interfaces) {
  import "generic-service"
  check_command = "snmpv3-interface"
  vars.snmp_interface = nom
  vars.snmp_interface_index = conf.index
  vars.snmp_interface_label = conf.description
  assign where host.vars.snmpv3
}

// Contrôles exécutés sur l'agent
apply Service "disque" {
  import "generic-service"
  check_command = "disk"
  command_endpoint = host.vars.agent_endpoint
  vars.disk_wfree = "20%"
  vars.disk_cfree = "10%"
  assign where host.vars.os == "Linux" && host.vars.agent_endpoint
}
```

| Élément | Rôle |
| --- | --- |
| `import` | Héritage d'un modèle (`template Host "…"`) |
| `vars.*` | Variables personnalisées (utilisées par les règles et les commandes) |
| `apply … assign where` | Crée un service pour chaque hôte qui remplit la condition |
| `apply … for` | Un service par élément d'un dictionnaire/tableau |
| `command_endpoint` | Exécuter le contrôle sur un autre nœud (agent) |

La bibliothèque **ITL** fournit des définitions `CheckCommand` pour la plupart des Monitoring Plugins (`ping4`, `http`, `disk`, `snmp`, `nrpe`, `snmp-interface`…) : consultez `/usr/share/icinga2/include/`.

```icinga2 Commande personnalisée
object CheckCommand "snmpv3-interface" {
  import "snmpv3"
  vars.snmpv3_user = "supervision"
  vars.snmpv3_auth_alg = "SHA"
  vars.snmpv3_priv_alg = "AES"
  vars.snmpv3_auth_key = AuthKeySupervision      // constantes définies dans constants.conf
  vars.snmpv3_priv_key = PrivKeySupervision
  vars.snmpv3_oid = "IF-MIB::ifOperStatus." + "$snmp_interface_index$"
}
```

## Dépendances

```icinga2
apply Dependency "via-routeur-site" to Host {
  parent_host_name = "r1-" + host.vars.site
  disable_notifications = true
  assign where host.vars.site && host.vars.role != "routeur"
}
```

## Zones et endpoints

```icinga2 /etc/icinga2/zones.conf (maître)
object Endpoint "icinga-maitre.corp.exemple.fr" { }
object Zone "master" { endpoints = [ "icinga-maitre.corp.exemple.fr" ] }

object Endpoint "satellite-lyon.corp.exemple.fr" { host = "10.40.0.20" }
object Zone "lyon" { endpoints = [ "satellite-lyon.corp.exemple.fr" ]; parent = "master" }

object Zone "global-templates" { global = true }
object Zone "director-global" { global = true }
```

La configuration placée dans `/etc/icinga2/zones.d/<zone>/` est **synchronisée automatiquement** vers les nœuds de cette zone ; `global-templates` est distribué partout.

## Agents

### Linux

```bash
# Sur le maître : ticket pour l'agent
sudo icinga2 pki ticket --cn srv-web-01.corp.exemple.fr
# Sur l'agent
sudo apt install icinga2 monitoring-plugins
sudo icinga2 node wizard           # « y » (agent), CN, nœud parent, ticket ; accepter commandes et configuration du parent
sudo systemctl restart icinga2
```

### Windows : Icinga for Windows

```powershell
# Kickstart officiel (télécharge le framework PowerShell, l'agent et les greffons)
[Net.ServicePointManager]::SecurityProtocol = 'tls12'
$s = Invoke-WebRequest -UseBasicParsing -Uri 'https://packages.icinga.com/IcingaForWindows/IcingaForWindows.ps1'
Invoke-Expression $s.Content
# Assistant : Install-Icinga (ou fichier de réponses pour un déploiement en masse par GPO/Intune)
```

Les greffons PowerShell (`Invoke-IcingaCheckCPU`, `Invoke-IcingaCheckService`, `Invoke-IcingaCheckUsedPartitionSpace`…) sont importés dans Icinga (ou Director) sous forme de `CheckCommand`.

### Satellites

Un **satellite** par site distant ou zone réseau : il ordonnance les contrôles de sa zone, continue de fonctionner si le lien vers le maître est coupé, et relaie les résultats. Les agents du site se rattachent au satellite. Deux satellites par zone assurent la haute disponibilité.

```bash
sudo icinga2 daemon -C            # valider la configuration avant tout rechargement
sudo systemctl reload icinga2
```
