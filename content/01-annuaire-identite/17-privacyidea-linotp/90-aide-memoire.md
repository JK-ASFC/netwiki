---
title: privacyIDEA et LinOTP — aide-mémoire des commandes
description: Commandes privacyIDEA et LinOTP avec exemples — pi-manage (admin, createdb, backup, audit, realm, resolver), API REST (auth, token, validate/check), test RADIUS (radtest), journaux et API de validation LinOTP.
tags: [aide-mémoire, privacyidea, linotp, mfa, radius]
icon: terminal
---

Références : [[01-privacyidea|privacyIDEA]], [[02-linotp|LinOTP]].

## privacyIDEA

```bash
sudo pi-manage admin list ; sudo pi-manage admin add admin2 -e admin2@corp.exemple.fr
sudo pi-manage backup create -d /var/backups/privacyidea     # base + configuration (encKey incluse : protéger l'archive)
sudo pi-manage audit rotate --highwatermark 100000 --lowwatermark 80000
sudo pi-manage realm list ; sudo pi-manage resolver list
JWT=$(curl -s -d username=admin -d password='…' https://mfa.corp.exemple.fr/auth | jq -r .result.value.token)
curl -s -H "Authorization: $JWT" "https://mfa.corp.exemple.fr/token/?user=alice&realm=corp" | jq '.result.value.tokens[].serial'
curl -s -X POST -H "Authorization: $JWT" -d type=totp -d user=alice -d realm=corp -d genkey=1 https://mfa.corp.exemple.fr/token/init | jq .detail.googleurl.value
curl -s -d user=alice -d pass='MotDePasseAD123456' https://mfa.corp.exemple.fr/validate/check | jq .result
radtest alice 'MotDePasseAD123456' 127.0.0.1 0 secret-radius          # via FreeRADIUS + greffon privacyIDEA
tail -f /var/log/privacyidea/privacyidea.log
```

## LinOTP

```bash
curl -s "https://otp.corp.exemple.fr/validate/check?user=alice&pass=MotDePasseAD123456" | jq .result.value
tail -f /var/log/linotp/linotp.log
```
