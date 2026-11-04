---
title: "nextdns"
description: "Bash — nextdns (DNS-over-HTTPS) : Client DNS-over-HTTPS de NextDNS : installe un résolveur local chiffré, applique un profil de filtrage, et se pilote en sous-commandes."
tags: [bash, commande, reseau]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | Bash |
| **Catégorie** | Réseau |
| **Contexte** | DNS-over-HTTPS |
| **Commande type** | `nextdns status` |

## Rôle

Client DNS-over-HTTPS de NextDNS : installe un résolveur local chiffré, applique un profil de filtrage, et se pilote en sous-commandes.

## Options

| Option | Rôle |
| --- | --- |
| `install` | installe le service (au démarrage) |
| `uninstall` | retire le service |
| `start` | démarre le résolveur |
| `stop` | arrête le résolveur |
| `restart` | redémarre |
| `status` | état du service |
| `config list` | affiche la configuration |
| `config set ‹option=valeur›` | modifie une option |
| `config edit` | édite /etc/nextdns.conf |
| `log` | affiche les journaux |

## Exemples

**Installer avec un profil**

```bash
sudo nextdns install -profile abcdef -report-client-info
```

**Changer le profil**

```bash
nextdns config set -profile=abcdef
```

**État du service**

```bash
nextdns status
```

*Mots-clés : nextdns dns doh chiffre résolveur filtrage profil installer config réseau privacy*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
