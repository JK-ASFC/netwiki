---
title: Authentification et autorisation
description: Méthodes d'authentification IIS (anonyme, de base, Windows/Kerberos, Digest), SPN et délégation, règles d'autorisation d'URL, restrictions IP et dynamiques, filtrage des demandes.
tags: [iis, authentification, kerberos, ntlm, spn, autorisation, sécurité]
icon: user-check
---

## Vue d'ensemble

IIS distingue deux étapes du pipeline :

1. **Authentification** — *qui* est l'utilisateur ? (anonyme, Windows, de base, certificat…)
2. **Autorisation** — a-t-il le *droit* d'accéder à la ressource ? (règles d'URL, ACL NTFS, restrictions IP)

Les méthodes se configurent dans la section `system.webServer/security/authentication`, **verrouillée par défaut** au niveau serveur : modifiez-la dans `applicationHost.config` (balise `<location>`) ou déverrouillez-la (voir [[01-presentation]]).

| Méthode | Module / fonctionnalité | Cas d'usage | Remarques |
| --- | --- | --- | --- |
| Anonyme | Intégrée | Sites publics | Utilise le compte `IUSR` ou l'identité du pool |
| De base (*Basic*) | `Web-Basic-Auth` | API, outils, clients non Windows | Identifiants en Base64 : **HTTPS obligatoire** |
| Windows | `Web-Windows-Auth` | Intranet, SSO Active Directory | Negotiate (Kerberos puis NTLM) |
| Digest | `Web-Digest-Auth` | Obsolète | Nécessite le stockage réversible des mots de passe |
| Certificat client | `Web-Cert-Auth` | Authentification forte | Voir [[04-https-certificats]] |
| Formulaires / OIDC | Applicatif (ASP.NET) | Applications web modernes | Géré par l'application, IIS en anonyme |

## Authentification anonyme

```powershell
# Désactiver l'anonyme et activer Windows sur un site
Set-WebConfigurationProperty -PSPath IIS:\ -Location "intranet" -Filter system.webServer/security/authentication/anonymousAuthentication -Name enabled -Value $false
Set-WebConfigurationProperty -PSPath IIS:\ -Location "intranet" -Filter system.webServer/security/authentication/windowsAuthentication -Name enabled -Value $true

# Faire tourner l'accès anonyme sous l'identité du pool plutôt qu'IUSR (simplifie les ACL)
Set-WebConfigurationProperty -PSPath IIS:\ -Location "intranet" -Filter system.webServer/security/authentication/anonymousAuthentication -Name userName -Value ""
```

## Authentification Windows (Kerberos / NTLM)

### Fournisseurs

```xml
<windowsAuthentication enabled="true" useKernelMode="true" useAppPoolCredentials="true">
  <providers>
    <clear />
    <add value="Negotiate" />
    <add value="NTLM" />
  </providers>
  <extendedProtection tokenChecking="Allow" />
</windowsAuthentication>
```

| Paramètre | Effet |
| --- | --- |
| `Negotiate` | Tente Kerberos, repli sur NTLM si Kerberos échoue |
| `Negotiate:Kerberos` | Kerberos uniquement (pas de repli) |
| `useKernelMode="true"` | Déchiffrement des tickets dans HTTP.sys sous le compte **ordinateur** (défaut, performant) |
| `useAppPoolCredentials="true"` | Utilise l'identité du pool pour déchiffrer les tickets : **obligatoire** quand le SPN est porté par un compte de service et que plusieurs serveurs sont derrière un répartiteur |
| `extendedProtection` | Protection contre le relais NTLM (*Channel Binding*) ; `Require` sur HTTPS si les clients le supportent |

### SPN (Service Principal Name)

Kerberos exige qu'un **SPN** `HTTP/nom` soit enregistré sur le compte qui déchiffre les tickets.

