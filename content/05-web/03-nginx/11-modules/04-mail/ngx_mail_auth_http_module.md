---
title: "ngx_mail_auth_http_module"
description: "Module nginx ngx_mail_auth_http_module — Le protocole HTTP sert à communiquer avec le serveur d'authentification. Les données du corps de la réponse sont ignorées ; les informations ne sont transmises que dans les en-têtes."
tags: [nginx, module, ngx_mail_auth_http_module]
icon: puzzle
---

## Protocole

Le protocole HTTP sert à communiquer avec le serveur d'authentification. Les données du corps de la réponse sont ignorées ; les informations ne sont transmises que dans les en-têtes.

Exemples de requêtes et de réponses :

Requête :

```nginx
GET /auth HTTP/1.0
Host: localhost
Auth-Method: plain # plain/apop/cram-md5/external
Auth-User: user
Auth-Pass: password
Auth-Protocol: imap # imap/pop3/smtp
Auth-Login-Attempt: 1
Client-IP: 192.0.2.42
Client-Host: client.example.org
```

Réponse positive :

```nginx
HTTP/1.0 200 OK
Auth-Status: OK
Auth-Server: 198.51.100.1
Auth-Port: 143
```

Réponse négative :

```nginx
HTTP/1.0 200 OK
Auth-Status: Invalid login or password
Auth-Wait: 3
```

S'il n'y a pas d'en-tête `Auth-Wait`, une erreur est renvoyée et la connexion fermée. La mise en œuvre actuelle alloue de la mémoire à chaque tentative d'authentification, libérée seulement à la fin de la session. Le nombre de tentatives d'authentification non valides dans une même session doit donc être limité : le serveur doit répondre sans l'en-tête `Auth-Wait` après 10 à 20 tentatives (le numéro de tentative est transmis dans l'en-tête `Auth-Login-Attempt`).

Avec APOP ou CRAM-MD5, la requête et la réponse ressemblent à ceci :

```nginx
GET /auth HTTP/1.0
Host: localhost
Auth-Method: apop
Auth-User: user
Auth-Salt: <238188073.1163692009@mail.example.com>
Auth-Pass: auth_response
Auth-Protocol: imap
Auth-Login-Attempt: 1
Client-IP: 192.0.2.42
Client-Host: client.example.org
```

Réponse positive :

```nginx
HTTP/1.0 200 OK
Auth-Status: OK
Auth-Server: 198.51.100.1
Auth-Port: 143
Auth-Pass: plain-text-pass
```

Si l'en-tête `Auth-User` est présent dans la réponse, il remplace le nom d'utilisateur utilisé pour s'authentifier auprès du serveur d'arrière-plan.

Pour SMTP, la réponse tient aussi compte de l'en-tête `Auth-Error-Code` : s'il est présent, il sert de code de réponse en cas d'erreur ; sinon, le code 535 5.7.0 est ajouté à l'en-tête `Auth-Status`.

Par exemple, si le serveur d'authentification renvoie la réponse suivante :

```nginx
HTTP/1.0 200 OK
Auth-Status: Temporary server problem, try again later
Auth-Error-Code: 451 4.3.0
Auth-Wait: 3
```

le client SMTP reçoit l'erreur

```nginx
451 4.3.0 Temporary server problem, try again later
```

Si le relais SMTP ne nécessite pas d'authentification, la requête ressemble à ceci :

```nginx
GET /auth HTTP/1.0
Host: localhost
Auth-Method: none
Auth-User:
Auth-Pass:
Auth-Protocol: smtp
Auth-Login-Attempt: 1
Client-IP: 192.0.2.42
Client-Host: client.example.org
Auth-SMTP-Helo: client.example.org
Auth-SMTP-From: MAIL FROM: <>
Auth-SMTP-To: RCPT TO: <postmaster@mail.example.com>
```

Pour une connexion cliente SSL/TLS (1.7.11), l'en-tête `Auth-SSL` est ajouté, et `Auth-SSL-Verify` contient le résultat de la vérification du certificat du client si elle est [[12-directives/ssl-verify-client-mail-ssl|activée]] : « `SUCCESS` », « `FAILED:`*reason* », ou « `NONE` » si aucun certificat n'a été présenté.

> [!NOTE]
> Avant la version 1.11.7, le résultat « `FAILED` » ne contenait pas la chaîne *reason*.

Si le client a présenté un certificat, ses détails sont transmis dans les en-têtes de requête `Auth-SSL-Subject`, `Auth-SSL-Issuer`, `Auth-SSL-Serial` et `Auth-SSL-Fingerprint`. Si [[12-directives/auth-http-pass-client-cert|auth_http_pass_client_cert]] est activé, le certificat lui-même est transmis dans l'en-tête `Auth-SSL-Cert`. Le protocole et la suite de chiffrement de la connexion sont transmis dans les en-têtes `Auth-SSL-Protocol` et `Auth-SSL-Cipher` (1.21.2). La requête ressemble à ceci :

```nginx
GET /auth HTTP/1.0
Host: localhost
Auth-Method: plain
Auth-User: user
Auth-Pass: password
Auth-Protocol: imap
Auth-Login-Attempt: 1
Client-IP: 192.0.2.42
Auth-SSL: on
Auth-SSL-Protocol: TLSv1.3
Auth-SSL-Cipher: TLS_AES_256_GCM_SHA384
Auth-SSL-Verify: SUCCESS
Auth-SSL-Subject: /CN=example.com
Auth-SSL-Issuer: /CN=example.com
Auth-SSL-Serial: C07AD56B846B5BFF
Auth-SSL-Fingerprint: 29d6a80a123d13355ed16b4b04605e29cb55a5ad
```

Avec le [[11-modules/04-mail/ngx_mail_core_module|protocole PROXY]], ses détails sont transmis dans les en-têtes de requête `Proxy-Protocol-Addr`, `Proxy-Protocol-Port`, `Proxy-Protocol-Server-Addr` et `Proxy-Protocol-Server-Port` (1.19.8).

## Directives

- [[12-directives/auth-http|auth_http]]
- [[12-directives/auth-http-header|auth_http_header]]
- [[12-directives/auth-http-pass-client-cert|auth_http_pass_client_cert]]
- [[12-directives/auth-http-timeout|auth_http_timeout]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
