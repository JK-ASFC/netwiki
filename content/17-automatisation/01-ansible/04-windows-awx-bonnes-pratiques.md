---
title: Windows, AWX, tests et bonnes pratiques
description: Gérer Windows avec Ansible (WinRM HTTPS avec Kerberos ou NTLM, ou OpenSSH ; modules ansible.windows et community.windows ; fonctionnalités, mises à jour, registre, domaine), orchestrer avec AWX / Ansible Automation Platform ou Semaphore, tester (ansible-lint, Molecule, CI), structurer et sécuriser un projet, et résoudre les erreurs fréquentes.
tags: [ansible, windows, winrm, awx, semaphore, ansible-lint, molecule, dépannage]
icon: bug
---

## Windows

### Connexion

| Méthode | Configuration |
| --- | --- |
| **WinRM HTTPS + Kerberos** (domaine) | `ansible_connection: winrm`, `ansible_port: 5986`, `ansible_winrm_transport: kerberos` ; paquets `pywinrm[kerberos]`, `krb5` sur le nœud de contrôle |
| WinRM HTTPS + NTLM | `ansible_winrm_transport: ntlm` (hors domaine) |
| **OpenSSH** (Windows Server 2019+) | `ansible_connection: ssh`, `ansible_shell_type: powershell` |

```yaml group_vars/windows.yml
ansible_connection: winrm
ansible_port: 5986
ansible_winrm_transport: kerberos
ansible_winrm_server_cert_validation: validate
ansible_user: svc_ansible@CORP.EXEMPLE.FR
ansible_password: "{{ vault_svc_ansible_password }}"
```

Configurer WinRM HTTPS (certificat de la machine délivré par AD CS) : voir [[09-winrm/01-presentation-configuration|WinRM]].

### Tâches courantes

```yaml playbooks/windows.yml
- name: Socle des serveurs Windows
  hosts: windows
  tasks:
    - name: Fonctionnalités
      ansible.windows.win_feature:
        name: [ SNMP-Service, Telnet-Client ]
        state: absent

    - name: Service de temps
      ansible.windows.win_service:
        name: W32Time
        start_mode: auto
        state: started

    - name: Désactiver SMBv1
      ansible.windows.win_regedit:
        path: HKLM:\SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters
        name: SMB1
        data: 0
        type: dword

    - name: Mises à jour de sécurité
      ansible.windows.win_updates:
        category_names: [ SecurityUpdates, CriticalUpdates ]
        reboot: true
      tags: [ maj ]

    - name: Commande PowerShell (idempotence gérée à la main)
      ansible.windows.win_powershell:
        script: |
          if (-not (Get-DnsServerForwarder).IPAddress) { Set-DnsServerForwarder -IPAddress 10.0.10.53; $Ansible.Changed = $true }
          else { $Ansible.Changed = $false }
```

## AWX, Automation Platform, Semaphore

| Outil | Rôle |
| --- | --- |
| **AWX** (libre) / **Ansible Automation Platform** (Red Hat) | Interface web et API : projets Git, inventaires, identifiants chiffrés, modèles de tâches, planification, approbations, RBAC, journal |
| **Semaphore UI** | Alternative légère (un binaire ou conteneur) |
| Exécution depuis la CI (GitLab, Jenkins) | Lint et `--check` sur les demandes de fusion, déploiement sur la branche principale |

AWX se déploie sur Kubernetes avec l'**AWX Operator**. Les utilisateurs lancent des modèles validés **sans** détenir les identifiants des équipements.

## Tests et qualité

```bash
pipx install ansible-lint
ansible-lint playbooks/ roles/
ansible-playbook playbooks/socle-linux.yml --check --diff -l preprod
# Molecule : tests de rôles dans des conteneurs ou VM jetables
pipx install molecule && molecule test
```

## Bonnes pratiques

- [ ] Tout dans **Git** ; demandes de fusion avec `ansible-lint` et `--check --diff` en CI
- [ ] Noms de modules **complets** (`ansible.builtin.copy`), collections figées dans `requirements.yml`
- [ ] Secrets dans `ansible-vault` ou Vault, jamais en clair
- [ ] Compte de service dédié, clé SSH dédiée, `sudo` limité si possible
- [ ] Inventaire généré depuis la source de vérité (NetBox, CMDB)
- [ ] Rôles idempotents : rejouer ne change rien
- [ ] Déploiements par lots (`serial`) et vérifications automatiques

## Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `UNREACHABLE … Permission denied (publickey)` | Clé SSH, utilisateur | `remote_user`, clé dans `authorized_keys`, `ssh -v` |
| `Missing sudo password` | `become` sans mot de passe | `--ask-become-pass` ou sudo sans mot de passe pour le compte de service |
| `couldn't resolve module/action 'cisco.ios.ios_config'` | Collection non installée | `ansible-galaxy collection install cisco.ios` |
| `ssh connection failed: … no matching key exchange` (réseau) | Algorithmes anciens de l'équipement | Mettre à jour l'équipement ; à défaut `ansible_libssh_*`/paramiko avec options adaptées |
| `kerberos: the specified credentials were rejected by the server` (Windows) | Nom d'hôte (SPN), heure, utilisateur en majuscules pour le royaume | FQDN, `kinit` test, `ansible_user` au format `utilisateur@ROYAUME` |
| `winrm … certificate verify failed` | AC interne non approuvée | `ansible_winrm_ca_trust_path` |
| Tâche toujours « changed » | Module `shell`/`command` sans condition | `creates`/`removes`, `changed_when`, ou module dédié |
| `The task includes an option with an undefined variable` | Variable absente pour ce groupe | `default()`, emplacement de la variable |
