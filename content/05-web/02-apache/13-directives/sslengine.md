---
title: "SSLEngine"
description: "Directive Apache SSLEngine (mod_ssl) — Interrupteur marche/arrêt du moteur SSL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Interrupteur marche/arrêt du moteur SSL |
| **Syntaxe** | `SSLEngine on\|off` |
| **Valeur par défaut** | `SSLEngine off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | La prise en charge de l'argument "optional" a été supprimée avec la version 2.4.64. Cet argument activait la prise en charge de la RFC 2817 (mise à niveau de TLS). |

## Utilisation

Cette directive permet d'activer/désactiver le moteur du protocole SSL/TLS. Elle doit être utilisée dans une section [[13-directives/virtualhost|<VirtualHost>]] pour activer SSL/TLS pour ce serveur virtuel particulier. Par défaut, le moteur du protocole SSL/TLS est désactivé pour le serveur principal et tous les serveurs virtuels configurés.

**Exemple**

```apache
<VirtualHost _default_:443>
SSLEngine on
#...
</VirtualHost>
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
