---
title: "Standards applicables"
description: "Apache HTTP Server — Standards applicables. Cette page documente les standards applicables que le serveur HTTP Apache implémente ou suit, avec une brève description. Pour compléter les informations fournies ci-dessous, vous pouvez consulter les ressources suivantes : - Corrections de"
tags: [apache, guide]
icon: book-open
---

Cette page documente les standards applicables que le serveur HTTP Apache implémente ou suit, avec une brève description.

Pour compléter les informations fournies ci-dessous, vous pouvez consulter les ressources suivantes :

- [Corrections des RFCs](https://www.rfc-editor.org/errata.php) — Corrections de RFCs publiées
- [Spécifications du groupe de travail HTTP](https://httpwg.org/specs/) - Une liste précompilée des RFCs et ébauches en rapport avec HTTP

## HTTP

Sans tenir compte des modules compilés et utilisés, Apache en tant que serveur web de base respecte les normes IETF suivantes :

**[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) (Série de standards) — Sémantique de HTTP**

Cette norme définit la sémantique partagée par toutes les versions de HTTP : méthodes, codes d’état, champs d’en-tête et de fin de page, négociation sur le contenu et métadonnées des messages. Elle rend obsolètes les RFC 7231, 7232, 7233, 7235 et 7694.

**[RFC 9111](https://www.rfc-editor.org/rfc/rfc9111) (Série de standards) — Mise en cache HTTP**

Cette norme définit les caches HTTP et les champs d’en-tête HTTP associés qui contrôlent le comportement du cache ou indiquent des réponses pouvant être mises en cache. Elle rend obsolète la RFC 7234.

**[RFC 9112](https://www.rfc-editor.org/rfc/rfc9112) (Série de standards) — HTTP/1.1**

Cette norme définit la syntaxe des messages et la gestion des connexions avec HTTP/1.1. Elle rend obsolète la RFC 7230.

**[RFC 9113](https://www.rfc-editor.org/rfc/rfc9113) (Série de standards) — HTTP/2**

Cette norme définit et optimise l’expression de la sémantique de HTTP en utilisant le cadrage binaire (binary framing) et des flux multiplexés sur une seule connexion TCP. Elle rend obsolètes les RFC 7540 et 8740.

**[RFC 9114](https://www.rfc-editor.org/rfc/rfc9114) (Série de standards) — HTTP/3**

Cette norme définit le mappage de la sémantique HTTP sur QUIC, tout en fournissant des fonctionnalités similaires à HTTP/2 avec une latence réduite.

**[RFC 1945](https://www.rfc-editor.org/rfc/rfc1945) (Informations) — HTTP/1.0**

La spécification HTTP/1.0 originale. Conservée à titre de référence historique ; httpd accepte encore les requêtes HTTP/1.0.

## URIs

**[RFC 3986](https://www.rfc-editor.org/rfc/rfc3986) (Série de standards) — Uniform Resource Identifier (URI): Syntaxe générique**

La syntaxe générique et les règles de résolution des URIs. Cette norme rend obsolète la RFC 2396.

**[RFC 6570](https://www.rfc-editor.org/rfc/rfc6570) (Série de standards) — Modèle d’URI**

Cette norme définit une séquence compacte de caractères pour décrire une gamme d’URIs à l’aide d’un développement de variable.

## TLS/SSL

Les normes suivantes s’appliquent lorsque [[12-modules/mod_ssl|mod_ssl]] est activé :

**[RFC 8446](https://www.rfc-editor.org/rfc/rfc8446) (Série de standards) — TLS 1.3**

La version actuelle du protocole TLS (Transport Layer Security) assurant la confidentialité des communications sur l’Internet. Cette norme rend obsolète la RFC 5246 (texte de la spécification de TLS 1.2).

**[RFC 5246](https://www.rfc-editor.org/rfc/rfc5246) (Série de standards) — TLS 1.2**

La version précédente de TLS largement déployée. Encore prise en charge par httpd pour une compatibilité avec les clients anciens.

**[RFC 6960](https://www.rfc-editor.org/rfc/rfc6960) (Série de standards) — OCSP**

Le protocole OCSP (Online Certificate Status Protocol) utilisé pour vérifier l’état de révocation des certificats en temps réel (l’agrafage OCSP - OCSP stapling - à l’aide de la directive [[13-directives/sslstaplingcache|SSLStaplingCache]]).

**[RFC 6066](https://www.rfc-editor.org/rfc/rfc6066) (Série de standards) — TLS Extensions**

Cette norme définit les extensions de TLS, dont SNI (Server Name Indication) qu’utilise httpd pour les serveurs virtuels à base de nom sur TLS.

## Authentication

À propos des différentes méthodes d’authentification :

**[RFC 7617](https://www.rfc-editor.org/rfc/rfc7617) (Série de standards) — Le schéma d’authentification « basique » de HTTP**

L’authentification basique de HTTP qui transmet les données d’authentification sous la forme de paires identifiant utilisateur/mot de passe encodées en Base64. Cette norme rend obsolète la RFC 2617 (la portion basique de auth).

**[RFC 7616](https://www.rfc-editor.org/rfc/rfc7616) (Série de standards) — L’authentification de l’accès par condensés de HTTP**

L’authentification par condensés de HTTP qui fournit un mécanisme de question-réponse qui évite de transmettre le mot de passe en clair. Cette norme rend obsolète la RFC 2617 (portion condensé de auth).

## Négociation de contenu et compression

**[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110) - Négociation de contenu**

La négociation de contenu proactive et réactive à l’aide des champs d’en-tête Accept, Accept-Language, Accept-Encoding et Accept-Charset.

**[RFC 7932](https://www.rfc-editor.org/rfc/rfc7932) (Informations) — Brotli Compressed Data Format**

Cette norme définit l’algorithme de compression Brotli pris en charge par le module [[12-modules/mod_brotli|mod_brotli]].

## Mandat et redirection

Quand [[12-modules/mod_proxy|mod_proxy]] est activé :

**[RFC 7239](https://www.rfc-editor.org/rfc/rfc7239) (Série de standards) — L’extension HTTP Forwarded**

Cette norme définit le champ d’en-tête Forwarded pour le transport des informations à propos de la face côté client des serveurs mandataires.

**[RFC 9209](https://www.rfc-editor.org/rfc/rfc9209) (Série de standards) — Le champ d’en-tête de réponse HTTP Proxy-Status**

Cette norme définit un mécanisme permettant aux mandataires de communiquer les détails de la gestion intermédiaire au client.

**[RFC 9220](https://www.rfc-editor.org/rfc/rfc9220) (Série de standards) — « Bootstrapping » des WebSockets avec HTTP/2**

Cette norme définit un mécanisme permettant d’utiliser le protocole WebSocket sur un seul flux HTTP/2.

## WebSocket

**[RFC 6455](https://www.rfc-editor.org/rfc/rfc6455) (Série de standards) — The WebSocket Protocol**

Cette norme définit le protocole WebSocket qui permet une communication bidirectionnelle entre un client et un serveur sur une seule connexion TCP. Il est pris en charge par le module [[12-modules/mod_proxy_wstunnel|mod_proxy_wstunnel]].

## CGI

**[RFC 3875](https://www.rfc-editor.org/rfc/rfc3875) (Informations) — CGI (Common Gateway Interface) Version 1.1**

Cette norme définit l’interface CGI qui permet d’exécuter des programmes externes sur un serveur web. Implémenté par les modules [[12-modules/mod_cgi|mod_cgi]] et [[12-modules/mod_cgid|mod_cgid]].

## WebDAV

Quand [[12-modules/mod_dav|mod_dav]] est activé :

**[RFC 4918](https://www.rfc-editor.org/rfc/rfc4918) (Série de standards) — Extensions HTTP pour WebDav (Web Distributed Authoring and Versioning)**

Cette norme définit des extensions à HTTP pour les opérations de création distribuée. Elle rend obsolète la RFC 2518.

**[RFC 3744](https://www.rfc-editor.org/rfc/rfc3744) (Série de standards) — Protocole de contrôle d’accès pour WebDAV (Web Distributed Authoring and Versioning)**

Cette norme définit des extensions de contrôle d’accès pour WebDAV.

## Codes de langages et de pays

Les codes de langages et de pays utilisés dans la négociation de contenu :

**[ISO 639-2](https://www.loc.gov/standards/iso639-2/)**

ISO 639 fournit deux jeux de codes de langages permettant de représenter les noms des langues ; le premier est un jeu de codes sur deux lettres (639-1), le second (celui présenté dans le lien ci-dessus), est un jeu de codes sur trois lettres (639-2).

**[ISO 3166-1](https://www.iso.org/iso-3166-country-codes.html)**

Noms des pays et éléments de code correspondants à deux et trois caractères.

**[RFC 5646](https://www.rfc-editor.org/rfc/rfc5646) (Meilleure pratique actuelle) — Symboles pour identifier les langues**

Cette norme décrit la structure et l’enregistrement des symboles de langue utilisés dans la négociation de contenu de HTTP (Accept-Language, Content-Language). Elle rend obsolète la RFC 3066.

**[RFC 3282](https://www.rfc-editor.org/rfc/rfc3282) (Série de standards)**

Cette norme définit les champs d’en-tête Content-Language and Accept-Language qui indiquent les préférences en matière de langue dans les messages HTTP.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
