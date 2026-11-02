---
title: Scanners web — aide-mémoire des commandes
description: Commandes Nuclei (-u, -l, -t, -id, -tags, -etags, -severity, -rl, -c, -o, -jsonl, -me, -update-templates, -validate), Nikto (-h, -p, -ssl, -Tuning, -o, -Format, -useproxy), Wapiti (-u, -m, --scope, --flush-session, -f, -o) et sqlmap (-u, -r, -p, --batch, --level, --risk, --dbs, --tables, --dump, --tamper, --proxy, --flush-session) avec exemples.
tags: [aide-mémoire, nuclei, nikto, wapiti, sqlmap]
icon: terminal
---

Explications : [[01-nuclei|Nuclei]] · [[02-nikto-wapiti-sqlmap|Nikto, Wapiti, Arachni et sqlmap]].

```bash
nuclei -update-templates ; nuclei -tl | wc -l ; nuclei -validate -t mes-modeles/ ; nuclei -u URL -s critical,high -rl 20
nuclei -l cibles.txt -tags panel,login -o panneaux.txt ; nuclei -l cibles.txt -t dns/ -t ssl/ ; nuclei -u URL -proxy http://127.0.0.1:8080
nikto -h hote -p 443 -ssl ; nikto -h liste.txt -Tuning x6 ; nikto -h URL -useproxy http://127.0.0.1:8080
wapiti --list-modules ; wapiti -u URL -m "-all,sql,xss" --flush-session ; wapiti -u URL --max-scan-time 1800 -f json -o res.json
sqlmap -u "URL?id=1" --batch --banner ; sqlmap -u "URL?id=1" --batch -D base --tables ; sqlmap -r req.txt --batch --level 3 --risk 2
sqlmap -u "URL?id=1" --batch --tamper=space2comment --proxy http://127.0.0.1:8080 ; sqlmap --flush-session -u "URL?id=1"
```
