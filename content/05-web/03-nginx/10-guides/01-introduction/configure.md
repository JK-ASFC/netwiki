---
title: "Compiler nginx à partir des sources"
description: "Nginx — Compiler nginx à partir des sources. La compilation se configure avec la commande configure. Elle définit divers aspects du système, dont les méthodes de traitement des connexions que nginx peut utiliser, et crée à la fin un Makefile."
tags: [nginx, guide]
icon: book-open
---

La compilation se configure avec la commande `configure`. Elle définit divers aspects du système, dont les méthodes de traitement des connexions que nginx peut utiliser, et crée à la fin un `Makefile`.

La commande `configure` accepte les paramètres suivants :

- **`--help`**

  affiche l'aide.

- **`--prefix=path`**

  définit le répertoire qui contiendra les fichiers du serveur. Ce même répertoire sert aussi pour tous les chemins relatifs définis par `configure` (sauf les chemins des sources des bibliothèques) et dans le fichier de configuration `nginx.conf`. Par défaut, il s'agit de `/usr/local/nginx`.

- **`--sbin-path=path`**

  définit le nom de l'exécutable nginx. Ce nom ne sert que pendant l'installation. Par défaut, le fichier s'appelle `prefix/sbin/nginx`.

- **`--modules-path=path`**

  définit le répertoire où seront installés les modules dynamiques de nginx. Par défaut, le répertoire `prefix/modules` est utilisé.

- **`--conf-path=path`**

  définit le nom du fichier de configuration `nginx.conf`. Si besoin, nginx peut toujours être démarré avec un autre fichier de configuration indiqué par le paramètre de ligne de commande `-c file`. Par défaut, le fichier s'appelle `prefix/conf/nginx.conf`.

- **`--error-log-path=path`**

  définit le nom du fichier principal des erreurs, avertissements et diagnostics. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/error-log|error_log]]. Par défaut, le fichier s'appelle `prefix/logs/error.log`.

- **`--pid-path=path`**

  définit le nom du fichier `nginx.pid` qui contiendra l'identifiant du processus maître. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/pid|pid]]. Par défaut, le fichier s'appelle `prefix/logs/nginx.pid`.

- **`--lock-path=path`**

  définit le préfixe des noms des fichiers de verrou. Après l'installation, la valeur peut toujours être modifiée dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/lock-file|lock_file]]. Par défaut, elle vaut `prefix/logs/nginx.lock`.

- **`--user=name`**

  définit le nom de l'utilisateur non privilégié sous lequel s'exécutent les processus de travail. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/user|user]]. L'utilisateur par défaut est nobody.

- **`--group=name`**

  définit le nom du groupe sous lequel s'exécutent les processus de travail. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/user|user]]. Par défaut, le groupe porte le nom de l'utilisateur non privilégié.

- **`--build=name`**

  définit un nom de compilation facultatif pour nginx.

- **`--builddir=path`**

  définit le répertoire de compilation.

- **`--with-select_module`
`--without-select_module`**

  active ou désactive la compilation d'un module permettant au serveur d'utiliser la méthode `select`. Ce module est compilé automatiquement si la plate-forme ne semble pas prendre en charge de méthode plus adaptée, comme kqueue, epoll ou /dev/poll.

- **`--with-poll_module`
`--without-poll_module`**

  active ou désactive la compilation d'un module permettant au serveur d'utiliser la méthode `poll`. Ce module est compilé automatiquement si la plate-forme ne semble pas prendre en charge de méthode plus adaptée, comme kqueue, epoll ou /dev/poll.

- **`--with-control-api`**

  active l'[API REST de contrôle de nginx](https://docs.nginx.com/nginx/admin-guide/basic-functionality/runtime-control#control-api) (1.31.5) ; voir aussi le paramètre de ligne de commande [[10-guides/01-introduction/switches|-l]].

- **`--with-threads`**

  active l'utilisation des [[12-directives/thread-pool|groupes de threads]].

