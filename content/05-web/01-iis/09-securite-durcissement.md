---
title: Sécurité et durcissement
description: Liste de contrôle de durcissement IIS — moindre privilège, ACL, en-têtes de sécurité, masquage des versions, désactivation des fonctionnalités inutiles, protection des fichiers de configuration, journalisation et mises à jour.
tags: [iis, sécurité, durcissement, headers, csp, cis]
icon: shield
---

> [!IMPORTANT]
> Le durcissement s'applique **par couches** : système (correctifs, pare-feu, antivirus), TLS ([[04-https-certificats]]), IIS (ce document), application (code, dépendances) et supervision ([[11-logs-depannage]]). Le référentiel **CIS Microsoft IIS 10 Benchmark** sert de base d'audit.

## 1. Installer le strict nécessaire

```powershell
# Retirer ce qui n'est pas utilisé
Uninstall-WindowsFeature Web-Dir-Browsing, Web-DAV-Publishing, Web-Ftp-Server, Web-CGI, Web-Includes, Web-ASP
Get-WindowsFeature Web-* | Where-Object Installed | Select-Object Name
```

- Supprimer le site **Default Web Site** et le contenu `C:\inetpub\wwwroot` d'exemple, ou le laisser vide avec une réponse 404.
- Placer les contenus sur un volume dédié (`D:\Sites`), jamais sur le volume système.

## 2. Moindre privilège

| Élément | Règle |
| --- | --- |
| Identité de pool | `ApplicationPoolIdentity` ou gMSA dédiée, jamais `LocalSystem` |
| Un pool par application | Isolation mémoire, identité et plantage |
| ACL NTFS | Lecture/exécution (`RX`) pour l'identité du pool ; écriture (`M`) seulement sur les dossiers d'upload, **sans droit d'exécution de script** sur ces dossiers |
| Compte anonyme | Utiliser l'identité du pool plutôt qu'`IUSR` (une seule identité à gérer) |
| Administrateurs IIS | Délégation via le Gestionnaire IIS (*Autorisations du Gestionnaire IIS*) plutôt que des droits d'administrateur local |

```powershell
# ACL type d'un site
$site = "D:\Sites\intranet"
icacls $site /inheritance:r
icacls $site /grant "BUILTIN\Administrateurs:(OI)(CI)F" "NT AUTHORITY\SYSTEM:(OI)(CI)F" "IIS AppPool\intranet:(OI)(CI)RX"
icacls "$site\uploads" /grant "IIS AppPool\intranet:(OI)(CI)M"
```

```xml
<!-- Interdire l'exécution de scripts dans le dossier d'upload -->
<location path="uploads">
  <system.webServer>
    <handlers accessPolicy="Read" />
  </system.webServer>
</location>
```

## 3. Masquer les informations techniques

| En-tête / fuite | Correction |
| --- | --- |
| `Server: Microsoft-IIS/10.0` | `<requestFiltering removeServerHeader="true" />` (IIS 10 1709+) |
| `X-Powered-By: ASP.NET` | Supprimer dans *En-têtes de réponse HTTP* |
| `X-AspNet-Version` | `<httpRuntime enableVersionHeader="false" />` |
| `X-AspNetMvc-Version` | `MvcHandler.DisableMvcResponseHeader = true;` dans `Global.asax` |
| Pages d'erreur détaillées | `httpErrors errorMode="DetailedLocalOnly"` + `customErrors mode="RemoteOnly"` |
| Exploration de répertoires | `<directoryBrowse enabled="false" />` |

```xml
<system.webServer>
  <security>
    <requestFiltering removeServerHeader="true" />
  </security>
  <httpProtocol>
    <customHeaders>
      <remove name="X-Powered-By" />
    </customHeaders>
  </httpProtocol>
</system.webServer>
```

## 4. En-têtes de sécurité

```xml
<system.webServer>
  <httpProtocol>
    <customHeaders>
      <add name="X-Content-Type-Options" value="nosniff" />
      <add name="X-Frame-Options" value="SAMEORIGIN" />
      <add name="Referrer-Policy" value="strict-origin-when-cross-origin" />
      <add name="Permissions-Policy" value="camera=(), microphone=(), geolocation=()" />
      <add name="Cross-Origin-Opener-Policy" value="same-origin" />
      <add name="Content-Security-Policy" value="default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; frame-ancestors 'self'; object-src 'none'; base-uri 'self'" />
    </customHeaders>
  </httpProtocol>
</system.webServer>
```

> [!TIP]
> Déployez la CSP d'abord en mode **`Content-Security-Policy-Report-Only`** pour repérer ce qui serait bloqué, puis passez en mode bloquant. HSTS se configure à part (voir [[04-https-certificats]]).

### Cookies

```xml
<system.web>
  <httpCookies httpOnlyCookies="true" requireSSL="true" sameSite="Lax" />
  <authentication mode="Forms"><forms requireSSL="true" cookieSameSite="Lax" /></authentication>
</system.web>
```

