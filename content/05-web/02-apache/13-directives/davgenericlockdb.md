---
title: "DavGenericLockDB"
description: "Directive Apache DavGenericLockDB (mod_dav_lock) — Chemin de la base de données des verrous DAV. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_dav_lock]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Chemin de la base de données des verrous DAV |
| **Syntaxe** | `DavGenericLockDB chemin fichier` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_dav_lock\|mod_dav_lock]] |

## Utilisation

La directive `DavLockDB` permet de spécifier le chemin complet de la base de données des verrous, sans extension. Si le chemin n'est pas absolu, il sera considéré comme relatif au répertoire défini par la directive [[13-directives/serverroot|ServerRoot]]. L'implémentation de [[12-modules/mod_dav_lock|mod_dav_lock]] utilise une base de données SDBM pour surveiller les verrous utilisateurs.

**Exemple**

```apache
DavGenericLockDB var/DavLock
```

Les utilisateur et groupe sous lesquels Apache s'exécute et qui sont respectivement définis par les directives [[13-directives/user|User]] et [[13-directives/group|Group]] doivent pouvoir écrire dans le répertoire qui contient le fichier de la base de données des verrous. Pour des raisons de sécurité, il est recommandé de créer un répertoire dédié à la base de données des verrous, plutôt que de modifier les permissions d'un répertoire existant. Dans l'exemple ci-dessus, Apache va créer des fichiers dans le répertoire `var/`, lui-même sous-répertoire du répertoire défini par la directive [[13-directives/serverroot|ServerRoot]], avec le nom de base `DavLock` suivi d'une extension choisie par le serveur.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
