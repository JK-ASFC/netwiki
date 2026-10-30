---
title: "Supervision SNMP : Linux, Windows et équipements réseau"
description: Rappels SNMP (versions, OID, MIB), configuration de snmpd sous Linux (v2c restreint et v3), SNMP sur Windows, configuration Cisco/Aruba/Fortinet, tests snmpwalk, utilisation des plugins Centreon en ligne de commande (CPU, mémoire, interfaces, seuils) et bonnes pratiques.
tags: [centreon, snmp, snmpv3, snmpd, cisco, interfaces, plugins, réseau]
icon: radio-tower
---

## Rappels SNMP

| Version | Sécurité | Recommandation |
| --- | --- | --- |
| v1 | Communauté en clair, compteurs 32 bits | À proscrire |
| **v2c** | Communauté en clair, compteurs 64 bits, requêtes *bulk* | Acceptable sur un réseau d'administration isolé, avec ACL |
| **v3** | Authentification (SHA) + chiffrement (AES) par utilisateur | **Recommandé** |

- L'agent écoute en **UDP 161** ; les traps partent vers **UDP 162**.
- Chaque valeur est identifiée par un **OID** (`.1.3.6.1.2.1.1.5.0` = `sysName`) décrit dans une **MIB**.
- Les plugins Centreon embarquent les OID nécessaires : pas besoin d'installer les MIB pour superviser (seulement pour lire les traps ou explorer).

## Linux : net-snmp

```bash
sudo dnf install net-snmp net-snmp-utils      # Debian : apt install snmpd snmp
```

### v2c restreint au collecteur

```ini /etc/snmp/snmpd.conf
# Écoute sur toutes les interfaces (Debian n'écoute que sur 127.0.0.1 par défaut)
agentAddress udp:161,udp6:[::1]:161

# Communauté en lecture seule, limitée à l'IP du collecteur Centreon
rocommunity Ch4ng3-M0i 10.0.10.40
rocommunity6 Ch4ng3-M0i ::1

# Informations système
sysLocation    Paris - Salle serveurs A - Baie 12
sysContact     supervision@exemple.fr

# Statistiques disque et processus (MIB UCD)
includeAllDisks 10%
proc sshd
proc httpd 20 1
```

### v3 (recommandé)

```bash
sudo systemctl stop snmpd
# Création d'un utilisateur v3 en lecture seule (SHA-256 / AES selon la version de net-snmp)
sudo net-snmp-create-v3-user -ro -a SHA-512 -A 'MotDePasseAuth-Long' -x AES -X 'MotDePassePriv-Long' centreon
sudo systemctl enable --now snmpd
```

La commande ajoute `rouser centreon` dans `snmpd.conf` et la clé dans `/var/lib/net-snmp/snmpd.conf`. Pour restreindre aussi par IP en v3, utilisez le pare-feu.

### Tester depuis le collecteur

```bash
snmpwalk -v2c -c 'Ch4ng3-M0i' 10.0.20.10 system
snmpwalk -v3 -l authPriv -u centreon -a SHA-512 -A 'MotDePasseAuth-Long' -x AES -X 'MotDePassePriv-Long' 10.0.20.10 .1.3.6.1.2.1.1
snmpget -v2c -c 'Ch4ng3-M0i' 10.0.20.10 .1.3.6.1.2.1.1.3.0        # sysUpTime
```

## Windows

Le service SNMP de Windows est **déprécié** (encore installable comme fonctionnalité à la demande) et ne supporte pas SNMPv3. Préférez la [[05-supervision-agents|supervision par agent]] (CMA, NSClient++) ou WinRM/WMI.

```powershell
# Si SNMP reste nécessaire
Add-WindowsCapability -Online -Name "SNMP.Client~~~~0.0.1.0"
# Communauté et gestionnaire autorisé (registre)
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\SNMP\Parameters\ValidCommunities" -Name "Ch4ng3-M0i" -Value 4 -PropertyType DWord   # 4 = lecture seule
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\SNMP\Parameters\PermittedManagers" -Name "1" -Value "10.0.10.40" -PropertyType String
Restart-Service SNMP
```

## Équipements réseau

### Cisco IOS / IOS-XE

```cisco
! ACL limitant l'accès SNMP aux collecteurs
ip access-list standard ACL-SNMP
 permit 10.0.10.40
 permit 10.0.10.41
 deny   any log
!
! SNMPv3
snmp-server view V-SUPERVISION iso included
snmp-server group G-CENTREON v3 priv read V-SUPERVISION access ACL-SNMP
snmp-server user centreon G-CENTREON v3 auth sha MotDePasseAuth-Long priv aes 128 MotDePassePriv-Long
!
! (ou v2c en lecture seule avec ACL)
snmp-server community Ch4ng3-M0i RO ACL-SNMP
!
snmp-server location Paris - Salle A - Baie 12
snmp-server contact supervision@exemple.fr
snmp-server ifindex persist                ! index d'interfaces stables après redémarrage
!
! Traps (voir l'article Traps SNMP)
snmp-server enable traps snmp linkdown linkup coldstart warmstart
snmp-server enable traps config
snmp-server enable traps envmon
snmp-server host 10.0.10.40 version 3 priv centreon
```

> [!TIP]
> `snmp-server ifindex persist` évite que les services d'interfaces changent de cible après un redémarrage. Les plugins Centreon identifient de toute façon les interfaces par **nom** (`--name --interface='^Gi1/0/48$'`), ce qui est plus robuste que l'index.

### Aruba CX

