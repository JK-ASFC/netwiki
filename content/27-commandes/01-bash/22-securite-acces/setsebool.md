---
title: "setsebool"
description: "Bash — setsebool (SELinux / Booléens) : Active ou désactive un booléen SELinux : un interrupteur nommé qui autorise un comportement précis (ex : laisser Apache ouvrir des connexions réseau) sans toucher à la politique."
tags: [bash, commande, securite-acces]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Sécurité & accès |
| **Contexte** | SELinux / Booléens |
| **Commande type** | `setsebool -P httpd_can_network_connect on` |

## Rôle

Active ou désactive un booléen SELinux : un interrupteur nommé qui autorise un comportement précis (ex : laisser Apache ouvrir des connexions réseau) sans toucher à la politique.

## En détail

Active ou désactive un « booléen » SELinux, c'est-à-dire un interrupteur pré-prévu par la politique (ex : autoriser Apache à sortir sur le réseau). L'option -P rend le changement permanent.

## Options

| Option | Rôle |
| --- | --- |
| ⚠️ `-P` | rend le changement PERSISTANT (survit au redémarrage) ; sans -P le changement est temporaire, perdu au reboot |
| `on / off` | valeur cible du booléen |

> [!WARNING]
> Options à manier avec précaution : `-P`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Activer (persistant)**

```bash
sudo setsebool -P httpd_can_network_connect on
```

**Temporaire**

```bash
setsebool httpd_can_network_connect on
```

**Voir un booléen**

```bash
getsebool httpd_can_network_connect
```

*Mots-clés : selinux booléen boolean autoriser httpd setsebool getsebool*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
