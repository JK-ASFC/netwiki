---
title: Xfce Terminal et terminaux des bureaux
description: Xfce Terminal (VTE, GTK) pour l'administrateur — onglets, mode déroulant (drop-down), lancement en ligne de commande avec onglets, titres et commandes, préférences et raccourcis, enregistrement de la configuration — et comparaison avec les terminaux intégrés aux autres bureaux (GNOME Terminal, Ptyxis, Konsole, Terminator, Windows Terminal).
tags: [xfce terminal, xfce4-terminal, vte, gnome terminal, ptyxis, konsole, terminator, terminal]
icon: square-terminal
---

**Xfce Terminal** (`xfce4-terminal`) est le terminal du bureau XFCE. Basé sur la bibliothèque **VTE** (comme GNOME Terminal), il est léger, gère les onglets et propose un pratique **mode déroulant** qui descend du haut de l'écran sur un raccourci.

```bash
sudo apt install xfce4-terminal ; sudo dnf install xfce4-terminal
```

## Ligne de commande

Ouvrir d'un coup une fenêtre avec plusieurs onglets, chacun avec son titre et sa commande, est très utile pour une session d'administration récurrente :

```bash
xfce4-terminal \
  --tab -T "bastion"  -e "ssh admin@bastion.exemple.lan" \
  --tab -T "journaux" -e "ssh admin@srv-log tail -f /var/log/syslog" \
  --tab -T "local"    --working-directory=$HOME/projets

xfce4-terminal --drop-down                        # afficher / masquer le terminal déroulant
xfce4-terminal --geometry 160x45 --hide-menubar
xfce4-terminal -x htop                            # -x : tout le reste de la ligne est la commande (à mettre en dernier)
```

> [!TIP]
> Associez `xfce4-terminal --drop-down` à un raccourci (par exemple `F12`) dans *Paramètres → Clavier → Raccourcis d'application* : un terminal toujours à portée de main, comme Guake ou Yakuake.

## Préférences utiles

| Onglet | Réglage conseillé |
| --- | --- |
| Général | Défilement illimité ou 50 000 lignes, curseur clignotant désactivé |
| Apparence | Police à chasse fixe (Nerd Font), barre de menus masquée |
| Couleurs | Palette prédéfinie (Solarized, Tango) |
| Avancé | Encodage UTF-8, compatibilité de la touche Retour arrière |
| Déroulant | Largeur et hauteur en pourcentage, masquer à la perte du focus |

Les préférences sont enregistrées dans le canal **xfconf** `xfce4-terminal` dans les versions récentes (`xfconf-query -c xfce4-terminal -l -v`), et dans `~/.config/xfce4/terminal/terminalrc` dans les anciennes.

Raccourcis par défaut : `Ctrl+Maj+T` nouvel onglet, `Ctrl+Maj+N` nouvelle fenêtre, `Ctrl+Page suiv./préc.` changer d'onglet, `Ctrl+Maj+F` rechercher, `Ctrl+Maj+C` / `Ctrl+Maj+V` copier / coller.

## Terminaux des autres bureaux

| Terminal | Bureau | Particularités |
| --- | --- | --- |
| **GNOME Terminal** / **Ptyxis** | GNOME | Profils ; Ptyxis (le nouveau terminal de GNOME, par défaut sur Fedora et Ubuntu récents) sait ouvrir des onglets dans les conteneurs Toolbox et Distrobox |
| **Konsole** | KDE Plasma | Profils, volets, signets SSH, surveillance d'activité ou de silence d'un onglet |
| **Terminator** | Tous | Découpage en grille et diffusion de la frappe à plusieurs volets (plusieurs serveurs à la fois) |
| **Windows Terminal** | Windows | Onglets PowerShell, CMD, WSL, Azure Cloud Shell, SSH ; voir la page Windows du wiki |
| Alacritty, Kitty, WezTerm, Ghostty | Tous | Terminaux accélérés par la carte graphique : [[01-alacritty-kitty-wezterm-ghostty\|page dédiée]] |

Commandes : [[90-aide-memoire|aide-mémoire]].
