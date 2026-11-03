---
title: "MDomain"
description: "Directive Apache MDomain (mod_md) — Définit une liste de noms de domaines qui appartiennent à un groupe. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit une liste de noms de domaines qui appartiennent à un groupe. |
| **Syntaxe** | `MDomain dns-name [ other-dns-name... ] [auto\|manual]` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Tous les domaines de la liste seront gérés par mod\_md comme un seul domaine géré (Managed Domain - MD). mod\_md ne demandera qu'un seul certificat qui sera valide pour tous ces noms de domaine. Cette directive s'utilise au niveau de la configuration globale (voir plus loin les autres directives MD). Si un domaine nécessite une configuration particulière, utilisez la directive [[13-directives/mdomainset|<MDomainSet>]].

Deux définitions supplémentaires sont nécessaires pour un domaine géré : une adresse Email de contact (via [[13-directives/mdcontactemail|MDContactEmail]] ou [[13-directives/serveradmin|ServerAdmin]]) et [[13-directives/mdcertificateagreement|MDCertificateAgreement]]. L'adresse électronique du [[13-directives/serveradmin|ServerAdmin]] permet de s'enregistrer auprès de l'autorité de certification (par défaut Let's Encrypt). L'autorité de certification l'utilisera pour vous informer à propos du statut de vos certificats ou d'éventuelles modifications de ses services.

La seconde définition, [[13-directives/mdcertificateagreement|MDCertificateAgreement]] doit avoir pour valeur "accepted". Vous confirmez ainsi que vous acceptez les conditions d'utilisation du CA.

**Exemple**

```apache
MDContactEmail admin@example.org
MDCertificateAgreement accepted
MDomain example.org www.example.org

<VirtualHost *:443>
    ServerName example.org
    DocumentRoot htdocs/root

    SSLEngine on
</VirtualHost>

<VirtualHost *:443>
    ServerName www.example.org
    DocumentRoot htdocs/www

    SSLEngine on
</VirtualHost>
```

En plus de la liste des domaines gérés, cette directive accepte un paramètre supplémentaire qui peut prendre pour valeur 'manual' ou 'auto'. Ce paramètre permet de définir si un domaine sera géré sous le nom spécifié dans la liste seul ('manual'), ou si tous les noms du serveur virtuel correspondant seront gérés ('auto'). C'est d'ailleurs cette dernière valeur qui est la valeur par défaut.

**Exemple**

```apache
MDomain example.org

<VirtualHost *:443>
    ServerName example.org
    ServerAlias www.example.org
    DocumentRoot htdocs/root

    SSLEngine on
</VirtualHost>

MDomain example2.org auto

<VirtualHost *:443>
    ServerName example2.org
    ServerAlias www.example2.org
    ...
</VirtualHost>
```

Dans cet exemple, le domaine 'www.example.org' est automatiquement ajouté à la liste MD 'example.org'. De manière similaire, le domaine 'www.example2.org' sera automatiquement ajouté à la liste MD 'example2.org' pour laquelle 'auto' est explicitement spécifié. Chaque fois que vous ajouterez des noms à ces serveurs virtuels via ServerAlias, ils seront ajoutés à la liste MD correspondante.

Si vous préférez déclarer explicitement tous les noms de domaines, utilisez le mode 'manual'. Une erreur sera enregistrée dans le journal si les noms ne correspondent pas à ceux attendus.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