| Situation | SPN à déclarer sur |
| --- | --- |
| Site accessible par le nom du serveur (`web01`, `web01.corp.local`) | Automatique (compte ordinateur, via `HOST/`) |
| Nom d'alias DNS (`intranet.corp.local`), un seul serveur, mode noyau | Compte **ordinateur** `WEB01$` |
| Alias derrière un répartiteur (plusieurs serveurs) | Compte de **service** (gMSA) utilisé comme identité de pool + `useAppPoolCredentials=true` |

```powershell
setspn -S HTTP/intranet.corp.local CORP\gmsa-intranet$
setspn -S HTTP/intranet CORP\gmsa-intranet$
setspn -L CORP\gmsa-intranet$      # lister
setspn -X                          # rechercher les doublons (cause fréquente d'échec Kerberos)
```

> [!WARNING]
> L'alias DNS doit être un enregistrement **A** (pas un CNAME) : avec un CNAME, le client construit le SPN à partir du nom canonique et Kerberos échoue silencieusement en NTLM.

### Vérifier que Kerberos est utilisé

```powershell
klist                                  # côté client : ticket HTTP/intranet.corp.local présent ?
klist purge                            # purger pour retester
```

Côté serveur, activez l'audit des ouvertures de session (événement **4624**, champ *Package d'authentification* : `Kerberos` ou `NTLM`). Dans les journaux IIS, un 401.2 suivi d'un 200 est normal (négociation).

### Délégation Kerberos (double saut)

Quand l'application doit accéder à une ressource tierce (SQL Server, partage, autre API) **au nom de l'utilisateur** :

```powershell
# Délégation contrainte basée sur la ressource (RBCD) — configurée sur la ressource cible
$front = Get-ADServiceAccount gmsa-intranet
Set-ADComputer SQL01 -PrincipalsAllowedToDelegateToAccount $front

# Délégation contrainte classique (sur le compte frontal)
Set-ADServiceAccount gmsa-intranet -Add @{'msDS-AllowedToDelegateTo'=@('MSSQLSvc/sql01.corp.local:1433','MSSQLSvc/sql01.corp.local')}
```

> [!CAUTION]
> N'utilisez jamais la **délégation non contrainte** (« Approuver cet ordinateur pour la délégation à tous les services ») : un serveur compromis pourrait usurper n'importe quel utilisateur, y compris les administrateurs du domaine.

### Paramétrer les navigateurs (SSO)

Les navigateurs n'envoient les identifiants Windows qu'aux sites de la **zone Intranet local**. Par GPO : *Configuration utilisateur → Modèles d'administration → Composants Windows → Internet Explorer → Panneau de configuration → Page Sécurité → Liste des attributions de sites aux zones* → `https://intranet.corp.local` = `1`. Chrome et Edge utilisent ces zones ; pour Edge/Chrome on peut aussi définir `AuthServerAllowlist`.

## Authentification de base

```powershell
Set-WebConfigurationProperty -PSPath IIS:\ -Location "api" -Filter system.webServer/security/authentication/basicAuthentication -Name enabled -Value $true
Set-WebConfigurationProperty -PSPath IIS:\ -Location "api" -Filter system.webServer/security/authentication/basicAuthentication -Name defaultLogonDomain -Value "CORP"
Set-WebConfigurationProperty -PSPath IIS:\ -Location "api" -Filter system.webServer/security/authentication/basicAuthentication -Name realm -Value "API interne"
```

Les comptes sont validés contre Windows/AD. Associez toujours la méthode de base à **Exiger SSL**.

## Autorisation d'URL

Module `Web-Url-Auth`. Les règles sont évaluées en combinant tous les niveaux : les règles **Deny** sont prioritaires sur les règles **Allow**.

```xml
<system.webServer>
  <security>
    <authorization>
      <remove users="*" roles="" verbs="" />
      <add accessType="Allow" roles="CORP\GG-Intranet-Lecteurs" />
      <add accessType="Allow" users="CORP\admin.web" />
      <add accessType="Deny" users="?" />            <!-- ? = anonymes, * = tout le monde -->
    </authorization>
  </security>
</system.webServer>

<!-- Restreindre un sous-dossier -->
<location path="admin">
  <system.webServer>
    <security>
      <authorization>
        <remove users="*" roles="" verbs="" />
        <add accessType="Allow" roles="CORP\GG-Intranet-Admins" />
      </authorization>
    </security>
  </system.webServer>
</location>
```

