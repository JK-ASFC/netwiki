---
title: "mod_proxy_uwsgi"
description: "Module Apache mod_proxy_uwsgi — Module de passerelle UWSGI pour mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_uwsgi]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module de passerelle UWSGI pour mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_uwsgi_module` |
| **Fichier source** | `mod_proxy_uwsgi.c` |
| **Compatibilité** | Disponible à partir de la version 2.4.30 du serveur HTTP Apache. |

## Sommaire

Pour pouvoir fonctionner, ce module requiert le chargement préalable de [[12-modules/mod_proxy|mod_proxy]]. Il fournit le support du [protocole UWSGI](http://uwsgi-docs.readthedocs.io/en/latest/index.html).

Pour être en mesure de gérer le protocole UWSGI, le serveur doit donc pouvoir disposer des modules [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_uwsgi|mod_proxy_uwsgi]].

> [!WARNING]
> **Avertissement**
>
> N'activez le mandatement que si vous avez [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux pour votre réseau, mais aussi pour Internet en général.

## Exemples

Il est rappelé que vous devez charger les modules [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_uwsgi|mod_proxy_uwsgi]] pour que les exemples suivants fonctionnent.

**Passerelle simple**

```apache
ProxyPass "/uwsgi-bin/" "uwsgi://localhost:4000/"
```

La passerelle à répartition de charge nécessite [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] et au moins un module implémentant un algorithme de répartition de charge comme [[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]], en plus des modules de mandatement listés ci-dessus. Par défaut, c'est [[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]] qui sera utilisé, et c'est donc ce dernier qui sera utilisé dans l'exemple suivant :

**Passerelle à répartition de charge**

```apache
ProxyPass "/uwsgi-bin/" "balancer://somecluster/"
<Proxy balancer://somecluster>
    BalancerMember uwsgi://localhost:4000
    BalancerMember uwsgi://localhost:4001
</Proxy>
```

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
