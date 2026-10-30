---
title: Mémo PowerShell et appcmd
description: Aide-mémoire des commandes d'administration IIS — modules WebAdministration et IISAdministration, appcmd, iisreset, netsh http — pour les sites, pools, liaisons, configuration et diagnostic.
tags: [iis, powershell, appcmd, mémo, commandes]
icon: square-terminal
---

## Modules PowerShell

| Module | Points forts |
| --- | --- |
| `WebAdministration` | Lecteur `IIS:\` (navigation comme un système de fichiers), cmdlets `*-Web*`, très documenté |
| `IISAdministration` | Plus rapide, basé sur `Microsoft.Web.Administration`, modifications transactionnelles (`Start-IISCommitDelay` / `Stop-IISCommitDelay`), fonctionne sous PowerShell 7 |

```powershell
Import-Module WebAdministration
Import-Module IISAdministration
Get-Command -Module WebAdministration, IISAdministration | Measure-Object
```

## Sites

| Action | WebAdministration | IISAdministration |
| --- | --- | --- |
| Lister | `Get-Website` | `Get-IISSite` |
| Créer | `New-Website -Name s -PhysicalPath p -Port 80 -HostHeader h` | `New-IISSite -Name s -PhysicalPath p -BindingInformation "*:80:h"` |
| Démarrer / arrêter | `Start-Website s` / `Stop-Website s` | `Start-IISSite s` / `Stop-IISSite s` |
| Supprimer | `Remove-Website s` | `Remove-IISSite s -Confirm:$false` |
| Liaisons | `Get-WebBinding`, `New-WebBinding`, `Remove-WebBinding` | `Get-IISSiteBinding`, `New-IISSiteBinding`, `Remove-IISSiteBinding` |

## Pools d'applications

```powershell
Get-IISAppPool | Select-Object Name, State, ManagedRuntimeVersion, ManagedPipelineMode
New-WebAppPool -Name pool1
Get-ItemProperty IIS:\AppPools\pool1 | Select-Object *            # toutes les propriétés
Set-ItemProperty IIS:\AppPools\pool1 -Name managedRuntimeVersion -Value ""
Restart-WebAppPool pool1
Remove-WebAppPool pool1
```

## Configuration générique

```powershell
# Lire / écrire n'importe quelle section
Get-WebConfigurationProperty -PSPath IIS:\ -Location "Site/app" -Filter system.webServer/security/authentication/windowsAuthentication -Name enabled
Set-WebConfigurationProperty -PSPath IIS:\ -Location "Site/app" -Filter system.webServer/security/authentication/windowsAuthentication -Name enabled -Value $true
Add-WebConfigurationProperty -PSPath "IIS:\Sites\Site" -Filter system.webServer/defaultDocument/files -Name "." -Value @{value="accueil.html"}
Clear-WebConfiguration -PSPath "IIS:\Sites\Site" -Filter system.webServer/httpProtocol/customHeaders

# Transaction groupée (IISAdministration)
Start-IISCommitDelay
$sm = Get-IISServerManager
$site = $sm.Sites["intranet"]
$site.Limits.MaxConnections = 2000
Stop-IISCommitDelay -Commit $true
```

> [!TIP]
> Dans le Gestionnaire IIS, l'**Éditeur de configuration** propose le bouton *Générer un script* : il produit automatiquement l'équivalent appcmd, PowerShell, C# ou JavaScript d'une modification faite à la souris.

## appcmd.exe

```powershell
Set-Alias appcmd "$env:windir\system32\inetsrv\appcmd.exe"

appcmd list site                                        # sites et état
appcmd list app                                         # applications et pool associé
appcmd list apppool /state:Stopped                      # pools arrêtés
appcmd list vdir
appcmd list wp                                          # processus de travail
appcmd list requests /elapsed:5000                      # requêtes en cours > 5 s
appcmd list config "Default Web Site" /section:httpErrors
appcmd set config "Default Web Site" /section:directoryBrowse /enabled:false
appcmd set config /section:urlCompression /doDynamicCompression:true /commit:apphost
appcmd set apppool "pool1" /processModel.idleTimeout:00:00:00
appcmd add site /name:test /bindings:http/*:8080: /physicalPath:D:\Sites\test
appcmd delete site test
appcmd start site "Default Web Site" ; appcmd stop site "Default Web Site"
appcmd recycle apppool /apppool.name:pool1
appcmd add backup avant-modif ; appcmd list backup ; appcmd restore backup avant-modif
appcmd unlock config /section:system.webServer/handlers
appcmd list site /xml | appcmd set site /in /serverAutoStart:true   # traitement en masse via XML
```

## Redémarrages

| Commande | Effet |
| --- | --- |
| `Restart-WebAppPool pool1` | Recycle un pool (chevauché, sans coupure) |
| `Stop-Website s` / `Start-Website s` | Arrête / démarre un site (les autres continuent) |
| `iisreset /noforce` | Redémarre tous les services IIS (**coupure** pour tous les sites) |
| `iisreset /status` | État des services |
| `net stop was /y` puis `net start w3svc` | Redémarrage complet après installation d'un module |

> [!WARNING]
> `iisreset` est rarement nécessaire : il coupe **tous** les sites et vide tous les caches. Préférez le recyclage ciblé du pool concerné.

## HTTP.sys (netsh)

```powershell
netsh http show servicestate view=requestq       # files de requêtes par pool
netsh http show sslcert                          # certificats liés (IP:port, hostname:port, ccs)
netsh http show urlacl                           # réservations d'URL
netsh http show iplisten                         # IP écoutées (vide = toutes)
netsh http add iplisten ipaddress=10.0.10.20     # limiter l'écoute à une IP
netsh http show cachestate                       # cache noyau
```

## Diagnostic rapide

```powershell
Test-NetConnection web01 -Port 443
Invoke-WebRequest https://intranet.corp.local -UseDefaultCredentials -UseBasicParsing | Select-Object StatusCode, Headers
curl.exe -vkI https://intranet.corp.local --resolve intranet.corp.local:443:10.0.10.20   # tester un serveur précis d'une ferme
Get-EventLog -LogName System -Source WAS -Newest 20
Get-Content C:\inetpub\logs\LogFiles\W3SVC1\u_ex$(Get-Date -Format yyMMdd).log -Tail 50 -Wait
```

## Fichiers et dossiers clés

| Chemin | Contenu |
| --- | --- |
| `%windir%\System32\inetsrv\config\applicationHost.config` | Configuration serveur |
| `%windir%\System32\inetsrv\backup\` | Sauvegardes `appcmd add backup` |
| `C:\inetpub\history\` | Historique automatique de configuration |
| `C:\inetpub\logs\LogFiles\` | Journaux W3C (sites, FTP) |
| `C:\inetpub\logs\FailedReqLogFiles\` | Traces FREB |
| `%windir%\System32\LogFiles\HTTPERR\` | Erreurs HTTP.sys |
| `C:\inetpub\temp\IIS Temporary Compressed Files\` | Cache de compression statique |
| `%windir%\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files\` | Compilation ASP.NET 4.x |
