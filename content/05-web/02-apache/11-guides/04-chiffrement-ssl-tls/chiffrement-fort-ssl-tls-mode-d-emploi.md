---
title: "Chiffrement fort SSL/TLS : Mode d'emploi"
description: "Apache HTTP Server — Chiffrement fort SSL/TLS : Mode d'emploi. Ce document doit vous permettre de démarrer et de faire fonctionner une configuration de base. Avant de vous lancer dans l'application de techniques avancées, il est fortement recommandé de lire le reste de la documentation SSL afin d'en co"
tags: [apache, guide]
icon: book-open
---

Ce document doit vous permettre de démarrer et de faire fonctionner une configuration de base. Avant de vous lancer dans l'application de techniques avancées, il est fortement recommandé de lire le reste de la documentation SSL afin d'en comprendre le fonctionnement de manière plus approfondie.

## Exemple de configuration basique

Votre configuration SSL doit comporter au moins les directives suivantes :

```apache
LoadModule ssl_module modules/mod_ssl.so

Listen 443
<VirtualHost *:443>
    ServerName www.example.com
    SSLEngine on
    SSLCertificateFile "/path/to/www.example.com.cert"
    SSLCertificateKeyFile "/path/to/www.example.com.key"
</VirtualHost>
```

## Suites de chiffrement et mise en application de la sécurité de haut niveau

- Comment créer un serveur SSL qui n'accepte que le chiffrement fort ?
- Comment créer un serveur qui accepte tous les types de chiffrement en général, mais exige un chiffrement fort pour pouvoir accéder à une URL particulière ?

### Comment créer un serveur SSL qui n'accepte que le chiffrement fort ?

Les directives suivantes ne permettent que les chiffrements de plus haut niveau :

```apache
SSLCipherSuite HIGH:!aNULL:!MD5
```

Avec la configuration qui suit, vous indiquez une préférence pour des algorityhmes de chiffrement spécifiques optimisés en matière de rapidité (le choix final sera opéré par mod\_ssl, dans la mesure ou le client les supporte) :

```apache
SSLCipherSuite RC4-SHA:AES128-SHA:HIGH:!aNULL:!MD5
SSLHonorCipherOrder on
```

### Comment créer un serveur qui accepte tous les types de chiffrement en général, mais exige un chiffrement fort pour pouvoir accéder à une URL particulière ?

Dans ce cas bien évidemment, une directive [[13-directives/sslciphersuite|SSLCipherSuite]] au niveau du serveur principal qui restreint le choix des suites de chiffrement aux versions les plus fortes ne conviendra pas. [[12-modules/mod_ssl|mod_ssl]] peut cependant être reconfiguré au sein de blocs `Location` qui permettent d'adapter la configuration générale à un répertoire spécifique ; [[12-modules/mod_ssl|mod_ssl]] peut alors forcer automatiquement une renégociation des paramètres SSL pour parvenir au but recherché. Cette configuration peut se présenter comme suit :

```apache
# soyons très tolérant a priori
SSLCipherSuite ALL:!aNULL:RC4+RSA:+HIGH:+MEDIUM:+LOW:+EXP:+eNULL

<Location "/strong/area">
# sauf pour https://hostname/strong/area/ et ses sous-répertoires
# qui exigent des chiffrements forts
SSLCipherSuite HIGH:!aNULL:!MD5
</Location>
```

## Agrafage OCSP

Le protocole de contrôle du statut des certificats en ligne (Online Certificate Status Protocol - OCSP) est un mécanisme permettant de déterminer si un certificat a été révoqué ou non, et l'agrafage OCSP en est une fonctionnalité particulière par laquelle le serveur, par exemple httpd et mod\_ssl, maintient une liste des réponses OCSP actuelles pour ses certificats et l'envoie aux clients qui communiquent avec lui. La plupart des certificats contiennent l'adresse d'un répondeur OCSP maintenu par l'Autorité de Certification (CA) spécifiée, et mod\_ssl peut requérir ce répondeur pour obtenir une réponse signée qui peut être envoyée aux clients qui communiquent avec le serveur.

