---
title: "Get-ADPrincipalGroupMembership (groups AD)"
description: "PowerShell — Get-ADPrincipalGroupMembership (groups AD) (Administration AD) : Liste les groupes Active Directory dont un compte est membre (module RSAT). Équivalent de groups ‹utilisateur› côté domaine."
tags: [powershell, commande, active-directory]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Active Directory |
| **Contexte** | Administration AD |
| **Commande type** | `Get-ADPrincipalGroupMembership jdupont` |

## Rôle

Liste les groupes Active Directory dont un compte est membre (module RSAT). Équivalent de groups ‹utilisateur› côté domaine.

## Options

| Option | Rôle |
| --- | --- |
| `-Identity ‹compte›` | utilisateur, ordinateur, groupe ou compte de service |
| `-Server ‹serveur›` | contrôleur de domaine ou catalogue global à interroger |
| `-ResourceContextServer ‹serveur›` | domaine distant, pour les groupes locaux de domaine |
| `-ResourceContextPartition ‹DN›` | partition de ce serveur à interroger |
| `-Credential ‹identifiants›` | compte alternatif pour la requête |
| `(pas de -Recursive)` | l'imbrication ne se demande pas par un paramètre |
| `(voisin) Get-ADUser -Properties MemberOf` | groupes directs, sans le groupe principal |
| `(session) whoami /groups` | groupes effectifs de la session ouverte |

## Exemples

**Groupes d'un compte**

```powershell
Get-ADPrincipalGroupMembership jdupont
```

**Noms seulement**

```powershell
Get-ADPrincipalGroupMembership jdupont | Select-Object -ExpandProperty Name
```

**Tester une appartenance**

```powershell
(Get-ADPrincipalGroupMembership jdupont).Name -contains "GG_IT"
```

*Mots-clés : groups groupes appartenance membre utilisateur active directory ad get-adprincipalgroupmembership catalogue global*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
