---
title: HTTPS et certificats
description: Demande et import de certificats, liaisons HTTPS avec SNI, Central Certificate Store, redirection HTTP→HTTPS, HSTS, protocoles et suites TLS (Schannel), Let's Encrypt avec win-acme et certificats clients.
tags: [iis, https, tls, certificats, ssl, sni, hsts]
icon: lock
---

## Obtenir un certificat

### Demande (CSR) depuis IIS

Gestionnaire IIS → nœud du serveur → **Certificats de serveur** :

| Action | Usage |
| --- | --- |
| *Créer une demande de certificat* | Génère une CSR pour une autorité publique ; à compléter ensuite avec *Terminer la demande*. |
| *Créer un certificat de domaine* | Demande en ligne auprès d'une **AD CS d'entreprise** (modèle *Serveur Web*). |
| *Importer* | Importe un fichier `.pfx` (certificat + clé privée). |
| *Créer un certificat auto-signé* | Tests uniquement. |

> [!WARNING]
> L'assistant IIS ne permet pas de saisir des **SAN** (Subject Alternative Names). Or les navigateurs ignorent le CN : un certificat sans SAN est refusé. Utilisez `certreq` avec un fichier INF, OpenSSL, ou la console MMC *Certificats* (demande avancée).

### Demande avec certreq (SAN inclus)

```ini
; web01.inf
[Version]
Signature="$Windows NT$"

[NewRequest]
Subject = "CN=www.exemple.fr, O=Exemple, L=Paris, C=FR"
KeyLength = 2048
KeyAlgorithm = RSA
HashAlgorithm = SHA256
Exportable = TRUE
MachineKeySet = TRUE
KeySpec = 1
KeyUsage = 0xA0
ProviderName = "Microsoft RSA SChannel Cryptographic Provider"
RequestType = PKCS10

[Extensions]
2.5.29.17 = "{text}"
_continue_ = "dns=www.exemple.fr&"
_continue_ = "dns=exemple.fr&"

[EnhancedKeyUsageExtension]
OID = 1.3.6.1.5.5.7.3.1   ; Authentification du serveur
```

```powershell
certreq -new web01.inf web01.csr                       # génère la CSR + clé privée dans le magasin machine
# … soumettre la CSR à l'autorité, récupérer web01.cer …
certreq -accept web01.cer                              # associe le certificat à la clé privée
# Avec une AD CS d'entreprise :
certreq -submit -attrib "CertificateTemplate:WebServer" -config "pki01.corp.local\CORP-CA" web01.csr web01.cer
```

### Import et export PowerShell

```powershell
$pwd = Read-Host -AsSecureString "Mot de passe PFX"
Import-PfxCertificate -FilePath C:\certs\www.pfx -CertStoreLocation Cert:\LocalMachine\My -Password $pwd -Exportable

Get-ChildItem Cert:\LocalMachine\My | Select-Object Thumbprint, Subject, NotAfter, @{n='SAN';e={$_.DnsNameList -join ', '}}

Export-PfxCertificate -Cert Cert:\LocalMachine\My\<EMPREINTE> -FilePath C:\certs\backup.pfx -Password $pwd -ChainOption BuildChain
```

> [!IMPORTANT]
> Importez aussi les **certificats intermédiaires** dans `Cert:\LocalMachine\CA`. Sans chaîne complète, certains clients (Android, Java, curl) échouent alors que les navigateurs de bureau fonctionnent.

## Liaison HTTPS

```powershell
$cert = Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.DnsNameList -contains "www.exemple.fr" } | Sort-Object NotAfter -Descending | Select-Object -First 1

# SslFlags : 0 = classique (IP:port), 1 = SNI, 2 = Central Certificate Store, 3 = SNI + CCS
New-WebBinding -Name "exemple" -Protocol https -Port 443 -HostHeader "www.exemple.fr" -SslFlags 1
(Get-WebBinding -Name "exemple" -Protocol https -HostHeader "www.exemple.fr").AddSslCertificate($cert.Thumbprint, "My")

# Équivalent IISAdministration
New-IISSiteBinding -Name "exemple" -BindingInformation "*:443:www.exemple.fr" -CertificateThumbPrint $cert.Thumbprint `
                   -CertStoreLocation "Cert:\LocalMachine\My" -Protocol https -SslFlag Sni
