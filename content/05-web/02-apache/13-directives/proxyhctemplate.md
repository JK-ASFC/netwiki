---
title: "ProxyHCTemplate"
description: "Directive Apache ProxyHCTemplate (mod_proxy_hcheck) — Crée et nomme un modèle permettant de définir différents paramètres de check up. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_hcheck]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Crée et nomme un modèle permettant de définir différents paramètres de check up |
| **Syntaxe** | `ProxyHCTemplate name parameter=setting [...]` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_hcheck\|mod_proxy_hcheck]] |

## Utilisation

La directive `ProxyHCTemplate` permet de créer et nommer un modèle de paramètres de check up qui peut alors être assigné aux équipiers via le paramètre `hctemplate`.

**ProxyHCTemplate**

```apache
ProxyHCTemplate tcp5 hcmethod=tcp hcinterval=5
ProxyPass "/apps"     "balancer://foo"

<Proxy balancer://foo>
  BalancerMember http://www2.example.com/ hctemplate=tcp5
</Proxy>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
