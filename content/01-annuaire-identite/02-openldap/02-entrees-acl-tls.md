---
title: Comptes, groupes, mots de passe, ACL et TLS
description: Gérer l'annuaire OpenLDAP — comptes utilisateurs (inetOrgPerson, posixAccount), groupes groupOfNames et posixGroup, superpositions memberOf et refint, hachage des mots de passe et politique (ppolicy), comptes de liaison applicatifs, contrôle d'accès olcAccess, index, et chiffrement TLS/LDAPS imposé.
tags: [openldap, ldif, memberof, ppolicy, olcaccess, acl, tls, ldaps, index]
icon: shield-check
---

## Utilisateurs

```ldif alice.ldif
dn: uid=alice,ou=personnes,dc=corp,dc=exemple,dc=fr
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: alice
cn: Alice Martin
givenName: Alice
sn: Martin
mail: alice.martin@exemple.fr
uidNumber: 10001
gidNumber: 10001
homeDirectory: /home/alice
loginShell: /bin/bash
# valeur générée par slappasswd (pas de commentaire en fin de ligne en LDIF)
userPassword: {SSHA}…
```

```bash
slappasswd -h {SSHA}                                   # hachage du mot de passe
ldapadd -x -D cn=admin,dc=corp,dc=exemple,dc=fr -W -f alice.ldif
ldappasswd -x -D cn=admin,dc=corp,dc=exemple,dc=fr -W -S uid=alice,ou=personnes,dc=corp,dc=exemple,dc=fr
```

Avec le module `pw-argon2` (OpenLDAP ≥ 2.5), utilisez des hachages **Argon2** (`olcPasswordHash: {ARGON2}`) plutôt que SSHA.

## Groupes et memberOf

```ldif /tmp/memberof.ldif (activer memberOf et l'intégrité référentielle)
dn: cn=module{0},cn=config
changetype: modify
add: olcModuleLoad
olcModuleLoad: memberof.la
-
add: olcModuleLoad
olcModuleLoad: refint.la

dn: olcOverlay=memberof,olcDatabase={1}mdb,cn=config
changetype: add
objectClass: olcOverlayConfig
objectClass: olcMemberOf
olcOverlay: memberof
olcMemberOfRefint: TRUE

dn: olcOverlay=refint,olcDatabase={1}mdb,cn=config
changetype: add
objectClass: olcOverlayConfig
objectClass: olcRefintConfig
olcOverlay: refint
olcRefintAttribute: memberof member manager owner
```

```bash
sudo ldapmodify -Y EXTERNAL -H ldapi:/// -f /tmp/memberof.ldif
```

```ldif groupe.ldif
dn: cn=admins-reseau,ou=groupes,dc=corp,dc=exemple,dc=fr
objectClass: groupOfNames
cn: admins-reseau
member: uid=alice,ou=personnes,dc=corp,dc=exemple,dc=fr
```

Avec `memberOf`, chaque utilisateur porte la liste de ses groupes (`memberOf: cn=admins-reseau,…`) : les applications filtrent alors simplement (`(&(uid={0})(memberOf=cn=gitlab,ou=groupes,…))`). Pour les systèmes POSIX, ajoutez aussi `posixGroup` (ou un schéma RFC 2307bis).

## Politique de mots de passe

```ldif ppolicy.ldif (OpenLDAP 2.5+)
dn: cn=module{0},cn=config
changetype: modify
add: olcModuleLoad
olcModuleLoad: ppolicy.la

dn: olcOverlay=ppolicy,olcDatabase={1}mdb,cn=config
changetype: add
objectClass: olcOverlayConfig
objectClass: olcPPolicyConfig
olcOverlay: ppolicy
olcPPolicyDefault: cn=defaut,ou=politiques,dc=corp,dc=exemple,dc=fr
olcPPolicyHashCleartext: TRUE
```

L'entrée `cn=defaut` (classe `pwdPolicy`) définit longueur minimale (`pwdMinLength`), historique (`pwdInHistory`), verrouillage (`pwdMaxFailure`, `pwdLockoutDuration`), expiration (`pwdMaxAge`).

## Comptes de liaison applicatifs

Chaque application (GitLab, Grafana, VPN, RADIUS) se lie avec un **compte dédié** en lecture, placé sous `ou=services`, plutôt qu'avec `cn=admin`.

## Contrôle d'accès

```ldif acl.ldif
dn: olcDatabase={1}mdb,cn=config
changetype: modify
replace: olcAccess
olcAccess: {0}to attrs=userPassword
  by self write
  by anonymous auth
  by dn.exact="cn=admin,dc=corp,dc=exemple,dc=fr" write
  by * none
olcAccess: {1}to dn.subtree="ou=personnes,dc=corp,dc=exemple,dc=fr"
  by group.exact="cn=admins-annuaire,ou=groupes,dc=corp,dc=exemple,dc=fr" write
  by dn.children="ou=services,dc=corp,dc=exemple,dc=fr" read
  by self read
  by * none
olcAccess: {2}to *
  by dn.children="ou=services,dc=corp,dc=exemple,dc=fr" read
  by users read
  by * none
```

Les règles sont évaluées **dans l'ordre** ; la première qui correspond à la cible s'applique. Interdisez la lecture anonyme (`olcDisallows: bind_anon` sur `cn=config`) sauf besoin explicite.

## Index

```ldif index.ldif
dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcDbIndex
olcDbIndex: uid,mail,cn eq,sub
olcDbIndex: memberOf,member eq
olcDbIndex: uidNumber,gidNumber eq
```

Un message `… not indexed` dans les journaux signale un index manquant pour un filtre fréquent.

## TLS

```ldif tls.ldif
dn: cn=config
changetype: modify
replace: olcTLSCACertificateFile
olcTLSCACertificateFile: /etc/ldap/tls/ca.crt
-
replace: olcTLSCertificateFile
olcTLSCertificateFile: /etc/ldap/tls/ldap1.crt
-
replace: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/ldap/tls/ldap1.key
-
replace: olcTLSProtocolMin
olcTLSProtocolMin: 3.3
-
replace: olcSecurity
olcSecurity: tls=1
```

```bash
# Écouter aussi en LDAPS (Debian)
sudo sed -i 's|^SLAPD_SERVICES=.*|SLAPD_SERVICES="ldap:/// ldaps:/// ldapi:///"|' /etc/default/slapd
sudo systemctl restart slapd
ldapwhoami -x -H ldaps://ldap1.corp.exemple.fr -D uid=alice,ou=personnes,dc=corp,dc=exemple,dc=fr -W
```

`olcTLSProtocolMin: 3.3` impose TLS 1.2 ; `olcSecurity: tls=1` refuse les opérations non chiffrées (StartTLS obligatoire sur 389). Côté clients : `/etc/ldap/ldap.conf` → `TLS_CACERT /etc/ssl/certs/ca-certificates.crt` et `TLS_REQCERT demand`.
