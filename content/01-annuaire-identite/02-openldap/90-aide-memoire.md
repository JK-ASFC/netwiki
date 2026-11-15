---
title: OpenLDAP — aide-mémoire des commandes
description: Référence complète des commandes OpenLDAP avec exemples — installation (Debian/Ubuntu, Symas pour RHEL, Alpine, macOS, FreeBSD), service slapd et pare-feu, client ldap.conf, recherches ldapsearch (filtres, portée, pagination, attributs opérationnels, StartTLS, SASL EXTERNAL et GSSAPI), ajouts, modifications, renommages et suppressions (ldapadd, ldapmodify, ldapmodrdn, ldapdelete, ldapcompare), mots de passe (slappasswd SSHA, CRYPT et ARGON2, ldappasswd, ldapwhoami), configuration cn=config (index, journalisation, limites, sécurité, ACL olcAccess ordonnées, modules et surcouches memberof, refint, ppolicy, syncprov, monitor), politique de mots de passe et comptes verrouillés, TLS, réplication (fournisseur, consommateur, multi-fournisseur, contextCSN), sauvegarde et restauration (slapcat, slapadd, configuration et données), outils hors ligne (slaptest, slapacl, slapschema, slapindex, mdb_stat), supervision cn=monitor et diagnostic.
tags: [aide-mémoire, openldap, slapd, ldapsearch, ldapmodify, cn=config, slapcat, ppolicy, syncrepl, ldap]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-installation|OpenLDAP]], [[02-entrees-acl-tls|entrées, ACL et TLS]] et [[03-replication-exploitation|réplication et exploitation]]. Exemples : base `dc=corp,dc=exemple,dc=fr`, administrateur `cn=admin,dc=corp,dc=exemple,dc=fr`, serveurs `ldap1.corp.exemple.fr` et `ldap2.corp.exemple.fr`, base de données `olcDatabase={1}mdb,cn=config`.

> [!TIP]
> `-x` = authentification simple ; `-D` = DN de connexion ; `-W` = demander le mot de passe (`-y fichier` pour un script) ; `-H` = URI du serveur ; `-b` = base de recherche ; `-LLL` = LDIF sans commentaires ; `-Y EXTERNAL -H ldapi:///` = connexion locale en root, sans mot de passe, pour administrer `cn=config`. Chemins Debian/Ubuntu : configuration `/etc/ldap/slapd.d`, données `/var/lib/ldap`, compte `openldap` ; Symas (RHEL) : préfixe `/opt/symas`.

## Installation et service

```bash
# Debian / Ubuntu (l'installation demande le mot de passe administrateur)
sudo apt install slapd ldap-utils
sudo dpkg-reconfigure slapd                       # redéfinir domaine, organisation et mot de passe
# Alpine
sudo apk add openldap openldap-back-mdb openldap-clients openldap-overlay-all
# macOS (client et serveur)
brew install openldap
# FreeBSD
sudo pkg install openldap26-server
sudo sysrc slapd_enable=YES

# Service, version, ports
sudo systemctl enable --now slapd
sudo systemctl status slapd
slapd -VV
sudo ss -ltnp | grep slapd                        # 389 (ldap), 636 (ldaps)
sudo journalctl -u slapd -f

# Adresses d'écoute (Debian : /etc/default/slapd)
# SLAPD_SERVICES="ldap:/// ldaps:/// ldapi:///"
sudo systemctl restart slapd

# Pare-feu
sudo ufw allow from 10.0.0.0/16 to any port 389,636 proto tcp
sudo firewall-cmd --permanent --add-service=ldap --add-service=ldaps && sudo firewall-cmd --reload

# Vérifier la configuration
sudo slaptest -u -F /etc/ldap/slapd.d
```

## Client : /etc/ldap/ldap.conf

```text /etc/ldap/ldap.conf
BASE        dc=corp,dc=exemple,dc=fr
URI         ldaps://ldap1.corp.exemple.fr ldaps://ldap2.corp.exemple.fr
TLS_CACERT  /etc/ssl/certs/ca-corp.crt
TLS_REQCERT demand
```

Sous RHEL, le fichier client est `/etc/openldap/ldap.conf` ; sous macOS, `/etc/openldap/ldap.conf` également. Une variable d'environnement remplace un réglage le temps d'une commande : `LDAPTLS_CACERT=/tmp/ca.crt ldapsearch …`.

## Rechercher