L'agrafage OCSP est la méthode la plus performante pour obtenir le statut d'un certificat car il est disponible au niveau du serveur, et le client n'a donc pas besoin d'ouvrir une nouvelle connexion vers l'autorité de certification. Autres avantages de l'absence de communication entre le client et l'autorité de certification : l'autorité de certification n'a pas accès à l'historique de navigation du client, et l'obtention du statut du certificat est plus efficace car elle n'est plus assujettie à une surcharge éventuelle des serveurs de l'autorité de certification.

La charge du serveur est moindre car la réponse qu'il a obtenu du répondeur OCSP peut être réutilisée par tous les clients qui utilisent le même certificat dans la limite du temps de validité de la réponse.

Une fois le support général SSL correctement configuré, l'activation de l'agrafage OCSP ne requiert que des modifications mineures à la configuration de httpd et il suffit en général de l'ajout de ces deux directives :

```apache
SSLUseStapling On
SSLStaplingCache "shmcb:ssl_stapling(32768)"
```

Ces directives sont placées de façon à ce qu'elles aient une portée globale (et particulièrement en dehors de toute section VirtualHost), le plus souvent où sont placées les autres directives de configuration globales SSL, comme `conf/extra/httpd-ssl.conf` pour les installations de httpd à partir des sources, ou `/etc/apache2/mods-enabled/ssl.conf` pour Ubuntu ou Debian, etc...

Le chemin spécifié par la directive `SSLStaplingCache` (par exemple `logs/`) doit être le même que celui spécifié par la directive `SSLSessionCache`. Ce chemin est relatif au chemin spécifié par la directive `ServerRoot`.

Cette directive `SSLStaplingCache` particulière nécessite le chargement du module [[12-modules/mod_socache_shmcb|mod_socache_shmcb]] (à cause du préfixe `shmcb` de son argument). Ce module est en général déjà activé pour la directive `SSLSessionCache`, ou pour des modules autres que [[12-modules/mod_ssl|mod_ssl]]. Si vous activez un cache de session SSL utilisant un mécanisme autre que [[12-modules/mod_socache_shmcb|mod_socache_shmcb]], utilisez aussi ce mécanisme alternatif pour la directive `SSLStaplingCache`. Par exemple :

```apache
SSLSessionCache "dbm:ssl_scache"
SSLStaplingCache "dbm:ssl_stapling"
```

Vous pouvez utiliser la commande openssl pour vérifier que votre serveur envoie bien une réponse OCSP :

```
$ openssl s_client -connect www.example.com:443 -status -servername www.example.com
...
OCSP response:
======================================
OCSP Response Data:
    OCSP Response Status: successful (0x0)
    Response Type: Basic OCSP Response
...
    Cert Status: Good
...
```

Les sections suivantes explicitent les situations courantes qui requièrent des modifications supplémentaires de la configuration. Vous pouvez aussi vous référer au manuel de référence de [[12-modules/mod_ssl|mod_ssl]].

### Si l'on utilise plus que quelques certificats SSL pour le serveur

