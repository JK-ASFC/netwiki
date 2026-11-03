---
title: Gestionnaires de paquets — aide-mémoire
description: Commandes Homebrew (install, cask, upgrade, services, bundle), MacPorts (selfupdate, install, upgrade outdated), Nix (shell, run, profile add, develop, garbage collect), Guix (pull, install, shell, roll-back, gc), Flatpak (remote-add flathub, install, update, override), Snap (install, classic, refresh, revert) et AppImage.
tags: [aide-mémoire, homebrew, macports, nix, guix, flatpak, snap, appimage]
icon: terminal
---

Explications : [[01-homebrew-macports|Homebrew et MacPorts]] · [[02-nix-guix|Nix et Guix]] · [[03-flatpak-snap-appimage|Flatpak, Snap, AppImage]] · [[04-equivalences-distributions|équivalences apt, dnf, zypper, pacman, apk, emerge]].

```bash
brew install jq ; brew install --cask wireshark ; brew update && brew upgrade ; brew services list ; brew bundle --file=Brewfile ; brew cleanup
sudo port selfupdate ; sudo port install nmap ; sudo port upgrade outdated ; sudo port uninstall inactive
nix shell nixpkgs#jq ; nix run nixpkgs#hello ; nix profile add nixpkgs#htop ; nix develop ; nix flake update ; nix-collect-garbage -d
guix pull ; guix install nmap ; guix package -u ; guix shell python -- python3 ; guix package --roll-back ; guix gc
flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo ; flatpak install -y flathub org.keepassxc.KeePassXC ; flatpak update -y ; flatpak uninstall --unused
sudo snap install code --classic ; sudo snap refresh ; sudo snap revert firefox ; snap list --all
chmod +x App.AppImage && ./App.AppImage ; ./App.AppImage --appimage-extract
```
