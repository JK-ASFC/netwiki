---
title: Authentification Kerberos, NTLM et LDAP (Active Directory)
description: Authentifier les utilisateurs du proxy de façon transparente avec Kerberos (keytab, SPN, negotiate_kerberos_auth), en repli NTLM via Samba/winbind, ou en LDAP basique, contrôler l'accès par groupe AD (ext_kerberos_ldap_group_acl, ext_ldap_group_acl), cache des identifiants et dépannage.
tags: [squid, kerberos, ntlm, ldap, active directory, sso, authentification, groupes]
icon: users
---

## Méthodes possibles

| Méthode | Expérience utilisateur | Remarques |
| --- | --- | --- |
| **Kerberos (Negotiate)** | Transparente (SSO) pour les postes du domaine | **Recommandée** ; nécessite un SPN et un keytab |
| NTLM | Transparente | Protocole hérité ; nécessite Samba/winbind ; à réserver aux clients sans Kerberos |
| LDAP (Basic) | Fenêtre de saisie | Identifiants en clair vers le proxy (Base64) : seulement sur réseau maîtrisé ou proxy en HTTPS |
| Par IP / poste | Aucune | Pas d'identité utilisateur, uniquement l'adresse |

> [!IMPORTANT]
> L'authentification n'est possible qu'en **mode explicite** (le navigateur sait qu'il parle à un proxy). En mode transparent, Squid ne peut pas demander d'identifiants.

## Prérequis communs

- Le proxy est déclaré par son **nom DNS** (`proxy.corp.exemple.fr`), pas par son IP : Kerberos a besoin du nom pour construire le SPN `HTTP/proxy.corp.exemple.fr`.
- Enregistrement **A** (pas de CNAME) dans le DNS AD.
- Heure synchronisée avec les contrôleurs de domaine (chrony vers les DC).

## Kerberos

### 1. Compte de service, SPN et keytab (sur un DC)

```powershell
New-ADUser -Name "svc-squid" -SamAccountName svc-squid -UserPrincipalName svc-squid@corp.exemple.fr `
  -Path "OU=Comptes-de-service,OU=Corp,DC=corp,DC=exemple,DC=fr" -AccountPassword (Read-Host -AsSecureString) `
  -Enabled $true -PasswordNeverExpires $true -KerberosEncryptionType AES128,AES256

ktpass -princ HTTP/proxy.corp.exemple.fr@CORP.EXEMPLE.FR -mapuser CORP\svc-squid -crypto AES256-SHA1 `
  -ptype KRB5_NT_PRINCIPAL -pass * -out C:\Temp\squid.keytab
setspn -L CORP\svc-squid           # doit afficher HTTP/proxy.corp.exemple.fr
```

Alternative depuis Linux : `msktutil` crée un compte ordinateur et le keytab, et peut renouveler le mot de passe automatiquement :

```bash
sudo apt install msktutil krb5-user
kinit administrateur@CORP.EXEMPLE.FR
sudo msktutil -c -b "OU=Serveurs,OU=Corp" -s HTTP/proxy.corp.exemple.fr -h proxy.corp.exemple.fr \
  -k /etc/squid/squid.keytab --computer-name PROXY-K --upn HTTP/proxy.corp.exemple.fr --server dc01.corp.exemple.fr --enctypes 24
```

### 2. Configuration Kerberos du serveur

```ini /etc/krb5.conf
[libdefaults]
    default_realm = CORP.EXEMPLE.FR
    dns_lookup_kdc = true
    dns_lookup_realm = false
    default_tgs_enctypes = aes256-cts-hmac-sha1-96 aes128-cts-hmac-sha1-96
    default_tkt_enctypes = aes256-cts-hmac-sha1-96 aes128-cts-hmac-sha1-96
```

```bash
sudo install -o proxy -g proxy -m 600 squid.keytab /etc/squid/squid.keytab     # RHEL : squid:squid
klist -ke /etc/squid/squid.keytab
kinit -kt /etc/squid/squid.keytab HTTP/proxy.corp.exemple.fr@CORP.EXEMPLE.FR && klist   # test
```

```ini /etc/default/squid (Debian) — ou /etc/sysconfig/squid (RHEL)
KRB5_KTNAME=/etc/squid/squid.keytab
```

### 3. squid.conf

```squid
auth_param negotiate program /usr/lib/squid/negotiate_kerberos_auth -k /etc/squid/squid.keytab -s HTTP/proxy.corp.exemple.fr@CORP.EXEMPLE.FR -r
auth_param negotiate children 50 startup=10 idle=5
auth_param negotiate keep_alive on

acl authentifies proxy_auth REQUIRED
http_access deny !authentifies
http_access allow localnet authentifies
http_access deny all
```

`-r` retire le royaume du nom d'utilisateur (`alice` au lieu de `alice@CORP.EXEMPLE.FR`) dans les journaux et les ACL.

## Autorisation par groupe Active Directory

### Avec Kerberos : ext_kerberos_ldap_group_acl

```squid
external_acl_type ad_groupe ttl=3600 negative_ttl=300 children-max=20 %LOGIN /usr/lib/squid/ext_kerberos_ldap_group_acl -a -g "GG-Internet-Complet" -D CORP.EXEMPLE.FR -S dc01.corp.exemple.fr
external_acl_type ad_groupe_restreint ttl=3600 %LOGIN /usr/lib/squid/ext_kerberos_ldap_group_acl -a -g "GG-Internet-Restreint" -D CORP.EXEMPLE.FR