```bash
# Anonyme, puis authentifiée
ldapsearch -x -H ldaps://ldap1.corp.exemple.fr -b "dc=corp,dc=exemple,dc=fr" "(uid=amartin)"
ldapsearch -x -H ldaps://ldap1.corp.exemple.fr -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -b "ou=people,dc=corp,dc=exemple,dc=fr" "(objectClass=inetOrgPerson)" cn mail

# Mot de passe dans un fichier protégé (scripts) : sans retour à la ligne final
printf '%s' 'MotDePasseLongEtUnique' > ~/.ldap-admin && chmod 600 ~/.ldap-admin
ldapsearch -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -y ~/.ldap-admin -b "dc=corp,dc=exemple,dc=fr" "(uid=amartin)"

# Filtres
ldapsearch -x -LLL -b "dc=corp,dc=exemple,dc=fr" "(&(objectClass=posixAccount)(|(ou=Reseau)(ou=Systeme)))" uid
ldapsearch -x -LLL -b "dc=corp,dc=exemple,dc=fr" "(!(mail=*))" dn                          # sans adresse
ldapsearch -x -LLL -b "dc=corp,dc=exemple,dc=fr" "(cn=*martin*)" cn                        # sous-chaîne
ldapsearch -x -LLL -b "dc=corp,dc=exemple,dc=fr" "(uidNumber>=10000)" uid uidNumber
ldapsearch -x -LLL -b "dc=corp,dc=exemple,dc=fr" "(memberOf=cn=reseau,ou=groups,dc=corp,dc=exemple,dc=fr)" uid
ldapsearch -x -LLL -b "dc=corp,dc=exemple,dc=fr" "(modifyTimestamp>=20261101000000Z)" dn modifyTimestamp

# Portée (base, one, sub), limite, pagination, lignes non coupées
ldapsearch -x -LLL -b "ou=people,dc=corp,dc=exemple,dc=fr" -s one -z 50 "(cn=*)" dn
ldapsearch -x -LLL -b "dc=corp,dc=exemple,dc=fr" -E pr=500/noprompt "(objectClass=person)" dn
ldapsearch -x -LLL -o ldif-wrap=no -b "dc=corp,dc=exemple,dc=fr" "(uid=amartin)"

# Attributs opérationnels (+), tous les attributs utilisateur (*)
ldapsearch -x -LLL -b "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr" -s base "*" "+"
ldapsearch -x -LLL -b "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr" -s base createTimestamp modifiersName entryUUID

# Racine (suffixes, contrôles et extensions pris en charge)
ldapsearch -x -LLL -H ldap://ldap1.corp.exemple.fr -s base -b "" "+"
ldapsearch -x -LLL -H ldap://ldap1.corp.exemple.fr -s base -b "" namingContexts supportedSASLMechanisms

# StartTLS obligatoire, Kerberos (SASL GSSAPI), configuration locale (EXTERNAL)
ldapsearch -x -ZZ -H ldap://ldap1.corp.exemple.fr -b "dc=corp,dc=exemple,dc=fr" -s base
kinit amartin && ldapsearch -Y GSSAPI -H ldap://ldap1.corp.exemple.fr -b "dc=corp,dc=exemple,dc=fr" "(uid=amartin)"
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=config "(olcDatabase=*)" olcDatabase olcSuffix

# Comparer une valeur sans la lire (code 6 = vrai, 5 = faux)
ldapcompare -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr" "mail:alice.martin@exemple.fr"
```

## Ajouter, modifier, renommer, supprimer

