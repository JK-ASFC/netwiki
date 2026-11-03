---
title: "mod_ldap"
description: "Module Apache mod_ldap — Conservation des connexions LDAP et services de mise en cache du résultat à destination des autres modules LDAP. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_ldap]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Conservation des connexions LDAP et services de mise en cache du résultat à destination des autres modules LDAP |
| **Statut** | Extension |
| **Identificateur** | `ldap_module` |
| **Fichier source** | `util_ldap.c` |

## Sommaire

Ce module a été conçu dans le but d'améliorer les performances des sites web s'appuyant sur des connexions en arrière-plan vers des serveurs LDAP. Il ajoute aux fonctions fournies par les bibliothèques standards LDAP la conservation des connexions LDAP ainsi qu'un cache LDAP partagé en mémoire.

Pour activer ce module, le support LDAP doit être compilé dans apr-util. Pour ce faire, on ajoute l'option `--with-ldap` au script [[10-commandes/configure|configure]] lorsqu'on construit Apache.

Le support SSL/TLS est conditionné par le kit de développement LDAP qui a été lié à APR. Au moment où ces lignes sont écrites, APR-util supporte [OpenLDAP SDK](http://www.openldap.org/) (version 2.x ou supérieure), [Mozilla LDAP SDK](https://wiki.mozilla.org/LDAP_C_SDK), le SDK LDAP Solaris natif (basé sur Mozilla) ou le SDK LDAP Microsoft natif. Voir le site web [APR](http://apr.apache.org) pour plus de détails.

## Exemple de configuration

Ce qui suit est un exemple de configuration qui utilise [[12-modules/mod_ldap|mod_ldap]] pour améliorer les performances de l'authentification HTTP de base fournie par [[12-modules/mod_authnz_ldap|mod_authnz_ldap]].

```apache
# Active la conservation des connexions LDAP et le cache partagé en
# mémoire. Active le gestionnaire de statut du cache LDAP.
# Nécessite le chargement de mod_ldap et de mod_authnz_ldap.
# Remplacez "votre-domaine.example.com" par le nom de votre
# domaine.

LDAPSharedCacheSize 500000
LDAPCacheEntries 1024
LDAPCacheTTL 600
LDAPOpCacheEntries 1024
LDAPOpCacheTTL 600

<Location "/ldap-status">
    SetHandler ldap-status

    Require host yourdomain.example.com

    Satisfy any
    AuthType Basic
    AuthName "LDAP Protected"
    AuthBasicProvider ldap
    AuthLDAPURL "ldap://127.0.0.1/dc=example,dc=com?uid?one"
    Require valid-user
</Location>
```

## Conservation des connexions LDAP

Les connexions LDAP sont conservées de requête en requête. Ceci permet de rester connecté et identifié au serveur LDAP, ce dernier étant ainsi prêt pour la prochaine requête, sans avoir à se déconnecter, reconnecter et réidentifier. Le gain en performances est similaire à celui des connexions persistantes (keepalives) HTTP.

Sur un serveur très sollicité, il est possible que de nombreuses requêtes tentent d'accéder simultanément à la même connexion au serveur LDAP. Lorsqu'une connexion LDAP est utilisée, Apache en crée une deuxième en parallèle à la première, ce qui permet d'éviter que le système de conservation des connexions ne devienne un goulot d'étranglement.

Il n'est pas nécessaire d'activer explicitement la conservation des connexions dans la configuration d'Apache. Tout module utilisant le module ldap pour accéder aux services LDAP partagera le jeu de connexions.

Les connexions LDAP peuvent garder la trace des données d'identification du client ldap utilisées pour l'identification auprès du serveur LDAP. Ces données peuvent être fournies aux serveurs LDAP qui ne permettent pas les connexions anonymes au cours lors des tentatives de sauts vers des serveurs alternatifs. Pour contrôler cette fonctionnalité, voir les directives [[13-directives/ldapreferrals|LDAPReferrals]] et [[13-directives/ldapreferralhoplimit|LDAPReferralHopLimit]]. Cette fonctionnalité est activée par défaut.

## Cache LDAP

Pour améliorer les performances, [[12-modules/mod_ldap|mod_ldap]] met en oeuvre une stratégie de mise en cache agressive visant à minimiser le nombre de fois que le serveur LDAP doit être contacté. La mise en cache peut facilement doubler et même tripler le débit d'Apache lorsqu'il sert des pages protégées par [[12-modules/mod_authnz_ldap|mod_authnz_ldap]]. De plus, le serveur LDAP verra lui-même sa charge sensiblement diminuée.

[[12-modules/mod_ldap|mod_ldap]] supporte deux types de mise en cache LDAP : un *cache recherche/identification* durant la phase de recherche/identification et deux *caches d'opérations* durant la phase de comparaison. Chaque URL LDAP utilisée par le serveur a son propre jeu d'instances dans ces trois caches.

### Le cache recherche/identification

Les processus de recherche et d'identification sont les opérations LDAP les plus consommatrices en temps, en particulier si l'annuaire est de grande taille. Le cache de recherche/identification met en cache toutes les recherches qui ont abouti à une identification positive. Les résultats négatifs (c'est à dire les recherches sans succès, ou les recherches qui n'ont pas abouti à une identification positive) ne sont pas mis en cache. La raison de cette décision réside dans le fait que les connexions avec des données d'identification invalides ne représentent qu'un faible pourcentage du nombre total de connexions, et ainsi, le fait de ne pas mettre en cache les données d'identification invalides réduira d'autant la taille du cache.

[[12-modules/mod_ldap|mod_ldap]] met en cache le nom d'utilisateur, le DN extrait, le mot de passe utilisé pour l'identification, ainsi que l'heure de l'identification. Chaque fois qu'une nouvelle connexion est initialisée avec le même nom d'utilisateur, [[12-modules/mod_ldap|mod_ldap]] compare le mot de passe de la nouvelle connexion avec le mot de passe enregistré dans le cache. Si les mots de passe correspondent, et si l'entrée du cache n'est pas trop ancienne, [[12-modules/mod_ldap|mod_ldap]] court-circuite la phase de recherche/identification.

Le cache de recherche/identification est contrôlé par les directives [[13-directives/ldapcacheentries|LDAPCacheEntries]] et [[13-directives/ldapcachettl|LDAPCacheTTL]].

### Les caches d'opérations

Au cours des opérations de comparaison d'attributs et de noms distinctifs (DN), [[12-modules/mod_ldap|mod_ldap]] utilise deux caches d'opérations pour mettre en cache les opérations de comparaison. Le premier cache de comparaison sert à mettre en cache les résultats de comparaisons effectuées pour vérifier l'appartenance à un groupe LDAP. Le second cache de comparaison sert à mettre en cache les résultats de comparaisons entre DNs.

Notez que, lorsque l'appartenance à un groupe est vérifiée, toute comparaison de sous-groupes est mise en cache afin d'accélérer les comparaisons de sous-groupes ultérieures.

Le comportement de ces deux caches est contrôlé par les directives [[13-directives/ldapopcacheentries|LDAPOpCacheEntries]] et [[13-directives/ldapopcachettl|LDAPOpCacheTTL]].

### Superviser le cache

[[12-modules/mod_ldap|mod_ldap]] possède un gestionnaire de contenu qui permet aux administrateurs de superviser les performances du cache. Le nom du gestionnaire de contenu est `ldap-status`, et on peut utiliser les directives suivantes pour accéder aux informations du cache de [[12-modules/mod_ldap|mod_ldap]] :

```apache
<Location "/server/cache-info">
    SetHandler ldap-status
</Location>
```

En se connectant à l'URL `http://nom-serveur/infos-cache`, l'administrateur peut obtenir un rapport sur le statut de chaque cache qu'utilise [[12-modules/mod_ldap|mod_ldap]]. Notez que si Apache ne supporte pas la mémoire partagée, chaque instance de [[10-commandes/httpd|httpd]] possèdera son propre cache, et chaque fois que l'URL sera rechargée, un résultat différent pourra être affiché, en fonction de l'instance de [[10-commandes/httpd|httpd]] qui traitera la requête.

## Utiliser SSL/TLS

La possibilité de créer des connexions SSL et TLS avec un serveur LDAP est définie par les directives [[13-directives/ldaptrustedglobalcert|LDAPTrustedGlobalCert]], [[13-directives/ldaptrustedclientcert|LDAPTrustedClientCert]] et [[13-directives/ldaptrustedmode|LDAPTrustedMode]]. Ces directives permettent de spécifier l'autorité de certification (CA), les certificats clients éventuels, ainsi que le type de chiffrement à utiliser pour la connexion (none, SSL ou TLS/STARTTLS).

```apache
# Etablissement d'une connexion SSL LDAP sur le port 636.
# Nécessite le chargement de mod_ldap et mod_authnz_ldap.
# Remplacez "votre-domaine.example.com" par le nom de votre
# domaine.

LDAPTrustedGlobalCert CA_DER "/certs/certfile.der"

<Location "/protected">
    AuthType Basic
    AuthName "LDAP Protected"
    AuthBasicProvider ldap
    AuthLDAPURL "ldaps://127.0.0.1/dc=example,dc=com?uid?one"
    Require valid-user
</Location>
```

```apache
# Etablissement d'une connexion TLS LDAP sur le port 389.
# Nécessite le chargement de mod_ldap et mod_authnz_ldap.
# Remplacez "votre-domaine.example.com" par le nom de votre
# domaine.

LDAPTrustedGlobalCert CA_DER "/certs/certfile.der"

<Location "/protected">
    AuthType Basic
    AuthName "LDAP Protected"
    AuthBasicProvider ldap
    AuthLDAPURL "ldap://127.0.0.1/dc=example,dc=com?uid?one TLS"
    Require valid-user
</Location>
```

## Certificats SSL/TLS

Les différents SDKs LDAP disposent de nombreuses méthodes pour définir et gérer les certificats des clients et des autorités de certification (CA).

Si vous avez l'intention d'utiliser SSL ou TLS, lisez cette section ATTENTIVEMENT de façon à bien comprendre les différences de configurations entre les différents SDKs LDAP supportés.

### SDK Netscape/Mozilla/iPlanet

Les certificat de CA sont enregistrés dans un fichier nommé cert7.db. Le SDK ne dialoguera avec aucun serveur LDAP dont le certificat n'a pas été signé par une CA spécifiée dans ce fichier. Si des certificats clients sont requis, un fichier key3.db ainsi qu'un mot de passe optionnels peuvent être spécifiés. On peut aussi spécifier le fichier secmod si nécessaire. Ces fichiers sont du même format que celui utilisé par les navigateurs web Netscape Communicator ou Mozilla. Le moyen le plus simple pour obtenir ces fichiers consiste à les extraire de l'installation de votre navigateur.

Les certificats clients sont spécifiés pour chaque connexion en utilisant la directive [[13-directives/ldaptrustedclientcert|LDAPTrustedClientCert]] et en se référant au certificat "nickname". On peut éventuellement spécifier un mot de passe pour déverrouiller la clé privée du certificat.

Le SDK supporte seulement SSL. Toute tentative d'utilisation de STARTTLS engendrera une erreur lors des tentatives de contacter le serveur LDAP pendant l'exécution.

```apache
# Spécifie un fichier de certificats de CA Netscape
LDAPTrustedGlobalCert CA_CERT7_DB "/certs/cert7.db"
# Spécifie un fichier key3db optionnel pour le support des
# certificats clients
LDAPTrustedGlobalCert CERT_KEY3_DB "/certs/key3.db"
# Spécifie le fichier secmod si nécessaire
LDAPTrustedGlobalCert CA_SECMOD "/certs/secmod"
<Location "/protected">
    AuthType Basic
    AuthName "LDAP Protected"
    AuthBasicProvider ldap
    LDAPTrustedClientCert CERT_NICKNAME <nickname> [password]
    AuthLDAPURL "ldaps://127.0.0.1/dc=example,dc=com?uid?one"
    Require valid-user
</Location>
```

### SDK OpenLDAP

Un ou plusieurs certificats de CA doivent être spécifiés pour que le SDK OpenLDAP fonctionne correctement. Ces certificats peuvent être spécifiés sous forme de fichiers au format binaire DER ou codés en Base64 (PEM).

Les certificats clients et CA peuvent être spécifiés globalement ([[13-directives/ldaptrustedglobalcert|LDAPTrustedGlobalCert]]) ou pour chaque connexion ([[13-directives/ldaptrustedclientcert|LDAPTrustedClientCert]]). Les définitions au niveau d'une connexion l'emportent sur les définitions globales.

La documentation du SDK prétend que SSL et STARTTLS sont supportés ; cependant, STARTTLS semble ne pas fonctionner avec toutes les versions du SDK. Le mode SSL/TLS peut être défini en utilisant le paramètre de la directive LDAPTrustedMode. Si une URL de type ldaps:// est spécifiée, le mode SSL est forcé. La documentation OpenLDAP indique que le support SSL (ldaps://) tend à être remplacé par TLS, bien que le mode SSL fonctionne toujours.

```apache
# Spécifie deux fichiers contenant des certificats de CA
LDAPTrustedGlobalCert CA_DER "/certs/cacert1.der"
LDAPTrustedGlobalCert CA_BASE64 "/certs/cacert2.pem"
<Location "/protected">
    AuthType Basic
    AuthName "LDAP Protected"
    AuthBasicProvider ldap
    LDAPTrustedClientCert CERT_BASE64 "/certs/cert1.pem"
    LDAPTrustedClientCert KEY_BASE64 "/certs/key1.pem"
    # CA certs respecified due to per-directory client certs
    LDAPTrustedClientCert CA_DER "/certs/cacert1.der"
    LDAPTrustedClientCert CA_BASE64 "/certs/cacert2.pem"
    AuthLDAPURL "ldaps://127.0.0.1/dc=example,dc=com?uid?one"
    Require valid-user
</Location>
```

### SDK Solaris

SSL/TLS pour les bibliothèques LDAP propres à Solaris n'est pas encore supporté. Si nécessaire, installez et utilisez plutôt les bibliothèques OpenLDAP.

### SDK Microsoft

La configuration des certificats SSL/TLS pour les bibliothèques LDAP propres à Microsoft s'effectue à l'intérieur du registre système, et aucune directive de configuration n'est requise.

SSL et TLS sont tous deux supportés en utilisant des URLs de type ldaps://, ou en définissant la directive [[13-directives/ldaptrustedmode|LDAPTrustedMode]] à cet effet.

Note: L'état du support des certificats clients n'est pas encore connu pour ce SDK.

## Directives

- [[13-directives/ldapsharedcachesize|LDAPSharedCacheSize]]
- [[13-directives/ldapsharedcachefile|LDAPSharedCacheFile]]
- [[13-directives/ldapcacheentries|LDAPCacheEntries]]
- [[13-directives/ldapcachettl|LDAPCacheTTL]]
- [[13-directives/ldapopcacheentries|LDAPOpCacheEntries]]
- [[13-directives/ldapopcachettl|LDAPOpCacheTTL]]
- [[13-directives/ldapreferralhoplimit|LDAPReferralHopLimit]]
- [[13-directives/ldapreferrals|LDAPReferrals]]
- [[13-directives/ldapretrydelay|LDAPRetryDelay]]
- [[13-directives/ldapretries|LDAPRetries]]
- [[13-directives/ldaptrustedglobalcert|LDAPTrustedGlobalCert]]
- [[13-directives/ldaptrustedclientcert|LDAPTrustedClientCert]]
- [[13-directives/ldaptrustedmode|LDAPTrustedMode]]
- [[13-directives/ldapconnectiontimeout|LDAPConnectionTimeout]]
- [[13-directives/ldaptimeout|LDAPTimeout]]
- [[13-directives/ldapverifyservercert|LDAPVerifyServerCert]]
- [[13-directives/ldapconnectionpoolttl|LDAPConnectionPoolTTL]]
- [[13-directives/ldaplibrarydebug|LDAPLibraryDebug]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
