---
title: IIS — aide-mémoire des commandes
description: Commandes IIS avec exemples — installation des fonctionnalités, sites, liaisons HTTP/HTTPS et certificats, pools d'applications (identité, recyclage), applications et répertoires virtuels, modules IIS (IISAdministration, WebAdministration), appcmd, configuration web.config, journaux, redémarrages (iisreset), URL Rewrite et ARR, sauvegarde de configuration, Web Deploy, diagnostic (Failed Request Tracing, codes HTTP.SYS).
tags: [aide-mémoire, iis, powershell, appcmd, windows server, web]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|IIS]].

## Installation

```powershell
Install-WindowsFeature Web-Server, Web-Mgmt-Console, Web-Asp-Net45, Web-Http-Redirect, Web-Request-Monitor, Web-Http-Tracing -IncludeManagementTools
Get-WindowsFeature Web-* | Where-Object Installed
# Postes Windows 10/11
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-ManagementConsole
```

## Sites et liaisons

```powershell
Import-Module IISAdministration
New-IISSite -Name "Intranet" -PhysicalPath "D:\Sites\intranet" -BindingInformation "*:80:intranet.exemple.fr"
Get-IISSite
Stop-IISSite -Name "Default Web Site" -Confirm:$false
Start-IISSite -Name "Intranet"
# Liaison HTTPS avec un certificat du magasin (SNI)
$cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object Subject -like "*intranet.exemple.fr*"
New-IISSiteBinding -Name "Intranet" -BindingInformation "*:443:intranet.exemple.fr" -CertificateThumbPrint $cert.Thumbprint -CertStoreLocation "Cert:\LocalMachine\My" -Protocol https -SslFlag Sni
Get-IISSiteBinding -Name "Intranet"
Remove-IISSiteBinding -Name "Intranet" -BindingInformation "*:80:intranet.exemple.fr" -Confirm:$false
# Module historique WebAdministration (toujours utile)
Import-Module WebAdministration
Get-ChildItem IIS:\Sites
New-WebBinding -Name "Intranet" -Protocol https -Port 443 -HostHeader "intranet.exemple.fr" -SslFlags 1
```

## Pools d'applications

```powershell
New-WebAppPool -Name "IntranetPool"
Set-ItemProperty IIS:\AppPools\IntranetPool -Name managedRuntimeVersion -Value ""            # « Pas de code managé » (ASP.NET Core)
Set-ItemProperty IIS:\AppPools\IntranetPool -Name processModel.identityType -Value ApplicationPoolIdentity
Set-ItemProperty IIS:\AppPools\IntranetPool -Name processModel.idleTimeout -Value "00:00:00"
Set-ItemProperty IIS:\AppPools\IntranetPool -Name recycling.periodicRestart.time -Value "00:00:00"
Set-ItemProperty IIS:\Sites\Intranet -Name applicationPool -Value IntranetPool
Restart-WebAppPool -Name IntranetPool
Get-IISAppPool | Select-Object Name, State, ManagedRuntimeVersion
# Droits NTFS pour l'identité du pool
icacls "D:\Sites\intranet" /grant "IIS AppPool\IntranetPool:(OI)(CI)RX"
```

## Applications et répertoires virtuels

```powershell
New-WebApplication -Site "Intranet" -Name "api" -PhysicalPath "D:\Sites\api" -ApplicationPool "IntranetPool"
New-WebVirtualDirectory -Site "Intranet" -Name "docs" -PhysicalPath "\\nas\docs"
Get-WebApplication -Site "Intranet"
```

## appcmd

```powershell
$appcmd = "$env:windir\system32\inetsrv\appcmd.exe"
& $appcmd list site
& $appcmd list apppool /state:Started
& $appcmd list wp                                            # processus w3wp par pool
& $appcmd list requests                                      # requêtes en cours
& $appcmd set config "Intranet" /section:directoryBrowse /enabled:false
& $appcmd set config /section:requestFiltering /requestLimits.maxAllowedContentLength:104857600
& $appcmd add backup "avant-maj-2026-10-29"
& $appcmd list backup
& $appcmd restore backup "avant-maj-2026-10-29"
```

## Configuration courante

```powershell
# En-têtes de sécurité et masquage de la version
Add-WebConfigurationProperty -PSPath "IIS:\Sites\Intranet" -Filter "system.webServer/httpProtocol/customHeaders" -Name "." -Value @{name="Strict-Transport-Security"; value="max-age=31536000"}
Remove-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/httpProtocol/customHeaders" -Name "." -AtElement @{name="X-Powered-By"}
Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/security/requestFiltering" -Name "removeServerHeader" -Value $true
# Authentification Windows sur un site
Set-WebConfigurationProperty -Filter "/system.webServer/security/authentication/windowsAuthentication" -Name enabled -Value $true -PSPath "IIS:\" -Location "Intranet"
Set-WebConfigurationProperty -Filter "/system.webServer/security/authentication/anonymousAuthentication" -Name enabled -Value $false -PSPath "IIS:\" -Location "Intranet"
Get-WebConfiguration -Filter "system.webServer/security/authentication/*" -PSPath "IIS:\Sites\Intranet" -Recurse | Select-Object SectionPath, enabled
```

## Service, journaux, diagnostic

```powershell
iisreset /status
iisreset /restart
Restart-Service W3SVC, WAS
Get-ChildItem "C:\inetpub\logs\LogFiles\W3SVC*" | Sort-Object LastWriteTime | Select-Object -Last 1 | Get-ChildItem | Sort-Object LastWriteTime | Select-Object -Last 1 | Get-Content -Tail 20
Get-Content "$env:windir\System32\LogFiles\HTTPERR\httperr*.log" -Tail 20      # erreurs HTTP.SYS (503, Connection_Dropped…)
netsh http show sslcert
netsh http show urlacl
# Failed Request Tracing (activer la fonctionnalité Web-Http-Tracing)
& $appcmd configure trace "Intranet" /enablesite
& $appcmd configure trace "Intranet" /enable /path:* /statuscodes:500-599
```

## Proxy inverse (URL Rewrite + ARR)

```powershell
# Après installation des modules URL Rewrite et Application Request Routing
Set-WebConfigurationProperty -PSPath "MACHINE/WEBROOT/APPHOST" -Filter "system.webServer/proxy" -Name "enabled" -Value $true
```

```xml
<!-- web.config du site frontal -->
<system.webServer>
  <rewrite>
    <rules>
      <rule name="Vers application" stopProcessing="true">
        <match url="(.*)" />
        <action type="Rewrite" url="http://10.0.30.21:8080/{R:1}" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
```
