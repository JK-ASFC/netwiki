---
title: "ServerAlias"
description: "Directive Apache ServerAlias (core) — Autres noms d'un serveur utilisables pour atteindre des serveurs virtuels à base de nom. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Autres noms d'un serveur utilisables pour atteindre des serveurs virtuels à base de nom |
| **Syntaxe** | `ServerAlias nom serveur [nom serveur] ...` |
| **Contexte** | serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `ServerAlias` permet de définir les noms alternatifs d'un serveur utilisables pour atteindre des [[11-guides/03-serveurs-virtuels/support-apache-des-serveurs-virtuels-par-nom|serveurs virtuels à base de nom]]. La directive `ServerAlias` peut contenir des caractères génériques, si nécessaire.

```apache
<VirtualHost *:80>
  ServerName server.example.com
  ServerAlias server server2.example.com server2
  ServerAlias *.example.com
  UseCanonicalName Off
  # ...
</VirtualHost>
```

La recherche du serveur virtuel à base de nom correspondant au plus près à la requête s'effectue selon l'ordre d'apparition des directives [[13-directives/virtualhost|<virtualhost>]] dans le fichier de configuration. Le premier serveur virtuel dont le [[13-directives/servername|ServerName]] ou le [[13-directives/serveralias|ServerAlias]] correspond est choisi, sans priorité particulière si le nom contient des caractères génériques (que ce soit pour ServerName ou ServerAlias).

Tous les noms spécifiés au sein d'une section [[13-directives/virtualhost|<VirtualHost>]] sont traités comme un `ServerAlias` (sans caractères génériques).

## Voir aussi

- [[13-directives/usecanonicalname|UseCanonicalName]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
