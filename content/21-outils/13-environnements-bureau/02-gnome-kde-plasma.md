---
title: Administrer GNOME et KDE Plasma
description: Réglages et verrouillage des deux grands bureaux Linux pour un parc — GNOME (gsettings, dconf, profils et bases système, clés verrouillées, bannière et liste des utilisateurs de GDM, extensions gnome-extensions, bureau à distance RDP avec grdctl) et KDE Plasma 6 (kreadconfig6, kwriteconfig6, valeurs par défaut dans /etc/xdg, verrouillage [$i], Kiosk et restrictions d'actions, redémarrage de plasmashell, KRDP).
tags: [gnome, kde plasma, dconf, gsettings, kiosk, gdm, sddm, verrouillage, parc]
icon: settings
---

Sur un parc de postes Linux, l'administrateur impose quelques réglages : **verrouillage de l'écran**, bannière légale, applications favorites, désactivation de fonctions. GNOME et KDE Plasma ont chacun leur mécanisme.

## GNOME

### gsettings : réglages d'un utilisateur

```bash
gsettings list-recursively org.gnome.desktop.screensaver      # clés et valeurs
gsettings get org.gnome.desktop.session idle-delay
gsettings set org.gnome.desktop.session idle-delay 300        # écran éteint après 5 min
gsettings set org.gnome.desktop.screensaver lock-enabled true
gsettings set org.gnome.desktop.interface clock-show-seconds true
gsettings reset org.gnome.desktop.session idle-delay
dconf watch /                                                 # voir quelles clés changent quand on clique dans Paramètres
```

`dconf watch /` est le moyen le plus rapide de trouver la clé correspondant à une option de l'interface.

### dconf : réglages imposés à tous

1. Déclarer une base système dans le profil `user` :

```ini /etc/dconf/profile/user
user-db:user
system-db:local
```

2. Écrire les valeurs par défaut :

```ini /etc/dconf/db/local.d/00-securite
[org/gnome/desktop/session]
idle-delay=uint32 300

[org/gnome/desktop/screensaver]
lock-enabled=true
lock-delay=uint32 0

[org/gnome/desktop/lockdown]
disable-user-switching=true
```

3. Verrouiller les clés que l'utilisateur ne doit pas modifier :

```text /etc/dconf/db/local.d/locks/securite
/org/gnome/desktop/session/idle-delay
/org/gnome/desktop/screensaver/lock-enabled
/org/gnome/desktop/screensaver/lock-delay
```

4. Compiler la base (à refaire après chaque modification) :

```bash
sudo dconf update
```

Les nouvelles valeurs s'appliquent à la prochaine ouverture de session.

### Écran de connexion (GDM)

```ini /etc/dconf/profile/gdm
user-db:user
system-db:gdm
file-db:/usr/share/gdm/greeter-dconf-defaults
```

```ini /etc/dconf/db/gdm.d/01-connexion
[org/gnome/login-screen]
banner-message-enable=true
banner-message-text='Accès réservé aux personnes autorisées. Les connexions sont journalisées.'
disable-user-list=true
```

```bash
sudo dconf update && sudo systemctl restart gdm     # coupe les sessions ouvertes
```

### Extensions

```bash
gnome-extensions list --enabled
gnome-extensions info appindicatorsupport@rgcjonas.gmail.com
gnome-extensions enable  appindicatorsupport@rgcjonas.gmail.com
gnome-extensions disable appindicatorsupport@rgcjonas.gmail.com
```

Sur un parc, installer les extensions par paquets (par exemple `gnome-shell-extension-appindicator`) et les activer pour tous par la clé dconf `org/gnome/shell/enabled-extensions`. Les extensions peuvent casser à chaque nouvelle version de GNOME : les limiter au nécessaire.

### Bureau à distance (RDP)

```bash
grdctl status
grdctl rdp enable
grdctl rdp set-credentials alice 'Mot-De-Passe-RDP'
grdctl rdp disable-view-only           # autoriser le contrôle (et pas seulement l'affichage)
```

Ce partage concerne la session ouverte de l'utilisateur. Les versions récentes de GNOME proposent aussi une **connexion à distance** à l'écran de connexion (*Paramètres → Système → Bureau à distance → Connexion à distance*), utilisable sans session ouverte.

## KDE Plasma

### Fichiers de configuration

Plasma stocke ses réglages dans des fichiers texte `*rc` : `~/.config/` pour l'utilisateur, **`/etc/xdg/`** pour les valeurs par défaut de tous.

```bash
kreadconfig6 --file kscreenlockerrc --group Daemon --key Timeout
kwriteconfig6 --file kscreenlockerrc --group Daemon --key Timeout 5            # minutes avant verrouillage
kwriteconfig6 --file kscreenlockerrc --group Daemon --key Autolock true
kwriteconfig6 --file kdeglobals --group KDE --key SingleClick false
systemctl --user restart plasma-plasmashell     # relancer le panneau après certains changements
```

### Verrouiller un réglage : `[$i]`

Le marqueur `[$i]` (immuable) placé après un groupe ou une clé dans un fichier de `/etc/xdg` empêche l'utilisateur de le modifier :

```ini /etc/xdg/kscreenlockerrc
[Daemon][$i]
Autolock=true
LockOnResume=true
Timeout=5
```

### Kiosk : restreindre les actions

```ini /etc/xdg/kdeglobals
[KDE Action Restrictions][$i]
action/run_command=false
shell_access=false
action/lock_screen=true
action/logout=true
```

| Restriction | Effet |
| --- | --- |
| `shell_access=false` | Pas de terminal ni de commande shell depuis les applications KDE |
| `action/run_command=false` | Désactive le lanceur de commandes (KRunner) |
| `action/options_configure` | Accès aux boîtes de configuration des applications |
| `plasma/allow_configure_when_locked` | Modification du bureau et des panneaux verrouillés |

Pour verrouiller la disposition du bureau : clic droit sur le bureau → *Verrouiller les composants graphiques*, ou dans un script de mise en page Plasma déployé dans `/usr/share/plasma/layout-templates/`.

### Bureau à distance

Plasma 6 inclut **KRDP** (*Configuration du système → Bureau à distance*), un serveur RDP pour la session en cours. Pour des sessions indépendantes, utiliser xrdp.

Voir aussi : [[01-panorama-choix|choisir un bureau]] · [[03-xfce-mate-cinnamon-lxqt-cosmic|XFCE, MATE, Cinnamon, LXQt, COSMIC]]. Commandes : [[90-aide-memoire|aide-mémoire]].
