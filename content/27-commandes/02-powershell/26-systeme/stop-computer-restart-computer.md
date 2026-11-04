---
title: "Stop-Computer / Restart-Computer"
description: "PowerShell — Stop-Computer / Restart-Computer (Arrêt/redémarrage (= shutdown)) : Arrête ou redémarre la machine (locale ou distante). L'équivalent de shutdown."
tags: [powershell, commande, systeme]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Système |
| **Contexte** | Arrêt/redémarrage (= shutdown) |
| **Commande type** | `Restart-Computer -Force` |

## Rôle

Arrête ou redémarre la machine (locale ou distante). L'équivalent de shutdown.

## Options

| Option | Rôle |
| --- | --- |
| `Stop-Computer` | arrête la machine |
| `Restart-Computer` | redémarre |
| `-Force` | passe outre les sessions ouvertes |
| `-ComputerName ‹nom›` | cible une machine distante |
| `-Wait` | attend le retour en ligne (redémarrage) |

## Exemples

**Redémarrer**

```powershell
Restart-Computer -Force
```

**Arrêter**

```powershell
Stop-Computer -Force
```

**Une machine distante**

```powershell
Restart-Computer -ComputerName SRV02 -Force
```

*Mots-clés : shutdown reboot arrêt redémarrage stop-computer restart-computer eteindre*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
