---
title: "SSLOCSPResponderCertificateFile"
description: "Directive Apache SSLOCSPResponderCertificateFile (mod_ssl) — Fournit un jeu de certificats de confiance du répondeur OCSP avec encodage PEM. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fournit un jeu de certificats de confiance du répondeur OCSP avec encodage PEM |
| **Syntaxe** | `SSLOCSPResponderCertificateFile file` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible à partir de la version 2.4.26 du serveur HTTP Apache, sous réserve d'utiliser une version 0.9.7 ou supérieure d'OpenSSL |

## Utilisation

Cette directive permet de définir un fichier contenant une liste de certificats de confiance du répondeur OCSP à utiliser au cours de la validation du certificat du répondeur OCSP. Les certificats fournis peuvent être considérés comme de confiance sans avoir à effectuer de vérifications supplémentaires. Ce processus de validation du certificat du répondeur OCSP intervient en général lorsque ce dernier est autosigné ou tout simplement absent de la réponse OCSP.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
