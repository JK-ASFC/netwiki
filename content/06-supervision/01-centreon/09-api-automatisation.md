---
title: API, CLAPI et automatisation
description: Automatiser Centreon — CLAPI en ligne de commande (hôtes, services, contacts, export/import), API REST v2 (authentification, ressources, acquittements, temps d'arrêt, configuration), API v1 historique, exemples Python/PowerShell, Ansible, intégration CMDB et bonnes pratiques.
tags: [centreon, api, clapi, rest, automatisation, ansible, python, powershell]
icon: braces
---

## Panorama

| Interface | Usage | Remarques |
| --- | --- | --- |
| **CLAPI** (`centreon` en ligne de commande, sur le central) | Configuration en masse, export/import complet | Très complète, historique, locale |
| **API REST v2** (`/centreon/api/latest/…`) | Exploitation (ressources, acquittements, temps d'arrêt) et, de plus en plus, configuration | Documentation OpenAPI : `https://<central>/centreon/api/latest/` → *docs.centreon.com/api* |
| **API REST v1** (`/centreon/api/index.php?action=action&object=centreon_clapi`) | Encapsule CLAPI via HTTP | Utile pour piloter la configuration à distance |
| **Gorgone API** (`127.0.0.1:8085`) | Interne (état des collecteurs) | Diagnostic |

> [!TIP]
> Créez un **utilisateur technique** dédié à l'automatisation (*Configuration → Utilisateurs*), avec *Accès à l'API de configuration* et/ou *Accès à l'API de temps réel* cochés, et des ACL limitées à son besoin.

## CLAPI

Syntaxe : `centreon -u <login> -p '<motdepasse>' -o <OBJET> -a <ACTION> -v "<valeurs séparées par ;>"`

```bash
CL="centreon -u api-automation -p 'MotDePasse'"

# Hôtes
$CL -o HOST -a show -v "srv-"                                          # rechercher
$CL -o HOST -a ADD -v "srv-web02;Serveur web 2;10.0.20.11;OS-Linux-SNMP-custom;poller-lyon;Serveurs-Linux"
$CL -o HOST -a SETPARAM -v "srv-web02;snmp_community;Ch4ng3-M0i"
$CL -o HOST -a SETPARAM -v "srv-web02;snmp_version;2c"
$CL -o HOST -a SETMACRO -v "srv-web02;SNMPEXTRAOPTIONS;--snmp-timeout=5"
$CL -o HOST -a ADDTEMPLATE -v "srv-web02;App-Webserver-Apache-ServerStatus-custom"
$CL -o HOST -a APPLYTPL -v "srv-web02"                                  # créer les services liés aux modèles
$CL -o HOST -a SETPARENT -v "srv-web02;sw-acces-lyon-01"
$CL -o HOST -a DEL -v "srv-test"

# Services
$CL -o SERVICE -a ADD -v "srv-web02;Certificat-HTTPS;App-Protocol-X509-Validity-custom"
$CL -o SERVICE -a SETMACRO -v "srv-web02;Certificat-HTTPS;WARNING;30:"
$CL -o SERVICE -a SETPARAM -v "srv-web02;Cpu;normal_check_interval;2"

# Groupes, contacts
$CL -o HG -a ADDMEMBER -v "Serveurs-Web;srv-web02"
$CL -o CONTACT -a ADD -v "jdupont;Jean Dupont;jean.dupont@exemple.fr;MotDePasse;0;1;fr_FR.UTF-8;local"
$CL -o CG -a ADDCONTACT -v "Equipe-Systeme;jdupont"

# Lister les objets disponibles et les actions
$CL -o HOST -a show | head
$CL -o SERVICE -a show -v "srv-web02"

# Exporter la configuration vers un collecteur (générer + tester + déplacer + recharger)
$CL -a APPLYCFG -v "poller-lyon"
```

### Export / import complet

```bash
# Exporter toute la configuration (ou un objet) en commandes CLAPI
centreon -u admin -p 'MotDePasse' -e > /root/centreon-config-$(date +%F).clapi
centreon -u admin -p 'MotDePasse' -e --select='HOST;srv-web02' > srv-web02.clapi
# Réimporter (autre plateforme, restauration partielle)
centreon -u admin -p 'MotDePasse' -i /root/centreon-config-2026-01-15.clapi
```

> [!WARNING]
> Le mot de passe passé en argument apparaît dans l'historique du shell et la liste des processus : utilisez un fichier de variables protégé, ou l'API REST avec un jeton.

## API REST v2

### Authentification

```bash
URL="https://centreon.exemple.fr/centreon/api/latest"
TOKEN=$(curl -s -X POST "$URL/login" -H 'Content-Type: application/json' \
  -d '{"security":{"credentials":{"login":"api-automation","password":"MotDePasse"}}}' | jq -r '.security.token')
H="X-AUTH-TOKEN: $TOKEN"
```

Les versions récentes permettent aussi de créer des **jetons d'API** durables dans l'interface (*Administration → Jetons d'API*), à transmettre dans le même en-tête.

### Exploitation

```bash
# Ressources en état non-OK (hôtes et services)
curl -s -H "$H" "$URL/monitoring/resources?limit=50&states=%5B%22unhandled_problems%22%5D" | jq '.result[] | {type, name, parent: .parent.name, status: .status.name, output: .information}'

# Recherche par nom
curl -s -H "$H" "$URL/monitoring/resources?search=%7B%22name%22%3A%7B%22%24rg%22%3A%22srv-web%22%7D%7D" | jq '.result[].name'

# Acquitter un service
curl -s -X POST -H "$H" -H 'Content-Type: application/json' "$URL/monitoring/resources/acknowledge" -d '{
  "acknowledgement": { "comment": "Pris en charge par l équipe réseau (ticket INC0012345)", "with_services": false, "is_notify_contacts": true, "is_sticky": true, "is_persistent_comment": true },
  "resources": [ { "type": "service", "id": 1234, "parent": { "id": 56 } } ]
}'

# Temps d'arrêt de 2 h sur un hôte et ses services
curl -s -X POST -H "$H" -H 'Content-Type: application/json' "$URL/monitoring/resources/downtime" -d '{
  "downtime": { "comment": "Mise à jour firmware", "with_services": true, "is_fixed": true,
                "start_time": "2026-01-20T21:00:00+01:00", "end_time": "2026-01-20T23:00:00+01:00", "duration": 7200 },
  "resources": [ { "type": "host", "id": 56, "parent": null } ]
}'

# Forcer un contrôle
curl -s -X POST -H "$H" -H 'Content-Type: application/json' "$URL/monitoring/resources/check" -d '{
  "check": { "is_forced": true }, "resources": [ { "type": "service", "id": 1234, "parent": { "id": 56 } } ]
}'

# Se déconnecter (invalider le jeton)
curl -s -H "$H" "$URL/logout"
```

### Configuration (selon version)

```bash
curl -s -H "$H" "$URL/configuration/hosts?limit=100" | jq '.result[] | {id, name, address}'
curl -s -H "$H" "$URL/configuration/monitoring-servers" | jq '.result[] | {id, name}'
# Création d'hôte (API v2 récente) : POST $URL/configuration/hosts avec name, address, monitoring_server_id, templates[]…
# Génération + export de la configuration d'un collecteur :
curl -s -X POST -H "$H" "$URL/configuration/monitoring-servers/2/generate-and-reload"
```

> [!NOTE]
> La couverture « configuration » de l'API v2 s'étend à chaque version. Pour une opération non encore disponible, utilisez l'API v1 (CLAPI sur HTTP) ou CLAPI.

## API v1 (CLAPI sur HTTP)

```bash
V1="https://centreon.exemple.fr/centreon/api/index.php"
T=$(curl -s -X POST "$V1?action=authenticate" -d 'username=api-automation&password=MotDePasse' | jq -r .authToken)
curl -s -X POST -H "centreon-auth-token: $T" -H 'Content-Type: application/json' \
  "$V1?action=action&object=centreon_clapi" \
  -d '{"action":"add","object":"host","values":"srv-web03;Serveur web 3;10.0.20.12;OS-Linux-SNMP-custom;poller-lyon;Serveurs-Linux"}'
curl -s -X POST -H "centreon-auth-token: $T" -H 'Content-Type: application/json' \
  "$V1?action=action&object=centreon_clapi" -d '{"action":"applytpl","object":"host","values":"srv-web03"}'
curl -s -X POST -H "centreon-auth-token: $T" -H 'Content-Type: application/json' \
  "$V1?action=action&object=centreon_clapi" -d '{"action":"applycfg","values":"poller-lyon"}'
```

## Exemples de scripts

### PowerShell : temps d'arrêt avant un redémarrage planifié

```powershell
$base = "https://centreon.exemple.fr/centreon/api/latest"
$body = @{ security = @{ credentials = @{ login = "api-automation"; password = $env:CENTREON_PWD } } } | ConvertTo-Json -Depth 4
$token = (Invoke-RestMethod -Method Post -Uri "$base/login" -Body $body -ContentType "application/json").security.token
$h = @{ "X-AUTH-TOKEN" = $token }

$search = [uri]::EscapeDataString((@{ name = @{ '$eq' = $env:COMPUTERNAME.ToLower() } } | ConvertTo-Json -Compress))
$hote = (Invoke-RestMethod -Uri "$base/monitoring/resources?types=%5B%22host%22%5D&search=$search" -Headers $h).result[0]

$debut = Get-Date ; $fin = $debut.AddMinutes(30)
$dt = @{
  downtime = @{ comment = "Redémarrage planifié"; with_services = $true; is_fixed = $true; duration = 1800
                start_time = $debut.ToString("yyyy-MM-ddTHH:mm:sszzz"); end_time = $fin.ToString("yyyy-MM-ddTHH:mm:sszzz") }
  resources = @(@{ type = "host"; id = $hote.id; parent = $null })
} | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post -Uri "$base/monitoring/resources/downtime" -Headers $h -Body $dt -ContentType "application/json"
```

### Python : synchroniser depuis un inventaire (CMDB / IPAM)

```python
import csv, os, subprocess

CL = ["centreon", "-u", "api-automation", "-p", os.environ["CENTREON_PWD"]]

def clapi(obj, action, values=""):
    cmd = CL + ["-o", obj, "-a", action] + (["-v", values] if values else [])
    return subprocess.run(cmd, capture_output=True, text=True)

existants = {l.split(";")[1] for l in clapi("HOST", "show").stdout.splitlines()[1:] if l}
with open("inventaire.csv", newline="", encoding="utf-8") as f:
    for h in csv.DictReader(f, delimiter=";"):
        if h["nom"] in existants:
            continue
        clapi("HOST", "ADD", f'{h["nom"]};{h["description"]};{h["ip"]};{h["modele"]};{h["collecteur"]};{h["groupe"]}')
        clapi("HOST", "APPLYTPL", h["nom"])
        print("ajouté :", h["nom"])
subprocess.run(CL + ["-a", "APPLYCFG", "-v", "Central"])
```

## Ansible

- Module générique `ansible.builtin.uri` vers l'API v2 (idempotence à gérer par une recherche préalable).
- Collections communautaires pour CLAPI / API (vérifier leur maintenance avant usage en production).
- Déploiement des **collecteurs** et **agents** (paquets, `snmpd.conf`, clés SSH) : rôles Ansible classiques.

## Bonnes pratiques

- **Une source de vérité** (CMDB, IPAM, Git) → Centreon est alimenté automatiquement ; éviter les modifications manuelles divergentes.
- Nommage normalisé des hôtes (identique au DNS) et des services.
- Export de configuration **groupé** (une fois en fin de traitement, pas après chaque hôte).
- Sauvegarde CLAPI (`-e`) quotidienne versionnée dans Git : historique lisible des changements de configuration.
