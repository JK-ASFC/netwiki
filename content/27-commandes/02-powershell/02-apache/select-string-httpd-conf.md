---
title: "Select-String (httpd.conf)"
description: "PowerShell — Select-String (httpd.conf) (Configuration / WAMP) : Sous Windows on active modules et vhosts en éditant httpd.conf (LoadModule, Include) — pas de a2enmod."
tags: [powershell, commande, apache]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Apache |
| **Contexte** | Configuration / WAMP |
| **Commande type** | `Select-String -Path httpd.conf -Pattern "^LoadModule"` |

## Rôle

Sous Windows on active modules et vhosts en éditant httpd.conf (LoadModule, Include) — pas de a2enmod.

## Options

| Option | Rôle |
| --- | --- |
| `-Path ‹httpd.conf›` | fichier de config |
| `-Pattern ‹motif›` | directive recherchée |
| `(décommenter LoadModule rewrite_module ...)` | active un module |
| `(décommenter Include conf/extra/httpd-vhosts.conf)` | active les vhosts |
| `(puis recharger)` | httpd.exe -t puis Restart-Service Apache2.4 |

## Exemples

**Modules chargés**

```powershell
Select-String -Path httpd.conf -Pattern "^LoadModule"
```

**Trouver DocumentRoot**

```powershell
Select-String -Path httpd.conf -Pattern "DocumentRoot"
```

**Vérifier puis recharger**

```powershell
httpd.exe -t
```

*Mots-clés : httpd.conf loadmodule include vhost module rewrite ssl activer windows apache wamp*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
