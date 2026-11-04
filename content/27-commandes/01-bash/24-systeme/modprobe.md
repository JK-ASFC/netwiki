---
title: "modprobe"
description: "Bash — modprobe (Noyau & modules) : Charge (ou retire) un module du noyau AVEC toutes ses dépendances, contrairement à insmod."
tags: [bash, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Système |
| **Contexte** | Noyau & modules |
| **Commande type** | `modprobe` |

## Rôle

Charge (ou retire) un module du noyau AVEC toutes ses dépendances, contrairement à insmod.

## Options

| Option | Rôle |
| --- | --- |
| `-r` | RETIRE le module ainsi que les dépendances devenues inutiles |
| `-n` | SIMULATION : montre ce qui serait fait sans rien charger |
| `-v` | verbeux : affiche les insmod réellement exécutés et dans quel ordre |
| `--show-depends` | liste les dépendances du module SANS le charger |
| `-D` | affiche l'arbre complet des dépendances |
| `-c` | affiche toute la configuration modprobe issue de /etc/modprobe.d/ |
| `--first-time` | échoue si le module est déjà chargé (utile pour détecter un doublon en script) |
| ⚠️ `-f` | FORCE le chargement malgré une version incompatible : peut déstabiliser le noyau |

> [!WARNING]
> Options à manier avec précaution : `-f`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Charger un module**

```bash
sudo modprobe overlay
```

**Retirer un module**

```bash
sudo modprobe -r overlay
```

**Voir les dépendances**

```bash
modprobe --show-depends br_netfilter
```

**Vérifier le chargement**

```bash
lsmod | grep overlay
```

*Mots-clés : module noyau kernel charger driver pilote lsmod rmmod depmod persistance*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
