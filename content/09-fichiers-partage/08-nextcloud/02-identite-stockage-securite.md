---
title: Identité, stockage externe et sécurité
description: Intégrer Nextcloud au système d'information — annuaire LDAP/Active Directory, SSO SAML ou OpenID Connect (Keycloak, Entra ID, AD FS), stockages externes SMB/CIFS, S3 et SFTP, stockage principal objet, partage (liens, fédération), quotas, chiffrement côté serveur et de bout en bout, double authentification, protection contre la force brute, en-têtes et durcissement.
tags: [nextcloud, ldap, active directory, saml, oidc, smb, s3, sécurité, 2fa]
icon: shield-check
---

## Annuaire LDAP / Active Directory

```bash
occ app:enable user_ldap
occ ldap:create-empty-config                       # crée s01
occ ldap:set-config s01 ldapHost "ldaps://dc01.corp.exemple.fr"
occ ldap:set-config s01 ldapPort 636
occ ldap:set-config s01 ldapAgentName "CN=svc-nextcloud,OU=Services,DC=corp,DC=exemple,DC=fr"
occ ldap:set-config s01 ldapAgentPassword "MotDePasseServiceLdap"
occ ldap:set-config s01 ldapBase "DC=corp,DC=exemple,DC=fr"
occ ldap:set-config s01 ldapUserFilter "(&(objectClass=user)(memberOf=CN=GG-Nextcloud,OU=Groupes,DC=corp,DC=exemple,DC=fr))"
occ ldap:set-config s01 ldapLoginFilter "(&(objectClass=user)(|(sAMAccountName=%uid)(userPrincipalName=%uid)))"
occ ldap:set-config s01 ldapGroupFilter "(&(objectClass=group)(cn=GG-NC-*))"
occ ldap:set-config s01 ldapExpertUsernameAttr "sAMAccountName"
occ ldap:set-config s01 ldapEmailAttribute "mail"
occ ldap:set-config s01 ldapQuotaAttribute "extensionAttribute1"
occ ldap:set-config s01 ldapConfigurationActive 1
occ ldap:test-config s01
occ ldap:search --group "GG-NC-Compta"
```

Définissez l'attribut de **nom d'utilisateur interne** (`ldapExpertUsernameAttr`) **avant** la première connexion : il ne peut plus être changé ensuite. Le certificat de l'AC d'entreprise doit être approuvé par le système (LDAPS).

## Authentification unique

| Méthode | Application | Remarques |
| --- | --- | --- |
| **OpenID Connect** | `user_oidc` (officielle) | Keycloak, Entra ID, Authentik ; création automatique des comptes, groupes depuis les revendications |
| **SAML 2.0** | `user_saml` | AD FS, Shibboleth, Keycloak |
| Kerberos (SSO Windows) | `user_saml` en mode « environnement » + serveur web Kerberos | Plus complexe |

Les clients de bureau et mobiles utilisent le **flux de connexion** web (*Login Flow v2*), compatible avec le SSO. Voir [[05-keycloak/02-federation-clients-mfa|Keycloak]].

## Stockages

### Stockages externes

```bash
occ app:enable files_external
occ files_external:create "Partage Compta" smb password::sessioncredentials \
  -c host=srv-fic-01.corp.exemple.fr -c share=Compta -c domain=CORP
occ files_external:applicable --add-group "GG-NC-Compta" 1
occ files_external:list
```

| Type | Usage |
| --- | --- |
| **SMB/CIFS** | Exposer les partages Windows existants ; avec `sessioncredentials` les droits NTFS de l'utilisateur s'appliquent (voir [[01-samba/01-presentation\|Samba]] et les [[13-serveur-fichiers-windows/01-partages-ntfs-smb\|partages Windows]]) |
| S3 | Compartiment d'équipe |
| SFTP, WebDAV | Serveurs existants |

Les changements faits directement sur un stockage SMB sont détectés au parcours ; pour une détection immédiate, lancez en continu `occ files_external:notify <id>` (service systemd).

### Stockage principal objet

```php config.php
'objectstore' => [
  'class' => '\OC\Files\ObjectStore\S3',
  'arguments' => [
    'bucket' => 'nextcloud',
    'hostname' => 's3.corp.exemple.fr',
    'port' => 443,
    'use_ssl' => true,
    'use_path_style' => true,
    'region' => 'fr-paris-1',
    'key' => 'svc-nextcloud',
    'secret' => 'SecretS3TresLong',
  ],
],
```

À choisir **à l'installation** : la migration d'un stockage local vers S3 n'est pas prise en charge simplement. Les objets sont nommés par identifiant (`urn:oid:1234`) : la base est indispensable pour retrouver les fichiers — sauvegardez-les **ensemble**. Voir [[07-minio/01-presentation-installation|MinIO]].

## Partage

- Partages internes (utilisateurs, groupes, **Team folders** / dossiers de groupe avec droits fins et ACL)
- Liens publics : imposer **mot de passe** et **date d'expiration** (*Administration → Partage*), désactiver l'envoi public si inutile
- **Fédération** (*Federated Cloud Sharing*) entre instances Nextcloud/ownCloud : à désactiver si non utilisée
- Quotas par utilisateur (ou attribut LDAP), par groupe via dossiers de groupe

## Chiffrement

| Mode | Protège contre | Limites |
| --- | --- | --- |
| **Chiffrement côté serveur** (`encryption`) | Un stockage externe ou S3 non maîtrisé | Clés sur le serveur ; +35 % d'espace, impact sur les performances, récupération délicate ; inutile pour un disque local déjà chiffré (LUKS) |
| **Chiffrement de bout en bout** (`end_to_end_encryption`) | L'administrateur du serveur | Dossiers spécifiques, pas d'accès web ni de partage par lien |
| Chiffrement du disque (LUKS, BitLocker) | Vol du support | Recommandé de toute façon |

## Sécurité

- [ ] **Double authentification** (TOTP, WebAuthn) imposée aux groupes (`twofactor_totp`, `twofactor_webauthn`, *Imposer la 2FA*)
- [ ] Protection contre la force brute (intégrée) — renseigner `trusted_proxies` pour voir les vraies IP ; complément [[01-fail2ban/01-presentation-configuration|Fail2ban]] sur `nextcloud.log`
- [ ] HTTPS avec **HSTS**, en-têtes vérifiés par la page *Vue d'ensemble* et le scanner `scan.nextcloud.com`
- [ ] Applications réduites au nécessaire, mises à jour (`occ app:update --all`)
- [ ] Antivirus sur les envois (`files_antivirus` + [[04-clamav/02-integrations-exploitation|ClamAV]])
- [ ] Mots de passe d'application révocables pour les clients ; sessions et appareils visibles par l'utilisateur
- [ ] Répertoire de données **hors** de la racine web, propriétaire `www-data`, droits 0750
- [ ] Journal d'audit (`admin_audit`) envoyé au SIEM