- **`--with-file-aio`**

  active l'utilisation des [[12-directives/aio|entrées-sorties asynchrones sur fichiers]] (AIO) sous FreeBSD et Linux.

- **`--with-http_ssl_module`**

  active la compilation d'un module qui ajoute la [[11-modules/02-http/ngx_http_ssl_module|prise en charge du protocole HTTPS]] au serveur HTTP. Ce module n'est pas compilé par défaut. La bibliothèque OpenSSL est nécessaire pour le compiler et l'exécuter.

- **`--with-http_v2_module`**

  active la compilation d'un module qui prend en charge [[11-modules/02-http/ngx_http_v2_module|HTTP/2]]. Ce module n'est pas compilé par défaut.

- **`--with-http_v3_module`**

  active la compilation d'un module qui prend en charge [[11-modules/02-http/ngx_http_v3_module|HTTP/3]]. Ce module n'est pas compilé par défaut. Une bibliothèque OpenSSL prenant en charge HTTP/3 est nécessaire pour le compiler et l'exécuter.

- **`--with-http_realip_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_realip_module|ngx_http_realip_module]], qui remplace l'adresse du client par celle transmise dans le champ d'en-tête indiqué. Ce module n'est pas compilé par défaut.

- **`--with-http_addition_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_addition_module|ngx_http_addition_module]], qui ajoute du texte avant et après une réponse. Ce module n'est pas compilé par défaut.

- **`--with-http_xslt_module`
`--with-http_xslt_module=dynamic`**

  active la compilation du module [[11-modules/02-http/ngx_http_xslt_module|ngx_http_xslt_module]], qui transforme les réponses XML à l'aide d'une ou plusieurs feuilles de style XSLT. Ce module n'est pas compilé par défaut. Les bibliothèques [libxml2](http://xmlsoft.org) et [libxslt](http://xmlsoft.org/XSLT/) sont nécessaires pour le compiler et l'exécuter.

- **`--with-http_image_filter_module`
`--with-http_image_filter_module=dynamic`**

  active la compilation du module [[11-modules/02-http/ngx_http_image_filter_module|ngx_http_image_filter_module]], qui transforme les images aux formats JPEG, GIF, PNG et WebP. Ce module n'est pas compilé par défaut.

- **`--with-http_geoip_module`
`--with-http_geoip_module=dynamic`**

  active la compilation du module [[11-modules/02-http/ngx_http_geoip_module|ngx_http_geoip_module]], qui crée des variables selon l'adresse IP du client et les bases de données précompilées de [MaxMind](https://www.maxmind.com). Ce module n'est pas compilé par défaut. La bibliothèque [libmaxminddb](https://github.com/maxmind/libmaxminddb) (bases MMDB) ou [GeoIP Legacy C](https://github.com/maxmind/geoip-api-c) (bases DAT) est nécessaire pour le compiler et l'exécuter.

- **`--with-http_sub_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_sub_module|ngx_http_sub_module]], qui modifie une réponse en remplaçant une chaîne par une autre. Ce module n'est pas compilé par défaut.

- **`--with-http_dav_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_dav_module|ngx_http_dav_module]], qui automatise la gestion de fichiers via le protocole WebDAV. Ce module n'est pas compilé par défaut.

- **`--with-http_flv_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_flv_module|ngx_http_flv_module]], qui fournit côté serveur la prise en charge de la pseudo-diffusion en continu des fichiers Flash Video (FLV). Ce module n'est pas compilé par défaut.

- **`--with-http_mp4_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_mp4_module|ngx_http_mp4_module]], qui fournit côté serveur la prise en charge de la pseudo-diffusion en continu des fichiers MP4. Ce module n'est pas compilé par défaut.

