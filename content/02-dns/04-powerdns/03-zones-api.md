---
title: "Gestion des zones : pdnsutil, API REST, interfaces web"
description: Créer et modifier des zones avec pdnsutil (create-zone, add-record, edit-zone, rectify, serial), types de zones (Native, Primary, Secondary), métadonnées, API REST (zones, rrsets, recherche), interfaces PowerDNS-Admin, intégration Terraform et Let's Encrypt DNS-01.
tags: [powerdns, pdnsutil, api, rest, zones, terraform, powerdns-admin]
icon: file-code
---

## pdnsutil

```bash
# Créer une zone avec un NS
sudo pdnsutil create-zone exemple.fr ns1.exemple.fr
sudo pdnsutil add-record exemple.fr @ NS 86400 ns2.exemple.fr
sudo pdnsutil add-record exemple.fr ns1 A 86400 203.0.113.53
sudo pdnsutil add-record exemple.fr ns2 A 86400 198.51.100.53
sudo pdnsutil add-record exemple.fr @ A 3600 203.0.113.10
sudo pdnsutil add-record exemple.fr www CNAME 3600 exemple.fr
sudo pdnsutil add-record exemple.fr @ MX 3600 "10 mx1.exemple.fr"
sudo pdnsutil add-record exemple.fr @ TXT 3600 '"v=spf1 mx -all"'
sudo pdnsutil add-record exemple.fr _sip._tls SRV 3600 "10 60 5061 sip1.exemple.fr"

# Remplacer tous les enregistrements d'un nom/type
sudo pdnsutil replace-rrset exemple.fr @ A 300 203.0.113.10 203.0.113.11
sudo pdnsutil delete-rrset exemple.fr www CNAME

# Éditer toute la zone dans $EDITOR (format fichier de zone), avec vérification
sudo pdnsutil edit-zone exemple.fr

sudo pdnsutil list-zone exemple.fr
sudo pdnsutil check-zone exemple.fr
sudo pdnsutil rectify-zone exemple.fr          # recalcule l'ordre et les métadonnées DNSSEC (après modification SQL directe)
sudo pdnsutil increase-serial exemple.fr
sudo pdnsutil delete-zone exemple.fr
```

> [!NOTE]
> PowerDNS 5.0 introduit une syntaxe de commandes regroupées (`pdnsutil zone create`, `pdnsutil rrset add`…) ; les anciennes commandes ci-dessus restent acceptées. `pdnsutil --help` affiche la syntaxe de votre version.

### Zones inverses

```bash
sudo pdnsutil create-zone 20.0.10.in-addr.arpa ns1.exemple.fr
sudo pdnsutil add-record 20.0.10.in-addr.arpa 10 PTR 3600 web01.exemple.fr
```

### Importer une zone BIND existante

```bash
sudo pdnsutil load-zone exemple.fr /etc/bind/zones/db.exemple.fr
# ou en masse depuis named.conf
zone2sql --gmysql --named-conf=/etc/bind/named.conf.local --start-id=1 | mysql pdns
```

## Types de zones et métadonnées

| Type | Réplication |
| --- | --- |
| **Native** | Par la base de données (réplication SQL) — aucun transfert DNS |
| **Primary** | Envoie des NOTIFY et autorise les AXFR vers des secondaires |
| **Secondary** | Récupère la zone par AXFR depuis un primaire |
| **Producer** / **Consumer** | Zones catalogue (4.7+) |

```bash
sudo pdnsutil set-kind exemple.fr primary
sudo pdnsutil set-meta exemple.fr ALLOW-AXFR-FROM 10.0.20.54 198.51.100.53
sudo pdnsutil set-meta exemple.fr ALSO-NOTIFY 10.0.20.54
sudo pdnsutil set-meta exemple.fr SOA-EDIT-API DEFAULT    # incrément automatique du serial lors des modifications par l'API
sudo pdnsutil get-meta exemple.fr
```

