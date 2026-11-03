---
title: "SSLOptions"
description: "Directive Apache SSLOptions (mod_ssl) — Configure différentes options d'exécution du moteur SSL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure différentes options d'exécution du moteur SSL |
| **Syntaxe** | `SSLOptions [+\|-]option ...` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet de contrôler différentes options d'exécution du moteur SSL dans un contexte de répertoire. Normalement, si plusieurs `SSLOptions` peuvent s'appliquer à un répertoire, c'est la plus spécifique qui est véritablement prise en compte ; les options ne se combinent pas entre elles. Elles se combinent cependant entre elles si elles sont *toutes* précédées par un symbole plus (`+`) ou moins (`-`). Toute option précédée d'un `+` est ajoutée aux options actuellement en vigueur, et toute option précédée d'un `-` est supprimée de ces mêmes options.

Les *option*s disponibles sont :

- `StdEnvVars`

  Lorsque cette option est activée, le jeu standard de variables d'environnement SSL relatives à CGI/SSI est créé. Cette option est désactivée par défaut pour des raisons de performances, car l'extraction des informations constitue une opération assez coûteuse en ressources. On n'active donc en général cette option que pour les requêtes CGI et SSI.
- `ExportCertData`

  Lorsque cette option est activée, des variables d'environnement CGI/SSI supplémentaires sont créées : `SSL_SERVER_CERT`, `SSL_CLIENT_CERT` et `SSL_CLIENT_CERT_CHAIN_`*n* (avec *n* = 0,1,2,..). Elles contiennent les certificats X.509 codés en PEM du serveur et du client pour la connexion HTTPS courante, et peuvent être utilisées par les scripts CGI pour une vérification de certificat plus élaborée. De plus, tous les autres certificats de la chaîne de certificats du client sont aussi fournis. Tout ceci gonfle un peu l'environnement, et c'est la raison pour laquelle vous ne devez activer cette option qu'à la demande.
- `FakeBasicAuth`

  Lorsque cette option est activée, le Nom Distinctif (DN) sujet du certificat client X509 est traduit en un nom d'utilisateur pour l'autorisation HTTP de base. Cela signifie que les méthodes d'authentification standard d'Apache peuvent être utilisées pour le contrôle d'accès. Le nom d'utilisateur est tout simplement le Sujet du certificat X509 du client (il peut être déterminé en utilisant la commande OpenSSL `openssl x509` : `openssl x509 -noout -subject -in`*certificat*`.crt`). Notez qu'aucun mot de passe n'est envoyé par l'utilisateur. Chaque entrée du fichier des utilisateurs doit comporter ce mot de passe : \`\``xxj31ZMTZzkVA`'', qui est la version chiffrée en DES du mot \`\``password`''. Ceux qui travaillent avec un chiffrement basé sur MD5 (par exemple sous FreeBSD ou BSD/OS, etc...) doivent utiliser le condensé MD5 suivant pour le même mot : \`\``$1$OXLyS...$Owx8s2/m9/gfkcRVXzgoE/`''.

  Notez que la directive [[13-directives/authbasicfake|AuthBasicFake]] implémentée par le module [[12-modules/mod_auth_basic|mod_auth_basic]] peut être utilisée d'une manière plus générale comme simulation d'authentification basique, ce qui permet de contrôler la structure nom utilisateur/mot de passe.
- `StrictRequire`

  Cette option *force* l'interdiction d'accès lorsque [[13-directives/sslrequiressl|SSLRequireSSL]] ou [[13-directives/sslrequire|SSLRequire]] a décidé que l'accès doit être interdit. Sans l'option `StrictRequire`, il est possible pour d'autres directives d'autorisation (comme [[13-directives/requireany|<RequireAny>]]) d'outrepasser l'interdiction d'accès de SSL et d'accorder tout de même l'accès. Avec `SSLOptions +StrictRequire`, l'interdiction de `SSLRequireSSL` ou `SSLRequire` s'applique de manière inconditionnelle, sans tenir compte d'autres directives d'autorisation éventuelles.
- `OptRenegotiate`

  Cette option active la gestion optimisée de la renégociation des connexions SSL intervenant lorsque les directives SSL sont utilisées dans un contexte de répertoire. Par défaut un schéma strict est appliqué, et *chaque* reconfiguration des paramètres SSL au niveau du répertoire implique une phase de renégociation SSL *complète*. Avec cette option, mod\_ssl essaie d'éviter les échanges non nécessaires en effectuant des vérifications de paramètres plus granulaires (mais tout de même efficaces). Néanmoins, ces vérifications granulaires peuvent ne pas correspondre à ce qu'attend l'utilisateur, et il est donc recommandé de n'activer cette option que dans un contexte de répertoire.
- `LegacyDNStringFormat`

  Cette option permet d'agir sur la manière dont les valeurs des variables `SSL_{CLIENT,SERVER}_{I,S}_DN` sont formatées. Depuis la version 2.3.11, Apache HTTPD utilise par défaut un format compatible avec la RFC 2253. Ce format utilise des virgules comme délimiteurs entre les attributs, permet l'utilisation de caractères non-ASCII (qui sont alors convertis en UTF8), échappe certains caractères spéciaux avec des slashes inversés, et trie les attributs en plaçant l'attribut "C" en dernière position.

  Si l'option `LegacyDNStringFormat` est présente, c'est l'ancien format qui sera utilisé : les attributs sont triés avec l'attribut "C" en première position, les séparateurs sont des slashes non inversés, les caractères non-ASCII ne sont pas supportés et le support des caractères spéciaux n'est pas fiable.

**Exemple**

```apache
SSLOptions +FakeBasicAuth -StrictRequire
<Files ~ "\.(cgi|shtml)$">
    SSLOptions +StdEnvVars -ExportCertData
</Files>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
