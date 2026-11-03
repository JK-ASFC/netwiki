---
title: "SSLSRPVerifierFile"
description: "Directive Apache SSLSRPVerifierFile (mod_ssl) — Chemin du fichier de vérification SRP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin du fichier de vérification SRP |
| **Syntaxe** | `SSLSRPVerifierFile file-path` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible depuis la version 2.4.4 du serveur HTTP Apache, si la version 1.0.1 ou supérieure d'OpenSSL est utilisée. |

## Utilisation

Cette directive permet d'activer TLS-SRP et de définir le chemin du fichier de vérification OpenSSL SRP (Mot de passe distant sécurisé) contenant les noms d'utilisateurs TLS-SRP, les vérificateurs, les "grains de sel" (salts), ainsi que les paramètres de groupe.

**Exemple**

```
SSLSRPVerifierFile "/path/to/file.srpv"
```

Le fichier de vérification peut être créé via l'utilitaire en ligne de commande `openssl` :

**Création du fichier de vérification SRP**

```
openssl srp -srpvfile passwd.srpv -userinfo "some info" -add username
```

La valeur affectée au paramètre optionnel `-userinfo` est enregistrée dans la variable d'environnement `SSL_SRP_USERINFO`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
