---
title: IIS — aide-mémoire des commandes
description: Référence complète des commandes IIS avec exemples — installation des fonctionnalités, sites, liaisons et SNI, certificats (import PFX, magasin centralisé), pools d'applications (identité gMSA, recyclage, état), applications et répertoires virtuels, appcmd (processus de travail, requêtes en cours, sauvegardes de configuration), durcissement (TLS par SCHANNEL, suites de chiffrement, HSTS, en-têtes Server et X-Powered-By, filtrage des requêtes), proxy inverse URL Rewrite et ARR, journaux W3C (champ X-Forwarded-For, HTTPERR), suivi des requêtes en échec, export de configuration et Web Deploy.
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

## Installation : fonctionnalités courantes

```powershell
Install-WindowsFeature Web-Server, Web-Mgmt-Console, Web-Scripting-Tools, Web-Asp-Net45, Web-WebSockets, Web-Http-Redirect, Web-Windows-Auth, Web-Url-Auth, Web-Request-Monitor, Web-Http-Tracing, Web-Dyn-Compression -IncludeManagementTools
Import-Module WebAdministration ; Import-Module IISAdministration
Get-WindowsFeature Web-* | Where-Object Installed | Select-Object Name
```

## Certificats et liaisons HTTPS

```powershell
Import-PfxCertificate -FilePath C:\Temp\intranet.pfx -CertStoreLocation Cert:\LocalMachine\My -Password (Read-Host -AsSecureString "Mot de passe du PFX")
$cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object Subject -like "*intranet.exemple.fr*" | Sort-Object NotAfter -Descending | Select-Object -First 1
New-IISSiteBinding -Name "Intranet" -BindingInformation "*:443:intranet.exemple.fr" -CertificateThumbPrint $cert.Thumbprint -CertStoreLocation "Cert:\LocalMachine\My" -Protocol https -SslFlag Sni
Get-IISSiteBinding -Name "Intranet"
netsh http show sslcert
# Magasin de certificats centralisé (fermes de serveurs) : un PFX par nom d'hôte sur un partage
Install-WindowsFeature Web-CertProvider
Enable-WebCentralCertProvider -CertStoreLocation "\\srv-fichiers\certs-iis" -UserName "CORP\svc-iis-certs" -Password (Read-Host "Mot de passe du compte") -PrivateKeyPassword (Read-Host "Mot de passe des PFX")
```

## Pools d'applications : identité, recyclage, état

```powershell
# Identité : compte de service géré (gMSA), mot de passe vide
Set-ItemProperty IIS:\AppPools\Intranet -Name processModel -Value @{userName="CORP\gmsa-web$"; password=""; identityType=3}
Set-ItemProperty IIS:\AppPools\Intranet -Name managedRuntimeVersion -Value ""          # « Aucun code managé » (ASP.NET Core)
Set-ItemProperty IIS:\AppPools\Intranet -Name recycling.periodicRestart.time -Value "00:00:00"
New-ItemProperty IIS:\AppPools\Intranet -Name recycling.periodicRestart.schedule -Value @{value="03:00:00"}
Get-WebAppPoolState -Name Intranet
Restart-WebAppPool -Name Intranet
& "$env:windir\system32\inetsrv\appcmd.exe" list wp                                   # processus w3wp et leur pool
& "$env:windir\system32\inetsrv\appcmd.exe" list requests /elapsed:5000                # requêtes en cours depuis plus de 5 s
```

## Durcissement

