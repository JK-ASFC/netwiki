---
title: "MDExternalAccountBinding"
description: "Directive Apache MDExternalAccountBinding (mod_md) — Définit les valeurs keyid et hmac de liaison avec les comptes externes à utiliser dans les CA. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit les valeurs keyid et hmac de liaison avec les comptes externes à utiliser dans les CA |
| **Syntaxe** | `MDExternalAccountBinding key-id hmac-64 \| none \| file` |
| **Valeur par défaut** | `MDExternalAccountBinding none` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.52 du serveur HTTP Apache |

## Utilisation

Cette directive permet de définir des valeurs pour associer des comptes externes avec ACME ("External Account Binding") ; c'est une fonctionnalité de la norme ACME qui permet à des clients d'associer des inscriptions à un compte client existant sur les serveurs ACME.

Certains CAs ACME ont besoin de ces valeurs, mais ce n'est pas le cas pour Let's Encrypt. Vérifiez avec votre CA ACME si vous avez besoin de ces valeurs et la manière de les obtenir. Ces dernières se composent de deux chaînes : un identifiant de clé et une valeur 'hmac' codée en base64.

Vous pouvez définir ces valeurs de manière globale ou pour un MDomain spécifique. Comme ces valeurs permettent à n'importe qui de s'inscrire sous le même compte, il est conseillé de restreindre les permissions d'accès au fichier de configuration (à root seulement, par exemple).

Les valeurs peuvent aussi être extraites d'un fichier JSON pour conserver l'ouverture des permissions au niveau de la configuration du serveur et restreindre celles de ce fichier. Le fichier JSON sera du style :

**Exemple de fichier EAB JSON**

```apache
{"kid": "kid-1", "hmac": "zWND..."}
```

Si vous modifiez les valeurs EAB, ce sont les nouvelles valeurs qui seront utilisées lors du prochain renouvellement de certificat.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
