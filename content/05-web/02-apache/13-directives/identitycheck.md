---
title: "IdentityCheck"
description: "Directive Apache IdentityCheck (mod_ident) — Active la journalisation de l'identité RFC 1413 de l'utilisateur distant. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ident]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la journalisation de l'identité RFC 1413 de l'utilisateur distant |
| **Syntaxe** | `IdentityCheck On\|Off` |
| **Valeur par défaut** | `IdentityCheck Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ident\|mod_ident]] |
| **Compatibilité** | Retiré du serveur de base depuis Apache 2.1 |

## Utilisation

Cette directive permet d'activer la journalisation compatible [RFC 1413](https://www.rfc-editor.org/rfc/rfc1413) du nom de l'utilisateur distant pour chaque connexion, si la machine du client exécute identd ou un démon similaire. Cette information est enregistrée dans le journal des accès en utilisant la [[12-modules/mod_log_config|chaîne de formatage]] `%...l`.

> [!NOTE]
> Cette information ne doit pas faire l'objet d'une confiance absolue, et elle ne doit être utilisée que dans le cadre d'un traçage grossier.

Notez que de sérieux problèmes de délais peuvent survenir lors des accès à votre serveur, car chaque requête nécessite l'exécution d'un de ces processus de recherche. Lorsque des pare-feu ou des serveurs mandataires sont impliqués, chaque recherche est susceptible d'échouer et ajouter un temps de latence conformément à la directive [[13-directives/identitychecktimeout|IdentityCheckTimeout]]. En général, ces recherches ne se révèlent donc pas très utiles sur des serveurs publics accessibles depuis l'Internet.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
