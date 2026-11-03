---
title: "SSLProxyEngine"
description: "Directive Apache SSLProxyEngine (mod_ssl) — Interrupteur marche/arrêt du moteur de mandataire SSL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Interrupteur marche/arrêt du moteur de mandataire SSL |
| **Syntaxe** | `SSLProxyEngine on\|off` |
| **Valeur par défaut** | `SSLProxyEngine off` |
| **Contexte** | configuration du serveur, serveur virtuel, proxy section |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le contexte d'une section proxy est supporté à partir de la version 2.4.30 du serveur HTTP Apache |

## Utilisation

Cette directive permet d'activer/désactiver l'utilisation du moteur de protocole SSL/TLS pour le mandataire. On l'utilise en général à l'intérieur d'une section [[13-directives/virtualhost|<VirtualHost>]] pour activer le protocole SSL/TLS dans le cadre d'un mandataire pour un serveur virtuel particulier. Par défaut, le moteur de protocole SSL/TLS est désactivé pour la fonction de mandataire du serveur principal et de tous les serveurs virtuels configurés.

Notez que la directive `SSLProxyEngine` ne doit généralement pas être utilisée dans le cadre d'un serveur virtuel qui agit en tant que mandataire direct (via les directives [[13-directives/proxy|<Proxy>]] ou [[13-directives/proxyrequests|ProxyRequests]]). `SSLProxyEngine` n'est pas nécessaire pour activer un serveur mandataire direct pour les requêtes SSL/TLS.

**Exemple**

```apache
<VirtualHost _default_:443>
    SSLProxyEngine on
    #...
</VirtualHost>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
