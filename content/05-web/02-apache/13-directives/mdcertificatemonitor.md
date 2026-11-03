---
title: "MDCertificateMonitor"
description: "Directive Apache MDCertificateMonitor (mod_md) — L'URL d'un moniteur d'enregistrement de certificat. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | L'URL d'un moniteur d'enregistrement de certificat. |
| **Syntaxe** | `MDCertificateMonitor name url` |
| **Valeur par défaut** | `MDCertificateMonitor crt.sh https://crt.sh?q=` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive impacte l'interface utilisateur HTML « `server-status` » et n'a rien à voir avec le fonctionnement de mod\_md proprement dit. Elle permet de définir le lien qui s'affiche sur cette interface pour accéder facilement à un moniteur de certificat. L'empreinte SHA256 du certificat doit être ajoutée à l'URL spécifié.

Les moniteurs de certificat donnent accès aux enregistrements de la Certificate Transparency (CT) afin de tracer l'utilisation des certificats pour les domaines. Vous pourrez au moins vérifier si Let's Encrypt (ou tout autre CA que vous aurez défini) a bien inscrit votre certificat dans les enregistrements de CT.

Avertissement : La mise à jour des enregistrements des certificats et leur prise en compte par les moniteurs peut prendre un certain temps. Ce dernier varie en fonction des enregistreurs et des moniteurs. Un nouveau certificat ne sera donc pas connu immédiatement.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
