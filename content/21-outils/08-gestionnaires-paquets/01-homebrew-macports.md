---
title: Homebrew et MacPorts
description: Gestionnaires de paquets de macOS (et Linux pour Homebrew) — Homebrew (BSD : formules et casks, préfixes /opt/homebrew, /usr/local et /home/linuxbrew, brew install, upgrade, services, bundle et Brewfile, tap, pin, doctor, analytique, usage en entreprise) et MacPorts (BSD : ports compilés dans /opt/local, Xcode Command Line Tools, port selfupdate, install, variantes, upgrade outdated, load, nettoyage), comparaison et cohabitation.
tags: [homebrew, macports, macos, linux, paquets, brew, brewfile]
icon: beer
---

| | Homebrew | MacPorts |
| --- | --- | --- |
| Systèmes | macOS, Linux (et WSL) | macOS |
| Préfixe | `/opt/homebrew` (Apple Silicon), `/usr/local` (Intel), `/home/linuxbrew/.linuxbrew` | `/opt/local` |
| Paquets | Binaires précompilés (*bottles*) ; applications graphiques (*casks*) | Compilés ou binaires, avec **variantes** |
| Droits | Utilisateur (pas de `sudo` pour installer) | `sudo` |
| Points forts | Très répandu, catalogue énorme, casks | Dépendances isolées, prise en charge des anciens macOS |

Éviter d'utiliser les deux pour les mêmes outils : choisir l'un d'eux sur un poste.

## Homebrew

Prérequis macOS : `xcode-select --install`. Installation :

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile      # Apple Silicon ; Linux : /home/linuxbrew/.linuxbrew/bin/brew
brew analytics off
```

```bash
brew search nmap ; brew info nmap
brew install nmap jq wget
brew install --cask wireshark visual-studio-code
brew update && brew upgrade ; brew upgrade --cask --greedy
brew list ; brew leaves              # paquets installés explicitement
brew pin postgresql@17               # bloquer la mise à jour
brew services start postgresql@17 ; brew services list
brew tap hashicorp/tap && brew install hashicorp/tap/terraform
brew doctor ; brew cleanup
```

**Brewfile** : décrire l'outillage standard d'un poste d'administrateur et le réinstaller en une commande :

```ruby
tap "hashicorp/tap"
brew "git"
brew "jq"
brew "hashicorp/tap/terraform"
cask "wireshark"
cask "keepassxc"
```

```bash
brew bundle dump --file=Brewfile     # exporter l'existant
brew bundle --file=Brewfile          # installer
brew bundle check --file=Brewfile
```

En entreprise, Homebrew s'installe par utilisateur ; pour un parc de Mac, combiner un MDM (Jamf, Intune) qui déploie les applications et un script d'installation de Homebrew avec un Brewfile commun.

## MacPorts

Installer les **Xcode Command Line Tools** (`xcode-select --install`), puis le paquet `.pkg` correspondant à la version de macOS (site de MacPorts). Après une mise à jour majeure de macOS, réinstaller MacPorts et ses ports (procédure de migration du projet).

```bash
sudo port selfupdate
port search nmap ; port info nmap ; port variants curl
sudo port install nmap vim +huge         # variante activée
sudo port upgrade outdated
port installed requested                 # paquets demandés explicitement
sudo port load nginx                     # démarrage automatique (launchd)
sudo port uninstall inactive ; sudo port reclaim
```

Voir aussi : [[02-nix-guix|Nix et Guix]] (reproductibles, macOS et Linux). Commandes : [[90-aide-memoire|aide-mémoire]].
