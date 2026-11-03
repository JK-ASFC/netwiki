---
title: "NWSSLTrustedCerts"
description: "Directive Apache NWSSLTrustedCerts (mod_nw_ssl) — Liste de certificats clients supplémentaires. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_nw_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Liste de certificats clients supplémentaires |
| **Syntaxe** | `NWSSLTrustedCerts nom-fichier [nom-fichier] ...` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_nw_ssl\|mod_nw_ssl]] |

## Utilisation

Cette directive permet de spécifier une liste de fichiers (au format DER) contenant des certificats clients utilisés lors de l'établissement d'une connexion SSL mandatée. Chaque certificat client utilisé par un serveur doit être enregistré séparément dans son propre fichier `.der`.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
