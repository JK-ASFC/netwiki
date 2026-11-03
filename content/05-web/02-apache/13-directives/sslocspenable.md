---
title: "SSLOCSPEnable"
description: "Directive Apache SSLOCSPEnable (mod_ssl) — Active la validation OCSP de la chaîne de certificats du client. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la validation OCSP de la chaîne de certificats du client |
| **Syntaxe** | `SSLOCSPEnable on\|leaf\|off [flags]` |
| **Valeur par défaut** | `SSLOCSPEnable off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le mode *leaf* est disponible à partir de la version 2.4.34 du serveur HTTP Apache. Le drapeau *no\_ocsp\_for\_cert\_ok* est disponible à partir de la version 2.4.29 du serveur HTTP Apache. |

## Utilisation

Cette directive permet d'activer la validation OCSP de la chaîne de certificats du client. Si elle est activée, les certificats de la chaîne de certificats du client seront validés auprès d'un répondeur OCSP, une fois la vérification normale effectuée (vérification des CRLs incluse). En mode 'leaf', seul le certificat du client sera validé.

Le répondeur OCSP utilisé est soit extrait du certificat lui-même, soit spécifié dans la configuration ; voir les directives [[13-directives/sslocspdefaultresponder|SSLOCSPDefaultResponder]] et [[13-directives/sslocspoverrideresponder|SSLOCSPOverrideResponder]].

Les drapeaux facultatifs suivants sont disponibles :

- `no_ocsp_for_cert_ok`

  Normalement, Si la validation OCSP est activée, un certificat qui ne contient pas d'URL de réponse OCSP provoquera un échec de validation. Ajouter ce drapeau permet à un tel certificat de passer la validation. Cela s'avère utile dans les environnements où certains certificats de la chaîne ne contiennent pas d'information de réponse OCSP.

**Exemple**

```apache
SSLVerifyClient on
SSLOCSPEnable on
SSLOCSPDefaultResponder "http://responder.example.com:8888/responder"
SSLOCSPOverrideResponder on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
