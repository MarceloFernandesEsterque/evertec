# 🗺️ Sistema de Gerenciamento de Pontos Turísticos

Este projeto consiste em um sistema completo de cadastro, listagem, busca e detalhamento de pontos turísticos. O projeto foi desenvolvido como parte do teste prático para o processo seletivo da **Evertec**, focado no perfil **Pleno**.

A solução adota uma abordagem **desacoplada (Em Camadas)**, separando completamente as responsabilidades do servidor de dados (Backend API) e da interface com o usuário (Frontend Web).

---

## 🏗️ Arquitetura e Tecnologias Utilizadas

### Backend (`/backend`)
* **Framework:** .NET 8.0 (ASP.NET Core Web API)
* **Linguagem:** C#
* **Banco de Dados:** SQLite (com Entity Framework Core)
* **Padrões de Projeto:** Repository Pattern, Injeção de Dependência (DI) e Fluent API para mapeamento relacional.
* **Documentação:** Swagger UI para testes integrados de endpoints.

### Frontend (`/frontend`)
* **Linguagem:** HTML5, CSS3 e JavaScript Vanilla (ES6+)
* **Consumo de API:** Native Fetch API (Assíncrono com Async/Await)
* **Integrações Externas:** API Pública de Localidades do IBGE (consumo dinâmico de estados e municípios).

---

## 📂 Estrutura do Repositório

```text
[Raiz do Projeto]
├── README.md                  # Documentação principal do projeto
├── .gitignore                 # Filtros de versionamento Git
│
├── 📂 backend/                # Camada do Servidor C# (.NET 8)
│   ├── PontoTuristico.sln     # Arquivo de Solução do Visual Studio
│   ├── 📂 PontoTuristico.API/ # Camada de Apresentação da API (Controllers, Program.cs)
│   ├── 📂 PontoTuristico.Domain/ # Regras de Negócio e Interfaces de Contrato
│   └── 📂 PontoTuristico.Data/   # Acesso a Dados, Repositórios e Contexto do EF Core
│
└── 📂 frontend/               # Camada de Interface Gráfica (HTML/CSS/JS)
    ├── index.html             # Tela Inicial (Listagem, busca e paginação)
    ├── cadastro.html          # Formulário de Cadastro (Combos dinâmicos do IBGE)
    ├── detalhes.html          # Painel de Visualização Detalhada
    ├── 📂 css/                # Folha de Estilos Customizada (styles.css)
    └── 📂 js/                 # Scripts de Comportamento e Fetch (listagem, cadastro, detalhes)
```

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar as duas camadas simultaneamente na sua máquina.

### 1. Configurando e Rodando o Backend (API C#)

1. Certifique-se de ter o **SDK do .NET 8** instalado na sua máquina.
2. Abra a solução localizada em `backend/PontoTuristico.sln` utilizando o **Visual Studio**.
3. No arquivo `appsettings.json` do projeto principal, altere ou confirme o caminho desejado para a geração automática do arquivo de banco de dados SQLite (`DefaultConnection`).
4. Defina o projeto `PontoTuristico.API.Server` como projeto de inicialização.
5. Pressione **F5** ou clique no botão **Iniciar (Play)**.
6. O servidor iniciará e abrirá automaticamente a documentação interativa do **Swagger** no endereço padrão:
   `https://localhost:7271/swagger` (Mantenha esta janela aberta para que o frontend funcione).

*Nota: O banco de dados SQLite e suas respectivas tabelas estruturais serão gerados automaticamente na primeira inicialização da API através do mecanismo `EnsureCreated()` configurado no pipeline.*

### 2. Configurando e Rodando o Frontend (HTML/CSS)

Por questões de segurança dos navegadores modernos (restrição de chamadas HTTP originadas de protocolos `file://`), os arquivos HTML não devem ser abertos diretamente com dois cliques do mouse. Eles precisam ser servidos por um servidor local HTTP.

#### Opção Recomendada (Visual Studio Code):
1. Abra a pasta `frontend/` utilizando o **VS Code**.
2. Instale a extensão **Live Server** (desenvolvida por Ritwick Dey).
3. Abra o arquivo `index.html`.
4. Clique no botão **"Go Live"** localizado na barra inferior direita do VS Code.
5. O sistema abrirá no navegador no endereço `http://127.0.0.1:5500`, que já possui liberação de **CORS** concedida no `Program.cs` do backend.

---

## 🧪 Casos de Teste Implementados (Critérios de Aceite)

Ao navegar pelo sistema, valide o cumprimento dos seguintes requisitos solicitados no teste prático:

* **Ordenação Decrescente:** Pontos cadastrados recentemente aparecem sempre no topo da listagem inicial.
* **Exibição Seletiva:** A tela `index.html` exibe estritamente o **Nome** e a **Localização** dos pontos turísticos cadastrados.
* **Busca Unificada:** A barra de pesquisa filtra os resultados do banco de dados analisando simultaneamente correspondências nos campos *Nome*, *Descrição* ou *Localização*.
* **Paginação:** A listagem exibe o limite estrito de **5 registros por página**, habilitando botões dinâmicos de Avançar e Voltar.
* **Validação de Tamanho:** O campo Descrição possui limitação física de no máximo **100 caracteres** no formulário e no backend.
* **Dropdowns Dinâmicos:** Ao selecionar o Estado, a aplicação realiza um fetch assíncrono na API do IBGE e preenche automaticamente apenas as Cidades pertencentes àquela UF.
* **Tela de Detalhes:** Ao clicar em "Ver Detalhes", os campos *Nome*, *Descrição* e *Localização* completos são carregados através de uma busca por ID.
