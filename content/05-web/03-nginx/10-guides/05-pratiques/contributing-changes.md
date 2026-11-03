---
title: "Contribuer des modifications"
description: "Nginx — Contribuer des modifications. Le code source est hébergé sur GitHub. Le dépôt peut être cloné avec la commande suivante :"
tags: [nginx, guide]
icon: book-open
---

## Obtenir les sources

Le code source est hébergé sur [GitHub](https://github.com). Le [dépôt](https://github.com/nginx/nginx) peut être cloné avec la commande suivante :

```
git clone https://github.com/nginx/nginx.git
```

## Mise en forme des modifications

Les modifications doivent respecter le style de code de nginx. Lorsqu'il n'existe pas de règle claire, observez la mise en forme des sources existantes de nginx et imitez-la. Une modification a plus de chances d'être acceptée si son style correspond au code environnant.

[Commitez](https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits) les modifications dans votre fork GitHub de nginx. Vérifiez que l'adresse [e-mail](https://docs.github.com/en/get-started/getting-started-with-git/setting-your-username-in-git) et le vrai nom de l'auteur sont corrects.

Le message de commit doit comporter un résumé d'une ligne, suivi d'une description détaillée après une ligne vide. Limitez les lignes du sujet et du corps du message à 72 caractères. Le commit obtenu s'affiche avec la commande `git show` :

```c
commit 067d766f210ee914b750d79d9284cbf8801058f3
Author: Zoey <username@example.com>
Date:   Sun Apr 5 11:31:15 2026 +0200

    Fix $request_port and $is_request_port in subrequests

    Closes #1247.

diff --git a/src/http/ngx_http_core_module.c b/src/http/ngx_http_core_module.c
index 0c46106db..53ddf39bb 100644
--- a/src/http/ngx_http_core_module.c
+++ b/src/http/ngx_http_core_module.c
@@ -2453,6 +2453,8 @@ ngx_http_subrequest(ngx_http_request_t *r,
     sr->method = NGX_HTTP_GET;
     sr->http_version = r->http_version;

+    sr->port = r->port;
+
     sr->request_line = r->request_line;
     sr->uri = *uri;
```

## Avant de soumettre

Quelques points méritent attention avant de soumettre des modifications :

- Les modifications proposées doivent fonctionner correctement sur un large éventail de plates-formes prises en charge.
- Expliquez clairement pourquoi la modification est nécessaire et, si possible, donnez un cas d'usage.
- Passer vos modifications dans la suite de tests est un bon moyen de vérifier qu'elles ne provoquent pas de régression. Le [dépôt](https://github.com/nginx/nginx-tests) des tests peut être cloné avec la commande suivante :

  ```
  git clone https://github.com/nginx/nginx-tests.git
  ```

## Soumettre les modifications

Les modifications proposées doivent être soumises depuis votre fork vers le [dépôt nginx](https://github.com/nginx/nginx) sous forme de [pull request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork).

## Site web

Les sources de ce site web sont hébergées sur GitHub. Le [dépôt](https://www.github.com/nginx/nginx.org) peut être cloné avec la commande suivante :

```
git clone https://github.com/nginx/nginx.org.git
```

Les modifications de la documentation doivent être soumises depuis votre fork sous forme de pull request.

## Licence

Soumettre des modifications implique d'autoriser le projet à les utiliser sous une [licence](https://nginx.org/LICENSE) appropriée.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
