---
title: Héberger ASP.NET, ASP.NET Core et PHP
description: Publier des applications ASP.NET 4.x, ASP.NET Core (in-process / out-of-process, variables d'environnement, journaux stdout), PHP avec FastCGI, Python, et déployer avec Web Deploy.
tags: [iis, aspnet, aspnet core, dotnet, php, fastcgi, web deploy]
icon: code
---

## ASP.NET 4.x (.NET Framework)

Prérequis : fonctionnalités `Web-Asp-Net45` et `Web-Net-Ext45`, pool en **v4.0 / Intégré**.

```xml
<!-- web.config minimal -->
<configuration>
  <system.web>
    <compilation debug="false" targetFramework="4.8" />
    <httpRuntime targetFramework="4.8" maxRequestLength="51200" enableVersionHeader="false" executionTimeout="110" />
    <customErrors mode="RemoteOnly" defaultRedirect="~/erreur" />
    <sessionState mode="InProc" timeout="20" cookieSameSite="Lax" />
    <httpCookies httpOnlyCookies="true" requireSSL="true" />
  </system.web>
</configuration>
```

> [!WARNING]
> `compilation debug="true"` en production dégrade fortement les performances (pas d'optimisation, pas de mise en cache des scripts, délais d'exécution infinis). Vérifiez-le systématiquement après un déploiement.

### État de session dans une ferme

`InProc` ne fonctionne qu'avec un seul serveur (ou une affinité stricte). Pour une ferme :

```xml
<sessionState mode="SQLServer" sqlConnectionString="Data Source=sql01;Integrated Security=SSPI" cookieless="false" timeout="20" />
<!-- ou le service d'état : mode="StateServer" stateConnectionString="tcpip=state01:42424" -->
```

Pensez aussi à fixer une **machineKey** identique sur tous les serveurs (chiffrement des cookies d'authentification, ViewState) :

```xml
<machineKey validationKey="…" decryptionKey="…" validation="HMACSHA256" decryption="AES" />
```

## ASP.NET Core

### Prérequis

1. Installer le **ASP.NET Core Hosting Bundle** correspondant à la version cible (.NET 8 LTS, .NET 9…).
2. Redémarrer IIS (`net stop was /y` puis `net start w3svc`).
3. Créer un pool en **Aucun code managé** (`managedRuntimeVersion=""`).

```powershell
dotnet --list-runtimes          # vérifier les runtimes présents
New-WebAppPool -Name "monapi" ; Set-ItemProperty IIS:\AppPools\monapi -Name managedRuntimeVersion -Value ""
```

### Modèles d'hébergement

| Modèle | Fonctionnement | Avantage |
| --- | --- | --- |
| **In-process** (défaut) | L'application s'exécute dans `w3wp.exe` (serveur `IISHttpServer`) | Meilleures performances |
| **Out-of-process** | `w3wp` relaie vers le processus Kestrel (`dotnet.exe` / `app.exe`) | Isolation, compatibilité |

### web.config généré par `dotnet publish`

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" arguments=".\MonApi.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout"
                  hostingModel="inprocess" startupTimeLimit="120" shutdownTimeLimit="30">
        <environmentVariables>
          <environmentVariable name="ASPNETCORE_ENVIRONMENT" value="Production" />
          <environmentVariable name="ConnectionStrings__Default" value="Server=sql01;Database=app;Integrated Security=true;TrustServerCertificate=true" />
        </environmentVariables>
      </aspNetCore>
    </system.webServer>
  </location>
</configuration>
```

> [!TIP]
> Les variables d'environnement peuvent aussi être définies **par pool** (Éditeur de configuration → `system.applicationHost/applicationPools` → `environmentVariables`), ce qui évite que `dotnet publish` écrase vos secrets à chaque déploiement.

### Publication

```powershell
dotnet publish -c Release -o D:\Sites\monapi --runtime win-x64 --self-contained false
# Mettre l'application hors ligne pendant la copie (libère les DLL verrouillées)
New-Item D:\Sites\monapi\app_offline.htm -Value "<h1>Maintenance en cours</h1>"
robocopy .\publish D:\Sites\monapi /MIR /XF app_offline.htm web.config
Remove-Item D:\Sites\monapi\app_offline.htm
```

### Diagnostic des erreurs de démarrage

| Code | Cause typique |
| --- | --- |
| **500.19** | Module `AspNetCoreModuleV2` absent → Hosting Bundle non installé ou IIS non redémarré |
| **500.30** | Échec au démarrage in-process (exception dans `Program.cs`, configuration manquante) |
| **500.31** | Runtime .NET demandé introuvable |
| **500.32** | Bitness incorrecte (application x86 avec pool 64 bits ou inversement) |
| **500.35** | Plusieurs applications in-process dans le même pool |
| **502.5** | Échec du processus (out-of-process) |

Activez temporairement `stdoutLogEnabled="true"` (créer le dossier `logs` et donner l'écriture au pool), ou consultez l'**Observateur d'événements → Application** (source *IIS AspNetCore Module V2*). Pour reproduire hors IIS : `dotnet .\MonApi.dll` dans le dossier de publication.

### Derrière un reverse proxy

Dans l'application, activez le traitement des en-têtes transférés pour que `Request.Scheme` et l'IP client soient corrects :

```csharp
builder.Services.Configure<ForwardedHeadersOptions>(o =>
{
    o.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    o.KnownProxies.Add(System.Net.IPAddress.Parse("10.0.10.5"));
});
app.UseForwardedHeaders();
```

## PHP via FastCGI

1. Installer la fonctionnalité `Web-CGI`.
2. Télécharger PHP **NTS (Non Thread Safe) x64** sur `windows.php.net` et l'extraire dans `C:\PHP`.
3. Installer le redistribuable Visual C++ requis par la version de PHP.

```powershell
$php = "C:\PHP\php-cgi.exe"
# Déclarer l'application FastCGI au niveau serveur
Add-WebConfiguration -Filter "system.webServer/fastCgi" -Value @{fullPath=$php; maxInstances=8; instanceMaxRequests=10000; activityTimeout=600; requestTimeout=600}
Add-WebConfiguration -Filter "system.webServer/fastCgi/application[@fullPath='$php']/environmentVariables" -Value @{name='PHP_FCGI_MAX_REQUESTS'; value='10000'}
# Associer l'extension .php
New-WebHandler -Name "PHP_via_FastCGI" -Path "*.php" -Verb "*" -Modules FastCgiModule -ScriptProcessor $php -ResourceType File
# index.php comme document par défaut
Add-WebConfigurationProperty -Filter "system.webServer/defaultDocument/files" -Name "." -Value @{value='index.php'} -AtIndex 0
```

Réglages de `C:\PHP\php.ini` à vérifier :

```ini
cgi.force_redirect = 0
cgi.fix_pathinfo = 1
fastcgi.impersonate = 1
fastcgi.logging = 0
extension_dir = "C:\PHP\ext"
extension=curl
extension=mbstring
extension=openssl
extension=pdo_mysql
extension=intl
opcache.enable=1
opcache.memory_consumption=256
upload_max_filesize = 50M
post_max_size = 50M
date.timezone = Europe/Paris
expose_php = Off
display_errors = Off
log_errors = On
error_log = "C:\PHP\logs\php_errors.log"
```

> [!NOTE]
> `PHP_FCGI_MAX_REQUESTS` doit être **inférieur ou égal** à `instanceMaxRequests` : sinon PHP s'arrête de lui-même avant qu'IIS ne le recycle et des requêtes échouent en 500.

Pour les CMS (WordPress, Drupal…), ajoutez une règle URL Rewrite de type « front controller » :

```xml
<rule name="WordPress" stopProcessing="true">
  <match url=".*" />
  <conditions logicalGrouping="MatchAll">
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
  </conditions>
  <action type="Rewrite" url="index.php" />
</rule>
```

## Python (Django / Flask)

Deux options : **wfastcgi** (FastCGI, comme PHP, `pip install wfastcgi` puis `wfastcgi-enable`) ou, plus simple et robuste, faire tourner l'application avec **Waitress/Uvicorn** comme service Windows et publier via le [[06-url-rewrite-arr|reverse proxy ARR]].

## Web Deploy

Web Deploy (`msdeploy.exe`) publie et synchronise des sites, y compris la configuration IIS, les ACL et les certificats.

```powershell
$msdeploy = "C:\Program Files\IIS\Microsoft Web Deploy V3\msdeploy.exe"

# Synchroniser un site complet (contenu + config) vers un autre serveur
& $msdeploy -verb:sync -source:appHostConfig="intranet" -dest:appHostConfig="intranet",computerName="https://web02:8172/msdeploy.axd",userName="CORP\deploy",password="***",authType=Basic -allowUntrusted

# Créer un package d'un site
& $msdeploy -verb:sync -source:iisApp="intranet" -dest:package="C:\pkg\intranet.zip"

# Simulation (ce qui serait modifié)
& $msdeploy -verb:sync -source:contentPath="D:\Sites\intranet" -dest:contentPath="D:\Sites\intranet",computerName=web02 -whatif
```

Depuis Visual Studio ou un pipeline CI/CD (Azure DevOps, GitHub Actions, GitLab), le profil de publication *Web Deploy* utilise le même service (port **8172**, WMSvc).
