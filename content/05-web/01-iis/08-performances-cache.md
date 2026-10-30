---
title: Performances, compression et cache
description: Compression statique et dynamique (gzip, Brotli), cache de sortie et cache noyau, en-têtes de cache client, HTTP/2 et HTTP/3, réglages des pools, de HTTP.sys et des limites, compteurs de performance.
tags: [iis, performance, compression, cache, http2, http3, tuning]
icon: gauge
---

## Compression HTTP

| Type | Contenu | Coût CPU | Activation |
| --- | --- | --- | --- |
| **Statique** | Fichiers (CSS, JS, SVG, JSON…) compressés une fois puis mis en cache disque | Faible | Recommandée partout |
| **Dynamique** | Réponses générées (ASP.NET, PHP, API) compressées à chaque requête | Moyen | Recommandée si le CPU le permet |

```powershell
Install-WindowsFeature Web-Stat-Compression, Web-Dyn-Compression
Set-WebConfigurationProperty -PSPath IIS:\ -Filter system.webServer/urlCompression -Name doStaticCompression -Value $true
Set-WebConfigurationProperty -PSPath IIS:\ -Filter system.webServer/urlCompression -Name doDynamicCompression -Value $true
```

```xml
<!-- applicationHost.config : types compressés et seuils -->
<httpCompression directory="%SystemDrive%\inetpub\temp\IIS Temporary Compressed Files"
                 staticCompressionIgnoreHitFrequency="true" minFileSizeForComp="1024"
                 dynamicCompressionDisableCpuUsage="90" dynamicCompressionEnableCpuUsage="50">
  <scheme name="gzip" dll="%Windir%\system32\inetsrv\gzip.dll" staticCompressionLevel="9" dynamicCompressionLevel="4" />
  <staticTypes>
    <add mimeType="text/*" enabled="true" />
    <add mimeType="application/javascript" enabled="true" />
    <add mimeType="application/json" enabled="true" />
    <add mimeType="image/svg+xml" enabled="true" />
    <add mimeType="*/*" enabled="false" />
  </staticTypes>
  <dynamicTypes>
    <add mimeType="text/*" enabled="true" />
    <add mimeType="application/json" enabled="true" />
    <add mimeType="application/json; charset=utf-8" enabled="true" />
    <add mimeType="*/*" enabled="false" />
  </dynamicTypes>
</httpCompression>
```

> [!NOTE]
> Par défaut IIS ne compresse un fichier statique qu'après **2 requêtes en 10 secondes** (`frequentHitThreshold`). `staticCompressionIgnoreHitFrequency="true"` supprime cette heuristique, utile pour les tests et les sites peu fréquentés.

### Brotli

Microsoft publie le module **IIS Compression** (`iiscompression_amd64.msi`) qui ajoute `iisbrotli.dll` et une version améliorée de `iiszlib.dll` :

```xml
<scheme name="br" dll="%ProgramFiles%\IIS\IIS Compression\iisbrotli.dll" dynamicCompressionLevel="5" staticCompressionLevel="11" />
<scheme name="gzip" dll="%ProgramFiles%\IIS\IIS Compression\iiszlib.dll" dynamicCompressionLevel="4" staticCompressionLevel="9" />
```

L'ordre des `scheme` détermine la préférence quand le client accepte les deux (`Accept-Encoding: br, gzip`).

> [!WARNING]
> Ne compressez pas les formats déjà compressés (JPEG, PNG, MP4, ZIP, WOFF2) : gain nul et CPU gaspillé. Attention aussi aux réponses contenant des secrets reflétés (attaque BREACH) sur HTTPS.

## Cache côté client

```xml
<system.webServer>
  <staticContent>
    <!-- 7 jours pour tout le contenu statique -->
    <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="7.00:00:00" />
  </staticContent>
</system.webServer>

<!-- Ressources versionnées (app.3f2a1c.js) : cache long et immuable -->
<location path="assets">
  <system.webServer>
    <staticContent>
      <clientCache cacheControlMode="UseMaxAge" cacheControlMaxAge="365.00:00:00" cacheControlCustom="immutable" />
    </staticContent>
  </system.webServer>
</location>

<!-- Pas de cache pour la page d'entrée d'une SPA -->
<location path="index.html">
  <system.webServer>
    <staticContent><clientCache cacheControlMode="DisableCache" /></staticContent>
  </system.webServer>
</location>
```

IIS gère nativement les **ETag** et `Last-Modified` pour le contenu statique : un navigateur qui revalide reçoit `304 Not Modified`. Dans une ferme, les ETag diffèrent d'un serveur à l'autre (ils incluent un compteur de modification de la configuration) : le cache navigateur est alors invalidé à chaque changement de serveur. Supprimez-les avec une règle sortante URL Rewrite qui vide `RESPONSE_ETag` ; `Last-Modified` suffit à la revalidation.

## Cache de sortie (Output Caching)

| Cache | Où | Particularités |
| --- | --- | --- |
| **Cache noyau** (HTTP.sys) | Mode noyau | Ultra-rapide, mais pas pour les requêtes authentifiées ni les chaînes de requête variables |
| **Cache utilisateur** (IIS) | Mode utilisateur | Variation par chaîne de requête ou en-tête, durée configurable |

```xml
<system.webServer>
  <caching enabled="true" enableKernelCache="true">
    <profiles>
      <add extension=".php" policy="CacheForTimePeriod" kernelCachePolicy="DontCache" duration="00:00:30" varyByQueryString="page,id" />
      <add extension=".png" policy="CacheUntilChange" kernelCachePolicy="CacheUntilChange" location="Any" />
    </profiles>
  </caching>
</system.webServer>
```

