---
title: "SSLVerifyClient"
description: "Directive Apache SSLVerifyClient (mod_ssl) — Niveau de vérification du certificat client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Niveau de vérification du certificat client |
| **Syntaxe** | `SSLVerifyClient niveau` |
| **Valeur par défaut** | `SSLVerifyClient none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |

## Utilisation

Cette directive permet de définir le niveau de vérification du certificat pour l'authentification du client. Notez que cette directive peut être utilisée à la fois dans les contextes du serveur principal et du répertoire. Dans le contexte du serveur principal, elle s'applique au processus d'authentification du client utilisé au cours de la négociation SSL standard lors de l'établissement d'une connexion. Dans un contexte de répertoire, elle force une renégociation SSL avec le niveau de vérification du client spécifié, après la lecture d'une requête HTTP, mais avant l'envoi de la réponse HTTP.

Les valeurs de *niveau* disponibles sont les suivantes :

- **none**: aucun certificat client n'est requis
- **optional**: le client *peut* présenter un certificat valide
- **require**: le client *doit* présenter un certificat valide
- **optional\_no\_ca**: le client peut présenter un certificat valide, mais il n'est pas nécessaire que ce dernier soit vérifiable (avec succès). Cette option ne peut pas être utilisée lors de l'authentification du client.

**Exemple**

```apache
SSLVerifyClient require
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
