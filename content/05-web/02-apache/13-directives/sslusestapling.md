---
title: "SSLUseStapling"
description: "Directive Apache SSLUseStapling (mod_ssl) — Active l'ajout des réponses OCSP à la négociation TLS. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active l'ajout des réponses OCSP à la négociation TLS |
| **Syntaxe** | `SSLUseStapling on\|off` |
| **Valeur par défaut** | `SSLUseStapling off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible si on utilise OpenSSL version 0.9.8h ou supérieure |

## Utilisation

Cette directive permet d'activer l'"Agrafage OCSP" (OCSP stapling) selon la définition de l'extension TLS "Certificate Status Request" fournie dans la RFC 6066. Si elle est activée et si le client le demande, mod\_ssl va inclure une réponse OCSP à propos de son propre certificat dans la négociation TLS. Pour pouvoir activer l'Agrafage OCSP, il est nécessaire de configurer un [[13-directives/sslstaplingcache|SSLStaplingCache]].

L'agrafage OCSP dispense le client de requérir le serveur OCSP directement ; il faut cependant noter que selon les spécifications de la RFC 6066, la réponse `CertificateStatus` du serveur ne peut inclure une réponse OCSP que pour un seul certificat. Pour les certificats de serveur comportant des certificats de CA intermédiaires dans leur chaîne (c'est un cas typique de nos jours), l'implémentation actuelle de l'agrafage OCSP n'atteint que partiellement l'objectif d' "économie en questions/réponse et en ressources". Pour plus de détails, voir la [RFC 6961](https://www.rfc-editor.org/rfc/rfc6961) (TLS Multiple Certificate Status Extension).

Lorsque l'agrafage OCSP est activé, le mutex `ssl-stapling` contrôle l'accès au cache de l'agrafage OCSP afin de prévenir toute corruption, et le mutex `sss-stapling-refresh` contrôle le raffraîchissement des réponses OCSP. Ces mutex peuvent être configurés via la directive [[13-directives/mutex|Mutex]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
