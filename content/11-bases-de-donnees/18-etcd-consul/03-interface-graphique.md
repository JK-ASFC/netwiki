---
title: Interface graphique
description: Interface web de Consul (port 8500/ui : Services, Nodes, Key/Value, Intentions, Access Controls, Peers) et outils graphiques pour etcd (etcd n'a pas d'interface officielle : etcdkeeper, extensions), avec emplacements de captures d'écran.
tags: [consul, etcd, interface graphique, captures]
icon: monitor
---

## Consul (`http://<serveur>:8500/ui`)

| Menu | Contenu |
| --- | --- |
| **Services** | Services, instances, état des contrôles de santé, étiquettes |
| **Nodes** | Agents, contrôles du nœud |
| **Key/Value** | Arborescence du magasin KV, édition |
| Intentions | Autorisations service à service (Connect) |
| **Access Controls** | Jetons, politiques, rôles (ACL) |

Avec les ACL activées, se connecter avec un jeton (bouton *Log in*).

<!-- CAPTURE: Consul — liste des services et état de santé | _assets/consul-services.png -->
<!-- CAPTURE: Consul — magasin clé-valeur | _assets/consul-kv.png -->

## etcd

Pas d'interface officielle : `etcdctl` reste l'outil de référence. Des outils tiers (etcdkeeper, extensions d'IDE) existent ; ne les exposez jamais sans TLS client — un accès à etcd équivaut à un accès administrateur à Kubernetes.
