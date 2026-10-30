---
title: "Configuration de base : clients, utilisateurs et tests"
description: Déclarer les NAS dans clients.conf, syntaxe du fichier users (check items, reply items, opérateurs), groupes et DEFAULT, mots de passe hachés, tests avec radtest, radclient et eapol_test.
tags: [freeradius, clients.conf, users, radtest, radclient, configuration]
icon: settings
---

## clients.conf : les équipements autorisés

FreeRADIUS **ignore** tout paquet provenant d'une IP non déclarée (`Ignoring request from unknown client`).

```radius clients.conf
# Un équipement précis
client sw-core-01 {
    ipaddr = 10.0.1.1
    secret = "Ch@ng3-M0i-Secret-Long-Et-Aleatoire"
    shortname = sw-core-01
    nas_type = cisco
    require_message_authenticator = yes
    limit_proxy_state = yes
}

# Un réseau entier d'équipements partageant le même secret
client switches-acces {
    ipaddr = 10.0.1.0/24
    secret = "Un-Autre-Secret-De-32-Caracteres-Min"
    shortname = switches-acces
}

# Contrôleurs Wi-Fi
client wlc {
    ipaddr = 10.0.80.10
    secret = "Secret-WLC-Different"
    shortname = wlc
    virtual_server = wifi          # traité par un serveur virtuel dédié (voir architecture)
}

# IPv6
client fw-v6 {
    ipv6addr = 2001:db8:1::1
    secret = "Secret-Pare-Feu"
}
```

| Paramètre | Rôle |
| --- | --- |
| `ipaddr` / `ipv4addr` / `ipv6addr` | Adresse ou réseau (CIDR) du NAS |
| `secret` | Secret partagé (identique sur le NAS) |
| `shortname` | Nom court, disponible dans `%{Client-Shortname}` et les journaux |
| `nas_type` | Type de NAS (utilisé par `checkrad` pour les sessions simultanées) |
| `require_message_authenticator` | `yes` : refuse les Access-Request sans `Message-Authenticator` (protection BlastRADIUS) ; `auto` (3.2.5+) |
| `limit_proxy_state` | `yes` : refuse les paquets contenant `Proxy-State` sans `Message-Authenticator` |
| `virtual_server` | Serveur virtuel qui traite les requêtes de ce client |
| `response_window` | Délai de réponse maximal |

> [!TIP]
> Générez des secrets longs et aléatoires (`openssl rand -base64 24`), **un par famille d'équipements**, et stockez-les dans un coffre. Certains équipements limitent la longueur (souvent 32 à 64 caractères) ou les caractères spéciaux : testez avant de déployer.

Clients en base SQL (dynamiques) : voir [[05-sql]]. Inclure un fichier par site :

```radius clients.conf
$INCLUDE clients.d/
```

## Le fichier users (module files)

Format : une entrée par utilisateur, première ligne = **nom + conditions (check items)**, lignes indentées suivantes = **attributs de réponse (reply items)**.

```radius mods-config/files/authorize
# Utilisateur simple
alice   Cleartext-Password := "Mot2Passe!"
        Reply-Message := "Bienvenue %{User-Name}",
        Session-Timeout := 28800

# Mot de passe haché (compatible PAP et EAP-TTLS/PAP, pas MS-CHAPv2)
bruno   SHA2-Password := "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
carla   Crypt-Password := "$6$rounds=5000$selsel$hash..."
# Hash NT (compatible PEAP-MSCHAPv2) : généré par « smbencrypt motdepasse »
david   NT-Password := 0x8846F7EAEE8FB117AD06BDD830B7586C

# Conditions supplémentaires : uniquement depuis les bornes Wi-Fi
eve     Cleartext-Password := "Pass", NAS-IP-Address == 10.0.80.10
        Tunnel-Type = VLAN,
        Tunnel-Medium-Type = IEEE-802,
        Tunnel-Private-Group-Id = "40"

# Compte désactivé
frank   Auth-Type := Reject
        Reply-Message := "Compte désactivé"

# Entrée par défaut appliquée à tous (Fall-Through : continue l'évaluation)
DEFAULT Framed-Protocol == PPP
        Framed-Protocol = PPP,
        Fall-Through = Yes
```

