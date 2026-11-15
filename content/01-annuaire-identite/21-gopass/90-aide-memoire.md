---
title: gopass — aide-mémoire des commandes
description: Référence complète des commandes gopass avec exemples — installation (Debian/Ubuntu, Fedora, Arch, macOS, Windows), configuration initiale (GPG ou age, stockage Git), magasins partagés (montage, clonage, synchronisation), destinataires (ajout, retrait, rechiffrement), création et génération de secrets (symboles, longueur, phrases de passe, modèles), lecture (presse-papiers avec effacement, mot de passe seul, champ précis), recherche, édition, copie, déplacement, suppression, historique, codes OTP, exécution d'une commande avec un secret en variable d'environnement, audit et vérification du magasin, configuration et clés GPG.
tags: [aide-mémoire, gopass, gpg, age, mots de passe, secrets, git, équipe]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|gopass]]. Exemples : magasin d'équipe `equipe-reseau` hébergé sur `git@gitlab.corp.exemple.fr:infra/secrets.git`, membres `alice@corp.exemple.fr` et `bob@corp.exemple.fr`.

## Installation

```bash
sudo apt install gopass                               # Debian / Ubuntu
sudo dnf install gopass                               # Fedora
sudo pacman -S gopass                                 # Arch
brew install gopass                                   # macOS
winget install gopass.gopass                          # Windows
gopass version
gopass completion bash | sudo tee /etc/bash_completion.d/gopass > /dev/null
```

## Configuration initiale

```bash
gpg --full-generate-key                               # si vous n'avez pas encore de clé GPG
gopass setup                                          # assistant : clé, stockage Git
gopass setup --crypto age                             # alternative sans GPG (clés age)
gopass init --store equipe-reseau --path ~/.local/share/gopass/stores/equipe-reseau alice@corp.exemple.fr
gopass config
gopass config core.cliptimeout 30                     # effacer le presse-papiers après 30 s
gopass config core.autosync true
```

## Magasins partagés

```bash
gopass clone git@gitlab.corp.exemple.fr:infra/secrets.git equipe-reseau     # rejoindre un magasin existant
gopass mounts
gopass mounts add equipe-reseau ~/.local/share/gopass/stores/equipe-reseau
gopass mounts remove equipe-reseau
gopass sync                                           # pull, rechiffrement si besoin, push de tous les magasins
gopass sync --store equipe-reseau
```

## Destinataires (qui peut déchiffrer)

```bash
gopass recipients
gpg --import bob.asc && gpg --list-keys bob@corp.exemple.fr
gopass recipients add --store equipe-reseau bob@corp.exemple.fr     # rechiffre les secrets pour Bob
gopass recipients remove --store equipe-reseau bob@corp.exemple.fr  # départ : retirer… puis changer les secrets qu'il connaissait
gpg --armor --export alice@corp.exemple.fr > alice.asc
```

## Créer et générer

```bash
gopass insert equipe-reseau/fw-paris/admin            # saisie masquée
gopass insert -m equipe-reseau/srv-db-01              # multiligne : 1re ligne = mot de passe, puis « cle: valeur »
gopass generate equipe-reseau/routeur-lyon/admin 24   # 24 caractères
gopass generate -s equipe-reseau/ap-wifi/psk 32       # avec symboles
gopass generate --generator xkcd equipe-reseau/coffre/phrase 5   # phrase de passe de 5 mots
gopass pwgen 24                                       # afficher des propositions sans rien enregistrer
gopass templates                                      # modèles par dossier
```

Exemple de secret multiligne (ce que contient `equipe-reseau/srv-db-01`) :

```text
MotDePassePrincipalLong
utilisateur: postgres
url: postgresql://srv-db-01.corp.exemple.fr:5432
notes: compte d'administration, rotation trimestrielle
```

## Lire, chercher

```bash
gopass show equipe-reseau/fw-paris/admin
gopass show -o equipe-reseau/fw-paris/admin           # mot de passe seul (scripts)
gopass show -c equipe-reseau/fw-paris/admin           # presse-papiers, effacé automatiquement
gopass show equipe-reseau/srv-db-01 utilisateur       # un champ précis
gopass ls
gopass ls -f                                          # liste à plat
gopass ls equipe-reseau/fw-paris
gopass find radius                                    # par nom
gopass grep 10.0.20                                   # dans le contenu (déchiffre tout : plus lent)
```

## Modifier, organiser, historique

```bash
gopass edit equipe-reseau/srv-db-01
gopass cp modele/serveur equipe-reseau/srv-web-02
gopass mv equipe-reseau/ancien-nom equipe-reseau/nouveau-nom
gopass rm equipe-reseau/srv-retire
gopass rm -r equipe-reseau/obsolete/
gopass history equipe-reseau/fw-paris/admin           # versions (stockage Git)
```

## OTP et utilisation dans les scripts

```bash
# Ligne « otpauth://totp/… » dans le secret, puis code courant
gopass otp equipe-reseau/fw-paris/admin
gopass otp -c equipe-reseau/fw-paris/admin
# Exécuter une commande avec le secret en variable d'environnement (le nom de variable est dérivé du chemin)
gopass env equipe-reseau/api/token -- env | grep -i token
# Mot de passe passé à un outil qui le lit sur l'entrée standard
gopass show -o equipe-reseau/registre/admin | docker login -u admin --password-stdin registry.corp.exemple.fr
```

## Contrôles

```bash
gopass audit                                          # mots de passe faibles, réutilisés ou anciens
gopass fsck                                           # vérifie et répare (destinataires, chiffrement, Git)
gpg --list-secret-keys --keyid-format long
```
