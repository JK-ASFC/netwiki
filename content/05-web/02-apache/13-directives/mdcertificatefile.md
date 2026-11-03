---
title: "MDCertificateFile"
description: "Directive Apache MDCertificateFile (mod_md) — Définit un fichier de certificat statique pour le domaine géré. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_md]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Définit un fichier de certificat statique pour le domaine géré. |
| **Syntaxe** | `MDCertificateFile path-to-pem-file` |
| **Contexte** | configuration du serveur |
| **Statut** | Expérimental |
| **Module** | [[12-modules/mod_md\|mod_md]] |

## Utilisation

Cette directive s'utilise dans une section [[13-directives/mdomainset|<MDomainSet>]] et permet de spécifier le nom du fichier qui contiendra le certificat pour le domaine géré. La clé correspondante est spécifiée via la directive [[13-directives/mdcertificatekeyfile|MDCertificateKeyFile]].

**Exemple**

```apache
<MDomain mydomain.com>
  MDCertificateFile /etc/ssl/my.cert
  MDCertificateKeyFile /etc/ssl/my.key
</MDomain>
```

Cette directive est équivalente à la directive [[13-directives/sslcertificatefile|SSLCertificateFile]] de mod\_ssl. Elle s'utilise dans de nombreuses applications.

Une première application est la migration de la gestion des certificats d'un domaine existant depuis le mode statique via des fichiers vers le mode automatique via Let's Encrypt. A cet effet, vous définissez tout d'abord la section [[13-directives/mdomainset|<MDomainSet>]] dans laquelle vous spécifiez les fichiers, puis supprimez la directive [[13-directives/sslcertificatefile|SSLCertificateFile]] de la configuration de vos serveurs virtuels.

Avec cette configuration, votre serveur fonctionnera comme avant, avec probablement moins de lignes répétitives. Vous pouvez alors ajouter la directive [[13-directives/mdrenewmode|MDRenewMode]] avec pour valeur "always", et le module obtiendra un nouveau cerificat avant que celui du fichier considéré n'arrive à expiration. Une fois le certificat renouvelé, vous pouvez supprimer la directive `MDCertificateFile` et recharger la configuration.

Une autre application est le renouvellement de vos certificats Let's Encrypt avec d'autres clients ACME comme l'excellent [certbot](https://certbot.eff.org). A cet effet, faites pointer vos domaines gérés vers les fichiers de certbot et ils travaillerons alors ensemble.

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
