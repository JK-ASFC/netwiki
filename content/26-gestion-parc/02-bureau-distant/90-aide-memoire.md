---
title: Bureau distant — aide-mémoire
description: Commandes Apache Guacamole (initdb, Docker Compose), FreeRDP 3 (xfreerdp3 avec domaine, passerelle, lecteurs, RemoteApp), xrdp (installation, service, journaux), Remmina, TigerVNC (vncserver@:1, tunnel SSH, vncviewer, x0vncserver) et X2Go.
tags: [aide-mémoire, guacamole, freerdp, xrdp, remmina, tigervnc, x2go]
icon: terminal
---

Explications : [[01-apache-guacamole|Guacamole]] · [[02-rdp-freerdp-xrdp-remmina|FreeRDP, xrdp, Remmina]] · [[03-vnc-x2go|VNC et X2Go]].

```bash
docker run --rm guacamole/guacamole:1.6.0 /opt/guacamole/bin/initdb.sh --postgresql > init/initdb.sql ; docker compose up -d
xfreerdp3 /v:srv-app01 /u:jk /d:CORP /dynamic-resolution +clipboard /cert:tofu
xfreerdp3 /v:srv-app01 /u:jk /d:CORP /g:rdgw.corp.exemple.fr /drive:echange,/home/jk/echange
sudo apt install xrdp xorgxrdp && sudo adduser xrdp ssl-cert && sudo systemctl enable --now xrdp ; tail -f /var/log/xrdp-sesman.log
echo xfce4-session > ~/.xsession
remmina -c rdp://jk@srv-app01.corp.exemple.fr
vncpasswd ; echo ":1=jk" | sudo tee -a /etc/tigervnc/vncserver.users ; sudo systemctl enable --now vncserver@:1
ssh -L 5901:localhost:5901 jk@srv-linux01 ; vncviewer localhost:5901
x0vncserver -display :0 -rfbauth ~/.vnc/passwd
sudo apt install x2goserver x2goserver-xsession ; x2goclient
```