```bash
cat > ou.ldif <<'EOF'
dn: ou=people,dc=corp,dc=exemple,dc=fr
objectClass: organizationalUnit
ou: people

dn: ou=groups,dc=corp,dc=exemple,dc=fr
objectClass: organizationalUnit
ou: groups

dn: ou=services,dc=corp,dc=exemple,dc=fr
objectClass: organizationalUnit
ou: services
EOF
ldapadd -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -f ou.ldif

cat > utilisateur.ldif <<'EOF'
dn: uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr
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
ldapadd -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -f utilisateur.ldif

# Groupe groupOfNames (compatible memberOf) et groupe POSIX
ldapadd -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W <<'EOF'
dn: cn=reseau,ou=groups,dc=corp,dc=exemple,dc=fr
objectClass: groupOfNames
cn: reseau
member: uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr

dn: cn=reseau-posix,ou=groups,dc=corp,dc=exemple,dc=fr
objectClass: posixGroup
cn: reseau-posix
gidNumber: 10000
memberUid: amartin
EOF

# Modifications multiples dans une seule opération
ldapmodify -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W <<'EOF'
dn: uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr
changetype: modify
replace: mail
mail: a.martin@exemple.fr
-
add: telephoneNumber
telephoneNumber: +33 1 23 45 67 01
-
delete: description
EOF

# Ajouter / retirer un membre
ldapmodify -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W <<'EOF'
dn: cn=reseau,ou=groups,dc=corp,dc=exemple,dc=fr
changetype: modify
add: member
member: uid=bpetit,ou=people,dc=corp,dc=exemple,dc=fr
EOF
ldapmodify -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W <<'EOF'
dn: cn=reseau,ou=groups,dc=corp,dc=exemple,dc=fr
changetype: modify
delete: member
member: uid=bpetit,ou=people,dc=corp,dc=exemple,dc=fr
EOF

# Ajout en masse en continuant malgré les erreurs (-c)
ldapadd -c -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -f import-utilisateurs.ldif

# Renommer (-r : supprimer l'ancien RDN) / déplacer vers une autre branche (-s)
ldapmodrdn -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -r "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr" "uid=amartin-durand"
ldapmodrdn -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -r -s "ou=anciens,dc=corp,dc=exemple,dc=fr" "uid=bpetit,ou=people,dc=corp,dc=exemple,dc=fr" "uid=bpetit"

# Supprimer une entrée, ou une branche entière (-r)
ldapdelete -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W "uid=amartin-durand,ou=people,dc=corp,dc=exemple,dc=fr"
ldapdelete -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -r "ou=ancien,dc=corp,dc=exemple,dc=fr"
```

## Mots de passe

```bash
# Empreintes (olcRootPW, userPassword importé)
slappasswd -h '{SSHA}'
slappasswd -h '{CRYPT}' -c '$6$%.16s'                       # SHA-512 crypt
slappasswd -o module-load=argon2 -h '{ARGON2}'              # OpenLDAP 2.5+ avec le module argon2

# Définir / changer
ldappasswd -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -S "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr"   # saisie du nouveau mot de passe
ldappasswd -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr"      # mot de passe aléatoire affiché
ldappasswd -x -D "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr" -W -S                                         # l'utilisateur change le sien

# Tester une authentification
ldapwhoami -x -H ldaps://ldap1.corp.exemple.fr -D "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr" -W
ldapwhoami -Y EXTERNAL -H ldapi:///                         # en root sur le serveur

# Mot de passe de l'administrateur de la base
HASH=$(slappasswd -h '{SSHA}')
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<EOF
dn: olcDatabase={1}mdb,cn=config
changetype: modify
replace: olcRootPW
olcRootPW: $HASH
EOF
```

## Configuration cn=config

```bash
# Lire
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=config "(objectClass=olcDatabaseConfig)" olcDatabase olcSuffix olcRootDN olcDbIndex
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=config -s base olcLogLevel olcTLSCertificateFile
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=schema,cn=config dn          # schémas chargés
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=config "(objectClass=olcModuleList)" olcModuleLoad
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b "olcDatabase={1}mdb,cn=config" olcAccess

# Index (puis les entrées existantes sont indexées automatiquement en tâche de fond)
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcDbIndex
olcDbIndex: mail eq,sub
olcDbIndex: memberOf eq
olcDbIndex: entryCSN,entryUUID eq
EOF

# Journalisation (stats = connexions et opérations ; none pour couper)
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: cn=config
changetype: modify
replace: olcLogLevel
olcLogLevel: stats
EOF

# Limites de taille et de durée, exception pour un compte applicatif
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase={1}mdb,cn=config
changetype: modify
replace: olcSizeLimit
olcSizeLimit: 500
-
replace: olcLimits
olcLimits: dn.exact="cn=app-intranet,ou=services,dc=corp,dc=exemple,dc=fr" size=unlimited time=unlimited
-
replace: olcDbMaxSize
olcDbMaxSize: 10737418240
EOF

# Sécurité : pas de liaison anonyme, authentification exigée, TLS 1.2 minimum, TLS obligatoire hors ldapi
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: cn=config
changetype: modify
replace: olcDisallows
olcDisallows: bind_anon
-
replace: olcRequires
olcRequires: authc
-
replace: olcTLSProtocolMin
olcTLSProtocolMin: 3.3
-
replace: olcSecurity
olcSecurity: tls=1
EOF

# Algorithme des mots de passe enregistrés (frontend)
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase={-1}frontend,cn=config
changetype: modify
replace: olcPasswordHash
olcPasswordHash: {CRYPT}
EOF
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: cn=config
changetype: modify
replace: olcPasswordCryptSaltFormat
olcPasswordCryptSaltFormat: $6$%.16s
EOF

# Charger un schéma livré (exemple : schéma « misc »)
sudo ldapadd -Y EXTERNAL -H ldapi:/// -f /etc/ldap/schema/misc.ldif
```

