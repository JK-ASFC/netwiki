---
title: Réseau, stockage, gMSA et Kubernetes
description: Exploiter les conteneurs Windows — pilotes réseau (NAT, transparent, l2bridge, overlay, l2tunnel), publication de ports et pare-feu, volumes et montages SMB, identité Active Directory avec les comptes de service gérés de groupe (gMSA, credential spec), journaux (LogMonitor), nœuds Windows dans Kubernetes (versions, nodeSelector, taints, CNI), mises à jour mensuelles des images, sécurité et dépannage.
tags: [conteneurs windows, réseau, gmsa, kubernetes, volumes, logmonitor, dépannage]
icon: settings-2
---

## Réseau

Le réseau des conteneurs Windows repose sur le **service HNS** (*Host Networking Service*) et le commutateur virtuel Hyper-V.

| Pilote | Comportement | Usage |
| --- | --- | --- |
| **nat** (défaut) | Réseau privé derrière une traduction d'adresses de l'hôte, publication de ports | Hôte autonome |
| **transparent** | Conteneurs directement sur le réseau physique (adresse IP propre, DHCP ou statique) | Applications qui doivent être joignables directement |
| **l2bridge** | Même sous-réseau que l'hôte, adresses MAC réécrites | Kubernetes (Flannel host-gw, Calico), SDN |
| **overlay** | VXLAN entre hôtes | Docker Swarm, Kubernetes (Flannel VXLAN) |
| l2tunnel | Tout le trafic passe par l'hôte | SDN Azure |

```powershell
docker network ls
docker network create -d transparent -o com.docker.network.windowsshim.vlanid=20 --subnet=10.0.20.0/24 --gateway=10.0.20.1 reseau-vlan20
docker run -d --network reseau-vlan20 --ip 10.0.20.150 registre.corp.exemple.fr/appli:1.0
Get-HnsNetwork | Select-Object Name, Type, Subnets      # module HNS (diagnostic)
```

Le **pare-feu Windows** de l'hôte s'applique au trafic publié ; DNS : les conteneurs utilisent les serveurs DNS de l'hôte par défaut (option `--dns`).

## Stockage

```powershell
docker volume create donnees-appli
docker run -d -v donnees-appli:C:\donnees registre.corp.exemple.fr/appli:1.0
docker run -d -v D:\Partage\Config:C:\config:ro registre.corp.exemple.fr/appli:1.0      # montage d'un dossier de l'hôte
```

Les **partages SMB** se montent sur l'hôte (`New-SmbGlobalMapping`) puis dans le conteneur ; c'est aussi le mécanisme des volumes persistants SMB sous Kubernetes (pilote CSI SMB).

## Identité : gMSA

Un conteneur n'est pas joint au domaine, mais peut s'authentifier sur le réseau (SQL Server, partages, Kerberos) sous l'identité d'un **compte de service géré de groupe** :

```powershell
# 1. Compte gMSA autorisé pour les hôtes de conteneurs (groupe AD des hôtes)
New-ADServiceAccount -Name gmsa-appli -DNSHostName gmsa-appli.corp.exemple.fr -PrincipalsAllowedToRetrieveManagedPassword "GG-Hotes-Conteneurs"
# 2. Sur l'hôte : spécification d'identifiants (module CredentialSpec)
Install-Module CredentialSpec
New-CredentialSpec -AccountName gmsa-appli
# 3. Exécution
docker run -d --security-opt "credentialspec=file://gmsa-appli.json" --hostname gmsa-appli registre.corp.exemple.fr/appli:1.0
```

Dans le conteneur, les processus exécutés en **Service réseau** ou **Système local** utilisent le gMSA pour les accès réseau. Voir [[01-active-directory/09-securite-durcissement|sécurité AD]] pour les comptes de service.

## Journaux

Les applications Windows écrivent dans le **journal d'événements** ou des fichiers, pas sur la sortie standard. **LogMonitor** (outil Microsoft) redirige journaux d'événements, fichiers et traces ETW vers la sortie standard, pour `docker logs` et les collecteurs Kubernetes :

```dockerfile Dockerfile (extrait)
COPY LogMonitor.exe LogMonitorConfig.json C:/LogMonitor/
ENTRYPOINT ["C:\\LogMonitor\\LogMonitor.exe", "C:\\ServiceMonitor.exe", "w3svc"]
```

## Kubernetes

Un cluster peut mêler nœuds **Linux** (plan de contrôle obligatoirement Linux) et nœuds **Windows** pour les charges Windows ([[04-kubernetes/01-presentation-architecture|Kubernetes]]) :

```yaml Déploiement ciblant les nœuds Windows
spec:
  template:
    spec:
      nodeSelector:
        kubernetes.io/os: windows
        node.kubernetes.io/windows-build: "10.0.20348"     # Windows Server 2022
      tolerations:
        - key: "os"
          operator: "Equal"
          value: "windows"
          effect: "NoSchedule"
      containers:
        - name: appli
          image: registre.corp.exemple.fr/appli:1.0
```

- Versions du nœud Windows et des images alignées (isolation processus).
- **Taint** sur les nœuds Windows pour que les charges Linux n'y soient pas planifiées par erreur.
- CNI compatibles : Calico, Flannel (host-gw/VXLAN), Antrea, Azure CNI (AKS).
- gMSA géré par le webhook *gMSA* de Kubernetes (ressource `GMSACredentialSpec`).

## Mises à jour et sécurité

- [ ] Images de base mises à jour **chaque mois** (correctifs « Patch Tuesday ») : reconstruire et redéployer les images, pas de mise à jour à l'intérieur du conteneur
- [ ] Isolation **Hyper-V** pour les charges non fiables ou multi-locataires
- [ ] Comptes non administrateurs dans le conteneur (`USER ContainerUser`)
- [ ] Registre privé et analyse des images ([[05-owasp-dependency-check|Trivy]] gère les images Windows)

## Dépannage

| Symptôme | Cause | Solution |
| --- | --- | --- |
| `The container operating system does not match the host operating system` | Version d'image différente de l'hôte en isolation processus | Image de la même version, ou `--isolation=hyperv` |
| Pas de réseau dans le conteneur | HNS, conflit de sous-réseau NAT, VPN de l'hôte | `Get-HnsNetwork`, redémarrer HNS, changer le sous-réseau NAT |
| Échec d'authentification avec gMSA | Hôte non autorisé à récupérer le mot de passe, nom d'hôte | Groupe de l'hôte, `Test-ADServiceAccount` sur l'hôte, `--hostname` = nom du gMSA |
| Téléchargement d'image très long | Images volumineuses | Registre local/miroir, images de base pré-tirées sur les hôtes |
