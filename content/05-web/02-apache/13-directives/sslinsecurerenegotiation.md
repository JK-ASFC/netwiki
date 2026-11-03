---
title: "SSLInsecureRenegotiation"
description: "Directive Apache SSLInsecureRenegotiation (mod_ssl) — Option permettant d'activer le support de la renégociation non sécurisée. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Option permettant d'activer le support de la renégociation non sécurisée |
| **Syntaxe** | `SSLInsecureRenegotiation on\|off` |
| **Valeur par défaut** | `SSLInsecureRenegotiation off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible depuis httpd 2.2.15, si une version 0.9.8m ou supérieure d'OpenSSL est utilisée |

## Utilisation

Comme il a été spécifié, toutes les versions des protocoles SSL et TLS (jusqu'à la version 1.2 de TLS incluse) étaient vulnérables à une attaque de type Man-in-the-Middle ([CVE-2009-3555](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CAN-2009-3555)) au cours d'une renégociation. Cette vulnérabilité permettait à un attaquant de préfixer la requête HTTP (telle qu'elle était vue du serveur) avec un texte choisi. Une extension du protocole a été développée pour corriger cette vulnérabilité, sous réserve qu'elle soit supportée par le client et le serveur.

Si [[12-modules/mod_ssl|mod_ssl]] est lié à une version 0.9.8m ou supérieure d'OpenSSL, par défaut, la renégociation n'est accordée qu'aux clients qui supportent la nouvelle extension du protocole. Si cette directive est activée, la renégociation sera accordée aux anciens clients (non patchés), quoique de manière non sécurisée

> [!WARNING]
> **Avertissement à propos de la sécurité**
>
> Si cette directive est activée, les connexions SSL seront vulnérables aux attaques de type préfixe Man-in-the-Middle comme décrit dans [CVE-2009-3555](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CAN-2009-3555).

**Exemple**

```apache
SSLInsecureRenegotiation on
```

La variable d'environnement `SSL_SECURE_RENEG` peut être utilisée dans un script SSI ou CGI pour déterminer si la renégociation sécurisée est supportée pour une connexion SSL donnée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
