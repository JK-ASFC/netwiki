---
title: Présentation, installation et usage
description: gopass — gestionnaire de mots de passe et de secrets en ligne de commande pour les équipes (compatible pass), chiffrement GPG ou age, synchronisation par Git, magasins multiples (montages), destinataires et partage par équipe, génération, OTP, modèles, intégrations (gopass-jsonapi pour les navigateurs, gopass-summon-provider, Ansible lookup, Terraform), installation sur Linux, macOS et Windows, bonnes pratiques.
tags: [gopass, pass, secrets, gpg, age, git, mots de passe, cli]
icon: info
---

**gopass** (MIT) stocke chaque secret dans un fichier **chiffré** (GPG ou age) d'un dépôt **Git** : historique, synchronisation et partage d'équipe par les mécanismes Git, sans serveur dédié. Compatible avec `pass` (*the standard Unix password manager*). Complément CLI de [[08-vaultwarden/01-presentation-installation|Vaultwarden]] (coffre web) et de [[07-vault/01-presentation-installation|Vault]] (secrets dynamiques).

## Installation

```bash
sudo apt install gopass gnupg git                 # Debian/Ubuntu (ou paquet .deb des Releases pour la dernière version)
sudo dnf install gopass                           # Fedora (EPEL selon la version)
brew install gopass                               # macOS
winget install gopass.gopass                      # Windows (avec Gpg4win)
```

## Initialisation

```bash
gpg --quick-generate-key "Alice Martin <alice@corp.exemple.fr>" ed25519 default 2y   # si aucune clé
gopass setup                                      # choisit la clé, crée le magasin ~/.local/share/gopass/stores/root
gopass setup --crypto age                         # alternative sans GPG (clés age)
```

## Usage quotidien

```bash
gopass generate reseau/fw-paris/admin 24          # génère et enregistre un mot de passe de 24 caractères
gopass insert reseau/switch-core/enable           # saisit un secret existant
gopass show reseau/fw-paris/admin                 # affiche ; -c : copie dans le presse-papiers (effacé après 45 s)
gopass edit serveurs/srv-db-01                    # éditeur (lignes suivantes : utilisateur, URL, notes)
gopass ls ; gopass find vpn ; gopass grep 10.0.20
gopass otp reseau/fw-paris/admin                  # code TOTP si une ligne « otpauth:// » est présente
gopass mv ancien/chemin nouveau/chemin ; gopass rm serveurs/obsolete
gopass sync                                       # pull/push Git de tous les magasins
```

## Partage d'équipe

```bash
gopass mounts add equipe-reseau git@gitlab.corp.exemple.fr:infra/secrets-reseau.git   # magasin partagé
gopass recipients add --store equipe-reseau bob@corp.exemple.fr   # ajoute la clé publique de Bob et rechiffre
gopass recipients --store equipe-reseau
```

Chaque membre importe les clés publiques de l'équipe ; le retrait d'un membre (`recipients remove`) rechiffre les secrets — mais **changez les secrets** qu'il connaissait.

## Intégrations

- Navigateur : `gopass-jsonapi` + extension *gopassbridge*.
- Ansible : `lookup('community.general.passwordstore', 'reseau/fw-paris/admin')` (backend gopass).
- Scripts : `gopass show -o reseau/fw-paris/admin` (première ligne seulement).

## Bonnes pratiques

Dépôt Git privé avec accès restreint, clé GPG protégée par phrase de passe (ou carte à puce/YubiKey), sauvegarde des clés privées hors ligne, revue régulière des destinataires.

Commandes : [[90-aide-memoire|aide-mémoire]].
