---
title: "useradd"
description: "Bash — useradd (Comptes / Provisioning) : Crée un compte utilisateur local."
tags: [bash, commande, comptes-utilisateurs]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Comptes & utilisateurs |
| **Contexte** | Comptes / Provisioning |
| **Commande type** | `useradd -m -s /bin/bash jdupont` |

## Rôle

Crée un compte utilisateur local.

## En détail

Crée un nouveau compte utilisateur sur la machine. Souvent suivi de passwd pour lui définir un mot de passe.

## Options

| Option | Rôle |
| --- | --- |
| `-r` | compte système |
| `-m` | crée le répertoire perso |
| `-s ‹shell›` | shell de connexion |
| `-d ‹home›` | répertoire personnel |
| `-G ‹groupes›` | groupes supplémentaires |
| `-u ‹UID›` | identifiant numérique |
| `-c ‹commentaire›` | description |

## Exemples

**Syntaxe de base**

```bash
useradd jdupont
```

**Avec home + shell**

```bash
useradd -m -s /bin/bash jdupont
```

**Dans des groupes**

```bash
useradd -m -G sudo,docker jdupont
```

*Mots-clés : créer compte utilisateur local provisioning useradd*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
