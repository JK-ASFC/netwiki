---
title: "MDCertificateAuthority"
description: "Directive Apache MDCertificateAuthority (mod_md) — Les URLs du service ACME de l'autorité de certification. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Les URLs du service ACME de l'autorité de certification. |
| **Syntaxe** | `MDCertificateAuthority url` |
| **Valeur par défaut** | `MDCertificateAuthority letsencrypt` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Les URLs auxquelles l'autorité de certication offre son service. Plutôt que l'URL proprement dite, vous pouvez spécifier 'letsencrypt' ou 'buypass'.

Si vous spécifiez plusieurs URLs, chacune d'entre elles est testée en mode tourniquet ("round-robin") après un certain nombre d'échecs. Vous pouvez définir la rapidité de ce processus à l'aide des directives [[13-directives/mdretrydelay|MDRetryDelay]] et [[13-directives/mdretryfailover|MDRetryFailover]]. Par défaut, une demie journée d'essais infructueux est considérée comme un échec.

Tous les autres réglages s'appliquent à chacune de ces URLs. Il est ainsi par exemple impossible d'en avoir deux avec des directives [[13-directives/mdexternalaccountbinding|MDExternalAccountBinding]] différentes.

A des fins de test, les CAs fournissent en général une seconde URL de service. Le service 'test' ne fournit pas de certificat valable pour un navigateur, mais il est moins regardant vis à vis des limites de vitesse. Il permet de tester votre configuration avant de passer à l'URL de service de production.

**Configuration pour le mode test de Let's Encrypt**

```apache
MDCertificateAuthority https://acme-staging-v02.api.letsencrypt.org/directory
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
