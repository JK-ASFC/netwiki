---
title: Sécurité et authentification
description: Durcir Apache (informations divulguées, en-têtes de sécurité, méthodes, limites, mod_reqtimeout), pare-feu applicatif ModSecurity avec l'OWASP CRS, mod_evasive, authentification basique, LDAP/Active Directory (mod_authnz_ldap), Kerberos SSO (mod_auth_gssapi) et OpenID Connect.
tags: [apache, sécurité, modsecurity, waf, ldap, kerberos, authentification, durcissement]
icon: shield
---

## Durcissement de base

```apache /etc/apache2/conf-available/durcissement.conf
ServerTokens Prod
ServerSignature Off
TraceEnable Off
FileETag None

# Pas de listes de répertoires, pas de liens symboliques arbitraires
<Directory />
    Options None
    AllowOverride None
    Require all denied
</Directory>

# Fichiers sensibles
<FilesMatch "(^\.|\.(bak|old|orig|sql|swp|ini|log|sh|env)$|~$)">
    Require all denied
</FilesMatch>

# En-têtes de sécurité
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
Header always set Content-Security-Policy "default-src 'self'; img-src 'self' data:; object-src 'none'; frame-ancestors 'self'; base-uri 'self'"
Header always edit Set-Cookie ^(.*)$ "$1; HttpOnly; Secure; SameSite=Lax"
Header unset X-Powered-By

# Limites de requêtes
LimitRequestBody 52428800        # 50 Mo
LimitRequestFields 100
LimitRequestFieldSize 16380
LimitRequestLine 8190
```

```apache
# Méthodes autorisées sur un site
<Location />
    <LimitExcept GET POST HEAD>
        Require all denied
    </LimitExcept>
</Location>
```

### Protection contre les connexions lentes (Slowloris)

```apache
# mod_reqtimeout (activé par défaut sous Debian)
RequestReadTimeout handshake=5 header=20-40,MinRate=500 body=20,MinRate=500
```

### Modules à désactiver s'ils ne servent pas

```bash
sudo a2dismod autoindex status userdir cgi dav dav_fs info -f
```

## Pare-feu applicatif : ModSecurity + OWASP CRS

```bash
sudo apt install libapache2-mod-security2 modsecurity-crs
sudo cp /etc/modsecurity/modsecurity.conf-recommended /etc/modsecurity/modsecurity.conf
sudo a2enmod security2 && sudo systemctl restart apache2
```

```apache /etc/modsecurity/modsecurity.conf (extraits)
SecRuleEngine DetectionOnly          # observer d'abord ; passer à « On » après réglage des faux positifs
SecRequestBodyAccess On
SecRequestBodyLimit 13107200
SecAuditEngine RelevantOnly
SecAuditLog /var/log/apache2/modsec_audit.log
```

```apache /etc/modsecurity/crs/crs-setup.conf (extraits)
# Niveau de paranoïa (1 = peu de faux positifs ; 2-4 = plus strict)
SecAction "id:900000,phase:1,pass,t:none,nolog,setvar:tx.blocking_paranoia_level=1"
# Seuil d'anomalie
SecAction "id:900110,phase:1,pass,t:none,nolog,setvar:tx.inbound_anomaly_score_threshold=5,setvar:tx.outbound_anomaly_score_threshold=4"
```

### Exclusions ciblées (faux positifs)

```apache /etc/modsecurity/crs/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf
# Désactiver une règle pour un chemin précis
SecRule REQUEST_URI "@beginsWith /admin/editeur" "id:1000,phase:1,pass,nolog,ctl:ruleRemoveById=941160"
# Ignorer un paramètre pour une famille de règles
SecRuleUpdateTargetById 942100 "!ARGS:requete_sql_autorisee"
```

> [!TIP]
> Procédure de mise en service : 1) `DetectionOnly` pendant 1 à 2 semaines, 2) analyser `modsec_audit.log` (ID des règles déclenchées), 3) écrire des exclusions **précises**, 4) passer en `SecRuleEngine On`. Des exclusions toutes faites existent pour WordPress, Nextcloud, Drupal (`tx.crs_exclusions_*`).

## Limitation contre le brute force et les rafales : mod_evasive

```bash
sudo apt install libapache2-mod-evasive
```

```apache /etc/apache2/mods-available/evasive.conf
<IfModule mod_evasive20.c>
    DOSHashTableSize    3097
    DOSPageCount        10         # même page plus de 10 fois…
    DOSPageInterval     1          # …en 1 seconde
    DOSSiteCount        100        # plus de 100 requêtes sur le site…
    DOSSiteInterval     1          # …en 1 seconde
    DOSBlockingPeriod   60
    DOSWhitelist        10.0.10.*
    DOSLogDir           /var/log/mod_evasive
</IfModule>
```

Complétez avec un WAF ou un CDN en amont, ou avec Fail2ban / CrowdSec qui analysent les journaux et bannissent les IP au niveau du pare-feu.

## Restrictions par adresse IP

```apache
<Location /admin>
    Require ip 10.0.10.0/24 192.168.50.0/24
</Location>
```

## Authentification basique