- **`--with-http_gunzip_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_gunzip_module|ngx_http_gunzip_module]], qui décompresse les réponses portant « `Content-Encoding: gzip` » pour les clients qui ne prennent pas en charge la méthode d'encodage « gzip ». Ce module n'est pas compilé par défaut.

- **`--with-http_gzip_static_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_gzip_static_module|ngx_http_gzip_static_module]], qui permet d'envoyer des fichiers précompressés portant l'extension « `.gz` » à la place des fichiers ordinaires. Ce module n'est pas compilé par défaut.

- **`--with-http_auth_request_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_auth_request_module|ngx_http_auth_request_module]], qui autorise les clients selon le résultat d'une sous-requête. Ce module n'est pas compilé par défaut.

- **`--with-http_random_index_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_random_index_module|ngx_http_random_index_module]], qui traite les requêtes se terminant par une barre oblique (‘`/`’) et choisit au hasard un fichier du répertoire comme fichier d'index. Ce module n'est pas compilé par défaut.

- **`--with-http_secure_link_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_secure_link_module|ngx_http_secure_link_module]]. Ce module n'est pas compilé par défaut.

- **`--with-http_degradation_module`**

  active la compilation du module `ngx_http_degradation_module`. Ce module n'est pas compilé par défaut.

- **`--with-http_slice_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_slice_module|ngx_http_slice_module]], qui découpe une requête en sous-requêtes renvoyant chacune une plage de la réponse. Ce module permet une mise en cache plus efficace des grosses réponses. Il n'est pas compilé par défaut.

- **`--with-http_stub_status_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_stub_status_module|ngx_http_stub_status_module]], qui donne accès aux informations d'état de base. Ce module n'est pas compilé par défaut.

- **`--with-http_json_module`**

  active la compilation du module [[11-modules/02-http/ngx_http_json_module|ngx_http_json_module]], qui crée des variables dont la valeur est extraite d'un document JSON. Ce module n'est pas compilé par défaut.

- **`--without-http_charset_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_charset_module|ngx_http_charset_module]], qui ajoute le jeu de caractères indiqué au champ d'en-tête de réponse `Content-Type` et peut convertir les données d'un jeu de caractères à un autre.

- **`--without-http_gzip_module`**

  désactive la compilation d'un module qui [[11-modules/02-http/ngx_http_gzip_module|compresse les réponses]] du serveur HTTP. La bibliothèque zlib est nécessaire pour compiler et exécuter ce module.

- **`--without-http_ssi_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_ssi_module|ngx_http_ssi_module]], qui traite les commandes SSI (Server Side Includes) des réponses qui le traversent.

- **`--without-http_userid_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_userid_module|ngx_http_userid_module]], qui définit des cookies permettant d'identifier les clients.

- **`--without-http_access_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_access_module|ngx_http_access_module]], qui permet de limiter l'accès à certaines adresses de clients.

- **`--without-http_auth_basic_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_auth_basic_module|ngx_http_auth_basic_module]], qui permet de limiter l'accès aux ressources en vérifiant le nom d'utilisateur et le mot de passe selon le protocole « HTTP Basic Authentication ».

- **`--without-http_mirror_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_mirror_module|ngx_http_mirror_module]], qui duplique la requête d'origine en créant des sous-requêtes miroirs en arrière-plan.

- **`--without-http_autoindex_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_autoindex_module|ngx_http_autoindex_module]], qui traite les requêtes se terminant par une barre oblique (‘`/`’) et produit la liste du contenu du répertoire lorsque le module [[11-modules/02-http/ngx_http_index_module|ngx_http_index_module]] ne trouve pas de fichier d'index.

- **`--without-http_geo_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_geo_module|ngx_http_geo_module]], qui crée des variables dont la valeur dépend de l'adresse IP du client.

- **`--without-http_map_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_map_module|ngx_http_map_module]], qui crée des variables dont la valeur dépend de celle d'autres variables.

- **`--without-http_split_clients_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_split_clients_module|ngx_http_split_clients_module]], qui crée des variables pour les tests A/B.

- **`--without-http_referer_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_referer_module|ngx_http_referer_module]], qui peut bloquer l'accès à un site pour les requêtes dont le champ d'en-tête `Referer` a une valeur non valide.

