---
title: "auth_basic_user_file"
description: "Directive nginx auth_basic_user_file (ngx_http_auth_basic_module) — Indique le fichier qui contient les noms d'utilisateur et les mots de passe, au format suivant : nginx comment name1:password1 name2:password2:comment name3:password3 Le nom de fichier (file) peut…"
tags: [nginx, directive, ngx_http_auth_basic_module]
icon: settings-2
---

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `auth_basic_user_file file;` |
| **Valeur par défaut** | — |
| **Contexte** | `http`, `server`, `location`, `limit_except` |
| **Module** | [[11-modules/02-http/ngx_http_auth_basic_module\|ngx_http_auth_basic_module]] |

## Utilisation

Indique le fichier qui contient les noms d'utilisateur et les mots de passe, au format suivant :

```nginx
# comment
name1:password1
name2:password2:comment
name3:password3
```

Le nom de fichier (*file*) peut contenir des variables.

Les types de mots de passe suivants sont pris en charge :

- chiffré avec la fonction `crypt` ; peut être généré avec l'utilitaire « `htpasswd` » fourni avec Apache HTTP Server ou avec la commande « `openssl passwd` » ;
- haché avec la variante Apache de l'algorithme de mot de passe fondé sur MD5 (apr1) ; peut être généré avec les mêmes outils ;
- indiqué selon la syntaxe « `{`*scheme*`}`*data* » (1.0.3+) décrite dans la [RFC 2307](https://datatracker.ietf.org/doc/html/rfc2307#section-5.3) ; les schémas actuellement disponibles sont `PLAIN` (exemple, à ne pas utiliser), `SHA` (1.3.13) (hachage SHA-1 simple, à ne pas utiliser) et `SSHA` (hachage SHA-1 salé, utilisé par certains logiciels, notamment OpenLDAP et Dovecot).

  > [!NOTE]
  > La prise en charge du schéma `SHA` n'a été ajoutée que pour faciliter la migration depuis d'autres serveurs web. Il ne doit pas être utilisé pour de nouveaux mots de passe, car le hachage SHA-1 non salé qu'il emploie est vulnérable aux attaques par [tables arc-en-ciel](http://en.wikipedia.org/wiki/Rainbow_attack).

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