```

### SNI (Server Name Indication)

Le SNI permet d'héberger **plusieurs sites HTTPS sur une seule IP et le port 443**, chacun avec son certificat. Tous les clients modernes le supportent. Les associations sont visibles dans HTTP.sys :

```powershell
netsh http show sslcert                     # liaisons IP:port et hostname:port
netsh http delete sslcert hostnameport=www.exemple.fr:443
```

> [!TIP]
> Gardez une liaison **non-SNI par défaut** (`*:443:` sans nom) avec un certificat générique : elle répond aux rares clients sans SNI et aux sondes de supervision par IP.

## Central Certificate Store (CCS)

Pour une ferme de serveurs : les certificats `.pfx` sont stockés sur un partage, nommés d'après le nom d'hôte (`www.exemple.fr.pfx`, `_.exemple.fr.pfx` pour un wildcard). IIS les charge à la volée.

```powershell
Install-WindowsFeature Web-CertProvider
Enable-WebCentralCertProvider -CertStoreLocation "\\nas01\certs$" -UserName "CORP\svc-ccs" -Password "********" -PrivateKeyPassword "********"
New-WebBinding -Name "exemple" -Protocol https -Port 443 -HostHeader "www.exemple.fr" -SslFlags 3
```

Renouveler un certificat revient alors à remplacer le fichier sur le partage : tous les serveurs l'utilisent immédiatement.

## Redirection HTTP → HTTPS

Avec le module URL Rewrite (recommandé) :

```xml
<system.webServer>
  <rewrite>
    <rules>
      <rule name="HTTP vers HTTPS" stopProcessing="true">
        <match url="(.*)" />
        <conditions>
          <add input="{HTTPS}" pattern="^OFF$" />
        </conditions>
        <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" appendQueryString="true" />
      </rule>
    </rules>
  </rewrite>
</system.webServer>
```

> [!NOTE]
> Derrière un répartiteur de charge qui termine le TLS, testez plutôt l'en-tête `{HTTP_X_FORWARDED_PROTO}` (valeur `http`) pour éviter une boucle de redirection.

## HSTS (HTTP Strict Transport Security)

Depuis Windows Server 2019 (IIS 10 version 1709), HSTS est natif :

```powershell
$site = "exemple"
Set-WebConfigurationProperty -PSPath IIS:\ -Filter "system.applicationHost/sites/site[@name='$site']/hsts" -Name enabled -Value $true
Set-WebConfigurationProperty -PSPath IIS:\ -Filter "system.applicationHost/sites/site[@name='$site']/hsts" -Name max-age -Value 31536000
Set-WebConfigurationProperty -PSPath IIS:\ -Filter "system.applicationHost/sites/site[@name='$site']/hsts" -Name includeSubDomains -Value $true
Set-WebConfigurationProperty -PSPath IIS:\ -Filter "system.applicationHost/sites/site[@name='$site']/hsts" -Name redirectHttpToHttps -Value $true
```

Sur les versions antérieures, ajoutez l'en-tête via une règle *outbound* d'URL Rewrite (uniquement sur les réponses HTTPS) :

```xml
<outboundRules>
  <rule name="HSTS" enabled="true">
    <match serverVariable="RESPONSE_Strict_Transport_Security" pattern=".*" />
    <conditions><add input="{HTTPS}" pattern="on" ignoreCase="true" /></conditions>
    <action type="Rewrite" value="max-age=31536000; includeSubDomains" />
  </rule>
