---
title: OpenLDAP — aide-mémoire des commandes
description: Commandes OpenLDAP avec exemples — service slapd, configuration cn=config (ldapmodify -Y EXTERNAL), recherches (ldapsearch avec filtres et attributs), ajouts, modifications et suppressions (ldapadd, ldapmodify, ldapdelete, ldapmodrdn), mots de passe (slappasswd, ldappasswd), schémas et index, TLS, réplication syncrepl, sauvegarde et restauration (slapcat, slapadd), diagnostic (slaptest, journaux).
tags: [aide-mémoire, openldap, ldapsearch, ldapmodify, slapcat, ldap]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|OpenLDAP]]. Base d'exemple : `dc=exemple,dc=fr`, administrateur `cn=admin,dc=exemple,dc=fr`.

## Service

```bash
sudo systemctl status slapd
sudo systemctl restart slapd
sudo dpkg-reconfigure slapd                 # Debian/Ubuntu : réinitialiser domaine et mot de passe
sudo journalctl -u slapd -f
sudo slaptest -u -F /etc/ldap/slapd.d       # vérifier la configuration (RHEL : /etc/openldap/slapd.d)
```

## Rechercher

```bash
# Recherche anonyme ou authentifiée (-x simple, -D compte, -W demander le mot de passe)
ldapsearch -x -H ldap://ldap.exemple.fr -b "dc=exemple,dc=fr" "(uid=amartin)"
ldapsearch -x -H ldaps://ldap.exemple.fr -D "cn=admin,dc=exemple,dc=fr" -W -b "ou=people,dc=exemple,dc=fr" "(objectClass=inetOrgPerson)" cn mail
# Filtres combinés
ldapsearch -x -b "dc=exemple,dc=fr" "(&(objectClass=posixAccount)(|(ou=Reseau)(ou=Systeme)))" uid
ldapsearch -x -b "dc=exemple,dc=fr" "(!(mail=*))" dn
# Portée : base, one, sub ; limite de résultats
ldapsearch -x -b "ou=people,dc=exemple,dc=fr" -s one -z 50 "(cn=*)" dn
# Attributs opérationnels
ldapsearch -x -b "uid=amartin,ou=people,dc=exemple,dc=fr" -s base "+"
# Lire la configuration (en root sur le serveur, via le socket local)
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=config "(olcDatabase=*)" olcDatabase olcSuffix
# Contexte racine (suffixes, extensions supportées)
ldapsearch -x -H ldap://ldap.exemple.fr -s base -b "" "+"
```

## Ajouter, modifier, supprimer

```bash
cat > utilisateur.ldif <<'EOF'
dn: uid=amartin,ou=people,dc=exemple,dc=fr
objectClass: inetOrgPerson
objectClass: posixAccount
objectClass: shadowAccount
uid: amartin
cn: Alice Martin
sn: Martin
givenName: Alice
mail: alice.martin@exemple.fr
uidNumber: 10001
gidNumber: 10000
homeDirectory: /home/amartin
loginShell: /bin/bash
EOF
ldapadd -x -D "cn=admin,dc=exemple,dc=fr" -W -f utilisateur.ldif

cat > modif.ldif <<'EOF'
dn: uid=amartin,ou=people,dc=exemple,dc=fr
changetype: modify
replace: mail
mail: a.martin@exemple.fr
-
add: telephoneNumber
telephoneNumber: +33 1 23 45 67 01
-
delete: description
EOF
ldapmodify -x -D "cn=admin,dc=exemple,dc=fr" -W -f modif.ldif

# Ajouter un membre à un groupe
ldapmodify -x -D "cn=admin,dc=exemple,dc=fr" -W <<'EOF'
dn: cn=reseau,ou=groups,dc=exemple,dc=fr
changetype: modify
add: memberUid
memberUid: amartin
EOF

# Renommer / déplacer
ldapmodrdn -x -D "cn=admin,dc=exemple,dc=fr" -W -r "uid=amartin,ou=people,dc=exemple,dc=fr" "uid=amartin-durand"
# Supprimer (récursivement avec -r)
ldapdelete -x -D "cn=admin,dc=exemple,dc=fr" -W "uid=amartin-durand,ou=people,dc=exemple,dc=fr"
ldapdelete -x -D "cn=admin,dc=exemple,dc=fr" -W -r "ou=ancien,dc=exemple,dc=fr"
```

