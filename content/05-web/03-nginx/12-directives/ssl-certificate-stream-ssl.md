---
title: "ssl_certificate (ngx_stream_ssl_module)"
description: "Directive nginx ssl_certificate (ngx_stream_ssl_module) — Indique le fichier (file) contenant le certificat au format PEM pour le serveur virtuel. Si des certificats intermédiaires doivent accompagner le certificat principal, ils se placent dans le même…"
tags: [nginx, directive, ngx_stream_ssl_module]
icon: settings-2
---

> [!NOTE]
> Traduction en cours : les passages encore en anglais seront traduits prochainement.

| Propriété | Valeur |
| --- | --- |
| **Syntaxe** | `ssl_certificate file;` |
| **Valeur par défaut** | — |
| **Contexte** | `stream`, `server` |
| **Module** | [[11-modules/03-stream/ngx_stream_ssl_module\|ngx_stream_ssl_module]] |

## Utilisation

Indique le fichier (*file*) contenant le certificat au format PEM pour le serveur virtuel. Si des certificats intermédiaires doivent accompagner le certificat principal, ils se placent dans le même fichier, dans cet ordre : d'abord le certificat principal, puis les certificats intermédiaires. Une clé secrète au format PEM peut figurer dans le même fichier.

Depuis la version 1.11.0, cette directive peut être indiquée plusieurs fois pour charger des certificats de types différents, par exemple RSA et ECDSA :

```nginx
server {
    listen              12345 ssl;

    ssl_certificate     example.com.rsa.crt;
    ssl_certificate_key example.com.rsa.key;

    ssl_certificate     example.com.ecdsa.crt;
    ssl_certificate_key example.com.ecdsa.key;

    ...
}
```

> [!NOTE]
> Seul OpenSSL 1.0.2 ou plus récent prend en charge des [[10-guides/02-http/configuring-https-servers|chaînes de certificats]] distinctes pour différents certificats. Avec les versions plus anciennes, une seule chaîne peut être utilisée.

Depuis la version 1.15.9, le nom de fichier (*file*) peut contenir des variables avec OpenSSL 1.0.2 ou plus récent :

```nginx
ssl_certificate     $ssl_server_name.crt;
ssl_certificate_key $ssl_server_name.key;
```

L'utilisation de variables implique de charger le certificat à chaque négociation SSL, ce qui peut nuire aux performances.

Since [[13-variables/ssl-server-name-stream-ssl|$ssl_server_name]] is chosen by the client, loading certificates with such a file name should be filtered:

```nginx
map $ssl_server_name $name {
    hostnames;

    default        www.example.org;

    .example.org   www.example.org;
    .example.com   www.example.com;
}

server {
    listen              443 ssl;
    ssl_certificate     certs/$name.crt;
    ssl_certificate_key certs/$name.key;
}
```

On peut indiquer `data`:*$variable* à la place de *file* (1.15.10) pour charger le certificat depuis une variable, sans fichier intermédiaire. Une mauvaise utilisation de cette syntaxe peut avoir des conséquences sur la sécurité, comme l'écriture de données de clé secrète dans le [[12-directives/error-log|journal d'erreurs]].

En raison des limites du protocole SSL/TLS, pour une interopérabilité maximale avec les clients qui n'utilisent pas [SNI](http://en.wikipedia.org/wiki/Server_Name_Indication), les serveurs virtuels ayant des certificats différents doivent écouter sur des [[10-guides/02-http/configuring-https-servers|adresses IP différentes]].

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
