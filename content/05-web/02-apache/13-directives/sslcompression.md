---
title: "SSLCompression"
description: "Directive Apache SSLCompression (mod_ssl) — Permet d'activer la compression au niveau SSL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Permet d'activer la compression au niveau SSL |
| **Syntaxe** | `SSLCompression on\|off` |
| **Valeur par défaut** | `SSLCompression off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible à partir de la version 2.4.3 du serveur HTTP Apache, si on utilise une version d'OpenSSL 0.9.8 ou supérieure ; l'utilisation dans un contexte de serveur virtuel n'est disponible que si on utilise une version d'OpenSSL 1.0.0 ou supérieure. La valeur par défaut était `on` dans la version 2.4.3. |

## Utilisation

Cette directive permet d'activer la compression au niveau SSL.

> [!WARNING]
> L'activation de la compression est à l'origine de problèmes de sécurité dans la plupart des configurations (l'attaque nommée CRIME).

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
