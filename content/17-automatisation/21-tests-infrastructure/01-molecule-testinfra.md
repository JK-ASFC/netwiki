---
title: Molecule et Testinfra
description: Tester l'automatisation Ansible et l'état des serveurs — Molecule (cadre de test des rôles et collections Ansible : scénarios, pilotes Docker/Podman/Vagrant/délégué, cycle create, converge, idempotence, verify, destroy, vérificateurs Ansible ou Testinfra, intégration CI) et Testinfra (greffon pytest : vérifier paquets, services, ports, fichiers, utilisateurs, commandes sur des hôtes locaux, SSH, Ansible, Docker), installation, exemples et bonnes pratiques.
tags: [molecule, testinfra, ansible, tests, pytest, ci, idempotence]
icon: info
---

Un rôle [[01-ansible/01-presentation-installation|Ansible]] doit être **testé** comme du code : s'applique-t-il sans erreur sur chaque distribution visée, est-il **idempotent** (une deuxième exécution ne change rien), le service attendu fonctionne-t-il vraiment ? **Molecule** orchestre ces tests dans des conteneurs ou des VM jetables ; **Testinfra** vérifie l'état obtenu.

## Installation

```bash
pipx install molecule --include-deps && pipx inject molecule molecule-plugins[docker] pytest-testinfra
```

## Molecule

```bash
cd roles/chrony && molecule init scenario --driver-name docker
```

```yaml
# molecule/default/molecule.yml
driver: { name: docker }
platforms:
  - { name: debian12, image: geerlingguy/docker-debian12-ansible, privileged: true, command: /lib/systemd/systemd, volumes: ["/sys/fs/cgroup:/sys/fs/cgroup:rw"], cgroupns_mode: host }
  - { name: rocky9, image: geerlingguy/docker-rockylinux9-ansible, privileged: true, command: /usr/sbin/init, volumes: ["/sys/fs/cgroup:/sys/fs/cgroup:rw"], cgroupns_mode: host }
provisioner: { name: ansible }
verifier: { name: testinfra }
```

```bash
molecule test            # create → converge → idempotence → verify → destroy
molecule converge ; molecule login -h rocky9 ; molecule verify ; molecule destroy     # pendant le développement
```

## Testinfra

```python
# molecule/default/tests/test_chrony.py
def test_paquet(host):
    assert host.package("chrony").is_installed

def test_service(host):
    nom = "chronyd" if host.system_info.distribution in ("rocky", "redhat") else "chrony"
    s = host.service(nom)
    assert s.is_running and s.is_enabled

def test_serveur_ntp(host):
    assert "ntp1.corp.exemple.fr" in host.file("/etc/chrony/sources.d/corp.sources").content_string or \
           "ntp1.corp.exemple.fr" in host.file("/etc/chrony.conf").content_string
```

Testinfra s'utilise aussi seul sur des serveurs réels : `pytest --hosts=ssh://admin@srv-web-01 tests/` ou `--hosts=ansible://web --ansible-inventory=inventaire`.

Suite : [[02-inspec-serverspec-kitchen|InSpec, Serverspec et Test Kitchen]] · [[90-aide-memoire|aide-mémoire]].
