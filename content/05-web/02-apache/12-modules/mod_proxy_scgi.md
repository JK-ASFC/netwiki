---
title: "mod_proxy_scgi"
description: "Module Apache mod_proxy_scgi — Module fournissant le support de la passerelle SCGI à mod_proxy. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_proxy_scgi]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Module fournissant le support de la passerelle SCGI à mod\_proxy |
| **Statut** | Extension |
| **Identificateur** | `proxy_scgi_module` |
| **Fichier source** | `mod_proxy_scgi.c` |
| **Compatibilité** | Disponible depuis la version 2.2.14 d'Apache |

## Sommaire

Pour pouvoir fonctionner, ce module *requiert* le chargement de [[12-modules/mod_proxy|mod_proxy]]. Il fournit le support du [protocole SCGI, version 1](http://python.ca/scgi/protocol.txt).

Ainsi, pour être en mesure de traiter le protocole SCGI, [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_scgi|mod_proxy_scgi]] doivent être chargés dans le serveur.

> [!WARNING]
> **Avertissement**
>
> N'activez pas la fonctionnalité de mandataire avant d'avoir [[12-modules/mod_proxy|sécurisé votre serveur]]. Les serveurs mandataires ouverts sont dangereux non seulement pour votre réseau, mais aussi pour l'Internet au sens large.

## Exemples

Rappelez-vous, pour que les exemples suivants puissent fonctionner, vous devez activer [[12-modules/mod_proxy|mod_proxy]] et [[12-modules/mod_proxy_scgi|mod_proxy_scgi]].

**Passerelle simple**

```apache
ProxyPass "/scgi-bin/" "scgi://localhost:4000/"
```

La passerelle à répartition de charge nécessite le chargement du module [[12-modules/mod_proxy_balancer|mod_proxy_balancer]] et d'au moins un module fournissant un algorithme de répartition de charge, comme [[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]] en plus des modules déjà cités. [[12-modules/mod_lbmethod_byrequests|mod_lbmethod_byrequests]] est le module par défaut et sera utilisé dans cet exemple de configuration.

**Passerelle à répartition de charge**

```apache
ProxyPass "/scgi-bin/" "balancer://somecluster/"
<Proxy "balancer://somecluster">
    BalancerMember "scgi://localhost:4000"
    BalancerMember "scgi://localhost:4001"
</Proxy>
```

## Variables d'environnement

En plus des directives de configuration qui permettent de contrôler le comportement de [[12-modules/mod_proxy|mod_proxy]], une *variable d'environnement* peut aussi contrôler le fournisseur de protocole SCGI :

**proxy-scgi-pathinfo**

Par défaut, [[12-modules/mod_proxy_scgi|mod_proxy_scgi]] ne créera ni exportera jamais la variable d'environnement *PATH\_INFO*. Ceci permet au serveur SCGI d'arrière-plan de déterminer correctement *SCRIPT\_NAME* et *Script-URI*, et de rester en conformité avec la section 3.3 de la RFC 3875. Si au contraire vous souhaitez que [[12-modules/mod_proxy_scgi|mod_proxy_scgi]] génère une estimation la plus précise possible de *PATH\_INFO*, définissez cette variable d'environnement. La variable doit être définie avant que la directive [[13-directives/setenv|SetEnv]] ne soit effective. Il est possible d'utiliser à la place la directive [[13-directives/setenvif|SetEnvIf]] : `SetEnvIf Request_URI . proxy-scgi-pathinfo`

## Directives

- [[13-directives/proxyscgisendfile|ProxySCGISendfile]]
- [[13-directives/proxyscgiinternalredirect|ProxySCGIInternalRedirect]]

## Voir aussi

- [[12-modules/mod_proxy|mod_proxy]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
