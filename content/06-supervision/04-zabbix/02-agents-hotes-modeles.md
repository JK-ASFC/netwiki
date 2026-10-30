---
title: Agents, hôtes et modèles
description: Déployer Zabbix Agent 2 sous Linux et Windows (paramètres Server, ServerActive, Hostname, chiffrement PSK ou certificats), enregistrement automatique des hôtes par métadonnées, groupes d'hôtes, modèles officiels et personnalisés, éléments, macros, découverte de bas niveau (LLD), éléments dépendants et prétraitement.
tags: [zabbix, agent2, psk, autoregistration, modèles, macros, lld, prétraitement]
icon: settings-2
---

## Agent 2 sous Linux

```bash
sudo apt install zabbix-agent2 zabbix-agent2-plugin-*      # dépôt Zabbix
```

```ini /etc/zabbix/zabbix_agent2.conf (extrait)
Server=10.0.99.20,10.0.50.5                 # serveur et/ou proxy autorisés (mode passif)
ServerActive=10.0.99.20                     # destination des contrôles actifs (serveur ou proxy)
Hostname=srv-web-01.corp.exemple.fr         # doit correspondre exactement au nom de l'hôte dans Zabbix
HostMetadata=linux web production           # utilisé par l'enregistrement automatique
TLSConnect=psk
TLSAccept=psk
TLSPSKIdentity=PSK-srv-web-01
TLSPSKFile=/etc/zabbix/agent.psk
```

```bash
openssl rand -hex 32 | sudo tee /etc/zabbix/agent.psk && sudo chown zabbix: /etc/zabbix/agent.psk && sudo chmod 600 /etc/zabbix/agent.psk
sudo systemctl restart zabbix-agent2
```

La même identité et clé PSK se déclarent dans l'hôte (*Chiffrement*). Les **certificats** sont aussi possibles (`TLSCAFile`, `TLSCertFile`, `TLSKeyFile`).

## Agent 2 sous Windows

```powershell
msiexec /i zabbix_agent2-7.0.18-windows-amd64-openssl.msi /qn `
  SERVER=10.0.99.20 SERVERACTIVE=10.0.99.20 HOSTNAME=srv-ad-01.corp.exemple.fr `
  HOSTMETADATA="windows ad production" TLSCONNECT=psk TLSACCEPT=psk `
  TLSPSKIDENTITY=PSK-srv-ad-01 TLSPSKVALUE=<cle-hexadecimale>
Get-Service "Zabbix Agent 2"
```

Le MSI ouvre la règle de pare-feu (10050) ; déploiement par GPO, Intune ou SCCM.

## Enregistrement automatique

*Alerts → Actions → Autoregistration actions* : quand un agent actif se présente, Zabbix crée l'hôte selon ses métadonnées.

| Condition | Opérations |
| --- | --- |
| `Host metadata contains windows` | Ajouter au groupe « Serveurs Windows », lier le modèle « Windows by Zabbix agent active », activer le chiffrement PSK |
| `Host metadata contains linux` + `contains web` | Groupe « Serveurs web », modèles « Linux by Zabbix agent active » + « Nginx by Zabbix agent » |

Pour exiger le chiffrement des enregistrements : *Administration → General → Autoregistration* (PSK partagée).

## Hôtes et modèles

| Objet | Rôle |
| --- | --- |
| **Hôte** | Élément supervisé (serveur, équipement, application), avec des **interfaces** (agent, SNMP, IPMI, JMX) |
| **Groupe d'hôtes** | Organisation et **droits** des utilisateurs |
| **Modèle** | Ensemble réutilisable d'éléments, déclencheurs, graphiques, règles de découverte, tableaux de bord |
| **Élément** (*item*) | Une valeur collectée (`system.cpu.util`, `net.if.in[eth0]`, OID SNMP) |
| **Macro** | Variable (`{$CPU.UTIL.CRIT}`, `{$SNMP_COMMUNITY}`) définie au niveau global, modèle ou hôte |

Plus de 300 modèles officiels (systèmes, bases, serveurs web, équipements réseau, hyperviseurs, cloud). Préférez les versions **actives** des modèles d'agent (« … by Zabbix agent active ») pour les hôtes derrière un pare-feu.

### Personnaliser par macros

Ne modifiez pas les modèles officiels : surchargez leurs **macros** au niveau de l'hôte ou d'un modèle enfant (seuils, filtres de découverte), ou créez votre propre modèle qui les lie.

## Découverte de bas niveau (LLD)

Les règles LLD découvrent automatiquement les **systèmes de fichiers**, **interfaces réseau**, services Windows, conteneurs… et créent éléments et déclencheurs à partir de **prototypes**.

```text Filtre LLD (macros de modèle) — interfaces réseau utiles
{$NET.IF.IFNAME.MATCHES} = ^(eth|ens|Te|Gi|Po|Vlan).*
{$NET.IF.IFNAME.NOT_MATCHES} = (^lo$|^docker|^veth|^Nu)
```

## Éléments dépendants et prétraitement

Un élément **maître** récupère une donnée complète (JSON d'une API, sortie de commande), des éléments **dépendants** en extraient les valeurs via le **prétraitement** (JSONPath, expressions régulières, JavaScript, multiplicateur, « changement par seconde ») : une seule requête pour de nombreuses métriques.

```text Élément HTTP (maître) puis dépendant
Maître  : type « HTTP agent », URL https://api.interne/sante, type d'information Texte
Dépendant : prétraitement JSONPath $.base.connexions_actives → entier
```

## Tester une clé

```bash
zabbix_agent2 -t system.cpu.util                         # sur l'agent
zabbix_get -s srv-web-01.corp.exemple.fr -k agent.ping \
  --tls-connect psk --tls-psk-identity PSK-srv-web-01 --tls-psk-file agent.psk   # depuis le serveur
```
