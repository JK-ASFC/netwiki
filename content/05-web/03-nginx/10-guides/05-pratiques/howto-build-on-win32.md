---
title: "Compiler nginx sous Win32 avec Visual C"
description: "Nginx — Compiler nginx sous Win32 avec Visual C. Pour compiler nginx sous Microsoft Win32, il faut :"
tags: [nginx, guide]
icon: book-open
---

## Prérequis

Pour compiler nginx sous Microsoft Win32, il faut :

- le compilateur Microsoft Visual C ; Microsoft Visual Studio 8, 10 et 17 fonctionnent ;
- [MSYS](https://sourceforge.net/projects/mingw/files/MSYS/) ou [MSYS2](https://www.msys2.org) ;
- Perl, pour compiler OpenSSL et nginx avec la prise en charge de SSL, par exemple [ActivePerl](http://www.activestate.com/activeperl) ou [Strawberry Perl](http://strawberryperl.com) ;
- un client [Git](https://cli.github.com/) ;
- les sources des bibliothèques [PCRE](http://www.pcre.org), [zlib](http://zlib.net) et [OpenSSL](http://www.openssl.org).

## Étapes de compilation

Avant de commencer, vérifiez que les répertoires bin de Perl, Git et MSYS figurent dans la variable d'environnement PATH. Pour préparer l'environnement Visual C, exécutez le script vcvarsall.bat du répertoire de Visual C.

Pour compiler nginx :

- Lancez le bash de MSYS.
- Récupérez les sources de nginx depuis le dépôt GitHub :

  ```
  git clone https://github.com/nginx/nginx.git
  ```
- Créez les répertoires build et lib, et décompressez les sources de zlib, PCRE et OpenSSL dans le répertoire lib :

  ```
  mkdir objs
  mkdir objs/lib
  cd objs/lib
  tar -xzf ../../pcre2-10.39.tar.gz
  tar -xzf ../../zlib-1.3.1.tar.gz
  tar -xzf ../../openssl-3.0.14.tar.gz
  ```
- Exécutez le script configure :

  ```
  auto/configure \
      --with-cc=cl \
      --with-debug \
      --prefix= \
      --conf-path=conf/nginx.conf \
      --pid-path=logs/nginx.pid \
      --http-log-path=logs/access.log \
      --error-log-path=logs/error.log \
      --sbin-path=nginx.exe \
      --http-client-body-temp-path=temp/client_body_temp \
      --http-proxy-temp-path=temp/proxy_temp \
      --http-fastcgi-temp-path=temp/fastcgi_temp \
      --http-scgi-temp-path=temp/scgi_temp \
      --http-uwsgi-temp-path=temp/uwsgi_temp \
      --with-cc-opt=-DFD_SETSIZE=1024 \
      --with-pcre=objs/lib/pcre2-10.39 \
      --with-zlib=objs/lib/zlib-1.3.1 \
      --with-openssl=objs/lib/openssl-3.0.14 \
      --with-openssl-opt=no-asm \
      --with-http_ssl_module
  ```
- Exécutez make :

  ```
  nmake
  ```

## Voir aussi

- [[10-guides/01-introduction/windows|nginx pour Windows]]

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