```bash
sudo htpasswd -c -B /etc/apache2/.htpasswd-admin alice     # -B : bcrypt
sudo htpasswd -B /etc/apache2/.htpasswd-admin bruno
```

```apache
<Location /admin>
    AuthType Basic
    AuthName "Administration"
    AuthBasicProvider file
    AuthUserFile /etc/apache2/.htpasswd-admin
    Require valid-user
</Location>
```

Toujours sous **HTTPS** (identifiants encodés en Base64, non chiffrés).

## LDAP / Active Directory : mod_authnz_ldap

```bash
sudo a2enmod ldap authnz_ldap
```

```apache
LDAPTrustedGlobalCert CA_BASE64 /etc/ssl/exemple/corp-ca.pem
LDAPVerifyServerCert On

<Location /intranet>
    AuthType Basic
    AuthName "Intranet (identifiants Windows)"
    AuthBasicProvider ldap
    AuthLDAPURL "ldaps://dc01.corp.exemple.fr dc02.corp.exemple.fr/DC=corp,DC=exemple,DC=fr?sAMAccountName?sub?(objectClass=user)"
    AuthLDAPBindDN "CN=svc-apache-ldap,OU=Comptes-de-service,OU=Corp,DC=corp,DC=exemple,DC=fr"
    AuthLDAPBindPassword "MotDePasseDuCompteDeService"
    AuthLDAPMaxSubGroupDepth 5               # groupes imbriqués
    AuthLDAPSubGroupAttribute member
    AuthLDAPSubGroupClass group
    Require ldap-group CN=GG_Intranet,OU=Groupes,OU=Corp,DC=corp,DC=exemple,DC=fr
</Location>

# Cache LDAP (mod_ldap)
LDAPSharedCacheSize 500000
LDAPCacheEntries 1024
LDAPCacheTTL 600
<Location /ldap-status>
    SetHandler ldap-status
    Require ip 127.0.0.1
</Location>
```

> [!NOTE]
> Pour les DC qui exigent la signature LDAP, utilisez **LDAPS** (636) comme ci-dessus (voir [[01-active-directory/09-securite-durcissement|LDAP signing / LDAPS]]). `AuthLDAPBindPassword` peut aussi être lu depuis un programme : `AuthLDAPBindPassword "exec:/usr/local/bin/lire-secret"`.

## SSO Kerberos (Active Directory) : mod_auth_gssapi

Les postes du domaine s'authentifient **sans saisie** (Negotiate/Kerberos), comme avec IIS.

```bash
sudo apt install libapache2-mod-auth-gssapi
# Sur un DC : compte de service + SPN + keytab
#   setspn -S HTTP/intranet.corp.exemple.fr CORP\svc-apache-krb
#   ktpass -princ HTTP/intranet.corp.exemple.fr@CORP.EXEMPLE.FR -mapuser CORP\svc-apache-krb -crypto AES256-SHA1 -ptype KRB5_NT_PRINCIPAL -pass * -out apache.keytab
sudo install -o root -g www-data -m 640 apache.keytab /etc/apache2/apache.keytab
```

```apache
<Location /intranet>
    AuthType GSSAPI
    AuthName "Intranet"
    GssapiCredStore keytab:/etc/apache2/apache.keytab
    GssapiAllowedMech krb5
    GssapiBasicAuth On                # repli sur identifiants pour les postes hors domaine
    GssapiLocalName On                # REMOTE_USER = alice au lieu de alice@CORP.EXEMPLE.FR
    Require valid-user
</Location>
```

Côté navigateurs : ajouter le site à la zone Intranet (GPO), voir [[01-iis/05-authentification-autorisation|Kerberos et SPN]].

## OpenID Connect (Keycloak, Entra ID, Authelia)

```bash
sudo apt install libapache2-mod-auth-openidc
```

```apache
OIDCProviderMetadataURL https://sso.exemple.fr/realms/corp/.well-known/openid-configuration
OIDCClientID intranet
OIDCClientSecret "secret-du-client"
OIDCRedirectURI https://intranet.exemple.fr/oidc/callback
OIDCCryptoPassphrase "phrase-aleatoire-longue"
OIDCScope "openid email profile groups"
OIDCRemoteUserClaim preferred_username

<Location />
    AuthType openid-connect
    Require claim groups:intranet-utilisateurs
</Location>
```

## Liste de contrôle

- [ ] `ServerTokens Prod`, `ServerSignature Off`, `TraceEnable Off`
- [ ] `Options -Indexes`, `AllowOverride None` partout où possible
- [ ] vhost par défaut neutre, aucun site sur l'IP seule
- [ ] HTTPS uniquement, TLS 1.2+, HSTS
- [ ] En-têtes de sécurité et cookies `Secure; HttpOnly; SameSite`
- [ ] Modules inutiles désactivés (autoindex, status public, dav, cgi)
- [ ] `mod_reqtimeout`, limites de requêtes
- [ ] ModSecurity + CRS en mode bloquant après réglage
- [ ] Zones d'administration filtrées par IP et authentifiées
- [ ] Journaux centralisés, alertes sur les rafales de 4xx/5xx
