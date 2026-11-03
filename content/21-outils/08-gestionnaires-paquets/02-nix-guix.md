---
title: Nix et GNU Guix
description: Gestionnaires de paquets fonctionnels et reproductibles — Nix (LGPL : store /nix/store, installation multi-utilisateur sur Linux, macOS et WSL, nix shell, nix run, nix profile add, nix develop, flakes et flake.lock, nix-collect-garbage, home-manager) et GNU Guix (GPL : paquets en Scheme, guix pull, install, shell, roll-back, gc, guix system, installation Debian ou script), environnements de développement jetables, retour arrière et cohabitation avec le gestionnaire de la distribution.
tags: [nix, guix, reproductible, flakes, paquets, linux, macos]
icon: snowflake
---

**Nix** et **Guix** installent chaque paquet dans un dossier unique du *store* (`/nix/store/<empreinte>-nom`, `/gnu/store/…`) identifié par l'empreinte de **toutes** ses dépendances. Conséquences : plusieurs versions cohabitent, une mise à jour est atomique et réversible, et un environnement se reconstruit à l'identique sur une autre machine. Ils fonctionnent **à côté** du gestionnaire de la distribution (apt, dnf…) sans conflit. Pour un système entier déclaratif, voir [[07-nixos/01-presentation-installation|NixOS]].

| | Nix | GNU Guix |
| --- | --- | --- |
| Systèmes | Linux, macOS, Windows via WSL | Linux (et distribution Guix System) |
| Langage des paquets | Langage Nix | Guile Scheme |
| Dépôt | nixpkgs (le plus grand catalogue) | Guix (logiciels libres uniquement ; canaux tiers possibles) |
| Licence | LGPL 2.1 | GPL 3.0 |

## Nix

Installation multi-utilisateur (démon `nix-daemon`) avec le script officiel de nixos.org (`--daemon`) ou l'installateur de Determinate Systems (désinstallation propre, flakes activés). Activer les commandes modernes dans `~/.config/nix/nix.conf` (ou `/etc/nix/nix.conf`) :

```ini
experimental-features = nix-command flakes
```

```bash
nix shell nixpkgs#jq nixpkgs#ripgrep        # shell temporaire avec ces outils
nix run nixpkgs#cowsay -- bonjour           # lancer sans installer
nix profile add nixpkgs#htop                # installer dans le profil de l'utilisateur
nix profile list ; nix profile upgrade --all ; nix profile rollback
nix search nixpkgs terraform
nix-collect-garbage -d                      # supprimer les anciennes générations et le store inutilisé
```

Environnement de projet partagé par toute l'équipe (`flake.nix` versionné, versions figées dans `flake.lock`) :

```nix
{
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  outputs = { self, nixpkgs }:
    let pkgs = nixpkgs.legacyPackages.x86_64-linux; in {
      devShells.x86_64-linux.default = pkgs.mkShell {
        packages = [ pkgs.terraform pkgs.ansible pkgs.kubectl ];
      };
    };
}
```

`nix develop` ouvre ce shell ; `nix flake update` met à jour les versions figées. **home-manager** gère de la même façon les fichiers de configuration de l'utilisateur.

## GNU Guix

Installation : paquet `guix` de Debian/Ubuntu (`sudo apt install guix`) ou script `guix-install.sh` du projet (installation multi-utilisateur avec démon `guix-daemon`).

```bash
guix pull                          # mettre à jour Guix et la liste des paquets (par utilisateur)
guix search nmap
guix install nmap jq
guix package -u                    # mettre à jour le profil
guix package --list-generations ; guix package --roll-back
guix shell python python-requests -- python3 script.py     # environnement jetable
guix gc                            # nettoyer le store
guix describe                      # version exacte (à noter pour la reproductibilité)
```

Un fichier `manifest.scm` décrit un profil, `channels.scm` fige les révisions (`guix time-machine -C channels.scm -- shell -m manifest.scm`).

Commandes : [[90-aide-memoire|aide-mémoire]].
