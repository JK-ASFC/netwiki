---
title: "FileETag"
description: "Directive Apache FileETag (core) — Caractéristiques de fichier utilisées lors de la génération de l'en-tête de réponse HTTP ETag pour les fichiers statiques. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Caractéristiques de fichier utilisées lors de la génération de l'en-tête de réponse HTTP ETag pour les fichiers statiques |
| **Syntaxe** | `FileETag composant ...` |
| **Valeur par défaut** | `FileETag MTime Size` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | La valeur par défaut était "INode MTime Size" dans les versions 2.3.14 et antérieures. |

## Utilisation

La directive `FileETag` définit les caractéristiques de fichier utilisées lors de la génération de l'en-tête de réponse HTTP `ETag` (entity tag) quand le document est contenu dans un fichier statique (la valeur de `ETag` est utilisée dans le cadre de la gestion du cache pour préserver la bande passante réseau). La directive `FileETag` vous permet maintenant de choisir quelles caractéristiques du fichier vont être utilisées, le cas échéant. Les mots-clés reconnus sont :

**INode**

Le numéro d'i-node du fichier sera inclus dans le processus de génération

**MTime**

La date et l'heure auxquelles le fichier a été modifié la dernière fois seront incluses

**Size**

La taille du fichier en octets sera incluse

**All**

Tous les champs disponibles seront utilisés. Cette définition est équivalente à :

```apache
FileETag INode MTime Size
```

**Digest**

Si un document est à base de fichier, le champ `ETag` sera généré à partir du condensé du fichier.

**None**

Si le document se compose d'un fichier, aucun champ `ETag` ne sera inclus dans la réponse

Les mots-clés `INode`, `MTime`, `Size` et `Digest` peuvent être préfixés par `+` ou `-`, ce qui permet de modifier les valeurs par défaut héritées d'un niveau de configuration plus général. Tout mot-clé apparaissant sans aucun préfixe annule entièrement et immédiatement les configurations héritées.

Si la configuration d'un répertoire contient `FileETag INode MTime Size`, et si un de ses sous-répertoires contient `FileETag -INode`, la configuration de ce sous-répertoire (qui sera propagée vers tout sous-répertoire qui ne la supplante pas), sera équivalente à `FileETag MTime Size`.

> [!NOTE]
> **Inclusions côté serveur**
>
> Aucun champ ETag n'est généré pour les réponses interprétées par [[12-modules/mod_include|mod_include]], car l'entité de la réponse peut changer sans modification de l'INode, MTime, Size ou Digest du fichier statique contenant les directives SSI.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
