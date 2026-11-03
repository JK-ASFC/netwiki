---
title: "HttpProtocolOptions"
description: "Directive Apache HttpProtocolOptions (core) — Modifie les contraintes sur les messages des requêtes HTTP. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, core]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Modifie les contraintes sur les messages des requêtes HTTP |
| **Syntaxe** | `HttpProtocolOptions [Strict\|Unsafe] [RegisteredMethods\|LenientMethods] [Allow0.9\|Require1.0]` |
| **Valeur par défaut** | `HttpProtocolOptions Strict LenientMethods Allow0.9` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Noyau |
| **Module** | [[12-modules/core\|core]] |
| **Compatibilité** | Disponible à partir des versions 2.2.32 et 2.4.24 du serveur HTTP Apache |

## Utilisation

Cette directive permet de modifier les règles qui s'appliquent à la ligne de requête HTTP ([RFC 7230](https://www.rfc-editor.org/rfc/rfc7230)) et aux champs des en-têtes des requêtes HTTP ([RFC 7230](https://www.rfc-editor.org/rfc/rfc7230)), qui s'appliquent maintenant par défaut ou en utilisant l'option `Strict`. L'option `Unsafe` a été ajoutée pour pouvoir restaurer les anciens comportements nécessaires aux anciens modules et applications et aux agents utilisateurs personnalisés considérés comme obsolètes.

Ces règles s'appliquant avant le traitement de la requête, elles doivent, pour être prises en compte, être définies au niveau global ou dans la première section par défaut du serveur virtuel qui correspond à la requête considérée, par interface IP/port et non par nom.

Cette directive accepte trois paramètres issus de la liste suivante, ceux qui ne sont pas spécifiés prenant leur valeur par défaut :

**Strict|Unsafe**

Avant l'introduction de cette directive, les interpréteurs de requêtes du serveur HTTP Apache toléraient un grand nombre de formats en entrée qui n'étaient pas forcément conformes au protocole. [RFC 7230](https://www.rfc-editor.org/rfc/rfc7230) (Request Splitting) et [RFC 7230](https://www.rfc-editor.org/rfc/rfc7230) (Response Smuggling) ne rappellent que deux des risques potentiels induits par des requêtes non conformes, alors que [RFC 7230](https://www.rfc-editor.org/rfc/rfc7230) "Message Parsing Robustness" signale les risques encourus par l'acceptation de blancs non conformes dans les lignes de requête. Avec l'introduction de cette directive, toutes les règles de grammaire de la spécification doivent être respectées dans le mode d'opérations par défaut `Strict`.

> [!WARNING]
> **Risques de sécurité liés au mode Unsafe**
>
> Il est fortement déconseillé aux utilisateurs d'utiliser le mode d'opération `Unsafe`, ou `UnsafeWhitespace`, en particulier pour les déploiements de serveurs ouverts sur l'extérieur et/ou accessibles au public. Si un moniteur défectueux ou autre logiciel spécialisé ne s'exécutant que sur un intranet nécessite une interface, les utilisateurs ne doivent utiliser les options de type UnSafe qu'en cas de nécessité et uniquement au sein d'un serveur virtuel bien spécifique et sur un réseau privé.

**Exemple de requête provoquant l'envoi d'un message HTTP 400 en mode Strict**

```
# Missing CRLF
GET / HTTP/1.0\n\n
```

> [!WARNING]
> **Utilitaires en ligne de commande et CRLF**
>
> Il peut s'avérer nécessaire de forcer certains utilitaires à utiliser CRLF ; si ce n'est pas le cas, httpd reverra une réponse HTTP 400 comme dans le cas précédent. Par exemple, le **client OpenSSL s\_client doit utiliser le paramètre -crlf pour fonctionner correctement**.
>
> Pour détecter des problèmes tels que l'absence de CRLF, vous pouvez utiliser la directive [[13-directives/dumpioinput|DumpIOInput]] qui permet de décortiquer les requêtes HTTP.

**RegisteredMethods|LenientMethods**

La section "Overview" de la [RFC 7231](https://www.rfc-editor.org/rfc/rfc7231) "Request Methods" indique que les serveurs doivent renvoyer un message d'erreur lorsque la ligne de requête comporte une méthode non supportée. C'est déjà le cas lorsque l'option `LenientMethods` est utilisée, mais les administrateurs ont la possibilité de limiter les méthodes utilisées via l'option `RegisteredMethods` en enregistrant toute méthode non standard via la directive `RegisterHttpMethod`, en particulier si l'option `Unsafe` est utilisée.

> [!WARNING]
> **Compatibilité avec le mandat direct**
>
> L'option `RegisteredMethods` **ne doit pas** être utilisée pour les serveurs mandataires car ces derniers ne connaissent pas les méthodes supportées par les serveurs originaux.

**Exemple de requête provoquant l'envoi d'un message HTTP 501 en mode LenientMethods**

```
# Méthode HTTP inconnue
WOW / HTTP/1.0\r\n\r\n
# Méthode HTTP spécifiée en minuscules
get / HTTP/1.0\r\n\r\n
```

**Allow0.9|Require1.0**

La section "Compatibility With Previous Versions" de la [RFC 2616](https://www.rfc-editor.org/rfc/rfc2616) encouragait les serveurs HTTP à supporter les anciennes requêtes HTTP/0.9. La RFC 7230 va cependant à son encontre via sa préconisation "Le souhait de supporter les requêtes HTTP/0.9 a été supprimé" et y adjoint des commentaires dans [RFC 7230](https://www.rfc-editor.org/rfc/rfc7230) Appendix A. A ce titre, l'option `Require1.0` permet à l'utilisateur d'inhiber le comportement induit par l'option par défaut `Allow0.9`.

**Exemple de requête provoquant l'envoi d'un message HTTP 400 en mode Require1.0**

```
# Version HTTP non supportée
GET /\r\n\r\n
```

La consultation des messages enregistrés dans le journal `ErrorLog`, configuré via la directive `LogLevel` avec un niveau `info`, pourra vous aider à identifier de telles requêtes non conformes ainsi que leur provenance. Les utilisateurs devront accorder une attention particulière aux messages d'erreur de type 400 dans le journal access pour détecter les requêtes apparemment valides mais rejetées.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
