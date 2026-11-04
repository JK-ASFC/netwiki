---
title: "sftp"
description: "PowerShell — sftp (Accès distant) : Session de transfert interactive via SSH (get/put)."
tags: [powershell, commande, ssh]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | SSH |
| **Contexte** | Accès distant |
| **Commande type** | `sftp edwin@10.20.0.2` |

## Rôle

Session de transfert interactive via SSH (get/put).

## Options

| Option | Rôle |
| --- | --- |
| `-P ‹port›` | port |
| `-i ‹chemin_clé›` | clé privée |
| `-b ‹script›` | fichier de commandes (batch) |

## Exemples

**Ouvrir une session**

```powershell
sftp edwin@10.20.0.2
```

**Télécharger un fichier**

```powershell
get /etc/nginx/nginx.conf
```

**Envoyer un fichier**

```powershell
put .\config.txt /tmp/
```

*Mots-clés : sftp transfert interactif get put distant sécurisé fichier*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
