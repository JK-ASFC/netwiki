---
title: Présentation, installation et utilisation
description: Go (golang) — langage compilé de Google pour services réseau et outils d'infrastructure (Docker, Kubernetes, Terraform, Prometheus) : installation officielle (archive go.dev sur Linux, MSI Windows, PKG macOS), paquets des distributions, winget, Homebrew, versions et politique de support, variables GOPATH, GOPROXY, GOPRIVATE, modules (go mod), compilation et compilation croisée (GOOS, GOARCH, CGO_ENABLED), tests, go vet, govulncheck, binaire statique et déploiement systemd ou conteneur scratch.
tags: [go, golang, compilation, modules, binaire statique, devops]
icon: info
---

**Go** (BSD) produit des **binaires statiques** sans dépendance, faciles à déployer : c'est le langage de la plupart des outils cloud-native ([[01-docker/01-presentation-installation|Docker]], [[04-kubernetes/01-presentation-architecture|Kubernetes]], [[04-terraform/01-presentation-installation|Terraform]], [[02-prometheus/01-presentation-installation|Prometheus]]). Deux versions majeures sortent par an (février et août) ; les **deux dernières** reçoivent les correctifs de sécurité.

## Installation

```bash
# Linux — archive officielle (version courante : voir https://go.dev/dl/)
VERSION=$(curl -s 'https://go.dev/VERSION?m=text' | head -1)
curl -LO "https://go.dev/dl/${VERSION}.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf "${VERSION}.linux-amd64.tar.gz"
echo 'export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin' >> ~/.profile && . ~/.profile
go version
```

| Système | Alternative |
| --- | --- |
| Debian/Ubuntu | `sudo apt install golang-go` (version de la distribution, souvent plus ancienne) |
| RHEL/Rocky/Alma, Fedora | `sudo dnf install golang` |
| Alpine | `sudo apk add go` |
| Windows | MSI depuis go.dev ou `winget install GoLang.Go` |
| macOS | PKG depuis go.dev ou `brew install go` |
| Docker | image `golang` (construction), exécution sur `scratch` ou `distroless` |

Depuis Go 1.21, un projet peut exiger une version plus récente (`toolchain` dans `go.mod`) : Go la télécharge automatiquement.

## Modules et compilation

```bash
mkdir inventaire && cd inventaire
go mod init git.corp.exemple.fr/infra/inventaire
go get github.com/prometheus/client_golang@latest
go mod tidy
go build -o bin/inventaire ./cmd/inventaire
CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -trimpath -ldflags="-s -w" -o bin/inventaire-arm64 ./cmd/inventaire
GOOS=windows GOARCH=amd64 go build -o bin/inventaire.exe ./cmd/inventaire
go test ./... ; go vet ./...
go install golang.org/x/vuln/cmd/govulncheck@latest && govulncheck ./...
```

Dépôts privés et proxy d'entreprise :

```bash
go env -w GOPRIVATE=git.corp.exemple.fr/*
go env -w GOPROXY=https://proxy.golang.org,direct     # ou un proxy interne (Athens, Artifactory)
go env -w GOFLAGS=-mod=mod
```

## Déploiement

```dockerfile
FROM golang:1-alpine AS build
WORKDIR /src
COPY . .
RUN CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /inventaire ./cmd/inventaire

FROM gcr.io/distroless/static-debian12
COPY --from=build /inventaire /inventaire
USER nonroot
ENTRYPOINT ["/inventaire"]
```

Hors conteneur : copier le binaire dans `/usr/local/bin` et créer un service systemd. Commandes : [[90-aide-memoire|aide-mémoire]].
