---
title: Aide-mémoire partage entre appareils
description: Commandes prêtes à copier pour KDE Connect, Barrier, Input Leap et LocalSend — installation, pare-feu, kdeconnect-cli, chargement de configuration.
tags: [kde connect, barrier, input leap, localsend, aide-mémoire]
icon: terminal
---

## KDE Connect

```bash
kdeconnect-cli --list-devices
kdeconnect-cli --device ID_APPAREIL --share /home/alice/rapport.pdf
sudo firewall-cmd --permanent --zone=home --add-service=kdeconnect
```

## Barrier et Input Leap

```bash
barriers --config /home/alice/barrier.conf
sudo firewall-cmd --permanent --add-port=24800/tcp
sudo ufw allow from 10.0.1.0/24 to any port 24800 proto tcp
```

## LocalSend

```powershell
winget install LocalSend.LocalSend
```

```bash
brew install --cask localsend
flatpak install flathub org.localsend.localsend_app
sudo ufw allow 53317
```
