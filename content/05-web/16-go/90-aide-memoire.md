---
title: Go — aide-mémoire des commandes
description: Commandes Go avec exemples — version, env, mod init/tidy/download/why/graph/vendor, get, install, build (-o, -trimpath, -ldflags, -race), run, test (-v, -run, -cover, -race, -bench), vet, fmt, doc, tool pprof, work, clean -modcache, GOOS/GOARCH, govulncheck, staticcheck.
tags: [aide-mémoire, go, golang]
icon: terminal
---

Explications : [[01-presentation-installation|Go]].

```bash
go version ; go env GOPATH GOPROXY GOOS GOARCH
go mod init exemple.fr/outil ; go mod tidy ; go mod download ; go mod why -m golang.org/x/net ; go mod graph | head
go get example.com/pkg@v1.4.2 ; go get -u ./... ; go get example.com/pkg@none
go install github.com/go-delve/delve/cmd/dlv@latest
go build ./... ; go build -race -o app . ; go run . --config conf.yaml
go test ./... -v -run TestInventaire -cover ; go test -bench . -benchmem ./...
go vet ./... ; gofmt -l -w . ; go doc net/http.Client
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30
go work init ./api ./outils
go clean -modcache
go tool dist list | grep linux              # cibles de compilation croisée
govulncheck ./...
```

## Installation

```bash
# Archive officielle (Linux), version voulue
curl -LO https://go.dev/dl/go1.23.4.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.23.4.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin' >> ~/.profile
sudo apt install golang                              # version de la distribution (souvent plus ancienne)
brew install go                                      # macOS
winget install GoLang.Go                             # Windows
```

## Compilation pour la production

```bash
# Binaire statique, sans informations de débogage, version injectée
CGO_ENABLED=0 go build -trimpath -ldflags "-s -w -X main.version=1.4.2" -o collecteur .
# Compilation croisée
GOOS=windows GOARCH=amd64 go build -o collecteur.exe .
GOOS=linux GOARCH=arm64 go build -o collecteur-arm64 .
go version -m ./collecteur                           # modules et options embarqués dans un binaire
go install golang.org/x/vuln/cmd/govulncheck@latest
```

## Modules privés et mandataire

```bash
go env -w GOPRIVATE=gitlab.corp.exemple.fr
go env -w GOPROXY=https://proxy.golang.org,direct
git config --global url."git@gitlab.corp.exemple.fr:".insteadOf "https://gitlab.corp.exemple.fr/"
go env -u GOPROXY                                    # revenir à la valeur par défaut
```
