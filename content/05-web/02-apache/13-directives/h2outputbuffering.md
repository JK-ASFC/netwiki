---
title: "H2OutputBuffering"
description: "Directive Apache H2OutputBuffering (mod_http2) — Contrôle la mise en tampon du flux de sortie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_http2]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle la mise en tampon du flux de sortie |
| **Syntaxe** | `H2OutputBuffering on\|off` |
| **Valeur par défaut** | `H2OutputBuffering on` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_http2\|mod_http2]] |
| **Compatibilité** | Disponible à partir de la version 2.4.48 du serveur HTTP Apache. |

## Utilisation

La directive `H2OutputBuffering` permet de contrôler la mise en tampon du flux de sortie. La valeur par défaut est on, ce qui correspond au comportement des versions précédentes. Lorsqu'elle est à off, chaque octet est immédiatement disponible pour envoi au client via la connexion principale. Ceci permet de résoudre les problèmes d'inter-opérations avec certaines versions de gRPC.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
