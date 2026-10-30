---
title: Gestion à grande échelle et sécurité
description: Gérer des dizaines à des milliers de pairs WireGuard (scripts, Ansible, interfaces wg-easy, WireGuard-UI, Firezone, Netmaker, Defguard), ajouter une authentification utilisateur et du MFA, restreindre les droits par pair, faire tourner les clés, verrouiller les tunnels Windows et bonnes pratiques.
tags: [wireguard, gestion, mfa, firezone, netmaker, wg-easy, sécurité, rotation des clés]
icon: settings-2
---

## Le défi : pas de gestion intégrée

WireGuard ne fournit que le tunnel. À l'échelle d'une entreprise, il faut ajouter :

| Besoin | Solution |
| --- | --- |
| Attribuer des adresses et produire les profils | Script, Ansible, interface web |
| Authentifier une **personne** (pas seulement un appareil) et exiger du **MFA** | Plate-forme de gestion (Firezone, Defguard, Netbird, Tailscale/Headscale) |
| Révoquer rapidement | Suppression du pair (à chaud) |
| Contrôler les accès par profil | Pare-feu par adresse de pair / groupes |
| Journaliser | Poignées de main, flux (conntrack, pare-feu) |

## Script simple d'ajout de pair

```bash /usr/local/sbin/wg-ajouter-pair.sh
#!/bin/bash
# Usage : wg-ajouter-pair.sh <nom> <ip-dans-le-tunnel>
set -euo pipefail
NOM=$1; IP=$2; IFACE=wg0; DIR=/etc/wireguard/pairs
SERVEUR_PUB=$(cat /etc/wireguard/serveur.pub); ENDPOINT=vpn.exemple.fr:51820
umask 077; mkdir -p "$DIR"
wg genkey | tee "$DIR/$NOM.key" | wg pubkey > "$DIR/$NOM.pub"
wg genpsk > "$DIR/$NOM.psk"
# Ajout à chaud + persistance
wg set $IFACE peer "$(cat "$DIR/$NOM.pub")" preshared-key "$DIR/$NOM.psk" allowed-ips "$IP/32"
cat >> /etc/wireguard/$IFACE.conf <<EOF

# $NOM ($(date +%F))
[Peer]
PublicKey = $(cat "$DIR/$NOM.pub")
PresharedKey = $(cat "$DIR/$NOM.psk")
AllowedIPs = $IP/32
EOF
# Profil client
cat > "$DIR/$NOM.conf" <<EOF
[Interface]
PrivateKey = $(cat "$DIR/$NOM.key")
Address = $IP/32
DNS = 10.0.10.53, corp.exemple.fr

[Peer]
PublicKey = $SERVEUR_PUB
PresharedKey = $(cat "$DIR/$NOM.psk")
Endpoint = $ENDPOINT
AllowedIPs = 10.0.0.0/8
PersistentKeepalive = 25
EOF
rm -f "$DIR/$NOM.key"          # la clé privée n'est conservée que dans le profil à remettre
echo "Profil : $DIR/$NOM.conf"
```

