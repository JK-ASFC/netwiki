---
title: Chef Infra
description: Chef Infra (Progress, Apache 2.0 pour le code ; binaires sous licence commerciale) et Cinc (distribution libre communautaire) — gestion de configuration en Ruby : architecture (Chef Infra Server, clients chef-client, poste de travail Chef Workstation/knife), cookbooks, recettes et ressources (package, service, template, file, user, windows_feature), attributs, rôles et environnements, Policyfiles, Supermarket, mode local (chef-client -z, chef-solo), Test Kitchen et InSpec, licences et alternatives (Cinc, Ansible, Puppet).
tags: [chef, cinc, gestion de configuration, ruby, cookbooks, knife]
icon: info
---

**Chef Infra** décrit l'état des serveurs en **Ruby** (recettes regroupées en **cookbooks**) ; l'agent `chef-client` converge régulièrement chaque machine vers cet état. Il est encore très présent dans de grandes entreprises. Depuis 2019, les **binaires** de Chef nécessitent une licence commerciale pour un usage en production ; **Cinc** (« Cinc Is Not Chef ») fournit des binaires libres construits à partir du même code.

## Installation (Cinc)

```bash
curl -L https://omnitruck.cinc.sh/install.sh | sudo bash                       # client cinc-client (Linux)
curl -L https://omnitruck.cinc.sh/install.sh | sudo bash -s -- -P cinc-workstation   # poste d'administration (knife, cookstyle, Test Kitchen)
```

Windows : MSI du client ; macOS : paquet. Serveur : **Cinc Server** (ou Chef Infra Server sous licence).

## Recette

```ruby
# cookbooks/base_web/recipes/default.rb
package %w(nginx chrony)

service 'chrony' do
  action [:enable, :start]
end

template '/etc/nginx/sites-available/intranet' do
  source 'intranet.erb'
  variables(serveur: node['base_web']['nom'], amont: node['base_web']['amont'])
  notifies :reload, 'service[nginx]'
end

service 'nginx' do
  action [:enable, :start]
end
```

```bash
cinc-client -z -o 'recipe[base_web]'                 # mode local (sans serveur), pour tester
knife bootstrap srv-web-01.corp.exemple.fr -U admin --sudo -N srv-web-01 -r 'role[web]'   # enrôler un nœud auprès du serveur
knife node list ; knife cookbook upload base_web ; knife ssh 'role:web' 'sudo cinc-client'
kitchen test                                         # tester le cookbook dans des VM ou conteneurs
```

Pour un nouveau projet, [[01-ansible/01-presentation-installation|Ansible]] (sans agent) ou [[02-puppet/01-presentation-installation|Puppet]] sont plus courants ; Chef/Cinc reste pertinent pour maintenir un existant.

Suite : [[02-cfengine|CFEngine]] · [[90-aide-memoire|aide-mémoire]].
