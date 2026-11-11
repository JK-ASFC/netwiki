---
title: Suites d'auto-hébergement — aide-mémoire
description: Installation de HomelabOS (make config/install), Ansible-NAS (playbook), Sandstorm (script) et FreedomBox (paquet Debian, interface Plinth).
tags: [aide-mémoire, homelabos, ansible-nas, sandstorm, freedombox, auto-hébergement]
icon: terminal
---

Explications : [[01-homelabos-sandstorm|HomelabOS, Ansible-NAS, Sandstorm et FreedomBox]].

```bash
# HomelabOS
git clone https://gitlab.com/NickBusey/HomelabOS.git && cd HomelabOS
make config ; make install

# Ansible-NAS
git clone https://github.com/davestephens/ansible-nas && cd ansible-nas
cp group_vars/all.yml.dist group_vars/all.yml
ansible-playbook -i inventory nas.yml

# Sandstorm
curl https://install.sandstorm.io | bash
sudo sandstorm status ; sudo sandstorm update

# FreedomBox
sudo apt install freedombox          # ou image dédiée pour carte ARM
# Interface Plinth : https://IP/
```

| Projet | Mécanisme | État à vérifier |
| --- | --- | --- |
| HomelabOS | Ansible | activité faible |
| Ansible-NAS | Ansible | actif |
| Sandstorm | grains isolés | peu maintenu |
| FreedomBox | Debian + Plinth | actif (Debian) |
