---
title: Puppet / OpenVox — aide-mémoire des commandes
description: Commandes Puppet avec exemples — agent (puppet agent -t, --noop, --tags, désactivation), certificats (puppetserver ca list/sign/clean/revoke), modules (puppet module install, r10k, Puppetfile), vérification (puppet parser validate, puppet-lint), facter, puppet resource, puppet apply en local, rapports, environnements, code type.
tags: [aide-mémoire, puppet, openvox, puppetserver, facter, r10k]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|Puppet]]. **OpenVox** (fork communautaire) utilise les mêmes commandes.

## Agent

```bash
sudo puppet agent -t                         # exécution immédiate (test)
sudo puppet agent -t --noop                  # simulation
sudo puppet agent -t --tags ntp,ssh
sudo puppet agent -t --environment preprod
sudo puppet agent --disable "Maintenance manuelle — amartin"
sudo puppet agent --enable
sudo puppet config print server certname environment runinterval
sudo puppet agent -t --debug 2>&1 | less
```

## Certificats (serveur)

```bash
sudo puppetserver ca list
sudo puppetserver ca list --all
sudo puppetserver ca sign --certname srv-web01.exemple.fr
sudo puppetserver ca revoke --certname ancien.exemple.fr
sudo puppetserver ca clean --certname srv-web01.exemple.fr       # réinstallation d'un nœud
# Côté agent après un clean : supprimer son SSL local
sudo rm -rf /etc/puppetlabs/puppet/ssl && sudo puppet agent -t
```

## Modules et code

```bash
sudo puppet module install puppetlabs-ntp --environment production
sudo puppet module list
r10k deploy environment -mv                   # déployer les environnements depuis Git (Puppetfile)
puppet parser validate manifests/site.pp
puppet-lint --fix modules/profil/manifests/
puppet apply --noop -e 'package { "htop": ensure => installed }'
puppet apply manifests/test.pp
puppet resource service sshd
puppet resource user amartin
facter os.release.full networking.ip
facter -p | grep -i role                       # faits personnalisés
```

```puppet
# modules/profil/manifests/base.pp
class profil::base {
  package { ['chrony', 'htop']: ensure => installed }
  service { 'chrony': ensure => running, enable => true, require => Package['chrony'] }
  file { '/etc/motd':
    ensure  => file,
    content => "Serveur géré par Puppet — ${facts['networking']['fqdn']}\n",
    mode    => '0644',
  }
}
```

## Journaux et rapports

```bash
sudo tail -f /var/log/puppetlabs/puppetserver/puppetserver.log
sudo journalctl -u puppet -f
ls /opt/puppetlabs/puppet/cache/state/last_run_summary.yaml && sudo cat /opt/puppetlabs/puppet/cache/state/last_run_summary.yaml
```
