---
title: Teams Phone — aide-mémoire PowerShell
description: Commandes PowerShell Teams Phone avec exemples — connexion, SBC, utilisations RTC, itinéraires, stratégies, plans de numérotation et tests de normalisation, attribution et retrait de numéros, comptes de ressources, vérification d'un utilisateur, diagnostics côté client.
tags: [aide-mémoire, teams, powershell, direct routing, numéros]
icon: terminal
---

Référence rapide ; les explications sont dans [[02-powershell-administration|administration PowerShell]].

```powershell
Connect-MicrosoftTeams
Get-CsOnlinePSTNGateway | Format-Table Identity, Enabled, SipSignalingPort
Get-CsOnlinePstnUsage
Get-CsOnlineVoiceRoute | Format-Table Identity, NumberPattern, OnlinePstnGatewayList, Priority
Get-CsOnlineVoiceRoutingPolicy
Get-CsTenantDialPlan
Test-CsVoiceNormalizationRule -NormalizationRule (Get-CsTenantDialPlan "FR-Plan").NormalizationRules[0] -DialedNumber 0612345678
Get-CsOnlineUser alice.martin@exemple.fr | Select-Object DisplayName, LineUri, EnterpriseVoiceEnabled, OnlineVoiceRoutingPolicy, TenantDialPlan
Set-CsPhoneNumberAssignment -Identity alice.martin@exemple.fr -PhoneNumber "+33123456701" -PhoneNumberType DirectRouting
Grant-CsOnlineVoiceRoutingPolicy -Identity alice.martin@exemple.fr -PolicyName "FR-Standard"
Remove-CsPhoneNumberAssignment -Identity ancien@exemple.fr -RemoveAll
Get-CsPhoneNumberAssignment -TelephoneNumber "+33123456701"
Get-CsOnlineApplicationInstance | Format-Table DisplayName, UserPrincipalName, PhoneNumber
Get-CsAutoAttendant | Select-Object Name
Get-CsCallQueue | Select-Object Name, RoutingMethod
```

Diagnostics côté client Teams : `Ctrl+Alt+Maj+1` télécharge les journaux de diagnostic (application de bureau) ; dans le centre d'administration, *Utilisateurs → Historique des appels* et *Call Quality Dashboard*.
