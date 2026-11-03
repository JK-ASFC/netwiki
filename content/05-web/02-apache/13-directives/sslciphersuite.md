---
title: "SSLCipherSuite"
description: "Directive Apache SSLCipherSuite (mod_ssl) — Algorithmes de chiffrement disponibles pour la négociation au cours de l'initialisation de la connexion SSL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Algorithmes de chiffrement disponibles pour la négociation au cours de l'initialisation de la connexion SSL |
| **Syntaxe** | `SSLCipherSuite [protocol] cipher-spec` |
| **Valeur par défaut** | `SSLCipherSuite DEFAULT (dépend de la version d'OpenSSL installée)` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive complexe utilise la chaîne *cipher-spec* contenant la liste des algorithmes de chiffrement OpenSSL que le client peut utiliser au cours de la phase d'initialisation de la connexion SSL. La spécification optionnelle du protocole permet de configurer la suite d'algorithmes de chiffrement pour une version spécifique de SSL. Une des valeurs possibles est "SSL" pour toutes les versions du protocole SSL jusqu'à TLSv1.2 compris.

Notez que cette directive peut être utilisée aussi bien dans un contexte de serveur que dans un contexte de répertoire. Dans un contexte de serveur, elle s'applique à l'initialisation SSL standard lorsqu'une connexion est établie. Dans un contexte de répertoire, elle force une renégociation SSL avec la liste d'algorithmes de chiffrement spécifiée après la lecture d'une requête HTTP, mais avant l'envoi de la réponse HTTP.

