---
title: OpenSSL — aide-mémoire des commandes
description: Commandes OpenSSL avec exemples — version, genpkey, req (-new, -x509, -addext), x509 (-noout -text -dates -subject -ext -fingerprint), verify, pkey, rsa, ec, pkcs12 (-export, -legacy), crl, s_client (-servername, -starttls, -showcerts, -tls1_3), s_server, ciphers, dgst, rand, enc, ca, list -providers.
tags: [aide-mémoire, openssl, libressl]
icon: terminal
---

Explications : [[01-presentation-utilisation|OpenSSL et LibreSSL]].

```bash
openssl version -a ; openssl list -providers ; openssl ciphers -v 'TLSv1.3' ; openssl ciphers -s -v 'ECDHE+AESGCM'
openssl genpkey -algorithm ED25519 -out k.pem ; openssl pkey -in k.pem -text -noout ; openssl rsa -in old.key -out new.key   # retirer la phrase de passe
openssl req -new -newkey rsa:3072 -nodes -keyout k.key -out r.csr -subj "/CN=hote" ; openssl req -in r.csr -verify -noout
openssl x509 -in c.crt -noout -text ; openssl x509 -in c.crt -noout -fingerprint -sha256 ; openssl x509 -in c.crt -noout -checkend 2592000
openssl verify -CAfile ac.pem -untrusted inter.pem c.crt ; openssl crl2pkcs7 -nocrl -certfile chaine.pem | openssl pkcs7 -print_certs -noout
openssl pkcs12 -export -inkey k.key -in c.crt -out c.pfx ; openssl pkcs12 -in c.pfx -info -nokeys ; openssl pkcs12 -in old.pfx -legacy -nodes -out c.pem
openssl s_client -connect h:443 -servername h -tls1_3 </dev/null ; openssl s_client -connect h:636 </dev/null ; openssl s_server -accept 8443 -cert c.crt -key k.key
openssl dgst -sha256 f ; openssl rand -hex 16 ; openssl passwd -6 'motdepasse'
```
