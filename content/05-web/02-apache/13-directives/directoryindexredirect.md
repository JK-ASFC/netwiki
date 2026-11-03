---
title: "DirectoryIndexRedirect"
description: "Directive Apache DirectoryIndexRedirect (mod_dir) — Définit une redirection externe pour les index de répertoires. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dir]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une redirection externe pour les index de répertoires. |
| **Syntaxe** | `DirectoryIndexRedirect on \| off \| permanent \| temp \| seeother \| 3xx-code` |
| **Valeur par défaut** | `DirectoryIndexRedirect off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | Indexes |
| **Statut** | Base |
| **Module** | [[12-modules/mod_dir\|mod_dir]] |
| **Compatibilité** | Disponible depuis la version 2.3.14 |

## Utilisation

Par défaut, c'est la page définie par la directive `DirectoryIndex` qui est sélectionnée et renvoyée de manière transparente au client. La directive `DirectoryIndexRedirect` permet de rediriger le client via une redirection de type 3xx.

Les arguments acceptés sont :

- `on` : envoie une redirection 302 vers l'index choisi.
- `off` : n'envoie aucune redirection. Il s'agit du comportement historique de mod\_dir.
- `permanent` : envoie une redirection 301 (permanent) vers l'index choisi.
- `temp` : ceci est équivalent à `on`
- `seeother` : envoie une redirection 303 (également appelée "See Other") vers l'index choisi.
- *3xx-code* : envoie une redirection accompagnée du code 3xx choisi.

**Exemple**

```apache
DirectoryIndexRedirect on
```

Une requête pour `http://example.com/docs/` se solderait par une redirection temporaire vers `http://example.com/docs/index.html` si cette ressource existe.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
