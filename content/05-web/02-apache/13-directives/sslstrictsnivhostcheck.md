---
title: "SSLStrictSNIVHostCheck"
description: "Directive Apache SSLStrictSNIVHostCheck (mod_ssl) — Contrôle de l'accès des clients non-SNI à un serveur virtuel à base de nom. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Contrôle de l'accès des clients non-SNI à un serveur virtuel à base de nom. |
| **Syntaxe** | `SSLStrictSNIVHostCheck on\|off` |
| **Valeur par défaut** | `SSLStrictSNIVHostCheck off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible depuis la version 2.2.12 d'Apache |

## Utilisation

Cette directive permet de contrôler l'accès des clients non-SNI à un serveur virtuel à base de nom. Si elle est définie à `on` dans le serveur virtuel à base de nom par défaut, les clients non-SNI ne seront autorisés à accéder à aucun serveur virtuel appartenant à cette combinaison IP/port. Par contre, si elle est définie à `on` dans un serveur virtuel quelconque, les clients non-SNI ne se verront interdire l'accès qu'à ce serveur.

Si cette directive est à `on` dans un contexte de serveur (globalement, en dehors de tout bloc [[13-directives/virtualhost|<VirtualHost>]]), tous les serveurs virtuels qui ne l'outrepassent pas héritent de la configuration. Cela a le même effet que la définir à `on` dans tous les serveurs virtuels par défaut à base de nom : les clients non-SNI se verront refuser l'accès à tout serveur virtuel à base de nom.

> [!WARNING]
> Cette option n'est disponible que si httpd a été compilé avec une version d'OpenSSL supportant SNI.

**Exemple**

```apache
SSLStrictSNIVHostCheck on
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
