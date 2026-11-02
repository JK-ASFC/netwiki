---
title: SoftEther, Pritunl et Mullvad — aide-mémoire des commandes
description: Commandes vpncmd de SoftEther (ServerPasswordSet, HubCreate, Hub, SecureNatEnable, BridgeCreate, UserCreate, UserPasswordSet, SessionList, IPsecEnable, OpenVpnMakeConfig, ConfigGet), Pritunl (setup-key, default-password, reset-password, logs) et CLI mullvad (account, relay, connect, status, lockdown-mode, dns, lan, split-tunnel) avec exemples.
tags: [aide-mémoire, softether, vpncmd, pritunl, mullvad]
icon: terminal
---

Explications : [[01-softether|SoftEther]] · [[02-pritunl|Pritunl]] · [[03-mullvad|Mullvad]].

## SoftEther (vpncmd)

```text
/opt/vpnserver/vpncmd localhost /SERVER /PASSWORD:MdpAdmin /CMD ServerStatusGet
/opt/vpnserver/vpncmd localhost /SERVER /PASSWORD:MdpAdmin /HUB:CORP /CMD SessionList
/opt/vpnserver/vpncmd localhost /SERVER /PASSWORD:MdpAdmin /HUB:CORP /CMD UserList
/opt/vpnserver/vpncmd localhost /SERVER /PASSWORD:MdpAdmin /CMD ConfigGet sauvegarde-softether.config
/opt/vpnserver/vpncmd localhost /SERVER /PASSWORD:MdpAdmin /CMD ListenerList
/opt/vpnserver/vpncmd /TOOLS /CMD check          # vérifier la compatibilité du système
```

## Pritunl

```bash
sudo pritunl setup-key
sudo pritunl default-password
sudo pritunl reset-password
sudo pritunl logs
sudo systemctl status pritunl mongod
```

## Mullvad

```bash
mullvad account get
mullvad relay list | head
mullvad relay set location fr par
mullvad connect ; mullvad status -v
mullvad lockdown-mode set on
mullvad split-tunnel add <pid>              # Linux : par processus
mullvad disconnect
```
