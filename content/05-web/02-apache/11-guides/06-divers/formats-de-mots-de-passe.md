---
title: "Formats de mots de passe"
description: "Apache HTTP Server — Formats de mots de passe. Notes à propos des formats de chiffrement des mots de passe générés et compris par Apache."
tags: [apache, guide]
icon: book-open
---

Notes à propos des formats de chiffrement des mots de passe générés et compris par Apache.

## Authentification de base

Voici les cinq formats de mots de passe qu'Apache reconnaît pour l'authentification de base. Notez que tous les formats ne sont pas supportés par toutes les plates-formes :

**bcrypt**

"$2y$" + the result of the crypt\_blowfish algorithm. Dérivé de l'algorythme de chiffrement crypt\_blowfish. Voir le fichier source APR [crypt\_blowfish.c](http://svn.apache.org/viewvc/apr/apr/trunk/crypto/crypt_blowfish.c?view=markup) pour plus de détails à propos de cet algorithme.

**MD5**

"$apr1$" + le résultat d'un algorithme spécifique à Apache utilisant un condensé MD5 réitéré (1000 fois) de combinaisons variées du mot de passe et d'une source d'entropie sur 32 bits. Voir le fichier source APR [apr\_md5.c](http://svn.apache.org/viewvc/apr/apr/trunk/crypto/apr_md5.c?view=markup) pour les détails de l'algorithme.

**SHA1**

"{SHA}" + un condensé SHA-1 du mot de passe codé en Base64. Non sûr.

**CRYPT**

Unix seulement. Utilise la fonction Unix traditionnelle `crypt(3)` avec une source d'entropie sur 32 bits (seuls 12 bits sont utilisés), et seulement les 8 premiers caractères du mot de passe. Non sûr.

**PLAIN TEXT (autrement dit *non chiffré*)**

Windows & Netware seulement. Non sûr.

### Générer des mots de passe avec htpasswd

**bcrypt**

```
$ htpasswd -nbB monNom monMot-de-passe
monNom:$2y$05$c4WoMPo3SXsafkva.HHa6uXQZWr7oboPiC2bT/r7q1BB8I2s0BRqC
```

**MD5**

```
$ htpasswd -nbm monNom monMot-de-passe
monNom:$apr1$r31.....$HqJZimcKQFAMYayBlzkrA/
```

**SHA1**

```
$ htpasswd -nbs monNom monMot-de-passe
monNom:{SHA}VBPuJHI7uixaa6LQGWx4s+5GKNE=
```

**CRYPT**

```
$ htpasswd -nbd monNom monMot-de-passe
monNom:rqXexS6ZhobKA
```

### Générer des mots de passe CRYPT and MD5 avec le programme OpenSSL en ligne de commande

OpenSSL connaît l'algorithme MD5 spécifique à Apache.

**MD5**

```
$ openssl passwd -apr1 monMot-de-passe
$apr1$qHDFfhPC$nITSVHgYbDAK1Y0acGRnY0
```

**CRYPT**

```
openssl passwd -crypt monMot-de-passe
qQ5vTYO3c8dsU
```

### Valider des mots de passe CRYPT and MD5 avec le programme OpenSSL en ligne de commande

La source d'entropie pour un mot de passe CRYPT est constituée des deux premiers caractères (convertis en valeur binaire). Pour valider `monMot-de-passe` par rapport à `rqXexS6ZhobKA`

**CRYPT**

```
$ openssl passwd -crypt -salt rq monMot-de-passe
Warning: truncating password to 8 characters
rqXexS6ZhobKA
```

Notez que spécifier `monMot-d` au lieu de `monMot-de-passe` produira le même résultat car seuls les 8 premiers caractères des mots de passe CRYPT sont pris en compte.

La source d'entropie pour un mot de passe MD5 se situe entre `$apr1$` et le caractère `$` suivant (sous la forme d'une valeur binaire codée en Base64 - au maximum 8 caractères). Pour valider `monMot-de-passe` par rapport à `$apr1$r31.....$HqJZimcKQFAMYayBlzkrA/`

**MD5**

```
$ openssl passwd -apr1 -salt r31..... monMot-de-passe
$apr1$r31.....$HqJZimcKQFAMYayBlzkrA/
```

### Champs mot de passe de base de données pour mod\_dbd

La variante SHA1 constitue probablement le format le mieux approprié pour l'authentification DBD. Comme les fonctions SHA1 et Base64 sont en général disponibles, d'autres logiciels peuvent renseigner une base de données avec des mots de passe chiffrés utilisables par l'authentification basique d'Apache.

Pour créer des mots de passe au format SHA1 pour l'authentification de base d'Apache dans divers langages :

**PHP**

```
'{SHA}' . base64_encode(sha1($password, TRUE))
```

**Java**

```
"{SHA}" + new sun.misc.BASE64Encoder().encode(java.security.MessageDigest.getInstance("SHA1").digest(password.getBytes()))
```

**ColdFusion**

```
"{SHA}" & ToBase64(BinaryDecode(Hash(password, "SHA1"), "Hex"))
```

**Ruby**

```
require 'digest/sha1'
require 'base64'
'{SHA}' + Base64.encode64(Digest::SHA1.digest(password))
```

**C ou C++**

```
Utilisez la fonction APR : apr_sha1_base64
```

**Python**

```
import base64
import hashlib
"{SHA}" + format(base64.b64encode(hashlib.sha1(password).digest()))
```

**PostgreSQL (avec les fonctions contrib/pgcrypto installées)**

```
'{SHA}'||encode(digest(password,'sha1'),'base64')
```

## Authentification à base de condensés

Apache ne reconnaît qu'un format pour les mots de passe d'authentification à base de condensés - le condensé MD5 de la chaîne `utilisateur:domaine-de-protection:mot-de-passe` sous la forme d'une chaîne de 32 caractères au format hexadécimal. `domaine-de-protection` est l'identifiant du domaine de protection de l'autorisation passé en argument à la directive [[13-directives/authname|AuthName]] dans httpd.conf.

### Champs de mot de passe de base de données pour mod\_dbd

Comme la fonction MD5 est en général disponible, d'autres logiciels peuvent renseigner une base de données avec des mots de passe chiffrés utilisables par l'authentification à base de condensés d'Apache.

Pour créer des mots de passe pour l'authentification à base de condensés d'Apache dans divers langages :

**PHP**

```
md5($user . ':' . $realm . ':' .$password)
```

**Java**

```
byte b[] = java.security.MessageDigest.getInstance("MD5").digest( (user + ":" + realm + ":" + password ).getBytes());
java.math.BigInteger bi = new java.math.BigInteger(1, b);
String s = bi.toString(16);
while (s.length() < 32)

  s = "0" + s;

// La chaîne s contient le mot de passe chiffré
```

**ColdFusion**

```
LCase(Hash( (user & ":" & realm & ":" & password) , "MD5"))
```

**Ruby**

```
require 'digest/md5'
Digest::MD5.hexdigest(user + ':' + realm + ':' + password)
```

**PostgreSQL (avec les fonctions contrib/pgcrypto installées)**

```
encode(digest( user || ':' || realm || ':' || password , 'md5'), 'hex')
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
