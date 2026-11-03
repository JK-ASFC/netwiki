---
title: "mod_ssl"
description: "Module Apache mod_ssl — Chiffrement de haut niveau basé sur les protocoles Secure Sockets Layer (SSL) et Transport Layer Security (TLS). Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_ssl]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chiffrement de haut niveau basé sur les protocoles Secure Sockets Layer (SSL) et Transport Layer Security (TLS) |
| **Statut** | Extension |
| **Identificateur** | `ssl_module` |
| **Fichier source** | `mod_ssl.c` |

## Sommaire

Ce module fournit le support SSL v3 et TLS v1 au serveur HTTP Apache. SSL v2 n'est plus supporté.

Ce module s'appuie sur [OpenSSL](https://www.openssl.org/) pour fournir le moteur de chiffrement.

D'autres détails, discussions et exemples sont fournis dans la [[11-guides/04-chiffrement-ssl-tls/00-apache-et-le-chiffrement-ssl-tls|documentation SSL]].

## Variables d'environnement

Ce module peut être configuré pour fournir aux espaces de nommage SSI et CGI de nombreux éléments d'informations concernant SSL par le biais de variables d'environnement supplémentaires. Par défaut, sauf pour `HTTPS` et `SSL_TLS_SNI` qui sont toujours définies, ces informations ne sont pas fournies pour des raisons de performances (Voir la directive [[13-directives/ssloptions|SSLOptions]] `StdEnvVars` ci-dessous). Les variables générées se trouvent dans la table ci-dessous. Ces informations peuvent également être disponible sous des noms différents à des fins de compatibilité ascendante. Reportez-vous au chapitre [[11-guides/04-chiffrement-ssl-tls/chiffrement-fort-ssl-tls-compatibilite|Compatibilité]] pour plus de détails à propos des variables de compatibilité.

