---
title: "ProxyVia"
description: "Directive Apache ProxyVia (mod_proxy) — Information fournie dans l'en-tête de réponse HTTP Via pour les requêtes mandatées. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Information fournie dans l'en-tête de réponse HTTP `Via` pour les requêtes mandatées |
| **Syntaxe** | `ProxyVia On\|Off\|Full\|Block` |
| **Valeur par défaut** | `ProxyVia Off` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy\|mod_proxy]] |

## Utilisation

Cette directive permet de contrôler l'utilisation de l'en-tête HTTP `Via:` par le mandataire. Le but recherché est de contrôler le flux des requêtes mandatées tout au long d'une chaîne de serveurs mandataires. Voir la [RFC 2616](https://www.rfc-editor.org/rfc/rfc2616) (HTTP/1.1), section 14.45 pour une description des lignes d'en-tête `Via:`.

- Si elle est définie à `Off`, valeur par défaut, cette directive n'effectue aucun traitement particulier. Si une requête ou une réponse contient un en-tête `Via:`, il est transmis sans modification.
- Si elle est définie à `On`, chaque requête ou réponse se verra ajouter une ligne d'en-tête `Via:` pour le serveur courant.
- Si elle est définie à `Full`, chaque ligne d'en-tête `Via:` se verra ajouter la version du serveur Apache httpd sous la forme d'un champ de commentaire `Via:`.
- Si elle est définie à `Block`, chaque requête mandatée verra ses lignes d'en-tête `Via:` supprimées. Aucun nouvel en-tête `Via:` ne sera généré.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
