---
title: Couches 5 et 6 — Session et Présentation
description: Diagnostic des couches hautes OSI — couche 5 Session (NetBIOS/NBT, SMB, RPC et endpoint mapper, PPTP déprécié) et couche 6 Présentation (TLS 1.2/1.3, certificats X.509 et PKI, SSL/TLS, encodages UTF-8/ANSI/Windows-1252, MIME, XDR) ; symptômes (lecteur réseau déconnecté, serveur RPC indisponible, certificat expiré ou non approuvé, accents cassés, vieille appli qui ne se connecte plus en HTTPS) et commandes.
tags: [osi, session, présentation, smb, rpc, tls, certificats, pki, encodage, ntp, diagnostic]
icon: layers
---

> [!NOTE]
> En TCP/IP réel, les couches 5, 6 et 7 sont souvent fondues dans l'applicatif. Cette séparation aide néanmoins à **isoler la cause précise** lors du diagnostic.

## Couche 5 — Session

**Rôle** : ouvrir, maintenir et fermer les **sessions** de dialogue entre deux applications ; gérer les reprises et la synchronisation. Côté infrastructure : sessions vers les partages SMB/NFS, appels RPC vers l'annuaire (Active Directory), sessions longues qui doivent survivre aux bascules.

### Technologies et protocoles

| Techno | Points clés |
| --- | --- |
| **NetBIOS / NBT** | Nommage et sessions Windows historiques ; UDP 137/138, TCP 139. Broadcasts NBT non routés entre VLAN |
| **SMB** | Session d'accès aux partages, imprimantes, IPC. SMB 1 (obsolète, **désactiver**), SMB 2, SMB 3 (chiffrement). TCP 445 ; session coupée par inactivité ou veille |
| **RPC** | Appels distants (AD, Exchange on-prem, services Windows). Endpoint mapper TCP **135** puis ports dynamiques 49152–65535 ; sensible aux pare-feu |
| **PPTP (déprécié)** | VPN Windows historique (TCP 1723), chiffrement faible (MS-CHAPv2 compromis) → remplacer par IKEv2/IPsec ou WireGuard |

### Symptômes → action

| Symptôme | Cause | Action |
| --- | --- | --- |
| **Lecteur réseau déconnecté** | Session SMB expirée (veille, coupure Wi-Fi, timeout) | Voir l'état, reconnecter |
| **« Le serveur RPC n'est pas disponible »** | Service RPC arrêté, ports dynamiques 49152+ bloqués, DNS en échec | Tester l'endpoint mapper (135) |
| **« Connexions multiples au même serveur non autorisées »** | Plusieurs sessions SMB avec des identifiants différents | Repartir propre |

```bash
net use                            # état de tous les lecteurs mappés (Status = Disconnected)
net use * /delete                  # supprimer toutes les sessions, puis reconnecter
Test-NetConnection <DC> -Port 135  # endpoint mapper RPC
```

> [!WARNING]
> **Côté cyber** — SMB 1 est le vecteur de WannaCry/NotPetya : s'assurer qu'il est désactivé sur tous les postes. PPTP est cryptographiquement cassé, à proscrire en production. Le lecteur réseau peut apparaître dans l'Explorateur tout en étant inaccessible : **session L5 expirée** même si L3-L4 sont OK.

## Couche 6 — Présentation

**Rôle** : **traduire, chiffrer et mettre en forme** les données entre systèmes : chiffrement TLS, encodage des caractères, compression. Côté infrastructure : certificats TLS des services, PKI interne, encodage entre systèmes hétérogènes, synchronisation d'horloge (NTP) indispensable à TLS et Kerberos.

### Technologies et protocoles

| Techno | Points clés |
| --- | --- |
| **TLS 1.2 / 1.3** | Chiffrement au-dessus de TCP. Exige : certificat valide (AC de confiance), **horloge synchronisée**, chaîne complète (racine + intermédiaires). TLS 1.3 = handshake 1 RTT ; TLS 1.0/1.1 désactivés depuis 2020 (RFC 8996) |
| **Certificats X.509 / PKI** | Lie une identité (FQDN, utilisateur) à une clé publique, signé par une AC. En entreprise : PKI interne (AD CS) déployée par GPO/Intune. Expiré ou AC inconnue = « Non approuvé » |
| **SSL / TLS (confusion)** | SSL = ancêtre (2.0/3.0 compromis). Dans les logs, chercher `TLSv1.2` / `TLSv1.3` |
| **Encodages** | UTF-8 (universel, multi-octets) vs Windows-1252/ANSI (1 octet). UTF-8 lu en ANSI = caractères corrompus (`Ã©` au lieu de `é`) |
| **MIME** | Type et encodage des pièces jointes et du corps (`Content-Type`, `Content-Transfer-Encoding: base64`) ; aussi en HTTP |
| **XDR** | Sérialisation indépendante de l'architecture (big/little-endian) pour RPC/NFS |

### Symptômes → action

| Symptôme | Cause | Action |
| --- | --- | --- |
| **« Certificat expiré / non approuvé »** | **Horloge désynchronisée**, AC racine absente du magasin, ou certificat réellement expiré | **Vérifier l'heure en premier** |
| **Accents cassés dans un CSV / mail** | UTF-8 lu en Windows-1252 (ou l'inverse) | Ré-ouvrir / ré-exporter avec le bon encodage |
| **Vieille appli qui ne se connecte plus en HTTPS** | TLS 1.0/1.1 désactivés côté serveur, client sans TLS 1.2 | Mettre à jour l'application (ne pas réactiver TLS 1.0/1.1) |

```bash
w32tm /query /status      # état de l'horloge NTP
w32tm /resync             # forcer la resynchronisation
certlm.msc                # magasin de certificats machine (Windows)
# Console du navigateur (F12) : détail des erreurs TLS
```

> [!WARNING]
> **Côté cyber** — horloge fausse = **TLS cassé ET Kerberos cassé** simultanément : NTP est critique. SSL inspection : si le certificat racine du proxy manque côté poste → erreur TLS alors que le site est sain. Réactiver TLS 1.0/1.1 est une régression de sécurité : mettre à jour l'application est la bonne approche.

> [!WARNING]
> Piège fréquent : Excel ouvre les CSV en ANSI par défaut. Utiliser **Données → À partir du texte/CSV** pour choisir UTF-8 explicitement.

Suite : [[07-couche-7-application|Couche 7 — Application]]. Commandes : [[90-aide-memoire|aide-mémoire]].
