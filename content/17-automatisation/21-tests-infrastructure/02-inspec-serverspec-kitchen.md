---
title: InSpec, Serverspec et Test Kitchen
description: Tests d'infrastructure et de conformité en Ruby — InSpec (Progress/Chef : langage de contrôles de conformité, profils CIS et DevSec, ressources système, cloud et bases ; licence des binaires et alternative libre cinc-auditor), Serverspec (RSpec : tests de l'état des serveurs par SSH ou WinRM, maintenance réduite) et Test Kitchen (orchestration de tests sur plates-formes multiples avec pilotes Vagrant, Docker, cloud et vérificateurs InSpec, utilisé avec Chef et Ansible via kitchen-ansible), installation et exemples.
tags: [inspec, cinc-auditor, serverspec, test kitchen, conformité, tests, ruby]
icon: info
---

| Outil | Rôle | Remarques |
| --- | --- | --- |
| **InSpec** | Contrôles de **conformité** lisibles (« le serveur doit… »), profils CIS et DevSec prêts | Binaires sous licence Progress ; **cinc-auditor** = version libre |
| **Serverspec** | Tests d'état des serveurs (RSpec) | Ancêtre d'InSpec, peu évolutif aujourd'hui |
| **Test Kitchen** | Crée des machines de test, applique la configuration, lance les vérifications | Chef, Ansible (kitchen-ansible), Puppet |

## InSpec / cinc-auditor

```bash
curl -L https://omnitruck.cinc.sh/install.sh | sudo bash -s -- -P cinc-auditor       # Linux ; Windows : MSI ; macOS : paquet
```

```ruby
# controles/ssh.rb
control 'corp-ssh-01' do
  impact 1.0
  title 'SSH : pas de connexion root ni par mot de passe'
  describe sshd_config do
    its('PermitRootLogin') { should eq 'no' }
    its('PasswordAuthentication') { should eq 'no' }
  end
end

control 'corp-ntp-01' do
  impact 0.7
  title 'Synchronisation horaire active'
  describe service('chronyd') do
    it { should be_enabled }
    it { should be_running }
  end
end
```

```bash
cinc-auditor exec controles/ -t ssh://admin@srv-web-01 -i ~/.ssh/id_admin --reporter cli html:rapport.html
cinc-auditor exec https://github.com/dev-sec/linux-baseline -t ssh://admin@srv-web-01     # profil communautaire DevSec
cinc-auditor exec controles/ -t winrm://Administrateur@srv-win-01 --password "$MDP"
```

## Serverspec

```ruby
# spec/srv-web-01/web_spec.rb
describe port(443) do
  it { should be_listening }
end
describe package('nginx') do
  it { should be_installed }
end
```

```bash
gem install serverspec && serverspec-init && rake spec
```

## Test Kitchen (avec Ansible)

```yaml
# kitchen.yml
driver: { name: vagrant }
provisioner: { name: ansible_playbook, playbook: site.yml, hosts: all }
verifier: { name: inspec }
platforms: [{ name: debian-12 }, { name: rockylinux-9 }]
suites: [{ name: defaut }]
```

```bash
kitchen list ; kitchen test ; kitchen converge ; kitchen verify ; kitchen destroy
```

Pour Ansible, [[01-molecule-testinfra|Molecule]] est aujourd'hui plus répandu que Test Kitchen. Commandes : [[90-aide-memoire|aide-mémoire]].
