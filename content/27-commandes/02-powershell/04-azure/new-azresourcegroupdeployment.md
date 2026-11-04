---
title: "New-AzResourceGroupDeployment"
description: "PowerShell — New-AzResourceGroupDeployment (Azure / Déploiement ARM) : Déploie un modèle ARM ou Bicep sur un groupe de ressources : l'équivalent du module Az de la commande az deployment group create."
tags: [powershell, commande, azure]
icon: terminal
---

| Propriété | Valeur |
| --- | --- |
| **Shell** | PowerShell |
| **Catégorie** | Azure |
| **Contexte** | Azure / Déploiement ARM |
| **Commande type** | `New-AzResourceGroupDeployment -ResourceGroupName rg-prod -TemplateFile modele.bicep` |

## Rôle

Déploie un modèle ARM ou Bicep sur un groupe de ressources : l'équivalent du module Az de la commande az deployment group create.

## Options

| Option | Rôle |
| --- | --- |
| `-ResourceGroupName ‹groupe›` | groupe de ressources cible |
| `-TemplateFile ‹fichier›` | modèle local, .json ou .bicep |
| `-TemplateParameterFile ‹fichier›` | fichier de paramètres .json ou .bicepparam |
| `-TemplateParameterObject ‹table›` | paramètres en table de hachage |
| `-TemplateUri ‹adresse›` | modèle accessible par URL |
| `-Name ‹nom›` | nom du déploiement dans l'historique |
| `-Mode ‹mode›` | Incremental ou Complète |
| `-WhatIf` | annonce les changements sans rien appliquer |
| `-Confirm` | présente l'aperçu puis demande l'accord avant d'appliquer |
| `-ProceedIfNoChange` | n'interroge pas quand l'aperçu ne montre aucun changement |
| `-SkipTemplateParameterPrompt` | échoue au lieu de reclamer un paramètre manquant |
| `-RollbackToLastDeployment` | rejoue le dernier déploiement réussi en cas d'échec |
| `-ValidationLevel ‹niveau›` | Provider, ProviderNoRbac ou Template |
| `-Force` | supprime toute demande de confirmation |
| `-AsJob` | rend la main et poursuit en tâche de fond |
| `-Tag ‹table›` | étiquettes posees sur le déploiement |
| `(cmdlets voisines) Test-AzResourceGroupDeployment / Get-AzResourceGroupDeployment` | valider un modèle sans déployer, consulter l'historique du groupe |

## Exemples

**Déploiement simple**

```powershell
New-AzResourceGroupDeployment -ResourceGroupName rg-prod -TemplateFile modele.bicep
```

**Aperçu avant déploiement**

```powershell
New-AzResourceGroupDeployment -ResourceGroupName rg-prod -TemplateFile modele.bicep -WhatIf
```

**Équivalent de l'exemple az CLI**

```powershell
New-AzResourceGroupDeployment -Name bicepDemo -ResourceGroupName arm-demo -TemplateFile .\storage.bicep -part bicep
```

*Mots-clés : azure déploiement deployment arm bicep modèle template infrastructure code whatif aperçu rollback validation az resources new-azresourcegroupdeployment*

---

*Source : référence de commandes « X DIAG — Command Deck », fournie par l’utilisateur et adaptée pour NetWiki (accents restaurés, mise en forme).*
