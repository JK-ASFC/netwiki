---
title: privacyIDEA et LinOTP — aide-mémoire des commandes
description: Référence complète des commandes privacyIDEA et LinOTP avec exemples — administration locale pi-manage (administrateurs, domaines, résolveurs, politiques, sauvegarde et restauration avec la clé de chiffrement, rotation du journal d'audit), API REST avec jeton JWT (utilisateurs, jetons : liste, création TOTP/HOTP/e-mail, affectation, désactivation, remise à zéro du compteur d'échecs, resynchronisation, suppression ; audit ; défi-réponse ; vérification /validate/check), intégration FreeRADIUS (radtest), journaux, et validation LinOTP.
tags: [aide-mémoire, privacyidea, linotp, mfa, otp, totp, radius, api]
icon: terminal
---

Références : [[01-privacyidea|privacyIDEA]], [[02-linotp|LinOTP]], [[03-interface-graphique|interface graphique]]. Exemples : serveur `https://mfa.corp.exemple.fr`, domaine (*realm*) `corp` relié à l'Active Directory, utilisateur `alice`.

## privacyIDEA : administration locale (pi-manage)

```bash
sudo pi-manage admin list
sudo pi-manage admin add admin2 -e admin2@corp.exemple.fr        # mot de passe demandé
sudo pi-manage admin delete admin2
sudo pi-manage realm list
sudo pi-manage resolver list
sudo pi-manage policy list

# Sauvegarde : base, configuration et clé de chiffrement (encKey) — l'archive permet de tout déchiffrer : la protéger
sudo pi-manage backup create -d /var/backups/privacyidea
sudo ls -l /var/backups/privacyidea/
sudo pi-manage backup restore /var/backups/privacyidea/privacyidea-backup-202611150200.tgz

# Journal d'audit : purge planifiée (garder 80 000 entrées dès que 100 000 sont atteintes)
sudo pi-manage audit rotate --highwatermark 100000 --lowwatermark 80000
echo '0 3 * * * root pi-manage audit rotate --highwatermark 100000 --lowwatermark 80000' | sudo tee /etc/cron.d/privacyidea-audit
```

## privacyIDEA : API REST

```bash
B=https://mfa.corp.exemple.fr
# Jeton d'administration (JWT)
JWT=$(curl -s -d username=admin -d password="$MDP_ADMIN" $B/auth | jq -r .result.value.token)

# Utilisateurs et configuration
curl -s -H "Authorization: $JWT" "$B/user/?realm=corp&username=alice" | jq '.result.value[] | {username, email, givenname}'
curl -s -H "Authorization: $JWT" $B/realm/ | jq '.result.value | keys'
curl -s -H "Authorization: $JWT" $B/resolver/ | jq '.result.value | keys'
curl -s -H "Authorization: $JWT" $B/policy/ | jq '.result.value[] | {name, scope, active}'

# Jetons d'un utilisateur
curl -s -H "Authorization: $JWT" "$B/token/?user=alice&realm=corp" | jq '.result.value.tokens[] | {serial, tokentype, active, failcount, description}'

# Créer un TOTP (renvoie l'URI otpauth:// et un QR code)
curl -s -X POST -H "Authorization: $JWT" -d type=totp -d user=alice -d realm=corp -d genkey=1 -d description="Téléphone d'Alice" $B/token/init | jq -r .detail.googleurl.value
# Jeton par courriel
curl -s -X POST -H "Authorization: $JWT" -d type=email -d user=alice -d realm=corp -d dynamic_email=1 $B/token/init | jq .result

# Cycle de vie d'un jeton (numéro de série TOTP0001A2B3)
curl -s -X POST -H "Authorization: $JWT" -d serial=TOTP0001A2B3 -d user=alice -d realm=corp $B/token/assign | jq .result
curl -s -X POST -H "Authorization: $JWT" $B/token/disable/TOTP0001A2B3 | jq .result
curl -s -X POST -H "Authorization: $JWT" $B/token/enable/TOTP0001A2B3 | jq .result
curl -s -X POST -H "Authorization: $JWT" $B/token/reset/TOTP0001A2B3 | jq .result           # compteur d'échecs à zéro
curl -s -X POST -H "Authorization: $JWT" -d serial=TOTP0001A2B3 -d otp1=123456 -d otp2=654321 $B/token/resync | jq .result
curl -s -X POST -H "Authorization: $JWT" -d serial=TOTP0001A2B3 $B/token/unassign | jq .result
curl -s -X DELETE -H "Authorization: $JWT" $B/token/TOTP0001A2B3 | jq .result

# Audit (qui, quoi, résultat)
curl -s -H "Authorization: $JWT" "$B/audit/?user=alice&page_size=20" | jq '.result.value.auditdata[] | {date, action, success, info}'
```

## privacyIDEA : vérification d'authentification

```bash
# Mot de passe AD suivi du code OTP (politique « passthru » ou « otppin=userstore »)
curl -s -d user=alice -d realm=corp -d pass='MotDePasseAD123456' $B/validate/check | jq '.result.value, .detail.message'
# Défi-réponse : 1) le mot de passe déclenche le défi, 2) le code est envoyé avec transaction_id
curl -s -d user=alice -d realm=corp -d pass='MotDePasseAD' $B/validate/check | jq -r '.detail.transaction_id'
curl -s -d user=alice -d realm=corp -d transaction_id=01234567890123456789 -d pass=123456 $B/validate/check | jq .result.value
# Déclencher un défi par l'administrateur (SMS, e-mail, push)
curl -s -X POST -H "Authorization: $JWT" -d user=alice -d realm=corp $B/validate/triggerchallenge | jq .detail.messages
```

## privacyIDEA : RADIUS et journaux

```bash
# Via FreeRADIUS et le greffon privacyIDEA (rlm_perl, /etc/privacyidea/rlm_perl.ini)
radtest alice 'MotDePasseAD123456' 127.0.0.1 0 SecretRadiusLong
sudo freeradius -X                                                 # mode débogage, au premier plan
sudo tail -f /var/log/privacyidea/privacyidea.log
sudo tail -f /var/log/apache2/error.log
```

## LinOTP

```bash
curl -s "https://otp.corp.exemple.fr/validate/check?user=alice&pass=MotDePasseAD123456" | jq .result.value
curl -s -X POST -d user=alice -d pass=MotDePasseAD123456 https://otp.corp.exemple.fr/validate/check | jq .result
sudo systemctl status linotp
sudo tail -f /var/log/linotp/linotp.log
```
