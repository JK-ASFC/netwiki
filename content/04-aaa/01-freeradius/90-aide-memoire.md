---
title: FreeRADIUS — aide-mémoire des commandes
description: Référence complète des commandes FreeRADIUS 3 avec exemples — installation (Debian/Ubuntu, RHEL, Alpine, FreeBSD, conteneur) et pare-feu, vérification et débogage (freeradius -X, filtrage, débogage ciblé d'un seul client avec radmin), clients, utilisateurs et VLAN dynamique, tests (radtest, radclient, Status-Server, déconnexion et CoA, eapol_test PEAP et EAP-TLS), Active Directory pour MSCHAPv2 (jonction Samba, winbind, ntlm_auth), base SQL (schéma, utilisateurs, groupes, sessions ouvertes), certificats EAP (contrôle, paramètres DH, TLS minimal), modules, journaux d'authentification et de comptabilité, statistiques et codes de réponse.
tags: [aide-mémoire, freeradius, radius, radtest, eap, 802.1x]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-presentation|FreeRADIUS]]. Le binaire s'appelle `freeradius` sous Debian/Ubuntu et `radiusd` sous RHEL ; la configuration est dans `/etc/freeradius/3.0/` ou `/etc/raddb/`.

## Vérification et débogage

```bash
sudo freeradius -XC                   # vérifier la configuration et quitter
sudo systemctl stop freeradius
sudo freeradius -X                    # premier plan, débogage complet (LE réflexe de dépannage)
sudo freeradius -X | tee /tmp/radius-debug.log
sudo systemctl start freeradius
sudo journalctl -u freeradius -f
```

## Clients (équipements réseau)

```unlang
# /etc/freeradius/3.0/clients.conf
client commutateurs-paris {
    ipaddr = 10.0.99.0/24
    secret = Sx9vT2qL7mWp4KzB8nRc
    shortname = sw-paris
    require_message_authenticator = yes
}
```

## Utilisateurs (fichier) et VLAN dynamique

```unlang
# /etc/freeradius/3.0/mods-config/files/authorize
amartin  Cleartext-Password := "MotDePasseTest"
         Reply-Message := "Bienvenue %{User-Name}"

# Autorisation MAB : l'adresse MAC comme identifiant, placement dans le VLAN 40
805ec0a1b2c3  Cleartext-Password := "805ec0a1b2c3"
         Tunnel-Type = VLAN,
         Tunnel-Medium-Type = IEEE-802,
         Tunnel-Private-Group-Id = "40"
```

## Tests

```bash
radtest amartin MotDePasseTest 127.0.0.1 0 testing123            # PAP (secret du client localhost)
radtest -t mschap amartin MotDePasseTest 127.0.0.1 0 testing123   # MS-CHAPv2
# radclient : attributs arbitraires, comptabilité, Status-Server
echo "User-Name=amartin,User-Password=MotDePasseTest" | radclient -x 10.0.10.81:1812 auth Sx9vT2qL7mWp4KzB8nRc
echo "Acct-Status-Type=Start,User-Name=amartin,Acct-Session-Id=1234" | radclient -x 10.0.10.81:1813 acct Sx9vT2qL7mWp4KzB8nRc
echo "Message-Authenticator = 0x00" | radclient -x 127.0.0.1:18121 status adminsecret
```

### EAP (PEAP, EAP-TLS) avec eapol_test

```bash
cat > peap.conf <<'EOF'
network={
    ssid="test"
    key_mgmt=WPA-EAP
    eap=PEAP
    identity="amartin"
    password="MotDePasseTest"
    phase2="auth=MSCHAPV2"
    ca_cert="/etc/freeradius/3.0/certs/ca.pem"
}
EOF
eapol_test -c peap.conf -a 10.0.10.81 -s Sx9vT2qL7mWp4KzB8nRc
# EAP-TLS : eap=TLS, client_cert, private_key, private_key_passwd dans le bloc network
```

## Certificats EAP

```bash
cd /etc/freeradius/3.0/certs
sudo vi ca.cnf server.cnf             # adapter organisation, durée, mots de passe
sudo make destroycerts && sudo make   # régénérer AC et certificat serveur de test
# En production : certificat serveur émis par l'AC interne, déployé et approuvé sur les postes
```

## Modules

```bash
ls /etc/freeradius/3.0/mods-enabled/
sudo ln -s ../mods-available/ldap /etc/freeradius/3.0/mods-enabled/ldap
sudo ln -s ../mods-available/sql /etc/freeradius/3.0/mods-enabled/sql
sudo freeradius -XC
# Recherche LDAP équivalente à celle du module, pour vérifier filtres et droits
ldapsearch -x -H ldaps://dc01.corp.exemple.fr -D "CN=svc-radius,OU=Services,DC=corp,DC=exemple,DC=fr" -W -b "DC=corp,DC=exemple,DC=fr" "(sAMAccountName=amartin)" memberOf
```

## Statistiques et administration

```bash
sudo radmin                               # socket de contrôle (sites-enabled/control-socket)
# radmin> show client list
# radmin> stats client auth 10.0.99.10
# radmin> debug level 2
# radmin> hup
sudo radwho                               # sessions (si comptabilité radutmp)
sudo radlast
```

## Codes de réponse

