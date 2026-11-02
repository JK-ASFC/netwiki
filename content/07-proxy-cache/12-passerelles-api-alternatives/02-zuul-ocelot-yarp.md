---
title: Zuul, Ocelot et YARP
description: Passerelles d'API intégrées au code — Zuul (Netflix, Java/Netty, filtres, Zuul 1 dans Spring Cloud Netflix en fin de vie et remplacement par Spring Cloud Gateway), Ocelot (bibliothèque .NET, ocelot.json, Routes, agrégation, authentification, limitation, découverte Consul) et YARP (reverse proxy .NET de Microsoft, configuration appsettings.json, Routes et Clusters, équilibrage, contrôles de santé, transformations), avec exemples et déploiement sous Windows, Linux et conteneurs.
tags: [zuul, ocelot, yarp, spring cloud gateway, dotnet, java, api gateway]
icon: info
---

Ces trois outils ne sont pas des produits « prêts à installer » mais des **bibliothèques** avec lesquelles on construit sa passerelle dans le langage de l'équipe : Java pour Zuul, **.NET** pour Ocelot et YARP. Ils s'exécutent comme toute application (service Windows, systemd, conteneur, [[01-iis/01-presentation|IIS]]).

## Zuul (Java)

- **Zuul 2** (Netflix, Apache 2.0) : passerelle asynchrone sur Netty, avec filtres *inbound*, *endpoint* et *outbound* en Java/Groovy ; utilisée chez Netflix mais peu documentée pour les autres.
- **Zuul 1** via *Spring Cloud Netflix* : **en fin de vie** ; la voie recommandée dans l'écosystème Spring est **Spring Cloud Gateway** :

```yaml
# application.yml — Spring Cloud Gateway
spring:
  cloud:
    gateway:
      routes:
        - id: commandes
          uri: http://10.0.20.10:8080
          predicates:
            - Path=/commandes/**
          filters:
            - StripPrefix=1
            - name: RequestRateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20
```

(Clé `spring.cloud.gateway.server.webflux.routes` dans les versions récentes : suivez la documentation de votre version.)

## Ocelot (.NET)

```bash
dotnet new web -n Passerelle && cd Passerelle
dotnet add package Ocelot
```

```json
{
  "Routes": [
    {
      "UpstreamPathTemplate": "/commandes/{tout}",
      "UpstreamHttpMethod": [ "Get", "Post" ],
      "DownstreamPathTemplate": "/api/v1/{tout}",
      "DownstreamScheme": "http",
      "DownstreamHostAndPorts": [ { "Host": "10.0.20.10", "Port": 8080 }, { "Host": "10.0.20.12", "Port": 8080 } ],
      "LoadBalancerOptions": { "Type": "RoundRobin" },
      "RateLimitOptions": { "EnableRateLimiting": true, "Period": "1m", "Limit": 60 }
    }
  ],
  "GlobalConfiguration": { "BaseUrl": "https://api.corp.exemple.fr" }
}
```

```csharp
// Program.cs
using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);
builder.Services.AddOcelot(builder.Configuration);
var app = builder.Build();
await app.UseOcelot();
app.Run();
```

Fonctions : agrégation de requêtes, authentification JWT, autorisation par revendications, cache, QoS (Polly), découverte de services (Consul, Eureka, Kubernetes).

## YARP (.NET, Microsoft)

```bash
dotnet new web -n ProxyYarp && cd ProxyYarp
dotnet add package Yarp.ReverseProxy
```

```json
{
  "ReverseProxy": {
    "Routes": {
      "route-commandes": { "ClusterId": "commandes", "Match": { "Path": "/commandes/{**reste}" }, "Transforms": [ { "PathRemovePrefix": "/commandes" } ] }
    },
    "Clusters": {
      "commandes": {
        "LoadBalancingPolicy": "LeastRequests",
        "HealthCheck": { "Active": { "Enabled": true, "Interval": "00:00:10", "Path": "/sante" } },
        "Destinations": {
          "srv1": { "Address": "http://10.0.20.10:8080/" },
          "srv2": { "Address": "http://10.0.20.12:8080/" }
        }
      }
    }
  }
}
```

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
var app = builder.Build();
app.MapReverseProxy();
app.Run();
```

YARP est très performant (Kestrel), configurable à chaud, et s'intègre à l'authentification ASP.NET Core ; il sert notamment aux migrations progressives d'applications (*strangler fig*).

```bash
dotnet run                                     # développement
dotnet publish -c Release -o /opt/proxy-yarp   # puis service systemd ou Windows (sc.exe create)
```

Commandes : [[90-aide-memoire|aide-mémoire]].