```cisco
snmp-server vrf mgmt
snmpv3 user centreon auth sha auth-pass plaintext MotDePasseAuth-Long priv aes priv-pass plaintext MotDePassePriv-Long
snmp-server system-location Paris - Salle A
```

### Fortinet FortiGate

```text
config system snmp sysinfo
    set status enable
    set location "Paris - DMZ"
end
config system snmp user
    edit "centreon"
        set notify-hosts 10.0.10.40
        set security-level auth-priv
        set auth-proto sha256
        set auth-pwd MotDePasseAuth-Long
        set priv-proto aes
        set priv-pwd MotDePassePriv-Long
    next
end
config system interface
    edit "port1"
        append allowaccess snmp
    next
end
```

## Utiliser les plugins en ligne de commande

Tester **toujours** un contrôle en ligne de commande sur le collecteur, sous l'utilisateur `centreon-engine`, avant de le configurer dans l'interface :

```bash
sudo su - centreon-engine -s /bin/bash

# Lister les modes d'un plugin
/usr/lib/centreon/plugins/centreon_linux_snmp.pl --plugin=os::linux::snmp::plugin --list-mode

# Aide d'un mode (options et seuils)
/usr/lib/centreon/plugins/centreon_linux_snmp.pl --plugin=os::linux::snmp::plugin --mode=cpu --help

# CPU Linux en v2c
/usr/lib/centreon/plugins/centreon_linux_snmp.pl --plugin=os::linux::snmp::plugin --mode=cpu \
  --hostname=10.0.20.10 --snmp-version=2c --snmp-community='Ch4ng3-M0i' \
  --warning-average=80 --critical-average=90

# Mémoire en v3
/usr/lib/centreon/plugins/centreon_linux_snmp.pl --plugin=os::linux::snmp::plugin --mode=memory \
  --hostname=10.0.20.10 --snmp-version=3 --snmp-username=centreon \
  --authprotocol=SHA512 --authpassphrase='MotDePasseAuth-Long' --privprotocol=AES --privpassphrase='MotDePassePriv-Long' \
  --warning-usage-prct=85 --critical-usage-prct=95

# Disques
/usr/lib/centreon/plugins/centreon_linux_snmp.pl --plugin=os::linux::snmp::plugin --mode=storage \
  --hostname=10.0.20.10 --snmp-version=2c --snmp-community='Ch4ng3-M0i' \
  --storage='^/$|^/var' --name --regexp --warning-usage=80 --critical-usage=90
```

### Interfaces d'un commutateur Cisco

```bash
ls /usr/lib/centreon/plugins/ | grep -i cisco            # nom exact du binaire installé
/usr/lib/centreon/plugins/centreon_cisco_standard_snmp.pl --plugin=network::cisco::standard::snmp::plugin --mode=interfaces \
  --hostname=10.0.1.1 --snmp-version=2c --snmp-community='Ch4ng3-M0i' \
  --interface='^GigabitEthernet1/0/48$' --name \
  --add-status --add-traffic --add-errors \
  --critical-status='%{admstatus} eq "up" and %{opstatus} ne "up"' \
  --warning-in-traffic=80 --critical-in-traffic=90 --warning-out-traffic=80 --critical-out-traffic=90 \
  --speed=1000

# Autres modes utiles du plugin Cisco : cpu, memory, environment (ventilateurs, alimentations, températures),
# hsrp, stack, spanning-tree, uptime, list-interfaces (découverte)
```

> [!NOTE]
> Le mode `interfaces` calcule le trafic **entre deux exécutions** (fichiers de cache dans `/var/lib/centreon/centplugins`) : le premier lancement affiche « Buffer creation ». Le pourcentage est calculé sur la vitesse de l'interface (`ifHighSpeed`) ou sur `--speed`.

### Syntaxe des seuils

| Seuil | Alerte si la valeur est… |
| --- | --- |
| `80` | > 80 (ou < 0) |
| `10:` | < 10 |
| `~:10` | > 10 |
| `10:20` | hors de [10 ; 20] |
| `@10:20` | dans [10 ; 20] |

Seuils conditionnels (expressions) : `--critical-status='%{state} ne "up"'`, `--warning-status='%{temperature} > 50'`.

### Options SNMP utiles

| Option | Usage |
| --- | --- |
| `--snmp-timeout=5` / `--snmp-retries=2` | Équipements lents |
| `--subsetleef=20` | Réduire la taille des requêtes *bulk* (équipements qui saturent) |
| `--snmp-force-getnext` | Équipements sans support du GETBULK |
| `--snmp-port=1161` | Port non standard |
| `--snmp-context-name` | Contextes SNMPv3 (VRF, instances) |

Dans les modèles Centreon, les options SNMP v3 se placent dans la macro d'hôte **`SNMPEXTRAOPTIONS`** : `--snmp-username=centreon --authprotocol=SHA512 --authpassphrase='…' --privprotocol=AES --privpassphrase='…'` (version SNMP de l'hôte = `3`).

## Bonnes pratiques

- SNMPv3 partout où c'est possible ; sinon v2c **avec ACL** et communautés non triviales, jamais `public`.
- Réseau d'administration dédié (VRF de management), pare-feu limitant l'UDP 161 aux collecteurs.
- Intervalle de 5 min pour la plupart des services ; 1-2 min pour les liens critiques.
- Limiter le nombre de services par équipement (interfaces utiles seulement : uplinks, serveurs, interconnexions) via la **découverte de services** avec règles.
- Superviser l'environnement matériel (`environment`), les sessions/HA des pare-feu, le spanning-tree, les piles de commutateurs.