### ACL (olcAccess)

Les règles sont évaluées dans l'ordre `{0}`, `{1}`… ; la première qui correspond à la cible s'applique.

```bash
# Remplacer toutes les règles
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase={1}mdb,cn=config
changetype: modify
replace: olcAccess
olcAccess: {0}to attrs=userPassword by self write by anonymous auth by dn.exact="cn=replicateur,ou=services,dc=corp,dc=exemple,dc=fr" read by * none
olcAccess: {1}to attrs=shadowLastChange by self write by users read by * none
olcAccess: {2}to dn.subtree="ou=people,dc=corp,dc=exemple,dc=fr" by group.exact="cn=admins-ldap,ou=groups,dc=corp,dc=exemple,dc=fr" write by users read by * none
olcAccess: {3}to * by users read by * none
EOF

# Insérer une règle en position 1 (les suivantes sont renumérotées)
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcAccess
olcAccess: {1}to attrs=telephoneNumber by self write by users read by * none
EOF

# Supprimer la règle numéro 1
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase={1}mdb,cn=config
changetype: modify
delete: olcAccess
olcAccess: {1}
EOF

# Tester une ACL hors ligne : bpetit peut-il lire le mot de passe d'amartin ?
sudo slapacl -F /etc/ldap/slapd.d -D "uid=bpetit,ou=people,dc=corp,dc=exemple,dc=fr" -b "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr" userPassword/read
```

### Modules et surcouches (overlays)

```bash
# memberOf automatique et intégrité référentielle des membres
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: cn=module{0},cn=config
changetype: modify
add: olcModuleLoad
olcModuleLoad: memberof
olcModuleLoad: refint
EOF
sudo ldapadd -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcOverlay=memberof,olcDatabase={1}mdb,cn=config
objectClass: olcOverlayConfig
objectClass: olcMemberOf
olcOverlay: memberof
olcMemberOfRefInt: TRUE
olcMemberOfGroupOC: groupOfNames
olcMemberOfMemberAD: member
olcMemberOfMemberOfAD: memberOf

dn: olcOverlay=refint,olcDatabase={1}mdb,cn=config
objectClass: olcOverlayConfig
objectClass: olcRefintConfig
olcOverlay: refint
olcRefintAttribute: member memberOf
EOF
# Surcouches actives sur la base
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b "olcDatabase={1}mdb,cn=config" "(objectClass=olcOverlayConfig)" olcOverlay
```

`memberof` ne calcule `memberOf` que pour les appartenances créées **après** son activation : pour les groupes existants, retirez puis rajoutez les membres (ou réimportez les groupes).

## Politique de mots de passe (ppolicy) et comptes verrouillés

