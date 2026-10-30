---
title: 3CX — aide-mémoire
description: Commandes et vérifications 3CX avec exemples — services Linux et Windows, ports à contrôler, outil de configuration web, sauvegarde et restauration, journaux, capture, tests réseau depuis le serveur, menus de la console à connaître.
tags: [aide-mémoire, 3cx, ipbx, services, ports, sauvegarde]
icon: terminal
---

Référence rapide ; les explications sont dans [[01-installation-configuration|3CX]] et [[02-exploitation-securite|exploitation et sécurité]].

## Services et ports

```bash
systemctl list-units '3CX*' --no-pager
sudo ss -lntup | grep -E ':(5001|5060|5061|5090|443)\s'
sudo ss -lnup | awk '$5 ~ /:9[0-9]{3}$|:10[0-9]{3}$/' | head      # plage RTP 9000-10999
sudo journalctl -u nginx --since "1 hour ago"
df -h /var/lib/3cxpbx                                               # espace (enregistrements, sauvegardes)
```

```powershell
Get-Service *3CX* | Format-Table Name, Status
Get-NetUDPEndpoint -LocalPort 5060
```

## Vérifications réseau depuis le serveur

```bash
dig +short sip.operateur.example
curl -sI https://pbx.exemple.fr:5001 | head -3
sudo tcpdump -ni any port 5060 -c 50
```

## Console : menus à connaître

| Menu | Usage |
| --- | --- |
| *Dashboard → Services* | Redémarrer un service proprement |
| *Dashboard → Firewall Checker* | Contrôle des redirections de ports |
| *Backups* | Sauvegarde planifiée, restauration, migration |
| *Event Log* / *Activity Log* | Erreurs, détail d'un appel |
| *Troubleshooting → Capture* | Capture pcap intégrée |
| *Security* | Anti-piratage, liste noire, pays autorisés, restrictions internationales |
| *Updates* | Mises à jour de 3CX et des micrologiciels de postes |
