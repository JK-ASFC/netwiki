---
title: "semodule"
description: "Bash — semodule (SELinux / Modules) : Gère les modules de politique SELinux : liste, installe, met à jour, active, désactive ou retire un module (.pp), et recompile la politique active."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / Modules |
| **Commande type** | `semodule -l` |

## Rôle

Gère les modules de politique SELinux : liste, installe, met à jour, active, désactive ou retire un module (.pp), et recompile la politique active.

## En détail

Gère les modules de politique SELinux : en installer un (souvent généré par audit2allow), en retirer, en activer ou désactiver. C'est ainsi qu'on étend la politique proprement.

## Options

| Option | Rôle |
| --- | --- |
| `-l` | liste les modules chargés |
| `-i ‹module.pp›` | installe ou met à jour un module |
| `-r ‹nom›` | retire un module |
| `-e ‹nom›` | active un module désactivé |
| `-d ‹nom›` | désactive un module sans le retirer |
| `-B` | reconstruit et recharge la politique |

## Exemples

**Lister**

```bash
semodule -l
```

**Installer**

```bash
sudo semodule -i mon_module.pp
```

**Retirer**

```bash
sudo semodule -r mon_module
```

*Mots-clés : selinux module policy pp installer charger semodule*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
