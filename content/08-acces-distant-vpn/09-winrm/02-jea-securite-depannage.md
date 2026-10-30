---
title: JEA, sécurité et dépannage
description: Sécuriser l'administration à distance Windows — Just Enough Administration (capacités de rôle, configuration de session, comptes virtuels et gMSA, transcriptions), durcissement de WinRM (filtrage, désactivation de Basic et du trafic non chiffré, CredSSP, délégation Kerberos contrainte basée sur les ressources), journalisation PowerShell (blocs de scripts, transcription, module), détection des usages malveillants et erreurs fréquentes de WinRM.
tags: [winrm, jea, just enough administration, powershell, sécurité, journalisation, kerberos, dépannage]
icon: shield-check
---

## Just Enough Administration (JEA)

**JEA** crée un point de terminaison PowerShell où un utilisateur **non administrateur** ne peut exécuter **que** des commandes autorisées (et avec quels paramètres), sous l'identité d'un compte **virtuel** privilégié temporaire. Exemple : le support peut redémarrer le service d'impression et vider la file, rien d'autre.

```powershell C:\Program Files\WindowsPowerShell\Modules\JEA-Impression\RoleCapabilities\SupportImpression.psrc (créé avec New-PSRoleCapabilityFile)
@{
    VisibleCmdlets = @(
        @{ Name = 'Restart-Service'; Parameters = @{ Name = 'Name'; ValidateSet = 'Spooler' } },
        'Get-Printer', 'Get-PrintJob',
        @{ Name = 'Remove-PrintJob'; Parameters = @{ Name = 'PrinterName' }, @{ Name = 'ID' } }
    )
    VisibleExternalCommands = @()
}
```

```powershell
New-PSRoleCapabilityFile -Path "C:\Program Files\WindowsPowerShell\Modules\JEA-Impression\RoleCapabilities\SupportImpression.psrc"
New-PSSessionConfigurationFile -Path C:\JEA\Impression.pssc -SessionType RestrictedRemoteServer -RunAsVirtualAccount `
  -TranscriptDirectory "C:\JEA\Transcriptions" -RoleDefinitions @{ 'CORP\GG-Support-Impression' = @{ RoleCapabilities = 'SupportImpression' } }
Test-PSSessionConfigurationFile -Path C:\JEA\Impression.pssc
Register-PSSessionConfiguration -Name "Impression" -Path C:\JEA\Impression.pssc -Force

# Utilisation par le support
Enter-PSSession -ComputerName srv-impr-01 -ConfigurationName Impression
Get-Command                        # seules les commandes autorisées apparaissent
```

| Élément | Rôle |
| --- | --- |
| `.psrc` (capacité de rôle) | Commandes, fonctions, paramètres et valeurs autorisés |
| `.pssc` (configuration de session) | Qui (groupes AD) obtient quelles capacités, compte d'exécution, transcription |
| `RunAsVirtualAccount` | Compte local temporaire administrateur de la machine ; `GroupManagedServiceAccount` pour accéder au réseau |
| `SessionType RestrictedRemoteServer` | Mode de langage *NoLanguage* : pas de script arbitraire |

> [!WARNING]
> Une commande autorisée trop large casse l'isolement : `Start-Process`, `Invoke-Expression`, `Add-LocalGroupMember`, accès au système de fichiers sans contrainte, ou tout cmdlet acceptant un bloc de script permettent l'élévation. Restreignez **les paramètres** avec `ValidateSet` / `ValidatePattern`.

## Durcissement de WinRM

- [ ] Écoute filtrée par le pare-feu : **réseau d'administration / bastion** seulement (5985/5986)
- [ ] `AllowUnencrypted = false` et `Basic = false` (service et client) — valeurs par défaut à vérifier
- [ ] **CredSSP désactivé** ; double saut par délégation Kerberos **contrainte basée sur les ressources** ou sessions JEA avec gMSA
- [ ] HTTPS pour les machines hors domaine, certificats délivrés par l'AC interne
- [ ] Administrateurs du tiers 0 (DC) jamais utilisés depuis des machines de niveau inférieur
- [ ] Groupe *Utilisateurs de gestion à distance* vide ou contrôlé

```powershell
Get-Item WSMan:\localhost\Service\AllowUnencrypted, WSMan:\localhost\Service\Auth\Basic, WSMan:\localhost\Service\Auth\CredSSP
Disable-WSManCredSSP -Role Server; Disable-WSManCredSSP -Role Client
# Délégation Kerberos contrainte basée sur les ressources : srv-saut peut présenter les identifiants à srv-fic-01
Set-ADComputer srv-fic-01 -PrincipalsAllowedToDelegateToAccount (Get-ADComputer srv-saut)
```

## Journalisation de PowerShell

| GPO (*Composants Windows → Windows PowerShell*) | Effet |
| --- | --- |
| **Activer la journalisation des blocs de scripts PowerShell** | Événement **4104** (contenu des scripts exécutés, y compris décodés) |
| Activer la journalisation des modules | Événement 4103 (pipeline, paramètres) |
| **Activer la transcription PowerShell** | Fichier texte de chaque session vers un partage protégé en écriture seule |

Événements à surveiller : 4104 avec des motifs suspects (`FromBase64String`, `DownloadString`, `Invoke-Mimikatz`, `AMSI`), connexions WinRM (**91**, **168** dans *Microsoft-Windows-WinRM/Operational*), ouvertures de session réseau (4624 type 3) de comptes privilégiés sur des serveurs inhabituels. Le mouvement latéral par WinRM (`Invoke-Command`, `wsmprovhost.exe`) est une technique d'attaque courante.

## Erreurs fréquentes

| Message | Cause | Solution |
| --- | --- | --- |
| `WinRM cannot complete the operation. Verify that the specified computer name is valid… firewall exception` | Service arrêté, pare-feu, nom | `Test-WSMan`, `Test-NetConnection -Port 5985`, règles de pare-feu (profil actif) |
| `The WinRM client cannot process the request… TrustedHosts` | Connexion par IP ou hors domaine sans HTTPS | Utiliser le FQDN (Kerberos), HTTPS, ou `TrustedHosts` ciblé |
| `Access is denied` | Compte non membre des administrateurs ni des *Utilisateurs de gestion à distance*, UAC distant pour comptes locaux | Droits ; `LocalAccountTokenFilterPolicy` seulement si nécessaire (risque) |
| `The server certificate on the destination computer has the following errors` | Certificat HTTPS non approuvé ou nom différent | AC approuvée, FQDN identique au certificat, `-SessionOption (New-PSSessionOption -SkipCNCheck)` en test uniquement |
| Double saut : accès refusé au partage depuis la session | Les identifiants ne sont pas délégués | Délégation Kerberos contrainte basée sur les ressources, ou passer `-Credential` à la commande interne |
| `The SPN … could not be found` / `Kerberos` erreur 0x80090322 | SPN `WSMAN/` ou `HTTP/` dupliqué | `setspn -X`, corriger les doublons |
| Connexion lente puis délai | Proxy WinHTTP, résolution DNS | `netsh winhttp show proxy`, DNS |
