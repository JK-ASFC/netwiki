---
title: Ubiquiti UniFi et EdgeRouter — aide-mémoire des commandes
description: Commandes Ubiquiti avec exemples — équipements UniFi en SSH (info, set-inform, réinitialisation, journaux), console UniFi OS et application Network (sauvegardes), EdgeOS (mode configuration, set/delete/commit/save/compare, interfaces, routes, NAT, pare-feu, sauvegarde, mise à jour), UISP.
tags: [aide-mémoire, ubiquiti, unifi, edgerouter, edgeos, set-inform]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-unifi|UniFi]] et [[02-edgerouter-uisp|EdgeRouter et UISP]].

## Équipement UniFi (SSH)

```bash
ssh admin@10.0.99.41
info                                             # modèle, version, état, adresse d'inform
set-inform http://unifi.exemple.fr:8080/inform  # adoption par un contrôleur distant
syswrapper.sh restore-default                    # réinitialisation usine
tail -f /var/log/messages
```

## Console UniFi OS

```bash
# Sauvegardes automatiques de l'application Network (sur la console)
ls /data/unifi/data/backup/autobackup/ 2>/dev/null || ls /usr/lib/unifi/data/backup/autobackup/
unifi-os restart                                 # selon modèle de console
```

## EdgeRouter (EdgeOS)

```edgeos
show version
show interfaces
show ip route
show nat translations
show firewall statistics
show dhcp leases
configure
set interfaces ethernet eth1 vif 20 address 10.0.20.1/24
set service nat rule 5000 outbound-interface eth0
set service nat rule 5000 type masquerade
compare
commit
save
exit
show configuration commands | grep nat
```

```bash
# Sauvegarde et mise à jour (mode opérationnel)
scp admin@10.0.99.1:/config/config.boot ./edgerouter-config.boot
add system image /tmp/edgeos-micrologiciel.tar        # fichier téléchargé depuis le site Ubiquiti
show system image
```
