---
title: "Connect-IscsiTarget"
description: "PowerShell — Connect-IscsiTarget (Stockage réseau) : Rattache un disque distant iSCSI : l'équivalent Windows de nbd-client."
tags: [powershell, commande, disques-stockage]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Disques & stockage |
| **Contexte** | Stockage réseau |
| **Commande type** | `Connect-IscsiTarget -NodeAddress iqn.2024-01.local:cible` |

## Rôle

Rattache un disque distant iSCSI : l'équivalent Windows de nbd-client.

## Options

| Option | Rôle |
| --- | --- |
| `-NodeAddress ‹iqn…›` | identifiant IQN de la cible à connecter |
| `-IsPersistent $true` | reconnecte automatiquement au démarrage de Windows |
| `-IsMultipathEnabled $true` | active le multi-chemin (MPIO) pour la redondance |
| `-AuthenticationType ONEWAYCHAP` | active l'authentification CHAP unidirectionnelle |

## Exemples

**Découvrir**

```powershell
Get-IscsiTarget
```

**Connecter**

```powershell
Connect-IscsiTarget -NodeAddress iqn.2024-01.local:cible
```

**Connexion persistante**

```powershell
Connect-IscsiTarget -NodeAddress iqn.2024-01.local:cible -IsPersistent $true
```

*Mots-clés : iscsi disque réseau distant nbd équivalent cible connecter*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