Les réponses OCSP sont stockées dans le cache d'agrafage SSL. Alors que les réponses ont une taille de quelques centaines à quelques milliers d'octets, mod\_ssl supporte des réponses d'une taille jusqu'à environ 10 ko. Dans notre cas, le nombre de certificats est conséquent et la taille du cache (32768 octets dans l'exemple ci-dessus) doit être augmentée. En cas d'erreur lors du stockage d'une réponse, le message AH01929 sera enregistré dans le journal.

### Si le certificat ne spécifie pas de répondeur OCSP, ou si une adresse différente doit être utilisée

Veuillez vous référer à la documentation de la directive [[13-directives/sslstaplingforceurl|SSLStaplingForceURL]].

Vous pouvez vérifier si un certificat spécifie un répondeur OCSP en utilisant la commande openssl comme suit :

```
$ openssl x509 -in ./www.example.com.crt -text | grep 'OCSP.*http'
OCSP - URI:http://ocsp.example.com
```

Si un URI OCSP est fourni et si le serveur web peut communiquer directement avec lui sans passer par un mandataire, aucune modification supplémentaire de la configuration n'est requise. Notez que les règles du pare-feu qui contrôlent les connexions sortantes en provenance du serveur web devront peut-être subir quelques ajustements.

Si aucun URI OCSP n'est fourni, contactez votre autorité de certification pour savoir s'il en existe une ; si c'est le cas, utilisez la directive [[13-directives/sslstaplingforceurl|SSLStaplingForceURL]] pour la spécifier dans la configuration du serveur virtuel qui utilise le certificat.

### Si plusieurs serveurs virtuels sont configurés pour utiliser SSL et si l'agrafage OCSP doit être désactivé pour certains d'entre eux

Ajoutez la directive `SSLUseStapling Off` à la configuration des serveurs virtuels pour lesquels l'agrafage OCSP doit être désactivé.

### Si le répondeur OCSP est lent ou instable

De nombreuses directives permettent de gérer les temps de réponse et les erreurs. Référez-vous à la documentation de [[13-directives/sslstaplingfaketrylater|SSLStaplingFakeTryLater]], [[13-directives/sslstaplingrespondertimeout|SSLStaplingResponderTimeout]], et [[13-directives/sslstaplingreturnrespondererrors|SSLStaplingReturnResponderErrors]].

### Si mod\_ssl enregistre l'erreur AH02217 dans le journal

```
AH02217: ssl_stapling_init_cert: Can't retrieve issuer certificate!
```

Afin de pouvoir supporter l'agrafage OCSP lorsqu'un certificat de serveur particulier est utilisé, une chaîne de certification pour ce certificat doit être spécifiée. Si cela n'a pas été fait lors de l'activation de SSL, l'erreur AH02217 sera enregistrée lorsque l'agrafage OCSP sera activé, et les clients qui utilisent le certificat considéré ne recevront pas de réponse OCSP.

Veuillez vous référer à la documentation des directives [[13-directives/sslcertificatechainfile|SSLCertificateChainFile]] et [[13-directives/sslcertificatefile|SSLCertificateFile]] pour spécifier une chaîne de certification.

### Réglage de l'agrafage OCSP pour la production

La configuration par défaut de l'agrafage OCSP est conservatrice et peut induire des requêtes excessives vers les répondeurs OCSP, des délais dépassés ou des réponses en erreur mis en cache trop longtemps. Les réglages suivants sont recommandés pour un serveur en production :

```apache
# Ne pas envoyer les erreurs de répondeur OCSP aux clients :
SSLStaplingReturnResponderErrors off

# Réduction du délai de réponse OCSP par rapport à la valeur par défaut de 10s :
SSLStaplingResponderTimeout 4

# Mise en cache des réponses OCSP valables pendant 48 heures (par défaut 1
# heure). Cela réduit la charge des répondeurs OCSP et évite les erreurs
# transitoires causées par des requêtes fréquentes :
SSLStaplingStandardCacheTimeout 172800

# Renvoyer les requêtes OCSP en échec après 60 secondes (au lieu de la valeur
# par défaut de 600 secondes :
SSLStaplingErrorCacheTimeout 60
```

Ces réglages traitent les problèmes courants survenant quand les réglages par défaut de l'agrafage OCSP produisent des erreurs en charge — en particulier quand les répondeurs OCSP sont lents ou peu fiables. Voir la documentation individuelle des directives [[13-directives/sslstaplingreturnrespondererrors|SSLStaplingReturnResponderErrors]], [[13-directives/sslstaplingrespondertimeout|SSLStaplingResponderTimeout]], [[13-directives/sslstaplingstandardcachetimeout|SSLStaplingStandardCacheTimeout]] et [[13-directives/sslstaplingerrorcachetimeout|SSLStaplingErrorCacheTimeout]] pour les détails.

## Authentification du client et contrôle d'accès

- Comment forcer les clients à s'authentifier à l'aide de certificats ?
- Comment forcer les clients à s'authentifier à l'aide de certificats pour une URL particulière, mais autoriser quand-même tout client anonyme à accéder au reste du serveur ?
- Comment n'autoriser l'accès à une URL particulière qu'aux clients qui possèdent des certificats, mais autoriser l'accès au reste du serveur à tous les clients ?
- Comment imposer HTTPS avec chiffrements forts, et soit authentification de base, soit possession de certificats clients, pour l'accès à une partie de l'Intranet, pour les clients en provenance de l'Internet ?

### Comment forcer les clients à s'authentifier à l'aide de certificats ?

Lorsque vous connaissez tous vos clients (comme c'est en général le cas au sein d'un intranet d'entreprise), vous pouvez imposer une authentification basée uniquement sur les certificats. Tout ce dont vous avez besoin pour y parvenir est de créer des certificats clients signés par le certificat de votre propre autorité de certification (`ca.crt`), et d'authentifier les clients à l'aide de ces certificats.

```apache
# exige un certificat client signé par le certificat de votre CA
# contenu dans ca.crt
SSLVerifyClient require
SSLVerifyDepth 1
SSLCACertificateFile "conf/ssl.crt/ca.crt"
```

### Comment forcer les clients à s'authentifier à l'aide de certificats pour une URL particulière, mais autoriser quand-même tout client anonyme à accéder au reste du serveur ?

Pour forcer les clients à s'authentifier à l'aide de certificats pour une URL particulière, vous pouvez utiliser les fonctionnalités de reconfiguration de [[12-modules/mod_ssl|mod_ssl]] en fonction du répertoire :

```apache
SSLVerifyClient none
SSLCACertificateFile "conf/ssl.crt/ca.crt"

<Location "/secure/area">
SSLVerifyClient require
SSLVerifyDepth 1
</Location>
```

### Comment n'autoriser l'accès à une URL particulière qu'aux clients qui possèdent des certificats, mais autoriser l'accès au reste du serveur à tous les clients ?

La clé du problème consiste à vérifier si une partie du certificat client correspond à ce que vous attendez. Cela signifie en général consulter tout ou partie du nom distinctif (DN), afin de vérifier s'il contient une chaîne connue. Il existe deux méthodes pour y parvenir ; on utilise soit le module [[12-modules/mod_auth_basic|mod_auth_basic]], soit la directive [[13-directives/sslrequire|SSLRequire]].

La méthode du module [[12-modules/mod_auth_basic|mod_auth_basic]] est en général incontournable lorsque les certificats ont un contenu arbitraire, ou lorsque leur DN ne contient aucun champ connu (comme l'organisation, etc...). Dans ce cas, vous devez construire une base de données de mots de passe contenant *tous* les clients autorisés, comme suit :

```apache
SSLVerifyClient      none
SSLCACertificateFile "conf/ssl.crt/ca.crt"
SSLCACertificatePath "conf/ssl.crt"

<Directory "/usr/local/apache2/htdocs/secure/area">
SSLVerifyClient      require
    SSLVerifyDepth       5
    SSLOptions           +FakeBasicAuth
    SSLRequireSSL
    AuthName             "Snake Oil Authentication"
    AuthType             Basic
    AuthBasicProvider    file
    AuthUserFile         "/usr/local/apache2/conf/httpd.passwd"
    Require              valid-user
</Directory>
```

Le mot de passe utilisé dans cet exemple correspond à la chaîne de caractères "password" chiffrée en DES. Voir la documentation de la directive [[13-directives/ssloptions|SSLOptions]] pour plus de détails.

**httpd.passwd**

```
/C=DE/L=Munich/O=Snake Oil, Ltd./OU=Staff/CN=Foo:xxj31ZMTZzkVA
/C=US/L=S.F./O=Snake Oil, Ltd./OU=CA/CN=Bar:xxj31ZMTZzkVA
/C=US/L=L.A./O=Snake Oil, Ltd./OU=Dev/CN=Quux:xxj31ZMTZzkVA
```

Lorsque vos clients font tous partie d'une même hiérarchie, ce qui apparaît dans le DN, vous pouvez les authentifier plus facilement en utilisant la directive [[13-directives/sslrequire|SSLRequire]], comme suit :

```apache
SSLVerifyClient      none
SSLCACertificateFile "conf/ssl.crt/ca.crt"
SSLCACertificatePath "conf/ssl.crt"

<Directory "/usr/local/apache2/htdocs/secure/area">
  SSLVerifyClient      require
  SSLVerifyDepth       5
  SSLOptions           +FakeBasicAuth
  SSLRequireSSL
  SSLRequire       %{SSL_CLIENT_S_DN_O}  eq "Snake Oil, Ltd." \
               and %{SSL_CLIENT_S_DN_OU} in {"Staff", "CA", "Dev"}
</Directory>
```

### Comment imposer HTTPS avec chiffrements forts, et soit authentification de base, soit possession de certificats clients, pour l'accès à une partie de l'Intranet, pour les clients en provenance de l'Internet ? Je souhaite quand-même autoriser l'accès en HTTP aux clients de l'intranet.

On suppose dans ces exemples que les clients de l'intranet ont des adresses IP dans la gamme 192.168.1.0/24, et que la partie de l'intranet à laquelle vous voulez autoriser l'accès depuis l'Internet est `/usr/local/apache2/htdocs/subarea`. Ces lignes de configuration doivent se trouver en dehors de votre hôte virtuel HTTPS, afin qu'elles s'appliquent à la fois à HTTP et HTTPS.

```apache
SSLCACertificateFile "conf/ssl.crt/company-ca.crt"

<Directory "/usr/local/apache2/htdocs">
#   En dehors de subarea, seul l'accès depuis l'intranet est
#   autorisé
    Require              ip 192.168.1.0/24
</Directory>

<Directory "/usr/local/apache2/htdocs/subarea">
#   Dans subarea, tout accès depuis l'intranet est autorisé
#   mais depuis l'Internet, seul l'accès par HTTPS + chiffrement fort + Mot de passe
#   ou HTTPS + chiffrement fort + certificat client n'est autorisé.

#   Si HTTPS est utilisé, on s'assure que le niveau de chiffrement est fort.
#   Autorise en plus les certificats clients comme une alternative à
#   l'authentification basique.
    SSLVerifyClient      optional
    SSLVerifyDepth       1
    SSLOptions           +FakeBasicAuth +StrictRequire
    SSLRequire           %{SSL_CIPHER_USEKEYSIZE} >= 128

    #   ON oblige les clients venant d'Internet à utiliser HTTPS
    RewriteEngine        on
    RewriteCond          "%{REMOTE_ADDR}" "!^192\.168\.1\.[0-9]+$"
    RewriteCond          "%{HTTPS}" "!=on"
    RewriteRule          "." "-" [F]

    #   On permet l'accès soit sur les critères réseaux, soit par authentification Basique
    Satisfy              any

    #   Contrôle d'accès réseau
    Require              ip 192.168.1.0/24

    #   Configuration de l'authentification HTTP Basique
    AuthType             basic
    AuthName             "Protected Intranet Area"
    AuthBasicProvider    file
    AuthUserFile         "conf/protected.passwd"
    Require              valid-user
</Directory>
```

## Journalisation

[[12-modules/mod_ssl|mod_ssl]] peut enregistrer des informations de débogage très verbeuses dans le journal des erreurs, lorsque sa directive [[13-directives/loglevel|LogLevel]] est définie à des niveaux de trace élevés. Par contre, sur un serveur très sollicité, le niveau `info` sera probablement déjà trop élevé. Souvenez-vous que vous pouvez configurer la directive [[13-directives/loglevel|LogLevel]] par module afin de pourvoir à vos besoins.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
