---
title: "ContentDigest"
description: "Directive Apache ContentDigest (core) — Active la génération d'un en-tête Content-MD5 dans la réponse HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la génération d'un en-tête `Content-MD5` dans la réponse HTTP |
| **Syntaxe** | `ContentDigest On\|Off` |
| **Valeur par défaut** | `ContentDigest Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Options |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

Cette directive active la génération d'un en-tête `Content-MD5` selon les définitions des RFC 1864 et 2616.

MD5 est un algorithme permettant de générer un condensé (parfois appelé "empreinte") à partir de données d'une taille aléatoire ; le degré de précision est tel que la moindre altération des données d'origine entraîne une altération de l'empreinte.

L'en-tête `Content-MD5` permet de vérifier l'intégrité de la réponse HTTP dans son ensemble. Un serveur mandataire ou un client peut utiliser cet en-tête pour rechercher une éventuelle modification accidentelle de la réponse au cours de sa transmission. Exemple d'en-tête :

```
Content-MD5: AuLb7Dp1rqtRtxz2m9kRpA==
```

Notez que des problèmes de performances peuvent affecter votre serveur, car l'empreinte est générée pour chaque requête (il n'y a pas de mise en cache).

L'en-tête `Content-MD5` n'est envoyé qu'avec les documents servis par le module [[12-modules/core|core]], à l'exclusion de tout autre module. Ainsi, les documents SSI, les sorties de scripts CGI, et les réponses à des requêtes partielles (byte range) ne comportent pas cet en-tête.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