| Paquet | Sens |
| --- | --- |
| `Access-Accept` | Authentification réussie (avec attributs : VLAN, ACL, rôle) |
| `Access-Reject` | Refus : mot de passe, utilisateur inconnu, politique |
| `Access-Challenge` | Échange en cours (EAP) |
| Aucune réponse | Client non déclaré, secret partagé faux (« Ignoring request from unknown client »), pare-feu UDP 1812 |

## Installation

```bash
sudo apt install freeradius freeradius-utils freeradius-ldap freeradius-postgresql      # Debian / Ubuntu
sudo dnf install freeradius freeradius-utils freeradius-ldap freeradius-postgresql      # RHEL / Rocky / Alma
sudo apk add freeradius freeradius-eap freeradius-ldap freeradius-utils                 # Alpine
sudo pkg install freeradius3 && sudo sysrc radiusd_enable=YES                           # FreeBSD
docker run -d --name freeradius -p 1812-1813:1812-1813/udp -v /srv/raddb:/etc/raddb freeradius/freeradius-server:latest-3.2
sudo systemctl enable --now freeradius                                                  # RHEL : radiusd
sudo firewall-cmd --permanent --add-service=radius && sudo firewall-cmd --reload        # UDP 1812 et 1813
sudo ufw allow 1812:1813/udp
```

## Débogage ciblé (production)

```bash
# Filtrer la sortie de débogage
sudo freeradius -X 2>&1 | grep -E "Login (OK|incorrect)|Sent Access-(Accept|Reject)|ERROR|WARNING"
# Déboguer un seul équipement sans arrêter le service (socket de contrôle activé)
sudo radmin -e "debug condition '(Packet-Src-IP-Address == 10.0.99.10)'"
sudo radmin -e "debug file /var/log/freeradius/debug-sw-paris.log"
sudo radmin -e "debug level 4"
sudo tail -f /var/log/freeradius/debug-sw-paris.log
sudo radmin -e "debug condition"                      # sans argument : désactiver
sudo radmin -e "debug level 0"
```

## Déconnexion et changement d'autorisation (CoA, RFC 5176)

```bash
# Déconnecter une session sur le commutateur (port CoA 3799 ; Cisco IOS utilise 1700 par défaut)
echo "User-Name=amartin,Acct-Session-Id=0000002A" | radclient -x 10.0.99.10:3799 disconnect Sx9vT2qL7mWp4KzB8nRc
# Forcer une réauthentification (attribut Cisco)
echo 'User-Name=amartin,Cisco-AVPair="subscriber:command=reauthenticate"' | radclient -x 10.0.99.10:1700 coa Sx9vT2qL7mWp4KzB8nRc
# Test d'un autre type d'authentification
radtest -t eap-md5 amartin MotDePasseTest 127.0.0.1 0 testing123
```

## Active Directory pour MSCHAPv2 (Samba et winbind)

```bash
sudo apt install samba winbind krb5-user                 # RHEL : samba-winbind samba-winbind-clients
sudo net ads join -U adm-jonction                        # smb.conf : workgroup = CORP, security = ads, realm = CORP.EXEMPLE.FR
sudo systemctl restart winbind
wbinfo -t                                                # canal sécurisé avec le domaine
wbinfo -u | head
sudo usermod -aG winbindd_priv freerad                   # accès de FreeRADIUS au socket winbind (RHEL : radiusd)
ntlm_auth --request-nt-key --domain=CORP --username=amartin --password='MotDePasseAD'   # « NT_STATUS_OK » attendu
radtest -t mschap amartin 'MotDePasseAD' 127.0.0.1 0 testing123
```

## Base SQL

```bash
# Schéma (PostgreSQL), puis activer le module sql
sudo -u postgres psql -c "CREATE USER radius WITH PASSWORD 'MotDePasseBase';" -c "CREATE DATABASE radius OWNER radius;"
psql -h 127.0.0.1 -U radius radius < /etc/freeradius/3.0/mods-config/sql/main/postgresql/schema.sql
```

```sql
-- Utilisateur, réponse (VLAN), groupe
INSERT INTO radcheck (username, attribute, op, value) VALUES ('amartin', 'Cleartext-Password', ':=', 'MotDePasseTest');
INSERT INTO radusergroup (username, groupname, priority) VALUES ('amartin', 'reseau', 1);
INSERT INTO radgroupreply (groupname, attribute, op, value) VALUES ('reseau', 'Tunnel-Private-Group-Id', ':=', '30');
-- Sessions ouvertes (comptabilité)
SELECT username, nasipaddress, nasportid, acctstarttime FROM radacct WHERE acctstoptime IS NULL ORDER BY acctstarttime DESC;
```

## Certificats EAP : contrôles

```bash
openssl x509 -in /etc/freeradius/3.0/certs/server.pem -noout -subject -issuer -enddate -ext extendedKeyUsage,subjectAltName
openssl verify -CAfile /etc/freeradius/3.0/certs/ca.pem /etc/freeradius/3.0/certs/server.pem
sudo openssl dhparam -out /etc/freeradius/3.0/certs/dh 2048
grep -nE "tls_min_version|tls_max_version|private_key_file|certificate_file|ca_file" /etc/freeradius/3.0/mods-enabled/eap
```

## Journaux

```bash
sudo tail -f /var/log/freeradius/radius.log                       # « auth = yes » dans radiusd.conf pour journaliser chaque connexion
sudo ls /var/log/freeradius/radacct/                              # un dossier par client, fichiers detail-AAAAMMJJ
sudo tail -f /var/log/freeradius/radacct/10.0.99.10/detail-$(date +%Y%m%d)
```