## Mots de passe

```bash
slappasswd -h '{SSHA}'                                     # générer une empreinte pour olcRootPW ou userPassword
ldappasswd -x -D "cn=admin,dc=exemple,dc=fr" -W -S "uid=amartin,ou=people,dc=exemple,dc=fr"   # définir (saisie)
ldappasswd -x -D "uid=amartin,ou=people,dc=exemple,dc=fr" -W -S                               # l'utilisateur change le sien
ldapwhoami -x -D "uid=amartin,ou=people,dc=exemple,dc=fr" -W                                  # tester une authentification
```

## Configuration cn=config

```bash
# Index
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcDbIndex
olcDbIndex: mail eq,sub
EOF
# Niveau de journalisation
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: cn=config
changetype: modify
replace: olcLogLevel
olcLogLevel: stats
EOF
# Charger un schéma ou un module
sudo ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/ppolicy.ldif
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: cn=module{0},cn=config
changetype: modify
add: olcModuleLoad
olcModuleLoad: memberof
EOF
# Lister les schémas chargés
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=schema,cn=config dn
```

## TLS

```bash
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: cn=config
changetype: modify
replace: olcTLSCertificateFile
olcTLSCertificateFile: /etc/ldap/tls/ldap.crt
-
replace: olcTLSCertificateKeyFile
olcTLSCertificateKeyFile: /etc/ldap/tls/ldap.key
-
replace: olcTLSCACertificateFile
olcTLSCACertificateFile: /etc/ldap/tls/ca.crt
EOF
ldapsearch -x -ZZ -H ldap://ldap.exemple.fr -b "dc=exemple,dc=fr" -s base   # StartTLS obligatoire (-ZZ)
openssl s_client -connect ldap.exemple.fr:636 -showcerts </dev/null
```

## Réplication, sauvegarde, restauration

```bash
# Vérifier la synchronisation (contextCSN identiques sur fournisseur et consommateur)
ldapsearch -x -H ldap://ldap1.exemple.fr -s base -b "dc=exemple,dc=fr" contextCSN
ldapsearch -x -H ldap://ldap2.exemple.fr -s base -b "dc=exemple,dc=fr" contextCSN
# Sauvegarde à chaud (données et configuration)
sudo slapcat -n 1 -l /srv/sauvegardes/donnees-$(date +%F).ldif
sudo slapcat -n 0 -l /srv/sauvegardes/config-$(date +%F).ldif
# Restauration (service arrêté, répertoire de base vide)
sudo systemctl stop slapd
sudo slapadd -n 1 -F /etc/ldap/slapd.d -l /srv/sauvegardes/donnees-2026-10-29.ldif
sudo chown -R openldap:openldap /var/lib/ldap
sudo systemctl start slapd
# Réindexer après l'ajout d'un index
sudo systemctl stop slapd && sudo -u openldap slapindex -n 1 && sudo systemctl start slapd
```

## Codes d'erreur fréquents

| Code | Signification |
| --- | --- |
| `32 No such object` | Base de recherche ou DN inexistant |
| `49 Invalid credentials` | DN ou mot de passe faux |
| `50 Insufficient access` | ACL refusant l'opération |
| `65 Object class violation` | Attribut obligatoire manquant ou non autorisé par les classes |
| `68 Already exists` | DN déjà présent |
| `-1 Can't contact LDAP server` | Réseau, port, certificat TLS |
