---
title: "SessionHeader"
description: "Directive Apache SessionHeader (mod_session) — Importation des mises à jour de session depuis l'en-tête de réponse HTTP spécifié. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_session]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Importation des mises à jour de session depuis l'en-tête de réponse HTTP spécifié |
| **Syntaxe** | `SessionHeader en-tête` |
| **Valeur par défaut** | `none` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire, .htaccess |
| **AllowOverride** | AuthConfig |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_session\|mod_session]] |

## Utilisation

La directive `SessionHeader` permet de définir le nom d'un en-tête de réponse HTTP qui, s'il est présent, sera lu et son contenu écrit dans la session courante.

Le contenu de l'en-tête doit se présenter sous le même format que celui de la chaîne d'arguments d'une URL, comme dans l'exemple suivant :

```
clé1=foo&clé2=&clé3=bar
```

Si une clé a pour valeur la chaîne vide, elle sera supprimée de la session.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