Si la bibliothèque SSL supporte TLSv1.3 (versions d'OpenSSL 1.1.1 et supérieures), il est possible de spécifier le paramètre "TLSv1.3" pour configurer la suite d'algorithmes de chiffrement pour ce protocole. Comme TLSv1.3 n'autorise pas la renégociation, spécifier pour lui des algorithmes de chiffrement dans un contexte de répertoire n'est pas autorisé

Pour obtenir la liste des noms d'algorithmes de chiffrement pour TLSv1.3, se référer à la [documentation OpenSSL](https://docs.openssl.org/master/man3/SSL_CTX_set_ciphersuites/).

La liste d'algorithmes de chiffrement SSL spécifiée par l'argument *cipher-spec* comporte quatre attributs principaux auxquels s'ajoutent quelques attributs secondaires :

- *Algorithme d'échange de clés*:
  RSA, Diffie-Hellman, Elliptic Curve Diffie-Hellman, Secure Remote Password.
- *Algorithme d'authentification*:
  RSA, Diffie-Hellman, DSS, ECDSA, ou none.
- *Algorithme de chiffrement*:
  AES, DES, Triple-DES, RC4, RC2, IDEA, etc...
- *Algorithme de condensé MAC*:
  MD5, SHA ou SHA1, SHA256, SHA384.

L'algorithme de chiffrement peut aussi provenir de l'extérieur. Les algorithmes SSLv2 ne sont plus supportés. Pour définir les algorithmes à utiliser, on peut soit spécifier tous les algorithmes à la fois, soit utiliser des alias pour spécifier une liste d'algorithmes dans leur ordre de préférence (voir Table 1). Les algorithmes et alias effectivement disponibles dépendent de la version d'openssl utilisée. Les versions ultérieures d'openssl sont susceptibles d'inclure des algorithmes supplémentaires.

| Symbole | Description |
| --- | --- |
| *Algorithme d'échange de clés :* |   |
| `kRSA` | Echange de clés RSA |
| `kDHr` | Echange de clés Diffie-Hellman avec clé RSA |
| `kDHd` | Echange de clés Diffie-Hellman avec clé DSA |
| `kEDH` | Echange de clés Diffie-Hellman temporaires (pas de certificat) |
| `kSRP` | échange de clés avec mot de passe distant sécurisé (SRP) |
| *Algorithmes d'authentification :* |   |
| `aNULL` | Pas d'authentification |
| `aRSA` | Authentification RSA |
| `aDSS` | Authentification DSS |
| `aDH` | Authentification Diffie-Hellman |
| *Algorithmes de chiffrement :* |   |
| `eNULL` | Pas de chiffrement |
| `NULL` | alias pour eNULL |
| `AES` | Chiffrement AES |
| `DES` | Chiffrement DES |
| `3DES` | Chiffrement Triple-DES |
| `RC4` | Chiffrement RC4 |
| `RC2` | Chiffrement RC2 |
| `IDEA` | Chiffrement IDEA |
| *Algorithmes de condensés MAC*: |   |
| `MD5` | Fonction de hashage MD5 |
| `SHA1` | Fonction de hashage SHA1 |
| `SHA` | alias pour SHA1 |
| `SHA256` | Fonction de hashage SHA256 |
| `SHA384` | Fonction de hashage SHA384 |
| *Alias :* |   |
| `SSLv3` | tous les algorithmes de chiffrement SSL version 3.0 |
| `TLSv1` | tous les algorithmes de chiffrement TLS version 1.0 |
| `EXP` | tous les algorithmes de chiffrement externes |
| `EXPORT40` | tous les algorithmes de chiffrement externes limités à 40 bits |
| `EXPORT56` | tous les algorithmes de chiffrement externes limités à 56 bits |
| `LOW` | tous les algorithmes de chiffrement faibles (non externes, DES simple) |
| `MEDIUM` | tous les algorithmes avec chiffrement 128 bits |
| `HIGH` | tous les algorithmes utilisant Triple-DES |
| `RSA` | tous les algorithmes utilisant l'échange de clés RSA |
| `DH` | tous les algorithmes utilisant l'échange de clés Diffie-Hellman |
| `EDH` | tous les algorithmes utilisant l'échange de clés Diffie-Hellman temporaires |
| `ECDH` | Echange de clés Elliptic Curve Diffie-Hellman |
| `ADH` | tous les algorithmes utilisant l'échange de clés Diffie-Hellman anonymes |
| `AECDH` | tous les algorithmes utilisant l'échange de clés Elliptic Curve Diffie-Hellman |
| `SRP` | tous les algorithmes utilisant l'échange de clés avec mot de passe distant sécurisé (SRP) |
| `DSS` | tous les algorithmes utilisant l'authentification DSS |
| `ECDSA` | tous les algorithmes utilisant l'authentification ECDSA |
| `aNULL` | tous les algorithmes n'utilisant aucune authentification |

Cela devient intéressant lorsque tous ces symboles sont combinés ensemble pour spécifier les algorithmes disponibles et l'ordre dans lequel vous voulez les utiliser. Pour simplifier tout cela, vous disposez aussi d'alias (`SSLv3, TLSv1, EXP, LOW, MEDIUM, HIGH`) pour certains groupes d'algorithmes. Ces symboles peuvent être reliés par des préfixes pour former la chaîne *algorithmes*. Les préfixes disponibles sont :

- none: ajoute l'algorithme à la liste
- `+`: déplace les algorithmes qui conviennent à la place courante dans la liste
- `-`: supprime l'algorithme de la liste (peut être rajouté plus tard)
- `!`: supprime définitivement l'algorithme de la liste (ne peut **plus** y être rajouté plus tard)

> [!NOTE]
> **Les algorithmes `aNULL`, `eNULL` et `EXP` sont toujours désactivés**
>
> Depuis la version 2.4.7, les algorithmes de type null ou destinés à l'exportation sont toujours désactivés car mod\_ssl ajoute obligatoirement `!aNULL:!eNULL:!EXP` à toute chaîne d'algorithme de chiffrement à l'initialisation.

Pour vous simplifier la vie, vous pouvez utiliser la commande \`\``openssl ciphers -v`'' qui vous fournit un moyen simple de créer la chaîne *algorithmes* avec succès. La chaîne *algorithmes* par défaut dépend de la version des bibliothèques SSL installées. Supposons qu'elle contienne \`\``RC4-SHA:AES128-SHA:HIGH:MEDIUM:!aNULL:!MD5`'', ce qui stipule de mettre `RC4-SHA` et `AES128-SHA` en premiers, car ces algorithmes présentent un bon compromis entre vitesse et sécurité. Viennent ensuite les algorithmes de sécurité élevée et moyenne. En fin de compte, les algorithmes qui n'offrent aucune authentification sont exclus, comme les algorithmes anonymes Diffie-Hellman pour SSL, ainsi que tous les algorithmes qui utilisent `MD5` pour le hashage, car celui-ci est reconnu comme insuffisant.

```
$ openssl ciphers -v 'RC4-SHA:AES128-SHA:HIGH:MEDIUM:!aNULL:!MD5'
RC4-SHA                 SSLv3 Kx=RSA      Au=RSA  Enc=RC4(128)  Mac=SHA1
AES128-SHA              SSLv3 Kx=RSA      Au=RSA  Enc=AES(128)  Mac=SHA1
DHE-RSA-AES256-SHA      SSLv3 Kx=DH       Au=RSA  Enc=AES(256)  Mac=SHA1
...                     ...               ...     ...           ...
SEED-SHA                SSLv3 Kx=RSA      Au=RSA  Enc=SEED(128) Mac=SHA1
PSK-RC4-SHA             SSLv3 Kx=PSK      Au=PSK  Enc=RC4(128)  Mac=SHA1
KRB5-RC4-SHA            SSLv3 Kx=KRB5     Au=KRB5 Enc=RC4(128)  Mac=SHA1
```

Vous trouverez la liste complète des algorithmes RSA & DH spécifiques à SSL dans la Table 2.

**Exemple**

```apache
SSLCipherSuite RSA:!EXP:!NULL:+HIGH:+MEDIUM:-LOW
```

| Symbole algorithme | Protocole | Echange de clés | Authentification | Chiffrement | Condensé MAC | Type |
| --- | --- | --- | --- | --- | --- | --- |
| *Algorithmes RSA :* |   |   |   |   |   |   |
| `DES-CBC3-SHA` | SSLv3 | RSA | RSA | 3DES(168) | SHA1 |   |
| `IDEA-CBC-SHA` | SSLv3 | RSA | RSA | IDEA(128) | SHA1 |   |
| `RC4-SHA` | SSLv3 | RSA | RSA | RC4(128) | SHA1 |   |
| `RC4-MD5` | SSLv3 | RSA | RSA | RC4(128) | MD5 |   |
| `DES-CBC-SHA` | SSLv3 | RSA | RSA | DES(56) | SHA1 |   |
| `EXP-DES-CBC-SHA` | SSLv3 | RSA(512) | RSA | DES(40) | SHA1 | export |
| `EXP-RC2-CBC-MD5` | SSLv3 | RSA(512) | RSA | RC2(40) | MD5 | export |
| `EXP-RC4-MD5` | SSLv3 | RSA(512) | RSA | RC4(40) | MD5 | export |
| `NULL-SHA` | SSLv3 | RSA | RSA | None | SHA1 |   |
| `NULL-MD5` | SSLv3 | RSA | RSA | None | MD5 |   |
| *Algorithmes Diffie-Hellman :* |   |   |   |   |   |   |
| `ADH-DES-CBC3-SHA` | SSLv3 | DH | None | 3DES(168) | SHA1 |   |
| `ADH-DES-CBC-SHA` | SSLv3 | DH | None | DES(56) | SHA1 |   |
| `ADH-RC4-MD5` | SSLv3 | DH | None | RC4(128) | MD5 |   |
| `EDH-RSA-DES-CBC3-SHA` | SSLv3 | DH | RSA | 3DES(168) | SHA1 |   |
| `EDH-DSS-DES-CBC3-SHA` | SSLv3 | DH | DSS | 3DES(168) | SHA1 |   |
| `EDH-RSA-DES-CBC-SHA` | SSLv3 | DH | RSA | DES(56) | SHA1 |   |
| `EDH-DSS-DES-CBC-SHA` | SSLv3 | DH | DSS | DES(56) | SHA1 |   |
| `EXP-EDH-RSA-DES-CBC-SHA` | SSLv3 | DH(512) | RSA | DES(40) | SHA1 | export |
| `EXP-EDH-DSS-DES-CBC-SHA` | SSLv3 | DH(512) | DSS | DES(40) | SHA1 | export |
| `EXP-ADH-DES-CBC-SHA` | SSLv3 | DH(512) | None | DES(40) | SHA1 | export |
| `EXP-ADH-RC4-MD5` | SSLv3 | DH(512) | None | RC4(40) | MD5 | export |

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
