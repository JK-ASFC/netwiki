---
title: XMPP — aide-mémoire des commandes
description: Commandes des serveurs XMPP avec exemples — Prosody (prosodyctl adduser, passwd, deluser, check, cert import, status, shell, install de modules), ejabberd (ejabberdctl register, change_password, registered_users, connected_users, create_room, reload_config, request_certificate, backup, restore, cluster), Openfire (service, API REST), Snikket (scripts, invitations, sauvegarde), MongooseIM (mongooseimctl account, roster), tests DNS SRV et TLS.
tags: [aide-mémoire, xmpp, prosody, ejabberd, openfire, snikket, mongooseim]
icon: terminal
---

Explications : [[01-prosody|XMPP et Prosody]] · [[02-ejabberd|ejabberd]] · [[03-openfire|Openfire]] · [[04-snikket-mongooseim|Snikket et MongooseIM]] · [[05-clients-conversejs|clients et Converse.js]].

## Tests réseau

```bash
dig +short SRV _xmpp-client._tcp.corp.exemple.fr
dig +short SRV _xmpp-server._tcp.corp.exemple.fr
openssl s_client -connect xmpp.corp.exemple.fr:5222 -starttls xmpp -xmpphost corp.exemple.fr </dev/null | openssl x509 -noout -subject -dates
openssl s_client -connect xmpp.corp.exemple.fr:5269 -starttls xmpp-server -xmpphost corp.exemple.fr </dev/null | head -5
nc -zv xmpp.corp.exemple.fr 5222
```

## Prosody

```bash
sudo prosodyctl adduser jk@corp.exemple.fr
sudo prosodyctl passwd jk@corp.exemple.fr
sudo prosodyctl deluser ancien.agent@corp.exemple.fr
sudo prosodyctl check ; sudo prosodyctl check dns ; sudo prosodyctl check certs
sudo prosodyctl --root cert import /etc/letsencrypt/live
sudo prosodyctl status ; sudo prosodyctl about ; sudo prosodyctl reload
sudo prosodyctl shell
sudo prosodyctl install --server=https://modules.prosody.im/rocks/ mod_auth_ldap
sudo tail -f /var/log/prosody/prosody.log
```

## ejabberd

```bash
sudo ejabberdctl status
sudo ejabberdctl register jk corp.exemple.fr 'MdpTemporaire2026!'
sudo ejabberdctl change_password jk corp.exemple.fr 'NouveauMdp2026!'
sudo ejabberdctl unregister ancien.agent corp.exemple.fr
sudo ejabberdctl registered_users corp.exemple.fr
sudo ejabberdctl connected_users
sudo ejabberdctl create_room support salons.corp.exemple.fr corp.exemple.fr
sudo ejabberdctl reload_config
sudo ejabberdctl request_certificate all
sudo ejabberdctl backup /srv/sauvegardes/ejabberd-$(date +%F).backup
sudo ejabberdctl restore /srv/sauvegardes/ejabberd-2026-11-02.backup
sudo ejabberdctl --no-timeout join_cluster ejabberd@srv-xmpp-01 ; sudo ejabberdctl list_cluster
docker exec -it ejabberd ejabberdctl registered_users corp.exemple.fr
```

## Openfire

```bash
sudo systemctl status openfire ; sudo tail -f /usr/share/openfire/logs/openfire.log      # .deb ; /opt/openfire avec le .rpm
curl -s -H "Authorization: $CLE_SECRETE_REST" https://xmpp.corp.exemple.fr:9091/plugins/restapi/v1/users | jq
curl -s -H "Authorization: $CLE_SECRETE_REST" -X DELETE https://xmpp.corp.exemple.fr:9091/plugins/restapi/v1/users/ancien.agent
```

```powershell
& "C:\Program Files\Openfire\bin\openfire-service.exe" /stop
& "C:\Program Files\Openfire\bin\openfire-service.exe" /start
```

## Snikket

```bash
cd /opt/snikket
sudo ./scripts/new-invite.sh --group default
sudo ./scripts/new-invite.sh --admin --group default
sudo ./scripts/backup.sh /srv/sauvegardes
sudo ./scripts/update.sh
sudo docker logs -f snikket
```

## MongooseIM

```bash
mongooseimctl status
mongooseimctl account registerUser --username jk --domain corp.exemple.fr --password 'MdpTemporaire2026!'
mongooseimctl account listUsers --domain corp.exemple.fr
mongooseimctl account removeUser --user ancien.agent@corp.exemple.fr
mongooseimctl roster listContacts --user jk@corp.exemple.fr
sudo tail -f /var/log/mongooseim/mongooseim.log
```