Pour les applications non .NET, une règle sortante URL Rewrite peut ajouter `; Secure; HttpOnly` aux en-têtes `Set-Cookie`.

## 5. Filtrage des demandes et verbes

Voir la section détaillée dans [[05-authentification-autorisation]] : limiter les verbes (`GET`, `HEAD`, `POST`, plus `PUT`/`DELETE`/`PATCH` pour les API), refuser les extensions sensibles (`.config`, `.bak`, `.old`, `.sql`, `.pfx`), masquer les segments (`.git`, `bin`, `App_Data`), limiter la taille des requêtes.

Désactiver la méthode `TRACE` et `OPTIONS` si inutiles :

```xml
<requestFiltering>
  <verbs allowUnlisted="true">
    <add verb="TRACE" allowed="false" />
    <add verb="TRACK" allowed="false" />
  </verbs>
</requestFiltering>
```

## 6. Protéger la configuration

- Chiffrer les sections sensibles (chaînes de connexion, mots de passe des répertoires virtuels) :

```powershell
# Sections .NET d'un web.config
& "$env:windir\Microsoft.NET\Framework64\v4.0.30319\aspnet_regiis.exe" -pef "connectionStrings" "D:\Sites\intranet"
# Les mots de passe dans applicationHost.config sont chiffrés automatiquement (fournisseur AesProvider / IISWASOnlyAesProvider)
```

- Sauvegarder la configuration avant chaque changement (`appcmd add backup`) et activer l'historique automatique (`system.applicationHost/configHistory`, 10 versions par défaut dans `C:\inetpub\history`).
- Restreindre les ACL de `%windir%\system32\inetsrv\config` aux administrateurs et à SYSTEM.

## 7. Journalisation et détection

- Activer les journaux W3C **avec tous les champs utiles** (dont `X-Forwarded-For` derrière un proxy), les stocker hors du volume système et les envoyer vers un SIEM.
- Activer FREB sur les codes 500-599 en production (fichiers limités en nombre).
- Surveiller les rafales de 401/403/404 (scans, brute force) — voir [[11-logs-depannage]].

## 8. Système et réseau

- Correctifs Windows mensuels (IIS est mis à jour par Windows Update).
- Pare-feu : n'ouvrir que 80/443 (et UDP 443 pour HTTP/3) ; WMSvc (8172) seulement depuis le réseau d'administration.
- Protocoles TLS obsolètes désactivés, suites faibles retirées.
- Antivirus avec **exclusions** adaptées : `%SystemDrive%\inetpub\temp\IIS Temporary Compressed Files`, `%windir%\Microsoft.NET\Framework64\v4.0.30319\Temporary ASP.NET Files`, `%windir%\system32\inetsrv\config` (selon la politique de l'éditeur).
- Placer les serveurs exposés en **DMZ**, derrière un WAF ou un reverse proxy filtrant, avec les flux sortants limités.

## 9. Audit rapide

```powershell
# En-têtes renvoyés
(Invoke-WebRequest https://www.exemple.fr -Method Head -UseBasicParsing).Headers

# Pools exécutés avec des comptes à privilèges
Get-ChildItem IIS:\AppPools | Select-Object Name, @{n='Identité';e={$_.processModel.identityType}}, @{n='Compte';e={$_.processModel.userName}}

# Sites avec exploration de répertoire active
Get-Website | ForEach-Object { [pscustomobject]@{ Site=$_.Name; DirBrowse=(Get-WebConfigurationProperty -PSPath IIS:\ -Location $_.Name -Filter system.webServer/directoryBrowse -Name enabled).Value } }

# Liaisons HTTP sans équivalent HTTPS
Get-WebBinding | Where-Object protocol -eq 'http' | Select-Object bindingInformation, ItemXPath
```

Outils d'analyse externes : SSL Labs, `testssl.sh`, Mozilla Observatory (en-têtes), OWASP ZAP (application).

## Liste de contrôle

- [ ] Fonctionnalités inutiles désinstallées, site par défaut neutralisé
- [ ] Un pool par application, identité non privilégiée
- [ ] ACL NTFS minimales, pas d'exécution dans les dossiers d'upload
- [ ] En-têtes `Server`, `X-Powered-By`, `X-AspNet-Version` supprimés
- [ ] Pages d'erreur détaillées désactivées à distance, `debug="false"`
- [ ] HTTPS partout, redirection 301, HSTS, TLS 1.2+ uniquement
- [ ] En-têtes de sécurité (CSP, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy)
- [ ] Filtrage des demandes : verbes, extensions, segments, tailles
- [ ] Restrictions IP sur les zones d'administration, restrictions dynamiques
- [ ] Secrets chiffrés ou hors des fichiers (variables d'environnement, coffre)
- [ ] Journaux W3C complets centralisés, FREB prêt
- [ ] Sauvegarde de configuration automatisée et testée
