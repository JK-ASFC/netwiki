---
title: Présentation et installation
description: SonarQube, analyse statique de la qualité et de la sécurité du code — notions (bugs, vulnérabilités, points sensibles, dette technique, couverture, quality gates et profiles), éditions (Community Build, Server Developer/Enterprise), architecture, prérequis système (Elasticsearch embarqué), installation sous Linux avec PostgreSQL, Docker, Windows et premiers réglages.
tags: [sonarqube, qualité du code, sast, installation, postgresql, quality gate]
icon: info
---

**SonarQube** analyse le code source de plus de 30 langages et signale **bugs**, **vulnérabilités**, **points sensibles de sécurité**, **mauvaises pratiques** (*code smells*), duplications et couverture de tests insuffisante. Intégré à la CI, il bloque les modifications qui ne respectent pas la **porte qualité** (*quality gate*) de l'équipe — y compris pour du code d'infrastructure (Terraform, CloudFormation, Kubernetes, Docker, Ansible selon les éditions).

## Notions

| Notion | Description |
| --- | --- |
| Problème (*issue*) | Bug, vulnérabilité, code smell, avec gravité |
| Point sensible (*security hotspot*) | Code à relire manuellement (usage sensible) |
| **Quality profile** | Ensemble de règles actives par langage |
| **Quality gate** | Conditions à remplir (ex. aucun nouveau bug, couverture du nouveau code ≥ 80 %) |
| Nouveau code | Principe *Clean as You Code* : exigences fortes sur le code modifié |

## Éditions

| Édition | Licence | Points clés |
| --- | --- | --- |
| **SonarQube Community Build** | Libre (LGPL) | Analyse de la branche principale, nombreux langages |
| SonarQube Server Developer | Commerciale | Branches et demandes de fusion (décoration), langages supplémentaires (C/C++…), sécurité avancée |
| Enterprise / Data Center | Commerciale | Portefeuilles, rapports, haute disponibilité |
| SonarQube Cloud | Service | Équivalent hébergé |

## Architecture et prérequis

| Composant | Rôle |
| --- | --- |
| Serveur web | Interface, API |
| Moteur de calcul (*Compute Engine*) | Traite les rapports d'analyse |
| Elasticsearch embarqué | Index de recherche |
| Base de données | **PostgreSQL** (recommandé), SQL Server, Oracle |
| Scanners | Exécutés dans la CI, envoient les rapports au serveur |

```bash
# Prérequis noyau (Elasticsearch)
cat <<'EOF' | sudo tee /etc/sysctl.d/99-sonarqube.conf
vm.max_map_count = 524288
fs.file-max = 131072
EOF
sudo sysctl --system
```

```ini /etc/security/limits.d/99-sonarqube.conf
sonarqube   -   nofile   131072
sonarqube   -   nproc    8192
```

Java 17 ou 21 ; 4 Go de RAM minimum (8 Go conseillés) ; le service **ne doit pas tourner en root**.

## Installation sous Linux

```bash
sudo -u postgres psql -c "CREATE ROLE sonarqube LOGIN PASSWORD 'MotDePasse';"
sudo -u postgres psql -c "CREATE DATABASE sonarqube OWNER sonarqube ENCODING 'UTF8' TEMPLATE template0;"

sudo apt install -y openjdk-17-jre unzip
sudo useradd -r -m -d /opt/sonarqube -s /bin/bash sonarqube
# Archive téléchargée depuis le site de Sonar (Community Build)
sudo unzip sonarqube-25.9.0.zip -d /opt && sudo mv /opt/sonarqube-25.9.0/* /opt/sonarqube/
sudo chown -R sonarqube: /opt/sonarqube
```

```properties /opt/sonarqube/conf/sonar.properties
sonar.jdbc.username=sonarqube
sonar.jdbc.password=MotDePasse
sonar.jdbc.url=jdbc:postgresql://localhost/sonarqube
sonar.web.host=127.0.0.1
sonar.web.port=9000
sonar.path.data=/srv/sonarqube/data
sonar.path.temp=/srv/sonarqube/temp
```

```ini /etc/systemd/system/sonarqube.service
[Unit]
Description=SonarQube
After=network.target postgresql.service

[Service]
Type=forking
User=sonarqube
ExecStart=/opt/sonarqube/bin/linux-x86-64/sonar.sh start
ExecStop=/opt/sonarqube/bin/linux-x86-64/sonar.sh stop
LimitNOFILE=131072
LimitNPROC=8192
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload && sudo systemctl enable --now sonarqube
tail -f /opt/sonarqube/logs/sonar.log
```

## Docker, Windows

```bash
docker run -d --name sonarqube -p 127.0.0.1:9000:9000 \
  -e SONAR_JDBC_URL=jdbc:postgresql://db:5432/sonarqube -e SONAR_JDBC_USERNAME=sonarqube -e SONAR_JDBC_PASSWORD=… \
  -v sonarqube_data:/opt/sonarqube/data -v sonarqube_extensions:/opt/sonarqube/extensions -v sonarqube_logs:/opt/sonarqube/logs \
  sonarqube:community
```

Sous Windows : archive ZIP, `bin\windows-x86-64\StartSonar.bat` ou installation comme service (`SonarService.bat install`). Sous macOS : Docker pour les essais.

## Premier accès

1. `http://serveur:9000` (derrière un reverse proxy HTTPS), compte **admin / admin** → changement imposé.
2. *Administration → Security* : désactiver l'accès anonyme (*Force user authentication*).
3. Créer des **jetons** pour les analyses (jetons de projet ou globaux) et configurer l'authentification ([[02-analyse-exploitation]]).

## Suite

[[02-analyse-exploitation|Analyses, intégration CI, authentification et exploitation]]
