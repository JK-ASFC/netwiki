---
title: Teams Phone — administration PowerShell
description: Administrer la téléphonie Teams avec le module PowerShell MicrosoftTeams — connexion, déclaration d'un SBC (New-CsOnlinePSTNGateway), utilisations RTC, itinéraires et stratégies de routage vocal, plans de numérotation et règles de normalisation, attribution des numéros (Set-CsPhoneNumberAssignment), comptes de ressources pour standards automatiques et files d'attente, vérifications et scripts en masse.
tags: [teams, powershell, direct routing, voice routing, numéros, microsoft 365]
icon: terminal
---

## Module et connexion

Le module **MicrosoftTeams** fonctionne sous Windows PowerShell 5.1 et **PowerShell 7** (Windows, macOS, Linux) :

```powershell
Install-Module MicrosoftTeams -Scope CurrentUser
Connect-MicrosoftTeams
Get-CsTenant | Select-Object DisplayName, TenantId
```

Le compte doit disposer du rôle **Administrateur Teams** (ou Administrateur de la téléphonie Teams) ; MFA recommandée.

## Déclarer le SBC (Direct Routing)

```powershell
New-CsOnlinePSTNGateway -Fqdn sbc.exemple.fr -SipSignalingPort 5061 -MaxConcurrentSessions 30 -ForwardCallHistory $true -Enabled $true
Get-CsOnlinePSTNGateway | Format-Table Identity, SipSignalingPort, Enabled, MediaBypass
```

## Routage vocal

Chaîne : **utilisateur → stratégie de routage vocal → utilisations RTC (*PSTN usages*) → itinéraires (motif + SBC)**.

```powershell
# Utilisations RTC
Set-CsOnlinePstnUsage -Identity Global -Usage @{Add = "FR-National", "FR-International"}

# Itinéraires
New-CsOnlineVoiceRoute -Identity "FR-National" -NumberPattern '^\+33[1-79]\d{8}$' `
  -OnlinePstnGatewayList sbc.exemple.fr -Priority 1 -OnlinePstnUsages "FR-National"
New-CsOnlineVoiceRoute -Identity "FR-Urgences" -NumberPattern '^(1[578]|112|114)$' `
  -OnlinePstnGatewayList sbc.exemple.fr -Priority 0 -OnlinePstnUsages "FR-National"
New-CsOnlineVoiceRoute -Identity "International" -NumberPattern '^\+(?!33)\d+$' `
  -OnlinePstnGatewayList sbc.exemple.fr -Priority 2 -OnlinePstnUsages "FR-International"

# Stratégies : standard (national) et direction (national + international)
New-CsOnlineVoiceRoutingPolicy "FR-Standard" -OnlinePstnUsages "FR-National"
New-CsOnlineVoiceRoutingPolicy "FR-Direction" -OnlinePstnUsages "FR-National", "FR-International"
```

## Plan de numérotation

Les utilisateurs composent des numéros nationaux ; la normalisation les convertit en E.164 :

```powershell
$national = New-CsVoiceNormalizationRule -Parent Global -Name "FR-National" -Pattern '^0([1-9]\d{8})$' -Translation '+33$1' -InMemory
$interne  = New-CsVoiceNormalizationRule -Parent Global -Name "Interne-4" -Pattern '^(1\d{3})$' -Translation '+3312345$1' -InMemory
New-CsTenantDialPlan -Identity "FR-Plan" -NormalizationRules @{Add = $national, $interne}
Test-CsVoiceNormalizationRule -NormalizationRule (Get-CsTenantDialPlan "FR-Plan").NormalizationRules[0] -DialedNumber 0612345678
```

Adaptez la règle des numéros courts internes à la structure réelle de vos SDA.

## Activer un utilisateur

```powershell
$u = "alice.martin@exemple.fr"
Set-CsPhoneNumberAssignment -Identity $u -PhoneNumber "+33123456701" -PhoneNumberType DirectRouting
Grant-CsOnlineVoiceRoutingPolicy -Identity $u -PolicyName "FR-Standard"
Grant-CsTenantDialPlan -Identity $u -PolicyName "FR-Plan"
Get-CsOnlineUser $u | Select-Object DisplayName, LineUri, EnterpriseVoiceEnabled, OnlineVoiceRoutingPolicy, TenantDialPlan
```

`-PhoneNumberType` vaut `DirectRouting`, `CallingPlan` ou `OperatorConnect` selon l'origine du numéro.

### En masse depuis un CSV

```powershell
# utilisateurs.csv : Upn;Numero;Strategie
Import-Csv .\utilisateurs.csv -Delimiter ';' | ForEach-Object {
    Set-CsPhoneNumberAssignment -Identity $_.Upn -PhoneNumber $_.Numero -PhoneNumberType DirectRouting
    Grant-CsOnlineVoiceRoutingPolicy -Identity $_.Upn -PolicyName $_.Strategie
    Grant-CsTenantDialPlan -Identity $_.Upn -PolicyName "FR-Plan"
    Write-Host "OK : $($_.Upn) -> $($_.Numero)"
}
```

## Standards automatiques et files d'attente

Chaque standard ou file a un **compte de ressource** (licence gratuite *Teams Phone Resource Account*) qui porte le numéro :

```powershell
# ID d'application : standard automatique ce933385-9390-45d1-9512-c8d228074e07, file d'attente 11cd3e2e-fccb-42ad-ad00-878b93575e07
New-CsOnlineApplicationInstance -UserPrincipalName accueil@exemple.fr -DisplayName "Accueil" -ApplicationId "ce933385-9390-45d1-9512-c8d228074e07"
Set-CsPhoneNumberAssignment -Identity accueil@exemple.fr -PhoneNumber "+33123456789" -PhoneNumberType DirectRouting
Get-CsAutoAttendant | Select-Object Name, Identity
Get-CsCallQueue | Select-Object Name, RoutingMethod, Agents
```

La conception des menus et horaires est plus confortable dans le centre d'administration ; PowerShell sert à l'inventaire et aux modifications en masse.

## Vérifications utiles

| Commande | Usage |
| --- | --- |
| `Get-CsOnlineUser <upn>` | Numéro, activation vocale, stratégies |
| `Get-CsPhoneNumberAssignment -TelephoneNumber +33123456701` | À qui est attribué un numéro |
| `Get-CsOnlineVoiceRoute`, `Get-CsOnlineVoiceRoutingPolicy` | Itinéraires et stratégies |
| `Get-CsOnlinePSTNGateway` | SBC déclarés |
| `Test-CsVoiceNormalizationRule` | Tester une normalisation |
| `Get-CsOnlineDialOutPolicy` / `Grant-CsDialoutPolicy` | Restrictions d'appels sortants (forfaits Microsoft) |
| `Remove-CsPhoneNumberAssignment -Identity <upn> -RemoveAll` | Retirer le numéro d'un utilisateur |
