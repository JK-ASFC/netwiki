---
title: "httpd"
description: "PowerShell — httpd (Serveur web / WAMP) : Binaire Apache sous Windows (httpd.exe) : service, démarrage, test de config."
tags: [powershell, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Apache |
| **Contexte** | Serveur web / WAMP |
| **Commande type** | `httpd.exe -k start` |

## Rôle

Binaire Apache sous Windows (httpd.exe) : service, démarrage, test de config.

## Options

| Option | Rôle |
| --- | --- |
| `-k ‹install/start/stop/restart/uninstall›` | action sur le service Windows |
| `-t` | teste la syntaxe de la config |
| `-S` | liste les vhosts |
| `-M` | liste les modules chargés |
| `-v` | version |
| `-f ‹conf›` | fichier httpd.conf précis |
| `-n ‹nom›` | nom du service Windows |

## Exemples

**Installer le service**

```powershell
httpd.exe -k install -n "Apache2.4"
```

**Tester la config**

```powershell
httpd.exe -t
```

**Démarrer**

```powershell
httpd.exe -k start
```

## Dans les autres shells

- [[27-commandes/03-macos/02-apache/httpd|httpd (macOS)]]

*Mots-clés : apache httpd windows wamp xampp service installer démarrer config vhost module*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
