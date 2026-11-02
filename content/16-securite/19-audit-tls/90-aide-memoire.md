---
title: testssl.sh et SSLyze — aide-mémoire
description: Options testssl.sh (-p, -s, -e, -E, -f, -h, -U, -S, --starttls, --severity, --file, --parallel, --jsonfile, --htmlfile, --csvfile, --ip, --sneaky, --openssl) et SSLyze (--starttls, --mozilla_config, --json_out, --targets_in, commandes de scan ciblées), avec vérifications rapides openssl s_client.
tags: [aide-mémoire, testssl.sh, sslyze, tls]
icon: terminal
---

Explications : [[01-presentation-utilisation|testssl.sh et SSLyze]].

```bash
./testssl.sh -p hote:443 ; ./testssl.sh -E hote ; ./testssl.sh -U hote ; ./testssl.sh -S hote ; ./testssl.sh -h hote
./testssl.sh --ip one hote ; ./testssl.sh --starttls imap mail:143 ; ./testssl.sh --file cibles.txt --parallel --jsonfile parc.json
sslyze hote:443 ; sslyze --certinfo --tlsv1_2 --tlsv1_3 hote ; sslyze --mozilla_config=modern hote ; sslyze --targets_in=c.txt --json_out=r.json
openssl s_client -connect hote:443 -servername hote -tls1_2 </dev/null 2>/dev/null | grep -E 'Protocol|Cipher'
openssl s_client -connect hote:443 -servername hote -showcerts </dev/null | openssl x509 -noout -dates -subject -issuer
```
