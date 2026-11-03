---
title: "ChrootDir"
description: "Directive Apache ChrootDir (mod_unixd) — Répertoire dans lequel Apache doit se positionner au démarrage après avoir effectué un chroot(8). Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_unixd]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Répertoire dans lequel Apache doit se positionner au démarrage après avoir effectué un chroot(8). |
| **Syntaxe** | `ChrootDir chemin-répertoire` |
| **Valeur par défaut** | `Non défini` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_unixd\|mod_unixd]] |
| **Compatibilité** | Disponible depuis la version 2.2.10 d'Apache |

## Utilisation

Cette directive fait en sorte que le serveur effectue un *chroot(8)* vers le répertoire spécifié après le démarrage, mais avant d'accepter les requêtes en provenance du réseau.

Notez que l'exécution du serveur dans un environnement chroot n'est pas simple et nécessite une configuration particulière, en particulier si vous utilisez des scripts CGI ou PHP. Il est conseillé de se familiariser avec l'opération chroot avant d'essayer d'utiliser cette fonctionnalité.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
