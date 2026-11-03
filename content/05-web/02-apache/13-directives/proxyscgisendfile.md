---
title: "ProxySCGISendfile"
description: "Directive Apache ProxySCGISendfile (mod_proxy_scgi) — Active l'évaluation du pseudo en-tête de réponse X-Sendfile. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_proxy_scgi]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Active l'évaluation du pseudo en-tête de réponse *X-Sendfile* |
| **Syntaxe** | `ProxySCGISendfile On\|Off\|nom-en-tête` |
| **Valeur par défaut** | `ProxySCGISendfile Off` |
| **Contexte** | configuration du serveur, serveur virtuel, répertoire |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_proxy_scgi\|mod_proxy_scgi]] |

## Utilisation

La directive `ProxySCGISendfile` permet au serveur cible SCGI de faire servir les fichiers directement par la passerelle. Ceci s'avère bénéfique en matière de performances — httpd peut alors utiliser `sendfile` ou d'autres optimisations, ce qui n'est pas possible si les fichiers passent par la socket du serveur cible. En outre, les fichiers ne sont transmis qu'une seule fois.

L'argument de la directive `ProxySCGISendfile` détermine le comportement de la passerelle :

**`Off`**

Aucun traitement particulier n'est effectué.

**`On`**

La passerelle recherche un en-tête dans la réponse du serveur cible nommé `X-Sendfile`, et interprète sa valeur comme le nom du fichier à servir. L'en-tête est ensuite supprimé de la réponse finale. Cet argument produit le même effet que `ProxySCGISendfile X-Sendfile`.

**toute autre valeur**

Identique à `On`, mais au lieu de rechercher le nom d'en-tête codé en dur `X-Sendfile`, c'est la valeur de l'argument qui constitue le nom de l'en-tête à rechercher.

**Exemple**

```apache
# Utilise le nom d'en-tête par défaut (X-Sendfile)
ProxySCGISendfile On

# Utilise un nom d'en-tête différent
ProxySCGISendfile X-Send-Static
```

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
