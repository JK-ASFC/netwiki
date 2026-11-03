---
title: "DirectorySlash"
description: "Directive Apache DirectorySlash (mod_dir) — Activation/Désactivation de la redirection \"slash de fin\". Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dir]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Activation/Désactivation de la redirection "slash de fin" |
| **Syntaxe** | `DirectorySlash On\|Off` |
| **Valeur par défaut** | `DirectorySlash On` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_dir\|mod_dir]] |
| **Compatibilité** | L'argument NotFound est disponible à partir de la version 2.5.1 du serveur HTTP Apache |

## Utilisation

La directive `DirectorySlash` permet de déterminer si [[12-modules/mod_dir|mod_dir]] doit éventuellement corriger les URLs pointant vers un répertoire.

En général, si un utilisateur envoie une requête pour une ressource sans slash de fin, cette ressource représentant un répertoire, [[12-modules/mod_dir|mod_dir]] le redirige vers la même ressource, mais *en ajoutant* un slash de fin, et ceci pour plusieurs bonnes raisons :

- La requête de l'utilisateur contiendra finalement l'URL canonique de la ressource
- [[12-modules/mod_autoindex|mod_autoindex]] fonctionnera correctement. Comme il n'indique pas le chemin dans le lien, le chemin de l'URL serait incorrect.
- La directive [[13-directives/directoryindex|DirectoryIndex]] n'est évaluée *que* pour les répertoires se terminant par un slash.
- Les références à des URLs relatives dans les pages html fonctionneront alors correctement.

Si vous ne souhaitez pas voir ces effets, *et* si les raisons évoquées ci-dessus ne s'appliquent pas à vous, vous pouvez désactiver la redirection comme indiqué ci-dessous. Gardez cependant à l'esprit que ceci peut avoir des répercutions en matière de sécurité.

```apache
# voir l'avertissement de sécurité ci-dessous !
<Location "/some/path">
    DirectorySlash Off
    SetHandler some-handler
</Location>
```

> [!WARNING]
> **Avertissement de sécurité**
>
> La désactivation de la redirection "slash de fin" peut entraîner la divulgation d'informations. Considérons la situation où [[12-modules/mod_autoindex|mod_autoindex]] est actif (`Options +Indexes`), où la directive [[13-directives/directoryindex|DirectoryIndex]] a pour valeur une ressource valide (par exemple `index.html`), et où aucun gestionnaire particulier n'a été défini pour cette URL. Dans ce cas, une requête avec slash de fin afficherait le contenu du fichier `index.html` ; **par contre, une requête sans slash de fin afficherait un listing du contenu du répertoire**.

Notez aussi que certains navigateurs peuvent modifier par erreur des requêtes POST en requêtes GET lors d'une redirection, les données POST étant alors perdues.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