> [!NOTE]
> L'autorisation d'URL s'ajoute aux **ACL NTFS** : l'identité authentifiée (ou celle du pool) doit aussi pouvoir lire les fichiers. Pour une gestion centralisée, préférez les groupes AD (modèle AGDLP, voir [[01-active-directory/04-utilisateurs-groupes-ou|Active Directory]]).

## Restrictions d'adresses IP et de domaine

```xml
<system.webServer>
  <security>
    <ipSecurity allowUnlisted="false" denyAction="Forbidden" enableProxyMode="true">
      <add ipAddress="10.0.0.0" subnetMask="255.0.0.0" allowed="true" />
      <add ipAddress="192.168.50.25" allowed="true" />
    </ipSecurity>
  </security>
</system.webServer>
```

- `allowUnlisted="false"` : liste blanche (tout ce qui n'est pas listé est refusé).
- `denyAction` : `Unauthorized` (401), `Forbidden` (403), `NotFound` (404) ou `AbortRequest` (coupe la connexion).
- `enableProxyMode="true"` : prend en compte l'en-tête `X-Forwarded-For` derrière un reverse proxy.

### Restrictions dynamiques (anti-brute force / anti-DoS applicatif)

```xml
<system.webServer>
  <security>
    <dynamicIpSecurity denyAction="AbortRequest" enableLoggingOnlyMode="false">
      <denyByConcurrentRequests enabled="true" maxConcurrentRequests="40" />
      <denyByRequestRate enabled="true" maxRequests="100" requestIntervalInMilliseconds="2000" />
    </dynamicIpSecurity>
  </security>
</system.webServer>
```

Commencez par `enableLoggingOnlyMode="true"` pour mesurer l'impact (les refus apparaissent avec les sous-codes **403.501** — trop de requêtes simultanées — et **403.502** — trop de requêtes sur la période — dans les journaux) avant d'activer le blocage.

## Filtrage des demandes (Request Filtering)

Premier rempart du pipeline, installé par défaut :

```xml
<system.webServer>
  <security>
    <requestFiltering allowDoubleEscaping="false" allowHighBitCharacters="true" removeServerHeader="true">
      <requestLimits maxAllowedContentLength="52428800" maxUrl="4096" maxQueryString="2048">
        <headerLimits>
          <add header="Content-Type" sizeLimit="256" />
        </headerLimits>
      </requestLimits>
      <fileExtensions allowUnlisted="true">
        <add fileExtension=".bak" allowed="false" />
        <add fileExtension=".config" allowed="false" />
        <add fileExtension=".sql" allowed="false" />
      </fileExtensions>
      <hiddenSegments>
        <add segment=".git" />
        <add segment="App_Data" />
      </hiddenSegments>
      <verbs allowUnlisted="false">
        <add verb="GET" allowed="true" />
        <add verb="HEAD" allowed="true" />
        <add verb="POST" allowed="true" />
      </verbs>
      <denyUrlSequences>
        <add sequence=".." />
      </denyUrlSequences>
    </requestFiltering>
  </security>
</system.webServer>
```

| Sous-code | Cause du rejet |
| --- | --- |
| 404.5 | Séquence d'URL refusée |
| 404.6 | Verbe refusé |
| 404.7 | Extension refusée |
| 404.8 | Segment caché |
| 404.11 | Double échappement |
| 404.13 | Contenu trop volumineux (`maxAllowedContentLength`, 30 Mo par défaut) |
| 404.14 / 404.15 | URL / chaîne de requête trop longue |

> [!TIP]
> Pour un envoi de fichiers volumineux en ASP.NET 4.x, augmentez **aussi** `system.web/httpRuntime/@maxRequestLength` (en Ko) ; pour ASP.NET Core, `KestrelServerOptions.Limits.MaxRequestBodySize` ou l'attribut `[RequestSizeLimit]`.