| Nom de la variable | Type de valeur | Description |
| --- | --- | --- |
| `HTTPS` | drapeau | HTTPS est utilisé. |
| `SSL_PROTOCOL` | chaîne | La version du protocole SSL (SSLv3, TLSv1, TLSv1.1, TLSv1.2) |
| `SSL_SESSION_ID` | chaîne | L'identifiant de session SSL codé en hexadécimal |
| `SSL_SESSION_RESUMED` | chaîne | Session SSL initiale ou reprise. Note : plusieurs requêtes peuvent être servies dans le cadre de la même session SSL (initiale ou reprise) si les connexions persistantes (HTTP KeepAlive) sont utilisées |
| `SSL_SECURE_RENEG` | chaîne | `true` si la renégociation sécurisée est supportée, `false` dans le cas contraire |
| `SSL_CIPHER` | chaîne | Le nom de l'algorithme de chiffrement |
| `SSL_CIPHER_EXPORT` | chaîne | `true` si l'algorithme de chiffrement est un algorithme exporté |
| `SSL_CIPHER_USEKEYSIZE` | nombre | Nombre de bits de chiffrement (réellement utilisés) |
| `SSL_CIPHER_ALGKEYSIZE` | nombre | Nombre de bits de chiffrement (possible) |
| `SSL_COMPRESS_METHOD` | chaîne | Méthode de compression SSL négociée |
| `SSL_VERSION_INTERFACE` | chaîne | La version du programme mod\_ssl |
| `SSL_VERSION_LIBRARY` | chaîne | La version du programme OpenSSL |
| `SSL_CLIENT_M_VERSION` | chaîne | La version du certificat client |
| `SSL_CLIENT_M_SERIAL` | chaîne | Le numéro de série du certificat client |
| `SSL_CLIENT_S_DN` | chaîne | Le DN sujet du certificat client |
| `SSL_CLIENT_S_DN_`*x509* | chaîne | Elément du DN sujet du client |
| `SSL_CLIENT_SAN_Email_`*n* | chaîne | Les entrées d'extension subjectAltName du certificat client de type rfc822Name |
| `SSL_CLIENT_SAN_DNS_`*n* | chaîne | Les entrées d'extension subjectAltName du certificat client de type dNSName |
| `SSL_CLIENT_SAN_OTHER_msUPN_`*n* | chaîne | Extensions subjectAltName de type otherName du certificat client, forme Microsoft du nom principal de l'utilisateur (OID 1.3.6.1.4.1.311.20.2.3) |
| `SSL_CLIENT_I_DN` | chaîne | DN de l'émetteur du certificat du client |
| `SSL_CLIENT_I_DN_`*x509* | chaîne | Elément du DN de l'émetteur du certificat du client |
| `SSL_CLIENT_V_START` | chaîne | Validité du certificat du client (date de début) |
| `SSL_CLIENT_V_END` | chaîne | Validité du certificat du client (date de fin) |
| `SSL_CLIENT_V_REMAIN` | chaîne | Nombre de jours avant expiration du certificat du client |
| `SSL_CLIENT_A_SIG` | chaîne | Algorithme utilisé pour la signature du certificat du client |
| `SSL_CLIENT_A_KEY` | chaîne | Algorithme utilisé pour la clé publique du certificat du client |
| `SSL_CLIENT_CERT` | chaîne | Certificat du client au format PEM |
| `SSL_CLIENT_CERT_CHAIN_`*n* | chaîne | Certificats de la chaîne de certification du client au format PEM |
| `SSL_CLIENT_CERT_RFC4523_CEA` | chaîne | Numéro de série et fournisseur du certificat. le format correspond à celui de la CertificateExactAssertion dans la RFC4523 |
| `SSL_CLIENT_VERIFY` | chaîne | `NONE`, `SUCCESS`, `GENEROUS` ou `FAILED:`*raison* |
| `SSL_SERVER_M_VERSION` | chaîne | La version du certificat du serveur |
| `SSL_SERVER_M_SERIAL` | chaîne | The serial of the server certificate |
| `SSL_SERVER_S_DN` | chaîne | DN sujet du certificat du serveur |
| `SSL_SERVER_S_DN_`*x509* | chaîne | Elément du DN sujet du certificat du serveur |
| `SSL_SERVER_SAN_Email_`*n* | chaîne | Les entrées d'extension subjectAltName du certificat de serveur de type rfc822Name |
| `SSL_SERVER_SAN_DNS_`*n* | chaîne | Les entrées d'extension subjectAltName du certificat de serveur de type dNSName |
| `SSL_SERVER_SAN_OTHER_dnsSRV_`*n* | chaîne | Extensions subjectAltName de type otherName du certificat serveur, sous la forme SRVName (OID 1.3.6.1.5.5.7.8.7, RFC 4985) |
| `SSL_SERVER_I_DN` | chaîne | DN de l'émetteur du certificat du serveur |
| `SSL_SERVER_I_DN_`*x509* | chaîne | Elément du DN de l'émetteur du certificat du serveur |
| `SSL_SERVER_V_START` | chaîne | Validité du certificat du serveur (date de dédut) |
| `SSL_SERVER_V_END` | chaîne | Validité du certificat du serveur (date de fin) |
| `SSL_SERVER_A_SIG` | chaîne | Algorithme utilisé pour la signature du certificat du serveur |
| `SSL_SERVER_A_KEY` | chaîne | Algorithme utilisé pour la clé publique du certificat du serveur |
| `SSL_SERVER_CERT` | chaîne | Certificat du serveur au format PEM |
| `SSL_SRP_USER` | chaîne | nom d'utilisateur SRP |
| `SSL_SRP_USERINFO` | chaîne | informations sur l'utilisateur SRP |
| `SSL_TLS_SNI` | string | Contenu de l'extension SNI TLS (si supporté par ClientHello) |

*x509* spécifie un élément de DN X.509 parmi `C,ST,L,O,OU,CN,T,I,G,S,D,UID,Email`. A partir de la version 2.2.0 d'Apache, *x509* peut aussi comporter un suffixe numérique `_n`. Si le DN en question comporte plusieurs attributs de noms identiques, ce suffixe constitue un index débutant à zéro et permettant de sélectionner un attribut particulier. Par exemple, si le DN sujet du certificat du serveur comporte deux champs OU, on peut utiliser `SSL_SERVER_S_DN_OU_0` et `SSL_SERVER_S_DN_OU_1` pour référencer chacun d'entre eux. Un nom de variable sans suffixe `_n` est équivalent au même nom avec le suffixe `_0`, ce qui correspond au premier attribut (ou au seul) caractérisant le DN. Lorsque la table d'environnement est remplie en utilisant l'option `StdEnvVars` de la directive [[13-directives/ssloptions|SSLOptions]], le premier attribut (ou le seul) caractérisant le DN est enregistré avec un nom sans suffixe ; autrement dit, aucune entrée possédant comme suffixe `_0` n'est enregistrée.

