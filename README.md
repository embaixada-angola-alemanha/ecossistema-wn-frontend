# Welwitschia Noticias -- Frontend (WN)

Portal de noticias da Embaixada de Angola na Alemanha. Aplicacao Angular 18 com tema editorial "warm ember", Server-Side Rendering (SSR) e internacionalizacao multi-idioma.

Faz parte do **Ecossistema Digital -- Embaixada de Angola na Alemanha**.

> Repositorio principal: [ecossistema-project](https://github.com/embaixada-angola-alemanha/ecossistema-project)

---

## Descricao

O **Welwitschia Noticias** e o portal publico de noticias e comunicacao da Embaixada. Permite a navegacao por artigos, categorias, tags e autores, com pesquisa integrada, arquivo cronologico e subscricao de newsletter. O conteudo e multilingue (PT/EN/DE/CS) com suporte a SEO e partilha social.

## Stack Tecnologica

| Camada        | Tecnologia                                      |
| ------------- | ----------------------------------------------- |
| Framework     | Angular 18.2 (standalone components)            |
| Linguagem     | TypeScript 5.5                                  |
| Estilos       | SCSS                                            |
| i18n          | @ngx-translate/core + @ngx-translate/http-loader |
| SSR           | @angular/ssr, @angular/platform-server          |
| Build         | @angular/build (esbuild)                        |
| Servidor      | Nginx 1.25 (producao via Docker)                |
| Container     | Docker multi-stage (Node 20 + Nginx Alpine)     |
| CI/CD         | GitHub Actions (build, test, Docker, conventional commits) |

## Estrutura do Projecto

```
src/
  app/
    core/
      models/           # Modelos de dados (Article, Category, Tag, Author, Newsletter)
      services/         # Servicos HTTP (ApiService, ArticleService, NewsletterService, SeoService, LanguageService)
    shared/
      pipes/            # Pipes partilhados (LocalizedPipe)
      components/
        header/         # Cabecalho com navegacao e selector de idioma
        footer/         # Rodape do portal
        feed-widget/    # Widget de feed de noticias
        newsletter-signup/ # Formulario de subscricao de newsletter
    pages/
      home/             # Pagina inicial com destaques e ultimas noticias
      article/          # Detalhe de artigo (article-detail)
      category/         # Listagem por categoria
      tag/              # Listagem por tag
      author/           # Pagina de autor
      archive/          # Arquivo cronologico de artigos
      search/           # Resultados de pesquisa
      not-found/        # Pagina 404
  environments/         # Configuracoes por ambiente (dev, staging, prod)
  assets/               # Ficheiros estaticos e traducoes i18n
public/                 # Favicon e assets publicos
```

## Funcionalidades

### Publicas
- **Pagina inicial** com artigos em destaque e ultimas noticias
- **Detalhe de artigo** com conteudo rich-text, metadata SEO e links de partilha
- **Navegacao por categoria** com listagem paginada
- **Navegacao por tag** com filtragem
- **Pagina de autor** com biografia e artigos publicados
- **Arquivo** cronologico de artigos
- **Pesquisa** full-text de artigos
- **Subscricao de newsletter** com formulario inline

### Internacionalizacao
- Idiomas suportados: Portugues (PT), Ingles (EN), Alemao (DE), Checo (CS)
- Idioma por defeito: Portugues
- Troca de idioma dinamica via selector no cabecalho
- Conteudo dos artigos localizado (titulo, corpo, excerto em cada idioma)

## Pre-requisitos

- **Node.js** >= 20.x
- **npm** >= 10.x
- **Angular CLI** >= 18.2 (`npm install -g @angular/cli`)

## Como Executar

### Desenvolvimento

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desenvolvimento (porta 3003)
npm start
# ou
ng serve --port 3003
```

A aplicacao estara disponivel em `http://localhost:3003`.

### Build de Producao

```bash
npm run build:prod
# ou
ng build --configuration production
```

Os artefactos sao gerados em `dist/wn-frontend/`.

### Docker

```bash
# Build da imagem
docker build -t ecossistema-wn-frontend .

# Executar container
docker run -p 3003:80 ecossistema-wn-frontend
```

## Configuracao de Ambiente

Os ficheiros de ambiente estao em `src/environments/`:

| Ficheiro                  | Ambiente    |
| ------------------------- | ----------- |
| `environment.ts`          | Desenvolvimento |
| `environment.staging.ts`  | Staging     |
| `environment.prod.ts`     | Producao    |

Variaveis de configuracao:

| Variavel         | Descricao                           | Exemplo                                  |
| ---------------- | ----------------------------------- | ---------------------------------------- |
| `production`     | Flag de modo producao               | `false`                                  |
| `apiBaseUrl`     | URL base da API publica             | `/api/v1/public`                         |
| `siteUrl`        | URL publica do site                 | `https://noticias.angola-botschaft.de`   |
| `siteName`       | Nome do site                        | `Welwitschia Noticias`                   |
| `defaultLang`    | Idioma por defeito                  | `pt`                                     |
| `supportedLangs` | Idiomas suportados                  | `['pt', 'en', 'de']`                     |

## Proxy de Desenvolvimento

O servidor de desenvolvimento utiliza um proxy configurado em `src/proxy.conf.json` para encaminhar pedidos da API para o backend WN.

## CI/CD

O pipeline GitHub Actions (`.github/workflows/ci.yml`) executa:

1. **Build & Lint** -- compilacao e verificacao de estilo
2. **Unit Tests** -- testes unitarios com ChromeHeadless
3. **Docker Build** -- construcao da imagem Docker (branches `main` e `develop`)
4. **Conventional Commits** -- validacao de mensagens de commit em PRs

## Scripts Disponiveis

| Comando          | Descricao                              |
| ---------------- | -------------------------------------- |
| `npm start`      | Servidor de desenvolvimento (porta 3003) |
| `npm run build`  | Build de desenvolvimento               |
| `npm run build:prod` | Build de producao                  |
| `npm run watch`  | Build com watch mode                   |
| `npm test`       | Executar testes unitarios              |
| `npm run lint`   | Verificacao de estilo (lint)           |

## Licenca

Projecto interno da Embaixada de Angola na Alemanha. Todos os direitos reservados.

---

> **Ecossistema Digital** | Embaixada de Angola na Alemanha
> Dominio: `embaixada-angola.site`