OpenLDAP 2.5 et plus : le schéma est intégré au module `ppolicy` (avec la 2.4, chargez d'abord `/etc/ldap/schema/ppolicy.ldif`). Activation du module et de la surcouche : voir [[02-entrees-acl-tls|entrées, ACL et TLS]].

```bash
# Politique par défaut
ldapadd -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W <<'EOF'
dn: ou=politiques,dc=corp,dc=exemple,dc=fr
objectClass: organizationalUnit
ou: politiques

dn: cn=defaut,ou=politiques,dc=corp,dc=exemple,dc=fr
objectClass: organizationalRole
objectClass: pwdPolicy
cn: defaut
pwdAttribute: userPassword
pwdMinLength: 12
pwdCheckQuality: 1
pwdInHistory: 10
pwdMaxFailure: 5
pwdFailureCountInterval: 900
pwdLockout: TRUE
pwdLockoutDuration: 900
pwdMaxAge: 15552000
pwdExpireWarning: 1209600
pwdMustChange: TRUE
pwdAllowUserChange: TRUE
EOF

# Comptes verrouillés (attribut opérationnel : à demander explicitement)
ldapsearch -x -LLL -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -b "ou=people,dc=corp,dc=exemple,dc=fr" "(pwdAccountLockedTime=*)" pwdAccountLockedTime pwdFailureTime

# Déverrouiller
ldapmodify -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W <<'EOF'
dn: uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr
changetype: modify
delete: pwdAccountLockedTime
EOF

# Forcer le changement à la prochaine connexion
ldapmodify -x -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W <<'EOF'
dn: uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr
changetype: modify
replace: pwdReset
pwdReset: TRUE
EOF

# Date du dernier changement
ldapsearch -x -LLL -D "cn=admin,dc=corp,dc=exemple,dc=fr" -W -b "uid=amartin,ou=people,dc=corp,dc=exemple,dc=fr" -s base pwdChangedTime
```

## TLS

```bash
# Certificat du serveur : clé lisible par slapd seulement
sudo install -d -o openldap -g openldap -m 750 /etc/ldap/tls
sudo chown openldap:openldap /etc/ldap/tls/ldap.key && sudo chmod 640 /etc/ldap/tls/ldap.key

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

# Contrôles
ldapsearch -x -ZZ -H ldap://ldap1.corp.exemple.fr -b "dc=corp,dc=exemple,dc=fr" -s base   # StartTLS
ldapsearch -x -H ldaps://ldap1.corp.exemple.fr -b "dc=corp,dc=exemple,dc=fr" -s base       # LDAPS
openssl s_client -connect ldap1.corp.exemple.fr:636 -showcerts </dev/null
openssl s_client -connect ldap1.corp.exemple.fr:389 -starttls ldap </dev/null
openssl x509 -in /etc/ldap/tls/ldap.crt -noout -subject -ext subjectAltName -enddate
```

## Réplication

```bash
# Synchronisation : contextCSN identiques sur tous les serveurs
for s in ldap1 ldap2; do echo "== $s"; ldapsearch -x -LLL -H ldaps://$s.corp.exemple.fr -s base -b "dc=corp,dc=exemple,dc=fr" contextCSN; done

# Consommateur en lecture seule (le fournisseur porte la surcouche syncprov)
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase={1}mdb,cn=config
changetype: modify
add: olcSyncrepl
olcSyncrepl: rid=101 provider=ldaps://ldap1.corp.exemple.fr bindmethod=simple binddn="cn=replicateur,ou=services,dc=corp,dc=exemple,dc=fr" credentials=MotDePasseLongEtUnique searchbase="dc=corp,dc=exemple,dc=fr" type=refreshAndPersist retry="5 5 300 +" timeout=1 tls_reqcert=demand
-
add: olcUpdateRef
olcUpdateRef: ldaps://ldap1.corp.exemple.fr
EOF

# Paramètres de réplication en place
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b "olcDatabase={1}mdb,cn=config" olcSyncrepl olcMultiProvider olcUpdateRef
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b cn=config -s base olcServerID

# Suivre la réplication dans le journal (olcLogLevel: stats sync)
sudo journalctl -u slapd -f | grep -i -E "syncrepl|do_syncrep"
```

Configuration multi-fournisseur complète : [[03-replication-exploitation|réplication et exploitation]].

## Sauvegarde et restauration

```bash
# Sauvegarde à chaud : données (-n 1) et configuration (-n 0)
sudo slapcat -n 1 -l /srv/sauvegardes/ldap-donnees-$(date +%F).ldif
sudo slapcat -n 0 -l /srv/sauvegardes/ldap-config-$(date +%F).ldif
sudo slapcat -b "dc=corp,dc=exemple,dc=fr" -a "(objectClass=posixAccount)" -l /tmp/comptes.ldif   # extrait filtré

# Restauration des données (service arrêté, base vide)
sudo systemctl stop slapd
sudo mv /var/lib/ldap /var/lib/ldap.ancien && sudo install -d -o openldap -g openldap -m 700 /var/lib/ldap
sudo -u openldap slapadd -n 1 -F /etc/ldap/slapd.d -l /srv/sauvegardes/ldap-donnees-2026-11-15.ldif
sudo systemctl start slapd

# Restauration de la configuration (répertoire slapd.d vide)
sudo systemctl stop slapd
sudo mv /etc/ldap/slapd.d /etc/ldap/slapd.d.ancien && sudo install -d -o openldap -g openldap -m 750 /etc/ldap/slapd.d
sudo -u openldap slapadd -n 0 -F /etc/ldap/slapd.d -l /srv/sauvegardes/ldap-config-2026-11-15.ldif
sudo systemctl start slapd

# Sauvegarde quotidienne (cron)
echo '30 2 * * * root slapcat -n 1 -l /srv/sauvegardes/ldap-donnees-$(date +\%F).ldif && slapcat -n 0 -l /srv/sauvegardes/ldap-config-$(date +\%F).ldif' | sudo tee /etc/cron.d/sauvegarde-ldap
```

## Outils hors ligne

```bash
sudo slaptest -u -F /etc/ldap/slapd.d                         # configuration valide ?
sudo -u openldap slapschema -F /etc/ldap/slapd.d -n 1          # données conformes au schéma ?
sudo systemctl stop slapd && sudo -u openldap slapindex -F /etc/ldap/slapd.d -n 1 && sudo systemctl start slapd   # réindexer
sudo slapdn -F /etc/ldap/slapd.d "uid=AMartin,OU=People,DC=corp,DC=exemple,DC=fr"   # forme normalisée d'un DN
sudo mdb_stat -e /var/lib/ldap                                 # occupation de la base LMDB (paquet lmdb-utils)

# slapd au premier plan avec traces (service arrêté)
sudo systemctl stop slapd
sudo slapd -d 256 -h "ldap:/// ldaps:/// ldapi:///" -u openldap -g openldap -F /etc/ldap/slapd.d
```

## Supervision (cn=monitor)

```bash
sudo ldapmodify -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: cn=module{0},cn=config
changetype: modify
add: olcModuleLoad
olcModuleLoad: back_monitor
EOF
sudo ldapadd -Y EXTERNAL -H ldapi:/// <<'EOF'
dn: olcDatabase=monitor,cn=config
objectClass: olcDatabaseConfig
olcDatabase: monitor
olcAccess: {0}to * by dn.exact="gidNumber=0+uidNumber=0,cn=peercred,cn=external,cn=auth" read by * none
EOF

sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b "cn=Current,cn=Connections,cn=Monitor" -s base monitorCounter
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b "cn=Operations,cn=Monitor" -s one monitorOpInitiated monitorOpCompleted
sudo ldapsearch -Q -LLL -Y EXTERNAL -H ldapi:/// -b "cn=Monitor" -s base monitoredInfo
```

## Diagnostic

```bash
ldapsearch -d 1 -x -H ldaps://ldap1.corp.exemple.fr -b "" -s base     # traces côté client (TLS, connexion)
LDAPTLS_REQCERT=never ldapsearch -x -H ldaps://ldap1.corp.exemple.fr -b "" -s base   # isoler un problème de certificat (test uniquement)
sudo journalctl -u slapd --since "10 min ago" | grep -E "conn=|err="
nc -zv ldap1.corp.exemple.fr 389 && nc -zv ldap1.corp.exemple.fr 636
```

| Code | Signification | Piste |
| --- | --- | --- |
| `32 No such object` | Base de recherche ou DN inexistant | Vérifier `-b` et l'orthographe du DN |
| `34 Invalid DN syntax` | DN mal formé | Virgules, `=`, caractères spéciaux à échapper |
| `48 Inappropriate authentication` | Liaison anonyme refusée (`bind_anon`) | Fournir `-D` et `-W` |
| `49 Invalid credentials` | DN ou mot de passe faux, compte verrouillé (ppolicy) | `ldapwhoami`, `pwdAccountLockedTime` |
| `50 Insufficient access` | ACL refusant l'opération | `olcAccess`, `slapacl` |
| `53 Unwilling to perform` | Écriture sur un consommateur, TLS exigé (`olcSecurity`) | Écrire sur le fournisseur ; `-ZZ` ou `ldaps://` |
| `65 Object class violation` | Attribut obligatoire manquant ou non autorisé | Classes d'objet de l'entrée |
| `68 Already exists` | DN déjà présent | `ldapmodify` au lieu de `ldapadd` |
| `80 Other (implementation specific)` | Souvent `cn=config` invalide ou module absent | Journal de slapd, `slaptest` |
| `-1 Can't contact LDAP server` | Réseau, port, certificat TLS | `nc -zv`, `openssl s_client`, `TLS_CACERT` |
