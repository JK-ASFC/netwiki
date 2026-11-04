---
title: "rasdial"
description: "PowerShell — rasdial (VPN / connexion) : Établit ou coupe une connexion VPN depuis la ligne de commande ou un script."
tags: [powershell, commande, vpn]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | VPN |
| **Contexte** | VPN / connexion |
| **Commande type** | `rasdial 'VPN Bureau'` |

## Rôle

Établit ou coupe une connexion VPN depuis la ligne de commande ou un script.

## Options

| Option | Rôle |
| --- | --- |
| `‹profil›` | se connecte au profil |
| `‹utilisateur› ‹motdepasse›` | après le profil : identifiants explicites |
| ⚠️ `/disconnect` | après le profil : coupe la connexion |
| `(sans argument)` | affiche les connexions actives |

> [!WARNING]
> Options à manier avec précaution : `/disconnect`. Elles contournent une protection, détruisent des données ou agissent sans confirmation.

## Exemples

**Se connecter**

```powershell
rasdial 'VPN Bureau'
```

**Voir l'état**

```powershell
rasdial
```

**Se déconnecter**

```powershell
rasdial 'VPN Bureau' /disconnect
```

*Mots-clés : rasdial vpn connexion déconnexion script tâche planifiée identifiants*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
