---
title: "SSLCertificateFile"
description: "Directive Apache SSLCertificateFile (mod_ssl) — Fichier de données contenant les informations de certificat X.509 du serveur codées au format PEM ou identificateur de jeton. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier de données contenant les informations de certificat X.509 du serveur codées au format PEM ou identificateur de jeton |
| **Syntaxe** | `SSLCertificateFile file-path\|certid` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | L'option *certid* est disponible à partir de la version 2.4.42 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir le fichier de données contenant les informations de certificat X.509 du serveur codées au format PEM ou l'identificateur de certificat via un jeton cryptographique. Si on utilise un fichier au format PEM, ce dernier doit contenir au minimum un certificat d'entité finale (feuille). La directive peut être utilisée plusieurs fois (elle référence des fichiers différents) pour accepter plusieurs algorithmes d'authentification au niveau du serveur - souvent RSA, DSA et ECC. Le nombre d'algorithmes supportés dépend de la version d'OpenSSL utilisée avec mod\_ssl : à partir de la version 1.0.0, la commande `openssl list-public-key-algorithms` affiche la liste des algorithmes supportés. Voir aussi la note ci-dessous à propos des limitations des versions d'OpenSSL antérieures à 1.0.2 et la manière de les contourner.

Les fichiers peuvent aussi contenir des certificats de CA intermédiaires triés depuis la feuille vers la racine. Cette fonctionnalité est disponible depuis la version 2.4.8 du serveur HTTP Apache, et rend obsolète la directive [[13-directives/sslcertificatechainfile|SSLCertificateChainFile]]. A partir de la version 1.0.2 d'OpenSSL, il est alors possible de configurer la chaîne de certification en fonction du certificat.

Depuis la version 2.4.7 du serveur HTTP Apache, on peut aussi ajouter des paramètres DH personnalisés et un nom EC curve pour les clés éphémères à la fin du premier fichier défini par la directive [[13-directives/sslcertificatefile|SSLCertificateFile]]. Ces paramètres peuvent être générés avec les commandes `openssl dhparam` et `openssl ecparam`, et ils peuvent être ajoutés tel quel à la fin du premier fichier de certificat. En effet, seul le premier fichier de certificat défini peut être utilisé pour enregistrer des paramètres personnalisés, car ces derniers s'appliquent indépendamment de l'algorithme d'authentification utilisé.

> [!WARNING]
> **N'enregistrez pas clé et certificat dans le même fichier**
>
> Cette pratique est fortement déconseillée pour les raisons suivantes :
>
> - **Sécurité** : conserver la clé privée dans un fichier séparé permet une gestion plus stricte des permissions de fichier. Le fichier de certificat peut être lisible par tous (ce sont des données publiques), alors que le fichier de clé ne doit être lisible que par le superutilisateur. Combiner les deux dans un même fichier implique que toute vulnérabilité ou mauvaise configuration qui expose le fichier du certificat exposera aussi la clé privée.
> - **Contrainte d'ordre** : si un fichier combiné est utilisé, toute directive `SSLCertificateFile` référençant un tel fichier doit apparaître *après* toute directive `SSLCertificateFile` qui utilise un fichier de clé séparé. Ne pas respecter cet ordre provoquera des erreurs au démarrage.
> - **Maintenance** : avec des fichiers séparés, il est immédiatement possible de savoir quel fichier contient quoi, ce qui simplifie la rotation des certificats et les audits.
>
> Si la clé privée est chiffrée, la phrase secrète est demandée au démarrage.

Enfin, il est aussi possible d'ajouter la clé privée du certificat de l'entité finale au fichier de certificat, ce qui permet de se passer d'une directive [[13-directives/sslcertificatekeyfile|SSLCertificateKeyFile]] séparée.

Plutôt que de stocker les certificats et les clés privées dans des fichiers, on peut utiliser un identificateur de certificat pour identifier un certificat stocké dans un jeton. Actuellement, seuls les URIs PKCS#11 ([RFC 7512](https://www.rfc-editor.org/rfc/rfc7512)) sont reconnus comme identificateurs de certificats et peuvent être utilisés en conjonction avec le moteur ou le fournisseur OpenSSL `pkcs11`. Si la directive [[13-directives/sslcertificatekeyfile|SSLCertificateKeyFile]] est absente, le certificat et la clé privée peuvent être chargés avec l'identificateur spécifié via la directive [[13-directives/sslcertificatefile|SSLCertificateFile]].

> [!NOTE]
> **Interopérabilité des paramètres DH avec les nombres premiers de plus de 1024 bits**
>
> Depuis la version 2.4.7, mod\_ssl utilise des paramètres DH standardisés avec des nombres premiers de 2048, 3072 et 4096 bits, et avec des nombres premiers de 6144 et 8192 bits depuis la version 2.4.10 (voir la [RFC 3526](https://www.rfc-editor.org/rfc/rfc3526)), et les fournit aux clients en fonction de la longueur de la clé du certificat RSA/DSA. En particulier avec les clients basés sur Java (versions 7 et antérieures), ceci peut provoquer des erreurs au cours de la négociation - voir cette [[11-guides/04-chiffrement-ssl-tls/chiffrement-ssl-tls-fort-foire-aux-questions|réponse de la FAQ SSL]] pour contourner les problèmes de ce genre.

> [!NOTE]
> **Paramètres DH par défaut lorsqu'on utilise plusieurs certificats et une version d'OpenSSL antérieure à 1.0.2.**
>
> Lorsqu'on utilise plusieurs certificats pour supporter différents algorithmes d'authentification (comme RSA, DSA, mais principalement ECC) et une version d'OpenSSL antérieure à 1.0.2, il est recommandé soit d'utiliser des paramètres DH spécifiques (solution à privilégier) en les ajoutant au premier fichier certificat (comme décrit ci-dessus), soit d'ordonner les directives `SSLCertificateFile` de façon à ce que les certificats RSA/DSA soit placés **après** les certificats ECC.
>
> Cette limitation est présente dans les anciennes versions d'OpenSSL qui présentent toujours le dernier certificat configuré, au lieu de laisser le serveur HTTP Apache déterminer le certificat sélectionné lors de la phase de négociation de la connexion (lorsque les paramètres DH doivent être envoyés à l'hôte distant). De ce fait, le serveur peut sélectionner des paramètres DH par défaut basés sur la longueur de la clé du mauvais certificat (les clés ECC sont beaucoup plus petites que les clés RSA/DSA et leur longueur n'est pas pertinente pour la sélection des nombres premiers DH).
>
> Ce problème peut être résolu en créant et configurant des paramètres DH spécifiques (comme décrit ci-dessus), car ils l'emportent toujours sur les paramètres DH par défaut, et vous pourrez ainsi utiliser une longueur spécifique et appropriée.

**Exemple**

```apache
# Exemple utilisant un fichier codé en PEM.
SSLCertificateFile "/usr/local/apache2/conf/ssl.crt/server.crt"
# Exemple d'utilisation d'un certificat et d'une clé privés issus d'un jeton
# PKCS#11 :
SSLCertificateFile "pkcs11:token=My%20Token%20Name;id=45"
```

Ce fichier est lu au démarrage du serveur, alors que ce dernier s'exécute encore en tant que `root` (avant la restriction de ses privilèges) ; il ne doit donc être la propriété que de `root` et lisible uniquement par ce dernier. Le fichier n'est pas relu en fonctionnement normal ; un redémarrage du serveur est requis pour que les changements prennent effet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
