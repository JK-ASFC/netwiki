---
title: "MDCertificateStatus"
description: "Directive Apache MDCertificateStatus (mod_md) — Extrait les informations publiques du certificat au format JSON. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Extrait les informations publiques du certificat au format JSON. |
| **Syntaxe** | `MDCertificateStatus on\|off` |
| **Valeur par défaut** | `MDCertificateStatus on` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Lorsque cette directive est à "on", vous disposez d'une ressource pour les domaines gérés à https://domain/.httpd/certificate-status qui renvoie un document au format JSON contenant une liste de propriétés concernant les clés, le certificat courant et, s'il est disponible, le certificat renouvelé.

**Exemple**

```apache
{
  "valid-until": "Thu, 29 Aug 2019 16:06:35 GMT",
  "valid-from": "Fri, 31 May 2019 16:06:35 GMT",
  "serial": "03039C464D454EDE79FCD2CAE859F668F269",
  "sha256-fingerprint": "1ff3bfd2c7c199489ed04df6e29a9b4ea6c015fe8a1b0ce3deb88afc751e352d"
  "renewal" : { ...renewed cert information... }
}
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
