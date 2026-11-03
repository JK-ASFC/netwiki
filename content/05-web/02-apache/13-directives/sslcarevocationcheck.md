---
title: "SSLCARevocationCheck"
description: "Directive Apache SSLCARevocationCheck (mod_ssl) — Active la vérification des révocations basée sur les CRL. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active la vérification des révocations basée sur les CRL |
| **Syntaxe** | `SSLCARevocationCheck chain\|leaf\|none [flags ...]` |
| **Valeur par défaut** | `SSLCARevocationCheck none` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Le drapeau optionnel *flag*s est disponible à partir de la version 2.4.21 du serveur HTTP Apache |

## Utilisation

Active la vérification des révocations basée sur les Listes de Révocations de Certificats (CRL). Au moins une des directives [[13-directives/sslcarevocationfile|SSLCARevocationFile]] ou [[13-directives/sslcarevocationpath|SSLCARevocationPath]] doit être définie. Lorsque cette directive est définie à `chain` (valeur recommandée), les vérifications CRL sont effectuées sur tous les certificats de la chaîne, alors que la valeur `leaf` limite la vérification au certificat hors chaîne (la feuille).

*flag*s peut prendre comme valeurs

- `no_crl_for_cert_ok`

  Avant la version 2.3.15, les vérifications CRL dans mod\_ssl réussissaient même si aucune CRL n'était trouvée dans les chemins définis par les directives [[13-directives/sslcarevocationfile|SSLCARevocationFile]] ou [[13-directives/sslcarevocationpath|SSLCARevocationPath]].

  Le comportement a changé avec l'introduction de la directive `SSLCARevocationFile` : par défaut avec `chain` ou `leaf`, les CRLs *doivent* être présentes pour que la validation réussisse ; dans le cas contraire, elle échouera avec une erreur `"unable to get certificate CRL"`.

  La valeur `no_crl_for_cert_ok` du drapeau *flag* permet de retrouver le comportement précédent.

**Exemple**

```apache
SSLCARevocationCheck chain
```

**Compatibilité avec la branche 2.2**

```apache
SSLCARevocationCheck chain no_crl_for_cert_ok
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