### Opérateurs

| Opérateur | Dans les check items | Dans les reply items |
| --- | --- | --- |
| `:=` | Définit (remplace) l'attribut de contrôle | Remplace la valeur dans la réponse |
| `==` | Compare : l'attribut de la requête doit être égal | — |
| `!=`, `>`, `>=`, `<`, `<=` | Comparaisons | — |
| `=~`, `!~` | Expression régulière | — |
| `=*`, `!*` | L'attribut existe / n'existe pas | — |
| `=` | Ajoute si absent | Ajoute si absent |
| `+=` | Ajoute toujours | Ajoute toujours (attribut multivalué) |

> [!WARNING]
> Erreur classique : écrire `User-Password == "secret"` ou `Password = "secret"`. Le mot de passe de référence est un **attribut de contrôle** : `Cleartext-Password := "secret"`.

### Ordre d'évaluation

- Les entrées sont lues **de haut en bas** ; la première qui correspond est appliquée et l'évaluation s'arrête, sauf si `Fall-Through = Yes`.
- `DEFAULT` correspond à n'importe quel utilisateur.

### Groupes Unix ou de fichier

```radius
DEFAULT Group == "admins"
        Service-Type = Administrative-User
```

(nécessite le module `unix` ou SQL pour les groupes). Pour de vrais groupes, préférez **SQL** ou **LDAP** ([[05-sql]], [[06-ldap-active-directory]]).

## Prise en compte des modifications

FreeRADIUS lit ses fichiers au démarrage :

```bash
sudo freeradius -XC && sudo systemctl restart freeradius
# Ou rechargement à chaud (certains modules seulement, dont files) :
sudo systemctl reload freeradius        # envoie SIGHUP
```

## Outils de test

### radtest (PAP, CHAP, MS-CHAPv2)

```bash
# radtest [-t pap|chap|mschap|eap-md5] utilisateur motdepasse serveur[:port] nas-port-number secret
radtest alice 'Mot2Passe!' 127.0.0.1 0 testing123
radtest -t mschap david password 10.0.10.31 0 'Secret'
radtest -x alice 'Mot2Passe!' 10.0.10.31:1812 0 'Secret'      # -x : affichage détaillé
```

### radclient (n'importe quel paquet)

```bash
# Access-Request avec attributs choisis
echo 'User-Name = "aa-bb-cc-dd-ee-ff", User-Password = "aa-bb-cc-dd-ee-ff", Service-Type = Call-Check, Calling-Station-Id = "AA-BB-CC-DD-EE-FF", NAS-IP-Address = 10.0.1.1' \
  | radclient -x 127.0.0.1 auth testing123

# Accounting Start
cat <<'EOF' | radclient -x 127.0.0.1:1813 acct testing123
User-Name = "alice"
Acct-Status-Type = Start
Acct-Session-Id = "0000ABCD"
NAS-IP-Address = 10.0.1.1
Framed-IP-Address = 10.0.40.50
EOF

# Status-Server (si le site « status » est activé)
echo "Message-Authenticator = 0x00" | radclient -x 127.0.0.1:18121 status adminsecret
```

### eapol_test (EAP réel : PEAP, TTLS, TLS)

Outil fourni avec les sources de `wpa_supplicant` (paquet `eapoltest` sur certaines distributions). C'est le seul moyen fiable de tester EAP sans équipement réseau.

```ini peap-test.conf
network={
    key_mgmt=WPA-EAP
    eap=PEAP
    identity="alice"
    anonymous_identity="anonymous@corp.exemple.fr"
    password="Mot2Passe!"
    phase2="auth=MSCHAPV2"
    ca_cert="/etc/freeradius/3.0/certs/ca.pem"
}
```

```bash
eapol_test -c peap-test.conf -a 127.0.0.1 -p 1812 -s testing123
# Résultat attendu en fin de sortie : « SUCCESS »
```

Exemples pour EAP-TTLS et EAP-TLS : voir [[07-eap-peap-tls]].
