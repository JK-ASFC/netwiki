---
title: "selinux-activate"
description: "Bash — selinux-activate (SELinux / Activation (Debian)) : Prépare l'activation de SELinux sur Debian/Ubuntu : configure GRUB, active la politique par défaut et programme un ré-étiquetage complet du système au prochain démarrage. Un redémarrage est indispensable."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / Activation (Debian) |
| **Commande type** | `selinux-activate` |

## Rôle

Prépare l'activation de SELinux sur Debian/Ubuntu : configure GRUB, active la politique par défaut et programme un ré-étiquetage complet du système au prochain démarrage. Un redémarrage est indispensable.

## En détail

Sur Debian/Ubuntu, prépare l'activation de SELinux et programme un ré-étiquetage complet au prochain démarrage. Un redmarrage est nécessaire ensuite.

## Options

| Option | Rôle |
| --- | --- |
| `(nécessite le paquet selinux-basics + selinux-policy-default)` | info |

## Exemples

**Activer**

```bash
sudo selinux-activate
```

**Activer puis redémarrer**

```bash
sudo selinux-activate && sudo reboot
```

**Forcer un ré-étiquetage**

```bash
sudo touch /.autorelabel && sudo reboot
```

*Mots-clés : selinux activer debian ubuntu relabel autorelabel selinux-activate*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
