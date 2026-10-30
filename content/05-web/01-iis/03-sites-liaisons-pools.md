---
title: Sites, liaisons et pools d'applications
description: Créer des sites, liaisons (IP, port, en-tête d'hôte), applications et répertoires virtuels ; régler finement les pools (identité, recyclage, délais, démarrage) ; documents par défaut, pages d'erreur et types MIME.
tags: [iis, sites, bindings, pools, configuration]
icon: layers
---

## Créer un site

### Interface graphique

Gestionnaire IIS → *Sites* → clic droit **Ajouter un site web** : nom, pool (créé automatiquement avec le même nom), chemin physique, liaison (type, IP, port, nom d'hôte).

### PowerShell

```powershell
Import-Module WebAdministration

New-Item -ItemType Directory D:\Sites\intranet -Force
New-WebAppPool -Name "intranet"
New-Website -Name "intranet" -PhysicalPath "D:\Sites\intranet" -ApplicationPool "intranet" `
            -HostHeader "intranet.corp.local" -Port 80 -IPAddress "*"

# Module IISAdministration (plus récent, transactionnel)
Import-Module IISAdministration
New-IISSite -Name "extranet" -PhysicalPath "D:\Sites\extranet" -BindingInformation "*:80:extranet.exemple.fr"
```

### appcmd

```powershell
$appcmd = "$env:windir\system32\inetsrv\appcmd.exe"
& $appcmd add apppool /name:"intranet" /managedRuntimeVersion:"" /managedPipelineMode:Integrated
& $appcmd add site /name:"intranet" /physicalPath:"D:\Sites\intranet" /bindings:"http/*:80:intranet.corp.local"
& $appcmd set app "intranet/" /applicationPool:"intranet"
```

## Liaisons (bindings)

Une liaison s'écrit `IP:port:nom-d'hôte`. HTTP.sys choisit le site selon la correspondance la plus précise.

| Liaison | Signification |
| --- | --- |
| `*:80:` | Toutes les IP, port 80, n'importe quel nom → site « attrape-tout » |
| `*:80:www.exemple.fr` | Toutes les IP, port 80, seulement si l'en-tête `Host` vaut `www.exemple.fr` |
| `192.168.10.20:80:` | Uniquement l'IP 192.168.10.20 |
| `*:8080:` | Port alternatif |
| `*:443:www.exemple.fr` + SNI | HTTPS avec indication du nom de serveur (plusieurs certificats sur une même IP) |

```powershell
# Ajouter / supprimer des liaisons
New-WebBinding -Name "intranet" -Protocol http -Port 80 -HostHeader "intranet"
New-WebBinding -Name "intranet" -Protocol https -Port 443 -HostHeader "intranet.corp.local" -SslFlags 1   # 1 = SNI
Remove-WebBinding -Name "intranet" -HostHeader "intranet" -Port 80
Get-WebBinding -Name "intranet"
```

> [!TIP]
> Créez toujours un **site par défaut** qui répond `404` ou redirige vers une page neutre pour les requêtes sans en-tête `Host` connu (accès direct par IP, scans). Cela évite d'exposer un site métier par erreur.

## Applications et répertoires virtuels

```powershell
# Application = dossier exécuté dans son propre pool
New-WebAppPool -Name "intranet-api"
New-WebApplication -Site "intranet" -Name "api" -PhysicalPath "D:\Sites\intranet-api" -ApplicationPool "intranet-api"

# Répertoire virtuel = simple alias vers un dossier (même pool que le parent)
New-WebVirtualDirectory -Site "intranet" -Name "docs" -PhysicalPath "\\nas01\docs"

# Répertoire virtuel sur partage UNC avec un compte de connexion dédié
Set-WebConfigurationProperty -PSPath IIS:\ -Filter "system.applicationHost/sites/site[@name='intranet']/application[@path='/']/virtualDirectory[@path='/docs']" `
  -Name userName -Value "CORP\svc-iis-docs"
Set-WebConfigurationProperty -PSPath IIS:\ -Filter "system.applicationHost/sites/site[@name='intranet']/application[@path='/']/virtualDirectory[@path='/docs']" `
  -Name password -Value "********"
```

## Pools d'applications

Le pool est la **frontière d'isolation** : identité, mémoire, plantage et recyclage sont propres à chaque pool. Bonne pratique : **un pool par application**.

### Paramètres essentiels

| Paramètre | Valeur conseillée | Explication |
| --- | --- | --- |
| Version .NET CLR (`managedRuntimeVersion`) | `""` (*Aucun code managé*) pour statique, PHP et ASP.NET Core ; `v4.0` pour ASP.NET 4.x | Évite de charger le CLR inutilement |
| Mode pipeline | `Integrated` | `Classic` uniquement pour d'anciennes applications ASP.NET 2.0 |
| Activer les applications 32 bits | `False` | `True` seulement si une DLL 32 bits l'impose |
| Identité | `ApplicationPoolIdentity` | Compte virtuel `IIS AppPool\<pool>`, sans mot de passe |
| Mode de démarrage (`startMode`) | `AlwaysRunning` pour les applications lourdes | Le processus démarre avec le service |
| Délai d'inactivité (`idleTimeout`) | `00:00:00` (désactivé) en production | Évite l'arrêt après 20 min sans requête |
| Recyclage périodique (`periodicRestart.time`) | `00:00:00` + recyclage à heure fixe (ex. 03:00) | Évite un recyclage toutes les 29 h en pleine journée |
| Limite de file (`queueLength`) | 1000 (défaut) à 5000 | Au-delà, HTTP.sys répond **503** |
| Protection contre les échecs rapides | Activée, 5 échecs / 5 min | Arrête le pool qui plante en boucle (503) |
| Nombre maximal de processus | 1 | > 1 = *web garden* (sessions en mémoire non partagées) |

```powershell
$pool = "intranet"
Set-ItemProperty IIS:\AppPools\$pool -Name managedRuntimeVersion -Value ""
Set-ItemProperty IIS:\AppPools\$pool -Name startMode -Value AlwaysRunning
Set-ItemProperty IIS:\AppPools\$pool -Name processModel.idleTimeout -Value ([TimeSpan]::Zero)
Set-ItemProperty IIS:\AppPools\$pool -Name recycling.periodicRestart.time -Value ([TimeSpan]::Zero)
Clear-ItemProperty IIS:\AppPools\$pool -Name recycling.periodicRestart.schedule
Set-ItemProperty IIS:\AppPools\$pool -Name recycling.periodicRestart.schedule -Value @{value="03:00:00"}
Set-ItemProperty IIS:\AppPools\$pool -Name recycling.periodicRestart.privateMemory -Value 2097152   # Ko → 2 Go
Set-ItemProperty IIS:\AppPools\$pool -Name recycling.logEventOnRecycle -Value "Time,Requests,Schedule,Memory,IsapiUnhealthy,OnDemand,ConfigChange,PrivateMemory"
```

### Identité du pool

| Identité | Usage |
| --- | --- |
| `ApplicationPoolIdentity` | Par défaut, recommandé. Accès réseau sous le compte **ordinateur** (`DOMAINE\SERVEUR$`). |
| `NetworkService` | Historique ; partagé par plusieurs services, à éviter. |
| `LocalSystem` | **Jamais** (privilèges maximaux). |
| Compte de domaine / **gMSA** | Accès à des ressources réseau (SQL Server en authentification Windows, partages) avec un compte dédié. |

```powershell
# Utiliser un compte de service géré de groupe (gMSA) — le mot de passe reste vide, le '$' final est obligatoire
Set-ItemProperty IIS:\AppPools\intranet -Name processModel -Value @{userName="CORP\gmsa-intranet$"; password=""; identityType=3}
```

> [!NOTE]
> Pour donner des droits NTFS à un pool : `icacls D:\Sites\intranet /grant "IIS AppPool\intranet:(OI)(CI)RX"`. Ajoutez `M` (modification) uniquement sur les dossiers qui doivent être écrits (uploads, cache).

### Recycler, démarrer, arrêter

```powershell
Restart-WebAppPool intranet
Stop-WebAppPool intranet ; Start-WebAppPool intranet
Get-WebAppPoolState intranet
& "$env:windir\system32\inetsrv\appcmd.exe" recycle apppool /apppool.name:intranet
& "$env:windir\system32\inetsrv\appcmd.exe" list wp     # processus w3wp actifs et leur pool
```

Le recyclage est **chevauché** par défaut : un nouveau processus démarre avant l'arrêt de l'ancien (`disallowOverlappingRotation=false`), ce qui évite toute coupure.

## Documents par défaut

```xml
<!-- web.config du site -->
<configuration>
  <system.webServer>
    <defaultDocument enabled="true">
      <files>
        <clear />
        <add value="index.html" />
        <add value="default.aspx" />
      </files>
    </defaultDocument>
  </system.webServer>
</configuration>
```

## Pages d'erreur personnalisées

```xml
<system.webServer>
  <httpErrors errorMode="DetailedLocalOnly" existingResponse="Replace">
    <remove statusCode="404" subStatusCode="-1" />
    <error statusCode="404" path="/erreurs/404.html" responseMode="ExecuteURL" />
    <remove statusCode="500" subStatusCode="-1" />
    <error statusCode="500" path="/erreurs/500.html" responseMode="ExecuteURL" />
  </httpErrors>
</system.webServer>
```

- `errorMode="DetailedLocalOnly"` : erreurs détaillées uniquement en local (sécurité).
- `existingResponse="PassThrough"` : laisse passer les erreurs générées par l'application (utile pour les API qui renvoient du JSON).

## Types MIME

IIS ne sert **aucun fichier dont l'extension est inconnue** (erreur 404.3). Ajoutez les types manquants :

```xml
<system.webServer>
  <staticContent>
    <remove fileExtension=".webmanifest" />
    <mimeMap fileExtension=".webmanifest" mimeType="application/manifest+json" />
    <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
    <mimeMap fileExtension=".avif" mimeType="image/avif" />
    <mimeMap fileExtension=".wasm" mimeType="application/wasm" />
  </staticContent>
</system.webServer>
```

## Redirection simple (sans URL Rewrite)

```xml
<system.webServer>
  <httpRedirect enabled="true" destination="https://www.exemple.fr$S$Q" exactDestination="true" httpResponseStatus="Permanent" />
</system.webServer>
```

`$S` conserve le chemin et `$Q` la chaîne de requête. Pour des règles plus fines (HTTPS, www, conditions), utilisez [[06-url-rewrite-arr|URL Rewrite]].

## Limites par site

```powershell
# Connexions simultanées, bande passante, délai de connexion
Set-ItemProperty "IIS:\Sites\intranet" -Name limits.maxConnections -Value 5000
Set-ItemProperty "IIS:\Sites\intranet" -Name limits.maxBandwidth -Value 104857600    # octets/s
Set-ItemProperty "IIS:\Sites\intranet" -Name limits.connectionTimeout -Value "00:02:00"
```

## Démarrage automatique et préchargement

Pour supprimer la latence de la première requête (compilation, initialisation) :

```powershell
Set-ItemProperty IIS:\AppPools\intranet -Name startMode -Value AlwaysRunning
Set-ItemProperty "IIS:\Sites\intranet" -Name applicationDefaults.preloadEnabled -Value $true
```

```xml
<!-- web.config : pages appelées au démarrage (module Application Initialization) -->
<system.webServer>
  <applicationInitialization doAppInitAfterRestart="true" skipManagedModules="false">
    <add initializationPage="/health" />
  </applicationInitialization>
</system.webServer>
```
