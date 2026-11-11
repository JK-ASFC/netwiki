---
title: XFCE, MATE, Cinnamon, LXQt et COSMIC
description: Les bureaux légers ou alternatifs — XFCE (xfconf-query, valeurs par défaut système, mode Kiosk, xrdp), MATE (héritier de GNOME 2, gsettings org.mate et verrouillage dconf), Cinnamon (Linux Mint, gsettings org.cinnamon, redémarrage), LXQt (Qt, sessions X11 ou Wayland avec labwc, KWin ou Wayfire) et COSMIC (System76, Rust, Wayland, pavage automatique, configuration).
tags: [xfce, mate, cinnamon, lxqt, cosmic, bureau léger, xfconf, kiosk, wayland]
icon: monitor
---

Ces bureaux conviennent aux **machines modestes**, aux **VM** et aux **serveurs de bureau à distance** (xrdp, X2Go), ou à ceux qui préfèrent une disposition classique. COSMIC est à part : moderne, Wayland uniquement, avec pavage des fenêtres.

## XFCE

Léger, modulaire, en GTK 3. Session X11 (la prise en charge de Wayland progresse version après version).

### xfconf-query

Les réglages sont rangés par **canaux** (`xfce4-panel`, `xfce4-session`, `xfce4-power-manager`, `xsettings`…) :

```bash
xfconf-query -l                                           # liste des canaux
xfconf-query -c xfce4-power-manager -l -v                 # propriétés d'un canal et leurs valeurs
xfconf-query -c xfce4-power-manager -p /xfce4-power-manager/blank-on-ac -s 10
xfconf-query -c xsettings -p /Net/ThemeName -s "Adwaita-dark"
xfce4-panel --restart
```

### Valeurs par défaut pour tous

Copier les fichiers XML d'un poste de référence (`~/.config/xfce4/xfconf/xfce-perchannel-xml/*.xml`) dans **`/etc/xdg/xfce4/xfconf/xfce-perchannel-xml/`** : ils servent de modèle aux nouveaux comptes.

### Mode Kiosk

```ini /etc/xdg/xfce4/kiosk/kioskrc
[xfce4-session]
CustomizeSplash=NONE
CustomizeChooser=NONE
Shutdown=%admin             ; seul le groupe admin peut éteindre

[xfce4-panel]
CustomizePanel=NONE         ; personne ne modifie le panneau
```

`ALL` autorise tout le monde, `NONE` personne, `%groupe` un groupe, `utilisateur` un compte.

### XFCE et xrdp

XFCE est le choix le plus courant pour un serveur xrdp :

```bash
sudo apt install xfce4 xrdp
echo xfce4-session > ~/.xsession          # pour chaque utilisateur (ou /etc/xrdp/startwm.sh)
sudo systemctl enable --now xrdp
```

## MATE

Continuation de GNOME 2 en GTK 3, très stable, session X11. Les réglages passent par **gsettings** avec le préfixe `org.mate` :

```bash
gsettings set org.mate.session idle-delay 5                  # minutes
gsettings set org.mate.screensaver lock-enabled true
gsettings list-recursively org.mate.panel | head
mate-panel --replace &                                       # relancer le panneau
```

Les réglages imposés et les verrous se font avec **dconf**, exactement comme pour GNOME (voir [[02-gnome-kde-plasma|GNOME]]), avec des chemins `/org/mate/…`.

## Cinnamon

Le bureau de **Linux Mint**, en GTK, disposition proche de Windows (menu, barre des tâches). Session X11 ; une session Wayland expérimentale existe.

```bash
gsettings set org.cinnamon.desktop.screensaver lock-enabled true
gsettings set org.cinnamon.desktop.session idle-delay 300
gsettings list-recursively org.cinnamon | grep -i panel | head
cinnamon --replace &                    # redémarrer Cinnamon (ou Ctrl+Alt+Échap)
```

Les **applets**, **desklets** et **extensions** s'installent depuis les Paramètres système ; Linux Mint fournit aussi ses outils (Timeshift, gestionnaire de mises à jour, pilotes).

## LXQt

Le plus léger des bureaux complets, en **Qt 6**. Il fonctionne en X11 avec Openbox ou en **Wayland** avec un compositeur au choix : **labwc** (recommandé), KWin, Wayfire, Hyprland, niri…

```bash
sudo apt install lxqt                    # Debian (task-lxqt-desktop), Lubuntu
lxqt-config                              # centre de configuration
lxqt-config-session                      # applications au démarrage, compositeur Wayland
```

Configuration dans `~/.config/lxqt/*.conf`, valeurs par défaut système dans `/etc/xdg/lxqt/`.

## COSMIC

Bureau développé par **System76** (Pop!_OS), écrit en **Rust**, **Wayland uniquement**. Première version stable publiée avec Pop!_OS 24.04.

| Particularité | Détail |
| --- | --- |
| Pavage automatique | Les fenêtres se placent côte à côte ; activable par espace de travail (`Super`+`Y`) |
| Espaces de travail | Par écran ou communs, horizontaux ou verticaux |
| Applications | Fichiers, Terminal, Éditeur, Magasin, Paramètres propres à COSMIC |
| Configuration | `~/.config/cosmic/` : un fichier par clé, au format RON, versionnable |

```bash
# Pop!_OS : installé par défaut ; Fedora : spin COSMIC ou groupe d'environnement
sudo dnf install @cosmic-desktop-environment
# Arch Linux
sudo pacman -S cosmic
```

> [!NOTE]
> COSMIC étant jeune, vérifiez la compatibilité des outils de bureau à distance, de partage clavier/souris et d'accessibilité dont vous avez besoin avant de le déployer sur un parc.

Voir aussi : [[01-panorama-choix|choisir un bureau]] · [[02-gnome-kde-plasma|GNOME et KDE Plasma]]. Commandes : [[90-aide-memoire|aide-mémoire]].
