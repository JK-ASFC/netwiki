---
title: "MDCACertificateFile"
description: "Directive Apache MDCACertificateFile (mod_md) — Fichier contenant des certificats de confiance x509 pour vérifier les serveurs ACME. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Fichier contenant des certificats de confiance x509 pour vérifier les serveurs ACME. |
| **Syntaxe** | `MDCACertificateFile file` |
| **Valeur par défaut** | `MDCACertificateFile none` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Depuis la version 2.4.69, cette directive peut être définie séparément pour chaque MDomain. |

## Utilisation

Cette directive est principalement utilisée dans les configurations de test où le module doit se connecter à un serveur ACME de test qui possède son propre certificat racine. Les administrateurs qui possèdent une autorité de certification interne propre à une entreprise peuvent utiliser cette directive lorsqu'ils utilisent leurs propres serveurs ACME.

Définissez cette directive à « none » pour la désactiver explicitement.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