```powershell
netsh http show cachestate          # contenu du cache noyau
```

## HTTP/2 et HTTP/3

- **HTTP/2** : activé automatiquement sur les liaisons HTTPS depuis Windows Server 2016 (multiplexage, compression d'en-têtes). Aucune configuration requise.
- **HTTP/3 (QUIC)** : Windows Server 2022+. Nécessite TLS 1.3, le port **UDP 443** ouvert et l'annonce de l'en-tête `Alt-Svc`.

```powershell
# Activer HTTP/3 (redémarrage requis)
reg add "HKLM\SYSTEM\CurrentControlSet\Services\HTTP\Parameters" /v EnableHttp3 /t REG_DWORD /d 1 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\HTTP\Parameters" /v EnableAltSvc /t REG_DWORD /d 1 /f
New-NetFirewallRule -DisplayName "HTTP/3 (QUIC) UDP 443" -Direction Inbound -Protocol UDP -LocalPort 443 -Action Allow
```

## Réglages du pool et du processus

| Réglage | Recommandation |
| --- | --- |
| Recyclage | Planifié en heure creuse, pas toutes les 29 h (voir [[03-sites-liaisons-pools]]) |
| `idleTimeout` | 0 pour les applications critiques |
| `startMode` + `preloadEnabled` | Supprime le temps de chauffe |
| `queueLength` | 5000 si pics de charge (sinon 503 immédiats) |
| `maxProcesses` | 1 (une *web garden* ne sert qu'aux applications sans état gourmandes en CPU) |
| `cpu.limit` / `cpu.action` | Protection contre une application qui monopolise le CPU (`ThrottleUnderLoad`) |
| Bitness | 64 bits (plus de mémoire adressable) sauf contrainte de dépendance |

### Limites de concurrence ASP.NET 4.x

```xml
<!-- aspnet.config du framework (%windir%\Microsoft.NET\Framework64\v4.0.30319\aspnet.config) -->
<system.web>
  <applicationPool maxConcurrentRequestsPerCPU="5000" maxConcurrentThreadsPerCPU="0" requestQueueLimit="5000" />
</system.web>
```

Pour les applications qui appellent beaucoup de services distants, augmentez le nombre de connexions sortantes simultanées (`system.net/connectionManagement/add maxconnection`) — sans objet pour .NET Core qui n'est pas limité.

## Réglages HTTP.sys (registre)

`HKLM\SYSTEM\CurrentControlSet\Services\HTTP\Parameters` :

| Valeur | Défaut | Usage |
| --- | --- | --- |
| `MaxConnections` | illimité | Plafond global de connexions |
| `MaxFieldLength` / `MaxRequestBytes` | 16 Ko | En-têtes volumineux (gros tickets Kerberos → erreur **400 Request Header Too Long**) |
| `UriMaxUriBytes` | 16 Ko | Taille maximale d'URL |
| `UrlSegmentMaxLength` | 260 | Longueur d'un segment d'URL |
| `IdleConnectionsHighMark` | — | Connexions inactives conservées |

> [!TIP]
> Les utilisateurs membres de nombreux groupes AD ont des tickets Kerberos volumineux : passez `MaxFieldLength` à **65534** et `MaxRequestBytes` à **16777216** (puis redémarrez le service HTTP ou le serveur) si des « 400 Bad Request – Request Header too long » apparaissent.

## Limites de requêtes et délais

```powershell
# Délai de connexion (keep-alive) et taille minimale de débit (anti-slowloris)
Set-WebConfigurationProperty -PSPath IIS:\ -Filter system.applicationHost/webLimits -Name connectionTimeout -Value "00:01:00"
Set-WebConfigurationProperty -PSPath IIS:\ -Filter system.applicationHost/webLimits -Name minBytesPerSecond -Value 240
Set-WebConfigurationProperty -PSPath IIS:\ -Filter system.applicationHost/webLimits -Name headerWaitTimeout -Value "00:00:30"
```

## Mesurer

### Compteurs de performance essentiels

| Objet / compteur | Signification |
| --- | --- |
| `Web Service(_Total)\Current Connections` | Connexions actives |
| `Web Service(_Total)\Total Method Requests/sec` | Débit de requêtes |
| `HTTP Service Request Queues(*)\CurrentQueueSize` | Requêtes en attente par pool (> 0 durablement = saturation) |
| `HTTP Service Request Queues(*)\RejectedRequests` | Rejets (503) |
| `W3SVC_W3WP(*)\Active Requests` | Requêtes en cours par processus |
| `APP_POOL_WAS(*)\Current Application Pool State` | État du pool (3 = démarré) |
| `ASP.NET Applications(__Total__)\Requests/Sec`, `Requests In Application Queue` | Charge ASP.NET 4.x |
| `Process(w3wp*)\% Processor Time`, `Private Bytes` | CPU et mémoire des processus |

```powershell
Get-Counter '\HTTP Service Request Queues(*)\CurrentQueueSize','\Web Service(_Total)\Current Connections' -SampleInterval 2 -MaxSamples 10
```

### Requêtes en cours

```powershell
& "$env:windir\system32\inetsrv\appcmd.exe" list requests /elapsed:5000    # requêtes de plus de 5 s
Get-WebRequest -AppPool "intranet"                                          # module WebAdministration
```

### Tests de charge

- **Bombardier**, **k6**, **JMeter** ou **wrk** depuis une machine distincte.
- Surveillez le temps de réponse au 95e centile, la file HTTP.sys et le CPU du serveur pendant le test.
