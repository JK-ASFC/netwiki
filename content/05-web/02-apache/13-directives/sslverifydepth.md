---
title: "SSLVerifyDepth"
description: "Directive Apache SSLVerifyDepth (mod_ssl) — Profondeur maximale des certificats de CA pour la vérification des certificats clients. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Profondeur maximale des certificats de CA pour la vérification des certificats clients |
| **Syntaxe** | `SSLVerifyDepth nombre` |
| **Valeur par défaut** | `SSLVerifyDepth 1` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet de spécifier la profondeur maximale à laquelle mod\_ssl va effectuer sa vérification avant de décider que le client ne possède pas de certificat valide. Notez que cette directive peut être utilisée à la fois dans les contextes du serveur principal et de répertoire. Dans le contexte du serveur principal, elle s'applique au processus d'authentification du client utilisé au cours de la négociation SSL standard lors de l'établissement d'une connexion. Dans un contexte de répertoire, elle force une renégociation SSL avec le client selon la nouvelle profondeur spécifiée, après la lecture d'une requête HTTP, mais avant l'envoi de la réponse HTTP.

La profondeur correspond au nombre maximum de fournisseurs de certificats intermédiaires, c'est à dire le nombre maximum de certificats de CA que l'on est autorisé à suivre lors de la vérification du certificat du client. Une profondeur de 0 signifie que seuls les certificats clients auto-signés sont acceptés ; la profondeur par défaut de 1 signifie que le certificat client peut être soit auto-signé, soit signé par une CA connue directement du serveur (c'est à dire que le certificat de la CA doit être référencé par la directive [[13-directives/sslcacertificatepath|SSLCACertificatePath]]), etc...

**Exemple**

```apache
SSLVerifyDepth 10
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
