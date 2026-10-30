---
title: Présentation, installation et configuration
description: Git, gestion de versions distribuée — modèle (dépôt, commit, branche, distant), intérêt pour les équipes réseau et système (configurations, scripts, infrastructure as code), installation sous Windows, macOS et Linux, configuration (identité, éditeur, fins de ligne, proxy, AC d'entreprise), clés SSH et gestionnaires d'identifiants.
tags: [git, gestion de versions, installation, ssh, configuration, windows, macos, linux]
icon: info
---

**Git** enregistre l'historique complet des modifications d'un ensemble de fichiers : qui a changé quoi, quand et pourquoi, avec la possibilité de revenir en arrière, de travailler en parallèle sur des **branches** et de **fusionner**. Chaque copie (clone) contient tout l'historique.

Pour un architecte réseau ou système, Git est le socle de l'**infrastructure as code** : configurations d'équipements, playbooks Ansible, fichiers Terraform, manifestes Kubernetes, documentation, scripts — versionnés, relus (*merge requests*) et déployés automatiquement.

## Modèle

```mermaid
flowchart LR
  WD["Répertoire de travail<br/>(fichiers modifiés)"] -- "git add" --> IDX["Index<br/>(zone de préparation)"]
  IDX -- "git commit" --> LOC[("Dépôt local<br/>.git")]
  LOC -- "git push" --> REM[("Dépôt distant<br/>GitLab, Gitea, Forgejo…")]
  REM -- "git fetch / pull" --> LOC
```

| Notion | Description |
| --- | --- |
| Commit | Instantané identifié par un condensat (SHA-1/SHA-256), avec auteur, date, message, parent(s) |
| Branche | Pointeur mobile vers un commit (`main`, `feature/vlan-30`) |
| Étiquette (*tag*) | Pointeur fixe (versions : `v1.4.2`) |
| Distant (*remote*) | Dépôt de référence (`origin`) |
| `HEAD` | Commit/branche actuellement extrait |

## Installation

| Système | Installation |
| --- | --- |
| Windows | `winget install Git.Git` (Git for Windows : Git Bash, gestionnaire d'identifiants) |
| macOS | `xcode-select --install` (version Apple) ou `brew install git` |
| Debian / Ubuntu | `sudo apt install git` |
| RHEL / Rocky / Alma | `sudo dnf install git` |

```bash
git --version
```

## Configuration

```bash
git config --global user.name "Alice Martin"
git config --global user.email "alice.martin@exemple.fr"
git config --global init.defaultBranch main
git config --global core.editor "code --wait"          # ou nano, vim
git config --global pull.rebase true                    # historique linéaire lors des pull
git config --global fetch.prune true
git config --list --show-origin                         # voir d'où vient chaque réglage
```

| Niveau | Fichier | Portée |
| --- | --- | --- |
| `--system` | `/etc/gitconfig` | Tous les utilisateurs |
| `--global` | `~/.gitconfig` | L'utilisateur |
| `--local` | `.git/config` | Le dépôt |

### Fins de ligne (Windows / Linux)

```bash
git config --global core.autocrlf input     # Linux/macOS : convertir CRLF → LF à l'ajout
git config --global core.autocrlf true      # Windows : LF dans le dépôt, CRLF dans les fichiers extraits
```

Un fichier `.gitattributes` dans le dépôt rend la règle indépendante des postes :

```text .gitattributes
* text=auto eol=lf
*.ps1 text eol=crlf
*.bat text eol=crlf
*.png binary
```

### Proxy et AC d'entreprise

```bash
git config --global http.proxy http://proxy.corp.exemple.fr:3128
git config --global http.https://gitlab.corp.exemple.fr.proxy ""          # pas de proxy pour la forge interne
git config --global http.sslCAInfo /etc/ssl/certs/ca-certificates.crt    # magasin incluant l'AC interne
git config --global http.sslBackend schannel                              # Windows : utiliser le magasin de certificats Windows
```

## Authentification

### SSH

```bash
ssh-keygen -t ed25519 -C "alice@poste-alice"
cat ~/.ssh/id_ed25519.pub          # à déclarer dans le profil de la forge
ssh -T git@gitlab.corp.exemple.fr  # test
git clone git@gitlab.corp.exemple.fr:reseau/configurations.git
```

Voir aussi [[01-openssh/04-cles-certificats|clés et certificats SSH]].

### HTTPS

```bash
git clone https://gitlab.corp.exemple.fr/reseau/configurations.git
git config --global credential.helper manager      # Git Credential Manager (Windows, macOS, Linux)
git config --global credential.helper store        # fichier en clair ~/.git-credentials : à éviter
```

Utilisez des **jetons d'accès** personnels (portée limitée, expiration) plutôt que le mot de passe du compte.

## Premiers pas

```bash
mkdir configurations && cd configurations
git init
echo "# Configurations réseau" > README.md
git add README.md
git commit -m "Initialisation du dépôt"
git remote add origin git@gitlab.corp.exemple.fr:reseau/configurations.git
git push -u origin main
```

## Suite du parcours

1. [[02-branches-workflows|Commandes, branches et flux de travail]]
2. [[03-serveur-hooks-depannage|Serveur Git, hooks, LFS et dépannage]]
