---
title: "ProxyHCExpr"
description: "Directive Apache ProxyHCExpr (mod_proxy_hcheck) — Crée et nomme une expression conditionnelle à utiliser pour déterminer la santé d'un serveur d'arrière-plan en fonction de sa valeur. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_hcheck]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Crée et nomme une expression conditionnelle à utiliser pour déterminer la santé d'un serveur d'arrière-plan en fonction de sa valeur |
| **Syntaxe** | `ProxyHCExpr name {ap_expr expression}` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_hcheck\|mod_proxy_hcheck]] |

## Utilisation

La directive `ProxyHCExpr` permet de créer et nommer une expression conditionnelle dont la valeur calculée en fonction des en-têtes de la réponse du serveur d'arrière-plan permettra d'évaluer la santé de ce dernier. Cette expression nommée peut alors être assignée aux serveurs d'arrière-plan via le paramètre `hcexpr`.

**ProxyHCExpr: interprète les réponses 2xx/3xx/4xx comme des check up réussis**

```apache
ProxyHCExpr ok234 {%{REQUEST_STATUS} =~ /^[234]/}
ProxyPass "/apps"     "balancer://foo"

<Proxy balancer://foo>
  BalancerMember http://www2.example.com/  hcmethod=HEAD hcexpr=ok234 hcinterval=10
</Proxy>
```

> [!NOTE]
> L'[[11-guides/01-generalites/les-expressions-dans-le-serveur-http-apache|expression]] peut utiliser des accolades ("{}") comme délimiteurs en plus des guillemets normaux.

Si l'on utilise une méthode de check up (par exemple `GET`) qui génère un corps de réponse, ce corps peut lui-même être ausculté via `ap_expr` en utilisant la fonction associée aux expressions `hc()` spécifique à ce module.

Dans l'exemple suivant, on envoie une requête `GET` au serveur d'arrière-plan, et si le corps de la réponse contient la chaîne *Under maintenance*, ce serveur d'arrière-plan est mis hors service.

**ProxyHCExpr: auscultation du corps de la réponse**

```apache
ProxyHCExpr in_maint {hc('body') !~ /Under maintenance/}
ProxyPass "/apps"     "balancer://foo"

<Proxy balancer://foo>
  BalancerMember http://www.example.com/ hcexpr=in_maint hcmethod=get hcuri=/status.php
</Proxy>
```

*NOTE:* Comme le corps de la réponse peut être assez grand, il est recommandé de privilégier un check up basé sur les codes d'état.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