| Métadonnée | Rôle |
| --- | --- |
| `ALLOW-AXFR-FROM` | IP/réseaux autorisés à transférer la zone |
| `ALSO-NOTIFY` | Secondaires à notifier en plus des NS |
| `SOA-EDIT-API` | Stratégie d'incrément du serial lors des modifications par l'API (`DEFAULT`, `INCREASE`, `EPOCH`) |
| `SOA-EDIT` | Serial présenté aux clients (signature) |
| `TSIG-ALLOW-AXFR` | Clé TSIG exigée pour les transferts |
| `NSEC3PARAM`, `PRESIGNED`, `PUBLISH-CDS` | DNSSEC |

## API REST

Base : `http://127.0.0.1:8081/api/v1/servers/localhost`, en-tête `X-API-Key`.

```bash
API=http://127.0.0.1:8081/api/v1/servers/localhost
KEY="X-API-Key: CleApiLongue"

# Lister les zones
curl -s -H "$KEY" $API/zones | jq '.[].name'

# Créer une zone
curl -s -H "$KEY" -X POST $API/zones -d '{
  "name": "exemple.com.", "kind": "Native", "soa_edit_api": "DEFAULT",
  "nameservers": ["ns1.exemple.fr.", "ns2.exemple.fr."]
}'

# Ajouter / remplacer un enregistrement (rrset)
curl -s -H "$KEY" -X PATCH $API/zones/exemple.com. -d '{
  "rrsets": [ {
    "name": "www.exemple.com.", "type": "A", "ttl": 300, "changetype": "REPLACE",
    "records": [ { "content": "203.0.113.20", "disabled": false } ]
  } ]
}'

# Supprimer un rrset
curl -s -H "$KEY" -X PATCH $API/zones/exemple.com. -d '{
  "rrsets": [ { "name": "test.exemple.com.", "type": "A", "changetype": "DELETE" } ]
}'

# Détail d'une zone (tous les enregistrements)
curl -s -H "$KEY" $API/zones/exemple.com. | jq '.rrsets[] | {name, type, ttl, records: [.records[].content]}'

# Recherche dans toutes les zones
curl -s -H "$KEY" "$API/search-data?q=web*&max=50" | jq .

# Exporter une zone au format fichier
curl -s -H "$KEY" $API/zones/exemple.com./export

# Vider le cache de paquets pour un nom
curl -s -H "$KEY" -X PUT "$API/cache/flush?domain=www.exemple.com."
```

> [!IMPORTANT]
> Les noms dans l'API sont **absolus** (point final obligatoire : `exemple.com.`). Une erreur fréquente est d'oublier ce point, ce qui renvoie *422 Unprocessable Entity*.

## Interfaces web

| Outil | Description |
| --- | --- |
| **PowerDNS-Admin** | Interface web (Python) complète : zones, enregistrements, utilisateurs, historique, LDAP/SAML/OIDC, modèles de zones |
| **PowerDNS-WebUI**, **Poweradmin** | Alternatives plus légères (Poweradmin travaille directement en SQL) |
| **NetBox + plugin netbox-dns** | Gestion du DNS depuis l'IPAM |

```bash
docker run -d --name pdns-admin -p 9191:80 \
  -e SECRET_KEY='cle-aleatoire' -e SQLALCHEMY_DATABASE_URI='mysql://pdnsadmin:mdp@10.0.30.5/pdnsadmin' \
  powerdnsadmin/pda-legacy:latest
# Puis dans l'interface : Paramètres → PDNS API URL http://pdns:8081, clé API, version
```

## Automatisation

### Terraform

```hcl
provider "powerdns" {
  server_url = "http://ns1.exemple.fr:8081"
  api_key    = var.pdns_api_key
}
resource "powerdns_record" "www" {
  zone    = "exemple.fr."
  name    = "www.exemple.fr."
  type    = "A"
  ttl     = 300
  records = ["203.0.113.10"]
}
```

### Let's Encrypt (défi DNS-01)

- **certbot** : plugin `certbot-dns-powerdns` ; **acme.sh** : `dns_pdns` (variables `PDNS_Url`, `PDNS_ServerId`, `PDNS_Token`) ; **cert-manager** (Kubernetes) : webhook PowerDNS.
- Créez une clé API ou un compte dédié, restreint si possible (proxy d'API filtrant les noms `_acme-challenge`).

### Ansible

Module `uri` vers l'API, ou collection communautaire `powerdns`. Exemple de tâche idempotente : `PATCH` avec `changetype: REPLACE` (rejouable sans effet de bord).
