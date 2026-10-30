---
title: OpenSIPS — serveur SIP et panneau de contrôle
description: OpenSIPS, serveur SIP libre issu du même projet historique que Kamailio — usages (proxy, registrar, répartition, SBC de signalisation, routage dynamique), installation sous Debian/Ubuntu, opensips-cli (base, utilisateurs, commandes MI), structure d'opensips.cfg, modules load_balancer et drouting, OpenSIPS Control Panel (interface web), comparaison avec Kamailio et dépannage.
tags: [opensips, sip, proxy, opensips-cli, control panel, load balancer]
icon: git-merge
---

**OpenSIPS** partage ses origines avec [[01-kamailio|Kamailio]] (projet SER/OpenSER, scission en 2008). Il reste un **serveur SIP** (pas de média, pas d'IPBX) orienté fonctionnalités « clés en main » pour les opérateurs : répartition de charge, routage dynamique, B2BUA intégré (*topology hiding*), gestion des appels en cours (*dialog*), et une interface web officielle : **OpenSIPS Control Panel** (OCP).

## Installation

```bash
curl https://apt.opensips.org/opensips-org.gpg -o /tmp/opensips-org.gpg
sudo mv /tmp/opensips-org.gpg /usr/share/keyrings/opensips-org.gpg
echo "deb [signed-by=/usr/share/keyrings/opensips-org.gpg] https://apt.opensips.org $(lsb_release -sc) 3.5-releases" | sudo tee /etc/apt/sources.list.d/opensips.list
echo "deb [signed-by=/usr/share/keyrings/opensips-org.gpg] https://apt.opensips.org $(lsb_release -sc) cli-nightly" | sudo tee /etc/apt/sources.list.d/opensips-cli.list
sudo apt update && sudo apt install -y opensips opensips-mysql-module opensips-cli
```

Remplacez `3.5` par la branche LTS en cours. Configuration principale : `/etc/opensips/opensips.cfg`.

## opensips-cli

```bash
# créer la base (paramètres dans ~/.opensips-cli.cfg ou /etc/opensips-cli.cfg)
opensips-cli -x database create
# abonnés
opensips-cli -x user add 1001@sip.exemple.fr Xq7vR2pL9mZt4KwBn3Hs
opensips-cli -x user delete 1001@sip.exemple.fr
# commandes de gestion (MI) sur le serveur en marche
opensips-cli -x mi ul_dump
opensips-cli -x mi lb_list
opensips-cli -x mi dr_reload
opensips-cli -x mi get_statistics all
opensips-cli -x mi dlg_list
```

`opensips-cli` sans argument ouvre une console interactive avec complétion. Vérification de syntaxe : `opensips -C -f /etc/opensips/opensips.cfg`.

## Répartition et routage

| Module | Rôle |
| --- | --- |
| `load_balancer` | Répartition selon la **capacité** de chaque destination (nombre d'appels), avec sondes |
| `dispatcher` | Répartition simple (hachage, tourniquet) |
| `drouting` | Routage dynamique par préfixes, horaires, passerelles et transporteurs (LCR) |
| `dialog` | Suivi des appels (limites par client, coupure à distance) |
| `topology_hiding` | Masquer la topologie interne (en-têtes Via, Contact) |
| `rtpengine` / `rtpproxy` | Pilotage du relais média |

```opensips
loadmodule "load_balancer.so"
modparam("load_balancer", "db_url", "mysql://opensips:MotDePasseBase@localhost/opensips")
modparam("load_balancer", "probing_interval", 30)

route {
    if (is_method("INVITE") && !has_totag()) {
        if (!lb_start(1, "pstn", "s")) {
            send_reply(503, "Service Unavailable");
            exit;
        }
    }
    route(relay);
}
```

## OpenSIPS Control Panel (interface graphique)

**OCP** est une application web PHP qui pilote OpenSIPS via sa base et l'interface MI :

| Module OCP | Usage |
| --- | --- |
| *Users* | Abonnés, alias |
| *Dispatcher*, *Load Balancer*, *Dynamic Routing* | Destinations, règles, passerelles (avec rechargement à chaud) |
| *Dialog* | Appels en cours |
| *Statistics Monitor* | Graphiques des statistiques |
| *MI Commands* | Console MI dans le navigateur |
| *SIP Trace* | Traces SIP enregistrées |

Installation : paquets PHP + Apache, archive OCP dans `/var/www/html/opensips-cp`, configuration de l'accès à la base ; à protéger (réseau d'administration, HTTPS, authentification).

## Kamailio ou OpenSIPS ?

| Critère | Kamailio | OpenSIPS |
| --- | --- | --- |
| Philosophie | Boîte à outils très modulaire, scripts puissants (KEMI : Lua, Python, JavaScript) | Fonctions de haut niveau prêtes à l'emploi (B2BUA, topology hiding, clustering) |
| Interface | Pas d'interface officielle | **OpenSIPS Control Panel** |
| Communauté | Très large, nombreux opérateurs | Large, société OpenSIPS Solutions |

Les deux conviennent ; choisissez selon les compétences de l'équipe et les fonctions requises.

## Dépannage

| Symptôme | Piste |
| --- | --- |
| OpenSIPS ne démarre pas | `opensips -C -f …` (erreur de script), journal système (`journalctl -u opensips`) |
| Abonné refusé (`401` en boucle) | Domaine de l'utilisateur (`user@domaine`) différent du domaine des requêtes |
| Destination toujours inactive | Sondes OPTIONS bloquées par le pare-feu de l'IPBX |
| Audio absent | Relais média (rtpengine) non piloté pour les clients derrière NAT |
