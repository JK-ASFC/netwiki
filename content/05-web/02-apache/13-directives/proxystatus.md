---
title: "ProxyStatus"
description: "Directive Apache ProxyStatus (mod_proxy) — Affiche l'état du répartiteur de charge du mandataire dans mod_status. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Affiche l'état du répartiteur de charge du mandataire dans mod\_status |
| **Syntaxe** | `ProxyStatus Off\|On\|Full` |
| **Valeur par défaut** | `ProxyStatus Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |
| **Compatibilité** | Disponible depuis la version 2.2 d'Apache |

## Utilisation

Cette directive permet de spécifier si les données d'état du répartiteur de charge du mandataire doivent être affichées via la page d'état du serveur du module [[12-modules/mod_status|mod_status]].

> [!NOTE]
> **Note**
>
> L'argument **Full** produit le même effet que l'argument **On**.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
