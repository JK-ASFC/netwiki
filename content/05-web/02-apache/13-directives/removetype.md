---
title: "RemoveType"
description: "Directive Apache RemoveType (mod_mime) — Supprime toute association de type de contenu à un ensemble d'extensions de noms de fichiers. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_mime]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Supprime toute association de type de contenu à un ensemble d'extensions de noms de fichiers |
| **Syntaxe** | `RemoveType extension [extension] ...` |
| **Contexte** | serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | FileInfo |
| **Statut** | Base |
| **Module** | [[12-modules/mod_mime\|mod_mime]] |

## Utilisation

La directive `RemoveType` permet de supprimer toute association de type de médium à des fichiers dont le nom possède l'extension donnée. Ceci permet, au sein des fichiers `.htaccess`, d'annuler toute association héritée du répertoire parent ou de la configuration du serveur pour un répertoire particulier. Voici un exemple d'utilisation de cette directive :

**/foo/.htaccess:**

```apache
RemoveType .cgi
```

Cette ligne aura pour effet de supprimer tout traitement spécifique des fichiers `.cgi` dans le répertoire `/foo/` et ses sous-répertoires, et les réponses contenant ce type de fichier ne possèderont pas de champ d'en-tête HTTP Content-Type.

> [!NOTE]
> **Note**
>
> Les directives `RemoveType` sont traitées *après* toutes les directives [[13-directives/addtype|AddType]], et il est possible que les effets de ces dernières soient annulés si les deux types de directives sont présents au sein de la configuration du même répertoire.

L'argument *extension* est insensible à la casse et peut être spécifié avec ou sans le point initial.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
