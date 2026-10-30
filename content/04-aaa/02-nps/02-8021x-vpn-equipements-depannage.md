---
title: 802.1X, VLAN dynamiques, VPN, équipements et dépannage
description: Cas d'usage de NPS — 802.1X filaire et Wi-Fi avec EAP-TLS ou PEAP, attributs de VLAN dynamique, authentification des ordinateurs et des utilisateurs, contournement MAB, VPN (RRAS, pare-feu tiers), administration des équipements Cisco, Aruba, Fortinet avec attributs de privilège, extension MFA Entra, journaux 6272/6273, codes de raison et problèmes fréquents.
tags: [nps, 802.1x, eap-tls, peap, vlan dynamique, vpn, mfa, dépannage]
icon: settings-2
---

## 802.1X : EAP-TLS ou PEAP

| Méthode | Client | Remarques |
| --- | --- | --- |
| **EAP-TLS** | Certificat ordinateur et/ou utilisateur (auto-inscription AD CS) | Recommandée : pas de mot de passe, résiste au vol d'identifiants |
| PEAP-MSCHAPv2 | Identifiant et mot de passe AD | Simple ; **Credential Guard** (Windows 11) empêche l'authentification unique MSCHAPv2 — préférer EAP-TLS |
| PEAP-TLS | Certificat dans un tunnel PEAP | Variante |

Le profil Wi-Fi/filaire des postes se déploie par **GPO** (*Stratégies de réseau sans fil / filaire (IEEE 802.3)*) ou Intune : SSID, WPA2/WPA3-Entreprise, méthode EAP, **validation du certificat serveur** (AC racine et nom du serveur NPS), mode d'authentification *ordinateur ou utilisateur*.

## VLAN dynamique

Dans la stratégie réseau → *Paramètres → Attributs RADIUS standard* :

| Attribut | Valeur |
| --- | --- |
| `Tunnel-Type` | Virtual LANs (VLAN) — 13 |
| `Tunnel-Medium-Type` | 802 (inclut tous les médias de style 802) — 6 |
| `Tunnel-Pvt-Group-ID` | `40` (numéro ou nom du VLAN) |

Une stratégie par population (Postes-Corp → VLAN 40, Téléphones → VLAN 30, Imprimantes en MAB → VLAN 50), ordonnées du plus précis au plus général. Côté commutateur, voir [[01-freeradius/08-8021x-vlan-dynamique-mab|802.1X, VLAN dynamique et MAB]].

### MAB (appareils sans 802.1X)

Les imprimantes et caméras s'authentifient par leur **adresse MAC** : créez des comptes AD dont le nom **et** le mot de passe sont l'adresse MAC (format attendu par le commutateur), dans un groupe dédié, avec une stratégie réservée au type de port Ethernet et au groupe MAB. Le MAB étant usurpable, placez ces appareils dans un VLAN restreint.

## VPN

Pour un concentrateur VPN (RRAS, pare-feu, Always On VPN), une stratégie réseau avec condition *Type de port NAS : Virtuel (VPN)* et groupe `GG-VPN` ; contraintes EAP (certificats) ou PEAP. Avec **RRAS**, NPS est utilisé localement ou à distance (*Fournisseur d'authentification RADIUS*) — voir [[07-rras/01-presentation-vpn|RRAS]].

**MFA** : l'**extension NPS pour Microsoft Entra MFA** ajoute une notification sur l'application Authenticator après la vérification du mot de passe (VPN, passerelle Bureau à distance). Elle ne fonctionne qu'avec PAP/MSCHAPv2 (pas avec EAP-TLS, qui est déjà une authentification forte).

## Administration des équipements

| Constructeur | Attribut renvoyé |
| --- | --- |
| Cisco IOS | Spécifique au fournisseur `Cisco-AV-Pair` = `shell:priv-lvl=15` (+ `Service-Type` = Administrative) |
| Aruba / HPE | `Aruba-Admin-Role` = `root` (VSA Aruba) ou `Service-Type` = Administrative |
| Fortinet | `Fortinet-Group-Name` = `Admins-Reseau` |
| Palo Alto | `PaloAlto-Admin-Role` |
| Juniper | `Juniper-Local-User-Name` = classe locale |

Une stratégie par rôle (lecture seule, opérateur, administrateur) selon les groupes AD, condition sur l'adresse des clients RADIUS équipements. NPS ne fait pas de **comptabilité de commandes** (TACACS+) : pour tracer chaque commande, utilisez un serveur TACACS+ ou les journaux des équipements.

## Journaux

| Événement (journal Sécurité) | Signification |
| --- | --- |
| **6272** | Accès accordé (stratégie appliquée, méthode d'authentification) |
| **6273** | Accès refusé, avec **code de raison** |
| 6274 | Demande abandonnée (mal formée) |
| 6276 | Utilisateur mis en quarantaine |

```powershell
# L'audit doit être actif : auditpol /set /subcategory:"Network Policy Server" /success:enable /failure:enable
Get-WinEvent -FilterHashtable @{ LogName='Security'; Id=6273 } -MaxEvents 20 |
  ForEach-Object { $_.Properties[0].Value, ($_.Message -split "`n" | Select-String 'Code de raison|Reason Code') }
```

| Code de raison | Cause |
| --- | --- |
| 16 | Authentification échouée (mauvais identifiants, compte inconnu) |
| 22 | Le client n'a pas pu être authentifié (méthode EAP non négociée, certificat client) |
| 48 | Aucune stratégie réseau ne correspond |
| 49 | Aucune stratégie de demande de connexion ne correspond |
| 65 | Accès refusé par la propriété *Appel entrant* du compte |
| 66 | Méthode d'authentification non autorisée par la stratégie |
| 262 / 265 | Certificat client non approuvé, révoqué ou CRL injoignable |

## Problèmes fréquents

| Symptôme | Cause | Solution |
| --- | --- | --- |
| Aucun événement NPS | Paquets non reçus (pare-feu, mauvaise adresse source du NAS), client RADIUS non déclaré | Capture `pktmon`/Wireshark, déclarer l'adresse source réelle |
| Raison 48 alors que la stratégie existe | Ordre des stratégies, condition (type de port, groupe) | Revoir l'ordre et les conditions |
| PEAP : le client refuse le serveur | Certificat NPS non approuvé, nom non validé | Certificat d'AD CS, profil client (AC + nom du serveur) |
| EAP-TLS : raison 262/265 | CRL injoignable depuis NPS | Publication CDP accessible (HTTP), cache CRL |
| Échec après mise à jour de 2024 | `Message-Authenticator` exigé, équipement non conforme | Mettre à jour l'équipement ou ajuster le paramètre par client |
| Ordinateurs refusés avant ouverture de session | Authentification utilisateur seule configurée | Mode *ordinateur ou utilisateur*, groupe des ordinateurs dans la stratégie |
| Paquets fragmentés perdus (EAP-TLS) | MTU, certificats volumineux | `Framed-MTU` = 1344 dans la stratégie, chaîne de certificats raisonnable |
