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
