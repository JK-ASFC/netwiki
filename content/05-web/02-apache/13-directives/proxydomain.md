---
title: "ProxyDomain"
description: "Directive Apache ProxyDomain (mod_proxy) — Nom de domaine par défaut pour les requêtes mandatées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Nom de domaine par défaut pour les requêtes mandatées |
| **Syntaxe** | `ProxyDomain Domaine` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

Cette directive n'a d'utilité que pour les serveurs mandataires Apache httpd au sein d'un Intranet. La directive `ProxyDomain` permet de spécifier le domaine par défaut auquel le serveur mandataire apache appartient. Si le serveur reçoit une requête pour un hôte sans nom de domaine, il va générer une réponse de redirection vers le même hôte suffixé par le *Domaine* spécifié. Le nom du domaine doit commencer par un point.

**Exemple**

```apache
ProxyRemote  "*"  "http://firewall.example.com:81"
NoProxy         ".example.com" "192.168.112.0/21"
ProxyDomain     ".example.com"
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
