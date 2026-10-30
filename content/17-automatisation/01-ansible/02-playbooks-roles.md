---
title: Playbooks, variables, modèles, rôles et coffre
description: Écrire des playbooks Ansible (tâches, boucles, conditions, gestionnaires, élévation de privilèges, mode vérification et différences), variables et priorité, faits, modèles Jinja2, rôles et structure de projet, collections et requirements.yml, secrets chiffrés avec ansible-vault, étiquettes et exécution ciblée.
tags: [ansible, playbook, rôles, jinja2, handlers, ansible-vault, collections, check mode]
icon: settings-2
---

## Playbook

```yaml playbooks/socle-linux.yml
- name: Socle des serveurs Linux
  hosts: linux
  become: true
  vars:
    serveurs_ntp: [ ntp1.corp.exemple.fr, ntp2.corp.exemple.fr ]
  tasks:
    - name: Paquets de base
      ansible.builtin.package:
        name: [ chrony, vim, curl, rsyslog ]
        state: present

    - name: Configuration de chrony
      ansible.builtin.template:
        src: chrony.conf.j2
        dest: /etc/chrony/chrony.conf
        owner: root
        mode: "0644"
        backup: true
      notify: Redémarrer chrony

    - name: Utilisateurs d'administration
      ansible.builtin.user:
        name: "{{ item.nom }}"
        groups: sudo
        append: true
        shell: /bin/bash
      loop: "{{ administrateurs }}"

    - name: Clés SSH autorisées
      ansible.posix.authorized_key:
        user: "{{ item.nom }}"
        key: "{{ item.cle }}"
      loop: "{{ administrateurs }}"

    - name: Mise à jour de sécurité (Debian seulement)
      ansible.builtin.apt:
        upgrade: safe
        update_cache: true
      when: ansible_facts['os_family'] == "Debian"
      tags: [ maj ]

  handlers:
    - name: Redémarrer chrony
      ansible.builtin.service:
        name: chrony
        state: restarted
```

```bash
ansible-playbook playbooks/socle-linux.yml --check --diff         # simulation avec différences
ansible-playbook playbooks/socle-linux.yml --limit web --tags maj
ansible-playbook playbooks/socle-linux.yml -l srv-web-01.corp.exemple.fr --step
ansible-playbook playbooks/socle-linux.yml --syntax-check
```

| Élément | Rôle |
| --- | --- |
| `become` | Élévation (sudo) |
| `loop` | Boucle |
| `when` | Condition |
| `notify` / `handlers` | Action déclenchée une fois en fin de jeu si une tâche a changé quelque chose |
| `register` + `changed_when` / `failed_when` | Capturer un résultat, définir le changement/l'échec |
| `block` / `rescue` / `always` | Gestion d'erreurs |
| `serial` | Déploiement par lots (ex. 25 % des serveurs à la fois) |

## Variables

Emplacements (du moins au plus prioritaire, simplifié) : valeurs par défaut des rôles → `group_vars/all` → `group_vars/<groupe>` → `host_vars/<hôte>` → variables du playbook → `-e` en ligne de commande.

```yaml inventaires/production/group_vars/linux.yml
administrateurs:
  - { nom: alice, cle: "ssh-ed25519 AAAA… alice" }
  - { nom: bob,   cle: "ssh-ed25519 AAAA… bob" }
```

Les **faits** (`ansible_facts`) sont collectés au début de chaque jeu (`gather_facts: false` pour l'éviter).

## Modèles Jinja2

```jinja templates/chrony.conf.j2
# Géré par Ansible — ne pas modifier à la main
{% for serveur in serveurs_ntp %}
server {{ serveur }} iburst
{% endfor %}
driftfile /var/lib/chrony/chrony.drift
makestep 1.0 3
rtcsync
{% if inventory_hostname in groups['ntp_serveurs'] | default([]) %}
allow 10.0.0.0/8
{% endif %}
```

## Rôles

```text Structure d'un projet
automatisation/
├── ansible.cfg
├── requirements.yml
├── inventaires/production/{hosts.yml, group_vars/, host_vars/}
├── playbooks/{socle-linux.yml, reseau.yml, windows.yml}
└── roles/
    └── chrony/
        ├── defaults/main.yml      # variables par défaut (surchargeables)
        ├── tasks/main.yml
        ├── handlers/main.yml
        ├── templates/chrony.conf.j2
        └── meta/main.yml
```

```bash
ansible-galaxy role init roles/chrony
```

```yaml playbooks/socle-linux.yml (avec rôles)
- hosts: linux
  become: true
  roles:
    - chrony
    - { role: durcissement_ssh, tags: [ ssh ] }
```

## Collections

```yaml requirements.yml
collections:
  - name: ansible.posix
  - name: community.general
  - name: ansible.windows
  - name: cisco.ios
  - name: netbox.netbox
  - name: community.hashi_vault
roles:
  - name: geerlingguy.docker
```

```bash
ansible-galaxy install -r requirements.yml
ansible-galaxy collection list
```

## Secrets : ansible-vault

```bash
ansible-vault create inventaires/production/group_vars/ios/vault.yml
ansible-vault edit inventaires/production/group_vars/ios/vault.yml
ansible-vault encrypt_string 'MotDePasseEnable' --name vault_ios_password
ansible-playbook playbooks/reseau.yml --vault-id prod@prompt
```

Convention : variables chiffrées préfixées `vault_` dans `vault.yml`, référencées par des variables lisibles (`ansible_password: "{{ vault_ios_password }}"`). Pour des secrets centralisés et tracés, utilisez [[07-vault/02-secrets-authentification|HashiCorp Vault]] (collection `community.hashi_vault`).
