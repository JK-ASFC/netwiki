---
title: "BufferedLogs"
description: "Directive Apache BufferedLogs (mod_log_config) — Enregistre les entrées du journal dans un tampon en mémoire avant de les écrire sur disque. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_log_config]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Enregistre les entrées du journal dans un tampon en mémoire avant de les écrire sur disque |
| **Syntaxe** | `BufferedLogs On\|Off` |
| **Valeur par défaut** | `BufferedLogs Off` |
| **Contexte** | configuration du serveur |
| **Statut** | Base |
| **Module** | [[12-modules/mod_log_config\|mod_log_config]] |

## Utilisation

Lorsque la directive `BufferedLogs` est à "on", [[12-modules/mod_log_config|mod_log_config]] stocke de nombreuses entrées du journal en mémoire, et les écrit d'un seul bloc sur disque, plutôt que de les écrire après chaque requête. Sur certains systèmes, ceci peut améliorer l'efficacité des accès disque, et par conséquent les performances. La directive ne peut être définie qu'une seule fois pour l'ensemble du serveur ; elle ne peut pas être définie au niveau d'un serveur virtuel.

> [!NOTE]
> Cette directive doit être utilisée avec précautions car un crash peut provoquer la perte de données de journalisation.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
