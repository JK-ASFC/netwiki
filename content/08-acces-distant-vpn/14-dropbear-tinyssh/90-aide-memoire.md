---
title: Dropbear et TinySSH — aide-mémoire
description: Commandes de Dropbear (dropbearkey, dropbearconvert, options du serveur, UCI OpenWrt, dropbear-initramfs) et de TinySSH (tinysshd-makekey, printkey, socket systemd).
tags: [aide-mémoire, dropbear, tinyssh, ssh, openwrt, initramfs]
icon: terminal
---

Explications : [[01-dropbear-tinyssh|Dropbear et TinySSH]].

```bash
# Dropbear
dropbearkey -t ed25519 -f /etc/dropbear/dropbear_ed25519_host_key
dropbearkey -y -f /etc/dropbear/dropbear_ed25519_host_key
dropbear -F -E -p 2222 -s -g -w
dropbearconvert openssh dropbear ~/.ssh/id_ed25519 ~/.ssh/id_dropbear
dbclient -i ~/.ssh/id_dropbear utilisateur@hote

# OpenWrt
uci set dropbear.@dropbear[0].PasswordAuth='off' ; uci commit dropbear ; /etc/init.d/dropbear restart

# Déverrouillage LUKS à distance
sudo apt install dropbear-initramfs
sudoedit /etc/dropbear/initramfs/authorized_keys /etc/dropbear/initramfs/dropbear.conf
sudo update-initramfs -u
ssh -p 2222 root@serveur              # puis la phrase de passe (cryptroot-unlock)

# TinySSH
sudo apt install tinysshd
sudo tinysshd-makekey /etc/tinyssh/sshkeydir ; tinysshd-printkey /etc/tinyssh/sshkeydir
sudo systemctl status tinysshd.socket
ssh -o HostKeyAlgorithms=ssh-ed25519 utilisateur@hote
```