> [!NOTE]
> Ce script génère la clé privée **côté serveur** (pratique, mais l'administrateur la voit). Pour une meilleure hygiène, demandez à l'utilisateur de générer sa paire de clés dans l'application et de vous transmettre **uniquement** la clé publique.

## Ansible

```yaml roles/wireguard/templates/wg0.conf.j2
[Interface]
Address = {{ wg_address }}
ListenPort = 51820
PrivateKey = {{ wg_private_key }}

{% for pair in wg_pairs %}
# {{ pair.nom }}
[Peer]
PublicKey = {{ pair.cle_publique }}
AllowedIPs = {{ pair.allowed_ips | join(', ') }}
{% if pair.endpoint is defined %}Endpoint = {{ pair.endpoint }}
{% endif %}
{% endfor %}
```

```yaml roles/wireguard/handlers/main.yml
- name: synchroniser wireguard
  ansible.builtin.shell: wg syncconf wg0 <(wg-quick strip wg0)
  args:
    executable: /bin/bash
```

## Interfaces et plates-formes

| Outil | Type | Points forts |
| --- | --- | --- |
| **wg-easy** | Interface web légère (Docker) | Création de clients, QR codes, statistiques ; idéal pour un petit site |
| **WireGuard-UI** | Interface web | Gestion des pairs et de la configuration serveur |
| **Firezone** | Plate-forme d'accès (ZTNA) | SSO (OIDC/SAML), MFA, politiques par groupe et ressource, clients toutes plates-formes |
| **Defguard** | Plate-forme open source | SSO, MFA à la connexion VPN, gestion des appareils |
| **Netbird**, **Netmaker** | Maillage | Réseaux maillés auto-configurés, ACL, SSO |
| [[05-tailscale-headscale/01-presentation-installation\|Tailscale / Headscale]] | Maillage SaaS / auto-hébergé | NAT traversal, MagicDNS, ACL |
| Pare-feu (OPNsense, pfSense) | Intégré | Gestion graphique, règles de pare-feu par pair |

```bash
# wg-easy (exemple)
docker run -d --name wg-easy --restart unless-stopped \
  -e WG_HOST=vpn.exemple.fr -e INSECURE=false \
  -v /srv/wg-easy:/etc/wireguard \
  -p 51820:51820/udp -p 127.0.0.1:51821:51821/tcp \
  --cap-add NET_ADMIN --cap-add SYS_MODULE \
  --sysctl net.ipv4.ip_forward=1 --sysctl net.ipv4.conf.all.src_valid_mark=1 \
  ghcr.io/wg-easy/wg-easy
# Interface publiée derrière un reverse proxy HTTPS avec authentification
```

## Authentification utilisateur et MFA

WireGuard « nu » authentifie l'**appareil** (qui détient la clé). Pour lier l'accès à une **personne** et au **MFA** :

- utiliser une plate-forme qui ne pousse la configuration (ou n'active le pair) qu'après une authentification SSO + MFA, avec une durée de validité (Firezone, Defguard, Tailscale) ;
- ou combiner : WireGuard pour l'accès réseau + authentification MFA au niveau des applications (SSO) ;
- ou, si le MFA au niveau VPN est une exigence stricte avec des outils simples : préférer [[02-openvpn/04-authentification-ldap-radius-mfa\|OpenVPN + RADIUS]] ou [[04-strongswan/04-acces-distant-ikev2\|IPsec EAP]].

## Sécurité

| Mesure | Détail |
| --- | --- |
| Une clé par appareil | Jamais de profil partagé entre plusieurs personnes ou appareils |
| PresharedKey | Couche symétrique supplémentaire (résistance post-quantique) |
| Restreindre par pair | Pare-feu `forward` selon l'adresse du pair (voir [[02-acces-distant]]) |
| Révocation | `wg set wg0 peer <clé> remove` + suppression du fichier ; inventaire des pairs à jour (nom, propriétaire, date) |
| Rotation des clés | Nouvelle paire de clés (et PSK) par appareil périodiquement ou lors d'un incident ; WireGuard renouvelle déjà les clés de session toutes les 2 minutes |
| Clé privée du serveur | `chmod 600`, sauvegarde chiffrée ; sa compromission impose de reconfigurer **tous** les clients |
| Port | 51820 par défaut ; un autre port n'apporte qu'une discrétion relative (le serveur ne répond pas aux paquets non authentifiés) |

### Windows : empêcher les utilisateurs de modifier les tunnels

- Installer les tunnels comme **services** (`wireguard.exe /installtunnelservice`) et ne pas donner les droits d'administration.
- Clé de registre `HKLM\Software\WireGuard\LimitedOperatorUI = 1` : les membres du groupe *Opérateurs de configuration réseau* peuvent activer/désactiver les tunnels sans voir ni modifier les clés.
- Déploiement par Intune/GPO du MSI et des fichiers de configuration dans `C:\Program Files\WireGuard\Data\Configurations` (chiffrés DPAPI après import).

## Bonnes pratiques

- [ ] Inventaire des pairs (nom, propriétaire, appareil, date, adresse) synchronisé avec la configuration
- [ ] Un /32 par pair, plages distinctes par profil (admins, utilisateurs, agences)
- [ ] Pare-feu `forward` explicite, politique par défaut `drop`
- [ ] PresharedKey sur les accès sensibles
- [ ] Procédure de révocation testée (perte de portable)
- [ ] Supervision des dernières poignées de main des liens site à site
- [ ] Sauvegarde chiffrée de `/etc/wireguard`
