---
title: "SSLCertificateChainFile"
description: "Directive Apache SSLCertificateChainFile (mod_ssl) — Fichier contenant les certificats de CA du serveur codés en PEM. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier contenant les certificats de CA du serveur codés en PEM |
| **Syntaxe** | `SSLCertificateChainFile file-path` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

> [!NOTE]
> **SSLCertificateChainFile est obsolète**
>
> `SSLCertificateChainFile` est devenue obsolète avec la version 2.4.8, lorsque la directive [[13-directives/sslcertificatefile|SSLCertificateFile]] a été étendue pour supporter aussi les certificats de CA intermédiaires dans le fichier de certificats du serveur.

Cette directive permet de définir le fichier optionnel *tout-en-un* où vous pouvez rassembler les certificats des Autorités de Certification (CA) qui forment la chaîne de certification du certificat du serveur. Cette chaîne débute par le certificat de la CA qui a délivré le certificat du serveur et peut remonter jusqu'au certificat de la CA racine. Un tel fichier contient la simple concaténation des différents certificats de CA codés en PEM, en général dans l'ordre de la chaîne de certification.

Elle doit être utilisée à la place et/ou en complément de la directive [[13-directives/sslcacertificatepath|SSLCACertificatePath]] pour construire explicitement la chaîne de certification du serveur qui est envoyée au navigateur en plus du certificat du serveur. Elle s'avère particulièrement utile pour éviter les conflits avec les certificats de CA lorsqu'on utilise l'authentification du client. Comme le fait de placer un certificat de CA de la chaîne de certification du serveur dans la directive [[13-directives/sslcacertificatepath|SSLCACertificatePath]] produit le même effet pour la construction de la chaîne de certification, cette directive a pour effet colatéral de faire accepter les certificats clients fournis par cette même CA, au cours de l'authentification du client.

Soyez cependant prudent : fournir la chaîne de certification ne fonctionne que si vous utilisez un *simple* certificat de serveur RSA *ou* DSA. Si vous utilisez une paire de certificats couplés RSA+DSA , cela ne fonctionnera que si les deux certificats utilisent vraiment *la même* chaîne de certification. Dans le cas contraire, la confusion risque de s'installer au niveau des navigateurs.

**Exemple**

```apache
SSLCertificateChainFile "/usr/local/apache2/conf/ssl.crt/ca.crt"
```

Ce fichier est lu au démarrage du serveur, alors que ce dernier s'exécute encore en tant que `root` (avant la restriction de ses privilèges) ; il ne doit donc être la propriété que de `root` et lisible uniquement par ce dernier. Le fichier n'est pas relu en fonctionnement normal ; un redémarrage du serveur est requis pour que les changements prennent effet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
