---
title: Présentation, installation et exploitation
description: Apache CloudStack — cloud IaaS multi-locataires (serveur de gestion Java, base MySQL, zones, pods, clusters, hôtes, stockage primaire et secondaire, machines virtuelles système), versions LTS, installation du serveur de gestion sur Ubuntu et EL (dépôt officiel), hôtes KVM (cloudstack-agent), création de la zone, réseaux de base et avancés, offres de service, comptes et domaines, API et CloudMonkey (cmk), mises à jour et dépannage.
tags: [cloudstack, apache cloudstack, cloud privé, iaas, kvm, cloudmonkey]
icon: info
---

**Apache CloudStack** (Apache Software Foundation, Apache 2.0) est une plateforme de **cloud IaaS** multi-locataires, appréciée des hébergeurs et opérateurs : interface web et API compatibles avec l'esprit d'AWS EC2, facturation à l'usage, réseaux isolés par client. Elle gère des hyperviseurs **KVM**, **XCP-ng/XenServer** et VMware vSphere.

| Niveau | Description |
| --- | --- |
| **Zone** | Centre de données (stockage secondaire, réseau physique) |
| Pod | Baie ou rangée : hôtes partageant un sous-réseau de gestion |
| Cluster | Hôtes d'un même hyperviseur et d'un même stockage primaire |
| Stockage **primaire** | Disques des VM (NFS, iSCSI, Ceph RBD, local) |
| Stockage **secondaire** | Modèles, ISO et instantanés (NFS ou objet S3) |
| VM système | Routeur virtuel (VR), VM de stockage secondaire (SSVM), VM proxy de console (CPVM) |

Versions : une branche **LTS** par an environ (4.19, 4.20…), maintenue 18 mois ; consulter `cloudstack.apache.org/downloads`.

## Serveur de gestion

Ubuntu 22.04/24.04 ou EL8/EL9, 4 vCPU, 8 Go, FQDN résolu, NTP, Java 17 (installé en dépendance).

```bash
# Ubuntu — dépôt officiel (<version> = 4.20 par exemple)
echo "deb https://download.cloudstack.org/ubuntu noble <version>" | sudo tee /etc/apt/sources.list.d/cloudstack.list
wget -O - https://download.cloudstack.org/release.asc | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/cloudstack.gpg
sudo apt update && sudo apt install cloudstack-management mysql-server
# EL9 : /etc/yum.repos.d/cloudstack.repo → baseurl=https://download.cloudstack.org/el/9/<version>/ puis dnf install cloudstack-management mysql-server
```

```ini /etc/mysql/mysql.conf.d/cloudstack.cnf
[mysqld]
server-id = 1
innodb_rollback_on_timeout = 1
innodb_lock_wait_timeout = 600
max_connections = 350
log-bin = mysql-bin
binlog-format = 'ROW'
```

```bash
sudo systemctl restart mysql
sudo cloudstack-setup-databases cloud:'MotDePasseCloud'@localhost --deploy-as=root:'MotDePasseRootMySQL'
sudo cloudstack-setup-management
# Stockage secondaire NFS : préparer le modèle des VM système (KVM) une fois
sudo /usr/share/cloudstack-common/scripts/storage/secondary/cloud-install-sys-tmplt \
  -m /mnt/secondaire -u https://download.cloudstack.org/systemvm/<version>/systemvmtemplate-<version>.0-x86_64-kvm.qcow2.bz2 -h kvm -F
```

Interface : `http://cloud-mgmt.corp.exemple.fr:8080/client` (compte `admin` / `password`, à changer immédiatement) — voir [[03-interface-graphique|interface graphique]].

## Hôtes KVM

```bash
sudo apt install cloudstack-agent qemu-kvm libvirt-daemon-system      # dnf install cloudstack-agent
# Pont « cloudbr0 » (gestion) et « cloudbr1 » (invités) à configurer avant l'ajout (netplan ou NetworkManager)
# libvirt doit écouter en TCP pour la migration : listen_tcp=1, auth_tcp="none" dans /etc/libvirt/libvirtd.conf (réseau de gestion isolé)
```

L'hôte est ensuite ajouté depuis l'interface (*Infrastructure → Hôtes → Ajouter*), le serveur de gestion configure l'agent.

## Zone et réseaux

L'assistant **Ajouter une zone** propose :

| Type | Usage |
| --- | --- |
| **Basique** | Réseau plat, isolation par groupes de sécurité (hébergement simple) |
| **Avancé** | Réseaux isolés par compte (VLAN/VXLAN), routeur virtuel (NAT, DHCP, pare-feu, VPN, répartiteur), VPC |

Étapes : réseau physique et étiquettes de trafic (`cloudbr0` gestion, `cloudbr1` invités/public), plages d'IP publiques, pod (IP de gestion réservées aux VM système), cluster KVM, hôte, stockage primaire (NFS) et secondaire (NFS), activation.

## Exploitation

- **Offres** : offres de service (CPU, mémoire), de disque, de réseau ; **modèles** (images avec cloud-init) et ISO.
- **Comptes et domaines** : arborescence de clients, rôles, limites de ressources, projets.
- **Utilisation** : serveur d'usage (`cloudstack-usage`) pour la facturation.
- **Kubernetes** : service CKS intégré (clusters Kubernetes en libre-service).
- **Mises à jour** : sauvegarde de la base `cloud`, mise à jour des paquets du serveur puis des agents, nouveau modèle des VM système enregistré avant la mise à jour.

## API et CloudMonkey

```bash
pip install cloudmonkey            # ou binaire « cmk » depuis github.com/apache/cloudstack-cloudmonkey
cmk set url http://cloud-mgmt.corp.exemple.fr:8080/client/api
cmk set apikey <clé> && cmk set secretkey <secret>    # clés générées dans Comptes → Utilisateurs
cmk sync
cmk list zones filter=name,id
cmk list virtualmachines filter=name,state,ipaddress
cmk deploy virtualmachine zoneid=<zone> serviceofferingid=<offre> templateid=<modèle> name=srv-web-01
```

Terraform : fournisseur `cloudstack/cloudstack`.

## Dépannage

| Symptôme | Cause et correction |
| --- | --- |
| VM système qui ne démarrent pas | Modèle système absent ou mauvaise version sur le stockage secondaire ; journaux `/var/log/cloudstack/management/management-server.log` |
| Hôte « Alert » / « Disconnected » | Agent arrêté, pont réseau mal nommé, libvirt : `/var/log/cloudstack/agent/agent.log` |
| Console qui ne s'ouvre pas | CPVM injoignable depuis le navigateur (IP publique, certificat de proxy de console) |
| Déploiement « Insufficient capacity » | Seuils de capacité de la zone, étiquettes d'hôte/de stockage des offres |
