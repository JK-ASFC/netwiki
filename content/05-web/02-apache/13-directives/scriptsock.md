---
title: "ScriptSock"
description: "Directive Apache ScriptSock (mod_cgid) — Le préfixe du nom de fichier du socket à utiliser pour communiquer avec le démon CGI. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_cgid]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Le préfixe du nom de fichier du socket à utiliser pour communiquer avec le démon CGI |
| **Syntaxe** | `ScriptSock chemin fichier` |
| **Valeur par défaut** | `ScriptSock cgisock` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_cgid\|mod_cgid]] |

## Utilisation

Cette directive permet de définir le préfixe du nom de fichier de la socket à utiliser pour communiquer avec le démon CGI, préfixe auquel sera ajouté une extension correspondant à l'identifiant processus du serveur. La socket sera ouverte avec les permissions de l'utilisateur qui a démarré Apache (en général root). Afin de préserver la sécurité des communications avec les scripts CGI, il est impératif de n'accorder à aucun autre utilisateur la permission d'écrire dans le répertoire où se trouve la socket.

Si *chemin fichier* n'est pas un chemin absolu, il est relatif au chemin défini par la directive [[13-directives/defaultruntimedir|DefaultRuntimeDir]].

**Exemple**

```apache
ScriptSock /var/run/cgid.sock
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
