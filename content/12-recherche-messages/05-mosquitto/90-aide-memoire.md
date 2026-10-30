---
title: Mosquitto (MQTT) — aide-mémoire des commandes
description: Commandes Mosquitto avec exemples — service et vérification, comptes (mosquitto_passwd), ACL, écouteurs TLS et WebSocket, clients mosquitto_pub et mosquitto_sub (QoS, retenue, filtres, TLS), sujets système $SYS, plugin de sécurité dynamique (mosquitto_ctrl), pont vers un autre broker, journaux.
tags: [aide-mémoire, mosquitto, mqtt, mosquitto_pub, mosquitto_sub, iot]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation-configuration|Mosquitto]].

## Service et configuration

```bash
sudo systemctl restart mosquitto && sudo systemctl status mosquitto
mosquitto -c /etc/mosquitto/mosquitto.conf -v        # premier plan, verbeux (service arrêté)
sudo journalctl -u mosquitto -f
```

```text
# /etc/mosquitto/conf.d/securite.conf
per_listener_settings false
allow_anonymous false
password_file /etc/mosquitto/passwd
acl_file /etc/mosquitto/acl

listener 1883 127.0.0.1

listener 8883
certfile /etc/mosquitto/certs/mqtt.exemple.fr.crt
keyfile /etc/mosquitto/certs/mqtt.exemple.fr.key
cafile /etc/ssl/certs/ca-certificates.crt
tls_version tlsv1.2

listener 9001
protocol websockets
```

## Comptes et ACL

```bash
sudo mosquitto_passwd -c /etc/mosquitto/passwd capteur-salle1      # création du fichier
sudo mosquitto_passwd /etc/mosquitto/passwd supervision            # ajout
sudo mosquitto_passwd -D /etc/mosquitto/passwd ancien              # suppression
sudo chown mosquitto: /etc/mosquitto/passwd && sudo chmod 600 /etc/mosquitto/passwd
sudo systemctl reload mosquitto
```

```text
# /etc/mosquitto/acl
user capteur-salle1
topic write batiment/salle1/#
user supervision
topic read batiment/#
topic read $SYS/#
pattern readwrite equipements/%c/#
```

## Clients

```bash
mosquitto_sub -h mqtt.exemple.fr -p 8883 -u supervision -P "$MDP" -t 'batiment/#' -v
mosquitto_sub -h 127.0.0.1 -t '$SYS/broker/clients/connected' -C 1 -u supervision -P "$MDP"
mosquitto_pub -h mqtt.exemple.fr -p 8883 -u capteur-salle1 -P "$MDP" -t batiment/salle1/temperature -m 21.5 -q 1
mosquitto_pub -h mqtt.exemple.fr -p 8883 -u capteur-salle1 -P "$MDP" -t batiment/salle1/etat -m en-ligne -r      # message retenu
mosquitto_pub -h mqtt.exemple.fr -p 8883 -u capteur-salle1 -P "$MDP" -t batiment/salle1/etat -n -r               # effacer le message retenu
mosquitto_sub --cafile ac-interne.crt --cert client.crt --key client.key -h mqtt.exemple.fr -p 8883 -t 'test/#'  # certificat client
```

## Sécurité dynamique (mosquitto_ctrl)

```bash
mosquitto_ctrl dynsec init /etc/mosquitto/dynamic-security.json admin-mqtt
mosquitto_ctrl -u admin-mqtt -P "$MDP" dynsec createClient capteur-salle2
mosquitto_ctrl -u admin-mqtt -P "$MDP" dynsec createRole capteurs
mosquitto_ctrl -u admin-mqtt -P "$MDP" dynsec addRoleACL capteurs publishClientSend 'batiment/#' allow
mosquitto_ctrl -u admin-mqtt -P "$MDP" dynsec addClientRole capteur-salle2 capteurs
mosquitto_ctrl -u admin-mqtt -P "$MDP" dynsec listClients
```

## Pont vers un autre broker

```text
connection pont-siege
address mqtt-siege.exemple.fr:8883
bridge_cafile /etc/ssl/certs/ca-certificates.crt
remote_username pont-paris
remote_password MotDePassePont
topic batiment/# out 1 "" paris/
```