```powershell
# Désactiver TLS 1.0 et 1.1 côté serveur (SCHANNEL), puis redémarrer
foreach ($v in "TLS 1.0", "TLS 1.1") {
  $k = "HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols\$v\Server"
  New-Item $k -Force | Out-Null
  New-ItemProperty $k -Name Enabled -Value 0 -PropertyType DWord -Force | Out-Null
  New-ItemProperty $k -Name DisabledByDefault -Value 1 -PropertyType DWord -Force | Out-Null
}
Get-TlsCipherSuite | Select-Object Name | Select-Object -First 15
Disable-TlsCipherSuite -Name "TLS_RSA_WITH_3DES_EDE_CBC_SHA"

# HSTS (IIS 10 version 1709 et plus) avec redirection HTTP → HTTPS
& "$env:windir\system32\inetsrv\appcmd.exe" set config -section:system.applicationHost/sites "/[name='Intranet'].hsts.enabled:True" "/[name='Intranet'].hsts.max-age:31536000" "/[name='Intranet'].hsts.redirectHttpToHttps:True" /commit:apphost

# Masquer les en-têtes Server et X-Powered-By
Set-WebConfigurationProperty -PSPath MACHINE/WEBROOT/APPHOST -Filter "system.webServer/security/requestFiltering" -Name removeServerHeader -Value $true
Remove-WebConfigurationProperty -PSPath MACHINE/WEBROOT/APPHOST -Filter "system.webServer/httpProtocol/customHeaders" -Name "." -AtElement @{name='X-Powered-By'}

# Filtrage des requêtes : taille maximale (30 Mo) et verbes interdits
Set-WebConfigurationProperty -PSPath MACHINE/WEBROOT/APPHOST -Filter "system.webServer/security/requestFiltering/requestLimits" -Name maxAllowedContentLength -Value 31457280
Add-WebConfigurationProperty -PSPath MACHINE/WEBROOT/APPHOST -Filter "system.webServer/security/requestFiltering/verbs" -Name "." -Value @{verb='TRACE'; allowed='False'}
```

## Journaux et suivi des requêtes en échec

```powershell
# Ajouter l'adresse du client réel (derrière un répartiteur) aux journaux W3C
Add-WebConfigurationProperty -PSPath MACHINE/WEBROOT/APPHOST -Filter "system.applicationHost/sites/siteDefaults/logFile/customFields" -Name "." -Value @{logFieldName='X-Forwarded-For'; sourceName='X-Forwarded-For'; sourceType='RequestHeader'}
Get-ChildItem C:\inetpub\logs\LogFiles\W3SVC1 | Sort-Object LastWriteTime | Select-Object -Last 1 | Get-Content -Tail 20
Select-String -Path C:\inetpub\logs\LogFiles\W3SVC1\u_ex*.log -Pattern " 500 " | Select-Object -Last 10
Get-ChildItem C:\Windows\System32\LogFiles\HTTPERR | Sort-Object LastWriteTime | Select-Object -Last 1 | Get-Content -Tail 20   # erreurs de HTTP.sys (503, connexions coupées)
# Suivi des requêtes en échec (codes 500 à 599)
& "$env:windir\system32\inetsrv\appcmd.exe" configure trace "Intranet" /enablesite
& "$env:windir\system32\inetsrv\appcmd.exe" configure trace "Intranet/" /enable /statuscodes:500-599
Get-ChildItem C:\inetpub\logs\FailedReqLogFiles -Recurse | Sort-Object LastWriteTime | Select-Object -Last 5
```

## Sauvegarde, export, déploiement

```powershell
& "$env:windir\system32\inetsrv\appcmd.exe" add backup "avant-modification-$(Get-Date -Format yyyyMMdd)"
& "$env:windir\system32\inetsrv\appcmd.exe" list backup
& "$env:windir\system32\inetsrv\appcmd.exe" restore backup "avant-modification-20261115"
Export-IISConfiguration -PhysicalPath "\\srv-fichiers\iis-config" -KeyEncryptionPassword (Read-Host -AsSecureString "Mot de passe des clés") -Force
# Web Deploy : synchroniser le serveur web02 sur web01 (simulation d'abord avec -whatif)
& "$env:ProgramFiles\IIS\Microsoft Web Deploy V3\msdeploy.exe" -verb:sync -source:webServer,computerName=web01 -dest:webServer,computerName=web02 -whatif
```