- **`--without-http_rewrite_module`**

  désactive la compilation d'un module qui permet au serveur HTTP de [[11-modules/02-http/ngx_http_rewrite_module|rediriger les requêtes et modifier leur URI]]. La bibliothèque PCRE est nécessaire pour compiler et exécuter ce module.

- **`--without-http_proxy_module`**

  désactive la compilation du [[11-modules/02-http/ngx_http_proxy_module|module de relais]] du serveur HTTP.

- **`--without-http_fastcgi_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_fastcgi_module|ngx_http_fastcgi_module]], qui transmet les requêtes à un serveur FastCGI.

- **`--without-http_uwsgi_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_uwsgi_module|ngx_http_uwsgi_module]], qui transmet les requêtes à un serveur uwsgi.

- **`--without-http_scgi_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_scgi_module|ngx_http_scgi_module]], qui transmet les requêtes à un serveur SCGI.

- **`--without-http_grpc_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_grpc_module|ngx_http_grpc_module]], qui transmet les requêtes à un serveur gRPC.

- **`--without-http_tunnel_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_tunnel_module|ngx_http_tunnel_module]], qui traite les requêtes HTTP/1.1 CONNECT et établit une connexion virtuelle de bout en bout.

- **`--without-http_memcached_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_memcached_module|ngx_http_memcached_module]], qui obtient les réponses d'un serveur memcached.

- **`--without-http_limit_conn_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_limit_conn_module|ngx_http_limit_conn_module]], qui limite le nombre de connexions par clé, par exemple le nombre de connexions provenant d'une même adresse IP.

- **`--without-http_limit_req_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_limit_req_module|ngx_http_limit_req_module]], qui limite le débit de traitement des requêtes par clé, par exemple celui des requêtes provenant d'une même adresse IP.

- **`--without-http_empty_gif_module`**

  désactive la compilation d'un module qui [[11-modules/02-http/ngx_http_empty_gif_module|renvoie un GIF transparent d'un pixel]].

- **`--without-http_browser_module`**

  désactive la compilation du module [[11-modules/02-http/ngx_http_browser_module|ngx_http_browser_module]], qui crée des variables dont la valeur dépend du champ d'en-tête de requête `User-Agent`.

- **`--without-http_upstream_hash_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/hash-http-upstream|hash]].

- **`--without-http_upstream_ip_hash_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/ip-hash|ip_hash]].

- **`--without-http_upstream_least_conn_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/least-conn-http-upstream|least_conn]].

- **`--without-http_upstream_least_time_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/least-time-http-upstream|least_time]].