</outboundRules>
```

> [!CAUTION]
> `includeSubDomains` et le *preload* s'appliquent à **tous** les sous-domaines : vérifiez qu'aucun service interne n'est encore en HTTP avant de les activer. Commencez avec un `max-age` court (300 s), puis augmentez.

## Protocoles et suites de chiffrement (Schannel)

IIS délègue le TLS à **Schannel** : la configuration est **globale à la machine** (registre), pas par site.

```powershell
$base = 'HKLM:\SYSTEM\CurrentControlSet\Control\SecurityProviders\SCHANNEL\Protocols'
function Set-Proto($name, [bool]$enabled) {
  foreach ($side in 'Server','Client') {
    $k = "$base\$name\$side"
    New-Item $k -Force | Out-Null
    New-ItemProperty $k -Name Enabled -Value ([int]$enabled) -PropertyType DWord -Force | Out-Null
    New-ItemProperty $k -Name DisabledByDefault -Value ([int](-not $enabled)) -PropertyType DWord -Force | Out-Null
  }
}
'SSL 2.0','SSL 3.0','TLS 1.0','TLS 1.1' | ForEach-Object { Set-Proto $_ $false }
Set-Proto 'TLS 1.2' $true
Set-Proto 'TLS 1.3' $true      # Windows Server 2022 et ultérieurs
# Redémarrage requis
```

Ordre des suites (exemple pour TLS 1.2, à adapter) :

```powershell
Get-TlsCipherSuite | Format-Table Name, Exchange, Cipher, Hash
Disable-TlsCipherSuite -Name "TLS_RSA_WITH_3DES_EDE_CBC_SHA"
Enable-TlsCipherSuite -Name "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384" -Position 0
```

> [!TIP]
> L'outil gratuit **IIS Crypto** (Nartac) applique des modèles éprouvés (« Best Practices », « PCI 4.0 ») et produit les mêmes clés de registre. Testez ensuite avec SSL Labs (sites publics) ou `nmap --script ssl-enum-ciphers -p 443 serveur`.

N'oubliez pas les applications .NET Framework clientes (appels sortants) :

```powershell
'HKLM:\SOFTWARE\Microsoft\.NETFramework\v4.0.30319','HKLM:\SOFTWARE\WOW6432Node\Microsoft\.NETFramework\v4.0.30319' | ForEach-Object {
  New-ItemProperty $_ -Name SchUseStrongCrypto -Value 1 -PropertyType DWord -Force
  New-ItemProperty $_ -Name SystemDefaultTlsVersions -Value 1 -PropertyType DWord -Force
}
```

### Désactiver TLS 1.3 ou HTTP/2 sur une liaison (Windows Server 2022+)

Certaines applications (authentification par certificat client avec renégociation) sont incompatibles avec TLS 1.3 ou HTTP/2. Dans le Gestionnaire IIS, la boîte *Modifier la liaison* propose des cases **Désactiver TLS 1.3 over TCP**, **Désactiver HTTP/2**, **Désactiver QUIC**, **Désactiver OCSP stapling**, **Désactiver TLS hérité**.

## Let's Encrypt avec win-acme

[win-acme](https://www.win-acme.com) (`wacs.exe`) obtient et renouvelle automatiquement des certificats ACME et met à jour les liaisons IIS.

```powershell
# Mode interactif
.\wacs.exe
# Mode non interactif : tous les noms d'hôte du site ID 2, validation HTTP-01
.\wacs.exe --source iis --siteid 2 --accepttos --emailaddress admin@exemple.fr
# Validation DNS (wildcard) via script ou plugin (Azure, Cloudflare, RFC2136/BIND…)
.\wacs.exe --source manual --host "*.exemple.fr" --validation dnsscript --dnscreatescript create.ps1 --dnsdeletescript delete.ps1
```

Une tâche planifiée est créée pour le renouvellement (vérification quotidienne, renouvellement ~30 jours avant expiration).

## Authentification par certificat client

1. Installer `Web-Cert-Auth` (mappage IIS) ou `Web-Client-Auth` (mappage Active Directory).
2. Sur le site : *Paramètres SSL* → **Exiger SSL** + **Certificats clients : Exiger**.
3. Le serveur doit faire confiance à l'AC émettrice des certificats clients (`Cert:\LocalMachine\Root` ou `CA`).

```xml
<system.webServer>
  <security>
    <access sslFlags="Ssl, SslNegotiateCert, SslRequireCert" />
    <authentication>
      <iisClientCertificateMappingAuthentication enabled="true" manyToOneCertificateMappingsEnabled="true">
        <manyToOneMappings>
          <add name="Employes" userName="CORP\svc-web" password="********">
            <rules>
              <add certificateField="Issuer" certificateSubField="CN" matchCriteria="CORP-CA" compareCaseSensitive="false" />
            </rules>
          </add>
        </manyToOneMappings>
      </iisClientCertificateMappingAuthentication>
    </authentication>
  </security>
</system.webServer>
```

## Supervision des expirations

```powershell
Get-ChildItem Cert:\LocalMachine\My | Where-Object { $_.NotAfter -lt (Get-Date).AddDays(30) } |
  Select-Object Subject, NotAfter, Thumbprint
```

Supervisez aussi les certificats depuis l'extérieur, par exemple avec [[01-centreon/01-presentation|Centreon]] : plugin `apps::protocols::x509::plugin` (mode `validity`) pour l'expiration, `apps::protocols::http::plugin` pour la disponibilité.
