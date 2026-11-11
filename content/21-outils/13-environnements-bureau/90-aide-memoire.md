---
title: Environnements de bureau — aide-mémoire
description: Commandes d'installation des bureaux (tasksel, variantes Ubuntu, groupes Fedora, patterns openSUSE), gestionnaires de connexion, type de session, gsettings et dconf (GNOME, MATE, Cinnamon), gnome-extensions, grdctl, kreadconfig6 et kwriteconfig6 (KDE Plasma), xfconf-query (XFCE), LXQt et COSMIC.
tags: [aide-mémoire, gnome, kde plasma, xfce, mate, cinnamon, lxqt, cosmic, dconf, gsettings]
icon: terminal
---

Explications : [[01-panorama-choix|choisir un bureau]] · [[02-gnome-kde-plasma|GNOME et KDE Plasma]] · [[03-xfce-mate-cinnamon-lxqt-cosmic|XFCE, MATE, Cinnamon, LXQt, COSMIC]].

## Installer et démarrer

```bash
sudo apt install task-kde-desktop            # Debian (task-gnome-desktop, task-xfce-desktop…)
sudo apt install kubuntu-desktop             # Ubuntu (xubuntu-desktop, ubuntu-mate-desktop, lubuntu-desktop…)
sudo dnf install @kde-desktop-environment    # Fedora (@xfce-, @mate-, @cinnamon-, @lxqt-, @cosmic-desktop-environment)
sudo zypper install -t pattern kde_plasma    # openSUSE
sudo systemctl set-default graphical.target
sudo dpkg-reconfigure gdm3                   # choisir GDM, SDDM ou LightDM
echo $XDG_SESSION_TYPE                       # wayland ou x11
```

## GNOME, MATE, Cinnamon

```bash
gsettings get|set|reset org.gnome.desktop.session idle-delay 300
gsettings list-recursively org.gnome.desktop.screensaver
dconf watch /                                # trouver la clé d'un réglage
sudo dconf update                            # après modification de /etc/dconf/db/*.d/
gnome-extensions list --enabled ; gnome-extensions enable <uuid>
grdctl status ; grdctl rdp enable ; grdctl rdp set-credentials alice 'mdp'
gsettings set org.mate.screensaver lock-enabled true
gsettings set org.cinnamon.desktop.screensaver lock-enabled true
```

## KDE Plasma

```bash
kreadconfig6 --file kscreenlockerrc --group Daemon --key Timeout
kwriteconfig6 --file kscreenlockerrc --group Daemon --key Timeout 5
systemctl --user restart plasma-plasmashell
# Valeurs imposées : /etc/xdg/<fichier>rc avec [Groupe][$i]
```

## XFCE, LXQt, COSMIC

```bash
xfconf-query -l ; xfconf-query -c xfce4-power-manager -l -v
xfconf-query -c xsettings -p /Net/ThemeName -s "Adwaita-dark"
xfce4-panel --restart
# Kiosk XFCE : /etc/xdg/xfce4/kiosk/kioskrc ; modèles : /etc/xdg/xfce4/xfconf/xfce-perchannel-xml/
lxqt-config ; lxqt-config-session
ls ~/.config/cosmic/                         # configuration COSMIC (RON)
```