A partir de la version 2.4.32 de httpd, on peut ajouter le suffixe *\_RAW* à *x509* dans un composant DN afin d'empêcher la conversion de la valeur de l'attribut en UTF-8. Il doit être placé après le suffixe index (s'il existe). On utilisera par exemple `SSL_SERVER_S_DN_OU_RAW` ou `SSL_SERVER_S_DN_OU_0_RAW`.

Le format des variables *\*\_DN* a changé depuis la version 2.3.11 d'Apache HTTPD. Voir l'option `LegacyDNStringFormat` de la directive [[13-directives/ssloptions|SSLOptions]] pour plus de détails.

`SSL_CLIENT_V_REMAIN` n'est disponible qu'à partir de la version 2.1.

Plusieurs variables d'environnement additionnelles peuvent être utilisées dans les expressions `SSLRequire`, ou dans les formats de journalisation personnalisés :

> [!NOTE]
> ```
> HTTP_USER_AGENT        PATH_INFO             AUTH_TYPE
> HTTP_REFERER           QUERY_STRING          SERVER_SOFTWARE
> HTTP_COOKIE            REMOTE_HOST           API_VERSION
> HTTP_FORWARDED         REMOTE_IDENT          TIME_YEAR
> HTTP_HOST              IS_SUBREQ             TIME_MON
> HTTP_PROXY_CONNECTION  DOCUMENT_ROOT         TIME_DAY
> HTTP_ACCEPT            SERVER_ADMIN          TIME_HOUR
> THE_REQUEST            SERVER_NAME           TIME_MIN
> REQUEST_FILENAME       SERVER_PORT           TIME_SEC
> REQUEST_METHOD         SERVER_PROTOCOL       TIME_WDAY
> REQUEST_SCHEME         REMOTE_ADDR           TIME
> REQUEST_URI            REMOTE_USER
> ```

Dans ces contextes, deux formats spéciaux peuvent aussi être utilisés :

**`ENV:nom_variable`**

Correspond à la variable d'environnement standard *nom\_variable*.

**`HTTP:nom_en-tête`**

Correspond à la valeur de l'en-tête de requête dont le nom est *nom\_en-tête*.

## Formats de journaux personnalisés

Lorsque [[12-modules/mod_ssl|mod_ssl]] est compilé dans le serveur Apache ou même chargé (en mode DSO), des fonctions supplémentaires sont disponibles pour le [[12-modules/mod_log_config|Format de journal personnalisé]] du module [[12-modules/mod_log_config|mod_log_config]]. A ce titre, la fonction de format d'eXtension \`\``%{`*nom-var*`}x`'' peut être utilisée pour présenter en extension toute variable fournie par tout module, et en particulier celles fournies par mod\_ssl et que vous trouverez dans la table ci-dessus.

A des fins de compatibilité ascendante, il existe une fonction de format cryptographique supplémentaire \`\``%{`*nom*`}c`''. Vous trouverez toutes les informations à propos de cette fonction dans le chapitre [[11-guides/04-chiffrement-ssl-tls/chiffrement-fort-ssl-tls-compatibilite|Compatibilité]].

**Exemple**

```apache
CustomLog "logs/ssl_request_log" "%t %h %{SSL_PROTOCOL}x %{SSL_CIPHER}x \"%r\" %b"
```

Ces formats sont disponibles même si l'option `StdEnvVars` de la directive [[13-directives/ssloptions|SSLOptions]] n'a pas été définie.

## Information à propos de la requête

[[12-modules/mod_ssl|mod_ssl]] enregistre des informations à propos de la requête que l'on peut restituer dans les journaux avec la chaîne de format `%{nom}n` via le module [[12-modules/mod_log_config|mod_log_config]].

Les informations enregistrées sont les suivantes :

**`ssl-access-forbidden`**

Cette information contient la valeur `1` si l'accès a été refusé suite à une directive `SSLRequire` ou `SSLRequireSSL`.

**`ssl-secure-reneg`**

Si [[12-modules/mod_ssl|mod_ssl]] a été compilé avec une version d'OpenSSL qui supporte la renégociation sécurisée, si SSL est utilisé pour la connexion courante et si le client supporte lui aussi la renégociation sécurisée, cette information contiendra la valeur `1`. Si le client ne supporte pas la renégociation sécurisée, l'information contiendra la valeur `0`. Si [[12-modules/mod_ssl|mod_ssl]] n'a pas été compilé avec une version d'OpenSSL qui supporte la renégociation sécurisée, ou si SSL n'est pas utilisé pour la connexion courante, le contenu de l'information ne sera pas défini.

## Extension pour l'interprétation des expressions

Lorsque [[12-modules/mod_ssl|mod_ssl]] est compilé statiquement avec Apache, ou même chargé dynamiquement (en tant que module DSO), toute variable en provenance de [[12-modules/mod_ssl|mod_ssl]] peut être utilisée pour l'[[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|interprétation des expression ap_expr]]. Les variables peuvent être référencées en utilisant la syntaxe \`\``%{`*varname*`}`''. A partir de la version 2.4.18, on peut aussi utiliser la syntaxe de style [[12-modules/mod_rewrite|mod_rewrite]] \`\``%{SSL:`*varname*`}`'', ou la syntaxe de style fonction \`\``ssl(`*varname*`)`''.

**Exemple (en utilisant [[12-modules/mod_headers|mod_headers]])**

```apache
Header set X-SSL-PROTOCOL "expr=%{SSL_PROTOCOL}"
Header set X-SSL-CIPHER "expr=%{SSL:SSL_CIPHER}"
```

Cette fonctionnalité est disponible même si l'option `StdEnvVars` de la directive [[13-directives/ssloptions|SSLOptions]] n'a pas été définie.

## Fournisseurs d'autorisation disponibles avec Require

[[12-modules/mod_ssl|mod_ssl]] propose les fournisseurs d'autorisation suivants à utiliser avec la directive [[13-directives/require|Require]] du module [[12-modules/mod_authz_core|mod_authz_core]].

### Require ssl

Le fournisseur `ssl` refuse l'accès si une connexion n'est pas chiffrée avec SSL. À la différence de la directive `SSLRequireSSL` directive, cette directive peut être combinée avec d'autres directives `Require` dans les blocs [[13-directives/requireany|<RequireAny>]] ou [[13-directives/requireall|<RequireAll>]].

```apache
Require ssl
```

### Require ssl-verify-client

Le fournisseur `ssl-verify-client` autorise l'accès si l'utilisateur est authentifié via un certificat client valide. Ceci n'a un effet que si `SSLVerifyClient optional` est actif.

Dans l'exemple suivant, l'accès est autorisé si le client est authentifié via un certificat client ou par nom d'utilisateur/mot de passe :

```apache
Require ssl-verify-client
Require valid-user
```

## Délais de connexion et de négociation

Il peut arriver qu’un client ouvre une connexion TLS, reçoive le certificat du serveur, puis se fige sans terminer la négociation ou envoyer une requête. Les délais HTTP comme [[13-directives/timeout|TimeOut]] ne gèrent pas cette situation correctement, et la connexion peut alors rester ouverte indéfiniment.

Pour limiter le temps que peut mettre un client pour terminer la négociation TLS, chargez le module [[12-modules/mod_reqtimeout|mod_reqtimeout]] et configurez la phase `handshake` de la directive [[13-directives/requestreadtimeout|RequestReadTimeout]] :

```apache
RequestReadTimeout handshake=5
```

La phase `handshake` est désactivée par défaut et est disponible à partir de la version 2.4.39. Voir la documentation de la directive [[13-directives/requestreadtimeout|RequestReadTimeout]] pour les détails et plus d’exemples.

## Directives

- [[13-directives/sslpassphrasedialog|SSLPassPhraseDialog]]
- [[13-directives/sslrandomseed|SSLRandomSeed]]
- [[13-directives/sslsessioncache|SSLSessionCache]]
- [[13-directives/sslsessioncachetimeout|SSLSessionCacheTimeout]]
- [[13-directives/sslengine|SSLEngine]]
- [[13-directives/sslfips|SSLFIPS]]
- [[13-directives/sslprotocol|SSLProtocol]]
- [[13-directives/sslciphersuite|SSLCipherSuite]]
- [[13-directives/sslcertificatefile|SSLCertificateFile]]
- [[13-directives/sslcertificatekeyfile|SSLCertificateKeyFile]]
- [[13-directives/sslcertificatechainfile|SSLCertificateChainFile]]
- [[13-directives/sslcacertificatepath|SSLCACertificatePath]]
- [[13-directives/sslcacertificatefile|SSLCACertificateFile]]
- [[13-directives/sslcadnrequestfile|SSLCADNRequestFile]]
- [[13-directives/sslcadnrequestpath|SSLCADNRequestPath]]
- [[13-directives/sslcarevocationpath|SSLCARevocationPath]]
- [[13-directives/sslcarevocationfile|SSLCARevocationFile]]
- [[13-directives/sslcarevocationcheck|SSLCARevocationCheck]]
- [[13-directives/sslverifyclient|SSLVerifyClient]]
- [[13-directives/sslverifydepth|SSLVerifyDepth]]
- [[13-directives/sslsrpverifierfile|SSLSRPVerifierFile]]
- [[13-directives/sslsrpunknownuserseed|SSLSRPUnknownUserSeed]]
- [[13-directives/ssloptions|SSLOptions]]
- [[13-directives/sslrequiressl|SSLRequireSSL]]
- [[13-directives/sslrequire|SSLRequire]]
- [[13-directives/sslrenegbuffersize|SSLRenegBufferSize]]
- [[13-directives/sslstrictsnivhostcheck|SSLStrictSNIVHostCheck]]
- [[13-directives/sslvhostsnipolicy|SSLVHostSNIPolicy]]
- [[13-directives/sslproxymachinecertificatepath|SSLProxyMachineCertificatePath]]
- [[13-directives/sslproxymachinecertificatefile|SSLProxyMachineCertificateFile]]
- [[13-directives/sslproxymachinecertificatechainfile|SSLProxyMachineCertificateChainFile]]
- [[13-directives/sslproxyverify|SSLProxyVerify]]
- [[13-directives/sslproxyverifydepth|SSLProxyVerifyDepth]]
- [[13-directives/sslproxycheckpeerexpire|SSLProxyCheckPeerExpire]]
- [[13-directives/sslproxycheckpeercn|SSLProxyCheckPeerCN]]
- [[13-directives/sslproxycheckpeername|SSLProxyCheckPeerName]]
- [[13-directives/sslproxyengine|SSLProxyEngine]]
- [[13-directives/sslproxyprotocol|SSLProxyProtocol]]
- [[13-directives/sslproxyciphersuite|SSLProxyCipherSuite]]
- [[13-directives/sslproxycacertificatepath|SSLProxyCACertificatePath]]
- [[13-directives/sslproxycacertificatefile|SSLProxyCACertificateFile]]
- [[13-directives/sslproxycarevocationpath|SSLProxyCARevocationPath]]
- [[13-directives/sslproxycarevocationfile|SSLProxyCARevocationFile]]
- [[13-directives/sslproxycarevocationcheck|SSLProxyCARevocationCheck]]
- [[13-directives/sslusername|SSLUserName]]
- [[13-directives/sslhonorcipherorder|SSLHonorCipherOrder]]
- [[13-directives/sslcryptodevice|SSLCryptoDevice]]
- [[13-directives/sslocspenable|SSLOCSPEnable]]
- [[13-directives/sslocspdefaultresponder|SSLOCSPDefaultResponder]]
- [[13-directives/sslocspoverrideresponder|SSLOCSPOverrideResponder]]
- [[13-directives/sslocspresponsetimeskew|SSLOCSPResponseTimeSkew]]
- [[13-directives/sslocspresponsemaxage|SSLOCSPResponseMaxAge]]
- [[13-directives/sslocsprespondertimeout|SSLOCSPResponderTimeout]]
- [[13-directives/sslocspuserequestnonce|SSLOCSPUseRequestNonce]]
- [[13-directives/sslocspnoverify|SSLOCSPNoverify]]
- [[13-directives/sslocsprespondercertificatefile|SSLOCSPResponderCertificateFile]]
- [[13-directives/sslocspproxyurl|SSLOCSPProxyURL]]
- [[13-directives/sslinsecurerenegotiation|SSLInsecureRenegotiation]]
- [[13-directives/sslusestapling|SSLUseStapling]]
- [[13-directives/sslstaplingcache|SSLStaplingCache]]
- [[13-directives/sslstaplingresponsetimeskew|SSLStaplingResponseTimeSkew]]
- [[13-directives/sslstaplingrespondertimeout|SSLStaplingResponderTimeout]]
- [[13-directives/sslstaplingresponsemaxage|SSLStaplingResponseMaxAge]]
- [[13-directives/sslstaplingstandardcachetimeout|SSLStaplingStandardCacheTimeout]]
- [[13-directives/sslstaplingreturnrespondererrors|SSLStaplingReturnResponderErrors]]
- [[13-directives/sslstaplingfaketrylater|SSLStaplingFakeTryLater]]
- [[13-directives/sslstaplingerrorcachetimeout|SSLStaplingErrorCacheTimeout]]
- [[13-directives/sslstaplingforceurl|SSLStaplingForceURL]]
- [[13-directives/sslsessionticketkeyfile|SSLSessionTicketKeyFile]]
- [[13-directives/sslcompression|SSLCompression]]
- [[13-directives/sslsessiontickets|SSLSessionTickets]]
- [[13-directives/sslopensslconfcmd|SSLOpenSSLConfCmd]]

## Voir aussi

- [[13-directives/requestreadtimeout|RequestReadTimeout]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
