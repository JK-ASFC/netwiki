---
title: Rex, Fabric et Invoke — aide-mémoire
description: Commandes Fabric (fab --list, -H, -i, -S, --prompt-for-login-password, -- commande), Invoke (inv --list, inv tâche, --help, -e), Rex (rex -T, -H, -G, -u, -p, -e, -d, -m), et méthodes Connection (run, sudo, put, get, cd, prefix, local) avec exemples.
tags: [aide-mémoire, fabric, invoke, rex]
icon: terminal
---

Explications : [[01-presentation-utilisation|Rex, Fabric et Invoke]].

```bash
fab --list ; fab -H srv1,srv2 espace ; fab -H srv1 -i ~/.ssh/id_admin -- 'sudo systemctl status nginx' ; fab -S ~/.ssh/config tache
inv --list ; inv construire --version 1.2 ; inv --help construire
rex -T ; rex -H "srv1 srv2" -u admin -e 'say run "uptime"' ; rex -G web chrony ; rex -d chrony
```

```python
from fabric import Connection
c = Connection("srv-web-01", user="admin")
c.run("hostname") ; c.sudo("apt-get -y upgrade", pty=True) ; c.put("conf.ini", "/tmp/") ; c.get("/var/log/app.log", "app.log")
with c.cd("/opt/app"), c.prefix("source venv/bin/activate"):
    c.run("python manage.py migrate")
```
