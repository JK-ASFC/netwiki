---
title: FreeRADIUS — aide-mémoire des commandes
description: Commandes FreeRADIUS avec exemples — vérification et mode débogage (radiusd -XC, freeradius -X), service, clients (clients.conf), utilisateurs (fichier authorize, SQL), tests d'authentification (radtest, radclient, eapol_test pour PEAP/EAP-TLS), comptabilité, certificats EAP (bootstrap, make), modules (ldap, sql, rest), statistiques (radmin, Status-Server), dictionnaires et attributs VLAN dynamiques.
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
