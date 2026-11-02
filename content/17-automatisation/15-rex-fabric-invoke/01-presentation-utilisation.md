---
title: Présentation, installation et utilisation
description: Automatisation par SSH écrite en code — Rex (Perl : Rexfile, tâches, groupes de serveurs, modules file, pkg, service, run, sudo, parallélisme) et Fabric/Invoke (Python : Invoke pour les tâches locales avec tasks.py, Fabric pour l'exécution distante avec Connection et SerialGroup/ThreadingGroup, sudo, put/get, passerelles SSH), installation Linux, macOS et Windows, exemples de déploiement et de collecte, et place face à Ansible.
tags: [rex, fabric, invoke, ssh, python, perl, automatisation]
icon: info
---

Ces outils exécutent des tâches sur des serveurs par **SSH**, décrites dans un **langage de programmation** plutôt qu'en YAML. Ils conviennent à des scripts d'exploitation ponctuels ou à des déploiements simples ; pour une gestion de configuration complète et idempotente, [[01-ansible/01-presentation-installation|Ansible]] reste la référence.

| Outil | Langage | Usage |
| --- | --- | --- |
| **Rex** (`rex`) | Perl | Tâches et modules (fichiers, paquets, services) sur des groupes de serveurs |
| **Invoke** (`inv`) | Python | Tâches **locales** (équivalent de Make en Python) |
| **Fabric** (`fab`) | Python | Tâches **distantes** sur SSH, bâties sur Invoke et Paramiko |

## Installation

```bash
pipx install fabric                         # fournit fab (et Invoke) — Linux, macOS, Windows
sudo apt install rex                        # Debian/Ubuntu ; sinon cpanm Rex
```

## Fabric

```python
# fabfile.py
from fabric import task, SerialGroup

WEB = ["srv-web-01.corp.exemple.fr", "srv-web-02.corp.exemple.fr"]

@task
def espace(c):
    for cnx in SerialGroup(*WEB, user="admin"):
        cnx.run("df -h / | tail -1")

@task
def deployer(c, version):
    for cnx in SerialGroup(*WEB, user="admin"):
        cnx.put(f"dist/app-{version}.tar.gz", "/tmp/")
        cnx.sudo(f"tar xzf /tmp/app-{version}.tar.gz -C /opt/app && systemctl restart app")
        cnx.run("curl -fsS http://localhost:8080/sante")
```

```bash
fab --list ; fab espace ; fab deployer --version 1.8.2
fab -H srv-db-01 -- uptime                 # commande ad hoc
```

## Rex

```perl
# Rexfile
use Rex -feature => ['1.4'];
user "admin";
key_auth;
group web => "srv-web-0[1..2].corp.exemple.fr";

desc "Installer et démarrer chrony";
task "chrony", group => "web", sub {
  pkg "chrony", ensure => "present";
  file "/etc/chrony/sources.d/corp.sources", content => "server ntp1.corp.exemple.fr iburst\n", on_change => sub { service chrony => "restart" };
  service chrony => ensure => "started";
};
```

```bash
rex -T ; rex chrony ; rex -H srv-web-01 -e 'say run "uptime"'
```

Commandes : [[90-aide-memoire|aide-mémoire]].