- **`--without-http_upstream_random_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/random-http-upstream|random]].

- **`--without-http_upstream_keepalive_module`**

  désactive la compilation d'un module qui fournit le [[12-directives/keepalive|cache des connexions]] vers les serveurs amont.

- **`--without-http_upstream_zone_module`**

  désactive la compilation d'un module qui permet de conserver l'état d'exécution d'un groupe amont dans une [[12-directives/zone-http-upstream|zone]] de mémoire partagée.

- **`--without-http_upstream_sticky_module`**

  désactive la compilation d'un module qui fournit l'[[12-directives/sticky|affinité de session]] avec les serveurs amont.

- **`--with-http_perl_module`
`--with-http_perl_module=dynamic`**

  active la compilation du [[11-modules/02-http/ngx_http_perl_module|module Perl intégré]]. Ce module n'est pas compilé par défaut.

- **`--with-perl_modules_path=path`**

  définit le répertoire qui contiendra les modules Perl.

- **`--with-perl=path`**

  définit le nom de l'exécutable Perl.

- **`--http-log-path=path`**

  définit le nom du fichier journal principal des requêtes du serveur HTTP. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/access-log-http-log|access_log]]. Par défaut, le fichier s'appelle `prefix/logs/access.log`.

- **`--http-client-body-temp-path=path`**

  définit le répertoire des fichiers temporaires contenant le corps des requêtes des clients. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/client-body-temp-path|client_body_temp_path]]. Par défaut, le répertoire s'appelle `prefix/client_body_temp`.

- **`--http-proxy-temp-path=path`**

  définit le répertoire des fichiers temporaires contenant les données reçues des serveurs mandatés. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/proxy-temp-path|proxy_temp_path]]. Par défaut, le répertoire s'appelle `prefix/proxy_temp`.

- **`--http-fastcgi-temp-path=path`**

  définit le répertoire des fichiers temporaires contenant les données reçues des serveurs FastCGI. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/fastcgi-temp-path|fastcgi_temp_path]]. Par défaut, le répertoire s'appelle `prefix/fastcgi_temp`.

- **`--http-uwsgi-temp-path=path`**

  définit le répertoire des fichiers temporaires contenant les données reçues des serveurs uwsgi. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/uwsgi-temp-path|uwsgi_temp_path]]. Par défaut, le répertoire s'appelle `prefix/uwsgi_temp`.

- **`--http-scgi-temp-path=path`**

  définit le répertoire des fichiers temporaires contenant les données reçues des serveurs SCGI. Après l'installation, il peut toujours être modifié dans le fichier de configuration `nginx.conf` avec la directive [[12-directives/scgi-temp-path|scgi_temp_path]]. Par défaut, le répertoire s'appelle `prefix/scgi_temp`.

- **`--without-http`**

  désactive le serveur [[11-modules/02-http/ngx_http_core_module|HTTP]].

- **`--without-http-cache`**

  désactive le cache HTTP.

- **`--with-mail`
`--with-mail=dynamic`**

  active le serveur [[11-modules/04-mail/ngx_mail_core_module|mandataire de messagerie]] POP3/IMAP4/SMTP.

- **`--with-mail_ssl_module`**

  active la compilation d'un module qui ajoute la [[11-modules/04-mail/ngx_mail_ssl_module|prise en charge de SSL/TLS]] au mandataire de messagerie. Ce module n'est pas compilé par défaut. La bibliothèque OpenSSL est nécessaire pour le compiler et l'exécuter.

- **`--without-mail_pop3_module`**

  désactive le protocole [[11-modules/04-mail/ngx_mail_pop3_module|POP3]] du mandataire de messagerie.

- **`--without-mail_imap_module`**

  désactive le protocole [[11-modules/04-mail/ngx_mail_imap_module|IMAP]] du mandataire de messagerie.

- **`--without-mail_smtp_module`**

  désactive le protocole [[11-modules/04-mail/ngx_mail_smtp_module|SMTP]] du mandataire de messagerie.

- **`--with-stream`
`--with-stream=dynamic`**

  active la compilation du [[11-modules/03-stream/ngx_stream_core_module|module stream]] pour le relais et la répartition de charge TCP/UDP génériques. Ce module n'est pas compilé par défaut.

- **`--with-stream_ssl_module`**

  active la compilation d'un module qui ajoute la [[11-modules/03-stream/ngx_stream_ssl_module|prise en charge de SSL/TLS]] au module stream. Ce module n'est pas compilé par défaut. La bibliothèque OpenSSL est nécessaire pour le compiler et l'exécuter.

- **`--with-stream_realip_module`**

  active la compilation du module [[11-modules/03-stream/ngx_stream_realip_module|ngx_stream_realip_module]], qui remplace l'adresse du client par celle transmise dans l'en-tête du protocole PROXY. Ce module n'est pas compilé par défaut.

- **`--with-stream_geoip_module`
`--with-stream_geoip_module=dynamic`**

  active la compilation du module [[11-modules/03-stream/ngx_stream_geoip_module|ngx_stream_geoip_module]], qui crée des variables selon l'adresse IP du client et les bases de données précompilées de [MaxMind](https://www.maxmind.com). Ce module n'est pas compilé par défaut. La bibliothèque [libmaxminddb](https://github.com/maxmind/libmaxminddb) (bases MMDB) ou [GeoIP Legacy C](https://github.com/maxmind/geoip-api-c) (bases DAT) est nécessaire pour le compiler et l'exécuter.

- **`--with-stream_ssl_preread_module`**

  active la compilation du module [[11-modules/03-stream/ngx_stream_ssl_preread_module|ngx_stream_ssl_preread_module]], qui permet d'extraire des informations du message [ClientHello](https://datatracker.ietf.org/doc/html/rfc5246#section-7.4.1.2) sans terminer SSL/TLS. Ce module n'est pas compilé par défaut.

- **`--without-stream_limit_conn_module`**

  désactive la compilation du module [[11-modules/03-stream/ngx_stream_limit_conn_module|ngx_stream_limit_conn_module]], qui limite le nombre de connexions par clé, par exemple le nombre de connexions provenant d'une même adresse IP.

- **`--without-stream_access_module`**

  désactive la compilation du module [[11-modules/03-stream/ngx_stream_access_module|ngx_stream_access_module]], qui permet de limiter l'accès à certaines adresses de clients.

- **`--without-stream_geo_module`**

  désactive la compilation du module [[11-modules/03-stream/ngx_stream_geo_module|ngx_stream_geo_module]], qui crée des variables dont la valeur dépend de l'adresse IP du client.

- **`--without-stream_map_module`**

  désactive la compilation du module [[11-modules/03-stream/ngx_stream_map_module|ngx_stream_map_module]], qui crée des variables dont la valeur dépend de celle d'autres variables.

- **`--without-stream_split_clients_module`**

  désactive la compilation du module [[11-modules/03-stream/ngx_stream_split_clients_module|ngx_stream_split_clients_module]], qui crée des variables pour les tests A/B.

- **`--without-stream_return_module`**

  désactive la compilation du module [[11-modules/03-stream/ngx_stream_return_module|ngx_stream_return_module]], qui envoie une valeur donnée au client puis ferme la connexion.

- **`--without-stream_pass_module`**

  désactive la compilation du module [[11-modules/03-stream/ngx_stream_pass_module|ngx_stream_pass_module]], qui transmet les connexions acceptées à d'autres sockets d'écoute.

- **`--without-stream_set_module`**

  désactive la compilation du module [[11-modules/03-stream/ngx_stream_set_module|ngx_stream_set_module]], qui affecte une valeur à une variable.

- **`--without-stream_upstream_hash_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/hash-stream-upstream|hash]].

