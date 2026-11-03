---
title: "SSLSessionTicketKeyFile"
description: "Directive Apache SSLSessionTicketKeyFile (mod_ssl) — Clé de chiffrement/déchiffrement permanente pour les tickets de session TLS. Syntaxe, valeur par défaut, contexte, AllowOverride et exemples."
tags: [apache, directive, mod_ssl]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Description** | Clé de chiffrement/déchiffrement permanente pour les tickets de session TLS |
| **Syntaxe** | `SSLSessionTicketKeyFile file-path` |
| **Contexte** | configuration du serveur, serveur virtuel |
| **Statut** | Extension |
| **Module** | [[12-modules/mod_ssl\|mod_ssl]] |
| **Compatibilité** | Disponible depuis la version 2.4.0 du serveur HTTP Apache, sous réserve que l'on utilise une version 0.9.8h ou supérieure d'OpenSSL |

## Utilisation

Cette directive permet de définir une clé secrète pour le chiffrement et le déchiffrement des tickets de session TLS selon les préconisations de la [RFC 5077](https://www.rfc-editor.org/rfc/rfc5077). Elle a été conçue à l'origine pour les environnements de clusters où les données des sessions TLS doivent être partagées entre plusieurs noeuds. Pour les configurations ne comportant qu'une seule instance de httpd, il est préférable d'utiliser les clés (aléatoires) générées par mod\_ssl au démarrage du serveur.

Le fichier doit contenir 48 octets de données aléatoires créées de préférence par une source à haute entropie. Sur un système de type UNIX, il est possible de créer le fichier contenant la clé de la manière suivante :

```
dd if=/dev/random of=/chemin/vers/fichier.tkey bs=1 count=48
```

Ces clés doivent être renouvelées fréquemment, car il s'agit du seul moyen d'invalider un ticket de session existant - OpenSSL ne permet pas actuellement de spécifier une limite à la durée de vie des tickets. Une nouvelle clé ne peut être utilisée qu'après avoir redémarré le serveur. Tous les tickets de session existants deviennent invalides après le redémarrage du serveur.

> [!WARNING]
> Ce fichier contient des données sensibles et doit donc être protégé par des permissions similaires à celles du fichier spécifié par la directive [[13-directives/sslcertificatekeyfile|SSLCertificateKeyFile]].

---

*Source : documentation officielle d’Apache HTTP Server 2.4 (traduction française de la Fondation Apache), © Apache Software Foundation, licence Apache 2.0.*
