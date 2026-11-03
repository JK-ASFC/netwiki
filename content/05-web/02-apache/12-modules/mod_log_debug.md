---
title: "mod_log_debug"
description: "Module Apache mod_log_debug — Journalisation supplémentaire à des fins de débogage. Statut, identifiant, fichier source, fonctionnement et liste des directives."
tags: [apache, module, mod_log_debug]
icon: puzzle
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Journalisation supplémentaire à des fins de débogage |
| **Statut** | Expérimental |
| **Identificateur** | `log_debug_module` |
| **Fichier source** | `mod_log_debug.c` |
| **Compatibilité** | Disponible depuis la version 2.3.14 d'Apache |

## Exemples

1. Enregistre un message après le traitement d'une requête pour /foo/\* :

   ```apache
   <Location "/foo/">
     LogMessage "/foo/ has been requested"
   </Location>
   ```
2. Enregistre un message si une requête pour /foo/\* est traitée dans une sous-requête :

   ```apache
   <Location "/foo/">
     LogMessage "subrequest to /foo/" hook=type_checker "expr=-T %{IS_SUBREQ}"
   </Location>
   ```

   Le branchement (hook) par défaut log\_transaction n'est pas exécuté pour les sous-requêtes ; nous devons donc en utiliser un autre.
3. Enregistre un message si un client IPv6 est à l'origine d'un dépassement de délai pour une requête :

   ```apache
   LogMessage "IPv6 timeout from %{REMOTE_ADDR}" "expr=-T %{IPV6} && %{REQUEST_STATUS} = 408"
   ```

   Notez l'emplacement des guillemets pour l'argument `expr=`.
4. Enregistre la valeur de la variable d'environnement de requête "X-Foo" à chaque étape du traitement :

   ```apache
   <Location "/">
     LogMessage "%{reqenv:X-Foo}" hook=all
   </Location>
   ```

   En association avec les repères de temps en microsecondes du journal des erreurs, `hook=all` permet aussi de déterminer la durée d'exécution des différentes phases du traitement de la requête.

## Directives

- [[13-directives/logmessage|LogMessage]]

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
