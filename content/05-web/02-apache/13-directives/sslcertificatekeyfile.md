---
title: "SSLCertificateKeyFile"
description: "Directive Apache SSLCertificateKeyFile (mod_ssl) — Fichier contenant la clé privée du serveur codée en PEM. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier contenant la clé privée du serveur codée en PEM |
| **Syntaxe** | `SSLCertificateKeyFile file-path\|keyid` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | *keyid* est disponible à partir de la version 2.4.42 du serveur HTTP Apache. |

## Utilisation

Cette directive permet de définir le fichier contenant la clé privée du serveur codée en PEM ou l'identifiant de la clé via un jeton cryptographique défini. Si la clé privée est chiffrée, une boîte de dialogue demandant le mot de passe de cette dernière s'ouvre au démarrage du serveur.

Cette directive peut être utilisée plusieurs fois pour référencer différents noms de fichiers, afin de supporter plusieurs algorithmes pour l'authentification du serveur. A chaque directive [[13-directives/sslcertificatekeyfile|SSLCertificateKeyFile]] doit être associée une directive `SSLCertificateFile` correspondante.

> [!WARNING]
> **N'enregistrez pas clé et certificat dans le même fichier**
>
> La clé privée peut aussi être combinée avec le certificat dans le fichier spécifié par la directive [[13-directives/sslcertificatefile|SSLCertificateFile]], mais cette pratique est fortement déconseillée. Voir l'avertissement dans la documentation de la directive `SSLCertificateFile` pour une explication complète des risques et contraintes.

Plutôt que de stocker des clés privées dans des fichiers, il est possible d'identifier une clé privée via un identifiant stocké dans un jeton. Actuellement, seuls les URIs PKCS#11 ([RFC 7512](https://www.rfc-editor.org/rfc/rfc7512)) sont reconnus comme identifiants de clés privées et peuvent être utilisés en conjonction avec le moteur ou le fournisseur OpenSSL `pkcs11`.

**Exemple**

```apache
# Pour utiliser une clé privée stockée dans fichier encodé PEM :
SSLCertificateKeyFile "/usr/local/apache2/conf/ssl.key/server.key"
# Pour utiliser une clé privée à partir d'un jeton PKCS#11 :
SSLCertificateKeyFile "pkcs11:token=My%20Token%20Name;id=45"
```

Ce fichier est lu au démarrage du serveur, alors que ce dernier s'exécute encore en tant que `root` (avant la restriction de ses privilèges) ; il ne doit donc être la propriété que de `root` et lisible uniquement par ce dernier, car il contient la clé privée. Le fichier n'est pas relu en fonctionnement normal ; un redémarrage du serveur est requis pour que les changements prennent effet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