- **`--without-stream_upstream_least_conn_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/least-conn-stream-upstream|least_conn]].

- **`--without-stream_upstream_least_time_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/least-time-stream-upstream|least_time]].

- **`--without-stream_upstream_random_module`**

  désactive la compilation d'un module qui met en œuvre la méthode de répartition de charge [[12-directives/random-stream-upstream|random]].

- **`--without-stream_upstream_zone_module`**

  désactive la compilation d'un module qui permet de conserver l'état d'exécution d'un groupe amont dans une [[12-directives/zone-stream-upstream|zone]] de mémoire partagée.

- **`--with-google_perftools_module`**

  active la compilation du module [[11-modules/05-autres/ngx_google_perftools_module|ngx_google_perftools_module]], qui permet de profiler les processus de travail de nginx avec [Google Performance Tools](https://github.com/gperftools/gperftools). Ce module est destiné aux développeurs de nginx et n'est pas compilé par défaut.

- **`--with-cpp_test_module`**

  active la compilation du module `ngx_cpp_test_module`.

- **`--add-module=path`**

  active un module externe.

- **`--add-dynamic-module=path`**

  active un module dynamique externe.

- **`--with-compat`**

  active la compatibilité des modules dynamiques.

- **`--with-cc=path`**

  définit le nom du compilateur C.

- **`--with-cpp=path`**

  définit le nom du préprocesseur C.

- **`--with-cc-opt=parameters`**

  définit des paramètres supplémentaires ajoutés à la variable CFLAGS. Avec la bibliothèque PCRE du système sous FreeBSD, il faut indiquer `--with-cc-opt="-I /usr/local/include"`. S'il faut augmenter le nombre de fichiers pris en charge par `select`, on peut aussi l'indiquer ici, par exemple : `--with-cc-opt="-D FD_SETSIZE=2048"`.

- **`--with-ld-opt=parameters`**

  définit des paramètres supplémentaires utilisés lors de l'édition de liens. Avec la bibliothèque PCRE du système sous FreeBSD, il faut indiquer `--with-ld-opt="-L /usr/local/lib"`.

- **`--with-cpu-opt=cpu`**

  active la compilation pour le processeur indiqué : `pentium`, `pentiumpro`, `pentium3`, `pentium4`, `athlon`, `opteron`, `sparc32`, `sparc64`, `ppc64`.

- **`--without-pcre`**

  désactive l'utilisation de la bibliothèque PCRE.

- **`--with-pcre`**

  force l'utilisation de la bibliothèque PCRE.

- **`--with-pcre=path`**

  définit le chemin des sources de la bibliothèque PCRE. La distribution de la bibliothèque doit être téléchargée depuis le site de [PCRE](http://www.pcre.org) et décompressée ; le reste est fait par `./configure` et `make` de nginx. La bibliothèque est nécessaire pour les expressions régulières de la directive [[12-directives/location|location]] et pour le module [[11-modules/02-http/ngx_http_rewrite_module|ngx_http_rewrite_module]].

- **`--with-pcre-opt=parameters`**

  définit des options de compilation supplémentaires pour PCRE.

- **`--with-pcre-jit`**

  compile la bibliothèque PCRE avec la prise en charge de la « compilation à la volée » (1.1.12, directive [[12-directives/pcre-jit|pcre_jit]]).

- **`--without-pcre2`**

  désactive l'utilisation de la bibliothèque PCRE2 à la place de la bibliothèque PCRE d'origine (1.21.5).

- **`--with-zlib=path`**

  définit le chemin des sources de la bibliothèque zlib. La distribution de la bibliothèque doit être téléchargée depuis le site de [zlib](http://zlib.net) et décompressée ; le reste est fait par `./configure` et `make` de nginx. La bibliothèque est nécessaire pour le module [[11-modules/02-http/ngx_http_gzip_module|ngx_http_gzip_module]].

- **`--with-zlib-opt=parameters`**

  définit des options de compilation supplémentaires pour zlib.

- **`--with-zlib-asm=cpu`**

  active l'utilisation des sources assembleur de zlib optimisées pour l'un des processeurs indiqués : `pentium`, `pentiumpro`.

- **`--with-libatomic`**

  force l'utilisation de la bibliothèque libatomic\_ops.

- **`--with-libatomic=path`**

  définit le chemin des sources de la bibliothèque libatomic\_ops.

- **`--with-openssl=path`**

  définit le chemin des sources de la bibliothèque OpenSSL.

- **`--with-openssl-opt=parameters`**

  définit des options de compilation supplémentaires pour OpenSSL.

- **`--with-debug`**

  active le [[10-guides/01-introduction/debugging-log|journal de débogage]].

Exemple d'utilisation des paramètres (le tout doit être saisi sur une seule ligne) :

```
./configure
    --sbin-path=/usr/local/nginx/nginx
    --conf-path=/usr/local/nginx/nginx.conf
    --pid-path=/usr/local/nginx/nginx.pid
    --with-http_ssl_module
    --with-pcre=../pcre2-10.39
    --with-zlib=../zlib-1.3
```

Après la configuration, nginx est compilé et installé avec `make`.

---

*Source : documentation officielle de nginx (nginx.org), © Igor Sysoev, © Nginx, Inc., licence BSD à 2 clauses ; traduction française NetWiki.*
