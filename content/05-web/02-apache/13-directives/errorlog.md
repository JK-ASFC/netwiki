---
title: "ErrorLog"
description: "Directive Apache ErrorLog (core) — Définition du chemin du journal des erreurs. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définition du chemin du journal des erreurs |
| **Syntaxe** | `ErrorLog file-path\|syslog[:[facility][:tag]]` |
| **Valeur par défaut** | `ErrorLog logs/error_log (Unix) ErrorLog logs/error.log (Windows and OS/2)` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |

## Utilisation

La directive `ErrorLog` permet de définir le nom du fichier dans lequel le serveur va journaliser toutes les erreurs qu'il rencontre. Si le *file-path* n'est pas absolu, il est considéré comme relatif au chemin défini par la directive [[13-directives/serverroot|ServerRoot]].

```apache
ErrorLog "/var/log/httpd/error_log"
```

Si le *file-path* commence par une barre verticale "`(|)`", il est considéré comme une commande à lancer pour traiter la journalisation de l'erreur.

```apache
ErrorLog "|/usr/local/bin/httpd_errors"
```

Voir les notes à propos des [[11-guides/01-generalites/fichiers-journaux|journaux redirigés]] pour plus d'informations.

L'utilisation de `syslog` à la place d'un nom de fichier active la journalisation via syslogd(8) si le système le supporte. Le dispositif syslog par défaut est `local7`, mais vous pouvez le modifier à l'aide de la syntaxe `syslog:facility`, où *facility* peut être remplacé par un des noms habituellement documentés dans la page de man syslog(1). Le dispositif syslog `local7` est global, et si il est modifié dans un serveur virtuel, le dispositif final spécifié affecte l'ensemble du serveur. La même règle s'applique au tag syslog qui utilise par défaut le nom du binaire du serveur HTTP Apache `httpd` dans la plupart des cas. Vous pouvez aussi modifier cette valeur en utilisant la syntaxe `syslog::tag`.

```apache
ErrorLog syslog:user
ErrorLog syslog:user:httpd.srv1
ErrorLog syslog::httpd.srv2
```

SECURITE : Voir le document [[11-guides/06-divers/conseils-sur-la-securite|conseils à propos de sécurité]] pour des détails sur les raisons pour lesquelles votre sécurité peut être compromise si le répertoire contenant les fichiers journaux présente des droits en écriture pour tout autre utilisateur que celui sous lequel le serveur est démarré.

> [!WARNING]
> **Note**
>
> Lors de la spécification d'un chemin de fichier sur les plates-formes non-Unix, on doit veiller à n'utiliser que des slashes (/), même si la plate-forme autorise l'utilisation des anti-slashes (\\). Et d'une manière générale, il est recommandé de n'utiliser que des slashes (/) dans les fichiers de configuration.

## Voir aussi

- [[13-directives/loglevel|LogLevel]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
