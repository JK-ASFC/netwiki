---
title: "MDStoreLocks"
description: "Directive Apache MDStoreLocks (mod_md) — Configure le verrouillage du magasin pour les mises à jour. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Configure le verrouillage du magasin pour les mises à jour |
| **Syntaxe** | `MDStoreLocks on\|off\|duration` |
| **Valeur par défaut** | `MDStoreLocks off` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |
| **Compatibilité** | Disponible à partir de la version 2.4.55 du serveur HTTP Apache |

## Utilisation

Définissez cette directive pour utiliser un fichier verrou au démarrage du serveur lorsque [[13-directives/mdstoredir|MDStoreDir]] est synchronisé avec la configuration du serveur et si les certificats renouvelés sont activés.

Le verrouillage a été implémenté pour les configurations de cluster où [[13-directives/mdstoredir|MDStoreDir]] appartient à un système de fichiers partagé. L'activation des certificats renouvelés sera alors protégée lorsque plusieurs noeuds du cluster sont redémarrés ou reconfigurés simultanément ; ceci à condition bien entendu que le système de fichiers partagé prenne en charge le verrouillage de fichier.

Le temps d'attente par défaut pour obtenir le verrou est de 5 secondes. Si le verrou ne peut pas être obtenu, une erreur est enregistrée dans le journal et le démarrage du serveur se poursuit ; de ce fait, un des noeuds du cluster pourra encore utiliser les anciens certificats par la suite.

Un délai d'attente plus long réduira cette probabilité, mais pourra aussi retarder les redémarrages et reconfigurations du serveur dans le cas où les verrous ne sont pas correctement gérés dans le système de fichiers sous-jacent. Un verrou ne doit être maintenu par une instance de httpd que pendant une courte durée.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
