---
title: Ansible — aide-mémoire des commandes
description: Commandes Ansible avec exemples — inventaires (ansible-inventory --graph, --list, host_vars), commandes ad hoc (ping, setup, shell, apt, service, copy), playbooks (--check, --diff, --limit, --tags, --start-at-task, -e, verbosité), ansible-vault (create, edit, encrypt_string, rekey), ansible-galaxy (rôles, collections, requirements), ansible-doc, ansible-lint, configuration (ansible-config dump), modules réseau (cisco.ios, arista.eos, junipernetworks.junos, fortinet), Windows (WinRM, win_*).
tags: [aide-mémoire, ansible, playbook, ansible-vault, ansible-galaxy, automatisation]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Ansible]].

## Inventaire et configuration

```bash
ansible-inventory -i inventaire/prod --graph
ansible-inventory -i inventaire/prod --list | jq '._meta.hostvars["sw-paris-01"]'
ansible-inventory -i inventaire/prod --host srv-web01
ansible-config dump --only-changed
ansible --version
```

## Commandes ad hoc

```bash
ansible all -i inventaire/prod -m ping
ansible linux -m setup -a "filter=ansible_distribution*"
ansible web -m shell -a "uptime" -o
ansible web -b -m apt -a "name=nginx state=latest update_cache=true"
ansible web -b -m service -a "name=nginx state=restarted"
ansible web -b -m copy -a "src=./motd dest=/etc/motd mode=0644"
ansible web -m command -a "df -h /" --limit srv-web01
ansible all -m ping -f 50                       # 50 hôtes en parallèle
```

## Playbooks

```bash
ansible-playbook -i inventaire/prod site.yml
ansible-playbook site.yml --syntax-check
ansible-playbook site.yml --check --diff         # simulation avec différences
ansible-playbook site.yml --limit "web:&paris"   # intersection de groupes
ansible-playbook site.yml --tags ntp,ssh
ansible-playbook site.yml --skip-tags lent
ansible-playbook site.yml --start-at-task "Déployer la configuration"
ansible-playbook site.yml --list-hosts --list-tasks
ansible-playbook site.yml -e "version=2.3.1" -e @vars/prod.yml
ansible-playbook site.yml -vvv                   # verbosité
ansible-playbook site.yml --ask-vault-pass
ansible-playbook site.yml --vault-password-file ~/.vault_pass
```

## Vault

```bash
ansible-vault create group_vars/all/vault.yml
ansible-vault edit group_vars/all/vault.yml
ansible-vault view group_vars/all/vault.yml
ansible-vault encrypt secrets.yml
ansible-vault decrypt secrets.yml
ansible-vault rekey group_vars/all/vault.yml
ansible-vault encrypt_string 'MotDePasseSNMP' --name 'snmp_auth_password'
```

## Galaxy, documentation, qualité

```bash
ansible-galaxy collection install cisco.ios arista.eos junipernetworks.junos fortinet.fortios community.general
ansible-galaxy collection list
ansible-galaxy install -r requirements.yml
ansible-galaxy role init roles/ntp
ansible-doc cisco.ios.ios_vlans
ansible-doc -l | grep -i fortios | head
ansible-doc -s ansible.builtin.template
ansible-lint playbooks/
```

## Réseau : exemple

```yaml
# inventaire/prod/group_vars/cisco.yml
ansible_connection: ansible.netcommon.network_cli
ansible_network_os: cisco.ios.ios
ansible_user: ansible
ansible_password: "{{ vault_cisco_password }}"
```

```yaml
- name: Sauvegarde et VLAN sur les commutateurs Cisco
  hosts: cisco
  gather_facts: false
  tasks:
    - name: Sauvegarder la configuration
      cisco.ios.ios_config:
        backup: true
        backup_options:
          dir_path: ./sauvegardes
    - name: Déclarer les VLAN
      cisco.ios.ios_vlans:
        config:
          - { vlan_id: 20, name: UTILISATEURS }
          - { vlan_id: 40, name: VOIX }
        state: merged
```

```bash
ansible cisco -m cisco.ios.ios_command -a "commands='show version'"
ansible-playbook vlans.yml --check --diff
```

## Windows

```yaml
# group_vars/windows.yml
ansible_connection: winrm
ansible_winrm_transport: kerberos
ansible_port: 5986
```

```bash
ansible windows -m ansible.windows.win_ping
ansible windows -m ansible.windows.win_service -a "name=W32Time state=restarted"
ansible windows -m ansible.windows.win_updates -a "category_names=SecurityUpdates reboot=true"
```
