---
title: CFEngine
description: CFEngine (Northern.tech, GPL pour la Community Edition) — pionnier de la gestion de configuration fondée sur les promesses : agent en C très léger et autonome, architecture hub et clients (cf-agent, cf-serverd, cf-execd, cf-monitord), installation (paquets Community, quick-install), amorçage sur le hub, politique (bundles, promesses files, packages, services, commands, classes), masterfiles et Masterfiles Policy Framework, exécution toutes les 5 minutes, CFEngine Enterprise (Mission Portal), et cas d'usage (très grands parcs, systèmes embarqués).
tags: [cfengine, gestion de configuration, promesses, agent, grande échelle]
icon: info
---

**CFEngine** (1993) a inventé l'idée de **convergence** : chaque agent vérifie toutes les 5 minutes que la machine respecte ses **promesses** et corrige les écarts, même sans réseau. Son agent en C consomme très peu et passe à l'échelle de centaines de milliers de machines.

## Installation

```bash
wget -O- https://s3.amazonaws.com/cfengine.packages/quick-install-cfengine-community.sh | sudo bash   # Linux (Community)
sudo /var/cfengine/bin/cf-agent --bootstrap 10.0.20.70           # sur le hub : s'amorcer sur sa propre adresse
sudo /var/cfengine/bin/cf-agent --bootstrap 10.0.20.70           # sur chaque client : adresse du hub
```

Les politiques vivent sur le hub dans `/var/cfengine/masterfiles/` et sont distribuées aux clients.

## Politique

```text
# /var/cfengine/masterfiles/services/base.cf (déclarée dans promises.cf ou def.json)
bundle agent base_corp
{
  packages:
      "chrony" policy => "present";
  files:
      "/etc/motd"
        content => "Serveur géré par CFEngine — toute modification locale sera remplacée.";
      "/etc/ssh/sshd_config.d/90-corp.conf"
        content => "PermitRootLogin no$(const.n)PasswordAuthentication no",
        classes => if_repaired("sshd_modifie");
  services:
      "chronyd" service_policy => "start";
  commands:
    sshd_modifie::
      "/usr/bin/systemctl reload sshd";
}
```

```bash
sudo /var/cfengine/bin/cf-promises -f /var/cfengine/masterfiles/promises.cf     # vérifier la syntaxe
sudo /var/cfengine/bin/cf-agent -KI                                             # exécuter immédiatement, verbeux sur les changements
```

L'édition **Enterprise** ajoute le **Mission Portal** (rapports de conformité, inventaire, alertes). Commandes : [[90-aide-memoire|aide-mémoire]].
