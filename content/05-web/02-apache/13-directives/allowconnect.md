---
title: "AllowCONNECT"
description: "Directive Apache AllowCONNECT (mod_proxy_connect) — Ports autorisés à se CONNECTer à travers le mandataire. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_connect]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Ports autorisés à se `CONNECT`er à travers le mandataire |
| **Syntaxe** | `AllowCONNECT port[-port] [port[-port]] ...` |
| **Valeur par défaut** | `AllowCONNECT 443 563` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_connect\|mod_proxy_connect]] |
| **Compatibilité** | Déplacé depuis [[12-modules/mod_proxy\|mod_proxy]] à partir d'Apache 2.3.5. Plages de ports disponibles depuis Apache 2.3.7. |

## Utilisation

La directive `AllowCONNECT` permet de spécifier une liste de numéros ou de plages de ports auxquels la méthode de mandataire `CONNECT` pourra se connecter. Les navigateurs récents utilisent cette méthode dans le cas où une connexion `https` est requise et où le tunneling mandataire sur HTTP est en service.

Par défaut, seuls les ports par défauts https (`443`) et snews (`563`) sont pris en compte. Vous pouvez utiliser la directive `AllowCONNECT` pour outrepasser ces valeurs par défaut et n'autoriser les connexions que vers les ports spécifiés.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