acl internet_complet external ad_groupe
acl internet_restreint external ad_groupe_restreint
acl sites_metier dstdomain "/etc/squid/listes/sites-metier.txt"

http_access allow internet_complet
http_access allow internet_restreint sites_metier
http_access deny all
```

Le helper interroge LDAP en s'authentifiant avec le keytab (variable `KRB5_KTNAME`) : aucun mot de passe en clair dans la configuration.

### Avec un compte LDAP : ext_ldap_group_acl

```squid
external_acl_type ldap_groupe ttl=3600 %LOGIN /usr/lib/squid/ext_ldap_group_acl \
  -R -K -b "DC=corp,DC=exemple,DC=fr" \
  -D "CN=svc-squid-ldap,OU=Comptes-de-service,OU=Corp,DC=corp,DC=exemple,DC=fr" -W /etc/squid/ldap.pass \
  -f "(&(objectClass=person)(sAMAccountName=%v)(memberOf:1.2.840.113556.1.4.1941:=CN=%g,OU=Groupes,OU=Corp,DC=corp,DC=exemple,DC=fr))" \
  -H ldaps://dc01.corp.exemple.fr
acl internet_complet external ldap_groupe GG-Internet-Complet
```

`-K` retire le domaine Kerberos ; la règle `1.2.840.113556.1.4.1941` gère les groupes imbriqués.

## NTLM (repli)

```bash
sudo apt install samba winbind krb5-user
# smb.conf : security = ads, workgroup = CORP, realm = CORP.EXEMPLE.FR (voir l'article FreeRADIUS / AD pour un exemple complet)
sudo net ads join -U administrateur
sudo usermod -aG winbindd_priv proxy
wbinfo -t
```

```squid
auth_param negotiate program /usr/lib/squid/negotiate_wrapper_auth --ntlm /usr/bin/ntlm_auth --helper-protocol=gss-spnego --kerberos /usr/lib/squid/negotiate_kerberos_auth -k /etc/squid/squid.keytab -s GSS_C_NO_NAME -r
auth_param negotiate children 50
auth_param negotiate keep_alive on
```

`negotiate_wrapper_auth` route chaque client vers Kerberos ou NTLM selon ce qu'il propose. Configuration Samba détaillée : [[01-freeradius/06-ldap-active-directory|jonction Samba/winbind]].

## LDAP basique (postes hors domaine)

```squid
auth_param basic program /usr/lib/squid/basic_ldap_auth -R -b "DC=corp,DC=exemple,DC=fr" \
  -D "CN=svc-squid-ldap,OU=Comptes-de-service,OU=Corp,DC=corp,DC=exemple,DC=fr" -W /etc/squid/ldap.pass \
  -f "sAMAccountName=%s" -H ldaps://dc01.corp.exemple.fr
auth_param basic children 20
auth_param basic realm Proxy Internet Exemple
auth_param basic credentialsttl 2 hours
```

L'ordre des `auth_param` détermine les méthodes proposées au navigateur (Negotiate puis Basic).

## Exceptions sans authentification

Certains clients ne savent pas s'authentifier (mises à jour Windows/antivirus sous compte système, applications métier) :

```squid
acl sans_auth dstdomain .windowsupdate.com .update.microsoft.com .delivery.mp.microsoft.com
acl sans_auth_ip src 10.0.20.0/24
http_access allow sans_auth
http_access allow sans_auth_ip
# … puis seulement ensuite la règle exigeant l'authentification
```

## Dépannage

```bash
# Tester le helper Kerberos manuellement (jeton obtenu depuis un poste avec curl --negotiate)
sudo -u proxy /usr/lib/squid/negotiate_kerberos_auth_test proxy.corp.exemple.fr
# Tester un helper de groupe : saisir « alice » puis Entrée
sudo -u proxy KRB5_KTNAME=/etc/squid/squid.keytab /usr/lib/squid/ext_kerberos_ldap_group_acl -a -g GG-Internet-Complet -D CORP.EXEMPLE.FR -d
# Depuis un poste du domaine
curl --negotiate -u : -x http://proxy.corp.exemple.fr:3128 -I https://www.debian.org
```

| Symptôme (cache.log) | Cause |
| --- | --- |
| `gss_acquire_cred() failed: … No key table entry found` | SPN du keytab différent du nom utilisé par les clients, ou `KRB5_KTNAME` absent |
| `Clock skew too great` | Heure du proxy décalée |
| Les postes demandent un mot de passe | Proxy déclaré par IP, nom hors zone Intranet du navigateur, CNAME, SPN en double (`setspn -X`) |
| `ERR_CACHE_ACCESS_DENIED` | Authentification échouée ou utilisateur hors groupe |
| Helpers saturés (`All negotiate helpers are busy`) | Augmenter `children`, vérifier la latence LDAP |
| Groupes non reconnus | Nom du groupe (CN), groupes imbriqués, `ttl` du cache de l'ACL externe |
