---
title: "SendBufferSize"
description: "Directive Apache SendBufferSize (mpm_common) — Taille du tampon TCP en sortie. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mpm_common]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Taille du tampon TCP en sortie |
| **Syntaxe** | `SendBufferSize octets` |
| **Valeur par défaut** | `SendBufferSize 0` |
| **Contexte** | configuration du serveur |
| **Statut** | MPM |
| **Module** | [[12-modules/mpm_common\|mpm_common]] |

## Utilisation

Définit la taille du tampon TCP en sortie avec le nombre d'octets spécifié. Ceci s'avère souvent très utile pour augmenter les valeurs par défaut standards du passé des systèmes d'exploitation pour les transmissions à grande vitesse et haute densité (*c'est à dire* de l'ordre de 100ms comme sur les liaisons rapides transcontinentales).

Si la directive est définie à `0`, le serveur va utiliser la valeur par défaut adoptée par le système d'exploitation. Sinon, elle doit être supérieure ou égale à `512`.

L'amélioration des performances des connexions à grande vitesse et à temps de latence élevé, peut nécessiter une intervention au niveau de la configuration de votre système d'exploitation.

> [!NOTE]
> Sous certains systèmes d'exploitation, la modification du comportement TCP via une augmentation de la valeur de `SendBufferSize` risque de ne pas être perceptible, si la directive [[13-directives/enablesendfile|EnableSendfile]] n'est pas définie à OFF. Cette interaction ne s'applique qu'aux fichiers statiques.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
